import { Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../common/constants';

const Styles = EStyleSheet.create({

  nextDialogViewContainer: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
    backgroundColor: Colors.backrgba,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextDialogViewSubContainer: {
    backgroundColor: Colors.white,
    overflow: 'hidden',
    borderRadius: 10,
    height: 400,
    width: 300,
  },
  saveAsDraftButtonContainer: {
    flex: 1,
    height: '50%',
    borderBottomColor: Colors.backrgba,
    borderBottomWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mindPopButtonContainer: {
    flex: 1,
    height: '50%',
    borderTopColor: Colors.backrgba,
    borderTopWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canclebuttonStyle: {
    top: -10,
    right: -10,
    position: 'absolute',
    backgroundColor: Colors.black,
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: { height: 1, width: 1 },
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancleImageStyle: {
    height: 11,
    width: 11
  },
  selectorButtonContainer: {
    backgroundColor: Colors.ThemeColor,
    width: 250,
    height: 50,
    borderRadius: 35,
  },
  selectorButtonStyle: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    ...fontSize(18),
    marginLeft: 10,
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: fontFamily.Inter,
    color: Colors.white,
  },
  bottomRowView: {
    height: 90,
    width: 105,
    borderRadius: 5,
    backgroundColor: Colors.ThemeColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDialog: {
    ...fontSize(16),
    lineHeight: 20,
    textAlign: 'center',
    color: Colors.newTextColor,
    fontFamily: fontFamily.Inter,
    paddingTop: 20,
    width: 250,
  },
  toolbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.timeLinebackground,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    minHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    borderTopColor: Colors.backrgba,
    borderTopWidth: 1,
  },
  keyboardVisible: {
    width: '100%',
    height: 130,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cameraImageStyle: {
    height: 35,
    resizeMode: 'contain',
    padding: 15
  },
  audioImageStyle: {
    height: 35,
    resizeMode: 'contain'
  },
  bottomTextStyle: {
    ...fontSize(16),
    fontFamily: fontFamily.Inter,
    color: Colors.white,
    paddingTop: 10
  },
  toolbarSubContainer: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  bottomBarContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  buttonContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  keyboardHideImageStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    height: 25,
  },
  subContainerStyle: {
    backgroundColor: Colors.white,
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.backrgba,
  },
  keyboardAccesoryContainer: {
    width: '100%',
    flex: 1,
    minHeight: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    borderTopColor: Colors.backrgba,
    borderTopWidth: 1,
  },
  buttonSubContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  padding15: {
    padding: 15
  },
  RecordContainer: {
    borderWidth: 1,
    height: 120,
    borderRadius: 5,
    overflow: 'hidden',
  },
  RecordContainerImgBackgrounStyle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonMainContainer: {
    backgroundColor: Colors.ThemeColor,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonContainer: {
    height: 20,
    width: 22,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  audioImage: {
    height: 18,
    width: 17.5
  },
  filenameTextStyle: {
    color: Colors.newTextColor,
    ...fontSize(12),
    fontFamily: fontFamily.Inter,
    bottom: 5,
    position: 'absolute',
    alignSelf: 'center',
    textAlign: 'center',
  },
  pdfImageStyle: {
    width: '85%',
    height: '85%',
    marginLeft: 10
  },
  deletefileContainer: {
    width: 36,
    height: 36,
    position: 'absolute',
    right: -15,
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletefileSubContainer: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 16,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossTextStyle: {
    color: 'white',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    ...fontSize(12),
    lineHeight: 14,
  },
  mainConTainer: {
    width: '100%',
    flex: 1,
    backgroundColor: Colors.NewThemeColor,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  fullWidth: {
    width: '100%',
    flex: 1
  },
  inputContainer: {
    padding: 15,
    paddingTop: 24,
    paddingBottom: 25,
    width: '100%',
    flex: 1,
  },
  textInputStyle: {
    fontFamily: fontFamily.Inter,
    ...fontSize(19),
    textAlignVertical: 'top',
    fontWeight: '400',
    lineHeight: 23.75,
    color: Colors.bordercolor,
    fontStyle: 'normal',
    minHeight: 150,
    textAlign: 'left',
    flex: 1,
  },
  attachmentContainer: {
    height: 1,
    backgroundColor: Colors.white
  },
  flatlistStyle: {
    height: 160,
    width: '100%',
    backgroundColor: Colors.white,
  },
  emptyView: {
    position: 'absolute',
    width: '100%',
    height: 100,
    bottom: -100,
    backgroundColor: Colors.white,
  }
});

export default Styles;