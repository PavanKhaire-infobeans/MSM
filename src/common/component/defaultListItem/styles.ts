import { Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../constants';

const Styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
    borderBottomColor: '#909090',
    minHeight: 65,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationCountBG: {
    marginRight: 15,
    backgroundColor: Colors.NewRadColor,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 1,
    paddingBottom: 1,
    borderRadius: 10,
  },
  notificationCountText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
  },
  width100:{
    width: '100%'
  },
  headercontainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  imageStyle:{
    width: 24,
    height: 24,
    resizeMode: 'center',
    marginRight: 15,
  },
  textContainer:{
    flexDirection: 'column', 
    paddingRight: 10, 
    flex: 1
  },
  title:{
    ...fontSize(18), 
    color: Colors.TextColor
  },
  subTitle:{
    paddingTop: 5,
    color: Colors.TextColor,
    ...fontSize(14),
  },
  countContainer:{
    flexDirection: 'row', 
    alignItems: 'center'
  },
  
});

export default Styles;