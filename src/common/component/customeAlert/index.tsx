import React, {useState} from 'react';
import {Modal, Platform, Pressable, Text, View} from 'react-native';
import {Colors, ConsoleType, fontFamily, showConsoleLog} from '../../constants';
import styles from './styles';

const CustomAlert = props => {
  const [androidDefaults, setAndroidDefaults] = useState({
    container: {
      backgroundColor:
        (props.android &&
          props.android.container &&
          props.android.container.backgroundColor) ||
        Colors.white,
    },
    title: {
      color:
        (props.android && props.android.title && props.android.title.color) ||
        Colors.black,
      fontFamily: fontFamily.RobotoMedium,
      fontSize:
        (props.android &&
          props.android.title &&
          props.android.title.fontSize) ||
        20,
      lineHeight: 24,
      fontWeight:
        (props.android &&
          props.android.title &&
          props.android.title.fontWeight) ||
        'bold',
    },
    message: {
      color:
        (props.android &&
          props.android.message &&
          props.android.message.color) ||
        Colors.blackOpacity60,
      fontFamily: fontFamily.Roboto,
      //   fontFamily: (props.android && props.android.message && props.android.message.fontFamily) || 'initial',
      fontSize:
        (props.android &&
          props.android.message &&
          props.android.message.fontSize) ||
        15,
      lineHeight: 24,
      fontWeight:
        (props.android &&
          props.android.message &&
          props.android.message.fontWeight) ||
        'normal',
    },
    button: {
      color: '#6200EE',
      fontFamily: fontFamily.RobotoMedium,
      fontSize: 14,
      lineHeight: 16,
      fontWeight: '500',
      textTransform: 'uppercase',
      backgroundColor: 'transparent',
    },
  });
  const [iOSDefaults, setIOSDefaults] = useState({
    container: {
      backgroundColor:
        (props.ios &&
          props.ios.container &&
          props.ios.container.backgroundColor) ||
        Colors.grayColor,
    },
    title: {
      color:
        (props.ios && props.ios.title && props.ios.title.color) || Colors.black,
      fontFamily:
        (props.ios && props.ios.title && props.ios.title.fontFamily) ||
        fontFamily.SFPro,
      fontSize:
        (props.ios && props.ios.title && props.ios.title.fontSize) || 17,
      lineHeight: 22,
      fontWeight:
        (props.ios && props.ios.title && props.ios.title.fontWeight) || '600',
    },
    message: {
      color:
        (props.ios && props.ios.message && props.ios.message.color) ||
        Colors.black,
      fontFamily:
        (props.ios && props.ios.message && props.ios.message.fontFamily) ||
        fontFamily.SFPro,
      fontSize:
        (props.ios && props.ios.message && props.ios.message.fontSize) || 13,
      lineHeight: 18,
      fontWeight:
        (props.ios && props.ios.message && props.ios.message.fontWeight) ||
        '400',
    },
    button: {
      color: '#007AFF',
      fontFamily: fontFamily.SFPro,
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '600',
      textTransform: 'none',
      backgroundColor: 'transparent',
    },
  });
  const AndroidButtonBox = () => {
    const [buttonLayoutHorizontal, setButtonLayoutHorizontal] = useState(1);
    const buttonProps =
      props.buttons && props.buttons.length > 0 ? props.buttons : [{}];

    showConsoleLog(
      ConsoleType.LOG,
      'buttonPropsAndroid :',
      JSON.stringify(buttonProps),
    );
    return (
      <View
        style={[
          styles.androidButtonGroup,
          {
            flexDirection: 'column', //buttonLayoutHorizontal === 1 ? "row" : "column",
          },
        ]}
        onLayout={e => {
          if (e.nativeEvent.layout.height > 60) setButtonLayoutHorizontal(0);
        }}>
        {buttonProps.map((item, index) => {
          if (index > 2) return null;
          const alignSelfProperty = 'flex-end'; //buttonProps.length > 2 && index === 0 && buttonLayoutHorizontal === 1 ? 'flex-start' : 'flex-end';
          let defaultButtonText = 'OK';
          if (buttonProps.length > 2) {
            if (index === 0) defaultButtonText = 'ASK ME LATER';
            else if (index === 1) defaultButtonText = 'CANCEL';
          } else if (buttonProps.length === 2 && index === 0)
            defaultButtonText = 'CANCEL';
          return (
            // index === 0 && buttonLayoutHorizontal === 1 ? { flex: 1 } : {}
            <View style={[styles.androidButton]}>
              <Pressable
                onPress={() => {
                  // props.setModalVisible(false)
                  if (item.func && typeof item.func === 'function') item.func();
                }}
                style={[
                  {
                    alignSelf: alignSelfProperty,
                  },
                ]}>
                <View
                  style={[
                    styles.androidButtonInner,
                    {
                      backgroundColor:
                        (item.styles && item.styles.backgroundColor) ||
                        androidDefaults.button.backgroundColor,
                    },
                  ]}>
                  <Text
                    style={{
                      color:
                        (item.styles && item.styles.color) ||
                        androidDefaults.button.color,
                      fontFamily:
                        (item.styles && item.styles.fontFamily) ||
                        androidDefaults.button.fontFamily,
                      fontSize:
                        (item.styles && item.styles.fontSize) ||
                        androidDefaults.button.fontSize,
                      fontWeight:
                        (item.styles && item.styles.fontWeight) ||
                        androidDefaults.button.fontWeight,
                      textTransform:
                        (item.styles && item.styles.textTransform) ||
                        androidDefaults.button.textTransform,
                    }}>
                    {(item.text && item.text.toUpperCase()) ||
                      defaultButtonText}
                  </Text>
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
    );
  };
  const IOSButtonBox = () => {
    const buttonProps =
      props.buttons && props.buttons.length > 0 ? props.buttons : [{}];
    const [buttonLayoutHorizontal, setButtonLayoutHorizontal] = useState(
      buttonProps.length === 2 ? 1 : 0,
    );

    return (
      <View
        style={[
          styles.iOSButtonGroup,
          {
            flexDirection: 'column', //buttonLayoutHorizontal === 1 ? "row" : "column",
          },
        ]}
        onLayout={e => {
          if (e.nativeEvent.layout.height > 60) setButtonLayoutHorizontal(0);
        }}>
        {buttonProps.map((item, index) => {
          let defaultButtonText = 'OK';
          if (buttonProps.length > 2) {
            if (index === 0) defaultButtonText = 'ASK ME LATER';
            else if (index === 1) defaultButtonText = 'CANCEL';
          } else if (buttonProps.length === 2 && index === 0)
            defaultButtonText = 'CANCEL';
          const singleButtonWrapperStyle = {};
          let singleButtonWeight = iOSDefaults.button.fontWeight;

          return (
            <View
              key={index + '' + (item.text || defaultButtonText)}
              style={[styles.iOSButton, singleButtonWrapperStyle]}>
              <Pressable
                onPress={() => {
                  // props.setModalVisible(false)
                  if (item.func && typeof item.func === 'function') item.func();
                }}>
                <View
                  style={[
                    styles.iOSButtonInner,
                    {
                      backgroundColor:
                        (item.styles && item.styles.backgroundColor) ||
                        iOSDefaults.button.backgroundColor,
                    },
                  ]}>
                  <Text
                    style={{
                      color:
                        (item.styles && item.styles.color) ||
                        iOSDefaults.button.color,
                      fontFamily:
                        (item.styles && item.styles.fontFamily) ||
                        iOSDefaults.button.fontFamily,
                      fontSize:
                        (item.styles && item.styles.fontSize) ||
                        iOSDefaults.button.fontSize,
                      fontWeight:
                        (item.styles && item.styles.fontWeight) ||
                        singleButtonWeight,
                      textTransform:
                        (item.styles && item.styles.textTransform) ||
                        iOSDefaults.button.textTransform,
                      textAlign: 'center',
                    }}>
                    {item.text || defaultButtonText}
                  </Text>
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        //   props.setModalVisible(false);
      }}>
      <Pressable
        style={[
          Platform.OS === 'ios' ? styles.iOSBackdrop : styles.androidBackdrop,
          styles.backdrop,
        ]}
        onPress={() => {
          // props.setModalVisible(false)
        }}
      />
      <View style={styles.alertBox}>
        {Platform.OS === 'ios' ? (
          <View style={[styles.iOSAlertBox, iOSDefaults.container]}>
            <Text style={[styles.iOSTitle, iOSDefaults.title]}>
              {props.title || 'Message'}
            </Text>
            <Text style={[styles.iOSMessage, iOSDefaults.message]}>
              {props.message || ''}
            </Text>
            <IOSButtonBox />
          </View>
        ) : (
          <View style={[styles.androidAlertBox, androidDefaults.container]}>
            <Text style={[styles.androidTitle, androidDefaults.title]}>
              {props.title || 'Message'}
            </Text>
            <Text style={[styles.androidMessage, androidDefaults.message]}>
              {props.message || ''}
            </Text>
            <AndroidButtonBox />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default CustomAlert;
