import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../../common/constants';

const Styles = EStyleSheet.create({
  ActivityContainer:{
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeAreaContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.NewLightThemeColor,
  },
  subContainer:{
    flex: 1, 
    width: '100%'
  },
  container:{
    flex:1
  },
  buttonContainer:{
    width: '100%',
    height: 60,
    flexDirection: 'row',
    backgroundColor: Colors.NewLightThemeColor,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    borderTopColor: Colors.backrgba,
    borderTopWidth: 1,
  },
  buttonStyle:{
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  closeButton:{
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 44,
  },
  closeStyle:{
    ...fontSize(18), 
    color: Colors.NewTitleColor
  },
});

export default Styles;