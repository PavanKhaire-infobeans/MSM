import React from 'react';
import { SafeAreaView, FlatList, TouchableHighlight, StyleSheet, Modal, View, StatusBar, Text, ActivityIndicator, Keyboard, RefreshControl, Platform, Alert} from "react-native";
import { connect } from 'react-redux';
import AudioPlayer, { kClosed, kEnded, kNext, kPaused, kPlaying, kPrevious } from '../../../common/component/audio_player/audio_player';
import MemoryActionsSheet, { MemoryActionsSheetItem } from '../../../common/component/memoryActionsSheet';
import { No_Internet_Warning } from '../../../common/component/Toast';
import { Colors, fontSize, MemoryActionKeys } from '../../../common/constants';
import Utility from '../../../common/utility';
import { cancelActions } from '../../../images';
import { Like, Unlike } from '../../memoryDetails/detailsWebService';
import { kLiked, kUnliked } from '../../myMemories/myMemoriesWebService';
import { MemoryActionsList, onActionItemClicked, renderSeparator, _onShowMemoryDetails } from '../../myMemories/PublishedMemory';
import { filterView } from '../dashboardIndex';
import { GET_MEMORY_LIST, GET_TIMELINE_LIST, ListType } from '../dashboardReducer';
import DeviceInfo from "react-native-device-info";
import MemoryListItem from '../../../common/component/memoryListItem';
import JumpToScreen from '../jumpToScreen';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import EventManager from '../../../common/eventManager';
type State={[x: string] : any};
type Props={[x: string] : any};
var MemoryActions: Array<MemoryActionsSheetItem> = [];

class Timeline extends React.Component<Props, State> {
    _actionSheet: any | MemoryActionsSheet = null;
    audioPlayer: React.RefObject<AudioPlayer> = React.createRef<AudioPlayer>();
    state: State = {
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
        jumpToVisibility : false,
        isJumpToCalled : false
    }
    memoryTimelineUpdateListener: EventManager;
    
    constructor(props: Props) {
        super(props);      
    }   
    
    componentDidMount(){        
        this.memoryTimelineUpdateListener = EventManager.addListener("memoryUpdateTimelineListener", ()=>{
            // let obj = {type: ListType.Timeline, isRefresh : true, filters : this.props.filters, loadPrevious : true, lastMemoryDate : this.props.timelineList[0].updated, filters : this.props.filters}     
            // this.props.fetchMemoryList(obj);
            this.props.fetchMemoryList({type: ListType.Timeline, isLoading : true});
            loaderHandler.hideLoader();
         });   
        this.props.fetchMemoryList({type: ListType.Timeline, isLoading : true});
    }

    onRefresh = () => {
        this.props.fetchMemoryList({type: ListType.Timeline, isLoading : true});
        // let obj = {type: ListType.Timeline, isRefresh : true, filters : this.props.filters, loadPrevious : true, lastMemoryDate : this.props.timelineList[0].updated, filters : this.props.filters}     
        // this.props.fetchMemoryList(obj);
    }

    handleLoadMore = () => {        
        if (!this.props.isLoadMore) {
                let memoryDetails = this.props.timelineList[this.props.timelineList.length - 1]
                this.props.fetchMemoryList({type: ListType.Timeline, isLoadMore : true, lastMemoryDate : memoryDetails.updated, filters : this.props.filters});
        }
    };

    openMemoryActions = (item: any) => {
        this.showActionsSheet(item);
    }

    showActionsSheet = (item: any) => {
        /**Menu options for actions*/
        MemoryActions = MemoryActionsList(item);
        let cancelButtonIndex = MemoryActions.length
        MemoryActions.push({index: cancelButtonIndex, text: "Cancel", image: cancelActions, actionType: MemoryActionKeys.cancelActionKey })
        this._actionSheet && this._actionSheet.showSheet()
        this.setState({ showMemoryActions: true })
    }
    
