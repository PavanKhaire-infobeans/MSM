import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors} from '../../constants';

const Styles = EStyleSheet.create({
  mainContainer:{
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: 3,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  placeholderStyle:{
    height: 20, 
    width: 20, 
    borderRadius: 10, 
    marginRight: 3
  },
  emptyContainer:{
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: 3,
    backgroundColor: Colors.white,
    borderColor: Colors.colorBlack,
    borderWidth: 1,
  }
});

export default Styles;