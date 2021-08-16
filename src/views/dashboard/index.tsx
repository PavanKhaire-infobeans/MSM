import React from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  NativeModules,
  NativeEventEmitter,
  requireNativeComponent,
  UIManager,
  Platform,
  View,
  Dimensions,
  Alert,
  DeviceEventEmitter,
  StatusBar,
  Keyboard,
} from 'react-native';

import NetInfo from '@react-native-community/netinfo';
import Text from '../../common/component/Text';
import {connect} from 'react-redux';
import {
  fontSize,
  Storage,
  encode_utf8,
  MemoryActionKeys,
  getValue,
  keyInt,
  getDetails,
  decode_utf8,
} from '../../common/constants';
import {Account} from '../../common/loginStore';
import {ToastMessage, No_Internet_Warning} from '../../common/component/Toast';
import {NO_INTERNET, Colors} from '../../common/constants';
import NoInternetView from '../../common/component/NoInternetView';
import {kLogoutPressed} from '../../views/menu';
import EventManager from '../../common/eventManager';
import {UserProfile} from '../profile/userProfileWebService';
import {kProfilePicUpdated} from '../profile/profileDataModel';
import {Actions} from 'react-native-router-flux';
import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import {eventNames} from 'cluster';
import AudioPlayer, {
  kPlaying,
  kPaused,
  kEnded,
  kNext,
  kPrevious,
  kClosed,
} from '../../common/component/audio_player/audio_player';
import MemoryDetails from '../memoryDetails';
import {configurations} from '../../common/webservice/loginServices';
// import { eventEmitter } from '../splashscreen';//commented native module issue
import Utility from '../../common/utility';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import {MemoryDraftsDataModel} from '../myMemories/MemoryDrafts/memoryDraftsDataModel';
import {
  delete_memory,
  edit_memory,
  move_to_draft,
  remove_me_from_this_post,
  block_memory,
  cancelActions,
  block_user,
  report_user,
  block_and_report,
} from '../../images';
import DeviceInfo from 'react-native-device-info';
import {kReloadDraft} from '../myMemories/MemoryDrafts';
import BottomPicker, {
  ActionSheetItem,
} from '../../common/component/bottomPicker';

// @ts-ignore
import DefaultPreference from 'react-native-default-preference';
import {MonthObj, months} from '../createMemory';
import MemoryActionsSheet, {
  MemoryActionsSheetItem,
} from '../../common/component/memoryActionsSheet';
import {
  MemoryAction,
  kMemoryActionPerformedOnTimeline,
  kUpdateMemoryOnTimeline,
  kUpdateMemoryOnPublised,
} from '../myMemories/myMemoriesWebService';
import {
  GetActivities,
  kGetInvidualNotification,
  SetSeenActivity,
  kForegroundNotice,
  kActivityListener,
  kForegroundNotificationListener,
  kBackgroundNotice,
} from '../notificationView/notificationServices';
import {NotificationDataModel} from '../notificationView/notificationDataModel';
import {any} from 'prop-types';
import {
  kNotificationIndicator,
  TabItems,
} from '../../common/component/TabBarIcons';
import NavigationBar from './NavigationBar';
import {DefaultDetailsMemory} from '../createMemory/dataHelper';
import {
  CreateUpdateMemory,
  promptIdListener,
} from '../createMemory/createMemoryWebService';
import WebserviceCall, {logout} from '../../common/webservice/webservice';

var MemoryActions: Array<MemoryActionsSheetItem> = [
  // { index: 0, text: "Image", image: action_camera }
];

export class ExposedToJava {
  showMemoryDetails(message: any) {
    //Alert.alert(message);
    var [nid, type, comment] = message.split(',');
    nid = nid.trim();
    type = type.trim();
    comment = comment && comment.length > 0 ? true : false;
    Actions.push('memoryDetails', {nid: nid, type: type, comment: comment});
  }

  openPDFView(url: any) {
    Actions.push('pdfViewer', {file: {url: url}});
  }

  openAudioController(audioJson: any) {
    // Actions.push("pdfViewer", {file: {url : url}});
    Alert.alert(audioJson);
  }

  openImageController(imageJson: any) {
    // Actions.push("pdfViewer", {file: {url : url}});
    Alert.alert(imageJson);
  }
}

const exposedToJava = new ExposedToJava();
BatchedBridge.registerCallableModule('MemoryDetail', exposedToJava);

const AllMemoriesComponent = require('../dashboard/CustomNativeViews');

const onSessionConnect = (event: any) => {
  //console.log(event);
  logout();
};
DeviceEventEmitter.addListener('onSessionConnect', onSessionConnect);

