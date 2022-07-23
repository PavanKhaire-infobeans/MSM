import { Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, fontFamily, fontSize } from '../../common/constants';
import Utility from '../../common/utility';

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
  LoginHeader:{ 
    width: Utility.getDeviceWidth() - 48, 
    flexDirection: 'row', 
    marginTop: 24
  },
  hederText:{ 
    fontWeight: '500', 
    ...fontSize(36), 
    lineHeight: 45, 
    fontFamily: Platform.OS === 'ios' ? fontFamily.Lora : fontFamily.LoraMedium, 
    color: Colors.black, 
    textAlign: 'left' 
  },
  inputsContainer:{ 
    height: Utility.getDeviceHeight() * 0.75, 
    width: Utility.getDeviceWidth() - 48, 
    justifyContent: 'space-between' 
  },
  labelStyle:{ 
    marginBottom: 4, 
    marginLeft: 8, 
    color: Colors.newTextColor 
  },
  buttonContainer:{
    width: Utility.getDeviceWidth() - 48,
    justifyContent: "flex-end"
  },
  loginTextStyle:{ 
    color: Colors.white, 
    marginRight: 12
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