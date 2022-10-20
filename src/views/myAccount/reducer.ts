import { showConsoleLog, ConsoleType } from '../../common/constants';
import { Account } from '../../common/loginStore';

export const GetUserData = 'getUserData';
type Payload = {type: string; payload: any};

const initialNotifications: any = {
  userData: [],

};

export const UserProfileRedux = (
  state = initialNotifications,
  action: Payload,
) => {
  let newState: any = {...state};
  let key =
    Account.selectedData().instanceID + '_' + Account.selectedData().userID;

  switch (action.type) {
    case GetUserData:
      newState.userData = action.payload;
      break;
    
  }
  return newState;
};
