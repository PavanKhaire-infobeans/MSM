import { StatusBar } from 'react-native';
import React from 'react';
//@ts-ignore
import NavigationHeader from '../navigationHeader';
import ThemeHeader from '../profileEditHeader/themeHeader';
import { Colors } from '../../constants';
import Utility from '../../utility';

const NavigationThemeBar = (props) => {
  return (
    <NavigationHeader
      removePadding={props.removePadding}
      backgroundColor={props.backgroundColor}
      style={{
        borderBottomWidth: props.hideBottomSeparator ? 0 : 2,
        borderBottomColor: Colors.backrgba,
      }}>
      <StatusBar
        barStyle={Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={Colors.NewThemeColor}
      />
      <ThemeHeader
        heading={props.heading}
        showCommunity={props.showCommunity}
        cancelAction={() => props.cancelAction()}
        showRightText={props.showRightText}
        rightText={props.rightText}
        saveValues={() => props.saveValues()}
        rightIcon={props.rightIcon}
        showHideMenu={() => props.showHideMenu()}
        hideClose={props.hideClose}
      />
    </NavigationHeader>
  );
}

export default NavigationThemeBar;
