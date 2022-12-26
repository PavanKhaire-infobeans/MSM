import DefaultPreference from 'react-native-default-preference';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
  ConsoleType,
  MemoryActionKeys,
  showConsoleLog,
  Storage,
} from '../../common/constants';
import EventManager from '../../common/eventManager';
import { Account } from '../../common/loginStore';
import { MemoryService, newMemoryService } from '../../common/webservice/memoryServices';
import { DashboardDataModel } from './dashboardDataModel';

export const SET_FILTERS_NAME = 'SET_FILTERS_NAME';
export const SHOW_LOADER_READ = 'SHOW_LOADER_READ';
export const SHOW_LOADER_TEXT = 'SHOW_LOADER_TEXT';
export const SET_TIMELINE_FILTERS = 'SET_TIMELINE_FILTERS';
export const SET_RECENT_FILTERS = 'SET_RECENT_FILTERS';
export const SET_TIMELINE_LIST = 'SET_TIMELINE_LIST';
export const SET_RECENT_LIST = 'SET_RECENT_LIST';
export const GET_FILTERS_DATA = 'GET_FILTERS_DATA';
export const GET_MEMORY_LIST = 'GET_MEMORY_LIST';
export const GET_TIMELINE_LIST = 'GET_TIMELINE_LIST';
export const SET_LOADING_TIMELINE = 'SET_LOADING_TIMELINE';
export const SET_LOADING_RECENT = 'SET_LOADING_RECENT';
export const GET_FILTERS_DATA_TIMELINE = 'GET_FILTERS_DATA_TIMELINE';
export const RESET_ON_LOGIN = 'RESET_ON_LOGIN';
export const REMOVE_PROMPT = 'REMOVE_PROMPT';
export const MEMORY_ACTIONS_DASHBOARD = 'MEMORY_ACTIONS_DASHBOARD';
export const ACTIVE_TAB_ON_DASHBOARD = 'ACTIVE_TAB_ON_DASHBOARD';
export const JUMP_TO_VIEW_SHOW = 'JUMP_TO_VIEW_SHOW';
export const JUMP_TO_FROM_DATE = 'JUMP_TO_FROM_DATE';
export const JUMP_TO_TO_DATE = 'JUMP_TO_TO_DATE';
export const SET_KEYBOARD_HEIGHT = 'SET_KEYBOARD_HEIGHT';
export const CreateAMemory = 'CreateAMemory';

export enum ListType {
  Recent = 'feed',
  Timeline = 'timeline',
  Published = 'published',
}

type StateType = {
  recentList: Array<object>;
  timelineList: Array<object>;
  filterDataTimeline: object;
  filterDataRecent: object;
  jumpToYears: Array<object>;
  active_prompts: Array<object>;
  loadMoreTimeline: boolean;
  loadMoreRecent: boolean;
  refreshTimeline: boolean;
  refreshRecent: boolean;
  loadingRecent: boolean;
  loadingTimeline: boolean;
  recentCount: number;
  timelineCount: number;
  jumpToCalled: boolean;
  isTimelineEnded: boolean;
  createAMemory: boolean;
  isJumptoShow: boolean;
  filterName: string;
  currentTabName: string;
  fromDate: string;
  toDate: string;
  keyBoardHeight: number;
  showLoader: boolean;
  loaderText: string;
};

export type DashboardState = object | StateType;

