import Upload from 'react-native-background-upload';
import { TempFile } from '.';
import analytics from '@react-native-firebase/analytics';
import {
  asyncGen, ConsoleType, ERROR_MESSAGE, getValue, showConsoleLog, Storage, TimeStampMilliSeconds, uploadTask
} from '../../../common/constants';
import MindPopStore from '../../../common/database/mindPopStore/mindPopStore';
import EventManager from '../../../common/eventManager';
import { Account } from '../../../common/loginStore';
import {
  addMindPops, getMindPopWithId
} from '../../../common/webservice/mindPopServices';
import { Platform } from 'react-native';

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
    let response = await addMindPops(
      `https://${Account.selectedData().instanceURL}`,
      param,
      {
        'X-CSRF-TOKEN': data.userAuthToken,
        'Content-Type': 'application/json',
      },
      async (response) => {
        let mindpopId = parseInt(getValue(response, ['MindpopId'])) || 0;
        if (mindpopId == 0) {
          EventManager.callBack(
            kAddEditIdentifier,
            false,
            'Could not save MindPop',
          );
          return;
        }

        await analytics().logEvent('new_mindpop_created');
        if (files.length > 0) {
          //MindPopsInProgress.push(mindpopId);
          await uploadAttachments(mindpopId, files);
          // await uploadFile(mindpopId, files, data=>{
          //   console.log("sassas :",JSON.stringify(data))
          EventManager.callBack(kMindPopUploadedIdentifier, true, mindpopId);
          // })
          // //loaderHandler.hideLoader();
        } else {
          console.log("nononon :", JSON.stringify(data))
          // //loaderHandler.hideLoader();
          EventManager.callBack(kMindPopUploadedIdentifier, true, mindpopId);
        }
        // //loaderHandler.hideLoader();

        // Get List from server
        let listRequestParams = {
          searchTerm: {
            mindPopID: mindpopId,
          },
          configurationTimestamp: TimeStampMilliSeconds(),
          lastSyncTimeStamp: '0',
        };
        let responseList = getMindPopWithId(`https://${Account.selectedData().instanceURL}`, [
          listRequestParams,
          {
            'X-CSRF-TOKEN': data.userAuthToken,
            'Content-Type': 'application/json',
          },
        ],
          async (responseList) => {
            try {
              let value = getValue(responseList, ['Details', 'totalItems']);
              // //loaderHandler.hideLoader();
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
            } catch (error) {
              console.log("sssss >", error)
            }

          }
        )
        //     .then((response: Response) => response.json())
        //     .catch((err: Error) => Promise.reject(err));
        // })();

      }
    )
    // .then((response: Response) => response.json())
    // .catch((err: Error) => Promise.reject(err));
    // })();

  } catch (err) {
    //loaderHandler.hideLoader();
    EventManager.callBack(
      kAddEditIdentifier,
      false,
      getValue(err, ['message']) || ERROR_MESSAGE,
    );
    showConsoleLog(ConsoleType.LOG, "Add/Edit MindPop Service Error: ", err);
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
        showConsoleLog(ConsoleType.LOG, "Error in uploading files: ", err)
        reject(err);
      }
    });
  });
}

// async function uploadFile(mindpopID: number, files: TempFile[], CB: any) {

//   let respArray: any[] = [];
//   // const loaderHandler = require('../../common/component/busyindicator/LoaderHandler').default;
//   // //loaderHandler.showLoader('Uploading..');

//   Promise.all(
//     files.map(file => {
//       return new Promise(async (resolve) => {

//         var filePath = file.filePath;
//         // if (Platform.OS == "android") {
//         filePath = filePath.replace('file://', '');
//         // }
//         let options: { [x: string]: any } = {
//           url: `https://${Account.selectedData().instanceURL}/api/mindpop/upload`,
//           path: filePath,
//           method: 'POST',
//           ...(file.type == 'audios' ? { name: file.filename } : {}),
//           field: file.type == 'images' ? 'image' : file.type,
//           type: 'multipart',
//           headers: {
//             'content-type': 'multipart/form-data',
//             'X-CSRF-TOKEN': Account.selectedData().userAuthToken,
//           },
//         };
//         if (mindpopID) {
//           options['parameters'] = { mindPopID: `${mindpopID}` };
//         }

//         if (getValue(file, ['filename'])) {
//           options['parameters'] = {
//             ...options['parameters'],
//             title: getValue(file, ['filename']),
//           };
//         }

//         try {

//           try {
//             let uploadId = await Upload.startUpload(options);
//             if (typeof uploadId == 'string') {
//               Upload.addListener('error', uploadId, (data: any) => {
//                 respArray.push({ "ResponseCode": 400, "ResponseMessage": "Unable to upload", "ResultData": false })
//                 resolve(data);
//               });
//               Upload.addListener(
//                 'cancelled',
//                 uploadId,
//                 (...data: any[]) => {
//                   respArray.push(data)
//                   resolve({ message: 'Upload cancelled', uploadId, data });
//                 },
//               );
//               Upload.addListener('completed', uploadId, (data: any) => {
//                 respArray.push(data)
//                 resolve(data);
//               });
//             } else {
//               respArray.push({ "ResponseCode": 400, "ResponseMessage": "Unable to upload", "ResultData": false })
//               resolve(uploadId);
//             }

//           } catch (err) {
//             respArray.push({ "ResponseCode": 400, "ResponseMessage": "Unable to upload", "ResultData": false })
//             resolve(err);
//           }
//           // });
//         } catch (error) {
//           respArray.push({ "ResponseCode": 400, "ResponseMessage": "Unable to upload", "ResultData": false })
//         }
//       })
//     })
//   )
//     .then((res) => {
//       CB(res);
//     }).catch(res =>{
//       console.log("failed incatch :",JSON.stringify(res),res)

//       CB([{status:false}])
//     })
// }

async function uploadFile(mindpopID: number, file: TempFile) {
  var filePath = file.filePath;
  if (Platform.OS == "android") {
    filePath = filePath.replace('file://', '');
  }
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
  //loaderHandler.showLoader('Uploading..');

  return new Promise((resolve, reject) => {
    uploadTask(
      async(data: any) => {
        showConsoleLog(ConsoleType.LOG, "After upload", data);
        await analytics().logEvent(`new_${options['field']}_file_attached`);
        let response = JSON.parse(data.responseBody);
        if (response.ResponseCode == '200') {
          resolve(response);
        } else {
          reject(response);
        }
      },
      (err: Error) => {
        showConsoleLog(ConsoleType.LOG, "Upload error!", err);
        reject(err);
      },
    )(options);
  });
}
