import React, {useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  Image,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {kNotificationIndicator} from '../../../src/common/component/TabBarIcons';
import Text from '../../../src/common/component/Text';
import {Colors} from '../../../src/common/constants';
import EventManager from '../../../src/common/eventManager';
import {Account} from '../../../src/common/loginStore';
import Utility from '../../../src/common/utility';
import {close_white} from '../../../src/images';
import {
  JUMP_TO_VIEW_SHOW,
  ListType,
} from '../../../src/views/dashboard/dashboardReducer';
import {NotificationDataModel} from '../../../src/views/notificationView/notificationDataModel';
import {kForegroundNotificationListener} from '../../../src/views/notificationView/notificationServices';
import {AddNewNotification} from '../../../src/views/notificationView/reducer';
import {kProfilePicUpdated} from '../../../src/views/profile/profileDataModel';
import {jumptocalendar, user} from '../../images';
import styles from './styles';

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

type Props = {[x: string]: any};
const NavigationBar = (props: Props) => {
  let key =
    Account.selectedData().instanceID + '_' + Account.selectedData().userID;
  let notificationReceivedForeground: EventManager;
  let notificationReceived;
  const [state, setState] = useState({showBadge: false});

  const navigation = useNavigation();

  useEffect(() => {
    if (Utility.unreadNotification[key] > 0) {
      setState(prevState => ({...prevState, showBadge: true}));
    } else {
      setState(prevState => ({...prevState, showBadge: false}));
    }
    // this.profilePicUpdate = EventManager.addListener(kProfilePicUpdated, this.updateProfilePic);
    DeviceEventEmitter.addListener(kProfilePicUpdated, updateProfilePic);

    notificationReceivedForeground = EventManager.addListener(
      kForegroundNotificationListener,
      notificationReceived,
    );

    return () => {
      DeviceEventEmitter.removeAllListeners(kProfilePicUpdated);
      notificationReceivedForeground.removeListener();
    };
  }, []);

  notificationReceived = (details: any) => {
    let group_id = new NotificationDataModel().getGroupId(
      details.notificationType,
    );
    props.addNotificationItem({group_id: group_id, details: [details]});
    if (Utility.unreadNotification[key] > 0) {
      setState(prevState => ({...prevState, showBadge: true}));
    } else {
      setState(prevState => ({...prevState, showBadge: false}));
    }
    setTimeout(() => {
      EventManager.callBack(kNotificationIndicator);
    }, 2000);
  };

  const updateProfilePic = () => {};

  const _renderMiddle = () => {
    // let isPublicInstance: any = Account.selectedData().is_public_site;
    return (
      <View style={styles.titleContainer} testID={testID.title.text}>
        {/* <TouchableOpacity onPress={props.filterClick} style={styles.filterContainer}>
          <Text style={styles.titleText}>{props.title}</Text>
          <Image source={chevrondown}></Image>
        </TouchableOpacity> */}
      </View>
    );
  };

  const _renderRight = () => {
    return (
      <View style={styles.rightContainer}>
        {props.currentTabName == ListType.Timeline ? (
          <TouchableWithoutFeedback
            onPress={() => {
              props.showJumpto(true);
              // _mindPopAction();
            }}
            testID={testID.rightButtons.mindpop}>
            <View style={styles.rightButtonsTouchable}>
              <Image
                style={styles.imageStyle}
                source={jumptocalendar}
                resizeMode="contain"
              />
              <View style={styles.imageSeparator} />
              <View style={styles.textContainer}>
                <Text style={styles.JumptoText}>{'Jump to\nYear'}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
    );
  };

  let showClose: boolean = props.showClose ? props.showClose : false;

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: props.isWhite ? Colors.white : Colors.NewThemeColor},
      ]}>
      <TouchableWithoutFeedback
        testID={testID.leftButtons.menu}
        onPress={() => {
          navigation.push('myAccount');
          // showClose ? _closeAction() : this.props.navigation.drawerOpen();
        }}>
        <View style={styles.leftButtonTouchableContainer}>
          {showClose ? (
            <View style={styles.closeButton}>
              <View style={styles.imageContainer}>
                <Image source={close_white} />
              </View>
              <View style={styles.imageSeparator} />
              <View style={[styles.textContainer, {justifyContent: 'center'}]}>
                <Text style={styles.JumptoText}>Cancle</Text>
              </View>
            </View>
          ) : (
            <View style={styles.closeButton}>
              <View style={styles.imageContainer}>
                <Image source={user} />
              </View>
              <View style={styles.imageSeparator} />
              <View style={styles.profileImgSeparator}>
                <Text style={styles.JumptoText}>Profile</Text>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      {_renderMiddle()}
      {_renderRight()}
    </View>
  );
};
const mapState = (state: {[x: string]: any}) => ({
  notificationList: state.NotificationsRedux.notificationData,
  unreadNot: state.NotificationsRedux.unreadNot,
  currentTabName: state.dashboardReducer.currentTabName,
});

const mapDispatch = (dispatch: Function) => {
  return {
    addNotificationItem: (payload: any) =>
      dispatch({type: AddNewNotification, payload: payload}),
    showJumpto: (payload: any) =>
      dispatch({type: JUMP_TO_VIEW_SHOW, payload: payload}),
  };
};

export default connect(mapState, mapDispatch)(NavigationBar);
