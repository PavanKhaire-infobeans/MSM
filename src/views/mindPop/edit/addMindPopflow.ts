import {
  getValue,
  Storage,
  TimeStampMilliSeconds,
  uploadTask,
  ERROR_MESSAGE,
  asyncGen,
  MindPopsInProgress,
  decode_utf8,
} from '../../../common/constants';
import MindPopStore from '../../../common/database/mindPopStore/mindPopStore';
import EventManager from '../../../common/eventManager';
import { Account } from '../../../common/loginStore';
import {
  addMindPops,
  getMindPopWithId,
} from '../../../common/webservice/mindPopServices';
import { action_picture } from '../../../images';
import { TempFile } from '.';
import { Platform } from 'react-native';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';

export const kAddEditIdentifier = 'kAddEditIdentifier';
export const kMindpopContentIdentifier = 'kMindpopContentIdentifier';
export const kMindPopUploadedIdentifier = 'kUploadMindPopIdentifier';

/**
 * Add/Edit mindpop request flow
 * @param param data to be updated
 * @param files files to be uploaded
 */
export const addEditMindPop = async (
  param: any,
  files: TempFile[] = [],
  uploadInBackgroud?: boolean,
) => {
  try {
    let data = await Storage.get('userData');
    let response = await (() => {
      return addMindPops(
        `https://${Account.selectedData().instanceURL}`,
        param,
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
      )
        .then((response: Response) => response.json())
        .catch((err: Error) => Promise.reject(err));
    })();
    let mindpopId = parseInt(getValue(response, ['MindpopId'])) || 0;
    if (mindpopId == 0) {
      EventManager.callBack(
        kAddEditIdentifier,
        false,
        'Could not save MindPop',
      );
      return;
    }

    if (files.length > 0) {
      //MindPopsInProgress.push(mindpopId);
      await uploadAttachments(mindpopId, files);
      loaderHandler.hideLoader();
      EventManager.callBack(kMindPopUploadedIdentifier, true, mindpopId);
    } else {
      loaderHandler.hideLoader();
      EventManager.callBack(kMindPopUploadedIdentifier, true, mindpopId);
    }
    loaderHandler.hideLoader();

    // Get List from server
    let listRequestParams = {
      searchTerm: {
        mindPopID: mindpopId,
      },
      configurationTimestamp: TimeStampMilliSeconds(),
      lastSyncTimeStamp: '0',
    };
    let responseList = await (() => {
      return getMindPopWithId(`https://${Account.selectedData().instanceURL}`, [
        listRequestParams,
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
      ])
        .then((response: Response) => response.json())
        .catch((err: Error) => Promise.reject(err));
    })();

    let value = getValue(responseList, ['Details', 'totalItems']);
    loaderHandler.hideLoader();
    // PARSE MINDPOP HERE
    if (value != null && typeof value !== 'undefined') {
      await MindPopStore.saveMindPop(responseList);
      let item = getValue(responseList, ['Details', 'mindPopList']);
      if (item.length > 0) {
        let [firstItem] = item;
        EventManager.callBack(kAddEditIdentifier, true, firstItem);
      } else {
        EventManager.callBack(
          kAddEditIdentifier,
          false,
          'Unable to load MindPop',
        );
      }
    } else {
      EventManager.callBack(kAddEditIdentifier, false, ERROR_MESSAGE);
    }
  } catch (err) {
    loaderHandler.hideLoader();
    EventManager.callBack(
      kAddEditIdentifier,
      false,
      getValue(err, ['message']) || ERROR_MESSAGE,
    );
    //console.log("Add/Edit MindPop Service Error: ", err);
  }
};

async function uploadAttachments(mindpopId: number, files: TempFile[]) {
  return new Promise((resolve, reject) => {
    asyncGen(function* () {
      try {
        var resp: any[] = [];
        for (let fl of files) {
          let rsp = yield uploadFile(mindpopId, fl);
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

async function uploadFile(mindpopID: number, file: TempFile) {
  var filePath = file.filePath;
  // if (Platform.OS == "android") {
  filePath = filePath.replace('file://', '');
  // }
  let options: { [x: string]: any } = {
    url: `https://${Account.selectedData().instanceURL}/api/mindpop/upload`,
    path: filePath,
    method: 'POST',
    ...(file.type == 'audios' ? { title: file.filename } : {}),
    field: file.type == 'images' ? 'image' : file.type,
    type: 'multipart',
    headers: {
      'content-type': 'multipart/form-data',
      'X-CSRF-TOKEN': Account.selectedData().userAuthToken,
    },
  };
  if (mindpopID) {
    options['parameters'] = { mindPopID: `${mindpopID}` };
  }

  let name = getValue(file, ['filename']);
  if (name) {
    options['parameters'] = { ...options['parameters'], title: name };
  }
  loaderHandler.showLoader('Uploading..');

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
