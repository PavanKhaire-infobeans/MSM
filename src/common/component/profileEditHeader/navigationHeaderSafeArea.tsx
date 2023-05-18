import React, { useRef } from 'react';
import {
  Image,
  Keyboard,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
//@ts-ignore
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { add_new_collection, arrowleft, penEdit, trash } from '../../../../app/images';
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

const NavigationHeaderSafeArea = (props: any) => {
  let messageRef: any | MessageDialogue = useRef(null);

  const _renderLeft = () => {
    return (
      <View>
        {!props.hideClose ? (
          <TouchableWithoutFeedback onPress={() => props.cancelAction()}>
            <View style={[props.addToCollectionOption ? styles.leftButtonAddtoCollectionTouchableContainer : props.noMarginLeft ? styles.leftButtonNoMarginTouchableContainer : styles.leftButtonTouchableContainer,
              // { marginLeft: props.multiValuesPage ? 0 : 0 }
            ]}>
              <Image
                style={
                  props.showRightText
                    ? styles.cancelImage
                    : styles.cancelImageConditional
                }
                resizeMode="center"
                source={
                  props.publishScreen ?
                    arrowleft
                    :
                    props.backIcon
                      ? props.backIcon
                      : props.isWhite
                        ? black_arrow
                        : close_white
                }
              />
              {props.backIcon || props.publishScreen ? (
                <View style={styles.cancleTextContainer}>
                  <Text style={styles.cancleText}>
                    {props.cancleText ? props.cancleText : 'Cancel'}
                  </Text>
                </View>
              ) : null}
            </View>
          </TouchableWithoutFeedback>
        ) :
          props.etherpadScreen ?
            null
            :
            (
              <View style={styles.emptyView}></View>
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
        <Text
          style={[
            styles.titleText,
            { color: props.isWhite ? Colors.newDescTextColor : Colors.TextColor },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {props.heading}
        </Text>
      </View>
    );
  }

  const _renderRight = () => {
    return props.rightIcon ? (
      <View style={styles.rightContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            props.saveValues();
          }}>
          <View style={styles.rightButtonsTouchableStyle}>
            <Image source={props.publishScreen ? trash : props.showNewCollection ? add_new_collection : penEdit} resizeMode="contain" />
            <View style={styles.height4} />
            <Text style={styles.cancleText}>{props.rightText}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    ) : (
      <View style={styles.rightButtonsContainer}>
        {props.showRightText && (
          <TouchableWithoutFeedback
            onPress={() => {
              if (props.showRightText == 'Publish') {
                ReactNativeHapticFeedback.trigger('impactMedium', options);
              }
              props.saveValues();
            }}
            style={
              props.rightText === 'Save'
                ? styles.rightButtonSaveTouchable
                : styles.rightButtonsTouchable
            }>
            <Text
              style={[
                styles.rightTextStyle,
                {
                  color: props.isWhite
                    ? Colors.newDescTextColor
                    : Colors.newDescTextColor,
                },
              ]}>
              {props.rightText}
            </Text>
          </TouchableWithoutFeedback>
        )}
        {/* {props.rightIcon && (
          <TouchableWithoutFeedback onPress={() => props.showHideMenu()}>
            <View
              style={styles.moreOptionContainer}>
              <Image source={moreoptions} />
            </View>
          </TouchableWithoutFeedback>
        )} */}
      </View>
    );
  }

  const _showWithOutClose = (message: any, color: any) => {
    messageRef &&
      messageRef._showWithOutClose({ message: message, color: color });
  };

  const _show = (message: any, color: any) => {
    messageRef && messageRef._show({ message: message, color: color });
  };

  const _hide = () => {
    messageRef && messageRef._hide();
  };

  let accData = Account.tempData();
  let url = accData.instanceURL == '192.168.2.6' ? 'calpoly.cueback.com' : accData.instanceURL;

  return (
    <View style={{ width: '100%' }}>
      {
        props.isRegisteration ? (
          <View style={styles.registrationContainerStyle}>
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
                props.navigation.goBack();
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
        )
          :
          props.publishScreen || props.showNewCollection ? (
            <View
              style={[
                styles.mainContainer,
                {
                  borderBottomWidth: props.isWhite ? 2 : 0,
                  paddingLeft: props.cancleText || props.createMemoryPage ? 0 : 16
                  // borderTopLeftRadius: 12,
                  // borderTopRightRadius: 12,
                },
              ]}>
              <View style={styles.subContainer}>
                {_renderLeft()}
                {_renderMiddle()}
              </View>
              {(props.showRightText || props.rightIcon) ?
                _renderRight()
                :
                null}
            </View>
          )
            : (
              <View
                style={[
                  styles.mainContainer,
                  {
                    borderBottomWidth: props.isWhite ? 2 : 0,
                    paddingLeft: props.cancleText || props.createMemoryPage ? 0 : 16
                    // borderTopLeftRadius: 12,
                    // borderTopRightRadius: 12,
                  },
                ]}>
                <View style={styles.subContainer}>
                  {_renderLeft()}
                  {_renderMiddle()}
                </View>
                {(props.showRightText || props.rightIcon) ?
                  _renderRight()
                  :
                  null}
              </View>
            )}
      <MessageDialogue ref={ref => (messageRef = ref)} />
      {props.isWhite && (
        <StatusBar
          barStyle={
            Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
          }
        />
      )}
    </View>
  );
};

NavigationHeaderSafeArea.defaultProps = {
  showRightText: false,
};
export default NavigationHeaderSafeArea;