type PayLoad = {
  type: string;
  payload: any;
};
let promptPagination = 0;
export const dashboardReducer = (
  state: DashboardState = {},
  action: PayLoad,
): DashboardState => {
  let newState: any = { ...state };
  newState.recentList = newState.recentList ? newState.recentList : [];
  newState.timelineList = newState.timelineList ? newState.timelineList : [];
  switch (action.type) {
    case SET_TIMELINE_FILTERS:
      newState = { ...newState, filterDataTimeline: action.payload };
      break;
    case SET_RECENT_FILTERS:
      newState = { ...newState, filterDataRecent: action.payload };
      break;
    case SET_FILTERS_NAME:
      newState = { ...newState, filterName: action.payload };
      break;
    case SET_KEYBOARD_HEIGHT:
      newState = { ...newState, keyBoardHeight: action.payload };
      break;
    case ACTIVE_TAB_ON_DASHBOARD:
      newState = { ...newState, currentTabName: action.payload };
      break;
    case JUMP_TO_VIEW_SHOW:
      newState = { ...newState, isJumptoShow: action.payload };
      break;
    case JUMP_TO_FROM_DATE:
      newState = { ...newState, fromDate: action.payload };
      break;
    case JUMP_TO_TO_DATE:
      newState = { ...newState, toDate: action.payload };
      break;
    case CreateAMemory:
      newState = { ...newState, createAMemory: action.payload };
      break;
    case SHOW_LOADER_READ:
      newState = { ...newState, showLoader: action.payload };
      break;
    case SHOW_LOADER_TEXT:
      newState = { ...newState, loaderText: action.payload };
      break;
    case SET_RECENT_LIST:
      if (!action.payload.isLoadMore) {
        newState.recentList = [];
      }
      newState = {
        ...newState,
        prompts: action.payload.active_prompts,
        recentList: newState.recentList.concat(action.payload.data),
        active_prompts: action.payload.active_prompts,
        recentCount: action.payload.count,
        loadMoreRecent: false,
        refreshRecent: false,
        loadingRecent: false,
        showLoader: false,
        loaderText: 'Loading...'
      };
      break;
    case SET_TIMELINE_LIST:
      newState.isTimelineEnded = false;
      let timelineList = [];
      if (action.payload.isLoading) {
        timelineList = action.payload.data;
      } else if (action.payload.isRefresh) {
        timelineList = action.payload.data.concat(newState.timelineList);
      } else {
        timelineList = newState.timelineList;
        let lastElement = timelineList[newState.timelineList.length - 1];
        action.payload.data.forEach((element: any, index: any) => {
          if (element.nid !== lastElement.nid) {
            timelineList.push(element);
          }
        });
      }
      // showConsoleLog(ConsoleType.LOG,"item.item.timelineList ,", JSON.stringify(timelineList))
      newState = {
        ...newState,
        timelineList: timelineList,
        timelineCount: action.payload.count,
        jumpToYears: action.payload.sorted_unique_years,
        loadMoreTimeline: false,
        refreshTimeline: false,
        loadingTimeline: false,
        showLoader: false,
        loaderText: 'Loading...'
      };
      break;
    case SET_LOADING_TIMELINE:
      newState = {
        ...newState,
        loadMoreTimeline: action.payload.isLoadMore,
        refreshTimeline: action.payload.isRefresh,
        loadingTimeline: action.payload.isLoading,
      };
      break;
    case SET_LOADING_RECENT:
      newState = {
        ...newState,
        loadMoreRecent: action.payload.isLoadMore,
        refreshRecent: action.payload.isRefresh,
        loadingRecent: action.payload.isLoading,
      };
      break;

    case RESET_ON_LOGIN:
      newState = {
        ...newState,
        recentList: [],
        timelineList: [],
        filterDataTimeline: {},
        filterDataRecent: {},
        jumpToYears: [],
        active_prompts: [],
        loadMoreTimeline: false,
        loadMoreRecent: false,
        refreshTimeline: false,
        refreshRecent: false,
        loadingRecent: true,
        loadingTimeline: true,
        recentCount: 0,
        timelineCount: 0,
        jumpToCalled: false,
      };
      break;
    case REMOVE_PROMPT:
      newState.recentList[action.payload.firstIndex].active_prompts.splice(
        action.payload.secondIndex,
        1,
      );
      break;
    case MEMORY_ACTIONS_DASHBOARD:
      newState.recentList = filteredList(action.payload, newState.recentList);
      newState.timelineList = filteredList(
        action.payload,
        newState.timelineList,
      );
      break;
  }
  return newState;
};

