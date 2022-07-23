import { StyleSheet } from 'react-native';
import { Colors, fontFamily, fontSize } from '../../constants';

export const styles = StyleSheet.create({
  inputViewStyle: {
    flex: 1,
    height: 50,
    backgroundColor: 'transparent',
    borderWidth: 0.3,
    borderColor: 'transparent',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 3,
    paddingTop: 3,
  },
  inputTextStyle: {
    top: 12,
    ...fontSize(18),
    height: '100%',
    color: Colors.black,
    fontFamily: fontFamily.Inter,
    lineHeight: 24,
    letterSpacing: -0.1,
    paddingRight: 20,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignContent: 'center',
  },
  mainContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'column'
  },
  placeholderContainer: {
    minWidth: 180,
    flexDirection: 'row',
    marginBottom: 5
  },
  placeholderTextStyle: {
    lineHeight: 26,
    fontFamily: fontFamily.Inter,
    fontSize: 18,
    color: Colors.newDescTextColor,//'#6B6B6B' 
  },
  dropDownContainer: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  animatedViewContainer: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  minWidth: {
    minWidth: 180
  },
  errormessageTextStyle: {
    ...fontSize(11),
    color: Colors.ErrorColor,
    fontFamily: fontFamily.Inter,
    marginTop: 1,
    lineHeight: 13,
    letterSpacing: -0.1,
  },

});
