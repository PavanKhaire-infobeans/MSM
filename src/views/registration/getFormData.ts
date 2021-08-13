
import {
    kGetFormData,
	registrationForm,
	FormStruct,
} from "./registrationWebService";
import EventManager from "../../common/eventManager";
import { ToastMessage, No_Internet_Warning } from "../../common/component/Toast";
import { Actions } from "react-native-router-flux";
import { ERROR_MESSAGE, Colors, CueBackInsatance } from "../../common/constants";
import Utility from "../../common/utility";
import { Account } from "../../common/loginStore";
import loaderHandler from "../../common/component/busyindicator/LoaderHandler";
export const kCueBackRegistration = "CueBack Registration";
export const kCueBackFormData = "CueBack Form";
export default class GetFormData {
    formData: EventManager;
	type: string;
	openLoginDrawer : any;
    constructor() {
        this.formData = EventManager.addListener(kGetFormData, this.getData);
    }

    callService = (type: string = "push", openLoginDrawer? : any, isCueBackRegistration? : boolean) => {
		if(Utility.isInternetConnected){	
			this.type = type;
			this.openLoginDrawer = openLoginDrawer
			if(isCueBackRegistration){
				Account.tempData().values = {
					name: CueBackInsatance.InstanceName,
					instanceID: parseInt(CueBackInsatance.InstanceID),
					instanceImage: CueBackInsatance.InstanceImageURL ||
						"https://qa.cueback.com/sites/qa.cueback.com/default/files/cal-poly-cp_0.png", //"https://facebook.github.io/react-native/docs/assets/favicon.png"
					instanceURL: CueBackInsatance.InstanceURL
				};
			} else{
				loaderHandler.showLoader("Loading...");
			}
			registrationForm();
		} else{
			No_Internet_Warning()
		}
    }

	//Recieve form data from server
	getData = (success: boolean, data: FormStruct[] | object | string) => {
		if (success) {
			let formList: FormStruct[] = [...(data as FormStruct[])].filter((item: FormStruct) => item.required);
			formList.splice(0, 0, {
				type: "text_textfield",
				label: "Your Email Address",
				default_value: null,
				field_name: "emailAddress",
				module: "text",
				required: true,
				values: null
			});

			formList.splice(1, 0, {
				type: "text_textfield",
				label: "Set Your Password",
				default_value: null,
				field_name: "password",
				module: "text",
				required: true,
				isPassword: true,
				values: null
			});

			formList.splice(2, 0, {
				type: "text_textfield",
				label: "Confirm Password",
				default_value: null,
				field_name: "repeat_password",
				module: "text",
				required: true,
				isPassword: true,
				values: null
            });
            if (this.type == "push") {
                Actions.registrationPre({formList, openLoginDrawer : this.openLoginDrawer});
			} 
			else if (this.type == kCueBackRegistration){
				EventManager.callBack(kCueBackFormData, true, formList);
			}
			else {
                Actions.replace("registrationPre", {formList});
            }
		} else {
			ToastMessage(typeof data == "string" ? data : ERROR_MESSAGE, Colors.ErrorColor);
		}
    };
    
    removeListener() {
        this.formData.removeListener();
    }

}