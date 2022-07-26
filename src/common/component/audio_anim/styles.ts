import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors } from '../../constants';

const Styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  audioContainer: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    width: 320,
    justifyContent: 'space-between',
  },
  commonStyle: {
    width: 3,
    borderRadius: 20,
    backgroundColor: Colors.darkGray,
  }
});

export default Styles;