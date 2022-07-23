import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { forgotPassword } from '../../views/forgotPassword/forgotPasswordReducer';
import { loginStatus } from '../../views/login/loginReducer';
import { account } from '../../views/menu/reducer';
import { addMindPop, editScreenMode } from '../../views/mindPop/edit/reducer';
import { deleteMindPop } from '../../views/mindPop/list/deleteMindPopReducer';
import {
  getMindPop, listCount, listState, selectedItemCount
} from '../../views/mindPop/list/reducer';
import { intanceList, requestInstances } from '../../views/registration/reducer';
//@ts-ignore
import { MemoryInitials } from '../../views/createMemory/reducer';
import { dashboardReducer } from '../../views/dashboard/dashboardReducer';
import { NotificationsRedux } from '../../views/notificationView/reducer';
import root from './sagas';

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
