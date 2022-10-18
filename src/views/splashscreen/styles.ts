import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../common/constants';

const Styles = EStyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageBackGroundStyle:{
    flex: 1, 
    width: '100%', 
    height: '100%'
  },
  versionContainer:{
    position: 'absolute',
    bottom: 15,
    alignItems: 'center',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  Version:{
    ...fontSize(16), 
    color: 'white', 
    textAlign: 'center'
  },
  
});

export default Styles;