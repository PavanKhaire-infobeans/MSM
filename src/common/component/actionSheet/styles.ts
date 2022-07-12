import { Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontSize, fontFamily} from '../../constants';

const Styles = EStyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#00000045',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    top: 0,
    borderRadius:13,
    paddingHorizontal:18
  },

  cellContainer: {
    backgroundColor: Colors.transparent,
    maxWidth: 768,
    position: 'absolute',
    paddingBottom: 25,
  },


  textTitle: {
    color: '#595959',
    paddingTop: 15,
    paddingStart: 24,
    height: 56,
    ...fontSize(18),
    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
  },
  flatlistContainer: {
    height: 1,
    borderRadius: 13
  },
  listContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.e0e0e0,
    height: 56,
    width:'100%',
  },
  listText:{
    marginLeft: 24,
    ...fontSize(18),
    fontFamily: fontFamily.Inter
  }
  });

export default Styles;