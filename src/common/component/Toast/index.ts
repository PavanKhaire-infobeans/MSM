//@ts-ignore
// import Toast from 'react-native-root-toast';
import { Colors, NO_INTERNET } from '../../constants';
import MessageDialogue from '../messageDialogue';


// Add a Toast on screen.
let hideToast = false;
export const ToastMessage = (message: string, bgColor: string = Colors.ThemeColor, hideForLogout? : boolean, crossEnable? : boolean) => {       
    if(hideForLogout){
        hideToast = true
        setTimeout(() => {
            hideToast = false;
        }, 3000);
    }

    if(!hideToast && !crossEnable){
        MessageDialogue.showMessage(message, bgColor)
        setTimeout(function () {            
            MessageDialogue.hideMessage()
        }, 3000);
    } 

    if(crossEnable){
        MessageDialogue.showMessage(message, bgColor)
    }    
}

export const No_Internet_Warning = (errorMsg? : string) => { 
    let msg = errorMsg ? errorMsg : NO_INTERNET;
    ToastMessage(msg, Colors.WarningColor);
}


