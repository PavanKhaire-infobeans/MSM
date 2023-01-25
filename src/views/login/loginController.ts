import { Keyboard } from 'react-native';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import { No_Internet_Warning, ToastMessage } from '../../common/component/Toast';
import {
  Colors,
  ConsoleType,
  CueBackInsatance,
  ERROR_MESSAGE,
  getValue,
  NO_INTERNET,
  showConsoleLog,
  testEmail,
} from '../../common/constants';
import ViewProtocol from '../../common/interfaces/viewProtocol';
import { Account, LoginStore, UserData } from '../../common/loginStore';
import Utility from '../../common/utility';
// @ts-ignore
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { NativeEventEmitter, NativeModules } from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import EventManager from '../../common/eventManager';
import { kSSOLogin, SSOLogin } from '../../common/webservice/loginServices';

let userInfo: any = {};
export const kAppleCredentials = 'appleUserCredentials';
export type Props = {
  [x: string]: any;
};

export interface LoginViewProtocol extends ViewProtocol {
  props: Props;
  selectedCommunity: Account;
  dataWasStored?: string;
}

export interface LoginControllerProtocol {
  view: LoginViewProtocol;

  onClick: () => void;
  onClickGoogleSignIn: () => void;
  onClickAppleSignIn: () => void;
  SSOLogin: (success: any, response: any) => void;
  onTextChange: (key: string, value: string) => void;
  checkLoggedIn: (loginStatus: object) => void;
}

export class LoginController implements LoginControllerProtocol {
  view: LoginViewProtocol | any;
  ssoLoginCallBack: any;
  appleLogin: any;
  readCallBack: any = true;
  arrayOFTime: any = [];
  appleSubscriber: any;
  eventEmitter = new NativeEventEmitter(NativeModules.EventHandling);
  constructor(view: LoginViewProtocol) {
    this.view = view;
    GoogleSignin.configure({
      webClientId:
        '432679085801-tm2iabnlaf85h9oteafo7rc3h3auq8jf.apps.googleusercontent.com',
    });
    this.proceedWithLogin = this.proceedWithLogin.bind(this);
    this.ssoLoginCallBack = EventManager.addListener(
      kSSOLogin,
      this.SSOLogin.bind(this),
    );
  }

  appleLoginCallBack =(params: any)=> {
    this.appleSubscriber.remove();
    let user = { id: params.id };
    if (params.id != null && params.id.trim() != '') {
      //loaderHandler.showLoader();
      ////this.view.props.showLoader(true);
      //this.view.props.loaderText('Loading...');
      if (params.email != null && params.email.trim() != '') {
        user = {
          ...user,
          photo: '',
          email: params.email,
          familyName: params.familyName,
          givenName: params.givenName,
          name: params.givenName + ' ' + params.familyName,
        };
      }
      userInfo = { user };
      DefaultPreference.get('firebaseToken').then(
        (value: any) => {
          params = {
            userDetails: userInfo.user,
            sso_type: 'Apple',
            fcm_token: value,
          };
          SSOLogin(params);
        },
        (err: any) => {
          params = {
            userDetails: userInfo.user,
            sso_type: 'Apple',
            fcm_token: '',
          };
          SSOLogin(params);
        },
      );
    } else {
      this.view.showErrorMessage(
        true,
        'Unable to fetch details from Apple Sign in',
      );
    }
    showConsoleLog(ConsoleType.LOG, user);
  }

  onClickAppleSignIn =()=> {
    this.appleSubscriber = this.eventEmitter.addListener(
      'ShowMemoryDetails',
      this.appleLoginCallBack.bind(this),
    );
    NativeModules.AppleSignIn.SSOLogin();
  }

  SSOLogin =(success: any, response: any)=> {
    if (success) {
      this.proceedWithLogin(
        response,
        true,
        userInfo.user.email,
        CueBackInsatance,
      );
      // this.view.props.clearDashboard();
      setTimeout(() => {
        this.view.props.navigation.reset({
          index: 0,
          routes: [{ name: 'dashBoard' }]
        })
        //loaderHandler.hideLoader();
        //this.view.props.showLoader(false);
      //this.view.props.loaderText('Loading...');

      }, 100);
      this.view.props.clean();
    } else {
      //loaderHandler.hideLoader();
      //this.view.props.showLoader(false);
      //this.view.props.loaderText('Loading...');

      this.view.showErrorMessage(true, response);
    }
  }

