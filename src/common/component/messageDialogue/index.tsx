import React, { Component } from 'react';
import {
  Animated, DeviceEventEmitter, Platform, Text as DefText, TouchableHighlight, View
} from 'react-native';
import { fontFamily, fontSize } from '../../constants';
import Text from '../Text';
import Styles from './styles';
type State = {
  backgroundColor: string;
  message: string;
  // height: Animated.Value;
  showClose: boolean;
};
class MessageDialogue extends Component<{}, State> {
  height = new Animated.Value(0);
  opacity = new Animated.Value(0);
  constructor(props) {
    super(props)
    this.state = {
      backgroundColor: 'black',
      message: '',
      showClose: true,
    };

  }

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
      if ((this.height as any)._value == 0) {
        Animated.parallel([
          Animated.timing(this.height, {
            toValue: 45,
            duration: 0.1,
            useNativeDriver: true,
          }),
          Animated.timing(this.opacity, {
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
      if ((this.height as any)._value == 0) {
        Animated.parallel([
          Animated.timing(this.height, {
            toValue: 45,
            duration: 0.1,
            useNativeDriver: true,
          }),
          Animated.timing(this.opacity, {
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
      Animated.timing(this.height, {
        toValue: 0,
        duration: 0.1,
        useNativeDriver: true,
      }),
      Animated.timing(this.opacity, {
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
        style={[Styles.container, {
          opacity: this.opacity,
          backgroundColor: this.state.backgroundColor,
          height: this.height,
        }]}>
        <View
          style={Styles.messageContainer}>
          <Text
            numberOfLines={2}
            style={Styles.messageTextStyle}>
            {this.state.message}
          </Text>
        </View>
        {this.state.showClose && (
          <View
            style={Styles.closeContainer}>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={this._hide}
              style={Styles.cancleButtonContainer}>
              <View
                style={Styles.imageContainer}>
                <DefText
                  style={[Styles.textStyle, { color: this.state.backgroundColor, }]}>
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
