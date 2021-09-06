import {takeLatest, put, call} from 'redux-saga/effects';
import {ForgotPasswordServiceStatus} from './forgotPasswordReducer';
import {forgotPasswordRequest} from '../../common/webservice/forgotPasswordService';
import {Account} from '../../common/loginStore';
import {kAdmin} from '../registration/getInstancesSaga';

/**
 * ForgotPassword Request Generator
 * @param params
 */
function* fetchRequest(params: any) {
  return forgotPasswordRequest(kAdmin, params).then((response: Response) =>
    response.json(),
  );
}

/**
 * ForgotPassword Process Generator
 * @param params
 */
function* ForgotPasswordService(...action: any[]) {
  try {
    const request = yield call(fetchRequest, action);
    const responseBody = yield call(async function () {
      return await request;
    });
    yield put({
      type: ForgotPasswordServiceStatus.RequestSuccess,
      payload: responseBody,
    });
  } catch (err) {
    //console.log("Login Service Error: ", err);
    yield put({type: ForgotPasswordServiceStatus.RequestFailed, payload: err});
  }
}

/**
 * Login Saga - Entry point
 */
export function* ForgotPasswordServiceCall() {
  yield takeLatest(
    ForgotPasswordServiceStatus.RequestStarted,
    ForgotPasswordService,
  );
}
