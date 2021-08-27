import {combineReducers, createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';

import {loginStatus} from '../../views/login/loginReducer';
import {
  getMindPop,
  listState,
  listCount,
  selectedItemCount,
} from '../../views/mindPop/list/reducer';
import {addMindPop, editScreenMode} from '../../views/mindPop/edit/reducer';
import {intanceList, requestInstances} from '../../views/registration/reducer';
import {deleteMindPop} from '../../views/mindPop/list/deleteMindPopReducer';
import {account} from '../../views/menu/reducer';
import {forgotPassword} from '../../views/forgotPassword/forgotPasswordReducer';
//@ts-ignore
import root from './sagas';
import {MemoryInitials} from '../../views/createMemory/reducer';
import {NotificationsRedux} from '../../views/notificationView/reducer';
import {dashboardReducer} from '../../views/dashboard/dashboardReducer';

const reducers = combineReducers({
  loginStatus,
  getMindPop,
  addMindPop,
  mindPopEditMode: editScreenMode,
  mindPopListSelectionStatus: listState,
  listCount,
  selectedItemCount,
  deleteMindPop,
  intanceList,
  requestInstances,
  account,
  forgotPassword,
  MemoryInitials,
  NotificationsRedux,
  dashboardReducer,
});

const sagaMiddleware = createSagaMiddleware();

var store = createStore(reducers, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(root);

export default store;
