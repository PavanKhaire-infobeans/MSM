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
  navigatopnHeaderContainer: {
    width: '100%',
    position: 'absolute',
    top: 0
  },
  activityIndicatorStyle: {
    flex: 6,
    justifyContent: 'center'
  },
  flatListStyle: {
    width: '100%',
    backgroundColor: Colors.white
  },
  profileImage: {
    width: '100%',
    height: 115,
    backgroundColor: '#E6F0EF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagebackGroundStyle: {
    width: 75,
    height: 75,
    borderRadius: 40,
    marginLeft: 16
  },
  imageStyle: { 
    width: 75,
    height: 75,
    borderRadius: 40 
  },
  fullNameContainer:{
    alignItems: 'flex-start', 
    paddingLeft: 10
  },
  fullName:{
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    ...fontSize(18),
    color: Colors.newTextColor,
  },
  viewProfile:{
    paddingTop: 6,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500',
    ...fontSize(16),
    color: Colors.NewTitleColor,
  }
});

export default Styles;