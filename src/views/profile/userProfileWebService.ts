import { Platform } from 'react-native';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import { ToastMessage } from '../../common/component/Toast';
import {
  ConsoleType,
  ERROR_MESSAGE, getValue, showConsoleLog, Storage, uploadTask
} from '../../common/constants';
import EventManager from '../../common/eventManager';
import { Account } from '../../common/loginStore';
import Utility from '../../common/utility';
import {
  newUserProfile,
  removeProfilePicture, userProfile
} from '../../common/webservice/userProfile';
import { TempFile } from '../mindPop/edit';

export const kGetUserProfileData = 'GetUserProfileData';
export const kSetUserProfileData = 'SetUserProfileData';
export interface FormStruct {
  label: string;
  type:
    | 'sub'
    | 'sub-single'
    | 'date_select'
    | 'options_select'
    | 'text_textfield';
  form?: FormStruct[];
  default_value?: object;
  module?: 'date' | 'options' | 'text';
  multiple?: boolean;
  isPassword?: boolean;
  field_name?: string;
  required?: boolean;
  values?: any;
}

export const UserProfile = async () => {
  let profileDetails: any = {};
  try {
    let data = await Storage.get('userData');
    let response = await newUserProfile(
      `https://${
        Account.selectedData().instanceURL
      }/api/alumni/profile_page_details`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {configurationTimestamp: '0'},
      ],
      response =>{
        let profileData = getValue(response, ['Details']);
        if (profileData != null) {
          for (let keys in profileData) {
            let objectInfo: any = profileData[keys];
            for (let itemKey in objectInfo) {
              profileDetails = {
                ...profileDetails,
                [itemKey]: objectInfo[itemKey],
              };
            }
          }
        }
    
        if (response.ResponseCode == 200) {
          EventManager.callBack(kGetUserProfileData, true, profileDetails);
        }
      }
    )
      // .then((response: Response) => response.json())
      // .catch((err: Error) => Promise.reject(err));

   
  } catch (err) {
    EventManager.callBack(kGetUserProfileData, false, err.message);
  }
};

export const UpdateFormValues = (state: any, editableFields: any) => {
  let updatedValues = {};
  loaderHandler.showLoader('Saving...');
  // showConsoleLog(ConsoleType.INFO,"save date: ",editableFields);

  for (let keys in editableFields) {
    let currentField = editableFields[keys];
    let value2: any = '';
    let value1: any = '';
    if (
      state[currentField.field_name] != null &&
      state[currentField.field_name] != undefined &&
      currentField.default_value != state[currentField.field_name]
    ) {
      let value = state[currentField.field_name];
      switch (currentField.type) {
        case 'options_select':
          for (let keys in state[currentField.field_name]) {
            value[keys] = keys;
          }
          break;
        case 'date_select':
          if (value.value2) {
            value2 = value.value2;
          }

          if (value.value) {
            value1 = value.value;
          } else {
            value1 = value1 ? value1 : currentField['default_value'].value;
          }

          let startValue = value1
            ? value1
            : currentField['default_value'].value;
          let startD = startValue.split('-');
          startD = startD[0];

          let startE = value2.split('-');
          startE = startE[0];
          // Account.selectedData().start_year = startD;
          // Account.selectedData().end_year = startE;
          break;
        case 'options_buttons':
          let keys = Object.keys(value);
          if (keys.length > 0) {
            value = value[keys[0]];
          }
          //showConsoleLog(ConsoleType.LOG,"value is : ", value)
          break;
        case 'text_textfield':
          break;
      }
      if (value2 && value2.trim().length > 0) {
        updatedValues = {
          ...updatedValues,
          [currentField.field_name]: {
            type: currentField.type,
            module: currentField.module,
            value:
              value1 && value1.trim().length > 0
                ? value1
                : currentField['default_value'].value,
            value2: value2,
          },
        };
      } else if (value1 && value1.trim().length > 0) {
        updatedValues = {
          ...updatedValues,
          [currentField.field_name]: {
            type: currentField.type,
            module: currentField.module,
            value: value1,
          },
        };
      }
    }
  }
  showConsoleLog(ConsoleType.INFO,"after process date: ",editableFields);

  setTimeout(async() => {
    await updateUserProfile(updatedValues);
  }, 2000);
};

const updateUserProfile = async (dataset) => {
  // let profileDetails: any = {};
  try {
    let data = await Storage.get('userData');
    showConsoleLog(ConsoleType.INFO,"update data : ",dataset);
    let response = await userProfile(
      `https://${Account.selectedData().instanceURL}/api/alumni/update`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {
          updateInfo: dataset,
          configurationTimestamp: '0',
        },
      ],
    )
      .then((response: Response) => {
        // response.json();
        if (response.status == 200) {
          EventManager.callBack(kSetUserProfileData, true);
          if (Utility.isInternetConnected) {
            UserProfile();
            loaderHandler.showLoader('Refreshing...');
          } else {
            ToastMessage('No Internet Connected');
          }
        } else {
          ToastMessage('Unable to save data');
          loaderHandler.hideLoader();
        }
      })
      .catch((err: Error) => {
        Promise.reject(err);
        loaderHandler.hideLoader();
      });
  } catch (err) {
    EventManager.callBack(kSetUserProfileData, false, err.message);
    loaderHandler.hideLoader();
  }
};

export const PhotoType = {
  profile: 1,
  cover: 2,
  other: 3,
};

export const UploadProfilePic = async function uploadProfilePicture(
  file: TempFile,
  type?: number,
) {
  var filePath = file.filePath;
  if (Platform.OS == 'android') {
    filePath = filePath.replace('file://', '');
  }

  let options: {[x: string]: any} = {
    url: `https://${
      Account.selectedData().instanceURL
    }/api/alumni/profile_picture_upload`,
    path: filePath,
    method: 'POST',
    ...(file.type == 'audios' ? {name: file.filename} : {}),
    field: file.type == 'audios' ? file.time : 'image',
    type: 'multipart',
    headers: {
      'content-type': 'multipart/form-data',
      'X-CSRF-TOKEN': Account.selectedData().userAuthToken,
    },
  };

  let name = getValue(file, ['filename']);
  if (name) {
    options['name'] = name;
  }

  if (type == PhotoType.cover) {
    options['parameters'] = {type: 'cover'};
  }
  loaderHandler.showLoader('Uploading..');

  return new Promise((resolve, reject) => {
    uploadTask(
      (data: any) => {
        //showConsoleLog(ConsoleType.LOG,"After upload profile pic", data);
        let response = JSON.parse(data.responseBody);
        if (response.ResponseCode == '200') {
          resolve(response);
        } else {
          reject(response);
        }
      },
      (err: Error) => {
        //showConsoleLog(ConsoleType.LOG,"Upload error!", err);
        reject(err);
      },
    )(options);
  });
};

export const RemoveProfilePic = async function RemoveProfilePicture(
  type?: number,
) {
  return new Promise((resolve, reject) => {
    let authToken = Account.selectedData().userAuthToken;
    let options = [
      {'X-CSRF-TOKEN': authToken, 'Content-Type': 'application/json'},
      {type: type == PhotoType.cover ? 'cover' : ''},
    ];
    removeProfilePicture(
      `https://${
        Account.selectedData().instanceURL
      }/api/alumni/profile_picture_upload`,
      options,
    )
      .then((response: Response) => {
        if (response.status == 200) {
          resolve();
        } else {
          let err = Error(ERROR_MESSAGE);
          reject(err);
        }
      })
      .catch((err: Error) => reject(err));
  });
};
