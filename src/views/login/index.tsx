import React from 'react';
import {
  Alert,
  Animated,
  DeviceEventEmitter,
  Easing,
  Image,
  Keyboard,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Text from '../../common/component/Text';
import TextField from '../../common/component/textField';
import {
  Colors,
  CommonTextStyles,
  ConsoleType,
  showConsoleLog,
} from '../../common/constants';
import { Account, LoginStore } from '../../common/loginStore';
import { UserData } from '../../common/loginStore/database';
import { UserAccount } from '../menu/reducer';
import { styles } from './designs';
import {
  LoginController,
  LoginControllerProtocol,
  LoginViewProtocol,
  Props,
} from './loginController';
import {
  LoginInstanceStatus,
  LoginServiceStatus,
  LoginState,
} from './loginReducer';
//@ts-ignore
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import { ToastMessage } from '../../common/component/Toast';
// @ts-ignore
import DefaultPreference from 'react-native-default-preference';
// @ts-ignore
import { arrowRightCircle, checkbox, checkbox_tick } from '../../../app/images';
import MessageDialogue from '../../common/component/messageDialogue';
import EventManager from '../../common/eventManager';
import {
  RESET_ON_LOGIN,
  SET_KEYBOARD_HEIGHT,
  SHOW_LOADER_READ,
  SHOW_LOADER_TEXT,
} from '../dashboard/dashboardReducer';
import Styles from './styles';
import Utility from '../../common/utility';
import BusyIndicator from '../../common/component/busyindicator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export const kRegSignUp = 'Registration SignUp';
export enum loginType {
  googleLogin = 'Google',
  appleLogin = 'Apple',
}
//Login Component
class Login extends React.Component<Props> implements LoginViewProtocol {
  //Password Field Reference
  _passwordField?: TextInput = null;
  _usernameField?: TextInput = null;

  //Registration screen login callBacks
  appleLoginCallBack: EventManager;
  googleLoginCallBack: EventManager;
  regScroll: any;

  //Login Controller
  controller: LoginControllerProtocol;

  //Flag to check if user had already logged in
  dataWasStored?: string = null;
  keyheightsKey: number;

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
      useNativeDriver: true,
      easing: Easing.out(Easing.poly(5))
    }).start();
  };

  messageRef: any;
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;
  showListener: any;
  navBar: NavigationHeaderSafeArea = null;

  constructor(props: Props) {
    super(props);
    this.navBar = this.props.navBar;
    //User state
    this.state = {
      _isRemeberMe: true,
      username: '',
      password: '',
      userNameError: {
        error: false,
        text: '',
      },
      passwordError: {
        error: false,
        text: '',
      },
      errorViewHeight: 0,
      errorMessage: '',
      isVisible: false,
      instanceData: [],
      isDisabledAccount: false,
      keyboardHeight: 0,
      passwordFocus: false,
      showLoaderValue: false,
      loaderTextValue: 'Loading...'
    };

    this.controller = new LoginController(this);
    DeviceEventEmitter.addListener(
      'AppleLoginResult',
      this.showAlertFromNative,
    );
    this.controller.onClickAppleSignIn =
      this.controller.onClickAppleSignIn.bind(this.controller);
    this.controller.onClickGoogleSignIn =
      this.controller.onClickGoogleSignIn.bind(this.controller);
    this.appleLoginCallBack = EventManager.addListener(
      kRegSignUp,
      this.regSignUpListener.bind(this),
    );
    this.regScroll = React.createRef();

  }

  regSignUpListener = (type: any) => {
    switch (type) {
      case loginType.appleLogin:
        this.controller.onClickAppleSignIn();
        break;
      case loginType.googleLogin:
        this.controller.onClickGoogleSignIn();
        break;
    }
  };

  showAlertFromNative(test: any) {
    Alert.alert(JSON.stringify(test));
  }

  loginToSelected = (selectedCommunity: any) => {
    const { username, password } = this.state;
    DefaultPreference.get('firebaseToken').then(
      (value: any) => {
        this.props.loginServiceCall({
          emailId: username,
          password: password,
          fcm_token: value,
          portal_ids: selectedCommunity,
        });
      },
      (err: any) => {
        this.props.loginServiceCall({
          emailId: username,
          password: password,
          fcm_token: '',
          portal_ids: selectedCommunity,
        });
        //ToastMessage(err.toString(), Colors.ErrorColor);
      },
    );
  };

  _show = (message: any, color: any) => {
    //   this.messageRef && this.messageRef._show({ message: message, color: color })
    //   setTimeout(() => {
    //     this.messageRef && this.messageRef._hide();
    //   }, 4000);
  }

  // _hide = () => {
  //   this.messageRef && this.messageRef._hide();
  // }

  componentDidMount() {
    this.showListener = DeviceEventEmitter.addListener(
      'showMessage',
      this._show,
    );

    LoginStore.listAllAccounts()
      .then((resp: any) => {
        let list = resp.rows.raw() as Array<UserData>;
        list = list.filter((it: UserData) => it.userAuthToken != '');
        if (list.length == 0) {
          DefaultPreference.get('loginCredentials').then((value: any) => {
            value = value ? JSON.parse(value) : null;
            if (value && value.username && value.password) {
              this._usernameField.focus();
              this._passwordField.focus();
              this.setState(
                {
                  username: `${value.username}`,
                  password: `${value.password}`,
                },
                () => {
                  Keyboard.dismiss();
                },
              );
            }
          });
        }
      })
      .catch((err: Error) => {
        //showConsoleLog(ConsoleType.LOG,err);
      });
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }
  /**
   * Lifecycle Method
   *
   * Will get updates from Saga
   */
  componentWillReceiveProps(nextProps: Props) {
    // Check for login response
    if (
      this.props !== nextProps &&
      (nextProps?.route?.name == 'login' ||
        nextProps?.route?.name == 'prologue')
    ) {
      this.controller.checkLoggedIn(nextProps.loginStatus);
    }
  }

  updateState(state: object, showErrorMessage?: boolean, msgObject?: string) {
    if (showErrorMessage) {
    } else {
      this.setState(state);
    }
  }

  _keyboardDidShow = e => {
    try {
      const { height, screenX, screenY, width } = e.endCoordinates;
      // showConsoleLog(ConsoleType.LOG,height)

      if (height) {
        // alert( e.endCoordinates.height)
        // this.keyheightsKey = (height);
        // this.props.updateKeyboardHeight(height)
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

  showErrorMessage = (show: boolean, message?: string) => {
    let height = 0;
    if (show) {
      // height = 70;
      if (this.props.showErr) {
        this.props.showErr(message)
      }
      this.messageRef._show({ message, color: Colors.ErrorColor });
      setTimeout(() => {
        this.messageRef && this.messageRef._hide();
      }, 4000);
      // Alert.alert(message)
    } else {
      // this.messageRef._hide();
    }
    this.updateState({
      errorViewHeight: height, showLoaderValue: false,
      loaderTextValue: 'Loading...'
    });
  };

  componentWillUnmount() {
    this.setState({ _isRemeberMe: false, showLoaderValue: false }, () => {
      this.showErrorMessage(false);
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
      // this.appleLoginCallBack.removeListener();
      // DeviceEventEmitter.removeAllListeners('AppleLoginResult');
    });
  }

  showLoaderData = () => {
    this.setState({
      showLoaderValue: true,
      loaderTextValue: 'Logging In...'
    })
  }

  selectedCommunity: Account = new Account();

  moveTopasswordField = () => {
    this.setState({
      passwordFocus: true
    }, () => {
      debugger
      console.log(this.regScroll)
      this.regScroll.scrollToPosition(
        0,
        100,
        true,
      );
      this._passwordField && this._passwordField.focus();
    })
  };

  render() {
    // let keyboardHeight = this.state.keyboardHeight
    const yVal = this.moveOnYAxis.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [
        0,
        -(this.state.keyboardHeight),
        -(this.state.keyboardHeight),
      ],
    });

    const animStyle = {
      transform: [
        {
          translateY: yVal,
        },
      ],
    };

    return (
      <View
        style={styles.container}
        onTouchStart={() => {
          Keyboard.dismiss();
        }}>
        <StatusBar
          barStyle={
            Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
          }
          backgroundColor="#ffffff"
        />
        {
          this.state.showLoaderValue ?
            <BusyIndicator startVisible={this.state.showLoaderValue} text={this.state.loaderTextValue != '' ? this.state.loaderTextValue : 'Loading...'} overlayColor={Colors.ThemeColor} />
            :
            null
        }
        <SafeAreaView style={{ width: '100%' }}>
          <MessageDialogue
            ref={(ref: any) => (this.messageRef = ref)}
          />
        </SafeAreaView>
        <SafeAreaView style={Styles.flexContainer}>

          <TouchableOpacity activeOpacity={1}
            onPress={() => {
              this.props.navigation.goBack()
            }}
            style={Styles.backButtonContainerStyle} >
            <Image style={Styles.backIconStyle} source={arrowRightCircle} />
            <Text style={[CommonTextStyles.fontWeight500Size17Inter, { color: Colors.newTextColor }]}>Back</Text>
          </TouchableOpacity>

          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            ref={ref => (this.regScroll = ref)}
            // style={{ width: "100%", paddingHorizontal: 24 }}
            bounces={false}
            extraScrollHeight={140}
          >
            <View style={Styles.LoginHeader}>
              <Text style={Styles.hederText}>Login</Text>
            </View>

            <View style={Styles.separatorHeightStyle16} />
            <View style={Styles.separatorHeightStyle16} />

            <View style={Styles.inputsContainer}>

              <View>
                <Text
                  style={[
                    CommonTextStyles.fontWeight500Size13Inter,
                    Styles.labelStyle,
                  ]}>
                  EMAIL
                </Text>

                <TextField
                  errorMessage={this.state.userNameError.text}
                  showError={this.state.userNameError.error}
                  reference={ref => (this._usernameField = ref)}
                  onSubmitEditing={this.moveTopasswordField}
                  value={this.state.username}
                  onFocus={() => {
                    this.setState({
                      passwordFocus: false
                    })
                    //   this.regScroll.scrollToPosition(
                    //     0,
                    //     100,
                    //     true,
                    //   );
                  }}
                  placeholder="Enter email..."
                  keyboardType="email-address"
                  returnKeyType="next"
                  onChange={(text: any) =>
                    this.controller.onTextChange('username', text)
                  }
                />
                <View style={Styles.separatorHeightStyle24} />
                <Text
                  style={[
                    CommonTextStyles.fontWeight500Size13Inter,
                    Styles.labelStyle,
                  ]}>
                  PASSWORD
                </Text>

                <TextField
                  passwordToggle={true}
                  errorMessage={this.state.passwordError.text}
                  showError={this.state.passwordError.error}
                  reference={ref => (this._passwordField = ref)}
                  value={this.state.password}
                  placeholder="Enter password..."
                  secureTextEntry={true}
                  onSubmitEditing={this.controller.onClick.bind(this.controller)}
                  returnKeyType="go"
                  onFocus={() => {
                    this.setState({
                      passwordFocus: true
                    })
                    //   this.regScroll.scrollToPosition(
                    //     0,
                    //     this.state.keyboardHeight/2,
                    //     true,
                    //   );
                  }}
                  onChange={(text: any) =>
                    this.controller.onTextChange('password', text)
                  }
                />
                {/* <View style={{ height: 10 }} /> */}
                <TouchableHighlight
                  underlayColor={Colors.white}
                  onPress={() => {
                    this.showErrorMessage(false);
                    this.props.navigation.navigate('forgotPassword');
                  }}>
                  <View style={styles.forgotPassword}>
                    <Text
                      style={Styles.forwardTextStyle}>
                      Forgot Password?
                    </Text>

                  </View>
                </TouchableHighlight>
              </View>

            </View>
          </KeyboardAwareScrollView>
          <Animated.View style={[Styles.buttonContainer, animStyle,]}>
            <TouchableHighlight
              underlayColor={'#ffffffff'}
              style={styles.forgotPassword}
              onPress={() =>
                this.setState({ _isRemeberMe: !this.state._isRemeberMe })
              }>
              <View
                style={[
                  styles.forgotPasswordContainer,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 32
                  },
                ]}>
                <Image source={this.state._isRemeberMe ? checkbox_tick : checkbox} />
                <View style={{ width: 8 }} />
                <Text
                  style={styles.forgotPasswordText}>
                  Remember Me
                </Text>

              </View>
            </TouchableHighlight>

            <TouchableWithoutFeedback
              // disabled={(this.state.username != '' && this.state.password != '') ? false : true}
              onPress={() => {
                this.controller.onClick();
              }}>
              <View
                style={[
                  Styles.loginSSOButtonStyle,
                  {
                    height: 44,
                    backgroundColor:
                      this.state.username != '' && this.state.password != ''
                        ? Colors.bordercolor
                        : Colors.bordercolor,
                    opacity:
                      this.state.username != '' && this.state.password != ''
                        ? 1
                        : 1,
                    flexDirection: 'row',
                    // backgroundColor: (this.state.username != '' && this.state.password != '') ? Colors.decadeFilterBorder : Colors.bordercolor, opacity: (this.state.username != '' && this.state.password != '') ? 1 : 1, flexDirection: 'row'
                  },
                ]}>
                <Text
                  style={[
                    CommonTextStyles.fontWeight500Size17Inter,
                    Styles.loginTextStyle,
                  ]}>
                  Login
                </Text>
                <Image source={arrowRightCircle} />
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </SafeAreaView>

      </View>
    );
  }
}

