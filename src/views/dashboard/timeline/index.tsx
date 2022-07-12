import React, { useEffect, useState, useRef, useCallback } from 'react';
import { SafeAreaView, FlatList, TouchableHighlight, TouchableOpacity, Modal, View, StatusBar, Text, ActivityIndicator, Keyboard, RefreshControl, Platform, Alert, Image, Dimensions } from "react-native";
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
import styles from './styles';
import { GET_MEMORY_LIST, GET_TIMELINE_LIST, JUMP_TO_VIEW_SHOW, ListType } from '../dashboardReducer';
import DeviceInfo from "react-native-device-info";
import MemoryListItem from '../../../../app/components/memoryListItem';
// import MemoryListItem from '../../../common/component/memoryListItem';
import { SvgXml } from 'react-native-svg';
import JumpToScreen from '../jumpToScreen';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import EventManager from '../../../common/eventManager';
import { chevronleftfilter, leftgradient } from '../../../../app/images';
import LinearGradient from 'react-native-linear-gradient';
type State = { [x: string]: any };
type Props = { [x: string]: any };
var MemoryActions: Array<MemoryActionsSheetItem> = [];

const Timeline = (props: Props) => {
    let _actionSheet = useRef(null);
    let flatListRef = useRef(null);
    const audioPlayer = useRef(null);
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
    const [scrolling, setScrolling] = useState(false)
    const [allYears, setAllYears] = useState(Array())
    const [memoryYears, setMemoryYears] = useState(Array())
    const [currentItemYear, setCurrentItemYear] = useState('')
    const [previousItemYear, setPreviousItemYear] = useState('')
    const [nextItemYear, setNextItemYear] = useState('')

    let memoryTimelineUpdateListener: EventManager;

    useEffect(() => {
        let allYearsTemp = [...allYears]
        props.jumpToYears?.forEach((element: any, index: any) => {
            allYearsTemp = allYearsTemp.concat(element);
        });

        setTimeout(() => {
            let yearsArr = []
            allYearsTemp.forEach(element => {
                if (yearsArr.indexOf(element.year) === -1) {
                    yearsArr.push(element.year);
                }
                // yearsArr.push(element.year)
            });

            setMemoryYears(yearsArr);
            setAllYears(allYearsTemp);
        }, 500);
    }, [props.jumpToYears])

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
            props.fetchMemoryList({ type: ListType.Timeline, isLoadMore: true, lastMemoryDate: memoryDetails.memoryDate, filters: props.filters });
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
        _actionSheet && _actionSheet.showSheet();
        setState(prevState => ({
            ...prevState,
            showMemoryActions: true
        }))
    }

    const audioView = (item: any) => {
        if (item.audios.length > 0) {
            // console.log("item.audios :: ", JSON.stringify(item.audios))
            return (<View style={styles.audioViewContainerStyle}>
                <View style={[styles.audioViewSubContainerStyle, styles.boxShadow]}>
                    {(item.audios[0].url && item.audios[0].url != "") &&
                        <View style={styles.audioPlayerContainer} onStartShouldSetResponder={() => true} onResponderStart={() => togglePlayPause(item)}>
                            <View style={styles.playPauseContainer}>
                                {state.audioFile.fid == item.audios[0].fid && state.audioFile.isPlaying ?
                                    <View style={styles.pauseContainer}>
                                        <View style={styles.column} />
                                        <View style={styles.columnTransparent} />
                                        <View style={styles.column} />
                                    </View>
                                    : <View style={styles.playbutton} />
                                }
                            </View>
                            <View style={styles.marginLeft10}>
                                <Text style={[styles.normalText, styles.filenamecontainer, { color: Colors.black }]} numberOfLines={1} ellipsizeMode='tail'>{item.audios[0].title ? item.audios[0].title : item.audios[0].filename ? item.audios[0].filename : ""}</Text>
                                <Text style={[styles.normalText, { color: Colors.black }]}>{item.audios[0].duration}</Text>
                            </View>
                        </View>
                    }
                </View>
                {item.audios.length > 1 ?
                    <TouchableOpacity
                        onPress={() => {
                            _onShowMemoryDetails(item)
                        }}
                        style={styles.buttonContainer}>
                        <Text
                            style={styles.moreTextStyle}>
                            {'+'}
                            {item.audios.length - 1 + " more"}
                        </Text>
                    </TouchableOpacity>
                    // <View style={[styles.audioMoreContainerStyle, styles.boxShadow]}>
                    //     <TouchableHighlight underlayColor={Colors.white}
                    //         style={styles.moreButtonStyle}
                    //         onPress={
                    //             () => {
                    //                 _onShowMemoryDetails(item)
                    //             }
                    //         }
                    //     >
                    //         <Text style={styles.moreTextStyle}>{"+"}{item.audios.length - 1}{"\n more"}</Text>
                    //     </TouchableHighlight>
                    // </View>
                    : null
                }

            </View>)

        }

    }

    const togglePlayPause = (item: any) => {
        console.log("togglePlayPause :: ", JSON.stringify(item.audios))
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
            <View style={styles.renderFooterStyle}>
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
            console.log("_onOpenAudios :: ", JSON.stringify(item.audios[0].fid), fid)
            if (item.audios[0].fid == fid) {
                playing = !playing;
            }
            else {
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

            setTimeout(() => {
                if (item.audios[0].fid == fid) {
                    audioPlayer.current.tooglePlayPause();
                } else {
                    audioPlayer.current.showPlayer(0);
                }
            }, 1000);

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
        loaderHandler.showLoader("Loading...")
        props.fetchMemoryList({ type: ListType.Timeline, isLoading: true, jumpTo: true, selectedYear, selectedMonth });
    }

    const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
        if (viewableItems && viewableItems.length) {
            setCurrentItemYear(viewableItems[0]?.item?.memoryYear)
        }
        // if (changed && changed.length) {
        //     if (viewableItems && viewableItems.length) {
        //         if (viewableItems[0]?.item?.memoryYear < changed[0]?.item?.memoryYear) {
        //             setPreviousItemYear(changed[0]?.item?.memoryYear)
        //         }
        //     }
        // }
    }, []);

    return (
        <View style={styles.fullFlex}>
            <SafeAreaView style={styles.container}>
                <View style={styles.subcontainer}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        style={{ backgroundColor: Colors.blacknew, flex: 1 }}
                        // visible={state.jumpToVisibility}
                        visible={props.isJumptoShow ? props.isJumptoShow : false}
                    >
                        <View style={{ flex: 1, backgroundColor: Colors.blacknewrgb }}>

                            <View style={{ flex: 1, backgroundColor: Colors.transparent }}>
                                <TouchableOpacity style={{ flex: 1, backgroundColor: Colors.transparent }} onPress={() => props.showJumpto(false)} >
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 7, borderTopLeftRadius: 12, borderTopRightRadius: 12, shadowOpacity: 1, elevation: 3, shadowColor: '(46, 49, 62, 0.05)', shadowRadius: 2, shadowOffset: { width: 4, height: 2 } }}>
                                <JumpToScreen jumpToClick={(selectedYear: any, selectedMonth: any) => jumpToClicked(selectedYear, selectedMonth)}
                                    jumpToYears={props.jumpToYears} memoryDate={state.jumpToDate}
                                    closeAction={() => props.showJumpto(false)}
                                />
                                <LinearGradient
                                    // start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                                    // locations={[0, 0.6]}
                                    colors={['rgba(255, 255, 255, 0)','rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 1)']}
                                    style={{ height: 50, width: '100%', position:'absolute',bottom:20 }}>
                                </LinearGradient>
                                <LinearGradient
                                    // start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                                    // locations={[0, 0.6]}
                                    colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)']}
                                    style={{ height: 20, width: '100%', position:'absolute',bottom:0 }}>
                                </LinearGradient>
                            </View>

                        </View>

                    </Modal>
                    {/* {filterView(props.filterClick(ListType.Timeline), ListType.Timeline)} */}

                    {/* <View style={[styles.fromDateContainerStyle, { height: props.toDate && props.fromDate ? 56 : !scrolling ? 16 : 0 }]}> */}
                    <View style={[styles.fromDateContainerStyle, { height: allYears.length && scrolling ? 56 : !scrolling ? 16 : 0 }]}>
                        <View style={styles.filterDateCOntainer}>
                            {
                                allYears.length && scrolling && currentItemYear ?
                                    // props.toDate && props.fromDate ?
                                    <>
                                        <TouchableHighlight
                                            onPress={() => {
                                                setScrolling(false);
                                                jumpToClicked(previousItemYear ? JSON.stringify(previousItemYear) : allYears.length ? allYears[allYears.length - 1].year : '', "");
                                                if (flatListRef.current) {
                                                    flatListRef.current.scrollToOffset({ animated: true, offset: 8 });
                                                }
                                                setCurrentItemYear(null)
                                                setPreviousItemYear(null)
                                                setNextItemYear(null)
                                            }}
                                            underlayColor={Colors.transparent} style={{ width: 64, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={chevronleftfilter} />
                                        </TouchableHighlight>

                                        <View style={{ width: Utility.getDeviceWidth() - 128, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ width: 26, height: 22, position: 'absolute', left: 0, zIndex: 9 }} >
                                                <Image style={{ marginLeft: -2 }} source={leftgradient} />
                                            </View>

                                            {/* <Text style={[styles.newnormalText, { color: Colors.newTextColor }]} numberOfLines={1} ellipsizeMode='tail'>{props.fromDate}</Text> */}
                                            <Text style={[styles.newnormalText, { color: Colors.newTextColor, ...fontSize(15), lineHeight: 15 }]} numberOfLines={1} ellipsizeMode='tail'>{previousItemYear ? JSON.stringify(previousItemYear) : allYears.length ? allYears[allYears.length - 1].year : ''}</Text>
                                            {<View style={{ height: 1, backgroundColor: Colors.newTextColor, width: 46 }}></View>}
                                            {/* <Text style={[styles.newnormalText, { color: Colors.newTextColor }]}>{props.toDate}</Text> */}
                                            <Text style={[styles.newnormalText, { color: Colors.newTextColor, fontWeight: '700', ...fontSize(19), lineHeight: 23.75 }]}>{JSON.stringify(currentItemYear)}</Text>
                                            <View style={{ height: 1, backgroundColor: nextItemYear ? Colors.newTextColor : Colors.transparent, width: nextItemYear ? 46 : 64 }}></View>
                                            {
                                                nextItemYear ?
                                                    <Text onPress={() => {
                                                        setScrolling(false);
                                                        jumpToClicked(nextItemYear ? JSON.stringify(nextItemYear) : '', "");
                                                        if (flatListRef.current) {
                                                            // debugger
                                                            flatListRef.current.scrollToOffset({ animated: true, offset: 8 });
                                                        }
                                                    }}
                                                        style={[styles.newnormalText, { color: Colors.newTextColor, ...fontSize(15), lineHeight: 15 }]}>
                                                        {JSON.stringify(nextItemYear)}
                                                    </Text>
                                                    :
                                                    <View style={{ width: 46 }} />
                                            }
                                            <View
                                                style={{ width: 26, height: 22, position: 'absolute', right: 0, zIndex: 9, transform: [{ rotate: '180deg' }] }} >
                                                <Image style={{ marginRight: -2 }} source={leftgradient} />
                                            </View>
                                        </View>

                                        {
                                            nextItemYear ?
                                                <TouchableHighlight
                                                    disabled={!nextItemYear}
                                                    onPress={() => {
                                                        setScrolling(false);
                                                        jumpToClicked(nextItemYear ? JSON.stringify(nextItemYear) : '', "");

                                                        if (flatListRef.current) {
                                                            flatListRef.current.scrollToOffset({ animated: true, offset: 8 });
                                                        }
                                                        setCurrentItemYear(null)
                                                        setPreviousItemYear(null)
                                                        setNextItemYear(null)
                                                    }}
                                                    underlayColor={Colors.transparent} style={{ width: 64, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image style={{ transform: [{ rotate: '180deg' }] }} source={chevronleftfilter} />
                                                </TouchableHighlight>
                                                :
                                                <View style={{ width: 64, justifyContent: 'center', alignItems: 'center' }} />
                                        }
                                    </>
                                    :
                                    null
                            }
                        </View>
                    </View>

                    <View style={{ height: allYears.length && scrolling ? 2 : 0, width: '100%', backgroundColor: Colors.bottomTabColor }} />
                    <FlatList
                        data={props.timelineList}
                        ref={flatListRef}
                        style={styles.flatlistStyle}
                        extraData={state}
                        keyExtractor={(_, index: number) => `${index}`}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={{
                            itemVisiblePercentThreshold: 5
                        }}
                        onScroll={(e) => {
                            debugger;
                            if (e?.nativeEvent?.contentOffset?.y && (e?.nativeEvent?.contentOffset?.y > 9)) {
                                setScrolling(true)
                            }
                            if (e?.nativeEvent?.contentOffset?.y && (e?.nativeEvent?.contentOffset?.y < 9)) {
                                setScrolling(false)
                            }
                            if (currentItemYear) {
                                let next = '', prev = '', currentIndex = memoryYears.indexOf(currentItemYear);
                                prev = memoryYears[currentIndex] ? memoryYears[currentIndex + 1] : memoryYears[0]
                                next = currentIndex > 0 ? memoryYears[currentIndex - 1] : null
                                // console.log("aaa :", currentIndex, " ", JSON.stringify(memoryYears), currentItemYear, prev, next)

                                setPreviousItemYear(prev);
                                setNextItemYear(next);
                                // console.warn("next : ",next ," prev : ",prev, " ",JSON.stringify(allYears))
                            }
                            Keyboard.dismiss()
                        }}
                        ItemSeparatorComponent={() => <View style={styles.renderSeparator} />}
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
                                openMemoryActions={(itm) => openMemoryActions(itm)}
                            />}
                        maxToRenderPerBatch={50}
                        indicatorStyle='white'
                        removeClippedSubviews={true}
                        refreshControl={
                            <RefreshControl
                                colors={[Platform.OS === "android" ? Colors.NewThemeColor : Colors.black]}
                                tintColor={Platform.OS === "android" ? Colors.NewThemeColor : Colors.black}
                                refreshing={props.refresh}
                                onRefresh={onRefresh.bind(this)}
                            />
                        }
                        ListFooterComponent={renderFooter.bind(this)}
                        onEndReachedThreshold={0.4}
                        onEndReached={handleLoadMore.bind(this)}
                    // onEndReached={(props.timelineList && props.timelineList.length > 2) ? handleLoadMore.bind(this) : () => { }}
                    />
                    {
                        props.timelineList.length == 0 &&
                        <View style={styles.noItemContainer}>
                            {props.loading ? <ActivityIndicator color={Colors.newTextColor}
                                size="large"
                                style={styles.activityStyle} /> :
                                <Text style={styles.noItemTextStyle}>There are no memories or cues to display at this moment. Check your filter settings and try again</Text>}
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
