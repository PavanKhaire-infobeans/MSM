import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, SafeAreaView, StatusBar, View } from 'react-native';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import { SubmitButton } from '../../common/component/button';
import { KeyboardAwareScrollView } from '../../common/component/keyboardaware-scrollview';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import TextField from '../../common/component/textField';
import { No_Internet_Warning, ToastMessage } from '../../common/component/Toast';
import { Colors } from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import {
  ChangePasswordService,
  kChangePassword,
} from '../changePassword/changePasswordWebService';
import { styles } from './styles';

const ChangePassword = props => {
  const _newPasswordField = useRef();
  const _confirmPasswordField = useRef();
  const navBar = useRef();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState({
    error: false,
    text: '',
  });
  const [newPasswordError, setNewPasswordError] = useState({
    error: false,
    text: '',
  });
  const [confirmPasswordError, setConfirmPasswordError] = useState({
    error: false,
    text: '',
  });

  useEffect(() => {
    // const changePasswordListener = EventManager.addListener(
    //   kChangePassword,
    //   changePasswordResponse,
    // );

    // return () => {
    //   changePasswordListener.removeListener();
    // };
  }, []);

  const changePasswordResponse = (success: boolean, response: any) => {
    if (success) {
      Keyboard.dismiss();
      loaderHandler.hideLoader();
      ToastMessage(response, Colors.ThemeColor);
      props.navigation.goBack();
    } else {
      loaderHandler.hideLoader();
      ToastMessage(response, Colors.ErrorColor);
    }
  };

  /**
   * On Text change event binded to TextFields
   * @param key
   * @param value
   */
  const onTextChange = (key: string, value: string) => {
    switch (key) {
      case 'currentPassword':
        setCurrentPassword(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
    if (
      key == 'currentPassword' &&
      currentPasswordError.error == true &&
      value.length > 0
    ) {
      setCurrentPasswordError({
        error: false,
        text: 'Please enter your current password',
      });
    }
    if (
      key == 'newPassword' &&
      newPasswordError.error == true &&
      value.length > 0
    ) {
      setNewPasswordError({
        error: false,
        text: 'Please enter your new password',
      });
    }
    if (
      key == 'confirmPassword' &&
      confirmPasswordError.error == true &&
      value.length > 0
    ) {
      setConfirmPasswordError({
        error: false,
        text: 'Please enter your confirm password',
      });
    }
  };

  const onClick = () => {
    if (Utility.isInternetConnected) {
      let hasError = false;
      if (
        currentPassword.length == 0 ||
        newPassword.length == 0 ||
        confirmPassword.length == 0
      ) {
        if (currentPassword.length == 0) {
          setCurrentPasswordError({
            error: true,
            text: 'Please enter your current password',
          });
        }
        if (newPassword.length == 0) {
          setNewPasswordError({
            error: true,
            text: 'Please enter your new password',
          });
        }
        if (confirmPassword.length == 0) {
          setConfirmPasswordError({
            error: true,
            text: 'Please enter your confirm password',
          });
        }
        return;
      }
      if (newPassword.trim().length > 5) {
        var rgularExp = {
          containsNumber: /\d+/,
          containsAlphabet: /[a-zA-Z]/,
        };
        if (
          !(
            rgularExp.containsNumber.test(newPassword.trim()) &&
            rgularExp.containsAlphabet.test(newPassword.trim())
          )
        ) {
          hasError = true;
          setNewPasswordError({
            error: true,
            text: 'Password must contain minimum six characters, at least one letter and one number',
          });
        }
      } else {
        hasError = true;
        setNewPasswordError({
          error: true,
          text: 'Password must contain minimum six characters, at least one letter and one number',
        });
      }
      if (newPassword != confirmPassword) {
        hasError = true;
        setConfirmPasswordError({
          error: true,
          text: 'Your Password and Confirm password does not match',
        });
      }
      setTimeout(Keyboard.dismiss);
      if (!hasError) {
        loaderHandler.showLoader();
        ChangePasswordService(currentPassword, confirmPassword,
          response => {
            changePasswordResponse(response.success, response.message)
          });
      }
    } else {
      No_Internet_Warning();
    }
  };

  const cancelAction = () => {
    Keyboard.dismiss();
    props.navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fullFlex} />
      <NavigationHeaderSafeArea
        ref={navBar}
        heading={'Change Password'}
        showCommunity={false}
        cancelAction={cancelAction}
        showRightText={false}
        isWhite={true}
      />
      <StatusBar
        barStyle={
          Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
        }
        backgroundColor={Colors.NewThemeColor}
      />
      <KeyboardAwareScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.scrollViewContainerStyle}>
        <TextField
          passwordToggle={true}
          errorMessage={currentPasswordError.text}
          showError={currentPasswordError.error}
          value={currentPassword}
          placeholder="Current Password"
          secureTextEntry={true}
          onSubmitEditing={() => {
            _newPasswordField.current.focus();
          }}
          blurOnSubmit={false}
          returnKeyType="next"
          onChange={(text: any) => onTextChange('currentPassword', text)}
        />

        <TextField
          passwordToggle={true}
          errorMessage={newPasswordError.text}
          showError={newPasswordError.error}
          value={newPassword}
          placeholder="New Password"
          secureTextEntry={true}
          showStrength={true}
          reference={_newPasswordField}
          onSubmitEditing={() => {
            _confirmPasswordField?.current?.focus();
          }}
          blurOnSubmit={false}
          returnKeyType="next"
          onChange={(text: any) => onTextChange('newPassword', text)}
        />

        <TextField
          passwordToggle={true}
          errorMessage={confirmPasswordError.text}
          showError={confirmPasswordError.error}
          value={confirmPassword}
          placeholder="Confirm Password"
          secureTextEntry={true}
          reference={_confirmPasswordField}
          returnKeyType="go"
          blurOnSubmit={false}
          onChange={(text: any) => onTextChange('confirmPassword', text)}
        />

        <SubmitButton text="Save Password" onPress={onClick} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
