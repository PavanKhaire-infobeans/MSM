import { Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontSize } from '../../constants';

const Styles = EStyleSheet.create({
  hiddenView: {
    height: 0,
    width: 0
  },
  container: {
    position: 'absolute',
    backgroundColor: Colors.backrgba,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    top: 0,
  },
  animatedContainer: {
    backgroundColor: Colors.white,
    maxWidth: 768,
    position: 'absolute',
    paddingBottom: 15,
  },
  memoryActionsText: {
    color: Colors.TextColor,
    paddingTop: 15,
    paddingStart: 24,
    height: 56,
    ...fontSize(18),
    fontWeight: 'bold',
  },
  subView:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingStart: 24,
    height: 56,
  },
  imageStyle:{
    height: '100%',
    width: 21,
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle:{
    marginLeft: 20,
    ...fontSize(18),
  }
});

export default Styles;