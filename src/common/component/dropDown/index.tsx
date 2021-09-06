import React from 'react';
import {
  View,
  Animated,
  Platform,
  TouchableHighlight,
  Picker,
} from 'react-native';
import Text from '../Text';
import {Props, State} from './types';
import {styles} from './design';
import {Colors, fontSize} from '../../constants';

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
      height: new Animated.Value(56),
      opacity: new Animated.Value(0),
      animatedViewHeight: Platform.OS === 'ios' ? 16 : 26,
      showClearImage: false,
      text: '',
      numericValue: 0,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    let selectedValue = this.props.selectedValue || '';
    let nextSelectedValue = nextProps.selectedValue || '';
    if (this.props.showError !== nextProps.showError) {
      Animated.parallel([
        Animated.timing(this.state.height, {
          toValue: 56,
          duration: 100,
        }),
        Animated.timing(this.state.opacity, {
          toValue: nextProps.showError ? 1 : 0,
          duration: 100,
        }),
      ]).start();
    }
    // if (nextSelectedValue !== selectedValue) {
    // 	Animated.parallel([
    // 		Animated.timing(this.state.sizeFnt, {
    // 			toValue: (nextSelectedValue.length > 0) ? 13 : kPlaceHolderFontSize,
    // 			duration: 300
    // 		}),
    // 		Animated.timing(this.state.top, {
    // 			toValue: (nextSelectedValue.length > 0) ? kTopAnimated : kTop,
    // 			duration: 300
    // 		})
    // 	]).start();
    // }
  }

  showPicker = () => {
    this.props.onOptionSelected();
  };

  render() {
    let selectedValue = this.props.selectedValue || '';
    return (
      <View style={[this.props.style, {flexDirection: 'column'}]}>
        <View style={{flex: 1, justifyContent: 'center', minWidth: 150}}>
          <TouchableHighlight
            underlayColor="#cccccc3e"
            onPress={this.showPicker}>
            <Animated.View
              style={{
                height: this.state.height,
                backgroundColor: this.props.isCuebackRegistration
                  ? '#fff'
                  : Colors.NewLightCommentHeader,
                flexDirection: 'row',
                borderRadius: 8,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: this.props.showError
                  ? Colors.NewRadColor
                  : this.props.isCuebackRegistration
                  ? Colors.TextColor
                  : 'transparent',
              }}>
              <View style={[this.props.inputViewStyle]}>
                <Animated.Text
                  style={{
                    color: this.props.isCuebackRegistration
                      ? Colors.TextColor
                      : selectedValue.length > 0
                      ? Colors.NewTitleColor
                      : this.props.placeholderTextColor,
                    ...fontSize(13),
                    fontFamily: 'Rubik',
                    position: 'absolute',
                    top: kTopAnimated,
                    opacity: this.props.isCuebackRegistration ? 0.6 : 1,
                    left: 8,
                  }}>
                  {this.props.placeholderText}
                  {this.props.isRequired ? (
                    <Animated.Text style={{color: Colors.NewRadColor}}>
                      {' *'}
                    </Animated.Text>
                  ) : null}
                </Animated.Text>
                <Text
                  style={[
                    {
                      left: 0,
                      fontFamily: 'Rubik',
                      top: 12,
                      ...fontSize(18),
                      height: '70%',
                      color: this.props.isCuebackRegistration
                        ? Colors.TextColor
                        : Colors.TextColor,
                      lineHeight: 35,
                      letterSpacing: -0.1,
                      paddingRight: 20,
                    },
                  ]}>
                  {selectedValue}
                </Text>
              </View>
              <View
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
              />
            </Animated.View>
          </TouchableHighlight>
        </View>
        <Animated.View
          style={{
            width: '100%',
            height: this.props.animatedViewHeight,
            opacity: this.state.opacity,
            alignItems: 'flex-start',
          }}>
          <View style={{minWidth: 140}}>
            <Text
              style={{
                ...fontSize(11),
                color: Colors.NewRadColor,
                marginTop: 1,
                lineHeight: 13,
                letterSpacing: -0.1,
              }}>
              {`*${this.props.errorMessage}`}
            </Text>
          </View>
        </Animated.View>
      </View>
    );
  }
}
