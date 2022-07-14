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
    alignItems: 'center',
  },

  titleText: {
    ...fontSize(Size.byWidth(24)),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.IntersemiBold,
    fontWeight:'600',
  },

  loginContainer: {
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
    height: Size.byWidth(44),
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  fullFlex:{
    flex: 1, 
    width: '100%'
  },

  scrollViewContainerStyle:{
    width: '100%', 
    height: '100%', 
    padding: 16
  },

  
});
