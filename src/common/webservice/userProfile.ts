import Webservice from './webservice';

function userProfile(url: string, params: Array<any>) {
  const [headers, request] = params;
  return Webservice.postRequest(url, headers, request);
}

function newUserProfile(url: string, params: Array<any>, CB:any) {
  const [headers, request] = params;
  return Webservice.newPostRequest(url, headers, request ,false, 
    resp =>CB(resp));
}

function removeProfilePicture(url: string, params: Array<any>) {
  const [headers, request] = params;
  return Webservice.postRequest(url, headers, request);
}

export { userProfile, removeProfilePicture, newUserProfile };
