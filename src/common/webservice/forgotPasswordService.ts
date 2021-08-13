import Webservice from './webservice';

function forgotPasswordRequest(url: string, params: Array<any>) {    
    const [param] = params
    return Webservice.postRequest(`${url}/api/portals/forgot_password`,  { checksum: "Q3VlQmFjazIwMTgh" }, param.payload)
}

export {
    forgotPasswordRequest
}