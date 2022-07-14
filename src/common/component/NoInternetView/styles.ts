import { Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontSize, fontFamily } from '../../constants';

const Styles = EStyleSheet.create({
  container: {
    height: '100%',
    paddingLeft: 50,
    paddingRight: 50,
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginBottomImageStyle: { 
    marginBottom: 15 
  },
  noInternetTextStyle:{
    ...fontSize(18),
    fontWeight: '500',
    paddingBottom: 10,
    color: Colors.newTextColor,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
  },
  normalTextStyle:{
    ...fontSize(16),
    fontWeight: 'normal',
    fontFamily:fontFamily.Inter,
    color: Colors.newDescTextColor,
    textAlign: 'center',
  },
  tryAgainTextStyle:{
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.newTextColor,
  }
});

export default Styles;