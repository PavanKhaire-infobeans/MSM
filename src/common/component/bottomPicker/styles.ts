import { Platform } from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontSize, fontFamily } from '../../constants';

const Styles = EStyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  animatedView: {
    backgroundColor: 'white',
    maxWidth: '100%',
    width: '100%',
    position: 'absolute',
  },
  fullScreenAnimatedView: {
    top: 0,
  },
  halfScreenAnimatedView: {
    borderRadius: 15,
    bottom: -10,
  },
  containerFull: {
    paddingTop: deviceInfoModule.hasNotch() ? 30 : 15,
    borderBottomColor: 'rgba(0, 0, 0, 0.24)',
    borderBottomWidth: 2,
  },
  profileEditor: {
    height: 54,
    borderBottomColor: 'rgba(0, 0, 0, 0.24)',
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    width: '100%',
    backgroundColor: Colors.ErrorColor,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  searchBar: {
    backgroundColor: Colors.SerachbarColor,
  },
  pickerContainer: {
    borderColor: '#aaaaaa',
    borderBottomWidth: 1,
    width: '100%',
    height: 45,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  pickerSubContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 16
  },
  pickerText: {
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    ...fontSize(18),
    color: Colors.newTextColor,
  },
  height100: { height: '100%' },
  imageMargin: { marginLeft: 15 },
  sellectAllText: {
    marginLeft: 15,
    ...fontSize(16),
    fontFamily: fontFamily.Inter
  },
  renderSeparator:{
    backgroundColor: '#ccc',
    height: 1,
    width: '100%',
    marginRight: 15,
    marginLeft: 15,
  },
  flatlistContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingStart: 5,
    height: 56,
  },
  emptyView:{
    backgroundColor: '#ccc',
    height: 1,
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingStart: 5,
    height: 56,
  },
  imageClose: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 11,
    paddingRight: 16,
  },
  errorText: {
    ...fontSize(14),
    lineHeight: 16,
    textAlign: 'left',
    color: '#fff',
    paddingBottom: 5,
    paddingTop: 5,
  }
});

export default Styles;