import React, {Component, useEffect, useState} from 'react';
import {
  ImageBackground,
  Linking,
  NativeEventEmitter,
  NativeModules,
  StatusBar,
  View,
} from 'react-native';
import base64 from 'react-native-base64';
import DefaultPreference from 'react-native-default-preference';
import DeviceInfo from 'react-native-device-info';
import {connect} from 'react-redux';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import Text from '../../common/component/Text';
import {No_Internet_Warning, ToastMessage} from '../../common/component/Toast';
import {
  ConsoleType,
  decode_utf8,
  fontSize,
  showConsoleLog,
} from '../../common/constants';
import EventManager from '../../common/eventManager';
import {Account} from '../../common/loginStore';
import LoginStore, {UserData} from '../../common/loginStore/database';
import Utility from '../../common/utility';
import WebserviceCall from '../../common/webservice/webservice';
import {splash_bg} from '../../images';
import {
  CreateUpdateMemory,
  promptIdListener,
} from '../createMemory/createMemoryWebService';
import {DefaultDetailsMemory} from '../createMemory/dataHelper';
import {
  GET_FILTERS_DATA_TIMELINE,
  ListType,
} from '../dashboard/dashboardReducer';
import {UserAccount} from '../menu/reducer';
import {
  GetPromptBYPromptId,
  kGetPromptByID,
} from '../myMemories/myMemoriesWebService';
import Styles from './styles';
export const eventEmitter = new NativeEventEmitter(NativeModules.EventHandling);

