import React from 'react';
import {
  Alert,
  DeviceEventEmitter,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';

import Text from '../../common/component/Text';
import {
  close_white,
  icon_notification,
  instanceLogo,
  mindpopBarIcon,
  profile_placeholder,
  white_head_icon,
} from '../../images';
//@ts-ignore
import EStyleSheet from 'react-native-extended-stylesheet';
import {connect} from 'react-redux';
import {kNotificationIndicator} from '../../common/component/TabBarIcons';
import {Colors, fontFamily, fontSize} from '../../common/constants';
import EventManager from '../../common/eventManager';
import {Account} from '../../common/loginStore';
import Utility from '../../common/utility';
import {NotificationDataModel} from '../notificationView/notificationDataModel';
import {kForegroundNotificationListener} from '../notificationView/notificationServices';
import {AddNewNotification} from '../notificationView/reducer';
import {kProfilePicUpdated} from '../profile/profileDataModel';
const testID = {
  dashboardNavBar: 'dashboard_navigation_bar',
  leftButtons: {menu: 'navbar_leftbtn_menu'},
  rightButtons: {
    mindpop: 'mindpop_btn',
    message: 'message_btn',
    notification: 'notification_btn',
    notificationIcon: 'icon_notification',
  },
  title: {text: 'title'},
};

const styles = EStyleSheet.create({
  name: {
    color: Colors.TextColor,
    ...fontSize(10),
    lineHeight: 15,
    textAlign: 'left',
    fontWeight: '500',
    fontFamily:
      Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
  },
  titleText: {
    color: Colors.TextColor,
    ...fontSize(18),
    lineHeight: 20,
    textAlign: 'left',
    fontWeight: '500',
    fontFamily:
      Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
  },
  containerNavBarStyle: {
    flexDirection: 'row',
    width: '100%',
    height: 54,
    justifyContent: 'space-between',
  },
  titleContainer: {justifyContent: 'center', paddingTop: 10},

  leftButtonTouchableContainer: {
    justifyContent: 'center',
    padding: 15,
    marginTop: 5,
  },

  leftButtonContainer: {
    backgroundColor: 'transparent',
    borderColor: '#ffffff',
    borderWidth: 2,
    height: 28,
    width: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButtonMSMContainer: {
    backgroundColor: 'transparent',
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftCrossButtonContainer: {
    backgroundColor: Colors.NewRadColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftButtonLogo: {width: 30, height: 30},

  rightButtonsContainer: {
    flex: 1,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  rightButtonsTouchable: {padding: 5, paddingRight: 10},

  avatar: {height: 30, width: 30, borderRadius: 15, alignContent: 'center'},

  rightButtonsBackgroundImage: {width: 30, height: 30},

  rightButtonsBadge: {
    position: 'absolute',
    height: 15,
    width: 15,
    right: 10,
    top: 4,
    zIndex: 9999,
    backgroundColor: '#ff0000',
    borderColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 8,
    alignContent: 'center',
  },
  rightButtonsBadgeText: {...fontSize(10), color: '#ffffff'},
});

type Props = {[x: string]: any};
type State = {[x: string]: any};
class NavigationBar extends React.Component<Props> {
  key = Account.selectedData().instanceID + '_' + Account.selectedData().userID;
  profilePicUpdate: EventManager;
  test = true;
  notificationReceivedForeground: EventManager;
  state: State = {
    showBadge: false,
  };

  constructor(props: Props) {
    super(props);
    this.notificationReceivedForeground = EventManager.addListener(
      kForegroundNotificationListener,
      this.notificationReceived,
    );
  }

  notificationReceived = (details: any) => {
    let group_id = new NotificationDataModel().getGroupId(
      details.notificationType,
    );
    this.props.addNotificationItem({group_id: group_id, details: [details]});
    if (Utility.unreadNotification[this.key] > 0) {
      this.setState({showBadge: true});
    } else {
      this.setState({showBadge: false});
    }
    setTimeout(() => {
      EventManager.callBack(kNotificationIndicator);
    }, 2000);
    // Alert.alert(""+this.state.showBadge);
  };
  componentWillMount = () => {
    if (Utility.unreadNotification[this.key] > 0) {
      this.setState({showBadge: true});
    } else {
      this.setState({showBadge: false});
    }
    // this.profilePicUpdate = EventManager.addListener(kProfilePicUpdated, this.updateProfilePic);
    DeviceEventEmitter.addListener(kProfilePicUpdated, this.updateProfilePic);
  };

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners(kProfilePicUpdated);
    this.notificationReceivedForeground.removeListener();
  }

  updateProfilePic = () => {
    this.setState({});
  };

  _renderMiddle() {
    let isPublicInstance: any = Account.selectedData().is_public_site;
    return (
      <View style={styles.titleContainer} testID={testID.title.text}>
        {isPublicInstance == 'false' || isPublicInstance == false ? (
          <Text style={styles.name}>{Account.selectedData().name}</Text>
        ) : null}

        <Text style={styles.titleText}>{this.props.title}</Text>
      </View>
    );
  }

  _mindPopAction = () => {
    //this.props.navigation.popAndPush("mindPop")
    //Utility.notificationAvailable = !Utility.notificationAvailable;
    //EventManager.callBack(kNotificationIndicator);
    this.props.navigation.push('mindPop');
  };

  _closeAction = () => {
    Keyboard.dismiss();
    this.props.navigation.goBack();
  };

  _renderRight() {
    let imageUrl = Account.selectedData().profileImage;
    var loadProfileImage = true;
    if (imageUrl === '') {
      loadProfileImage = false;
    } else if (imageUrl.indexOf('public://') !== -1) {
      loadProfileImage = false;
    }
    return (
      <View style={styles.rightButtonsContainer}>
        <TouchableOpacity
          onPress={() => {
            this._mindPopAction();
          }}
          style={styles.rightButtonsTouchable}
          testID={testID.rightButtons.mindpop}>
          <Image
            style={styles.rightButtonsBackgroundImage}
            source={mindpopBarIcon}
            resizeMode="center"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this._notificationAction();
          }}
          style={styles.rightButtonsTouchable}
          testID={testID.rightButtons.notificationIcon}>
          {this.props.unreadNot && <View style={styles.rightButtonsBadge} />}
          <Image
            style={styles.rightButtonsBackgroundImage}
            source={icon_notification}
            resizeMode="center"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this._userProfileSection()}
          style={styles.rightButtonsTouchable}
          testID={testID.rightButtons.notification}>
          <ImageBackground
            style={styles.avatar}
            imageStyle={styles.imageBackgrounStyle}
            source={profile_placeholder}>
            {loadProfileImage ? (
              <Image
                style={styles.avatar}
                source={
                  Account.selectedData().profileImage != ''
                    ? {uri: Account.selectedData().profileImage}
                    : profile_placeholder
                }
              />
            ) : (
              <Image style={styles.avatar} source={profile_placeholder} />
            )}
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  }

  _userProfileSection = () => {
    if (this.props.navigation.currentScene != 'myAccount') {
      this.props.navigation.push('myAccount');
    }
  };

  _notificationAction = () => {
    if (this.props.navigation.currentScene != 'notificationView') {
      this.props.navigation.push('notificationView');
    }
  };

  _showAlert = (title: string = '', message: string = '') => {
    Alert.alert(title, message, [
      {
        text: 'OK',
        style: 'cancel',
        onPress: () => {},
      },
    ]);
  };

  render() {
    let showClose: boolean = this.props.showClose
      ? this.props.showClose
      : false;
    let isPublicInstance: any = Account.selectedData().is_public_site;
    return (
      <View
        style={[
          styles.containerNavBarStyle,
          {
            backgroundColor: this.props.isWhite
              ? Colors.white
              : Colors.NewThemeColor,
          },
        ]}>
        <TouchableOpacity
          style={styles.leftButtonTouchableContainer}
          testID={testID.leftButtons.menu}
          onPress={() => {
            showClose
              ? this._closeAction()
              : this.props.navigation.drawerOpen();
          }}>
          {showClose ? (
            <View style={styles.closeButton}>
              <Image source={close_white} />
            </View>
          ) : (
            <View style={styles.leftButtonMSMContainer}>
              {isPublicInstance == 'false' || isPublicInstance == false ? (
                <View style={styles.leftButtonContainer}>
                  <Image
                    style={styles.leftButtonLogo}
                    resizeMode="contain"
                    source={instanceLogo}
                  />
                </View>
              ) : (
                <Image
                  style={styles.leftButtonLogo}
                  resizeMode="contain"
                  source={white_head_icon}
                />
              )}
            </View>
          )}
        </TouchableOpacity>
        {this._renderMiddle()}
        {this._renderRight()}
      </View>
    );
  }
}
const mapState = (state: {[x: string]: any}) => ({
  notificationList: state.NotificationsRedux.notificationData,
  unreadNot: state.NotificationsRedux.unreadNot,
});

const mapDispatch = (dispatch: Function) => {
  return {
    addNotificationItem: (payload: any) =>
      dispatch({type: AddNewNotification, payload: payload}),
  };
};

export default connect(mapState, mapDispatch)(NavigationBar);