const filteredList = (payload: any, list: any) => {
  if (payload.type == MemoryActionKeys.removeMeFromThisPostKey) {
    list.forEach((element: any, index: any) => {
      if (element.nid == payload.nid) {
        delete list[index].actions_on_memory.remove_me_from_this_post;
      }
    });
  } else if (
    payload.type == MemoryActionKeys.blockAndReportKey ||
    payload.type == MemoryActionKeys.blockUserKey
  ) {
    list = list.filter(
      (element: any) => element.user_details.uid != payload.uid,
    );
  } else if (payload.type == MemoryActionKeys.addToCollection) {
  } else {
    list = list.filter((element: any) => element.nid != payload.nid);
  }
  // showConsoleLog(ConsoleType.LOG,'This is list refractoring : ', payload, list);
  return list;
};

function* fetchFilters(params: any, CB: any) {
  return newMemoryService(`https://${Account.selectedData().instanceURL}/api/timeline/filters`, params,
    res => CB(res))
  // .then((response: Response) => response.json())
  // .catch((err: Error) => Promise.reject(err));
}

function* fetchMemoryList(params: any, CB: any) {
  showConsoleLog(ConsoleType.LOG, 'input request..', JSON.stringify(params));
  return newMemoryService(
    `https://${Account.selectedData().instanceURL}/api/timeline/list`,
    params,
    resp => CB(resp)
  )
  // .then((response: Response) => response.json())
  // .catch((err: Error) => Promise.reject(err));
}

/**
 * Login Process Generator
 * @param params
 */
function* getFiltersTimeLine(action: any) {
  try {
    let data = yield call(async function () {
      return Storage.get('userData');
    });
    let dataset = {};
    let request = yield call(fetchFilters,
      [{ "X-CSRF-TOKEN": data.userAuthToken, "Content-Type": "application/json" },
      {
        "details": {
          "type": action.payload.type
        },
        "configurationTimestamp": "0"
      }
      ],
      responseBody => {
        if (responseBody.ResponseCode == 200) {
          responseBody.Details.allSelected = { name: 'All', id: 'all', value: 1 }
          responseBody.Details.cueSelected = { name: 'My Stories Matter', id: 'msm', value: 1 };

          if (responseBody.Details && responseBody.Details.timeline_years) {

            DefaultPreference.set('timeline_years', JSON.stringify(responseBody.Details.timeline_years)).then(function () {
            });
            Account.selectedData().start_year = responseBody.Details.timeline_years.start_year;
            Account.selectedData().end_year = responseBody.Details.timeline_years.end_year;
          }

          dataset = responseBody.Details
        }
      }
    );

    const responseBody = yield call(async function () {
      return await request;
    });

    yield put({ type: SET_TIMELINE_FILTERS, payload: yield dataset })

  } catch (err) {
    showConsoleLog(ConsoleType.LOG, err);
  }
}

/**
 * Login Process Generator
 * @param params
 */
function* getFiltersRecent(action: any) {
  try {
    let data = yield call(async function () {
      return Storage.get('userData');
    });
    let dataSet: any = {}
    let request = yield call(fetchFilters, [
      { 'X-CSRF-TOKEN': data.userAuthToken, 'Content-Type': 'application/json' },
      {
        details: {
          type: action.payload.type,
        },
        configurationTimestamp: '0',
      },
    ],
      responseBody => {
        if (responseBody.ResponseCode == 200) {
          responseBody.Details.allSelected = { name: 'All', id: 'all', value: 1 };
          dataSet = responseBody.Details.allSelected;
        }
      });
    const responseBody = yield call(async function () {
      return await request;
    });

    yield put({ type: SET_RECENT_FILTERS, payload: yield dataSet });

  } catch (err) {
    showConsoleLog(ConsoleType.LOG, err);
  }
}

