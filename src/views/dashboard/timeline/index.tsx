import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, TouchableHighlight, StyleSheet, Modal, View, StatusBar, Text, ActivityIndicator, Keyboard, RefreshControl, Platform, Alert, Image } from "react-native";
import { connect } from 'react-redux';
import AudioPlayer, { kClosed, kEnded, kNext, kPaused, kPlaying, kPrevious } from '../../../common/component/audio_player/audio_player';
import { MemoryActionsSheetItem } from '../../../common/component/memoryActionsSheet';
import MemoryActionsSheet from './../../../../app/components/memoryActionsSheet';
import { No_Internet_Warning } from '../../../common/component/Toast';
import { Colors, fontSize, MemoryActionKeys } from '../../../common/constants';
import Utility from '../../../common/utility';
import { cancelActions } from '../../../images';
import { Like, Unlike } from '../../memoryDetails/detailsWebService';
import { kLiked, kUnliked } from '../../myMemories/myMemoriesWebService';
import { MemoryActionsList, onActionItemClicked, renderSeparator, _onShowMemoryDetails } from '../../myMemories/PublishedMemory';
import { filterView } from '../dashboardIndex';
import { GET_MEMORY_LIST, GET_TIMELINE_LIST, JUMP_TO_VIEW_SHOW, ListType } from '../dashboardReducer';
import DeviceInfo from "react-native-device-info";
import MemoryListItem from '../../../../app/components/memoryListItem';
// import MemoryListItem from '../../../common/component/memoryListItem';
import JumpToScreen from '../jumpToScreen';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import EventManager from '../../../common/eventManager';
import { chevronleftfilter } from '../../../../app/images';
type State = { [x: string]: any };
type Props = { [x: string]: any };
var MemoryActions: Array<MemoryActionsSheetItem> = [];

