import { Platform, Alert, DeviceEventEmitter } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Storage } from '../constants';
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
      this.props.navigation.reset('prologue');
    });
  return LoginStore.listAllAccounts();
};

export async function logout() {
  loaderHandler.hideLoader();
  if (await getshowLogoutPopUp() === false) {
    console.error("in show alert >>>")
    Alert.alert('', 'Your session is timed out\nPlease login again', [
      {
        text: 'Ok',
        onPress: () => { },
      },
    ]);
    await setshowLogoutPopUp(true);
    await logoutFlow();
  }
  
}

function logoutFlow() {
  logoutMethod()
    .then((resp: any) => {
      let list = resp.rows.raw();
      let accounts = list.filter((it: UserData) => it.userAuthToken != '');
      if (accounts.length > 0) {
        let user: UserData = accounts[accounts.length - 1];
        DeviceEventEmitter.emit('logout', { accounts, user });
      } else {
        if (this.props.navigation.currentScene !== 'login') {
          this.props.navigation.replace('prologue');
        }
      }
    })
    .catch(err => {
      if (this.props.navigation.currentScene !== 'login') {
        this.props.navigation.replace('prologue');
      }
    });
}

const WebserviceCall = (function () {
  return {
    adminPath: '/cuebackadmin',
    path: '/cueback',
    getRequest: (url: string, headers: object): Promise<Response> => {
      console.log("URL : " + url, "\nMethod : GET\n", "Headers", JSON.stringify(headers));

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
          console.log("resp.headers :", resp.headers);
          let rsp = resp.clone();
          return rsp
            .json()
            .then((value: any): any => {
              if (
                value.ResponseCode == 405 ||
                value.ResponseCode == 402 ||
                value.ResponseCode == 401
              ) {
                loaderHandler.hideLoader();
                console.log("resp value :", JSON.stringify(value));

                if (value.responseMessage == 'Authentication token expired.') {
                  console.log("Authentication token expired :", JSON.stringify(value));
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
      //console.log("URL : " + url, "\nMethod : POST\n", "Request", JSON.stringify(reqMod));
      //console.log("Headers", JSON.stringify(headers));
      if (!Utility.isInternetConnected) {
        //return Promise.reject(new Error(NO_INTERNET));
      }
      console.log('request : login ' + url, new Date().toTimeString());
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
          console.log(JSON.stringify(resp, null, 4));
          console.log("headers another :", JSON.stringify(headers), url);
          return rsp
            .json()
            .then((value: any): any => {
              try {
                console.log(
                  'request : received  ' + url,
                  new Date().toTimeString(),
                  JSON.stringify(request)
                );
                // console.log('Response is : ', value);
                if (
                  value.ResponseCode == 405 ||
                  value.ResponseCode == 402 ||
                  value.ResponseCode == 401
                ) {
                  loaderHandler.hideLoader();
                  //TODO: Consult Web team and get unique ResponseCode of invalid session.
                  console.log("Authentication token expired another :", JSON.stringify(value), url);
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
                console.error("reeee : ", error)
              }

            })
            .catch((err: Error) => {
              console.log('Error is : ', err);
              return Promise.reject(err);
            });
        })
        .catch((err: Error) => {
          console.log('Error is : ', err);
          return Promise.reject(err);
        });
    },
  };
})();

export default WebserviceCall;
