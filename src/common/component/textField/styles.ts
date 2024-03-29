import { StyleSheet, Platform } from 'react-native';
import { Colors, fontFamily, fontSize } from '../../constants';

export const styles = StyleSheet.create({
  inputViewStyle: {
    flex: 1,
    height: 56,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.bottomTabColor,
    borderRadius: 8,
    justifyContent: 'center',
    paddingLeft: 24,
    // paddingRight: 3,
    // paddingTop: 3,
  },
  onFocusStyle:{
    borderColor: Colors.bordercolor,
    borderWidth: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3.22,
    elevation: 3,
  },
  textwrapStyle:{
    justifyContent: 'center',
    flexGrow: 0,
    flexWrap: 'nowrap'
  },
  secureTextView:{ 
    width: '10%', 
    position: 'absolute', 
    right: 5, 
    top: 3 
  },
  width0:{ width: 0 },
  inputTextStyle: {
    // paddingTop: Platform.OS == 'ios' ? 15 : 30,
    height: 56,
    ...fontSize(19),
    color: Colors.bordercolor,
    fontFamily:fontFamily.Inter,
    fontWeight:'400',
    lineHeight: 24,
    letterSpacing: -0.1,
    // paddingRight: 20,
  },
  container: {
    flexDirection: 'column',
    // marginBottom: 5,
    height:56,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%'
  },
  animatedView: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  animatedTextStyle: {
    position: 'absolute',
    fontFamily: fontFamily.Inter,
    left: 8,
  },
  passwordToggleContainer: {
    width: Platform.OS == 'ios' ? 50 : 70,
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5,
    backgroundColor:Colors.transparent
  },
  visiblalityButtonContainer: {
    zIndex: 99999,
    // padding: 5,
    // paddingTop: 10,
    paddingRight: 24,
    // width: 70,
    // height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossContainer: {
    padding: 5,
    right: 0,
    top: 3,
    position: 'absolute',
    backgroundColor:Colors.white,
    marginRight: 3,
  },
  marginLeftImg: {
    marginLeft: 10
  },
  textInputStyle: {
    color: Colors.bordercolor,
    ...fontSize(19),
    height:56,
    fontWeight:'400',
    lineHeight:23.75,
    fontFamily: fontFamily.Inter,
    backgroundColor: Colors.transparent,
  },
  imageStyle: {
    tintColor: Colors.TextColor,
  },
  crossImageStyle: {
    justifyContent: 'center',
    width: 1,
    height: 1,
  },
  passwordStrengthContainer:{ 
    flexDirection: 'row', 
    // marginTop: 8, 
    // marginBottom: 2 
  },
  passwordArrayStyle:{
    width: '31%',
    height: 2,
    marginRight: '2%',
    borderRadius: 19,
  },
  passwordStrengthTextStyle:{
    ...fontSize(14),
    marginTop: 5,
    fontFamily: fontFamily.Inter,
    lineHeight: 13,
  },
  passwordTextStyle:{ 
    fontWeight: '500', 
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium
  },
  animatedViewStyle:{
    width: '100%',
    alignItems: 'flex-start',//flex-end
  },
  minWidth:{ 
    // minWidth: 180 
  },
  errorTextStyle:{
    ...fontSize(13),
    color: Colors.ErrorColor,//ErrorColor,
    marginTop: 3,
    lineHeight: 16,
    textAlign:'right',
    // marginLeft:5,
    letterSpacing: -0.1,
    fontFamily: fontFamily.Inter,
  }
});