  onClickGoogleSignIn = async () => {
    if (!Utility.isInternetConnected) {
      No_Internet_Warning();
    }
    try {
      await GoogleSignin.hasPlayServices();
      userInfo = await GoogleSignin.signIn();
      let params = {};
      //loaderHandler.showLoader();
      ////this.view.props.showLoader(true);
      //this.view.props.loaderText('Loading...');

      DefaultPreference.get('firebaseToken').then(
        (value: any) => {
          params = {
            userDetails: userInfo.user,
            sso_type: 'Google',
            fcm_token: value,
          };
          SSOLogin(params);
        },
        (err: any) => {
          params = {
            userDetails: userInfo.user,
            sso_type: 'Google',
            fcm_token: '',
          };
          SSOLogin(params);
        },
      );
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        this.view.showErrorMessage(true, 'Sign in process was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        this.view.showErrorMessage(true, 'Sign in is in progess');
        await GoogleSignin.revokeAccess();
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        this.view.showErrorMessage(true, 'Play services not available');
      } else {
        this.view.showErrorMessage(
          true,
          'Unable to login, please try again later',
        );
        // some other error happened
      }
    }
  };

  onClick =()=> {
    if (Utility.isInternetConnected) {
      const { username, password } = this.view.state;
      if (username.length == 0 || password.length == 0) {
        var state = {};
        if (username.length == 0) {
          state = {
            ...state,
            userNameError: {
              error: true,
              text: 'Please enter your email address',
            },
          };
        }
        if (password.length == 0) {
          state = {
            ...state,
            passwordError: {
              error: true,
              text: 'Please enter your password',
            },
          };
        }
        this.view.updateState(state);
        return;
      } else {
        if (!testEmail(username)) {
          this.view.updateState({
            userNameError: {
              error: true,
              text: 'Please enter valid email address',
            },
          });
          return;
        }
      }
      setTimeout(Keyboard.dismiss);
      //loaderHandler.showLoader();
      ////this.view.props.showLoader(true);
      //this.view.props.loaderText('Loading...');

      DefaultPreference.get('firebaseToken').then(
        (value: any) => {
          this.view.showLoaderData();
          this.view.props.fetchLoginAccounts({
            emailId: username,
            password: password,
            fcm_token: value,
            details: {
              type: 'public',
            },
          });
        },
        (err: any) => {
          this.view.props.fetchLoginAccounts({
            emailId: username,
            password: password,
            fcm_token: '',
            details: {
              type: 'public',
            },
          });
         //ToastMessage(err.toString(), Colors.ErrorColor);
        },
      );
    } else {
      this.view._show(NO_INTERNET, Colors.WarningColor);
    }
  }

  /**
   * On Text change event binded to TextFields
   * @param key
   * @param value
   */
  onTextChange = (key: string, value: string)=> {
    var state: { [x: string]: any } = { [key]: value };
    if (
      key == 'username' &&
      this.view.state.userNameError.error == true &&
      value.length > 0
    ) {
      state = {
        ...state,
        userNameError: {
          error: false,
          text: 'Please enter valid Email Address',
        },
      };
    }
    if (
      key == 'password' &&
      this.view.state.passwordError.error == true &&
      value.length > 0
    ) {
      state = {
        ...state,
        passwordError: {
          error: false,
          text: 'Please enter your password',
        },
      };
    }
    this.view.updateState(state);
    showConsoleLog(ConsoleType.LOG, state);
    this.view.showErrorMessage(false);
  }

  generateFileForProfile = (profileImage: any) => {
    if (profileImage != '') {
      var instancePath = `https://${this.view.selectedCommunity.instanceURL}/sites/${this.view.selectedCommunity.instanceURL}/default/files/`;
      var actualPath = profileImage.replace('public://', instancePath);
      return actualPath;
    }
    return '';
  };

  loginUserAccounts = (portal_ids?: any) => {
    //loaderHandler.showLoader();
    ////this.view.props.showLoader(true);
    //this.view.props.loaderText('Loading...');

    const { username, password } = this.view.state;
    let loginObj: any = { emailId: username, password: password, fcm_token: '' };
    if (portal_ids) {
      loginObj = { ...loginObj, portal_ids: portal_ids };
    }
    DefaultPreference.get('firebaseToken').then(
      (value: any) => {
        this.view.props.loginServiceCall({ ...loginObj, fcm_token: value });
      },
      (err: any) => {
        this.view.props.loginServiceCall(loginObj);
       //ToastMessage(err.toString(), Colors.ErrorColor);
      },
    );
  };

  proceedWithLogin = (
    element: any,
    isSSOLogin: boolean,
    username: any,
    siteDetails: any,
  ) => {
    try {
      const {
        UserAuthToken: userAuthToken,
        UserID: userID,
        FirstName: firstName,
        LastName: lastName,
        ProfileImage: profileImage,
        is_public_site: is_public_site,
      } = element.Response;

      let site_url = siteDetails.site_url || siteDetails.InstanceURL;
      let site_logo_url =
        siteDetails.site_logo_url || siteDetails.InstanceImageURL;
      let site_name = siteDetails.site_name || siteDetails.InstanceName;
      let instanceData = siteDetails.id || element.Response.site_id;

      this.view.selectedCommunity.values = {
        email: username,
        userAuthToken,
        userID,
        firstName,
        lastName,
        name: site_name,
        instanceID: parseInt(instanceData),
        profileImage: profileImage,
        is_public_site: is_public_site,
        instanceURL: site_url.replace('https://', '').replace('http://', ''),
        instanceImage:
          site_logo_url ||
          'https://qa.cueback.com/sites/qa.cueback.com/default/files/cal-poly-cp_0.png',
        isSSOLogin: isSSOLogin,
        // profileImage:  this.generateFileForProfile(profileImage)
      };
      const values = { ...this.view.selectedCommunity };
      LoginStore.saveOnLogin(values);
      this.view.dataWasStored = userID;
      this.view.props.setUser(this.view.selectedCommunity);
    } catch (error) {
      showConsoleLog(ConsoleType.LOG, "login info err :", error)
    }
  };

