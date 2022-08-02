import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../../common/constants';
import Utility from '../../../common/utility';

const Styles = EStyleSheet.create({
    normalText: {
        ...fontSize(16),
        fontWeight: "normal",
        color: Colors.newTextColor,
        fontFamily: fontFamily.Inter,
        marginBottom: 10
    },
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
    linearGardStyle:{ 
        height: 50, 
        width: '100%', 
        position: 'absolute', 
        bottom: 18 
    },
    linearGardBottomStyle:{ 
        height: 20, 
        width: '100%', 
        position: 'absolute', 
        bottom: 0 
    },
    leftFilterImageContainerStyle:{ 
        width: 48, 
        justifyContent: 'center', 
        alignItems: 'flex-end' 
    },
    rightFilterImageContainerStyle:{ 
        width: 48, 
        justifyContent: 'center', 
        alignItems: 'flex-start' 
    },
    noTimelineNextYearView:{ 
        width: 64, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    timelineDateContainer:{ 
        width: Utility.getDeviceWidth() - 96, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingLeft: 16 
    },
    leftArrowImageContainer:{ 
        width: 26, 
        height: 22, 
        position: 'absolute', 
        left: 16, 
        zIndex: 9 
    },
    rightArrowContainer:{ 
        width: 26, 
        height: 22, 
        position: 'absolute', 
        right: 0, 
        zIndex: 9, 
        transform: [{ rotate: '180deg' }] 
    },
    imageStyle:{ marginLeft: -5 },
    imageRightStyle:{ marginRight: -5 },
    timelineDateSeparator:{ 
        height: 1, 
        backgroundColor: Colors.newTextColor, 
        width: 46, 
        marginLeft: 24, 
        marginRight: 17 
    },
    viewSeparator:{ width : 46 },
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
    renderSeparator: {
        height: 16,
        width: 20
    },
    fullFlex: {
        flex: 1
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
    audioViewContainerStyle: {
        justifyContent: "space-around",
        flexDirection: "row",
        marginTop: 0,
        marginBottom: 10
    },
    audioViewSubContainerStyle: {
        flex: 1,
        elevation: 2,
        backgroundColor: Colors.timeLinebackground,
        borderColor: Colors.bottomTabColor,
        borderWidth: 2,
        borderRadius: 10
    },
    newnormalText: {
        ...fontSize(15),
        fontWeight: "400",
        fontFamily: fontFamily.Inter,
        color: Colors.newTextColor,
        lineHeight: 18.75
    },
    currentYearText: {
        ...fontSize(19),
        fontWeight: "700",
        fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterBold,
        color: Colors.newDescTextColor,
        lineHeight: 23.75
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignContent: "center"
    },
    sideMenu: {
        paddingTop: 15,
        bottom: 0,
        left: 0,
        backgroundColor: Colors.white,
        minHeight: 50,
        width: "100%",
        position: "absolute",
        borderRadius: 5,
        shadowOpacity: 1,
        elevation: 3,
        borderWidth: 0.5,
        borderColor: Colors.colorBlackOpacity5,
        shadowColor: Colors.redgray,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 }
    },
    audioPlayerContainer: {
        width: "100%",
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: "center"
    },
    marginLeft10: {
        marginLeft: 10
    },
    moreButtonStyle: {
        flex: 1,
        justifyContent: "center"
    },
    moreTextStyle: {
        color: Colors.white,
        fontFamily: fontFamily.Inter,
        fontWeight: '400',
        ...fontSize(15),
        textAlign: 'center',
    },
    audioMoreContainerStyle: {
        width: 56,
        marginLeft: 7,
        elevation: 2,
        backgroundColor: Colors.timeLinebackground,
        borderColor: Colors.bottomTabColor,
        borderWidth: 2,
        borderRadius: 10
    },
    renderFooterStyle: {
        width: "100%",
        height: 40,
        marginTop: 20
    },
    fromDateContainerStyle: {
        width: "100%",
        justifyContent: 'center',
        backgroundColor: Colors.timeLinebackground,
        // padding: 10 
    },
    filterDateCOntainer: {
        flex: 1,
        width: "100%",
        flexDirection: 'row',
        height: 56,
        // alignItems:'center' ,
    },
    emptyStyle: {
        flex: 0.8,
        width: "30%",
    },
    activityStyle: {
        flex: 1,
        justifyContent: "center"
    },

});

export default Styles;