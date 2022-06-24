import React from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  TextInput,
  StatusBar,
  Keyboard,
} from 'react-native';
import Text from '../../common/component/Text';
import CommunityBanner from '../../common/component/community/communityBanner';
import {styles} from './designs';
import {SubmitButton} from '../../common/component/button';
import {
  ForgotPasswordState,
  ForgotPasswordServiceStatus,
} from './forgotPasswordReducer';
import {connect} from 'react-redux';

import TextField from '../../common/component/textField';
import {
  Size,
  testEmail,
  getValue,
  Colors,
  fontSize,
  Storage,
} from '../../common/constants';
import {Actions} from 'react-native-router-flux';
import {Account} from '../../common/loginStore';
import {Props} from '../login/loginController';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import {ToastMessage, No_Internet_Warning} from '../../common/component/Toast';
//@ts-ignore
import {KeyboardAwareScrollView} from '../../common/component/keyboardaware-scrollview';
import Utility from '../../common/utility';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import {backBlkBtn} from '../../images';
import {MemoryService} from '../../common/webservice/memoryServices';
import {type} from 'os';
import EventManager from '../../common/eventManager';
import {loginInstanceRequest} from '../../common/webservice/loginServices';
import {kAdmin} from '../registration/getInstancesSaga';
import {ListType} from '../login/commonInstanceListSelection';
//Login Component
class ForgotPassword extends React.Component<Props> {
  //Password Field Reference
  _emailTextField?: TextInput = null;

  //User state
  state = {
    email: '',
    emailError: {
      error: false,
      text: '',
    },
    isRequestSubmitted: false,
  };

  constructor(props: Props) {
    super(props);
    this.selectedCommunity.values = Account.tempData();
  }

  componentDidMount() {}

