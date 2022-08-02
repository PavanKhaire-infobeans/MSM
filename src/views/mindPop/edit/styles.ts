import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../../common/constants';

const Styles = EStyleSheet.create({

    container: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom: 8,
        backgroundColor: Colors.NewThemeColor,
        flexDirection: 'row',
    },
    tabletSubContainer: {
        width: 150,
        paddingTop: 12,
        height: 44,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    backButton: {
        width: 50,
        marginLeft: 4,
        marginRight: 4,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backImage: {
        height: 28,
        width: 28
    },
    mindPopText: {
        color: Colors.TextColor,
        ...fontSize(18),
        fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
        fontWeight: '500',
    },
    cancelButton: {
        width: 70,
        marginLeft: 10,
        paddingTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
    },
    cancelText: {
        color: Colors.TextColor,
        fontFamily: fontFamily.Inter,
        ...fontSize(16)
    },
    editButton: {
        width: 70,
        paddingTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
    },
    mainContainer: {
        flex: 1
    },
    invisibleView: {
        width: '100%',
        flex: 0,
        backgroundColor: Colors.white,
    },
    containerStyle: {
        width: '100%',
        flex: 1,
        backgroundColor: Colors.white
    },
    scrollViewStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.f5f5f5
    },
    toolBarContainer: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: Colors.SerachbarColor,
        alignItems: 'center',
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderTopColor: Colors.backrgba,
        borderTopWidth: 1,
    },
    keyboardHidContainer: {
        position: 'absolute',
        right: 16,
        top: -30
    },
    buttonContainer: {
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },
    converMemoryContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    converMemory: {
        ...fontSize(18),
        marginLeft: 5,
        color: Colors.ThemeColor
    },
    buttonContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
    },
    emptyContainerStyle: {
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        width: 44,
        height: 44,
    },
    KeyboardAccessoryStyle: {
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
    renderHeaderContainer: {
        padding: 15,
        width: '100%',
        flex: 1,
        marginBottom: 20
    },
    captureMindPopText: {
        paddingTop: 5,
        paddingBottom: 5,
        ...fontSize(18),
        textAlignVertical: 'top',
        minHeight: 220,
        textAlign: 'left',
    },
    textInputStyle: {
        fontFamily: fontFamily.Inter,
        ...fontSize(18),
        textAlignVertical: 'top',
        flex: 1,
        textAlign: 'left',
        minHeight: 150,
        paddingBottom: 15,
    },
    flatListContainer: {
        width: '100%',
        maxHeight: 160,
        backgroundColor: '#fff',
        paddingTop: 10,
        borderTopColor: '#59595931',
        borderTopWidth: 1,
    },
    imageBackgrounStyle: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pdfImagebackground: {
        width: '85%',
        height: '85%',
        marginLeft: 10
    },
    imageBackgrounContainerStyle: {
        backgroundColor: Colors.NewTitleColor,
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageBackgrounsubContainerStyle: {
        height: 20,
        width: 22,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    audioPlayStyle: {
        height: 18,
        width: 17.5
    },
    fileName: {
        color: Colors.NewRadColor,
        ...fontSize(12),
        bottom: 5,
        position: 'absolute',
        alignSelf: 'center',
        textAlign: 'center',
    },
    found: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        borderRadius: 5,
        backgroundColor: '#cccccc85',
    },
    deleteContainer:{
        width: 36,
        height: 36,
        position: 'absolute',
        right: -3,
        top: -3,
        justifyContent: 'center',
        alignItems: 'center',
      },
      deleteSubCon:{
        width: 32,
        height: 32,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
      },
      crossText:{
        color: Colors.white,
        fontWeight: '500',
        fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
        ...fontSize(12),
        lineHeight: 14,
      }
});

export default Styles;