  /**
   * Check if user is logged in after web service call or not
   */
  checkLoggedIn = (loginStatus: any) => {
    // showConsoleLog(ConsoleType.LOG, "show data :", loginStatus);

    if (loginStatus.logincompleted) {
      //loaderHandler.hideLoader();
      // //this.view.props.showLoader(false);
      //this.view.props.loaderText('Loading...');

      //If Login is success full
      if (loginStatus.loginsuccess) {
        //If Response code is success
        if (loginStatus.logindata.ResponseCode == 200) {
          // this.view.props.clearDashboard();
          this.view.props.clean();  
          loginStatus.logindata.Response.forEach((element: any) => {
            this.proceedWithLogin(
              element,
              false,
              this.view.state.username,
              element.SiteDetails,
            );
          });
          
          setTimeout(() => {
            let obj = {
              username: this.view.state.username,
              password: this.view.state.password,
            };
            if (this.view.state._isRemeberMe) {
              DefaultPreference.set('loginCredentials', JSON.stringify(obj));
            } else {
              DefaultPreference.get('loginCredentials').then((value: any) => {
                value = value ? JSON.parse(value) : null;
                if (value && (value.username && value.password)) {
                  if (
                    obj.username == value.username &&
                    obj.password == value.password
                  ) {
                    DefaultPreference.set('loginCredentials', '');
                  }
                }
              });
            }

            // Actions.dashBoard();
            this.view.props.navigation.reset({
              index: 0,
              routes: [{ name: 'dashBoard' }]
            })
          }, 500);
        } else {
          let errorMessage = getValue(loginStatus, ['data', 'message'])
            ? getValue(loginStatus, ['data', 'message'])
            : ERROR_MESSAGE;
          showConsoleLog(ConsoleType.LOG, errorMessage);
          this.view.showErrorMessage(true, errorMessage);
        }
      } else {
        //If web service failed
        var msg: { message: string; ResponseMessage: string } = getValue(
          loginStatus,
          ['logindata'],
        );
        var message = msg?.message || msg?.ResponseMessage || ERROR_MESSAGE;
        showConsoleLog(ConsoleType.LOG,"errr on login :", message);
        this.view.showErrorMessage(true, message);
      }
    } else if (loginStatus.instanceCompleted && !loginStatus.loginStarted) {
      //loaderHandler.hideLoader();
      // this.view.props.showLoader(false);
      // this.view.props.loaderText('Loading...');

      if (loginStatus.instanceSuccess && loginStatus.callLogin) {
        if (Utility.isInternetConnected) {
          let isDisabledAccount = false;
          let list: any = [];
          LoginStore.listAllAccounts()
            .then((resp: any) => {
              list = resp.rows.raw();
              list = list.filter((it: UserData) => it.userAuthToken != '');
              loginStatus.instanceData.Response.forEach(
                (element: any, index: any) => {
                  list.forEach((elementOfLoggedIn: any) => {
                    if (elementOfLoggedIn.instanceID == element.id) {
                      loginStatus.instanceData.Response[index].isDisabled =
                        true;
                      list.push(element.id);
                      isDisabledAccount = true;
                    }
                  });
                },
              );

              if (
                loginStatus.instanceData.Response.length > 1 ||
                isDisabledAccount
              ) {
                //loaderHandler.hideLoader();
                //this.view.props.showLoader(false);
                //this.view.props.loaderText('Loading...');
                // showConsoleLog(ConsoleType.LOG, loginStatus.instanceData.Response);
                this.view.updateState({
                  ...this.view.state,
                  isVisible: true,
                  instanceData: loginStatus.instanceData.Response,
                  isDisabledAccount: isDisabledAccount,
                });

              }
              else {
                this.loginUserAccounts(loginStatus.instanceData.Response[0].id);
              }
            })
            .catch((err: Error) => {
              showConsoleLog(ConsoleType.LOG, err);
            });
        } else {
          this.view._show(NO_INTERNET, Colors.WarningColor);
        }
      } else {
        var msg: { message: string; ResponseMessage: string } = getValue(
          loginStatus,
          ['instanceData'],
        );
        var message = msg?.message || msg?.ResponseMessage || ERROR_MESSAGE;
        showConsoleLog(ConsoleType.LOG, message);
        this.view.showErrorMessage(true, message);
      }
    }
  };
}
