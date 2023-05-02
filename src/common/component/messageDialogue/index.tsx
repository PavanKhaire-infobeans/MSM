import React, { Component, useEffect, useRef, useState } from 'react';
import {
  Animated, DeviceEventEmitter, Platform, Text as DefText, TouchableHighlight, View
} from 'react-native';
import { fontFamily, fontSize } from '../../constants';
import Text from '../Text';
import Styles from './styles';
type State = {
  backgroundColor: string;
  message: string;
  height: number;
  showClose: boolean;
};
const MessageDialogue = (props) => {
  const height = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const [state, setState] = useState({
    backgroundColor: 'black',
    message: '',
    showClose: true,
    height: 0
  });

  useEffect(() => {
    let showListener = DeviceEventEmitter.addListener(
      'showMessage',
      _show,
    );
    let hideListener = DeviceEventEmitter.addListener(
      'hideMessage',
      _hide,
    );
    let showListenerWithoutClose = DeviceEventEmitter.addListener(
      'showListenerWithoutClose',
      _showWithOutClose,
    );

    return () => {
      DeviceEventEmitter.removeAllListeners("showMessage")
      DeviceEventEmitter.removeAllListeners("hideMessage")
      DeviceEventEmitter.removeAllListeners("showListenerWithoutClose")
    }
  }, []);

  const _showWithOutClose = ({ message, color }: { message: string; color: string }) => {
    setState({ ...state, showClose: false, backgroundColor: color, message, height: 45 });
    setTimeout(() => {
      if ((height as any)._value == 0) {
        Animated.parallel([
          Animated.timing(height, {
            toValue: 45,
            duration: 1,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, 100);
  };

  const _show = ({ message, color }: { message: string; color: string }) => {
    setState({ ...state, backgroundColor: color, message, height: 45 })
    setTimeout(() => {
      if ((height as any)._value == 0) {
        Animated.parallel([
          Animated.timing(height, {
            toValue: 45,
            duration: 0.1,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 0.1,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, 100);
  };

  const _hide = () => {
    Animated.parallel([
      Animated.timing(height, {
        toValue: 0,
        duration: 0.1,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 0.1,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setState({ showClose: true, message: '', backgroundColor: 'black', height: 0 });
    });
  };

  const No_Internet = () => { };

  const showToast = () => { };

  return (
    <>
      {
        (state.message != undefined && state.message.length == 0) ?
          <View style={{ height: 0, width: 0, position: 'absolute' }} />
          :
          <Animated.View
            style={[Styles.container, {
              // opacity: opacity,
              backgroundColor: state.backgroundColor,
              height: state.height//height,
            }]}>
            <View
              style={Styles.messageContainer}>
              <Text
                numberOfLines={2}
                style={Styles.messageTextStyle}>
                {state.message}
              </Text>
            </View>
            {state.showClose && (
              <View
                style={Styles.closeContainer}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={_hide}
                  style={Styles.cancleButtonContainer}>
                  <View
                    style={Styles.imageContainer}>
                    <DefText
                      style={[Styles.textStyle, { color: state.backgroundColor, }]}>
                      ✕
                    </DefText>
                  </View>
                </TouchableHighlight>
              </View>
            )}
          </Animated.View>
      }
    </>
  );
};

MessageDialogue.showMessage = (message: string, color: string) => {
  DeviceEventEmitter.emit('showMessage', { message, color });
};
MessageDialogue.showMessageWithoutClose = (message: string, color: string) => {
  DeviceEventEmitter.emit('showListenerWithoutClose', { message, color });
};
MessageDialogue.hideMessage = () => {
  DeviceEventEmitter.emit('hideMessage');
};
export default MessageDialogue;
