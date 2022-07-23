export type Props = {
  style?: { [x: string]: any };
  placeholderText?: string;
  placeholderTextColor?: string;
  errorMessage?: string;
  showError?: boolean;
  value?: Array<String>;
  selectedValue?: string;
  animatedViewHeight?: number;
  onOptionSelected?: (selectedFrom: string) => void;
  viewID?: number;
  inputViewStyle?: any;
  inputTextStyle?: any;
  isRequired?: boolean;
  view1Title?: string;
  view2Title?: string;
  view1Value?: string;
  view2Value?: string;
};

export type State = {
  opacity: any;
  animatedViewHeight: any;
  showClearImage: any;
  text: any;
  numericValue: any;
  selectionData?: any;
};
