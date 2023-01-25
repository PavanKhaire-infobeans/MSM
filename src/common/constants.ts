import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions, PixelRatio, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  isCueBackInstance
} from '../views/registration/getInstancesSaga';
import loaderHandler from './component/busyindicator/LoaderHandler';
const Permissions = require('react-native-permissions').default;
import Upload from 'react-native-background-upload';

//const punycode = require('punycode');
export const keyObject = 'object';
export const keyString = 'string';
export const keyArray = 'array';
export const keyInt = 'int';
export const keyBoolean = 'boolean';
export const fontFamily = {
  Inter: 'Inter-Regular',
  InterMedium: 'Inter-Medium',
  IntersemiBold: 'Inter-SemiBold',
  InterBold: 'Inter-Bold',
  Lora: 'Lora-Regular',
  LoraMedium: 'Lora-Medium',
  LoraBold: 'Lora-Bold',
  LoraSemiBold: 'Lora-SemiBold',
  Roboto: 'Roboto-Regular',
  RobotoMedium: 'Roboto-Medium',
  RobotoBold: 'Roboto-Bold',
  // RobotoSemiBold: 'Roboto-SemiBold',
  SFPro:"SFPro-Regular"
};

export function testEmail(email: string) {
  return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(
    email,
  );
}

export function testPhone(phoneNo: string) {
  return /^(\+\[0-9]{1,3}[- ]?)?\d{10}$/.test(phoneNo);

  // /^(\+\d{1,3}[- ]?)?\d{10}$/
  // /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
}
export function validFileName(fileName: string) {
  return /^([A-Za-z0-9 ])+$/.test(fileName);
}

export function validBirthYear(date: string) {
  if (date && (parseInt(date) > new Date().getFullYear())) {
    return true;
  }
  else if (date && (parseInt(date) < (new Date().getFullYear() - 100))) {
    return true;
  }
  else return false;
}

var lastSavedSize: number = 0;
const DEFAULT = {
  WIDTH: 375,
  HEIGHT: 667,
};
export const Colors = {
  ErrorColor: '#DD4040',
  ThemeColor: '#207D89',
  //ThemeColor: '#026D60',
  redBlack: '#BE6767',
  blue: '#0077B2',
  // darkGray:'#595959',
  lightSkyBlue: '#C0E7EA',
  flatlistSeparatorColor:'#C1C3CA',
  green: '#50B660',
  blacknew: '#222222',
  blacknewrgb: 'rgba(34,34,34,0.7)',
  contextBackground: 'rgba(255,255,255,0)',
  overlayOpacityColor: '#ffffff22',
  underlay33OpacityColor: '#ffffff33',
  underlayBlackOpacityColor: '#00000011',
  redgray: '#A3A3A3',
  NewThemeColor: '#ffffff',//'#94D6DB',
  Theme51D1FF: '#51D1FF',
  NewDarkThemeColor: '#31C7DB',
  NewLightThemeColor: '#F2F8F8',
  memoryTitlePlaceholderColor: "#838688",
  grayWithGradientColor: '#cccccc99',
  NewLight: 'rgba(148, 214, 219, 0.4)',
  brownrgba: 'rgba(144, 144, 144, 0.85)',
  NewLightCommentHeader: '#DFF3F4',
  NewYellowColor: '#DE8B00',
  NewTitleColor: '#207D89',
  TextColor: '#373852',
  AudioViewBg: '#F8D5DA',
  AudioViewBorderColor: '#EB8898',
  BtnBgColor: '#207D89',
  brown: 'rgba(85, 85, 85, 0.75)',
  NewRadColor: '#DD4040',
  systemRed: "#FF3B30",
  ThemeLight: '#169D8C',
  WarningColor: '#FF0000',
  passwordWeak: '#FF4D4D',
  passwordMedium: '#FFC700',
  passwordStrong: '#60F048',
  lightGreen: '#D4E9E6',
  filterBG: '#EDF4F4',
  grayColor: '#d3d3d3',
  dullText: 'rgba(81, 82, 108, 0.75)',
  colorBlack: 'rgba(0,0,0,0.1)',
  colorBlackOpacity7: 'rgba(0,0,0,0.7)',
  iosShadowColor: 'rgba(46, 49, 62, 0.05)',
  colorBlackOpacity5: 'rgba(0,0,0,0.5)',
  backrgba: 'rgba(0, 0, 0, 0.25)',
  selecedBorderColor:'#C1C3CA',
  backColorWith75OPacity: "rgba(0.216, 0.22, 0.322, 0.75)",
  selectedFilter: '#BCDDE0',
  white: '#ffffff',
  newBagroundColor: '#C4C8D4',
  lightGray: '#CED0CE',
  f5f5f5: '#F5F5F5',
  e0e0e0: '#e0e0e0',
  bordercolor: '#0B0C0F',
  timeLinebackground: '#F3F5F7',
  newTextColor: '#4C5367',
  newDescTextColor: '#2E313E',
  selectedFilterbg: 'rgba(173, 135, 0, 0.07)',
  unSelectedFilterbg: 'rgba(6, 36, 81, 0.07)',
  filterborder: '#4D3C00',
  bottomTabColor: '#E2E4E9',
  actionBg: 'rgba(237, 237, 237, 0.8)',
  actionBgHex: '#EDEDED',
  decadeFilterBorder: '#052747',
  actionlistSeparater: 'rgba(0.35, 0.35, 0.35, 0.2)',
  black: '#000000',
  darkGray: '#909090',
  cardShadowColor:'#073562',
  c3c3c3: '#3c3c3c',
  a5a5a7: '#a5a5a7',
  underlayColor: '#00000000',
  systemBlue: "#007AFF",
  touchableunderlayColor: '#ffffff00',
  SerachbarColor: '#F3F3F3',
  moreViewBg: 'rgba(11, 12, 15, 0.6)',
  blackOpacity60: 'rgba(0, 0, 0, 0.6)',
  transparent: 'transparent',
  loginTextColor:'#0A4D8F',
  authBackgroundColor:'#1E1E1E',
  newErrorColor:'#99192E'
};
export const MyMemoriesTapBarOptions = {
  published: 'Published',
  drafts: 'Drafts',
  activity: 'Activity',
};

