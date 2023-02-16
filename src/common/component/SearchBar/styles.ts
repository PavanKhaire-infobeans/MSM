import deviceInfoModule from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../../common/constants';

const Styles = EStyleSheet.create({
    parent: {
        height: 56,
        paddingHorizontal: 24,
        // paddingBottom: 4,
        // shadowColor: Colors.black,
        backgroundColor: Colors.white,
        borderBottomWidth: 0.3,
        borderBottomColor: 'transparent',
      },
      baseFlex: {
        borderRadius: 8,
        flex: 6,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      inputView: {
        width: '100%',
        height: '100%',
        paddingLeft: 16,
        flexDirection: 'row',
      },
      clearButton: {
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight:24
        // opacity: 0.5,
      },
      inputStyle: {
        flex: 9,
        height: 56,
        // marginLeft: 28,
        ...fontSize(19),
        lineHeight: 23.75,
        fontWeight:'400',
        fontFamily:fontFamily.Inter,
        color: Colors.newTextColor,
        backgroundColor: 'transparent',
      },
      placeholder: {
        color: Colors.brown,
        fontFamily:fontFamily.Inter,
        marginLeft: 12,
        ...fontSize(16),
        lineHeight: 20,
      },
      imageParent: {
        height: '100%',
        paddingLeft: 9,
        paddingRight: 9,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      errorStyle: {
        position: 'absolute',
        color: Colors.ErrorColor,
        ...fontSize(10),
        height: 12,
        bottom: 3,
        right: 2,
      },
      imageStyle: {
        width: 24,
        height: 24,
      },
      cancel: {
        color: Colors.grayColor,
        ...fontSize(deviceInfoModule.isTablet() ? 12 : 13),
      },
      buttonTextStyle: {
        flex: 1,
        fontFamily:fontFamily.Inter,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
      },
  });

export default Styles;