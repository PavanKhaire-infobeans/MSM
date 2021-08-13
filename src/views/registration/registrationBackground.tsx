import React from "react";

import { View, Image } from "react-native";

import { registrationOrangeDark, registrationOrangeLight, registrationGreenDark, registrationGreenLight } from "../../images";

export default class RegistrationBackground extends React.Component{


render(){
    return(
        <View style={{flex: 1, width: "100%", position: "absolute"}}>
						<Image style={{
							top: -130,
							left : 10,
							position: "absolute",
							}}
							resizeMode='cover'
							source={registrationOrangeDark} />
						
						<Image	style={{top: -165,
							left : -65,
							position: 'absolute',														
							}}
							resizeMode='cover'		
							source={registrationOrangeLight} />

							
						<Image
							style={{
								flex: 1,		 
								top : -20, 	
								left: "-15%",								
								position: "absolute"}}
                                resizeMode='cover'
                                source={registrationGreenDark} />

						<Image
							style={{
								flex: 1,
								top : -5,
								left: "-50%",		  
								position: "absolute"}}
							resizeMode='cover'
							source={registrationGreenLight} /> 					
				</View> 
    )
}
}