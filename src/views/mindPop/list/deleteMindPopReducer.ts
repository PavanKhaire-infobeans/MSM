export enum DeleteMindPopOperation {
  RequestStarted = 'DeleteMindpopRequestStarted',
  RequestEnded = 'DeleteMindpopRequestEnded',
  RequestSuccess = 'DeleteMindpopRequestSuccess',
  RequestFailed = 'DeleteMindpopRequestFailed',
  RequestCompleted = 'DeleteMindpopRequestCompleted',
}

type Value = string[] | any;
type ResultType =
  | {data: {[x: string]: any}; completed: boolean; success: boolean}
  | object
  | Value;
type Payload = {type: string; payload: Value};

export const deleteMindPop = (
  state: ResultType = {},
  action: Payload,
): ResultType => {
  switch (action.type) {
    case DeleteMindPopOperation.RequestStarted:
      return {
        completed: false,
        success: false,
        data: {reqData: action.payload},
      };
    case DeleteMindPopOperation.RequestFailed:
      return {
        completed: true,
        success: false,
        data: {reqData: {...state.data.reqData}, error: action.payload},
      };
    case DeleteMindPopOperation.RequestSuccess:
      return {
        completed: true,
        success: true,
        data: {reqData: {...state.data.reqData}, response: action.payload},
      };
    case DeleteMindPopOperation.RequestEnded:
      return {completed: false, success: false, data: null};
    default:
      return {...state};
  }
};
