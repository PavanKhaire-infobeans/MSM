import { Platform, StyleSheet } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../../common/constants';

const Styles = EStyleSheet.create({
  visiblityImageContainer: { padding: 15 },
  container: {
    flex: 1
  },
  invisibleContainer: {
    width: '100%',
    flex: 0,
    backgroundColor: Colors.ThemeColor
  },
  safeAreaContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: Colors.white
  },
  whoElsetextStyle: {
    width: '100%',
    padding: 15,
    color: Colors.newTextColor,
    ...fontSize(18),
  },
  ShareOptionsItemStyle: {
    padding: 15,
    flexDirection: 'row'
  },
  imageStyle: {
    height: 25,
    width: 25
  },
  shareOptionsStyle: {
    ...fontSize(18),
    marginLeft: 5
  },
  shareOptionContainerStyle: {
    flex: 1,
    borderBottomWidth: 1,
    paddingTop: 20,
  },
  shareOptionSubContainerStyle: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5,
  },
  optionsTextStyle: {
    flex: 1,
    color: Colors.ThemeColor,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    ...fontSize(16),
  },
  showErrorStyle: {
    ...fontSize(14),
    fontFamily: fontFamily.Inter,
    paddingTop: 5,
    color: Colors.ErrorColor,
  }
});

export default Styles;
