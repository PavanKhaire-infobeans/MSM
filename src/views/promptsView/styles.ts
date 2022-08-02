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
  }
});

export default Styles;