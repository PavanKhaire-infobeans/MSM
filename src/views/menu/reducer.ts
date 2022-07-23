import { call, put, takeLatest } from 'redux-saga/effects';
import { Storage } from '../../common/constants';
import { Account, UserData } from '../../common/loginStore';

type Action = {
  type: UserAccount;
  payload: any | UserData;
};

export enum UserAccount {
  Get = 'UserAccountGet',
  Set = 'UserAccountSet',
  Store = 'UserAccountStore',
  NotLoggedIn = 'UserNotLoggedIn',
}

export const account = (
  state: UserData & { notLoggedIn?: boolean } = { instanceID: 0, name: '' },
  action: Action,
): UserData & { notLoggedIn?: boolean } => {
  var copy = { ...state };
  if (typeof copy.notLoggedIn != 'undefined') {
    delete copy.notLoggedIn;
  }
  switch (action.type) {
    case UserAccount.Get:
      return { ...copy };
    case UserAccount.Store:

      Storage.save('userData', action.payload);
    case UserAccount.Set:
      Account.selectedData().values = action.payload;
      return { ...action.payload };
    case UserAccount.NotLoggedIn:
      return { ...copy, notLoggedIn: true };
    default:
      return { ...copy };
  }
};

/**
 * User account saga
 */

function* getUserData() {
  try {
    let userData = yield call(async () => {
      return await Storage.get('userData');
    });
    if (userData != null) {
      yield put({ type: UserAccount.Set, payload: userData });
    } else {
      yield put({ type: UserAccount.NotLoggedIn });
    }
  } catch (err) {
    //console.log("Error getting user data", err)
  }
}

export function* getAccount() {
  yield takeLatest(UserAccount.Get, getUserData);
}
