import EStyleSheet from 'react-native-extended-stylesheet';
import { fontSize, Size} from '../../constants';

const Styles = EStyleSheet.create({
  $size: Size.byWidth(43),
  container: {
    borderRadius: 5,
    borderColor: 'rgb(230,230,230)',
    borderWidth: 2,
    padding: Size.byWidth(16),
    flexDirection: 'row',
    shadowOpacity: 0.75,
    elevation: 1,
    shadowRadius: 5,
    shadowColor: 'rgb(210,210,210)',
    shadowOffset: {height: 0, width: 1},
    width: '100%',
  },

  innerContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: Size.byWidth(13),
  },

  name: {
    fontStyle: 'normal',
    ...fontSize(Size.byWidth(16)),
    color: 'black',
    textAlign: 'left',
  },

  url: {
    fontStyle: 'normal',
    ...fontSize(Size.byWidth(14)),
    marginTop: Size.byWidth(5),
    color: '#595959',
    textAlign: 'left',
  },

  imageContainer: {
    width: '$size',
    height: '$size',
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
  },

  image: {
    width: '$size - 16',
    height: '$size - 16',
    alignSelf: 'center',
  },
});

export default Styles;