export const DraftType = {
  allDrafts: 'All Drafts',
  myPersonalDrafts: 'My Personal Drafts',
  myCollaborationDrafts: 'My Collaboration Drafts',
  friendsDrafts: 'Friends Drafts',
  recentryDeleteDrafts: 'Recently Deleted',
};
export const DraftActions = {
  deleteDrafts: 'delete_memory',
  undeleteDrafts: 'undelete_memory',
};

export const DashBoardTapBarOptions = {
  timeline: 'Timeline',
  recent: 'Recent',
};

export const MemoryType = {
  timeline: 'timeline',
  recent: 'feed',
};

export const MemoryRequestType = {
  timeline: 'newer',
  recent: 'older',
};

export const TimelineMemoryTypes = {
  TYPE_INTERNAL_CUES: 'internal_cues',

  TYPE_MY_STORIES: 'my_stories',

  TYPE_BOOK_COLLECTION: 'book_collection', //Collection
  TYPE_MOVIES_COLLECTION: 'movies_collection', //Collection
  TYPE_TV_SHOWS_COLLECTION: 'tv_shows_collection', //Collection
  TYPE_NEWS_COLLECTION: 'news_collection', //Collection in req notable_us_events
  TYPE_SPORTS_COLLECTION: 'sports_collection', //Collection in req notable_us_events
  TYPE_NOTABLE_US_EVENTS: 'notable_us_events',

  TYPE_PROMPT_QUESTION: 'prompt_question',
  TYPE_SONGS: 'songs',
  TIMELINE_TYPE_FEED: 'feed',
  TIMELINE_TYPE_TIMELINE: 'timeline',
  TIMELINE_FILTER_ALL_YEARS: 'all_years',
  TIMELINE_FILTER_MY_YEARS: 'my_years',
  TIMELINE_LIKE_TYPE: 'node',
};

export const MemoryActionKeys = {
  addToCollection: 'add_to_collection',
  deleteMemoryKey: 'delete_memory',
  editMemoryKey: 'edit_memory',
  moveToDraftKey: 'move_to_draft',
  removeMeFromThisPostKey: 'remove_me_from_this_post',
  blockMemoryKey: 'block_memory',
  blockUserKey: 'block_user',
  cancelActionKey: 'cancelActions',
  shareActionKey: 'shareActions',
  reportMemoryKey: 'report_memory',
  blockAndReportKey: 'block_user_report_memory',
  unblockUserKey: 'unblock_user',
};

