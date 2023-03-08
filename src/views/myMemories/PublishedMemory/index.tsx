import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  Keyboard,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import analytics from '@react-native-firebase/analytics';
import Text from '../../../common/component/Text';
import {
  Colors,
  encode_utf8,
  fontFamily,
  fontSize,
  MemoryActionKeys,
} from '../../../common/constants';
import { GetAllLikes, Like, Unlike } from '../../memoryDetails/detailsWebService';
import {
  GetPublishedMemories,
  kAllLikes,
  kLiked,
  kMemoryActionPerformedPublished,
  kPublishedMemoriesFetched,
  kUnliked,
  MemoryAction,
} from '../myMemoriesWebService';

import {
  block,
  flag,
  flagandroid,
  personxmark,
  redstar,
  report,
} from '../../../../app/images';
import AudioPlayer, {
  kClosed,
  kEnded,
  kNext,
  kPaused,
  kPlaying,
  kPrevious,
} from '../../../common/component/audio_player/audio_player';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import MemoryActionsSheet, {
  MemoryActionsSheetItem,
} from '../../../common/component/memoryActionsSheet';
import MemoryListItem from '../../../common/component/memoryListItem';
import PlaceholderImageView from '../../../common/component/placeHolderImageView';
import {
  No_Internet_Warning,
  ToastMessage,
} from '../../../common/component/Toast';
import EventManager from '../../../common/eventManager';
import Utility from '../../../common/utility';
import {
  add_icon_small,
  block_memory,
  cancelActions,
  delete_memory,
  edit_memory,
  greenDotsButton,
  icon_comment,
  icon_like,
  icon_like_selected,
  icon_send,
  move_to_draft,
  remove_me_from_this_post,
} from '../../../images';
import { ListType } from '../../dashboard/dashboardReducer';
import {
  Border,
  LikeCommentShare,
} from '../../memoryDetails/componentsMemoryDetails';
import { PublishedMemoryDataModel } from './publishedMemoryDataModel';
var MemoryActions: Array<MemoryActionsSheetItem> = [
  // { index: 0, text: "Image", image: action_camera }
];
type State = { [x: string]: any };
type Props = { [x: string]: any };
var publishedMemoriesArray: any[] = [];
var page: 0;
var loadingDataFromServer = true;

export const kPublishedMemoryUpdated = 'publishedMemoryUpdated';
export default class PublishedMemory extends React.Component<Props, State> {
  _actionSheet: any | MemoryActionsSheet = null;
  publishedMemoryListener: EventManager;
  publishedMemoryDataModel: PublishedMemoryDataModel;
  likeListener: EventManager;
  unlikeListener: EventManager;
  publishedMemoryUpdatedLister: EventManager;
  audioPlayer: React.RefObject<AudioPlayer> = React.createRef<AudioPlayer>();
  getAllLikesListener: EventManager;
  memoryActionsListener: EventManager;
  state: State = {
    loadMemories: false,
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
    isRefreshing: false,
    showMemoryActions: false,
    isMemoryUpdate: false,
  };
  memoryPublishedUpdateListener: EventManager;
  static shakeAnimation: any = new Animated.Value(0);

  constructor(props: Props) {
    super(props);
    this.publishedMemoryDataModel = new PublishedMemoryDataModel();
    this.publishedMemoryListener = EventManager.addListener(
      kPublishedMemoriesFetched,
      this.publishedMemoriesDetails,
    );
    this.publishedMemoryUpdatedLister = EventManager.addListener(
      kPublishedMemoryUpdated,
      this.publishedMemoryUpdated,
    );
    this.getAllLikesListener = EventManager.addListener(
      kAllLikes,
      this.allLikesFetched,
    );
    this.memoryActionsListener = EventManager.addListener(
      kMemoryActionPerformedPublished,
      this.memoryActionCallBack,
    );
  }

  componentDidMount() {
    if (Utility.isInternetConnected) {
      // //loaderHandler.showLoader();
      // GetMemoryDrafts("all","all", memoryDraftsArray.length)
      publishedMemoriesArray = [];
      // this.setState({});
      GetPublishedMemories('');
      loadingDataFromServer = true;
    } else {
      No_Internet_Warning();
    }
    this.memoryPublishedUpdateListener = EventManager.addListener(
      'memoryUpdatePublishedListener',
      () => {
        this.setState(
          {
            isMemoryUpdate: true,
          },
          () => {
            GetPublishedMemories('');
            //loaderHandler.hideLoader();
          },
        );
      },
    );
  }