type DashProps = {[x: string]: any};
class DashBoard extends React.Component<DashProps> {
  // _actionSheet: any | MemoryActionsSheet = null;
  // profilePicUpdate : EventManager;
  // draftDetailsListener: EventManager;
  // memoryActionsListener: EventManager;
  // notificationListener : EventManager;
  // foregroundNotification : EventManager;
  // backgroundNotification : EventManager;
  // memoryDraftsDataModel: MemoryDraftsDataModel;
  // notificationModel : NotificationDataModel;
  // callerTimeout : boolean = true;
  // eventListener : EventManager;
  // callAddToMemory : boolean = true;
  // state = {
  //     loadMemories: false,
  //     showNoInternetView: false,
  //     token: "",
  //     performReload : false,
  //     audioFile : {
  //         index : -1,
  //         isPlaying : false,
  //         file : {},
  //         memoryTitle : "",
  //         by : "",
  //         fid: 0,
  //         nid: 0
  //     },
  //     selectionData: {
  //         actions: [],
  //         selectionValue: "",
  //         isMultiSelect: false,
  //         fieldName: ""
  //         },
  //         errorHeight: 0
  //     };
  // audioPlayer : React.RefObject<AudioPlayer> = React.createRef<AudioPlayer>();
  // eventManager : EventManager;
  // tabBarName = "";
  // bottomPicker: React.RefObject<BottomPicker> = React.createRef<BottomPicker>();
  // memoryFromPrompt : EventManager;
  // prompt_id : 0;
  // constructor(props: DashProps) {
  //     super(props);
  //     this.notificationModel = new NotificationDataModel();
  //     this.eventManager = EventManager.addListener("addContentTabPressed", this.navigateToAddContent);
  //     DefaultPreference.get('firebaseToken').then((value: any) => {
  //       this.setState({token : value})
  //     });
  //     // this.draftDetailsListener = EventManager.addListener(kDratfDetaisFetched, this.draftDetails);
  //     this.memoryDraftsDataModel = new MemoryDraftsDataModel();
  //     this._onOpenImages = this._onOpenImages.bind(this);
  //     this._onOpenPdfs = this._onOpenPdfs.bind(this);
  //     this._onShowMemoryDetails = this._onShowMemoryDetails.bind(this);
  //     this._onErrorReceived = this._onErrorReceived.bind(this);
  //     this._onLogoutUser = this._onLogoutUser.bind(this);
  //     this._onOpenAudios = this._onOpenAudios.bind(this);
  //     this._onCloseAudios = this._onCloseAudios.bind(this);
  //     this._onEditMemory = this._onEditMemory.bind(this);
  //     this._onMemoryAction = this._onMemoryAction.bind(this);
  //     this.loadMemoryTimeline =this.loadMemoryTimeline.bind(this);
  //     this.getTimelineListFromServer = this.getTimelineListFromServer.bind(this);
  //     this.memoryActionsListener = EventManager.addListener(kMemoryActionPerformedOnTimeline, this.memoryActionCallBack)
  //     this.updateProfilePic = this.updateProfilePic.bind(this);
  //     this._onAddProptToMemoryAction = this._onAddProptToMemoryAction.bind(this);
  //     this.updateNativeTimeline = this.updateNativeTimeline.bind(this);
  //     if (props.action) {
  //         this.props.performAction(props.action)
  //     }
  //     if(Platform.OS === 'ios'){
  //         try{
  //             eventEmitter.removeAllListeners();
  //         }catch (e){
  //             //console.log("Removed arguments")
  //         }
  //         DeviceEventEmitter.addListener(kProfilePicUpdated,this.updateProfilePic);
  //         DeviceEventEmitter.addListener(kUpdateMemoryOnTimeline, this.memoryActionCompleted )
  //     }
  //     else{
  //         try {
  //             // DeviceEventEmitter.removeAllListeners();
  //             DeviceEventEmitter.removeListener('LogoutUser', this.logoutUser);
  //             DeviceEventEmitter.removeListener('ShowMemoryDetails', this.showMemoryDetails);
  //             DeviceEventEmitter.removeListener("OpenImages", this.openImageGallery);
  //             DeviceEventEmitter.removeListener("OpenAudios",this.openAudioPlayer);
  //             DeviceEventEmitter.removeListener("CloseAudio",this.closeAudioPlayer);
  //             DeviceEventEmitter.removeListener("OpenPdf", this.openPdfDetails);
  //             DeviceEventEmitter.removeListener(kProfilePicUpdated, this.updateProfilePic)
  //             DeviceEventEmitter.removeListener("OpenMemoryActions", this._onMemoryAction);
  //             DeviceEventEmitter.removeListener("AddProptToMemoryAction", this._onAddProptToMemoryAction);
  //             DeviceEventEmitter.removeListener(kUpdateMemoryOnTimeline, this.memoryActionCompleted);
  //         }catch(e){
  //             //console.log(e);
  //         }
  //         DeviceEventEmitter.addListener('LogoutUser', this.logoutUser);
  //         DeviceEventEmitter.addListener('ShowMemoryDetails', this.showMemoryDetails);
  //         DeviceEventEmitter.addListener("OpenImages", this.openImageGallery);
  //         DeviceEventEmitter.addListener("OpenAudios",this.openAudioPlayer);
  //         DeviceEventEmitter.addListener("CloseAudio",this.closeAudioPlayer);
  //         DeviceEventEmitter.addListener("OpenPdf", this.openPdfDetails);
  //         DeviceEventEmitter.addListener(kProfilePicUpdated,this.updateProfilePic);
  //         DeviceEventEmitter.addListener("OpenMemoryActions", this._onMemoryAction);
  //         DeviceEventEmitter.addListener("AddProptToMemoryAction", this._onAddProptToMemoryAction);
  //         DeviceEventEmitter.addListener(kUpdateMemoryOnTimeline, this.memoryActionCompleted )
  //     }
  //     this.notificationListener = EventManager.addListener(kGetInvidualNotification, this.notificationCallback);
  //     this.foregroundNotification = EventManager.addListener(kForegroundNotice, this.foregroundNotificationCallback);
  //     this.backgroundNotification = EventManager.addListener(kBackgroundNotice, this.checkNotificationAvailiability);
  //     this.eventListener = EventManager.addListener(kNotificationIndicator, this.changeNotification)
  //     this.memoryFromPrompt = EventManager.addListener(promptIdListener, this.promptToMemoryCallBack)
  //     this.checkNotificationAvailiability();
  // }
  // changeNotification=()=>{
  //     Actions.refresh('root')
  // }
  // foregroundNotificationCallback=(details : any)=>{
  //     if(Utility.isInternetConnected){
  //         let key = Account.selectedData().instanceID+"_"+Account.selectedData().userID;
  //         Utility.unreadNotification[key] = Utility.unreadNotification[key]++;
  //         EventManager.callBack(kNotificationIndicator)
  //         Utility.notificationObject.isBackgroundNotification = false;
  //         GetActivities({ "notification_params": {
  //             "nid": details.nid,
  //             "notification_id": details.notification_id
  //         }}, kGetInvidualNotification);
  //     } else {
  //         No_Internet_Warning();
  //     }
  // }
  // checkNotificationAvailiability(){
  //     /*NetInfo.fetch().then(state =>  {
  //         console.log("is network connected", state.isConnected);
  //     });*/
  //     /*NetInfo.isConnected.fetch().then(isConnected =>*/
  //         NetInfo.fetch().then(state => {
  //         if(Utility.notificationObject.hasNotification && /*isConnected*/state.isConnected){
  //             Utility.notificationObject.hasNotification = false;
  //             Utility.notificationObject.isBackgroundNotification = true;
  //             loaderHandler.showLoader();
  //             GetActivities({ "notification_params": {
  //                                 "nid": Utility.notificationObject.data.nid,
  //                                 "notification_id": Utility.notificationObject.data.notification_id
  //                             }}, kGetInvidualNotification);
  //         }
  //         else if(!/*isConnected*/state.isConnected){
  //             No_Internet_Warning();
  //         }
  //     });
  // }
  // notificationCallback=(success : any, details : any)=>{
  //     loaderHandler.hideLoader();
  //     if(success && Utility.isInternetConnected){
  //         details = this.notificationModel.getNotificationDetails(details.data, false)[0];
  //         if(Utility.notificationObject.isBackgroundNotification){
  //             SetSeenActivity({"ids" : details.ids}, 0)
  //             if(details.status==0 && (details.notificationType.indexOf("collaboration")!= -1 || details.notificationType.indexOf("new_edits") != -1)){
  //                 Actions.push("createMemory", {editMode : true, draftNid : details.nid})
  //             } else {
  //                 Actions.push("memoryDetails", {"nid": details.nid, "type": details.type})
  //             }
  //         } else {
  //             EventManager.callBack(kForegroundNotificationListener, details);
  //             if(this.notificationModel.isPartOfActivity(details)){
  //                 EventManager.callBack(kActivityListener, [details]);
  //             }
  //         }
  //     } else if(!Utility.isInternetConnected){
  //         No_Internet_Warning();
  //     }
  // }
  // _onOpenImages(event: any){
  //         if(Utility.isInternetConnected){
  //             let images = [];
  //             let position = 0;
  //             images = event.nativeEvent.images;
  //             position = event.nativeEvent.index;
  //             Actions.jump("imageViewer", {files : images, index : position})
  //         } else{
  //             No_Internet_Warning();
  //         }
  // }
  // _onOpenPdfs(event: any){
  //     if(Utility.isInternetConnected){
  //         if(this.callerTimeout){
  //               Actions.jump("pdfViewer", {file: {url : encode_utf8(event.nativeEvent.pdfUrl)}});
  //         }
  //           this.callerTimeout = false;
  //           setTimeout(() => {
  //             this.callerTimeout = true
  //           }, 1000);
  //         } else{
  //             No_Internet_Warning();
  //         }
  // }
  // _onShowMemoryDetails(event: any){
  //     if(this.callerTimeout){
  //         if(Utility.isInternetConnected){
  //             Actions.jump("memoryDetails", {"nid": event.nativeEvent.nid, "type": event.nativeEvent.type, "comment": event.nativeEvent.comment ? true : false, "showComments": event.nativeEvent.showComments ? true: false})
  //         } else{
  //             No_Internet_Warning();
  //         }
  //       }
  //       this.callerTimeout = false;
  //       setTimeout(() => {
  //         this.callerTimeout = true
  //       }, 1000);
  // }
  // _onErrorReceived(event: any){
  //     if (event.nativeEvent.ErrorType === "NoInternet"){
  //         No_Internet_Warning();
  //         this.setState({
  //             showNoInternetView: true,
  //             loadMemories: false,
  //         })
  //     }else{
  //         this.showErrorMessage(event.nativeEvent.ErrorMessage)
  //     }
  // }
  // _onLogoutUser(event: Event){
  //     logout();
  // }
  // _onOpenAudios(event: any){
  //     if(Utility.isInternetConnected){
  //         event = event.nativeEvent
  //         let playing = this.state.audioFile.isPlaying;
  //             let fid = this.state.audioFile.fid ;
  //             if(event.audio.fid == fid){
  //                 playing = !playing;
  //             } else{
  //                 playing = true;
  //             }
  //             let audioFile = { index : 0, isPlaying : playing, file : [event.audio],
  //             memoryTitle : event.memoryTitle, by : event.name, fid: event.audio.fid, nid: event.nid}
  //             this.setState({
  //                 audioFile: audioFile
  //             },()=>{
  //                     if(event.audio.fid == fid){
  //                         this.audioPlayer.current.tooglePlayPause();
  //                     } else{
  //                         this.audioPlayer.current.showPlayer(0);
  //                         this.callNativeModulesForPlayerUpdate(event.audio.fid, true, event.nid);
  //                     }
  //             }
  //             )
  //         }else{
  //             No_Internet_Warning();
  //         }
  // }
  // _onEditMemory(event: any, nid?: any){
  //     event = event.nativeEvent
  //     // this.getDraftDetails(event)
  //     if(Utility.isInternetConnected){
  //         loaderHandler.showLoader();
  //         // if (nid){
  //             Actions.push("createMemory", {editMode : true, draftNid : nid ? nid : event.nid, editPublsihedMemory: true})
  //         // }else{
  //         //     Actions.push("createMemory", {editMode : true, draftNid : event.nid})
  //         // }
  //     } else{
  //         No_Internet_Warning();
  //     }
  // }
  // memoryActionCallBack = (fetched: boolean, responseMessage: any, nid?: any, type?: any, uid?: any) => {
  //     loaderHandler.hideLoader();
  //     if (fetched) {
  //             this.updateNativeTimeline(nid, type, uid);
  //             DeviceEventEmitter.emit(kUpdateMemoryOnPublised, {nid,type, uid})
  //             if(type == MemoryActionKeys.moveToDraftKey){
  //                 EventManager.callBack(kReloadDraft);
  //             }
  //         // publishedMemoriesArray = publishedMemoriesArray.filter((element: any) => element.nid != nid)
  //             this.setState({});
  //     } else {
  //         ToastMessage(responseMessage, Colors.ErrorColor);
  //     }
  // }
  // memoryActionCompleted = (event : any) =>{
  //     //console.log("actioncompleted")
  //     this.updateNativeTimeline(event.nid, event.type, event.uid);
  // }
  // updateNativeTimeline=(nid : any, actionType: any, uid? : any) => {
  //         if(Platform.OS == "android"){
  //             // Alert.alert("It is android")
  //                     NativeModules.AllMemoriesComponent.updateTimelineOnMemoryAction(JSON.stringify({
  //                         actionType: actionType, nid: nid, uid : uid}));
  //         }
  //         else{
  //             NativeModules.AllMemoriesComponentManager.updateTimelineOnMemoryAction({
  //                 nid: nid, actionType: actionType, uid : uid})
  //         }
  // }
  // _onMemoryAction(event: any){
  //     let uid = ""
  //       if(Platform.OS === "ios"){
  //           event = event.nativeEvent
  //           uid = event.user.uid
  //       } else {
  //           try{
  //               event.actions = JSON.parse(event.actions);
  //               uid = event.user
  //           } catch (e){
  //             //   Alert.alert(""+e);
  //           }
  //       }
  //       /**Menu options for actions*/
  //       MemoryActions = []
  //       var i = 0
  //       if(event.actions.hasOwnProperty(MemoryActionKeys.blockUserKey)){
  //         i += 1;
  //         MemoryActions[i-1] = {index: i, text: event.actions[MemoryActionKeys.blockUserKey], image: block_user, nid: event.nid, memoryType: event.type,  actionType: MemoryActionKeys.blockUserKey, uid : uid, isDestructive: 1};
  //       }
  //       if(event.actions.hasOwnProperty(MemoryActionKeys.reportMemoryKey)){
  //         i += 1;
  //         MemoryActions[i-1] = {index: i, text: event.actions[MemoryActionKeys.reportMemoryKey], image: report_user, nid: event.nid, memoryType: event.type,  actionType: MemoryActionKeys.reportMemoryKey, isDestructive: 1};
  //       }
  //       if(event.actions.hasOwnProperty(MemoryActionKeys.blockAndReportKey)){
  //         i += 1;
  //         MemoryActions[i-1] = {index: i, text: event.actions[MemoryActionKeys.blockAndReportKey], image: block_and_report, nid: event.nid, memoryType: event.type,  actionType: MemoryActionKeys.blockAndReportKey, uid : uid, isDestructive: 1};
  //       }
  //       if(event.actions.hasOwnProperty(MemoryActionKeys.editMemoryKey)){
  //         i += 1;
  //         MemoryActions[i-1] = {index: i, text: event.actions[MemoryActionKeys.editMemoryKey], image: edit_memory, nid: event.nid, memoryType: event.type,  actionType: MemoryActionKeys.editMemoryKey};
  //       }
  //       if(event.actions.hasOwnProperty(MemoryActionKeys.moveToDraftKey)){
  //         i += 1;
  //         MemoryActions[i-1] = {index: i, text: event.actions[MemoryActionKeys.moveToDraftKey], image: move_to_draft, nid: event.nid, memoryType: event.type,  actionType: MemoryActionKeys.moveToDraftKey };
  //       }
  //       if(event.actions.hasOwnProperty(MemoryActionKeys.deleteMemoryKey)){
  //         i += 1;
  //         MemoryActions[i-1] = {index: i, text: event.actions[MemoryActionKeys.deleteMemoryKey], image: delete_memory, nid: event.nid, memoryType: event.type,  actionType: MemoryActionKeys.deleteMemoryKey };
  //       }
  //       if(event.actions.hasOwnProperty(MemoryActionKeys.removeMeFromThisPostKey)){
  //         i += 1;
  //         MemoryActions[i-1] = {index: i, text: event.actions[MemoryActionKeys.removeMeFromThisPostKey], image: remove_me_from_this_post, nid: event.nid, memoryType: event.type,  actionType: MemoryActionKeys.removeMeFromThisPostKey };
  //       }
  //       if(event.actions.hasOwnProperty(MemoryActionKeys.blockMemoryKey)){
  //         i += 1;
  //         MemoryActions[i-1] = {index: i, text: event.actions[MemoryActionKeys.blockMemoryKey], image: block_memory, nid: event.nid, memoryType: event.type,  actionType: MemoryActionKeys.blockMemoryKey };
  //       }
  //     //   for (var value in event.actions) {
  //     //       switch(value){
  //     //           case MemoryActionKeys.editMemoryKey:
  //     //             i += 1;
  //     //             MemoryActions.push( {index: i, text: event.actions[value], image: edit_memory, nid: event.nid, memoryType: event.type,  actionType: MemoryActionKeys.editMemoryKey})
  //     //             break;
  //     //           case MemoryActionKeys.deleteMemoryKey:
  //     //             i += 1;
  //     //             MemoryActions.push( {index: i, text: event.actions[value], image: delete_memory, nid: event.nid, memoryType: event.type,  actionType: MemoryActionKeys.deleteMemoryKey })
  //     //             break;
  //     //           case MemoryActionKeys.moveToDraftKey:
  //     //             i += 1;
  //     //             MemoryActions.push( {index: i, text: event.actions[value], image: move_to_draft, nid: event.nid, memoryType: event.type,  actionType: MemoryActionKeys.moveToDraftKey })
  //     //             break;
  //     //           case MemoryActionKeys.removeMeFromThisPostKey:
  //     //             i += 1;
  //     //             MemoryActions.push( {index: i, text: event.actions[value], image: remove_me_from_this_post, nid: event.nid, memoryType: event.type,  actionType: MemoryActionKeys.removeMeFromThisPostKey })
  //     //             break;
  //     //           case MemoryActionKeys.blockMemoryKey:
  //     //             i += 1;
  //     //             MemoryActions.push( {index: i, text: event.actions[value], image: block_memory, nid: event.nid, memoryType: event.type,  actionType: MemoryActionKeys.blockMemoryKey })
  //     //               break;
  //     //       }
  //     //   }
  //       let cancelButtonIndex = MemoryActions.length
  //       MemoryActions.push({index: cancelButtonIndex, text: "Cancel", image: cancelActions, actionType: MemoryActionKeys.cancelActionKey })
  //       this._actionSheet && this._actionSheet.showSheet()
  //       this.setState({ showMemoryActions: true })
  // }
  // _onCloseAudios(event: Event){
  //     try {
  //         this.audioPlayer.current.hidePlayer();
  //     } catch (error) {
  //     }
  // }
  // testAndroid=(test:any) =>{
  //     test.images = JSON.parse(test.images);
  //     Alert.alert(""+test.images.index);
  // }
  // navigateToAddContent =()=>{
  //     Actions.push("addContent");
  // }
  // onErrorOccurance = (event : any) => {
  //     this.showErrorMessage(event)
  // }
  // onNoInternet = (event : any) => {
  //     No_Internet_Warning();
  //     this.setState({
  //         showNoInternetView: true,
  //         loadMemories: false,
  //     })
  // }
  // showMemoryDetails = (event : any) => {
  //       if(this.callerTimeout){
  //         if(Utility.isInternetConnected){
  //             Actions.jump("memoryDetails", {"nid": event.nid, "type": event.type, "comment": event.comment ? true : false})
  //         } else{
  //             No_Internet_Warning();
  //         }
  //       }
  //       this.callerTimeout = false;
  //       setTimeout(() => {
  //         this.callerTimeout = true
  //       }, 1000);
  // }
  // openPdfDetails = (event : any) =>{
  //     if(Utility.isInternetConnected){
  //     if(this.callerTimeout){
  //           Actions.push("pdfViewer", {file: {url : event.pdfUrl}});
  //     }
  //       this.callerTimeout = false;
  //       setTimeout(() => {
  //         this.callerTimeout = true
  //       }, 1000);
  //     } else{
  //         No_Internet_Warning();
  //     }
  //   }
  //   closeAudioPlayer=()=>{
  //       try {
  //           //this.audioPlayer.current.hidePlayer();
  //       } catch (error) {
  //       }
  //   }
  //   openAudioPlayer = (event : any) =>{
  //     if(Utility.isInternetConnected){
  //         if(Platform.OS === "android"){
  //             try{
  //                 event = JSON.parse(event.audio)
  //             } catch (e){
  //                 //console.log(e)
  //             }
  //         }
  //         let playing = this.state.audioFile.isPlaying;
  //         let fid = this.state.audioFile.fid ;
  //         if(event.audio.fid == fid){
  //             playing = !playing;
  //         } else{
  //             playing = true;
  //         }
  //         let audioFile = { index : 0, isPlaying : playing, file : [event.audio],
  //         memoryTitle : event.memoryTitle, by : event.name, fid: event.audio.fid, nid: event.nid}
  //         this.setState({
  //             audioFile: audioFile
  //         },()=>{
  //                 if(event.audio.fid == fid){
  //                     this.audioPlayer.current.tooglePlayPause();
  //                 } else{
  //                     this.audioPlayer.current.showPlayer(0);
  //                     this.callNativeModulesForPlayerUpdate(event.audio.fid, true, event.nid);
  //                 }
  //         }
  //         )
  //     }else{
  //         No_Internet_Warning();
  //     }
  //   }
  // openImageGallery = (event : any) =>{
  //     if(Utility.isInternetConnected){
  //         let images = [];
  //         let position = 0;
  //         if(Platform.OS === "android"){
  //             event = JSON.parse(event.images)
  //         }
  //         images = event.images;
  //         position = event.index;
  //         Actions.jump("imageViewer", {files : images, index : position})
  //     } else{
  //         No_Internet_Warning();
  //     }
  // }
  // componentWillUnmount(){
  //    if(Platform.OS === 'ios'){
  //         try{
  //             eventEmitter.removeAllListeners();
  //         }catch (e){
  //             //console.log("Removed arguments")
  //         }
  //     }
  //     else{
  //         try {
  //             // DeviceEventEmitter.removeAllListeners();
  //             DeviceEventEmitter.removeListener('LogoutUser', this.logoutUser);
  //             DeviceEventEmitter.removeListener('ShowMemoryDetails', this.showMemoryDetails);
  //             DeviceEventEmitter.removeListener("OpenImages", this.openImageGallery);
  //             DeviceEventEmitter.removeListener("OpenAudios",this.openAudioPlayer);
  //             DeviceEventEmitter.removeListener("CloseAudio",this.closeAudioPlayer);
  //             DeviceEventEmitter.removeListener("OpenPdf", this.openPdfDetails);
  //             DeviceEventEmitter.removeListener(kProfilePicUpdated, this.updateProfilePic)
  //             DeviceEventEmitter.removeListener("OpenMemoryActions", this._onMemoryAction);
  //             DeviceEventEmitter.removeListener("AddProptToMemoryAction", this._onAddProptToMemoryAction);
  //             DeviceEventEmitter.removeListener(kUpdateMemoryOnTimeline, this.memoryActionCompleted);
  //         }catch(e){
  //                 //console.log(e);
  //         }
  //     }
  //     this.notificationListener = EventManager.addListener(kGetInvidualNotification, this.notificationCallback);
  //     this.foregroundNotification = EventManager.addListener(kForegroundNotice, this.foregroundNotificationCallback);
  //     this.backgroundNotification = EventManager.addListener(kBackgroundNotice, this.checkNotificationAvailiability);
  // }
  // componentWillReceiveProps(nextProps: DashProps) {
  //     if (nextProps.action) {
  //         this.props.performAction(nextProps.action)
  //     }
  // }
  // promptToMemoryCallBack=(success : boolean, draftDetails : any)=>{
  //     ToastMessage("Response received : ",""+success)
  //     setTimeout(() => {
  //         loaderHandler.hideLoader();
  //     }, 500);
  //     if(success){
  //         // TODO : send call back to native modules
  //         // if(prompt_id > 0){
  //         // console.log("Platform OS : ", Platform.OS)
  //         if(Platform.OS == 'android'){
  //             NativeModules.AllMemoriesComponent.memoryFromPromptCreated(JSON.stringify({ prompt_id : this.prompt_id }));
  //         }
  //         else {
  //             NativeModules.AllMemoriesComponentManager.memoryFromPromptCreated({ prompt_id : this.prompt_id });
  //         }
  //         Actions.push("createMemory", {editMode : true, draftNid : draftDetails, isFromPrompt: true})
  //     }
  //     else{
  //     loaderHandler.hideLoader()
  //             ToastMessage(draftDetails);
  //     }
  // }
  // _onAddProptToMemoryAction=(event: any)=>{
  //     if(Utility.isInternetConnected && this.callAddToMemory){
  //             this.callAddToMemory = false
  //             setTimeout(() => {
  //                 this.callAddToMemory = true
  //             }, 4000);
  //             if(Platform.OS == 'ios'){
  //                 event = event.nativeEvent
  //             }
  //             loaderHandler.showLoader("Creating Memory...")
  //             let draftDetails : any = DefaultDetailsMemory(decode_utf8(event.title.trim()));
  //             draftDetails.prompt_id = event.prompt_id;
  //             this.prompt_id = event.prompt_id;
  //             CreateUpdateMemory(draftDetails, [], promptIdListener, "save")
  //             Keyboard.dismiss();
  //     } else{
  //         No_Internet_Warning();
  //     }
  // }
  // updateProfilePic=()=>{
  //     if(Platform.OS === "android"){
  //         NativeModules.AllMemoriesComponent.setUserDetail(JSON.stringify(Account.selectedData()));
  //     }
  //     else{
  //         let account = Object.assign({}, Account.selectedData())
  //          NativeModules.AllMemoriesComponentManager.setUserDetail(account)
  //     }
  //     if( Account.selectedData()!=undefined && Account.selectedData()!=null){
  //         if(Platform.OS === "android"){
  //             // NativeModules.AllMemoriesComponent.setUserDetail(JSON.stringify(Account.selectedData()));
  //             // NativeModules.AllMemoriesComponentManager.profilePictureUpdated(JSON.stringify(Account.selectedData()));
  //         }
  //         else{
  //                 NativeModules.AllMemoriesComponentManager.profilePictureUpdated()
  //         }
  //     }
  // }
  // componentDidMount() {
  //      this.FetchConfigurations();
  //     //  this.openDateSelection();
  // }
  // openDateSelection(){
  //     var actions: ActionSheetItem[] = [];
  //     let least = 1917, most = new Date().getFullYear();
  //     for (var i = most; i > least; i--) {
  //         actions.push({ key: i, text: `${i}` });
  //     }
  //     this.setState({
  // 		selectionData: {
  // 			...this.state.selectionData,
  // 			actions,
  // 			// selectionValue: this.state[form.field_name] || "",
  // 			fieldName: "date"
  // 		}
  // 	}, () => {
  // 		this.bottomPicker.current && this.bottomPicker.current.showPicker && this.bottomPicker.current.showPicker();
  // 	});
  //     // setTimeout(
  //     //     ()=>{
  //     //         this.bottomPicker.current && this.bottomPicker.current.showPicker && this.bottomPicker.current.showPicker();
  //     //     },10000
  //     // )
  // }
  // showAlert(title: any, body: any) {
  //     Alert.alert(
  //       title, body,
  //       [
  //           { text: 'OK', onPress: () => {} },
  //       ],
  //       { cancelable: false },
  //     );
  //   }
  // render() {
  //     const { width, height } = Dimensions.get('window');
  //     return (
  //         <View style={{flex: 1}}>
  // 			<SafeAreaView style={{width: "100%", flex: 0, backgroundColor : Colors.NewThemeColor}}/>
  // 				<SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>
  //                 <View style={{flex: 1}}>
  //                 <NavigationBar title={TabItems.AllMemories}/>
  //             <StatusBar barStyle={'dark-content'} backgroundColor={Colors.NewThemeColor} />
  //             {/* <Text selectable style={{padding : 10, ...fontSize(16)}}>{this.state.token}</Text> */}
  //             {
  //                 // Platform.OS === 'ios' ?
  //              this.state.loadMemories? (
  //                 <AllMemoriesComponent
  //                 style = {{flex: 1, width: "100%", height: "100%"}}
  //                 onOpenImages = {this._onOpenImages}
  //                 onOpenPdfs =  {this._onOpenPdfs}
  //                 onShowMemoryDetails = {this._onShowMemoryDetails}
  //                 onErrorReceived = {this._onErrorReceived}
  //                 onLogoutUser = {this._onLogoutUser}
  //                 onOpenAudios = {this._onOpenAudios}
  //                 onCloseAudios = {this._onCloseAudios}
  //                 onEditMemory = {this._onEditMemory}
  //                 onMemoryAction = {this._onMemoryAction}
  //                 onAddProptToMemoryAction = {this._onAddProptToMemoryAction}
  //                //  width= {"100%"}
  //                //  height= {"100%"}
  //                //  width= {"100%"}
  //                 />
  //              ) : null
  //             // :  <AllMemoriesComponent
  //             // style = {{flex: 1, width: "100%", height: "100%"}}
  //         //    />
  //     }
  //             {
  //             // Platform.OS === 'ios' ?
  //              this.state.showNoInternetView? (
  //                 <NoInternetView tryAgain={()=>{this.loadMemoryTimeline()}}> </NoInternetView>
  //             ): null
  //             // : null
  //             }
  //             <AudioPlayer ref={this.audioPlayer} playerCallback={(event: any) => this.playerCallback(event)} files={this.state.audioFile.file} memoryTitle={this.state.audioFile.memoryTitle} by={"by "+this.state.audioFile.by} bottom={10}></AudioPlayer>
  //         <MemoryActionsSheet
  //         ref={ref => (this._actionSheet = ref)}
  //         width={DeviceInfo.isTablet() ? "65%" : "100%"}
  //         actions={MemoryActions}
  //         memoryActions = {true}
  //         onActionClick={this.onActionItemClicked.bind(this)}
  //         />
  //         <BottomPicker
  // 				ref={this.bottomPicker}
  // 				onItemSelect={(selectedItem: ActionSheetItem) => {
  // 					// let fieldName = this.state.selectionData.fieldName;
  // 					// this.setState({
  // 					// 	[fieldName]: selectedItem.key !== "_none" ? selectedItem.key : "",
  // 					// 	[`${fieldName}_text`]: selectedItem.key !== "_none" ? selectedItem.text : "",
  // 					// 	error: { ...this.state.error, ...(selectedItem.key !== "_none" ? { [fieldName]: { error: false, message: "" } } : {}) },
  // 					// 	selectionData: {
  // 					// 		actions: [],
  // 					// 		selectionValue: "",
  // 					// 		fieldName: "",
  // 					// 		isMultiSelect: false
  // 					// 	}
  // 					// });
  // 				}}
  // 				actions={this.state.selectionData.actions}
  // 				value={this.state.selectionData.selectionValue}
  // 			/>
  //         </View>
  //         </SafeAreaView>
  //         </View>
  //     );
  // }
  // onActionItemClicked=(index: number, data: any): void=>{
  //     //console.log(data);
  //     switch(data.actionType){
  //         case MemoryActionKeys.editMemoryKey:
  //             this._onEditMemory(data, data.nid)
  //             break;
  //         case MemoryActionKeys.cancelActionKey:
  //             break;
  //         default:
  //         if (Utility.isInternetConnected) {
  //             let alertData = Utility.getActionAlertTitle(data.actionType)
  //            setTimeout(() => {
  //             Alert.alert(
  //                 alertData.title,
  //                 alertData.message,
  //                 [
  //                     {
  //                         text: "No",
  //                         style: "cancel",
  //                         onPress: () => {}
  //                     },
  //                     {
  //                         text: "Yes",
  //                         style: "default",
  //                         onPress: () => {
  //                             if(Utility.isInternetConnected){
  //                                 loaderHandler.showLoader();
  //                                 MemoryAction(data.memoryType, data.nid,data.actionType, kMemoryActionPerformedOnTimeline, data.uid);
  //                             } else{
  //                                 No_Internet_Warning();
  //                             }
  //                         }
  //                     }
  //                 ]
  //             );
  //            },250)
  //             break;
  //         } else {
  //             No_Internet_Warning();
  //         }
  //     }
  // }
  // playerCallback=(event: any)=>{
  //     let audioFile = this.state.audioFile;
  //     switch(event){
  //         case kEnded : audioFile.isPlaying = false;
  //             break;
  //         case kClosed : audioFile.isPlaying = false;
  //                        audioFile.index = -1;
  //                        audioFile.fid = -1;
  //             break;
  //         case kPlaying : audioFile.isPlaying = true;
  //             break;
  //         case kPaused : audioFile.isPlaying = false;
  //             break;
  //         case kNext: audioFile.isPlaying = true;
  //                     audioFile.index = audioFile.index + 1;
  //             break;
  //         case kPrevious: audioFile.isPlaying = true;
  //                         audioFile.index = audioFile.index-1;
  //             break;
  //     }
  //     this.callNativeModulesForPlayerUpdate(audioFile.fid, audioFile.isPlaying, audioFile.nid);
  //     this.setState({audioFile : audioFile})
  // }
  // callNativeModulesForPlayerUpdate=(fid: any, playing: any, nid :any)=>{
  //     if(Platform.OS === "android"){
  //         NativeModules.AllMemoriesComponent.updateAudioControls(JSON.stringify({
  //             fid: fid,
  //             playing : playing,
  //             nid: nid}));
  //     }
  //     else{
  //         NativeModules.AllMemoriesComponentManager.audioPlayerStateUpdated({
  //             fid: fid,
  //             playing : playing,
  //             nid: nid})
  //     }
  // }
  // togglePlayPause=()=>{
  // }
  // showErrorMessage=(errorMessage: any)=>{
  //     ToastMessage(errorMessage, Colors.WarningColor)
  // }
  // loadMemoryTimeline = () => {
  //     if(Utility.isInternetConnected){
  //         setTimeout(() => {
  //             if(Platform.OS === "android"){
  //                 NativeModules.AllMemoriesComponent.setUserDetail(JSON.stringify(Account.selectedData()));
  //             }
  //             else{
  //                 let account = Object.assign({}, Account.selectedData())
  //                 NativeModules.AllMemoriesComponentManager.setUserDetail(account)
  //             }
  //             // this.setState({ loadMemories: true });
  //             this.setState({
  //                 loadMemories: true,
  //                 showNoInternetView: false
  //             });
  //         }, 0);
  //     }else{
  //         setTimeout(() => {
  //             this.setState({showNoInternetView: true,
  //             loadMemories: false});
  //         }, 500);
  //     }
  // }
  // logoutUser =() => {
  //     logout();
  // }
  // FetchConfigurations = async () => {
  //     if(Utility.isInternetConnected){
  //         try {
  //             let data = await Storage.get('userData')
  //             let response: any = await configurations(`https://${data.instanceURL}`, data.userAuthToken).then((response: Response) => response.json())
  //             .catch((err: Error) => {
  //                 Promise.reject(err)
  //             });
  //                 //console.log(response.ResponseCode);
  //                 DefaultPreference.set('seasons', JSON.stringify(response.Details.seasons)).then(function() {});
  //                 /** Update season in months object */
  //                 let monthArray = [{name: "Month*", tid : 0}];
  //                 let seasonArray = response.Details.seasons ? response.Details.seasons : [];
  //                 seasonArray.forEach((element : any) => {
  //                     monthArray.push(element);
  //                 });
  //                 MonthObj.serverMonthsCount = monthArray.length;
  //                 monthArray = monthArray.concat(months);
  //                 MonthObj.month = monthArray;
  //                 let key = Account.selectedData().instanceID+"_"+Account.selectedData().userID;
  //                 Utility.unreadNotification[key] = getDetails(response, ["Details", "notification_unread_count"], keyInt);
  //                 if(Utility.unreadNotification[key]){
  //                     EventManager.callBack(kNotificationIndicator)
  //                 }
  //                 /** */
  //                 DefaultPreference.set('allow_redaction', response.Details.allow_redaction ).then(function() {
  //                 });
  //                 DefaultPreference.set('default_share_option', response.Details.default_share_option ).then(function() {
  //                 });
  //                 DefaultPreference.set('digital_archive_checkbox', response.Details.digital_archive_checkbox ).then(function() {
  //                 });
  //                 DefaultPreference.set('etherpad_key', response.Details.etherpad_key ).then(function() {
  //                 });
  //                 DefaultPreference.set('internal_filter', response.Details.internal_filter ).then(function() {
  //                 });
  //                 DefaultPreference.set('privacy_policy_url', response.Details.privacy_policy_url ).then(function() {
  //                 });
  //                 DefaultPreference.set('public_file_path', response.Details.public_file_path ).then(function() {
  //                 });
  //                 DefaultPreference.set('site_logo', response.Details.site_logo ).then(function() {
  //                 });
  //                 DefaultPreference.set('site_short_name', response.Details.site_short_name ).then(function() {
  //                 });
  //                 DefaultPreference.set('start_year', response.Details.years.start).then(function() {
  //                 });
  //                 DefaultPreference.set('end_year', response.Details.years.end).then(function() {
  //                 });
  //                 DefaultPreference.get('public_file_path').then((value: any) => {
  //                     Utility.setPublicURL();
  //                     var actualPath = Account.selectedData().profileImage.replace("public://", value);
  //                     Account.selectedData().profileImage = actualPath
  //                     DeviceEventEmitter.emit(kProfilePicUpdated)
  //                     DefaultPreference.get('start_year').then((value: any) => {
  //                         Account.selectedData().start_year =  value
  //                         DefaultPreference.get('end_year').then((value: any) => {
  //                             Account.selectedData().end_year =  value
  //                             this.getTimelineListFromServer();
  //                         });
  //                     });
  //                 });
  //         } catch (err) {
  //             //console.log("Error fetching configurations")
  //         }
  //     }else{
  //         setTimeout(() => {
  //             this.setState({showNoInternetView: true,
  //             loadMemories: false});
  //         }, 500);
  //     }
  // };
  // getTimelineListFromServer = () =>{
  //     // if(Platform.OS === "android"){
  //     //     NativeModules.AllMemoriesComponent.setUserDetail(JSON.stringify(Account.selectedData())); }
  //     // else{
  //     //      this.loadMemoryTimeline()
  //     //  }
  //     this.loadMemoryTimeline()
  // }
}

const mapDispatch = (dispatch: Function) => ({
  performAction: (action: {type: string; payload: any}) => dispatch(action),
});

export default connect(null, mapDispatch)(DashBoard);
