import {
    ReturnKeyTypeOptions
} from "react-native";
export type Props = {
    style?: {[x: string]: any}
    secureTextEntry?: boolean,
    placeholderTextColor?: string,
    placeholder?: string,
    errorMessage?: string,
    showError?: boolean,
    passwordToggle?: boolean,
    reference?: (ref: any) => void,
    onChange?: (text: string) => void,
    value?: string,
    returnKeyType?: ReturnKeyTypeOptions,
    keyboardType?: string,
    animatedViewHeight?: number,
    onSubmitEditing?: (e: any) => void,
    blurOnSubmit?: boolean,
    maxLength?: number,
    clearButtonMode?: "never" | "while-editing" | "unless-editing" | "always",
    handleFocus?: Function,
    prevButton?: () => void,
    nextButton?: () => void,
    isRequired?: boolean, 
    doneButton?: () => void,
    onEndEditing?: (e: any) => void,
    onPressClear?: (e: any) => void,
    inputTextAccessoryViewID?: number,
    inputTextStyle?: any,
    inputViewStyle?: any,
    supportAutoFocus?: boolean,
    inputFieldForPayment?: boolean,
    autoFocus?: boolean,
    isCuebackRegistration?: boolean,
    showStrength?: boolean
};

export type State = {
    sizeFnt: any,
    top: any,
    height: any,
    opacity: any,
    leftTextInput: any,
    animatedViewHeight: any,
    showClearImage: any,
    text: any,
    showPassword: boolean,
    numericValue: any,
    passwordStrength : any,
    showPasswordStrength? : boolean,
};