import deviceInfoModule from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../../common/constants';

const Styles = EStyleSheet.create({
  progressBar: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  loadingTextStyle: {
    color: Colors.black,
    ...fontSize(12),
    fontFamily: fontFamily.Inter
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Styles;