import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Keyboard, Platform, RefreshControl, SafeAreaView, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import DeviceInfo from "react-native-device-info";
import { connect } from 'react-redux';
import MemoryListItem from '../../../../app/components/memoryListItem';
import AudioPlayer, { kClosed, kEnded, kNext, kPaused, kPlaying, kPrevious } from '../../../common/component/audio_player/audio_player';
import { MemoryActionsSheetItem } from '../../../common/component/memoryActionsSheet';
import { No_Internet_Warning } from '../../../common/component/Toast';
import { Colors, MemoryActionKeys } from '../../../common/constants';
import Utility from '../../../common/utility';
import { cancelActions } from '../../../images';
import { Like, Unlike } from '../../memoryDetails/detailsWebService';
import { kLiked, kUnliked } from '../../myMemories/myMemoriesWebService';
import { MemoryActionsList, onActionItemClicked, _onShowMemoryDetails } from '../../myMemories/PublishedMemory';
import { GET_TIMELINE_LIST, JUMP_TO_VIEW_SHOW, ListType } from '../dashboardReducer';
import MemoryActionsSheet from './../../../../app/components/memoryActionsSheet';
import styles from './styles';
// import MemoryListItem from '../../../common/component/memoryListItem';
import ActionSheet from "react-native-actions-sheet";
import LinearGradient from 'react-native-linear-gradient';
import { chevronleftfilter, leftgradient } from '../../../../app/images';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import EventManager from '../../../common/eventManager';
import JumpToScreen from '../jumpToScreen';
type State = { [x: string]: any };
type Props = { [x: string]: any };
var MemoryActions: Array<MemoryActionsSheetItem> = [];

