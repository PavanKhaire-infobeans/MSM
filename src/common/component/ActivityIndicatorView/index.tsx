import React, { Component } from "react";
import { View, ActivityIndicator } from 'react-native'
type Props = { size: "small" | "large"; };
export default class ActivityIndicatorView extends Component<Props> {
    render() {
        return (
            <View style={{ height: "100%", width: "100%", position: "absolute", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator animating={true} size={this.props.size} />
            </View>
        )
    }
}
