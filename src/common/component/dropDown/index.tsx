import React from 'react';
import {Animated, Platform, TouchableHighlight, View} from 'react-native';
import {Colors} from '../../constants';
import Text from '../Text';
import styles from './styles';
import {Props, State} from './types';

const kTop = 19,
  kTopAnimated = 5;
const kPlaceHolderFontSize = 18;

export default class DropDownSelector extends React.Component<Props, State> {
  static defaultProps = {
    placeholderText: '',
    placeholderTextColor: 'gray',
    errorMessage: '',
    showError: false,
    value: '',
    onOptionSelected: () => {},
    viewID: 0,
    isRequired: false,
    inputViewStyle: styles.inputViewStyle,
    inputTextStyle: styles.inputTextStyle,
    isCuebackRegistration: false,
  };

  constructor(props: Props) {
    super(props);
    const val = this.props.value || '';
    this.state = {
      sizeFnt: new Animated.Value(val.length > 0 ? 13 : kPlaceHolderFontSize),
      top: new Animated.Value(val.length > 0 ? kTopAnimated : kTop),
      height: new Animated.Value(100),
      opacity: new Animated.Value(0),
      animatedViewHeight: Platform.OS === 'ios' ? 16 : 26,
      showClearImage: false,
      text: '',
      numericValue: 0,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      this.props !== nextProps &&
      this.props.showError !== nextProps.showError
    ) {
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
  }

  showPicker = () => {
    this.props.onOptionSelected();
  };

  render() {
    let selectedValue = this.props.selectedValue || '';
    return (
      <View style={[this.props.style, {flexDirection: 'column'}]}>
        <View style={styles.textContainer}>
          <TouchableHighlight
            underlayColor="#cccccc3e"
            onPress={this.showPicker}>
            <Animated.View
              style={[
                styles.innerView,
                {
                  backgroundColor: this.props.isCuebackRegistration
                    ? '#fff'
                    : Colors.unSelectedFilterbg,
                  height: this.state.height,
                  borderColor: this.props.showError
                    ? Colors.NewRadColor
                    : this.props.isCuebackRegistration
                    ? Colors.TextColor
                    : 'transparent',
                },
              ]}>
              <View
                style={[
                  this.props.inputViewStyle,
                  styles.animatedtextContainer,
                ]}>
                <Animated.Text
                  style={[
                    styles.animatedtextStyle,
                    {
                      color: this.props.isCuebackRegistration
                        ? Colors.TextColor
                        : selectedValue.length > 0
                        ? Colors.TextColor
                        : this.props.placeholderTextColor,
                      opacity: this.props.isCuebackRegistration ? 0.6 : 1,
                    },
                  ]}>
                  {this.props.placeholderText}

                  {this.props.isRequired ? (
                    <Animated.Text style={{color: Colors.NewRadColor}}>
                      {' *'}
                    </Animated.Text>
                  ) : null}
                </Animated.Text>
                <Text
                  style={[
                    styles.starStyle,
                    {
                      color: this.props.isCuebackRegistration
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
                  borderTopColor: this.props.isCuebackRegistration
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
      </View>
    );
  }
}
