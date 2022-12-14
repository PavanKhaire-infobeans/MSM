import React from 'react';
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
export default class TextField extends React.Component<Props, State> {
  isBlurred = true;
  ref: TextInput;
  static defaultProps = {
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
    returnKeyType: 'return',
    autoFocus: false,
    passwordToggle: false,
    isRequired: false,
    onSubmitEditing: () => { },
    isCuebackRegistration: false,
    showStrength: false,
    inputFocused: false,
    nameInput: '',
    onFocus:()=>{}
  };
  constructor(props: Props) {
    super(props);
    const val = this.props.value || '';

    this.state = {
      sizeFnt: new Animated.Value(val.length > 0 ? 13 : kPlaceHolderFontSize),
      top: new Animated.Value(val.length > 0 ? kTopAnimated : kTop),
      height: new Animated.Value(56),
      opacity: new Animated.Value(0),
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
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props !== nextProps) {
      if (this.props.showError !== nextProps.showError) {
        Animated.parallel([
          Animated.timing(this.state.height, {
            toValue: 56,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(this.state.opacity, {
            toValue: nextProps.showError ? 1 : 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }
      if (nextProps.supportAutoFocus) {
        this.onFocus();
      }
      this.setState({
        showClearImage: this.isBlurred ? false : nextProps.value.length != 0,
      });
    }
  }

  onBlur = () => {
    this.setState(
      {
        showClearImage: false,
        inputFocused: false,
      },
      () => {
        this.isBlurred = true;
        if (this.props.value.length == 0) {
          Animated.parallel([
            Animated.timing(this.state.sizeFnt, {
              toValue: kPlaceHolderFontSize,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(this.state.top, {
              toValue: this.props.inputFieldForPayment ? kTopAnimated : kTop,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    );
  };

  onFocus = () => {
    Animated.parallel([
      Animated.timing(this.state.sizeFnt, {
        toValue: 13,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.top, {
        toValue: kTopAnimated,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    this.isBlurred = false;
    this.setState({
      inputFocused: true,
      showClearImage: this.props.value.length != 0,
    },()=>{
      if (this.props.onFocus) {
        this.props.onFocus()
      }
    });
  };

  onTextChange = (text: any) => {
    if (
      this.props.showStrength &&
      text.trim().length > 0 &&
      !this.state.showPasswordStrength
    ) {
      this.setState({ showPasswordStrength: true });
    } else if (this.props.showStrength && text.trim().length == 0) {
      this.setState({ showPasswordStrength: false });
    }

    if (this.props.showStrength) {
      let count = 0;
      rgularExp.containsNumber.test(text.trim()) ? count++ : count;
      rgularExp.containsSmallLetters.test(text.trim()) ? count++ : count;
      rgularExp.containsCapitalLetters.test(text.trim()) ? count++ : count;
      // rgularExp.containsSpecialCharacters.test(text.trim()) ?  count++ : count;
      this.setState({ passwordStrength: count });
    }

    this.setState(
      {
        value: text,
      },
      () => this.props.onChange(text),
    );
  };

  render() {
    let { value } = this.state;
    if (this.state.showPassword) {
      value = value; //.replace(/./g, "*");
    }
    let defaultValue = this.props.value;
    if (defaultValue) {
      value = this.props.value; //.replace(/./g, "*")
    }
    return (
      <>
        <View style={[this.props.style, styles.container]}>
          <View style={[styles.subContainer]}>
            {/* <Animated.View
            style={[{
              height: this.state.height,
              backgroundColor: this.props.isCuebackRegistration ? Colors.white : Colors.NewLightCommentHeader,
              borderColor: this.props.showError ? 'red' : this.props.isCuebackRegistration ? Colors.TextColor : 'transparent',
            }, styles.animatedView]}> */}

            <View
              style={[
                this.props.inputViewStyle,
                this.state.inputFocused
                  ? styles.onFocusStyle
                  : // this.props.secureTextEntry ? { width: '90%' } :
                  {},
              ]}>
              {/* <Animated.Text
                style={[{
                  color: this.props.isCuebackRegistration ? Colors.TextColor : !this.isBlurred || this.props.value.length > 0
                    ? Colors.NewTitleColor : this.props.placeholderTextColor,
                  top: this.state.top,
                  ...fontSize(this.state.sizeFnt),
                  opacity: this.props.isCuebackRegistration ? 0.6 : 1,
                }, styles.animatedTextStyle]}>
                {this.props.placeholder}
                {this.props.isRequired ? (
                  <Animated.Text style={{ color: Colors.NewRadColor }}>
                    {' *'}
                  </Animated.Text>
                ) : null}
              </Animated.Text> */}
              {
                // this.state.showPassword && this.props.secureTextEntry ?
                <View
                  style={[
                    this.props.inputTextStyle,
                    styles.textInputStyle,
                    styles.textwrapStyle,
                    {
                      left: this.state.leftTextInput,
                    },
                  ]}>
                  <TextInput
                    returnKeyType={this.props.returnKeyType}
                    keyboardType={
                      this.props.keyboardType == 'numeric'
                        ? 'numeric'
                        : this.props.keyboardType == 'number-pad'
                          ? 'number-pad'
                          : this.props.keyboardType == 'email-address'
                            ? 'email-address'
                            : this.props.keyboardType == 'phone-pad'
                              ? 'phone-pad'
                              : 'ascii-capable'
                    }
                    placeholderTextColor={Colors.newTextColor}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    placeholder={this.props.placeholder}
                    onSubmitEditing={this.props.onSubmitEditing}
                    blurOnSubmit={this.props.blurOnSubmit}
                    maxLength={this.props.maxLength}
                    secureTextEntry={
                      this.state.showPassword ? this.props.secureTextEntry : false
                    }
                    // onChangeText={text => {
                    //   const lastDigit = text[text.length - 1];
                    //   this.setState({
                    //     nameInput: this.state.nameInput.concat( '*'),
                    //   });
                    // }}
                    //   onKeyPress={({ nativeEvent }) => {
                    //     alert(nativeEvent.key)
                    //     // nativeEvent.key in KeyCodes ? this.setState({ nameInput: KeyCodes.q }) : null
                    // }}
                    onChangeText={(text: any) => this.onTextChange(text)}
                    style={[
                      this.props.inputTextStyle,
                      {
                        left: this.state.leftTextInput,
                      },
                      styles.textInputStyle,
                    ]}
                    numberOfLines={1}
                    onFocus={this.onFocus}
                    multiline={false}
                    value={this.state.nameInput}
                    defaultValue={defaultValue}
                    clearButtonMode={this.props.clearButtonMode}
                    selectionColor={Colors.darkGray}
                    spellCheck={false}
                    onEndEditing={this.props.onEndEditing}
                    underlineColorAndroid={Colors.transparent}
                    onBlur={this.onBlur}
                    ref={this.props.reference}
                    autoFocus={this.props.autoFocus}
                  />
                  {/* <Animated.Text style={{ color: Colors.black, ...fontSize(19) }}>
                    {value.replace(/./g, "*")}
                  </Animated.Text> */}
                </View>
                // :
              }
            </View>

            {this.props.secureTextEntry ? (
              this.props.passwordToggle ? (
                <View
                  style={[
                    styles.passwordToggleContainer,
                    this.props.secureTextEntry
                      ? { width: '10%', position: 'absolute', right: 5, top: 5 }
                      : { width: 0 },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ showPassword: !this.state.showPassword });
                    }}
                    style={styles.visiblalityButtonContainer}>
                    <Image
                      // style={styles.imageStyle}
                      source={this.state.showPassword ? eyeoff : eye}
                    />
                  </TouchableOpacity>
                </View>
              ) : this.state.showClearImage ? (
                <TouchableOpacity
                  onPress={this.props.onPressClear}
                  style={[
                    styles.crossContainer,
                    this.props.secureTextEntry
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

          {/* {this.state.showPasswordStrength && (
          <View style={styles.marginLeftImg}>
            <View style={styles.passwordStrengthContainer}>
              {Array(this.state.passwordStrength)
                .fill(this.state.passwordStrength)
                .map(() => {
                  return (
                    <View
                      style={[styles.passwordArrayStyle, {
                        backgroundColor: this.state.passwordStrength > 2 ? Colors.passwordStrong
                          : this.state.passwordStrength > 1 ? Colors.passwordMedium : Colors.passwordWeak,
                      }]}
                    />
                  );
                })}
            </View>

            <Text
              style={[styles.passwordStrengthTextStyle, { color: this.props.isCuebackRegistration ? Colors.TextColor : Colors.TextColor, }]}>
              Password Strength :{' '}
              <Text
                style={styles.passwordTextStyle}>
                {this.state.passwordStrength > 2
                  ? PasswordStrength.strong
                  : this.state.passwordStrength > 1
                    ? PasswordStrength.medium
                    : PasswordStrength.weak}
              </Text>
            </Text>

          </View>
        )} */}

        </View>
        {
          this.props.errorMessage ?
            <Animated.View
              style={[
                styles.animatedViewStyle,
                {
                  height: this.props.animatedViewHeight,
                  opacity: this.state.opacity,
                },
              ]}>
              <View style={styles.minWidth}>
                <Text style={styles.errorTextStyle}>
                  {`*${this.props.errorMessage}`}
                </Text>
              </View>
            </Animated.View>
            :
            null
        }

      </>
    );
  }
}
