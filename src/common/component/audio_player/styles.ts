import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontSize, fontFamily} from '../../constants';

const Styles = EStyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer:{
    width: '100%',
    padding: 15,
    position: 'absolute',
  },
  minimizedContainer:{
    shadowOpacity: 1,
    elevation: 1,
    shadowColor: '#D9D9D9',
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    width: '100%',
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  height100:{ height: 100 },
  memoryTitleText:{ 
    ...fontSize(18), 
    color: '#fff', 
    marginBottom: 5,
    fontFamily: fontFamily.Inter
  },
  byText:{ 
    ...fontSize(16), 
    color: '#fff', 
    fontFamily: fontFamily.Inter
  },
  songTitleContainer:{
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  marginRight:{ marginRight: 10 },
  sliderStyle:{ 
    flex: 1, 
    marginBottom: 10, 
    padding: 10 
  },
  songTimeContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageAudioContainer:{
    height: 40,
    width: 80,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  playerShowing:{
    elevation: 1,
    marginRight: 5,
    right: 0,
    position: 'absolute',
    backgroundColor: '#000',
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  PlayButtonDefault:{
    height: 20,
    width: 20,
    paddingLeft: 3,
    borderLeftWidth: 17,
    borderTopColor: 'transparent',
    borderTopWidth: 10,
    borderBottomColor: 'transparent',
    borderBottomWidth: 10,
  },
  durationText:{ 
    ...fontSize(12), 
    color: Colors.white, 
    width: 80,
    fontFamily:fontFamily.Inter 
  },
  BackwardIcon:{
    flexDirection: 'row', 
    transform: [{rotate: '180deg'}]
  },
  flexRow:{
    flexDirection: 'row'
  },
  play:{
    height: 30,
    width: 30,
    paddingLeft: 5,
    borderLeftColor: Colors.white,
    borderLeftWidth: 25,
    borderTopColor: 'transparent',
    borderTopWidth: 15,
    borderBottomColor: 'transparent',
    borderBottomWidth: 15,
  },
  column:{
    backgroundColor: Colors.white, 
    flex: 1, 
    width: 7
  },
  transparentCol:{
    backgroundColor: 'transparent', 
    flex: 1, 
    width: 7
  },
  PlayPauseContainer:{
    flex: 1,
    width: 30,
    paddingRight: 7,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  PlayPauseTouch:{
    height: 30, 
    width: 30, 
    marginLeft: 25, 
    marginRight: 20
  }
});

export default Styles;