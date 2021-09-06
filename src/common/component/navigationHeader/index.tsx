import React, {Component} from 'react';
import {View, Platform, ViewStyle} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import * as Constants from '../../constants';
export default class NavigationHeader extends Component<{
  backgroundColor?: string;
  style?: ViewStyle;
  testID?: string;
  removePadding?: boolean;
}> {
  static defaultProps = {
    backgroundColor: Constants.Colors.ThemeColor,
    style: {},
    testID: 'header',
  };

  render() {
    return (
      <View
        testID={this.props.testID}
        style={[
          this.props.style,
          {
            backgroundColor: this.props.backgroundColor,
            paddingTop: this.props.removePadding
              ? Platform.OS == 'ios'
                ? DeviceInfo.hasNotch()
                  ? 35
                  : 20
                : 0
              : 0,
            height:
              54 +
              (this.props.removePadding
                ? 0
                : Platform.OS == 'ios'
                ? DeviceInfo.hasNotch()
                  ? 37
                  : 22
                : 0),
            flexDirection: 'row',
          },
        ]}>
        {this.props.children}
      </View>
    );
  }
}
