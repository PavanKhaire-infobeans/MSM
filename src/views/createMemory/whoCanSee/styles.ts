import { Platform, StyleSheet } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../../common/constants';
import Utility from '../../../common/utility';

const Styles = EStyleSheet.create({
  visiblityImageContainer: { padding: 15 },
  container: {
    flex: 1
  },
  invisibleContainer: {
    width: '100%',
    flex: 0,
    backgroundColor: Colors.NewThemeColor
  },
  safeAreaContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: Colors.white
  },
  whoElsetextStyle: {
    width: '100%',
    padding: 24,
    color: Colors.bordercolor,
    fontFamily: fontFamily.Inter,
    ...fontSize(19),
    lineHeight:23
  },
  loginTextStyle:{ 
    color: Colors.white, 
    fontFamily: fontFamily.Inter,
    marginRight: 12
  },
  loginSSOButtonStyle:{
    width: Utility.getDeviceWidth()-32, 
    height: 44,
    alignSelf: "center", 
    alignItems: "center", 
    justifyContent: "center", 
    flexDirection: "row",
    borderRadius: 1000, 
    backgroundColor: Colors.bordercolor,
    marginBottom:16
  },
  borderStyle: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.bottomTabColor
  },
  ShareOptionsItemStyle: {
    padding: 15,
    flexDirection: 'row'
  },
  imageStyle: {
    height: 25,
    width: 25
  },
  shareOptionsStyle: {
    marginLeft:8,
    ...fontSize(19),
    lineHeight:23,
    color:Colors.newDescTextColor,
    fontFamily: fontFamily.Inter
  },
  shareOptionContainerStyle: {
    // flex: 1,
    height:56,
    width:Utility.getDeviceWidth()-48,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.bottomTabColor,
    justifyContent: 'center',
    borderRadius: 8,
    // paddingTop: 20,
  },
  shareOptionSubContainerStyle: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    // paddingV: 24,
  },
  optionsTextStyle: {
    flex: 1,
    color: Colors.bordercolor,
    fontFamily: fontFamily.Inter,
    ...fontSize(19),
    lineHeight:23
  },
  showErrorStyle: {
    ...fontSize(14),
    fontFamily: fontFamily.Inter,
    paddingTop: 5,
    color: Colors.ErrorColor,
  }
});

export default Styles;
