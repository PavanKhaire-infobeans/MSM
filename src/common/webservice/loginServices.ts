import { ConsoleType, CueBackInsatance, showConsoleLog } from '../constants';
import EventManager from '../eventManager';
import Webservice from './webservice';

export const kSSOLogin = 'ssoLoginCallback';
function loginRequest(url: string, params: Array<any>) {
  const [param] = params;
  return Webservice.postRequest(
    `${url}/api/portals/login`,
    {checksum: 'Q3VlQmFjazIwMTgh'},
    param.payload,
  );
}

function loginInstanceRequest(url: string, params: Array<any>) {
  const [param] = params;
  return Webservice.postRequest(
    `${url}/api/portals/authenticate_user`,
    {checksum: 'Q3VlQmFjazIwMTgh'},
    param.payload,
  );
}

function getAllIntances(url: string) {
  return Webservice.postRequest(`${url}/api/instances/list`, {
    checksum: 'Q3VlQmFjazIwMTgh',
  });
}

function getRegistrationFor(url: string) {
  return Webservice.postRequest(
    `${url}/api/configurations/registration_form_details`,
    {},
  );
}

function checkPreRegistered(url: string, details: object) {
  return Webservice.postRequest(
    `${url}/api/alumni/check_pre_registration`,
    {},
    details,
  );
}

function registrationSubmit(url: string, details: object) {
  return Webservice.postRequest(`${url}/api/alumni/register`, {}, details);
}

function logout(url: string, userAuthToken: string) {
  return Webservice.postRequest(
    `${url}/api/alumni/logout`,
    {'X-CSRF-TOKEN': userAuthToken},
    {},
    false,
  );
}

function configurations(url: string, userAuthToken: string,CB:any) {
  return Webservice.newPostRequest(
    `${url}/api/configurations/get`,
    {'X-CSRF-TOKEN': userAuthToken, 'Content-Type': 'application/json'},
    {type: 'site'},
    false,
    data => CB(data)
  );
}

function SSOLoginFetch(url: string, param: any) {
  return Webservice.postRequest(url, {checksum: 'Q3VlQmFjazIwMTgh'}, param);
}

export const SSOLogin = async (params: any) => {
  try {
    
    let response = await SSOLoginFetch(
      `https://${CueBackInsatance.InstanceURL}/api/alumni/ssologin`,
      params,
    )
      .then((response: Response) => response.json())
      .catch((err: Error) => {
        Promise.reject(err);
        EventManager.callBack(
          kSSOLogin,
          false,
          'Unable to process your login request',
        );
      });
      showConsoleLog(ConsoleType.LOG,'sos google >',JSON.stringify(params),JSON.stringify(response));

    if (response != undefined && response != null) {
      if (response.ResponseCode == 200) {
        EventManager.callBack(kSSOLogin, true, response);
      } else {
        EventManager.callBack(kSSOLogin, false, response['ResponseMessage']);
      }
    }
  } catch (err) {
    EventManager.callBack(
      kSSOLogin,
      false,
      'Unable to process your request. Please try again later',
    );
  }

  // try {
  // 	let response = await Webservice.postRequest(`${kAdmin}/api/alumni/ssologin`, { checksum: "Q3VlQmFjazIwMTgh" }, params)
  //         .then((response: Response) => response.json())
  // 		.catch((err: Error) => {
  // 			Promise.reject(err)
  // 		});
  // 		if (response != undefined && response != null){
  // 			if(response.ResponseCode==200){
  // 				EventManager.callBack(kChangePassword, true, response["ResponseMessage"]);
  // 			}
  // 			else{
  // 				EventManager.callBack(kChangePassword, false, response["ResponseMessage"]);
  // 			}
  //         }

  //     // if (loginStatus.logindata.ResponseCode == 200) {
  //     //     loginStatus.logindata.Response.forEach((element : any) => {
  //     //         const {
  //     //             UserAuthToken: userAuthToken,
  //     //             UserID: userID,
  //     //             FirstName: firstName,
  //     //             LastName: lastName,
  //     //             ProfileImage : profileImage,
  //     //             is_public_site : is_public_site,
  //     //         } = element.Response;

  //     //         const {
  //     //             site_url: site_url,
  //     //             site_logo_url: site_logo_url,
  //     //             site_name: site_name,
  //     //             id: instanceID,
  //     //         } = element.SiteDetails;

  //     //         this.view.selectedCommunity.values = {
  //     //             email: this.view.state.username,
  //     //             userAuthToken,
  //     //             userID,
  //     //             firstName,
  //     //             lastName,
  //     //             name: site_name,
  //     //             instanceID: parseInt(instanceID),
  //     //             profileImage: profileImage,
  //     //             is_public_site: is_public_site,
  //     //             instanceURL : site_url.replace("https://", "").replace("http://", ""),
  //     //             instanceImage : site_logo_url || "https://qa.cueback.com/sites/qa.cueback.com/default/files/cal-poly-cp_0.png"
  //     //             // profileImage:  this.generateFileForProfile(profileImage)
  //     //         };
  //     //         const values = {...this.view.selectedCommunity}
  //     //         LoginStore.saveOnLogin(values);
  //     //         this.view.dataWasStored = userID;
  //     //         this.view.props.setUser(this.view.selectedCommunity);
  //     //     });
  //     //     setTimeout(() => {
  //     //         let obj = {username: this.view.state.username, password: this.view.state.password};
  //     //         if(this.view.state._isRemeberMe){
  //     //             DefaultPreference.set('loginCredentials', JSON.stringify(obj));
  //     //         } else{
  //     //             DefaultPreference.get('loginCredentials').then((value : any) => {
  //     //                 value = JSON.parse(value);
  //     //                 if(value.username && value.password){
  //     //                     if(obj.username == value.username && obj.password == value.password){
  //     //                         DefaultPreference.set('loginCredentials', null);
  //     //                     }
  //     //                 }
  //     //             })
  //     //         }
  //     //         Actions.dashBoard();
  //     //     }, 100);
  //     //     this.view.props.clean();
  // } catch (err) {
  // 	// EventManager.callBack(kChangePassword, false, "Unable to process your request. Please try again later");
  // }
};

export {
  loginRequest,
  getAllIntances,
  checkPreRegistered,
  getRegistrationFor,
  registrationSubmit,
  logout,
  configurations,
  loginInstanceRequest,
};
