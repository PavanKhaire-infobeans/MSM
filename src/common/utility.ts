import NetInfo from '@react-native-community/netinfo';
import { Appearance, Dimensions } from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import DeviceInfo from 'react-native-device-info';
import { constant, MemoryActionKeys } from '../common/constants';

export default class Utility {
  static shortMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  static notificationObject: any = {
    hasNotification: false,
    data: {},
    isBackgroundNotification: false,
  };
  static isInternetConnected: boolean = false;
  static currentTheme: string = '';
  static fontScale: any = 1;
  static publicURL = '';
  static unreadNotification: any = {};
  static tabRefDash: any = null;
  static setPublicURL = () => {
    DefaultPreference.get('public_file_path').then((value: any) => {
      Utility.publicURL = value;
    });
  };

  static getFileURLFromPublicURL(publicPath: string): string {
    var actualPath = '';
    if (publicPath != null) {
      actualPath = publicPath.replace('public://', Utility.publicURL);
    }
    return actualPath;
    // return new Promise((resolve, reject) => {
    //     if(publicPath && publicPath != ""){
    //         DefaultPreference.get('public_file_path').then((value: any) => {
    //             var actualPath = publicPath.replace("public://", value);
    //             if (actualPath){
    //                 resolve (actualPath);
    //             }else{
    //                 reject("")
    //             }
    //         })
    //         // var instancePath = `https://${Account.selectedData().instanceURL}/sites/${Account.selectedData().instanceURL}/default/files/`;
    //         // var actualPath = publicPath.replace("public://", instancePath);
    //         // return actualPath;
    //     }
    // });

    // return "";
  }

  static dateAccordingToFormat(completeDate: string, date_format: any) {
    try {
      var shortMonths = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      if (completeDate) {
        try {
          var [dateSection, timeSection] = completeDate.split(' ');
          var [year, month, date] = dateSection.split('-');
          if (date_format == 'M d, Y') {
            let formattedDate =
              shortMonths[parseInt(month) - 1] + ' ' + date + ', ' + year;
            return formattedDate;
          } else if (date_format == 'M d, Y, t') {
            [dateSection, timeSection] = completeDate.split('  ');
            let formattedDate =
              shortMonths[parseInt(month) - 1] + ' ' + date + ', ' + year;
            let dateWithTime = timeSection + ' - ' + formattedDate;
            return dateWithTime;
          } else if (date_format == 'F d, Y') {
            let formattedDate =
              months[parseInt(month) - 1] + ' ' + date + ', ' + year;
            return formattedDate;
          } else if (date_format && date_format.indexOf('m/d/Y') >= 0) {
            let formattedDate =
              shortMonths[parseInt(month) - 1] + ' ' + date + ', ' + year;
            return formattedDate;
          } else if (date_format == 'M Y') {
            let formattedDate = shortMonths[parseInt(month) - 1] + ' ' + year;
            return formattedDate;
          } else if (date_format == 'M D') {
            let formattedDate = shortMonths[parseInt(month) - 1] + ' ' + date;
            return formattedDate;
          } else {
            return year;
          }
        } catch (err) { }
      }
    } catch (execption) {
      return '';
    }
  }