  publishedMemoryUpdated = (
    nid: any,
    likeCount: any,
    commentCount: any,
    likeFlag: any,
  ) => {
    //showConsoleLog(ConsoleType.LOG,likeCount + "  " + commentCount);
    publishedMemoriesArray.forEach((element: any, index: any) => {
      if (element.nid == nid) {
        element.noOfLikes = likeCount;
        element.noOfComments = commentCount;
        element.isLikedByUser = likeFlag;
      }
    });
    // this.setState({});
  };
  onRefresh = () => {
    this.setState(
      {
        isRefreshing: true,
      },
      () => {
        GetPublishedMemories('');
      },
    );
  };
  handleLoadMore = () => {
    // let draftCount = this.memoryDraftsDataModel.getMemoryDraftsCount();
    let draftCount = this.publishedMemoryDataModel.getMemoriesCount();
    if (
      publishedMemoriesArray.length > 0 &&
      publishedMemoriesArray.length < draftCount
    ) {
      if (!this.state.loading) {
        // increase page by 1
        this.setState(
          {
            loading: true,
          },
          () => {
            loadingDataFromServer = true;
            let memoryDetails =
              publishedMemoriesArray[publishedMemoriesArray.length - 1];
            GetPublishedMemories(memoryDetails.updated);
          },
        );
      }
    }
  };
  publishedMemoriesDetails = (fetched: boolean, publishedMemories: any) => {
    loadingDataFromServer = false;
    if (fetched) {
      if (this.state.isRefreshing || this.state.isMemoryUpdate) {
        publishedMemoriesArray = [];
      }
      if (publishedMemoriesArray.length == 0) {
        this.publishedMemoryDataModel.setPublishedMemoriesDetails(
          publishedMemories,
          true,
        );
      } else {
        this.publishedMemoryDataModel.setPublishedMemoriesDetails(
          publishedMemories,
          false,
        );
      }
      // if (page == 0){
      //     this.publishedMemoryDataModel.updateMemoryDraftDetails(publishedMemories, true);
      // }else{
      //     this.publishedMemoryDataModel.updateMemoryDraftDetails(publishedMemories, false);
      // }
      // memoryDraftsArray = this.memoryDraftsDataModel.getMemoryDrafts()
      // this.setState({memoryDetailAvailable: true});
      publishedMemoriesArray =
        this.publishedMemoryDataModel.getPublishedMemories();
    } else {
      // if(page != 0){
      //     page--;
      // }
      if (publishedMemoriesArray.length == 0) {
        //ToastMessage(publishedMemories, Colors.ErrorColor);
      }
    }
    this.setState(
      {
        isRefreshing: false,
        loading: false,
      },
      () => {
        // //loaderHandler.hideLoader(),
      }
    );
  };

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
      // this.setState({});
    } else {
      No_Internet_Warning();
    }
  };

  openMemoryActions = (item: any) => {
    this.showActionsSheet(item);
  };
  getAllLikes = (memoryDetails: any) => {
    if (memoryDetails.noOfLikes > 0) {
      GetAllLikes(memoryDetails.nid, memoryDetails.type, kAllLikes);
      //loaderHandler.showLoader('Loading...');
    }
  };
  allLikesFetched = (fetched?: boolean, getAllLikes?: any) => {
    //loaderHandler.hideLoader();
    if (fetched) {
      this.showList(getAllLikes);
      // this.setState({});
    } else {
      //ToastMessage(getAllLikes, Colors.ErrorColor);
    }
  };
  likeCallback = (fetched: boolean, responseMessage: any, nid?: any) => {
    if (!fetched) {
      // this.memoryDataModel.likesComments.noOfLikes = this.memoryDataModel.likesComments.noOfLikes - 1;
      // this.memoryDataModel.likesComments.isLikedByUser = 0;
      ////ToastMessage(responseMessage, Colors.ErrorColor)
    } else {
      // this.forwardDataToNative();
    }
  };
  unlikeCallback = (fetched: boolean, responseMessage: any, nid?: any) => {
    if (!fetched) {
      // this.memoryDataModel.likesComments.noOfLikes = this.memoryDataModel.likesComments.noOfLikes + 1;
      // this.memoryDataModel.likesComments.isLikedByUser = 1;
      ////ToastMessage(responseMessage, Colors.ErrorColor)
    } else {
      // this.forwardDataToNative();
    }
  };

  memoryActionCallBack = (
    fetched: boolean,
    responseMessage: any,
    nid?: any,
    type?: any,
    uid?: any,
  ) => {
    //loaderHandler.hideLoader();
    if (fetched) {
      if (type == MemoryActionKeys.removeMeFromThisPostKey) {
        publishedMemoriesArray.forEach((element: any, index: any) => {
          if (element.nid == nid) {
            delete publishedMemoriesArray[index].actions_on_memory
              .remove_me_from_this_post;
          }
        });
      } else if (
        type == MemoryActionKeys.blockAndReportKey ||
        type == MemoryActionKeys.blockUserKey
      ) {
        publishedMemoriesArray = publishedMemoriesArray.filter(
          (element: any) => element.user_details.uid != uid,
        );
      } else if (type == MemoryActionKeys.addToCollection) {
      } else {
        publishedMemoriesArray = publishedMemoriesArray.filter(
          (element: any) => element.nid != nid,
        );
      }
      this.publishedMemoryDataModel.updatePublishedMemories(
        publishedMemoriesArray,
      );
      // this.setState({});
    } else {
      //ToastMessage(responseMessage, Colors.ErrorColor);
    }
  };

  showList = (getAllLikes?: any) => {
    let itemList: any = [];
    let heading: any = '';
    if (Utility.isInternetConnected) {
      //this.props.navigation.jumpTo("memoryDetails", {"nid": event.nid, "type": event.type, "comment": event.comment ? true : false})
      itemList = getAllLikes;
      if (itemList.length > 1) {
        heading = 'Liked by ' + itemList.length + ' people';
      } else {
        heading = 'Liked by ' + itemList.length + ' person';
      }
      this.props.navigation.navigate('customListMemoryDetails', {
        heading: heading,
        itemList: itemList,
      });
    } else {
      No_Internet_Warning();
    }
  };
  hideMenu = () => {
    this.setState({
      draftOptionsVisible: false,
    });
  };

  renderItem = (item: any) => (
    <MemoryListItem
      item={item}
      like={this.like}
      listType={ListType.Published}
      audioView={this.audioView}
      openMemoryActions={this.openMemoryActions.bind(this)}
      navigation={this.props.navigation}
    />
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}>
          <View style={{ height: '100%', width: '100%' }}>
            <FlatList
              data={publishedMemoriesArray}
              style={{ width: '100%', backgroundColor: Colors.NewThemeColor }}
              extraData={this.state}
              initialNumToRender={10}
              removeClippedSubviews={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              keyExtractor={(_, index: number) => `${index}`}
              onScroll={() => {
                Keyboard.dismiss();
              }}
              renderItem={this.renderItem}
              maxToRenderPerBatch={5}
              removeClippedSubviews={true}
              refreshControl={
                <RefreshControl
                  colors={[
                    Platform.OS === 'android' ? Colors.NewThemeColor : '#fff',
                  ]}
                  tintColor={
                    Platform.OS === 'android' ? Colors.NewThemeColor : '#fff'
                  }
                  refreshing={this.state.isRefreshing}
                  onRefresh={() => this.onRefresh()}
                />
              }
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={() => this.renderFooter()}
              onEndReachedThreshold={0.4}
              onEndReached={() => this.handleLoadMore()}
            />
            {publishedMemoriesArray.length == 0 && (
              <View
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  alignContent: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  padding: 16,
                }}>
                {loadingDataFromServer ? (
                  <ActivityIndicator
                    color={Colors.ThemeColor}
                    size="large"
                    style={{ flex: 1, justifyContent: 'center' }}
                  />
                ) : (
                  <Text
                    style={{
                      ...fontSize(18),
                      color: '#909090',
                      textAlign: 'center',
                    }}>
                    There are no memories available to display at this moment
                  </Text>
                )}
              </View>
            )}
          </View>
          <AudioPlayer
            ref={this.audioPlayer}
            playerCallback={(event: any) => this.playerCallback(event)}
            files={this.state.audioFile.file}
            memoryTitle={this.state.audioFile.memoryTitle}
            by={'by ' + this.state.audioFile.by}
            bottom={10}></AudioPlayer>
        </SafeAreaView>
        <MemoryActionsSheet
          ref={ref => (this._actionSheet = ref)}
          width={DeviceInfo.isTablet() ? '65%' : '100%'}
          actions={MemoryActions}
          memoryActions={true}
          onActionClick={(index, data?)=>onActionItemClicked(index, data, this.props.navigation)}
        />
      </View>
    );
  }

  // renderFooter = () => {
  //     //it will show indicator at the bottom of the list when data is loading otherwise it returns null
  //     if (!this.props.loadmore) return null;
  //     return (
  //         <View style={{ width: "100%", height: 40, marginTop: 20 }}>
  //             <ActivityIndicator
  //                 color={"white"}
  //             />
  //         </View>
  //     );
  // };
  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!this.state.loading) return null;
    return (
      <View style={{ width: '100%', height: 50 }}>
        <ActivityIndicator style={{ color: '#000' }} />
      </View>
    );
  };
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  showActionsSheet = (item: any) => {
    /**Menu options for actions*/
    MemoryActions = [];
    MemoryActions = MemoryActionsList(item);
    let cancelButtonIndex = MemoryActions.length;
    MemoryActions.push({
      index: cancelButtonIndex,
      text: 'Cancel',
      image: cancelActions,
      actionType: MemoryActionKeys.cancelActionKey,
    });
    this._actionSheet && this._actionSheet.showSheet();
    this.setState({ showMemoryActions: true });
  };

  audioView = (item: any) => {
    if (item.audios.length > 0) {
      return (
        <View
          style={{
            justifyContent: 'space-around',
            flexDirection: 'row',
            margin: 16,
            marginTop: 0,
          }}>
          <View
            style={[
              {
                flex: 1,
                elevation: 2,
                backgroundColor: Colors.AudioViewBg,
                borderColor: Colors.AudioViewBorderColor,
                borderWidth: 2,
                borderRadius: 10,
              },
              styles.boxShadow,
            ]}>
            {item.audios[0].url && item.audios[0].url != '' && (
              <View
                style={{
                  width: '100%',
                  paddingTop: 10,
                  paddingBottom: 10,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onStartShouldSetResponder={() => true}
                onResponderStart={() => this.togglePlayPause(item)}>
                <View
                  style={{
                    width: 55,
                    height: 55,
                    marginLeft: 15,
                    backgroundColor: '#fff',
                    borderRadius: 30,
                    borderWidth: 4,
                    borderColor: Colors.AudioViewBorderColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {this.state.audioFile.fid == item.audios[0].fid &&
                    this.state.audioFile.isPlaying ? (
                    <View
                      style={{
                        height: 20,
                        width: 16,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}>
                      <View
                        style={{
                          backgroundColor: Colors.AudioViewBorderColor,
                          flex: 1,
                          width: 5,
                        }}
                      />
                      <View
                        style={{
                          backgroundColor: 'transparent',
                          flex: 1,
                          width: 2,
                        }}
                      />
                      <View
                        style={{
                          backgroundColor: Colors.AudioViewBorderColor,
                          flex: 1,
                          width: 5,
                        }}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        height: 24,
                        width: 24,
                        marginLeft: 10,
                        borderLeftColor: Colors.AudioViewBorderColor,
                        borderLeftWidth: 18,
                        borderTopColor: 'transparent',
                        borderTopWidth: 12,
                        borderBottomColor: 'transparent',
                        borderBottomWidth: 12,
                      }}
                    />
                  )}
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text
                    style={[
                      styles.normalText,
                      { color: '#000', marginBottom: 5, paddingRight: 80 },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.audios[0].title
                      ? item.audios[0].title
                      : item.audios[0].filename
                        ? item.audios[0].filename
                        : ''}
                  </Text>
                  <Text style={[styles.normalText, { color: '#000' }]}>
                    {item.audios[0].duration}
                  </Text>
                </View>
              </View>
            )}
          </View>
          {item.audios.length > 1 ? (
            <View
              style={[
                {
                  width: 56,
                  marginLeft: 7,
                  elevation: 2,
                  backgroundColor: Colors.AudioViewBg,
                  borderColor: Colors.AudioViewBorderColor,
                  borderWidth: 2,
                  borderRadius: 10,
                },
                styles.boxShadow,
              ]}>
              <TouchableHighlight
                underlayColor={Colors.touchableunderlayColor}
                style={{ flex: 1, justifyContent: 'center' }}
                onPress={() => {
                  _onShowMemoryDetails(item, this.props.navigation);
                }}>
                <Text
                  style={{
                    color: Colors.TextColor,
                    ...fontSize(14),
                    textAlign: 'center',
                  }}>
                  {'+'}
                  {item.audios.length - 1}
                  {'\n more'}
                </Text>
              </TouchableHighlight>
            </View>
          ) : null}
        </View>
      );
    }
  };
  playerCallback = (event: any) => {
    let audioFile = this.state.audioFile;
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
    this.setState({ audioFile: audioFile });
  };

  togglePlayPause = (item: any) => {
    if (item.audios[0].fid == this.state.audioFile.index) {
      this.audioPlayer.current.tooglePlayPause();
    } else {
      this._onOpenAudios(item);
    }
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
        index: 0,
        isPlaying: playing,
        file: [item.audios[0]],
        memoryTitle: item.title,
        by: item.name,
        fid: item.audios[0].fid,
        nid: item.nid,
      };
      this.setState(
        {
          audioFile: audioFile,
        },
        () => {
          if (item.audios[0].fid == fid) {
            this.audioPlayer.current.tooglePlayPause();
          } else {
            this.audioPlayer.current.showPlayer(0);
            // this.callNativeModulesForPlayerUpdate(event.audio.fid, true, event.nid);
          }
        },
      );
    } else {
      No_Internet_Warning();
    }
  }
  _onCloseAudios(event: Event) {
    try {
      this.audioPlayer.current.hidePlayer();
    } catch (error) { }
  }
}

const _addToCollection = (nid: any, navigation: any) => {
  if (Utility.isInternetConnected) {
    navigation.navigate('memoryCollectionList', {
      isFromMemoryAction: true,
      nid: nid,
    });
  } else {
    No_Internet_Warning();
  }
};
const _onEditMemory = (nid: any, navigation: any) => {
  if (Utility.isInternetConnected) {
    //loaderHandler.showLoader();
    navigation.navigate('createMemory', {
      editMode: true,
      draftNid: nid,
      editPublsihedMemory: true,
    });
  } else {
    No_Internet_Warning();
  }
};

export const onActionItemClicked = async(index: number, data?: any, navigation?: any): void => {
  //showConsoleLog(ConsoleType.LOG,data);
  await analytics().logEvent(`${data.actionType}_action_on_memory`);
  switch (data.actionType) {
    case MemoryActionKeys.addToCollection:
      _addToCollection(data.nid,navigation);
      break;
    case MemoryActionKeys.editMemoryKey:
      _onEditMemory(data.nid, navigation);
      break;
    case MemoryActionKeys.cancelActionKey:
      break;
    default:
      if (Utility.isInternetConnected) {
        let alertData = Utility.getActionAlertTitle(data.actionType);
        setTimeout(() => {
          Alert.alert(alertData.title, alertData.message, [
            {
              text: 'No',
              style: 'cancel',
              onPress: () => { },
            },
            {
              text: 'Yes',
              style: 'default',
              onPress: () => {
                if (Utility.isInternetConnected) {
                  //loaderHandler.showLoader();
                  MemoryAction(
                    data.memoryType,
                    data.nid,
                    data.actionType,
                    data.uid,
                  );
                } else {
                  No_Internet_Warning();
                }
              },
            },
          ]);
        }, 250);
        break;
      } else {
        No_Internet_Warning();
      }
  }
};

export const MemoryActionsList = (item: any) => {
  var i = 0;
  let memoryActions = [];
  for (var value in item?.actions_on_memory) {
    i += 1;
    switch (value) {
      case MemoryActionKeys.addToCollection:
        memoryActions.push({
          index: i,
          text: item?.actions_on_memory[value],
          image: add_icon_small,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.addToCollection,
          uid: item.user_details.uid,
        });
        break;
      case MemoryActionKeys.blockUserKey:
        memoryActions.push({
          index: i,
          text: item?.actions_on_memory[value],
          image: Platform.OS == 'ios' ? personxmark : block,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.blockUserKey,
          uid: item.user_details.uid,
          isDestructive: 1,
        });
        break;
      case MemoryActionKeys.reportMemoryKey:
        memoryActions.push({
          index: i,
          text: item?.actions_on_memory[value],
          image: Platform.OS == 'ios' ? flagandroid : flag,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.reportMemoryKey,
          isDestructive: 1,
        });
        break;
      case MemoryActionKeys.blockAndReportKey:
        memoryActions.push({
          index: i,
          text: item?.actions_on_memory[value],
          image: Platform.OS == 'ios' ? redstar : report,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.blockAndReportKey,
          uid: item.user_details.uid,
          isDestructive: 1,
        });
        break;
      case MemoryActionKeys.editMemoryKey:
        memoryActions.push({
          index: i,
          text: item?.actions_on_memory[value],
          image: edit_memory,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.editMemoryKey,
        });
        break;
      case MemoryActionKeys.deleteMemoryKey:
        memoryActions.push({
          index: i,
          text: item?.actions_on_memory[value],
          image: delete_memory,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.deleteMemoryKey,
          destructive:true
        });
        break;
      case MemoryActionKeys.moveToDraftKey:
        memoryActions.push({
          index: i,
          text: item?.actions_on_memory[value],
          image: move_to_draft,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.moveToDraftKey,
        });
        break;
      case MemoryActionKeys.removeMeFromThisPostKey:
        memoryActions.push({
          index: i,
          text: item?.actions_on_memory[value],
          image: remove_me_from_this_post,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.removeMeFromThisPostKey,
        });
        break;
      case MemoryActionKeys.blockMemoryKey:
        memoryActions.push({
          index: i,
          text: item?.actions_on_memory[value],
          image: block_memory,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.blockMemoryKey,
        });
        break;
    }
  }

  let temp = [...memoryActions];
  let tempmemoryActions: any = [];

  let hideObj = temp.filter(item => item.text.toLowerCase() == 'hide')
  let deleteObj = temp.filter(item => item.text.toLowerCase() == 'delete')
  temp = temp.filter(item => item.text.toLowerCase() != 'hide')
  temp = temp.filter(item => item.text.toLowerCase() != 'delete')
  if (hideObj.length) {
    tempmemoryActions = [...hideObj, ...temp,...deleteObj]
  }
  else {
    tempmemoryActions = [...temp]
    if (deleteObj.length) {
      tempmemoryActions = [...tempmemoryActions,...deleteObj]
    }
  }
  
  return tempmemoryActions;
};

export const renderSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#CED0CE',
      }}
    />
  );
};

