import React, {useRef, useState ,useEffect} from 'react';
import { SafeAreaView, FlatList, TouchableHighlight, StyleSheet , View, StatusBar, Keyboard, RefreshControl, Text, ActivityIndicator, Image, Alert, Platform} from "react-native";
import { connect } from 'react-redux';
import AudioPlayer, { kClosed, kEnded, kNext, kPaused, kPlaying, kPrevious } from '../../../common/component/audio_player/audio_player';
import MemoryActionsSheet, { MemoryActionsSheetItem } from './../../../../app/components/memoryActionsSheet';
// import MemoryActionsSheet, { MemoryActionsSheetItem } from '../../../common/component/memoryActionsSheet';
import { No_Internet_Warning, ToastMessage } from '../../../common/component/Toast';
import { Colors, decode_utf8, fontSize, MemoryActionKeys } from '../../../common/constants';
import Utility from '../../../common/utility';
import { block_and_report, block_memory, block_user, cancelActions, delete_memory, edit_memory, filter_icon, move_to_draft, remove_me_from_this_post, report_user } from '../../../images';
import { _onShowMemoryDetails, renderSeparator, onActionItemClicked, MemoryActionsList } from '../../myMemories/PublishedMemory';
import { GET_MEMORY_LIST, ListType, REMOVE_PROMPT } from '../dashboardReducer';
import DeviceInfo from "react-native-device-info";
import { Like, Unlike } from '../../memoryDetails/detailsWebService';
import { kLiked, kUnliked } from '../../myMemories/myMemoriesWebService';
import TextNew from '../../../common/component/Text';
import { filterView } from '../dashboardIndex';
import MemoryListItem from '../../../../app/components/memoryListItem';
// import MemoryListItem from '../../../common/component/memoryListItem';
import { Actions } from 'react-native-router-flux';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import { DefaultDetailsMemory } from '../../createMemory/dataHelper';
import { CreateUpdateMemory, promptIdListener } from '../../createMemory/createMemoryWebService';
import EventManager from '../../../common/eventManager';


import styles from './styles';
type State={[x: string] : any};
type Props={[x: string] : any};

var MemoryActions: Array<MemoryActionsSheetItem> = [];