    audioView = (item: any) => {
        if (item.audios.length > 0) {
            return <View style={{ justifyContent: "space-around", flexDirection: "row", margin: 16, marginTop: 0}}>
                <View style={[{ flex: 1, elevation: 2, backgroundColor: Colors.AudioViewBg , borderColor: Colors.AudioViewBorderColor, borderWidth: 2, borderRadius: 10}, styles.boxShadow]}>
                    {(item.audios[0].url && item.audios[0].url != "") &&
                            <View style={{ width: "100%", paddingTop: 10, paddingBottom: 10, justifyContent: "flex-start", flexDirection: "row", alignItems: "center" }}  onStartShouldSetResponder={() => true} onResponderStart={()=> this.togglePlayPause(item)}>
                                <View style={{ width: 55, height: 55, marginLeft: 15, backgroundColor: "#fff", borderRadius: 30, borderWidth: 4, borderColor: Colors.AudioViewBorderColor, justifyContent: "center", alignItems: "center" }}>
                                    {this.state.audioFile.fid == item.audios[0].fid && this.state.audioFile.isPlaying ?
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

    togglePlayPause = (item: any) => {
        if (item.audios[0].fid == this.state.audioFile.index) {
              this.audioPlayer.current.tooglePlayPause();
          } else {
              this._onOpenAudios(item);
          }
    }  

    renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (!this.props.loadmore) return null;
        return (
            <View style={{ width: "100%", height: 40, marginTop: 20 }}>
                <ActivityIndicator
                    color={"white"}
                />
            </View>
        );
    };
    
    _onOpenAudios(item: any) {
          if (Utility.isInternetConnected) {
              let playing = this.state.audioFile.isPlaying;
              let fid = this.state.audioFile.fid;
              if (item.audios[0].fid == fid) {
                  playing = !playing;
              } else {
                  playing = true;
              }
              let audioFile = {
                  index: 0, isPlaying: playing, file: [item.audios[0]],
                  memoryTitle: item.title, by: item.name, fid: item.audios[0].fid, nid: item.nid
              }
              this.setState({
                  audioFile: audioFile
              }, () => {
                  if (item.audios[0].fid == fid) {
                      this.audioPlayer.current.tooglePlayPause();
                  } else {
                      this.audioPlayer.current.showPlayer(0);
                  }
              }
              )
          }else{
              No_Internet_Warning();
          }
      }

      _onCloseAudios(event: Event) {
          try {
              this.audioPlayer.current.hidePlayer();
          } catch (error) {
  
          }
      }



    like = (item: any) => {
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
            this.setState({})
        } else {
            No_Internet_Warning();
        }
    }

      playerCallback = (event: any) => {
        let audioFile = this.state.audioFile;
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
        this.setState({ audioFile: audioFile })
    }
    
    jumpToClicked=(selectedYear: any, selectedMonth: any)=>{
        this.props.fetchMemoryList({type: ListType.Timeline, isLoading : true, jumpTo : true, selectedYear, selectedMonth});
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: 'center', height: '100%' }}>
                    <View style={{ height: "100%", width: "100%"}}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.jumpToVisibility}>
                            <JumpToScreen jumpToClick={(selectedYear: any, selectedMonth: any) => this.jumpToClicked(selectedYear, selectedMonth)} jumpToYears={this.props.jumpToYears} memoryDate={this.state.jumpToDate} closeAction={()=> this.setState({jumpToVisibility : false})}/>
                        </Modal>
                        {filterView(this.props.filterClick(ListType.Timeline), ListType.Timeline)}                                                
                        <FlatList
                            data={this.props.timelineList}
                            style={{ width: '100%', backgroundColor: Colors.NewThemeColor}}
                            extraData={this.state}
                            keyExtractor={(_, index: number) => `${index}`}
                            onScroll={()=>{Keyboard.dismiss()}}
                            renderItem={(item: any) => 
                                <MemoryListItem
                                    item={item}
                                    previousItem={item.index == 0 ? null : this.props.timelineList[item.index-1]}
                                    like={this.like}
                                    listType={ListType.Timeline} 
                                    audioView={this.audioView}
                                    jumpToVisibility={(memory_date : any)=> this.setState({jumpToVisibility : true, jumpToDate : memory_date})}
                                    openMemoryActions={this.openMemoryActions}
                                />}
                            maxToRenderPerBatch={50}
                            removeClippedSubviews={true}
                            refreshControl={
                                <RefreshControl
                                    colors={[Platform.OS === "android" ? Colors.NewThemeColor: "#fff"]}
                                    tintColor={Platform.OS === "android" ? Colors.NewThemeColor: "#fff"}
                                    refreshing={this.props.refresh}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                            ListFooterComponent={this.renderFooter.bind(this)}
                            onEndReachedThreshold={0.4}
                            onEndReached={this.handleLoadMore.bind(this)}
                        />
                        {
                            this.props.timelineList.length == 0 &&
                            <View style={{position: 'absolute', top : 40 ,height : '100%', width: '100%', alignContent: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
                                    {this.props.loading ?<ActivityIndicator color={Colors.ThemeColor}    
                                                                size="large"                    
                                                                style={{flex: 1, justifyContent : "center"}}/> : 
                                                              <Text style={{...fontSize(16), color : Colors.dullText, textAlign: 'center'}}>There are no memories or cues to display at this moment. Check your filter settings and try again</Text>}
                            </View>
                        }
                    </View>
                    <AudioPlayer ref={this.audioPlayer} playerCallback={(event: any) => this.playerCallback(event)} files={this.state.audioFile.file} memoryTitle={this.state.audioFile.memoryTitle} by={"by " + this.state.audioFile.by} bottom={10}></AudioPlayer>
                </SafeAreaView>
                <MemoryActionsSheet
                    ref={ref => (this._actionSheet = ref)}
                    width={DeviceInfo.isTablet() ? "65%" : "100%"}
                    actions={MemoryActions}
                    memoryActions = {true}
                    onActionClick={onActionItemClicked}
                />
                {!this.props.loading && !this.props.loadmore && !this.props.refresh && loaderHandler.hideLoader()}
            </View>
        );
    }
}

const mapState = (state: any) => {
	return {
        timelineList : state.dashboardReducer.timelineList,
        loading : state.dashboardReducer.loadingTimeline,
        loadmore: state.dashboardReducer.loadMoreTimeline,
        refresh: state.dashboardReducer.refreshTimeline,
        totalCount : state.dashboardReducer.timelineCount,
        filters : state.dashboardReducer.filterDataTimeline,
        jumpToYears : state.dashboardReducer.jumpToYears,
        jumpToCalled : state.dashboardReducer.jumpToCalled,
    }
};

const mapDispatch = (dispatch: Function) => {
	return {
        fetchMemoryList : (payload : any) => dispatch({type: GET_TIMELINE_LIST, payload : payload})
	};
};

export default connect(
	mapState,
	mapDispatch
)(Timeline);

const styles = StyleSheet.create({
    normalText: {
        ...fontSize(16),
        fontWeight: "normal",
        color: "#595959",
        marginBottom: 10
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignContent: "center"
    },
    boxShadow: {
        shadowOpacity: 1,
        shadowColor: '#D9D9D9',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 }
    },
    sideMenu: {
        paddingTop: 15,
        bottom: 0,
        left: 0,
        backgroundColor: "#fff",
        minHeight: 50,
        width: "100%",
        position: "absolute",
        borderRadius: 5,
        shadowOpacity: 1,
        elevation: 1,
        borderWidth: 0.5,
        borderColor: "rgba(0,0,0, 0.5)",
        shadowColor: '#CACACA',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 }
    },
})