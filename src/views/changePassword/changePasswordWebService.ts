import { MemoryService, newMemoryService } from '../../common/webservice/memoryServices';
import { Storage } from '../../common/constants';
import EventManager from '../../common/eventManager';
import { Account } from '../../common/loginStore';

export const kChangePassword = 'MemoryActionPerformed';

export const ChangePasswordService = async (
  oldPassword: any,
  newPassword: any,
  CB: any,
) => {
  try {
    let data = await Storage.get('userData');
    let response = await newMemoryService(
      `https://${Account.selectedData().instanceURL
      }/api/alumni/change_password`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        { oldPassword: oldPassword, newPassword: newPassword },
      ],
      response =>{
        if (response != undefined && response != null) {
          if (response.ResponseCode == 200) {
            CB({success :true,message:response['ResponseMessage']})
            
          } else {
            CB({success :false,message:response['ResponseMessage']})
          }
        }
      }
    )
      // .then((response: Response) => response.json())
      // .catch((err: Error) => {
      //   Promise.reject(err);
      // });
    
  } catch (err) {
    EventManager.callBack(
      kChangePassword,
      false,
      'Unable to process your request. Please try again later',
    );
  }
};
