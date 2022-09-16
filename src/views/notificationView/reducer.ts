import { showConsoleLog, ConsoleType } from '../../common/constants';
import { Account } from '../../common/loginStore';
import Utility from '../../common/utility';

export const GetActivity = 'getActivity';
export const SeenFlag = 'seenFlag';
export const MarkAllRead = 'markAllRead';
export const LoadMore = 'loadMoreNotice';
export const CurrentList = 'currentList';
export const AddNewNotification = 'notificationAddition';
type Payload = {type: string; payload: any};

const initialNotifications: any = {
  notificationData: [],
  isLoadMore: false,
  idIndexMapping: {},
  unreadNot: false,
};

export const NotificationsRedux = (
  state = initialNotifications,
  action: Payload,
) => {
  let newState: any = {...state};
  let key =
    Account.selectedData().instanceID + '_' + Account.selectedData().userID;

  switch (action.type) {
    case GetActivity:
      newState.notificationData = action.payload.slice(0);
      break;
    case SeenFlag:
      newState.notificationData[action.payload.detailsIndex].data[
        action.payload.dataIndex
      ].unreadFlag = false;
      newState.notificationData[action.payload.detailsIndex].unseen_count--;
      Utility.unreadNotification[key] = Utility.unreadNotification[key] - 1;
      var unreadNotiFlag = false;
      newState.notificationData.map((item: any) => {
        if (item.unseen_count > 0) {
          unreadNotiFlag = true;
        }
      });
      newState.unreadNot = unreadNotiFlag;
      break;
    case MarkAllRead:
      newState.notificationData[action.payload.detailsIndex].data.forEach(
        (element: any, index: any) => {
          newState.notificationData[action.payload.detailsIndex].data[
            index
          ].unreadFlag = false;
        },
      );
      newState.notificationData[action.payload.detailsIndex].unseen_count = 0;
      Utility.unreadNotification[key] =
        Utility.unreadNotification[key] -
        newState.notificationData[action.payload.detailsIndex].unseen_count;

      var unreadNotiFlag = false;
      newState.notificationData.map((item: any) => {
        if (item.unseen_count > 0) {
          unreadNotiFlag = true;
        }
      });
      newState.unreadNot = unreadNotiFlag;
      break;
    case LoadMore:
      newState.notificationData[action.payload.index].data =
        newState.notificationData[action.payload.index].data
          .concat(action.payload.data)
          .slice(0);
      break;
    case AddNewNotification:
      let selectedIndex = 0;
      let notificationList: any = [];
      newState.notificationData.forEach((element: any, index: any) => {
        if (element.group_id == action.payload.group_id) {
          let activityList = action.payload.details.concat(element.data);
          //showConsoleLog(ConsoleType.LOG,"test list size"+activityList);
          selectedIndex = index;
          notificationList = activityList.slice(0);
        }
      });
      
      let details = action.payload.details[0];
      notificationList.forEach((element: any, index: any) => {
        if (
          index != 0 &&
          element.nid == details.nid &&
          element.notificationId == details.notificationId &&
          element.unreadFlag == details.unreadFlag
        ) {
          if (!element.unreadFlag) {
            newState.notificationData[selectedIndex].unseen_count++;
          }
          notificationList.splice(index, 1);
        } else if (
          index ==
          newState.notificationData[selectedIndex].data.length - 1
        ) {
          newState.notificationData[selectedIndex].unseen_count++;
        }
      });
      if (newState.notificationData[selectedIndex]) {
        newState.notificationData[selectedIndex].data =
          notificationList.slice(0);
      }
      newState.notificationData = newState.notificationData.slice(0);
      Utility.unreadNotification[key] = Utility.unreadNotification[key] + 1;
      newState.unreadNot = true;
      break;
  }
  showConsoleLog(ConsoleType.LOG,'Utility notification count : ', action.type);
  return newState;
};
