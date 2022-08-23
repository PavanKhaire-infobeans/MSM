import { Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const Styles = EStyleSheet.create({
 
  container: {
    zIndex: 3,
    elevation: 3,
    left: 0,
    right: 0,
    maxHeight: 45,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageContainer:{
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  messageTextStyle:{
    // ...fontSize(14),
    fontSize:14,
    lineHeight: 16,
    textAlign: 'left',
    color: '#ffffff',
    paddingBottom: 5,
    paddingTop: 5,
  },
  closeContainer:{
    width: 70,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },
  cancleButtonContainer:{
    width: 44,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer:{
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle:{
    // ...fontSize(16),
    fontSize:16,
    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Inter-Regular' : 'Inter-Medium',
  }
});

export default Styles;