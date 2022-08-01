import { Platform, StyleSheet } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../../common/constants';

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
  moveImage: {
    height: 25,
    width: 25,
    marginRight: 10
  },
  titleContainer: { paddingRight: 30 },
  titleText: {
    ...fontSize(16),
    fontWeight: '500',
    color: Colors.TextColor,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
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
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row'
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
  collectionListContainer:{ 
    minHeight: 80, 
    flex: 1 
  },
  collectionListButtonStyle:{
    borderBottomWidth: 1,
    flex: 1,
    padding: 15,
    paddingRight: 0,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
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
