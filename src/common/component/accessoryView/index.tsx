import React, {Component, useEffect} from 'react';
import {
  Animated,
  EventSubscription,
  Keyboard,
  Platform,
  ViewStyle,
  Easing,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const AccessoryView = (props: any)=>{
  let state = {
    bottom: new Animated.Value(0),
  };

  let showSubscription: EventSubscription = null;
  let hideSubscription: EventSubscription = null;

  useEffect(()=>{
    showSubscription = Keyboard.addListener(
      'keyboardWillShow',
      _onShow,
    );
    hideSubscription = Keyboard.addListener(
      'keyboardWillHide',
      _onHide,
    );

      return ()=>{
        showSubscription.remove();
        hideSubscription.remove();
      }

  },[]);

  const _onShow = (event: {
    endCoordinates: {
      height: number;
      width: number;
      screenX: number;
      screenY: number;
    };
  }) => {
    Animated.timing(state.bottom, {
      toValue:
        event.endCoordinates.height -
        (Platform.OS == 'ios' && DeviceInfo.hasNotch() ? 35 : 0),
      duration: 450,
      easing: Easing.out(Easing.cubic),
    }).start();
  };

  const _onHide = () => {
    Animated.timing(state.bottom, {
      toValue: 0,
      duration: 0,
    }).start();
  };

    return (
      <Animated.View
        style={[
          {position: 'absolute', bottom: state.bottom},
          props.style,
        ]}>
        {props.children}
      </Animated.View>
    );
}

export default AccessoryView;