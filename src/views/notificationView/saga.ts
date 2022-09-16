import { all, call, delay, put, takeLatest } from 'redux-saga/effects';
import { Storage } from '../../common/constants';
import { Account } from '../../common/loginStore';
import { MemoryService } from '../../common/webservice/memoryServices';
import { NotificationDataModel } from './notificationDataModel';
import { GetActivity, LoadMore } from './reducer';

export const GetNotificationAPI = 'getNotificationAPI';
export const SetSeenFlag = 'setSeenFlag';
export const LoadMoreNotifications = 'loadNotifications';
function* getNotification(params: any) {
  delay(500);
  return MemoryService(
    `https://${Account.selectedData().instanceURL}/api/activities/get_types`,
    params,
  )
    .then((response: Response) => response.json())
    .catch((err: Error) => Promise.reject(err));
}

function* setFlagNotification(params: any) {
  delay(500);
  return MemoryService(
    `https://${
      Account.selectedData().instanceURL
    }/api/notifications/set_seen_data`,
    params,
  )
    .then((response: Response) => response.json())
    .catch((err: Error) => Promise.reject(err));
}

function* loadMore(params: any) {
  delay(500);
  return MemoryService(
    `https://${
      Account.selectedData().instanceURL
    }/api/activities/get_activity_data`,
    params,
  )
    .then((response: Response) => response.json())
    .catch((err: Error) => Promise.reject(err));
}

function* setSeenFlag(params: any) {
  try {
    let data = yield call(async function () {
      return Storage.get('userData');
    });
    yield call(setFlagNotification, [
      {'X-CSRF-TOKEN': data.userAuthToken, 'Content-Type': 'application/json'},
      {details: params.payload},
    ]);
  } catch (err) {
    //showConsoleLog(ConsoleType.LOG,err);
  }
}

function* getActivityType() {
  try {
    let data = yield call(async function () {
      return Storage.get('userData');
    });
    let request = yield call(getNotification, [
      {'X-CSRF-TOKEN': data.userAuthToken, 'Content-Type': 'application/json'},
      {details: {configurationTimestamp: '0'}},
    ]);
    const responseBody = yield call(async function () {
      return await request;
    });
    if (responseBody.ResponseCode == '200') {
      responseBody.Details.forEach((element: any, index: any) => {
        element.data = new NotificationDataModel().getNotificationDetails(
          element.data,
          false,
        );
        responseBody.Details[index] = element;
      });
      yield put({type: GetActivity, payload: responseBody.Details});
    }
  } catch (err) {
    //showConsoleLog(ConsoleType.LOG,err);
  }
}

function* loadMoreNotifications(params: any) {
  try {
    let data = yield call(async function () {
      return Storage.get('userData');
    });
    let index = params.index;
    let request = yield call(loadMore, [
      {'X-CSRF-TOKEN': data.userAuthToken, 'Content-Type': 'application/json'},
      {details: params.payload},
    ]);
    const responseBody = yield call(async function () {
      return await request;
    });
    if (responseBody.ResponseCode == '200') {
      let data = new NotificationDataModel().getNotificationDetails(
        responseBody.Details.data,
        false,
      );
      yield put({
        type: LoadMore,
        payload: {index: params.payload.index, data: data},
      });
    }
  } catch (err) {
    //showConsoleLog(ConsoleType.LOG,err);
  }
}

export function* watchNotifications() {
  yield all([
    takeLatest(GetNotificationAPI, getActivityType),
    takeLatest(SetSeenFlag, setSeenFlag),
    takeLatest(LoadMoreNotifications, loadMoreNotifications),
  ]);
}
