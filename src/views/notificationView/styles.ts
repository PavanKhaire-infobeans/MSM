import { Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../common/constants';

const Styles = EStyleSheet.create({
  container: { flex: 1 },
  noViewStyle: {
    width: '100%',
    flex: 0,
    backgroundColor: Colors.NewThemeColor,
  },
  safeAreaContextStyle: {
    width: '100%',
    flex: 1,
    backgroundColor: Colors.white
  },
  flatListStyle: {
    width: '100%',
    backgroundColor: Colors.white
  },
  flatListContainer:{
    padding: 15,
    paddingRight: 0,
    borderTopWidth: 16,
    borderBottomWidth: 0.5,
    borderColor: Colors.NewThemeColor,
    width: '100%',
  },
  flatListSubContainer:{
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  profileContainer:{
    height: 42,
    width: 42,
    borderRadius: 21,
    marginRight: 20,
    overflow: 'hidden',
  },
  profileImageSTyle:{
    height: 42,
    width: 42,
    marginRight: 20,
    overflow: 'hidden',
    borderRadius: 21,
    backgroundColor: '#E3E3E3',
  },
  userCountContainer:{
    position: 'absolute',
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCount:{
    ...fontSize(18),
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    color: Colors.white,
  },
  displayName:{
    color: Colors.NewTitleColor,
    ...fontSize(18),
    paddingRight: 5,
    textAlign: 'left',
  },
  date:{
    ...fontSize(14),
    color: Colors.TextColor,
    paddingTop: 10,
    paddingBottom: 15,
    fontStyle: 'italic',
  },
  collaborators:{
    ...fontSize(16),
    color: Colors.TextColor,
    paddingBottom: 15,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
    fontStyle: 'italic',
  },
  errorStyle:{ 
    color: Colors.ErrorColor, 
    ...fontSize(16) 
  },
  openMemoryContainer:{
    alignSelf: 'baseline',
    paddingRight: 30,
    paddingLeft: 34,
    backgroundColor: Colors.BtnBgColor,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
  openmemory:{ 
    color: Colors.white, 
    ...fontSize(18) 
  },
  readContainer:{ 
    padding: 15, 
    paddingTop: 0 
  },
  footer:{ 
    width: '100%', 
    height: 50 
  },
  subContainer:{
    width: '100%',
    flex: 1,
    backgroundColor: Colors.white,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  unSeenContainer:{
    width: '100%',
    height: 50,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  unread:{
    ...fontSize(16),
    padding: 15,
    color: Colors.TextColor,
  },
  allreadCOntainer:{
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allread:{ 
    color: Colors.NewYellowColor, 
    ...fontSize(16),
    marginRight: 5 
  },
  allReadImage:{ 
    height: 18, 
    width: 18 
  },
  noCountContainer:{
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
  noCount:{
    ...fontSize(18),
    color: Colors.TextColor,
    textAlign: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  }
});

export default Styles;