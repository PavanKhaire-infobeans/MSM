import React from 'react';
import { SafeAreaView, FlatList, StatusBar, View } from "react-native";
import WebView from "react-native-webview";
import {icon_people, 
        icon_events, 
        icon_settings,
        icon_faq, 
        icon_info, 
        icon_headset,
        block_user,
        icon_tickets,
        guide_tour_icon} from '../../images'
import DefaultListItem from '../../common/component/defaultListItem';
import { Colors } from '../../common/constants';
import { Actions } from 'react-native-router-flux';
import { Account } from '../../common/loginStore';
import NavigationBar from '../dashboard/NavigationBar';
import { TabItems } from '../../common/component/TabBarIcons';
import { GetBlockedUsersAndMemory, kBlockedUsers } from '../myMemories/myMemoriesWebService';
import DefaultPreference from 'react-native-default-preference';

type items = {
    title : string,
    showArrow : boolean,
    icon? : any,
    count : number,
    key : string,
    isWebPage : boolean,
    isLast? : boolean,
    isTour? : boolean
};

const People = "People";
const BlockedUsers = "Blocked Users";
const PrivacyPolicy = "Privacy Policy";
const FAQs = "FAQs";
const Contact = "Contact Us";
const About = "About My Stories Matter";
const GuidedTour = "Guided Tour"

export default class MoreOptions extends React.Component {
    
    Items : Array<items> = [
            // {title: People, showArrow : true, icon: icon_people, count : 0, key : People},
            // {title: Events, showArrow : true, icon: icon_events, count : 0, key : Events},
            // {title: Settings, showArrow : true, icon: icon_settings, count : 0, key : Settings},
            {title: FAQs, showArrow : true, icon: icon_faq, count : 0, key : FAQs, isWebPage : true},
            // {title: Contact, showArrow : true, icon: icon_headset, count : 0, key : Contact},
            {title: About, showArrow : true, icon: icon_info, count : 0, key : About, isWebPage : true},
            {title: PrivacyPolicy, showArrow : true, icon: icon_tickets, count : 0, key : PrivacyPolicy, isWebPage : true},
            {title: GuidedTour, showArrow : false, icon: guide_tour_icon, count : 0, key : GuidedTour, isWebPage : false, isTour : true},
            {title: BlockedUsers, showArrow : false, icon: block_user, count : 0, key : BlockedUsers, isLast: true, isWebPage : false}]
    
    segregateItemClick(identifier: any, isWebPage : boolean, isTour : boolean){
        if(isWebPage){
            var url = `https://${Account.selectedData().instanceURL}/`
            switch(identifier){
                case FAQs: url = url + "faq"
                    break;            
                case Contact: url = url + "contactus"
                    break;
                case About: url = url + "content/about-us"
                    break;        
                case PrivacyPolicy: url = url + "content/privacy-policy"
                    break;
                default :     
            }
            url = url + '?no_header=1'
            Actions.push("commonWebView", {url : url, title : identifier})
        } else if(isTour){
            DefaultPreference.set('hide_guide_tour', "false").then(function() {});
            Actions.push("dashboard", {setTimer : "false"});
        }else{
            Actions.push("blockedUsers");
          }
    }

    render() {
        return (
            <View style={{flex: 1}}>
            <SafeAreaView style={{width: "100%", flex: 0, backgroundColor : Colors.NewThemeColor}}/>                   
                <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>    
                <View style={{flex: 1}}>
                <NavigationBar title={"More Options"}/>
            <StatusBar barStyle={'dark-content'} backgroundColor={Colors.NewThemeColor} />
                <FlatList
                    data={this.Items}
                    keyExtractor={(_, index: number) => `${index}`}
                    style={{width: '100%', backgroundColor: 'white'}}
                    renderItem={({item: data}) => {
                                return (
                                  <DefaultListItem 
                                  title={data.title} 
                                  showArrow={data.showArrow}
                                  icon={data.icon ? data.icon : ""}
                                  count={data.count}
                                  identifier={data.key}
                                  isLast={data.isLast? data.isLast : false}
                                  onPress= {(identifier: any) =>{this.segregateItemClick(identifier, data.isWebPage, data.isTour)}}></DefaultListItem>
                                )
                            }}
                            />
                            </View>                   
            </SafeAreaView>
            </View>
        );
    }
}