import React from 'react';
import {
  Image, Keyboard, StatusBar, TouchableWithoutFeedback, View
} from 'react-native';
//@ts-ignore
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Actions } from 'react-native-router-flux';
import { penEdit } from '../../../../app/images';
import { black_arrow, close_white } from '../../../images';
import { Colors } from '../../constants';
import { Account } from '../../loginStore';
import Utility from '../../utility';
import MessageDialogue from '../messageDialogue';
import { default as Text, default as TextNew } from '../Text';
import styles from './styles';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

class NavigationHeaderSafeArea extends React.Component<{ [x: string]: any }> {
  messageRef: any | MessageDialogue = null;
  static defaultProps = {
    showRightText: true,
  };
  _renderLeft() {
    return (
      <View>
        {!this.props.hideClose ? (
          <TouchableWithoutFeedback
            onPress={() => this.props.cancelAction()}>
            <View style={styles.leftButtonTouchableContainer}>
              <Image
                style={this.props.showRightText ? styles.cancelImage : styles.cancelImageConditional}
                resizeMode="center"
                source={
                  this.props.backIcon ? this.props.backIcon : this.props.isWhite ? black_arrow : close_white
                }
              />
              {
                this.props.backIcon
                  ?
                  <View style={styles.cancleTextContainer}>
                    <Text style={styles.cancleText}>
                      {this.props.cancleText ? this.props.cancleText : "Cancel"}
                    </Text>
                  </View>
                  : null
              }
            </View>

          </TouchableWithoutFeedback>
        ) : (
          <View style={styles.emptyView}></View>
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
        <Text
          style={[
            styles.titleText,
            { color: this.props.isWhite ? Colors.black : Colors.TextColor },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {this.props.heading}
        </Text>
      </View>
    );
  }

  _renderRight() {
    return (
      this.props.rightIcon ?
        <View style={styles.rightContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.saveValues();
            }}>
            <View style={styles.rightButtonsTouchableStyle}>
              <Image
                source={penEdit}
                resizeMode="contain"
              />
              <View style={styles.height4} />
              <Text style={styles.cancleText}>{this.props.rightText}</Text>
            </View>
          </TouchableWithoutFeedback>

        </View>
        :
        <View style={styles.rightButtonsContainer}>
          {this.props.showRightText && (
            <TouchableWithoutFeedback
              onPress={() => {
                if (this.props.showRightText == 'Publish') {
                  ReactNativeHapticFeedback.trigger('impactMedium', options);
                }
                this.props.saveValues();
              }}
              style={this.props.rightText === "Save" ? styles.rightButtonSaveTouchable : styles.rightButtonsTouchable}>
              <Text
                style={[styles.rightTextStyle, {
                  color: this.props.isWhite ? Colors.newDescTextColor : Colors.newDescTextColor,
                }]}>
                {this.props.rightText}
              </Text>
            </TouchableWithoutFeedback>
          )}
          {/* {this.props.rightIcon && (
          <TouchableWithoutFeedback onPress={() => this.props.showHideMenu()}>
            <View
              style={styles.moreOptionContainer}>
              <Image source={moreoptions} />
            </View>
          </TouchableWithoutFeedback>
        )} */}
        </View>

    );
  }

  _showWithOutClose = (message: any, color: any) => {
    this.messageRef &&
      this.messageRef._showWithOutClose({ message: message, color: color });
  };

  _show = (message: any, color: any) => {
    this.messageRef && this.messageRef._show({ message: message, color: color });
  };

  _hide = () => {
    this.messageRef && this.messageRef._hide();
  };
  render() {
    let accData = Account.tempData();
    let url =
      accData.instanceURL == '192.168.2.6'
        ? 'calpoly.cueback.com'
        : accData.instanceURL;
    return (
      <View >
        {this.props.isRegisteration ? (
          <View
            style={styles.registrationContainerStyle}>
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
                Actions.pop();
              }}>
              <View style={styles.backArrowContainerSTyle}>
                <Image source={black_arrow} />
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: accData.instanceImage }}
                style={styles.image}
              />
            </View>
            <View style={styles.innerContainer}>
              <TextNew style={styles.communityName}>{accData.name}</TextNew>

              <TextNew style={styles.url}>{url}</TextNew>
            </View>
          </View>
        ) : (
          <View
            style={[styles.mainContainer, { borderBottomWidth: this.props.isWhite ? 2 : 0, borderTopLeftRadius: 12, borderTopRightRadius: 12 }]}>
            <View
              style={styles.subContainer}>
              {this._renderLeft()}
              {this._renderMiddle()}
            </View>
            {(this.props.showRightText || this.props.rightIcon) &&
              this._renderRight()}
          </View>
        )}
        <MessageDialogue ref={ref => (this.messageRef = ref)} />
        {this.props.isWhite && <StatusBar barStyle={Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'} />}
      </View>
    );
  }
}

export default NavigationHeaderSafeArea;
