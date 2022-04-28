import {
  getRegistrationFor,
  registrationSubmit,
  checkPreRegistered,
} from '../../common/webservice/loginServices';
import EventManager from '../../common/eventManager';
import {Account} from '../../common/loginStore';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import {getValue} from '../../common/constants';
import Utility from '../../common/utility';
import {No_Internet_Warning} from '../../common/component/Toast';

export const kGetFormData = 'GetFormData';
export const kSubmitFormItem = 'SubmitFormItem';
export const kCheckUserProfile = 'CheckUserProfile';
//Regex to check for HTML tags in text
const HTML_TAGS: RegExp = /(<.{0,7}>)|(<.*=".*"\s{0,}>)/g;

export interface FormStruct {
  label: string;
  type:
    | 'sub'
    | 'sub-single'
    | 'date_select'
    | 'options_select'
    | 'text_textfield'
    | 'options_buttons';
  form?: FormStruct[];
  default_value?: object;
  module?: 'date' | 'options' | 'text';
  multiple?: boolean;
  isPassword?: boolean;
  field_name?: string;
  required?: boolean;
  values?: any;
}

export const registrationForm = async () => {
  try {
    if (Utility.isInternetConnected) {
      let response: Response = await getRegistrationFor(
        `https://${Account.tempData().instanceURL}`,
      );
      let resp: {
        ResponseCode: number;
        ResponseMessage: string;
        Details: {form1: object};
      } = await (async () => response.json())();
      loaderHandler.hideLoader();
      if (resp.ResponseCode == 200) {
        let formData = toForm(resp.Details.form1);
        EventManager.callBack(kGetFormData, true, formData);
      } else {
        EventManager.callBack(kGetFormData, false, resp.ResponseMessage);
      }
    } else {
      No_Internet_Warning();
    }
  } catch (err) {
    loaderHandler.hideLoader();
    EventManager.callBack(kGetFormData, false, err.message);
  }
};

export const checkUserRegistration = async (submitData: any) => {
  try {
    if (Utility.isInternetConnected) {
      loaderHandler.showLoader('Requesting...');
      let chkResponse: Response = await checkPreRegistered(
        `https://${Account.tempData().instanceURL}`,
        submitData,
      );
      let resp: {
        ResponseCode: number;
        ResponseMessage: string;
        isRegistered: number;
        personalInfo?: any;
      } = await (async () => chkResponse.json())();
      loaderHandler.hideLoader();
      EventManager.callBack(
        kCheckUserProfile,
        true,
        resp.isRegistered == 1,
        resp.personalInfo,
      );
    } else {
      No_Internet_Warning();
    }
  } catch (err) {
    loaderHandler.hideLoader();
    EventManager.callBack(kCheckUserProfile, false, err.message);
  }
};
export const submitRegistration = async (registrationData: any) => {
  try {
    if (Utility.isInternetConnected) {
      loaderHandler.showLoader('Requesting...');
      console.log("registrationData : "+JSON.stringify(registrationData));
      let resp: {
        ResponseCode: number;
        ResponseMessage: string;
        userId: number;
      } = await registrationSubmit(
        `https://${Account.tempData().instanceURL}`,
        registrationData,
      ).then((response: Response) => {
        return response.json();
      });
      //debugger
      console.log('registration response:', resp);
      // let resp: { ResponseCode: number; ResponseMessage: string; userId: number } = await (async () => response.json())();
      loaderHandler.hideLoader();
      if (resp.ResponseCode == 200) {
        EventManager.callBack(
          kSubmitFormItem,
          true,
          resp.ResponseMessage,
          registrationData,
        );
      } else {
        var form_error = {...(getValue(resp, ['form_errors']) || {})};
        let message = resp.ResponseMessage;
        if (form_error) {
          message = '';
          for (let key in {...form_error}) {
            let err_str: string = form_error[key];
            err_str = err_str.replace(HTML_TAGS, '');
            form_error[key] = err_str;
            message += `${message.length > 0 ? ', ' : ''}${err_str}`;
          }
        }
        EventManager.callBack(kSubmitFormItem, false, message, form_error);
      }
    } else {
      No_Internet_Warning();
    }
  } catch (err) {
    loaderHandler.hideLoader();
    EventManager.callBack(kSubmitFormItem, false, err.message);
  }
};

//Generate form Entities for Registration Page
function toForm(items: {[x: string]: any}): FormStruct[] {
  let form: FormStruct[] = [];
  for (let key in items) {
    let currentObject = items[key];
    let settings = currentObject.settings as any;
    let wSettings = currentObject.widget.settings as object;
    if (
      typeof wSettings == 'object' &&
      !Array.isArray(wSettings) &&
      Object.keys(wSettings).length > 1
    ) {
      let keys = [];
      for (let ky in settings) {
        if (
          ky.indexOf('default_value') == 0 &&
          ky.indexOf('default_value_') == -1 &&
          settings[ky] == 'blank'
        ) {
          keys.push(ky);
        }
      }
      let keyLength = keys.length;
      form.push({
        label: currentObject.label,
        type: keys.length > 1 ? 'sub' : 'sub-single',
        field_name: currentObject.field_name,
        required: currentObject.required ? true : false,
        form:
          currentObject.widget.module == 'date'
            ? keys.map((ky: string, index: number) => ({
                label: keyLength == 1 ? 'Year' : index == 0 ? 'From' : 'To',
                type: currentObject.settings.field.type,
                module: currentObject.settings.field.module,
                ...(typeof currentObject['#multiple'] == 'undefined'
                  ? {multiple: currentObject['#multiple']}
                  : {}),
                required: currentObject.required ? true : false,
                default_value: currentObject.default_value,
                field_name: ky,
                values: currentObject.values,
              }))
            : [],
      });
    } else {
      form.push({
        label: currentObject.label,
        type: currentObject.settings.field.type,
        module: currentObject.settings.field.module,
        ...(typeof currentObject['#multiple'] == 'undefined'
          ? {multiple: currentObject['#multiple']}
          : {}),
        required: currentObject.required ? true : false,
        default_value: currentObject.default_value,
        field_name: currentObject.field_name,
        values: currentObject.values,
      });
    }
  }
  return form;
}
