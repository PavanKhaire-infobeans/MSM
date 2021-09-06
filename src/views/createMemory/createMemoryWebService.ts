import {
  Storage,
  asyncGen,
  getValue,
  uploadTask,
  TimeStampMilliSeconds,
} from '../../common/constants';
import {Account} from '../../common/loginStore';
import {MemoryService} from '../../common/webservice/memoryServices';
import EventManager from '../../common/eventManager';
import {TempFile} from '../mindPop/edit';
import {CollaboratorsAction} from './inviteCollaborators';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import {Alert} from 'react-native';

export const kCollectionMemories = 'CollectionMemories';
export const kCollectionUpdated = 'CollectionUpdated';
export const kSequenceUpdated = 'SequenceUpdated';
export const kInitialSave = 'InitialSave';
export const kDeleteDraft = 'DeleteDraft';
export const kDeleteDraftCreateMemo = 'DeleteDraft';
export const kCollaboratorsAdded = 'collaboratorsAdded';
export const kCollaboratorsActions = 'collaboratorsAction';
export const kFilesUpdated = 'filesUpdated';
export const kDraftDetailsFetched = 'draftDetails';
export const promptIdListener = 'promptToMemoryConvert';
export const CreateUpdateMemory = async (
  params: any,
  filesToUpload: any,
  listener: any,
  key?: any,
) => {
  try {
    console.log('params..', params);
    let data = await Storage.get('userData');
    let response = await MemoryService(
      `https://${Account.selectedData().instanceURL}/api/mystory/create_update`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {details: params},
      ],
    )
      .then((response: Response) => response.json())
      .catch((err: Error) => {
        Promise.reject(err);
      });

    if (response.ResponseCode == 200) {
      //	Alert.alert("parseInt(getValue(response))"+ JSON.stringify(response));
      let id = parseInt(getValue(response, ['Status'])) || 0;
      let prompt_id = parseInt(getValue(response, ['promptId'])) || 0;
      let padDetails = {
        padId: getValue(response, ['padid']),
        padUrl: getValue(response, ['etherpad_url']),
        sessionId: getValue(response, ['sessionId']),
      };
      if (id == 0) {
        EventManager.callBack(listener, false, 'Could not save MindPop');
        return;
      }

      if (filesToUpload.length > 0) {
        await uploadAttachments(id, filesToUpload);
        loaderHandler.hideLoader();
        EventManager.callBack(listener, true, id, padDetails, key);
      } else {
        loaderHandler.hideLoader();
        EventManager.callBack(listener, true, id, padDetails, key, prompt_id);
      }
    } else {
      loaderHandler.hideLoader();
      EventManager.callBack(listener, false, response['ResponseMessage']);
    }
  } catch (err) {
    loaderHandler.hideLoader();
    EventManager.callBack(listener, false, 'Unable to create memory!!');
  }
};

export const GetDraftsDetails = async (nid: any) => {
  try {
    let data = await Storage.get('userData');
    let response = await MemoryService(
      `https://${
        Account.selectedData().instanceURL
      }/api/mystory/edit_memory_values`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {
          configurationTimestamp: '0',
          details: {
            nid: nid,
          },
        },
      ],
    )
      .then((response: Response) => response.json())
      .catch((err: Error) => {
        Promise.reject(err);
      });
    if (response != undefined && response != null) {
      if (response.ResponseCode == 200) {
        EventManager.callBack(kDraftDetailsFetched, true, response['Data']);
      } else {
        EventManager.callBack(
          kDraftDetailsFetched,
          false,
          response['ResponseMessage'],
        );
      }
    }
  } catch (err) {
    EventManager.callBack(
      kDraftDetailsFetched,
      false,
      'Unable to process your request. Please try again later',
    );
  }
};

export const GetCollectionDetails = async (memoryId: any) => {
  try {
    let data = await Storage.get('userData');
    let response = await MemoryService(
      `https://${
        Account.selectedData().instanceURL
      }/api/collection/list_collection_memories`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {
          details: {
            collection_tid: memoryId,
          },
        },
      ],
    )
      .then((response: Response) => response.json())
      .catch((err: Error) => {
        Promise.reject(err);
      });

    if (response.ResponseCode == 200) {
      let collectionMemories = getValue(response, ['CollectionMemories']);
      if (collectionMemories.length > 0) {
        EventManager.callBack(kCollectionMemories, true, collectionMemories);
      } else {
        EventManager.callBack(kCollectionMemories, true, []);
      }
    } else {
      EventManager.callBack(kCollectionMemories, false);
    }
  } catch (err) {
    EventManager.callBack(
      kCollectionMemories,
      false,
      'Unable to get memory details',
    );
  }
};

export const UpdateAttachments = async (
  nid: any,
  fileDetails: any,
  key: any,
) => {
  try {
    let data = await Storage.get('userData');
    let response = await MemoryService(
      `https://${
        Account.selectedData().instanceURL
      }/api/mystory/edit_delete_file`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {details: {nid: nid, type: 'my_stories', file_details: fileDetails}},
      ],
    )
      .then((response: Response) => response.json())
      .catch((err: Error) => {
        Promise.reject(err);
      });

    if (response.ResponseCode == 200) {
      EventManager.callBack(kFilesUpdated, true, key);
    } else {
      EventManager.callBack(kFilesUpdated, false, response.ResponseMessage);
    }
  } catch (err) {
    EventManager.callBack(kFilesUpdated, false, 'Unable to update memory');
  }
};

