import Webservice from './webservice';

function userProfile(url: string, params: Array<any>) {
    const [headers, request] = params
    return Webservice.postRequest(url, headers, request)
}

function removeProfilePicture(url: string, params: Array<any>) {
    const [headers, request] = params
    return Webservice.postRequest(url, headers, request)
}

export {
    userProfile,
    removeProfilePicture
}