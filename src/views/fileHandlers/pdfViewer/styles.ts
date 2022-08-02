import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../../common/constants';
import Utility from '../../../common/utility';

const Styles = EStyleSheet.create({
  container:{
    flex: 1, 
    width: '100%', 
    backgroundColor: Colors.white
  },
  pdfStyle:{
    flex: 1, 
    width: Dimensions.get('window').width
  },
});

export default Styles;