import React from 'react';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import { No_Internet_Warning, ToastMessage } from '../../common/component/Toast';
import { MemoryActionKeys } from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import CustomListView from '../memoryDetails/customListView';
import {
  GetBlockedUsersAndMemory,
  kBlockedUsers,
  kBlockedUsersFetched, kUserUnblocked, MemoryAction
} from '../myMemories/myMemoriesWebService';

type Props = {[x: string]: any};
export default class BlockedUsers extends React.Component<Props> {
  blockedMemoryListiner: EventManager;
  userUnblocked: EventManager;

  state = {
    itemList: [],
    loadingCompleted: false,
  };

  constructor(props: Props) {
    super(props);
    //loaderHandler.showLoader();
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

  componentWillUnmount =()=>{
    this.blockedMemoryListiner.removeListener()
    this.userUnblocked.removeListener()
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
      this.setState(
        {
          itemList: list,
        },
        () => {
          this.props.navigation.navigate('dashBoard');
          //loaderHandler.showLoader();
        },
      );
    } else {
      //loaderHandler.hideLoader();
     //ToastMessage(responseMessage);
    }
  };

  responseReceived = (success: any, data: any) => {
    //loaderHandler.hideLoader();
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
      //loaderHandler.showLoader('Loading...');
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
