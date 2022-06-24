import React, {Component} from 'react';
import {SafeAreaView, View, StatusBar, Keyboard, Platform} from 'react-native';
import {Account} from '../../common/loginStore';
import InstanceView from './instanceView';
import Text from '../../common/component/Text';
import {Colors, getValue, fontSize} from '../../common/constants';
import {Actions} from 'react-native-router-flux';
import {SubmitButton} from '../../common/component/button';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import {backBlkBtn} from '../../images';
import {loginDrawerRef} from './prologue';
import Utility from '../../common/utility';

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
        style={{flex: 1, backgroundColor: '#fff', alignItems: 'center'}}>
        <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
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
            <View style={{width: 310}}>
              <InstanceView
                communityInfo={{
                  instanceURL: accData.instanceURL,
                  instanceImage: accData.instanceImage,
                  name: accData.name,
                }}
                style={{
                  borderRadius: 5,
                  borderBottomColor: 'rgb(230,230,230)',
                  borderBottomWidth: 2,
                  borderTopColor: 'rgb(230,230,230)',
                  borderTopWidth: 2,
                  marginBottom: 24,
                  marginTop: 32,
                }}
              />
              <Text
                style={{
                  lineHeight: 26,
                  ...fontSize(18),
                  textAlign: 'center',
                  color: '#000000',
                }}>
                {`Hello ${name}, an account with the email `}
                <Text
                  style={{fontWeight: Platform.OS === 'ios' ? '600' : 'bold'}}>
                  {this.props.userDetails.authorizationInfo.emailAddress}
                </Text>
                {` already exists on ${accData.name}`}
              </Text>
              <Text
                style={{
                  lineHeight: 32,
                  ...fontSize(18),
                  textAlign: 'center',
                  color: '#000000',
                  marginTop: 39,
                }}>
                {`If you know your password,\n`}
                <Text
                  style={{
                    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
                    ...fontSize(22),
                    color: Colors.ThemeColor,
                  }}
                  onPress={() => {
                    loginDrawerRef.refDrawer.expand();
                    Actions.pop();
                  }}>
                  Login to your account
                </Text>
              </Text>
              <Text
                style={{
                  lineHeight: 32,
                  ...fontSize(18),
                  textAlign: 'center',
                  color: '#000000',
                  marginTop: 39,
                }}>
                {`If you have forgotten your password,\n`}
                <Text
                  style={{
                    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
                    ...fontSize(22),
                    color: Colors.ThemeColor,
                  }}
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
                style={{
                  lineHeight: 32,
                  ...fontSize(18),
                  textAlign: 'center',
                  color: '#000000',
                  marginTop: 32,
                }}>
                <Text style={{...fontSize(24), lineHeight: 45}}>
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
              <Text
                style={{
                  lineHeight: 32,
                  ...fontSize(18),
                  textAlign: 'center',
                  color: '#000000',
                  marginTop: 39,
                }}>
                <Text
                  style={{
                    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
                    ...fontSize(22),
                    color: Colors.ThemeColor,
                  }}
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
