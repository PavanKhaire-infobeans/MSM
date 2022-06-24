import {
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableHighlight,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import React from 'react';
import {Actions} from 'react-native-router-flux';
// @ts-ignore
import {KeyboardAwareScrollView} from '../../common/component/keyboardaware-scrollview';
import {
  Colors,
  fontSize,
  decode_utf8,
  getValue,
  ShareOptions,
} from '../../../common/constants';
import NavigationThemeBar from '../../../common/component/navigationBarForEdit/navigationBarWithTheme';
import {
  add_icon,
  visibility_theme,
  move_arrow,
  radio_active,
  radio,
  team_icon,
} from '../../../images';
import {connect} from 'react-redux';
import {
  LocationAPI,
  MemoryTagsAPI,
  CollectinAPI,
  CollaboratorsAPI,
} from '../saga';
import {
  ResetLocation,
  MemoryInitialsUpdate,
  SaveCollection,
  SaveShareOption,
  SaveCollaborators,
  SaveCollaboratorNotes,
} from '../reducer';
import {
  GetCollectionDetails,
  kCollectionMemories,
  UpdateMemoryCollection,
  kCollectionUpdated,
  kCollaboratorsAdded,
  InviteCollaborators,
} from '../createMemoryWebService';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import EventManager from '../../../common/eventManager';
// @ts-ignore
import DraggableFlatList from 'react-native-draggable-flatlist';
import {ToastMessage} from '../../../common/component/Toast';
import {kCollaborators} from '../publish';
import {getCommaSeparatedArray} from '../dataHelper';
import NavigationHeaderSafeArea from '../../../common/component/profileEditHeader/navigationHeaderSafeArea';
import Utility from '../../../common/utility';

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

  componentWillMount = () => {
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
    Actions.popTo('createMemory');
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
      Actions.pop();
    } else {
      Alert.alert('Save changes?', `Do you want to save your changes?`, [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => {
            Keyboard.dismiss();
            Actions.pop();
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
      <View style={{flex: 1}}>
        <SafeAreaView
          style={{
            width: '100%',
            flex: 0,
            backgroundColor: Colors.NewThemeColor,
          }}
        />
        <SafeAreaView style={{width: '100%', flex: 1, backgroundColor: '#fff'}}>
          <View style={{flex: 1}}>
            <NavigationHeaderSafeArea
              heading={'Notes to Collaborators'}
              showCommunity={true}
              cancelAction={() => this.cancelAction()}
              showRightText={this.props.isOwner}
              rightText={this.props.type === kSaveNotes ? 'Save' : 'Invite'}
              saveValues={this.inviteCollaborate.bind(this)}
            />
            <StatusBar
              barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
              backgroundColor={Colors.ThemeColor}
            />
            <View
              style={{
                flex: 1,
                paddingRight: 15,
                paddingLeft: 15,
                paddingTop: 15,
                paddingBottom: 0,
              }}>
              <TextInput
                style={{
                  flex: 1,
                  textAlignVertical: 'top',
                  fontFamily: 'Rubik',
                  ...fontSize(16),
                  paddingBottom: 0,
                  marginBottom: 0,
                }}
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
