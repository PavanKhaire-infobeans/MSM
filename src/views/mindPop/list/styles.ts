import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../../common/constants';

const Styles = EStyleSheet.create({
  emptyViewContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noMindpop: {
    paddingTop: 30,
    color: Colors.TextColor,
    ...fontSize(18)
  },
  emptyMindpop: {
    alignItems: 'center',
    padding: 15,
  },
  whataremindpopText: {
    padding: 20,
    paddingTop: 22,
    paddingBottom: 8,
    textAlign: 'center',
    ...fontSize(18),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.IntersemiBold,
    fontWeight: '600',
    color: Colors.TextColor,
  },
  mindpopdesc: {
    textAlign: 'center',
    paddingBottom: 24,
    ...fontSize(18),
    fontWeight: '400',
    fontFamily: fontFamily.Inter,
    color: Colors.TextColor,
  },
  container: { flex: 1 },
  noflexContainer: {
    width: "100%",
    flex: 0,
    backgroundColor: Colors.NewThemeColor
  },
  mainContainer: {
    width: "100%",
    flex: 1,
    backgroundColor: Colors.white
  },
  imageContainerStyle:{
    height: 64,
    width: 64,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:Colors.SerachbarColor
  },
  customContainer: {
    backgroundColor: Colors.white
  },
  customTitle: {
    color: Colors.black,
    fontFamily: fontFamily.SFPro,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22
  },
  customMessage: {
    color: Colors.black,
    fontFamily: fontFamily.SFPro,
    fontSize: 16,
    fontWeight: '500',
  },
  customiOSContainer: {
    backgroundColor: Colors.grayColor
  },
  customiOSTitle: {
    color: Colors.black,
    lineHeight: 22,
    fontSize: 17,
    fontWeight: '600',
  },
  customiOSMessage: {
    color: Colors.black,
    // fontFamily: fontFamily.Inter,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  buttonStyle: {
    lineHeight: 22,
    fontSize: 17,
    fontWeight: '600',
  },
  messageContainer:{
    borderColor: "#DCDCDC",
    borderWidth: 2,
    borderTopWidth: 1,
    borderRadius: 5
  },
  messageSubContainer:{
    width: "100%",
    padding: 16,
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between"
  },
  mesageSubContainer:{ flex: 1, marginLeft: 5 },
  convertoMemoryContainer:{
    height: 50, 
    width: "100%",
    backgroundColor: Colors.NewLightThemeColor,
    position: "absolute",
    bottom: 0,
    borderColor: "#DCDCDC",
    borderWidth: 2,
    borderTopWidth: 1,
    borderBottomWidth: 2,
    justifyContent: "center",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  convertoMemory:{
    fontWeight: '500',
    ...fontSize(18),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.NewTitleColor,
    paddingLeft: 15
  },
  uploadText:{ 
    position: "absolute", 
    width: "100%", 
    textAlign: "center", 
    top: "50%" 
  },
  AppIntroContainer:{
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  currentIndexStyle:{ 
    flex: 1, 
    width: '100%' 
  },
  closeGuideButton:{ 
    height: 50, 
    left: '85%', 
    zIndex: 999, 
    top: 10 
  },
  descTextStyle:{
    ...fontSize(20),
    color: Colors.white,
    fontWeight: '400',
    marginTop: 5,
  },
  circleContainer:{ flexDirection: 'row', marginTop: 10 },
  circleStyle:{
    height: 5,
    borderRadius: 1,
    width: 16,
    marginRight: 5,
  },
  buttonhighLightStyle:{ paddingVertical: 20 },
  prevContainer:{
    backgroundColor: Colors.white,
    width: 80,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevText:{
    ...fontSize(18),
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
  },
  nextText:{
    ...fontSize(18),
    color: Colors.white,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
  },
  nextButton:{ paddingVertical: 20, marginLeft: 20 },
  safeAreaContainer:{ 
    width: '100%', 
    height: '100%', 
    overflow: 'hidden' 
  },

  titleText: {
    color: Colors.TextColor,
    ...fontSize(18),
    lineHeight: 20,
    textAlign: 'left',
    fontFamily: 'Inter',
    fontWeight: '500',
  },

  titleContainer: { justifyContent: 'center', paddingTop: 10 },

  leftButtonTouchableContainer: {
    justifyContent: 'center',
    padding: 15,
    marginTop: 5,
  },

  leftButtonContainer: {
    backgroundColor: 'transparent',
    borderColor: Colors.white,
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

  leftButtonLogo: { 
    width: 20, 
    height: 20 
  },
  imageStyle:{ 
    height: 28, 
    width: 28 
  },
  titleStyle:{
    ...fontSize(16),
    fontWeight: '400',
    color: Colors.TextColor,
  },
  navigationBarContainer:{
    flexDirection: 'row',
    backgroundColor: Colors.NewThemeColor,
    height: 54,
  },
  iconContainer:{ 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginEnd: 10 
  },
  rightButtonsContainer: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  rightButtonsTouchable: { padding: 5, paddingRight: 10 },

  rightButtonsBackgroundImage: { width: 30, height: 30 },

  rightButtonsBadge: {
    position: 'absolute',
    height: 16,
    right: 5,
    top: 5,
    backgroundColor: '#ff0000',
    borderColor: Colors.white,
    borderWidth: 1,
    borderRadius: 8,
    alignContent: 'center',
  },

  rightButtonsBadgeText: { ...fontSize(10), color: Colors.white },
});

export default Styles;