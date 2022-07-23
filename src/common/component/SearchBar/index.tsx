import React, { RefObject } from 'react';
import {
  Image, ImageStyle, Platform, StyleProp, TextInput, TouchableOpacity, View
} from 'react-native';
import { icon_close_black, searchIcon } from '../../../images';
import { Colors } from '../../constants';
import Text from '../Text';
import searchStyle from './styles';

type Props = { [x: string]: any; placeholder: string };
export default class SearchBar extends React.Component<Props> {
  inputField: RefObject<TextInput> = React.createRef<TextInput>();
  state = {
    editing: false,
    value: '',
    barWidth: 0,
    searchWidth: 0,
    isFocused: false,
  };

  componentWillReceiveProps(props: Props) {
    if (this.props.value != props.value && props.value != this.state.value) {
      this.setState({ value: props.value || '' });
    }
  }

  componentDidMount() {
    this.setState({ isFocused: this.inputField.current.isFocused() });
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      ...this.state,
      value: props.value || '',
    };
  }

  static defaultProps = {
    placeholder: 'Search',
    onFocus: () => { },
  };

  render() {
    var design: any[] = [searchStyle.imageParent];
    var showCancelClear = true;
    var borderRadius = false;
    if (typeof this.props.showCancelClearButton !== 'undefined') {
      showCancelClear = this.props.showCancelClearButton;
    }

    if (typeof this.props.borderRadius !== 'undefined') {
      borderRadius = this.props.borderRadius;
    }

    design.push({
      left: 0,
      position: 'absolute',
    });

    return (
      <View
        style={[
          searchStyle.parent,
          { backgroundColor: this.props.barTintColor, flexDirection: 'row' },
          this.props.style || {},
        ]}>
        <View
          style={[
            searchStyle.baseFlex,
            {
              backgroundColor: this.props.textFieldBackgroundColor,
              borderRadius: borderRadius ? 20 : 8,
              borderColor: borderRadius ? Colors.bordercolor : null,
              borderWidth: borderRadius ? 1 : null,
            },
          ]}>
          <View style={design}>
            <Image
              resizeMode="contain"
              style={searchStyle.imageStyle as StyleProp<ImageStyle>}
              source={searchIcon}
            />
            <Text
              style={[
                searchStyle.placeholder,
                {
                  opacity: this.state.value.length > 0 ? 0 : 1,
                  
                },
              ]}>
              {this.props.placeholder}
            </Text>
          </View>
          <View style={searchStyle.inputView}>
            <TextInput
              ref={this.inputField}
              autoCapitalize="none"
              allowFontScaling={false}
              clearButtonMode="always"
              autoCorrect={false}
              style={searchStyle.inputStyle}
              maxLength={20}
              onChangeText={text => {
                this.setState({
                  value: text,
                });

                if (this.props.onChangeText) {
                  this.props.onChangeText(text);
                }

                if (this.props.onClearField && text.length == 0) {
                  if (!this.props.retainFocus) {
                    this.inputField.current.blur();
                  }
                  this.props.onClearField();
                }
              }}
              keyboardType="ascii-capable"
              value={this.state.value}
              enablesReturnKeyAutomatically={true}
              returnKeyType="search"
              underlineColorAndroid="transparent"
              onFocus={this.focus.bind(this)}
              onBlur={this.blur.bind(this)}
              onSubmitEditing={() =>
                this.props.onSearchButtonPress(this.state.value)
              }
            />
            {this.showClear()}
          </View>
        </View>
        {showCancelClear ? this.showCancelOnIos() : null}
      </View>
    );
  }

  cancelPressed() {
    //dismissKeyboard();
    this.blur();
    this.clearField();
  }

  focus() {
    this.setState({
      editing: true,
    });

    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  blur() {
    this.setState({
      editing: false,
    });
    if (this.inputField) {
      this.inputField.current.blur();
    }
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  clearField() {
    this.inputField.current.clear();
    this.setState({ value: '' });
    if (this.props.onClearField) {
      this.props.onClearField();
    }
  }

  showClear() {
    if (Platform.OS === 'android') {
      if (this.state.value.length > 0) {
        return (
          <TouchableOpacity
            onPress={() => {
              this.clearField();
            }}
            style={searchStyle.clearButton}>
            <Image
              source={icon_close_black}
              // style={{width: 18, height: 18}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        );
      }
    }
  }

  showCancelOnIos() {
    if (Platform.OS == 'ios') {
      if (this.state.editing) {
        return (
          <TouchableOpacity
            onPress={() => {
              this.cancelPressed();
            }}
            style={searchStyle.buttonTextStyle}>
            <Text style={searchStyle.cancel}>Cancel</Text>
          </TouchableOpacity>
        );
      }
    }
    return null;
  }
}