export const MemoryActionKeyValues = {
  deleteMemory: 'Delete',
  editMemory: 'Edit Memory',
  moveToDraft: 'Move to Drafts',
  removeMeFromThisPost: 'Remove me from this post',
  blockMemory: 'Hide',
  blockUser: 'Block User',
  reportMemory: 'Report Memory',
  blockAndReport: 'Block and Report',
  unBlockUser: 'Unblock User',
};
export const TimeStampMilliSeconds = () => {
  return `${new Date().getTime() / 1000}`.split('.')[0];
};
export const Size = (() => {
  const { width: myWidth, height: myHeight } = Dimensions.get('window');
  return {
    byHeight: (height: number) => {
      return DeviceInfo.isTablet() || Platform.OS == 'android'
        ? height
        : (height * myHeight) / DEFAULT.HEIGHT;
    },
    byWidth: (width: number) => {
      return DeviceInfo.isTablet() || Platform.OS == 'android'
        ? width
        : (width * myWidth) / DEFAULT.WIDTH;
    },
  };
})();

export const deviceHasNotch = () => {
  return DeviceInfo.hasNotch()
}
export const fontSize = (size: number): { fontSize: number } => {
  if (Platform.OS == 'android') {
    size > 0 ? size : (size = 15);
    let fontSize =
      PixelRatio.getPixelSizeForLayoutSize(size) / PixelRatio.get();
    return { fontSize };
  }
  return { fontSize: size };
};

export const ERROR_MESSAGE = 'Something went wrong, Please try again later';
export const NO_INTERNET =
  "You're offline! Please check your connection and try again.";
export const MindPopsInProgress: Array<number> = [];
export const ShareOptions: any = {
  only_me: 'Only me (and collaborators I add)',
  custom: 'Selected friends and/or friend circles',
  allfriends: 'All friends',
  cueback: 'All members',
};
export function uploadTask(
  success: (data: { [x: string]: any }) => void,
  failure: (error: any) => void,
): (options: object) => void {
  // const UploadManager = require('react-native-background-upload').default;
  const loaderHandler =
    require('../common/component/busyindicator/LoaderHandler').default;
  return function (options: any): void {
    try {
      asyncGen(function* () {

        // showConsoleLog(ConsoleType.LOG,"File Upload payload:",JSON.stringify(options));
        //loaderHandler.showLoader('Uploading..');
        try {
          let uploadId = yield Upload.startUpload(options);
          if (typeof uploadId == 'string') {
            Upload.addListener('error', uploadId, (data: any) => {
              // hideLoaderWithTimeOut();
              failure(data);
            });
            Upload.addListener(
              'cancelled',
              uploadId,
              (...data: any[]) => {
                // hideLoaderWithTimeOut();
                failure({ message: 'Upload cancelled', uploadId, data });
              },
            );
            Upload.addListener('completed', uploadId, (data: any) => {
              // hideLoaderWithTimeOut();
              success(data);
            });
          } else {
            // hideLoaderWithTimeOut();
            failure(uploadId);
          }

          // Upload.startUpload(options).then((uploadId) => {
          //   showConsoleLog(ConsoleType.LOG,'Upload started')
          //   Upload.addListener('progress', uploadId, (data) => {
          //     showConsoleLog(ConsoleType.LOG,`Progress: ${data.progress}%`)
          //   })
          //   Upload.addListener('error', uploadId, (data) => {
          //     showConsoleLog(ConsoleType.LOG,`Error: ${data.error}%`)
          //     failure(data);
          //   })
          //   Upload.addListener('cancelled', uploadId, (data) => {
          //     showConsoleLog(ConsoleType.LOG,`Cancelled!`)
          //     failure({ message: 'Upload cancelled', uploadId, data });
          //   })
          //   Upload.addListener('completed', uploadId, (data) => {
          //     // data includes responseCode: number and responseBody: Object
          //     success(data);
          //     showConsoleLog(ConsoleType.LOG,'Completed!')
          //   })
          // }).catch((err) => {
          //   showConsoleLog(ConsoleType.LOG,'Upload error!', err)
          //   failure(err);
          // })
        } catch (err) {
          // hideLoaderWithTimeOut();
          failure(err);
        }
      });
    } catch (error) {
      // hideLoaderWithTimeOut();
      failure(error);
    }
  };
}

function hideLoaderWithTimeOut() {
  setTimeout(() => {
    //loaderHandler.hideLoader();
  }, 1000);
}
export const asyncGen = (
  starFunc: (options: object) => IterableIterator<any>,
) => {
  const iterator = starFunc(starFunc.arguments);
  const handle = (x: any) => {
    const iteration = iterator.next(x);
    if (!iteration.done) {
      iteration.value.then(handle);
    }
  };
  iterator.next().value.then(handle);
};

