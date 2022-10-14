import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  RefreshControl,
  SafeAreaView,
  Share,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ContextMenu from 'react-native-context-menu-view';
import DeviceInfo from 'react-native-device-info';
import {Account} from '../../../../src/common/loginStore';
import {MemoryService, newMemoryService} from '../../../../src/common/webservice/memoryServices';
import {ListType} from '../../../../src/views/dashboard/dashboardReducer';
import MemoryActionsSheet, {
  MemoryActionsSheetItem,
} from '../../../components/memoryActionsSheet';
import {LikeCommentShare} from '../../memoryDetails/componentsMemoryDetails';
import {GetAllLikes, Like, Unlike} from '../../memoryDetails/detailsWebService';
import {
  GetPublishedMemories,
  kAllLikes,
  kLiked,
  kMemoryActionPerformedPublished,
  kMemoryMoveToDrafts,
  kPublishedMemoriesFetched,
  kUnliked,
  MemoryAction,
} from '../myMemoriesWebService';
import AudioPlayer, {
  kClosed,
  kEnded,
  kNext,
  kPaused,
  kPlaying,
  kPrevious,
} from './../../../../src/common/component/audio_player/audio_player';
import loaderHandler from './../../../../src/common/component/busyindicator/LoaderHandler';
import PlaceholderImageView from './../../../../src/common/component/placeHolderImageView';
import Text from './../../../../src/common/component/Text';
import {
  No_Internet_Warning,
  ToastMessage,
} from './../../../../src/common/component/Toast';
import {
  Colors,
  encode_utf8,
  fontSize,
  MemoryActionKeys,
  Storage,
} from './../../../../src/common/constants';
import EventManager from './../../../../src/common/eventManager';
import Utility from './../../../../src/common/utility';
import {
  add_icon_small,
  block_and_report,
  block_memory,
  block_user,
  cancelActions,
  delete_memory,
  edit_memory,
  icon_send,
  move_to_draft,
  profile_placeholder,
  remove_me_from_this_post,
  report_user,
} from './../../../../src/images';
import MemoryListItem from './../../../components/memoryListItem';
import {heart, liked, moreoptions} from './../../../images';
import {PublishedMemoryDataModel} from './publishedMemoryDataModel';
import styles from './styles';

var MemoryActions: Array<MemoryActionsSheetItem> = [
  // { index: 0, text: "Image", image: action_camera }
];
type State = {[x: string]: any};
type Props = {[x: string]: any};
var publishedMemoriesArray: any[] = [];
var page: 0;
var loadingDataFromServer = true;

