import {StyleSheet, Platform} from 'react-native';
import {Size, fontSize, fontFamily} from '../../common/constants';
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
    fontWeight:'600',
  },

  loginContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    // justifyContent: 'space-evenly',
  },

  communityBanner: {
    width: '100%',
    height: Size.byWidth(90),
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
});
