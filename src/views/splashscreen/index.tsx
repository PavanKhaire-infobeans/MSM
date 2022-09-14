import React, {Component} from 'react';
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
import {decode_utf8, fontSize} from '../../common/constants';
import EventManager from '../../common/eventManager';
import {Account} from '../../common/loginStore';
import LoginStore, {UserData} from '../../common/loginStore/database';
import Utility from '../../common/utility';
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
class Splash extends Component<Props> {
  state = {
    fromDeeplinking: false,
    navigateToScreen: '',
    decodedDataFromURL: '',
    deeplinkMemoryType: '',
    apiCalldoneOnce: false,
  };
  memoryFromPrompt: EventManager;
  getPromptListener: EventManager;

  promptToMemoryCallBack = (success: boolean, draftDetails: any) => {
    // setTimeout(() => {
    //   loaderHandler.hideLoader();
    // }, 500);
    if (success) {
      // this.props.navigation.navigate('createMemory', {
      //   editMode: true,
      //   draftNid: draftDetails,
      //   isFromPrompt: true,
      //   deepLinkBackClick: true
      // });
    } else {
      loaderHandler.hideLoader();
      ToastMessage(draftDetails);
    }
  };

  async componentWillMount() {
    this.memoryFromPrompt = EventManager.addListener(
      promptIdListener,
      this.promptToMemoryCallBack,
    );

    this.getPromptListener = EventManager.addListener(
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
            draftDetails.prompt_id = parseInt(this.state.decodedDataFromURL);

            CreateUpdateMemory(draftDetails, [], promptIdListener, 'save');
          } else {
            No_Internet_Warning();
          }
        } else {
          // this.props.navigation.replace('dashBoard');
        }
      },
    );

    const initialUrl = await Linking.getInitialURL()
      .then(async url => {
        if (url) {
          if (Utility.isInternetConnected) {
            this.setState(
              {
                fromDeeplinking: true,
              },
              () => {
                let splitUrl = url.split('/');
                let urlreDirectTo = splitUrl && splitUrl[3];
                if (urlreDirectTo && urlreDirectTo.includes('edit')) {
                  if (splitUrl[4].includes('prompt')) {
                    this.setState({
                      navigateToScreen: 'PromptScreen',
                      decodedDataFromURL: splitUrl[5]
                        ? base64.decode(splitUrl[5])
                        : '',
                    });
                  } else if (splitUrl[4].includes('mystory')) {
                    this.setState({
                      navigateToScreen: 'mystory',
                      decodedDataFromURL: splitUrl[5]
                        ? base64.decode(splitUrl[5])
                        : '',
                    });
                  } else {
                    // this.props.navigation.replace('dashBoard');
                  }
                } else if (urlreDirectTo && urlreDirectTo == 'memory') {
                  let urlData = splitUrl[4] ? base64.decode(splitUrl[4]) : '';
                  let splitData = urlData != '' ? urlData.split('/') : '';
                  let idData = escape(splitData[1]).split('%');
                  this.setState({
                    navigateToScreen: 'memory',
                    decodedDataFromURL: idData[0],
                    deeplinkMemoryType: splitData[0],
                  });
                } else if (
                  urlreDirectTo &&
                  urlreDirectTo.includes('memory_draft')
                ) {
                  this.setState({
                    navigateToScreen: 'myMemories',
                    decodedDataFromURL: splitUrl[4] ? true : false,
                  });
                } else if (
                  urlreDirectTo &&
                  urlreDirectTo.includes('email_request?a=')
                ) {
                  //
                  let tempurl = urlreDirectTo;
                  let getData = tempurl.replace('email_request?a=', '');

                  this.setState({
                    navigateToScreen: 'PromptCreate',
                    decodedDataFromURL: base64.decode(getData),
                  });
                } else if (urlreDirectTo && urlreDirectTo == 'about') {
                  this.setState({
                    navigateToScreen: 'about',
                    decodedDataFromURL: '',
                  });
                } else {
                  // this.props.navigation.replace('dashBoard');
                }
              },
            );
          } else {
            No_Internet_Warning();
          }
        }
      })
      .catch(err => console.log('An error occurred' + err));

    LoginStore.listAllAccounts().then((resp: any) => {
      let list = resp.rows.raw() as Array<UserData>;
      let obj = {};
      list.forEach((element: any) => {
        obj = {...obj, [`${element.instanceID}_${element.userID}`]: 0};
      });
      Utility.unreadNotification = {...obj};
      console.log('Notification object has : ', Utility.unreadNotification);
    });
    setTimeout(() => {
      this.props.getUser();
    }, 2500);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.user.instanceID != 0 &&
      nextProps.user.userAuthToken != null
    ) {
      Account.selectedData().values = nextProps.user;
      // this.props.navigation.reset("dashboardIndex")
      try {
        // this.props.fetchFiltersDataTimeline({ type: ListType.Timeline });

        if (this.state.fromDeeplinking) {

          if (!this.state.apiCalldoneOnce) {
            if (Utility.isInternetConnected) {
              if (this.state.navigateToScreen == 'mystory') {
                this.setState(
                  {
                    apiCalldoneOnce: true,
                  },
                  () => {
                    // this.props.navigation.replace("createMemory", { editMode: true, draftNid: this.state.decodedDataFromURL, deepLinkBackClick: true })
                  },
                );
              } else if (this.state.navigateToScreen == 'myMemories') {
                this.setState(
                  {
                    apiCalldoneOnce: true,
                  },
                  () => {
                    // this.props.navigation.replace("memoriesDrafts", { fromDeepLink: this.state.decodedDataFromURL, deepLinkBackClick: true })
                  },
                );
              } else if (this.state.navigateToScreen == 'memory') {
                this.setState(
                  {
                    apiCalldoneOnce: true,
                  },
                  () => {
                    // this.props.navigation.replace("memoryDetails", { editMode: false, nid: this.state.decodedDataFromURL, type: this.state.deeplinkMemoryType, deepLinkBackClick: true })
                  },
                );
              } else if (this.state.navigateToScreen == 'about') {
                this.setState(
                  {
                    apiCalldoneOnce: true,
                  },
                  () => {
                    // this.props.navigation.replace("moreOptions", { fromDeepLink: true, deepLinkBackClick: true })
                  },
                );
              } else if (this.state.navigateToScreen == 'PromptScreen') {
                this.setState(
                  {
                    apiCalldoneOnce: true,
                  },
                  () => {
                    GetPromptBYPromptId(this.state.decodedDataFromURL);
                  },
                );
              } else if (this.state.navigateToScreen == 'PromptCreate') {
                this.setState(
                  {
                    apiCalldoneOnce: true,
                  },
                  () => {
                    let splitArray = this.state.decodedDataFromURL.split('&&&');
                    let id: any = splitArray[2],
                      title: any = splitArray[4];
                    if (Utility.isInternetConnected) {
                      if (nextProps.user.userID == splitArray[1]) {
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
                          );
                        } else if (
                          splitArray[3] &&
                          splitArray[3] === 'mindpopup'
                        ) {
                          // this.props.navigation.replace("mindPop", { nid: id, fromDeeplinking: true, deepLinkBackClick: true })
                        } else {
                          // this.props.navigation.replace('dashBoard');
                        }
                      } else {
                        // this.props.navigation.replace('dashBoard');
                      }
                    } else {
                      No_Internet_Warning();
                    }
                  },
                );
              } else {
                // this.props.navigation.replace('dashBoard');
              }
            } else {
              No_Internet_Warning();
              this.props.navigation.reset({
                index: 0,
                routes: [{name: 'prologue'}],
              });
            }
          }
        } else {
          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'dashBoard'}],
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else if (
      (nextProps.user.instanceID != 0 &&
        (nextProps.user.userAuthToken == null ||
          nextProps.user.userAuthToken.length == 0)) ||
      nextProps.user.notLoggedIn
    ) {
      DefaultPreference.get('hide_app_intro').then((value: any) => {
        if (value == 'true') {
          try {
            // Actions.prologue();
            this.props.navigation.reset({
              index: 0,
              routes: [{name: 'prologue'}],
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          // Actions.appIntro();
          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'prologue'}],
          });
        }
      });
    }
  }

  componentWillUnmount = () => {
    this.memoryFromPrompt.removeListener();
    this.getPromptListener.removeListener();
  };

  render() {
    let versionNumber = DeviceInfo.getVersion();
    return (
      <View style={Styles.container}>
        <StatusBar
          barStyle={
            Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
          }
          translucent
          backgroundColor="transparent"
        />
        {/* <StatusBar
          barStyle={'dark-content'}
          backgroundColor={Colors.Theme51D1FF}
        /> */}
        <ImageBackground source={splash_bg} style={Styles.imageBackGroundStyle}>
          {/*<View style={{ maxWidth: 240, alignItems: "center", alignSelf: 'center', paddingTop : 30 }}>
					<Image style={{ width: 300, height: 100 }} resizeMode="contain" source={msm_coloured_banner} />
					<Image style={{ width: 240, height: 65, marginTop: 24, tintColor: "#000"}}resizeMode="center" source={splashText}/>
		</View>*/}
          <View style={Styles.versionContainer}>
            <Text style={Styles.Version}>Version: {versionNumber}</Text>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const mapState = (state: {[x: string]: any}): {user: UserData} => ({
  user: state.account,
});
const mapDispatch = (dispatch: Function) => ({
  getUser: () => dispatch({type: UserAccount.Get}),
  fetchFiltersDataTimeline: (payload: any) =>
    dispatch({type: GET_FILTERS_DATA_TIMELINE, payload: payload}),
});

export default connect(mapState, mapDispatch)(Splash);
