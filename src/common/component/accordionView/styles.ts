import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontSize, fontFamily} from '../../constants';

const Styles = EStyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.NewLightThemeColor,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: Colors.NewLightThemeColor,
    borderBottomWidth: 1,
    elevation: 2,
    shadowOpacity: 1,
    shadowColor: Colors.NewLightThemeColor,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 2},
    paddingLeft: 12,
    paddingRight: 10,
    paddingBottom: 2,
    height: 46,
  },

  cellContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#E6F0EF',
    justifyContent: 'space-around',
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    shadowOpacity: 1,
    elevation: 2,
    shadowColor: '#D9D9D9',
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 2},
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
    paddingBottom: 16,
    height: 90,
  },

  chevronImage: {
    transform: [{rotate: '180deg'}],
  },

  chevronImageNormal: {
    transform: [{rotate: '0deg'}],
  },

  textSize18: {
    ...fontSize(18),
    fontFamily:fontFamily.Inter
  },
  textSize16: {
    ...fontSize(16),
    fontFamily:fontFamily.Inter
  },
  });

export default Styles;