/**
 * Redux Map State
 * @param state
 */
const mapState = (state: { loginStatus: LoginState; dashboardReducer }) => ({
  loginStatus: state.loginStatus,
  keyboardHeight: state.dashboardReducer.keyBoardHeight,
  showLoaderValue: state.dashboardReducer.showLoader,
  loaderTextValue: state.dashboardReducer.loaderText,
});

/**
 * Redux mao Props
 * @param dispatch
 */
const mapDispatch = (dispatch: Function) => ({
  loginServiceCall: (params: object) =>
    dispatch({ type: LoginServiceStatus.RequestStarted, payload: params }),
  fetchLoginAccounts: (params: object) =>
    dispatch({ type: LoginInstanceStatus.RequestStarted, payload: params }),
  setUser: (payload: UserData) => dispatch({ type: UserAccount.Store, payload }),
  clean: () => dispatch({ type: LoginServiceStatus.Ended }),
  clearDashboard: () => dispatch({ type: RESET_ON_LOGIN }),
  updateKeyboardHeight: (params: number) =>
    dispatch({ type: SET_KEYBOARD_HEIGHT, payload: params }),
  showLoader: (payload: any) =>
    dispatch({ type: SHOW_LOADER_READ, payload: payload }),
  loaderText: (payload: any) =>
    dispatch({ type: SHOW_LOADER_TEXT, payload: payload }),
});

export default connect(mapState, mapDispatch)(Login);
