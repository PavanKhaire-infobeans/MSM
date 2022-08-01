import { Platform, StyleSheet } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../../common/constants';

const Styles = EStyleSheet.create({
  collabratorListItemStyle: {
    paddingTop: 5,
    width: '100%',
    marginTop: 5,
    backgroundColor: '#fff',
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  visiblityImageContainer: { padding: 15 },
  container: {
    flex: 1
  },
  invisibleContainer: {
    width: '100%',
    flex: 0,
    backgroundColor: Colors.ThemeColor
  },
  safeAreaContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: Colors.white
  },
  collectionNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.NewLightThemeColor,
  },
  collectionText: {
    ...fontSize(18),
    flex: 1
  },
  collectionTextinputContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 15,
  },
  errorMessageStyle: {
    ...fontSize(12),
    color: Colors.ErrorColor
  },
  CollectionInputStyle: {
    width: '100%',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    ...fontSize(18),
    textAlignVertical: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 10,
    paddingLeft: 10,
    textAlign: 'left',
    color: Colors.TextColor,
    backgroundColor: Colors.SerachbarColor,
    borderBottomWidth: 1,
  },
  collectionListContainer: {
    minHeight: 80,
    flex: 1
  },
  collectionListButtonStyle: {
    borderBottomWidth: 1,
    flex: 1,
    padding: 15,
    paddingRight: 0,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  collectionListButtonContainerStyle: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameContainer: {
    height: '100%',
    padding: 15
  },
  addNewCollectionContainer: {
    height: 70,
    width: '100%'
  },
  addNewCollectionSubContainer: {
    height: 70,
    width: '100%',
    backgroundColor: Colors.NewLightThemeColor,
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  NewCollectionTextColor: {
    ...fontSize(16),
    marginLeft: 10,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.NewTitleColor,
  },
  collabratorListItemtype0Style: {
    padding: 15,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
  },
  collabratorListItemtype0ImageContainerStyle: {
    height: 50,
    width: 50,
    marginRight: 0,
    borderRadius: 25,
    overflow: 'hidden',
  },
  collaratorNameContainer: {
    marginLeft: 10,
    flex: 1
  },
  collaratorNameStyle: {
    ...fontSize(18),
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.TextColor,
  },
  collaratorNameTextStyle: {
    ...fontSize(14),
    color: Colors.TextColor,
    fontStyle: 'italic',
  },
  getMemoryActionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  getMemoryActionsName: {
    textDecorationLine: 'underline',
    paddingTop: 10,
    paddingBottom: 5,
    fontFamily: fontFamily.Inter,
    ...fontSize(14),
  },
  sendReminderText: {
    textDecorationLine: 'underline',
    paddingTop: 10,
    paddingBottom: 5,
    textDecorationColor: Colors.NewTitleColor,
    fontFamily: fontFamily.Inter,
    ...fontSize(14),
    color: Colors.NewTitleColor,
  },
  collabratorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  flatListStyle: {
    width: '100%',
    backgroundColor: Colors.SerachbarColor,
    marginTop: 5,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
  },
  menuSubContainer:{
    right: 10,
    backgroundColor: Colors.white,
    minHeight: 50,
    position: 'absolute',
    borderRadius: 5,
    shadowOpacity: 1,
    elevation: 3,
    shadowColor: '#CACACA',
    shadowRadius: 2,
    borderWidth: 0.5,
    borderColor: Colors.colorBlack,
    shadowOffset: {width: 0, height: 2},
  },
  leaveConverSationButtonStyle:{
    height: 45,
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  errorMessageTextStyle:{
    fontSize: 16, 
    color: Colors.ErrorColor
  },
  collabrationContainer:{
    padding: 15, 
    alignItems: 'center'
  },
  collabrateWithTextStyle:{
    paddingTop: 15,
    paddingBottom: 20,
    ...fontSize(18),
    textAlign: 'center',
  },
  InviteCollabrateButtonStyle:{
    paddingRight: 25,
    paddingLeft: 25,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: Colors.ThemeColor,
    borderRadius: 25,
  },
  InviteCollabrateTextStyle:{
    color: Colors.white, 
    ...fontSize(18)
  },
  dontShowbuttonContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
  },
  dontShowTextStyle:{
    marginLeft: 15,
    ...fontSize(16),
    color: Colors.black,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500',
  },
  textInputContainer:{
    flex: 1,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 0,
  },
  TextInputStyle:{
    flex: 1,
    textAlignVertical: 'top',
    fontFamily: fontFamily.Inter ,
    ...fontSize(16),
    paddingBottom: 0,
    marginBottom: 0,
  }
});

export default Styles;
