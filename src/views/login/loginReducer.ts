import { loginRequest, loginInstanceRequest } from '../../common/webservice/loginServices';
import { takeLatest, put, call, all } from "redux-saga/effects";
import { Account } from '../../common/loginStore';
import { kAdmin } from '../registration/getInstancesSaga';

export enum LoginServiceStatus {
    RequestStarted = "LoginRequestStarted",
    RequestFailed = "LoginRequestFailed",
    RequestSuccess = "LoginRequestSuccess",
    Ended = "LoginRequestEnded"
}

export enum LoginInstanceStatus {
    RequestStarted = "LoginInstanceRequestStarted",
    RequestFailed = "LoginInstanceRequestFailed",
    RequestSuccess = "LoginInstanceRequestSuccess",
    Ended = "LoginInstanceRequestEnded"
}

type StateType = {    
    logincompleted: boolean;
    loginsuccess: boolean;
    logindata: object,
    callLogin : boolean,
    instanceCompleted: boolean;
    instanceSuccess: boolean;
    instanceData: object;
    loginStarted : boolean
};

export type LoginState = object | StateType

type PayLoad = {
    type: string;
    payload: object;
};

/**
 * Login State reducer
 * @param state : Previous state
 * @param action : Incoming Action
 */
export const loginStatus = (state: LoginState = {}, action: PayLoad): LoginState => {
    switch (action.type) {
        case LoginServiceStatus.RequestStarted:                                
            return { logincompleted: false, loginsuccess: false, logindata: null, callLogin : false, loginStarted : true,
                    instanceCompleted: true, instanceSuccess: true, instanceData: null}
        case LoginServiceStatus.RequestFailed:
            return { logincompleted: true, loginsuccess: false, logindata: action.payload, callLogin: false, loginStarted : true,
                    instanceCompleted: true, instanceSuccess: true, instanceData: null}            
        case LoginServiceStatus.RequestSuccess:
            return { logincompleted: true, loginsuccess: true, logindata: action.payload, callLogin: false, loginStarted : true,
                    instanceCompleted: true, instanceSuccess: true, instanceData: null}            
        case LoginServiceStatus.Ended:
            return { logincompleted: false, loginsuccess: false, logindata: null, callLogin: false, loginStarted : true,
                    instanceCompleted: true, instanceSuccess: true, instanceData: null}         
        case LoginInstanceStatus.RequestStarted:
            return { logincompleted: false, loginsuccess: false, logindata: null, callLogin: false, loginStarted : false,
                instanceCompleted: false, instanceSuccess: true, instanceData: null}                   
        case LoginInstanceStatus.RequestFailed:
            return { logincompleted: false, loginsuccess: false, logindata: null, callLogin: false, loginStarted : false,
                instanceCompleted: true, instanceSuccess: false, instanceData: action.payload}      
        case LoginInstanceStatus.RequestSuccess:
            return { logincompleted: false, loginsuccess: false, logindata: null, callLogin: true, loginStarted : false,
                instanceCompleted: true, instanceSuccess: true, instanceData: action.payload}                   
        case LoginInstanceStatus.Ended:
            return { logincompleted: false, loginsuccess: false, logindata: null, callLogin: false, loginStarted : false,
                instanceCompleted: false, instanceSuccess: false, instanceData: null}                  
        default:
            return { ...state };
    }
};

/**
 * Login Request Generator
 * @param params 
 */
function* fetchRequest(params: any) {
    return loginRequest(`${kAdmin}`, params).then((response: Response) => response.json()).catch((err: any) => err)
}

/**
 * Login Request Generator
 * @param params 
 */
function* fetchLoginInstanceRequest(params: any) {
    return loginInstanceRequest(`${kAdmin}`, params).then((response: Response) => response.json()).catch((err: any) => err)
}

/**
 * Login Process Generator
 * @param params 
 */
function* loginInstanceService(...action: any[]) {
    try {
        const request = yield call(fetchLoginInstanceRequest, action)
        var responseBody = yield call(async function () { return await request });
        //console.log("Response is : ", responseBody)
        if (responseBody.json) {
            //console.log("Response is : ", responseBody.json())
            responseBody = yield call(async function () { return await responseBody.json() })
        }
        if (responseBody.ResponseCode !== 200) {
            yield put({ type: LoginInstanceStatus.RequestFailed, payload: responseBody })
            return;
        }
        yield put({ type: LoginInstanceStatus.RequestSuccess, payload: responseBody })
    } catch (err) {
        //console.log("Login Service Error: ", err);
        yield put({ type: LoginInstanceStatus.RequestFailed, payload: err })
    }
}

/**
 * Login Process Generator
 * @param params 
 */
function* loginService(...action: any[]) {
    try {
        const request = yield call(fetchRequest, action)
        var responseBody = yield call(async function () { return await request });
        //console.log("Response is : ", responseBody)
        if (responseBody.json) {
            //console.log("Response is : ", responseBody.json())
            responseBody = yield call(async function () { return await responseBody.json() })
        }
        if (responseBody.ResponseCode !== 200) {
            yield put({ type: LoginServiceStatus.RequestFailed, payload: responseBody })
            return;
        }
        yield put({ type: LoginServiceStatus.RequestSuccess, payload: responseBody })
    } catch (err) {
        //console.log("Login Service Error: ", err);
        yield put({ type: LoginServiceStatus.RequestFailed, payload: err })
    }
}

/**
 * Login Saga - Entry point
 */
export function* loginServiceCall() {
    // yield takeLatest(LoginServiceStatus.RequestStarted, loginService)
    yield all([takeLatest(LoginServiceStatus.RequestStarted, loginService), 
        takeLatest(LoginInstanceStatus.RequestStarted, loginInstanceService)])
} 