type Props = {
  getUser: Function;
  user: UserData & {notLoggedIn: boolean};
  fetchFiltersDataTimeline: Function;
};
const Splash = props => {
  const [fromDeeplinking, setFromDeepLinking] = useState(false);
  const [navigateToScreen, setNavigateToScreen] = useState('');
  const [decodedDataFromURL, setDecodedDataFromURL] = useState('');
  const [deeplinkMemoryType, setDeeplinkMemoryType] = useState('');
  const [apiCalldoneOnce, setApiCallDoneOnce] = useState(false);

  useEffect(() => {
    WebserviceCall.navigation(props.navigation);
    const getPromptListener = EventManager.addListener(
      kGetPromptByID,
      (success: boolean, fetchPrompt?: any) => {
        if (
          success &&
          fetchPrompt.type == 'prompts' &&
          fetchPrompt.status == '1'
        ) {
          if (Utility.isInternetConnected) {
            loaderHandler.showLoader('Creating Memory...');
            let draftDetails: any = DefaultDetailsMemory(fetchPrompt.title);
            draftDetails.prompt_id = parseInt(decodedDataFromURL);

            CreateUpdateMemory(
              draftDetails,
              [],
              promptIdListener,
              'save',
              response => {
                if (response.success) {
                  props.navigation.navigate('createMemory', {
                    editMode: true,
                    draftNid: response.id,
                    isFromPrompt: true,
                    deepLinkBackClick: true,
                  });
                } else {
                  loaderHandler.hideLoader();
                  ToastMessage(
                    response?.ResponseMessage
                      ? response?.ResponseMessage
                      : 'Error while proccessing',
                  );
                }
              },
            );
          } else {
            No_Internet_Warning();
          }
        } else {
          // props.navigation.replace('dashBoard');
        }
      },
    );

    const initiateDeepLink = async () => {
      const initialUrl = await Linking.getInitialURL()
        .then(async url => {
          if (url) {
            if (Utility.isInternetConnected) {
              setFromDeepLinking(true);

              let splitUrl = url.split('/');
              let urlreDirectTo = splitUrl && splitUrl[3];
              if (urlreDirectTo && urlreDirectTo.includes('edit')) {
                if (splitUrl[4].includes('prompt')) {
                  setNavigateToScreen('PromptScreen');
                  setDecodedDataFromURL(
                    splitUrl[5] ? base64.decode(splitUrl[5]) : '',
                  );
                } else if (splitUrl[4].includes('mystory')) {
                  setNavigateToScreen('mystory');
                  setDecodedDataFromURL(
                    splitUrl[5] ? base64.decode(splitUrl[5]) : '',
                  );
                } else {
                  // props.navigation.replace('dashBoard');
                }
              } else if (urlreDirectTo && urlreDirectTo == 'memory') {
                let urlData = splitUrl[4] ? base64.decode(splitUrl[4]) : '';
                let splitData = urlData != '' ? urlData.split('/') : '';
                let idData = escape(splitData[1]).split('%');
                setNavigateToScreen('memory');
                setDecodedDataFromURL(idData[0]);
                setDeeplinkMemoryType(splitData[0]);
              } else if (
                urlreDirectTo &&
                urlreDirectTo.includes('memory_draft')
              ) {
                setNavigateToScreen('myMemories');
                setDecodedDataFromURL(splitUrl[4] ? 'true' : 'false');
              } else if (
                urlreDirectTo &&
                urlreDirectTo.includes('email_request?a=')
              ) {
                //
                let tempurl = urlreDirectTo;
                let getData = tempurl.replace('email_request?a=', '');
                setNavigateToScreen('PromptCreate');
                setDecodedDataFromURL(base64.decode(getData));
              } else if (urlreDirectTo && urlreDirectTo == 'about') {
                setNavigateToScreen('about');
                setDecodedDataFromURL('');
              } else {
                // props.navigation.replace('dashBoard');
              }
            } else {
              No_Internet_Warning();
            }
          }
        })
        .catch(err =>
          showConsoleLog(ConsoleType.LOG, 'An error occurred' + err),
        );
    };
    initiateDeepLink();
    LoginStore.listAllAccounts().then((resp: any) => {
      let list = resp.rows.raw() as Array<UserData>;
      let obj = {};
      list.forEach((element: any) => {
        obj = {...obj, [`${element.instanceID}_${element.userID}`]: 0};
      });
      Utility.unreadNotification = {...obj};
      showConsoleLog(
        ConsoleType.LOG,
        'Notification object has : ',
        Utility.unreadNotification,
      );
    });
    setTimeout(() => {
      props.getUser();
    }, 2500);

    return () => {
      getPromptListener.removeListener();
    };
  }, []);

  useEffect(() => {
    if (props.user.instanceID != 0 && props.user.userAuthToken != null) {
      Account.selectedData().values = props.user;
      // props.navigation.reset("dashboardIndex")
      try {
        props.fetchFiltersDataTimeline({type: ListType.Timeline});

        if (fromDeeplinking) {
          if (!apiCalldoneOnce) {
            if (Utility.isInternetConnected) {
              if (navigateToScreen == 'mystory') {
                setApiCallDoneOnce(true);
              } else if (navigateToScreen == 'myMemories') {
                setApiCallDoneOnce(true);
              } else if (navigateToScreen == 'memory') {
                setApiCallDoneOnce(true);
              } else if (navigateToScreen == 'about') {
                setApiCallDoneOnce(true);
              } else if (navigateToScreen == 'PromptScreen') {
                setApiCallDoneOnce(true);
                GetPromptBYPromptId(decodedDataFromURL);
              } else if (navigateToScreen == 'PromptCreate') {
                setApiCallDoneOnce(true);
                let splitArray = decodedDataFromURL.split('&&&');
                let id: any = splitArray[2],
                  title: any = splitArray[4];
                if (Utility.isInternetConnected) {
                  if (props.user.userID == splitArray[1]) {
                    if (splitArray[3] && splitArray[3] === 'writeprompt') {
                      loaderHandler.showLoader('Creating Memory...');
                      let draftDetails: any = DefaultDetailsMemory(
                        decode_utf8(title.trim()),
                      );
                      draftDetails.prompt_id = parseInt(id);

                      CreateUpdateMemory(
                        draftDetails,
                        [],
                        promptIdListener,
                        'save',
                        response => {
                          if (response.success) {
                            props.navigation.navigate('createMemory', {
                              editMode: true,
                              draftNid: response.id,
                              isFromPrompt: true,
                              deepLinkBackClick: true,
                            });
                          } else {
                            loaderHandler.hideLoader();
                            ToastMessage(
                              response?.ResponseMessage
                                ? response?.ResponseMessage
                                : 'Error while proccessing',
                            );
                          }
                        },
                      );
                    } else if (splitArray[3] && splitArray[3] === 'mindpopup') {
                      // props.navigation.replace("mindPop", { nid: id, fromDeeplinking: true, deepLinkBackClick: true })
                    } else {
                      // props.navigation.replace('dashBoard');
                    }
                  } else {
                    // props.navigation.replace('dashBoard');
                  }
                } else {
                  No_Internet_Warning();
                }
              } else {
                // props.navigation.replace('dashBoard');
              }
            } else {
              No_Internet_Warning();
              props.navigation.reset({
                index: 0,
                routes: [{name: 'prologue'}],
              });
            }
          }
        } else {
          props.navigation.reset({
            index: 0,
            routes: [{name: 'dashBoard'}],
          });
        }
      } catch (error) {
        showConsoleLog(ConsoleType.LOG, error);
      }
    } else if (
      (props.user.instanceID != 0 &&
        (props.user.userAuthToken == null ||
          props.user.userAuthToken.length == 0)) ||
      props.user.notLoggedIn
    ) {
      DefaultPreference.get('hide_app_intro').then((value: any) => {
        if (value == 'true') {
          try {
            // Actions.prologue();
            props.navigation.reset({
              index: 0,
              routes: [{name: 'prologue'}],
            });
          } catch (error) {
            showConsoleLog(ConsoleType.LOG, error);
          }
        } else {
          // Actions.appIntro();
          props.navigation.reset({
            index: 0,
            routes: [{name: 'appIntro'}],
          });
        }
      });
    }
  }, [props.user]);

  return (
    <View style={Styles.container}>
      <StatusBar
        barStyle={
          Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
        }
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground source={splash_bg} style={Styles.imageBackGroundStyle}>
        <View style={Styles.versionContainer}>
          <Text
            style={
              Styles.Version
            }>{`Version: ${DeviceInfo.getVersion()}`}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const mapState = (state: {[x: string]: any}): {user: UserData} => ({
  user: state.account,
});
const mapDispatch = (dispatch: Function) => ({
  getUser: () => dispatch({type: UserAccount.Get}),
  fetchFiltersDataTimeline: (payload: any) =>
    dispatch({type: GET_FILTERS_DATA_TIMELINE, payload: payload}),
});

export default connect(mapState, mapDispatch)(Splash);