const Timeline = (props: Props) => {
    let _actionSheet: any | MemoryActionsSheet = null;
    let audioPlayer: React.RefObject<AudioPlayer> = React.createRef<AudioPlayer>();
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
        animateValue: null,
        showMemoryActions: false,
        jumpToVisibility: false,
        isJumpToCalled: false,
        jumpToDate: ''
    });

    let memoryTimelineUpdateListener: EventManager;

    useEffect(() => {
        memoryTimelineUpdateListener = EventManager.addListener("memoryUpdateTimelineListener", () => {
            // let obj = {type: ListType.Timeline, isRefresh : true, filters : props.filters, loadPrevious : true, lastMemoryDate : props.timelineList[0].updated, filters : props.filters}     
            // props.fetchMemoryList(obj);
            props.fetchMemoryList({ type: ListType.Timeline, isLoading: true });
            loaderHandler.hideLoader();
        });
        props.fetchMemoryList({ type: ListType.Timeline, isLoading: true });

    }, [])

    const onRefresh = () => {
        props.fetchMemoryList({ type: ListType.Timeline, isLoading: true });
        // let obj = {type: ListType.Timeline, isRefresh : true, filters : props.filters, loadPrevious : true, lastMemoryDate : props.timelineList[0].updated, filters : props.filters}     
        // props.fetchMemoryList(obj);
    }

    const handleLoadMore = () => {
        if (!props.isLoadMore) {
            let memoryDetails = props.timelineList[props.timelineList.length - 1]
            props.fetchMemoryList({ type: ListType.Timeline, isLoadMore: true, lastMemoryDate: memoryDetails.updated, filters: props.filters });
        }
    };

    const openMemoryActions = (item: any) => {
        showActionsSheet(item);
    }

    const showActionsSheet = (item: any) => {
        /**Menu options for actions*/
        MemoryActions = MemoryActionsList(item);
        let cancelButtonIndex = MemoryActions.length
        MemoryActions.push({ index: cancelButtonIndex, text: "Cancel", image: cancelActions, actionType: MemoryActionKeys.cancelActionKey })
        _actionSheet && _actionSheet.showSheet()
        setState(prevState => ({
            ...prevState,
            showMemoryActions: true
        }))
    }

    const audioView = (item: any) => {
        if (item.audios.length > 0) {
            return <View style={{ justifyContent: "space-around", flexDirection: "row", margin: 16, marginTop: 0 }}>
                <View style={[{ flex: 1, elevation: 2, backgroundColor: Colors.AudioViewBg, borderColor: Colors.AudioViewBorderColor, borderWidth: 2, borderRadius: 10 }, styles.boxShadow]}>
                    {(item.audios[0].url && item.audios[0].url != "") &&
                        <View style={{ width: "100%", paddingTop: 10, paddingBottom: 10, justifyContent: "flex-start", flexDirection: "row", alignItems: "center" }} onStartShouldSetResponder={() => true} onResponderStart={() => togglePlayPause(item)}>
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
                    <View style={[{ width: 56, marginLeft: 7, elevation: 2, backgroundColor: Colors.AudioViewBg, borderColor: Colors.AudioViewBorderColor, borderWidth: 2, borderRadius: 10 }, styles.boxShadow]}>
                        <TouchableHighlight underlayColor={"#ffffff"}
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
            }))

            if (item.audios[0].fid == fid) {
                audioPlayer.current.tooglePlayPause();
            } else {
                audioPlayer.current.showPlayer(0);
            }

        } else {
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
            // this.setState({})
        } else {
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
        }))
    }

    const jumpToClicked = (selectedYear: any, selectedMonth: any) => {
        props.fetchMemoryList({ type: ListType.Timeline, isLoading: true, jumpTo: true, selectedYear, selectedMonth });
    }


    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: 'center', height: '100%', backgroundColor: Colors.timeLinebackground }}>
                <View style={{ height: "100%", width: "100%", backgroundColor: Colors.timeLinebackground }}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        // visible={state.jumpToVisibility}
                        visible={props.isJumptoShow ? props.isJumptoShow : false}
                    >
                        <JumpToScreen jumpToClick={(selectedYear: any, selectedMonth: any) => jumpToClicked(selectedYear, selectedMonth)}
                            jumpToYears={props.jumpToYears} memoryDate={state.jumpToDate}
                            closeAction={() => props.showJumpto(false)}
                        />
                    </Modal>
                    {/* {filterView(props.filterClick(ListType.Timeline), ListType.Timeline)} */}
                    <View style={{ height:  props.toDate && props.fromDate ? 50 : 10, width: "100%", justifyContent:'center', backgroundColor: Colors.timeLinebackground, padding: 10 }}>
                        <View style={{ width: "10%", }}></View>
                        <View style={{ flex: 1,width: "60%", flexDirection: 'row', height: 50, justifyContent: 'space-between',alignItems:'center' }}>
                            {
                                props.toDate && props.fromDate ?
                                    <>
                                        <Image source={chevronleftfilter} />
                                        <Text style={[styles.newnormalText, { color: Colors.newTextColor }]} numberOfLines={1} ellipsizeMode='tail'>{props.fromDate}</Text>
                                        <View style={{height:1,backgroundColor:Colors.newTextColor, width:50, marginHorizontal:10}}></View>
                                        <Text style={[styles.newnormalText, { color: Colors.newTextColor }]}>{props.toDate}</Text>
                                    </>
                                    :
                                    null
                            }
                        </View>
                        <View style={{ flex: 0.8,width: "30%", flexDirection: 'row', justifyContent: 'space-between', }}></View>

                    </View>
                    <FlatList
                        data={props.timelineList}
                        style={{ width: '90%', alignSelf: 'center', backgroundColor: Colors.timeLinebackground }}
                        extraData={state}
                        keyExtractor={(_, index: number) => `${index}`}
                        onScroll={() => { Keyboard.dismiss() }}
                        ItemSeparatorComponent={() => <View style={{ height: 10, width: 20 }} />}
                        renderItem={(item: any) =>
                            <MemoryListItem
                                item={item}
                                previousItem={item.index == 0 ? null : props.timelineList[item.index - 1]}
                                like={like}
                                listType={ListType.Timeline}
                                animate={state.animateValue}
                                audioView={audioView}
                                jumpToVisibility={(memory_date: any) => setState(prevState => ({
                                    ...prevState,
                                    jumpToVisibility: true, jumpToDate: memory_date
                                }))}
                                openMemoryActions={openMemoryActions}
                            />}
                        maxToRenderPerBatch={50}
                        indicatorStyle='white'
                        removeClippedSubviews={true}
                        refreshControl={
                            <RefreshControl
                                colors={[Platform.OS === "android" ? Colors.NewThemeColor : "#fff"]}
                                tintColor={Platform.OS === "android" ? Colors.NewThemeColor : "#fff"}
                                refreshing={props.refresh}
                                onRefresh={onRefresh.bind(this)}
                            />
                        }
                        ListFooterComponent={renderFooter.bind(this)}
                        onEndReachedThreshold={0.4}
                        onEndReached={(props.timelineList && props.timelineList.length > 2) ? handleLoadMore.bind(this) : () => { }}
                    />
                    {
                        props.timelineList.length == 0 &&
                        <View style={{ position: 'absolute', top: 40, height: '100%', width: '100%', alignContent: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                            {props.loading ? <ActivityIndicator color={Colors.newTextColor}
                                size="large"
                                style={{ flex: 1, justifyContent: "center" }} /> :
                                <Text style={{ ...fontSize(16), color: Colors.dullText, textAlign: 'center' }}>There are no memories or cues to display at this moment. Check your filter settings and try again</Text>}
                        </View>
                    }
                </View>
                <AudioPlayer ref={audioPlayer} playerCallback={(event: any) => playerCallback(event)} files={state.audioFile.file} memoryTitle={state.audioFile.memoryTitle} by={"by " + state.audioFile.by} bottom={10}></AudioPlayer>
            </SafeAreaView>
            <MemoryActionsSheet
                ref={ref => (_actionSheet = ref)}
                width={DeviceInfo.isTablet() ? "65%" : "100%"}
                actions={MemoryActions}
                memoryActions={true}
                onActionClick={onActionItemClicked}
            />
            {!props.loading && !props.loadmore && !props.refresh && loaderHandler.hideLoader()}
        </View>
    );

}

const mapState = (state: any) => {
    return {
        timelineList: state.dashboardReducer.timelineList,
        loading: state.dashboardReducer.loadingTimeline,
        loadmore: state.dashboardReducer.loadMoreTimeline,
        refresh: state.dashboardReducer.refreshTimeline,
        totalCount: state.dashboardReducer.timelineCount,
        filters: state.dashboardReducer.filterDataTimeline,
        jumpToYears: state.dashboardReducer.jumpToYears,
        jumpToCalled: state.dashboardReducer.jumpToCalled,
        isJumptoShow: state.dashboardReducer.isJumptoShow,
        fromDate: state.dashboardReducer.fromDate,
        toDate: state.dashboardReducer.toDate,
    }
};

const mapDispatch = (dispatch: Function) => {
    return {
        fetchMemoryList: (payload: any) => dispatch({ type: GET_TIMELINE_LIST, payload: payload }),
        showJumpto: (payload: any) => dispatch({ type: JUMP_TO_VIEW_SHOW, payload: payload }),
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
    newnormalText: {
        ...fontSize(16),
        fontWeight: "normal",
        color: "#595959",
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