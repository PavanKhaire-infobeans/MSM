import { StatusBar, Platform } from 'react-native';
import React from 'react';
//@ts-ignore
import NavigationHeader from "../navigationHeader";
import ProfileEditHeader from '../profileEditHeader';
import ThemeHeader from '../profileEditHeader/themeHeader';
import { Colors } from '../../constants';

class NavigationThemeBar extends React.Component<{ [x: string]: any }> {
    render() {
        return (
            <NavigationHeader removePadding={this.props.removePadding} backgroundColor={this.props.backgroundColor} style={{ borderBottomWidth: this.props.hideBottomSeparator ? 0 : 2, borderBottomColor: 'rgba(0, 0, 0, 0.24)' }}>
                <StatusBar barStyle={'dark-content'} backgroundColor = {Colors.NewThemeColor}/>
                <ThemeHeader heading={this.props.heading} showCommunity={this.props.showCommunity} cancelAction={() => this.props.cancelAction()} showRightText={this.props.showRightText} rightText={this.props.rightText} saveValues={() => this.props.saveValues()} rightIcon={this.props.rightIcon} showHideMenu={()=> this.props.showHideMenu()} hideClose={this.props.hideClose}/>
            </NavigationHeader>
        );
    }
}

export default NavigationThemeBar;