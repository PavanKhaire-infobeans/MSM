import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  Alert,
  ImageBackground,
  DeviceEventEmitter,
  Keyboard,
} from 'react-native';
import Text from '../../../src/common/component/Text';
import React, { useEffect, useState } from 'react';
import { Actions } from 'react-native-router-flux';
import {
  mindpopBarIcon,
  close_white,
  instanceLogo,
  profile_placeholder,
  cueback_logo,
  white_head_icon,
  icon_notification,
  calendar,
} from '../../../src/images';

import { calendarsmall, jumptocalendar, user } from '../../images'
//@ts-ignore
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontSize } from '../../../src/common/constants';
import NavigationHeader from '../../../src/common/component/navigationHeader';
import { Account } from '../../../src/common/loginStore';
import EventManager from '../../../src/common/eventManager';
import { kProfilePicUpdated } from '../../../src/views/profile/profileDataModel';
import TabIcon, {
  kNotificationIndicator,
} from '../../../src/common/component/TabBarIcons';
import Utility from '../../../src/common/utility';
import { kForegroundNotificationListener } from '../../../src/views/notificationView/notificationServices';
import { NotificationDataModel } from '../../../src/views/notificationView/notificationDataModel';
import { connect } from 'react-redux';
import { AddNewNotification } from '../../../src/views/notificationView/reducer';
import styles from './styles';

import { chevrondown } from './../../images';
import { JUMP_TO_VIEW_SHOW, ListType } from '../../../src/views/dashboard/dashboardReducer';
const testID = {
  dashboardNavBar: 'dashboard_navigation_bar',
  leftButtons: { menu: 'navbar_leftbtn_menu' },
  rightButtons: {
    mindpop: 'mindpop_btn',
    message: 'message_btn',
    notification: 'notification_btn',
    notificationIcon: 'icon_notification',
  },
  title: { text: 'title' },
};

type Props = { [x: string]: any };
type State = { [x: string]: any };
const NavigationBar = (props: Props) => {
  let key = Account.selectedData().instanceID + '_' + Account.selectedData().userID;
  let profilePicUpdate: EventManager;
  let test = true;
  let notificationReceivedForeground: EventManager;
  let notificationReceived;
  const [state, setState] = useState({ showBadge: false });

  useEffect(() => {

    if (Utility.unreadNotification[key] > 0) {
      setState(prevState => ({ ...prevState, showBadge: true }));
    } else {
      setState(prevState => ({ ...prevState, showBadge: false }));
    }
    // this.profilePicUpdate = EventManager.addListener(kProfilePicUpdated, this.updateProfilePic);
    DeviceEventEmitter.addListener(kProfilePicUpdated, updateProfilePic);

    notificationReceivedForeground = EventManager.addListener(
      kForegroundNotificationListener,
      notificationReceived,
    );
  }, [])

  notificationReceived = (details: any) => {
    let group_id = new NotificationDataModel().getGroupId(
      details.notificationType,
    );
    props.addNotificationItem({ group_id: group_id, details: [details] });
    if (Utility.unreadNotification[key] > 0) {
      setState(prevState => ({ ...prevState, showBadge: true }));
    }
    else {
      setState(prevState => ({ ...prevState, showBadge: false }));
    }
    setTimeout(() => {
      EventManager.callBack(kNotificationIndicator);
    }, 2000);
  };

  const updateProfilePic = () => {
  };

  const _renderMiddle = () => {
    // let isPublicInstance: any = Account.selectedData().is_public_site;
    return (
      <View style={styles.titleContainer} testID={testID.title.text}>
        <TouchableOpacity onPress={props.filterClick} style={{ height: '65%', width: '90%', alignSelf: 'center', padding: 5, paddingHorizontal: 10, justifyContent: 'space-between', borderRadius: 12, alignItems: 'center', flexDirection: 'row', borderWidth: 1, borderColor: Colors.bordercolor }}>
          <Text style={styles.titleText}>{props.title}</Text>
          <Image source={chevrondown}></Image>
        </TouchableOpacity>
      </View>
    );
  }

  const _mindPopAction = () => {
    Actions.push('mindPop');
  };

  const _closeAction = () => {
    Keyboard.dismiss();
    Actions.pop();
  };

  const _renderRight = () => {
    // let imageUrl = Account.selectedData().profileImage;
    // var loadProfileImage = true;
    // if (imageUrl === '') {
    //   loadProfileImage = false;
    // } else if (imageUrl.indexOf('public://') !== -1) {
    //   loadProfileImage = false;
    // }
    return (
      <View style={{ flex: 1.5, justifyContent: 'center', marginRight: 5 }}>
        {
          props.currentTabName == ListType.Timeline ?
            <TouchableOpacity
              onPress={() => {
                props.showJumpto(true);
                // _mindPopAction();
              }}
              style={styles.rightButtonsTouchable}
              testID={testID.rightButtons.mindpop}>
              <Image
                style={styles.rightButtonsBackgroundImage}
                source={jumptocalendar}
                resizeMode="contain"
              />
              <Text style={styles.cancleText}>{'Jump to Year'}</Text>
            </TouchableOpacity>
            :
            null
        }

      </View>
    );
  }

  const _userProfileSection = () => {
    if (Actions.currentScene != 'myAccount') {
      Actions.push('myAccount');
    }
  };

  const _notificationAction = () => {
    if (Actions.currentScene != 'notificationView') {
      Actions.push('notificationView');
    }
  };

  const _showAlert = (title: string = '', message: string = '') => {
    Alert.alert(title, message, [
      {
        text: 'OK',
        style: 'cancel',
        onPress: () => { },
      },
    ]);
  };

  let showClose: boolean = props.showClose
    ? props.showClose
    : false;
  let isPublicInstance: any = Account.selectedData().is_public_site;
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        height: 65,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: props.isWhite ? Colors.white : Colors.NewThemeColor,
        borderBottomWidth: 2,
        borderBottomColor: Colors.bottomTabColor
      }}>
      <TouchableOpacity
        style={styles.leftButtonTouchableContainer}
        testID={testID.leftButtons.menu}
        onPress={() => {
          showClose ? _closeAction() : Actions.drawerOpen();
        }}>
        {showClose ? (
          <View style={styles.closeButton}>
            <View >
              <Image source={close_white} />
            </View>
            <View >
              <Text style={styles.cancleText}>Cancle</Text>
            </View>
          </View>
        ) : (
          <View style={styles.closeButton}>
            <View >
              <Image source={user} />
            </View>
            <View >
              <Text style={styles.cancleText}>Profile</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
      {_renderMiddle()}
      {_renderRight()}
    </View>
  );

}
const mapState = (state: { [x: string]: any }) => ({
  notificationList: state.NotificationsRedux.notificationData,
  unreadNot: state.NotificationsRedux.unreadNot,
  currentTabName: state.dashboardReducer.currentTabName,
});

const mapDispatch = (dispatch: Function) => {
  return {
    addNotificationItem: (payload: any) => dispatch({ type: AddNewNotification, payload: payload }),
    showJumpto: (payload: any) => dispatch({ type: JUMP_TO_VIEW_SHOW, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(NavigationBar);
