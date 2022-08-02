import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../../common/constants';
import Utility from '../../../common/utility';

const Styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  containerStyle: { flex: 1 },
  ViewFullContainer: {
    position: 'absolute',
    backgroundColor: Colors.white,
    height: '100%',
    width: '100%',
  },
  cancelContainer: {
    padding: 16,
    width: 100,
    alignItems: 'center'
  },
  cancelText: {
    ...fontSize(18),
    fontFamily: fontFamily.Inter,
    color: Colors.ThemeColor
  },
  sliderContainer: {
    alignSelf: 'center',
    marginTop: 95,
    marginBottom: 20,
    height: 60,
  },
  modalContainer:{
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000009f',
  },
  modalSubContainer:{
    backgroundColor: Colors.white,
    height: 200,
    width: 300,
    alignItems: 'flex-start',
    borderRadius: 7,
    paddingRight: 15,
    paddingLeft: 15,
    justifyContent: 'space-around',
  },
  selectedRecordItemContainer:{
    width: '100%',
    height: 60,
    flexDirection: 'row',
    backgroundColor: Colors.SerachbarColor,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    borderTopColor: Colors.backrgba,
    borderTopWidth: 1,
  },
  closeContainer:{
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 44,
  },
  selectedRecordItemButton:{
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  cancelButton:{
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -3,
    right: -15,
  },
  crossText:{
    ...fontSize(15),
    color: 'black',
    fontFamily: Platform.OS == 'ios' ? fontFamily.Inter:fontFamily.IntersemiBold,
    fontWeight: '600',
  },
  textInputContainer:{
    height: 80,
    width: '100%',
    flexDirection: 'row',
    padding: 10,
  },
  textInputSubContainer:{ width: '84%' },
  textInputStyle:{
    width: '100%',
    borderBottomColor: Colors.ThemeColor,
    borderBottomWidth: 2,
    height: 45,
    fontFamily: fontFamily.Inter,
    ...fontSize(15),
  },
  saveText:{ 
    fontFamily: fontFamily.Inter,
    ...fontSize(15), 
    color: Colors.white 
  },
  errorContainer:{
    alignItems: 'flex-start',
    minHeight: 15,
    justifyContent: 'center',
  },
  recordingContainer:{
    alignItems: 'center',
    marginLeft: 6,
    height: 45,
    justifyContent: 'center',
  },
  recordingText:{ 
    ...fontSize(14), 
    fontFamily:fontFamily.Inter,
    color: Colors.black
  },
  errortextStyle:{ 
    ...fontSize(11), 
    fontFamily:fontFamily.Inter,
    color: Colors.ErrorColor 
  },
  SaveAsContainer:{ 
    width: '100%', 
    height: 44, 
    justifyContent: 'center' 
  },
  saveContainer:{ 
    width: '100%', 
    alignItems: 'center' 
  },
  saveButton:{
    borderRadius: 4,
    backgroundColor: Colors.ThemeColor,
    width: 200,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  SliderStyle: { width: 300 },
  recordingStyle: {
    width: 320,
    height: 38,
    alignItems: 'center'
  },
  timeContainer: {
    flex: 1,
    alignItems: 'center'
  },
  timeTextStyle: {
    ...fontSize(24),
    fontFamily: fontFamily.Inter,
    color: Colors.newTextColor
  },
  buttonActionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Size.byWidth(153),
    width: Size.byWidth(153),
    borderRadius: Size.byWidth(153) / 2,
    marginTop: 30,
  },
  recordImageContainer:{ 
    alignItems: 'center', 
    height: '70%' 
  },
  recordImageSubContainer:{
    width: 85,
    marginTop: 13,
    marginBottom: 10,
    alignItems: 'center',
    height: '60%',
    justifyContent: 'center',
  },
  buttonTitleStyle:{ 
    ...fontSize(16), 
    fontFamily: fontFamily.Inter,
    color: Colors.white, 
    bottom: 0 
  },
  selectedItemContainer:{
    position: 'absolute',
    height: 100,
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
  },
  SoundRecorderContainer:{ 
    padding: 16, 
    width: 150, 
    alignItems: 'center' 
  },
  savetextStyle:{ 
    ...fontSize(24), 
    fontFamily: fontFamily.Inter,
    color: Colors.ThemeColor 
  },
});

export default Styles;