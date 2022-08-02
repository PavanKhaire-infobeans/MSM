import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize, Size } from '../../common/constants';

const Styles = EStyleSheet.create({
  headerStyle:{
    backgroundColor: Colors.ThemeColor,
    height: 54,
    paddingTop: 1,
  },
  headerLeftContainer:{
    width: 158,
    marginLeft: 8,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  backbutton:{
    width: 50,
    marginLeft: 6,
    bottom: -2,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tips:{
    color: Colors.white,
    ...fontSize(18),
    fontWeight:'600',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.IntersemiBold,
    marginLeft: 30,
    marginBottom: 8,
  },
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.NewThemeColor,
  }
});

export default Styles;