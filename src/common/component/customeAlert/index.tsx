import React, { useState } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";
import { Colors } from "../../constants";
import styles from './styles';

const CustomAlert = (props) => {

  const [androidDefaults, setAndroidDefaults] = useState({
    container: {
      backgroundColor: (props.android && props.android.container && props.android.container.backgroundColor) || '#FAFAFA',
    },
    title: {
      color: (props.android && props.android.title && props.android.title.color) || Colors.black,
      //   fontFamily: (props.android && props.android.title && props.android.title.fontFamily) || 'initial',
      fontSize: (props.android && props.android.title && props.android.title.fontSize) || 22,
      fontWeight: (props.android && props.android.title && props.android.title.fontWeight) || 'bold',
    },
    message: {
      color: (props.android && props.android.message && props.android.message.color) || Colors.black,
      //   fontFamily: (props.android && props.android.message && props.android.message.fontFamily) || 'initial',
      fontSize: (props.android && props.android.message && props.android.message.fontSize) || 15,
      fontWeight: (props.android && props.android.message && props.android.message.fontWeight) || 'normal',
    },
    button: {
      color: '#6200EE',
      //   fontFamily: 'initial',
      fontSize: 16,
      fontWeight: '500',
      textTransform: 'uppercase',
      backgroundColor: 'transparent',
    },
  });
  const [iOSDefaults, setIOSDefaults] = useState({
    container: {
      backgroundColor: (props.ios && props.ios.container && props.ios.container.backgroundColor) || '#D4D4D4',
    },
    title: {
      color: (props.ios && props.ios.title && props.ios.title.color) || Colors.black,
      //   fontFamily: (props.ios && props.ios.title && props.ios.title.fontFamily) || 'initial',
      fontSize: (props.ios && props.ios.title && props.ios.title.fontSize) || 17,
      fontWeight: (props.ios && props.ios.title && props.ios.title.fontWeight) || '600',
    },
    message: {
      color: (props.ios && props.ios.message && props.ios.message.color) || Colors.black,
      //   fontFamily: (props.ios && props.ios.message && props.ios.message.fontFamily) || 'initial',
      fontSize: (props.ios && props.ios.message && props.ios.message.fontSize) || 13,
      fontWeight: (props.ios && props.ios.message && props.ios.message.fontWeight) || 'normal',
    },
    button: {
      color: '#007AFF',
      //   fontFamily: 'initial',
      fontSize: 17,
      lineHeight:22,
      fontWeight: '400',
      textTransform: 'none',
      backgroundColor: 'transparent',
    },
  });
  const AndroidButtonBox = () => {
    const [buttonLayoutHorizontal, setButtonLayoutHorizontal] = useState(1);
    const buttonProps = props.buttons && props.buttons.length > 0 ? props.buttons : [{}]

    console.log("buttonPropsAndroid :",JSON.stringify(buttonProps))
    return (
      <View style={[styles.androidButtonGroup, {
        flexDirection: "column",//buttonLayoutHorizontal === 1 ? "row" : "column",
      }]} onLayout={(e) => {
        if (e.nativeEvent.layout.height > 60)
          setButtonLayoutHorizontal(0);
      }}>
        {
          buttonProps.map((item, index) => {
            if (index > 2) return null;
            const alignSelfProperty = 'flex-end';//buttonProps.length > 2 && index === 0 && buttonLayoutHorizontal === 1 ? 'flex-start' : 'flex-end';
            let defaultButtonText = 'OK'
            if (buttonProps.length > 2) {
              if (index === 0)
                defaultButtonText = 'ASK ME LATER'
              else if (index === 1)
                defaultButtonText = 'CANCEL';
            } else if (buttonProps.length === 2 && index === 0)
              defaultButtonText = 'CANCEL';
            return (
              // index === 0 && buttonLayoutHorizontal === 1 ? { flex: 1 } : {}
              <View style={[styles.androidButton, ]}>
                <Pressable onPress={() => {
                  // props.setModalVisible(false)
                  if (item.func && typeof (item.func) === 'function')
                    item.func();
                }} style={[{
                  alignSelf: alignSelfProperty,

                }]}>
                  <View style={[styles.androidButtonInner, { backgroundColor: (item.styles && item.styles.backgroundColor) || androidDefaults.button.backgroundColor }]}>
                    <Text
                      style={{
                        color: (item.styles && item.styles.color) || androidDefaults.button.color,
                        fontFamily: (item.styles && item.styles.fontFamily) || androidDefaults.button.fontFamily,
                        fontSize: (item.styles && item.styles.fontSize) || androidDefaults.button.fontSize,
                        fontWeight: (item.styles && item.styles.fontWeight) || androidDefaults.button.fontWeight,
                        textTransform: (item.styles && item.styles.textTransform) || androidDefaults.button.textTransform,
                      }}
                    >{(item.text && item.text.toUpperCase()) || defaultButtonText}</Text>
                  </View>
                </Pressable>
              </View>
            )
          })

        }
      </View>
    );
  }
  const IOSButtonBox = () => {
    const buttonProps = props.buttons && props.buttons.length > 0 ? props.buttons : [{}]
    const [buttonLayoutHorizontal, setButtonLayoutHorizontal] = useState(buttonProps.length === 2 ? 1 : 0);


    return (
      <View style={[styles.iOSButtonGroup, {
        flexDirection: "column",//buttonLayoutHorizontal === 1 ? "row" : "column",
      }]} onLayout={(e) => {
        if (e.nativeEvent.layout.height > 60)
          setButtonLayoutHorizontal(0);
      }}>
        {
          buttonProps.map((item, index) => {
            let defaultButtonText = 'OK'
            if (buttonProps.length > 2) {
              if (index === 0)
                defaultButtonText = 'ASK ME LATER'
              else if (index === 1)
                defaultButtonText = 'CANCEL';
            }
            else if (buttonProps.length === 2 && index === 0)
              defaultButtonText = 'CANCEL';
            const singleButtonWrapperStyle = {}
            let singleButtonWeight = iOSDefaults.button.fontWeight;
            //   if(index === buttonProps.length - 1){
            //       singleButtonWeight = '700';
            //   }
            //   if(buttonLayoutHorizontal === 1){
            //     singleButtonWrapperStyle.minWidth = '50%';
            //     if(index === 0){
            //       singleButtonWrapperStyle.borderStyle = 'solid';
            //       singleButtonWrapperStyle.borderRightWidth = 0.55;
            //       singleButtonWrapperStyle.borderRightColor = '#dbdbdf';
            //     }

            //   }
            return (
              <View key={index + "" + (item.text || defaultButtonText)} style={[styles.iOSButton, singleButtonWrapperStyle]}>
                <Pressable onPress={() => {
                  // props.setModalVisible(false)
                  if (item.func && typeof (item.func) === 'function')
                    item.func();
                }}>
                  <View style={[styles.iOSButtonInner, { backgroundColor: (item.styles && item.styles.backgroundColor) || iOSDefaults.button.backgroundColor }]}>
                    <Text
                      style={{
                        color: (item.styles && item.styles.color) || iOSDefaults.button.color,
                        fontFamily: (item.styles && item.styles.fontFamily) || iOSDefaults.button.fontFamily,
                        fontSize: (item.styles && item.styles.fontSize) || iOSDefaults.button.fontSize,
                        fontWeight: (item.styles && item.styles.fontWeight) || singleButtonWeight,
                        textTransform: (item.styles && item.styles.textTransform) || iOSDefaults.button.textTransform,
                        textAlign: 'center'
                      }}
                    >{item.text || defaultButtonText}</Text>
                  </View>
                </Pressable>
              </View>
            )
          })

        }
      </View>
    );
  }
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        //   props.setModalVisible(false);
      }}
    >
      <Pressable style={[Platform.OS === "ios" ? styles.iOSBackdrop : styles.androidBackdrop, styles.backdrop]} onPress={() => {
        // props.setModalVisible(false)

      }
        } />
      <View style={styles.alertBox}>
        {
          Platform.OS === "ios" ?
            <View style={[styles.iOSAlertBox, iOSDefaults.container]}>
              <Text style={[styles.iOSTitle, iOSDefaults.title]}>{props.title || 'Message'}</Text>
              <Text style={[styles.iOSMessage, iOSDefaults.message]}>{props.message || ''}</Text>
              <IOSButtonBox />
            </View>
            :
            <View style={[styles.androidAlertBox, androidDefaults.container]}>
              <Text style={[styles.androidTitle, androidDefaults.title]}>{props.title || 'Message'}</Text>
              <Text style={[styles.androidMessage, androidDefaults.message]}>{props.message || ''}</Text>
              <AndroidButtonBox />
            </View>
        }
      </View>


    </Modal>
  )
}

export default CustomAlert;