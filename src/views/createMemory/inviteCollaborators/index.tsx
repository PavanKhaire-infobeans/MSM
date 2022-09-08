import React from 'react';
import {
  FlatList, Image, Keyboard, Platform, SafeAreaView, ScrollView, StatusBar, Text, TouchableHighlight, TouchableOpacity, View
} from 'react-native';
// @ts-ignore
import DefaultPreference from 'react-native-default-preference';
import { connect } from 'react-redux';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import GroupPicHolder from '../../../common/component/group_pic_holder/group_pic_holder';
import PlaceholderImageView from '../../../common/component/placeHolderImageView';
import NavigationHeaderSafeArea from '../../../common/component/profileEditHeader/navigationHeaderSafeArea';
import {
  No_Internet_Warning, ToastMessage
} from '../../../common/component/Toast';
import {
  Colors, fontFamily, fontSize
} from '../../../common/constants';
import EventManager from '../../../common/eventManager';
import { Account } from '../../../common/loginStore';
import Utility from '../../../common/utility';
import {
  checkbox, checkbox_active, team_icon
} from '../../../images';
import { kReloadDraft } from '../../myMemories/MemoryDrafts';
import {
  CollaboratorActionAPI,
  kCollaboratorsActions
} from '../createMemoryWebService';
import { kCollaborators } from '../publish';
import {
  SaveCollaborators
} from '../reducer';
import {
  CollaboratorsAPI
} from '../saga';
import { kSaveNotes } from './noteToCollaborators';
import Styles from './styles';

type State = {[x: string]: any};
type Props = {
  tid?: any;
  isRename: any;
  collectionName?: any;
  [x: string]: any;
  callback?: any;
};

export enum CollaboratorsAction {
  remove = 'remove',
  reinvite = 'reinvite',
  sendReminder = 'send_reminder',
  leaveConversation = 'leave_collaboration',
  joinCollaboration = 'join',
}

class InviteCollaborators extends React.Component<Props, State> {
  actionsCallBack: EventManager;

  state: State = {
    checked: false,
    owner: {},
    showLeave: false,
    showMenu: false,
  };

  constructor(props: Props) {
    super(props);
    this.actionsCallBack = EventManager.addListener(
      kCollaboratorsActions,
      this.actionsResponse.bind(this),
    );
  }

  componentWillMount = () => {
    this.setState({
      owner: this.props.owner,
      showLeave: this.props.showLeaveConversation,
    });
  };

  actionsResponse(success: any, isLeaveConversation: any) {
    if (success) {
      if (isLeaveConversation) {
        EventManager.callBack(kReloadDraft);
        this.props.navigation.jump('memoriesDrafts');
      } else this.props.getCollaborators(this.props.nid);
    } else {
      loaderHandler.hideLoader();
      ToastMessage('Cannot perform the action now');
    }
  }

  componentWillUnmount = () => {
    this.actionsCallBack.removeListener();
  };

  cancelAction = () => {
    Keyboard.dismiss();
    this.props.navigation.goBack();
  };

  inviteFriendsToCollaborate = () => {
    let keyForPreference =
      Account.selectedData().instanceURL +
      Account.selectedData().userID +
      '-doNotShowAgain';
    if (this.state.checked) {
      DefaultPreference.set(`${keyForPreference}`, 'true').then(function () {});
    } else {
      DefaultPreference.set(`${keyForPreference}`, 'false').then(
        function () {},
      );
    }
    this.props.navigation.navigate('commonFriendsSearchView', {
      title: 'Invite Collaborators',
      refListFriends: [],
      refListFriendCircles: [],
      tag: kCollaborators,
    });
  };

  UNSAFE_componentWillReceiveProps = () => {
    loaderHandler.hideLoader();
  };

  getTextForActions = (item: any) => {
    // join status = 0 -> Not Joined, 1 -> Joined
    // action status = 2 -> Removed, 3 -> Unjoined, 4 -> Rejoined
    // show reminder for not joined and where remonded is 0
    let action_date = item.last_action_date ? item.last_action_date : 0;
    action_date = Utility.dateObjectToDefaultFormat(
      new Date(parseInt(action_date) * 1000),
    );
    action_date = Utility.dateAccordingToFormat('' + action_date, 'M D');
    if (item.action_status > 1) {
      switch (item.action_status) {
        case '2':
          action_date = 'Removed ' + action_date;
          break;
        case '3':
          action_date = 'Unjoined ' + action_date;
          break;
        case '4':
          action_date = 'Rejoined ' + action_date;
          break;
        case '7':
          action_date = 'Reinvited ' + action_date;
          break;
      }
    } else {
      switch (item.join_status) {
        case '0':
          action_date = 'Not Joined';
          break;
        case '1':
          action_date = 'Joined ' + action_date;
          break;
      }
    }
    return action_date;
  };

