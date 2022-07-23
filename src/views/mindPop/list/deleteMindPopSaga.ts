import { call, put, takeLatest } from 'redux-saga/effects';
import { Storage } from '../../../common/constants';
import { Account } from '../../../common/loginStore';
import { deleteMindPops } from '../../../common/webservice/mindPopServices';
import { DeleteMindPopOperation } from './deleteMindPopReducer';

function* getDeleteMindPopService(params: any) {
  return deleteMindPops(
    `https://${Account.selectedData().instanceURL}`,
    params,
  ).then((response: Response) => response.json());
}

function* deleteMindPopServiceCall(...action: any[]) {
  try {
    let data = yield call(async function () {
      return Storage.get('userData');
    });
    let request = yield call(getDeleteMindPopService, [
      ...action,
      {'X-CSRF-TOKEN': data.userAuthToken, 'Content-Type': 'application/json'},
    ]);
    const responseBody = yield call(async function () {
      return await request;
    });
    yield put({
      type: DeleteMindPopOperation.RequestSuccess,
      payload: responseBody,
    });
  } catch (err) {
    //console.log("Delete MindPop Service Error: ", err);
    yield put({type: DeleteMindPopOperation.RequestFailed, payload: err});
  }
}

export function* deleteMindPopsCall() {
  yield takeLatest(
    DeleteMindPopOperation.RequestStarted,
    deleteMindPopServiceCall,
  );
}
