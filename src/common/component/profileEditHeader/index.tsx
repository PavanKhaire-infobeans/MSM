import { Image, TouchableOpacity, View } from 'react-native';
import Text from '../Text';
import React from 'react';
//@ts-ignore
import { backBlkBtn } from '../../../images';

import styles from './styles';

const ProfileEditHeader = (props:any)=> {
  
  const _renderLeft=()=> {
    return (
      <TouchableOpacity
        style={[props.noFullWidth? styles.leftButtonAddtoCollectionTouchableContainer:styles.leftButtonTouchableContainer]}
        onPress={() => props.cancelAction()}>
        <Image
          // style={{height: 28, width: 28}}
          resizeMode="center"
          source={backBlkBtn}
        />
      </TouchableOpacity>
    );
  }

  const _renderMiddle=()=> {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
          {props.heading}
        </Text>
      </View>
    );
  }

  const _renderRight=() => {
    return (
      <View style={[styles.rightButtonsContainer]}>
        <TouchableOpacity
          onPress={() => props.saveValues()}
          style={styles.rightButtonsTouchable}>
          <Text
            style={styles.rightTextStyle}>
            {props.rightText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

    return (
      <View style={styles.container}>
        {_renderLeft()}
        {_renderMiddle()}
        {props.showRightText && _renderRight()}
      </View>
    );
}

ProfileEditHeader.defaultProps = {
  showRightText: true,
};
export default ProfileEditHeader;
