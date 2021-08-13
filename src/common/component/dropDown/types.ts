import {
    ReturnKeyTypeOptions
} from "react-native";
export type Props = {
    style?: {[x: string]: any},
    placeholderText: string,
    placeholderTextColor?: string,
    errorMessage?: string,
    showError?: boolean,
    value?: Array<String>,
    selectedValue?: string,
    animatedViewHeight?: number,
    onOptionSelected?: () => void,
    viewID?: number,
    inputViewStyle?: any,
    inputTextStyle?:any,
    isRequired?: boolean,
    isCuebackRegistration?: boolean
};

export type State = {
    sizeFnt: any,
    top: any,
    height: any,
    opacity: any,
    animatedViewHeight: any,
    showClearImage: any,
    text: any,
    numericValue: any
};