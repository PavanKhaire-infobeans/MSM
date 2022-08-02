import { Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../../common/constants';

const Styles = EStyleSheet.create({
    normalText: {
        ...fontSize(16),
        fontWeight: "normal",
        color: Colors.newTextColor,
        fontFamily: fontFamily.Inter,
        marginBottom: 10
    },
    mainContainer: { flex: 1 },
    boxShadow: {
        shadowOpacity: 1,
        // shadowColor: '#D9D9D9',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        flex: 1,
        elevation: 3,
        backgroundColor: Colors.timeLinebackground,
        borderColor: Colors.bottomTabColor,
        borderWidth: 2,
        borderRadius: 10
    },
    renderSeparator: {
        height: 16,
        width: 20
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center',
        height: '100%',
        backgroundColor: Colors.timeLinebackground
    },
    subcontainer: {
        height: "100%",
        width: "100%",
        backgroundColor: Colors.timeLinebackground
    },
    flatlistStyle: {
        width: (Dimensions.get('window').width - 48),
        alignSelf: 'center',
        backgroundColor: Colors.timeLinebackground
    },
    noItemContainer: {
        position: 'absolute',
        top: 40,
        height: '100%',
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white
    },
    noItemTextStyle: {
        ...fontSize(16),
        fontFamily: fontFamily.Inter,
        color: Colors.newTextColor,
        textAlign: 'center'
    },
    audioContainer: {
        justifyContent: "space-around",
        flexDirection: "row",
        // margin: 16, 
        // marginTop: 16,
        marginBottom: 16
    },
    audioSubContainer: {
        width: "100%",
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: "center"
    },
    playPauseContainer: {
        width: 55,
        height: 55,
        marginLeft: 15,
        backgroundColor: Colors.white,
        borderRadius: 30,
        borderWidth: 4,
        borderColor: Colors.bottomTabColor,
        justifyContent: "center",
        alignItems: "center"
    },
    pauseContainer: {
        height: 20,
        width: 16,
        justifyContent: "space-between",
        flexDirection: "row"
    },
    column: {
        backgroundColor: Colors.bottomTabColor,
        flex: 1,
        width: 5
    },
    columnTransparent: {
        backgroundColor: Colors.transparent,
        flex: 1,
        width: 2
    },
    playbutton: {
        height: 24,
        width: 24,
        marginLeft: 10,
        borderLeftColor: Colors.bottomTabColor,
        borderLeftWidth: 18,
        borderTopColor: Colors.transparent,
        borderTopWidth: 12,
        borderBottomColor: Colors.transparent,
        borderBottomWidth: 12
    },
    filenamecontainer: {
        marginBottom: 5,
        paddingRight: 80
    },
    marginLeft10: {
        marginLeft: 10
    },
    buttonContainer: {
        backgroundColor: Colors.moreViewBg,
        padding: 5,
        borderRadius: 5,
        position: 'absolute',
        bottom: 20,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moreTextStyle: {
        color: Colors.white,
        fontFamily: fontFamily.Inter,
        fontWeight: '400',
        ...fontSize(15),
        textAlign: 'center',
    },
    activityContainer: {
        width: "100%",
        height: 40,
        marginTop: 20
    },
    activityContainerStyle: {
        flex: 1,
        justifyContent: "center"
    },
});

export default Styles;