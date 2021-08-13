import React from "react";
import { Image, View, Platform, Text, Dimensions, Alert } from "react-native";
//@ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";
import { add_content, all_memories_selected, all_memories_unselected, more_options_selected, more_options_unselected, my_memories_selected, my_memories_unselected, notification_selected_active,notification_selected, notification_unselected, notification_unselected_active, prompts_selected, prompts_nonselected } from "../../images";
import { fontSize, Colors } from "../constants";
import EventManager from "../eventManager";
import { EventEmitter } from "events";
import Utility from "../utility";
import { Account } from "../loginStore";

export enum TabItems {
	AllMemories = "All Memories",
	MyMemories = "My Memories",
  AddContent = "Add Content",
  Prompts = "Prompts",
	//Notifications = "Notifications",
	MoreOptions = "More Options"
}

const style =  EStyleSheet.create({
  buttonStyle: {
    fontFamily: 'Rubik',
    textAlign: 'center',
    ...fontSize(12)
  }
})

export const kNotificationIndicator = "notificationIndicators"
export default class TabIcon extends React.Component<{[x: string]: any}> {
      eventListener : EventManager;          
      screenSize = Dimensions.get("screen");     
      title = "Notifications";
      key = Account.selectedData().instanceID+"_"+Account.selectedData().userID;
      constructor(props: any){
        super(props);
       //  this.eventListener = EventManager.addListener(kNotificationIndicator, this.changeNotification)
      }

      changeNotification=(showIcon : boolean)=>{
       // Alert.alert("show..Icon.."+ showIcon);
        // this.isNotification = showIcon;
      }

      render () {
      var img = this.props.focused
            ? all_memories_selected 
            : all_memories_unselected
     // var textColor = "#000000ff"
      var textColor = "rgba(0.216, 0.22, 0.322, 0.75)";
      let paddingTop = 0;
      let font = this.screenSize.width <= 320 ? 12: 14;
      switch (this.props.title || this.title) {
         case TabItems.AllMemories:
              if(this.props.focused){
                img = all_memories_selected;      
                textColor = Colors.TextColor;                
              } else{
                img = all_memories_unselected;
              }              
            break;

        case TabItems.MyMemories:
              if(this.props.focused){                
                img = my_memories_selected;                
                textColor = Colors.TextColor;                
              } else{
                img = my_memories_unselected;
              } 
            break;

        case TabItems.AddContent:
            img = add_content;
            if(this.props.focused){                           
              textColor = Colors.TextColor;              
            }
            break;

        case TabItems.Prompts:
          paddingTop = 4
          if(this.props.focused){                
            img = prompts_selected;                
            textColor = Colors.TextColor;                
          } else{
            img = prompts_nonselected;
          } 
        break;

        // case TabItems.Notifications:            
        //     paddingTop = -2
        //     if(this.props.focused ){
        //       img = notification_selected;  
        //       console.log("Unread notifications this account : ", Utility.unreadNotification[this.key])   
        //       if(Utility.unreadNotification[this.key] > 0){                
        //         img = notification_selected_active;
        //       } 
        //       textColor = Colors.TextColor;              
        //     } else{
        //       img = notification_unselected;
        //       if(Utility.unreadNotification[this.key] > 0){                
        //         img = notification_unselected_active;
        //       } 
        //     }                      
        //     break;

        case TabItems.MoreOptions:
            paddingTop = 2
            if(this.props.focused){
              img = more_options_selected;
              textColor = Colors.TextColor;                            
            } else{
              img = more_options_unselected;
            }   
            break;

            default:
            break;
       }

       return ( 
            <View style={{width: "100%", paddingTop : 1, paddingBottom : 1}}>
            <View  style={{width: "100%", alignItems: "center", paddingTop : paddingTop,
                          borderRadius : this.props.title == TabItems.AddContent ? 7 : 0
                          , backgroundColor : this.props.title == TabItems.AddContent ? Colors.NewDarkThemeColor : "#fff", height : "100%", justifyContent : "center"}} >
                {/* <Text style={{fontFamily : "Rubik", ...fontSize(10), paddingTop: 5+paddingTop, color : textColor, textTransform: 'uppercase', marginBottom : Platform.OS == "android" ? 0 : -10}}>{this.props.title}</Text> */}
                {/* {this.state.isNotification && <View style={{width: 12, height: 12, borderRadius : 6, backgroundColor : Colors.ErrorColor, position: "absolute", right : 5, top : 5}}></View>} */}
                <View style={{position : "absolute", top : "20%", right : "20%", backgroundColor: "#fff", height : 30, width : 50}}></View>
                <Image source={img}/>       
                {this.props.title != TabItems.AddContent && <Text style={{fontFamily : "FiraSansExtraCondensed-Regular",...fontSize(font), paddingTop: 2+paddingTop, color : textColor, marginBottom : Platform.OS == "android" ? 0 : -10,paddingBottom : 1}}>{this.props.title}</Text>}
            </View>
            <View style={{height: 100, position: "absolute", bottom: -100, width: "100%"}}></View>
            </View>
          );                    
    }
}
