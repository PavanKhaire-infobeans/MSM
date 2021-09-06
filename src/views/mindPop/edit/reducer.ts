import {all, put, takeLatest} from 'redux-saga/effects';
import MindPopStore, {
  FileType,
  MindPopAttachment,
  Convert,
} from '../../../common/database/mindPopStore/mindPopStore';
export enum AddMindPopStatus {
  RequestStarted = 'AddMindPopRequestStarted',
  RequestFailed = 'AddMindPopRequestFailed',
  RequestSuccess = 'AddMindPopRequestSuccess',
  RequestEnded = 'AddMindPopRequestEnded',
}

type ResultType = {data: any; completed: boolean; success: boolean} | object;
type Payload = {type: string; payload: {[x: string]: any}};

export const addMindPop = (
  state: ResultType = {},
  action: Payload,
): ResultType => {
  switch (action.type) {
    case AddMindPopStatus.RequestStarted:
      return {completed: false, success: false, data: null};
    case AddMindPopStatus.RequestFailed:
      return {completed: true, success: false, data: action.payload};
    case AddMindPopStatus.RequestSuccess:
      return {completed: true, success: true, data: action.payload};
    case AddMindPopStatus.RequestEnded:
      return {completed: false, success: false, data: null};
    default:
      return {...state};
  }
};

export enum EditMode {
  RESET = 'EditMindPopReset',
  EDIT = 'EditMindPopMode',
  UNSELECT = 'EditMindPopUnselect',
  SET = 'EditMindPopSet',
}

type State = {mode: boolean; selectedMindPop?: object};
export const editScreenMode = (
  state: State = {mode: false, selectedMindPop: null},
  action: Payload,
): State => {
  switch (action.type) {
    case EditMode.EDIT:
      return {
        mode: true,
        selectedMindPop: action.payload || state.selectedMindPop || null,
      };
    case EditMode.RESET:
      return {
        mode: false,
        selectedMindPop: action.payload || state.selectedMindPop || null,
      };
    case EditMode.SET:
      return {...state, selectedMindPop: action.payload};
    case EditMode.UNSELECT:
      return {mode: false, selectedMindPop: null};
    default:
      return {...state};
  }
};

function* fetchAttachments(...args: any[]) {
  let [action]: Array<Payload | any> = args;
  if (action.payload) {
    let value: any = yield (async () => {
      return await MindPopStore._getMindPopAttachments(action.payload.id);
    })();
    var mindPop = {...action.payload};
    let medias: MindPopAttachment[] = value.rows.raw();
    var extraData: {[x: string]: any[]} = {};
    for (let media of medias) {
      let key: string = `${FileType[media.type]}s`;
      extraData = {
        ...extraData,
        [key]: [...(extraData[key] || []), Convert(media)],
      };
    }
    let payload = {...mindPop, ...extraData};
    yield put({type: EditMode.SET, payload});
  }
}

export function* checkAttachments() {
  yield all([
    takeLatest(EditMode.EDIT, fetchAttachments),
    takeLatest(EditMode.RESET, fetchAttachments),
  ]);
}
