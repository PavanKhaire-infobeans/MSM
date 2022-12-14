import { Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../../src/common/constants';

const Styles = EStyleSheet.create({
    name: {
        color: Colors.TextColor,
        ...fontSize(10),
        lineHeight: 15,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
         fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
    },
    titleText: {
        color: Colors.TextColor,
        ...fontSize(16),
        lineHeight: 20,
        textAlign: 'left',
        // fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
    },
    cancleText: {
        color: Colors.newDescTextColor,
        ...fontSize(16),
        width: '100%',
        textAlign: 'center',
        fontWeight: '400',
        fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
        lineHeight: 16
    },
    JumptoText: {
        color: Colors.newDescTextColor,
        fontSize: 16,
        width: '100%',
        textAlign: 'center',
        fontWeight: '400',
        fontFamily: fontFamily.Inter,
        lineHeight: 16
    },
    height4:{
        height:4
    },
    imageStyle: {
        height: 24,
        width: 24
    },
    imageSeparator: {
        height: 4
    },
    textContainer: {
        height: 32
    },
    imageContainer: {
        height: 24
    },
    profileImgSeparator:{ 
        height: 32, 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingTop: 8 
    },
    titleContainer: {
        justifyContent: 'center',
        // paddingTop: 10,
        marginTop: -10,
        flex: 6,
        paddingLeft: 10,
        alignSelf: 'center'
    },

    leftButtonTouchableContainer: {
        justifyContent: 'space-evenly',
        height: '100%',
        width: '100%',
        flex: 1,
        paddingLeft: 8,
        // marginTop: 5,
    },

    leftButtonContainer: {
        backgroundColor: 'transparent',
        borderColor: '#ffffff',
        borderWidth: 2,
        height: 28,
        width: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    leftButtonMSMContainer: {
        backgroundColor: 'transparent',
        height: 28,
        width: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        // height: '80%',
        width: '100%',
        marginLeft: 16,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    leftCrossButtonContainer: {
        backgroundColor: Colors.NewRadColor,
        alignItems: 'center',
        justifyContent: 'center',
    },

    leftButtonLogo: {
        width: 30,
        height: 30
    },

    rightButtonsContainer: {
        flex: 1,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    rightButtonsTouchable: { 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    avatar: { height: 30, width: 30, borderRadius: 15, alignContent: 'center' },

    rightButtonsBackgroundImage: { width: 30, height: 30 },

    rightButtonsBadge: {
        position: 'absolute',
        height: 15,
        width: 15,
        right: 10,
        top: 4,
        zIndex: 9999,
        backgroundColor: '#ff0000',
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 8,
        alignContent: 'center',
    },
    rightButtonsBadgeText: {
        ...fontSize(10),
        color: '#ffffff'
    },
    container: {
        flexDirection: 'row',
        width: '100%',
        height: 68,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 2,
        // paddingHorizontal:10,
        borderBottomColor: Colors.bottomTabColor
    },
    rightContainer: {
        flex: 1.5,
        justifyContent: 'center',
        marginRight: 8
    },
    filterContainer: {
        height: '65%',
        width: '90%',
        alignSelf: 'center',
        padding: 5,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: Colors.bordercolor
    },
    marginBottom:{ 
        marginBottom: 8 
    }
});

export default Styles;