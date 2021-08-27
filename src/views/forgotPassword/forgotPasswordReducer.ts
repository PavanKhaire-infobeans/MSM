export enum ForgotPasswordServiceStatus {
  RequestStarted = 'ForgotPasswordRequestStarted',
  RequestFailed = 'ForgotPasswordRequestFailed',
  RequestSuccess = 'ForgotPasswordRequestSuccess',
  Ended = 'ForgotPasswordRequestEnded',
}

export type StateType = {
  completed: boolean;
  success: boolean;
  data: object;
};

export type ForgotPasswordState = object | StateType;

type PayLoad = {
  type: string;
  payload: object;
};

/**
 * Login State reducer
 * @param state : Previous state
 * @param action : Incoming Action
 */
export const forgotPassword = (
  state: ForgotPasswordState = {},
  action: PayLoad,
): ForgotPasswordState => {
  switch (action.type) {
    case ForgotPasswordServiceStatus.RequestStarted:
      return {completed: false, success: false, data: null};
    case ForgotPasswordServiceStatus.RequestFailed:
      return {completed: true, success: false, data: action.payload};
    case ForgotPasswordServiceStatus.RequestSuccess:
      return {completed: true, success: true, data: action.payload};
    case ForgotPasswordServiceStatus.Ended:
      return {completed: false, success: false, data: null};
    default:
      return {...state};
  }
};
