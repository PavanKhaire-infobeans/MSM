import { Platform } from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../common/constants';

const Styles = EStyleSheet.create({
  container: { flex: 1 },
  noViewStyle: {
    width: '100%',
    flex: 0,
    backgroundColor: Colors.NewThemeColor,
  },
  safeAreaContextStyle: {
    width: '100%',
    flex: 1,
    backgroundColor: Colors.white
  },
  safeAreaSubContextStyle:{ 
    flex: 1, 
    backgroundColor: Colors.NewThemeColor 
  },
  cardContainer:{ 
    paddingLeft: 10, 
    paddingRight: 7 
  },
  prepareBasicInfoContainer:{
    width: '100%',
    minHeight: 330,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  ImageBackgroundStyle:{ 
    width: '100%', 
    height: 170 
  },
  imageCoontainer:{
    width: '100%',
    height: 170,
    position: 'absolute',
    top: 0,
    backgroundColor: '#cccccc56',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSTyle:{
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: 'transparent',
  },
  editButtonContainer:{
    flex: 1,
    width: '100%',
    marginTop: 0,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingRight: 5,
  },
  basicInfoContainer:{
    position: 'absolute',
    bottom: 0,
    width: '80%',
    minHeight: 240,
    alignItems: 'center',
  },
  basicInfoSubContainer:{ 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  profileimage:{ 
    width: 150, 
    height: 150, 
    borderRadius: 75 
  },
  usernameStyle:{
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    marginTop: 7,
    ...fontSize(18),
    color: Colors.TextColor,
  },
  ViewAll:{
    fontWeight: '500',
    lineHeight: 20,
    ...fontSize(16),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.NewTitleColor,
    paddingRight: 10,
  },
  friendListStyle:{ 
    flexDirection: 'row', 
    marginTop: 15 
  },
  friendlistContainer:{
    flexDirection: 'column',
    marginRight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendName:{
    ...fontSize(16),
    marginTop: 10,
    width: 50,
    textAlign: 'center',
  },
  friendIcon:{
    height: 50,
    borderRadius: 25,
    width: 50,
    overflow: 'hidden',
  },
  heading:{
    fontWeight: '500',
    color:Colors.newTextColor,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    ...fontSize(18),
  },
  birthDate:{ 
    ...fontSize(16), 
    marginTop: 7, 
    color: Colors.TextColor 
  },
  relationStatus:{ 
    ...fontSize(16), 
    padding: 5, 
    color: Colors.TextColor 
  },
  
  editButtonStyle:{
    borderRadius: 20,
    backgroundColor: Colors.white,
    padding: 10,
    position: 'absolute',
    top: 10,
    right: 5,
  },
  TextViewWithHeadingContainer:{ 
    marginBottom: 10, 
    width: '100%' 
  },
  headingText:{
    ...fontSize(16),
    fontWeight: '500',
    color: Colors.TextColor,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
  },
  valueText:{
    ...fontSize(16),
    width: '100%',
    paddingLeft: 3,
    textAlign: 'justify',
    color: Colors.TextColor,
  },
  TextWithIconContainer:{
    flexDirection: 'row',
    marginBottom: 5,
    marginTop: 10,
    width: '100%',
  },
  TextWithIconStyle:{ 
    height: 22, 
    width: 22, 
    resizeMode: 'contain' 
  },
  information:{
    ...fontSize(16),
    paddingLeft: 6,
    paddingTop: 2,
    paddingBottom: 5,
    paddingRight: 5,
    color: Colors.TextColor,
  },
  multipleValueContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  KeyboardAwareScrollViewStyle:{
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  basicInfostyle:{
    width: deviceInfoModule.isTablet() ? 320 : '90%',
    paddingTop: 20,
    marginBottom: 0,
  },
  selectionStyle:{
    width: deviceInfoModule.isTablet() ? 320 : '90%',
    justifyContent: 'center',
  },
  removeText:{
    lineHeight: 20,
    ...fontSize(16),
    textAlign: 'center',
    color: Colors.NewRadColor,
  },
  removeTextButton:{
    justifyContent: 'center', 
    alignItems: 'center'
  },
  profilePicContainer:{
    width: deviceInfoModule.isTablet() ? 320 : '90%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 20,
  },
  scrollViewContainer:{
    width: deviceInfoModule.isTablet() ? 320 : '90%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 20,
  },
  changeProfile:{
    lineHeight: 20,
    ...fontSize(16),
    textAlign: 'center',
    color: Colors.white
  },
  profileImage:{
    width: 100, 
    height: 100, 
    borderRadius: 50
  },
  changeProfileButton:{
    height: 33,
    width: 200,
    margin: 20,
    backgroundColor: Colors.ThemeColor,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Styles;