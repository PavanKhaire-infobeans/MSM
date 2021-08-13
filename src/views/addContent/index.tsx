import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, TouchableHighlight, Alert, SafeAreaView, TextInput, Keyboard, FlatList, ImageBackground, ScrollView, DeviceEventEmitter, Platform, StatusBar} from "react-native";
import {
    icon_add_content_audio,
    icon_add_content_camera,
    icon_add_content_upload,
    icon_add_content_write,    
    camera,
    record,
    action_camera,
    action_picture,
    action_close,
    sound_wave,
    audio_play,
    icon_upload_file,
    pdf_icon,
    small_close_white_,
    mindpopBarWhiteIcon,
    memory_draft,
    action_audio,
    action_pdf,
    keyboard_hide,
    profile_placeholder,
    icon_send
} from "../../images";
// @ts-ignore
import { KeyboardAwareScrollView } from "../../common/component/keyboardaware-scrollview";
import Text from "../../common/component/Text";
import DeviceInfo from "react-native-device-info";
import { fontSize, Colors, GenerateRandomID, TimeStampMilliSeconds, encode_utf8, NO_INTERNET } from '../../common/constants';
import AccessoryView from '../../common/component/accessoryView';
import { addListener } from 'cluster';
import ActionSheet, { ActionSheetItem } from '../../common/component/actionSheet';
import {PickImage, CaptureImage, PickAudio, PickPDF} from '../../common/component/filePicker/filePicker';
import { element } from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { TempFile } from '../mindPop/edit';
import { FileType } from '../../common/database/mindPopStore/mindPopStore';
import { addEditMindPop, kMindpopContentIdentifier, kAddEditIdentifier, kMindPopUploadedIdentifier } from "../mindPop/edit/addMindPopflow";
import EventManager from '../../common/eventManager';
import { ToastMessage, No_Internet_Warning } from '../../common/component/Toast';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import Utility from '../../common/utility';
import NoInternetView from '../../common/component/NoInternetView';
import { createNew  } from '../createMemory';
import { CreateUpdateMemory} from '../createMemory/createMemoryWebService';
import { DefaultDetailsMemory } from '../createMemory/dataHelper';
//@ts-ignore
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import { Account } from '../../common/loginStore';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import CreateMemoryIntro from '../createMemory/createMemoryIntro';
import DefaultPreference from 'react-native-default-preference';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

type State = {[key: string]: any }

const ImageActions: Array<ActionSheetItem> = [
	{ index: 0, text: "Image", image: action_camera },
    { index: 1, text: "Audio", image: action_audio },
    { index: 2, text: "PDF", image: action_pdf },
	{ index: 3, text: "Cancel", image: action_close }
];

const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false
  };

export default class AddContentDetails extends React.Component {
    _actionSheet: any | ActionSheet = null;
    keyboardDidShowListener : any;
    keyboardDidHideListener : any;
    mindPopCallback : EventManager;
    backListner : any;
    createMemoryListener : EventManager;
    draftDetails : any = {};
    state: State = {
        memoryIntroVisibility: false,
        textContent : "",
        files : [],
        bottomBar:{
            keyboardVisible: false,
            bottom: 0
        },
        actionSheet: {
			type: "none",
			list: ImageActions
        },
        listItems: [{itemType : "editor"}],
        content : "",
        showNextDialog : false
    }

    constructor(props: any){
        super(props);     
        this.addListeners();
    }
    
