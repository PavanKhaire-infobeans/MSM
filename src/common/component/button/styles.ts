import { Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontSize, fontFamily, Size} from '../../constants';

const Styles = EStyleSheet.create({
  $buttonColor: Colors.NewTitleColor,
  $buttonTextColor: '#ffffff',
  $buttonUnderlayColor: '#01B732',
  button: {
    marginTop: Size.byWidth(16),
    width: '100%',
    height: Size.byWidth(48),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Size.byWidth(5),
    backgroundColor: '$buttonColor',
  },

  text: {
    color: '$buttonTextColor',
    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
    ...fontSize(Size.byWidth(18)),
    textAlign: 'center',
  },
});

export default Styles;