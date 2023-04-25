import { Dimensions, Platform } from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../../src/common/constants';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

const Styles = EStyleSheet.create({
  RenderHtmlStyle: {
    ...fontSize(19),
    fontFamily: fontFamily.Inter,
    color: Colors.newDescTextColor,
    fontWeight: '400',
    lineHeight: 23.75,
    padding: 0,
    marginVertical: 0,
  },
  renderExternalQueueItemContainer: {
    padding: 16
  },
  MemoryTagsFlatlistStyle: {
    paddingBottom: 10
  },
  externalQueueItemContainer: {
    width: Dimensions.get('screen').width,
  },
  externalQueueItemDescriptionContainer: {
    paddingHorizontal: 24
  },
  dotStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0,
    backgroundColor: Colors.newTextColor,
  },
  inactiveDotStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0,
    backgroundColor: Colors.darkGray,
  },
  caraousalcontainerStyle: {
    height: 350,
    width: Dimensions.get('window').width,
    backgroundColor: Colors.white,
  },
  collectionTitleTextSTyle: {
    ...fontSize(18),
    lineHeight: 26,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.newTextColor
  },
  normalText: {
    ...fontSize(17),
    fontWeight: '500',
    lineHeight: 18.7,
    color: Colors.newTextColor,
    // marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
  },
  boxShadow: {
    shadowOpacity: 1,
    shadowColor: '#D9D9D9',
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  descriptionSpaceStyle: {
    height: 50
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignContent: 'center',
  },
  memoryDataModelCollectionList: {
    marginBottom: 10,
    paddingBottom: 10,
    // borderBottomColor: Colors.timeLinebackground,
    // borderBottomWidth: 2
  },
  fieldFirstnameContainerStyle: {
    marginBottom: 10,
    marginLeft: 10,
    backgroundColor: Colors.NewLightThemeColor,
    borderRadius: 5,
    flex: 1,
  },
  fieldFirstnameSubContainerStyle: {
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.NewLightCommentHeader,
  },
  fieldFirstnameTextStyle: {
    lineHeight: 20,
    flex: 1,
    fontSize: 16,
    color: Colors.NewTitleColor,
  },
  createdOnTextStyle: {
    color: Colors.TextColor,
    paddingLeft: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  commentbodyContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentbodyTextStyle: {
    ...fontSize(16),
    color: Colors.TextColor
  },
  likebuttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    paddingBottom: 10,
  },
  likeButtonStyle: {
    flexDirection: 'row',
    padding: 5
  },
  likeImageStyle: {
    marginRight: 5,
    marginLeft: 5
  },
  collectionContainer: {
    padding: 10,
    borderRadius: 4,
    backgroundColor: Colors.timeLinebackground
  },
  container: {
    backgroundColor: Colors.white,
    flex: 1
  },
  memoryDetailAvailable: {
    width: '100%',
    backgroundColor: Colors.white,
  },
  externalQueue: {
    width: '100%',
    minHeight: 50,
    marginTop: Platform.OS == 'ios' ? deviceInfoModule.hasNotch() ? -10 : -15 : 0,
    marginBottom: -10,
    backgroundColor: Colors.bottomTabColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyType: {
    width: '100%',
    marginBottom: 20,
  },
  absoluteView: {
    position: 'absolute',
    bottom: -50,
    height: 50,
    width: '100%',
    backgroundColor: Colors.white,
  },
  CommentBoxContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
  },
  commentContainer: {
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
    borderColor: Colors.blackOpacity60,
    // marginBottom: 56,
    bottom: (Platform.OS == 'ios' &&
      StaticSafeAreaInsets.safeAreaInsetsBottom
      ? StaticSafeAreaInsets.safeAreaInsetsBottom + 10
      : 0)

  },
  CommentBoxSubContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    marginBottom: (Platform.OS == 'ios' &&
      StaticSafeAreaInsets.safeAreaInsetsBottom
      ? StaticSafeAreaInsets.safeAreaInsetsBottom + 10
      : 0)
  },
  postContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
  memoryTagsStyle: {
    marginHorizontal: 16,
  },
  descreptionContainer: {
    paddingHorizontal: 24
  },
  descreptionSeparatorContainer: {
    height: 16,
    paddingHorizontal: 24,
  },
  postStyle: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.NewTitleColor,
    padding: 1,
  },
  commentBoxTextInput: {
    ...fontSize(19),
    flex: 1,
    borderWidth: 1,
    maxHeight: 100,
    minHeight: 56,
    borderColor: Colors.newTextColor,
    margin: 8,
    fontFamily:fontFamily.Inter,
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
    color: Colors.newTextColor,
  },
  fileDetailsContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: Colors.white,
  },
  fileDetailsImageContainer: {
    backgroundColor: Colors.SerachbarColor,
    width: '100%',
    height: 200,
  },
  imageStyle: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    backgroundColor: 'transparent',
  },
  fileDescStyle: {
    ...fontSize(16),
    marginTop: 5,
    padding: 15
  },
  renderCommentViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: Colors.grayColor,
    borderBottomWidth: 1,
    paddingBottom: 15,
    paddingTop: 15,
    flex: 1,
  },
  renderCommentViewStyle: {
    flexDirection: 'row',
    paddingTop: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  renderCommentSubViewContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imagebgStyle: {
    height: 50,
    width: 50
  },
  imagebgStyleImageStyle: {
    borderRadius: 25
  },
  imagebgStyleInnerImageStyle: {
    height: 50,
    width: 50,
    borderRadius: 25
  },
  userNameTextStyle: {
    marginLeft: 10,
    fontWeight: '500',
    lineHeight: 20,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.newTextColor,
  },
  unblockContainer: {
    padding: 16,
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 20,
    backgroundColor: Colors.NewTitleColor,
  },
  unblockTextStyle: {
    color: Colors.white,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500',
  },
  customlistviewMainContainer: {
    flex: 1,
    backgroundColor: Colors.white
  },
  customlistviewMainContainerFlatlistTextContainer: {
    height: 120,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customlistviewMainContainerFlatlistTextStyle: {
    fontStyle: 'normal',
    ...fontSize(Size.byWidth(16)),
    color: Colors.newTextColor,
    textAlign: 'center',
    fontFamily: fontFamily.Inter
  },
  customlistviewMainContainerFlatlistStyle: {
    padding: 15,
    paddingTop: 0,
    marginBottom: 15,
    backgroundColor: Colors.white
  },
  MemoryCollectionsContainer: {
    elevation: 2,
    backgroundColor: Colors.NewThemeColor,
    width: '100%',
    paddingBottom: 10,
    marginTop: 5,
  },
  MemoryCollectionsContainerSub: {
    padding: 15,
    paddingTop: 5
  },
  otherMemoryTextStyle: {
    ...fontSize(16),
    marginTop: 5,
    marginBottom: 7,
    lineHeight: 20,
    color: Colors.TextColor,
  },
  collectionListContainer: {
    padding: 5,
    paddingRight: 16,
    paddingLeft: 16,
    borderRadius: 5,
  },
  collectionListContainerSub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  collectionNameTextStyle: {
    ...fontSize(18),
    lineHeight: 20,
    color: Colors.white,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500',
    marginBottom: 2,
  },
  memoryLengthContainer: {
    padding: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 16,
    marginBottom: 1,
    borderRadius: 15,
    borderColor: Colors.white,
    fontFamily: fontFamily.Inter,
    borderWidth: 1,
  },
  memorylengthTextStyle: {
    ...fontSize(14),
    color: Colors.white,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500',
  },
  byTextStyle: {
    ...fontSize(14),
    fontFamily: fontFamily.Inter,
    color: Colors.NewThemeColor
  },
  carouselContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 5
  },
  carouselContainerSub: {
    backgroundColor: Colors.SerachbarColor,
    width: '100%',
    flex: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  PlaceholderImageView: {
    width: '100%',
    height: 150
  },
  titleTextStyle: {
    ...fontSize(24),
    color: Colors.TextColor,
    paddingRight: 15,
    paddingLeft: 15,
    fontFamily: fontFamily.Inter,
    paddingTop: 5,
    paddingBottom: 5,
  },
  locationTextStyle: {
    ...fontSize(16),
    color: Colors.TextColor,
    padding: 15,
    paddingTop: 5,
    fontFamily: fontFamily.Inter,
    paddingBottom: 5,
  },
  likeCommentContainer: {
    padding: 15,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row',
  },
  likeTextStyle: {
    ...fontSize(16),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.NewTitleColor,
    fontWeight: '500',
    marginRight: 20,
  },
  commentTextStyle: {
    ...fontSize(16),
    fontFamily: fontFamily.Inter,
    color: Colors.TextColor
  },
  whoelseTextStyle: {
    ...fontSize(16),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.NewTitleColor,
    fontWeight: '500',
    padding: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
  whoelseSubTextStyle: {
    ...fontSize(16),
    fontFamily: fontFamily.Inter,
    color: Colors.TextColor
  },
  borderStyle: {
    height: 1,
    backgroundColor: Colors.bottomTabColor,
    // marginBottom: 5,
    opacity: 1,
  },
  memoryTagsMainContainerStyle: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  MemoryTagsContainer: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 5,
    borderWidth: 1,
    borderRadius: 8,
    paddingTop: 5,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.newDescTextColor,
  },
  CollaboratorViewContainer: {
    flexDirection: 'row',
    paddingTop: 5,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CollaboratorImageBackgroundStyle: {
    height: 40,
    width: 40
  },
  CollaboratorImageStyle: {
    borderRadius: 20
  },
  CollaboratorProfileImageStyle: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  CollaboratorNameTextStyle: {
    lineHeight: 20,
    fontSize: 16,
    marginLeft: 5,
    color: Colors.TextColor,
    fontFamily: fontFamily.Inter,
    padding: 5,
  },
  userDetailsContainer: {
    width: '100%',
    height: 74,
    paddingHorizontal: 16,
    // marginBottom: 16,
  },
  collectionTypeContainerStyle: {
    flexDirection: 'row',
    marginBottom: 16
  },
  flexRowStyle: {
    flexDirection: 'row',
  },
  userDetailsSubContainer: {
    flexDirection: 'row',
    height: 74,
    width: '100%',
    // paddingTop: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  userImageStyle: {
    height: 42,
    width: 42,
    borderRadius: 21,
    resizeMode: 'contain',
  },
  userNameContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  InternalQueueContainer: {
    width: '100%',
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  memoryTitleStyle: {
    fontFamily: Platform.OS === 'ios' ? fontFamily.Lora : fontFamily.LoraSemiBold,
    lineHeight: 37.5,
    ...fontSize(30),
    color: Colors.bordercolor,
    fontWeight: '600',
    width: '100%',
    textAlign: 'left',
  },
  userDetailsNameTextStyle: {
    color: Colors.newTextColor,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontSize: 17,
    lineHeight: 18.7,
    marginLeft: 8,
  },
  ShowSharedaetilsDetailsContainer: {
    width: '100%',
    flex: 1,
    height: 54,
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    marginBottom: 16,
    marginTop: 10,
    flexDirection: 'row',
  },
  ShowSharedaetilsDetailsContainerSub: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: Dimensions.get('window').width - 32,
    alignItems: 'center',
    alignSelf: 'center',
  },
  ShareContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 100,
    width: (Dimensions.get('window').width - 32) / 2,
    height: 53,
    flexDirection: 'row',
    backgroundColor: Colors.timeLinebackground,
    borderColor: Colors.bottomTabColor,
  },
  EditContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 100,
    width: (Dimensions.get('window').width - 32) / 2,
    height: 53,
    flexDirection: 'row',
    backgroundColor: Colors.decadeFilterBorder,
    borderColor: Colors.decadeFilterBorder
  },
  shareTextStyle: {
    color: Colors.newTextColor,
    ...fontSize(17),
    fontWeight: '400',
    lineHeight: 21,
    fontFamily: fontFamily.Inter,
    marginRight: 8
  },
  widthSeparator: {
    width: 8
  },
  shareWidthStyle: {
    width: (Dimensions.get('window').width - 32) / 2
  },
  FilesViewContainerStyle: {
    marginBottom: 10
  },
  imageCarouselContainerStyle: {
    height: 219.38,
    marginBottom: 20
  },
  commonPDFContainer: {
    elevation: 2,
    backgroundColor: Colors.timeLinebackground,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.timeLinebackground,
  },
  commonPDFContainerImagebgStyle: {
    width: '100%',
    height: 190,
    backgroundColor: Colors.white
  },
  commonPDFContainerImagebgViewStyle: {
    width: '100%',
    height: 190,
    position: 'absolute',
    top: 0,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commonPDFImageStyle: {
    height: '100%',
    width: '100%',
    resizeMode: 'center',
    backgroundColor: 'transparent',
  },
  pdficonStyle: {
    bottom: 10,
    right: 10,
    position: 'absolute'
  },
  CommonImageViewContainer: {
    backgroundColor: Colors.NewLightThemeColor,
    width: '100%',
    elevation: 2,
  },
  PlaceholderImageViewContainer: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.NewLightThemeColor,
  },
  placeholderStyle: {
    width: '100%',
    height: '100%'
  },
  TitleAndDescriptionContainer: {
    backgroundColor: 'transparent',
    padding: 15,
    paddingTop: 10
  },
  fileNameTextStyle: {
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    ...fontSize(18),
    color: Colors.bordercolor,
  },
  fileDescriptionTextStyle: {
    ...fontSize(16),
    marginTop: 5,
    color: Colors.bordercolor,
    fontFamily: fontFamily.Inter
  },
  descriptionContainerStyles: {
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    // paddingTop: 5,
  },
  seemoreTextStyle: {
    ...fontSize(16),
    fontWeight: '500',
    color: Colors.bordercolor,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
  },
  fileDescTextStyle: {
    textAlign: 'right',
    ...fontSize(16),
    fontStyle: 'italic',
    color: Colors.bordercolor,
    fontFamily: fontFamily.Inter,
  },
  DescriptionStyles: {
    justifyContent: 'flex-end',
    width: '100%',
    paddingRight: 15
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  deleteTextStyle: {
    ...fontSize(16),
    color: Colors.ErrorColor,
    marginLeft: 27
  },
  pauseButtonStyle: {
    height: 24,
    width: 24,
    marginLeft: 10,
    borderLeftColor: Colors.bordercolor,
    borderLeftWidth: 18,
    borderTopColor: Colors.transparent,
    borderTopWidth: 12,
    borderBottomColor: Colors.transparent,
    borderBottomWidth: 12,
  },
  durationContainer: {
    marginLeft: 10
  },
  CommonBottomSectionContainer: {
    paddingRight: 15,
    paddingLeft: 15,
    marginBottom: 50
  },
  hideCommentText: {
    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
    lineHeight: 20,
    fontSize: 16,
    color: Colors.NewYellowColor,
  },
  likeImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  fileNameStyle: {
    color: Colors.black,
    marginBottom: 5,
    paddingRight: 80
  },
  playButtonStyle: {
    backgroundColor: Colors.bordercolor,
    flex: 1,
    width: 5,
  },
  playButtonTransparentStyle: {
    backgroundColor: 'transparent',
    flex: 1,
    width: 2,
  },
  playingSubContainer: {
    height: 20,
    width: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  playButtonContainer: {
    width: 55,
    height: 55,
    marginLeft: 15,
    backgroundColor: Colors.white,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.bordercolor,
  },
  playPauseContainer: {
    width: '100%',
    paddingVertical: 10,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioViewContainer: {
    backgroundColor: Colors.timeLinebackground,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: Colors.bordercolor,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  LikeViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  LikeViewTextStyle: {
    ...fontSize(16),
    marginLeft: 5,
    fontWeight: '500',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.bordercolor,
  },
  noCommenttextStyle: {
    width: '100%',
    textAlign: 'center',
    ...fontSize(16),
    color: Colors.TextColor,
    padding: 5,
    marginTop: 5,
  },
  LikeCommentShareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: 48,
    borderRadius: 100,
    backgroundColor: Colors.timeLinebackground,
    borderColor: Colors.bottomTabColor,
  },
  titleandValueTextStyle: {
    ...fontSize(18),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500',
  },
  MemoryTagsNamestyle: {
    ...fontSize(14),
    marginBottom: 0
  },
  userImageBackgrounStyle: {
    borderRadius: 21
  },
  TitleAndValueContainer: {
    flex: 1
  },
  linearGradStyle: {
    height: 34,
    width: '100%',
    position: 'absolute',
    bottom: 0
  }
});

export default Styles;