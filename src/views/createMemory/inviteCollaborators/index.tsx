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
  NO_INTERNET,
  fontFamily,
} from '../../../common/constants';
import NavigationThemeBar from '../../../common/component/navigationBarForEdit/navigationBarWithTheme';
import {
  add_icon,
  visibility_theme,
  move_arrow,
  radio_active,
  radio,
  team_icon,
  checkbox_active,
  checkbox,
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
} from '../reducer';
import {
  GetCollectionDetails,
  kCollectionMemories,
  UpdateMemoryCollection,
  kCollectionUpdated,
  CollaboratorActionAPI,
  kCollaboratorsActions,
} from '../createMemoryWebService';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import EventManager from '../../../common/eventManager';
// @ts-ignore
import DraggableFlatList from 'react-native-draggable-flatlist';
import {
  ToastMessage,
  No_Internet_Warning,
} from '../../../common/component/Toast';
import {kCollaborators} from '../publish';
import Utility from '../../../common/utility';
import {kSaveNotes} from './noteToCollaborators';
import PlaceholderImageView from '../../../common/component/placeHolderImageView';
import GroupPicHolder from '../../../common/component/group_pic_holder/group_pic_holder';
// @ts-ignore
import DefaultPreference from 'react-native-default-preference';
import {Account} from '../../../common/loginStore';
import {kReloadDraft} from '../../myMemories/MemoryDrafts';
import NavigationHeaderSafeArea from '../../../common/component/profileEditHeader/navigationHeaderSafeArea';

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
        Actions.jump('memoriesDrafts');
      } else this.props.getCollaborators(this.props.nid);
    } else {
      loaderHandler.hideLoader();
      ToastMessage('Cannot perform the action now');
    }
  }

  componentWillUnmount = () => {};

  cancelAction = () => {
    Keyboard.dismiss();
    Actions.pop();
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
    Actions.push('commonFriendsSearchView', {
      title: 'Invite Collaborators',
      refListFriends: [],
      refListFriendCircles: [],
      tag: kCollaborators,
    });
  };

  componentWillReceiveProps = () => {
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
      <View
        style={{
          paddingTop: 5,
          width: '100%',
          marginTop: 5,
          backgroundColor: '#fff',
          borderBottomColor: 'rgba(0,0,0,0.2)',
          borderBottomWidth: 1,
          flexDirection: 'row',
        }}>
        {item.type == 0 ? (
          <View
            style={{
              padding: 15,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                height: 50,
                width: 50,
                marginRight: 0,
                borderRadius: 25,
                overflow: 'hidden',
              }}>
              <PlaceholderImageView
                uri={Utility.getFileURLFromPublicURL(item.uri)}
                style={{
                  height: 50,
                  width: 50,
                  marginRight: 0,
                  borderRadius: 25,
                }}
                profilePic={true}
              />
            </View>
            <View style={{marginLeft: 10, flex: 1}}>
              <Text
                style={{
                  ...fontSize(18),
                  fontWeight: '500',
                  fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                  color: Colors.TextColor,
                }}>
                {item.field_first_name_value} {item.field_last_name_value}
              </Text>
              <Text
                style={{
                  ...fontSize(14),
                  color: Colors.TextColor,
                  fontStyle: 'italic',
                }}>
                {isOwner ? 'Owner' : this.getTextForActions(item)}
              </Text>
              {!this.state.showLeave && this.getMemoryActions(item)}
            </View>
          </View>
        ) : item.id && item.name && item.name.length > 0 ? (
          <View
            style={{
              padding: 15,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'flex-start',
            }}>
            <GroupPicHolder items={item.users ? item.users : []} />
            <View style={{marginLeft: 10, flex: 1}}>
              <Text
                style={{
                  ...fontSize(18),
                  fontWeight: '500',
                  fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                  color: Colors.TextColor,
                }}>
                {item.name}
              </Text>
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
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginRight: 10,
        }}>
        {
          <TouchableHighlight
            underlayColor={'#ffffff11'}
            onPress={() =>
              showRemove
                ? this.memoryAction(CollaboratorsAction.remove, item)
                : this.memoryAction(CollaboratorsAction.reinvite, item)
            }>
            <Text
              style={{
                textDecorationLine: 'underline',
                paddingTop: 10,
                paddingBottom: 5,
                textDecorationColor: showRemove
                  ? Colors.ErrorColor
                  : Colors.NewTitleColor,
                ...fontSize(14),
                color: showRemove ? Colors.ErrorColor : Colors.NewTitleColor,
              }}>
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
            <Text
              style={{
                textDecorationLine: 'underline',
                paddingTop: 10,
                paddingBottom: 5,
                textDecorationColor: Colors.NewTitleColor,
                ...fontSize(14),
                color: Colors.NewTitleColor,
              }}>
              Send Reminder
            </Text>
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
      <View style={{flex: 1}}>
        <SafeAreaView
          style={{
            width: '100%',
            flex: 0,
            backgroundColor: Colors.NewThemeColor,
          }}
        />
        <SafeAreaView
          style={{
            width: '100%',
            flex: 1,
            backgroundColor: '#fff',
            paddingBottom: 5,
          }}>
          <View style={{flex: 1}} onStartShouldSetResponder={() => false}>
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
              <View style={{flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: this.state.showLeave
                      ? 'center'
                      : 'space-between',
                    alignItems: 'center',
                    padding: 15,
                  }}>
                  {!this.state.showLeave && (
                    <TouchableHighlight
                      underlayColor={'#ffffff11'}
                      onPress={() => this.inviteFriendsToCollaborate()}>
                      <Text
                        style={{
                          ...fontSize(16),
                          fontWeight: '500',
                          fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                          color: Colors.NewTitleColor,
                        }}>
                        Invite More
                      </Text>
                    </TouchableHighlight>
                  )}
                  <TouchableHighlight
                    underlayColor={'#ffffff11'}
                    onPress={() =>
                      Actions.push('notesToCollaborators', {
                        friendsList: [],
                        friendsCircleList: [],
                        type: kSaveNotes,
                        isOwner: !this.state.showLeave,
                      })
                    }>
                    <Text
                      style={{
                        ...fontSize(16),
                        fontWeight: '500',
                        fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                        color: Colors.NewTitleColor,
                      }}>
                      {this.state.showLeave ? 'View ' : ''}
                      {'Note to collaborators'}
                    </Text>
                  </TouchableHighlight>
                </View>
                <FlatList
                  extraData={this.state}
                  style={{
                    width: '100%',
                    backgroundColor: '#f3f3f3',
                    marginTop: 5,
                  }}
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
                    style={{
                      position: 'absolute',
                      top: 0,
                      height: '100%',
                      width: '100%',
                    }}
                    onStartShouldSetResponder={() => true}
                    onResponderStart={() => this.setState({showMenu: false})}>
                    <View
                      style={{
                        right: 10,
                        backgroundColor: '#fff',
                        minHeight: 50,
                        position: 'absolute',
                        borderRadius: 5,
                        shadowOpacity: 1,
                        elevation: 3,
                        shadowColor: '#CACACA',
                        shadowRadius: 2,
                        borderWidth: 0.5,
                        borderColor: 'rgba(0,0,0,0.2)',
                        shadowOffset: {width: 0, height: 2},
                      }}>
                      <TouchableOpacity
                        style={{
                          height: 45,
                          justifyContent: 'center',
                          paddingLeft: 15,
                          paddingRight: 15,
                        }}
                        onPress={() => this.leaveConversation()}>
                        <Text style={{fontSize: 16, color: Colors.ErrorColor}}>
                          Leave Conversation
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <ScrollView>
                <View style={{padding: 15, alignItems: 'center'}}>
                  <Image source={team_icon} style={{padding: 15}} />
                  <Text
                    style={{
                      paddingTop: 15,
                      paddingBottom: 20,
                      ...fontSize(18),
                      textAlign: 'center',
                    }}>
                    {
                      "Collaborate with your friends and family to fill in any gaps, add more details, and include everyone's perspectives to record the full story. \n\nChat with each other, edit together in real-time, and collectively contribute photos to piece together your shared memory!"
                    }
                  </Text>
                  <TouchableHighlight
                    underlayColor={'#00000033'}
                    style={{
                      paddingRight: 25,
                      paddingLeft: 25,
                      paddingTop: 12,
                      paddingBottom: 12,
                      backgroundColor: Colors.ThemeColor,
                      borderRadius: 25,
                    }}
                    onPress={() => this.inviteFriendsToCollaborate()}>
                    <Text style={{color: '#fff', ...fontSize(18)}}>
                      Invite friends to collaborate
                    </Text>
                  </TouchableHighlight>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                      flexDirection: 'row',
                    }}
                    onPress={() =>
                      this.setState({checked: !this.state.checked})
                    }>
                    <Image
                      source={this.state.checked ? checkbox_active : checkbox}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        marginLeft: 15,
                        ...fontSize(16),
                        color: Colors.black,
                        fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                        fontWeight: '500',
                      }}>
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
