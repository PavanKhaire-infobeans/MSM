import {Image, TouchableOpacity, View, StatusBar, Platform} from 'react-native';
import Text from '../Text';
import React from 'react';
//@ts-ignore
import EStyleSheet from 'react-native-extended-stylesheet';
import {action_close, backBlkBtn} from '../../../images';
import {Colors, fontSize} from '../../constants';

const styles = EStyleSheet.create({
  titleText: {
    color: '#000',
    ...fontSize(18),
    lineHeight: 20,
    textAlign: 'left',
    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
  },

  titleContainer: {justifyContent: 'center', paddingTop: 10},

  leftButtonTouchableContainer: {
    justifyContent: 'center',
    padding: 15,
    marginTop: 5,
  },

  leftButtonContainer: {
    backgroundColor: 'transparent',
    borderColor: '#ffffff',
    borderWidth: 2,
    height: 28,
    width: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftCrossButtonContainer: {
    backgroundColor: Colors.NewRadColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightButtonsContainer: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  rightButtonsTouchable: {padding: 0, paddingRight: 10},
});

class ProfileEditHeader extends React.Component<{[x: string]: any}> {
  static defaultProps = {
    showRightText: true,
  };
  _renderLeft() {
    return (
      <TouchableOpacity
        style={[styles.leftButtonTouchableContainer]}
        onPress={() => this.props.cancelAction()}>
        <Image
          style={{height: 28, width: 28}}
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
            style={{
              ...fontSize(18),
              fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
              color: Colors.ThemeColor,
            }}>
            {this.props.rightText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={{flexDirection: 'row', width: '100%'}}>
        {this._renderLeft()}
        {this._renderMiddle()}
        {this.props.showRightText && this._renderRight()}
      </View>
    );
  }
}

export default ProfileEditHeader;
