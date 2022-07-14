import { Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../../../src/common/constants';

const Styles = EStyleSheet.create({
    activityViewStyle: {
        padding: 15,
        borderTopWidth: 7,
        borderBottomWidth: 0.5,
        borderColor: Colors.NewThemeColor,
        backgroundColor: Colors.white,
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    authorContainer: {
        height: 42,
        width: 42,
        borderRadius: 21,
        marginRight: 21,
        overflow: 'hidden',
    },
    authorImageStyle: {
        height: 42,
        width: 42,
        marginRight: 21,
        borderRadius: 21,
        backgroundColor: Colors.NewThemeColor,
    },
    activityUserCountStyle: {
        position: 'absolute',
        height: 42,
        width: 42,
        borderRadius: 21,
        marginRight: 20,
        overflow: 'hidden',
        backgroundColor: Colors.backrgba,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityUserCountTextStyle: {
        ...fontSize(18),
        fontWeight: '500',
        color: Colors.white,
        fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    },
    fullFlex: {
        flex: 1
    },
    displayNameTextStyle: {
        color: Colors.NewTitleColor,
        ...fontSize(18),
        paddingRight: 10,
        fontFamily: fontFamily.Inter,
        textAlign: 'left',
    },
    dateTextStyle: {
        ...fontSize(14),
        color: Colors.newTextColor,
        fontFamily: fontFamily.Inter,
        paddingTop: 10,
        paddingBottom: 15,
        fontStyle: 'italic',
    },
    notesToCollabrationTextStyle: {
        ...fontSize(16),
        color: Colors.newTextColor,
        fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
        paddingBottom: 15,
        fontWeight: '500',
        fontStyle: 'italic',
    },
    errorTextStyle: {
        color: Colors.ErrorColor,
        fontFamily: fontFamily.Inter,
        ...fontSize(16)
    },
    openMemoryButtonStyle: {
        alignSelf: 'baseline',
        paddingRight: 30,
        paddingLeft: 34,
        backgroundColor: Colors.BtnBgColor,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 17,
    },
    buttonTextStyle: {
        color: Colors.white,
        fontFamily: fontFamily.Inter,
        ...fontSize(18)
    },
    activityIndicatorContainer:{
        width: '100%', 
        height: 50
    },
    flatlistStyle:{
        width: '100%', 
        backgroundColor: Colors.white
    },
    mainContainer:{
        flex: 1, 
        backgroundColor: Colors.white
    },
    noActivityCOntainerStyle:{
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        alignSelf: 'center',
        top: 0,
        position: 'absolute',
      },
      noActivityTextStyle:{
        ...fontSize(18),
        color: Colors.darkGray,
        fontFamily:fontFamily.Inter,
        textAlign: 'center',
        paddingLeft: 16,
        paddingRight: 16,
      }
});

export default Styles;