export const GetFileType = {
  getStatus: (key: string) => {
    var values: { [x: string]: number } = {
      image: 2,
      audio: 3,
      file: 4,
      video: 5,
    };
    var keys = Object.keys(values);
    let value = keys.find((ky: string) => key.indexOf(ky) != -1);
    return values[value];
  },
};

export const GenerateRandomID = (): string => {
  return `${parseInt(`${Math.random() * 1000000000}`)}`;
};

export const Storage = (() => {
  //	const { AsyncStorage } = require("@react-native-community/async-storage");
  return {
    save: async (path: string, value: any) => {
      try {
        let storeVal = `${typeof value}:=:${typeof value == 'string' ? value : JSON.stringify(value)
          }`;
        await AsyncStorage.setItem(path, storeVal);
      } catch (err) {
        //showConsoleLog(ConsoleType.LOG,err);
      }
    },
    get: async (path: string) => {
      try {
        let value = await AsyncStorage.getItem(path);
        if (value != null) {
          const [dataType, dataValue] = value.split(':=:');
          if (dataType == 'object') {
            return JSON.parse(dataValue);
          }
          return dataValue;
        }
      } catch (err) {
        //showConsoleLog(ConsoleType.LOG,err);
      }
    },
    delete: async (path: string) => {
      try {
        await AsyncStorage.removeItem(path);
      } catch (err) {
        //showConsoleLog(ConsoleType.LOG,err);
      }
    },
    deleteAll: async () => {
      try {
        await AsyncStorage.clear((err: Error) => { });
      } catch (err) {
        //showConsoleLog(ConsoleType.LOG,err);
      }
    },
  };
})();

export const CueBackInsatance = isCueBackInstance
  ? {
    InstanceID: '2001',
    InstanceName: 'My Stories Matter',
    InstanceURL: 'mystoriesmatter.com',
    InstanceImageURL:
      'https://admin.cueback.com/sites/default/files/my-stories-matter.png',
    is_fake: 0,
  }
  : {
    InstanceID: '2002',
    InstanceName: 'QA Public',
    //InstanceURL: "qa-public.cueback.com",
    InstanceURL: 'cuebackqa.com',
    // InstanceURL: 'public.cuebackqa.com',
    InstanceImageURL: null,
    is_fake: 0,
  };
export const constant = {
  deviceWidth: 375,
  deviceHeight: 667,
  iPhone5Height: 568,
};
export const getValue = (obj: { [x: string]: any }, path: Array<string>): any => {
  if (obj && typeof obj == 'object') {
    if (path.length == 1) {
      return obj[path[0]];
    }
    let nPath = [...path];
    nPath.splice(0, 1);
    return getValue(obj[path[0]], nPath);
  }
  return null;
};

export const getDetails = (
  object: any,
  params: any,
  typeOfField?: any,
): any => {
  typeOfField = typeOfField ? typeOfField : keyString;
  if (getValue(object, params)) {
    return getValue(object, params);
  } else {
    switch (typeOfField) {
      case keyString:
        return '';
      case keyArray:
        return [];
      case keyObject:
        return {};
      case keyInt:
        return 0;
      case keyBoolean:
        return false;
    }
  }
  return null;
};

export function encode_utf8(s: string): string {
  var encodedString = '';
  try {
    encodedString = encodeURI(s); //unescape(encodeURIComponent(s));//punycode.encode(str);//
  } catch {
    encodedString = s;
  }
  return encodedString;
}

export function decode_utf8(s: string): string {
  var decodedString = '';
  try {
    decodedString = decodeURI(s); // decodeURIComponent(escape(s));//punycode.decode(str);//
  } catch {
    decodedString = s;
  }
  return decodedString;
}

export const CommonTextStyles = {
  fontWeight400Size19Inter: {
    fontWeight: '400',
    ...fontSize(19),
    fontFamily: fontFamily.Inter
  },
  fontWeight500Size17Inter: {
    fontWeight: '400',
    ...fontSize(17),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    lineHeight: 18.7
  },
  fontWeight500Size13Inter: {
    fontWeight: '500',
    ...fontSize(14),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    lineHeight: 17.5
  },
  fontWeight500Size15Inter: {
    fontWeight: '500',
    ...fontSize(15),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    lineHeight: 18.75
  },
};
/*export const requestPermission = async (type: string): Promise<boolean> => {
  type PermissionState = "authorized" | "denied" | "restricted" | "undetermined";
  const Permissions = require('react-native-permissions').default;
  const { Alert } = require('react-native');
  var permission: PermissionState = "undetermined";
  try {
    permission = await Permissions.request(type);
    if (permission != "authorized") {
      permission = await Permissions.check(type);
      if (permission != "authorized") {
        Alert.alert("Change settings", "", [
          {
            text: "Cancel",
            style: "cancel",
            onPress: null
          },
          {
            text: "Open Settings",
            style: "default",
            onPress: () => {
              Permissions.openSettings();
            }
          }
        ]);
        return false;
      }
    }
    return permission == "authorized";
  } catch (error) {
    //showConsoleLog(ConsoleType.LOG,error);
    return false;
  }
}; */
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

