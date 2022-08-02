import { Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../common/constants';

const Styles = EStyleSheet.create({
    $size: Size.byWidth(40),
    $sizeIcon: Size.byWidth(38),
    row: {
        padding: Size.byWidth(10),
        flexDirection: 'row',
        flex: 1,
        margin: 10,
        backgroundColor: '#F4F1EA',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 5,
    },
    rowSelected: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        margin: 10,
        backgroundColor: '#E6F0EF',
        padding: Size.byWidth(10),
        borderLeftColor: Colors.ThemeColor,
        borderLeftWidth: 5,
        borderRadius: 10,
        marginBottom: 5,
    },
    container: {
        borderRadius: 5,
        borderColor: 'rgb(230,230,230)',
        borderWidth: 2,
        padding: Size.byWidth(16),
        flexDirection: 'row',
        shadowOpacity: 0.75,
        elevation: 3,
        shadowRadius: 5,
        shadowColor: 'rgb(210,210,210)',
        shadowOffset: { height: 0, width: 1 },
        width: '100%',
    },

    actionAdd: {
        height: 40,
        width: 40,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: Colors.ThemeColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },

    innerContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: Size.byWidth(13),
    },

    name: {
        fontStyle: 'normal',
        ...fontSize(Size.byWidth(16)),
        color: 'black',
        textAlign: 'left',
    },

    url: {
        fontStyle: 'normal',
        ...fontSize(Size.byWidth(14)),
        marginTop: Size.byWidth(5),
        color: '#595959',
        textAlign: 'left',
    },
    email: {
        fontStyle: 'normal',
        ...fontSize(Size.byWidth(11)),
        marginTop: Size.byWidth(5),
        marginBottom: Size.byWidth(5),
        color: '#595959',
        textAlign: 'left',
    },
    image: {
        width: '$sizeIcon',
        height: '$sizeIcon',
        backgroundColor: 'transparent',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 2
    },
    imageIcon: {
        width: '$size-8',
        height: '$size-8',
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },
    mainContainer: {
        flex: 1
    },
    communitiesContainer: {
        width: '100%',
        flexDirection: 'row',
        paddingTop: 1,
        backgroundColor: Colors.white,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    communityText: {
        color: Colors.black,
        ...fontSize(16)
    },
    logoutContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    logoutbutton: {
        alignItems: 'center',
        borderRadius: 5,
        justifyContent: 'center',
        height: 45,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#9a3427',
        width: '80%',
    },
    logoutText: { color: Colors.white },
    drawHeaderContainer: {
        width: '100%',
        padding: 15,
        paddingBottom: 7,
        paddingLeft: 5,
    },
    drawHeaderEmptyContainer: {
        width: '100%',
        paddingRight: 15,
        paddingLeft: 15,
        marginBottom: 10,
        backgroundColor: '#DDDDDD',
    },
    drawerContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    emailText: {
        paddingLeft: 10,
        ...fontSize(14),
        color: 'rgba(61, 61, 61, 0.8)',
    },
    
});

export default Styles;