import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontSize, fontFamily, Size } from '../../constants';

const Styles = EStyleSheet.create({
  $size: Size.byWidth(43),
  container: {
    padding: Size.byWidth(10),
    borderWidth: 1,
    borderColor: Colors.bordercolor,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    width: '100%',
    // borderRadius: 8,
    marginTop: 20,
  },
  mainContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 68,
    // justifyContent: 'space-between',
    borderBottomColor: Colors.bottomTabColor,
    backgroundColor: Colors.white,
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
  },
  height4:{ height: 4 },
  innerContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: Size.byWidth(13),
  },

  communityName: {
    fontStyle: 'normal',
    ...fontSize(Size.byWidth(16)),
    color: Colors.black,
    textAlign: 'left',
  },

  url: {
    fontStyle: 'normal',
    ...fontSize(Size.byWidth(14)),
    marginTop: Size.byWidth(5),
    color: Colors.black,
    textAlign: 'left',
  },
  imageContainer: {
    width: '$size',
    height: '$size',
    backgroundColor: Colors.NewLightThemeColor,
    justifyContent: 'center',
  },

  image: {
    width: '$size - 16',
    height: '$size - 16',
    alignSelf: 'center',
  },
  name: {
    color: Colors.newTextColor,
    ...fontSize(10),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    lineHeight: 15,
    textAlign: 'left',
    fontWeight: '500',
  },

  titleContainer: {
    // justifyContent: 'center',
    paddingTop: 20,
    flex: 1,
    paddingLeft: 16,
  },
  rightContainer: {
    flex: 1.5,
    height: 60,
    width: 100,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 8
  },
  rightButtonsContainer: {
    marginTop: 12,
    // paddingRight: 0,
    height: 40,
    borderRadius: 1000,
    flexDirection: 'row',
    // paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.timeLinebackground,
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.bottomTabColor,
  },

  moreOptionContainer: {
    justifyContent: 'space-between',
    height: '100%',
    width: 30,
    padding: 13.5,
    paddingLeft: 3,
    alignItems: 'center',
  },

  rightButtonsTouchable: {
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10
  },
  rightButtonsTouchableStyle: {
    // justifyContent: 'center',
    alignItems: 'center',
  },
  cancleText: {
    color: Colors.newDescTextColor,
    ...fontSize(16),
    // width: '100%',
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: 'Inter',
    lineHeight: 16
  },
  rightButtonSaveTouchable: {
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
    paddingHorizontal: 12,
    // backgroundColor:Colors.bottomTabColor,
  },

  registrationContainerStyle: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    height: 54,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backrgba,
  },
  backArrowContainerSTyle: {
    width: 60,
    alignItems: 'center'
  },
  cancelImage: {
    // marginBottom: 4,
    height: 24,
    width: 24,
    marginLeft: 30
  },
  cancelImageConditional: {
    marginBottom: 4,
    height: 24,
    width: 24,
    marginLeft: 30
  },
  cancleTextContainer: {
    justifyContent: 'center',
    width: 72,
    height: 32,
    marginLeft: 8,
    marginBottom: 8,
  },
  cancleTextStyle: {
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    textAlign: 'center',
    fontWeight: '500',
    ...fontSize(14),
    lineHeight: 17
  },
  emptyView: {
    height: 10,
    width: 15
  },
  titleText: {
    color: Colors.newTextColor,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    ...fontSize(21),
    lineHeight: 23.75,
    textAlign: 'left',
    fontWeight: '500',
  },
  leftButtonTouchableContainer: {
    justifyContent: 'center',
    height: '100%',
    // padding: 15,
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

  rightTextStyle: {
    ...fontSize(19),
    fontWeight: '400',
    textAlign: 'center',
    color: Colors.newTextColor,
    fontFamily: fontFamily.Inter,
  },
  rightIconContainer:{
    justifyContent: 'space-between',
    height: '100%',
    width: 30,
    padding: 13.5,
    paddingLeft: 3,
    alignItems: 'center',
  },
  menuStyle:{
    backgroundColor: 'white',
    height: 4,
    width: 4,
    borderRadius: 2,
  },
  headerContainerStyle:{
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  centerandLeftContainer:{ 
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    flex: 1 
  }
});

export default Styles;