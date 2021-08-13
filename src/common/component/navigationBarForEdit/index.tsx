import { StatusBar, Platform } from 'react-native';
import React from 'react';
//@ts-ignore
import NavigationHeader from "../navigationHeader";
import ProfileEditHeader from '../profileEditHeader';
import { Colors } from '../../constants';

class NavigationBarForEdit extends React.Component<{ [x: string]: any }> {
    render() {
        return (
            <NavigationHeader backgroundColor="#fff" style={{ borderBottomWidth: 2, borderBottomColor: 'rgba(0, 0, 0, 0.24)' }}>
                <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'Dark-content'} backgroundColor = {Colors.NewThemeColor} />
                <ProfileEditHeader heading={this.props.heading} cancelAction={() => this.props.cancelAction()} rightText={this.props.rightText} saveValues={() => this.props.saveValues()} />
            </NavigationHeader>
        );
    }
}

export default NavigationBarForEdit;