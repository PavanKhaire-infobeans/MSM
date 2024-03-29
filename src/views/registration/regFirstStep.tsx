import React, { Component } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//@ts-ignore
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { arrowRightCircle } from '../../../app/images';
import BottomPicker, {
  ActionSheetItem,
} from '../../common/component/bottomPicker';
import { SubmitButton } from '../../common/component/button';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import Text from '../../common/component/Text';
import analytics from '@react-native-firebase/analytics';
import TextField from '../../common/component/textField';
import {
  Colors,
  CommonTextStyles,
  ConsoleType,
  ERROR_MESSAGE,
  fontFamily,
  fontSize,
  getValue,
  showConsoleLog,
  Size,
  testEmail,
  TimeStampMilliSeconds,
  validBirthYear,
} from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import { registration_vector } from '../../images';
import {
  checkUserRegistration,
  FormStruct,
  kCheckUserProfile,
  kSubmitFormItem,
  submitRegistration,
} from './registrationWebService';
import Styles from './styles';

type State = {
  [key: string]: any | string;
  error: { [x: string]: { error: boolean; message: string } };
};
type Props = { formList: FormStruct[] } & any;

export default class RegFirstStep extends Component<Props> {
  checkProfile: EventManager;
  submitReg: EventManager;
  form: FormStruct[] = [];
  textFieldArray: { [key: string]: TextInput } = {};
  submitForm: any;
  bottomPicker: React.RefObject<BottomPicker> = React.createRef<BottomPicker>();
  navBar: any;
  isBirthYear: boolean = false;
  regScroll: any = React.createRef();
  constructor(props: Props) {
    super(props);
    // this.checkProfile = EventManager.addListener(
    //   kCheckUserProfile,
    //   this.checkUserProfile,
    // );
    this.submitReg = EventManager.addListener(
      kSubmitFormItem,
      this.submitRegisterResponse,
    );
    this.isBirthYear = false;
    if (this.props.navBar) {
      this.navBar = this.props.navBar;
    }
    this.form = this.props.formList;

  }

  keyboardDidShowListener;
  keyboardDidHideListener;
  state: State = {
    error: {},
    selectionData: {
      actions: [],
      selectionValue: '',
      isMultiSelect: false,
      fieldName: '',
      title: '',
    },
    errorHeight: 0,
    keyboardHeight: 0,
    regFirstStep: true,
    scrollHeight: 0,
  };
  moveOnYAxis = new Animated.Value(0);

