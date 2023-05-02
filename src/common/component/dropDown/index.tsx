import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, TouchableHighlight, View } from 'react-native';
import { Colors } from '../../constants';
import Text from '../Text';
import styles from './styles';
import { Props, State } from './types';

const kTop = 19,
  kTopAnimated = 5;
const kPlaceHolderFontSize = 18;

const DropDownSelector = (props: Props) => {
  const val = props.value || '';
  const sizeFnt = useRef(new Animated.Value(val.length > 0 ? 13 : kPlaceHolderFontSize)).current;
  const top = useRef(new Animated.Value(val.length > 0 ? kTopAnimated : kTop)).current;
  const height = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const [state, setState] = useState({
    animatedViewHeight: Platform.OS === 'ios' ? 16 : 26,
    showClearImage: false,
    text: '',
    numericValue: 0,
  });

  useEffect(() => {
    // if ( props.showError ) {
    Animated.parallel([
      Animated.timing(height, {
        toValue: 56,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: props.showError ? 1 : 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    // }
  }, [props.showError])

  useEffect(() => {
    if (props.value) {
      Animated.parallel([
        Animated.timing(sizeFnt, {
          toValue: 13,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(top, {
          toValue: kTopAnimated,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      setState({
        ...state,
        // sizeFnt: new Animated.Value(props.value.length > 0 ? 13 : kPlaceHolderFontSize),
        // top: new Animated.Value(props.value.length > 0 ? kTopAnimated : kTop),
      })
    }
    else {
      Animated.parallel([
        Animated.timing(sizeFnt, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(top, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [props.value])

  const showPicker = () => {
    props.onOptionSelected && props.onOptionSelected();
  };

  let selectedValue = props.selectedValue || '';

  return (
    <View style={[props.style, { flexDirection: 'column' }]}>
      <View style={styles.textContainer}>
        <TouchableHighlight
          underlayColor="#cccccc3e"
          onPress={showPicker}>
          <Animated.View
            style={[
              styles.innerView,
              {
                backgroundColor: props.isCuebackRegistration
                  ? '#fff'
                  : Colors.unSelectedFilterbg,
                height: 100,//height,
                borderColor: props.showError
                  ? Colors.NewRadColor
                  : props.isCuebackRegistration
                    ? Colors.TextColor
                    : 'transparent',
              },
            ]}>
            <View
              style={[
                props.inputViewStyle,
                styles.animatedtextContainer,
              ]}>
              <Animated.Text
                style={[
                  styles.animatedtextStyle,
                  {
                    color: props.isCuebackRegistration
                      ? Colors.TextColor
                      : selectedValue.length > 0
                        ? Colors.TextColor
                        : props.placeholderTextColor,
                    opacity: props.isCuebackRegistration ? 0.6 : 1,
                  },
                ]}>
                {props.placeholderText}

                {props.isRequired ? (
                  <Animated.Text style={{ color: Colors.NewRadColor }}>
                    {' *'}
                  </Animated.Text>
                ) : null}
              </Animated.Text>
              <Text
                style={[
                  styles.starStyle,
                  {
                    color: props.isCuebackRegistration
                      ? Colors.TextColor
                      : Colors.TextColor,
                  },
                ]}>
                {selectedValue}
              </Text>
            </View>
            {/* <View
                style={{
                  position: 'absolute',
                  right: 15,
                  alignSelf: 'center',
                  height: 5,
                  width: 10,
                  borderTopWidth: 5,
                  borderBottomWidth: 0,
                  borderRightWidth: 5,
                  borderLeftWidth: 5,
                  borderColor: 'transparent',
                  borderTopColor: props.isCuebackRegistration
                    ? Colors.TextColor
                    : 'rgba(0, 0, 0, 0.54)',
                }}
              /> */}
          </Animated.View>
        </TouchableHighlight>
      </View>
      <Animated.View
        style={[
          styles.errorMessageContainer,
          {
            height: props.animatedViewHeight,
            opacity: opacity,
          },
        ]}>
        <View style={styles.minWidth}>
          <Text style={styles.errorTextStyle}>
            {`*${props.errorMessage}`}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

DropDownSelector.defaultProps = {
  placeholderText: '',
  placeholderTextColor: 'gray',
  errorMessage: '',
  showError: false,
  value: '',
  onOptionSelected: () => { },
  viewID: 0,
  isRequired: false,
  inputViewStyle: styles.inputViewStyle,
  inputTextStyle: styles.inputTextStyle,
  isCuebackRegistration: false,
};
export default DropDownSelector;