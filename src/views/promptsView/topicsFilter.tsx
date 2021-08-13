import React, { Component } from "react";
import { Alert, Dimensions, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import { Actions } from "react-native-router-flux";
import loaderHandler from "../../common/component/busyindicator/LoaderHandler";
import NavigationHeaderSafeArea from "../../common/component/profileEditHeader/navigationHeaderSafeArea";
import TextNew from "../../common/component/Text";
import { Colors, fontSize} from "../../common/constants";
import EventManager from "../../common/eventManager";
import { action_close, check, plus, topics_filter } from "../../images";
import { GetPrompts } from "../myMemories/myMemoriesWebService";

 type Props={[x: string] : any};
 type State={[x: string] : any};
 var topicsArr: any = [];
 var filterValues: any = [];
 var filterAdded: boolean = false;
 export default class TopicsFilter extends React.Component<State,Props> {
    state : State = {
        topicsArray : [],
        filteredTopics : []
    }
    
    constructor(props: Props) {
        super(props); 
    }

    componentDidMount(){
        for (var key in this.props.categories) {
            // this.props.categories["id"] = 0;
            topicsArr.push(this.props.categories[key]);
            // var result = topicsArr.map(function(el: any) {
            //     var o = Object.assign({}, el);
            //     o.isActive = 0;
            //     return o;
            //   })
            this.setState({topicsArray :topicsArr});
        } 
    }

    topicItemClicked(value : any, checkValue : any){
        filterAdded = true;
        let checkVal = checkValue == 1 ? 0 : 1;
        filterValues = [];
        this.state.topicsArray.filter((element : any)=> {
            if(element.value == value){
                element.checked = checkVal;
            }
            if(element.checked ==1){
                filterValues.push(element.value);
            }
        });
        let finalFilter = filterValues.join();
        this.setState({filteredTopics :finalFilter })
    }

    componentWillUnmount(){
        topicsArr = [];
        filterValues = [];
        filterAdded = false;
    }

    applyFilters() {
       if(filterAdded){
        loaderHandler.showLoader();
        GetPrompts(this.state.filteredTopics,false,0);
        this.setState({});
        EventManager.callBack("scrollFlatlist");
        Actions.pop();
       }else{
        EventManager.callBack("scrollFlatlist");
        Actions.pop();
       }
    }

    render() {
        return(
            <View style={{height: Dimensions.get('window').height, position: 'absolute', top: 0, left: 0, width: '100%'}}>
                <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                    <NavigationHeaderSafeArea heading={'Topics'} showCommunity={false} cancelAction={()=> Actions.pop()} 
                                    showRightText={false} isWhite={true} backIcon={action_close}/>
                    <StatusBar barStyle={'dark-content'} backgroundColor={Colors.NewThemeColor} />
                        <ScrollView style={{flex: 1, marginBottom : 30}}>
                        <View>
                            <View style={{flexDirection : 'row', flexWrap : 'wrap'}}>
                                {(this.state.topicsArray.length > 0) &&  this.state.topicsArray.map((obj : any, index : any) => {
                                        return (<TouchableHighlight underlayColor={'none'} onPress={()=> this.topicItemClicked(obj.value, obj.checked)} style={[styles.filterItem, {backgroundColor : obj.checked == 1 ? Colors.selectedFilter : Colors.filterBG}]}>
                                                <View style={{flexDirection:'row'}}>
                                                    <Image source={obj.checked == 1 ? check : plus} style={{width: 15, height: 15, resizeMode: "contain", alignSelf:'center',justifyContent:'center',marginRight: 5, marginBottom: 3}}></Image>
                                                    <Text style={[styles.filterText, {color: obj.checked == 1 ? Colors.TextColor :Colors.TextColor}]}>{obj.label}</Text>
                                                </View>
                                                </TouchableHighlight>)
                                        })} 
                            </View>
                        </View>
                        </ScrollView>
                        <View style={styles.bottomView}>
                        <TouchableHighlight underlayColor={'none'} onPress={()=> this.applyFilters()}>
                            <View style={{backgroundColor : Colors.ThemeColor, width : 300, padding : 10, alignItems : 'center', justifyContent: 'center', borderRadius : 20}}>
                                <TextNew style={{fontWeight: '400', ...fontSize(16), color: '#fff'}}>Apply Topics</TextNew>
                            </View>
                        </TouchableHighlight>
                 {/* <View style={{height: 50, position : 'absolute', bottom : -50, width : '100%', backgroundColor : '#fff'}}/> */}
                </View>
                </SafeAreaView>
              </View>
        );
    }
   
}   
const styles = StyleSheet.create({
    filterHeader : {
        flexDirection: 'row', justifyContent: 'space-between', backgroundColor : Colors.NewLightCommentHeader, padding : 16
    },
    filterHeaderText : {
        ...fontSize(16), fontWeight: '500', color : Colors.TextColor
    },
    filterItem : { margin : 10, padding : 12, paddingBottom: 7, paddingTop: 7, borderRadius: 5 },
    filterText : { ...fontSize(16),fontWeight: Platform.OS === "ios"? '600':'bold', paddingLeft: 6,paddingTop: 2, paddingBottom: 5, paddingRight: 5},
    bottomView:{
        height : Platform.OS == "ios" ? 70 : 100, 
        alignItems : 'center', 
        justifyContent: 'center', 
        borderTopWidth : 0.5,
        borderColor: '#fff',
        width : '100%',         
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 4,
        shadowRadius: 2,  
        elevation: 15
    },
})