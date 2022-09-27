import { Platform, Alert, DeviceEventEmitter } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { ConsoleType, showConsoleLog, Storage } from '../constants';
import Utility, { getshowLogoutPopUp, setshowLogoutPopUp } from '../utility';
import loaderHandler from '../component/busyindicator/LoaderHandler';
import { LoginStore, Account, UserData } from '../loginStore';
import { ToastMessage } from '../component/Toast';

export const logoutMethod = () => {
  Storage.delete('userData');
  LoginStore.logout(
    Account.selectedData().instanceID,
    parseInt(Account.selectedData().userID),
  );
  return LoginStore.listAllAccounts();
};

export const logoutMultiple = (selectedAccounts: any) => {
  selectedAccounts.forEach((element: any) => {
    LoginStore.logout(element.instanceID, parseInt(element.userID));
  });
  LoginStore.listAllAccounts()
    .then((resp: any) => {
      let list = resp.rows.raw();
      var accounts = list.filter((it: UserData) => it.userAuthToken != '');
      if (accounts.length < 1) {
        Storage.save('userData', null);
      }
    })
    .catch(err => {
      // Actions.reset('prologue');
    });
  return LoginStore.listAllAccounts();
};

export async function logout() {
  loaderHandler.hideLoader();
  if (await getshowLogoutPopUp() === false) {
    Alert.alert('', 'Your session is timed out\nPlease login again', [
      {
        text: 'Ok',
        onPress: async () => {
          await logoutFlow();
        },
      },
    ]);
    await setshowLogoutPopUp(true);
  }
};

function logoutFlow() {

  logoutMethod()
    .then((resp: any) => {
      let list = resp.rows.raw();

      let accounts = list.filter((it: UserData) => it.userAuthToken != '');

      if (accounts.length > 0) {
        let user: UserData = accounts[accounts.length - 1];
        DeviceEventEmitter.emit('logout', { accounts, user });
      }
      else {
        try {
          WebserviceCall.navigation().reset({
            index: 0,
            routes: [{ name: 'prologue' }]
          })
        } catch (error) {
          
        }
       
        // if (currentScene !== 'login') {
        //   navigate('prologue');
        // }
      }
    })
    .catch(err => {
      // reset({
      //   index: 0,
      //   routes: [{ name: 'prologue' }]
      // })
      // if (currentScene !== 'login') {
      //   navigate('prologue');
      // }
    });
}

