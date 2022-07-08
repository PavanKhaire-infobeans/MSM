import { Dimensions } from 'react-native';
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
    borderRadius: 8,
    marginTop: 20,
  },
  mainContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 82,
    justifyContent: 'space-between',
    borderBottomColor: Colors.bottomTabColor,
    backgroundColor: Colors.white,
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
  },
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
    fontFamily: fontFamily.Inter,
    lineHeight: 15,
    textAlign: 'left',
    fontWeight: '500',
  },

  titleContainer: {
    justifyContent: 'center',
    paddingTop: 10,
    flex: 1,
    paddingRight: 10,
  },
  rightContainer: {
    flex: 1.5,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancleText: {
    color: Colors.newDescTextColor,
    ...fontSize(16),
    width: '100%',
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
  marginleft: {
    marginLeft: 30
  },
  cancleTextContainer: {
    width: 72,
    marginLeft: 8,
    marginBottom: 10,
    marginTop: 6,
  },
  cancleTextStyle: {
    fontFamily: fontFamily.Inter,
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
    fontFamily: fontFamily.Inter,
    ...fontSize(18),
    lineHeight: 20,
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

});

export default Styles;