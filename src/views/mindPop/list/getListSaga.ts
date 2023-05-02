import { call, put, takeLatest } from 'redux-saga/effects';
import { encode_utf8, getValue, Storage } from '../../../common/constants';
import MindPopStore from '../../../common/database/mindPopStore/mindPopStore';
import { Account } from '../../../common/loginStore';
import { getMindPops } from '../../../common/webservice/mindPopServices';
import { GetMindPopStatus } from './reducer';

function* getListCall(params: any,CB: any) {
  return getMindPops(`https://${Account.selectedData().instanceURL}`, params,
    resp =>CB(resp))
    // .then((response: Response) => response.json())
    // .catch((err: Error) => Promise.reject(err));
}

function* getListFlow(requestData: any) {
  const rData = requestData.payload;
  try {
    let data = yield call(async function () {
      return Storage.get('userData');
    });
    let dataSet = {}
    let request = yield call(getListCall, [
      rData,
      {'X-CSRF-TOKEN': data.userAuthToken, 'Content-Type': 'application/json'},
    ],
    async(responseBody) =>{
      // PARSE MINDPOP HERE
      responseBody?.Details?.mindPopList?.forEach((_element: any, index: any) => {
        responseBody.Details.mindPopList[index].message = encode_utf8(
          responseBody.Details.mindPopList[index].message,
        );
      });
      dataSet = await responseBody;
    }
    );
    const responseBody = yield call(async function () {
      return await request;
    });
  
    let value = getValue(dataSet, ['Details', 'totalItems']);
    
    if (value != null && typeof value !== 'undefined') {
      yield call(async function () {
        return await MindPopStore.saveMindPop(dataSet);
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
      //showConsoleLog(ConsoleType.LOG,"List MindPop Service Error: ", err);
      yield put({type: GetMindPopStatus.RequestFailed, payload: err});
    }
  }
}

export function* getMindPopCall() {
  yield takeLatest(GetMindPopStatus.RequestStarted, getListFlow);
}