  renderItem = (item: any) => {
    let renderOwner = false;
    let owner = this.state.owner;
    if (item.index == 0 && this.state.showLeave) {
      owner.type = 0;
      renderOwner = true;
    }
    item = item.item;
    return (
      <View>
        {renderOwner && this.renderCollaboratorItems(owner, true)}
        {this.renderCollaboratorItems(item, false)}
      </View>
    );
  };

  renderCollaboratorItems = (item: any, isOwner: boolean) => {
    if (item.uid == Account.selectedData().userID) {
      return <View></View>;
    }
    return (
      <View style={Styles.collabratorListItemStyle}>
        {item.type == 0 ? (
          <View style={Styles.collabratorListItemtype0Style}>
            <View style={Styles.collabratorListItemtype0ImageContainerStyle}>
              <PlaceholderImageView
                uri={Utility.getFileURLFromPublicURL(item.uri)}
                style={Styles.collabratorListItemtype0ImageContainerStyle}
                profilePic={true}
              />
            </View>
            <View style={Styles.collaratorNameContainer}>
              <Text style={Styles.collaratorNameStyle}>
                {item.field_first_name_value} {item.field_last_name_value}
              </Text>
              <Text style={Styles.collaratorNameTextStyle}>
                {isOwner ? 'Owner' : this.getTextForActions(item)}
              </Text>
              {!this.state.showLeave && this.getMemoryActions(item)}
            </View>
          </View>
        ) : item.id && item.name && item.name.length > 0 ? (
          <View style={Styles.collabratorListItemtype0Style}>
            <GroupPicHolder items={item.users ? item.users : []} />
            <View style={Styles.collaratorNameContainer}>
              <Text style={Styles.collaratorNameStyle}>{item.name}</Text>
              {!this.state.showLeave && this.getMemoryActions(item)}
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  memoryAction = (action: any, item: any) => {
    if (Utility.isInternetConnected) {
      loaderHandler.showLoader();
      CollaboratorActionAPI({
        nid: this.props.nid,
        id: item.type == 0 ? item.uid : item.id,
        action_type: action,
        type: item.type == 1 ? 'group' : '',
      });
    } else {
      No_Internet_Warning();
    }
  };

  getMemoryActions = (item: any) => {
    // join status = 0 -> Not Joined, 1 -> Joined
    // action status = 2 -> Removed, 3 -> Unjoined, 4 -> Rejoined
    // show reminder for not joined and where remonded is 0
    let showRemove =
      item.type == 1 ||
      (item.action_status > 1 ? item.action_status == 4 : true);

    let showReminder =
      item.type == 0 &&
      item.action_status < 1 &&
      item.join_status == 0 &&
      item.reminded == 0;

    return (
      <View style={Styles.getMemoryActionsContainer}>
        {
          <TouchableHighlight
            underlayColor={'#ffffff11'}
            onPress={() =>
              showRemove
                ? this.memoryAction(CollaboratorsAction.remove, item)
                : this.memoryAction(CollaboratorsAction.reinvite, item)
            }>
            <Text
              style={[Styles.getMemoryActionsName,{
                textDecorationColor: showRemove ? Colors.ErrorColor : Colors.NewTitleColor,
                color: showRemove ? Colors.ErrorColor : Colors.NewTitleColor,
              }]}>
              {showRemove ? 'Remove' : 'Reinvite'}
            </Text>
          </TouchableHighlight>
        }
        {showReminder && (
          <TouchableHighlight
            underlayColor={'#ffffff11'}
            onPress={() =>
              this.memoryAction(CollaboratorsAction.sendReminder, item)
            }>
            <Text style={Styles.sendReminderText}>Send Reminder</Text>
          </TouchableHighlight>
        )}
      </View>
    );
  };

  leaveConversation = () => {
    if (Utility.isInternetConnected) {
      loaderHandler.showLoader();
      CollaboratorActionAPI({
        nid: this.props.nid,
        id: Account.selectedData().userID,
        action_type: CollaboratorsAction.leaveConversation,
      });
    } else {
      No_Internet_Warning();
    }
  };
  render() {
    return (
      <View style={Styles.container}>
        <SafeAreaView
          style={Styles.invisibleContainer}
        />
        <SafeAreaView
          style={Styles.safeAreaContainer}>
          <View style={Styles.container} onStartShouldSetResponder={() => false}>
            <NavigationHeaderSafeArea
              heading={'Collaboration'}
              showCommunity={true}
              cancelAction={() => this.cancelAction()}
              showRightText={false}
              rightIcon={this.state.showLeave}
              showHideMenu={() =>
                this.setState({showMenu: !this.state.showMenu})
              }
            />
            <StatusBar
              barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            {this.props.collaborators.length > 0 ? (
              <View style={Styles.container}>
                <View
                  style={[Styles.collabratorContainer,{
                      justifyContent: this.state.showLeave ? 'center': 'space-between',
                  }]}>
                  {!this.state.showLeave && (
                    <TouchableHighlight
                      underlayColor={'#ffffff11'}
                      onPress={() => this.inviteFriendsToCollaborate()}>
                      <Text style={Styles.NewCollectionTextColor}>
                        Invite More
                      </Text>
                    </TouchableHighlight>
                  )}
                  <TouchableHighlight
                    underlayColor={'#ffffff11'}
                    onPress={() =>
                      this.props.navigation.navigate('notesToCollaborators', {
                        friendsList: [],
                        friendsCircleList: [],
                        type: kSaveNotes,
                        isOwner: !this.state.showLeave,
                      })
                    }>
                    <Text style={Styles.NewCollectionTextColor}>
                      {this.state.showLeave ? 'View ' : ''}
                      {'Note to collaborators'}
                    </Text>
                  </TouchableHighlight>
                </View>
                <FlatList
                  extraData={this.state}
                  style={Styles.flatListStyle}
                  data={this.props.collaborators}
                  onScroll={() => {
                    Keyboard.dismiss();
                  }}
                  keyExtractor={(_, index: number) => `${index}`}
                  keyboardShouldPersistTaps={'handled'}
                  showsHorizontalScrollIndicator={false}
                  renderItem={(item: any) => this.renderItem(item)}></FlatList>
                {this.state.showMenu && (
                  <View
                    style={Styles.menuContainer}
                    onStartShouldSetResponder={() => true}
                    onResponderStart={() => this.setState({showMenu: false})}>
                    <View style={Styles.menuSubContainer}>
                      <TouchableOpacity
                        style={Styles.leaveConverSationButtonStyle}
                        onPress={() => this.leaveConversation()}>
                        <Text style={Styles.errorMessageTextStyle}>
                          Leave Conversation
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <ScrollView>
                <View style={Styles.collabrationContainer}>
                  <Image source={team_icon} style={Styles.visiblityImageContainer} />
                  <Text
                    style={Styles.collabrateWithTextStyle}>
                    {
                      "Collaborate with your friends and family to fill in any gaps, add more details, and include everyone's perspectives to record the full story. \n\nChat with each other, edit together in real-time, and collectively contribute photos to piece together your shared memory!"
                    }
                  </Text>
                  <TouchableHighlight
                    underlayColor={'#00000033'}
                    style={Styles.InviteCollabrateButtonStyle}
                    onPress={() => this.inviteFriendsToCollaborate()}>
                    <Text style={Styles.InviteCollabrateTextStyle}>
                      Invite friends to collaborate
                    </Text>
                  </TouchableHighlight>
                  <TouchableOpacity
                    style={Styles.dontShowbuttonContainer}
                    onPress={() =>
                      this.setState({checked: !this.state.checked})
                    }>
                    <Image
                      source={this.state.checked ? checkbox_active : checkbox}
                      resizeMode="contain"
                    />
                    <Text style={Styles.dontShowTextStyle}>
                      Don't show me this again
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const mapState = (state: {[x: string]: any}) => {
  return {
    collaborators: state.MemoryInitials.collaborators,
    nid: state.MemoryInitials.nid,
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    saveCollaborators: (payload: any) =>
      dispatch({type: SaveCollaborators, payload: payload}),
    getCollaborators: (payload: any) =>
      dispatch({type: CollaboratorsAPI, payload: payload}),
  };
};

export default connect(mapState, mapDispatch)(InviteCollaborators);
