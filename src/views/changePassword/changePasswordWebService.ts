import { MemoryService} from "../../common/webservice/memoryServices";
import { Storage} from "../../common/constants";
import EventManager from "../../common/eventManager";
import { Account } from "../../common/loginStore";

export const kChangePassword = "MemoryActionPerformed"

export const ChangePasswordService = async (oldPassword: any, newPassword: any) => {
	try {
		let data = await Storage.get('userData')
		let response = await MemoryService(`https://${Account.selectedData().instanceURL}/api/alumni/change_password`,
			[{ "X-CSRF-TOKEN": data.userAuthToken, "Content-Type": "application/json" },
			{   "oldPassword": oldPassword,         
                "newPassword": newPassword,               
			}
			])
			.then((response: Response) => response.json())
			.catch((err: Error) => {
				Promise.reject(err)
			});
			if (response != undefined && response != null){
				if(response.ResponseCode==200){
					EventManager.callBack(kChangePassword, true, response["ResponseMessage"]);
				}
				else{
					EventManager.callBack(kChangePassword, false, response["ResponseMessage"]);
				}
			}
						
	} catch (err) {
		EventManager.callBack(kChangePassword, false, "Unable to process your request. Please try again later");
	}
};