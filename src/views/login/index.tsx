import React from 'react';
import {
  Alert,
  Animated,
  DeviceEventEmitter,
  Image,
  Keyboard,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {connect} from 'react-redux';
import Text from '../../common/component/Text';
import TextField from '../../common/component/textField';
import {Colors, CommonTextStyles} from '../../common/constants';
import {Account, LoginStore} from '../../common/loginStore';
import {UserData} from '../../common/loginStore/database';
import {UserAccount} from '../menu/reducer';
import {styles} from './designs';
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
import {ToastMessage} from '../../common/component/Toast';
// @ts-ignore
import DefaultPreference from 'react-native-default-preference';
// @ts-ignore
import {arrowRightCircle} from '../../../app/images';
import MessageDialogue from '../../common/component/messageDialogue';
import EventManager from '../../common/eventManager';
import {
  RESET_ON_LOGIN,
  SET_KEYBOARD_HEIGHT,
} from '../dashboard/dashboardReducer';
import Styles from './styles';
import Utility from '../../common/utility';
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

  //Login Controller
  controller: LoginControllerProtocol;

  //Flag to check if user had already logged in
  dataWasStored?: string = null;
  keyheightsKey: number;

  //User state
  state = {
    _isRemeberMe: false,
    username: 'rishabh.shah@infobeans.com',
    password: 'Admin@123',
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
  };

  moveOnYAxis = new Animated.Value(0);

  startMoveOnYAxis = () => {
    Animated.timing(this.moveOnYAxis, {
      toValue: 1,
      duration: 5,
      useNativeDriver: true,
    }).start();
  };

  startMoveDownYAxis = () => {
    Animated.timing(this.moveOnYAxis, {
      toValue: 0,
      duration: 5,
      useNativeDriver: true,
    }).start();
  };

  messageRef: any;
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;

  navBar: NavigationHeaderSafeArea = null;
  /**
   * Lifecycle Method
   *
   * Will get updates from Saga
   */
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    // Check for login response
    console.log(nextProps.loginStatus);
    // if (nextProps?.loginStatus) {
    //   this.controller.checkLoggedIn(nextProps.loginStatus);
    // }
  }

  constructor(props: Props) {
    super(props);
    this.navBar = this.props.navBar;
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
    const {username, password} = this.state;
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
        ToastMessage(err.toString(), Colors.ErrorColor);
      },
    );
  };

  // _show = (message: any, color: any) => {
  //   this.messageRef && this.messageRef._show({ message: message, color: color })
  //   setTimeout(() => {
  //     this.messageRef && this.messageRef._hide();
  //   }, 4000);
  // }

  // _hide = () => {
  //   this.messageRef && this.messageRef._hide();
  // }

  componentDidMount() {
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
        //console.log(err);
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

  updateState(state: object, showErrorMessage?: boolean, msgObject?: string) {
    if (showErrorMessage) {
    } else {
      this.setState(state);
    }
  }

  _keyboardDidShow = e => {
    try {
      const {height, screenX, screenY, width} = e.endCoordinates;
      // console.log(height)

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
      console.warn(error);
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
    debugger;
    let height = 0;
    if (show) {
      // height = 70;
      this.messageRef._show({message, color: Colors.ErrorColor});
      setTimeout(() => {
        this.messageRef && this.messageRef._hide();
      }, 4000);
      // Alert.alert(message)
    } else {
      this.messageRef._hide();
    }
    this.updateState({errorViewHeight: height});
  };

  componentWillUnmount() {
    this.setState({_isRemeberMe: false}, () => {
      this.showErrorMessage(false);
      Keyboard.removeAllListeners(this.keyboardDidShowListener);
      Keyboard.removeAllListeners(this.keyboardDidHideListener);
      this.appleLoginCallBack.removeListener();
      DeviceEventEmitter.removeAllListeners('AppleLoginResult');
    });
  }

  selectedCommunity: Account = new Account();

  render() {
    // let keyboardHeight = this.state.keyboardHeight
    const yVal = this.moveOnYAxis.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [
        0,
        -(this.state.keyboardHeight * 0.55),
        -(this.state.keyboardHeight * 0.85),
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
        <SafeAreaView style={{width: '100%'}}>
          <MessageDialogue ref={(ref: any) => (this.messageRef = ref)} />
        </SafeAreaView>
        <SafeAreaView style={Styles.flexContainer}>
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
                onSubmitEditing={() => {
                  this._passwordField && this._passwordField.focus();
                }}
                value={this.state.username}
                placeholder="Email..."
                keyboardType="email-address"
                returnKeyType="next"
                onChange={(text: any) =>
                  this.controller.onTextChange('username', text)
                }
              />
              {/* <View style={Styles.separatorHeightStyle16} /> */}
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
                placeholder="Password..."
                secureTextEntry={true}
                onSubmitEditing={this.controller.onClick.bind(this.controller)}
                returnKeyType="go"
                onChange={(text: any) =>
                  this.controller.onTextChange('password', text)
                }
              />
              {/* <View style={{ height: 10 }} /> */}
            </View>

            {/* <View
                  // behavior={Platform.OS === "ios" ? "padding" : "height"}
                  // keyboardVerticalOffset={60}
                  style={{
                    width: Utility.getDeviceWidth() - 48,
                    marginLeft: 24,
                    height: 380 - this.state.keyboardHeight
                  }}> */}
            <Animated.View style={[Styles.buttonContainer, animStyle]}>
              <TouchableWithoutFeedback
                // disabled={(this.state.username != '' && this.state.password != '') ? false : true}
                // onPress={this.controller.onClick.bind(this.controller)}>
                onPress={() => this.props.navigation.navigate('dashboard')}>
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
          </View>
          {/** Sign In section */}
          {/* <TouchableHighlight
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
                        justifyContent: 'space-between',
                      },
                    ]}>
                    <Text
                      style={{
                        fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
                        color: Colors.TextColor,
                        ...fontSize(Size.byWidth(16)),
                      }}>
                      Remember Me
                    </Text>
                    <ToggleSwitch
                      isOn={this.state._isRemeberMe}
                      onColor={Colors.NewTitleColor}
                      offColor="#E5E5E5"
                      labelStyle={{
                        color: 'black',
                        fontWeight: Platform.OS === 'ios' ? '900' : 'bold',
                      }}
                      size="medium"
                      onToggle={(isOn: any) => {
                        this.setState({ _isRemeberMe: isOn });
                      }}
                    />
                  </View>
                </TouchableHighlight>
                */}

          {/** Forgot Passwrod button */}
          {/* <View style={styles.forgotPasswordContainer}>
                  <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => {
                      this.showErrorMessage(false);
                      this.props.navigation.push('forgotPassword');
                    }}>
                    <Text
                      style={{
                        fontWeight: '600',
                        color: Colors.NewTitleColor,
                        ...fontSize(Size.byWidth(16)),
                      }}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View> */}

          {/* </View> */}
          {/* </View> */}
          {/* </View> */}
        </SafeAreaView>
        {/* </LinearGradient> */}
        {/* </TouchableWithoutFeedback> */}
        {/* </ImageBackground> */}
      </View>
    );
  }
}

/**
 * Redux Map State
 * @param state
 */
const mapState = (state: {loginStatus: LoginState; dashboardReducer}) => ({
  loginStatus: state.loginStatus,
  keyboardHeight: state.dashboardReducer.keyBoardHeight,
});

/**
 * Redux mao Props
 * @param dispatch
 */
const mapDispatch = (dispatch: Function) => ({
  loginServiceCall: (params: object) =>
    dispatch({type: LoginServiceStatus.RequestStarted, payload: params}),
  fetchLoginAccounts: (params: object) =>
    dispatch({type: LoginInstanceStatus.RequestStarted, payload: params}),
  setUser: (payload: UserData) => dispatch({type: UserAccount.Store, payload}),
  clean: () => dispatch({type: LoginServiceStatus.Ended}),
  clearDashboard: () => dispatch({type: RESET_ON_LOGIN}),
  updateKeyboardHeight: (params: number) =>
    dispatch({type: SET_KEYBOARD_HEIGHT, payload: params}),
});

export default connect(mapState, mapDispatch)(Login);
