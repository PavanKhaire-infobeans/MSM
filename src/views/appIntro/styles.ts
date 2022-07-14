import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../common/constants';

const Styles = EStyleSheet.create({

  flexContainer: {
    flex: 1
  },
  statusBarConstainer: {
    flex: 0,
    backgroundColor: Colors.NewThemeColor
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.NewThemeColor,
    alignItems: 'center',
  },
  absoluteView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    backgroundColor: Colors.white,
  },
  appIntroImageStyle: {
    resizeMode: 'center',
    marginTop: 20
  },
  paginationContainer:{
    position: 'absolute', 
    bottom: 0, 
    width: '100%'
  },
  startButtonContainer:{
    position: 'absolute', 
    bottom: 50
  },
  startButtonStyle:{
    padding: 5, 
    paddingRight: 15, 
    paddingLeft: 15
  },
  startTextStyle:{
    ...fontSize(22),
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.TextColor,
  },
  dotStyle:{
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0,
    backgroundColor: Colors.TextColor,
  },
  inactiveDotStyle:{
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0,
    backgroundColor: Colors.lightGreen,
  },
  renderAppIntroContainer:{
    paddingTop: 30,
    width: Dimensions.get('window').width,
    flex: 1,
    marginBottom: 50,
  },
  imageBgContainer:{
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBgSubContainer:{
    flex: 2,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
  },
  imageStyle:{
    resizeMode: 'stretch',
    width: Dimensions.get('window').width,
  },
  containtContainerStyle:{
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: '100%',
    bottom: 0,
  },
  animatedViewContainer:{
    flex: 2,
    maxHeight: '72%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  AnimatedViewStyle:{
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ScrollImagesStyle:{
    maxHeight: '100%',
    width: Dimensions.get('window').width,
  },
  emptyView:{
    flex: 0.5, 
    width: '100%'
  },
  descriptionContainer:{
    flex: 1,
    maxHeight: '28%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    paddingTop: 0,
  },
  descriptionAnimatedViewStyle:{
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  descTextContainer:{
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  titleTextStyle:{
    ...fontSize(24),
    color: Colors.TextColor,
    width: Dimensions.get('window').width,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: '500',
    textAlign: 'center',
  },
  descTextStyle:{
    ...fontSize(18),
    color: Colors.TextColor,
    fontFamily:fontFamily.Inter,
    width: Dimensions.get('window').width,
    textAlign: 'center',
    padding: 10,
  }
});

export default Styles;