import { call, put, takeLatest } from 'redux-saga/effects';
import { encode_utf8, getValue, Storage } from '../../../common/constants';
import MindPopStore from '../../../common/database/mindPopStore/mindPopStore';
import { Account } from '../../../common/loginStore';
import { getMindPops } from '../../../common/webservice/mindPopServices';
import { GetMindPopStatus } from './reducer';

function* getListCall(params: any) {
  return getMindPops(`https://${Account.selectedData().instanceURL}`, params)
    .then((response: Response) => response.json())
    .catch((err: Error) => Promise.reject(err));
}

function* getListFlow(requestData: any) {
  const rData = requestData.payload;
  try {
    let data = yield call(async function () {
      return Storage.get('userData');
    });
    let request = yield call(getListCall, [
      rData,
      {'X-CSRF-TOKEN': data.userAuthToken, 'Content-Type': 'application/json'},
    ]);
    const responseBody = yield call(async function () {
      return await request;
    });
    let value = getValue(responseBody, ['Details', 'totalItems']);
    // PARSE MINDPOP HERE
    responseBody.Details.mindPopList.forEach((_element: any, index: any) => {
      responseBody.Details.mindPopList[index].message = encode_utf8(
        responseBody.Details.mindPopList[index].message,
      );
    });
    if (value != null && typeof value !== 'undefined') {
      yield call(async function () {
        return await MindPopStore.saveMindPop(responseBody);
      });
    }
    let searchTerm = getValue(rData, ['searchTerm', 'SearchString']);
    let fetchedItems = yield call(async function () {
      return await MindPopStore._getMindPopFromLocalDB(searchTerm);
    });
    if (fetchedItems.rows.length > 0) {
      if (value == null) {
        value = fetchedItems.rows.length;
      }
      yield put({
        type: GetMindPopStatus.RequestSuccess,
        payload: {count: value, fetchedItems},
      });
    } else {
      yield put({
        type: GetMindPopStatus.RequestSuccess,
        payload: {count: 0, fetchedItems: []},
      });
      // yield put({ type: GetMindPopStatus.RequestFailed, payload: new Error("No data found") });
    }
  } catch (err) {
    let searchTerm = getValue(rData, ['searchTerm', 'SearchString']);
    let fetchedItems = yield call(async function () {
      return await MindPopStore._getMindPopFromLocalDB(searchTerm);
    });
    if (fetchedItems.rows.length > 0) {
      yield put({
        type: GetMindPopStatus.RequestSuccess,
        payload: {count: fetchedItems.rows.length, fetchedItems},
      });
    } else {
      //console.log("List MindPop Service Error: ", err);
      yield put({type: GetMindPopStatus.RequestFailed, payload: err});
    }
  }
}

export function* getMindPopCall() {
  yield takeLatest(GetMindPopStatus.RequestStarted, getListFlow);
}
