import React from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  DeviceEventEmitter,
  Keyboard,
  Animated,
  StatusBar,
  Dimensions,
  Modal,
  Image,
  TouchableHighlight,
  Alert,
  Platform,
} from 'react-native';
import Text from '../../common/component/Text';
import CommunityBanner from '../../common/component/community/communityBanner';
import {styles} from './designs';
import {SubmitButton} from '../../common/component/button';
import {
  LoginControllerProtocol,
  LoginController,
  LoginViewProtocol,
  Props,
} from './loginController';
import {connect} from 'react-redux';
import {
  LoginState,
  LoginServiceStatus,
  LoginInstanceStatus,
} from './loginReducer';
import TextField from '../../common/component/textField';
import {Size, Colors, fontSize} from '../../common/constants';
import {LoginStore, Account} from '../../common/loginStore';
import {UserData} from '../../common/loginStore/database';
import {Actions} from 'react-native-router-flux';
import {UserAccount} from '../menu/reducer';
//@ts-ignore
import {KeyboardAwareScrollView} from '../../common/component/keyboardaware-scrollview';
import GetFormData from '../registration/getFormData';
import Utility from '../../common/utility';
import {No_Internet_Warning, ToastMessage} from '../../common/component/Toast';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import DeviceInfo from 'react-native-device-info';
import CommonInstanceListsSelection, {
  ListType,
} from './commonInstanceListSelection';
// @ts-ignore
import DefaultPreference from 'react-native-default-preference';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import {checkbox_active, checkbox, google_icon, apple_icon} from '../../images';
// @ts-ignore
import ToggleSwitch from 'toggle-switch-react-native';
import EventManager from '../../common/eventManager';
import {RESET_ON_LOGIN} from '../dashboard/dashboardReducer';
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

  //User state
  state = {
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
  };

  navBar: NavigationHeaderSafeArea = null;
  /**
   * Lifecycle Method
   *
   * Will get updates from Saga
   */
  componentWillReceiveProps(nextProps: Props) {
    // Check for login response
    if (Actions.currentScene == 'login' || Actions.currentScene == 'prologue') {
      this.controller.checkLoggedIn(nextProps.loginStatus);
    }
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

  componentDidMount() {
    LoginStore.listAllAccounts()
      .then((resp: any) => {
        let list = resp.rows.raw() as Array<UserData>;
        list = list.filter((it: UserData) => it.userAuthToken != '');
        if (list.length == 0) {
          DefaultPreference.get('loginCredentials').then((value: any) => {
            value = JSON.parse(value);
            if (value.username && value.password) {
              this._usernameField.focus();
              this._passwordField.focus();
              this.setState({
                username: `${value.username}`,
                password: `${value.password}`,
              });
              Keyboard.dismiss();
            }
          });
        }
      })
      .catch((err: Error) => {
        //console.log(err);
      });
  }

  updateState(state: object, showErrorMessage?: boolean, msgObject?: string) {
    if (showErrorMessage) {
    } else {
      this.setState(state);
    }
  }

  showErrorMessage = (show: boolean, message?: string) => {
    let height = 0;
    if (show) {
      height = 70;
      this.props.navBar._show(message, Colors.ErrorColor);
    } else {
      this.props.navBar._hide();
    }
    this.updateState({errorViewHeight: height});
  };

  componentWillUnmount() {
    this.setState({_isRemeberMe: true});
    this.showErrorMessage(false);
  }

  selectedCommunity: Account = new Account();

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Modal
            animationType={'slide'}
            transparent={false}
            visible={this.state.isVisible}
            onRequestClose={() =>
              this.updateState({...this.state, isVisible: false})
            }>
            <CommonInstanceListsSelection
              username={this.state.username}
              onClick={(selectedCommunity: any) =>
                this.loginToSelected(selectedCommunity)
              }
              type={ListType.Login}
              title={'Login'}
              listAccounts={this.state.instanceData}
              onRequestClose={() =>
                this.updateState({...this.state, isVisible: false})
              }
              isDisabledAccount={this.state.isDisabledAccount}
            />
          </Modal>
          {/*<NavigationHeaderSafeArea height={0} ref={(ref)=> this.navBar = ref} showCommunity={false} cancelAction={()=> Actions.pop()} 
                                      showRightText={true} isWhite={false}/>	*/}
          {/* <TouchableWithoutFeedback
					style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
					onPress={() => {
						Keyboard.dismiss();
					}}> */}
          <View style={styles.innerContainer}>
            <View style={styles.loginContainer}>
              <KeyboardAwareScrollView
                onScroll={() => Keyboard.dismiss()}
                keyboardShouldPersistTaps={'handled'}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{
                  width: Dimensions.get('window').width,
                  height: '100%',
                  padding: 15,
                }}>
                {/** Commuity banner UI */}
                {/* <View style={styles.communityBanner}>
									<CommunityBanner communityInfo={this.selectedCommunity} />
								</View> */}
                <TextField
                  errorMessage={this.state.userNameError.text}
                  showError={this.state.userNameError.error}
                  reference={ref => (this._usernameField = ref)}
                  onSubmitEditing={() => {
                    this._passwordField && this._passwordField.focus();
                  }}
                  value={this.state.username}
                  placeholder="Email Address"
                  keyboardType="email-address"
                  returnKeyType="next"
                  onChange={(text: any) =>
                    this.controller.onTextChange('username', text)
                  }
                />
                <TextField
                  passwordToggle={true}
                  errorMessage={this.state.passwordError.text}
                  showError={this.state.passwordError.error}
                  reference={ref => (this._passwordField = ref)}
                  value={this.state.password}
                  placeholder="Password"
                  secureTextEntry={true}
                  onSubmitEditing={this.controller.onClick.bind(
                    this.controller,
                  )}
                  returnKeyType="go"
                  onChange={(text: any) =>
                    this.controller.onTextChange('password', text)
                  }
                />
                {/** Sign In section */}
                <TouchableHighlight
                  underlayColor={'#ffffffff'}
                  style={styles.forgotPassword}
                  onPress={() =>
                    this.setState({_isRemeberMe: !this.state._isRemeberMe})
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
                    {/* <Image source={this.state._isRemeberMe ? checkbox_active : checkbox} style={{height: 14, width: 14}}></Image> */}
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
                        this.setState({_isRemeberMe: isOn});
                      }}
                    />
                  </View>
                </TouchableHighlight>
                <SubmitButton
                  style={{
                    backgroundColor: Colors.NewTitleColor,
                    ...fontSize(22),
                  }}
                  text="Login"
                  onPress={this.controller.onClick.bind(this.controller)}
                />

                {/** Forgot Passwrod button */}
                <View style={styles.forgotPasswordContainer}>
                  <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => {
                      this.showErrorMessage(false);
                      Actions.push('forgotPassword');
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
                </View>

                {Platform.OS == 'ios' &&
                  (Platform.Version >= 13 || Platform.Version >= '13') && (
                    <TouchableHighlight
                      underlayColor={'#ffffff99'}
                      onPress={this.controller.onClickAppleSignIn.bind(
                        this.controller,
                      )}>
                      <View
                        style={{
                          marginTop: Size.byWidth(16),
                          width: '100%',
                          borderWidth: 1,
                          borderColor: '#7c7c7c',
                          height: Size.byHeight(42),
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                          borderRadius: Size.byWidth(5),
                          backgroundColor: '#fff',
                        }}>
                        <Image
                          source={apple_icon}
                          style={{tintColor: '#5c5c5c'}}
                        />
                        <Text
                          style={{
                            marginLeft: 10,
                            color: Colors.TextColor,
                            fontWeight: Platform.OS === 'ios' ? '400' : 'bold',
                            ...fontSize(20),
                          }}>
                          Sign in with Apple
                        </Text>
                      </View>
                    </TouchableHighlight>
                  )}

                <TouchableHighlight
                  underlayColor={'#ffffff99'}
                  onPress={this.controller.onClickGoogleSignIn.bind(
                    this.controller,
                  )}>
                  <View
                    style={{
                      marginTop: Size.byWidth(16),
                      width: '100%',
                      borderWidth: 1,
                      borderColor: '#7c7c7c',
                      height: Size.byHeight(42),
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      borderRadius: Size.byWidth(5),
                      backgroundColor: '#fff',
                    }}>
                    <Image source={google_icon} />
                    <Text
                      style={{
                        marginLeft: 10,
                        color: Colors.TextColor,
                        fontWeight: Platform.OS === 'ios' ? '400' : 'bold',
                        ...fontSize(20),
                      }}>
                      Sign in with Google
                    </Text>
                  </View>
                </TouchableHighlight>
                {/** Join now UI */}
                {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: Size.byWidth(32) }}>
									<Text style={{ alignContent: "center", ...fontSize(Size.byWidth(18)) }}>{"Not a member? "}</Text>
									<TouchableOpacity
										style={styles.forgotPassword}
										onPress={() => {
											if(Utility.isInternetConnected)	{
												new GetFormData().callService("replace")
											} else{
												No_Internet_Warning()
											}
										}}>
										<Text style={{ fontWeight: "600", color: Colors.ThemeColor, ...fontSize(Size.byWidth(18)) }}>Join now</Text>
									</TouchableOpacity>
								</View> */}
              </KeyboardAwareScrollView>
            </View>
          </View>
          {/* </TouchableWithoutFeedback> */}
        </View>
      </SafeAreaView>
    );
  }
}

/**
 * Redux Map State
 * @param state
 */
const mapState = (state: {loginStatus: LoginState}) => ({
  loginStatus: state.loginStatus,
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
});

export default connect(mapState, mapDispatch)(Login);
