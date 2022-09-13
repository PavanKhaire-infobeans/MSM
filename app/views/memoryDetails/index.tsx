import React from 'react';
import {
  Alert,
  Animated,
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import RenderHtml, {defaultSystemFonts} from 'react-native-render-html';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import WebView from 'react-native-webview';
import NavigationHeaderSafeArea from '../../../src/common/component/profileEditHeader/navigationHeaderSafeArea';
import {MemoryService} from '../../../src/common/webservice/memoryServices';
import {
  kMemoryActionPerformedOnMemoryDetails,
  MemoryAction,
} from '../../../src/views/myMemories/myMemoriesWebService';
import {kPublishedMemoryUpdated} from '../../../src/views/myMemories/PublishedMemory';
import AudioPlayer, {
  kClosed,
  kEnded,
  kNext,
  kPaused,
  kPlaying,
  kPrevious,
} from './../../../src/common/component/audio_player/audio_player';
import loaderHandler from './../../../src/common/component/busyindicator/LoaderHandler';
import MemoryActionsSheet, {
  MemoryActionsSheetItem,
} from './../../../src/common/component/memoryActionsSheet';
import PlaceholderImageView from './../../../src/common/component/placeHolderImageView';
import Text from './../../../src/common/component/Text';
import {
  No_Internet_Warning,
  ToastMessage,
} from './../../../src/common/component/Toast';
import {
  Colors,
  decode_utf8,
  encode_utf8,
  fontSize,
  getDetails,
  getValue,
  keyArray,
  keyInt,
  keyString,
  MemoryActionKeys,
  Storage,
  TimeStampMilliSeconds,
} from './../../../src/common/constants';
import EventManager from './../../../src/common/eventManager';
import {Account} from './../../../src/common/loginStore';
import Utility from './../../../src/common/utility';
import {
  add_icon_small,
  block_and_report,
  block_memory,
  block_user,
  cancelActions,
  delete_memory,
  edit_memory,
  icon_like,
  icon_like_selected,
  icon_send,
  move_to_draft,
  profile_placeholder,
  remove_me_from_this_post,
  report_user,
} from './../../../src/images';
import {backArrow, heart, liked, penEdit} from './../../images';
import {
  Border,
  CarousalFilesView,
  kImage,
  kPDF,
  MemoryTags,
  UserDetails,
} from './componentsMemoryDetails';
import {
  DeleteComment,
  EditComment,
  GetAllComments,
  GetAllLikes,
  GetMemoryDetails,
  kAllComment,
  kAllLikes,
  kComment,
  kDeleteComment,
  kEditComment,
  kLiked,
  kLikeOnComment,
  kMemoryDetailsFetched,
  kUnliked,
  kUnlikeOnComment,
  Like,
  PostComment,
  Unlike,
} from './detailsWebService';
import {kNews, MemoryDataModel} from './memoryDataModel';
import Styles from './styles';
import style from './styles';

var MemoryActions: Array<MemoryActionsSheetItem> = [];

type State = {[x: string]: any};
type Props = {[x: string]: any};

export default class MemoryDetails extends React.Component<Props, State> {
  _actionSheet: any | MemoryActionsSheet = null;
  memoryDetailsListener: EventManager;
  getAllLikesListener: EventManager;
  likeListener: EventManager;
  unlikeListener: EventManager;
  deleteCommentListener: EventManager;
  editCommentListener: EventManager;
  allCommentsListeners: EventManager;
  commentListener: EventManager;
  memoryActionsListener: EventManager;
  memoryDetailsUpdateListener: EventManager;
  memoryDataModel: MemoryDataModel;
  keyLiked = 'likedBy';
  keyTagged = 'tagged';
  keyLike = 'like';
  keyComment = 'comment';
  keyShare = 'share';
  nid: any = 6872;
  storyType: any = 'my_stories';
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;
  _scrollView: KeyboardAwareScrollView | any;
  _lastComment: View | any;
  _commentBoxRef: View | any;
  _externalQueue: View | Carousel;
  _webView: View | WebView;
  audioPlayer: React.RefObject<AudioPlayer> = React.createRef<AudioPlayer>();
  backListner: EventManager;
  holdTempLikeOnComment = {tempId: '', likeStatus: ''};
  state: State = {
    collaboratorsVisibility: true,
    label: '',
    bottomToolbar: 0,
    commentValue: '',
    commentId: '',
    allCommentsList: [],
    viewAllComments: false,
    memoryDetailAvailable: false,
    audioFile: {
      index: -1,
      isPlaying: false,
    },
    activeSlide: 0,
    isExternalCue: false,
    webViewHeight: 100,
    itemToBeEditted: {},
    selectedCollection: 0,
    selectedCollectionIndex: 0,
  };
  systemFonts = [...defaultSystemFonts];

  shakeAnimation: any = new Animated.Value(0);
  constructor(props: Props) {
    super(props);
    if (props.nid && props.type) {
      this.nid = props.nid;
      this.storyType = props.type;
    }
    this.memoryDataModel = new MemoryDataModel();
    if (!this.props.previewDraft) {
      loaderHandler.showLoader();
      GetMemoryDetails(this.nid, this.storyType);
    }
    this.memoryDetailsUpdateListener = EventManager.addListener(
      'memoryDetailsListener',
      () => {
        loaderHandler.showLoader();
        GetMemoryDetails(this.nid, this.storyType);
      },
    );

    this.memoryDetailsListener = EventManager.addListener(
      kMemoryDetailsFetched,
      this.memoryDetails,
    );
    this.getAllLikesListener = EventManager.addListener(
      kAllLikes,
      this.allLikesFetched,
    );
    this.likeListener = EventManager.addListener(kLiked, this.likeCallback);
    this.unlikeListener = EventManager.addListener(
      kUnliked,
      this.unlikeCallback,
    );
    this.deleteCommentListener = EventManager.addListener(
      kDeleteComment,
      this.deleteCommentCallback,
    );
    this.editCommentListener = EventManager.addListener(
      kEditComment,
      this.editCommentCallback,
    );
    this.commentListener = EventManager.addListener(
      kComment,
      this.commentCallback,
    );
    this.allCommentsListeners = EventManager.addListener(
      kAllComment,
      this.allCommentCallback,
    );
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this._keyboardDidHide,
    );
    this.backListner = EventManager.addListener(
      'hardwareBackPress',
      this._onBack,
    );
    // EventManager.addListener('event_new_testing', this.commentCallback);
    DeviceEventEmitter.addListener('event_new_testing', this.commentCallback);
    this.memoryActionsListener = EventManager.addListener(
      kMemoryActionPerformedOnMemoryDetails,
      this.memoryActionCallBack,
    );

    // this._onEditMemory = this._onEditMemory.bind(this);
  }

  componentDidMount() {
    if (this.props.previewDraft) {
      this.memoryDataModel = this.props.memoryDetails;
      this.setState({memoryDetailAvailable: true, isExternalQueue: false});
    }
  }

  _onBack = () => {
    loaderHandler.hideLoader();
    if (this.state.bottomToolbar > 0) {
      Keyboard.dismiss();
    } else {
      Keyboard.dismiss();
      if (this.props.deepLinkBackClick) {
        this.props.navigation.navigate('dashBoard');
      } else {
        this.props.navigation.goBack();
      }
    }
  };

  allCommentCallback = (
    fetched: boolean,
    response: any,
    latestComment?: boolean,
  ) => {
    loaderHandler.hideLoader();
    if (fetched) {
      if (latestComment) {
        this.memoryDataModel.likesComments.noOfComments--;
        this.memoryDataModel.likesComments.commentsList = getDetails(
          response,
          ['comments'],
          keyArray,
        ).reverse();
      } else {
        this.setState({allCommentsList: response['comments'].reverse()});
      }
    } else {
      ToastMessage(response, Colors.ErrorColor);
      this.setState({viewAllComments: false});
    }
    // this.setState({});
    this.forwardDataToNative();
  };

  _keyboardDidShow = (e: any) => {
    this.setState({
      bottomToolbar: e.endCoordinates.height,
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      bottomToolbar: 0,
    });
  };

  likeCallback = (fetched: boolean, responseMessage: any) => {
    if (!fetched) {
      this.memoryDataModel.likesComments.noOfLikes =
        this.memoryDataModel.likesComments.noOfLikes - 1;
      this.memoryDataModel.likesComments.isLikedByUser = 0;
      ToastMessage(responseMessage, Colors.ErrorColor);
    } else {
      this.forwardDataToNative();
    }
  };

  unlikeCallback = (fetched: boolean, responseMessage: any) => {
    if (!fetched) {
      this.memoryDataModel.likesComments.noOfLikes =
        this.memoryDataModel.likesComments.noOfLikes + 1;
      this.memoryDataModel.likesComments.isLikedByUser = 1;
      ToastMessage(responseMessage, Colors.ErrorColor);
    } else {
      this.forwardDataToNative();
    }
  };

  deleteCommentCallback = (
    fetched: boolean,
    responseMessage: any,
    cid?: any,
  ) => {
    // this.memoryDataModel.likesComments.commentsList.push(comment);
    if (cid) {
      // this.memoryDataModel.likesComments.noOfComments--;
      if (this.state.viewAllComments) {
        this.state.allCommentsList = this.state.allCommentsList.filter(
          (element: any) => element.cid != cid,
        );
        this.memoryDataModel.likesComments.commentsList =
          this.memoryDataModel.likesComments.commentsList.filter(
            (element: any) => element.cid != cid,
          );
        this.memoryDataModel.likesComments.noOfComments--;
        // this.setState({});
        loaderHandler.hideLoader();
        this.forwardDataToNative();
      } else {
        this.memoryDataModel.likesComments.commentsList =
          this.memoryDataModel.likesComments.commentsList.filter(
            (element: any) => element.cid != cid,
          );
        this.getLastTwoComments();
      }
    }
  };

  editCommentCallback = (fetched: boolean, responseMessage: any, cid?: any) => {
    loaderHandler.hideLoader();
    if (cid != '') {
      if (this.state.viewAllComments) {
        let filteredComment = this.state.allCommentsList.filter(
          (element: any) => element.cid == cid,
        );
        if (filteredComment.length > 0) {
          let commentItem = filteredComment[0];
          commentItem.comment_body_value = this.state.commentValue;
          commentItem.changed = Math.floor(Date.now() / 1000);
          this.state.allCommentsList = this.state.allCommentsList.filter(
            (element: any) => element.cid != cid,
          );
          //console.log(this.state.allCommentsList);
          // let allList = this.state.allCommentsList;
          // allList.push(comment);
          this.state.allCommentsList.push(commentItem);
          //console.log(this.state.allCommentsList);

          // this.setState({})
          this.setState({
            bottomToolbar: 0,
            commentValue: '',
            commentId: '',
            commentViewVisiblity: false,
          });
        }
      } else {
        let filteredComment =
          this.memoryDataModel.likesComments.commentsList.filter(
            (element: any) => element.cid == cid,
          );
        if (filteredComment.length > 0) {
          let commentItem = filteredComment[0];
          commentItem.comment_body_value = this.state.commentValue;
          commentItem.changed = Math.floor(Date.now() / 1000);
          this.memoryDataModel.likesComments.commentsList =
            this.memoryDataModel.likesComments.commentsList.filter(
              (element: any) => element.cid != cid,
            );
          //console.log(this.memoryDataModel.likesComments.commentsList);
          // let allList = this.state.allCommentsList;
          // allList.push(comment);
          this.memoryDataModel.likesComments.commentsList.push(commentItem);
          //console.log(this.memoryDataModel.likesComments.commentsList);

          // this.setState({});
          this.setState({
            bottomToolbar: 0,
            commentValue: '',
            commentId: '',
            commentViewVisiblity: false,
          });
        }
      }

      // this.memoryDataModel.likesComments.noOfComments--;
    }
  };

  commentCallback = (
    fetched: boolean,
    responseMessage: any,
    cid?: any,
    tempCommentId?: any,
  ) => {
    if (!fetched) {
      this.memoryDataModel.likesComments.isLikedByUser =
        !this.memoryDataModel.likesComments.isLikedByUser;
      this.memoryDataModel.likesComments.noOfComments--;
      ToastMessage(responseMessage, Colors.ErrorColor);
    } else {
      if (cid && tempCommentId) {
        if (this.state.viewAllComments) {
          this.state.allCommentsList.forEach((element: any, index: any) => {
            if (element.cid == tempCommentId) {
              this.state.allCommentsList[index].cid = cid;
            }
          });
        } else {
          this.memoryDataModel.likesComments.commentsList.forEach(
            (element: any, index: any) => {
              if (element.cid == tempCommentId) {
                this.memoryDataModel.likesComments.commentsList[index].cid =
                  cid;
              }
            },
          );
        }
        this.holdTempLikeOnComment = {tempId: '', likeStatus: ''};
        this.forwardDataToNative();
        this.scrollToBottom();
      }
    }
  };

  scrollToBottom = () => {
    this._scrollView && this._scrollView.scrollToEnd();
  };

  forwardDataToNative = () => {
    EventManager.callBack(
      kPublishedMemoryUpdated,
      this.memoryDataModel.nid,
      this.memoryDataModel.likesComments.noOfLikes,
      this.memoryDataModel.likesComments.noOfComments,
      this.memoryDataModel.likesComments.isLikedByUser,
    );
    // if(Platform.OS === "android"){
    //     NativeModules.AllMemoriesComponent.updateLikeCommentCounts(JSON.stringify({
    //             nid: this.memoryDataModel.nid,
    //             storyType : this.storyType,
    //             likeCount :  this.memoryDataModel.likesComments.noOfLikes,
    //             commentCount : this.memoryDataModel.likesComments.noOfComments,
    //             likeFlag : this.memoryDataModel.likesComments.isLikedByUser}));
    // }
    // else{
    //     // NativeModules.AllMemoriesComponentManager.updateInYears({
    //     //     startYear: "1990",
    //     //     endYear: "2000"})
    //     NativeModules.AllMemoriesComponentManager.updateLikeCommentCounts({
    //         nid: this.memoryDataModel.nid,
    //         storyType : this.storyType,
    //         likeCount :  this.memoryDataModel.likesComments.noOfLikes,
    //         commentCount : this.memoryDataModel.likesComments.noOfComments,
    //         likeFlag : this.memoryDataModel.likesComments.isLikedByUser})
    // }
  };

  getAllLikes = (attr_id?: any, nodetype?: any) => {
    // if(this.memoryDataModel.likesComments.noOfLikes > 0 ){
    if (Utility.isInternetConnected) {
      GetAllLikes(
        this.memoryDataModel.nid,
        this.storyType,
        kAllLikes,
        attr_id ? attr_id : null,
        nodetype ? nodetype : null,
      );
      loaderHandler.showLoader('Loading...');
    }
    // }
  };

  getAllComments = () => {
    if (this.state.viewAllComments) {
      this.setState({viewAllComments: false});
    } else {
      this.setState({viewAllComments: true}, () => {
        if (this.memoryDataModel.likesComments.noOfComments > 0) {
          loaderHandler.showLoader('Loading...');
          GetAllComments(
            this.memoryDataModel.nid,
            this.storyType,
            this.memoryDataModel.likesComments.noOfComments,
          );
        }
      });
    }
  };

  getLastTwoComments = () => {
    GetAllComments(this.memoryDataModel.nid, this.storyType, '2', true);
  };

  allLikesFetched = (fetched?: boolean, getAllLikes?: any) => {
    loaderHandler.hideLoader();
    if (fetched) {
      this.showList(this.keyLiked, getAllLikes);
      // this.setState({});
    } else {
      ToastMessage(getAllLikes, Colors.ErrorColor);
    }
  };

  memoryDetails = (fetched: boolean, memoryDetails: any) => {
    loaderHandler.hideLoader();
    if (fetched) {
      // "internal_cues" ||
      let isExternalCue =
        this.storyType.indexOf('collection') != -1 ? true : false;
      this.memoryDataModel.updateMemoryDetails(memoryDetails);
      this.setState(
        {
          memoryDetailAvailable: true,
          isExternalQueue: isExternalCue,
        },
        () => {
          if (this.props.comment) {
            this.focusCommentView();
          } else if (this.props.showComments) {
            setTimeout(() => {
              this.scrollToBottom();
            }, 1000);
          }
        },
      );
    } else {
      ToastMessage(memoryDetails, Colors.ErrorColor);
      this.setState({memoryDetailAvailable: true});
    }
  };

  componentWillUnmount() {
    this.memoryDetailsListener.removeListener();
    this.getAllLikesListener.removeListener();
    this.likeListener.removeListener();
    this.unlikeListener.removeListener();
    this.deleteCommentListener.removeListener();
    this.editCommentListener.removeListener();
    this.allCommentsListeners.removeListener();
    this.commentListener.removeListener();
    this.memoryActionsListener.removeListener();
    this.memoryDetailsUpdateListener.removeListener();
    this.backListner.removeListener();
    DeviceEventEmitter.removeAllListeners('event_new_testing');
    this.forwardDataToNative;
    try {
      this.audioPlayer.current.hidePlayer();
    } catch (e) {}
    this.memoryDetailsListener.removeListener();
  }

  showList = (tag: any, getAllLikes?: any) => {
    let itemList: any = [];
    let heading: any = '';
    if (Utility.isInternetConnected) {
      //this.props.navigation.jumpTo("memoryDetails", {"nid": event.nid, "type": event.type, "comment": event.comment ? true : false})
      switch (tag) {
        case this.keyTagged:
          itemList = this.memoryDataModel.memory.whoElseWasThere;
          if (itemList.length > 1) {
            heading = itemList.length + ' others were there';
          } else {
            heading = itemList.length + ' other was there';
          }
          this.memoryDataModel.memory.youWhereThere
            ? (heading = 'You and ' + heading)
            : heading;
          break;
        case this.keyLiked:
          itemList = getAllLikes;
          if (itemList.length > 1) {
            heading = 'Liked by ' + itemList.length + ' people';
          } else {
            heading = 'Liked by ' + itemList.length + ' person';
          }
          break;
      }
      this.props.navigation.navigate('customListMemoryDetails', {
        heading: heading,
        itemList: itemList,
      });
    } else {
      No_Internet_Warning();
    }
  };

  toggleCollaboratorView = () => {
    this.setState({
      collaboratorsVisibility: !this.state.collaboratorsVisibility,
    });
  };

  prepareViewForComments = () => {
    let lastComments = this.getComments();
    return (
      <FlatList
        data={lastComments}
        style={Styles.MemoryTagsFlatlistStyle}
        keyExtractor={(_, index: number) => `${index}`}
        renderItem={(item: any) => this.renderCommentView(item)}
      />
    );
  };

  getComments = () => {
    let lastComments = [];
    if (!this.state.viewAllComments) {
      if (this.memoryDataModel.likesComments.commentsList.length > 2) {
        lastComments = this.memoryDataModel.likesComments.commentsList.slice(
          Math.max(
            this.memoryDataModel.likesComments.commentsList.length - 2,
            1,
          ),
        );
      } else {
        lastComments = this.memoryDataModel.likesComments.commentsList;
      }
    } else {
      lastComments = this.state.allCommentsList;
      setTimeout(() => {
        this.scrollToBottom();
      }, 1000);
    }

    return lastComments;
  };

  likeOnComment = (item: any) => {
    if (Utility.isInternetConnected) {
      let index = item.index;
      var likeFlag = getValue(item, ['item', 'like_comment_data', 'like_flag']);
      var likeCount = getValue(item, [
        'item',
        'like_comment_data',
        'like_count',
      ]);
      var isLikeAvailabe = getDetails(
        item,
        ['item', 'like_comment_data', 'like_count'],
        keyString,
      );
      if (!likeFlag) {
        Like(
          item.item.nid,
          this.storyType,
          kLikeOnComment,
          'comment',
          item.item.cid,
        );
        likeFlag = 1;
        likeCount++;
      } else {
        Unlike(
          item.item.nid,
          this.storyType,
          kUnlikeOnComment,
          'comment',
          item.item.cid,
        );
        likeFlag = 0;
        likeCount--;
      }
      if (!this.state.viewAllComments) {
        this.memoryDataModel.likesComments.commentsList[
          index
        ].like_comment_data.like_flag = likeFlag;
        if (isLikeAvailabe != null)
          this.memoryDataModel.likesComments.commentsList[
            index
          ].like_comment_data.like_count = likeCount;
        // this.setState({});
      } else {
        let commentsList = [...this.state.allCommentsList];
        commentsList[index].like_comment_data.like_flag = likeFlag;
        if (isLikeAvailabe != null)
          commentsList[index].like_comment_data.like_count = likeCount;
        this.setState({allCommentsList: commentsList});
      }
    } else {
      No_Internet_Warning();
    }
  };

  renderCommentView = (item: any) => {
    let createdOn: any = getValue(item, ['item', 'changed']);
    createdOn = Utility.timeDuration(createdOn, 'M d, Y, t', true);
    var shouldShowDeleteButton = false;
    var shouldShowEditButton = false;
    var likeFlag = getValue(item, ['item', 'like_comment_data', 'like_flag']);
    var likeCount = getDetails(
      item,
      ['item', 'like_comment_data', 'like_count'],
      keyInt,
    );
    var likeText = 'Like';
    if (likeCount > 0) {
      likeText = likeCount + (likeCount > 1 ? ' Likes' : ' Like');
    }
    if (item.item.uid === Account.selectedData().userID) {
      shouldShowEditButton = true;
    }

    if (
      item.item.uid === Account.selectedData().userID ||
      this.memoryDataModel.userDetails.name === 'You'
    ) {
      shouldShowDeleteButton = true;
    }

    return (
      <View
        ref={(ref: any) => (this._lastComment = ref)}
        style={style.renderCommentViewStyle}>
        <ImageBackground
          style={[style.avatar]}
          imageStyle={style.CollaboratorImageStyle}
          source={profile_placeholder}>
          <Image
            source={
              item.item.uri && item.item.uri != ''
                ? {uri: Utility.getFileURLFromPublicURL(item.item.uri)}
                : profile_placeholder
            }
            style={style.CollaboratorProfileImageStyle}></Image>
        </ImageBackground>
        <View style={style.fieldFirstnameContainerStyle}>
          <View style={style.fieldFirstnameSubContainerStyle}>
            <Text
              numberOfLines={1}
              style={[
                style.fieldFirstnameTextStyle,
                {backgroundColor: item.item.backgroundColor},
              ]}>
              {item.item.field_first_name_value}{' '}
              {item.item.field_last_name_value}
            </Text>
            <Text style={style.createdOnTextStyle}>{createdOn}</Text>
          </View>
          <View style={style.commentbodyContainer}>
            <Text style={style.commentbodyTextStyle}>
              {decode_utf8(item.item.comment_body_value)}
            </Text>
          </View>
          <View style={style.likebuttonContainer}>
            <TouchableWithoutFeedback onPress={() => this.likeOnComment(item)}>
              <View style={style.likeButtonStyle}>
                <Image
                  source={likeFlag ? icon_like_selected : icon_like}
                  style={style.likeImageStyle}></Image>
                <TouchableHighlight
                  underlayColor={'#ffffffff'}
                  onPress={() =>
                    likeCount > 0
                      ? this.getAllLikes(item.item.cid, 'comment')
                      : this.likeOnComment(item)
                  }>
                  <Text style={style.likeTextStyle}>{likeText}</Text>
                </TouchableHighlight>
              </View>
            </TouchableWithoutFeedback>
            {shouldShowDeleteButton ? (
              <View style={style.deleteButtonContainer}>
                {shouldShowEditButton && (
                  <TouchableWithoutFeedback
                    onPress={() => this.editComment(item.item)}>
                    <Text style={style.likeTextStyle}>Edit</Text>
                  </TouchableWithoutFeedback>
                )}
                <TouchableWithoutFeedback
                  onPress={() => this.deleteComment(item.item)}>
                  <Text style={style.deleteTextStyle}>Delete</Text>
                </TouchableWithoutFeedback>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  like = () => {
    Animated.sequence([
      Animated.timing(this.shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    if (Utility.isInternetConnected) {
      if (this.memoryDataModel.likesComments.isLikedByUser) {
        Unlike(this.memoryDataModel.nid, this.storyType, kUnliked);
        this.memoryDataModel.likesComments.isLikedByUser = 0;
        this.memoryDataModel.likesComments.noOfLikes =
          this.memoryDataModel.likesComments.noOfLikes - 1;
      } else {
        Like(this.memoryDataModel.nid, this.storyType, kLiked);
        this.memoryDataModel.likesComments.isLikedByUser = 1;
        this.memoryDataModel.likesComments.noOfLikes =
          this.memoryDataModel.likesComments.noOfLikes + 1;
      }
      if (this.state.isExternalQueue) {
        this.memoryDataModel.externalQueue.collection[
          this.state.activeSlide
        ].likesComments.noOfLikes =
          this.memoryDataModel.likesComments.noOfLikes;
        this.memoryDataModel.externalQueue.collection[
          this.state.activeSlide
        ].likesComments.isLikedByUser =
          this.memoryDataModel.likesComments.isLikedByUser;
      }
      // this.setState({});
    } else {
      No_Internet_Warning();
    }
  };

  editComment = (item: any) => {
    this.setState(
      {
        commentId: item.cid,
        commentValue: decode_utf8(item.comment_body_value),
      },
      () => {
        this._commentBoxRef &&
          this._commentBoxRef.focus &&
          this._commentBoxRef.focus();
      },
    );
  };

  deleteComment = (item: any) => {
    Alert.alert('Delete Comment?', `You wish to delete this Comment ?`, [
      {
        text: 'No',
        style: 'cancel',
        onPress: () => {},
      },
      {
        text: 'Yes',
        style: 'default',
        onPress: () => {
          loaderHandler.showLoader('Deleting...');
          DeleteComment(item.cid, this.memoryDataModel.nid, this.storyType);
        },
      },
    ]);
  };

  postcomment = () => {
    if (Utility.isInternetConnected) {
      let commentText = this.state.commentValue.trim();
      let commentId = this.state.commentId;
      if (commentText.length > 0) {
        if (commentId == '') {
          commentText = encode_utf8(commentText);
          let cid = TimeStampMilliSeconds();
          let comment = {
            nid: this.memoryDataModel.nid,
            field_first_name_value: Account.selectedData().firstName,
            field_last_name_value: Account.selectedData().lastName,
            uid: Account.selectedData().userID,
            uri: Account.selectedData().profileImage,
            like_comment_data: {like_flag: 0, like_count: 0},
            comment_body_value: commentText,
            changed: Math.floor(Date.now() / 1000),
            created: Math.floor(Date.now() / 1000),
            cid: cid,
          };

          this.memoryDataModel.likesComments.commentsList.push(comment);
          if (this.memoryDataModel.likesComments.commentsList.length > 2) {
            this.memoryDataModel.likesComments.commentsList.splice(0, 1);
          }
          this.memoryDataModel.likesComments.noOfComments++;
          let allList = this.state.allCommentsList;
          allList.push(comment);
          this.setState(
            {
              allCommentsList: allList,
              bottomToolbar: 0,
              commentValue: '',
              commentId: '',
              commentViewVisiblity: false,
            },
            () => {
              if (this.state.isExternalQueue) {
                this.memoryDataModel.externalQueue.collection[
                  this.state.activeSlide
                ].likesComments.commentsList =
                  this.memoryDataModel.likesComments.commentsList;
                this.memoryDataModel.externalQueue.collection[
                  this.state.activeSlide
                ].likesComments.noOfComments =
                  this.memoryDataModel.likesComments.noOfComments;
              }
              this.holdTempLikeOnComment = {tempId: cid, likeStatus: '0'};
              PostComment(
                this.memoryDataModel.nid,
                this.storyType,
                commentText,
                cid,
              );
            },
          );
        } else {
          commentText = encode_utf8(commentText);
          loaderHandler.showLoader('Editing...');
          EditComment(
            commentId,
            this.memoryDataModel.nid,
            this.storyType,
            commentText,
          );
        }
      }
    } else {
      No_Internet_Warning();
    }
    Keyboard.dismiss();
  };

  focusCommentView = () => {
    this._commentBoxRef &&
      this._commentBoxRef.focus &&
      this._commentBoxRef.focus();
  };

  togglePlayPause = (index: any) => {
    if (Utility.isInternetConnected) {
      if (index == this.state.audioFile.index) {
        this.audioPlayer.current.tooglePlayPause();
      } else {
        this.audioPlayer.current.showPlayer(index);
        this.setState({
          audioFile: {...this.state.audioFile, index: index, isPlaying: true},
        });
      }
    } else {
      No_Internet_Warning();
    }
  };

  audioView = () => {
    return (
      <View>
        <Carousel
          data={this.memoryDataModel.files.audios}
          renderItem={(file: any) => {
            return (
              <View style={[style.audioViewContainer, style.boxShadow]}>
                {((file.item.url && file.item.url != '') ||
                  (file.item.filePath && file.item.filePath != '')) && (
                  <TouchableWithoutFeedback
                    onPress={() => this.togglePlayPause(file.index)}>
                    {/* <> */}
                    <View style={style.playPauseContainer}>
                      <View style={style.playButtonContainer}>
                        {this.state.audioFile.index == file.index &&
                        this.state.audioFile.isPlaying ? (
                          <View style={style.playingSubContainer}>
                            <View style={style.playButtonStyle} />
                            <View style={style.playButtonTransparentStyle} />
                            <View style={style.playButtonStyle} />
                          </View>
                        ) : (
                          <View style={style.pauseButtonStyle} />
                        )}
                      </View>
                      <View style={style.durationContainer}>
                        <Text
                          style={[style.normalText, style.fileNameStyle]}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {file.item.title
                            ? file.item.title
                            : file.item.filename
                            ? file.item.filename
                            : ''}
                        </Text>
                        <Text style={[style.normalText, {color: Colors.black}]}>
                          {file.item.duration}
                        </Text>
                      </View>
                    </View>
                    {/* <TitleAndDescription file={file} type={kAudio} /> */}
                    {/* </> */}
                  </TouchableWithoutFeedback>
                )}
              </View>
            );
          }}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width}
        />
        {/* {this.memoryDataModel.files.audios.map((file: any, index: any) => {
          return (
           
          );
        })} */}
      </View>
    );
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

  CommonBottomSection = () => {
    return (
      <View style={style.CommonBottomSectionContainer}>
        {/* View for showing memory tags */}
        {/* {this.memoryDataModel.memoryTags.length > 0 &&  */}
        {/* <MemoryTags memoryTags={this.memoryDataModel.memoryTags}></MemoryTags>}    */}

        {/* View for showing no. of likes and comments*/}
        {/* {(this.memoryDataModel.likesComments.noOfComments > 0 || this.memoryDataModel.likesComments.showLikeCount) && <Border/>}
                {this.memoryDataModel.likesComments.noOfComments > 0 || this.memoryDataModel.likesComments.showLikeCount ? <View style={{height: 30, width: "100%", flexDirection: "row", justifyContent:"space-between", alignItems:"center"}}>
                    {this.memoryDataModel.likesComments.showLikeCount ?
                    <TouchableOpacity onPress={()=>{this.getAllLikes()}} style={{flex: 1}}>
                        {this.memoryDataModel.likesComments.noOfLikes > 0 ?
                        <Text style={[style.normalText, {color: Colors.ThemeColor, fontWeight: "500"}]}>
                        {this.memoryDataModel.likesComments.noOfLikes}{this.memoryDataModel.likesComments.noOfLikes > 1 ? " Likes": " Like"}</Text>
                        : <Text style={style.normalText}>{"Be the first to like!"}</Text>}
                    
                    </TouchableOpacity> : <View></View>}
                        {this.memoryDataModel.likesComments.noOfComments > 0 &&
                        <Text style={[style.normalText, {textAlign: "right"}]}>{this.memoryDataModel.likesComments.noOfComments}{this.memoryDataModel.likesComments.noOfComments > 1 ? " Comments": " Comment"}</Text>}
                </View> : null} */}

        <Border />

        {/* View for Like comment and share section */}
        <View style={style.likeImageContainer}>
          <Animated.View
            style={{
              transform: [{translateX: this.shakeAnimation}],
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.memoryDataModel.likesComments.noOfLikes > 0 &&
                this.memoryDataModel.likesComments.showLikeCount
                  ? this.getAllLikes()
                  : this.like();
              }}>
              <Image
                source={
                  this.memoryDataModel.likesComments.isLikedByUser
                    ? liked
                    : heart
                }
                resizeMode="contain"
              />
            </TouchableWithoutFeedback>
          </Animated.View>
          {/* <Animated.View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: 5,
              transform: [{ translateX: this.shakeAnimation }],
            }}>
            <TouchableOpacity onPress={() => this.like()}>
              <LikeView
                onPress={() =>
                  this.memoryDataModel.likesComments.noOfLikes > 0 &&
                    this.memoryDataModel.likesComments.showLikeCount
                    ? this.getAllLikes()
                    : this.like()
                }
                name={
                  this.memoryDataModel.likesComments.showLikeCount &&
                    this.memoryDataModel.likesComments.noOfLikes > 0
                    ? this.memoryDataModel.likesComments.noOfLikes +
                    (this.memoryDataModel.likesComments.noOfLikes > 1
                      ? ' Likes'
                      : ' Like')
                    : ' Like'
                }
                icon={
                  this.memoryDataModel.likesComments.isLikedByUser
                    ? icon_like_selected
                    : icon_like
                }
              />
            </TouchableOpacity>
          </Animated.View> */}
          {/* <View style={{flex: 1, justifyContent: "center"}}> 
                        {this.memoryDataModel.likesComments.viewCount > 0 && <LikeCommentShare  icon={""} name={this.memoryDataModel.likesComments.viewCount+ (this.memoryDataModel.likesComments.viewCount > 1 ? " views" : " view")}></LikeCommentShare>}
                    </View>    */}
          {/* <View>
            <TouchableWithoutFeedback
              onPress={() => this.focusCommentView()}
            >
              <View style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
                <LikeCommentShare
                  flexDirection={'flex-end'}
                  name={
                    this.memoryDataModel.likesComments.noOfComments > 0
                      ? this.memoryDataModel.likesComments.noOfComments +
                      (this.memoryDataModel.likesComments.noOfComments > 1
                        ? ' Comments'
                        : ' Comment')
                      : 'Comment'
                  }
                  icon={icon_comment}
                />
              </View>

            </TouchableWithoutFeedback>
          </View> */}
          {/* <TouchableOpacity onPress={()=>{}} style={{flexDirection : "row", flex: 1, justifyContent : "flex-end", alignItems: "center"}}>
                        <LikeCommentShare name="Share" icon={icon_share}/>
                    </TouchableOpacity> */}
        </View>

        <Border />

        {/* Hide/Show comments section */}
        {this.memoryDataModel.likesComments.noOfComments > 2 && (
          <TouchableWithoutFeedback onPress={() => this.getAllComments()}>
            <View style={{marginVertical: 10}}>
              {this.state.viewAllComments ? (
                <Text style={style.hideCommentText}>
                  {'Hide previous comments'}
                </Text>
              ) : (
                <Text style={style.hideCommentText}>
                  {'View previous comments ('}
                  {this.memoryDataModel.likesComments.noOfComments - 2}
                  {')'}
                </Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        )}

        {/* Comments placeholder */}
        {this.memoryDataModel.likesComments.noOfComments > 0 ? (
          this.prepareViewForComments()
        ) : (
          <Text style={style.noCommenttextStyle}>
            {'No comments yet, be the first to comment.'}
          </Text>
        )}
      </View>
    );
  };

  CommentBox = () => {
    return Platform.OS == 'android' ? (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        style={style.CommentBoxContainer}>
        <View style={style.CommentBoxSubContainer}>
          {/* <ImageBackground style={[style.avatar]} imageStyle={{ borderRadius: 20}} source={profile_placeholder}>
                        <Image style={{height: 40, width: 40, borderRadius: 20, alignContent: "center"}} source={Account.selectedData().profileImage != "" ? {uri : Account.selectedData().profileImage} : profile_placeholder}/>                    
                    </ImageBackground>   */}

          <TextInput
            ref={(ref: any) => (this._commentBoxRef = ref)}
            style={style.commentBoxTextInput}
            value={this.state.commentValue}
            onChangeText={text => this.setState({commentValue: text})}
            returnKeyLabel={'Enter'}
            onContentSizeChange={event => {
              this.setState({height: event.nativeEvent.contentSize.height});
            }}
            placeholder={'Write a comment..'}
            multiline={true}
            placeholderTextColor={Colors.TextColor}></TextInput>

          <TouchableWithoutFeedback onPress={() => this.postcomment()}>
            <View style={style.postContainer}>
              <Image source={icon_send} />
              <Text style={style.postStyle} autoCorrect={false}>
                {'Post'}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAwareScrollView>
    ) : (
      <KeyboardAccessory style={style.commentContainer}>
        <View style={style.CommentBoxSubContainer}>
          {/* <ImageBackground style={[style.avatar]} imageStyle={{ borderRadius: 20}} source={profile_placeholder}>
                            <Image style={{height: 40, width: 40, borderRadius: 20, alignContent: "center"}} source={Account.selectedData().profileImage != "" ? {uri : Account.selectedData().profileImage} : profile_placeholder}/>                    
                        </ImageBackground>   */}

          <TextInput
            ref={(ref: any) => (this._commentBoxRef = ref)}
            style={style.commentBoxTextInput}
            value={this.state.commentValue}
            onChangeText={text => this.setState({commentValue: text})}
            returnKeyLabel={'Enter'}
            onContentSizeChange={event => {
              this.setState({height: event.nativeEvent.contentSize.height});
            }}
            placeholder={'Write a comment..'}
            multiline={true}
            placeholderTextColor={Colors.TextColor}></TextInput>

          <TouchableWithoutFeedback onPress={() => this.postcomment()}>
            <View style={style.postContainer}>
              <Image source={icon_send} />
              <Text style={style.postStyle} autoCorrect={false}>
                {'Post'}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAccessory>
    );
  };

  renderExternalQueueItem = (item, index) => {
    let currentSelectedItem = item;
    return (
      <View style={style.externalQueueItemContainer}>
        <View style={style.renderExternalQueueItemContainer}>
          <Text style={style.collectionTitleTextSTyle}>
            {this.memoryDataModel.externalQueue.collectionTitle}
          </Text>
          <Text style={style.memoryTitleStyle}>
            {currentSelectedItem.title}
          </Text>
          {this.memoryDataModel.externalQueue.collectionType == kNews && (
            <Text style={style.fileDescriptionTextStyle}>
              {currentSelectedItem.date.length > 0
                ? currentSelectedItem.date
                : 'None'}
            </Text>
          )}
        </View>
        <View style={style.caraousalcontainerStyle}>
          <View style={style.caraousalcontainerStyle}>
            <PlaceholderImageView
              uri={currentSelectedItem.image?.thumbnail_url}
              style={style.caraousalcontainerStyle}
            />
          </View>
        </View>

        <View style={style.externalQueueItemDescriptionContainer}>
          <View style={style.descreptionSeparatorContainer} />

          {
            currentSelectedItem.description.length > 0 && (
              <>
                <RenderHtml
                  tagsStyles={{
                    p: style.RenderHtmlStyle,
                    li: style.RenderHtmlStyle,
                    span: style.RenderHtmlStyle,
                  }}
                  source={{html: currentSelectedItem.description}}
                  // ignoredDomTags={['br']}
                  enableExperimentalBRCollapsing={true}
                  contentWidth={Dimensions.get('window').width}
                  enableExperimentalMarginCollapsing={true}></RenderHtml>
                {/* <View style={style.descriptionSpaceStyle} /> */}
              </>
            )
            // <Text style={{...fontSize(18), lineHeight: 26, paddingBottom: 15, color: "#000"}}>{currentSelectedItem.description}</Text>
          }
          {/* {!(this.memoryDataModel.externalQueue.collectionType == kNews) && (
            <>
              <Border />
              <View
                style={style.flexRowMarginVerticalStyle}>
                <TitleAndValue
                  title={currentSelectedItem.details[0].title}
                  description={currentSelectedItem.details[0].value}
                />
                <TitleAndValue
                  title={currentSelectedItem.details[1].title}
                  description={currentSelectedItem.details[1].value}
                />
              </View>
              {!(
                this.memoryDataModel.externalQueue.collectionType == kSports
              ) && (
                  <>
                    <View style={style.collectionTypeContainerStyle}>
                      <TitleAndValue
                        title={currentSelectedItem.details[2].title}
                        description={currentSelectedItem.details[2].value}
                      />
                      <TitleAndValue
                        title={currentSelectedItem.details[3].title}
                        description={currentSelectedItem.details[3].value}
                      />
                    </View>
                    <View style={style.flexRowStyle}>
                      <TitleAndValue
                        title={currentSelectedItem.details[4].title}
                        description={currentSelectedItem.details[4].value}
                      />
                    </View>
                  </>
                )}
            </>
          )} */}
        </View>
      </View>
    );
  };

  onScroll(e: any) {
    let page = Math.ceil(
      e.nativeEvent.contentOffset.x / Dimensions.get('window').width,
    );
    if (page !== this.state.activeSlide) {
      if (page >= this.memoryDataModel.externalQueue.collection.length) {
        page = this.memoryDataModel.externalQueue.collection.length - 1;
      }
      this.modifyCommentsAndLikesData(page);
    }
  }

  ExternalQueue = () => {
    let currentSelectedItem =
      this.memoryDataModel.externalQueue.collection[this.state.activeSlide];
    return (
      <View style={style.TitleAndValueContainer}>
        <View style={style.container}>
          {/* <Carousel
            ref={(c: any) => {
              this._externalQueue = c;
            }}
            data={this.memoryDataModel.externalQueue.collection}
            renderItem={({item,index})=>this.renderExternalQueueItem(item,index)}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width}
            onSnapToItem={(index: any) =>
              this.modifyCommentsAndLikesData(index)
            }
          /> */}

          <FlatList
            data={this.memoryDataModel.externalQueue.collection}
            initialNumToRender={
              this.memoryDataModel.externalQueue.collection.length
            }
            renderItem={({item, index}) =>
              this.renderExternalQueueItem(item, index)
            }
            horizontal
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_item, index) => index + ''}
            onScroll={e => this.onScroll(e)}
          />
        </View>
        {currentSelectedItem.memoryTags.length > 0 && (
          <View style={style.memoryTagsMainContainerStyle}>
            <MemoryTags memoryTags={currentSelectedItem.memoryTags} />
          </View>
        )}
      </View>
    );
  };

  modifyCommentsAndLikesData = (index: any) => {
    this.setState({activeSlide: index, viewAllComments: false}, () => {
      let currentSelectedItem =
        this.memoryDataModel.externalQueue.collection[index];
      this.memoryDataModel.nid = currentSelectedItem.nid;
      this.memoryDataModel.likesComments = currentSelectedItem.likesComments;
    });
  };

  openMemoryActions = () => {
    MemoryActions = [];
    var i = 0;
    for (var value in this.memoryDataModel.actions_on_memory) {
      i += 1;
      switch (value) {
        case MemoryActionKeys.addToCollection:
          MemoryActions.push({
            index: i,
            text: this.memoryDataModel.actions_on_memory[value],
            image: add_icon_small,
            nid: this.memoryDataModel.nid,
            memoryType: this.storyType,
            actionType: MemoryActionKeys.addToCollection,
            uid: this.memoryDataModel.userDetails.uid,
          });
          break;
        case MemoryActionKeys.blockUserKey:
          MemoryActions.push({
            index: i,
            text: this.memoryDataModel.actions_on_memory[value],
            image: block_user,
            nid: this.memoryDataModel.nid,
            memoryType: this.storyType,
            actionType: MemoryActionKeys.blockUserKey,
            uid: this.memoryDataModel.userDetails.uid,
            isDestructive: 1,
          });
          break;
        case MemoryActionKeys.reportMemoryKey:
          MemoryActions.push({
            index: i,
            text: this.memoryDataModel.actions_on_memory[value],
            image: report_user,
            nid: this.memoryDataModel.nid,
            memoryType: this.storyType,
            actionType: MemoryActionKeys.reportMemoryKey,
            isDestructive: 1,
          });
          break;
        case MemoryActionKeys.blockAndReportKey:
          MemoryActions.push({
            index: i,
            text: this.memoryDataModel.actions_on_memory[value],
            image: block_and_report,
            nid: this.memoryDataModel.nid,
            memoryType: this.storyType,
            actionType: MemoryActionKeys.blockAndReportKey,
            uid: this.memoryDataModel.userDetails.uid,
            isDestructive: 1,
          });
          break;
        case MemoryActionKeys.editMemoryKey:
          MemoryActions.push({
            index: i,
            text: this.memoryDataModel.actions_on_memory[value],
            image: edit_memory,
            nid: this.memoryDataModel.nid,
            memoryType: this.storyType,
            actionType: MemoryActionKeys.editMemoryKey,
          });
          break;
        case MemoryActionKeys.deleteMemoryKey:
          MemoryActions.push({
            index: i,
            text: this.memoryDataModel.actions_on_memory[value],
            image: delete_memory,
            nid: this.memoryDataModel.nid,
            memoryType: this.storyType,
            actionType: MemoryActionKeys.deleteMemoryKey,
          });
          break;
        case MemoryActionKeys.moveToDraftKey:
          MemoryActions.push({
            index: i,
            text: this.memoryDataModel.actions_on_memory[value],
            image: move_to_draft,
            nid: this.memoryDataModel.nid,
            memoryType: this.storyType,
            actionType: MemoryActionKeys.moveToDraftKey,
          });
          break;
        case MemoryActionKeys.removeMeFromThisPostKey:
          MemoryActions.push({
            index: i,
            text: this.memoryDataModel.actions_on_memory[value],
            image: remove_me_from_this_post,
            nid: this.memoryDataModel.nid,
            memoryType: this.storyType,
            actionType: MemoryActionKeys.removeMeFromThisPostKey,
          });
          break;
        case MemoryActionKeys.blockMemoryKey:
          MemoryActions.push({
            index: i,
            text: this.memoryDataModel.actions_on_memory[value],
            image: block_memory,
            nid: this.memoryDataModel.nid,
            memoryType: this.storyType,
            actionType: MemoryActionKeys.blockMemoryKey,
          });
          break;
      }
    }
    let cancelButtonIndex = MemoryActions.length;
    MemoryActions.push({
      index: cancelButtonIndex,
      text: 'Cancel',
      image: cancelActions,
      actionType: MemoryActionKeys.cancelActionKey,
    });
    this._actionSheet && this._actionSheet.showSheet();
    this.setState({showMemoryActions: true}, () => {
      Keyboard.dismiss();
    });
    // setTimeout(() => {
    // }, 1000);
  };

  onActionItemClicked = async (index: number, data: any): void => {
    switch (data.actionType) {
      case MemoryActionKeys.addToCollection:
        this._addToCollection(data.nid);
        break;
      case MemoryActionKeys.editMemoryKey:
        loaderHandler.showLoader('Loading');
        let details: any = {
          action_type: MemoryActionKeys.moveToDraftKey,
          type: this.storyType,
          id: data.nid,
        };
        let userdata = await Storage.get('userData');

        let response = await MemoryService(
          `https://${Account.selectedData().instanceURL}/api/actions/memory`,
          [
            {
              'X-CSRF-TOKEN': userdata.userAuthToken,
              'Content-Type': 'application/json',
            },
            {configurationTimestamp: '0', details},
          ],
        )
          .then((response: Response) => response.json())
          .catch((err: Error) => {
            Promise.reject(err);
          });
        if (response.ResponseCode == 200) {
          this._onEditMemory(data.nid);
        } else {
          loaderHandler.hideLoader();
        } // _onEditMemory(data, data.nid);
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

  _addToCollection = (nid?: any) => {
    if (Utility.isInternetConnected) {
      this.props.navigation.navigate('memoryCollectionList', {
        isFromMemoryAction: true,
        nid: nid,
      });
    } else {
      No_Internet_Warning();
    }
  };

  _onEditMemory = (nid?: any) => {
    // event = event.nativeEvent;
    // this.getDraftDetails(event)
    if (Utility.isInternetConnected) {
      loaderHandler.showLoader();
      if (nid) {
        this.props.navigation.navigate('createMemory', {
          editMode: true,
          draftNid: nid,
          editPublsihedMemory: true,
        });
      } else {
        this.props.navigation.navigate('createMemory', {
          editMode: true,
          draftNid: nid,
          // draftNid: event.nid,
          editPublsihedMemory: true,
        });
      }
    } else {
      No_Internet_Warning();
    }
  };

  memoryActionCallBack = (
    fetched: boolean,
    responseMessage: any,
    nid?: any,
    type?: any,
  ) => {
    if (this.props?.route?.name == 'memoryDetails') {
      loaderHandler.hideLoader();
      if (fetched) {
        if (type == MemoryActionKeys.removeMeFromThisPostKey) {
          delete this.memoryDataModel.actions_on_memory
            .remove_me_from_this_post;
        } else {
          this._onBack();
        }
      } else {
        ToastMessage(responseMessage, Colors.ErrorColor);
      }
    }
  };

  get pagination() {
    let activeSlide = this.state.activeSlide;
    return (
      <Pagination
        dotsLength={this.memoryDataModel.externalQueue.collection.length}
        activeDotIndex={activeSlide}
        containerStyle={{backgroundColor: Colors.transparent}}
        dotStyle={style.dotStyle}
        inactiveDotStyle={style.inactiveDotStyle}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  InternalQueue = () => {
    // console.log("descmem :", this.memoryDataModel.memory.description)
    return (
      <View style={style.InternalQueueContainer}>
        <Text style={style.memoryTitleStyle}>
          {this.memoryDataModel.memory.memoryTitle}
        </Text>

        <Border width={'100%'} paddingLeft={16} paddingTop={8} />
        <Text style={[style.normalText, {marginVertical: 8}]}>
          A memory from{' '}
          <Text style={{color: Colors.newDescTextColor}}>
            {this.memoryDataModel.memory.memoryDateDisplay}
          </Text>
          {'\n'}Published on{' '}
          <Text style={{color: Colors.newDescTextColor}}>
            {this.memoryDataModel.userDetails.createdOn}
          </Text>
        </Text>

        <Border width={'100%'} marginBottom={16} paddingLeft={16} />
        {/* <View style={style.descreptionContainer} /> */}

        {/* <View style={{flexDirection: 'row'}}>
          {this.memoryDataModel.memory.whoElseWasThere.length > 0 ? (
            <TouchableOpacity
              onPress={() => this.showList(this.keyTagged)}
              disabled={
                this.memoryDataModel.memory.youWhereThere &&
                this.memoryDataModel.memory.whoElseWasThere.length == 0
              }>
              {this.memoryDataModel.memory.youWhereThere &&
              this.memoryDataModel.memory.whoElseWasThere.length == 0 ? (
                <Text style={style.normalText}>{'You were also there '}</Text>
              ) : (
                <Text
                  style={{
                    ...fontSize(16),
                    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                    color: Colors.NewTitleColor,
                  }}>
                  {this.memoryDataModel.memory.youWhereThere && (
                    <Text style={style.normalText}>{'You and '}</Text>
                  )}
                  {this.memoryDataModel.memory.whoElseWasThere.length}
                  {this.memoryDataModel.memory.whoElseWasThere.length > 1
                    ? ' others'
                    : ' other'}
                  <Text style={style.normalText}>
                    {this.memoryDataModel.memory.whoElseWasThere.length > 1
                      ? ' were '
                      : ' was '}
                    {'also there '}
                  </Text>
                </Text>
              )}
            </TouchableOpacity>
          ) : this.memoryDataModel.memory.youWhereThere &&
            this.memoryDataModel.memory.whoElseWasThere.length == 0 ? (
            <Text style={style.normalText}>{'You were also there '}</Text>
          ) : null}
          {this.memoryDataModel.memory.memoryReadTime.length > 0 &&
            (this.memoryDataModel.memory.whoElseWasThere.length > 0 ||
              this.memoryDataModel.memory.youWhereThere) && (
              <Text style={style.normalText}>{'| '}</Text>
            )}
          {this.memoryDataModel.memory.memoryReadTime.length > 0 && (
            <Text style={[style.normalText, {marginBottom: 5}]}>
              {this.memoryDataModel.memory.memoryReadTime}
            </Text>
          )}

          {(this.memoryDataModel.memory.memoryReadTime.length > 0 ||
            this.memoryDataModel.memory.whoElseWasThere.length > 0 ||
            this.memoryDataModel.memory.youWhereThere) &&
            this.memoryDataModel.likesComments.viewCount > 0 && (
              <Text style={style.normalText}>{' | '}</Text>
            )}

          {this.memoryDataModel.likesComments.viewCount > 0 && (
            <Text style={style.normalText}>
              {this.memoryDataModel.likesComments.viewCount +
                (this.memoryDataModel.likesComments.viewCount > 1
                  ? ' views'
                  : ' view')}
            </Text>
          )}
        </View> */}

        {/* {this.memoryDataModel.memory.collaborators.length > 0 && (
          <TouchableOpacity
            onPress={() => this.toggleCollaboratorView()}
            style={{flexDirection: 'row', paddingBottom: 5, paddingTop: 5}}>
            <Text
              style={{
                fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                fontSize: 16,
                color: Colors.newDescTextColor,
              }}>
              {this.state.collaboratorsVisibility
                ? 'Hide collaborators '
                : 'Show collaborators '}
              {'(' + this.memoryDataModel.memory.collaborators.length + ')  '}
            </Text>
            <Text
              style={{
                ...fontSize(18),
                fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                color: Colors.ThemeColor,
                transform: [
                  {
                    rotate: this.state.collaboratorsVisibility
                      ? '-90deg'
                      : '90deg',
                  },
                ],
              }}>
              {'>'}
            </Text>
          </TouchableOpacity>
        )}

        {this.state.collaboratorsVisibility && (
          <CollaboratorView
            collaborators={
              this.memoryDataModel.memory.collaborators
            }></CollaboratorView>
        )} */}

        {this.memoryDataModel.memory.description.length > 0 && (
          <>
            {/* <Border /> */}
            {/* <HTML
              tagsStyles={{ p: { ...fontSize(18), marginBottom: 10, fontFamily: fontFamily.Inter, fontWeight: '400', lineHeight: 24 } }}
              html={this.memoryDataModel.memory.description}
              style={HTMLStyleSheet}></HTML> */}
            <RenderHtml
              tagsStyles={{
                p: style.RenderHtmlStyle,
                li: style.RenderHtmlStyle,
                span: style.RenderHtmlStyle,
              }} //Colors.newDescTextColor
              source={{html: this.memoryDataModel.memory.description}}
              // ignoredDomTags={['br']}

              contentWidth={Dimensions.get('window').width}
              enableExperimentalBRCollapsing={true}
              enableExperimentalMarginCollapsing={true}></RenderHtml>
            <View style={style.descriptionSpaceStyle} />
          </>
        )}

        {/* {this.memoryDataModel.collection_list.length > 0 && (
          <View style={style.memoryDataModelCollectionList}>
            <Text style={style.normalText}>
              {'Collections '}
            </Text>
            <FlatList
              horizontal={true}
              ItemSeparatorComponent={() => <View style={{ width: 15 }}></View>}
              data={this.memoryDataModel.collection_list}
              renderItem={(item: any) => {
                return (
                  <View
                    style={style.collectionContainer}
                  >
                    <Text style={{ color: Colors.newTextColor }}>
                      {item.item.name}
                    </Text>
                  </View>
                )
              }}
              keyExtractor={item => item.id}
            />

          </View>
        )} */}
      </View>
    );
  };

  onNavigationStateChange(event: any) {
    if (event.title) {
      let htmlHeight = 70;
      if (Number(event.target)) {
        htmlHeight = Number(event.target) + htmlHeight;
      } else if (Number(event.title)) {
        htmlHeight = Number(event.title) + htmlHeight;
      } else {
        htmlHeight = htmlHeight + 500;
      }
      this.setState({webViewHeight: htmlHeight});
    }
  }

  render() {
    return (
      <SafeAreaView style={style.container}>
        <>
          {this.state.memoryDetailAvailable && (
            <NavigationHeaderSafeArea
              heading={''}
              cancleText={'Back'}
              showCommunity={false}
              cancelAction={() => this.props.navigation.goBack()}
              showRightText={false}
              isWhite={true}
              rightText={
                this.memoryDataModel.userDetails.name == 'You'
                  ? 'Edit\nMemory'
                  : ''
              }
              backIcon={backArrow}
              rightIcon={
                this.memoryDataModel.userDetails.name == 'You' ? penEdit : null
              }
              saveValues={() => {
                if (this.memoryDataModel.userDetails.name == 'You') {
                  this.onActionItemClicked(0, {
                    nid: this.memoryDataModel.nid,
                    actionType: MemoryActionKeys.editMemoryKey,
                  });
                }
              }}
            />
            // <UserDetails
            //   userDetails={this.memoryDataModel.userDetails}
            //   shareDetails={this.memoryDataModel.shareOption}
            //   isExternalQueue={
            //     this.state.isExternalQueue ||
            //     this.storyType.indexOf('song') != -1
            //       ? true
            //       : false
            //   }
            //   deepLinkBackClick={this.props.deepLinkBackClick}
            //   storyType={this.storyType}
            //   onPressCallback={this.openMemoryActions}
            //   previewDraft={this.props.previewDraft}
            // />
          )}
          {/* {this.state.memoryDetailAvailable && <UserDetails userDetails={this.memoryDataModel.userDetails} shareDetails={this.memoryDataModel.shareOption} isExternalQueue={this.state.isExternalQueue || this.storyType.indexOf('song') != -1 ? true : false} storyType={this.storyType}/>} */}
          <StatusBar
            barStyle={
              Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
            }
            backgroundColor={Colors.NewThemeColor}
          />
          {/* {MemoryBasicDetails(
            this.memoryDataModel.userDetails,
            this.memoryDataModel,
            this.openMemoryActions,
            ListType.Recent,
          )} */}

          {/* <View style={style.descreptionSeparatorContainer} /> */}

          {/* <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} /> */}
          {this.state.memoryDetailAvailable && (
            <View style={style.memoryDetailAvailable}>
              {this.state.isExternalQueue &&
                this.memoryDataModel.externalQueue.collection.length > 1 && (
                  <View style={style.externalQueue}>{this.pagination}</View>
                )}

              <KeyboardAwareScrollView
                enableResetScrollToCoords={false}
                enableAutomaticScroll={true}
                style={
                  {
                    // marginBottom: Platform.OS == 'android' && this.state.bottomToolbar == 0
                    //   ? 150 : Platform.OS == 'ios' ? 150 : -300
                  }
                }
                keyboardShouldPersistTaps={'always'}
                enableOnAndroid={false}
                onTouchStart={() => Keyboard.dismiss()}
                ref={(ref: any) => (this._scrollView = ref)}>
                <UserDetails
                  userDetails={this.memoryDataModel.userDetails}
                  shareDetails={this.memoryDataModel.shareOption}
                  isExternalQueue={
                    this.state.isExternalQueue ||
                    this.storyType.indexOf('song') != -1
                      ? true
                      : false
                  }
                  deepLinkBackClick={this.props.deepLinkBackClick}
                  storyType={this.storyType}
                  onPressCallback={this.openMemoryActions}
                  previewDraft={this.props.previewDraft}
                />

                {/* <View style={{ height: 15 }} /> */}
                {/* Render Attachments */}
                {this.storyType.indexOf('song') != -1 ? (
                  <ScrollView>
                    <WebView
                      useWebKit={true}
                      ref={(ref: any) => (this._webView = ref)}
                      style={[
                        style.storyType,
                        {
                          height:
                            Platform.OS === 'android'
                              ? this.state.webViewHeight
                              : 400,
                        },
                      ]}
                      source={{uri: this.memoryDataModel.spotify_url}}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                      startInLoadingState={true}
                      onNavigationStateChange={this.onNavigationStateChange.bind(
                        this,
                      )}></WebView>
                  </ScrollView>
                ) : (
                  <>
                    <CarousalFilesView
                      files={this.memoryDataModel.files.images}
                      type={kImage}
                    />
                    {this.audioView()}
                    <CarousalFilesView
                      files={this.memoryDataModel.files.pdf}
                      type={kPDF}
                    />
                    {/* <FilesView
                      files={this.memoryDataModel.files.pdf}
                      type={kPDF}
                    /> */}
                  </>
                )}

                {/* <ShowSharedaetilsDetails
                  userDetails={this.memoryDataModel.userDetails}
                  shareDetails={this.memoryDataModel.shareOption}
                  deepLinkBackClick={this.props.deepLinkBackClick}
                  storyType={this.storyType}
                  memoryDetails={this.memoryDataModel}
                  onActionItemClicked={(data) => this.onActionItemClicked(0, data)}
                  renderLikeView={(<Animated.View
                    style={{

                      transform: [{ translateX: this.shakeAnimation }],
                    }}>
                    <TouchableWithoutFeedback onPress={() => { this.memoryDataModel.likesComments.noOfLikes > 0 && this.memoryDataModel.likesComments.showLikeCount ? this.getAllLikes() : this.like() }}>
                      <Image source={this.memoryDataModel.likesComments.isLikedByUser ? liked : heart} resizeMode="contain" />
                    </TouchableWithoutFeedback>
                  </Animated.View>)}
                /> */}
                {/* Render Desc and title */}
                {this.state.isExternalQueue
                  ? this.ExternalQueue()
                  : this.InternalQueue()}

                {/* <View style={style.paddingHorizontal}>
                  {this.memoryDataModel.memoryTags.length > 0 && (
                    <MemoryTags
                      memoryTags={this.memoryDataModel.memoryTags}></MemoryTags>
                  )}
                </View> */}
                {/* Includes memory tags and like comment share section */}
                {/* {!this.props.previewDraft && this.CommonBottomSection()} */}

                {/* If memory is associated with any collection */}
                {/* {!this.props.previewDraft &&
                  this.memoryDataModel.collection_list.length > 0 && (
                    <MemoryCollections
                      collectionList={this.memoryDataModel.collection_list}
                      selectedCollectionIndex={
                        this.state.selectedCollectionIndex
                      }
                      changeIndex={(index: any) =>
                        this.setState({ selectedCollectionIndex: index })
                      }></MemoryCollections>
                  )} */}

                {/* Blank view for extended scrolling */}
                {
                  <View
                    style={{
                      height:
                        (Platform.OS == 'ios'
                          ? this.state.bottomToolbar == 0
                            ? 110
                            : 80
                          : 0) +
                        (this.state.isExternalQueue ? 60 : 0) +
                        (this.state.height ? this.state.height * 0.5 : 0),
                      width: 100,
                    }}></View>
                }

                {/* Common comment box for all sections */}
                {/* {!this.props.previewDraft &&
                  this.state.memoryDetailAvailable &&
                  this.CommentBox()} */}
              </KeyboardAwareScrollView>
            </View>
          )}
          {/* Common comment box for all sections */}
          {/* {!this.props.previewDraft &&
            this.state.memoryDetailAvailable &&
            this.CommentBox()} */}
          <View style={style.absoluteView}></View>
          <AudioPlayer
            ref={this.audioPlayer}
            playerCallback={(event: any) => this.playerCallback(event)}
            files={this.memoryDataModel.files.audios}
            memoryTitle={this.memoryDataModel.memory.memoryTitle}
            // by={'by ' + this.memoryDataModel.userDetails.name}
          ></AudioPlayer>
          <MemoryActionsSheet
            ref={ref => (this._actionSheet = ref)}
            width={DeviceInfo.isTablet() ? '65%' : '100%'}
            actions={MemoryActions}
            memoryActions={true}
            onActionClick={this.onActionItemClicked.bind(this)}
          />
        </>

        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
          style={style.linearGradStyle}></LinearGradient>
      </SafeAreaView>
    );
  }
}
