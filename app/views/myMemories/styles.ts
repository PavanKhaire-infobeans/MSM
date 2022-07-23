import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors } from '../../../src/common/constants';

const Styles = EStyleSheet.create({
  scene: {
    flex: 1,
  },
  container:{
    width: '100%',
    flex: 1,
    backgroundColor: Colors.white,
  },
  tabBarUnderlineStyle:{
    backgroundColor: Colors.TextColor,
    height: 2,
  },
  
});

export default Styles;