export const UpdateMemoryCollection = async (
  params: any,
  isSequenceUpdated: any,
) => {
  let callBack = kCollectionUpdated;
  try {
    if (isSequenceUpdated) {
      callBack = kSequenceUpdated;
    }
    let data = await Storage.get('userData');
    let response = await MemoryService(
      `https://${Account.selectedData().instanceURL}/api/collection/add_edit`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {details: params},
      ],
    )
      .then((response: Response) => response.json())
      .catch((err: Error) => {
        Promise.reject(err);
      });

    if (response.ResponseCode == 200) {
      EventManager.callBack(callBack, true, response);
    } else {
      EventManager.callBack(callBack, false);
    }
  } catch (err) {
    EventManager.callBack(callBack, false);
  }
};

export const InviteCollaborators = async (
  nid: any,
  friendsList: any,
  friendCircle: any,
  note: '',
) => {
  try {
    let data = await Storage.get('userData');
    let response = await MemoryService(
      `https://${Account.selectedData().instanceURL}/api/collaborator/invite`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {
          details: {
            nid: nid,
            user_ids: friendsList,
            group_ids: friendCircle,
            note: note,
          },
        },
      ],
    )
      .then((response: Response) => response.json())
      .catch((err: Error) => {
        Promise.reject(err);
      });

    if (response.ResponseCode == 200) {
      EventManager.callBack(kCollaboratorsAdded, true, response);
    } else {
      EventManager.callBack(kCollaboratorsAdded, false);
    }
  } catch (err) {
    EventManager.callBack(kCollaboratorsAdded, false);
  }
};

export const DeleteDraftService = async (
  id: any,
  action: any,
  listener: any,
) => {
  try {
    let data = await Storage.get('userData');
    let response = await MemoryService(
      `https://${Account.selectedData().instanceURL}/api/actions/memory`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {
          details: {
            id: id,
            type: 'my_stories',
            action_type: action,
          },
        },
      ],
    )
      .then((response: Response) => response.json())
      .catch((err: Error) => {
        Promise.reject(err);
      });

    if (response.ResponseCode == 200) {
      EventManager.callBack(listener, true, response, id);
    } else {
      EventManager.callBack(listener, false);
    }
  } catch (err) {
    EventManager.callBack(listener, false);
  }
};

export const CollaboratorActionAPI = async (params: any) => {
  try {
    let data = await Storage.get('userData');
    let response = await MemoryService(
      `https://${Account.selectedData().instanceURL}/api/collaborator/actions`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {configurationTimestamp: '0', details: params},
      ],
    )
      .then((response: any) => response.json())
      .catch((err: Error) => {
        Promise.reject(err);
      });

    if (response.ResponseCode == 200) {
      if (params.action_type == CollaboratorsAction.leaveConversation) {
        EventManager.callBack(kCollaboratorsActions, true, true);
      } else {
        EventManager.callBack(kCollaboratorsActions, true);
      }
    } else {
      EventManager.callBack(kCollaboratorsActions, false);
    }
  } catch (err) {
    //console.log(err);
    EventManager.callBack(kCollaboratorsActions, false);
  }
};

async function uploadAttachments(memoryId: number, files: TempFile[]) {
  return new Promise((resolve, reject) => {
    asyncGen(function* () {
      try {
        var resp: any[] = [];
        for (let fl of files) {
          let rsp = yield uploadFile(memoryId, fl);
          resp.push(rsp);
        }
        resolve(resp);
      } catch (err) {
        //console.log("Error in uploading files: ", err)
        reject(err);
      }
    });
  });
}

async function uploadFile(memoryId: number, file: TempFile) {
  var filePath = file.filePath;
  // if (Platform.OS == "android") {
  filePath = filePath.replace('file://', '');
  // }
  let options: {[x: string]: any} = {
    url: `https://${
      Account.selectedData().instanceURL
    }/api/mystory/file_upload`,
    path: filePath,
    method: 'POST',
    ...(file.type == 'audios' ? {name: file.filename} : {}),
    field: file.type == 'images' ? 'image' : file.type,
    type: 'multipart',
    headers: {
      'content-type': 'multipart/form-data',
      'X-CSRF-TOKEN': Account.selectedData().userAuthToken,
    },
  };
  if (memoryId) {
    options['parameters'] = {
      nid: `${memoryId}`,
      file_title: `${file.file_title}`,
      file_description: `${file.file_description}`,
    };
  }

  if (getValue(file, ['filename'])) {
    options['parameters'] = {
      ...options['parameters'],
      title: getValue(file, ['filename']),
    };
  }
  return new Promise((resolve, reject) => {
    uploadTask(
      (data: any) => {
        //console.log("After upload", data);
        let response = JSON.parse(data.responseBody);
        if (response.ResponseCode == '200') {
          resolve(response);
        } else {
          reject(response);
        }
      },
      (err: Error) => {
        //console.log("Upload error!", err);
        reject(err);
      },
    )(options);
  });
}
