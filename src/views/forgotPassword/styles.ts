import { Platform, StyleSheet } from 'react-native';
import { Colors, fontFamily, fontSize, Size } from '../../common/constants';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  innerContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },

  titleText: {
    ...fontSize(Size.byWidth(24)),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.IntersemiBold,
    fontWeight: '600',
  },

  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: Size.byHeight(40),
  },

  communityBanner: {
    width: Size.byWidth(310),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  subcommunityBanner: { width: '100%' },
  doneContainer:{flex: 1, height: 100},
  textFieldStyle:{width: '100%', height: 75},
  enterEmailText: {
    paddingBottom: 15,
    textAlign: 'center',
    fontWeight: '300',
    ...fontSize(Size.byWidth(18)),
    color: Colors.TextColor,
  },
  keyboardAvoiding: {
    width: '100%',
    height: Size.byHeight(180),
    justifyContent: 'space-evenly',
    alignItems: 'center',
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
    height: '100%'
  },
  resendContainer:{width: '100%', alignItems: 'center'},
  resendSubContainer:{paddingBottom: 40},
  dintReceivedText:{
    paddingTop: 0,
    textAlign: 'center',
    fontWeight: '400',
    ...fontSize(Size.byWidth(16)),
  },
  spamTextStyle:{
    color: Colors.newTextColor,
    paddingTop: 25,
    textAlign: 'center',
    fontWeight: '300',
    ...fontSize(Size.byWidth(16)),
  },
  resendButtonStyle:{
    paddingTop: 3, 
    paddingBottom: 40
  },
  resendTextStyle:{
    color: Colors.NewTitleColor,
    textAlign: 'center',
    fontWeight: '400',
    ...fontSize(Size.byWidth(16)),
  }
});
