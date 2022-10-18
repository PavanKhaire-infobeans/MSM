import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {SubmitButton} from '../../common/component/button';
import Text from '../../common/component/Text';
import {styles} from './styles';
import {
  ForgotPasswordServiceStatus,
  ForgotPasswordState,
} from './forgotPasswordReducer';

import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import TextField from '../../common/component/textField';
import {No_Internet_Warning, ToastMessage} from '../../common/component/Toast';
import {
  Colors,
  ConsoleType,
  fontSize,
  getValue,
  showConsoleLog,
  Size,
  testEmail,
} from '../../common/constants';
import {Account} from '../../common/loginStore';
import {Props} from '../login/loginController';
//@ts-ignore
import {KeyboardAwareScrollView} from '../../common/component/keyboardaware-scrollview';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import Utility from '../../common/utility';
import {loginInstanceRequest} from '../../common/webservice/loginServices';
import {backBlkBtn} from '../../images';
import {ListType} from '../login/commonInstanceListSelection';
import {kAdmin} from '../registration/getInstancesSaga';
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

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props !== nextProps && nextProps.forgotPasswordStatus.completed) {
      //loaderHandler.hideLoader();
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
          //loaderHandler.hideLoader();
          if (message && message.trim().length != 0) {
            ToastMessage(message, 'black');
          }
          this.setState({isRequestSubmitted: true});
        } else {
          //loaderHandler.hideLoader();
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
            cancelAction={() => this.props.navigation.goBack()}
            showRightText={false}
            isWhite={true}
            backIcon={backBlkBtn}
          />
          <StatusBar
            barStyle={
              Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
            }
            backgroundColor={Colors.NewDarkThemeColor}
          />
          <KeyboardAwareScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={styles.scrollViewStyles}>
            <View style={styles.loginContainer}>
              {/** Commuity banner UI */}
              <View style={styles.communityBanner}>
                <View style={styles.subcommunityBanner}>
                  {/* <View style={styles.communityBanner}>
										<CommunityBanner communityInfo={this.selectedCommunity} />
									</View> */}

                  <Text style={styles.enterEmailText}>
                    {this.state.isRequestSubmitted
                      ? 'You will soon receive an email with the instructions to reset the password.'
                      : `Please enter your email address to reset your password`}
                  </Text>
                </View>
                <View style={styles.subcommunityBanner}>
                  {this.state.isRequestSubmitted ? (
                    <View style={styles.doneContainer}>
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
                        style={styles.textFieldStyle}
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
              <View style={styles.resendContainer}>
                {this.state.isRequestSubmitted && (
                  <View style={styles.resendSubContainer}>
                    <Text style={styles.dintReceivedText}>
                      Didn't receive the Email?
                    </Text>
                    <Text style={styles.spamTextStyle}>
                      Please check your spam folder, or
                    </Text>
                    <TouchableOpacity
                      style={styles.resendButtonStyle}
                      onPress={this.resetButtonAction.bind(this)}>
                      <Text style={styles.resendTextStyle}>
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

      // //loaderHandler.showLoader();
      // this.props.forgotPasswordServiceCall({ emailAddress: this.state.email });
      this.FetchLoginInstance([
        {payload: {emailId: this.state.email, details: {type: 'public'}}},
      ]);
      showConsoleLog(ConsoleType.LOG, 'Call Login service');
    } else {
      No_Internet_Warning();
    }
  }

  callForgetPasswordService = (instances: any) => {
    //loaderHandler.showLoader();
    this.props.forgotPasswordServiceCall({
      emailId: this.state.email,
      instances: instances,
    });
  };

  FetchLoginInstance = async (params: any) => {
    try {
      //loaderHandler.showLoader();
      let response = await loginInstanceRequest(`${kAdmin}`, params)
        .then((response: Response) => response.json())
        .catch((err: any) => showConsoleLog(ConsoleType.LOG, err));

      showConsoleLog(
        ConsoleType.LOG,
        'response of instance is: ',
        JSON.stringify(response),
      );
      if (response.ResponseCode == 200) {
        if (response.Response.length > 1) {
          this.props.navigation.navigate('commonInstanceListsSelection', {
            listAccounts: response.Response,
            title: 'Forgot Password',
            type: ListType.ForgotPassword,
            email: this.state.email.trim(),
            onClick: this.callForgetPasswordService,
          });
          //loaderHandler.hideLoader();
        } else {
          this.callForgetPasswordService([response.Response[0].id]);
        }
        // return
        // EventManager.callBack(callBackIdentifier, true, response["ResponseMessage"], nid);
      } else {
        //loaderHandler.hideLoader();
        ToastMessage(response.ResponseMessage, Colors.ErrorColor);
        // EventManager.callBack(callBackIdentifier, false, response["ResponseMessage"], nid);
      }
    } catch (err) {
      //loaderHandler.hideLoader();
      ToastMessage('Server error', Colors.ErrorColor);
      // EventManager.callBack(callBackIdentifier, false, "Unable to process at this moment, please try again later");
    }
  };

  onDoneButtonAction() {
    Keyboard.dismiss();
    this.props.navigation.goBack();
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
