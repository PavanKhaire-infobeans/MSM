import {StyleSheet} from 'react-native';
import {fontSize, Colors} from '../../../constants';

export const styles = StyleSheet.create({
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
  }
});
