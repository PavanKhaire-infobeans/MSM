import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors} from '../../constants';

const Styles = EStyleSheet.create({
  container:{
    height: 50,
    width: 50,
    marginRight: 5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  rowSpaceBetween:{
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
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