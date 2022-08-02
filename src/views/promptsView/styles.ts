import { Dimensions, Platform } from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../common/constants';
import Utility from '../../common/utility';

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
  subContainer:{ 
    flex: 1, 
    backgroundColor: Colors.NewThemeColor 
  },
  propmptCategoryContainer:{
    flex: 3,
    justifyContent: 'space-between',
    alignContent: 'space-between'
  },
  separator:{ height: 16 },
  flatlistStyle:{ 
    width: '100%', 
    backgroundColor: Colors.timeLinebackground 
  },
  promptContainer:{
    width: Utility.getDeviceWidth() - 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    height: 350,
    flex: 1,
    shadowColor: '#073562',
    shadowOffset: { height: 1, width: 0 },
    borderWidth: 0,
    alignSelf: 'center',
    shadowOpacity: 0.2,
    elevation: 3,
  },
  imageContainer:{ 
    flex: 2, 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
  },
  promptImage:{ 
    flex: 2, 
    height: '100%', 
    width: '100%', 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    alignItems: 'center' 
  },
  LinearGradientStyle:{ 
    height: '100%', 
    width: '100%', 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24 
  },
  promptLable:{
    fontSize: 14,
    lineHeight: 14,
    marginBottom: 22,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500',
    color: Colors.newTextColor,
    textAlign: 'center',
  },
  promptCtegory:{
    fontSize: 14,
    lineHeight: 14,
    marginBottom: 22,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500',
    color: Colors.newTextColor,
    textAlign: 'center',
  },
  desc:{
    fontSize: 22,
    lineHeight: 27.5,
    color: Colors.newDescTextColor,
    fontWeight: '600',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Lora : fontFamily.LoraSemiBold,
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  addmemoryContainer:{
    flexDirection: 'row',
    backgroundColor: Colors.timeLinebackground,
    marginHorizontal: 16,
    marginBottom: 24,
    height: 40,
    borderColor: Colors.bottomTabColor,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
  },
  AnsPrompt:{
    fontSize: 14,
    lineHeight: 17,
    marginLeft: 5,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.newDescTextColor,
  },
  noPromptContainer:{
    height: '100%',
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white
  },
  activityStyle:{ 
    flex: 1, 
    justifyContent: 'center' 
  },
  noPrompt:{
    ...fontSize(16),
    fontFamily: fontFamily.Inter,
    color: Colors.newDescTextColor,
    textAlign: 'center',
  },
  footerStyle:{ 
    width: '100%', 
    height: 40, 
    marginTop: 20 
  },
  filterContainer:{
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  filterSubContainer:{
    flex: 1, 
    backgroundColor: Colors.white
  },
  filterSubScroll:{
    flex: 1, 
    marginBottom: 30
  },
  topicContainer:{
    flexDirection: 'row', 
    flexWrap: 'wrap'
  },
  ApplyContainer:{
    backgroundColor: Colors.ThemeColor,
    width: 300,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  applyText:{
    fontWeight: '400', 
    ...fontSize(16), 
    color: Colors.white
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.NewLightCommentHeader,
    padding: 16,
  },
  filterHeaderText: {
    ...fontSize(16),
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.TextColor,
  },
  filterItem: {
    margin: 10,
    padding: 12,
    paddingBottom: 7,
    paddingTop: 7,
    borderRadius: 5,
  },
  filterText: {
    ...fontSize(16),
    fontWeight:'600',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.IntersemiBold,
    paddingLeft: 6,
    paddingTop: 2,
    paddingBottom: 5,
    paddingRight: 5,
  },
  bottomView: {
    height: Platform.OS == 'ios' ? 70 : 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 0.5,
    borderColor: '#fff',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 4,
    shadowRadius: 2,
    elevation: 3,
  },
  checkBoximageSTyle:{
    width: 15,
    height: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
    justifyContent: 'center',
    marginRight: 5,
    marginBottom: 3,
  }
});

export default Styles;