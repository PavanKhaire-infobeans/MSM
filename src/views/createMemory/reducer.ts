import moment from "moment";
import { showConsoleLog, ConsoleType } from "../../common/constants";

export const ResetLocation = 'resetLocation';
export const LocationListUpdated = 'locationListUpdated';
export const MemoryInitialsUpdate = 'memoryInitialsUpdate';
export const RecentTags = 'recentTags';
export const SelectedLocation = 'selectedLocation';
export const ResetALL = 'resetAll';
export const SaveMemoryTagsList = 'saveList';
export const SaveWhoElseWhereThere = 'saveWhoElseWhereThere';
export const SaveSearchList = 'saveSearchList';
export const CollectionList = 'collectionList';
export const SaveCollection = 'saveCollection';
export const SaveShareOption = 'saveShareOptions';
export const SaveCollaborators = 'saveCollaborators';
export const SaveNid = 'saveNid';
export const showCustomAlert = 'showCustomAlert';
export const showCustomAlertData = 'showCustomAlertData';
export const SaveAttachedFile = 'saveAttachedFile';
export const SaveWhoCanSeeIds = 'saveWhoCanSeeIds';
export const SaveCollaboratorNotes = 'saveCollaboratorsNotes';
export const SaveDescription = 'saveDescription';
export const EditContent = 'editContent';
export const NavigateToDashboard = 'navigateToDashboard';

type Payload = { type: string; payload: any };

const initialState: any = {
  title: '',
  description: '',
  date: { year: '', month: '', day: '' },
  locationList: [],
  location: {},
  tags: [],
  recentTags: [],
  whoElseWhereThere: [],
  whoCanSeeMemoryUids: [],
  whoCanSeeMemoryGroupIds: [],
  shareOption: 'only_me',
  files: [],
  collectionList: [],
  collections: {},
  searchList: [],
  collaborators: [],
  nid: 0,
  notesToCollaborators: '',
  deleteFiles: [],
  showAlert: false,
  goToDashboard: false,
  showAlertData: { },
};

export const MemoryInitials = (state = initialState, action: Payload) => {
  let newState: any = { ...state };
  switch (action.type) {
    case ResetLocation:
      newState.locationList = [];
      break;
    case ResetALL:
      newState = initialState;
      break;
    case LocationListUpdated:
      newState.locationList = action.payload;
      break;
    case SaveNid:
      newState.nid = action.payload;
      break;
    case MemoryInitialsUpdate:
      newState.title = action.payload.title;

      if ((parseInt(action.payload?.memory_date?.year) > new Date().getUTCFullYear())) {
        action.payload.memory_date = {"day": new Date().getUTCDate().toString(), "month": new Date().getUTCMonth()+1, "year": new Date().getUTCFullYear()?.toString()};
      }
      else if ((parseInt(action.payload?.memory_date?.year) == new Date().getUTCFullYear())) {
        if ((parseInt(action.payload?.memory_date?.month) > (new Date().getUTCMonth()+1))) {
          action.payload.memory_date = {"day": new Date().getUTCDate().toString(), "month": new Date().getUTCMonth()+1, "year": new Date().getUTCFullYear()?.toString()};
        }
      }
      else if ((parseInt(action.payload?.memory_date?.year) <= new Date().getUTCFullYear())) {
        if ((parseInt(action.payload?.memory_date?.month) == (new Date().getUTCMonth()+1))&&(parseInt(action.payload?.memory_date?.day) > new Date().getUTCDate())) {
          action.payload.memory_date = {"day": new Date().getUTCDate().toString(), "month": new Date().getUTCMonth()+1, "year": new Date().getUTCFullYear()?.toString()};
        }
      }

      newState.date = action.payload.memory_date;
      // {
      //   year: action.payload.memory_date.year,
      //   month: action.payload.memory_date.month,
      //   day: action.payload.memory_date.day,
      // };
      console.error("action.payload.location :",action.payload.location)
      newState.location = action.payload.location;
      newState.files = action.payload.files;
      break;
    case RecentTags:
      newState.recentTags = action.payload;
    case SelectedLocation:
      newState.location = action.payload;
      break;
    case SaveSearchList:
      newState.searchList = action.payload;
      break;
    case SaveMemoryTagsList:
      newState.tags = action.payload;
      break;
    case SaveWhoElseWhereThere:
      newState.whoElseWhereThere = action.payload;
      break;
    case CollectionList:
      newState.collectionList = action.payload;
      break;
    case SaveCollection:
      newState.collections = action.payload;
      break;
    case SaveShareOption:
      newState.shareOption = action.payload;
      break;
    case SaveCollaborators:
      newState.collaborators = action.payload.users.concat(
        action.payload.groups,
      );
      break;
    case SaveAttachedFile:
      newState.files = action.payload;
      break;
    case SaveWhoCanSeeIds:
      newState.whoCanSeeMemoryUids = action.payload.userIds;
      newState.whoCanSeeMemoryGroupIds = action.payload.groupIds;
      break;
    case SaveCollaboratorNotes:
      newState.notesToCollaborators = action.payload;
      break;
    case SaveDescription:
      newState.description = action.payload;
      break;
    case EditContent:
      newState = action.payload;
      break;
    case NavigateToDashboard:
      newState.goToDashboard = action.payload;
      break;
    case showCustomAlert:
      newState.showAlert = action.payload;
      break;
    case showCustomAlertData:
      newState.showAlertData = action.payload;
      // showConsoleLog(ConsoleType.LOG,"custom Alert:", newState.showAlert)
      break;
  }
  return newState;
};