function* getMemoryList(action: any) {
  try {
    let obj = getCallerObject(action);
    yield put({
      type:
        action.payload.type === ListType.Recent
          ? SET_LOADING_RECENT
          : SET_LOADING_TIMELINE,
      payload: {
        isLoading: action.payload.isLoading,
        isRefresh: action.payload.isRefresh,
        isLoadMore: action.payload.isLoadMore,
      },
    });

    let data = yield call(async function () {
      return Storage.get('userData');
    });
    let dataSet = []
    let request = yield call(fetchMemoryList, [
      { 'X-CSRF-TOKEN': data.userAuthToken, 'Content-Type': 'application/json' },
      obj
    ],
      async (responseBody) => {
        if (responseBody.ResponseCode == 200) {
          // showConsoleLog(ConsoleType.LOG,"recent data : ",JSON.stringify(responseBody.Details.data))
          responseBody.Details.data = DashboardDataModel.getConvertedData(
            responseBody.Details.data,
          );
          responseBody.Details.isLoadMore = action.payload.isLoadMore;
          if (
            responseBody.Details.api_random_prompt_data &&
            responseBody.Details.api_random_prompt_data.length &&
            responseBody.Details.api_random_prompt_data.length > 0
          ) {
            responseBody.Details.data.push({
              isPrompt: true,
              active_prompts: responseBody.Details.api_random_prompt_data,
            });
          }
          dataSet = await responseBody.Details;
          EventManager.callBack('loadingDone');
        }
      });
    const responseBody = yield call(async function () {
      return await request;
    });
    if (dataSet.length !== 0) {
      yield put({ type: SET_RECENT_LIST, payload: yield dataSet });
    }
    else {
      yield put({ type: SHOW_LOADER_READ, payload: false });
    }

  } catch (err) {
    showConsoleLog(ConsoleType.LOG, err);
  }
}

function* getTimelineList(action: any) {
  try {
    let obj = getCallerObject(action);
    yield put({
      type:
        action.payload.type === ListType.Recent
          ? SET_LOADING_RECENT
          : SET_LOADING_TIMELINE,
      payload: {
        isLoading: action.payload.isLoading,
        isRefresh: action.payload.isRefresh,
        isLoadMore: action.payload.isLoadMore,
      },
    });
    let data = yield call(async function () {
      return Storage.get('userData');
    });
    let dataSet = {};

    let request = yield call(fetchMemoryList, [
      { 'X-CSRF-TOKEN': data.userAuthToken, 'Content-Type': 'application/json' },
      obj,
    ],
      async (responseBody) => {
        if (responseBody.ResponseCode == 200) {
          // showConsoleLog(ConsoleType.LOG,"Time line data : ",JSON.stringify(responseBody))
          responseBody.Details.data = DashboardDataModel.getConvertedData(
            responseBody.Details.data,
          );
          // showConsoleLog(ConsoleType.LOG,"responseBody ,", JSON.stringify(responseBody.Details.data));
          responseBody.Details.isLoadMore = action.payload.isLoadMore;
          responseBody.Details.isLoading = action.payload.isLoading;
          responseBody.Details.isRefresh = action.payload.isRefresh;
          debugger;
          responseBody.Details.sorted_unique_years = makeMultiDimArray(
            responseBody.Details.sorted_unique_years,
            4,
          );
          dataSet = await responseBody.Details;
          // showConsoleLog(ConsoleType.LOG,"res 1...",responseBody.Details.data);
          EventManager.callBack('loadingDone');
        }
      });
    const responseBody = yield call(async function () {
      return await request;
    });

    yield put({ type: SET_TIMELINE_LIST, payload: dataSet });
    // {
    //     "type": "timeline",
    //     "configurationTimestamp": "0",
    //     "searchTerm": {
    //       "prompt_pagination": 0,
    //       "length": 5,
    //       "searchString": "",
    //       "timeline_start_year": "2016",
    //       "timeline_end_year": "2020",
    //       "year_option": "my_years"
    //     },
    //     "randomPrompts": 0
    //   }
    // showConsoleLog(ConsoleType.LOG,"responseBody ,", JSON.stringify(responseBody));


  } catch (err) {
    showConsoleLog(ConsoleType.LOG, err);
  }
}

