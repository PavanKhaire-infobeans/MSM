import {takeLatest, put, call, all, delay} from 'redux-saga/effects';
import {MemoryService} from '../../common/webservice/memoryServices';
import {Storage, getValue, TimeStampMilliSeconds} from '../../common/constants';
import {Account} from '../../common/loginStore';
import {
  LocationListUpdated,
  RecentTags,
  SaveSearchList,
  CollectionList,
  SaveCollaborators,
  SaveDescription,
} from './reducer';
import EtherPadEditing from './etherpadWebView';

export const kLocationFetched = 'fetchLocation';
export const LocationAPI = 'locationAPI';
export const MemoryTagsAPI = 'memoryTagsAPI';
export const kRecentTags = 'recent';
export const kSearchTags = 'search';
export const UserSearchAPI = 'userSearch';
export const kUsers = 'user';
export const kUserCircles = 'circle';
export const CollectinAPI = 'collectionAPI';
export const CollaboratorsAPI = 'collaboratorsAPI';
export const EtherPadContentAPI = 'etherPadContentAPI';
function* getListLocations(params: any) {
  delay(500);
  return MemoryService(
    `https://${Account.selectedData().instanceURL}/api/location/get`,
    params,
  )
    .then((response: Response) => response.json())
    .catch((err: Error) => Promise.reject(err));
}

function* getMemoryTagsList(params: any) {
  delay(500);
  return MemoryService(
    `https://${Account.selectedData().instanceURL}/api/get/memory_tags`,
    params,
  )
    .then((response: Response) => response.json())
    .catch((err: Error) => Promise.reject(err));
}

function* getUserList(params: any) {
  delay(500);
  return MemoryService(
    `https://${Account.selectedData().instanceURL}/api/get/users`,
    params,
  )
    .then((response: Response) => response.json())
    .catch((err: Error) => Promise.reject(err));
}

function* getCollectionList(params: any) {
  delay(500);
  return MemoryService(
    `https://${Account.selectedData().instanceURL}/api/collection/list`,
    params,
  )
    .then((response: Response) => response.json())
    .catch((err: Error) => Promise.reject(err));
}

function* getCollaboratorsList(params: any) {
  delay(500);
  return MemoryService(
    `https://${Account.selectedData().instanceURL}/api/collaborator/list`,
    params,
  )
    .then((response: Response) => response.json())
    .catch((err: Error) => Promise.reject(err));
}

function* etherpadEditing(params: any) {
  return MemoryService(
    `https://${Account.selectedData().instanceURL}/api/etherpad/get_set_text`,
    params,
  )
    .then((response: Response) => response.json())
    .catch((err: Error) => Promise.reject(err));
}

function* getMemoryTags(requestData: any) {
  try {
    let searchType = requestData.payload.searchType;
    let data = yield call(async function () {
      return Storage.get('userData');
    });
    let request = yield call(getMemoryTagsList, [
      {'X-CSRF-TOKEN': data.userAuthToken, 'Content-Type': 'application/json'},
      {
        details: {
          search_string: requestData.payload.searchTerm,
          type: searchType,
        },
      },
    ]);
    const responseBody = yield call(async function () {
      return await request;
    });
    let value = '';
    if (searchType == kSearchTags) {
      value = getValue(responseBody, ['MemoryTags']);
      if (value && value.length > 0) {
        yield put({type: SaveSearchList, payload: value});
      } else {
        yield put({
          type: SaveSearchList,
          payload: [
            {
              tid: TimeStampMilliSeconds(),
              name: requestData.payload.searchTerm,
            },
          ],
        });
      }
    } else {
      value = getValue(responseBody, ['RecentTags']);
      if (value.length > 0) {
        yield put({type: RecentTags, payload: value});
      }
    }
  } catch (err) {
    //console.log(err);
  }
}

