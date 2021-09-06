import {StyleSheet, Platform} from 'react-native';
import {fontSize} from '../../constants';

export const styles = StyleSheet.create({
  inputViewStyle: {
    flex: 1,
    height: 50,
    backgroundColor: 'transparent',
    borderBottomWidth: 0.3,
    borderColor: 'transparent',
    borderRadius: 8,
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 3,
    paddingTop: 3,
  },
  inputTextStyle: {
    paddingTop: Platform.OS == 'ios' ? 15 : 30,
    height: Platform.OS == 'ios' ? 50 : 60,
    ...fontSize(18),
    color: 'black',
    lineHeight: 24,
    letterSpacing: -0.1,
    paddingRight: 20,
  },
});