const getCallerObject = (action: any) => {
  // showConsoleLog(ConsoleType.WARN, 'action >', JSON.stringify(action));
  if (action.payload.type == ListType.Recent) {
    if (action.payload.isLoading) {
      promptPagination = 0;
    } else {
      promptPagination++;
    }
  }
  promptPagination;

  let start_Year =
    Account.selectedData().start_year != ''
      ? Account.selectedData().start_year
      : '';
  let end_year =
    Account.selectedData().end_year != ''
      ? Account.selectedData().end_year
      : new Date().getFullYear();
  DefaultPreference.get('timeline_years').then((value: any) => {
    if (value) {
      value = JSON.parse(value);
      start_Year = value.start_year;
      end_year = value.end_year;
    }
  });

  let obj: any = {
    type: action.payload.type,
    configurationTimestamp: '0',
    searchTerm: {
      prompt_pagination: promptPagination,
      length: action.payload.isLoading ? 5 : 10,
      searchString: '',
      timeline_start_year: start_Year,
      timeline_end_year: end_year,
      year_option: 'my_years',
    },
    randomPrompts:
      action.payload.type == ListType.Recent && !action.payload.isLoading
        ? 1
        : 0,
  };

  if (action.payload.jumpTo) {
    obj.searchTerm.year_data_to_load = action.payload.selectedYear;
    obj.searchTerm.month_to_load = action.payload.selectedMonth;
  }

  if (action.payload.filters != null) {
    obj = { ...obj, filter: convertFilterObject(action.payload.filters) };
  }

  if (action.payload.isLoadMore) {
    obj.searchTerm = {
      ...obj.searchTerm,
      request_type: 'older',
      last_memory_date: action.payload.lastMemoryDate,
    };
  }

  if (action.payload.loadPrevious) {
    obj.searchTerm = {
      ...obj.searchTerm,
      request_type: 'newer',
      last_memory_date: action.payload.lastMemoryDate,
    };
  }

  return obj;
};

const objectToArray = (obj: any) => {
  // var result = Object.keys(obj).map((key) => [Number(key), obj[key]]);
  var result: Array<any> = [];
  for (let key in obj) {
    obj[key].pattern = obj[key].pattern ? obj[key].pattern : '';
    if (obj[key].pattern.length == 0) {
      result.push({ id: `${key}`, value: obj[key] });
    }
  }
  showConsoleLog(ConsoleType.LOG, result);
  return result;
};

const makeMultiDimArray = (obj: any, length: any) => {
  debugger;
  let convertedArray = [];
  while (obj.length > 0) {
    let chunk = obj.splice(0, length);
    convertedArray.push(chunk);
  }
  return convertedArray;
};

const convertFilterObject = (obj: any) => {
  let filters: any = {};
  let mystories: any = {};
  let external_cues: any = {};
  let groups = {};
  let id = '';
  let value = '';
  for (let key in obj.mystories) {
    if (key == 'groups') {
      mystories.groups = {};
      for (let key1 in obj.mystories.groups) {
        id = `${obj.mystories.groups[key1].id}`;
        value = `${obj.mystories.groups[key1].value}`;
        mystories.groups[id] = value;
      }
    } else {
      id = `${obj.mystories[key].id}`;
      value = `${obj.mystories[key].value}`;
      mystories[id] = value;
    }
  }
  filters.mystories = mystories;
  filters.save_filters = 0;
  if (obj.external_cues) {
    for (let key in obj.external_cues.categories) {
      id = `${obj.external_cues.categories[key].id}`;
      value = `${obj.external_cues.categories[key].value}`;
      external_cues[id] = value;
    }
    filters.external_cues = external_cues;
  }

  return filters;
};

export function* dashboardServiceCaller() {
  yield all([
    takeLatest(GET_FILTERS_DATA, getFiltersRecent),
    takeLatest(GET_FILTERS_DATA_TIMELINE, getFiltersTimeLine),
    takeLatest(GET_MEMORY_LIST, getMemoryList),
    takeLatest(GET_TIMELINE_LIST, getTimelineList),
  ]);
}
