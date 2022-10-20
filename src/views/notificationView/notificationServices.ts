import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import { Storage } from '../../common/constants';
import EventManager from '../../common/eventManager';
import { Account } from '../../common/loginStore';
import { MemoryService, newMemoryService } from '../../common/webservice/memoryServices';
export const kActivities = 'activitiesFetched';
export const kSeenData = 'seenData';
export const kNotificationTypes = 'notificationTypes';
export const kLoadMore = 'loadMoreNotes';
export const kGetInvidualNotification = 'singleNotification';
export const kForegroundNotice = 'foregroundNotice';
export const kBackgroundNotice = 'backgroundNotice';
export const kForegroundNotificationListener = 'foregroundNotificationListener';
export const kActivityListener = 'activityListener';

export const GetActivities = async (details: any, listener: any, CB: any) => {
  try {
    let data = await Storage.get('userData');
    let response = await newMemoryService(
      `https://${Account.selectedData().instanceURL
      }/api/activities/get_activity_data`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        { configurationTimestamp: '0', details: details },
      ],
      response => {
        if (response != undefined && response != null) {
          CB(response)
          // if (response.ResponseCode == 200) {
          //   EventManager.callBack(listener, true, response['Details']);
          //   // EventManager.callBack(kLoadMore, true, response["Details"]);
          // } else {
          //   EventManager.callBack(listener, false, response['ResponseMessage']);
          //   // EventManager.callBack(kLoadMore, false, response["ResponseMessage"]);
          // }
        }
        else {
          CB({ ResponseCode: 400, ResponseMessage: 'Unable to process your request. Please try again later' })

        }
      }
    )
    // .then((response: Response) => response.json())
    // .catch((err: Error) => {
    //   //loaderHandler.hideLoader();
    //   Promise.reject(err);
    // });

  }
  catch (err) {
    CB({ ResponseCode: 400, ResponseMessage: 'Unable to process your request. Please try again later' })
    // EventManager.callBack(
    //   listener,
    //   false,
    //   'Unable to process your request. Please try again later',
    // );
    // //loaderHandler.hideLoader();
  }
};

export const SetSeenActivity = async (ids: any, index: any, CB: any) => {
  try {
    let data = await Storage.get('userData');
    let response = await newMemoryService(
      `https://${Account.selectedData().instanceURL
      }/api/notifications/set_seen_data`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        { configurationTimestamp: '0', details: ids },
      ],
      response => {
        if (response != undefined && response != null) {
          if (response.ResponseCode == 200) {
            CB(index)
            EventManager.callBack(kSeenData, true, index);
          } else {
            CB(index)
            EventManager.callBack(
              kSeenData,
              false,
              index,
              response['ResponseMessage'],
            );
          }
        }
      }
    )
    // .then((response: Response) => response.json())
    // .catch((err: Error) => {
    //   Promise.reject(err);
    // });

  } catch (err) {
    //showConsoleLog(ConsoleType.LOG,"Error is : ", err)
    EventManager.callBack(
      kSeenData,
      false,
      index,
      'Unable to process your request. Please try again later',
    );
  }
};
