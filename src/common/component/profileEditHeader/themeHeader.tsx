import { Image, TouchableOpacity, View } from 'react-native';
import Text from '../Text';
import React from 'react';
//@ts-ignore
import { close_white } from '../../../images';
import { Colors, fontSize } from '../../constants';
import { Account } from '../../loginStore';
import styles from './styles';

class ThemeHeader extends React.Component<{ [x: string]: any }> {
  static defaultProps = {
    showRightText: true,
  };
  _renderLeft() {
    return (
      <View>
        {!this.props.hideClose ? (
          <TouchableOpacity
            style={[styles.leftButtonTouchableContainer]}
            onPress={() => this.props.cancelAction()}>
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

  _renderMiddle() {
    return (
      <View style={styles.titleContainer}>
        {this.props.showCommunity && (
          <Text style={styles.name}>{Account.selectedData().name}</Text>
        )}
        <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
          {this.props.heading}
        </Text>
      </View>
    );
  }

  _renderRight() {
    return (
      <View style={[styles.rightButtonsContainer]}>
        {this.props.showRightText && (
          <TouchableOpacity
            onPress={() => this.props.saveValues()}
            style={styles.rightButtonsTouchable}>
            <Text
              style={styles.rightTextStyle}>
              {this.props.rightText}
            </Text>
          </TouchableOpacity>
        )}
        {this.props.rightIcon && (
          <TouchableOpacity onPress={() => this.props.showHideMenu()}>
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

  render() {
    return (
      <View
        style={styles.headerContainerStyle}>
        <View
          style={styles.centerandLeftContainer}>
          {this._renderLeft()}
          {this._renderMiddle()}
        </View>
        {(this.props.showRightText || this.props.rightIcon) &&
          this._renderRight()}
      </View>
    );
  }
}

export default ThemeHeader;
