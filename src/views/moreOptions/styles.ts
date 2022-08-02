import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../common/constants';

const Styles = EStyleSheet.create({
  container: { flex: 1 },
  noViewStyle: {
    width: '100%',
    flex: 0,
    backgroundColor: Colors.NewThemeColor,
  },
  safeAreaContextStyle: {
    width: '100%',
    flex: 1,
    backgroundColor: Colors.white
  },
  navigatopnHeaderContainer:{
    width: '100%', 
    position: 'absolute', 
    top: 0
  },
  activityIndicatorStyle:{
    flex: 6, 
    justifyContent: 'center'
  },
  flatListStyle:{ 
    width: '100%', 
    backgroundColor: 'white' 
  }
});

export default Styles;