export const CommentBox = (item: any) => {
  return (
    <TouchableHighlight
      underlayColor={'#ffffff00'}
      style={{
        minHeight: 60,
        maxHeight: 300,
        width: '100%',
        flexDirection: 'row',
        paddingRight: 15,
        paddingLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 5,
      }}
      onPress={() =>
        this.props.navigation.navigate('memoryDetails', {
          nid: item.item.nid,
          type: item.item.type,
          comment: true,
        })
      }>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 5,
        }}>
        <Text
          style={{
            ...fontSize(18),
            color: Colors.dullText,
            flex: 1,
            borderWidth: 1,
            maxHeight: 100,
            borderColor: 'rgba(55, 56, 82, 0.2)',
            marginTop: 0,
            marginLeft: 10,
            margin: 10,
            borderRadius: 5,
            padding: 10,
            alignItems: 'center',
            backgroundColor: 'rgba(55, 56, 82, 0.1)',
          }}>
          Write a comment..
        </Text>

        <TouchableOpacity
          style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Image source={icon_send} />
          <Text
            style={{
              fontSize: 12,
              textAlign: 'center',
              color: Colors.ThemeColor,
              padding: 1,
            }}
            autoCorrect={false}>
            {'Post'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableHighlight>
  );
};
export const RenderLikeAndCommentSection = (
  item: any,
  like: any,
  animate: any,
) => {
  let memoryDetail = item.item;
  var likes = ' Like';
  var comments = ' Comment';
  if (memoryDetail.noOfComments > 0 || memoryDetail.showLikeCount) {
    if (memoryDetail.showLikeCount && memoryDetail.noOfLikes > 0) {
      likes = memoryDetail.noOfLikes
        .toString()
        .concat(memoryDetail.noOfLikes > 1 ? ' Likes' : ' Like');
    }
    if (memoryDetail.noOfComments > 0) {
      comments = memoryDetail.noOfComments
        .toString()
        .concat(memoryDetail.noOfComments > 1 ? ' Comments' : ' Comment');
    }
  }
  return (
    <View style={{ paddingRight: 15, paddingLeft: 15 }} key={item.index}>
      {(memoryDetail.noOfComments > 0 || memoryDetail.showLikeCount) && (
        <Border />
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}>
        <TouchableHighlight
          underlayColor={'#ffffff00'}
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
          onPress={() => {
            EventManager.callBack('startAnim');
            like(item);
          }}>
          <LikeCommentShare
            id={item.index}
            animate={animate}
            animateType={'like'}
            selectedItem={memoryDetail.isLikedByUser}
            name={likes}
            icon={memoryDetail.isLikedByUser ? icon_like_selected : icon_like}
          />
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={'#ffffff00'}
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          onPress={() => {
            this.props.navigation.navigate('memoryDetails', {
              nid: item.item.nid,
              type: item.item.type,
              comment: true,
            });
          }}>
          <LikeCommentShare
            id={item.index}
            animate={animate}
            animateType={'comment'}
            selectedItem={memoryDetail.isLikedByUser}
            name={comments}
            icon={icon_comment}
          />
        </TouchableHighlight>
      </View>
    </View>
  );
};

export const _onShowMemoryDetails = (item: any, navigation?: any) => {
  if (Utility.isInternetConnected) {
    navigation?.navigate('newmemoryDetails', {
      nid: item.nid,
      type: item.type,
      height: 80,
    });
    // this.props.navigation.jump('memoryDetails', {nid: item.nid, type: item.type});
  } else {
    No_Internet_Warning();
  }
};

export const _onOpenPdfs = (pdfUrl: any) => {
  if (Utility.isInternetConnected) {
    this.props.navigation.jump('pdfViewer', { file: { url: encode_utf8(pdfUrl) } });
  } else {
    No_Internet_Warning();
  }
};
export const _onAnim = () => {
  Animated.sequence([
    Animated.timing(PublishedMemory.shakeAnimation, {
      toValue: 10,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(PublishedMemory.shakeAnimation, {
      toValue: -10,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(PublishedMemory.shakeAnimation, {
      toValue: 10,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(PublishedMemory.shakeAnimation, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start();
};

export const _onOpenImages = (items: any, index: any, navigation: any) => {
  if (Utility.isInternetConnected) {
    let images = [];
    let position = 0;
    images = items;
    position = index;
    navigation?.navigate('imageViewer', {
      files: images,
      index: position,
    });
  } else {
    No_Internet_Warning();
  }
};

export const MemoryBasicDetails = (
  userDetails: any,
  item: any,
  openMemoryActions: any,
  listType: any,
) => {
  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
      <View style={{ flexDirection: 'row', paddingLeft: 14 }}>
        <View style={{ padding: 5, flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Text
              style={{
                ...fontSize(16),
                fontFamily: fontFamily.Inter,
                color: Colors.TextColor,
                lineHeight: 20,
              }}>
              {'By '}
              <Text
                style={{
                  color: Colors.NewYellowColor,
                  fontWeight: '500',
                  fontFamily:
                    Platform.OS === 'ios'
                      ? fontFamily.Inter
                      : fontFamily.InterMedium,
                  lineHeight: 20,
                }}>
                {userDetails.name}
              </Text>
            </Text>
            {listType == ListType.Published && (
              <Text
                style={{
                  ...fontSize(14),
                  fontFamily: fontFamily.Inter,
                  color: Colors.TextColor,
                  lineHeight: 20,
                }}>
                {Utility.timeDuration('' + item.created, 'M d, Y')}
                {item.viewCount > 0 && (
                  <Text>
                    {' | '}
                    {item.viewCount}
                    {item.viewCount > 1 ? ' views' : ' view'}
                  </Text>
                )}
              </Text>
            )}
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={{
          padding: 16,
          height: '100%',
          maxHeight: 70,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          openMemoryActions(item);
        }}>
        <Image source={greenDotsButton} />
      </TouchableOpacity>
    </View>
  );
};

export const MediaView = (item: any, audioView: any, navigation: any) => {
  let memoryDetail = item.item;
  return (
    <View>
      {memoryDetail.images && memoryDetail.images.length > 0 ? (
        <View
          style={{
            margin: 16,
            marginTop: 0,
            height: 117,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableHighlight
            underlayColor={'#ffffff00'}
            style={{ flex: 1 }}
            onPress={() => {
              _onOpenImages(memoryDetail.images, 0, navigation);
            }}>
            <PlaceholderImageView
              style={{
                backgroundColor: Colors.NewLightThemeColor,
                flex: 1,
                marginRight: 2,
              }}
              uri={Utility.getFileURLFromPublicURL(
                memoryDetail.images[0].thumbnail_url,
              )}
              resizeMode={'contain'}
            />
          </TouchableHighlight>

          {memoryDetail.images.length > 1 && (
            <View style={{ flex: 1, backgroundColor: Colors.NewLightThemeColor }}>
              {/* <TouchableHighlight underlayColor={"#ffffff00"}
                                    style={{ flex: 1 }}
                                    onPress={
                                        () => {
                                            this._onOpenImages(memoryDetail.images, 0)
                                        }}
                                    >
                                    <View style={{flex: 1}}>
                                    <PlaceholderImageView
                                        style={{ backgroundColor: "#F3F3F3", flex: 1, marginRight: 2 }}
                                        uri={Utility.getFileURLFromPublicURL(memoryDetail.images[1].thumbnail_url)}
                                        resizeMode={"contain"} />
                                        </View>
                                </TouchableHighlight>         */}
              <TouchableHighlight
                underlayColor={'#ffffff00'}
                style={{ flex: 1 }}
                onPress={() => {
                  memoryDetail.images.length > 2
                    ? _onShowMemoryDetails(memoryDetail, navigation)
                    : _onOpenImages(memoryDetail.images, 1, navigation);
                }}>
                <View style={{ flex: 1 }}>
                  <PlaceholderImageView
                    style={{ flex: 1, marginLeft: 2 }}
                    uri={Utility.getFileURLFromPublicURL(
                      memoryDetail.images[1].thumbnail_url,
                    )}
                    resizeMode={'contain'}
                  />

                  {memoryDetail.images.length > 2 && (
                    <View
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          ...fontSize(16),
                          textAlign: 'center',
                        }}>
                        {'+'}
                        {memoryDetail.images.length - 2}
                        {'\n more'}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableHighlight>
            </View>
          )}
        </View>
      ) : null}
      {audioView(memoryDetail)}
      {memoryDetail.pdf && memoryDetail.pdf.length > 0 ? (
        <View
          style={{
            margin: 16,
            marginTop: 0,
            height: 117,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableHighlight
            underlayColor={'#ffffff00'}
            style={{
              backgroundColor: Colors.NewLightThemeColor,
              flex: 1,
              marginRight: 2,
              height: '100%',
            }}
            onPress={() => {
              _onOpenPdfs(memoryDetail.pdf[0].url);
            }}>
            <PlaceholderImageView
              style={{ height: '100%', width: '100%' }}
              //   style={{backgroundColor : "#F3F3F3", flex: 1, marginRight: 2, height: "100%"}}
              openPDF={true}
              uri={Utility.getFileURLFromPublicURL(
                memoryDetail.pdf[0].pdf_image_url,
              )}
              resizeMode={'contain'}
            />
          </TouchableHighlight>
          {memoryDetail.pdf.length > 1 && (
            <View style={{ flex: 1, backgroundColor: Colors.NewLightThemeColor }}>
              <TouchableHighlight
                underlayColor={'#ffffff00'}
                style={{ flex: 1 }}
                onPress={() => {
                  memoryDetail.pdf.length > 2
                    ? _onShowMemoryDetails(memoryDetail, navigation)
                    : _onOpenPdfs(memoryDetail.pdf[1].url, navigation);
                }}>
                <View>
                  <PlaceholderImageView
                    style={{ flex: 1, marginLeft: 2, height: '100%' }}
                    openPDF={true}
                    uri={Utility.getFileURLFromPublicURL(
                      memoryDetail.pdf[1].pdf_image_url,
                    )}
                    resizeMode={'contain'}
                  />
                  {memoryDetail.pdf.length > 2 && (
                    <View
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          ...fontSize(16),
                          textAlign: 'center',
                        }}>
                        {'+'}
                        {memoryDetail.pdf.length - 2}
                        {'\n more'}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableHighlight>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  normalText: {
    ...fontSize(16),
    fontWeight: 'normal',
    color: '#595959',
    marginBottom: 10,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignContent: 'center',
  },
  boxShadow: {
    shadowOpacity: 1,
    shadowColor: '#D9D9D9',
    shadowRadius: 2,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  sideMenu: {
    paddingTop: 15,
    bottom: 0,
    left: 0,
    backgroundColor: '#fff',
    minHeight: 50,
    width: '100%',
    position: 'absolute',
    borderRadius: 5,
    shadowOpacity: 1,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0, 0.5)',
    shadowColor: '#CACACA',
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
});