const WebserviceCall = (() => {
  return {
    adminPath: '/cuebackadmin',
    path: '/cueback',
    navProps: null,
    navigation: (navitionProps?) => {
      if (navitionProps === undefined) {
        return WebserviceCall.navProps
      }
      else if (navitionProps) {
        WebserviceCall.navProps = navitionProps;
      }
    },
    getRequest: (url: string, headers: object): Promise<Response> => {
      showConsoleLog(ConsoleType.LOG, "URL : " + url, "\nMethod : GET\n", "Headers", JSON.stringify(headers));
      let requestTime = new Date()
      if (!Utility.isInternetConnected) {
        // return Promise.reject(new Error(NO_INTERNET));
      }

      return fetch(url, {
        method: 'GET',
        headers: {
          ...headers,
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json; charset=utf-8',
        },
      })
        .then((resp: Response) => {
          showConsoleLog(ConsoleType.LOG, "resp.headers :", resp.headers);
          let rsp = resp.clone();
          return rsp
            .json()
            .then((value: any): any => {
              showConsoleLog(ConsoleType.WARN, " response time :-: ", (new Date() - requestTime) / 1000)
              if (
                value.ResponseCode == 405 ||
                value.ResponseCode == 402 ||
                value.ResponseCode == 401
              ) {
                loaderHandler.hideLoader();
                showConsoleLog(ConsoleType.LOG, "resp value :", JSON.stringify(value));

                if (value.responseMessage == 'Authentication token expired.') {
                  showConsoleLog(ConsoleType.LOG, "Authentication token expired :", JSON.stringify(value));
                  logout();
                }
                return Promise.reject(resp);
              }
              return resp;
            })
            .catch((err: Error) => {
              return Promise.reject(err);
            });
        })
        .catch((err: Error) => {
          //logout();
          return Promise.reject(err);
        });
    },
    postRequest: (
      url: string,
      headers: object,
      request: object = {},
      addRequest: boolean = true,
    ): Promise<Response> => {
      let reqMod = {
        ...request,
      };
      let requestTime: Date = new Date()
      if (addRequest) {
        reqMod = {
          ...request,
          deviceDetail: {
            ModelName: DeviceInfo.getModel(),
            OSVersion: DeviceInfo.getSystemVersion(),
            PlatformName: Platform.select({ ios: 'iOS', android: 'Android' }),
            AppVersion: DeviceInfo.getVersion(),
            DeviceId: DeviceInfo.getUniqueId(),
          },
        };
      }
      //showConsoleLog(ConsoleType.LOG,"URL : " + url, "\nMethod : POST\n", "Request", JSON.stringify(reqMod));
      //showConsoleLog(ConsoleType.LOG,"Headers", JSON.stringify(headers));
      if (!Utility.isInternetConnected) {
        //return Promise.reject(new Error(NO_INTERNET));
      }
      showConsoleLog(ConsoleType.LOG, 'request : login ' + url, new Date().toTimeString());
      return fetch(url, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(reqMod),
      })
        .then((resp: any) => {
          let rsp = resp.clone();
          showConsoleLog(ConsoleType.LOG, JSON.stringify(resp, null, 4));
          showConsoleLog(ConsoleType.LOG, "headers another :", JSON.stringify(headers), url);
          return rsp
            .json()
            .then((value: any): any => {
              try {
                showConsoleLog(ConsoleType.LOG,
                  'request : received  ' + url,
                  new Date().toTimeString(),
                  JSON.stringify(request)
                );
                showConsoleLog(ConsoleType.WARN, " response time :-: ", (new Date() - requestTime) / 1000)
                // showConsoleLog(ConsoleType.LOG,'Response is : ', value);
                if (
                  value.ResponseCode == 405 ||
                  value.ResponseCode == 402 ||
                  value.ResponseCode == 401
                ) {
                  // loaderHandler.hideLoader();
                  //TODO: Consult Web team and get unique ResponseCode of invalid session.
                  showConsoleLog(ConsoleType.LOG, "Authentication token expired another :", JSON.stringify(value), url);
                  if (
                    value.ResponseMessage == 'Authentication token expired.' ||
                    value.ResponseMessage == 'Invalid authentication token.'
                  ) {
                    ToastMessage('', '', true);
                    logout();
                  } //5461
                  return Promise.reject(Error(value.ResponseMessage));
                }
                return resp;
              } catch (error) {
                showConsoleLog(ConsoleType.ERROR, "reeee : ", error)
              }

            })
            .catch((err: Error) => {
              showConsoleLog(ConsoleType.LOG, 'Error is : ', err);
              return Promise.reject(err);
            });
        })
        .catch((err: Error) => {
          showConsoleLog(ConsoleType.LOG, 'Error is : ', err);
          return Promise.reject(err);
        });
    },
    newPostRequest: async (
      url: string,
      headers: object,
      request: object = {},
      addRequest: boolean = true,
      CB: (data) => void
    ) => {
      let reqMod = {
        ...request,
      };
      let requestTime: Date = new Date()
      if (addRequest) {
        reqMod = {
          ...request,
          deviceDetail: {
            ModelName: DeviceInfo.getModel(),
            OSVersion: DeviceInfo.getSystemVersion(),
            PlatformName: Platform.select({ ios: 'iOS', android: 'Android' }),
            AppVersion: DeviceInfo.getVersion(),
            DeviceId: DeviceInfo.getUniqueId(),
          },
        };
      }
      //showConsoleLog(ConsoleType.LOG,"URL : " + url, "\nMethod : POST\n", "Request", JSON.stringify(reqMod));
      //showConsoleLog(ConsoleType.LOG,"Headers", JSON.stringify(headers));
      if (!Utility.isInternetConnected) {
        //return Promise.reject(new Error(NO_INTERNET));
      }
      showConsoleLog(ConsoleType.LOG, 'request : login ' + url, new Date().toTimeString());
      let responseData = await fetch(url, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(reqMod),
      }).then((response) => response.json())
        .then((resp: any) => {
          // let rsp = resp.clone();
          // showConsoleLog(ConsoleType.LOG,"headers another :", JSON.stringify(headers), url);

          try {
            showConsoleLog(ConsoleType.WARN, " response time :-: ", (new Date() - requestTime) / 1000)
            // showConsoleLog(ConsoleType.LOG,'Response is : ', value);
            if (
              resp.ResponseCode == 405 ||
              resp.ResponseCode == 402 ||
              resp.ResponseCode == 401
            ) {
              // loaderHandler.hideLoader();
              //TODO: Consult Web team and get unique ResponseCode of invalid session.
              showConsoleLog(ConsoleType.LOG, "Authentication token expired another :", JSON.stringify(resp), url);
              if (
                resp.ResponseMessage == 'Authentication token expired.' ||
                resp.ResponseMessage == 'Invalid authentication token.'
              ) {
                ToastMessage('', '', true);
                logout();
              } //5461

              // return Promise.reject(Error(resp.ResponseMessage));
            }
            CB(resp)
            // return resp;
          } catch (error) {
            showConsoleLog(ConsoleType.ERROR, "reeee : ", error)
          }

        })
        .catch((err: Error) => {
          showConsoleLog(ConsoleType.LOG, 'Error is : ', err);
          return Promise.reject(err);
        });
    },
  };
})();

export default WebserviceCall;
