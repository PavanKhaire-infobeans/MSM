import { Image, TouchableOpacity, View } from 'react-native';
import Text from '../Text';
import React from 'react';
//@ts-ignore
import EStyleSheet from 'react-native-extended-stylesheet';
import { close_white } from '../../../images';
import { Colors, fontSize } from '../../constants';
import { Account } from '../../loginStore';

const styles = EStyleSheet.create({
  name: {
    color: Colors.white,
    ...fontSize(10),
    lineHeight: 15,
    textAlign: 'left',
    fontWeight: "500",
  },
  titleText: {
    color: Colors.white,
    ...fontSize(18),
    lineHeight: 20,
    textAlign: 'left',
    fontWeight: "500",
  },

  titleContainer: {
    justifyContent: 'center',
    paddingTop: 10,
    flex: 1,
    paddingRight: 10,
  },

  leftButtonTouchableContainer: {
    justifyContent: 'center',
    padding: 15,
    marginTop: 5,
  },

  leftButtonContainer: {
    backgroundColor: 'transparent',
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftCrossButtonContainer: {
    backgroundColor: Colors.NewRadColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightButtonsContainer: {
    paddingTop: 10,
    paddingRight: 0,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  rightButtonsTouchable: {
    padding: 0,
    paddingRight: 10
  },

});

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
              style={{
                ...fontSize(16),
                fontWeight: "500",
                color: Colors.white,
                paddingRight: 10,
              }}>
              {this.props.rightText}
            </Text>
          </TouchableOpacity>
        )}
        {this.props.rightIcon && (
          <TouchableOpacity onPress={() => this.props.showHideMenu()}>
            <View
              style={{
                justifyContent: 'space-between',
                height: '100%',
                width: 30,
                padding: 13.5,
                paddingLeft: 3,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  height: 4,
                  width: 4,
                  borderRadius: 2,
                }}></View>
              <View
                style={{
                  backgroundColor: 'white',
                  height: 4,
                  width: 4,
                  borderRadius: 2,
                }}></View>
              <View
                style={{
                  backgroundColor: 'white',
                  height: 4,
                  width: 4,
                  borderRadius: 2,
                }}></View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 1 }}>
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
