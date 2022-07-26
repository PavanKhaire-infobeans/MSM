import {fontSize, Colors} from '../../../constants';
import EStyleSheet from 'react-native-extended-stylesheet';

const Styles = EStyleSheet.create({
  container:{
    width: '100%',
    height: 53,
    flexDirection: 'row',
    backgroundColor: Colors.SerachbarColor,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    borderTopColor: Colors.backrgba,
    borderTopWidth: 1,
  },
  subContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    height: 26,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
    borderRadius: 13,
  },
  countTextStyle:{
    ...fontSize(16), 
    color: Colors.darkGray
  },
  imageContainerStyle:{
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  }
});

export default Styles;