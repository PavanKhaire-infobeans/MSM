import { Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontSize, fontFamily } from '../../constants';

const Styles = EStyleSheet.create({
  paginationContainerStyle: {
    backgroundColor: 'transparent',
    marginTop: -35,
    marginBottom: -15,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: -5,
    backgroundColor: Colors.white,
  },
  carouselContainer: {
    width: Dimensions.get('screen').width-50,
    paddingHorizontal:16,
    alignItems: 'center',
    height: 100,
    justifyContent: 'center',
  },
  slider: {
    marginTop: 15,
    // overflow: 'visible' // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10 // for custom animation
  },
  promptTextStyle: {
    width:'100%',
    textAlign: 'center',
    ...fontSize(22),
    fontFamily: fontFamily.Inter,
    color: Colors.white,
  },
  buttonContainer: {
    width: 200,
    padding: 10,
    borderRadius: 50,
    borderColor: Colors.white,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonTextColor: {
    ...fontSize(18),
    color: Colors.white,
    fontWeight: '400',
    fontFamily: fontFamily.Inter,
  }

});

export default Styles;