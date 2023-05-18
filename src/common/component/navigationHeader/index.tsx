import React, { Component } from 'react';
import { View, Platform, ViewStyle } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import * as Constants from '../../constants';
const NavigationHeader = (props: {
  backgroundColor?: string;
  style?: ViewStyle;
  testID?: string;
  removePadding?: boolean;
  children?: any;
}) => {

  return (
    <View
      testID={props.testID}
      style={[
        props.style,
        {
          backgroundColor: props.backgroundColor,
          paddingTop: props.removePadding ? Platform.OS == 'ios'
            ? DeviceInfo.hasNotch() ? 35 : 20 : 0 : 0,
          height: 54 + (props.removePadding ? 0 : Platform.OS == 'ios'
            ? DeviceInfo.hasNotch() ? 37 : 22 : 0),
          flexDirection: 'row',
        },
      ]}>
      {props.children ? props.children : null}
    </View>
  );
}

NavigationHeader.defaultProps = {
  backgroundColor: Constants.Colors.ThemeColor,
  style: {},
  testID: 'header',
};
export default NavigationHeader;