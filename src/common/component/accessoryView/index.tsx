import React, {Component} from 'react';
import {Animated, EventSubscription, Keyboard, Platform, ViewStyle, Easing} from 'react-native';
import DeviceInfo from 'react-native-device-info';
export default class AccessoryView extends Component<{style: ViewStyle}, {bottom: Animated.Value}> {
    state = {
        bottom: new Animated.Value(0)
    };

    showSubscription?: EventSubscription = null;
    hideSubscription?: EventSubscription = null;

    componentWillMount(): void {
        this.showSubscription = Keyboard.addListener('keyboardWillShow', this._onShow);
        this.hideSubscription = Keyboard.addListener('keyboardWillHide', this._onHide);
    }

    componentWillUnmount(): void {
        this.showSubscription.remove();
        this.hideSubscription.remove();
    }

    _onShow = (event: {endCoordinates: {height: number, width: number, screenX: number, screenY: number}}) => {
        Animated.timing(this.state.bottom, {
            toValue: event.endCoordinates.height - (Platform.OS == "ios" && DeviceInfo.hasNotch() ? 35 : 0),
            duration: 450,
            easing: Easing.out(Easing.cubic)
        }).start()
    };

    _onHide = () => {
        Animated.timing(this.state.bottom, {
            toValue: 0,
            duration: 0
        }).start()
    };

    render() {
        return (
            <Animated.View style={[{position: 'absolute', bottom: this.state.bottom}, this.props.style]}>
                {this.props.children}
            </Animated.View>
        );
    }
}