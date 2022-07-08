import {StyleSheet, Platform} from 'react-native';
import {Size, fontSize, Colors} from '../../common/constants';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.timeLinebackground,
  },

  innerContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },

  titleText: {
    ...fontSize(Size.byWidth(24)),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },

  loginContainer: {
    padding: 15,
    width: Size.byWidth(310),
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },

  communityBanner: {
    width: '100%',
    height: Size.byWidth(90),
    marginTop: Size.byWidth(37),
  },

  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },

  forgotPassword: {
    width: 'auto',
    height: Size.byWidth(40),
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
