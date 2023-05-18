import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { eye, eyeoff } from '../../../../app/images';
import { Colors } from '../../constants';
import Text from '../Text';
import { styles } from './styles';
import { Props, State } from './types';

const kTop = 19,
  kTopAnimated = 5;
const kPlaceHolderFontSize = 18;
enum PasswordStrength {
  weak = 'Weak',
  medium = 'Medium',
  strong = 'Strong',
}

export const rgularExp: any = {
  containsNumber: /\d+/,
  containsSmallLetters: /[a-z]/,
  containsCapitalLetters: /[A-Z]/,
  containsSpecialCharacters: /[!@#$%^&*(),.?":{}|<>]/,
};
const TextField = (props: Props) => {
  let val = props.value || '';
  let isBlurred = true;
  let ref = useRef(null);
  const sizeFnt = useRef(new Animated.Value(val.length > 0 ? 13 : kPlaceHolderFontSize)).current;
  const top = useRef(new Animated.Value(val.length > 0 ? kTopAnimated : kTop)).current;
  const height = useRef(new Animated.Value(56)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [state, setState] = useState({
    leftTextInput: Platform.OS === 'ios' ? 0 : -5,
    animatedViewHeight: Platform.OS === 'ios' ? 16 : 26,
    showClearImage: false,
    text: '',
    showPassword: props.passwordToggle ? true : false,
    numericValue: 0,
    passwordStrength: PasswordStrength.weak,
    showPasswordStrength: false,
    inputFocused: false,
    value: '',
  })

  const onBlur = () => {
    setState(
      {
        ...state,
        showClearImage: false,
        inputFocused: false,
      })

    isBlurred = true;
    if (props.value && props.value.length == 0) {
      Animated.parallel([
        Animated.timing(sizeFnt, {
          toValue: kPlaceHolderFontSize,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(top, {
          toValue: props.inputFieldForPayment ? kTopAnimated : kTop,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }

  };

  const onFocus = () => {
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
    isBlurred = false;
    setState({
      ...state,
      inputFocused: true,
      showClearImage: (props.value && props.value.length != 0) ? true : false,
    })
    if (props.onFocus) {
      props.onFocus()
    }
  };

  const onTextChange = (text: any) => {
    if (
      props.showStrength &&
      text.trim().length > 0 &&
      !state.showPasswordStrength
    ) {
      setState({ ...state, showPasswordStrength: true });
    } else if (props.showStrength && text.trim().length == 0) {
      setState({ ...state, showPasswordStrength: false });
    }

    // if (props.showStrength) {
    //   let count = 0;
    //   rgularExp.containsNumber.test(text.trim()) ? count++ : count;
    //   rgularExp.containsSmallLetters.test(text.trim()) ? count++ : count;
    //   rgularExp.containsCapitalLetters.test(text.trim()) ? count++ : count;
    //   // rgularExp.containsSpecialCharacters.test(text.trim()) ?  count++ : count;
    //   setState({ ...state,passwordStrength: count });
    // }

    setState({
      ...state,
      value: text,
    });
    props.onChange && props.onChange(text);

  };

  useEffect(() => {
    if (props.showError) {
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
    }
    if (props.supportAutoFocus) {
      onFocus();
    }
    setState({
      ...state,
      showClearImage: isBlurred ? false : (props.value && props.value.length != 0) ? true : false,
    });
  }, [props])


  let { value } = state;
  if (state.showPassword) {
    value = value; //.replace(/./g, "*");
  }
  let defaultValue = props.value;
  if (defaultValue) {
    value = props.value ? props.value : ''; //.replace(/./g, "*")
  }
  return (
    <>
      <View style={[props.style, styles.container]}>
        <View style={[styles.subContainer]}>
          {/* <Animated.View
            style={[{
              height: state.height,
              backgroundColor: props.isCuebackRegistration ? Colors.white : Colors.NewLightCommentHeader,
              borderColor: props.showError ? 'red' : props.isCuebackRegistration ? Colors.TextColor : 'transparent',
            }, styles.animatedView]}> */}

          <View
            style={[
              props.inputViewStyle,
              state.inputFocused
                ? styles.onFocusStyle
                : // props.secureTextEntry ? { width: '90%' } :
                {},
            ]}>
            {/* <Animated.Text
                style={[{
                  color: props.isCuebackRegistration ? Colors.TextColor : !isBlurred || props.value.length > 0
                    ? Colors.NewTitleColor : props.placeholderTextColor,
                  top: state.top,
                  ...fontSize(state.sizeFnt),
                  opacity: props.isCuebackRegistration ? 0.6 : 1,
                }, styles.animatedTextStyle]}>
                {props.placeholder}
                {props.isRequired ? (
                  <Animated.Text style={{ color: Colors.NewRadColor }}>
                    {' *'}
                  </Animated.Text>
                ) : null}
              </Animated.Text> */}
            {
              // state.showPassword && props.secureTextEntry ?
              <View
                style={[
                  props.inputTextStyle,
                  styles.textInputStyle,
                  styles.textwrapStyle,
                  {
                    left: state.leftTextInput,
                  },
                ]}>
                <TextInput
                  returnKeyType={props.returnKeyType}
                  keyboardType={
                    props.keyboardType == 'numeric'
                      ? 'numeric'
                      : props.keyboardType == 'number-pad'
                        ? 'number-pad'
                        : props.keyboardType == 'email-address'
                          ? 'email-address'
                          : props.keyboardType == 'phone-pad'
                            ? 'phone-pad'
                            : 'ascii-capable'
                  }
                  placeholderTextColor={Colors.newTextColor}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  placeholder={props.placeholder}
                  onSubmitEditing={props.onSubmitEditing}
                  blurOnSubmit={props.blurOnSubmit}
                  maxLength={props.maxLength}
                  secureTextEntry={
                    state.showPassword ? props.secureTextEntry : false
                  }
                  // onChangeText={text => {
                  //   const lastDigit = text[text.length - 1];
                  //   setState({
                  //     nameInput: state.nameInput.concat( '*'),
                  //   });
                  // }}
                  //   onKeyPress={({ nativeEvent }) => {
                  //     alert(nativeEvent.key)
                  //     // nativeEvent.key in KeyCodes ? setState({ nameInput: KeyCodes.q }) : null
                  // }}
                  onChangeText={(text: any) => onTextChange(text)}
                  style={[
                    props.inputTextStyle,
                    {
                      left: state.leftTextInput,
                    },
                    styles.textInputStyle,
                  ]}
                  numberOfLines={1}
                  onFocus={onFocus}
                  multiline={false}
                  // value={state.nameInput}
                  defaultValue={defaultValue}
                  clearButtonMode={props.clearButtonMode}
                  selectionColor={Colors.darkGray}
                  spellCheck={false}
                  onEndEditing={props.onEndEditing}
                  underlineColorAndroid={Colors.transparent}
                  onBlur={onBlur}
                  // onBlur={onBlur ? onBlur : undefined}
                  ref={props.reference ? props.reference : undefined}
                  autoFocus={props.autoFocus}
                />
                {/* <Animated.Text style={{ color: Colors.black, ...fontSize(19) }}>
                    {value.replace(/./g, "*")}
                  </Animated.Text> */}
              </View>
              // :
            }
          </View>

          {props.secureTextEntry ? (
            props.passwordToggle ? (
              <View
                style={[
                  styles.passwordToggleContainer,
                  props.secureTextEntry
                    ? { width: '10%', position: 'absolute', right: 5, top: 5 }
                    : { width: 0 },
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    setState({ ...state, showPassword: !state.showPassword });
                  }}
                  style={styles.visiblalityButtonContainer}>
                  <Image
                    // style={styles.imageStyle}
                    source={state.showPassword ? eyeoff : eye}
                  />
                </TouchableOpacity>
              </View>
            ) : state.showClearImage ? (
              <TouchableOpacity
                onPress={props.onPressClear}
                style={[
                  styles.crossContainer,
                  props.secureTextEntry
                    ? styles.secureTextView
                    : styles.width0,
                ]}>
                <Image
                  source={require('../../../images/cross/cross_icon.png')}
                  style={styles.crossImageStyle}
                />
              </TouchableOpacity>
            ) : null
          ) : null}
          {/* </Animated.View> */}
        </View>

        {/* {state.showPasswordStrength && (
          <View style={styles.marginLeftImg}>
            <View style={styles.passwordStrengthContainer}>
              {Array(state.passwordStrength)
                .fill(state.passwordStrength)
                .map(() => {
                  return (
                    <View
                      style={[styles.passwordArrayStyle, {
                        backgroundColor: state.passwordStrength > 2 ? Colors.passwordStrong
                          : state.passwordStrength > 1 ? Colors.passwordMedium : Colors.passwordWeak,
                      }]}
                    />
                  );
                })}
            </View>

            <Text
              style={[styles.passwordStrengthTextStyle, { color: props.isCuebackRegistration ? Colors.TextColor : Colors.TextColor, }]}>
              Password Strength :{' '}
              <Text
                style={styles.passwordTextStyle}>
                {state.passwordStrength > 2
                  ? PasswordStrength.strong
                  : state.passwordStrength > 1
                    ? PasswordStrength.medium
                    : PasswordStrength.weak}
              </Text>
            </Text>

          </View>
        )} */}

      </View>
      {
        props.errorMessage ?
          <Animated.View
            style={[
              styles.animatedViewStyle,
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
          :
          null
      }

    </>
  );
}

TextField.defaultProps = {
  value: '',
  secureTextEntry: false,
  placeholderTextColor: Colors.newTextColor,
  placeholder: 'Enter the value',
  errorMessage: 'Text entered is invalid',
  showError: false,
  supportAutoFocus: false,
  inputTextStyle: styles.inputTextStyle,
  inputViewStyle: styles.inputViewStyle,
  inputFieldForPayment: false,
  returnKeyType: 'done',
  autoFocus: false,
  passwordToggle: false,
  isRequired: false,
  onSubmitEditing: () => { },
  isCuebackRegistration: false,
  showStrength: false,
  inputFocused: false,
  nameInput: '',
  onFocus: () => { }
};

export default TextField;