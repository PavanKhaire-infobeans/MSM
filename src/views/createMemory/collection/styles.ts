import { Platform, StyleSheet } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../../common/constants';
import Utility from '../../../common/utility';

const Styles = EStyleSheet.create({
  renderRowContainer: {
    height: 60,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  renderSubRowContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  loginTextStyle:{ 
    color: Colors.white, 
    marginRight: 12
  },
  collectionListStyle:{    
    width: Utility.getDeviceWidth()-48, 
    alignSelf:'center'
  },
  loginSSOButtonStyle:{
    width: Utility.getDeviceWidth()-48, 
    height: 44,
    alignSelf: "center", 
    alignItems: "center", 
    justifyContent: "center", 
    flexDirection: "row",
    borderRadius: 1000, 
    backgroundColor: Colors.bordercolor,
    marginBottom:16
  },
  borderStyle: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.bottomTabColor
  },
  collectionTextStyle:{ 
    margin: 24,
    ...fontSize(19),
    lineHeight:23,
    fontFamily: fontFamily.Inter,
    fontWeight: '400',
  },
  moveImage: {
    height: 25,
    width: 25,
    marginRight: 10
  },
  titleContainer: { 
    alignItems:'flex-start',
    justifyContent: 'flex-start', 
  },
  titleText: {
    ...fontSize(18),
    lineHeight:18.9,
    fontWeight: '400',
    color: Colors.newDescTextColor,
    fontFamily: fontFamily.Inter ,
  },
  collectionContainer: {
    borderBottomWidth: 1,
    flex: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    minHeight: 60,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  collectionSubContainer: {
    flexDirection: 'row',
    height: '100%',
    flex: 1,
    padding: 15,
    paddingRight: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collectionTitleContainer: {
    flex: 7,
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  visiblityImageContainer: {flex: 1, },
  container: {
    flex: 1
  },
  invisibleContainer: {
    width: '100%',
    flex: 0,
    backgroundColor: Colors.NewThemeColor
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
    width:'100%'
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    // padding: 15,
  },
  errorMessageStyle: {
    ...fontSize(12),
    fontFamily: fontFamily.Inter,
    color: Colors.ErrorColor,
    paddingLeft: 32,
  },
  CollectionInputStyle: {
    width: Utility.getDeviceWidth()-48,
    // fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    // ...fontSize(18),
    alignSelf: 'center',
    // paddingTop: 15,
    // paddingBottom: 15,
    // paddingRight: 10,
    // paddingLeft: 10,
    // textAlign: 'left',
    // color: Colors.TextColor,
    // backgroundColor: Colors.SerachbarColor,
    // borderBottomWidth: 1,
  },
  collectionListContainer:{ 
    marginHorizontal: 24, 
    flex: 1 
  },
  collectionListButtonStyle:{
    // borderBottomWidth: 1,
    flex: 1,
    // padding: 15,
    // paddingRight: 0,
    // borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  collectionListButtonContainerStyle:{
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameContainer:{ 
    height: '100%', 
    padding: 15 
  },
  addNewCollectionContainer:{ 
    height: 70, 
    width: '100%' 
  },
  addNewCollectionSubContainer:{
    height: 70,
    width: '100%',
    backgroundColor: Colors.NewLightThemeColor,
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  NewCollectionTextColor:{
    ...fontSize(16),
    marginLeft: 10,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.NewTitleColor,
  },
  
});

export default Styles;
