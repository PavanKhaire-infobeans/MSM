import { call, put, takeLatest } from 'redux-saga/effects';
import { CueBackInsatance, getValue } from '../../common/constants';
import { getAllIntances as getAllInstances } from '../../common/webservice/loginServices';
import { GetInstances } from './reducer';
//import { AsyncStorage } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { No_Internet_Warning } from '../../common/component/Toast';
import Utility from '../../common/utility';

// export const kAdmin: string = 'https://admin.cueback.com'; //production
//export const kAdmin: string = 'https://qa-admin.cueback.com';
export const kAdmin: string = 'https://admin.cuebackqa.com';
const qaURL: string = 'https://admin.cueback.com';
export const isCueBackInstance = (kAdmin == qaURL) ? true : false;
const kStoreInstance = 'StoreInstanceData';
function* webServiceCaller() {
  return getAllInstances(`${kAdmin}`).then((resp: Response) => resp.json());
};

function* fetchInstances() {
  try {
    if (Utility.isInternetConnected) {
      let request = yield call(webServiceCaller);
      let storedData = yield call(async function () {
        return await AsyncStorage.getItem(kStoreInstance);
      });
      if (storedData) {
        // showConsoleLog(ConsoleType.LOG,'Stored Data : ', storedData);
        yield put({
          type: GetInstances.GetSuccess,
          payload: JSON.parse(storedData),
        });
      }
      var response: any = yield call(async function () {
        return await request;
      });

      if (response.ResponseCode == 200) {
        var list = getValue(response, ['Response', 'InstanceList']);
        list.forEach((element: any, index: any) => {
          if (element.InstanceURL == null) {
            list[index].InstanceURL = '';
          }
          list[index].is_fake = parseInt(element.is_fake);
        });
        list.push(CueBackInsatance);
        AsyncStorage.setItem(kStoreInstance, JSON.stringify(list));
        yield put({type: GetInstances.GetSuccess, payload: list});
      } else {
        yield put({
          type: GetInstances.GetFailed,
          payload: getValue(response, ['ResponseMessage']),
        });
      }
    } else {
      No_Internet_Warning();
    }
  } catch (error) {
    yield put({type: GetInstances.GetFailed, payload: error});
  }
}

export function* listInstance() {
  yield takeLatest(GetInstances.GetCall, fetchInstances);
}
