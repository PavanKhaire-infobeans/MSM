import React, { Component } from 'react';
import { Keyboard, Platform, SafeAreaView, StatusBar, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { SubmitButton } from '../../common/component/button';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import Text from '../../common/component/Text';
import { Colors, fontFamily, fontSize, getValue } from '../../common/constants';
import { Account } from '../../common/loginStore';
import Utility from '../../common/utility';
import { backBlkBtn } from '../../images';
import InstanceView from './instanceView';
import { loginDrawerRef } from './prologue';
import Styles from './styles';

export default class UserRegistrationStatus extends Component<{
  userDetails: any;
  isAlreadyRegistered: boolean;
  registeredSuccess: boolean;
  message: string;
}> {
  render() {
    let accData = Account.tempData();
    let name =
      getValue(this.props, [
        'userDetails',
        'personalInfo',
        'field_first_name',
        'value',
      ]) || '';
    return (
      <SafeAreaView
        style={Styles.safeAreaViewContainer}>
        <View style={Styles.regFirstStepContainer}>
          <NavigationHeaderSafeArea
            heading={`Join ${Account.tempData().name}`}
            showCommunity={false}
            cancelAction={() => {
              Keyboard.dismiss();
              Actions.pop();
            }}
            showRightText={false}
            isWhite={true}
            backIcon={backBlkBtn}
          />
          <StatusBar
            barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
            backgroundColor={Colors.NewThemeColor}
          />
          {this.props.isAlreadyRegistered ? (
            <View style={Styles.ScrollViewStyleContainer}>
              <InstanceView
                communityInfo={{
                  instanceURL: accData.instanceURL,
                  instanceImage: accData.instanceImage,
                  name: accData.name,
                }}
                style={Styles.InstanceViewContainer}
              />
              <Text
                style={Styles.helloText}>
                {`Hello ${name}, an account with the email `}
                <Text
                  style={Styles.emailText}>
                  {this.props?.userDetails?.authorizationInfo?.emailAddress}
                </Text>
                {` already exists on ${accData.name}`}
              </Text>
              <Text
                style={Styles.knowpassword}>
                {`If you know your password,\n`}
                <Text
                  style={Styles.loginAccountButton}
                  onPress={() => {
                    loginDrawerRef.refDrawer.expand();
                    Actions.pop();
                  }}>
                  Login to your account
                </Text>
              </Text>
              <Text
                style={Styles.forgotten}>
                {`If you have forgotten your password,\n`}
                <Text
                  style={Styles.loginAccountButton}
                  onPress={() => {
                    Actions.replace('forgotPassword');
                  }}>
                  Reset your password
                </Text>
              </Text>
            </View>
          ) : (
            <View style={{width: 311, alignItems: 'center'}}>
              <Text
                style={Styles.knowpassword}>
                <Text style={Styles.requesSent}>
                  Request Sent
                </Text>
                {`\nThank you for your request to join\n${accData.name}.\n${this.props.message}`}
              </Text>
              <SubmitButton
                text={'Done'}
                onPress={() => {
                  loginDrawerRef.refDrawer.expand();
                  Actions.pop();
                }}
              />
              <Text style={Styles.forgotten}>
                <Text
                  style={Styles.loginAccountButton}
                  onPress={() => {
                    Keyboard.dismiss();
                    Actions.pop();
                  }}>
                  Add another community
                </Text>
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}
