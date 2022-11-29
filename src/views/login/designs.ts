import { Platform, StyleSheet } from 'react-native';
import { Colors, fontFamily, fontSize, Size } from '../../common/constants';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: Colors.timeLinebackground,
  },
  mainContainer:{ flex: 1 },
  innerContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  resetPasswordStyle:{
    padding: 16,
    color: 'rgba(61, 61, 61, 0.6)',
    ...fontSize(16),
  },
  emailTextstyle:{ 
    padding: 16, 
    ...fontSize(16), 
    color: Colors.black
  },
  yourComminityContainer:{
    flexDirection: 'row',
    height: 35,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 5,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  comminityText:{
    ...fontSize(16),
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: '#3D3D3D',
  },
  selectAllContainer:{
    flex: 1,
    height: 35,
    paddingBottom: 5,
    position: 'absolute',
    right: 16,
    justifyContent: 'flex-end',
  },
  flatlistStyle:{ 
    padding: 15, 
    paddingTop: -10, 
    flex: 1, 
    marginBottom: 80 
  },
  resetMainContainer:{
    width: '100%',
    height: 54,
    padding: 15,
    position: 'absolute',
    bottom: 40,
  },
  titleProps:{
    height: 60,
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTextStyle:{
    ...fontSize(22),
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.white,
  },
  selectAllText:{
    ...fontSize(14),
    fontWeight: '500',
    color: Colors.ThemeColor,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    textDecorationLine: 'underline',
  },
  titleText: {
    ...fontSize(Size.byWidth(24)),
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.IntersemiBold,
    fontWeight:'600',
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
    marginLeft: 8
  },

  forgotPassword: {
    // width: 'auto',
    // height: Size.byWidth(40),
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop:4
  },
  forgotPasswordText:{
    fontWeight:'400' ,
    color: Colors.newDescTextColor,
    ...fontSize((18)),
    lineHeight:18.9
  },
  loaderContainer:{
    position: 'absolute',
    top: 0,
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#333333aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContainer:{
    padding: 10,
    backgroundColor: Colors.ThemeColor,
    borderRadius: 10,
  },
  activityStyle:{ 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingTextStyle:{ 
    color: Colors.newTextColor, 
    ...fontSize(14), 
    marginTop: 10 
  }
});
