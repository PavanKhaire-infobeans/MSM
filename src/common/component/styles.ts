import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../constants';

const Styles = EStyleSheet.create({
  
  container: {
    width: '100%', 
    height: 40,
    alignSelf: 'center',
    backgroundColor: Colors.bottomTabColor,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
    borderWidth: 0
  },
  shadowBox:{
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    shadowColor: Colors.black
  },
  buttonStyle: {
    fontFamily: fontFamily.Inter,
    textAlign: 'center',
    ...fontSize(12),
  },
  subContainer:{
    alignItems: 'center',
    height: 36,
    borderRadius: 12,
    zIndex: 99,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  titleTextStyle:{
    fontFamily: fontFamily.Inter,
    fontWeight: '400',
    marginRight: 10.5,
    ...fontSize(19),
    lineHeight: 23.75,
  }
});

export default Styles;