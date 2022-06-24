import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
  
    button: {
      borderRadius: 14,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
  
    iOSBackdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      // opacity: 0.3
    },
    androidBackdrop: {
      backgroundColor: "#232f34",
      opacity: 0.4
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    alertBox: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    androidAlertBox: {
      maxWidth: 280,
      width: '100%',
      margin: 48,
      elevation: 24,
      borderRadius: 4,
    },
    androidTitle: {
      margin: 24,
    },
    androidMessage: {
      marginLeft: 24,
      marginRight: 24,
      marginBottom: 24,
    },
    androidButtonGroup: {
      marginTop: 0,
      marginRight: 0,
      marginBottom: 8,
      marginLeft: 24,
    },
    androidButton: {
      marginTop: 12,
      marginRight: 8,    
    },
    androidButtonInner: {
      padding: 10,
  
    },
  
    iOSAlertBox: {
      maxWidth: 270,
      width: '100%',
      zIndex: 10,
      borderRadius: 14,
    },
    iOSTitle: {
      paddingTop: 12,
      paddingRight: 16,
      paddingBottom: 7,
      paddingLeft: 16,
      marginTop: 8,
      textAlign: "center",
    },
    iOSMessage: {
      paddingTop: 0,
      paddingRight: 16,
      paddingBottom: 21,
      paddingLeft: 16,
      textAlign: "center"
    },
    iOSButtonGroup: {
      marginRight: -0.55
    },
    iOSButton: {

      borderTopColor: '#9D9D9A',
      borderTopWidth: 0.55,
      borderStyle: 'solid',
    },
    iOSButtonInner: {
      minHeight: 44,
      justifyContent: 'center'
    }
  });

export default styles;