import { Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontSize, fontFamily} from '../../constants';

const Styles = EStyleSheet.create({
  container: { 
    flexDirection: 'row', 
    justifyContent: 'space-evenly'
  },
});

export default Styles;