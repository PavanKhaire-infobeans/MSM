import React, { RefObject, useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageStyle,
  Platform,
  StyleProp,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { plus_circle, search } from '../../../../app/images';
import { icon_close_black, searchIcon } from '../../../images';
import { Colors } from '../../constants';
import Text from '../Text';
import searchStyle from './styles';

type Props = { [x: string]: any; placeholder: string };
const SearchBar = (props: Props) => {
  let inputField: RefObject<TextInput> = useRef(null);
  const [state, setState] = useState({
    editing: false,
    value: props.value || '',
    barWidth: 0,
    searchWidth: 0,
    isFocused: false,
  });

  useEffect(() => {
    setState({ ...state, isFocused: inputField.current.isFocused() });
  }, []);

  useEffect(() => {
    if (props.value != props.value && props.value != state.value) {
      setState({ ...state, value: props.value || '' });
    }
  }, [props]);

  const cancelPressed = () => {
    //dismissKeyboard();
    blur();
    clearField();
  }

  const focus = () => {
    setState(
      {
        ...state,
        editing: true,
      },
    );
    if (props.onFocus) {
      props.onFocus();
    }
  }

  const blur = () => {
    setState(
      {
        ...state,
        editing: false,
      });
    if (inputField) {
      inputField.current.blur();
    }
    if (props.onBlur) {
      props.onBlur();
    }

  };

  const clearField = () => {
    inputField.current.clear();
    setState({ ...state, value: '' })
    if (props.onClearField) {
      props.onClearField();
    }
  };

  const showClear = () => {
    // if (Platform.OS === 'android') {
    // if (state.value.length > 0) {
    return (
      <TouchableOpacity
        onPress={() => {
          // clearField();
          if (props.onSearchButtonPress) {
            props.onSearchButtonPress(state.value);
          }
        }}
        style={searchStyle.clearButton}>
        <Image
          source={props.isAddbutton ? plus_circle : search}//icon_close_black}
          // style={{width: 18, height: 18}}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
    //   }
    // }
  }

  const showCancelOnIos = () => {
    if (Platform.OS == 'ios') {
      if (state.editing) {
        return (
          <TouchableOpacity
            onPress={() => {
              cancelPressed();
            }}
            style={searchStyle.buttonTextStyle}>
            <Text style={searchStyle.cancel}>Cancel</Text>
          </TouchableOpacity>
        );
      }
    }
    return null;
  }

  let design: any[] = [searchStyle.imageParent];
  let showCancelClear = true;
  let borderRadius = false;
  if (typeof props.showCancelClearButton !== 'undefined') {
    showCancelClear = props.showCancelClearButton;
  }

  if (typeof props.borderRadius !== 'undefined') {
    borderRadius = props.borderRadius;
  }

  design.push({
    left: 0,
    position: 'absolute',
  });

  return (
    <View
      style={[
        searchStyle.parent,
        { backgroundColor: Colors.white, flexDirection: 'row' },
      ]}>
      <View
        style={[
          searchStyle.baseFlex,
          {
            backgroundColor: props.textFieldBackgroundColor,
            borderRadius: 8,
            borderColor: borderRadius ? Colors.bottomTabColor : Colors.bottomTabColor,
            borderWidth: borderRadius ? 1 : 1,
          },
        ]}>
        {/* <View style={design}>
            <Image
              resizeMode="contain"
              style={searchStyle.imageStyle as StyleProp<ImageStyle>}
              source={searchIcon}
            />
            <Text
              style={[
                searchStyle.placeholder,
                {
                  opacity: state.value.length > 0 ? 0 : 1,
                },
              ]}>
              {props.placeholder}
            </Text>
          </View> */}
        <View style={searchStyle.inputView}>
          <TextInput
            ref={inputField}
            autoCapitalize="none"
            allowFontScaling={false}
            // clearButtonMode="always"
            autoCorrect={false}
            style={searchStyle.inputStyle}
            maxLength={35}
            onChangeText={text => {
              setState(
                {
                  ...state,
                  value: text,
                });
              if (props.onChangeText) {
                props.onChangeText(text);
              }

              if (props.onClearField && text.length == 0) {
                if (!props.retainFocus) {
                  inputField.current.blur();
                }
                props.onClearField();
              }
            }}
            placeholder={props.placeholder ? props.placeholder : 'Search here...'}
            placeholderTextColor={Colors.newTextColor}
            keyboardType="ascii-capable"
            value={state.value}
            enablesReturnKeyAutomatically={true}
            returnKeyType="search"
            underlineColorAndroid="transparent"
            onFocus={focus}
            onBlur={blur}
            onSubmitEditing={() =>
              props.onSearchButtonPress(state.value)
            }
          />
          {showClear()}
        </View>
      </View>
      {showCancelClear ? showCancelOnIos() : null}
    </View>
  );

};

SearchBar.defaultProps = {
  placeholder: 'Search...',
  onFocus: () => { },
};
export default SearchBar;