const Timeline = (props: Props) => {
    let _actionSheet = useRef(null);
    let flatListRef = useRef(null);
    const audioPlayer = useRef(null);
    const actionSheetRef = useRef(null);
    const timelineYearRef = useRef(null);

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
    const [timelineBarNextPrevClick, setTimelineBarNextPrevClick] = useState(false)
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

            let filteredList = [...new Set(allYearsTemp.map(JSON.stringify))].map(JSON.parse);
            setAllYears(filteredList);
        }, 500);
    }, [props.jumpToYears])

    useEffect(() => {
        if (props.timelineList && props.timelineList.length && timelineBarNextPrevClick) {

            let currentYear = props.timelineList[0].memoryYear
            let next = '', prev = '', currentIndex = memoryYears.indexOf(currentYear);
            prev = memoryYears[currentIndex] ? memoryYears[currentIndex + 1] : null;
            next = currentIndex > 0 ? memoryYears[currentIndex - 1] : null;
            setCurrentItemYear(currentYear);
            setPreviousItemYear(prev);
            setNextItemYear(next);

            let allYearsArray = [...allYears];
            let indexToScroll = allYearsArray.findIndex(x => x.year == currentYear);
            debugger;
            if (((indexToScroll >= 0) || (indexToScroll < allYears.length)) && timelineYearRef?.current?.scrollToIndex) {
                timelineYearRef?.current?.scrollToIndex({ animated: false, index: indexToScroll, viewPosition: 0.3 })
            }
        }
    }, [props.timelineList])

    useEffect(() => {
        if (props.isJumptoShow) {
            actionSheetRef.current?.show();
        }
        else {
            actionSheetRef.current?.hide();
        }
    }, [props.isJumptoShow])

    useEffect(() => {
        let allYearsArray = [...allYears];
        let indexToScroll = allYearsArray.findIndex(x => x.year == currentItemYear);
        if (((indexToScroll >= 0) || (indexToScroll < allYears.length)) && timelineYearRef?.current?.scrollToIndex) {
            timelineYearRef?.current?.scrollToIndex({ animated: false, index: indexToScroll, viewPosition: 0.3 })
        }
    }, [currentItemYear])


    useEffect(() => {
        memoryTimelineUpdateListener = EventManager.addListener("memoryUpdateTimelineListener", () => {
            // let obj = {type: ListType.Timeline, isRefresh : true, filters : props.filters, loadPrevious : true, lastMemoryDate : props.timelineList[0].updated, filters : props.filters}     
            // props.fetchMemoryList(obj);
            props.fetchMemoryList({ type: ListType.Timeline, isLoading: true, filters: props.filters });
            loaderHandler.hideLoader();
        });
        props.fetchMemoryList({ type: ListType.Timeline, isLoading: true, filters: props.filters });

    }, [])

    const onRefresh = () => {
        props.fetchMemoryList({ type: ListType.Timeline, isLoading: true, filters: props.filters });
        // let obj = {type: ListType.Timeline, isRefresh : true, filters : props.filters, loadPrevious : true, lastMemoryDate : props.timelineList[0].updated, filters : props.filters}     
        // props.fetchMemoryList(obj);
    }

    const handleLoadMore = () => {
        if (!props.isLoadMore) {
            let memoryDetails = props.timelineList[props.timelineList.length - 1]
            props.fetchMemoryList({ type: ListType.Timeline, isLoadMore: true, jumpTo: true, lastMemoryDate: memoryDetails.memoryDate, filters: props.filters });
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
            // console.log("_onOpenAudios :: ", JSON.stringify(item.audios[0].fid), fid)
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
        setCurrentItemYear(selectedYear);
        let next = '', prev = '', currentIndex = memoryYears.indexOf(selectedYear);
        prev = memoryYears[currentIndex] ? memoryYears[currentIndex + 1] : null//memoryYears[0]
        next = currentIndex > 0 ? memoryYears[currentIndex - 1] : null

        let allYearsArray = [...allYears];
        let indexToScroll = allYearsArray.findIndex(x => x.year == selectedYear);

        if ((indexToScroll >= 0) && timelineYearRef?.current?.scrollToIndex) {
            timelineYearRef?.current?.scrollToIndex({ animated: false, index: indexToScroll, viewPosition: 0.3 })
        }
        setPreviousItemYear(prev);
        setNextItemYear(next);

        props.fetchMemoryList({ type: ListType.Timeline, isLoading: true, jumpTo: true, selectedYear, selectedMonth });
    }

    const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
        if (viewableItems && viewableItems.length) {
            setCurrentItemYear(viewableItems[0]?.item?.memoryYear);
        }

    }, []);

    return (
        <View style={styles.fullFlex}>
            <SafeAreaView style={styles.container}>
                <View style={styles.subcontainer}>
                    {/* <Modal
                        animationType="slide"
                        transparent={true}
                        style={{ backgroundColor: Colors.blacknew, flex: 1 }}
                        // visible={state.jumpToVisibility}
                        visible={props.isJumptoShow ? props.isJumptoShow : false}
                    >
                        <View style={{ flex: 1, backgroundColor: Colors.blacknewrgb }}>

                            <View style={{ height: 68, backgroundColor: Colors.transparent }}>
                                <TouchableOpacity style={{ flex: 1, backgroundColor: Colors.transparent }} onPress={() => props.showJumpto(false)} >
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: Utility.getDeviceHeight() - 68, borderTopLeftRadius: 12, borderTopRightRadius: 12, shadowOpacity: 1, elevation: 3, shadowColor: '(46, 49, 62, 0.05)', shadowRadius: 2, shadowOffset: { width: 4, height: 2 } }}> */}
                    <ActionSheet closeOnTouchBackdrop={false} closeOnPressBack={false} ref={actionSheetRef} >
                        <JumpToScreen jumpToClick={(selectedYear: any, selectedMonth: any) => jumpToClicked(selectedYear, selectedMonth)}
                            jumpToYears={props.jumpToYears} memoryDate={state.jumpToDate}
                            closeAction={() => props.showJumpto(false)}
                        />
                        <LinearGradient
                            // start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            // locations={[0, 0.6]}
                            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 1)']}
                            style={styles.linearGardStyle}>
                        </LinearGradient>
                        <LinearGradient
                            // start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            // locations={[0, 0.6]}
                            colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)']}
                            style={styles.linearGardBottomStyle}>
                        </LinearGradient>
                    </ActionSheet>
                    {/* </View>

                        </View>

                    </Modal> */}
                    {/* {filterView(props.filterClick(ListType.Timeline), ListType.Timeline)} */}

                    {/* <View style={[styles.fromDateContainerStyle, { height: props.toDate && props.fromDate ? 56 : !scrolling ? 16 : 0 }]}> */}
                    <View style={[styles.fromDateContainerStyle, { height: allYears.length && scrolling ? 56 : !scrolling ? 16 : 0 }]}>
                        <View style={styles.filterDateCOntainer}>
                            {
                                allYears.length && scrolling && currentItemYear ?
                                    // props.toDate && props.fromDate ?
                                    <>
                                        {
                                            currentItemYear == allYears[allYears.length - 1].year ?
                                                <View style={styles.leftFilterImageContainerStyle} /> :
                                                <TouchableHighlight
                                                    onPress={() => {
                                                        let allYearsArray = [...allYears];
                                                        let indexToScroll = allYearsArray.findIndex(x => x.year == currentItemYear);
                                                        indexToScroll = indexToScroll + 1;
                                                        if ((indexToScroll >= 0) && timelineYearRef?.current?.scrollToIndex) {
                                                            timelineYearRef?.current?.scrollToIndex({ animated: false, index: indexToScroll, viewPosition: 0.3 })
                                                            jumpToClicked(allYearsArray[indexToScroll].year, "");
                                                            setCurrentItemYear(allYearsArray[indexToScroll].year)
                                                        }
                                                        setScrolling(false);
                                                        // jumpToClicked(allYearsArray[indexToScroll].year, "");
                                                        // setCurrentItemYear(allYearsArray[indexToScroll].year)
                                                        // jumpToClicked(previousItemYear ? JSON.stringify(previousItemYear) : allYears.length ? allYears[allYears.length - 1].year : '', "");

                                                        if (flatListRef.current) {
                                                            flatListRef.current.scrollToOffset({ animated: true, offset: 8 });
                                                        }
                                                        // setPreviousItemYear(null)
                                                        // setNextItemYear(null)
                                                        setTimelineBarNextPrevClick(true);
                                                    }}
                                                    underlayColor={Colors.transparent}
                                                    style={styles.leftFilterImageContainerStyle}>
                                                    <Image source={chevronleftfilter} />
                                                </TouchableHighlight>
                                        }


                                        <View style={styles.timelineDateContainer}>
                                            <View style={styles.leftArrowImageContainer} >
                                                <Image style={styles.imageStyle} source={leftgradient} />
                                            </View>

                                            <FlatList
                                                data={allYears}
                                                style={styles.timelineFlatlistStyle}
                                                inverted={true}
                                                horizontal={true}
                                                snapToAlignment='center'
                                                ref={timelineYearRef}
                                                getItemLayout={(data, index) => { return { length: 136, index, offset: 136 * index } }}
                                                initialNumToRender={allYears.length}
                                                keyExtractor={(_, index: number) => `${index}`}
                                                // contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                                                showsHorizontalScrollIndicator={false}
                                                // ItemSeparatorComponent={() => <View style={styles.timelineYearSeparatorline} />}
                                                renderItem={({ item, index }) => (
                                                    <View style={styles.timelineContainer}>
                                                        <Text
                                                            onPress={() => {
                                                                // jumpToClicked(item.year, "");
                                                                loaderHandler.showLoader("Loading...")
                                                                let currentYear = item.year
                                                                let next = '', prev = '', currentIndex = allYears.indexOf(currentYear => currentYear.year == item.year);
                                                                prev = allYears[currentIndex] ? allYears[currentIndex + 1] : null;
                                                                next = currentIndex > 0 ? allYears[currentIndex - 1] : null;
                                                                setCurrentItemYear(currentYear);
                                                                setPreviousItemYear(prev);
                                                                setNextItemYear(next);
                                                                let month = ""
                                                                if (flatListRef.current) {
                                                                    flatListRef.current.scrollToOffset({ animated: true, offset: 8 });
                                                                }
                                                                props.fetchMemoryList({ type: ListType.Timeline, isLoading: true, jumpTo: true, selectedYear: currentYear, selectedMonth: month });
                                                            }}
                                                            style={item.year == currentItemYear ? styles.currentYearText : styles.newnormalText}>{item.year}</Text>
                                                        {
                                                            <View style={[styles.timelineYearSeparatorline, { backgroundColor: index == 0 ? Colors.timeLinebackground : Colors.newTextColor, height: index == 0 ? 0 : 1 }]} />
                                                            // : <View style={styles.timelineYearSeparatorline} />
                                                        }

                                                    </View>
                                                )}
                                                indicatorStyle='white'
                                            />

                                            {/* <Text style={styles.newnormalText} numberOfLines={1} ellipsizeMode='tail'>{previousItemYear ? JSON.stringify(previousItemYear) : allYears.length ? allYears[allYears.length - 1].year : ''}</Text>
                                            {<View style={styles.timelineDateSeparator}></View>}
                                            <Text style={styles.currentYearText}>{JSON.stringify(currentItemYear)}</Text>
                                            <View style={{ height: 1, backgroundColor: nextItemYear ? Colors.newTextColor : Colors.transparent, width: nextItemYear ? 46 : 64, marginLeft: nextItemYear ? 17 : 0, marginRight: nextItemYear ? 17 : 0 }}></View>
                                            {
                                                nextItemYear ?
                                                    <Text onPress={() => {
                                                        setScrolling(false);
                                                        jumpToClicked(nextItemYear ? JSON.stringify(nextItemYear) : '', "");
                                                        if (flatListRef.current) {
                                                            flatListRef.current.scrollToOffset({ animated: true, offset: 8 });
                                                        }
                                                    }}
                                                        style={[styles.newnormalText]}>
                                                        {JSON.stringify(nextItemYear)}
                                                    </Text>
                                                    :
                                                    <View style={styles.viewSeparator} />
                                            } */}
                                            <View
                                                style={styles.rightArrowContainer} >
                                                <Image style={styles.imageRightStyle} source={leftgradient} />
                                            </View>
                                        </View>

                                        {
                                            allYears.length && scrolling && ((currentItemYear != allYears[0].year) && (allYears.findIndex(x => x.year == currentItemYear) >= 0)) ?
                                                <TouchableHighlight
                                                    // disabled={!nextItemYear}
                                                    onPress={() => {
                                                        setScrolling(false);
                                                        let allYearsArray = [...allYears];
                                                        let indexToScroll = allYearsArray.findIndex(x => x.year == currentItemYear);
                                                        indexToScroll = indexToScroll - 1;
                                                        if (((indexToScroll >= 0) || (indexToScroll < allYears.length)) && timelineYearRef?.current?.scrollToIndex) {
                                                            timelineYearRef?.current?.scrollToIndex({ animated: false, index: indexToScroll, viewPosition: 0.3 })
                                                            jumpToClicked(allYearsArray[indexToScroll].year, "");
                                                            setCurrentItemYear(allYearsArray[indexToScroll].year)
                                                        }

                                                        // jumpToClicked(nextItemYear ? JSON.stringify(nextItemYear) : '', "");
                                                        if (flatListRef.current) {
                                                            flatListRef.current.scrollToOffset({ animated: true, offset: 8 });
                                                        }
                                                        setTimelineBarNextPrevClick(true);
                                                    }}
                                                    underlayColor={Colors.transparent}
                                                    style={styles.rightFilterImageContainerStyle}>
                                                    <Image style={{ transform: [{ rotate: '180deg' }] }} source={chevronleftfilter} />
                                                </TouchableHighlight>
                                                :
                                                <View style={styles.noTimelineNextYearView} />
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
                        nestedScrollEnabled={true}
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

                                // if (timelineYearRef.current) {
                                //     let index = allYears.findIndex(i => i.year === currentItemYear);
                                //     if (index !== -1) {
                                //         timelineYearRef.current.scrollToIndex({ animated: false, index: index });
                                //     }
                                // }

                                let allYearsArray = [...allYears];
                                let indexToScroll = allYearsArray.findIndex(x => x.year == currentItemYear);
                                if (((indexToScroll >= 0) || (indexToScroll < allYears.length)) && timelineYearRef?.current?.scrollToIndex) {
                                    timelineYearRef?.current?.scrollToIndex({ animated: false, index: indexToScroll, viewPosition: 0.3 })
                                    // setCurrentItemYear(allYearsArray[indexToScroll].year);
                                }

                                // let next = '', prev = '', currentIndex = memoryYears.indexOf(currentItemYear);
                                // prev = memoryYears[currentIndex] ? memoryYears[currentIndex + 1] : memoryYears[0]
                                // next = currentIndex > 0 ? memoryYears[currentIndex - 1] : null
                                // // console.log("aaa :", currentIndex, " ", JSON.stringify(memoryYears), currentItemYear, prev, next)

                                // setPreviousItemYear(prev);
                                // setNextItemYear(next);

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
