import { StatusBar } from 'react-native';
import React from 'react';
//@ts-ignore
import NavigationHeader from '../navigationHeader';
import ProfileEditHeader from '../profileEditHeader';
import { Colors } from '../../constants';
import Utility from '../../utility';
import Styles from './styles';

class NavigationBarForEdit extends React.Component<{ [x: string]: any }> {
  render() {
    return (
      <NavigationHeader
        backgroundColor={Colors.white}
        style={Styles.navigationBarStyle}>
        <StatusBar
          barStyle={Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
          backgroundColor={Colors.NewThemeColor}
        />
        <ProfileEditHeader
          heading={this.props.heading}
          cancelAction={() => this.props.cancelAction()}
          rightText={this.props.rightText}
          saveValues={() => this.props.saveValues()}
        />
      </NavigationHeader>
    );
  }
}

export default NavigationBarForEdit;
