import { call, put, takeLatest } from 'redux-saga/effects';
import { forgotPasswordRequest } from '../../common/webservice/forgotPasswordService';
import { kAdmin } from '../registration/getInstancesSaga';
import { ForgotPasswordServiceStatus } from './forgotPasswordReducer';

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
    //showConsoleLog(ConsoleType.LOG,"Login Service Error: ", err);
    yield put({ type: ForgotPasswordServiceStatus.RequestFailed, payload: err });
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
