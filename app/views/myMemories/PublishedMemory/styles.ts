import { Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../../../src/common/constants';

const Styles = EStyleSheet.create({
    mainContainer: { flex: 1 },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    normalText: {
        ...fontSize(16),
        fontWeight: 'normal',
        color: '#595959',
        marginBottom: 10,
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignContent: 'center',
    },
    boxShadow: {
        shadowOpacity: 1,
        shadowColor: '#D9D9D9',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
    },
    sideMenu: {
        paddingTop: 15,
        bottom: 0,
        left: 0,
        backgroundColor: '#fff',
        minHeight: 50,
        width: '100%',
        position: 'absolute',
        borderRadius: 5,
        shadowOpacity: 1,
        elevation: 1,
        borderWidth: 0.5,
        borderColor: Colors.backrgba,
        shadowColor: '#CACACA',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
    },
    audioSubContainer: {
        flex: 1,
        elevation: 2,
        backgroundColor: Colors.AudioViewBg,
        borderColor: Colors.AudioViewBorderColor,
        borderWidth: 2,
        borderRadius: 10,
    },
    playButtonContainer: {
        width: 55,
        height: 55,
        marginLeft: 15,
        backgroundColor: '#fff',
        borderRadius: 30,
        borderWidth: 4,
        borderColor: Colors.AudioViewBorderColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    audioButtonContainer: {
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },
    flatlistContainer: {
        height: '100%',
        width: '100%'
    },
    flatlistStyle: {
        width: '100%',
        backgroundColor: Colors.NewThemeColor
    },
    emptyContainer: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 16,
    },
    noMemoriedTextStyle: {
        ...fontSize(18),
        color: Colors.newTextColor,
        fontFamily: fontFamily.Inter,
        textAlign: 'center',
    },
    footerStyle: {
        width: '100%',
        height: 50
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.lightGray,
    },
    audioContainer: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        margin: 16,
        marginTop: 0,
    },
    authorNameContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 16,
        marginBottom: 16,
        height: 58
    },
    flexRow: {
        flexDirection: 'row'
    },
    userImageStyle: {
        height: 42,
        width: 42,
        borderRadius: 21
    },
    userNameTextStyle: {
        ...fontSize(17),
        fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
        color: Colors.newTextColor,
        lineHeight: 20,
        fontWeight: '500'
    },
    playButtonMainContainer:{
        height: 20,
        width: 16,
        justifyContent: 'space-between',
        flexDirection: 'row',
      },
      playButtonStyle:{
        backgroundColor: Colors.AudioViewBorderColor,
        flex: 1,
        width: 5,
      },
      playbuttonTransparentView:{
        backgroundColor: 'transparent',
        flex: 1,
        width: 2,
      },
    moreoptionStyle: {
        height: '100%',
        maxHeight: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        marginBottom: 16,
        marginTop: 0,
        height: 200,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    fullFlex: {
        flex: 1
    },
    moreImagesContainer: {
        backgroundColor: Colors.moreViewBg,
        paddingVertical: 4,
        paddingHorizontal: 8,
        position: 'absolute',
        bottom: 12,
        right: 16,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moreImageTextStyle: {
        color: Colors.white,
        ...fontSize(15),
        fontWeight: '400',
        fontFamily: fontFamily.Inter,
        textAlign: 'center',
    },
    fullHeight: {
        height: '100%'
    },

});

export default Styles;