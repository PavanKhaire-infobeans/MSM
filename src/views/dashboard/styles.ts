import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../common/constants';
import Utility from '../../common/utility';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

const Styles = EStyleSheet.create({

  flexContainer: {
    flex: 1
  },
  scrollViewStyle: {
    flex: 1,
    marginBottom: 30
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
  globeImageStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 5,
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
  animatedViewContainer: {
    width: Dimensions.get('screen').width,
    justifyContent: "center",
    alignItems: "center",
  },
  appIntroContainer: {
    flex: 1,
    width: '90%'
  },
  textStyles: {
    marginTop: 16,
    color: Colors.black
  },
  getStartedText: { marginTop: Platform.OS == 'ios' ? 20 : 10 },
  nextTextStyle: {
    marginLeft: 0,
    marginRight: 10,
    color: Colors.white
  },
  nameContainer: {
    height: '100%',
    width: '100%',
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    // backgroundColor: Colors.white, 
    overflow: 'hidden'
  },
  nameSubContainer: {
    backgroundColor: Colors.white,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 12
  },
  titleDescContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 16
  },
  appIntroTitleStyle: {
    ...fontSize(30),
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    textAlign: 'center'
  },
  iconStyle: {
    height: 22,
    width: 25,
    marginBottom: -2
  },
  appIntroDescStyle: {
    ...fontSize(18),
    fontWeight: '400',
    fontFamily: fontFamily.Inter,
    textAlign: 'center'
  },
  memoryFromContainerStyle: {
    padding: 16,
  },
  memoryFromTextStyle: {
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.newTextColor,
    ...fontSize(18)
  },
  textTopStyle: {
    marginTop: 12,
    lineHeight: 30
  },
  lottieContainer: {
    flex: 0.95,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lottieImageSourceStyle: {
    width: "90%",
    flex: 1,
    bottom: 0,
    height: "90%",
    backgroundColor: Colors.lightSkyBlue
  },
  tourContainerStyle: {
    justifyContent: "center",
    alignItems: "center",
    height: "90%"
  },
  renderDismissPopUpContainerStyle: {
    flex: 1,
    backgroundColor: Colors.colorBlackOpacity7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  renderDismissPopUpSubContainerStyle: {
    width: '90%',
    borderRadius: 10,
    backgroundColor: Colors.white,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullWidth: {
    width: '100%'
  },
  justifyalignCenetr: {
    justifyContent: "center",
    alignItems: "center"
  },
  imageLogoStyle: {
    margin: 10
  },
  showMemoryCreationView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: Colors.lightSkyBlue
  },
  closeImage: {
    top: Platform.OS == 'ios' ? 20 : 0,
    zIndex: 99999
  },
  submitButnStyle: {
    backgroundColor: Colors.ThemeColor,
    fontFamily: fontFamily.Inter,
    ...fontSize(22)
  },
  submitButtonStyle: {
    backgroundColor: Colors.ThemeColor,
    fontFamily: fontFamily.Inter,
    justifyContent: "center",
    width: "75%",
    ...fontSize(22)
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
    borderWidth: 2,
    borderColor: Colors.ThemeColor,
    borderRadius: 4,
    height: Size.byWidth(48),
    alignItems: "center",
    justifyContent: "center"
  },
  orTextStyle: {
    ...fontSize(20),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.BtnBgColor
  },
  beginTourContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.lightSkyBlue
  },

  beginTourCarouselContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    top: Platform.OS == "ios" ? 30 : 10,
    backgroundColor: Colors.lightSkyBlue
  },
  beginTourCarouselBtnContainer: {
    flexDirection: "row",
    marginTop: Platform.OS == "ios" ? 20 : 10,
    justifyContent: "center",
    alignItems: "center"
  },
  alignItemsCenter: {
    alignItems: 'center'
  },
  imageContainerStyle: {
    justifyContent: "center",
    margin: 5
  },
  closeContainerSTyle: { right: -90 },
  butnContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    width: "100%",
    top: 0,
    paddingBottom: 10
  },
  prevBtnContainer: {
    borderColor: Colors.BtnBgColor,
    borderWidth: 2,
    marginLeft: 16,
    borderRadius: 5
  },
  backBtnContainer: {
    backgroundColor: Colors.white,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5,
    alignItems: 'center'
  },
  backTextStyle: {
    fontWeight: '400',
    ...fontSize(17),
    color: Colors.BtnBgColor,
    marginLeft: 10
  },
  nextBtnStyle: {
    borderColor: Colors.BtnBgColor,
    borderWidth: 2,
    marginRight: 16,
    borderRadius: 8,
  },
  newBackContainer: {
    alignItems: 'flex-start',
    width: "100%",
    bottom: Platform.OS == 'ios' ? 20 : 50,
    zIndex: 99999
  },
  newBackbuttonStyle: { marginLeft: 16 },
  saveLaterContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeContainerStyle: {
    alignItems: "flex-end",
    paddingRight: 20,
    paddingTop: 30
  },
  closeBtnStyle: {
    alignItems: "flex-end",
    paddingRight: 2
  },
  fullFlex: {
    flex: 1
  },
  emptySafeAreaStyle: {
    width: '100%',
    flex: 0,
    backgroundColor: Colors.NewThemeColor,
  },
  SafeAreaViewContainerStyle: {
    width: '100%',
    flex: 1,
    backgroundColor: Colors.white
  },
  navigationHeaderContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 16,
    paddingLeft: 16
  },
  filter: { ...fontSize(16) },
  filterButnContainerStyle: {
    width: '100%',
    height: 40,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dedede'
  },
  filterContainerStyle: {
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.NewLightCommentHeader,
    padding: 16,
  },

  filterHeaderText: {
    ...fontSize(19),
    padding: 10,
    fontWeight: '400',
    fontFamily: 'Inter',
    color: Colors.TextColor,
  },
  filterItem: {
    // margin: 10,
    marginLeft: '5%',
    // marginRight:'2%',
    marginTop: '2%',
    marginBottom: '2%',
    padding: 12,
    // paddingBottom: 7,
    // paddingTop: 7,
    height: 100,
    borderRadius: 5,
    width: '42%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    ...fontSize(19),
    fontWeight: '400',
    // fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    paddingLeft: 2,
    paddingTop: 2,
    paddingBottom: 5,
    paddingRight: 5,
    fontFamily: 'Inter'
  },
  bottomView: {
    height: Platform.OS == 'ios' ? 70 : 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 0.5,
    borderColor: Colors.white,
    width: '100%',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 4,
    shadowRadius: 2,
    elevation: 3,
  },
  shadowBoxStyle: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    elevation: 3,
    shadowRadius: 3.22,
    borderColor: Colors.decadeFilterBorder
  },
  justifyContentSpaceBetween: {
    justifyContent: 'space-between'
  },
  justifyContentSpaceevenAlignCenter:
  {
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  justifyContentCenterAlignCenter:
  {
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12
  },
  jumptoYearContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 52
  },
  flexWrapFlexRow: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  jumptoScreenContainer: {
    height: Utility.getDeviceHeight() - (64 + (StaticSafeAreaInsets.safeAreaInsetsTop ? StaticSafeAreaInsets.safeAreaInsetsTop : 0)),
    width: '100%',
    // backgroundColor: Colors.blacknew, 
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  jumptoScreenSubContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.white
  },
  jumptoCancelContainerStyle: {
    height: 82,
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bottomTabColor,
  },
  jumptoCancelSubContainerStyle: {
    height: 46,
    width: 60,
    marginTop: 17,
    marginLeft: 16,
    justifyContent: 'space-between'
  },
  cancelImageStyle: {
    height: 24,
    width: 24,
    alignSelf: 'center'
  },
  cancelTextStyle: {
    textAlign: 'center',
    ...fontSize(14),
    lineHeight: 17.5,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500'
  },
  filterItemJumpto: {
    width: Dimensions.get('window').width * 0.18,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  newFilterItem: {
    width: (Dimensions.get('window').width - 48) / 2,
    height: 119,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    backgroundColor: Colors.timeLinebackground,
    borderWidth: 2,
    borderColor: Colors.bottomTabColor,
  },
  filterTextJumpto: {
    ...fontSize(19),
    fontFamily: fontFamily.Inter,
    fontWeight: '400',
    lineHeight: 23,
    color: Colors.bordercolor
  },
  backTextJumpto: {
    ...fontSize(19),
    fontFamily: Platform.OS == 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500',
    lineHeight: 23,
    color: Colors.bordercolor
  },
  monthsText: {
    ...fontSize(16),
    color: Colors.white
  },
  commonPaddingContainer: {
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16
  },
  imageBackContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 16.5,
    alignItems: 'center'
  },
  separatorStyle: {
    width: 8,
    height: 16
  },
  iconSeparator: {
    height: 8
  },
  ScrollToendView: { height: 140 },
  imageBackgrounStyle: { borderRadius: 15 },
  bottomBarContainer:{ 
    height: 48, 
    backgroundColor: Colors.white, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  bottomBarSubContainer:{
    height: 40,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderTopWidth: 3,
    borderTopColor: Colors.white,
    width: '94%',
    borderRadius: 12,
    borderColor: Colors.white,
    marginBottom: 4,
    alignSelf: 'center', flexDirection: 'row'
  }
});

export default Styles;