import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import { Colors, fontSize } from "../../constants"
import { warning_icon} from "../../../images";
import TextNew from '../Text';
export default class NoInternetView extends Component<{tryAgain : () => void}> {

    render() {
        return (
            <View style={{height: '100%', paddingLeft: 50, paddingRight: 50, width: '100%', backgroundColor: 'white', justifyContent: "center", alignItems: "center"}}>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                    <Image style={{ marginBottom : 15 }} source={warning_icon} resizeMode="contain"/>
                    <TextNew style={{...fontSize(18), fontWeight: Platform.OS === "ios"? '500':'bold', paddingBottom: 10, color: '#000', textAlign: "center"}}>No internet connection available</TextNew>
                    <TextNew style={{...fontSize(16), fontWeight: 'normal', color: '#555', textAlign:"center"}}>Please make sure your device is connected to the internet</TextNew>
                    <TouchableOpacity onPress={() => {this.props.tryAgain()}}>
                        <TextNew style={{marginTop: 20, textAlign: "center", fontSize: 16, fontWeight: Platform.OS === "ios"? '500':'bold', color: Colors.ThemeColor}}>Try Again</TextNew>
                    </TouchableOpacity>
                </View>
            </View>            
        );
    }
}