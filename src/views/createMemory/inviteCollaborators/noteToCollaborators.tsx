import React from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  SafeAreaView,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
// @ts-ignore
import {connect} from 'react-redux';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import {Colors, fontSize} from '../../../common/constants';
import EventManager from '../../../common/eventManager';
import {
  InviteCollaborators,
  kCollaboratorsAdded,
} from '../createMemoryWebService';
import {SaveCollaboratorNotes} from '../reducer';
import {CollaboratorsAPI} from '../saga';
// @ts-ignore
import NavigationHeaderSafeArea from '../../../common/component/profileEditHeader/navigationHeaderSafeArea';
import Utility from '../../../common/utility';
import {getCommaSeparatedArray} from '../dataHelper';
import Styles from './styles';

type State = {[x: string]: any};
type Props = {
  tid?: any;
  isRename: any;
  collectionName?: any;
  [x: string]: any;
  callback?: any;
};
export const kSaveInvite = 'saveInvite';
export const kSaveNotes = 'saveNotes';
class NotesToCollaborators extends React.Component<Props, State> {
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;
  inviteCollaborator: EventManager;
  friendList: any = [];
  friendCircleList: any = [];
  nid: any = '';
  state: State = {
    supportView: 0,
    content: '',
  };

  constructor(props: Props) {
    super(props);
    if (Platform.OS == 'android') {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._keyboardDidHide,
      );
    } else {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardWillShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardWillHide',
        this._keyboardDidHide,
      );
    }
    this.inviteCollaborator = EventManager.addListener(
      kCollaboratorsAdded,
      this.collaboratorCallBack,
    );
  }

  componentWillUnmount() {
    this.inviteCollaborator.removeListener();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  UNSAFE_componentWillMount = () => {
    this.friendList = this.props.friendsList;
    this.friendCircleList = this.props.friendsCircleList;
    this.nid = this.props.nid;
  };

  componentDidMount = () => {
    this.setState({
      content: this.props.notesToCollaborators,
    });
  };

  collaboratorCallBack = (success: boolean, nid: any) => {
    loaderHandler.hideLoader();
    this.props.fetchCollaborators(this.props.nid);
    Keyboard.dismiss();
    this.props.navigation.popTo('createMemory');
  };

  _keyboardDidShow = (e: any) => {
    this.setState({
      supportView: e.endCoordinates.height,
    });
  };

  _keyboardDidHide = (e: any) => {
    this.setState({
      supportView: 0,
    });
  };

  cancelAction = () => {
    if (this.state.content == this.props.notesToCollaborators) {
      Keyboard.dismiss();
      this.props.navigation.goBack();
    } else {
      Alert.alert('Save changes?', `Do you want to save your changes?`, [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => {
            Keyboard.dismiss();
            this.props.navigation.goBack();
          },
        },
        {
          text: 'Yes',
          style: 'default',
          onPress: () => {
            this.inviteCollaborate();
          },
        },
      ]);
    }
  };

  inviteCollaborate = () => {
    loaderHandler.showLoader();
    this.props.SaveCollaboratorsNote(this.state.content);
    InviteCollaborators(
      this.props.nid,
      getCommaSeparatedArray('uid', this.props.friendsList),
      getCommaSeparatedArray('id', this.props.friendsCircleList),
      this.state.content,
    );
  };

  render() {
    return (
      <View style={Styles.container}>
        <SafeAreaView style={Styles.invisibleContainer} />
        <SafeAreaView style={Styles.safeAreaContainer}>
          <View style={Styles.container}>
            <NavigationHeaderSafeArea
              heading={'Notes to Collaborators'}
              showCommunity={true}
              cancelAction={() => this.cancelAction()}
              showRightText={this.props.isOwner}
              rightText={this.props.type === kSaveNotes ? 'Save' : 'Invite'}
              saveValues={this.inviteCollaborate.bind(this)}
            />
            <StatusBar
              barStyle={
                Utility.currentTheme == 'light'
                  ? 'dark-content'
                  : 'light-content'
              }
              backgroundColor={Colors.ThemeColor}
            />
            <View style={Styles.textInputContainer}>
              <TextInput
                style={Styles.TextInputStyle}
                autoFocus={this.props.isOwner}
                multiline={true}
                editable={this.props.isOwner}
                value={this.state.content}
                onChangeText={text => {
                  this.setState({content: text});
                }}
                placeholder={
                  this.props.isOwner
                    ? 'Write a note to your collaborators to give them ideas on how they can contribute. You can ask them specific questions, see if they have any photos, or just ask them to record their own perspectives.'
                    : 'This memory draft do not have any notes'
                }></TextInput>
              <View
                style={{width: '100%', height: this.state.supportView}}></View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const mapState = (state: {[x: string]: any}) => {
  return {
    notesToCollaborators: state.MemoryInitials.notesToCollaborators,
    nid: state.MemoryInitials.nid,
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    SaveCollaboratorsNote: (payload: any) =>
      dispatch({type: SaveCollaboratorNotes, payload: payload}),
    fetchCollaborators: (payload: any) =>
      dispatch({type: CollaboratorsAPI, payload: payload}),
  };
};

export default connect(mapState, mapDispatch)(NotesToCollaborators);
