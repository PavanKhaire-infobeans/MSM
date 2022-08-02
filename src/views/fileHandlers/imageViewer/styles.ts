import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../../common/constants';
import Utility from '../../../common/utility';

const Styles = EStyleSheet.create({
  renderLoadingImagecontainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: { flex: 1 },
  subContainer:{
    backgroundColor: Colors.black, 
    justifyContent: 'center',
    flex: 1
  },
  ImageViewerWithZoomStyle:{ 
    marginBottom: 10, 
    backgroundColor: Colors.transparent 
  },
  viewDetailsContainer:{
    width: '100%',
    padding: 15,
    flex: 1,
    backgroundColor: Colors.blackOpacity60,
    position: 'absolute',
    bottom: 50,
    left: 0,
  },
  fileTitle:{
    ...fontSize(16),
    fontWeight: '500',
    color: Colors.grayColor,
    backgroundColor: Colors.transparent,
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    marginBottom: 10,
  },
  fileDesc:{
    ...fontSize(14),
    fontFamily: fontFamily.Inter,
    backgroundColor: Colors.transparent,
    color: Colors.grayColor,
  },
  hideDescriptionContainer:{
    flexDirection: 'row',
    height: 50,
    width: '100%',
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'flex-end',
  },
  fileStext:{ 
    ...fontSize(16), 
    color: Colors.black 
  },
  closeContainer:{
    backgroundColor: '#595959',
    height: 40,
    width: 40,
    top: 20,
    borderRadius: 20,
    position: 'absolute',
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeImageStyle:{
    padding: 15,
  }
});

export default Styles;