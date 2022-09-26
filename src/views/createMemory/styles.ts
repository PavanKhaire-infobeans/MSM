import { Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { Colors, fontFamily, fontSize } from '../../common/constants';
import Utility from '../../common/utility';

const Styles = EStyleSheet.create({

  flexContainer: {
    flex: 1
  },
  alertContainer: {
    backgroundColor: Colors.white
  },
  alertTitleStyle: {
    color: Colors.black,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22
  },
  alertmessageStyle: {
    color: Colors.black,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontSize: 16,
    fontWeight: '500',
  },
  previewTextStyle: {
    fontSize: 16,
    fontFamily: fontFamily.Inter,
    color: Colors.black
  },
  viewBeforListContentContainerStyle: {
    minHeight: Utility.getDeviceHeight() - 140,
    justifyContent: 'space-between'
  },
  viewBeforListContainerStyle: {
    justifyContent: 'space-between',
    height: Utility.getDeviceHeight() - (80 + (Platform.OS == "ios" ? (StaticSafeAreaInsets.safeAreaInsetsBottom ? StaticSafeAreaInsets.safeAreaInsetsBottom : 0) + (StaticSafeAreaInsets.safeAreaInsetsTop ? StaticSafeAreaInsets.safeAreaInsetsTop : 0) : (StaticSafeAreaInsets.safeAreaInsetsBottom ? StaticSafeAreaInsets.safeAreaInsetsBottom : 0)))
  },
  etherPadStyle: { height: Utility.getDeviceHeight() * 0.6 },
  deleteTextStyle: {
    fontSize: 16,
    fontFamily: fontFamily.Inter,
    color: Colors.NewRadColor
  },
  alertiOSContainer: {
    backgroundColor: Colors.grayColor
  },
  alertiOSTitleStyle: {
    color: Colors.black,
    lineHeight: 22,
    fontSize: 17,
    fontWeight: '600',
  },
  alertiOSmessageStyle: {
    color: Colors.black,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  alerButtonStyle: {
    lineHeight: 22,
    fontSize: 17,
    fontWeight: '600',
  },
  containerr: {
    backgroundColor: Colors.white,//theme.backgroundColor,
    position: 'relative',
    width: '83%',
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 12,
    top: 100,
    shadowOffset: {
      width: 2,
      height: 6,
    },
    borderWidth: 1,
    borderColor: Colors.bordercolor,
    zIndex: 10000,
    shadowColor: Colors.iosShadowColor,
    shadowOpacity: 4,
    shadowRadius: 2,
    elevation: 3,
  },
  borderStyle: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.bottomTabColor
  },
  calendarViewStyle: {
    minHeight: 400,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    borderWidth: 0.5,
    backgroundColor: Colors.white,
    borderColor: Colors.white,
    position: 'absolute',
    width: '83%',
    alignSelf: 'center',
    top: 100,
    shadowColor: 'rgba(46, 49, 62, 1)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toolbarIcons: {
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    paddingRight: 5,
    paddingLeft: 5,
  },
  selectedText: {
    lineHeight: 20,
    fontSize: 16,
    color: Colors.TextColor,
  },
  calendar: {
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 10,
  },
  etherpadTextInputStyle: {
    fontFamily: fontFamily.Inter,
    ...fontSize(19),
    textAlignVertical: 'top',
    fontWeight: '400',
    lineHeight: 23.75,
    color: Colors.bordercolor,
    fontStyle: 'normal',
    minHeight: 150,
    marginLeft: 24,
    textAlign: 'left',
    flex: 1,
  },
  sideMenu: {
    right: 10,
    backgroundColor: Colors.white,
    minHeight: 50,
    width: 180,
    position: 'absolute',
    borderRadius: 5,
    shadowOpacity: 1,
    elevation: 3,
    shadowColor: Colors.lightGray,
    shadowRadius: 2,
    borderWidth: 0.5,
    borderColor: Colors.backrgba,
    shadowOffset: { width: 0, height: 2 },
  },
  tooltipStyle: {
    width: 210,
    height: 60,
    backgroundColor: Colors.black,
    borderRadius: 5,
    position: 'absolute',
    bottom: 50,
    right: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolTipArrow: {
    height: 15,
    width: 15,
    borderTopColor: Colors.black,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftWidth: 7.5,
    borderRightWidth: 7.5,
    bottom: 37,
    right: 22,
    position: 'absolute',
  },
  inputView: {
    height: 50,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    backgroundColor: Colors.NewLightThemeColor,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  toolBarKeyboardAwareScrollViewStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.timeLinebackground,
  },
  toolBarKeyboardAwareScrollViewContainerStyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
  },
  buttonContainerStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  collaborateTextStyle: {
    ...fontSize(16),
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.NewTitleColor,
    marginRight: 5,
  },
  keyboardAccessoryStyle: {
    backgroundColor: Colors.white,
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    paddingRight: 15,
    paddingLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.backrgba,

  },
  fullWidth: {
    width: '100%'
  },
  rowConatiner: {
    marginTop: 15,
    paddingRight: 15,
    paddingLeft: 15,
    marginBottom: 15,
    borderRadius: 1,
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.backrgba,
    elevation: 3,
    shadowOpacity: 1,
    shadowColor: Colors.lightGray,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  textContainer: {
    height: 40,
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  TextStyle: {
    fontSize: 14,
    color: Colors.TextColor,
    fontFamily: fontFamily.Inter
  },
  addDetailsTextStyle: {
    fontWeight: '500',
    lineHeight: 20,
    fontSize: 16,
    color: Colors.NewYellowColor,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
  },
  paddingRight: {
    paddingRight: 25
  },
  fileTitleTextStyle: {
    ...fontSize(18),
    fontWeight: '500',
    marginBottom: 10,
    color: Colors.TextColor,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
  },
  fileDescTextStyle: {
    ...fontSize(16),
    color: Colors.TextColor,
    fontFamily: fontFamily.Inter
  },
  editIconStyle: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  fileHolderContainer: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.NewLightThemeColor,
  },
  fileHolderSubContainer: {
    width: '100%',
    height: 200,
    position: 'absolute',
    top: 0,
    backgroundColor: Colors.NewLightThemeColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImageStyle: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    backgroundColor: Colors.transparent,
  },
  pdfIconStyle: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  pdfIconImageStyle: {
    position: 'absolute',
    height: 30,
    bottom: 5,
    right: 5
  },
  audioContainer: {
    width: '100%',
    height: 90,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.AudioViewBg,
    borderColor: Colors.AudioViewBorderColor,
    borderRadius: 10,
    borderWidth: 2,
  },
  flexRow: {
    flexDirection: 'row'
  },
  playButtonContainer: {
    width: 55,
    height: 55,
    marginLeft: 15,
    backgroundColor: Colors.white,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.AudioViewBorderColor,
    borderWidth: 4,
  },
  playStyle: {
    height: 24,
    width: 24,
    marginLeft: 10,
    borderLeftColor: Colors.AudioViewBorderColor,
    borderLeftWidth: 18,
    borderTopColor: Colors.transparent,
    borderTopWidth: 12,
    borderBottomColor: Colors.transparent,
    borderBottomWidth: 12,
  },
  fullfleX: {
    marginLeft: 10,
    flex: 1
  },
  durationContainer: { marginLeft: 10 },
  fileNameTextStyle: {
    flex: 1,
    ...fontSize(16),
    fontFamily: fontFamily.Inter,
    color: Colors.TextColor,
    marginBottom: 5,
    paddingRight: 80
  },
  durationTextStyle: {
    ...fontSize(16),
    fontFamily: fontFamily.Inter,
    color: Colors.TextColor
  },
  labelSelectorContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  selectedValueTextStyle: {
    fontSize: 18,
    fontFamily: fontFamily.Inter
  },
  emptyView: {
    height: 6,
    width: 10,
    borderTopColor: Colors.TextColor,
    borderTopWidth: 6,
    borderLeftColor: Colors.transparent,
    borderLeftWidth: 5,
    borderRightColor: Colors.transparent,
    borderRightWidth: 5,
  },
  locationContainer: {
    height: 40,
    justifyContent: 'center',
    padding: 10
  },
  locationDescTextStyle: {
    ...fontSize(16),
    width: '100%',
    fontFamily: fontFamily.Inter
  },
  imagebuttonStyle: {
    padding: 15
  },
  searchListItemStyle: {
    paddingTop: 10,
    width: '100%',
    paddingBottom: 10,
    height: 60,
    borderBottomColor: Colors.colorBlack,
    borderBottomWidth: 1,
  },
  searchListItemContainerStyle: {
    paddingLeft: 15,
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ViewBeforeStyle: {
    paddingHorizontal: 24
  },
  height22: {
    height: 22
  },
  whenHappenTextStyle: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: fontFamily.Inter,
    color: Colors.TextColor
  },
  createLableSelectorContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  flex2Padding: {
    flex: 2,
    padding: 10
  },
  dateErrorTextStyle: {
    color: Colors.ErrorColor,
    fontSize: 14,
    marginBottom: 5
  },
  whereHappenTextStyle: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: fontFamily.Inter,
    color: Colors.TextColor
  },
  searchBarStyle: {
    height: 50,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    backgroundColor: Colors.NewLightThemeColor,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  flatListStyle: {
    backgroundColor: Colors.SerachbarColor,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    width: '100%',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.TextColor,
    opacity: 0.5,
  },
  locationErrorTextStyle: {
    color: Colors.ErrorColor,
    fontFamily: fontFamily.Inter,
    fontSize: 14
  },
  textInputStyle: {
    ...fontSize(18),
    width: '100%',
    height: 50,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500',
  },
  memoryDescriptionInput: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 27.5,
    color: Colors.newTextColor,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Lora : fontFamily.LoraSemiBold,
  },
  createdByUserContainer: {
    width: '100%',
    backgroundColor: Colors.AudioViewBg,
    paddingRight: 15,
    paddingLeft: 15,
  },
  titletextContainer: {
    ...fontSize(18),
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.TextColor,
    marginBottom: 15,
    marginTop: 15,
  },
  memoryDescriptionTextStyle: {
    ...fontSize(19),
    lineHeight:23.75,
    fontWeight: '400',
    width: '100%',
    fontFamily: fontFamily.Inter,
    paddingHorizontal: 24,
    color: Colors.bordercolor
  },
  editDescriptionTextStyle: {
    ...fontSize(19),
    paddingLeft: 24,
    paddingTop: 16,
    width: '100%',
    fontFamily: fontFamily.Inter,
    fontWeight: '600',
    color: Colors.newDescTextColor,
    textAlign: 'left'
  },
  buttonsTextStyle: {
    ...fontSize(19),
    // paddingLeft: 24,
    // paddingTop: 16,
    width: '100%',
    fontFamily: fontFamily.Inter,
    fontWeight: '400',
    color: Colors.newDescTextColor,
    textAlign: 'center'
  },
  paddingVerticalStyle: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  collabratorMainContainer: {
    padding: 15,
    borderBottomColor: Colors.grayColor,
    borderBottomWidth: 12,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullFexDirectionRowStyle: {
    flex: 1,
    flexDirection: 'row'
  },
  placeHolderContainerStyle: {
    height: 48,
    width: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  placeHolderImageStyle: {
    height: 48,
    width: 48,
    borderRadius: Platform.OS === 'android' ? 48 : 24,
  },
  flexMarginLeftStyle: {
    flex: 1,
    marginLeft: 12
  },
  directionFlex: {
    flexDirection: 'row'
  },
  ownerNameTextStyle: {
    fontWeight: '500',
    ...fontSize(16),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.TextColor,
  },
  fullFlex: {
    flex: 1
  },
  etherpadContainer: {
    flex: 9,
    height: '100%',
    width: Utility.getDeviceWidth() - 24,
    paddingLeft: 12,
    borderBottomColor: Colors.white,
    borderBottomWidth: 2
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
  menuVisibleContainer: {
    position: 'absolute',
    top: 50,
    height: '100%',
    width: '100%',
  },
  titleContainer: {
    height: 45,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  tooltipVisibleStyle: {
    bottom: 0,
    right: 0,
    position: 'absolute'
  },
  colabratiesTextStyle: {
    width: 200,
    padding: 10,
    fontSize: 16,
    fontFamily: fontFamily.Inter,
    color: Colors.white,
  },
  tagName: {
    ...fontSize(14),
    fontWeight: 'normal',
    color: Colors.darkGray,
    marginBottom: 5
  },
  normalText: {
    ...fontSize(16),
    fontWeight: 'normal',
    color: Colors.darkGray,
    marginBottom: 10,
  },
  itemName: {
    ...fontSize(16),
    fontWeight: 'normal',
    color: Colors.newTextColor
  },
  addButtonStyle: {
    color: Colors.NewTitleColor,
    ...fontSize(16),
    paddingRight: 15,
  },
  userCountText: {
    ...fontSize(14),
    fontStyle: 'italic',
    fontFamily: fontFamily.Inter,
    marginBottom: 10,
    paddingTop: 5,
  },
  tabsContainer: {
    width: '100%',
    height: 40,
    backgroundColor: Colors.NewThemeColor,
    flexDirection: 'row',
    shadowOpacity: 0.2,
    elevation: 3,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0,
    },
  },
  tabs: {
    flex: 1,
    backgroundColor: Colors.NewThemeColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsText: {
    ...fontSize(16),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.TextColor,
  },
  rowmainContainerStyle: {
    paddingTop: 10,
    width: '100%',
    paddingBottom: 10,
    height: 70,
    borderBottomColor: Colors.backrgba,
    borderBottomWidth: 1,
  },
  rowContainerStyle: {
    paddingLeft: 15,
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderImageViewStyle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 20,
    overflow: 'hidden',
  },
  placeholderImageStyleMargin: {
    height: 40,
    width: 40,
    marginRight: 20,
    borderRadius: Platform.OS === 'android' ? 40 : 20,
  },
  infoIconContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
  infoIconStyle: {
    height: 25,
    width: 25
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  commonFriendSerachStyle: {
    height: 50,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    backgroundColor: Colors.white,
    width: '100%',
    // retainFocus: true,
  },
  errortextStyle: {
    color: Colors.ErrorColor,
    ...fontSize(14),
    fontFamily: fontFamily.Inter
  },
  buttonsContainerStyle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    height: 104,
    paddingVertical: 16,
    borderTopColor: Colors.white,
    borderTopWidth: 2,
  },
  buttonsStyle: {
    flex: 1,
    backgroundColor: Colors.white,
    height: 72,
    borderWidth: 1.5,
    borderColor: Colors.bottomTabColor,
    borderRadius: 8,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  tagContainerStyle: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 0,
    borderWidth: 1,
    borderRadius: 20,
    paddingTop: 5,
    marginRight: 10,
    justifyContent: 'center',
    marginBottom: 0,
    alignItems: 'center',
    borderColor: Colors.darkGray,
  },
  memoryTagContainer: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backrgba,
  },
  selectFriendTextStyle: {
    ...fontSize(12),
    paddingLeft: 10,
    color: Colors.ErrorColor,
  },
  smallSeparator: {
    height: 1,
    width: '100%'
  },
  createMemoryIntroContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  introTitle: {
    ...fontSize(18),
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterBold,
    textAlign: 'center'
  },
  introdesc: {
    ...fontSize(18),
    fontWeight: '400',
    fontFamily: fontFamily.Inter,
    textAlign: 'center'
  },
  textStyle18Weight500: {
    ...fontSize(18),
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    textAlign: 'center'
  },
  introImgStyle: {
    margin: 20
  },
  containerMemoIntro: {
    flex: 1,
    backgroundColor: Colors.colorBlackOpacity7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainerMemoIntro: {
    width: '90%',
    borderRadius: 5,
    backgroundColor: Colors.white,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createMemoryIntroContainerStyle: {
    height: 5,
    borderRadius: 1,
    width: 16,
    marginRight: 5,
  },
  submitBtnStyle: {
    width: '90%',
    backgroundColor: Colors.ThemeColor,
    ...fontSize(22),
  },
  createMemoryIntroStyle: {
    flexDirection: 'row',
    marginTop: 10
  },
  renderLoaderStyle: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showWarningNoteContainerStyle: {
    backgroundColor: Colors.BtnBgColor,
    width: '100%',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    paddingRight: 0,
  },
  showWarningNoteTextStyle: {
    flex: 1,
    color: Colors.white,
    fontFamily: fontFamily.Inter,
    fontStyle: 'italic',
    ...fontSize(16),
  },
  closeButtonStyle: {
    width: 44,
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  collabrateContainer: {
    width: '100%',
    height: 44,
    justifyContent: 'flex-end',
    backgroundColor: Colors.NewLightThemeColor,
    alignItems: 'flex-end',
    padding: 10,
    paddingRight: 0,
    borderTopColor: Colors.backrgba,
    borderTopWidth: 1,
    borderLeftColor: Colors.backrgba,
  },
  collabrateButtonStyle: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  width44: {
    width: 44
  },
  webViewStyle: {
    // marginTop: 100,
    color: Colors.bordercolor,
    fontFamily: fontFamily.Inter,
    ...fontSize(19),
    lineHeight: 23.75,
    flex: 1,
    paddingTop: 300,
    borderBottomColor: Colors.white,
    borderBottomWidth: 2,
  },
  etherpadNavHeaderCOntainerStyle: {
    flex: 1,
    width: '100%',
    // position: 'absolute',
    // top: 0
  },
  titleTextInputStyle: {
    ...fontSize(16),
    height: 50,
    textAlignVertical: 'top',
    borderBottomColor: Colors.backrgba,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    maxHeight: 70,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
  },
  descTextInputStyle: {
    minHeight: 40,
    fontFamily: fontFamily.Inter,
    ...fontSize(16),
    textAlignVertical: 'top',
  },
  name: {
    color: Colors.white,
    ...fontSize(10),
    lineHeight: 15,
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500',
  },
  titleText: {
    color: Colors.white,
    ...fontSize(18),
    lineHeight: 20,
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500',
  },

  titleContainernew: {
    justifyContent: 'center',
    paddingTop: 10
  },

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
  closeButton: {
    height: 28,
    width: 28,
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

  rightButtonsContainer: {
    flex: 1,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  rightButtonsTouchable: {
    padding: 5,
    paddingRight: 10
  },

  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
    alignContent: 'center'
  },

  rightButtonsBackgroundImage: {
    width: 30,
    height: 30
  },

  rightButtonsBadge: {
    position: 'absolute',
    height: 12,
    width: 12,
    right: 5,
    top: 5,
    backgroundColor: Colors.WarningColor,
    borderColor: Colors.white,
    borderWidth: 2,
    borderRadius: 8,
    alignContent: 'center',
  },
  fileContainerSTyle: { padding: 10 },

  rightButtonsBadgeText: {
    ...fontSize(10),
    color: Colors.white
  },
  doneTextStyle: {
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 20,
    ...fontSize(16),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    padding: 10,
    color: Colors.white,
  },
  menuContainer: {
    justifyContent: 'space-between',
    height: '100%',
    width: 30,
    padding: 15,
    alignItems: 'center',
  },
  rowStyle: {
    backgroundColor: Colors.white,
    height: 4,
    width: 4,
    borderRadius: 2,
  },
  animatedContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  closeGuidButtonStyle: {
    height: 50,
    left: '87%',
    zIndex: 999,
    top: 10
  },
  guideTitleTextStyle: {
    ...fontSize(24),
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500'
  },
  guideDescTextStyle: {
    ...fontSize(20),
    fontFamily: fontFamily.Inter,
    color: 'white',
    fontWeight: '400',
    marginTop: 5,
  },
  prevContainer: {
    flexDirection: 'row',
    marginTop: 5
  },
  prevBtnContainer: {
    backgroundColor: 'white',
    width: 80,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memoryDraftIntroButnStyle: {
    paddingVertical: 20,
    marginLeft: 20
  },
  doneBtnContainer: {
    backgroundColor: Colors.NewYellowColor,
    width: 80,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneBtnTextStyle: {
    ...fontSize(18),
    color: Colors.white,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500',
  },
  memoryDraftContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  placeholderTextStyle: {
    flex: 1,
    fontFamily: fontFamily.Inter,
    ...fontSize(18),
  },
  commonListComponentContainer: {
    borderBottomColor: Colors.backrgba,
    paddingTop: 10,
    paddingBottom: 7,
    borderBottomWidth: 0.5,
    alignItems: 'center',
  },
  commonListComponentButtonContainer: {
    marginBottom: 30
  },
  placeholderContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllTextStyle: {
    width: '100%',
    textAlign: 'left',
    paddingTop: 10,
    fontFamily: fontFamily.Inter,
    color: Colors.ThemeColor,
    ...fontSize(16),
  },
  getCustomFriendsViewCOntainerStyle: {
    width: '100%',
    paddingTop: 10
  },
  friendNameTextStyle: {
    ...fontSize(16),
    fontFamily: fontFamily.Inter,
    color: Colors.black
  },
  additionalTextStyle: {
    ...fontSize(18),
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    marginBottom: 30,
  },
  drawerContainer: {
    borderRadius: 1500,
    position: 'absolute',
    top: -995,
    width: 2080,
    height: 2080,
    backgroundColor: Colors.transparent,
    borderWidth: 1000,
    borderColor: Colors.colorBlackOpacity7,
  },
  arrowImageContainerStyle: {
    position: 'absolute',
    top: 80,
    left: 230
  },
  memoryPublishContainer: {
    position: 'absolute',
    top: 150,
    left: 90,
  }
});

export default Styles;