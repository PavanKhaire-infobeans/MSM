import { Image, TouchableOpacity, View } from 'react-native';
import Text from '../Text';
import React from 'react';
//@ts-ignore
import { close_white } from '../../../images';
import { Colors, fontSize } from '../../constants';
import { Account } from '../../loginStore';
import styles from './styles';

const ThemeHeader = (props: any) => {

  const _renderLeft = () => {
    return (
      <View>
        {!props.hideClose ? (
          <TouchableOpacity
            style={[styles.leftButtonTouchableContainer]}
            onPress={() => props.cancelAction()}>
            <Image
              style={{ height: 28, width: 28 }}
              resizeMode="center"
              source={close_white}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ height: 10, width: 15 }}></View>
        )}
      </View>
    );
  }

  const _renderMiddle = () => {
    return (
      <View style={styles.titleContainer}>
        {props.showCommunity && (
          <Text style={styles.name}>{Account.selectedData().name}</Text>
        )}
        <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
          {props.heading}
        </Text>
      </View>
    );
  }

  const _renderRight = () => {
    return (
      <View style={[styles.rightButtonsContainer]}>
        {props.showRightText && (
          <TouchableOpacity
            onPress={() => props.saveValues()}
            style={styles.rightButtonsTouchable}>
            <Text
              style={styles.rightTextStyle}>
              {props.rightText}
            </Text>
          </TouchableOpacity>
        )}
        {props.rightIcon && (
          <TouchableOpacity onPress={() => props.showHideMenu()}>
            <View
              style={styles.rightIconContainer}>
              <View
                style={styles.menuStyle}></View>
              <View
                style={styles.menuStyle}></View>
              <View
                style={styles.menuStyle}></View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View
      style={styles.headerContainerStyle}>
      <View
        style={styles.centerandLeftContainer}>
        {_renderLeft()}
        {_renderMiddle()}
      </View>
      {(props.showRightText || props.rightIcon) &&
        _renderRight()}
    </View>
  );
}
ThemeHeader.defaultProps = {
  showRightText: true,
};
export default ThemeHeader;
