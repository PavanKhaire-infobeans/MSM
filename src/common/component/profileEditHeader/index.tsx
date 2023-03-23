import { Image, TouchableOpacity, View } from 'react-native';
import Text from '../Text';
import React from 'react';
//@ts-ignore
import { backBlkBtn } from '../../../images';

import styles from './styles';

class ProfileEditHeader extends React.Component<{ [x: string]: any }> {
  static defaultProps = {
    showRightText: true,
  };
  _renderLeft() {
    return (
      <TouchableOpacity
        style={[this.props.noFullWidth? styles.leftButtonAddtoCollectionTouchableContainer:styles.leftButtonTouchableContainer]}
        onPress={() => this.props.cancelAction()}>
        <Image
          // style={{height: 28, width: 28}}
          resizeMode="center"
          source={backBlkBtn}
        />
      </TouchableOpacity>
    );
  }

  _renderMiddle() {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
          {this.props.heading}
        </Text>
      </View>
    );
  }

  _renderRight() {
    return (
      <View style={[styles.rightButtonsContainer]}>
        <TouchableOpacity
          onPress={() => this.props.saveValues()}
          style={styles.rightButtonsTouchable}>
          <Text
            style={styles.rightTextStyle}>
            {this.props.rightText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderLeft()}
        {this._renderMiddle()}
        {this.props.showRightText && this._renderRight()}
      </View>
    );
  }
}

export default ProfileEditHeader;