export const kPublishedMemoryUpdated = 'publishedMemoryUpdated';
export default class PublishedMemory extends React.Component<Props, State> {
  _actionSheet: any | MemoryActionsSheet = null;
  dropDown: any | MemoryActionsSheet = null;
  publishedMemoryListener: EventManager;
  likeListener: EventManager;
  unlikeListener: EventManager;
  publishedMemoryUpdatedLister: EventManager;
  getAllLikesListener: EventManager;
  memoryActionsListener: EventManager;
  publishedMemoryDataModel: PublishedMemoryDataModel;
  audioPlayer: React.RefObject<AudioPlayer> = React.createRef<AudioPlayer>();
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
    this.memoryActionsListener = EventManager.addListener(
      kMemoryMoveToDrafts,
      this.memoryActionCallBack,
    );
  }

  componentDidMount() {
    if (Utility.isInternetConnected) {
      // loaderHandler.showLoader();
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
            loaderHandler.hideLoader();
          },
        );
      },
    );
  }

  componentWillUnmount = () => {
    this.publishedMemoryListener.removeListener();
    this.likeListener.removeListener();
    this.unlikeListener.removeListener();
    this.publishedMemoryUpdatedLister.removeListener();
    this.getAllLikesListener.removeListener();
    this.memoryActionsListener.removeListener();
  };

  publishedMemoryUpdated = (
    nid: any,
    likeCount: any,
    commentCount: any,
    likeFlag: any,
  ) => {
    publishedMemoriesArray.forEach((element: any, index: any) => {
      if (element.nid == nid) {
        element.noOfLikes = likeCount;
        element.noOfComments = commentCount;
        element.isLikedByUser = likeFlag;
      }
    });
  };

  onRefresh = () => {
    this.setState(
      {
        isRefreshing: true,
      },
      () => GetPublishedMemories(''),
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
        ToastMessage(publishedMemories, Colors.ErrorColor);
      }
    }
    this.setState(
      {
        isRefreshing: false,
        loading: false,
      },
      () => loaderHandler.hideLoader(),
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
      loaderHandler.showLoader('Loading...');
    }
  };
  allLikesFetched = (fetched?: boolean, getAllLikes?: any) => {
    loaderHandler.hideLoader();
    if (fetched) {
      this.showList(getAllLikes);
      // this.setState({});
    } else {
      ToastMessage(getAllLikes, Colors.ErrorColor);
    }
  };
  likeCallback = (fetched: boolean, responseMessage: any, nid?: any) => {
    if (!fetched) {
      // this.memoryDataModel.likesComments.noOfLikes = this.memoryDataModel.likesComments.noOfLikes - 1;
      // this.memoryDataModel.likesComments.isLikedByUser = 0;
      // ToastMessage(responseMessage, Colors.ErrorColor)
    } else {
      // this.forwardDataToNative();
    }
  };
  unlikeCallback = (fetched: boolean, responseMessage: any, nid?: any) => {
    if (!fetched) {
      // this.memoryDataModel.likesComments.noOfLikes = this.memoryDataModel.likesComments.noOfLikes + 1;
      // this.memoryDataModel.likesComments.isLikedByUser = 1;
      // ToastMessage(responseMessage, Colors.ErrorColor)
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
    showConsoleLog(ConsoleType.ERROR, 'response no listner next> ', nid);
    loaderHandler.hideLoader();
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
      } else if (type == MemoryActionKeys.editMemoryKey) {
        _onEditMemory(nid);
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
      ToastMessage(responseMessage, Colors.ErrorColor);
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

  renderItem=(item: any) => (
    <MemoryListItem
      item={item}
      like={this.like}
      listType={ListType.Published}
      audioView={this.audioView}
      openMemoryActions={this.openMemoryActions.bind(this)}
    />
  )

  render() {
    return (
      <View style={styles.mainContainer}>
        <SafeAreaView style={styles.container}>
          <View style={styles.flatlistContainer}>
            <FlatList
              data={publishedMemoriesArray}
              style={styles.flatlistStyle}
              extraData={this.state}
              initialNumToRender={10}
              removeClippedSubviews={true}
              keyExtractor={(_, index: number) => `${index}`}
              onScroll={() => {
                Keyboard.dismiss();
              }}
              renderItem={this.renderItem}
              maxToRenderPerBatch={5}
              windowSize={5}
              refreshControl={
                <RefreshControl
                  colors={[
                    Platform.OS === 'android' ? Colors.NewThemeColor : Colors.white,
                  ]}
                  tintColor={
                    Platform.OS === 'android' ? Colors.NewThemeColor : Colors.white
                  }
                  refreshing={this.state.isRefreshing}
                  onRefresh={()=>this.onRefresh()}
                />
              }
              // keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={()=>this.renderFooter()}
              onEndReachedThreshold={0.4}
              onEndReached={()=>this.handleLoadMore()}
            />
            {publishedMemoriesArray.length == 0 && (
              <View style={styles.emptyContainer}>
                {loadingDataFromServer ? (
                  <ActivityIndicator
                    color={Colors.ThemeColor}
                    size="large"
                    // style={{ flex: 1, justifyContent: 'center' }}
                  />
                ) : (
                  <Text style={styles.noMemoriedTextStyle}>
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
          onActionClick={onActionItemClicked}
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
      <View style={styles.footerStyle}>
        <ActivityIndicator color="#000000" />
      </View>
    );
  };
  renderSeparator = () => {
    return <View style={styles.separator} />;
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
    this.setState({showMemoryActions: true});
  };

  audioView = (item: any) => {
    if (item.audios.length > 0) {
      return (
        <View style={styles.audioContainer}>
          <View style={[styles.audioSubContainer, styles.boxShadow]}>
            {item.audios[0].url && item.audios[0].url != '' && (
              <View
                style={styles.audioButtonContainer}
                onStartShouldSetResponder={() => true}
                onResponderStart={() => this.togglePlayPause(item)}>
                <View style={styles.playButtonContainer}>
                  {this.state.audioFile.fid == item.audios[0].fid &&
                  this.state.audioFile.isPlaying ? (
                    <View style={styles.playButtonMainContainer}>
                      <View style={styles.playButtonStyle} />
                      <View style={styles.playbuttonTransparentView} />
                      <View style={styles.playButtonStyle} />
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
                <View style={{marginLeft: 10}}>
                  <Text
                    style={[
                      styles.normalText,
                      {color: '#000', marginBottom: 5, paddingRight: 80},
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.audios[0].title
                      ? item.audios[0].title
                      : item.audios[0].filename
                      ? item.audios[0].filename
                      : ''}
                  </Text>
                  <Text style={[styles.normalText, {color: '#000'}]}>
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
                style={{flex: 1, justifyContent: 'center'}}
                onPress={() => {
                  _onShowMemoryDetails(item);
                }}>
                <Text
                  style={{
                    color: Colors.TextColor,
                    ...fontSize(14),
                    textAlign: 'center',
                  }}>
                  {'+'}
                  {item.audios.length - 1}
                  {' audios'}
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
    this.setState({audioFile: audioFile});
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
    } catch (error) {}
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
    loaderHandler.showLoader();
    navigation.navigate('createMemory', {
      editMode: true,
      draftNid: nid,
      editPublsihedMemory: true,
    });
  } else {
    No_Internet_Warning();
  }
};

const _onShareMemory = async (url: any) => {
  try {
    setTimeout(async () => {
      const result: any = await Share.share({
        message: 'Share the Memory',
        url: url,
        title: 'Share',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      } else {
        // alert(JSON.stringify(result))
      }
    }, 1000);
  } catch (error) {
    // alert(error.message);
  }
};

export const onActionItemClicked = async (
  index: number,
  data: any,
  navigation: any,
) => {
  // showConsoleLog(ConsoleType.ERROR,JSON.stringify(data));
  switch (data.actionType) {
    case MemoryActionKeys.addToCollection:
      _addToCollection(data.nid, navigation);
      break;
    case MemoryActionKeys.editMemoryKey:
      loaderHandler.showLoader();

      let details: any = {
        action_type: MemoryActionKeys.moveToDraftKey,
        type: data.memoryType,
        id: data.nid,
      };
      let userdata = await Storage.get('userData');

      let response = await newMemoryService(
        `https://${Account.selectedData().instanceURL}/api/actions/memory`,
        [
          {
            'X-CSRF-TOKEN': userdata.userAuthToken,
            'Content-Type': 'application/json',
          },
          {configurationTimestamp: '0', details},
        ],
        response =>{
          if (response.ResponseCode == 200) {
            _onEditMemory(data.nid, navigation);
          } else {
            loaderHandler.hideLoader();
          }
        }
      )
        // .then((response: Response) => response.json())
        // .catch((err: Error) => {
        //   Promise.reject(err);
        // });
      
      break;
    case MemoryActionKeys.cancelActionKey:
      break;
    case MemoryActionKeys.shareActionKey:
      _onShareMemory(data.memory_url);
      break;
    default:
      if (Utility.isInternetConnected) {
        let alertData = Utility.getActionAlertTitle(data.actionType);
        setTimeout(() => {
          Alert.alert(alertData.title, alertData.message, [
            {
              text: 'No',
              style: 'cancel',
              onPress: () => {},
            },
            {
              text: 'Yes',
              style: 'default',
              onPress: () => {
                if (Utility.isInternetConnected) {
                  loaderHandler.showLoader();
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
  for (var value in item.actions_on_memory) {
    i += 1;
    switch (value) {
      case MemoryActionKeys.addToCollection:
        memoryActions.push({
          index: i,
          text: item.actions_on_memory[value],
          image: add_icon_small,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.addToCollection,
          uid: item.user_details.uid,
        });
        break;
      case MemoryActionKeys.editMemoryKey:
        memoryActions.push({
          index: i,
          text: item.actions_on_memory[value],
          image: edit_memory,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.editMemoryKey,
        });
        break;
      case MemoryActionKeys.deleteMemoryKey:
        memoryActions.push({
          index: i,
          text: item.actions_on_memory[value],
          image: delete_memory,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.deleteMemoryKey,
        });
        break;
      case MemoryActionKeys.moveToDraftKey:
        memoryActions.push({
          index: i,
          text: item.actions_on_memory[value],
          image: move_to_draft,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.moveToDraftKey,
        });
        break;
      case MemoryActionKeys.removeMeFromThisPostKey:
        memoryActions.push({
          index: i,
          text: item.actions_on_memory[value],
          image: remove_me_from_this_post,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.removeMeFromThisPostKey,
        });
        break;
      case MemoryActionKeys.blockMemoryKey:
        memoryActions.push({
          index: i,
          text: item.actions_on_memory[value],
          image: block_memory,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.blockMemoryKey,
        });
        break;
      case MemoryActionKeys.blockUserKey:
        memoryActions.push({
          index: i,
          text: item.actions_on_memory[value],
          image: block_user,
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
          text: item.actions_on_memory[value],
          image: report_user,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.reportMemoryKey,
          isDestructive: 1,
        });
        break;
      case MemoryActionKeys.blockAndReportKey:
        memoryActions.push({
          index: i,
          text: item.actions_on_memory[value],
          image: block_and_report,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.blockAndReportKey,
          uid: item.user_details.uid,
          isDestructive: 1,
        });
        break;
    }
  }
  return memoryActions;
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
      underlayColor={Colors.touchableunderlayColor}
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

        <TouchableWithoutFeedback>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
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
          </View>
        </TouchableWithoutFeedback>
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
    <View style={{marginRight: 24}} key={item.index}>
      {/* {(memoryDetail.noOfComments > 0 || memoryDetail.showLikeCount) && (
        <Border />
      )} */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <TouchableHighlight
          underlayColor={Colors.touchableunderlayColor}
          style={{
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
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
            icon={memoryDetail.isLikedByUser ? liked : heart}
          />
        </TouchableHighlight>
        {/* <TouchableHighlight
          underlayColor={Colors.touchableunderlayColor}
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          onPress={() => {
            this.props.navigation.jumpTo('memoryDetails', {
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
        </TouchableHighlight> */}
      </View>
    </View>
  );
};

export const _onShowMemoryDetails = (
  item: any,
  fromPage?: any,
  navigation?: any,
) => {
  if (Utility.isInternetConnected) {
    navigation?.navigate('newmemoryDetails', {
      nid: item.nid,
      type: item.type,
      height: 80,
    });
  } else {
    No_Internet_Warning();
  }
};

export const _onOpenPdfs = (pdfUrl: any, navigation?: any) => {
  if (Utility.isInternetConnected) {
    navigation?.navigate('pdfViewer', {
      file: {url: encode_utf8(pdfUrl)},
    });
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

const MemoryActionsListArray = (item: any) => {
  var i = 0;
  let memoryActions: any = [];

  for (var value in item.actions_on_memory) {
    i += 1;
    switch (value) {
      case MemoryActionKeys.addToCollection:
        // memoryActions.push(item.actions_on_memory[value])
        // memoryActions.push(
        //   {
        //     index: i,
        //     text: item.actions_on_memory[value],
        //     title: item.actions_on_memory[value],
        //     // image: add_icon_small,
        //     nid: item.nid,
        //     memoryType: item.type,
        //     actionType: MemoryActionKeys.addToCollection,
        //     uid: item.user_details.uid,
        //   }
        // );
        break;
      case MemoryActionKeys.blockUserKey:
        // memoryActions.push(item.actions_on_memory[value])
        // memoryActions.push({
        //   index: i,
        //   text: item.actions_on_memory[value],
        //   title: item.actions_on_memory[value],
        //   // image: Platform.OS == 'ios' ? personxmark :block,
        //   nid: item.nid,
        //   memoryType: item.type,
        //   actionType: MemoryActionKeys.blockUserKey,
        //   uid: item.user_details.uid,
        //   isDestructive: 1,
        // });
        break;
      case MemoryActionKeys.reportMemoryKey:
        // memoryActions.push(item.actions_on_memory[value])
        // memoryActions.push({
        //   index: i,
        //   text: item.actions_on_memory[value],
        //   title: item.actions_on_memory[value],
        //   // image: Platform.OS == 'ios' ? flagandroid : flag,
        //   nid: item.nid,
        //   memoryType: item.type,
        //   actionType: MemoryActionKeys.reportMemoryKey,
        //   isDestructive: 1,
        // });
        break;
      case MemoryActionKeys.blockAndReportKey:
        // memoryActions.push(item.actions_on_memory[value])
        // memoryActions.push({
        //   index: i,
        //   text: item.actions_on_memory[value],
        //   title: item.actions_on_memory[value],
        //   // image: Platform.OS == 'ios' ? redstar : report,
        //   nid: item.nid,
        //   memoryType: item.type,
        //   actionType: MemoryActionKeys.blockAndReportKey,
        //   uid: item.user_details.uid,
        //   isDestructive: 1,
        // });
        break;
      case MemoryActionKeys.editMemoryKey:
        // memoryActions.push(item.actions_on_memory[value])
        memoryActions.push({
          index: i,
          text: item.actions_on_memory[value],
          title: item.actions_on_memory[value],
          // image: edit_memory,
          nid: item.nid,
          memoryType: item.type,
          actionType: MemoryActionKeys.editMemoryKey,
        });
        break;
      case MemoryActionKeys.deleteMemoryKey:
        // memoryActions.push(item.actions_on_memory[value])
        // memoryActions.push({
        //   index: i,
        //   text: item.actions_on_memory[value],
        //   title: item.actions_on_memory[value],
        //   // image: delete_memory,
        //   nid: item.nid,
        //   memoryType: item.type,
        //   actionType: MemoryActionKeys.deleteMemoryKey,
        // });
        break;
      case MemoryActionKeys.moveToDraftKey:
        // memoryActions.push(item.actions_on_memory[value])
        // memoryActions.push({
        //   index: i,
        //   text: item.actions_on_memory[value],
        //   title: item.actions_on_memory[value],
        //   // image: move_to_draft,
        //   nid: item.nid,
        //   memoryType: item.type,
        //   actionType: MemoryActionKeys.moveToDraftKey,
        // });
        break;
      case MemoryActionKeys.removeMeFromThisPostKey:
        // memoryActions.push(item.actions_on_memory[value])
        // memoryActions.push({
        //   index: i,
        //   text: item.actions_on_memory[value],
        //   title: item.actions_on_memory[value],
        //   // image: remove_me_from_this_post,
        //   nid: item.nid,
        //   memoryType: item.type,
        //   actionType: MemoryActionKeys.removeMeFromThisPostKey,
        // });
        break;
      case MemoryActionKeys.blockMemoryKey:
        // memoryActions.push(item.actions_on_memory[value])
        // memoryActions.push({
        //   index: i,
        //   text: item.actions_on_memory[value],
        //   title: item.actions_on_memory[value],
        //   // image: block_memory,
        //   nid: item.nid,
        //   memoryType: item.type,
        //   actionType: MemoryActionKeys.blockMemoryKey,
        // });
        break;
    }
  }
  memoryActions.push({
    text: 'Share memory',
    title: 'Share memory',
    // image: add_icon_small,
    nid: item.nid,
    memory_url: item.memory_url,
    memoryType: item.type,
    actionType: MemoryActionKeys.shareActionKey,
    uid: item.user_details.uid,
  });
  return memoryActions;
};

export const MemoryBasicDetails = (
  userDetails: any,
  item: any,
  openMemoryActions?: any,
  listType?: any,
  navigation?: any,
) => {
  let memoryActions = MemoryActionsListArray(item);
  return (
    <>
      <View style={styles.authorNameContainer}>
        <>
          <TouchableWithoutFeedback
            onPress={() => {
              if (Utility.isInternetConnected) {
                navigation.navigate('newmemoryDetails', {
                  nid: item.nid,
                  type: item.type,
                  height: 80,
                });
              } else {
                No_Internet_Warning();
              }
            }}>
            <View
              style={[styles.flexRow, {width: Utility.getDeviceWidth() - 112}]}>
              <ImageBackground
                style={styles.userImageStyle}
                imageStyle={styles.userImageStyle}
                source={profile_placeholder}>
                <Image
                  style={styles.userImageStyle}
                  source={
                    userDetails.userProfilePic &&
                    userDetails.userProfilePic != ''
                      ? {uri: userDetails.userProfilePic}
                      : profile_placeholder
                  }></Image>
              </ImageBackground>
              <View style={styles.userNameTextContainerStyle}>
                <View>
                  <Text style={styles.userNameTextStyle}>
                    {userDetails.name}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </>
        {/* <TouchableWithoutFeedback
          onPress={() => {
            // openMemoryActions(item);
          }}> */}
        <View style={styles.moreoptionStyle}>
          {/* {
              Platform.OS === 'ios' ? */}
          <ContextMenu
            actions={memoryActions}
            dropdownMenuMode={true}
            previewBackgroundColor="transparent"
            onPress={e => {
              let data = memoryActions.filter(
                itm => itm.title === e.nativeEvent.name,
              );
              if (data && data[0]) {
                onActionItemClicked(e.nativeEvent.index, data[0], navigation);
              }
            }}>
            <Image source={moreoptions} />
          </ContextMenu>
          {/* :
                 <SelectDropdown
                   dropdownStyle={{ borderRadius: Platform.OS === 'ios' ? 12 : 4 }}
                   rowTextStyle={{ textAlign: 'left', fontSize: Platform.OS === 'ios' ? 17 : 16, color: Platform.OS === 'ios' ? Colors.black : Colors.blackOpacity60, fontWeight: '400', paddingLeft: 16 }}
                   dropdownOverlayColor={Colors.contextBackground}
                   rowStyle={{ backgroundColor: Platform.OS === 'ios' ? Colors.actionBgHex : Colors.white, opacity: Platform.OS === 'ios' ? 0.8 : 1, height: Platform.OS === 'ios' ? 44 : 48, borderBottomColor: '#939396', marginRight: Platform.OS === 'ios' ? undefined : 22, borderBottomWidth: Platform.OS === 'ios' ? 0.5 : 0 }}
                   buttonStyle={{ backgroundColor: Colors.white, width: 40 }}
                   data={MemoryActionsListArray(item)}
                   onSelect={(selectedItem, index) => {
                     onActionItemClicked(index, selectedItem)
                   }}
                   renderCustomizedButtonChild={() => <Image style={{ alignSelf: 'flex-end' }} source={moreoptions} />}
                 />
             } */}

          {/* <Image source={greenDotsButton} /> */}
        </View>
        {/* </TouchableWithoutFeedback> */}
      </View>
    </>
  );
};

export const MediaView = (item: any, audioView: any, navigation: any) => {
  let memoryDetail = item.item;
  return (
    <View>
      {memoryDetail.images && memoryDetail.images.length > 0 ? (
        <View style={styles.imageContainer}>
          {/* <TouchableHighlight
            underlayColor={'#ffffff'}
            style={{ flex: 1 }}
            onPress={() => {
              _onOpenImages(memoryDetail.images, 0);
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
            
          </TouchableHighlight> */}

          {memoryDetail.images.length > 0 && (
            <View style={{flex: 1}}>
              <TouchableHighlight
                underlayColor={Colors.touchableunderlayColor}
                style={styles.fullFlex}
                onPress={() => {
                  // memoryDetail.images.length > 2
                  //   ? _onShowMemoryDetails(memoryDetail) :
                  _onOpenImages(memoryDetail.images, 0, navigation);
                }}>
                <View style={[styles.fullFlex]}>
                  <ImageBackground
                    style={styles.imagebackGroundStyle}
                    blurRadius={5}
                    resizeMode="stretch"
                    source={{
                      uri: Utility.getFileURLFromPublicURL(
                        memoryDetail.images[0].thumbnail_url,
                      ),
                    }}
                  />
                  <View style={[styles.fullFlex, {position: 'relative'}]}>
                    <PlaceholderImageView
                      style={styles.placeholderImageContainer}
                      uri={Utility.getFileURLFromPublicURL(
                        memoryDetail.images[0].thumbnail_url,
                      )}
                      resizeMode={'contain'}
                    />
                    {memoryDetail.images.length > 1 && (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          memoryDetail.images.length > 1
                            ? _onShowMemoryDetails(
                                memoryDetail,
                                null,
                                navigation,
                              )
                            : _onOpenImages(memoryDetail.images, 0, navigation);
                        }}>
                        <View style={styles.moreImagesContainer}>
                          <Text style={styles.moreImageTextStyle}>
                            {'+'}
                            {memoryDetail.images.length - 1}
                            {' images'}
                            {/* {'\n more'} */}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    )}
                  </View>
                  {/* </ImageBackground> */}
                </View>
              </TouchableHighlight>
            </View>
          )}
        </View>
      ) : null}

      {audioView(memoryDetail)}

      {memoryDetail.pdf && memoryDetail.pdf.length > 0 ? (
        <View style={styles.imageContainer}>
          {memoryDetail.pdf.length > 0 && (
            <View style={{flex: 1, backgroundColor: Colors.timeLinebackground}}>
              <TouchableHighlight
                underlayColor={Colors.touchableunderlayColor}
                style={styles.fullFlex}
                onPress={() => {
                  // memoryDetail.pdf.length > 2
                  //   ? _onShowMemoryDetails(memoryDetail):
                  _onOpenPdfs(memoryDetail.pdf[0].url, navigation);
                }}>
                <View>
                  <PlaceholderImageView
                    style={styles.fullHeight}
                    openPDF={true}
                    uri={memoryDetail.pdf[0].pdf_image_url}
                    resizeMode={'contain'}
                  />
                  {memoryDetail.pdf.length > 1 && (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        memoryDetail.pdf.length > 1
                          ? _onShowMemoryDetails(memoryDetail, null, navigation)
                          : _onOpenPdfs(memoryDetail.pdf[0].url, navigation);
                      }}>
                      <View style={styles.moreImagesContainer}>
                        <Text style={styles.moreImageTextStyle}>
                          {'+'}
                          {memoryDetail.pdf.length - 1}
                          {' documents'}

                          {/* {'\n more'} */}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
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