    componentDidMount=()=>{
        setTimeout(() => {
            DefaultPreference.get('hide_memory_intro').then((value: any) => {
                if(value=='true'){
                   this.setState({memoryIntroVisibility : false});
                } else {
                   this.setState({memoryIntroVisibility : true});
                }
            });
        }, 200);
       
   }
    nextDialogView=()=>{
        return <View style={{position:"absolute",
                            top : 0, height: "100%", 
                            width: "100%", backgroundColor : "rgba(0, 0, 0, 0.3)", 
                            justifyContent: "center", alignItems:"center"}}  
                            onStartShouldSetResponder={() => true} 
                            onResponderStart={()=>this.setState({showNextDialog : false})}>
                        <View>
                        <View style={{backgroundColor : "#fff", overflow:"hidden", borderRadius: 10, height: 400, width: 300}}>
                            <View style={{flex: 1, height: "50%", borderBottomColor: "rgba(0,0,0,0.3)", borderBottomWidth: 0.5, alignItems:"center", justifyContent: "center"}}>
                                {this.selectorButton("Save as Memory Draft", memory_draft, this.createMemory)}
                                <Text style={style.textDialog}>{"If you want to set the Date, Location and Title now."}</Text>
                            </View>
                            <View style={{flex: 1, height: "50%", borderTopColor: "rgba(0,0,0,0.3)", borderTopWidth: 0.5, alignItems:"center", justifyContent: "center"}}>
                                {this.selectorButton("Save as a MindPop", mindpopBarWhiteIcon, this.saveMindPop)}
                                <Text style={style.textDialog}>{"If you want to quickly capture an inkling of a memory before you forget it."}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={{top: -10, right : -10, 
                                        position: "absolute", backgroundColor: "#000", 
                                        height: 24, width: 24, borderRadius: 12, borderWidth : 2, 
                                        elevation : 1,
                                        shadowColor: "#000000", shadowOpacity: 0.8, shadowRadius: 2,
                                        shadowOffset: { height: 1, width: 1 },
                                        borderColor : "#fff", justifyContent: "center", alignItems:"center"}} onPress={()=>this.setState({showNextDialog : false})}>
                            <Image source={small_close_white_} style={{height: 11, width: 11}}/>
                        </TouchableOpacity>
                        </View>    
               </View>
    }  

    selectorButton=(name: any, icon : any, onItemPressed : () => void)=>{
        return <View style={{backgroundColor : Colors.ThemeColor, width:250, height: 50, borderRadius: 35}}>
                    <TouchableOpacity style={{width: "100%", height:"100%", flexDirection: "row", padding: 5, justifyContent: "center", alignItems:"center"}} onPress={()=> {ReactNativeHapticFeedback.trigger("impactMedium", options); onItemPressed()}}>
                        <Image source={icon}/>
                        <Text style={{...fontSize(18), marginLeft: 10, lineHeight: 20, textAlign: "center", color: "#FFFFFF"}}>{name}</Text>
                    </TouchableOpacity>
               </View>
    }
    
