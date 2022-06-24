import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../common/constants';

const Styles = EStyleSheet.create({

  flexContainer: {
    flex: 1
  },
  animatedViewContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0
  },
  flex1Width90: {
    flex: 1,
    width: '90%'
  },
  titleDescContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 16
  },
  font30Weight500: {
    ...fontSize(30),
    fontWeight: '500',
    fontFamily: fontFamily.Inter,
    textAlign: 'center'
  },
  iconStyle:{ 
    height: 22, 
    width: 25, 
    marginBottom: -2 
  },
  font18Weight400: {
    ...fontSize(18),
    fontWeight: '400',
    fontFamily: fontFamily.Inter,
    textAlign: 'center'
  },
  font18Weight500:{ 
    fontWeight: '500', 
    fontFamily: fontFamily.Inter,
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
  tourContainerStyle:{ 
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
  margin10: {
    margin: 10
  },
  height16:{
    height:16
  },
  submitButnStyle: {
    backgroundColor: Colors.ThemeColor,
    fontFamily: fontFamily.Inter,
    ...fontSize(22)
  },
  submitButnStyleWidth75: {
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
  font20Weight500textStyle: {
    ...fontSize(20),
    fontFamily: fontFamily.Inter,
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
  justifyCentermargin5: {
    justifyContent: "center",
    margin: 5
  },
  butnContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    width: "100%",
    top: 0,
    paddingBottom: 10
  },
  prevBtnContainer:{ 
    borderColor: Colors.BtnBgColor, 
    borderWidth: 2, 
    marginLeft: 16, 
    borderRadius: 5 
  },
  backBtnContainer:{ 
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
  backTextStyle:{ 
    fontWeight: '400', 
    ...fontSize(17), 
    color: Colors.BtnBgColor, 
    marginLeft: 10 
  },
  nextBtnStyle:{ 
    borderColor: Colors.BtnBgColor, 
    borderWidth: 2, 
    marginRight: 16, 
    borderRadius: 5 
  },
  newBackContainer:{ 
    alignItems: 'flex-start', 
    width: "100%", 
    bottom: Platform.OS == 'ios' ? 20 : 50, 
    zIndex: 99999 
  },
  saveLaterContainer:{ 
    width: '100%', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  closeContainerStyle:{ 
    alignItems: "flex-end", 
    paddingRight: 20, 
    paddingTop: 30 
  },
  closeBtnStyle:{ 
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
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  filterButnContainerStyle:{ 
    width: '100%', 
    height: 40, 
    backgroundColor: Colors.white, 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#dedede' 
  },
  filterContainerStyle:{
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
    elevation: 2,
  },
  justifyContentSpaceBetween:{ 
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
  flexWrapFlexRow:{ 
    flexDirection: 'row', 
    flexWrap: 'wrap' 
  },
  jumptoScreenContainer:{ 
    height: '100%', 
    width: '100%', 
    backgroundColor: Colors.blacknew, 
    borderTopLeftRadius: 12, 
    borderTopRightRadius: 12 
  },
  jumptoScreenSubContainer:{
    height: '100%', 
    width: '100%', 
    backgroundColor: Colors.white
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
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    backgroundColor: Colors.unSelectedFilterbg,
    borderWidth: 2,
    borderColor: Colors.decadeFilterBorder,
  },
  filterTextJumpto: {
    ...fontSize(19),
    fontFamily: fontFamily.Inter,
    fontWeight: '400',
    lineHeight: 23,
    color: Colors.bordercolor
  },
  monthsText: {
    ...fontSize(16),
    color: Colors.white
  },
  commonPaddingContainer:{ 
    width: '100%', 
    paddingLeft: 16, 
    paddingRight: 16 
  },
  imageBackContainerStyle:{ 
    flex: 1, 
    flexDirection: 'row', 
    marginTop: 16.5, 
    alignItems: 'center' 
  },
  separatorStyle:{ 
    width: 8, 
    height: 16 
  },
  height8:{
    height: 8
  }
});

export default Styles;