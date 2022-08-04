import { Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../../src/common/constants';

const Styles = EStyleSheet.create({
  promptContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.newBagroundColor,
    borderRadius: 12,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    // overflow:'hidden',
    shadowColor: Colors.cardShadowColor
  },
  RenderHtmlStyle: {
    ...fontSize(19),
    fontFamily: fontFamily.Inter,
    color: Colors.newDescTextColor,
    fontWeight: '400',
    lineHeight: 24
  },
  WebViewContainerStyle: {
    width: '100%',
    minHeight: 400,
    padding: 3
  },
  space: {
    height: 10
  },
  titleContainer: {
    // padding: 5,
    paddingTop: 16,
    paddingHorizontal: 16,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'space-between',
  },
  titleText: {
    ...fontSize(24),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Lora : fontFamily.LoraSemiBold,
    // paddingLeft: 16,
    color: Colors.bordercolor,
    lineHeight: 30,
    flex: 1,
    fontWeight: '600',
    textAlign: 'left',
  },
  playContainer: {
    padding: 8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreOptionContainer: {
    justifyContent: 'space-between',
    flex: 1,
    width: 24,
    alignItems: 'center',
    flexDirection: 'row',
  },
  columStyle: {
    backgroundColor: Colors.white,
    height: 6,
    width: 6,
    borderRadius: 3,
  },
  carouselContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    paddingLeft: 0
  },
  PlaceholderImageView: {
    width: '100%',
    marginTop: 30,
    height: 300,
  },
  collectionTitle: {
    width: '100%',
    ...fontSize(14),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    paddingTop: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
    backgroundColor: Colors.newTextColor,
  },
  shareTextContainerStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 18
  },
  memoriesContainer: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    // paddingTop:3,
    // marginTop: -2,
  },
  dateContainer: {
    height: 20,
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    // marginBottom: 8
  },
  memoryDatetext: {
    color: Colors.newTextColor,
    paddingLeft: 2,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    ...fontSize(14),
    lineHeight: 17.5,
    letterSpacing: -0.05,
    justifyContent: 'center',
  },
  memoryTitle: {
    ...fontSize(24),
    color: Colors.bordercolor,
    fontWeight: '600',
    marginLeft: 16,
    marginRight: 16,
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Lora : fontFamily.LoraSemiBold,
    lineHeight: 30,
    letterSpacing: -0.01,
  },
  mainMemoryContainerStyle: {
    backgroundColor: Colors.NewThemeColor,
    borderRadius: 10
  },
  sharewithTextStyle: {
    color: Colors.newTextColor,
    paddingLeft: 4,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    ...fontSize(14),
    lineHeight: 17.5,
    letterSpacing: -0.05,
  },
  descriptionText: {
    color: Colors.newDescTextColor,
    marginLeft: 16,
    marginRight: 16,
    fontWeight: '400',
    marginBottom: 16,
    textAlign: 'left',
    fontFamily: fontFamily.Inter,
    lineHeight: 24,
    ...fontSize(19),
  },
  activepromptsContainer: {
    borderWidth: 1,
    borderColor: Colors.newBagroundColor,
    elevation: 7,
    borderRadius: 12,
    width: '100%',
    backgroundColor: Colors.NewThemeColor,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowColor: Colors.cardShadowColor
  },
  activepromptsSubContainer: {
    width: '100%',
    paddingVertical: 16,
    // paddingTop: 7,
    borderRadius: 12,
    backgroundColor: Colors.ThemeColor,
  },
  authorContainer: {
    flex: 1,
    borderRadius: 5,
    marginTop: -2,
    padding: 3
  },
  mediaContainer: {
    flex: 1,
    borderRadius: 5
  },
  memoryDateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 18,
  },
  imageTopMargin: {
    top: -1,
    height: 16,
    width: 16
  },
  height16: {
    height: 16,
  }
});

export default Styles;