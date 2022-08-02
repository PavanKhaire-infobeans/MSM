import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../../common/constants';

const Styles = EStyleSheet.create({
    titleText: {
      color: Colors.TextColor,
      ...fontSize(18),
      lineHeight: 20,
      textAlign: 'left',
      fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
      fontWeight: '500',
    },
  
    titleContainer: {justifyContent: 'center', paddingTop: 10},
  
    leftButtonTouchableContainer: {
      justifyContent: 'center',
      padding: 15,
      marginTop: 5,
    },
  
    leftButtonContainer: {
      backgroundColor: Colors.transparent,
      borderColor: Colors.white,
      borderWidth: 2,
      height: 28,
      width: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    leftCrossButtonContainer: {
      backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    leftButtonLogo: {width: 20, height: 20},
  
    rightButtonsContainer: {
      flex: 1,
      paddingTop: 10,
      paddingRight: 5,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  
    rightButtonsTouchable: {padding: 5, paddingRight: 10},
  
    rightButtonsBackgroundImage: {width: 30, height: 30},
  
    rightButtonsBadge: {
      position: 'absolute',
      height: 16,
      right: 5,
      top: 5,
      backgroundColor: '#ff0000',
      borderColor: Colors.white,
      borderWidth: 1,
      borderRadius: 8,
      alignContent: 'center',
    },
  
    rightButtonsBadgeText: {...fontSize(10), color: Colors.white},
    titleTextStyle:{
        ...fontSize(16),
        fontWeight: '400',
        color: Colors.TextColor,
      },
      leftIMAGCONTAINER:{
        height: '100%',
        backgroundColor: 'transparent',
        flexDirection: 'row',
      },
      imageSTyle:{height: 28, width: 28},
      separator:{
        width: 1,
        backgroundColor: Colors.white,
        height: Platform.OS === 'ios' ? 76 : 54,
        top: Platform.OS === 'ios' ? -20 : 0,
      },
      rightSections:{
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
      },
      selectingItem:{
        height: Platform.OS === 'ios' ? 76 : 54,
        top: Platform.OS == 'ios' ? -20 : 0,
        width: '100%',
        position: 'absolute',
        backgroundColor: '#00000034',
      },
      ipadListContainer:{flexDirection: 'row', flex: 1},
      ipadselectingItem:{
        height: '100%',
        width: '100%',
        position: 'absolute',
        backgroundColor: '#00000034',
      }
  });

export default Styles;