  updateState(state: object) {
    this.setState(state);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.forgotPasswordStatus.completed) {
      loaderHandler.hideLoader();
      this.props.clean();

      if (nextProps.forgotPasswordStatus.success) {
        let message: string = getValue(nextProps, [
          'forgotPasswordStatus',
          'data',
          'ResponseMessage',
        ]);
        let code: number = getValue(nextProps, [
          'forgotPasswordStatus',
          'data',
          'ResponseCode',
        ]);

        if (code == 200) {
          loaderHandler.hideLoader();
          if (message && message.trim().length != 0) {
            ToastMessage(message, 'black');
          }
          this.setState({isRequestSubmitted: true});
        } else {
          loaderHandler.hideLoader();
          if (message && message.trim().length != 0) {
            ToastMessage(message, Colors.ErrorColor);
          }
          this.setState({isRequestSubmitted: false});
        }
      }
    }
  }

  selectedCommunity: Account = new Account();

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <NavigationHeaderSafeArea
            heading={'Forgot Password'}
            showCommunity={false}
            cancelAction={() => Actions.pop()}
            showRightText={false}
            isWhite={true}
            backIcon={backBlkBtn}
          />
          <StatusBar
            barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
            backgroundColor={Colors.NewDarkThemeColor}
          />
          <KeyboardAwareScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{width: '100%', height: '100%'}}>
            <View
              style={[
                styles.loginContainer,
                {
                  justifyContent: 'space-between',
                  width: '100%',
                  marginTop: Size.byHeight(40),
                },
              ]}>
              {/** Commuity banner UI */}
              <View
                style={{
                  width: Size.byWidth(310),
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <View style={{width: '100%'}}>
                  {/* <View style={styles.communityBanner}>
										<CommunityBanner communityInfo={this.selectedCommunity} />
									</View> */}

                  <Text
                    style={{
                      paddingBottom: 15,
                      textAlign: 'center',
                      fontWeight: '300',
                      ...fontSize(Size.byWidth(18)),
                      color: Colors.TextColor,
                    }}>
                    {this.state.isRequestSubmitted
                      ? 'You will soon receive an email with the instructions to reset the password.'
                      : `Please enter your email address to reset your password`}
                  </Text>
                </View>
                <View style={{width: '100%'}}>
                  {this.state.isRequestSubmitted ? (
                    <View style={{flex: 1, height: 100}}>
                      <SubmitButton
                        text="Done"
                        onPress={this.onDoneButtonAction.bind(this)}
                      />
                    </View>
                  ) : (
                    <KeyboardAvoidingView
                      style={styles.keyboardAvoiding}
                      behavior="padding">
                      <TextField
                        style={{width: '100%', height: 75}}
                        errorMessage={this.state.emailError.text}
                        showError={this.state.emailError.error}
                        onSubmitEditing={() => {
                          this._emailTextField && this._emailTextField.blur();
                          this.resetButtonAction();
                        }}
                        value={this.state.email}
                        placeholder="Email Address"
                        keyboardType="email-address"
                        returnKeyType="go"
                        reference={ref => (this._emailTextField = ref)}
                        onChange={this.onTextChange.bind(this)}
                      />

                      <SubmitButton
                        text="Reset Password"
                        onPress={this.resetButtonAction.bind(this)}
                      />
                    </KeyboardAvoidingView>
                  )}
                </View>
              </View>
              <View style={{width: '100%', alignItems: 'center'}}>
                {this.state.isRequestSubmitted && (
                  <View style={{paddingBottom: 40}}>
                    <Text
                      style={{
                        paddingTop: 0,
                        textAlign: 'center',
                        fontWeight: '400',
                        ...fontSize(Size.byWidth(16)),
                      }}>
                      Didn't receive the Email?
                    </Text>
                    <Text
                      style={{
                        color: '#595959',
                        paddingTop: 25,
                        textAlign: 'center',
                        fontWeight: '300',
                        ...fontSize(Size.byWidth(16)),
                      }}>
                      Please check your spam folder, or
                    </Text>
                    <TouchableOpacity
                      style={{paddingTop: 3, paddingBottom: 40}}
                      onPress={this.resetButtonAction.bind(this)}>
                      <Text
                        style={{
                          color: Colors.NewTitleColor,
                          textAlign: 'center',
                          fontWeight: '400',
                          ...fontSize(Size.byWidth(16)),
                        }}>
                        Request to resend email.
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    );
  }

  onTextChange(text: string) {
    this.setState({email: text, error: false, emailError: ''});
  }

  resetButtonAction() {
    if (Utility.isInternetConnected) {
      let email = this.state.email && this.state.email.trim();
      if (email.length == 0) {
        this.setState({
          emailError: {
            error: true,
            text: 'Please enter your Email',
          },
        });
        return;
      } else if (!testEmail(email)) {
        this.setState({
          emailError: {
            error: true,
            text: 'Please enter valid email address',
          },
        });
        return;
      }

      // loaderHandler.showLoader();
      // this.props.forgotPasswordServiceCall({ emailAddress: this.state.email });
      this.FetchLoginInstance([
        {payload: {emailId: this.state.email, details: {type: 'public'}}},
      ]);
      console.log('Call Login service');
    } else {
      No_Internet_Warning();
    }
  }

  callForgetPasswordService = (instances: any) => {
    loaderHandler.showLoader();
    this.props.forgotPasswordServiceCall({
      emailId: this.state.email,
      instances: instances,
    });
  };

  FetchLoginInstance = async (params: any) => {
    try {
      loaderHandler.showLoader();
      let response = await loginInstanceRequest(`${kAdmin}`, params)
        .then((response: Response) => response.json())
        .catch((err: any) => console.log(err));

        console.log("response of instance is: ",JSON.stringify(response))
      if (response.ResponseCode == 200) {
        if (response.Response.length > 1) {
          Actions.push('commonInstanceListsSelection', {
            listAccounts: response.Response,
            title: 'Forgot Password',
            type: ListType.ForgotPassword,
            email: this.state.email.trim(),
            onClick: this.callForgetPasswordService,
          });
          loaderHandler.hideLoader();
        } else {
          this.callForgetPasswordService([response.Response[0].id]);
        }
        // return
        // EventManager.callBack(callBackIdentifier, true, response["ResponseMessage"], nid);
      } else {
        loaderHandler.hideLoader();
        ToastMessage(response.ResponseMessage, Colors.ErrorColor);
        // EventManager.callBack(callBackIdentifier, false, response["ResponseMessage"], nid);
      }
    } catch (err) {
      loaderHandler.hideLoader();
      ToastMessage('Server error', Colors.ErrorColor);
      // EventManager.callBack(callBackIdentifier, false, "Unable to process at this moment, please try again later");
    }
  };

  onDoneButtonAction() {
    Keyboard.dismiss();
    Actions.pop();
  }
}

/**
 * Redux Map State
 * @param state
 */

const mapState = (state: {forgotPassword: ForgotPasswordState}) => ({
  forgotPasswordStatus: state.forgotPassword,
});

/**
 * Redux mao Props
 * @param dispatch
 */
const mapDispatch = (dispatch: Function) => ({
  forgotPasswordServiceCall: (params: object) =>
    dispatch({
      type: ForgotPasswordServiceStatus.RequestStarted,
      payload: params,
    }),
  clean: () => dispatch({type: ForgotPasswordServiceStatus.Ended}),
});

export default connect(mapState, mapDispatch)(ForgotPassword);
