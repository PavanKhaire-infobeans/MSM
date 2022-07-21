import React, { Component } from 'react';
import {
  View,
  Animated,
  TouchableHighlight,
  Text as DefText,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import Text from '../Text';
import DeviceInfo from 'react-native-device-info';
import { fontFamily, fontSize } from '../../constants';
type State = {
  backgroundColor: string;
  message: string;
  height: Animated.Value;
  showClose: boolean;
};
class MessageDialogue extends Component<{}, State> {
  state = {
    backgroundColor: 'black',
    message: '',
    height: new Animated.Value(0),
    opacity: new Animated.Value(0),
    showClose: true,
  };

  static showMessage = (message: string, color: string) => {
    DeviceEventEmitter.emit('showMessage', { message, color });
  };

  static showMessageWithoutClose = (message: string, color: string) => {
    DeviceEventEmitter.emit('showListenerWithoutClose', { message, color });
  };

  static hideMessage = () => {
    DeviceEventEmitter.emit('hideMessage');
  };

  showListener?: any = null;
  hideListener?: any = null;
  showListenerWithoutClose?: any = null;
  UNSAFE_componentWillMount() {
    //  componentWillMount() {
    this.showListener = DeviceEventEmitter.addListener(
      'showMessage',
      this._show,
    );
    this.hideListener = DeviceEventEmitter.addListener(
      'hideMessage',
      this._hide,
    );
    this.showListenerWithoutClose = DeviceEventEmitter.addListener(
      'showListenerWithoutClose',
      this._showWithOutClose,
    );
  }

  _showWithOutClose = ({ message, color }: { message: string; color: string }) => {
    this.setState({ showClose: false, backgroundColor: color, message }, () => {
      if ((this.state.height as any)._value == 0) {
        Animated.parallel([
          Animated.timing(this.state.height, {
            toValue: 45,
            duration: 0.1,
            useNativeDriver: true,
          }),
          Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 0.1,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  };

  _show = ({ message, color }: { message: string; color: string }) => {
    this.setState({ backgroundColor: color, message }, () => {
      if ((this.state.height as any)._value == 0) {
        Animated.parallel([
          Animated.timing(this.state.height, {
            toValue: 45,
            duration: 0.1,
            useNativeDriver: true,
          }),
          Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 0.1,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  };

  _hide = () => {
    Animated.parallel([
      Animated.timing(this.state.height, {
        toValue: 0,
        duration: 0.1,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: 0.1,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({ showClose: true, message: '', backgroundColor: 'black' });
    });
  };

  No_Internet = () => { };

  showToast = () => { };

  render() {
    if (this.state.message != undefined && this.state.message.length == 0) {
      return <View style={{ height: 0, width: 0, position: 'absolute' }} />;
    }
    return (
      <Animated.View
        style={{
          zIndex: 3,
          elevation: 3,
          opacity: this.state.opacity,
          left: 0,
          right: 0,
          backgroundColor: this.state.backgroundColor,
          maxHeight: 45,
          height: this.state.height,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            flex: 1,
            height: '100%',
            justifyContent: 'center',
            paddingLeft: 10,
          }}>
          <Text
            numberOfLines={2}
            style={{
              ...fontSize(14),
              lineHeight: 16,
              textAlign: 'left',
              color: '#fff',
              paddingBottom: 5,
              paddingTop: 5,
            }}>
            {this.state.message}
          </Text>
        </View>
        {this.state.showClose && (
          <View
            style={{
              width: 70,
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 1,
            }}>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={this._hide}
              style={{
                width: 44,
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <DefText
                  style={{
                    color: this.state.backgroundColor,
                    ...fontSize(16),
                    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                  }}>
                  ✕
                </DefText>
              </View>
            </TouchableHighlight>
          </View>
        )}
      </Animated.View>
    );
  }
}

export default MessageDialogue;