  startMoveOnYAxis = () => {
    Animated.timing(this.moveOnYAxis, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.out(Easing.poly(5))
    }).start();
  };

  startMoveDownYAxis = () => {
    Animated.timing(this.moveOnYAxis, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.poly(5)),
      useNativeDriver: true,
    }).start();
  };

  screenLog = async () => {
    await analytics().logScreenView({
      screen_name: "SignUp",
      screen_class: "SignUp",
    });
  };
  componentDidMount() {

    this.screenLog();
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any): void {
    if (nextProps != this.props) {
      if (nextProps.showFirstStep) {
        this.setState({
          regFirstStep: true
        })
      }
    }
  };

  componentWillUnmount() {
    // this.checkProfile.removeListener();
    this.submitReg.removeListener();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.navBar._hide();
  }

  _keyboardDidShow = e => {
    try {
      const { height, screenX, screenY, width } = e.endCoordinates;
      // showConsoleLog(ConsoleType.LOG,height)

      if (height) {
        this.setState(
          {
            keyboardHeight: height,
          },
          () => this.startMoveOnYAxis(),
        );
      }
    } catch (error) {
      showConsoleLog(ConsoleType.WARN, error);
    }
  };

  _keyboardDidHide = () => {
    this.setState(
      {
        keyboardHeight: 0,
      },
      () => this.startMoveDownYAxis(),
    );
  };

  //On CheckProfile web service end
  checkUserProfile = (
    success: boolean,
    isRegistered: any,
    personalInfo?: any,
  ) => {
    if (success) {
      let role = getValue(personalInfo, ['role']);

      console.log(isRegistered, JSON.stringify(personalInfo))

      if (isRegistered && role == 'Alumni') {
        this.props.hideLoader();
        if (this.props.isCuebackRegistration) {
          if (this.props.navBar) {
            Alert.alert(isRegistered);
            this.props.navBar.onRegFinalCallBack(
              `An account with the email already exists, please login to continue`,
            );
          }
          else {
            Alert.alert(isRegistered);
            this.navBar.onRegFinalCallBack(
              `An account with the email already exists, please login to continue`,
            );
          }
        }
        //Go to Result screen showing user is already registered
        else {
          this.props.navigation.replace('userRegStatus');
        }
        // Actions.userRegStatus({ isAlreadyRegistered: true, registeredSuccess: false, userDetails: this.submitForm });
      }
      else {
        //Call Register request if profile doesn't exists or is ghost
        submitRegistration(this.submitForm, (resp) => {
          if (resp.ResponseCode == 200) {
            this.submitRegisterResponse(
              true,
              resp?.ResponseMessage,
              ''
            )

          } else {
            var form_error = { ...(getValue(resp, ['form_errors']) || {}) };
            let message = resp.ResponseMessage;
            if (Object.keys(form_error).length) {
              message = '';
              const HTML_TAGS: RegExp = /(<.{0,7}>)|(<.*=".*"\s{0,}>)/g;
              for (let key in { ...form_error }) {
                let err_str: string = form_error[key];
                err_str = err_str.replace(HTML_TAGS, '');
                form_error[key] = err_str;
                message += `${message.length > 0 ? ', ' : ''}${err_str}`;
              }
              this.submitRegisterResponse(
                false,
                message,
                form_error
              )
            }
            else {
              this.submitRegisterResponse(
                false,
                message,
                form_error
              )
            }

          }
        });
      }
    } else {
      this.props.hideLoader();
      this.showErrorMessage(
        true,
        typeof isRegistered == 'string' ? isRegistered : ERROR_MESSAGE,
      );
      // ToastMessage(typeof isRegistered == "string" ? isRegistered : ERROR_MESSAGE, Colors.ErrorColor);
    }
  };

  //On Register web service end
  submitRegisterResponse = async (
    success: boolean,
    message: string,
    formError: any,
  ) => {
    if (success) {
      this.props.hideLoader();
      if (this.props.isCuebackRegistration) {
        if (this.props.navBar) {
          Alert.alert('',message);
          this.props.navBar._show(
            `User registered successfully. Please verify link on email and login to continue`,
          );
        } else {
          Alert.alert('',message);
          this.navBar._show(
            `User registered successfully. Please verify link on email and login to continue`,
          );
        }
        await analytics().logEvent('New_user');
        this.props.navigation.navigate('login');
      } else {
        this.props.navigation.navigate('userRegStatus', {
          isAlreadyRegistered: false,
          registeredSuccess: true,
          message,
        });
      }
    } else {
      var error = {};
      this.props.hideLoader();
      for (let key in formError) {
        let strKey = key.replace(/].*$/, '');
        error = { ...error, [strKey]: { error: true, message: formError[key] } };
      }
      if (Object.keys(error).length > 0) {
        this.setState({ error });
      }
      this.showErrorMessage(
        true,
        typeof message == 'string' ? message : ERROR_MESSAGE,
      );
      //ToastMessage(typeof message == "string" ? message : ERROR_MESSAGE, Colors.ErrorColor);
    }
  };

  //Dynamic Form generator
  getFormEntity(
    form: FormStruct,
    {
      fieldID = '',
      isLast,
      hasParent = false,
      parentType = null,
    }: {
      fieldID: string;
      isLast: boolean;
      hasParent?: boolean;
      parentType?: any;
    },
  ) {
    //Show horizonatal form items
    if (form.type.indexOf('sub') !== -1) {
      let parentType = form.type;
      if (form.form.length > 0) {
        let formLength = form.form.length;
        return (
          <View key={form.field_name} style={Styles.getFormEntityStyle}>
            {/* <Text style={{ marginLeft: 8, color: Colors.newTextColor }}>{form.label.toUpperCase()}</Text> */}
            <View
              style={[
                Styles.getFormEntityContainerStyle,
                {
                  marginTop: form.label.toLowerCase().includes('year')
                    ? 0
                    : -10,
                  flexDirection: (form?.label?.toLowerCase() == 'first name' || form?.label?.toLowerCase() == 'last name') ? 'row' : 'column'

                },
              ]}>
              {form.form.map((form: FormStruct, index: number) => {
                return this.getFormEntity(form, {
                  fieldID: `${index}`,
                  isLast: formLength - 1 == index,
                  hasParent: true,
                  parentType,
                });
              })}

            </View>
          </View>
        );
      } else {
        return <React.Fragment key={form.field_name} />;
      }
    }

    //If form element
    let valueKey =
      form.module == 'date' ||
        form.module == 'options' ||
        form.type == 'options_select'
        ? 'selectedValue'
        : 'value';
    var extra: { [x: string]: any } = {
      [valueKey]:
        this.state[
        `${form.field_name}${form.module == 'date' ||
          form.module == 'options' ||
          form.type == 'options_select'
          ? '_text'
          : ''
        }`
        ] || '',
    };
    if (form.isPassword) {
      extra = {
        ...extra,
        secureTextEntry: true,
        passwordToggle: true,
      };
    }
    var showError = false,
      errorMessage = '';
    if (this.state.error[form.field_name]) {
      showError = this.state.error[form.field_name].error;
      errorMessage = this.state.error[form.field_name].message;
    }

    if (hasParent) {
      extra = {
        ...extra,
        keyboardType: 'number-pad',
        style: { width: parentType == 'sub-single' ? '100%' : '100%' }, //"48%"
      };
    }

    extra = {
      ...extra,
      showError,
      errorMessage,
      isRequired: form.required,
    };

    if (form.field_name == 'emailAddress') {
      extra = {
        ...extra,
        keyboardType: 'email-address',
      };
    }
    // if (form.field_name == "default_value") {
    // 	extra = {
    // 		...extra,

    // 	}
    // }
    // if (form.module == "date" || form.module == "options" || form.type == "options_select" || form.type == "options_buttons") {
    if (form.label == 'Year') {
      this.isBirthYear = true;
      form.text = 'Birth year';
      extra = {
        ...extra,
        minValue: 1900,
        maxValue: new Date().getFullYear(),
        maxLength: 4,
      };
    }
    // 	return <DropDown isCuebackRegistration={this.props.isCuebackRegistration} key={form.field_name} placeholderText={form.label} {...extra} onOptionSelected={this.onOptionSelection(form)} />
    // }
    var txtF = (
      <View key={form.label} style={{ width: form.label.toLowerCase() == 'first name' ? '95%' : '100%' }}>
        <Text style={Styles.inputLableStyle}>{form.text.toUpperCase()}</Text>
        <TextField
          key={form.field_name}
          isCuebackRegistration={this.props.isCuebackRegistration}
          reference={(input: TextInput) => {
            this.textFieldArray = {
              ...this.textFieldArray,
              [fieldID]: input,
            };
          }}
          showStrength={form.field_name == 'password'}
          placeholder={form.label.toLowerCase() == 'first name' ? 'William' : form.label.toLowerCase() == 'last name' ? 'Shakespeare' : form?.text?.toLowerCase() == 'email address' ? 'bill.shakespeare@exmaple.com' : form.label == 'Year' ? '1564' : form?.text ? form?.text + '...' : form?.label + '...'}
          {...extra}
          onFocus={() => {
            if (form.text == 'Birth year') {
              this.regScroll.scrollToPosition(
                0,
                100,
                true,
              );
            }
            // else if ((form.label.toLowerCase() == 'first name') || (form.label.toLowerCase() == 'last name')) {
            //   // this.regScroll.scrollToPosition(
            //   //   0,
            //   //   100,
            //   //   true,
            //   // );
            // }
          }}
          returnKeyType={isLast ? 'done' : 'next'}
          onChange={(text: string) => {
            this.setState({
              [form.field_name]: text,
              error: {
                ...this.state.error,
                [form.field_name]: { error: false, message: '' },
              },
            });
          }}
          onSubmitEditing={() => {
            if (form.text != 'Birth year') {
              let nextRef = `${parseInt(fieldID) + 1}`;
              this.textFieldArray[nextRef] &&
                typeof this.textFieldArray[nextRef].focus == 'function' &&
                (this.textFieldArray[nextRef] as TextInput).focus();
            }
            this.setState(
              {
                scrollHeight: this.state.scrollHeight + 70,
              },
              () => {
                // this.regScroll.scrollToPosition(0, this.state.scrollHeight, true);
              },
            );
          }}
        />
        <View style={Styles.separatorHeightStyle24} >
          {
            form.label == 'Year' ?
              <TouchableOpacity activeOpacity={1}
                onPress={() => {
                  this.props.whyDoAskView(true);
                }}>
                <Text style={Styles.whyinputLableStyle}>{`Why do we ask this?`}</Text>
              </TouchableOpacity>
              :
              null
          }
        </View>
      </View>
    );

    return txtF;
  }

  onOptionSelection = (form: FormStruct) => () => {
    Keyboard.dismiss();
    var actions: ActionSheetItem[] = [];
    if (form.module == 'date') {
      let least = 1917,
        most = new Date().getFullYear();
      if (form.field_name == 'default_value2') {
        if (this.state['default_value']) {
          least = this.state['default_value'] - 1;
        }
      }
      if (form.field_name == 'default_value') {
        if (this.state['default_value2']) {
          most = this.state['default_value2'] - 1;
        }
      }
      for (var i = most; i > least; i--) {
        actions.push({ key: i, text: `${i}` });
      }
    } else {
      for (let key in form.values) {
        actions.push({ key, text: form.values[key] });
      }
    }

    this.setState(
      {
        selectionData: {
          ...this.state.selectionData,
          actions,
          selectionValue: this.state[form.field_name] || '',
          fieldName: form.field_name,
          title: form.label,
        },
      },
      () => {
        this.bottomBarCallBack(true);
        this.bottomPicker.current &&
          this.bottomPicker.current.showPicker &&
          this.bottomPicker.current.showPicker();
      },
    );

  };

  showErrorMessage = (show: boolean, message?: string) => {
    let height = 0;
    if (show) {
      height = 50;
      this.navBar._showWithOutClose({ message, color: Colors.ErrorColor });
    } else {
      this.navBar._hide();
    }
    setTimeout(() => {
      this.navBar._hide();
    }, 5000);
    this.setState({ errorHeight: height });
  };

  validateFields = () => {
    Keyboard.dismiss();
    if (this.state.regFirstStep) {
      var submitForm: any = {};
      for (let frm of this.form) {
        let parentKey = 'personalInfo';
        var frmEnt: any = {};

        if (frm.field_name == 'emailAddress') {
          parentKey = 'authorizationInfo';
          submitForm = {
            ...submitForm,
            [parentKey]: {
              ...(submitForm[parentKey] || {}),
              [frm.field_name]: this.state[frm.field_name],
            },
          };
        } else {
          if (frm.type.indexOf('sub') !== -1) {
            let main = frm.form[0];
            if (
              frm.type == 'sub-single' &&
              this.state[main.field_name]
            ) {
              frmEnt = {
                ...frmEnt,
                value: this.state[main.field_name],
                value2: parseInt(this.state[main.field_name]) + 4,
              };
            } else {
              for (let fiTm of frm.form) {
                if (this.state[fiTm.field_name]) {
                  frmEnt = {
                    ...frmEnt,
                    [fiTm.field_name.replace('default_', '')]:
                      this.state[fiTm.field_name],
                  };
                }
              }
            }
            if (Object.keys(frmEnt).length > 0) {
              frmEnt = {
                ...frmEnt,
                module: main.module,
                type: main.type,
              };
            }
          } else {
            let value = this.state[frm.field_name];
            if (frm.type == 'options_select') {
              value = {
                [value]: frm.values[value],
              };
            }
            if (this.state[frm.field_name]) {
              frmEnt = {
                ...frmEnt,
                module: frm.module,
                type: frm.type,
                value,
              };
            }
          }
          submitForm = {
            ...submitForm,
            [parentKey]: {
              ...(submitForm[parentKey] || {}),
              [frm.field_name]: frmEnt,
            },
          };
        }
      }

      var error = {};
      for (let key in submitForm) {
        if (key == 'authorizationInfo') {
          let sbForm = submitForm[key];
          for (let sKey in sbForm) {
            if (
              typeof sbForm[sKey] == 'undefined' ||
              (typeof sbForm[sKey] == 'string' &&
                sbForm[sKey].length == 0)
            ) {
              var message = `Please enter text`;
              if (sKey == 'emailAddress') {
                message = 'Please enter your Email';
              }
              error = { ...error, [sKey]: { error: true, message } };
            } else {
              if (sKey == 'emailAddress') {
                let email = sbForm[sKey];
                if (!testEmail(email)) {
                  error = {
                    ...error,
                    [sKey]: {
                      error: true,
                      message: 'Please enter a valid Email',
                    },
                  };
                }
              }
            }
          }
        }
        else {
          let sbForm = submitForm[key];
          for (let sKey in sbForm) {
            let frmItem = this.form.find(it => it.field_name == sKey);
            if (frmItem.type.indexOf('sub') == 0) {
              for (let fitm of frmItem.form) {
                if (
                  typeof sbForm[sKey] == 'undefined' ||
                  (typeof sbForm[sKey] == 'object' &&
                    Object.keys(sbForm[sKey]).length == 0)
                ) {
                  error = {
                    ...error,
                    [fitm.field_name]: {
                      error: true,
                      message: `Please select ${fitm.label}${fitm.module == 'date' && fitm.label != 'Year'
                        ? ' year'
                        : ''
                        }`,
                    },
                  };
                } else {
                  let keyVal = fitm.field_name.replace(
                    'default_',
                    '',
                  );
                  if (!getValue(sbForm, [sKey, keyVal])) {
                    error = {
                      ...error,
                      [fitm.field_name]: {
                        error: true,
                        message: `Please enter ${fitm.label}${fitm.module == 'date' ? ' year' : ''
                          }`,
                      },
                    };
                  } else if (validBirthYear(sbForm[sKey][keyVal])) {
                    error = {
                      ...error,
                      [fitm.field_name]: {
                        error: true,
                        message: `Please enter valid ${fitm.label}${fitm.module == 'date' ? ' year' : ''
                          }`,
                      },
                    };
                  }
                }
              }
            } else if (
              typeof sbForm[sKey] == 'undefined' ||
              (typeof sbForm[sKey] == 'object' &&
                Object.keys(sbForm[sKey]).length == 0)
            ) {
              // error = { ...error, [sKey]: { error: true, message: `Please enter ${frmItem.label}` } };

              if (sKey == 'emailAddress') {
                let email = sbForm[sKey];
                if (!testEmail(email)) {
                  error = {
                    ...error,
                    [sKey]: {
                      error: true,
                      message: 'Please enter Email',
                    },
                  };
                }
              }
              else if (
                sKey == 'field_first_name' ||
                sKey == 'field_last_name'
              ) {
                let text = getValue(sbForm, [sKey, 'value']);
                let label = getValue(sbForm, [sKey, 'label']);
                let onlyChars = /^[a-z|A-Z]*$/;
                if (text == '' || text == undefined) {
                  error = {
                    ...error,
                    [sKey]: {
                      error: true,
                      message: `Please enter ${frmItem['label']}`,
                    },
                  };
                } else if (!onlyChars.test(text)) {
                  error = {
                    ...error,
                    [sKey]: {
                      error: true,
                      message: 'Only characters are allowed',
                    },
                  };
                }
              }
            } else {
              if (
                sKey == 'field_first_name' ||
                sKey == 'field_last_name'
              ) {
                let text = getValue(sbForm, [sKey, 'value']);
                let onlyChars = /^[a-z|A-Z]*$/;
                if (text == '') {
                  error = {
                    ...error,
                    [sKey]: {
                      error: true,
                      message: `Please enter ${sbForm[sKey]['label']}`,
                    },
                  };
                } else if (!onlyChars.test(text)) {
                  error = {
                    ...error,
                    [sKey]: {
                      error: true,
                      message: 'Only characters are allowed',
                    },
                  };
                }
              }
            }
          }
        }
      }

      if (Object.keys(error).length > 0) {
        this.showErrorMessage(
          true,
          'Please check the highlighted fields',
        );
        // ToastMessage();
        this.setState({ error });
        return;
      } else
        this.setState({
          regFirstStep: false,
          keyboardHeight: 0,
        }, () => { this.props.setHideFirstStep() });
    } else {
      this.onSubmit();
    }
    // this.regScroll.scrollToPosition(0, 0, true);
  }

  renderCueBackRegistertaion = (yVal) => {
    let formLength = this.form.length;
    let sortedForm = Array(formLength);
    let stepOne = [],
      stepTwo = [];
    if (formLength) {
      this.form.forEach(element => {
        if (element.field_name == 'field_first_name') {
          element.text = 'First name';
          sortedForm[0] = element;
          stepOne[0] = element;
        } else if (element.field_name == 'field_last_name') {
          element.text = 'Last name';
          sortedForm[1] = element;
          stepOne[1] = element;
        } else if (element.field_name == 'emailAddress') {
          element.text = 'Email Address';
          sortedForm[2] = element;
          stepOne[2] = element;
        } else if (element.field_name == 'field_registration_date') {
          sortedForm[3] = element;
          stepOne[3] = element;
        } else if (element.field_name == 'password') {
          element.text = 'Password';
          sortedForm[4] = element;
          stepTwo[0] = element;
        } else if (element.field_name == 'repeat_password') {
          element.text = element.label ? element.label : '';
          sortedForm[5] = element;
          stepTwo[1] = element;
        } else {
          element.text = element.label ? element.label : '';
          sortedForm.push(element);
          stepOne.push(element);
        }
      });
    }

    return (
      <View style={Styles.regFirstStepSubContainer}>

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          nestedScrollEnabled={true}
          enableAutomaticScroll={true}
          ref={ref => (this.regScroll = ref)}
          // style={{ width: "100%", backgroundColor: 'red' }}
          // bounces={false}
          extraScrollHeight={Platform.OS == 'android' && StaticSafeAreaInsets.safeAreaInsetsBottom ? (StaticSafeAreaInsets.safeAreaInsetsBottom + 100) : 100}
        >
          {/* {sortedForm.map((form: FormStruct, index: number) => {
							return this.getFormEntity(form, { fieldID: `${index}`, isLast: formLength - 1 == index });
						})} */}

          {
            this.state.keyboardHeight > 0 ?
              null
              :
              <>
                <Text style={Styles.hederText}>Sign up</Text>
                <View style={Styles.separatorHeightStyle32} />
              </>
          }

          <View style={Styles.formContainer}>
            {this.state.regFirstStep
              ? stepOne.map((form: FormStruct, index: number) => {

                // if (form.label.toLowerCase() == 'first name' || form.label.toLowerCase() == 'last name') {

                // } else {

                // }
                return (
                  <View style={{ flexDirection: (form.label.toLowerCase() == 'first name' || form.label.toLowerCase() == 'last name') ? 'row' : 'column', width: (form.label.toLowerCase() == 'first name' || form.label.toLowerCase() == 'last name') ? '50%' : '100%', position: (form.label.toLowerCase() == 'last name') ? 'absolute' : undefined, top: (form.label.toLowerCase() == 'last name') ? 0 : undefined, right: (form.label.toLowerCase() == 'last name') ? 0 : undefined }}>
                    {
                      this.getFormEntity(form, {
                        fieldID: `${index}`,
                        isLast: formLength - 1 == index,
                      })
                    }
                  </View>);
              })
              : stepTwo.map((form: FormStruct, index: number) => {
                return this.getFormEntity(form, {
                  fieldID: `${index}`,
                  isLast: formLength - 1 == index,
                });
              })}
          </View>

          {/* {this.props.placeholderText == "Year" &&  */}
          {/* {this.isBirthYear && <View style={{ flexDirection: "row", top: -15, marginBottom: 10, justifyContent: "flex-start" }}>
						<Image source={info_icon_} style={{ tintColor: Colors.TextColor, marginTop: 2 }} />
						<Text style={{ flex: 1, marginLeft: 5, ...fontSize(15), fontWeight: "300", fontStyle: "italic", color: Colors.TextColor }}>We only use your birth year to customize what you see on My Stories Matter, such as your personal Timeline.</Text>
					</View>} */}

          {/* <View
            style={{
              height: this.state.regFirstStep
                ? 130 - this.state.keyboardHeight
                : 280 - this.state.keyboardHeight,
            }}
          /> */}

          {/* <View style={Styles.ScrollViewBottomView}></View> */}
          {/* <SubmitButton style={{backgroundColor: "#fff"}} text="Join" onPress={this.onSubmit} />									 */}
        </KeyboardAwareScrollView>

        <Animated.View style={{
          transform: [
            {
              translateY: yVal,
            },
          ],
          position: 'absolute', bottom: Platform.OS == 'android' && StaticSafeAreaInsets.safeAreaInsetsBottom ? 10 : 10, left: 24
        }}>
          <TouchableOpacity
            activeOpacity={1}
            style={[Styles.loginSSOButtonStyle, {}]}
            onPress={this.validateFields}
          // disabled={
          //   this.state.regFirstStep
          //     ? this.state['field_first_name'] &&
          //       this.state['field_last_name'] &&
          //       this.state['emailAddress'] &&
          //       this.state['default_value']
          //       ? false
          //       : true
          //     : this.state['password'] && this.state['repeat_password']
          //       ? false
          //       : true}
          >
            <View
              style={[
                Styles.loginSSOButtonStyle,
                {
                  // position:'absolute', bottom:58,
                  backgroundColor: this.state.regFirstStep
                    ? this.state['field_first_name'] &&
                      this.state['field_last_name'] &&
                      this.state['emailAddress'] &&
                      this.state['default_value']
                      ? Colors.bordercolor
                      : Colors.bordercolor
                    : this.state['password'] && this.state['repeat_password']
                      ? Colors.bordercolor
                      : Colors.bordercolor,
                  // opacity: this.state.regFirstStep ? (this.state["field_first_name"] && (this.state["field_last_name"]) && (this.state["emailAddress"]) && (this.state["default_value"])) ? 1: 0.5 : (this.state["password"] && (this.state["repeat_password"])) ? 1: 0.5,
                  opacity: this.state.regFirstStep ? 1 : (this.state["password"] && (this.state["repeat_password"])) ? 1 : 0.5,
                  flexDirection: 'row',
                },
              ]}>
              <Text
                style={[
                  CommonTextStyles.fontWeight400Size19Inter,
                  { color: Colors.white, marginRight: 9.67 },
                ]}>
                {this.state.regFirstStep ? 'Next' : 'Sign up'}
              </Text>
              <Image source={arrowRightCircle} />
            </View>
          </TouchableOpacity>
          {this.state.regFirstStep ?
            null
            :
            <TouchableHighlight
              underlayColor={"#ffffff00"}
              onPress={() => { this.props.showTerms() }}
            >
              <View style={[Styles.termHeader, { margin: 0, justifyContent: 'center' }]} >
                <Text style={Styles.termStyle}>
                  By signing up, I agree to the <Text style={{ textDecorationLine: 'underline' }}>
                    Terms and Conditions
                  </Text>
                </Text>
              </View>
            </TouchableHighlight>
          }
        </Animated.View>

      </View>
    );
  };

  bottomBarCallBack = (isVisible: boolean) => {
    if (this.props.bottomPicker) {
      this.props.bottomPicker(isVisible);
    }
  };

  render() {
    let formLength = this.form.length;
    const yVal = this.moveOnYAxis.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [
        0,
        -(this.state.keyboardHeight + (StaticSafeAreaInsets.safeAreaInsetsBottom && (Platform.OS === 'android') ? 0 : 0)),
        -(this.state.keyboardHeight + (StaticSafeAreaInsets.safeAreaInsetsBottom && (Platform.OS === 'android') ? 0 : 0)),
      ],
    });

    return (
      <View style={{ flex: 1, marginBottom: Platform.OS == 'android' && StaticSafeAreaInsets.safeAreaInsetsBottom ? StaticSafeAreaInsets.safeAreaInsetsBottom : 0 }}>
        {
          this.props.whyDoAskViewValue ?
            <View style={[Styles.LoginHeader, { margin: 0 }]} >
              <Text style={Styles.whoTextDescStyle}>
                Not only do we want to abide by <Text style={{ textDecorationLine: 'underline', color: Colors.loginTextColor }}>COPPA</Text> {`(Children’s Online Privacy Protection Act) to protect children’s online privacy, but we also want to help personalize your My Stories Matter experience from the get-go based on your age-demographic.\n\nWe do not share and will not share this information for any purpose.`}
              </Text>
            </View>
            :
            this.props.isCuebackRegistration ? (
              this.renderCueBackRegistertaion(yVal)
            ) : (
              <SafeAreaView style={Styles.firstStepContainer}>
                <View style={Styles.firstStepSubContainer}>
                  <NavigationHeaderSafeArea
                    isRegisteration={true}
                    ref={ref => (this.navBar = ref)}
                  />
                  <StatusBar
                    barStyle={
                      Utility.currentTheme == 'light'
                        ? 'dark-content'
                        : 'light-content'
                    }
                    backgroundColor={Colors.NewThemeColor}
                  />
                  <View
                    style={{ height: this.state.errorHeight, width: '100%' }}></View>
                  <View
                    keyboardShouldPersistTaps="always"
                    style={Styles.ScrollViewStyle}
                    contentContainerStyle={{ alignItems: 'center' }}
                    bounces={false}>
                    <View style={Styles.registrationStyles}>
                      <View style={Styles.registrationSubStyles}>
                        <Image source={registration_vector} />
                        <Text style={Styles.RegistrationText}>Registration</Text>
                      </View>
                      {this.form.map((form: FormStruct, index: number) => {

                        return this.getFormEntity(form, {
                          fieldID: `${index}`,
                          isLast: formLength - 1 == index,
                        });
                      })}

                      {/* {this.isBirthYear && <View style={{ flexDirection: "row", top: -15, marginBottom: 10, justifyContent: "flex-start" }}>
											<Image source={info_icon} style={{ tintColor: "#000", marginTop: 2 }} />
											<Text style={{ flex: 1, marginLeft: 5, ...fontSize(15), fontWeight: "300", fontStyle: "italic", color: "#000" }}>We only use your birth year to customize what you see on My Stories Matter, such as your personal Timeline.</Text>
										</View>} */}
                      <SubmitButton
                        text="Send Request to Join"
                        onPress={this.onSubmit}
                      />
                      {/** Join now UI */}
                      <View style={Styles.alreadyMemberContainer}>
                        <Text style={Styles.alreadyMemberText}>
                          {'Already a member? '}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            this.props.openLoginDrawer();
                            setTimeout(() => {
                              this.props.navigation.goBack();
                            }, 500);
                          }}
                          style={Styles.loginButtonContainer}>
                          <Text style={Styles.loginText}>Login</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  {/* <BottomPicker
								ref={this.bottomPicker}
								onItemSelect={(selectedItem: ActionSheetItem) => {
									let fieldName = this.state.selectionData.fieldName;
									this.setState({
										[fieldName]: selectedItem.key !== "_none" ? selectedItem.key : "",
										[`${fieldName}_text`]: selectedItem.key !== "_none" ? selectedItem.text : "",
										error: { ...this.state.error, ...(selectedItem.key !== "_none" ? { [fieldName]: { error: false, message: "" } } : {}) },
										selectionData: {
											actions: [],
											selectionValue: "",
											fieldName: "",
											isMultiSelect: false
										}
									});
								}}
								title={this.state.selectionData.title}
								actions={this.state.selectionData.actions}
								value={this.state.selectionData.selectionValue}
							/> */}
                </View>
              </SafeAreaView>
            )}
      </View>
    );
  }

  //Submit Form
  onSubmit = () => {
    var submitForm: any = {};
    for (let frm of this.form) {
      let parentKey = 'personalInfo';
      var frmEnt: any = {};

      if (
        frm.field_name == 'emailAddress' ||
        frm.field_name == 'password' ||
        frm.field_name == 'repeat_password'
      ) {
        parentKey = 'authorizationInfo';
        submitForm = {
          ...submitForm,
          [parentKey]: {
            ...(submitForm[parentKey] || {}),
            [frm.field_name]: this.state[frm.field_name],
          },
        };
      } else {
        if (frm.type.indexOf('sub') !== -1) {
          let main = frm.form[0];
          if (frm.type == 'sub-single' && this.state[main.field_name]) {
            frmEnt = {
              ...frmEnt,
              value: this.state[main.field_name],
              value2: parseInt(this.state[main.field_name]) + 4,
            };
          } else {
            for (let fiTm of frm.form) {
              if (this.state[fiTm.field_name]) {
                frmEnt = {
                  ...frmEnt,
                  [fiTm.field_name.replace('default_', '')]:
                    this.state[fiTm.field_name],
                };
              }
            }
          }
          if (Object.keys(frmEnt).length > 0) {
            frmEnt = {
              ...frmEnt,
              module: main.module,
              type: main.type,
            };
          }
        } else {
          let value = this.state[frm.field_name];
          if (frm.type == 'options_select') {
            value = {
              [value]: frm.values[value],
            };
          }
          if (this.state[frm.field_name]) {
            frmEnt = {
              ...frmEnt,
              module: frm.module,
              type: frm.type,
              value,
            };
          }
        }
        submitForm = {
          ...submitForm,
          [parentKey]: {
            ...(submitForm[parentKey] || {}),
            [frm.field_name]: frmEnt,
          },
        };
      }
    }

    var error = {};
    for (let key in submitForm) {
      if (key == 'authorizationInfo') {
        let sbForm = submitForm[key];
        for (let sKey in sbForm) {
          if (
            typeof sbForm[sKey] == 'undefined' ||
            (typeof sbForm[sKey] == 'string' && sbForm[sKey].length == 0)
          ) {
            var message = `Please enter text`;
            if (sKey == 'emailAddress') {
              message = 'Please enter your Email';
            }
            error = { ...error, [sKey]: { error: true, message } };
          } else {
            if (sKey == 'emailAddress') {
              let email = sbForm[sKey];
              if (!testEmail(email)) {
                error = {
                  ...error,
                  [sKey]: { error: true, message: 'Please enter a valid Email' },
                };
              }
            }
            if (sKey == 'password') {
              let password = sbForm[sKey];
              if (password.length < 6) {
                error = {
                  ...error,
                  [sKey]: {
                    error: true,
                    message: 'Password must be at least 6 characters long',
                  },
                };
              }
            }
            if (sKey == 'repeat_password') {
              let password = sbForm['password'];
              let repeat_password = sbForm[sKey];
              if (password.length >= 6 && password != repeat_password) {
                error = {
                  ...error,
                  [sKey]: {
                    error: true,
                    message: 'Please enter the same Password again',
                  },
                };
              }
            }
          }
        }
      } else {
        let sbForm = submitForm[key];
        for (let sKey in sbForm) {
          let frmItem = this.form.find(it => it.field_name == sKey);
          if (frmItem.type.indexOf('sub') == 0) {
            for (let fitm of frmItem.form) {
              if (
                typeof sbForm[sKey] == 'undefined' ||
                (typeof sbForm[sKey] == 'object' &&
                  Object.keys(sbForm[sKey]).length == 0)
              ) {
                error = {
                  ...error,
                  [fitm.field_name]: {
                    error: true,
                    message: `Please select ${fitm.label}${fitm.module == 'date' && fitm.label != 'Year'
                      ? ' year'
                      : ''
                      }`,
                  },
                };
              } else {
                let keyVal = fitm.field_name.replace('default_', '');
                if (!getValue(sbForm, [sKey, keyVal])) {
                  error = {
                    ...error,
                    [fitm.field_name]: {
                      error: true,
                      message: `Please enter ${fitm.label}${fitm.module == 'date' ? ' year' : ''
                        }`,
                    },
                  };
                } else if (validBirthYear(sbForm[sKey][keyVal])) {
                  error = {
                    ...error,
                    [fitm.field_name]: {
                      error: true,
                      message: `Please enter valid ${fitm.label}${fitm.module == 'date' ? ' year' : ''
                        }`,
                    },
                  };
                }
              }
            }
          } else if (
            typeof sbForm[sKey] == 'undefined' ||
            (typeof sbForm[sKey] == 'object' &&
              Object.keys(sbForm[sKey]).length == 0)
          ) {
            error = {
              ...error,
              [sKey]: { error: true, message: `Please enter ${frmItem.label}` },
            };
            if (sKey == 'emailAddress') {
              let email = sbForm[sKey];
              if (!testEmail(email)) {
                error = {
                  ...error,
                  [sKey]: { error: true, message: 'Please enter Email' },
                };
              }
            }
            if (sKey == 'password') {
              let password = sbForm[sKey];
              if (password.length < 6) {
                error = {
                  ...error,
                  [sKey]: { error: true, message: 'Please enter a Password' },
                };
              }
            }
            if (sbForm[sKey] == 'repeat_password') {
              let password = sbForm['password'];
              let repeat_password = sbForm[sKey];
              if (password.length >= 6 && password != repeat_password) {
                error = {
                  ...error,
                  [sKey]: {
                    error: true,
                    message: 'Please enter the same Password again',
                  },
                };
              }
            }
          } else {
            if (sKey == 'field_first_name' || sKey == 'field_last_name') {
              let text = getValue(sbForm, [sKey, 'value']);
              let onlyChars = /^[a-z|A-Z]*$/;
              if (!onlyChars.test(text)) {
                error = {
                  ...error,
                  [sKey]: { error: true, message: 'Only characters are allowed' },
                };
              }
            }
          }
        }
      }
    }

    if (Object.keys(error).length > 0) {
      this.showErrorMessage(true, 'Please check the highlighted fields');
      // ToastMessage();
      this.setState({ error });
      return;
    }
    //showConsoleLog(ConsoleType.LOG,submitForm);
    delete submitForm['authorizationInfo']['repeat_password'];
    submitForm['configurationTimestamp'] = TimeStampMilliSeconds();
    this.submitForm = submitForm;
    var obj = {};
    var name = '';
    var email = '';
    if (getValue(submitForm.personalInfo, ['field_first_name'])) {
      name = `${submitForm.personalInfo.field_first_name.value} ${submitForm.personalInfo.field_last_name.value}`;
    }
    if (getValue(submitForm.authorizationInfo, ['emailAddress'])) {
      email = submitForm.authorizationInfo.emailAddress;
    }
    obj = {
      ...obj,
      name: name,
      emailId: email,
    };

    this.props.showLoader();
    checkUserRegistration({
      ...obj,
      configurationTimestamp: submitForm['configurationTimestamp'],
    }, resp => this.checkUserProfile(resp.success, resp.isRegistered, resp.personalInfo));
  };
}
