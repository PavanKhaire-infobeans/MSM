import React, { RefObject } from "react";
import { TextInput, View, StyleSheet, Image, Platform, Dimensions, TouchableOpacity, ViewStyle, StyleProp, ImageStyle, ActivityIndicator } from "react-native";
import Text from '../Text';
import DeviceInfo from "react-native-device-info";
import { searchIcon, icon_close_black } from '../../../images'
import { fontSize } from "../../constants";

type Props = { [x: string]: any }
export default class SmallLoader extends React.Component<Props> {
	render(){
		return <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
				  <ActivityIndicator
            			color="#000"
            			size="small"
            			style={style.progressBar} />

          			<Text            			
            			style={{color: "#000", ...fontSize(12)}}>
            			{"Loading"}
          			</Text>
			   </View>		
	}
}

const style = StyleSheet.create({
	progressBar: {
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10
	  }
})