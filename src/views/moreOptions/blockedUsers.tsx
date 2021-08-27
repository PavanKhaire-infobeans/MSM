import React from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  TouchableHighlight,
  StatusBar,
  Keyboard,
  Alert,
} from 'react-native';
import Text from '../../common/component/Text';
import {
  icon_people,
  icon_events,
  icon_settings,
  icon_faq,
  icon_info,
  icon_headset,
  profile_placeholder,
  action_close,
} from '../../images';
import NavigationBar from '../dashboard/NavigationBar';
import NavigationBarForEdit from '../../common/component/navigationBarForEdit';
import {Actions} from 'react-native-router-flux';
import {Colors, MemoryActionKeys} from '../../common/constants';
import Utility from '../../common/utility';
import {Account} from '../../common/loginStore';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import CustomListView from '../memoryDetails/customListView';
import {
  GetBlockedUsersAndMemory,
  kBlockedUsers,
  kBlockedUsersFetched,
  MemoryAction,
  kUserUnblocked,
} from '../myMemories/myMemoriesWebService';
import EventManager from '../../common/eventManager';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import {ToastMessage, No_Internet_Warning} from '../../common/component/Toast';

type Props = {[x: string]: any};
export default class BlockedUsers extends React.Component<Props> {
  blockedMemoryListiner: any;
  userUnblocked: any;

  state = {
    itemList: [],
    loadingCompleted: false,
  };

  constructor(props: Props) {
    super(props);
    loaderHandler.showLoader();
    GetBlockedUsersAndMemory(kBlockedUsers);
    this.blockedMemoryListiner = EventManager.addListener(
      kBlockedUsersFetched,
      this.responseReceived,
    );
    this.userUnblocked = EventManager.addListener(
      kUserUnblocked,
      this.userUnblockedCallBack,
    );
  }

  userUnblockedCallBack = (
    success: any,
    responseMessage: any,
    nid?: any,
    type?: any,
    uid?: any,
  ) => {
    if (success) {
      let list = this.state.itemList.filter((it: any) => it.uid != uid);
      this.setState({
        itemList: list,
      });
      Actions.dashBoard();
      loaderHandler.showLoader();
    } else {
      loaderHandler.hideLoader();
      ToastMessage(responseMessage);
    }
  };

  responseReceived = (success: any, data: any) => {
    loaderHandler.hideLoader();
    if (success) {
      data = data.data;
      this.setState({
        itemList: data,
        loadingCompleted: true,
      });
    } else {
      this.setState({
        loadingCompleted: true,
      });
    }
  };

  onUnblockClicked = (uid: any) => {
    if (Utility.isInternetConnected) {
      loaderHandler.showLoader('Loading...');
      MemoryAction(
        'user',
        0,
        MemoryActionKeys.unblockUserKey,
        uid,
        kUserUnblocked,
      );
    } else {
      No_Internet_Warning();
    }
  };

  render() {
    return (
      <CustomListView
        itemList={this.state.itemList}
        heading={'Blocked Users'}
        blankText={'There are no blocked user to display at this moment.'}
        showUnblock={true}
        onClick={(uid: any) => this.onUnblockClicked(uid)}
        loadingCompleted={this.state.loadingCompleted}
      />
    );
  }
}
