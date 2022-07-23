import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors } from '../../common/constants';

const Styles = EStyleSheet.create({

  flexContainer: {
    flex: 1
  },
  
  loginSSOButtonStyle:{
    width: '100%', 
    height: 56, 
    alignItems: "center", 
    justifyContent: "center", 
    flexDirection: "row",
    paddingHorizontal:16, 
    borderRadius: 1000, 
    backgroundColor: Colors.white
  },
  ssoTextStyle:{ 
    marginLeft: 8, 
    color: Colors.newDescTextColor  
  },
  separatorHeightStyle16:{
    height: 16, 
  },
  separatorHeightStyle32:{
    height: 32, 
  }

});

export default Styles;