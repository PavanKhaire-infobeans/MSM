import React, { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { SubmitButton } from '../../common/component/button';
import Text from '../../common/component/Text';
import { styles } from './styles';
import {
  ForgotPasswordServiceStatus,
  ForgotPasswordState,
} from './forgotPasswordReducer';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import TextField from '../../common/component/textField';
import { No_Internet_Warning, ToastMessage } from '../../common/component/Toast';
import {
  Colors,
  CommonTextStyles,
  ConsoleType,
  fontSize,
  getValue,
  showConsoleLog,
  Size,
  testEmail,
} from '../../common/constants';
import { Account } from '../../common/loginStore';
import { Props } from '../login/loginController';
//@ts-ignore
import { KeyboardAwareScrollView } from '../../common/component/keyboardaware-scrollview';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import Utility from '../../common/utility';
import { loginInstanceRequest } from '../../common/webservice/loginServices';
import { backBlkBtn } from '../../images';
import { ListType } from '../login/commonInstanceListSelection';
import { kAdmin } from '../registration/getInstancesSaga';
import BusyIndicator from '../../common/component/busyindicator';
import MessageDialogue from '../../common/component/messageDialogue';
import { useKeyboard } from '../../common/component/useKeyboard';
import { arrowRightCircle, send } from '../../../app/images';
//Login Component
const ForgotPassword = (props: Props) => {
  //Password Field Reference
  let _emailTextField = null;
  let messageRef: any = null;
  //User state
  const [state, setState] = useState({
    email: '',
    emailError: {
      error: false,
      text: '',
    },
    isRequestSubmitted: false,
    showLoaderValue: false,
    loaderTextValue: 'Loading...'
  });

  const keyboardHeight = useKeyboard();

  let selectedCommunity: Account = new Account();

  selectedCommunity.values = Account.tempData();

  useEffect(() => {
    if (props?.forgotPasswordStatus?.completed) {
      props?.clean();

      if (props.forgotPasswordStatus.success) {
        let message: string = getValue(props, [
          'forgotPasswordStatus',
          'data',
          'ResponseMessage',
        ]);
        let code: number = getValue(props, [
          'forgotPasswordStatus',
          'data',
          'ResponseCode',
        ]);

        if (code == 200) {
          //loaderHandler.hideLoader();
          if (message && message.trim().length != 0) {
            //ToastMessage(message, 'black');
          }
          setState(prevState => ({
            ...prevState,
            isRequestSubmitted: true,
            showLoaderValue:false
          }));
        } else {
          //loaderHandler.hideLoader();
          if (message && message.trim().length != 0) {
            //ToastMessage(message, Colors.ErrorColor);
          }
          setState(prevState => ({
            ...prevState,
            isRequestSubmitted: false,
            showLoaderValue:false
          }));

        }
      }
    }
  }, [props.forgotPasswordStatus])

  const onTextChange = (text: string) => {
    setState(prevState => ({
      ...prevState,
      email: text,
      error: false,
      emailError: ''
    }));
  }

  const resetButtonAction = () => {
    if (Utility.isInternetConnected) {
      let email = state.email && state.email.trim();
      if (email.length == 0) {
        setState(prevState => ({
          ...prevState,
          emailError: {
            error: true,
            text: 'Please enter your Email',
          },
        }));
        return;
      } else if (!testEmail(email)) {
        setState(prevState => ({
          ...prevState,
          emailError: {
            error: true,
            text: 'Please enter valid email address',
          },
        }));
        return;
      }
      setState(prevState => ({
        ...prevState,
        showLoaderValue: true
      }));
      FetchLoginInstance([
        { payload: { emailId: state.email, details: { type: 'public' } } },
      ]);
    } else {
      No_Internet_Warning();
    }
  }

  const callForgetPasswordService = (instances: any) => {
    //loaderHandler.showLoader();
    props.forgotPasswordServiceCall({
      emailId: state.email,
      instances: instances,
    });
  };

  const FetchLoginInstance = async (params: any) => {
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
          props.navigation.navigate('commonInstanceListsSelection', {
            listAccounts: response.Response,
            title: 'Forgot Password',
            type: ListType.ForgotPassword,
            email: state.email.trim(),
            onClick: callForgetPasswordService,
          });
          //loaderHandler.hideLoader();
        } else {
          callForgetPasswordService([response.Response[0].id]);
        }
        // return
        // EventManager.callBack(callBackIdentifier, true, response["ResponseMessage"], nid);
      } else {
        //loaderHandler.hideLoader();
        //ToastMessage(response.ResponseMessage, Colors.ErrorColor);
        // EventManager.callBack(callBackIdentifier, false, response["ResponseMessage"], nid);
      }
    } catch (err) {
      //loaderHandler.hideLoader();
      //ToastMessage('Server error', Colors.ErrorColor);
      // EventManager.callBack(callBackIdentifier, false, "Unable to process at this moment, please try again later");
    }
  };

  const onDoneButtonAction = () => {
    Keyboard.dismiss();
    props.navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* <NavigationHeaderSafeArea
            heading={'Forgot Password'}
            showCommunity={false}
            cancelAction={() => props.navigation.goBack()}
            showRightText={false}
            isWhite={true}
            backIcon={backBlkBtn}
          /> */}
        {
          state.showLoaderValue ?
            <BusyIndicator startVisible={state.showLoaderValue} text={state.loaderTextValue != '' ? state.loaderTextValue : 'Loading...'} overlayColor={Colors.ThemeColor} />
            :
            null
        }
        <MessageDialogue
          ref={(ref: any) => (messageRef = ref)}
        />

        <StatusBar
          barStyle={
            Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
          }
          backgroundColor={Colors.NewDarkThemeColor}
        />
        <View style={styles.LoginHeader}>
          <Text style={styles.hederText}>Password Recovery</Text>
        </View>

        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='always'
          // contentContainerStyle={styles.scrollViewStyles}
          style={styles.scrollViewStyles}>
          <View style={styles.loginContainer}>
            {/** Commuity banner UI */}
            <View style={styles.communityBanner}>
              <View style={styles.subcommunityBanner}>
                {/* <View style={styles.communityBanner}>
										<CommunityBanner communityInfo={selectedCommunity} />
									</View> */}

                <Text style={styles.enterEmailText}>
                  {state.isRequestSubmitted
                    ? ('Check your inbox for an email from:')
                    : `If you’ve lost your password or wish to reset it, enter the email address associated with your account.`}
                  <Text style={{ fontWeight: 'bold' }}>
                    {state.isRequestSubmitted
                      ? ('support@mystoriesmatter.com')
                      : ``}

                  </Text>
                </Text>
              </View>
              <View style={styles.subcommunityBanner}>
                {
                  // state.isRequestSubmitted ? (
                  //   <View style={styles.doneContainer}>
                  //     {/* <SubmitButton
                  //       text="Done"
                  //       onPress={onDoneButtonAction.bind(this)}
                  //     /> */}
                  //     <TouchableHighlight
                  //       underlayColor={'#ffffff00'}
                  //       onPress={resetButtonAction}>
                  //       <View
                  //         style={[
                  //           styles.loginSSOButtonStyle,
                  //           { backgroundColor: Colors.bordercolor },
                  //         ]}>
                  //         {
                  //             <>
                  //               <Image style={{ transform: [{ rotate: '180deg' }] }} source={arrowRightCircle} />
                  //               <Text
                  //                 style={[
                  //                   CommonTextStyles.fontWeight400Size19Inter,
                  //                   styles.ssoTextStyle,
                  //                   { color: Colors.white },
                  //                 ]}>
                  //                 Retutn to login
                  //               </Text>
                  //             </>
                  //         }

                  //       </View>
                  //     </TouchableHighlight>
                  //   </View>
                  // ) : 
                  (
                    <KeyboardAvoidingView
                      style={[styles.keyboardAvoiding, {
                        // paddingBottom: keyboardHeight + 56
                      }]}
                      // behavior="padding"
                      >
                      {
                        state.isRequestSubmitted ?
                          <View style={{ height: 100 }} />
                          :
                          <View>
                            <Text
                              style={[
                                CommonTextStyles.fontWeight500Size13Inter,
                                styles.labelStyle,
                              ]}>
                              EMAIL
                            </Text>
                            <TextField
                              style={styles.textFieldStyle}
                              errorMessage={state.emailError.text}
                              showError={state.emailError.error}
                              onSubmitEditing={() => {
                                _emailTextField && _emailTextField.blur();
                                resetButtonAction();
                              }}
                              value={state.email}
                              placeholder="Enter email..."
                              keyboardType="email-address"
                              returnKeyType="go"
                              reference={ref => (_emailTextField = ref)}
                              onChange={onTextChange}
                            />
                          </View>
                      }

                      {/* <SubmitButton
                      text="Reset Password"
                      onPress={resetButtonAction}
                    /> */}
                      <TouchableHighlight
                        underlayColor={'#ffffff00'}
                        onPress={state.isRequestSubmitted ? onDoneButtonAction : resetButtonAction}>
                        <View
                          style={[
                            styles.loginSSOButtonStyle,
                            { backgroundColor: Colors.bordercolor },
                          ]}>
                          {
                            !state.isRequestSubmitted ?
                              <>
                                <Text
                                  style={[
                                    CommonTextStyles.fontWeight400Size19Inter,
                                    styles.ssoTextStyle,
                                    { color: Colors.white },
                                  ]}>
                                  Send email
                                </Text>
                                <Image source={send} />
                              </>
                              :
                              <>
                                <Image style={{ transform: [{ rotate: '180deg' }] }} source={arrowRightCircle} />
                                <Text
                                  style={[
                                    CommonTextStyles.fontWeight400Size19Inter,
                                    styles.ssoTextStyle,
                                    { color: Colors.white },
                                  ]}>
                                  Retutn to login
                                </Text>
                              </>
                          }

                        </View>
                      </TouchableHighlight>
                      {keyboardHeight ?
                        <View style={{ height: 72 + (StaticSafeAreaInsets.safeAreaInsetsBottom ? StaticSafeAreaInsets.safeAreaInsetsBottom : 0) }} />
                        :
                        null
                      }

                    </KeyboardAvoidingView>
                  )}
              </View>
            </View>
            {/* <View style={styles.resendContainer}>
                {state.isRequestSubmitted && (
                  <View style={styles.resendSubContainer}>
                    <Text style={styles.dintReceivedText}>
                      Didn't receive the Email?
                    </Text>
                    <Text style={styles.spamTextStyle}>
                      Please check your spam folder, or
                    </Text>
                    <TouchableOpacity
                      style={styles.resendButtonStyle}
                      onPress={resetButtonAction.bind(this)}>
                      <Text style={styles.resendTextStyle}>
                        Request to resend email.
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View> */}
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );

}

/**
 * Redux Map State
 * @param state
 */

const mapState = (state: { forgotPassword: ForgotPasswordState }) => ({
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
  clean: () => dispatch({ type: ForgotPasswordServiceStatus.Ended }),
});

export default connect(mapState, mapDispatch)(ForgotPassword);
