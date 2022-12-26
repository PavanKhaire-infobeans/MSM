import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { Colors, fontFamily, fontSize, Size } from '../../common/constants';
import Utility from '../../common/utility';

const Styles = EStyleSheet.create({
  $size: Size.byWidth(43),
  container: {
    padding: Size.byWidth(10),
    borderWidth: 1,
    borderColor: '#EAE7DF',
    flexDirection: 'row',
    backgroundColor: '#F4F1EA',
    width: '100%',
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  LoginHeader:{ 
    width: Utility.getDeviceWidth() - 48, 
    flexDirection: 'row', 
    alignSelf: 'center',
    marginTop: 24
  },
  termHeader:{ 
    width: Utility.getDeviceWidth() - 48, 
    flexDirection: 'row', 
    alignSelf: 'center',
    marginTop: 12
  },
  hederText:{ 
    fontWeight: '500', 
    ...fontSize(36), 
    lineHeight: 45, 
    fontFamily: Platform.OS === 'ios' ? fontFamily.Lora : fontFamily.LoraMedium, 
    color: Colors.black, 
    textAlign: 'left' 
  },
  whoTextStyle:{ 
    fontWeight: '600', 
    ...fontSize(22), 
    lineHeight: 27.5, 
    fontFamily: Platform.OS === 'ios' ? fontFamily.Lora : fontFamily.LoraSemiBold, 
    color: Colors.bordercolor, 
    textAlign: 'left' 
  },
  whoTextDescStyle:{ 
    fontWeight: '400', 
    ...fontSize(19), 
    lineHeight: 23.75, 
    fontFamily: fontFamily.Inter, 
    color: Colors.newDescTextColor, 
    textAlign: 'left' ,
  },
  termStyle:{ 
    fontWeight: '500', 
    ...fontSize(13), 
    lineHeight: 17.5, 
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium, 
    color: Colors.newTextColor, 
    textAlign: 'center' 
  },
  orContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orLineStyle:{ 
    height: 1, 
    width: '42%', 
    backgroundColor: '#4C5367' 
  },
  getFormEntityStyle: {
    flexDirection: "column",
    justifyContent: 'flex-start'
  },
  getFormEntityContainerStyle: {
    flexDirection: "column",
    width: '100%'
  },
  regFirstStepSubContainer: {
    height: Dimensions.get('window').height - 100,
    paddingHorizontal: 24,
    paddingBottom: 20 + (Platform.OS == "ios" && StaticSafeAreaInsets.safeAreaInsetsBottom ? StaticSafeAreaInsets.safeAreaInsetsBottom + 50 : 0)
  },
  formContainer: { width: '100%' },
  inputLableStyle: {
    marginLeft: 8,
    marginBottom: 4,
    color: Colors.newTextColor
  },
  whyinputLableStyle: {
    textAlign:'right',
    color: Colors.newTextColor
  },
  innerContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: Size.byWidth(13),
    flex: 1,
  },
  loginContainer: {
    // borderColor: Colors.bordercolor,
    // borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.transparent,
    width: '100%',
    paddingHorizontal: 24,
    flexDirection: 'row',
  },
  name: {
    fontStyle: 'normal',
    ...fontSize(Size.byWidth(16)),
    color: 'black',
  },

  url: {
    fontStyle: 'normal',
    ...fontSize(Size.byWidth(14)),
    marginTop: Size.byWidth(5),
    color: '#595959',
    textAlign: 'left',
  },
  imageContainer: {
    width: '$size',
    height: '$size',
    backgroundColor: Colors.NewLightThemeColor,
    justifyContent: 'center',
  },

  image: {
    width: '$size - 16',
    height: '$size - 16',
    alignSelf: 'center',
  },
  flexContainer: {
    flex: 1
  },
  safeAreaViewContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white
  },
  communityContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 10,
    alignItems: 'center',
    backgroundColor: Colors.transparent
  },
  firstStepContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center"
  },
  firstStepSubContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center"
  },
  communitytext: {
    ...fontSize(15),
    color: Colors.newTextColor,
    paddingBottom: 10
  },
  checkboxStyle: {
    borderRadius: 5,
    tintColor: Colors.ThemeLight
  },
  instanceContainer: {
    flexDirection: 'row',
    flex: 1
  },
  noCommunity: {
    fontStyle: 'normal',
    ...fontSize(Size.byWidth(16)),
    color: Colors.black,
    textAlign: 'left',
  },
  noCommunityContainer: {
    height: 120,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  findCommunityContainer: {
    flex: 1,
    height: '100%',
    width: '100%'
  },
  regFirstStepContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
  },
  ScrollViewStyle: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.transparent
  },
  registrationStyles: {
    width: "100%",
    padding: 15
  },
  alreadyMemberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Size.byWidth(32)
  },
  loginText: {
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.IntersemiBold,
    color: Colors.NewTitleColor,
    ...fontSize(Size.byWidth(18))
  },
  loginButtonContainer: {
    width: "auto",
    height: Size.byWidth(44),
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  alreadyMemberText: {
    alignContent: "center",
    ...fontSize(Size.byWidth(18))
  },
  RegistrationText: {
    fontWeight: '600',
    ...fontSize(18),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.IntersemiBold,
    paddingLeft: 10
  },
  registrationSubStyles: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 15
  },
  ScrollViewStyleContainer: {
    width: 310,
    paddingBottom: 40
  },
  InstanceViewContainer: {
    borderRadius: 5,
    borderBottomColor: 'rgb(230,230,230)',
    borderBottomWidth: 2,
    borderTopColor: 'rgb(230,230,230)',
    borderTopWidth: 2,
    marginBottom: 24,
    marginTop: 32,
  },
  helloText: {
    lineHeight: 26,
    ...fontSize(18),
    textAlign: 'center',
    color: Colors.black
  },
  emailText: {
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.IntersemiBold,
    fontWeight: '600'
  },
  knowpassword:{
    lineHeight: 32,
    ...fontSize(18),
    fontFamily:fontFamily.Inter,
    textAlign: 'center',
    color: Colors.black,
    marginTop: 39,
  },
  forgotten:{
    lineHeight: 32,
    ...fontSize(18),
    textAlign: 'center',
    color: Colors.black,
    marginTop: 39,
  },
  loginAccountButton:{
    fontWeight:'600',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.IntersemiBold,
    ...fontSize(22),
    color: Colors.ThemeColor,
  },
  requesSent:{
    ...fontSize(24), 
    lineHeight: 45
  },
  weneedText: {
    textAlign: 'center',
    width: '100%',
    lineHeight: 26,
    ...fontSize(18),
    marginBottom: 24,
  },
  Yearstext: {
    width: '100%',
    lineHeight: 26,
    ...fontSize(18),
    color: '#6B6B6B',
    marginBottom: 1,
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  fromYearTextInput: { width: '45%' },
  toYearTextInput: {
    width: '45%',
    position: 'absolute',
    right: 0
  },
  darkImage: {
    top: -130,
    left: 10,
    position: 'absolute',
  },
  lightImage: {
    top: -165,
    left: -65,
    position: 'absolute'
  },
  greenDarkImage: {
    flex: 1,
    top: -20,
    left: '-15%',
    position: 'absolute',
  },
  greenlinghtImg: {
    flex: 1,
    top: -5,
    left: '-50%',
    position: 'absolute',
  },
  RegistrationBackground: {
    flex: 1,
    width: '100%',
    position: 'absolute'
  },
  joinButton: { marginTop: 32 },
  prologSubContainer: {
    flex: 1,
    width: "100%",
  },
  communityListContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  selectedItemStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 150,
  },
  loginSSOButtonStyle: {
    width: '100%',
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'center',
    flexDirection: "row",
    paddingHorizontal: 24,
    borderRadius: 1000,
    backgroundColor: Colors.white
  },
  ScrollViewBottomView: { height: 500 },

  prologHeaderContainer: {
    height: 77,
    width: Utility.getDeviceWidth() - 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 24,
    marginTop: 68
  },
  signUp: {
    fontWeight: '500',
    ...fontSize(31),
    lineHeight: 45,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Lora : fontFamily.LoraMedium,
    color: Colors.bordercolor,
    textAlign: 'center'
  },
  prologHeaderContainerEmpty: {
    width: 40
  },
  prologHeaderEmptyView: {
    flex: 1,
    height: 400
  },
  ReadyContainer: {
    height: Utility.getDeviceHeight() * 0.26,
    width: Utility.getDeviceWidth() - 48,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 24,
    marginTop: 68
  },
  lastContainer: {
    height: Utility.getDeviceHeight() * 0.1,
    width: Utility.getDeviceWidth() - 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 24,
  },
  readyText: {
    fontWeight: '500',
    ...fontSize(36),
    lineHeight: 45,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Lora : fontFamily.LoraMedium,
    color: Colors.bordercolor,
    textAlign: 'center'
  },
  prologSubContainerStyle: {
    width: Utility.getDeviceWidth() - 48,
    marginLeft: 24
  },
  ssoTextStyle: {
    marginHorizontal: 12,
    color: Colors.newTextColor
  },
  separatorHeightStyle16: {
    height: 16,
  },
  separatorHeightStyle32: {
    height: 32,
  },
  separatorHeightStyle24: {
    height: 24,
  }

});

export default Styles;