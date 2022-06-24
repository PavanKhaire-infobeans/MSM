import {
  userProfile,
  removeProfilePicture,
} from '../../common/webservice/userProfile';
import EventManager from '../../common/eventManager';
import {
  Storage,
  getValue,
  uploadTask,
  ERROR_MESSAGE,
} from '../../common/constants';
import {Account} from '../../common/loginStore';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import {Alert, Platform} from 'react-native';
import {TempFile} from '../mindPop/edit';
import {ToastMessage} from '../../common/component/Toast';
import Utility from '../../common/utility';

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
    let response = await userProfile(
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
    )
      .then((response: Response) => response.json())
      .catch((err: Error) => Promise.reject(err));

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
  } catch (err) {
    EventManager.callBack(kGetUserProfileData, false, err.message);
  }
};

export const UpdateFormValues = (state: any, editableFields: any) => {
  let updatedValues = {};
  loaderHandler.showLoader('Saving...');
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
          //console.log("value is : ", value)
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
  updateUserProfile(updatedValues);
};

const updateUserProfile = async (updatedFieldsData: Object) => {
  let profileDetails: any = {};
  try {
    let data = await Storage.get('userData');
    //console.log(data);
    let response = await userProfile(
      `https://${Account.selectedData().instanceURL}/api/alumni/update`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {
          updateInfo: updatedFieldsData,
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
    EventManager.callBack(kGetUserProfileData, false, err.message);
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

  return new Promise((resolve, reject) => {
    uploadTask(
      (data: any) => {
        //console.log("After upload profile pic", data);
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