function* getUsers(requestData: any) {
  try {
    let searchType = requestData.payload.searchType;
    let data = yield call(async function () {
      return Storage.get('userData');
    });
    let request = yield call(getUserList, [
      {'X-CSRF-TOKEN': data.userAuthToken, 'Content-Type': 'application/json'},
      {
        details: {
          string: requestData.payload.searchTerm,
          search_type: searchType,
        },
      },
    ]);
    const responseBody = yield call(async function () {
      return await request;
    });
    let value = '';
    if (searchType == kUsers) {
      value = getValue(responseBody, ['UserList', 'query_result']);
    } else {
      value = getValue(responseBody, ['UserList', 'query_result_circle']);
    }
    if (value.length > 0) {
      yield put({type: SaveSearchList, payload: value});
    } else {
      yield put({
        type: SaveSearchList,
        payload: [
          {
            name:
              "We couldn't find any Friend Circle that matched " +
              requestData.payload.searchTerm +
              '. Try searching for another Friend Circle.',
            field_first_name_value:
              "We couldn't find anyone that matched " +
              requestData.payload.searchTerm +
              '. Try searching for someone else.',
            field_last_name_value: '',
            uid: -1,
            id: -1,
          },
        ],
      });
    }
  } catch (err) {
    //console.log(err);
  }
}

function* getCollections() {
  try {
    let data = yield call(async function () {
      return Storage.get('userData');
    });
    let request = yield call(getCollectionList, [
      {'X-CSRF-TOKEN': data.userAuthToken, 'Content-Type': 'application/json'},
      {
        details: {
          offset: 0,
        },
      },
    ]);
    const responseBody = yield call(async function () {
      return await request;
    });
    let value = getValue(responseBody, ['Collections']);
    if (value.length > 0) {
      yield put({type: CollectionList, payload: value});
    }
  } catch (err) {
    //console.log(err);
  }
}

function* getLocationList(requestData: any) {
  try {
    let data = yield call(async function () {
      return Storage.get('userData');
    });
    let request = yield call(getListLocations, [
      {'X-CSRF-TOKEN': data.userAuthToken, 'Content-Type': 'application/json'},
      {
        details: {
          str: requestData.payload,
        },
      },
    ]);
    const responseBody = yield call(async function () {
      return await request;
    });
    let value = getValue(responseBody, ['LocationData']);
    if (value.length > 0) {
      yield put({type: LocationListUpdated, payload: value});
    }
  } catch (err) {
    //console.log(err);
  }
}

function* getCollaborators(requestData: any) {
  try {
    let data = yield call(async function () {
      return Storage.get('userData');
    });
    let request = yield call(getCollaboratorsList, [
      {'X-CSRF-TOKEN': data.userAuthToken, 'Content-Type': 'application/json'},
      {
        configurationTimestamp: TimeStampMilliSeconds(),
        details: {
          nid: requestData.payload,
        },
      },
    ]);
    const responseBody = yield call(async function () {
      return await request;
    });
    let value = getValue(responseBody, ['data']);
    if (value.groups || value.users) {
      yield put({type: SaveCollaborators, payload: value});
    }
  } catch (err) {
    //console.log(err);
  }
}

function* etherPadEditing(requestData: any) {
  try {
    let data = yield call(async function () {
      return Storage.get('userData');
    });
    let request = yield call(etherpadEditing, [
      {'X-CSRF-TOKEN': data.userAuthToken, 'Content-Type': 'application/json'},
      {
        details: {
          pad_id: requestData.payload.padId,
          text: requestData.payload.content,
          type: requestData.payload.type,
        },
      },
    ]);
    const responseBody = yield call(async function () {
      return await request;
    });
    if (requestData.payload.type == 'get') {
      let value = getValue(responseBody, ['Data']);
      if (value.text) {
        yield put({type: SaveDescription, payload: value.text.trim()});
      }
    }
  } catch (err) {
    //console.log(err);
  }
}

export function* watchCreateMemories() {
  yield all([
    takeLatest(LocationAPI, getLocationList),
    takeLatest(MemoryTagsAPI, getMemoryTags),
    takeLatest(UserSearchAPI, getUsers),
    takeLatest(CollectinAPI, getCollections),
    takeLatest(CollaboratorsAPI, getCollaborators),
    takeLatest(EtherPadContentAPI, etherPadEditing),
  ]);
}
