import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import AudioPlayer, {
  kClosed,
  kEnded,
  kNext,
  kPaused,
  kPlaying,
  kPrevious,
} from '../../../common/component/audio_player/audio_player';
import MemoryActionsSheet, {
  MemoryActionsSheetItem,
} from './../../../../app/components/memoryActionsSheet';
// import MemoryActionsSheet, { MemoryActionsSheetItem } from '../../../common/component/memoryActionsSheet';
import DeviceInfo from 'react-native-device-info';
import MemoryListItem from '../../../../app/components/memoryListItem';
import {
  No_Internet_Warning,
  ToastMessage,
} from '../../../common/component/Toast';
import {
  Colors,
  ConsoleType,
  decode_utf8,
  showConsoleLog,
} from '../../../common/constants';
import Utility from '../../../common/utility';
import { Like, Unlike } from '../../memoryDetails/detailsWebService';
import { kLiked, kUnliked } from '../../myMemories/myMemoriesWebService';
import {
  MemoryActionsList,
  onActionItemClicked,
  _onShowMemoryDetails,
} from '../../myMemories/PublishedMemory';
import { GET_MEMORY_LIST, ListType, REMOVE_PROMPT } from '../dashboardReducer';
// import MemoryListItem from '../../../common/component/memoryListItem';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import EventManager from '../../../common/eventManager';
import {
  CreateUpdateMemory,
  promptIdListener,
} from '../../createMemory/createMemoryWebService';
import { DefaultDetailsMemory } from '../../createMemory/dataHelper';

import styles from './styles';
type State = { [x: string]: any };
type Props = { [x: string]: any };

var MemoryActions: Array<MemoryActionsSheetItem> = [];

