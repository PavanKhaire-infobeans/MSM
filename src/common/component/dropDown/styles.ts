import { StyleSheet } from 'react-native';
import { Colors, fontFamily, fontSize } from '../../constants';

const Styles = StyleSheet.create({
  inputViewStyle: {
    flex: 1,
    height: 100,
    backgroundColor: Colors.transparent,
    borderWidth: 0.3,
    borderColor: Colors.transparent,
    borderRadius: 3,
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 3,
    paddingTop: 3,
  },
  inputTextStyle: {
    top: 12,
    ...fontSize(18),
    height: '100%',
    color: Colors.black,
    lineHeight: 24,
    letterSpacing: -0.1,
    paddingRight: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 150
  },
  innerView: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 1,
  },
  animatedtextContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  animatedtextStyle: {
    ...fontSize(18),
    fontFamily: fontFamily.Inter,
    textAlign: 'center',
  },
  starStyle: {
    fontFamily: fontFamily.Inter,
    ...fontSize(18),
    lineHeight: 35,
    letterSpacing: -0.1,
  },
  errorMessageContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  minWidth: {
    minWidth: 140
  },
  errorTextStyle: {
    ...fontSize(11),
    color: Colors.NewRadColor,
    marginTop: 1,
    lineHeight: 13,
    letterSpacing: -0.1,
  }
});

export default Styles;