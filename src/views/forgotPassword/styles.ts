import { Platform, StyleSheet } from 'react-native';
import { Colors, fontFamily, fontSize, Size } from '../../common/constants';
import Utility from '../../common/utility';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  labelStyle: {
    marginBottom: 4,
    marginLeft: 8,
    color: Colors.newTextColor
  },
  buttonContainer: {
    width: Utility.getDeviceWidth() - 48,
    height:44,
    // justifyContent: "flex-end",
    alignSelf: 'center',
    marginBottom: 24,
  },
  backButtonContainerStyle:{ 
    flexDirection: 'row', 
    width: 120, 
    borderRadius: 1000, 
    height: 44, 
    marginTop: 24, 
    marginLeft: 24, 
    marginBottom: 32, 
    borderColor: Colors.bottomTabColor, 
    borderWidth: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: Colors.white 
  },
  backIconStyle:{ 
    tintColor: Colors.newTextColor, 
    marginRight: 12, 
    transform: [{ rotate: '180deg' }] 
  },
  loginSSOButtonStyle: {
    width: '100%',
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'center',
    flexDirection: "row",
    paddingHorizontal: 24,
    borderRadius: 1000,
    backgroundColor: Colors.white
  },
  ssoTextStyle: {
    marginHorizontal: 12,
    color: Colors.newTextColor
  },
  hederText: {
    fontWeight: '500',
    ...fontSize(36),
    lineHeight: 45,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Lora : fontFamily.LoraMedium,
    color: Colors.black,
    textAlign: 'left'
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  LoginHeader: {
    width: Utility.getDeviceWidth() - 48,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  titleText: {
    ...fontSize(Size.byWidth(24)),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.IntersemiBold,
    fontWeight: '600',
  },

  loginContainer: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    // height: '100%',
    marginTop: Size.byHeight(12),
  },

  communityBanner: {
    width: Utility.getDeviceWidth() - 48,
    alignSelf: 'center',
    // height: '100%',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  subcommunityBanner: { 
    width: '100%',
    //  height: '100%', 
     flex: 1 
    },
  doneContainer: { flex: 1, height: 100 },
  textFieldStyle: { width: '100%', height: 75 },
  enterEmailText: {
    paddingBottom: 15,
    textAlign: 'left',
    fontWeight: '400',
    ...fontSize(Size.byWidth(19)),
    color: Colors.newDescTextColor,
  },
  keyboardAvoiding: {
    width: '100%',
    flex: 1,
    // height:Utility.getDeviceHeight()*0.6, 
    // height: '100%',//Size.byHeight(180),
    justifyContent: 'space-between',
    // alignItems: 'center', 
    marginBottom: 50
  },

  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },

  forgotPassword: {
    width: 'auto',
    height: Size.byWidth(44),
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  scrollViewStyles: {
    width: '100%',
    flex: 1,
    // height: '83%',
    // height:Utility.getDeviceHeight()*0.7, 
  },
  resendContainer: { width: '100%', alignItems: 'center' },
  resendSubContainer: { paddingBottom: 40 },
  dintReceivedText: {
    paddingTop: 0,
    textAlign: 'center',
    fontWeight: '400',
    ...fontSize(Size.byWidth(16)),
  },
  spamTextStyle: {
    color: Colors.newTextColor,
    paddingTop: 25,
    textAlign: 'center',
    fontWeight: '300',
    ...fontSize(Size.byWidth(16)),
  },
  resendButtonStyle: {
    paddingTop: 3,
    paddingBottom: 40
  },
  resendTextStyle: {
    color: Colors.NewTitleColor,
    textAlign: 'center',
    fontWeight: '400',
    ...fontSize(Size.byWidth(16)),
  }
});
