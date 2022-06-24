import { Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../../../src/common/constants';

const Styles = EStyleSheet.create({
  boxShadow: {
    shadowOpacity: 1,
    elevation: 1,
    shadowColor: '#D9D9D9',
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 2},
  },
  draftOptionsView: {
    height: 50,
    width: '100%',
    backgroundColor: Colors.white,
  },
  sideMenu: {
    paddingTop: 15,
    paddingBottom: 15,
    top: 40,
    left: 10,
    backgroundColor: Colors.white,
    minHeight: 50,
    width: 233,
    height: 252,
    position: 'absolute',
    borderRadius: 5,
    shadowOpacity: 1,
    elevation: 1,
    borderWidth: 0.5,
    borderColor: Colors.backrgba,
    shadowColor: Colors.lightGray,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 2},
  },
  inputViewStyle: {
    flex: 1,
    height: 50,
    backgroundColor: 'transparent',
    borderWidth: 0.3,
    borderColor: 'transparent',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems:'center',
    paddingLeft: 8,
    paddingRight: 3,
    paddingTop: 3,
  },
  inputTextStyle: {
    top: 12,
    ...fontSize(18),
    height: '100%',
    color: Colors.newTextColor,
    lineHeight: 24,
    letterSpacing: -0.1,
    paddingRight: 20,
    fontFamily:fontFamily.Inter
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignContent: 'center',
  },
  userDetailsContainer:{
    paddingTop: 15,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  userDetailsSubContainer:{
    flexDirection: 'row', 
    alignItems: 'center'
  },
  imagebackgroundContainer:{
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 16,
    overflow: 'hidden',
    borderColor: Colors.colorBlack,
  },
  userImageStyle:{
    height: 42,
    width: 42,
    borderRadius: 21,
    alignContent: 'center',
  },
  nameTextStyle:{
    ...fontSize(16),
    fontFamily: fontFamily.Inter,//'Rubik-italic',
    color: Colors.newTextColor,
  },
  commonImageContainer:{
    backgroundColor: Colors.timeLinebackground, 
    marginBottom: 15, 
    marginTop: 15
  },
  commonImageContainerSub:{
    backgroundColor: Colors.NewLightThemeColor,
    width: '100%',
    height: 185,
  },
  fileImageStyle:{
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    backgroundColor: 'transparent',
  },
  separator:{
    height: 1,
    width: '100%',
    backgroundColor: Colors.lightGray,
  },
  footerContainer:{
    width: '100%', 
    height: 50
  },
  renderDraftViewContainer:{
    backgroundColor: Colors.NewThemeColor
  },
  renderDraftViewSubContainer:{
    backgroundColor: Colors.white, 
    marginTop: 7
  },
  titleTextStyle:{
    ...fontSize(30),
    color: Colors.NewTitleColor,
    fontWeight:  '500',
    marginLeft: 16,
    marginRight: 16,
    textAlign: 'left',
    marginBottom: 10,
    fontFamily:fontFamily.Inter
  },
  inCollectionTextStyle:{
    ...fontSize(16),
    fontFamily: fontFamily.Inter,
    color: Colors.newTextColor,
    marginLeft: 16,
    marginBottom: 10,
  },
  journal_nameStyle:{
    color: Colors.NewTitleColor,
    fontFamily: fontFamily.Inter,
    marginLeft: 0,
    marginRight: 16,
    marginBottom: 10,
  },
  collaborativeContainer:{
    marginLeft: 16, 
    marginBottom: 10
  },
  collaborativeImagestyle:{
    width: 93,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  CollaborativeTextStyle:{
    textAlign: 'center',
    ...fontSize(12),
    fontFamily:fontFamily.Inter,
    color: Colors.white,
  },
  collaborativeArrayContainer:{
    marginLeft: 16,
    marginRight: 16,
    ...fontSize(17),
    paddingTop: 10,
  },
  lastActivityTextStyle:{
    ...fontSize(17), 
    color: Colors.newTextColor,
    fontFamily:fontFamily.Inter
  },
  attachmentCountTextStyle:{
    fontFamily: fontFamily.Inter,
    fontWeight: '500',
    color: Colors.newTextColor,
  },
  new_collaborator_countTextStyle:{
    ...fontSize(17),
    marginTop: 18,
    marginBottom: 18,
    fontFamily: fontFamily.Inter,
    fontWeight:'500',
    color: Colors.NewYellowColor,
  },
  CollaborateContainer:{
    height: 32,
    width: 126,
    paddingRight: 10,
    paddingLeft: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BtnBgColor,
    borderRadius: 32,
  },
  CollaborateTextStyle:{
    textAlign: 'center',
    fontFamily: fontFamily.Inter,
    color: Colors.white,
    ...fontSize(16),
    borderRadius: 5,
  },
  deleteImageStyle:{
    height: 25,
    width: 22,
    flex: 1,
    resizeMode: 'stretch',
  },
  alignSelfCenter:{
    alignSelf: 'center'
  },
  mainContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: Colors.black,
  },
  draftOptionsViewSubContainer:{
    height: 50,
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  draftTypeTextStyle:{
    fontFamily: fontFamily.Inter,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.newTextColor,
  },
  flatlistCOntainerSTyle:{
    width: '100%', 
    backgroundColor: Colors.white
  },
  memoryDraftsArrayStyle:{
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    top: 0,
    position: 'absolute',
  },
  noDraftTextStyle:{
    ...fontSize(18), 
    color: Colors.newTextColor, 
    textAlign: 'center',
    fontFamily:fontFamily.Inter
  },
  draftOptionsVisibleContainer:{
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
  },
  draftOptionSelectedTouchableStyle:{
    height: 50,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
  },
  draftTitleTextStyle:{
    fontSize: 16,
    fontFamily:fontFamily.Inter
  }
});

export default Styles;