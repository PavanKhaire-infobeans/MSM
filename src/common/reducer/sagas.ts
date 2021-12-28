import {fork, all} from 'redux-saga/effects';

import {loginServiceCall} from '../../views/login/loginReducer';
import {getMindPopCall} from '../../views/mindPop/list/getListSaga';
import {checkAttachments} from '../../views/mindPop/edit/reducer';
import {deleteMindPopsCall} from '../../views/mindPop/list/deleteMindPopSaga';
import {listInstance} from '../../views/registration/getInstancesSaga';
import {getAccount} from '../../views/menu/reducer';
import {ForgotPasswordServiceCall} from '../../views/forgotPassword/forgotPasswordSaga';
import {networkConnectivitySaga} from '../utility';
import {watchCreateMemories} from '../../views/createMemory/saga';
import {watchNotifications} from '../../views/notificationView/saga';
import {dashboardServiceCaller} from '../../views/dashboard/dashboardReducer';

export default function* root() {
  yield all([
    fork(loginServiceCall),
    fork(getMindPopCall),
    fork(deleteMindPopsCall),
    fork(listInstance),
    fork(checkAttachments),
    fork(getAccount),
    fork(ForgotPasswordServiceCall),
    fork(networkConnectivitySaga),
    fork(watchCreateMemories),
    fork(watchNotifications),
    fork(dashboardServiceCaller),
  ]);
}