  static dateObjectToDefaultFormat(completeDate: Date) {
    let formattedDate =
      completeDate.getUTCFullYear() +
      '-' +
      (completeDate.getUTCMonth() + 1 > 9
        ? completeDate.getUTCMonth() + 1
        : '0' + (completeDate.getUTCMonth() + 1)) +
      '-' +
      (completeDate.getUTCDate() > 9
        ? completeDate.getUTCDate()
        : '0' + completeDate.getUTCDate()) +
      ' ' +
      (completeDate.getUTCHours() > 9
        ? completeDate.getUTCHours()
        : '0' + completeDate.getUTCHours()) +
      ':' +
      (completeDate.getUTCMinutes() > 9
        ? completeDate.getUTCMinutes()
        : '0' + completeDate.getUTCMinutes()) +
      ':' +
      (completeDate.getUTCSeconds() > 9
        ? completeDate.getUTCSeconds()
        : '0' + completeDate.getUTCSeconds());
    return formattedDate;
  }
  static dateObjectToDateAndTimeFormat(completeDate: Date) {
    let hours = completeDate.getUTCHours();
    let minutes = completeDate.getUTCMinutes();
    var timeType = '';
    // Checking if the Hour is less than equals to 11 then Set the Time format as AM.
    if (hours <= 11) {
      timeType = 'AM';
    } else {
      // If the Hour is Not less than equals to 11 then Set the Time format as PM.
      timeType = 'PM';
    }
    // IF current hour is grater than 12 then minus 12 from current hour to make it in 12 Hours Format.
    if (hours > 12) {
      hours = hours - 12;
    }

    // If hour value is 0 then by default set its value to 12, because 24 means 0 in 24 hours time format.
    if (hours == 0) {
      hours = 12;
    }
    let formattedDate =
      completeDate.getUTCFullYear() +
      '-' +
      (completeDate.getUTCMonth() + 1 > 9
        ? completeDate.getUTCMonth() + 1
        : '0' + (completeDate.getUTCMonth() + 1)) +
      '-' +
      (completeDate.getUTCDate() > 9
        ? completeDate.getUTCDate()
        : '0' + completeDate.getUTCDate()) +
      '  ' +
      (hours > 9 ? hours : '0' + hours) +
      ':' +
      (completeDate.getUTCMinutes() > 9
        ? completeDate.getUTCMinutes()
        : '0' + completeDate.getUTCMinutes()) +
      ' ' +
      timeType;
    return formattedDate;
  }

  static timeDuration(createdOn: any, formatt: any, onlyAgoTime?: boolean) {
    try {
      let createdDate = Utility.dateObjectToDefaultFormat(
        new Date(parseInt(createdOn) * 1000),
      );
      let addString = '';
      if (formatt == 'M d, Y, t') {
        createdDate = Utility.dateObjectToDateAndTimeFormat(
          new Date(parseInt(createdOn) * 1000),
        );
      } else {
        addString = 'on ';
      }
      let SECOND_MILLIS = 1000;
      let MINUTE_MILLIS = 60 * SECOND_MILLIS;
      let HOUR_MILLIS = 60 * MINUTE_MILLIS;
      let currentTime = Math.floor(Date.now());
      let diff = currentTime - createdOn * 1000;
      if (diff < MINUTE_MILLIS) {
        return 'Just now';
      } else if (diff < 2 * MINUTE_MILLIS) {
        return 'a minute ago';
      } else if (diff < 50 * MINUTE_MILLIS) {
        return Math.round(diff / MINUTE_MILLIS) + ' minutes ago';
      } else if (diff < 90 * MINUTE_MILLIS) {
        return 'an hour ago';
      } else if (diff < 24 * HOUR_MILLIS) {
        return Math.round(diff / HOUR_MILLIS) + ' hours ago';
      }

      if (onlyAgoTime) {
        diff = Math.floor(diff / (1000 * 3600 * 24));
        let suffix = ' day';
        if (diff > 365) {
          diff = diff / 365;
          suffix = ' year';
        } else if (diff > 12) {
          diff = diff / 12;
          suffix = ' month';
        } else if (diff > 7) {
          diff = diff / 7;
          suffix = ' week';
        }
        diff = Math.floor(diff);
        return addString + diff + suffix + (diff > 1 ? 's' : '') + ' ago';
      }
      return (
        addString + Utility.dateAccordingToFormat('' + createdDate, formatt)
      );
    } catch (execption) {
      return 0;
    }
  }
  static getActionAlertTitle = (action: any): any => {
    let alertData: any = {};
    switch (action) {
      case MemoryActionKeys.blockMemoryKey:
        alertData.title = 'Hide Memory';
        alertData.message = 'Are you sure you want to hide this post?';
        break;
      case MemoryActionKeys.deleteMemoryKey:
        alertData.title = 'Delete Memory';
        alertData.message = 'Are you sure you want to delete this post?';
        break;
      case MemoryActionKeys.moveToDraftKey:
        alertData.title = 'Move to draft';
        alertData.message = 'Are you sure you want to move this to draft?';
        break;
      case MemoryActionKeys.removeMeFromThisPostKey:
        alertData.title = 'Remove from this post';
        alertData.message =
          'Are you sure you want to remove your self from this post?';
        break;
      case MemoryActionKeys.blockAndReportKey:
        alertData.title = 'Block user and Report memory';
        alertData.message =
          'Are you sure you want to block user and report this post?';
        break;
      case MemoryActionKeys.blockUserKey:
        alertData.title = 'Block user?';
        alertData.message = 'Are you sure you want to block user?';
        break;
      case MemoryActionKeys.reportMemoryKey:
        alertData.title = 'Report Memory';
        alertData.message = 'Are you sure you want to report this post?';
        break;
    }
    return alertData;
  };
  static getNumberOfLines(text: any, fontSize: any, containerWidth: any) {
    let fontConstant = 1.9;
    let cpl = Math.floor(containerWidth / (fontSize / fontConstant));
    const words = text.split(' ');
    const elements = [];
    let line = '';

    while (words.length > 0) {
      if (
        line.length + words[0].length + 1 <= cpl ||
        (line.length === 0 && words[0].length + 1 >= cpl)
      ) {
        let word = words.splice(0, 1);
        if (line.length === 0) {
          line = word;
        } else {
          line = line + ' ' + word;
        }
        if (words.length === 0) {
          elements.push(line);
        }
      } else {
        elements.push(line);
        line = '';
      }
    }
    return elements.length;
  }
  static widthRatio = (value: any) => {
    return value * (Dimensions.get('window').width / constant.deviceWidth);
  };