const Recent = (props: Props) => {
  let _actionSheet = useRef(null);
  const audioPlayer = useRef(null);
  const flatListRef = useRef(null);

  // let memoryFromPrompt: EventManager;

  const [state, setState] = useState({
    showNoInternetView: false,
    audioFile: {
      index: -1,
      isPlaying: false,
      file: {},
      memoryTitle: '',
      by: '',
      fid: 0,
      nid: 0,
    },
    showMemoryActions: false,
    animateValue: null,
    animateType: null,
  });

  const [scrolling, setScrolling] = useState(false);

  let selectedPrompt: any = {};
  let memoryUpdateListener: EventManager;

  useEffect(() => {
    memoryUpdateListener = EventManager.addListener(
      'memoryUpdateRecentListener',
      () => {
        props.fetchMemoryList({ type: ListType.Recent, isLoading: true });
      },
    );
    props.fetchMemoryList({ type: ListType.Recent, isLoading: true });

    return () => {
      memoryUpdateListener.removeListener();
      // memoryFromPrompt.removeListener();
    };
  }, []);

  const onRefresh = () => {
    props.fetchMemoryList({ type: ListType.Recent, isLoading: true });
    // this.props.fetchMemoryList({type: ListType.Recent, isRefresh : true, filters : this.props.filters});
  };

  const handleLoadMore = () => {

    let promptlength = props.recentList.filter(item => item.isPrompt).length;
    if (props.recentList.length > 0 && (props.recentList.length - promptlength) < props.totalCount) {

      if (!props.isLoadMore) {
        let memoryDetails;
        if (props.recentList[props.recentList.length - 1].active_prompts) {
          memoryDetails = props.recentList[props.recentList.length - 2]; //prompts
        } else {
          memoryDetails = props.recentList[props.recentList.length - 1];
        }
        // if(props.totalCount > 5)
        props.fetchMemoryList({
          type: ListType.Recent,
          isLoadMore: true,
          lastMemoryDate: memoryDetails.updated,
          filters: props.filters,
        });
      }
    }
  };

  const openMemoryActions = (item: any) => {
    showActionsSheet(item);
  };

  const showActionsSheet = (item: any) => {
    /**Menu options for actions*/
    MemoryActions = MemoryActionsList(item);
    // let cancelButtonIndex = MemoryActions.length
    // MemoryActions.push({index: cancelButtonIndex, text: "Cancel", image: cancelActions, actionType: MemoryActionKeys.cancelActionKey })
    // _actionSheet && _actionSheet.current && _actionSheet.current.showSheet()
    // setState(prevState => ({
    //     ...prevState,
    //     showMemoryActions: true
    // }));
  };

  const audioView = (item: any) => {
    if (item.audios.length > 0) {
      // showConsoleLog(ConsoleType.LOG,"AudioSV :",JSON.stringify(item.audios))
      return (
        <View style={styles.audioContainer}>
          <View style={[styles.boxShadow]}>
            {item.audios[0].url && item.audios[0].url != '' && (
              <View
                style={styles.audioSubContainer}
                onStartShouldSetResponder={() => true}
                onResponderStart={() => togglePlayPause(item)}>
                <View style={styles.playPauseContainer}>
                  {state.audioFile.fid == item.audios[0].fid &&
                    state.audioFile.isPlaying ? (
                    <View style={styles.pauseContainer}>
                      <View style={styles.column} />
                      <View style={styles.columnTransparent} />
                      <View style={styles.column} />
                    </View>
                  ) : (
                    <View style={styles.playbutton} />
                  )}
                </View>
                <View style={styles.marginLeft10}>
                  <Text
                    style={[styles.normalText, styles.filenamecontainer]}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.audios[0].title
                      ? item.audios[0].title
                      : item.audios[0].filename
                        ? item.audios[0].filename
                        : ''}
                  </Text>
                  <Text style={[styles.normalText]}>
                    {item.audios[0].duration}
                  </Text>
                </View>
              </View>
            )}
          </View>
          {item.audios.length > 1 ? (
            <TouchableOpacity
              onPress={() => {
                _onShowMemoryDetails(item, props.navigation);
              }}
              style={styles.buttonContainer}>
              <Text style={styles.moreTextStyle}>
                {'+'}
                {item.audios.length - 1 + ' more'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    }
  };

  const togglePlayPause = (item: any) => {
    if (item.audios[0].fid == state.audioFile.index) {
      audioPlayer.current.tooglePlayPause();
    } else {
      _onOpenAudios(item);
    }
  };

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!props.loadmore) return null;
    return (
      <View style={styles.activityContainer}>
        <ActivityIndicator color={Colors.newTextColor} />
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
        index: 0,
        isPlaying: playing,
        file: [item.audios[0]],
        memoryTitle: item.title,
        by: item.name,
        fid: item.audios[0].fid,
        nid: item.nid,
      };
      setState(prevState => ({
        ...prevState,
        audioFile: audioFile,
      }));

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
  };

  const _onCloseAudios = (event: Event) => {
    try {
      audioPlayer.current.hidePlayer();
    } catch (error) { }
  };

  const like = (item: any) => {
    setState(prevState => ({
      ...prevState,
      animateValue: item.index,
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
    } else {
      No_Internet_Warning();
    }
  };

  const playerCallback = (event: any) => {
    showConsoleLog(ConsoleType.LOG, 'playerCallback :', event);
    let audioFile = state.audioFile;
    switch (event) {
      case kEnded:
        audioFile.isPlaying = false;
        break;
      case kClosed:
        audioFile.isPlaying = false;
        audioFile.index = -1;
        audioFile.fid = -1;
        break;
      case kPlaying:
        audioFile.isPlaying = true;
        break;
      case kPaused:
        audioFile.isPlaying = false;
        break;
      case kNext:
        audioFile.isPlaying = true;
        audioFile.index = audioFile.index + 1;
        break;
      case kPrevious:
        audioFile.isPlaying = true;
        audioFile.index = audioFile.index - 1;
        break;
    }
    setState(prevState => ({
      ...prevState,
      audioFile: audioFile,
    }));
  };

  const _onAddProptToMemoryAction = async (firstIndex: any, secondIndex: any) => {
    if (Utility.isInternetConnected) {
      let data = props.recentList[firstIndex].active_prompts[secondIndex];
      selectedPrompt.firstIndex = firstIndex;
      selectedPrompt.secondIndex = secondIndex;
      loaderHandler.showLoader('Creating Memory...');
      let draftDetails: any = await DefaultDetailsMemory(
        decode_utf8(data.prompt_title.trim()),
      );
      draftDetails.prompt_id = parseInt(data.prompt_id);
      // memoryFromPrompt = EventManager.addListener(
      //   promptIdListener,
      //   promptToMemoryCallBack,
      // );
      CreateUpdateMemory(draftDetails, [], promptIdListener, 'save',
        res => {
          if (res.status) {
            props.removePrompt(selectedPrompt);
            loaderHandler.hideLoader();
            props.navigation.navigate('createMemory', {
              editMode: true,
              draftNid: res.id,
              isFromPrompt: true,
            });
          } else {
            loaderHandler.hideLoader();
            ToastMessage(draftDetails.ResponseMessage);
          }
        });
      Keyboard.dismiss();
    } else {
      No_Internet_Warning();
    }
  };

  const keyExtractor = useCallback((item: any) => item?.nid?.toString(), []);

  const renderList = useCallback((item: any) => (
    <>
      {item.index === 0 && <View style={styles.renderSeparator} />}
      <MemoryListItem
        item={item}
        animate={state.animateValue}
        previousItem={null}
        like={like}
        listType={ListType.Recent}
        audioView={audioView}
        openMemoryActions={openMemoryActions}
        MemoryActions={MemoryActions}
        addMemoryFromPrompt={(firstIndex: any, secondIndex: any) =>
          _onAddProptToMemoryAction(firstIndex, secondIndex)
        }
        navigation={props.navigation}
      />
    </>
  ), []);

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.subcontainer}>
          <FlatList
            data={props.recentList}
            style={styles.flatlistStyle}
            extraData={state}
            initialNumToRender={10}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={5}
            renderItem={renderList}
            indicatorStyle="white"
            refreshControl={
              <RefreshControl
                colors={[
                  Platform.OS === 'android'
                    ? Colors.newTextColor
                    : Colors.newTextColor,
                ]}
                tintColor={
                  Platform.OS === 'android'
                    ? Colors.newTextColor
                    : Colors.newTextColor
                }
                refreshing={props.refresh}
                onRefresh={onRefresh}
              />
            }
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={() => (
              <View style={styles.renderSeparator} />
            )}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.4}
            onEndReached={handleLoadMore}
          />
          {props.recentList.length == 0 && (
            <View style={styles.noItemContainer}>
              {props.loading ? (
                <ActivityIndicator
                  color={Colors.newTextColor}
                  size="large"
                  style={styles.activityContainerStyle}
                />
              ) : (
                <Text style={styles.noItemTextStyle}>
                  There are no memories or cues to display at this moment. Check
                  your filter settings and try again
                </Text>
              )}
            </View>
          )}
        </View>
        <AudioPlayer
          ref={audioPlayer}
          playerCallback={(event: any) => playerCallback(event)}
          files={state.audioFile.file}
          memoryTitle={state.audioFile.memoryTitle}
          by={'by ' + state.audioFile.by}
          bottom={10}></AudioPlayer>
      </SafeAreaView>

      <MemoryActionsSheet
        ref={_actionSheet}
        width={DeviceInfo.isTablet() ? '65%' : '100%'}
        actions={MemoryActions}
        memoryActions={true}
        onActionClick={onActionItemClicked}
      />

      {!props.loading &&
        !props.loadmore &&
        !props.refresh &&
        loaderHandler.hideLoader()}
    </View>
  );
};

const mapState = (state: any) => {
  return {
    recentList: state.dashboardReducer.recentList,
    loading: state.dashboardReducer.loadingRecent,
    loadmore: state.dashboardReducer.loadMoreRecent,
    refresh: state.dashboardReducer.refreshRecent,
    totalCount: state.dashboardReducer.recentCount,
    filters: state.dashboardReducer.filterDataRecent,
    active_prompts: state.dashboardReducer.active_prompts,
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    fetchMemoryList: (payload: any) =>
      dispatch({ type: GET_MEMORY_LIST, payload: payload }),
    removePrompt: (payload: any) =>
      dispatch({ type: REMOVE_PROMPT, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(Recent);