const checkPermissionFor = (data) => {
  check(data)
    .then((result) => {
      switch (result) {
        // case RESULTS.UNAVAILABLE:
        //   showConsoleLog(ConsoleType.LOG,'This feature is not available (on this device / in this context)');
        //   break;
        case RESULTS.DENIED:
          Permissions.openSettings();
          // showConsoleLog(ConsoleType.LOG,'The permission has not been requested / is denied but requestable');
          // return false;
          break;
        case RESULTS.LIMITED:
          // Permissions.openSettings();
          // return false;
          showConsoleLog(ConsoleType.LOG,'The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          showConsoleLog(ConsoleType.LOG,'The permission is granted');
          break;
        case RESULTS.BLOCKED:
          Permissions.openSettings();
          return false;
          showConsoleLog(ConsoleType.LOG,'The permission is denied and not requestable anymore');
          break;
      }
    })
    .catch((error) => {
      // …
    });
}
/*export const requestPermission = async (type: string): Promise<boolean> => {
  type PermissionStatus = 'unavailable' | 'denied' | 'blocked' | 'granted';
	
  String test = check(PERMISSIONS.IOS.CAMERA);
  try{
  request(PERMISSIONS.IOS.CAMERA).then((result) => {
  	
    return true;

    });
  }catch{
    return false;
  }
	
}*/

export const requestPermission = async (type: string): Promise<boolean> => {
  type PermissionState =
    | 'authorized'
    | 'denied'
    | 'restricted'
    | 'undetermined';
  const { Alert } = require('react-native');
  //var permission: PermissionState = "undetermined";
  try {
    var permissionType;

    if (Platform.OS === 'ios') {
      if (type === 'camera') permissionType = PERMISSIONS.IOS.CAMERA;
      else if (type === 'photo') permissionType = PERMISSIONS.IOS.PHOTO_LIBRARY;
      else if (type === 'microphone')
        permissionType = PERMISSIONS.IOS.MICROPHONE;
      else if (type === 'storage')
        permissionType = PERMISSIONS.IOS.MEDIA_LIBRARY;
    }
    else {
      if (type === 'camera') permissionType = PERMISSIONS.ANDROID.CAMERA;
      else if (type === 'photo')
        permissionType = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      else if (type === 'microphone')
        permissionType = PERMISSIONS.ANDROID.RECORD_AUDIO;
      else if (type === 'storage')
        permissionType = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    }

    var test = await request(
      Platform.select({
        android: permissionType,
        ios: permissionType,
      }),
    ).then(result => {
      // …
      if (result === 'granted' || result === 'limited') return true;
      else return false;
    });

    if (!test) {
      checkPermissionFor(Platform.select({
        android: permissionType,
        ios: permissionType,
      }));
    }
    else {
      return test;
    }
    /*permission = await Permissions.request(type);
    if (permission != "authorized") {
  	
      permission = await Permissions.check(type);
      if (permission != "authorized") {
        Alert.alert("Change settings", "", [
          {
            text: "Cancel",
            style: "cancel",
            onPress: null
          },
          {
            text: "Open Settings",
            style: "default",
            onPress: () => {
              Permissions.openSettings();
            }
          }
        ]);
        return false;
      }
    }*/
    //return permission == "authorized";
  } catch (error) {
    //showConsoleLog(ConsoleType.LOG,error);
    return false;
  }
};

export enum ConsoleType{
  ERROR,
  WARN,
  LOG,
  INFO
}

export const showConsoleLog = (type:ConsoleType, ...optionalParams: any)=>{
  switch (type) {
    case ConsoleType.ERROR:
      console.error(...optionalParams)
      break;
    case ConsoleType.WARN:
      console.warn(...optionalParams)
      break;
    case ConsoleType.LOG:
      console.log(...optionalParams)
      break;
    case ConsoleType.INFO:
      console.info(...optionalParams)
      break;
    default:
      break;
  }
}