  static getDeviceWidth = () => {
    return Dimensions.get('window').width;
  }
  static getDeviceHeight = () => {
    return Dimensions.get('window').height;
  }

  static heightRatio = (value: any) => {
    return value * (Dimensions.get('window').height / constant.deviceHeight);
  };
  static isDeviceSmallByWidth() {
    return constant.iPhone5Width >= Utility.getDeviceWidth();
  }
}

export function* networkConnectivitySaga() {
  // const channel = yield call(createNetworkChangeChannel);
  const unsubscribe = NetInfo.addEventListener(state => {
    console.log('Connection type', state.type);
    console.log('Is connected?', state.isConnected);
    Utility.isInternetConnected = state.isConnected;
  });
  /* try {
        while (true) {
            const connected = yield take(channel);
            console.log("Network Status", connected, Utility.isInternetConnected);
             Utility.isInternetConnected = state;
        }
    } finally {
        if (yield cancelled()) {
            channel.close();
        }
    }*/
}

export function themechanges(data: string) {
  Utility.currentTheme = data;
  let theme = Appearance.addChangeListener((listener) => {
    Utility.currentTheme = listener.colorScheme;
  })
}

export function getFontScale() {
  DeviceInfo.getFontScale().then((fontScale) => {
    Utility.fontScale = fontScale;
  });
}

/*export function createNetworkChangeChannel() {
    return eventChannel(emitter => {
        NetInfo.isConnected.addEventListener('connectionChange', emitter);
        return () => { //Function to unsubscribe
            NetInfo.isConnected.removeEventListener(
                'connectionChange',
                emitter
            );
        };
    });
}*/

export function createNetworkChangeChannel() {
  // Subscribe
  const unsubscribe = NetInfo.addEventListener(state => {
    console.log('Connection type', state.type);
    console.log('Is connected?', state.isConnected);
  });

  // Unsubscribe
  //unsubscribe();
}
