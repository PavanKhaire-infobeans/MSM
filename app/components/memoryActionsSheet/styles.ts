import { Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../../src/common/constants';

const Styles = EStyleSheet.create({
  hiddenView: {
    height: 0,
    width: 0
  },
  container: {
    position: 'absolute',
    width: Dimensions.get('window').width * 1,
    height: '100%',
    alignItems: 'center',
    top: 0,
    flexDirection: 'row'
  },
  ActionView: {
    width: Dimensions.get('window').width * 0.4,
    height: '100%',
  },
  AnimatedContainer: {
    backgroundColor: Colors.white,
    maxWidth: 768,
    marginRight: 20,
    width: 254,
    position: 'absolute',
    alignSelf: 'center',
    marginBottom: Dimensions.get('window').height * 0.6,
    borderRadius: 20,
    right: 0
  },
  flatListStyle: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.actionBg,
    backgroundColor: Colors.actionBg,
  },
  flatlistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingVertical: 11,
    backgroundColor: Colors.actionBg,
    height: 44,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.36)',
  },
  ioSContainer: {
    height: '100%',
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: Colors.black,
    ...fontSize(17),
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.4,
  },
  iosTextStyle: {
    height: '100%',
    overflow: 'visible',
    alignItems: 'center',
    position: 'absolute',
    right: 25,
    justifyContent: 'center',
  }

});

export default Styles;