    addListeners=()=>{     
        if(Platform.OS == "android"){
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);   
        } else{
            this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardDidHide);   
        }
        this.mindPopCallback = EventManager.addListener(kMindPopUploadedIdentifier, this.mindPopUpdated);
        this.backListner = EventManager.addListener("hardwareBackPress", this._onBack)    
        this.createMemoryListener = EventManager.addListener("addContentCreateMemory", this.createMemoryCallBack)    
        
    }

    createMemoryCallBack=(success : boolean, nid : any, padDetails: any)=>{
        loaderHandler.hideLoader()
        if(success){
            Actions.replace("createMemory", {attachments : this.state.files, 
                        id : nid, textTitle: this.draftDetails.title, 
                        editMode : false ,
                        padDetails : padDetails, location : {description : "", reference: ""},
                        memoryDate: this.draftDetails.memory_date, type : createNew})            
        }
        else{
            ToastMessage("Unable to create memory");
        }
    }

    _onBack=()=>{
        if(this.state.content.trim() != "" || this.state.files.length > 0){
            Keyboard.dismiss();
            setTimeout(() => {
                Alert.alert("Save changes?", `Do you want to save your changes?`, [
                    {
                        text: "No",
                        style: "cancel",
                        onPress: () => {
                            let content = this.state.oldcontent;
                            this.setState({ content }, () => {
                                //Go Back
                                Keyboard.dismiss();
                                Actions.pop();                           
                            });
                        }
                    },
                    {
                        text: "Yes",
                        style: "default",
                        onPress: () => {                                         
                            this.saveMemoryOrMindpop();   
                        }
                    }
                ]);
            }, 10);
        } else{
            Keyboard.dismiss();
            Actions.pop();
        }
    }

    componentWillUnmount=()=>{
        this.mindPopCallback.removeListener();        
        // this.keyboardDidShowListener.removeListener();
        // this.keyboardDidHideListener.removeListener();
    }

    mindPopUpdated=(success : any, mindpopID: any)=>{
        if(success){           
            Actions.replace("mindPop");            
        } else{
            loaderHandler.hideLoader();
        }
    }

    _keyboardDidShow=(e: any)=>{
		this.setState({
            bottomBar : {
                keyboardVisible: true,
                bottom: e.endCoordinates.height
            }
		})		
	}

	_keyboardDidHide=(e?: any)=>{
		this.setState({
			bottomBar : {
               keyboardVisible: false,
               bottom: 0
            }
        })		        
    }

    saveMemoryOrMindpop=()=>{
        if(Utility.isInternetConnected){
            Keyboard.dismiss();
            if (this.state.content.trim() == "" && this.state.files.length == 0) {
                ToastMessage("No changes were made", "black");
            } else{
                if (this.state.content.trim().length == 0) {
                    ToastMessage("Please add a description", Colors.ErrorColor)
                } else{
                    this.setState({
                        showNextDialog : true
                    }) 
                }
            }
        } else {
            No_Internet_Warning();
        }
    }

    createMemory=()=>{
        this.setState({
            showNextDialog : false
        })
        if(Utility.isInternetConnected){    
            this.draftDetails = DefaultDetailsMemory(this.state.content.trim());
            loaderHandler.showLoader("Loading...")
            CreateUpdateMemory(this.draftDetails, [], "addContentCreateMemory")            
        } else{
            No_Internet_Warning();
        }
    }

    saveMindPop=()=>{
        this.setState({
            showNextDialog : false
        }) 
        if(Utility.isInternetConnected){
            let moment = TimeStampMilliSeconds();
            var req: { requestDetails: { mindPopContentArray: Array<any>; mindPopID?: string }; configurationTimestamp: string } = {
                requestDetails: {
                    mindPopContentArray: [
                        {
                            contentType: 1,
                            contentValue: encode_utf8(this.state.content)
                        }
                    ]
                },
                configurationTimestamp: moment
            };
            loaderHandler.showLoader('Saving...')
            addEditMindPop(req, this.state.files, true);
        }
        else {
            No_Internet_Warning();
        }
    }

    cameraAttachmentPress=()=>{
        CaptureImage(this.fileCallback);       
    }

    fileCallback=(file: any)=>{
        let tempfiles = this.state.files;
        file.forEach((element: any) => {
                tempfiles.push(element);            
        }); 
        this.setState({ 
            files : tempfiles
        })            
    }

    audioAttachmentPress=(selectedItem? : any)=>{
        Keyboard.dismiss();
        Actions.commonAudioRecorder({			
            mindPopID: 0,
            selectedItem: selectedItem ? selectedItem : null,
            hideDelete: true,
			editRefresh: (file: any[]) => {
				Keyboard.dismiss()
				let fid = GenerateRandomID();
                let tempFile: TempFile[] = file.map(obj => ({ ...obj, fid }));				
                this.fileCallback(tempFile);
            },
            reset: () => {},
            deleteItem: () => {}
		});
    }

    rowItemPressed=(file: any)=>{
        Keyboard.dismiss();
        switch(file.type){
            case "audios" : if(file.filesize != 0 ) {
                                this.audioAttachmentPress(file)
                            } else { 
                                ToastMessage("This audio file is corrupted", Colors.ErrorColor)
                            };
                break;
            case "files" : Actions.push("pdfViewer", {file: file})   
                break;
            case "images" : Actions.push("imageViewer", {files : [{url : file.thumb_uri}], hideDescription : true})
                break;        

        }
    }

    onActionItemClicked=(index: number): void=>{
        Keyboard.dismiss();
        let file : any = {};
        switch(index){
            case 0 : file = PickImage(this.fileCallback);
                break;
            case 1 : file = PickAudio(this.fileCallback)
                break;    
            case 2 : file = PickPDF(this.fileCallback)
                break;   
        }
    }

    toolbar = () => {
		return ( 
        <KeyboardAccessory style={{backgroundColor: "#fff", position:"absolute", width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center", borderTopWidth: 1, borderBottomWidth: 1, borderColor: "rgba(0,0,0,0.4)"}}>
            <View style={{flex : 1, flexDirection: "row", justifyContent: "center", alignItems : "center"}}>
            <View
				style={{
					width: "100%",
					minHeight: 40,					
					flexDirection: "row",
					backgroundColor: this.state.bottomBar.keyboardVisible ? "#F3F3F3" : "#FFF",
					justifyContent: "space-between",
					alignItems: "center",
					paddingLeft: 10,
					paddingRight: 10,
					borderTopColor: "rgba(0.0, 0.0, 0.0, 0.25)",
					borderTopWidth: 1}}>

                    {!this.state.bottomBar.keyboardVisible ?
                        <View style={{width: "100%", height:130, alignItems:"center", flexDirection: "row", justifyContent: "space-around"}}> 
                        <TouchableHighlight  onPress={()=> this.cameraAttachmentPress()}>
                            <View style={style.bottomRowView}>
                                <Image style={{height: 35, resizeMode: "contain", padding: 15}} source={icon_add_content_camera}/>
                                <Text style={{...fontSize(16), color: "#fff", paddingTop: 10}}>{"Photo/Scan"}</Text>
                            </View>
                        </TouchableHighlight>
                     
                        <TouchableHighlight onPress={()=> this.audioAttachmentPress()}>
                            <View style={style.bottomRowView}>
                                <Image style={{height: 35, resizeMode: "contain"}} source={icon_add_content_audio}/>
                                <Text style={{...fontSize(16), color: "#fff", paddingTop: 10}}>{"Talk"}</Text>
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight  onPress={()=> this._actionSheet && this._actionSheet.showSheet()}>
                            <View style={style.bottomRowView}>
                                <Image style={{height: 35, resizeMode: "contain", padding: 15}} source={icon_add_content_upload}/>
                                <Text style={{...fontSize(16), color: "#fff", paddingTop: 10}}>{"Upload"}</Text>
                            </View>
                        </TouchableHighlight> 
                    </View> : 
                    <View style={{ width:"100%", justifyContent: "space-between", flexDirection: "row" }}>
                            <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
                                <TouchableOpacity
                                        onPress={() => {this.cameraAttachmentPress()}}
                                        style={{ alignItems: "center", justifyContent: "center", width : 40 ,height: 40 }}>
                                        <Image source={camera} resizeMode="stretch" />
                                    </TouchableOpacity>
        
                                    <TouchableOpacity
                                        onPress={() => {this.audioAttachmentPress()}}
                                        style={{ alignItems: "center", justifyContent: "center", width: 40, height: 40 }}>
                                        <Image source={record} resizeMode="stretch" />
                                    </TouchableOpacity>
        
                                    <TouchableOpacity
                                        onPress={() => { Keyboard.dismiss(); this._actionSheet && this._actionSheet.showSheet() }}
                                        style={{ alignItems: "center", justifyContent: "center", width: 40, height: 40 }}>
                                        <Image source={icon_upload_file} resizeMode="stretch" />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                        onPress={() => { Keyboard.dismiss();}}
                                        style={{ alignItems: "center", justifyContent: "center",  width: 40, height: 40 }}>
                                        <Image source={keyboard_hide} style={{ alignItems: "center", justifyContent: "center", width: 25, height: 25 }}resizeMode="stretch" />
                                </TouchableOpacity>
                            </View> 
                    }
                </View>
            </View>
        </KeyboardAccessory>  
            // <KeyboardAccessory style={{backgroundColor: "#fff", 
            //                            position:"absolute", 
            //                            width: "100%", 
            //                            flexDirection: "row", 
            //                            justifyContent: "center", 
            //                            alignItems: "center", borderTopWidth: 1, borderBottomWidth: 1, borderColor: "rgba(0,0,0,0.4)"}}>
			// <View
			// 	style={{
			// 		width: "100%",
			// 		minHeight: 40,					
			// 		position: "absolute",
			// 		flexDirection: "row",
			// 		backgroundColor: this.state.bottomBar.keyboardVisible ? "#F3F3F3" : "#FFF",
			// 		justifyContent: "space-between",
			// 		alignItems: "center",
			// 		paddingLeft: 10,
			// 		paddingRight: 10,
			// 		borderTopColor: "rgba(0.0, 0.0, 0.0, 0.25)",
			// 		borderTopWidth: 1}}>
				
			// 		{/* {this.state.bottomBar.keyboardVisible ?  */}
            //         <View style={{ width:"100%", justifyContent: "space-between", flexDirection: "row" }}>
            //             <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
            //                 <TouchableOpacity
            //                     onPress={() => {this.cameraAttachmentPress()}}
            //                     style={{ alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
            //                     <Image source={camera} resizeMode="contain" />
            //                 </TouchableOpacity>

            //                 <TouchableOpacity
            //                     onPress={() => {this.audioAttachmentPress()}}
            //                     style={{ alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
            //                     <Image source={record} resizeMode="contain" />
            //                 </TouchableOpacity>

            //                 <TouchableOpacity
            //                     onPress={() => { Keyboard.dismiss(); this._actionSheet && this._actionSheet.showSheet() }}
            //                     style={{ alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
            //                     <Image source={icon_upload_file} resizeMode="contain" />
            //                 </TouchableOpacity>
            //             </View>
            //             <TouchableOpacity
            //                     onPress={() => { Keyboard.dismiss();}}
            //                     style={{ alignItems: "center", justifyContent: "center",  width: 44, height: 44 }}>
            //                     <Image source={keyboard_hide} style={{ alignItems: "center", justifyContent: "center", width: 25, height: 25 }}resizeMode="contain" />
            //             </TouchableOpacity>
            //         </View> 
            //         {/* : 
            //         <View style={{width: "100%", height:140, alignItems:"center", flexDirection: "row", justifyContent: "space-around"}}> 
            //             <TouchableHighlight  onPress={()=> this.cameraAttachmentPress()}>
            //                 <View style={style.bottomRowView}>
            //                     <Image style={{height: 35, resizeMode: "contain", padding: 15}} source={icon_add_content_camera}/>
            //                     <Text style={{...fontSize(16), color: "#fff", paddingTop: 10}}>{"Photo/Scan"}</Text>
            //                 </View>
            //             </TouchableHighlight>
                        
            //             <TouchableHighlight onPress={()=> this.audioAttachmentPress()}>
            //                 <View style={style.bottomRowView}>
            //                     <Image style={{height: 35, resizeMode: "contain"}} source={icon_add_content_audio}/>
            //                     <Text style={{...fontSize(16), color: "#fff", paddingTop: 10}}>{"Talk"}</Text>
            //                 </View>
            //             </TouchableHighlight>

            //             <TouchableHighlight  onPress={()=> this._actionSheet && this._actionSheet.showSheet()}>
            //                 <View style={style.bottomRowView}>
            //                     <Image style={{height: 35, resizeMode: "contain", padding: 15}} source={icon_add_content_upload}/>
            //                     <Text style={{...fontSize(16), color: "#fff", paddingTop: 10}}>{"Upload"}</Text>
            //                 </View>
            //             </TouchableHighlight> */}
            //         {/* </View>} */}
                    
			// </View>
            // </KeyboardAccessory>
		);
    };

    removeFile=(fid: any)=>{
        let tempFiles = this.state.files;
        tempFiles = tempFiles.filter((element: any)=> element.fid != fid)
        this.setState({
            files : tempFiles
        })
    }

    returnFileAttachments=()=>{
        let views: Element[] = (this.state.files as Array<any>).map((element: any) => this._renderRow(element, 130))
        return views;
    }

    _renderRow=(element : any, width: any)=>{
        let thumbnailHeight = 120;
        return  <TouchableHighlight onPress={()=>this.rowItemPressed(element)} underlayColor={"#ffffffaa"} key={element.fid} style={{ padding: 15 }}>
                <View> 
                    <View>
                    <View style={{ borderWidth: 1, width: width, height: thumbnailHeight, borderRadius: 5, overflow: "hidden" }}>
                    {element.type == "audios" ? (
                        <ImageBackground
                            style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
                            source={sound_wave}
                            resizeMode="contain">
                            <View
                                style={{
                                    backgroundColor: Colors.ThemeColor,
                                    borderRadius: 20,
                                    width: 40,
                                    height: 40,
                                    alignItems: "center",
                                    justifyContent: "center" }}>
                                <View style={{ height: 20, width: 22, justifyContent: "center", alignItems: "flex-end" }}>
                                    <Image style={{ height: 18, width: 17.5 }} source={audio_play} />
                                </View>
                            </View>
                            <Text
                                numberOfLines={1}
                                style={{ color: "#595959", ...fontSize(12), bottom: 5, position: "absolute", alignSelf: "center", textAlign: "center" }}>{`${
                                element.filename
                            }`}
                            </Text>
                        </ImageBackground>
                    ) : (element.type == "images" ? 
                        (<Image source={{ uri: element.thumb_uri }} style={{ width: width, height: thumbnailHeight }} resizeMode="contain" />) 
                      : (element.type == "files" ?                                 
                            <View style={{justifyContent:"center", alignItems:"center", height:"100%", width : "100%"}}>
                            <ImageBackground
                                style={{ width: "85%", height: "85%", marginLeft: 10}}
                                source={pdf_icon}
                                resizeMode="contain"/>                               
                            <Text
                                numberOfLines={1}
                                style={{ color: "#595959", ...fontSize(12), bottom: 5, position: "absolute", alignSelf: "center", textAlign: "center" }}>{`${
                                    element.filename
                            }`}
                            </Text>    
                            </View>
                            : null))
                    }
                    </View>                     
                    <TouchableOpacity
                        onPress={() =>this.removeFile(element.fid)}
                        style={{ width: 36, height: 36, position: "absolute", right: -15, top: -15, justifyContent: "center", alignItems: "center" }}>
                        <View
                            style={{
                                width: 32,
                                height: 32,
                                borderWidth: 2,
                                borderColor: "#fff",
                                borderRadius: 16,
                                backgroundColor: "#000",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                            <Text style={{ color: "white", fontWeight: Platform.OS === "ios"? '500':'bold', ...fontSize(12), lineHeight: 14 }}>{"✕"}</Text>
                        </View>
                    </TouchableOpacity>
                    </View>
            </View>
            </TouchableHighlight>
    }

    render() {
        return (          
            <SafeAreaView style={{width: '100%', flex: 1, backgroundColor: Colors.NewThemeColor, flexDirection: 'row'}}>
                <StatusBar barStyle={'dark-content'} backgroundColor={Colors.NewThemeColor} />      
                <View style={{flex: 1, backgroundColor: "#fff"}}>      
                    <NavigationHeaderSafeArea heading={"New Memory/MindPop"} showCommunity={true} cancelAction={this._onBack} showRightText={true} rightText={"Next"} saveValues={this.saveMemoryOrMindpop}/>                       
                    <View style={{width:"100%", flex: 1}}>
                    <View style={{padding: 15, paddingTop: 5, paddingBottom: 25, width: "100%", flex: 1}}>
                            <TextInput
                                placeholder="Capture your Memory here..."	
                                autoFocus={false}						                                
								onChangeText={text => {
                                    this.setState({ content: text });
								}}
								placeholderTextColor="rgba(0, 0, 0, 0.4)"
								value={this.state.content}
                                multiline={true}                               
								style={{
                                    fontFamily: "Rubik",
									...fontSize(18),
									textAlignVertical: "top",
									fontStyle: this.state.content && this.state.content.length > 0 ? "normal" : "italic",
                                    minHeight: 150,                                    
                                    textAlign: "left",
                                    flex : 1
								}}
                                />
                    </View>
                    {this.state.files.length > 0 ? <View><View key="seperator" style={{ height: 1, backgroundColor: "#59595931" }} /> 
                    
                        <FlatList	
                            horizontal={true}
                            keyboardShouldPersistTaps={'handled'}
                            keyExtractor={(_, index: number) => `${index}`}
							style={{ height: 160, width: "100%", marginBottom : this.state.bottomBar.bottom > 0 ? this.state.bottomBar.bottom - (Platform.OS == "android" ? 230 : 160) : 120, backgroundColor : "#fff"}}
							keyExtractor={(_: any, index: number) => `${index}`}
							data={this.state.files}
							renderItem={(item: any)=> this._renderRow(item.item, 180)}/>	                        
                    </View>
                    : <View style={{width : "100%", height: (Platform.OS == "android" ? 0 : this.state.bottomBar.bottom == 0 ? 130 : this.state.bottomBar.bottom)}}></View>}                                       
                    </View>
                                    
                    {this.toolbar()}   
                    {this.state.showNextDialog && this.nextDialogView()}
                    <ActionSheet
                        ref={ref => (this._actionSheet = ref)}
                        width={DeviceInfo.isTablet() ? "65%" : "100%"}
                        actions={this.state.actionSheet.list}
                        onActionClick={this.onActionItemClicked.bind(this)}					   
                        />
                <View style={{position: "absolute", width: "100%",height: 100, bottom: -100, backgroundColor : "#fff"}}></View>            
                </View>    
                { this.state.memoryIntroVisibility && <CreateMemoryIntro cancelMemoryIntro={()=> 
                       {this.setState({memoryIntroVisibility : false});
                         DefaultPreference.set('hide_memory_intro', "true").then(function() {}) }
                        }></CreateMemoryIntro> }  
                </SafeAreaView>
        )
    }
}    

const style=StyleSheet.create({
    bottomRowView:{
        height: 90, 
        width: 105, 
        borderRadius: 5, 
        backgroundColor : Colors.ThemeColor,
        justifyContent:"center",
        alignItems:"center"
    },
    textDialog:{
        ...fontSize(16), 
        lineHeight: 20, 
        textAlign: "center", 
        color: "#000000", 
        paddingTop: 20,
        width: 250
    }
})