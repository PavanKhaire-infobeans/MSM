import React from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  StatusBar,
} from 'react-native';
import {SubmitButton} from '../../common/component/button';
import EventManager from '../../common/eventManager';
import {styles} from './styles';
//@ts-ignore
import {KeyboardAwareScrollView} from '../../common/component/keyboardaware-scrollview';
import TextField from '../../common/component/textField';
import {Colors} from '../../common/constants';
import Utility from '../../common/utility';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import {No_Internet_Warning, ToastMessage} from '../../common/component/Toast';
import {
  ChangePasswordService,
  kChangePassword,
} from '../changePassword/changePasswordWebService';
import {Actions} from 'react-native-router-flux';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';

export default class ChangePassword extends React.Component {
  _newPasswordField?: TextInput = null;
  _confirmPasswordField?: TextInput = null;
  changePasswordListener: EventManager;
  navBar: NavigationHeaderSafeArea;
  //User state
  state = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    currentPasswordError: {
      error: false,
      text: '',
    },
    newPasswordError: {
      error: false,
      text: '',
    },
    confirmPasswordError: {
      error: false,
      text: '',
    },
    errorViewHeight: 0,
    errorMessage: '',
  };

  constructor(props: any) {
    super(props);
    this.changePasswordListener = EventManager.addListener(
      kChangePassword,
      this.changePasswordResponse,
    );
  }

  componentDidMount() {}

  updateState(state: object) {
    this.setState(state);
  }

  componentWillUnmount() {
    this.navBar._hide();
  }
  changePasswordResponse(success: boolean, response: any) {
    loaderHandler.hideLoader();
    if (success) {
      ToastMessage(response, Colors.ThemeColor);
      Keyboard.dismiss();
      Actions.pop();
    } else {
      ToastMessage(response, Colors.ErrorColor);
    }
  }
  /**
   * On Text change event binded to TextFields
   * @param key
   * @param value
   */
  onTextChange(key: string, value: string) {
    var state: {[x: string]: any} = {[key]: value};
    if (
      key == 'currentPassword' &&
      this.state.currentPasswordError.error == true &&
      value.length > 0
    ) {
      state = {
        ...state,
        currentPasswordError: {
          error: false,
          text: 'Please enter your current password',
        },
      };
    }
    if (
      key == 'newPassword' &&
      this.state.newPasswordError.error == true &&
      value.length > 0
    ) {
      state = {
        ...state,
        newPasswordError: {
          error: false,
          text: 'Please enter your new password',
        },
      };
    }
    if (
      key == 'confirmPassword' &&
      this.state.confirmPasswordError.error == true &&
      value.length > 0
    ) {
      state = {
        ...state,
        confirmPasswordError: {
          error: false,
          text: 'Please enter your confirm password',
        },
      };
    }
    this.updateState(state);
    this.showErrorMessage(false);
  }

  showErrorMessage = (show: boolean, message?: string) => {
    let height = 0;
    if (show) {
      height = 70;
      this.navBar._showWithOutClose(message, Colors.ErrorColor);
    } else {
      this.navBar._hide();
    }
    this.updateState({errorViewHeight: height});
  };

  onClick() {
    let hasError = false;
    if (Utility.isInternetConnected) {
      const {currentPassword, newPassword, confirmPassword} = this.state;
      let hasError = false;
      if (
        currentPassword.length == 0 ||
        newPassword.length == 0 ||
        confirmPassword.length == 0
      ) {
        var state = {};
        if (currentPassword.length == 0) {
          state = {
            ...state,
            currentPasswordError: {
              error: true,
              text: 'Please enter your current password',
            },
          };
        }
        if (newPassword.length == 0) {
          state = {
            ...state,
            newPasswordError: {
              error: true,
              text: 'Please enter your new password',
            },
          };
        }
        if (confirmPassword.length == 0) {
          state = {
            ...state,
            confirmPasswordError: {
              error: true,
              text: 'Please enter your confirm password',
            },
          };
        }
        this.updateState(state);
        return;
      }
      // ToastMessage(""+/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]$/.test(newPassword), Colors.ErrorColor)
      if (newPassword.trim().length > 5) {
        var rgularExp = {
          containsNumber: /\d+/,
          containsAlphabet: /[a-zA-Z]/,
        };
        // ToastMessage("Contains numbers : " + rgularExp.containsNumber.test(newPassword.trim() +
        // 			 " Contains alphabets : " + rgularExp.containsAlphabet.test(newPassword.trim())))
        if (
          !(
            rgularExp.containsNumber.test(newPassword.trim()) &&
            rgularExp.containsAlphabet.test(newPassword.trim())
          )
        ) {
          state = {
            ...state,
            newPasswordError: {
              error: true,
              text: 'Password must contain minimum six characters, at least one letter and one number',
            },
          };
          hasError = true;
          this.updateState(state);
        }
      } else {
        state = {
          ...state,
          newPasswordError: {
            error: true,
            text: 'Password must contain minimum six characters, at least one letter and one number',
          },
        };
        hasError = true;
        this.updateState(state);
      }
      if (newPassword != confirmPassword) {
        state = {
          ...state,
          confirmPasswordError: {
            error: true,
            text: 'Your Password and Confirm password does not match',
          },
        };
        hasError = true;
        this.updateState(state);
      }
      setTimeout(Keyboard.dismiss);
      if (!hasError) {
        loaderHandler.showLoader();
        ChangePasswordService(currentPassword, confirmPassword);
      }
    } else {
      No_Internet_Warning();
    }
  }
  cancelAction = () => {
    Keyboard.dismiss();
    Actions.pop();
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.fullFlex}></View>
        <NavigationHeaderSafeArea
          ref={ref => (this.navBar = ref)}
          heading={'Change Password'}
          showCommunity={false}
          cancelAction={this.cancelAction}
          showRightText={false}
          isWhite={true}
        />
        <StatusBar
          barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
          backgroundColor={Colors.NewThemeColor}
        />
        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={styles.scrollViewContainerStyle}>
          <TextField
            passwordToggle={true}
            errorMessage={this.state.currentPasswordError.text}
            showError={this.state.currentPasswordError.error}
            value={this.state.currentPassword}
            placeholder="Current Password"
            secureTextEntry={true}
            onSubmitEditing={() => {
              this._newPasswordField && this._newPasswordField.focus();
            }}
            returnKeyType="next"
            onChange={(text: any) => this.onTextChange('currentPassword', text)}
          />

          <TextField
            passwordToggle={true}
            errorMessage={this.state.newPasswordError.text}
            showError={this.state.newPasswordError.error}
            value={this.state.newPassword}
            placeholder="New Password"
            secureTextEntry={true}
            showStrength={true}
            reference={ref => (this._newPasswordField = ref)}
            onSubmitEditing={() => {
              this._confirmPasswordField && this._confirmPasswordField.focus();
            }}
            returnKeyType="next"
            onChange={(text: any) => this.onTextChange('newPassword', text)}
          />

          <TextField
            passwordToggle={true}
            errorMessage={this.state.confirmPasswordError.text}
            showError={this.state.confirmPasswordError.error}
            value={this.state.confirmPassword}
            placeholder="Confirm Password"
            secureTextEntry={true}
            reference={ref => (this._confirmPasswordField = ref)}
            returnKeyType="go"
            onChange={(text: any) => this.onTextChange('confirmPassword', text)}
          />

          <SubmitButton
            text="Save Password"
            onPress={this.onClick.bind(this)}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}
