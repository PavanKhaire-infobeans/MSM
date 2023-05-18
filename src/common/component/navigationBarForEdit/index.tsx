import { StatusBar } from 'react-native';
import React from 'react';
//@ts-ignore
import NavigationHeader from '../navigationHeader';
import ProfileEditHeader from '../profileEditHeader';
import { Colors } from '../../constants';
import Utility from '../../utility';
import Styles from './styles';

const NavigationBarForEdit = (props) => {
  return (
    <NavigationHeader
      backgroundColor={Colors.white}
      style={Styles.navigationBarStyle}>
      <StatusBar
        barStyle={Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={Colors.NewThemeColor}
      />
      <ProfileEditHeader
        heading={props.heading}
        cancelAction={() => props.cancelAction()}
        rightText={props.rightText}
        saveValues={() => props.saveValues()}
      />
    </NavigationHeader>
  );
}

export default NavigationBarForEdit;