const Recent = (props :Props) =>{

    let _actionSheet = useRef(null);
    let audioPlayer = useRef(null);
    let memoryFromPrompt: EventManager;

    const [state, setState] = useState({
        showNoInternetView: false,
        audioFile: {
            index: -1,
            isPlaying: false,
            file: {},
            memoryTitle: "",
            by: "",
            fid: 0,
            nid: 0
        },
        showMemoryActions: false,
        animateValue: null,
        animateType: null
    })
    
    let selectedPrompt : any = {};
    let memoryUpdateListener: EventManager;

    useEffect(()=>{
        memoryUpdateListener = EventManager.addListener("memoryUpdateRecentListener", ()=>{
            props.fetchMemoryList({type: ListType.Recent, isLoading : true});
         });     
         props.fetchMemoryList({type: ListType.Recent, isLoading : true});
    },[])

    const onRefresh = () => {
        props.fetchMemoryList({type: ListType.Recent, isLoading : true});
       // this.props.fetchMemoryList({type: ListType.Recent, isRefresh : true, filters : this.props.filters});
    }

    const handleLoadMore = () => {  
        if (props.recentList.length > 0 && props.recentList.length < props.totalCount) {
            if (!props.isLoadMore) {
                let memoryDetails;
                if (props.recentList[props.recentList.length - 1].active_prompts){
                    memoryDetails = props.recentList[props.recentList.length - 2];  //prompts   
                }else{
                    memoryDetails = props.recentList[props.recentList.length - 1];
                }
                // if(props.totalCount > 5)
                props.fetchMemoryList({type: ListType.Recent, isLoadMore : true, lastMemoryDate : memoryDetails.updated, filters : props.filters});
            }
        }
    };

    const openMemoryActions = (item: any) => {
        showActionsSheet(item);
    }

    const showActionsSheet = (item: any) => {
        /**Menu options for actions*/
        MemoryActions = MemoryActionsList(item);
        // let cancelButtonIndex = MemoryActions.length
        // MemoryActions.push({index: cancelButtonIndex, text: "Cancel", image: cancelActions, actionType: MemoryActionKeys.cancelActionKey })
        _actionSheet && _actionSheet.current && _actionSheet.current.showSheet()
        setState(prevState => ({
            ...prevState,
            showMemoryActions: true
        }));
    }
    
    const audioView = (item: any) => {
        if (item.audios.length > 0) {
            return <View style={{ justifyContent: "space-around", flexDirection: "row", margin: 16, marginTop: 0}}>
                <View style={[{ flex: 1, elevation: 2, backgroundColor: Colors.AudioViewBg , borderColor: Colors.AudioViewBorderColor, borderWidth: 2, borderRadius: 10}, styles.boxShadow]}>
                    {(item.audios[0].url && item.audios[0].url != "") &&
                            <View style={{ width: "100%", paddingTop: 10, paddingBottom: 10, justifyContent: "flex-start", flexDirection: "row", alignItems: "center" }}  onStartShouldSetResponder={() => true} onResponderStart={()=> togglePlayPause(item)}>
                                <View style={{ width: 55, height: 55, marginLeft: 15, backgroundColor: "#fff", borderRadius: 30, borderWidth: 4, borderColor: Colors.AudioViewBorderColor, justifyContent: "center", alignItems: "center" }}>
                                    {state.audioFile.fid == item.audios[0].fid && state.audioFile.isPlaying ?
                                        <View style={{ height: 20, width: 16, justifyContent: "space-between", flexDirection: "row" }}>
                                            <View style={{ backgroundColor: Colors.AudioViewBorderColor, flex: 1, width: 5 }} />
                                            <View style={{ backgroundColor: "transparent", flex: 1, width: 2 }} />
                                            <View style={{ backgroundColor: Colors.AudioViewBorderColor, flex: 1, width: 5 }} />
                                        </View>
                                        : <View style={{
                                            height: 24, width: 24, marginLeft: 10,
                                            borderLeftColor: Colors.AudioViewBorderColor, borderLeftWidth: 18,
                                            borderTopColor: "transparent", borderTopWidth: 12,
                                            borderBottomColor: "transparent", borderBottomWidth: 12
                                        }} />
                                    }
                                </View>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={[styles.normalText, { color: "#000", marginBottom: 5, paddingRight: 80 }]} numberOfLines={1} ellipsizeMode='tail'>{item.audios[0].title ? item.audios[0].title : item.audios[0].filename ? item.audios[0].filename : ""}</Text>
                                    <Text style={[styles.normalText, { color: "#000" }]}>{item.audios[0].duration}</Text>
                                </View>
                            </View>
                    }
                </View>
                {item.audios.length > 1 ?
                    <View style={[{ width: 56, marginLeft: 7, elevation: 2, backgroundColor: Colors.AudioViewBg , borderColor: Colors.AudioViewBorderColor, borderWidth: 2, borderRadius: 10}, styles.boxShadow]}>
                        <TouchableHighlight underlayColor={"#ffffff00"}
                            style={{ flex: 1, justifyContent: "center" }}
                            onPress={
                                () => {
                                    _onShowMemoryDetails(item)
                                }
                            }
                        >
                            <Text style={{ color: Colors.TextColor, ...fontSize(14), textAlign: "center" }}>{"+"}{item.audios.length - 1}{"\n more"}</Text>
                        </TouchableHighlight>
                    </View>
                    : null
                }

            </View>

        }

    }

    const togglePlayPause = (item: any) => {
        if (item.audios[0].fid == state.audioFile.index) {
              audioPlayer.current.tooglePlayPause();
          } else {
              _onOpenAudios(item);
         }
  
    }  

    const renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (!props.loadmore) return null;
        return (
            <View style={{ width: "100%", height: 40, marginTop: 20 }}>
                <ActivityIndicator
                    color={Colors.newTextColor}
                />
            </View>
        );
    };
    
    const _onOpenAudios = (item: any) => {
          if (Utility.isInternetConnected) {
              let playing = state.audioFile.isPlaying;
              let fid = state.audioFile.fid;
              if (item.audios[0].fid == fid) {
                  playing = !playing;
              } else {
                  playing = true;
              }
              let audioFile = {
                  index: 0, isPlaying: playing, file: [item.audios[0]],
                  memoryTitle: item.title, by: item.name, fid: item.audios[0].fid, nid: item.nid
              }
            setState(prevState => ({
                ...prevState,
                audioFile: audioFile
            }));

            //   this.setState({
            //       audioFile: audioFile
            //   }, () => {
                  if (item.audios[0].fid == fid) {
                      audioPlayer.current.tooglePlayPause();
                  } else {
                      audioPlayer.current.showPlayer(0);
                  }
            //   }
            //   )
          }else{
              No_Internet_Warning();
          }
      }

      const _onCloseAudios = (event: Event) => {
        try {
            audioPlayer.current.hidePlayer();
        } catch (error) {

        }
    }

    const like = (item: any) => {
        console.log("item on like:",item);
        
        setState(prevState => ({
            ...prevState,
            animateValue: item.index
        }));
        if (Utility.isInternetConnected) {
            if (item.item.isLikedByUser) {
                Unlike(item.item.nid, item.item.type, kUnliked);
                item.item.isLikedByUser = 0;
                item.item.noOfLikes = item.item.noOfLikes - 1;
            } else {
                Like(item.item.nid, item.item.type, kLiked);
                item.item.isLikedByUser = 1;
                item.item.noOfLikes = item.item.noOfLikes + 1;
            }
        } 
        else {
            No_Internet_Warning();
        }
    }

    const playerCallback = (event: any) => {
        let audioFile = state.audioFile;
        switch (event) {
            case kEnded: audioFile.isPlaying = false;
                break;
            case kClosed: audioFile.isPlaying = false;
                audioFile.index = -1;
                audioFile.fid = -1;
                break;
            case kPlaying: audioFile.isPlaying = true;
                break;
            case kPaused: audioFile.isPlaying = false;
                break;
            case kNext: audioFile.isPlaying = true;
                audioFile.index = audioFile.index + 1;
                break;
            case kPrevious: audioFile.isPlaying = true;
                audioFile.index = audioFile.index - 1;
                break;
        }
        setState(prevState => ({
            ...prevState,
            audioFile: audioFile
        }));
        
    }
    
    const promptToMemoryCallBack=(success : boolean, draftDetails : any)=>{
        memoryFromPrompt.removeListener();
        setTimeout(() => {
            loaderHandler.hideLoader();
        }, 500);
        if(success){	
            props.removePrompt(selectedPrompt);
            Actions.push("createMemory", {editMode : true, draftNid : draftDetails, isFromPrompt: true})      
        }
        else{
        loaderHandler.hideLoader()
                ToastMessage(draftDetails);
        }
    }

    const _onAddProptToMemoryAction=(firstIndex: any, secondIndex: any)=>{    

        if(Utility.isInternetConnected){	
            let data = props.recentList[firstIndex].active_prompts[secondIndex];
            selectedPrompt.firstIndex = firstIndex;
            selectedPrompt.secondIndex = secondIndex;
            loaderHandler.showLoader("Creating Memory...");			
            let draftDetails : any = DefaultDetailsMemory(decode_utf8(data.prompt_title.trim()));						
            draftDetails.prompt_id = parseInt(data.prompt_id);             
            memoryFromPrompt = EventManager.addListener(promptIdListener, promptToMemoryCallBack)        
            CreateUpdateMemory(draftDetails, [], promptIdListener, "save")   
            Keyboard.dismiss();
        } 
        else{
            No_Internet_Warning();
        }

    }

    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: 'center', height: '100%', backgroundColor:Colors.timeLinebackground }}>
                <View style={{ height: "100%", width: "100%", backgroundColor: Colors.timeLinebackground  }}>
                    {/* {filterView(props.filterClick(ListType.Recent), ListType.Recent)} */}
                    <View style={{height:10}}/>
                    <FlatList
                        data={props.recentList}
                        style={{ width: '90%',alignSelf:'center' }}
                        extraData={state}
                        onScroll={()=>{Keyboard.dismiss()}}
                        renderItem={(item: any) =>(
                            <MemoryListItem
                                item={item}
                                animate={state.animateValue}
                                previousItem={null}
                                like={like}
                                listType={ListType.Recent} 
                                audioView={audioView}
                                openMemoryActions={openMemoryActions}
                                addMemoryFromPrompt={(firstIndex:any, secondIndex: any)=> 
                                    _onAddProptToMemoryAction(firstIndex, secondIndex)                                        
                                }
                            />
                            )}
                        // maxToRenderPerBatch={50}
                        indicatorStyle='white'
                        removeClippedSubviews={true}
                        refreshControl={
                            <RefreshControl
                                colors={[Platform.OS === "android" ? Colors.newTextColor: Colors.newTextColor]}
                                tintColor={Platform.OS === "android" ? Colors.newTextColor: Colors.newTextColor}
                                refreshing={props.refresh}
                                onRefresh={onRefresh}
                            />
                        }
                        keyExtractor={(_, index: number) => `${index}`}
                        ItemSeparatorComponent={()=><View style={{height:10,width:20}}/>}
                        ListFooterComponent={renderFooter}
                        onEndReachedThreshold={0.4}
                        onEndReached={handleLoadMore}
                    />
                    {
                        props.recentList.length == 0 &&
                        <View style={{position: 'absolute', top : 40 ,height : '100%', width: '100%', alignContent: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
                            {
                                props.loading ?
                                <ActivityIndicator color={Colors.newTextColor}    
                                        size="large"                    
                                        style={{flex: 1, justifyContent : "center"}}/> 
                                : 
                                <Text style={{...fontSize(16), color : Colors.dullText, textAlign: 'center'}}>
                                    There are no memories or cues to display at this moment. Check your filter settings and try again
                                </Text>
                            }
                        </View>
                    }
                </View>
                <AudioPlayer ref={audioPlayer} playerCallback={(event: any) => playerCallback(event)} files={state.audioFile.file} memoryTitle={state.audioFile.memoryTitle} by={"by " + state.audioFile.by} bottom={10}></AudioPlayer>
            </SafeAreaView>
            
            <MemoryActionsSheet
                ref={_actionSheet}
                width={DeviceInfo.isTablet() ? "65%" : "100%"}
                actions={MemoryActions}
                memoryActions = {true}
                onActionClick={onActionItemClicked}
            />

            {!props.loading && !props.loadmore && !props.refresh && loaderHandler.hideLoader()}
        </View>
    );

}

const mapState = (state: any) => {
	return {
        recentList : state.dashboardReducer.recentList,
        loading : state.dashboardReducer.loadingRecent,
        loadmore: state.dashboardReducer.loadMoreRecent,
        refresh: state.dashboardReducer.refreshRecent,
        totalCount : state.dashboardReducer.recentCount,
        filters : state.dashboardReducer.filterDataRecent,
        active_prompts : state.dashboardReducer.active_prompts,
    }
};

const mapDispatch = (dispatch: Function) => {
	return {
        fetchMemoryList : (payload : any) => dispatch({type: GET_MEMORY_LIST, payload : payload}),
        removePrompt: (payload: any) => dispatch({type: REMOVE_PROMPT, payload : payload})
	};
};

export default connect(
	mapState,
	mapDispatch
)(Recent);
