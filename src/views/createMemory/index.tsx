import React, { createRef } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ActionSheet, { ActionSheetItem } from '../../common/component/actionSheet';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import Text from '../../common/component/Text';
import {
  Colors,
  ConsoleType,
  decode_utf8,
  DraftActions,
  GenerateRandomID,
  showConsoleLog,
} from '../../common/constants';
import { MindPopAttachment } from '../../common/database/mindPopStore/mindPopStore';
import EventManager from '../../common/eventManager';
import { Account } from '../../common/loginStore';
import Utility from '../../common/utility';
import {
  action_audio,
  action_camera,
  action_close,
  camera,
  delete_icon,
  edit_icon,
  icon_collaborators,
  icon_upload_file,
  pdf_icon,
  profile_placeholder,
  publish_memory_draft,
  record,
  save_memory_draft,
} from '../../images';
import { TempFile } from '../mindPop/edit';
import EtherPadEditing from './etherpadWebView';
import { kSaveDraft, kShowHideMenu } from './header';
import styles from './styles';
// @ts-ignore
import { connect } from 'react-redux';
import {
  CaptureImage,
  PickImage,
} from '../../common/component/filePicker/filePicker';
import PlaceholderImageView from '../../common/component/placeHolderImageView';
import { No_Internet_Warning, ToastMessage } from '../../common/component/Toast';
import { MemoryDataModel } from '../memoryDetails/memoryDataModel';
import {
  CreateUpdateMemory,
  DeleteDraftService,
  GetDraftsDetails,
  kDeleteDraftCreateMemo,
  kDraftDetailsFetched,
  kFilesUpdated,
  UpdateAttachments,
} from './createMemoryWebService';
import {
  CreateMemoryHelper,
  DefaultCreateMemoryObj,
  getUserName,
} from './dataHelper';
import { kCollaborators, kTags, kWhoElseWhereThere } from './publish';
import {
  EditContent,
  MemoryInitialsUpdate,
  NavigateToDashboard,
  ResetALL,
  ResetLocation,
  SaveAttachedFile,
  SaveDescription,
  SaveNid,
  showCustomAlert,
  showCustomAlertData,
} from './reducer';
import {
  CollectinAPI,
  EtherPadContentAPI,
  kRecentTags,
  LocationAPI,
  MemoryTagsAPI,
} from './saga';
//@ts-ignore
// import DefaultPreference from 'react-native-default-preference';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import { MemoryDraftsDataModel } from '../myMemories/MemoryDrafts/memoryDraftsDataModel';
//@ts-ignore
import { DatePickerOptions } from '@react-native-community/datetimepicker';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import DateTimePicker from '../../common/component/DateTimePicker';

import moment from 'moment';
import { arrowRight, calendarWrite, image } from '../../../app/images';
import CustomAlert from '../../common/component/customeAlert';
import {
  CreateAMemory,
  GET_MEMORY_LIST,
  ListType,
} from '../dashboard/dashboardReducer';
import DatePicker from './../../common/component/datePicker';
import Styles from './styles';

export const createNew = 'Create New';
export const editDraft = 'Edit Draft';
export const kPublish = 'publish';

type Props = { [x: string]: any };
type State = {
  [x: string]: any;
};

enum TempFileStatus {
  needsToUpload = 'needsToUpload',
  deleted = 'deleted',
  uploaded = 'uploaded',
}

type menuOption = { key: number; title: any; onPress: () => void; color?: any };

type ItemList = {
  id: any;
  date: any;
  by: any;
  uri: any;
  tempFile: boolean;
  fileType: any;
  title: string;
  description: string;
  file: any;
};

// const ImageActions: Array<ActionSheetItem> = [
//   { index: 0, text: 'Image', image: action_camera },
//   { index: 1, text: 'Audio', image: action_audio },
//   { index: 2, text: 'PDF', image: action_pdf },
//   { index: 3, text: 'Cancel', image: action_close },
// ];

const ImageActions: Array<ActionSheetItem> = [
  { index: 0, text: 'No, discard memory', image: action_camera },
  { index: 1, text: 'Yes, save as draft', image: action_audio },
  { index: 2, text: 'Cancel', image: action_close },
];

const mindpopActions: Array<ActionSheetItem> = [
  { index: 0, text: 'No, discard memory', image: action_camera },
  { index: 1, text: 'Yes, save as MindPop', image: action_audio },
  { index: 2, text: 'Cancel', image: action_close },
];

const publishActions: Array<ActionSheetItem> = [
  { index: 3, text: 'Yes, publish memory', image: action_camera },
  { index: 1, text: 'Not quite, save as draft', image: action_audio },
  { index: 2, text: 'Cancel', image: action_close },
];

const SaveActions: Array<ActionSheetItem> = [
  { index: 4, text: 'Save and Exit', image: save_memory_draft },
  { index: 5, text: 'Prepare to publish', image: publish_memory_draft },
  { index: 3, text: 'Cancel', image: action_close },
];

export const months = [
  { name: 'Jan', tid: 1 },
  { name: 'Feb', tid: 2 },
  { name: 'Mar', tid: 3 },
  { name: 'Apr', tid: 4 },
  { name: 'May', tid: 5 },
  { name: 'Jun', tid: 6 },
  { name: 'Jul', tid: 7 },
  { name: 'Aug', tid: 8 },
  { name: 'Sep', tid: 9 },
  { name: 'Oct', tid: 10 },
  { name: 'Nov', tid: 11 },
  { name: 'Dec', tid: 12 },
];

export const MonthObj: any = {
  serverMonthsCount: 0,
  selectedIndex: 0,
  month: months,
};

class CreateMemory extends React.Component<Props> {
  showHideMenuListener: EventManager;
  saveDraftListener: EventManager;
  createMemoryHelper: any;
  _actionSheet: any | ActionSheet = createRef();
  _mainItemList: any = null;
  kUploadAction: 'uploadAction';
  kSaveAction: 'saveAction';

  moment: string;
  //InputRef reference
  _inputRef: TextInput | any;
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;

  dateOptions: DatePickerOptions = {
    display: 'calendar',
    maximumDate: new Date(),
    value: new Date(),
    minimumDate: new Date(1917, 1, 1),
    onChange: (event, date) => {
      this.setState({
        showCalender: false,
        memory_date: moment(date).format('DD/MM/YYYY'),
      });
    },
  };

  //Files array list
  files: Array<MindPopAttachment & { type: string; uri: string }>;

  newMemoryYears = new CreateMemoryHelper().getDateOptions(
    'year',
    new Date().getFullYear(),
  );

  //Component default state
  currentDate = new Date();
  etherpadUrl: string = '';
  state: State = {
    menuVisibility: false,
    actionSheet: {
      title: '',
      type: '',
      list: ImageActions,
    },
    itemList: [],
    year: {
      value: this.currentDate.getFullYear().toString(),
      error: false,
    },
    month: {
      value: MonthObj.month[this.currentDate.getMonth()],
      error: false,
    },
    day: {
      value: this.currentDate.getDate(),
    },
    memory_date:
      '' +
      new Date().getDate() +
      '/' +
      (new Date().getMonth() + 1) +
      '/' +
      new Date().getFullYear(),
    dateError: '',
    locationError: '',
    locationText: '',
    showDay: true,
    location: { description: '', reference: '' },
    selectionData: {
      actions: [],
      selectionValue: '',
      fieldName: '',
      title: '',
    },
    title: '',
    titleError: '',
    bottomToolbar: 0,
    isCreatedByUser: true,
    taggedCount: 0,
    collaboratorOwner: '',
    memoryDraftVisibility: false,
    showActionAndroid: false,
    padDetails: {},
    showCustomAlert: false,
    showCalender: false,
    showEtherPad: true,
    placeholder: 'Tap to title your memory...',
  };

  isEdit: boolean = false;
  // filePathsToUpload: string[];

  filesToUpdate: Array<any> = [];
  listener: EventManager;
  backListner: EventManager;
  bottomPicker: React.RefObject<BottomPicker> = React.createRef<BottomPicker>();
  memoryCallback: EventManager;
  deleteDraftListener: EventManager;
  initialSaveManager: EventManager;
  updateFilesListener: EventManager;
  draftDetailsListener: EventManager;
  constructor(props: Props) {
    super(props);
    this.createMemoryHelper = new CreateMemoryHelper();

    // this.showHideMenuListener = EventManager.addListener(
    //   kShowHideMenu,
    //   this.showMenu,
    // );
    // this.saveDraftListener = EventManager.addListener(
    //   kSaveDraft,
    //   this.saveDraft,
    // );
    // this.memoryCallback = EventManager.addListener(
    //   'createMemoryMainListener',
    //   this.memorySaveCallback,
    // );
    // this.deleteDraftListener = EventManager.addListener(
    //   kDeleteDraftCreateMemo,
    //   this.deleteDraftCallback,
    // );
    // this.updateFilesListener = EventManager.addListener(
    //   kFilesUpdated,
    //   this.fileUpdateCallback,
    // );
    // this.draftDetailsListener = EventManager.addListener(
    //   kDraftDetailsFetched,
    //   this.draftDetailsCallBack,
    // );

    if (Platform.OS == 'android') {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._keyboardDidHide,
      );
    } else {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardWillShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardWillHide',
        this._keyboardDidHide,
      );
    }
    MonthObj.selectedIndex =
      this.currentDate.getMonth() + MonthObj.serverMonthsCount;
    this.backListner = EventManager.addListener(
      'hardwareBackPress',
      this.cancelAction,
    );
  }

  deleteDraftCallback = (success: any) => {
    loaderHandler.hideLoader();
    if (success) {
      loaderHandler.showLoader();
      this.props.navigation.navigate('dashBoard');
    } else {
      ToastMessage('Unable to delete draft. Please try again later');
    }
  };

  draftDetailsCallBack = (success: any, draftDetails: any) => {
    if (success) {
      draftDetails = new MemoryDraftsDataModel().getEditContentObject(
        draftDetails,
      );
      this.props.setEditContent(draftDetails);
      MonthObj.month.forEach((element: any, index: any) => {
        if (element.name == draftDetails.date.month) {
          MonthObj.selectedIndex = index;
        }
      });

      // date.setFullYear(draftDetails.date.year);
      // date.setMonth(MonthObj.selectedIndex - MonthObj.serverMonthsCount)
      // date.setDate(draftDetails.date.day)
      // let date = new Date();
      // if(draftDetails.date.year == date.getFullYear() && MonthObj.selectedIndex == date.getMonth() + MonthObj.serverMonthsCount && draftDetails.date.day > date.getDate()){
      // 	// Alert.alert("Date error")
      // 	draftDetails.date.day = date.getDate();
      // }
      let newMemoryDate = draftDetails.memory_date
        ? new Date(parseInt(draftDetails.memory_date) * 1000).getDate() +
        '/' +
        (new Date(parseInt(draftDetails.memory_date) * 1000).getMonth() + 1) +
        '/' +
        new Date(parseInt(draftDetails.memory_date) * 1000).getFullYear()
        : '';
      this.setState(
        {
          title: decode_utf8(draftDetails.title),
          locationText: draftDetails.location.description,
          itemList: draftDetails.files,
          year: { ...this.state.year, value: draftDetails.date.year },
          month: {
            ...this.state.month,
            value: MonthObj.month[MonthObj.selectedIndex],
          },
          day: {
            ...this.state.day,
            value: draftDetails.date.day > 0 ? draftDetails.date.day : 'Day',
          },
          memory_date: newMemoryDate ? newMemoryDate : '',
          showDay: draftDetails.date.day > 0 ? true : false,
          isCreatedByUser:
            draftDetails.isCreatedByUser.uid == Account.selectedData().userID,
          padDetails: draftDetails.etherpad_details,
          ownerDetails: draftDetails.isCreatedByUser,
          youWhereThere: draftDetails.youWhereThere,
          taggedCount: draftDetails.taggedCount,
          collaboratorOwner: draftDetails.collaboratorOwner,
        },
        () => {
          this.setEtherPadContent(
            'get',
            '',
            draftDetails.etherpad_details.padId,
          );
        },
      );
      // if(!(draftDetails.isCreatedByUser.uid == Account.selectedData().userID)){
      // 	CollaboratorActionAPI({nid : this.props.draftNid,
      // 		id : Account.selectedData().userID,
      // 		action_type: CollaboratorsAction.joinCollaboration})
      // }
    } else {
      ToastMessage(draftDetails, Colors.ErrorColor);
    }
    setTimeout(() => {
      loaderHandler.hideLoader();
    }, 500);
  };

  componentDidMount = async () => {
    this.props.setCreateMemory(true);
    // DefaultPreference.get('hide_memory_draft').then((value: any) => {
    //   if (value == 'true') {
    //     this.state.memoryDraftVisibility = false;
    //   } else {
    //     this.state.memoryDraftVisibility = true;
    //   }
    // });

    this.props.resetAll();
    let recentTag = { searchType: kRecentTags, searchTerm: '' };
    if (this.props.route.params.editMode) {
      loaderHandler.showLoader('Loading...');
      let response: any = await GetDraftsDetails(
        this.props.route.params.draftNid,
      );

      this.draftDetailsCallBack(response.status, response.responseData);
    } else {
      let title = decode_utf8(this.props.route.params.textTitle);
      title = title.replace(/\n/g, ' ');
      if (title.length > 150) {
        title = title.substring(0, 150);
      }
      // this.setEtherPadContent("set", description);
      this.setState(
        {
          itemList: this.props.route.params.attachments,
          padDetails: this.props.route.params.padDetails,
          title: decode_utf8(this.props.route.params.textTitle),
          location: this.props.route.params.location,
          year: {
            ...this.state.year,
            value: this.props.route.params.memoryDate.year,
          },
          month: {
            ...this.state.month,
            value:
              MonthObj.month[
              this.currentDate.getMonth() + MonthObj.serverMonthsCount
              ],
          },
          isCreatedByUser: true,
          date: {
            ...this.state.day,
            value: this.props.route.params.memoryDate.day,
          },
        },
        () => {
          this.props.setNid(this.props.route.params.id);
          this.setEtherPadContent(
            'get',
            '',
            this.props.route.params.padDetails.padId,
          );
        },
      );
    }
    // // this.setEtherPadContent('set', decode_utf8(this.props.textTitle), this.props.padDetails.padId);
    // this.props.recentTags(recentTag);
    // this.props.collectionAPI();
  };

  setEtherPadContent(type: any, description: any, padId?: any) {
    try {
      this.props.etherpadContentUpdate({
        padId: padId ? padId : this.state.padDetails.padId,
        content: description,
        type: type,
      });
    } catch (error) { }
  }

  memorySaveCallback = (success: any, id?: any, padId?: any, key?: any) => {
    // loaderHandler.hideLoader();

    // showConsoleLog(ConsoleType.LOG,'dataaaaa : ', JSON.stringify(success), id, key);
    if (success) {
      // EventManager.callBack('showConfetti');
      if (key == kPublish) {
        this.props.showAlertCall(true);
        this.props.showAlertCallData({
          title: 'Memory published! 🎉',
          desc: `Nice work writing Shakespeare! Your new memory has been published!`,
        });
        // this.props.navigateToDashboard(true);
        // this.props.fetchMemoryList({ type: ListType.Recent, isLoading: true });

        showConsoleLog(ConsoleType.INFO, "memory published successfully")
        // loaderHandler.showLoader();
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: 'dashBoard' }],
        });
        // Alert.alert(
        //   'Memory published! 🎉',
        //   `Nice work writing Shakespeare! Your new memory has been published!`,
        //   [
        //     {
        //       text: 'Ok',
        //       style: 'default',
        //       onPress: () => {
        //       },
        //     },
        //   ],
        // );

        // Actions.dashBoard();
      } else if (this.props.route.params.editPublsihedMemory) {
        this.props.showAlertCall(true);
        this.props.showAlertCallData({
          title: 'Memory saved',
          desc: `Your memory has been saved.`,
        });
        // Actions.replace('writeTabs', {
        //   showPublishedPopup: true,
        //   title: 'Memory saved',
        //   desc: `Your memory has been saved.`,
        // });
        // Alert.alert('Memory saved', `Your memory has been saved.`, [
        //   {
        //     text: 'Ok',
        //     style: 'default',
        //     onPress: () => {

        //     },
        //   },
        // ]);
        Keyboard.dismiss();
        // this.props.fetchMemoryList({ type: ListType.Recent, isLoading: true });
        // this.props.fetchMemoryList({ type: ListType.Timeline, isLoading: true });
        // EventManager.callBack('memoryUpdateRecentListener');
        // EventManager.callBack('memoryUpdateTimelineListener');
        // EventManager.callBack('memoryUpdatePublishedListener');
        // EventManager.callBack('memoryDetailsListener');
        this.props.navigation.replace('writeTabs');
        // this.props.navigation.writeTabs();
        // loaderHandler.showLoader();
      } else {
        this.props.showAlertCall(true);
        this.props.showAlertCallData({
          title: 'New draft saved!',
          desc: `You can see your new draft added with the rest of your in-progress work now.`,
        });
        this.props.navigation.replace('writeTabs', {
          showPublishedPopup: true,
          title: 'New draft saved!',
          desc: `You can see your new draft added with the rest of your in-progress work now.`,
        });
        // Alert.alert(
        //   'New draft saved!',
        //   `You can see your new draft added with the rest of your in-progress work now.`,
        //   [
        //     {
        //       text: 'Great!',
        //       style: 'default',
        //       onPress: () => {
        //         // this.props.navigation.jump('memoriesDrafts');
        //       },
        //     },
        //   ],
        // );
        // // this.props.navigation.writeTabs();

        // this.props.navigation.goBack();
        // EventManager.callBack(kReloadDraft);
      }
    } else {
      ToastMessage(id, Colors.ErrorColor);
    }
  };

  _keyboardDidShow = (e: any) => {
    this.setState({
      bottomToolbar: e.endCoordinates.height,
    });
  };

  _keyboardDidHide = (e: any) => {
    this.setState({
      bottomToolbar: 0,
    });
  };

  showMenu = (showMenu?: boolean) => {
    Keyboard.dismiss();
    this.hideToolTip();
    this._actionSheet &&
      this._actionSheet.current &&
      this._actionSheet.current.hideSheet();
    this.setState({
      menuVisibility: !this.state.menuVisibility,
    });
  };

  preview = () => {
    loaderHandler.showLoader();
    this.saveIntitals();
    this.hideMenu();
    setTimeout(() => {
      loaderHandler.hideLoader();
      this.props.navigation.navigate('memoryDetails', {
        previewDraft: true,
        memoryDetails: this.getDetailsForPreview(),
      });
    }, 1000);
  };

  getDetailsForPreview = () => {
    let memoryDataModel = new MemoryDataModel();
    memoryDataModel.shareOption.available = true;
    switch (this.props.shareOption) {
      case 'only_me':
        memoryDataModel.shareOption.shareText = 'Shared only with me';
        memoryDataModel.shareOption.color = Colors.green;
        break;
      case 'allfriends':
        memoryDataModel.shareOption.shareText = 'Shared with All Friends';
        memoryDataModel.shareOption.color = Colors.blue;
        break;
      case 'custom':
        let share_count = 0;
        this.props.whoCanSeeMemoryGroupIds.forEach((element: any) => {
          share_count =
            share_count + element.users_count ? element.users_count : 0;
        });
        share_count = share_count + this.props.whoCanSeeMemoryUids.length;
        memoryDataModel.shareOption.shareText =
          'Shared with ' +
          share_count +
          (share_count > 1 ? ' members' : ' member');
        memoryDataModel.shareOption.color = Colors.blue;
        break;
      case 'cueback':
        memoryDataModel.shareOption.shareText = 'Shared with Public';
        memoryDataModel.shareOption.color = Colors.redBlack;
        break;
    }
    memoryDataModel.userDetails.name = 'You';
    memoryDataModel.memory.description =
      '<p><p>' + this.props.memoryDescription + '</p></p>';
    let currentDate = new Date();
    memoryDataModel.userDetails.createdOn =
      'on ' +
      MonthObj.month[currentDate.getMonth() + MonthObj.serverMonthsCount].name +
      ' ' +
      currentDate.getDate() +
      ', ' +
      currentDate.getFullYear().toString();
    memoryDataModel.userDetails.userProfilePic =
      Account.selectedData().profileImage != ''
        ? Utility.getFileURLFromPublicURL(Account.selectedData().profileImage)
        : profile_placeholder;
    if (memoryDataModel.userDetails.userProfilePic != profile_placeholder) {
      memoryDataModel.userDetails.isProfileAvailable = true;
    }
    memoryDataModel.memoryTags = this.props.memoryObject.tags;
    memoryDataModel.memory.memoryTitle = this.props.memoryObject.title;
    memoryDataModel.memory.memoryDate =
      this.state.month.value.name + ' ' + this.props.memoryObject.date.year;
    memoryDataModel.memory.memoryPlace = this.props.memoryObject.location
      .description
      ? this.props.memoryObject.location.description
      : '';
    memoryDataModel.memory.whoElseWasThere = this.props.whoElseWhereThereList;
    memoryDataModel.memory.whoElseWasThere.forEach(
      (element: any, index: any) => {
        if (element.uid == Account.selectedData().userID) {
          memoryDataModel.memory.youWhereThere = true;
          memoryDataModel.memory.whoElseWasThere.splice(index, 1);
        }
      },
    );
    // if(this.props.collection.tid){
    // 		memoryDataModel.memorycollection.collectionName =  this.props.collection.name
    // 		memoryDataModel.memorycollection.collectionId = this.props.collection.tid
    // }
    memoryDataModel.files = {
      images: this.state.itemList.filter(
        (element: any) => element.type == 'images',
      ),
      audios: this.state.itemList.filter(
        (element: any) => element.type == 'audios',
      ),
      pdf: this.state.itemList.filter(
        (element: any) => element.type == 'files',
      ),
    };
    return memoryDataModel;
  };

  addRemoveTags = () => {
    this.hideMenu();
    if (Utility.isInternetConnected) {
      this.props.navigation.navigate('commonListCreateMemory', {
        tag: kTags,
        title: 'Memory Tags',
        showRecent: true,
        referenceList: this.props.tagsList,
        placeholder: 'Enter tags here...',
      });
    } else {
      No_Internet_Warning();
    }
  };

  addToCollections = () => {
    this.hideMenu();
    if (Utility.isInternetConnected) {
      this.props.navigation.navigate('collectionList');
    } else {
      No_Internet_Warning();
    }
  };

  whoElseWasthere = () => {
    this.hideMenu();
    if (Utility.isInternetConnected) {
      this.props.navigation.navigate('commonListCreateMemory', {
        tag: kWhoElseWhereThere,
        title: 'Who else where there',
        showRecent: false,
        referenceList: this.props.whoElseWhereThereList,
        placeholder: 'Enter name of friends...',
      });
    } else {
      No_Internet_Warning();
    }
  };

  deleteDraft = () => {
    Alert.alert('Delete Draft?', `You wish to delete this Memory Draft ?`, [
      {
        text: 'No',
        style: 'cancel',
        onPress: () => { },
      },
      {
        text: 'Yes',
        style: 'default',
        onPress: () => {
          this.hideMenu();
          if (Utility.isInternetConnected) {
            loaderHandler.showLoader('Deleting...');
            DeleteDraftService(
              this.props.nid,
              DraftActions.deleteDrafts,
              kDeleteDraftCreateMemo,
            );
          } else {
            No_Internet_Warning();
          }
        },
      },
    ]);
  };

  whoCanSee = () => {
    this.hideMenu();
    if (Utility.isInternetConnected) {
      this.props.navigation.navigate('whoCanSee');
    } else {
      No_Internet_Warning();
    }
  };

  saveDraft = () => {
    Keyboard.dismiss();
    // this.saveIntitals();
    this.hideMenu();
    if (
      this.state.title != '' &&
      this.state.memory_date != '' &&
      this.state.description != ''
    ) {
      this.setState({
        actionSheet: {
          title: 'Memory Draft',
          type: this.kSaveAction,
          list: publishActions,
        },
      });
    }

    if (Platform.OS == 'ios') {
      this._actionSheet &&
        this._actionSheet.current &&
        this._actionSheet.current.showSheet();
    } else {
      this.setState({
        showActionAndroid: true,
      });
    }
    // if (this.props.editPublsihedMemory) {
    //   this.saveORPublish('save');
    // }
    // else if (this.state.isCreatedByUser) {
    //   this.setState(
    //     {
    //       actionSheet: {
    //         title: 'Memory Draft',
    //         type: this.kSaveAction,
    //         list: SaveActions,
    //       },
    //     },
    //     this._actionSheet && this._actionSheet.showSheet(),
    //   );
    // } else {
    //   this.saveORPublish('save');
    // }
  };

  validateDateAndLocation = (checkLocation: boolean) => {
    if (
      this.state.year.value != 'Year*' &&
      this.state.title.trim().length > 0 &&
      this.state.month.value.tid != 0 &&
      (!checkLocation || this.state.locationText.trim().length > 0)
    ) {
      return true;
    } else {
      if (this._mainItemList) {
        this._mainItemList.scrollToOffset({ animated: true, offset: 0 });
      }
    }

    if (this.state.year.value == 'Year*') {
      this.setState({
        year: { ...this.state.year, error: true },
        dateError: '* Please enter a year and month to publish your memory',
      });
    }

    if (this.state.month.value.tid == 0) {
      this.setState({
        month: { ...this.state.month, error: true },
        dateError: '* Please enter a year and month to publish your memory',
      });
    }

    if (checkLocation && this.state.locationText.trim().length == 0) {
      this.setState({
        locationError: '* Please enter a location to publish your memory',
      });
    }

    if (this.state.title.trim().length == 0) {
      this.setState({ titleError: '* Title is mandatory' });
    }

    return false;
  };

  /**Menu options for actions*/
  menuOptions: Array<menuOption> = [
    { key: 1, title: 'Preview...', onPress: this.preview },
    { key: 2, title: 'Who can see...', onPress: this.whoCanSee },
    { key: 3, title: 'Add/Remove Tags...', onPress: this.addRemoveTags },
    { key: 5, title: 'Who else was there...', onPress: this.whoElseWasthere },
    { key: 4, title: 'Add to Collections...', onPress: this.addToCollections },
    {
      key: 6,
      title: 'Delete Draft...',
      onPress: this.deleteDraft,
      color: Colors.NewRadColor,
    },
  ];

  fileUpdateCallback = (success: boolean, message: any, key: any) => {
    if (success) {
      this.filesToUpdate = [];
      this.saveORPublish(key);
    } else {
      ToastMessage(message, Colors.ErrorColor);
      loaderHandler.hideLoader();
    }
  };

  saveORPublish = (key: any) => {
    this.saveIntitals();
    loaderHandler.showLoader('Saving');

    setTimeout(async () => {
      if (Utility.isInternetConnected) {
        // setTimeout(() => {
        if (this.filesToUpdate.length > 0) {
          UpdateAttachments(this.props.nid, this.filesToUpdate, key);
        }
        // else {
        let memoryDetails = await DefaultCreateMemoryObj(
          key,
          this.props.memoryObject,
          this.state.isCreatedByUser,
        );
        let filesToUpload = this.state.itemList.filter(
          (element: any) => element.isLocal,
        );

        let resp = await CreateUpdateMemory(
          memoryDetails,
          filesToUpload,
          'createMemoryMainListener',
          key,
          resp => {
            showConsoleLog(ConsoleType.WARN, 'sadadadsd ::', resp);
            if (resp?.Status) {
              this.memorySaveCallback(
                resp.Status,
                resp.Status,
                resp.padid,
                key,
              );
            }
          },
        );

        // }
        // }, 500);
      } else {
        loaderHandler.hideLoader();
        No_Internet_Warning();
      }
    }, 1000);
  };

  saveIntitals = () => {
    let details: any = {
      title: this.state.title, //.trim(),
      memory_date: {
        year:
          this.state.memory_date != ''
            ? this.state.memory_date.split('/')[2]
            : '', //new Date(this.state.memory_date).getFullYear(),
        month:
          this.state.memory_date != ''
            ? parseInt(this.state.memory_date.split('/')[1])
            : '', // new Date(this.state.memory_date).getMonth(),
        day:
          this.state.memory_date != ''
            ? this.state.memory_date.split('/')[0]
            : '', // new Date(this.state.memory_date).getDate(),
      },
      location: { description: '', reference: '' },
      files: this.state.itemList,
      description: '',
    };
    // {
    //   description: this.state.locationText,
    //   reference:
    //     this.state.locationText == this.state.location.description
    //       ? this.state.location.reference
    //       : '',
    // },

    // if (MonthObj.selectedIndex <= MonthObj.serverMonthsCount - 1) {
    //   details.memory_date = {
    //     ...details.memory_date,
    //     season: MonthObj.month[MonthObj.selectedIndex].tid,
    //   };
    // } else {
    //   details.memory_date = {
    //     ...details.memory_date,
    //     month: MonthObj.month[MonthObj.selectedIndex].tid,
    //     day: this.state.day.value != 'Day' ? this.state.day.value : undefined,
    //   };
    // }
    this.props.onInitialUpdate(details);
  };

  componentWillUnmount = () => {
    Keyboard.dismiss();
    // this.props.resetLocation();
    // this.showHideMenuListener.removeListener();
    // this.saveDraftListener.removeListener();
    // this.memoryCallback.removeListener();
    // this.deleteDraftListener.removeListener();
    // this.updateFilesListener.removeListener();
    // this.draftDetailsListener.removeListener();
    this.backListner.removeListener();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  };

  hideMenu = () => {
    this.setState({
      menuVisibility: false,
    });
  };

  uploadOption = () => {
    Keyboard.dismiss();
    this.setState(
      {
        actionSheet: {
          title: '',
          type: this.kUploadAction,
          list: ImageActions,
        },
      },
      () =>
        this._actionSheet &&
        this._actionSheet.current &&
        this._actionSheet.current.showSheet(),
    );
  };

  audioAttachmentPress = (selectedItem?: any) => {
    Keyboard.dismiss();
    if (
      selectedItem &&
      !selectedItem.isLocal &&
      (selectedItem.filesize == null ||
        selectedItem.filesize == undefined ||
        selectedItem.filesize == '0')
    ) {
      ToastMessage('This audio file is corrupted', Colors.ErrorColor);
    } else {
      this.props.navigation.navigate('commonAudioRecorder', {
        mindPopID: 0,
        selectedItem: selectedItem ? selectedItem : null,
        hideDelete: true,
        editRefresh: (file: any[]) => {
          Keyboard.dismiss();
          let fid = GenerateRandomID();
          let tempFile: TempFile[] = file.map(obj => ({ ...obj, fid }));
          this.fileCallback(tempFile);
        },
        reset: () => { },
        deleteItem: () => { },
      });
    }
  };

  inviteCollaboratorFlow = () => {
    let collaborators = this.props.memoryObject.collaborators;
    let keyForPreference =
      Account.selectedData().instanceURL +
      Account.selectedData().userID +
      '-doNotShowAgain';
    // DefaultPreference.get(`${keyForPreference}`).then((value: any) => {
    //   if (value != 'true' || collaborators.length > 0) {
    //     this.props.navigation.navigate('inviteCollaborators', {
    //       showLeaveConversation: !this.state.isCreatedByUser,
    //       owner: this.state.ownerDetails
    //         ? this.state.ownerDetails
    //           ? this.state.collaboratorOwner
    //           : {}
    //         : {},
    //     });
    //   } else {
    //     this.props.navigation.navigate('commonFriendsSearchView', {
    //       title: 'Invite Collaborators',
    //       refListFriends: [],
    //       refListFriendCircles: [],
    //       tag: kCollaborators,
    //     });
    //   }
    // });
  };
  toolbar = () => {
    return Platform.OS == 'android' ? (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        style={styles.toolBarKeyboardAwareScrollViewStyle}>
        <View style={styles.toolBarKeyboardAwareScrollViewContainerStyle}>
          <View style={styles.buttonContainerStyle}>
            <TouchableOpacity
              onPress={() => {
                CaptureImage(this.fileCallback);
              }}
              style={styles.toolbarIcons}>
              <Image source={camera} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.audioAttachmentPress();
              }}
              style={styles.toolbarIcons}>
              <Image source={record} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.uploadOption()}
              style={styles.toolbarIcons}>
              <Image source={icon_upload_file} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          {this.props.route.params.editPublsihedMemory ? null : (
            <TouchableOpacity
              onPress={() => this.inviteCollaboratorFlow()}
              style={[styles.toolbarIcons, { flexDirection: 'row' }]}>
              <Text style={styles.collaborateTextStyle}>Collaborate</Text>
              <Image source={icon_collaborators} resizeMode="contain" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAwareScrollView>
    ) : (
      <KeyboardAccessory style={styles.keyboardAccessoryStyle}>
        <View style={styles.toolBarKeyboardAwareScrollViewContainerStyle}>
          <View style={styles.buttonContainerStyle}>
            <TouchableOpacity
              onPress={() => {
                CaptureImage(this.fileCallback);
              }}
              style={styles.toolbarIcons}>
              <Image source={camera} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.audioAttachmentPress();
              }}
              style={styles.toolbarIcons}>
              <Image source={record} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.uploadOption()}
              style={styles.toolbarIcons}>
              <Image source={icon_upload_file} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          {this.props.route.params.editPublsihedMemory ? null : (
            <TouchableOpacity
              onPress={() => this.inviteCollaboratorFlow()}
              style={[styles.toolbarIcons, { flexDirection: 'row' }]}>
              <Text style={styles.collaborateTextStyle}>Collaborate</Text>
              <Image source={icon_collaborators} resizeMode="contain" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAccessory>
    );
    // <AccessoryView
    // 	style={{
    // 		width: "100%",
    // 		bottom: this.state.bottomToolbar,
    // 		position: "absolute",
    // 		height: 60,
    // 		flexDirection: "row",
    // 		backgroundColor: "#F3F3F3",
    // 		justifyContent: "space-between",
    // 		alignItems: "center",
    // 		padding: 10,
    // 		borderTopColor: "rgba(0.0, 0.0, 0.0, 0.25)",
    // 		borderTopWidth: 1,
    // 		borderLeftColor: "rgba(0.0, 0.0, 0.0, 0.25)",
    // 	}}>
    // 	<View style={{ justifyContent: "space-between", flexDirection: "row", width: "100%" }}>
    // 		<View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
    // 			<TouchableOpacity
    // 				onPress={() => {CaptureImage(this.fileCallback)}}
    // 				style={styles.toolbarIcons}>
    // 	    		<Image source={camera} resizeMode="contain" />
    // 			</TouchableOpacity>
    // 			<TouchableOpacity
    // 				onPress={() => {this.audioAttachmentPress()}}
    // 				style={styles.toolbarIcons}>
    // 				<Image source={record} resizeMode="contain" />
    // 			</TouchableOpacity>
    // 			<TouchableOpacity
    // 				onPress={() => this.uploadOption()}
    // 				style={styles.toolbarIcons}>
    // 				<Image source={icon_upload_file} resizeMode="contain" />
    // 			</TouchableOpacity>
    // 		</View>
    // 		{
    // 				this.props.editPublsihedMemory?
    // 					null
    // 				:
    // 					<TouchableOpacity
    // 					onPress={() => this.inviteCollaboratorFlow()}
    // 					style={[styles.toolbarIcons, {flexDirection: "row"}]}>
    // 					<Text style={{...fontSize(16), fontWeight:"500", color : Colors.ThemeColor, marginRight: 5}}>Collaborate</Text>
    // 					<Image source={icon_collaborators} resizeMode="contain" />
    // 					</TouchableOpacity>
    // 			}

    // 	</View>
    // </AccessoryView>
  };

  fileDescriptionClicked = (file: any) => {
    alert('here');
    this.hideToolTip();
    this.props.navigation.navigate('fileDescription', {
      file: file,
      done: this.updateFileContent,
    });
  };

  renderRow = (data: any, index: number) => {
    // let index = data.index;
    // data = data.item;
    data.by = data.file_owner ? getUserName(data) : 'You';
    let date = data.file_date
      ? data.file_date
      : Utility.dateAccordingToFormat(data.date, 'M d, Y');
    let fileTitle = data.file_title ? data.file_title : '';
    let fileDescription = data.file_description ? data.file_description : '';
    return (
      <View key={`key-${index}`} style={styles.fullWidth}>
        {/* {index == 0 && this.viewBeforList()} */}
        <View style={styles.rowConatiner}>
          <View style={styles.textContainer}>
            <Text style={styles.TextStyle}>
              By <Text style={{ fontWeight: '500' }}>{data.by}</Text> on{' '}
              <Text>{date}</Text>
            </Text>
            {(this.state.isCreatedByUser || data.by == 'You') && (
              <TouchableOpacity
                onPress={() => {
                  this.deleteFile(data.fid, data.isLocal);
                }}>
                <Image source={delete_icon}></Image>
              </TouchableOpacity>
            )}
          </View>
          <View>{this.fileHolderView(data)}</View>
          <View style={[styles.fullWidth, styles.fileContainerSTyle]}>
            <TouchableHighlight
              disabled={data.by != 'You'}
              underlayColor={'#cccccc11'}
              onPress={() => this.fileDescriptionClicked(data)}>
              <View>
                {(fileTitle ? fileTitle.length == 0 : true) &&
                  (fileDescription ? fileDescription.length == 0 : true) &&
                  data.by == 'You' ? (
                  <Text style={styles.addDetailsTextStyle}>
                    {' '}
                    {'Add details'}
                  </Text>
                ) : (
                  <View style={styles.paddingRight}>
                    {fileTitle.length > 0 && (
                      <Text
                        style={styles.fileTitleTextStyle}
                        numberOfLines={3}
                        ellipsizeMode="tail">
                        {fileTitle}
                      </Text>
                    )}
                    {fileDescription.length > 0 && (
                      <Text
                        style={styles.fileDescTextStyle}
                        numberOfLines={5}
                        ellipsizeMode="tail">
                        {fileDescription}
                      </Text>
                    )}
                    {data.by == 'You' && (
                      <Image source={edit_icon} style={styles.editIconStyle} />
                    )}
                  </View>
                )}
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  };

  deleteFile = (fid: any, isTempFile: boolean) => {
    if (!isTempFile) {
      this.filesToUpdate.push({ fid: fid, action: 'delete' });
    }
    let tempFileArray = this.state.itemList;
    let index = tempFileArray.findIndex((element: any) => element.fid === fid);
    tempFileArray.splice(index, 1);
    this.setState({ itemList: tempFileArray });
  };

  updateFileContent = (file: any, title: any, description: any) => {
    let updatelist = this.state.itemList;
    updatelist.forEach((element: any, index: any) => {
      if (element.fid == file.fid) {
        updatelist[index] = {
          ...updatelist[index],
          file_title: title,
          file_description: description,
        };
      }
    });
    if (!file.isLocal) {
      this.filesToUpdate.push({
        fid: file.fid,
        file_title: title,
        file_description: description,
      });
    }
    this.setState({ itemList: updatelist });
  };

  fileHolderView = (file: any) => {
    switch (file.type) {
      case 'images':
        return (
          <TouchableHighlight
            underlayColor={'#ffffff33'}
            onPress={() =>
              this.props.navigation.navigate('imageViewer', {
                files: [
                  {
                    url: file.thumbnail_large_url
                      ? file.thumbnail_large_url
                      : file.thumbnail_url
                        ? file.thumbnail_url
                        : file.thumb_uri,
                  },
                ],
                hideDescription: true,
              })
            }
            style={styles.fileHolderContainer}>
            <View style={styles.fileHolderSubContainer}>
              <PlaceholderImageView
                uri={file.filePath ? file.filePath : file.thumbnail_url}
                style={styles.placeholderImageStyle}
              />
            </View>
          </TouchableHighlight>
        );
        break;
      case 'files':
        return (
          <TouchableHighlight
            underlayColor={'#ffffff33'}
            onPress={() =>
              this.props.navigation.navigate('pdfViewer', { file: file })
            }
            style={styles.fileHolderContainer}>
            <View
              style={[
                styles.fileHolderSubContainer,
                {
                  backgroundColor: Colors.grayWithGradientColor,
                },
              ]}>
              <Image
                source={pdf_icon}
                resizeMode={'contain'}
                style={styles.pdfIconStyle}
              />
              <Image
                source={pdf_icon}
                style={styles.pdfIconImageStyle}
                resizeMode={'contain'}></Image>
            </View>
          </TouchableHighlight>
        );
        break;
      case 'audios':
        return (
          <TouchableHighlight
            underlayColor={'#ffffff33'}
            onPress={() => this.audioAttachmentPress(file)}
            style={styles.audioContainer}>
            <View style={styles.flexRow}>
              <View style={styles.playButtonContainer}>
                <View style={styles.playStyle} />
              </View>
              <View style={styles.fullfleX}>
                <Text
                  style={styles.fileNameTextStyle}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {file.filename ? file.filename : file.title ? file.title : ''}
                </Text>
                <Text style={styles.durationTextStyle}>{file.duration}</Text>
              </View>
            </View>
          </TouchableHighlight>
        );
        break;
    }
  };

  hideToolTip = () => {
    if (this.state.toolTipVisibility) {
      this.setState({
        toolTipVisibility: false,
      });
    }
  };

  onActionItemClicked = (index: number): void => {
    this.saveIntitals();

    switch (index) {
      case 0:
        this.deleteDraft();
        break;
      case 1:
        loaderHandler.showLoader('Saving...');
        // if (this.state.padDetails?.padId) {
        //   this.setEtherPadContent('get', '', this.state.padDetails.padId);
        // }
        // setTimeout(() => {
        this.saveORPublish('save');
        // }, 2500);
        break;
      case 2:
        this._actionSheet &&
          this._actionSheet.current &&
          this._actionSheet.current.hideSheet();
        break;
      case 3:
        loaderHandler.showLoader('Publishing...');
        // setTimeout(() => {
        this.saveORPublish(kPublish);
        // }, 2500);
        break;
    }
    // switch (index) {
    //   case 0:
    //     file = PickImage(this.fileCallback);
    //     break;
    //   case 1:
    //     file = PickAudio(this.fileCallback);
    //     break;
    //   case 2:
    //     file = PickPDF(this.fileCallback);
    //     break;
    //   case 4:
    //     if (this.validateDateAndLocation(false)) {
    //       this.saveORPublish('');
    //     }
    //     break;
    //   case 5:
    //     this.saveIntitals();
    //     if (this.validateDateAndLocation(true)) {
    //       this.props.navigation.navigate('publishMemoryDraft', {
    //         publishMemoryDraft: this.saveORPublish,
    //         preview: this.preview,
    //         delete: this.deleteDraft,
    //       });
    //     }
    //     break;
    // }
  };

  fileCallback = (file: any) => {
    let tempfiles = this.state.itemList;
    file.forEach((element: any) => {
      tempfiles.push(element);
    });
    this.setState({
      itemList: tempfiles,
    });
  };

  createLabelSelector = (
    selectedValue: any,
    marginEnd: any,
    flex: any,
    fieldName: string,
  ) => {
    return (
      <TouchableOpacity
        style={[
          styles.labelSelectorContainer,
          styles.inputView,
          {
            flex: flex,
            marginEnd: marginEnd,
            borderColor: selectedValue.error
              ? Colors.ErrorColor
              : Colors.TextColor,
          },
        ]}
        onPress={() => this.onOptionSelection(fieldName, selectedValue.value)}>
        <Text style={styles.selectedValueTextStyle}>
          {fieldName == 'month'
            ? selectedValue.value.name
            : selectedValue.value}
        </Text>
        <View style={styles.emptyView}></View>
      </TouchableOpacity>
    );
  };

  onOptionSelection = (fieldName: any, value: any) => {
    Keyboard.dismiss();
    let actions = this.createMemoryHelper.getDateOptions(
      fieldName,
      this.state.year.value,
    );
    this.setState(
      {
        selectionData: {
          actions,
          selectionValue: value,
          fieldName: fieldName,
          title: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
        },
      },
      () => {
        this.bottomPicker.current &&
          this.bottomPicker.current.showPicker &&
          this.bottomPicker.current.showPicker();
      },
    );
  };

  dateSelected = (selectedItem: any) => {
    let currentDate = new Date();
    if (this.state.selectionData.fieldName == 'month') {
      selectedItem = { name: selectedItem.text, tid: selectedItem.key };
      MonthObj.month.forEach((element: any, index: any) => {
        if (element.name == selectedItem.name) {
          MonthObj.selectedIndex = index;
        }
      });
    }
    switch (this.state.selectionData.fieldName) {
      case 'year':
        if (
          this.state.month.value.tid > 0 &&
          selectedItem.text == currentDate.getFullYear()
        ) {
          let currentMonth = currentDate.getMonth();
          let selectedMonth =
            MonthObj.selectedIndex - MonthObj.serverMonthsCount;
          if (currentMonth < selectedMonth) {
            this.setState(
              {
                month: { ...this.state.selectionData, value: MonthObj.month[0] },
              },
              () => {
                this.setState({
                  day: { ...this.state.selectionData, value: 'Day' },
                });
              },
            );
          } else if (
            currentMonth == selectedMonth &&
            this.state.day.value != 'Day'
          ) {
            let currentDay = currentDate.getDate();
            let selectedDay = parseInt(this.state.day.value);
            if (currentDay < selectedDay) {
              this.setState({ day: { ...this.state.selectionData, value: 'Day' } });
            }
          }
        }
        this.state.year.error = false;
        break;
      case 'month':
        if (
          MonthObj.selectedIndex > 0 &&
          MonthObj.selectedIndex < MonthObj.serverMonthsCount
        ) {
          this.setState({
            day: { ...this.state.selectionData, value: 'Day' },
            showDay: false,
          });
        } else if (this.state.day.value != 'Day') {
          this.setState({ showDay: true }, () => {
            let currentDay = parseInt(this.state.day.value);
            if (currentDay >= 28) {
              let maxDay = 28;
              switch (selectedItem.text) {
                case 'Feb':
                  maxDay = 28;
                  if (this.state.year.value != 'Year*') {
                    if (parseInt(this.state.year.value) % 4 == 0) {
                      maxDay = 29;
                    }
                  }
                  break;
                case 'Apr' || 'Jun' || 'Sep' || 'Nov':
                  maxDay = 30;
                  break;
                default:
              }
              if (maxDay < currentDay) {
                this.setState({
                  day: { ...this.state.selectionData, value: 'Day' },
                  showDay: true,
                });
              }
            }
          });
        } else {
          this.setState({
            day: { ...this.state.selectionData, value: 'Day' },
            showDay: true,
          });
        }
        this.state.month.error = false;
        break;
      case 'day':
        break;
    }
    if (this.state.selectionData.fieldName == 'month') {
      this.setState({
        [this.state.selectionData.fieldName]: {
          ...this.state.selectionData,
          value: selectedItem,
        },
      });
    } else {
      this.setState({
        [this.state.selectionData.fieldName]: {
          ...this.state.selectionData,
          value: selectedItem.text,
        },
      });
    }
    if (!this.state.month.error && !this.state.year.error) {
      this.state.dateError = '';
    }
  };

  // _renderLocation = (locationRow: any) => {
  //   //showConsoleLog(ConsoleType.LOG,locationRow)
  //   return (
  //     <TouchableOpacity
  //       style={styles.locationContainer}
  //       onPress={() => {
  //         this.setState({
  //           location: locationRow.item,
  //           locationText: locationRow.item.description,
  //           locationList: [],
  //         });
  //         this.props.resetLocation();
  //       }}>
  //       <Text
  //         style={styles.locationDescTextStyle}
  //         ellipsizeMode="tail"
  //         numberOfLines={2}>
  //         {locationRow.item.description}
  //       </Text>
  //     </TouchableOpacity>
  //   );
  // };

  viewBeforList = () => {
    return (
      // onStartShouldSetResponder={() => true}
      <View style={Styles.viewBeforListContainerStyle}>
        <View>
          {this.state.isCreatedByUser ? (
            <View style={styles.ViewBeforeStyle}>
              {/* <Text
              style={styles.whenHappenTextStyle}>
              {'When did it happen? (Approximate)'}
              <Text style={{ color: Colors.ErrorColor }}>{' *'}</Text>
            </Text> */}
              {/* <View
              style={styles.createLableSelectorContainerStyle}
              onStartShouldSetResponder={() => true}>
              {this.createLabelSelector(this.state.year, 10, 2, 'year')}
              {this.createLabelSelector(this.state.month, 10, 3, 'month')}
              {this.state.showDay ? (
                this.createLabelSelector(this.state.day, 0, 2, 'day')
              ) : (
                <View style={styles.flex2Padding} />
              )}
            </View>

            <Text
              style={styles.dateErrorTextStyle}>
              {this.state.dateError}
            </Text> */}

              {/* <Text
              style={styles.whereHappenTextStyle}>
              {'Where did it happen?'}
              <Text style={{ color: Colors.ErrorColor }}>{' *'}</Text>
            </Text>
            <SearchBar
              style={[styles.searchBarStyle,{
                borderBottomColor: this.state.locationError.length > 0 ? Colors.ErrorColor : Colors.TextColor,
              }]}
              placeholder="Enter location here"
              onBlur={() => {
                this.setState({ locationList: [] });
              }}
              onSearchButtonPress={(keyword: string) => {
                this.setState({ showLocationLoader: true });
                this.props.onLocationUpdate(keyword);
              }}
              onClearField={() => {
                this.props.resetLocation();
                this.setState({ locationList: [] });
              }}
              onChangeText={(text: any) => {
                this.props.onLocationUpdate(text);
                this.setState({ locationError: '', locationText: text });
              }}
              // onFocus={()=> this._mainItemList.scrollToOffset({ animated: true, offset: 100})}
              showCancelClearButton={false}
              value={this.state.locationText}
            /> */}
              {/* {this.props.locationList.length > 0 && (
              <FlatList
                keyExtractor={(_, index: number) => `${index}`}
                keyboardShouldPersistTaps={'handled'}
                onScroll={() => {
                  Keyboard.dismiss();
                }}
                style={styles.flatListStyle}
                keyExtractor={(_: any, index: number) => `${index}`}
                data={this.props.locationList}
                renderItem={this._renderLocation}
                ItemSeparatorComponent={() => (
                  <View
                    style={styles.separator}></View>
                )}
              />
            )}

            <Text style={styles.locationErrorTextStyle}>
              {this.state.locationError}
            </Text> */}
              {
                <>
                  <TextInput
                    style={[
                      styles.memoryDescriptionInput,
                      {
                        borderBottomColor:
                          this.state.titleError.length > 0
                            ? Colors.ErrorColor
                            : Colors.white,
                        borderBottomWidth:
                          this.state.titleError.length > 0 ? 0.5 : 0,
                      },
                    ]}
                    // selection={{start:0}}//, end:0
                    value={this.state.title}
                    maxLength={250}
                    multiline={false}
                    onChangeText={(text: any) => {
                      this.setState({ title: text, titleError: '' });
                    }}
                    placeholder={this.state.placeholder}
                    placeholderTextColor={
                      Colors.memoryTitlePlaceholderColor
                    }></TextInput>

                  <Text style={Styles.errortextStyle}>
                    {this.state.titleError}
                  </Text>
                </>
              }
            </View>
          ) : (
            <View style={styles.ViewBeforeStyle}>
              <Text style={styles.memoryDescriptionInput}>
                {this.state.title}
              </Text>
            </View>
            // this.ownersViewForCollaborators()
          )}
          <View style={Styles.etherPadStyle}>
            {/* styles.createdByUserContainer */}
            {/* {!this.state.isCreatedByUser && (
            <View>
              <Text
                style={styles.titletextContainer}>
                {this.state.title}
              </Text>
              <Border />
            </View>
          )} */}
            {/* <Text
            style={styles.memoryDescriptionTextStyle}
            numberOfLines={3}
            ellipsizeMode={'tail'}>
            {this.props.memoryDescription}
          </Text> */}
            {/* <View style={styles.ViewBeforeStyle}> */}
            {this.props.route.params.editMode || this.state.showEtherPad ? (
              <Text
                style={styles.memoryDescriptionTextStyle}
                numberOfLines={3}
                ellipsizeMode={'tail'}>
                {this.props.memoryDescription}
              </Text>
              // <EtherPadEditing
              //   editMode={this.props.route.params.editMode}
              //   title={this.state.title.trim()}
              //   padDetails={this.state.padDetails}
              //   updateContent={this.setEtherPadContent.bind(this)}
              //   inviteCollaboratorFlow={this.inviteCollaboratorFlow.bind(this)}
              // />
            ) : (
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    showEtherPad: true,
                  })
                }>
                <Text style={Styles.etherpadTextInputStyle}>
                  {'|Tap to start writing...'}
                </Text>
              </TouchableOpacity>
            )}
            {/* </View> */}
            {/* <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('etherPadEditing', {
                title: this.state.title.trim(),
                padDetails: this.state.padDetails,
                updateContent: this.setEtherPadContent.bind(this),
                inviteCollaboratorFlow: this.inviteCollaboratorFlow.bind(this),
              })
            }>
            <Text
              style={styles.editDescriptionTextStyle}>
              Edit Description
            </Text>
          </TouchableOpacity> */}
          </View>

          {Platform.OS === 'android' && this.state.showCalender && (
            <DateTimePicker
              isVisible={this.state.showCalender}
              onCancel={() => {
                this.setState({ showCalender: false });
                //showConsoleLog(ConsoleType.LOG,"cancelled")
              }}
              onDateSelection={(date: any) => {
                this.setState({
                  showCalender: false,
                  memory_date: moment(date).format('DD/MM/YYYY'),
                });
              }}
            />
          )}
        </View>

        {/* {
          this.state.bottomToolbar ?
            null
            : */}
        <View style={Styles.buttonsContainerStyle}>
          {this.props.memoryDescription &&
            this.props.memoryDescription != '' ? (
            <>
              <TouchableOpacity
                style={Styles.buttonsStyle}
                onPress={() => {
                  // if (Platform.OS === 'android') {
                  //   DateTimePickerAndroid.open(this.dateOptions);
                  // } else {
                  this.setState({
                    showCalender: true,
                  });
                  // }
                }}>
                <Image source={calendarWrite} />
                <Text style={styles.editDescriptionTextStyle}>Date</Text>
              </TouchableOpacity>
              <View style={{ width: 8 }} />
            </>
          ) : null}
          <TouchableOpacity
            style={Styles.buttonsStyle}
            onPress={() => {
              // CaptureImage(this.fileCallback);
              PickImage(this.fileCallback);
            }}>
            <Image source={image} />
            <Text style={styles.editDescriptionTextStyle}>Image</Text>
          </TouchableOpacity>

          <View style={{ width: 8 }} />
          <TouchableOpacity
            style={[
              Styles.buttonsStyle,
              { backgroundColor: Colors.decadeFilterBorder },
            ]}
            onPress={() => {
              // if (this.props.padDetails?.padId) {
              this.setEtherPadContent('get', '', this.state.padDetails.padId);
              // }
              if (
                this.state.description != '' &&
                this.state.memory_date == ''
              ) {
                ToastMessage('Please select Date first', Colors.ErrorColor);
              }

              if (
                this.state.title != '' &&
                this.state.memory_date != '' &&
                this.state.description != ''
              ) {
                Keyboard.dismiss();
                this.hideMenu();
                this.setState(
                  {
                    actionSheet: {
                      title: 'Memory Draft',
                      type: this.kSaveAction,
                      list: publishActions,
                    },
                  },
                  () => {
                    if (Platform.OS == 'ios') {
                      this._actionSheet &&
                        this._actionSheet.current &&
                        this._actionSheet.current.showSheet();
                    } else {
                      this.setState({
                        showActionAndroid: true,
                      });
                    }
                  },
                );
              }
            }}>
            <Image source={arrowRight} />
            <Text
              style={[styles.editDescriptionTextStyle, { color: Colors.white }]}>
              Next
            </Text>
          </TouchableOpacity>
          {/* <View style={{ width: 8 }} /> */}
        </View>
        {/* } */}

        {/* {this.state.itemList.length > 0 && (
          <View style={{ marginTop: 15 }}>
            <Border />
            <Text
              style={[styles.memoryDescriptionTextStyle, styles.paddingVerticalStyle]}>
              {'Attachments ('}
              {this.state.itemList.length}
              {')'}
            </Text>
          </View>
        )} */}
      </View>
    );
  };

  ownersViewForCollaborators = () => {
    return (
      <View style={styles.collabratorMainContainer}>
        <View style={styles.fullFexDirectionRowStyle}>
          <View style={styles.placeHolderContainerStyle}>
            <PlaceholderImageView
              uri={Utility.getFileURLFromPublicURL(this.state.ownerDetails.uri)}
              borderRadius={Platform.OS === 'android' ? 48 : 24}
              style={styles.placeHolderImageStyle}
              profilePic={true}
            />
          </View>
          <View style={styles.flexMarginLeftStyle}>
            <View style={styles.directionFlex}>
              <Text style={styles.ownerNameTextStyle}>
                {this.state.ownerDetails.field_first_name_value}{' '}
                {this.state.ownerDetails.field_last_name_value}
                <Text
                  style={[
                    styles.ownerNameTextStyle,
                    {
                      fontWeight: 'normal',
                    },
                  ]}>
                  {this.state.youWhereThere
                    ? this.state.taggedCount == 0
                      ? ' and You'
                      : ', You and '
                    : this.state.taggedCount == 0
                      ? ''
                      : ' and '}
                </Text>
              </Text>
              {this.state.taggedCount > 0 && (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('customListMemoryDetails', {
                      heading: 'Who else where there',
                      itemList: this.props.whoElseWhereThereList,
                    })
                  }>
                  <Text
                    style={[
                      styles.ownerNameTextStyle,
                      {
                        fontWeight: 'normal',
                        color: Colors.NewTitleColor,
                      },
                    ]}>
                    {this.state.taggedCount}
                    {this.state.taggedCount > 1 ? ' others' : ' other'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={[styles.ownerNameTextStyle, { paddingTop: 5 }]}>
              {this.state.month.value.name}{' '}
              {this.state.showDay && this.state.day.value},{' '}
              {this.state.year.value}{' '}
              <Text style={{ color: Colors.darkGray }}>
                {' '}
                {this.state.locationText}{' '}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    );
  };
  renderForCollaborator = () => { };

  cancelAction = () => {
    // Alert.alert('', `Are you sure you want to exit?`, [
    //   {
    //     text: 'No',
    //     style: 'cancel',
    //     onPress: () => { },
    //   },
    //   {
    //     text: 'Yes',
    //     style: 'default',
    //     onPress: () => {
    //       EventManager.callBack(kReloadDraft);
    //       this.setState({ showMenu: false }, () => {
    //         Keyboard.dismiss();
    //         if (this.props.deepLinkBackClick) {
    //           this.props.navigation.dashBoard();
    //         } else {
    //           this.props.navigation.goBack();
    //         }
    //       });
    //     },
    //   },
    // ]);
    // return ();
  };

  onChange = (date: any) => {
    showConsoleLog(ConsoleType.LOG, 'date');
  };

  render() {
    return (
      <View style={styles.fullFlex}>
        <SafeAreaView style={styles.emptySafeAreaStyle} />
        <SafeAreaView style={styles.SafeAreaViewContainerStyle}>
          {Platform.OS === 'ios' && this.state.showCalender && (
            <View style={Styles.calendarViewStyle}>
              <DatePicker
                options={{
                  backgroundColor: Colors.white,
                  textHeaderColor: Colors.black,
                  textDefaultColor: Colors.systemRed,
                  selectedTextColor: Colors.white,
                  mainColor: Colors.systemRed,
                  textSecondaryColor: Colors.systemRed,
                  borderColor: 'rgba(122, 146, 165, 0.1)',
                }}
                newMemoryYears={this.newMemoryYears}
                mode="datepicker"
                selected={this.state.memory_date}
                current={this.state.memory_date}
                selectorEndingYear={new Date().getFullYear()}
                selectorStartingYear={1900}
                onSelectedChange={date => {
                  this.setState({
                    showCalender: false,
                    memory_date: date,
                  });
                }}
                style={styles.calendar}
              />
            </View>
          )}
          <CustomAlert
            modalVisible={this.state.showCustomAlert}
            // setModalVisible={setModalVisible}
            title={'Save your memory'}
            message={
              'We always save your work, but you can choose to save writing this memory for later, or continue writing now.'
            }
            buttons={[
              {
                text: 'Close and save as draft',
                func: () => {
                  this.setState({ showCustomAlert: false }, () => {
                    // if (this.props.padDetails?.padId) {
                    //   this.setEtherPadContent('get', '', this.state.padDetails.padId);
                    // }
                    // setTimeout(() => {
                    this.saveORPublish('save');
                    // }, 1000);
                  });

                  // ReactNativeHapticFeedback.trigger('impactMedium', options);
                },
              },
              {
                text: 'Continue editing',
                func: () => {
                  this.setState({ showCustomAlert: false });
                  // ReactNativeHapticFeedback.trigger('impactMedium', options);
                },
                styles: { fontWeight: '400' },
              },
              {
                text: 'Cancel',
                func: () => {
                  this.setState({ showCustomAlert: false }, () => {
                    this.props.fetchMemoryList({
                      type: ListType.Recent,
                      isLoading: true,
                    });
                    this.props.fetchMemoryList({
                      type: ListType.Timeline,
                      isLoading: true,
                    });
                    loaderHandler.showLoader();
                    this.props.navigation.goBack();
                  });
                  // ReactNativeHapticFeedback.trigger('impactMedium', options);
                },
                styles: { fontWeight: '400' },
              },
            ]}
          />
          <View
            style={styles.navigationHeaderContainer}
          // onStartShouldSetResponder={() => true}
          // onResponderStart={this.hideToolTip}
          >
            <NavigationHeaderSafeArea
              // heading={'Memory Draft'}
              showCommunity={false}
              cancelAction={() => this.saveDraft()} //this.setState({ showCustomAlert: true }) //this.cancelAction}
              showRightText={true}
              rightText={
                this.props.route.params.editPublsihedMemory
                  ? 'Save'
                  : // : this.state.isCreatedByUser
                  //   ? 'Done'
                  'Save'
              }
              backIcon={action_close}
              saveValues={() => {
                this.setState({showCustomAlert: true})
              }
              } //this.saveDraft
            // rightIcon={this.state.isCreatedByUser}
            // showHideMenu={() => this.showMenu(!this.state.menuVisibility)}
            />
            <View style={styles.borderStyle}></View>
            <StatusBar
              barStyle={
                Utility.currentTheme == 'light'
                  ? 'dark-content'
                  : 'light-content'
              }
              backgroundColor={Colors.NewThemeColor}
            />
            <View style={styles.height22} />

            <CustomAlert
              modalVisible={this.state.showActionAndroid}
              setModalVisible={
                this.state.actionSheet?.list?.actions &&
                  this.state.actionSheet?.list?.actions.length &&
                  this.state.actionSheet?.list?.actions[0] &&
                  this.state.actionSheet?.list?.actions[0]?.text?.includes('Yes,')
                  ? `Are you done writing this memory?`
                  : `Save for later?`
              }
              title={this.state.actionSheet.title}
              message={
                this.state.actionSheet?.list?.actions &&
                  this.state.actionSheet?.list?.actions.length &&
                  this.state.actionSheet?.list?.actions[0] &&
                  this.state.actionSheet?.list?.actions[0]?.text?.includes('Yes,')
                  ? ``
                  : 'Choose to completely discard your work, or save writing this memory for later.'
              }
              buttons={
                (this.state.actionSheet.list = this.state.actionSheet.list.map(
                  (item: any) => {
                    return {
                      text: item.text,
                      index: item.index,
                      func: () => {
                        this.setState(
                          {
                            showActionAndroid: false,
                          },
                          () => {
                            this.onActionItemClicked(item.index);
                          },
                        );
                      },
                    };
                  },
                ))
                //   [{
                //   text: 'Close and save as draft',
                //   func: () => {
                //     this.setState({ showCustomAlert: false }, () => {
                //         this.saveORPublish('save');
                //     })

                //     // ReactNativeHapticFeedback.trigger('impactMedium', options);
                //   },
                // },
                // {
                //   text: 'Continue editing',
                //   func: () => {
                //     this.setState({ showCustomAlert: false })
                //     // ReactNativeHapticFeedback.trigger('impactMedium', options);
                //   },
                // },
                // {
                //   text: 'Cancel',
                //   func: () => {
                //     this.setState({ showActionAndroid: false }, () => {

                //     })
                //     // ReactNativeHapticFeedback.trigger('impactMedium', options);
                //   },
                // }
                // ]
              }
            />

            {
              // this.state.itemList.length ?

              <ScrollView
                contentContainerStyle={
                  Styles.viewBeforListContentContainerStyle
                }
                style={styles.fullWidth}
                scrollEnabled={this.state.itemList.length ? true : false}>
                {/* {this.state.itemList.length == 0 ? ( */}
                {this.viewBeforList()}
                {/* ) : ( */}

                {
                  // this.state.bottomToolbar ?
                  //   null
                  //   :
                  // <FlatList
                  //   ref={ref => (this._mainItemList = ref)}
                  //   extraData={this.state}
                  //   nestedScrollEnabled={true}
                  //   keyExtractor={(_, index: number) => `${index}`}
                  //   style={[styles.fullWidth, { marginBottom: 100 }]}
                  //   onScroll={() => Keyboard.dismiss()}
                  //   // keyboardShouldPersistTaps={'handled'}
                  //   showsHorizontalScrollIndicator={false}
                  //   // showsVerticalScrollIndicator={false}
                  //   data={this.state.itemList}
                  //   renderItem={(item: any) => this.renderRow(item)}
                  // />
                  this.state.itemList?.length
                    ? this.state.itemList.map((item, index) =>
                      this.renderRow(item, index),
                    )
                    : null
                }
                {/* )} */}
              </ScrollView>
              // :
              // <View style={styles.fullWidth} >
              //   {this.viewBeforList()}
              // </View>
            }
            {/* {this.state.menuVisibility && (
              <View
                style={styles.menuVisibleContainer}
                onStartShouldSetResponder={() => true}
                onResponderStart={this.hideMenu}>
                <View style={styles.sideMenu}>
                  {this.menuOptions.map((data: any) => {
                    return (
                      <TouchableOpacity
                        key={data.key}
                        style={styles.titleContainer}
                        onPress={data.onPress}>
                        <Text
                          style={[styles.selectedText, { color: data.color ? data.color : Colors.TextColor, }]}>
                          {data.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )} */}

            {/* {this.toolbar()} */}
            <ActionSheet
              ref={this._actionSheet}
              width={DeviceInfo.isTablet() ? '65%' : '100%'}
              title={this.state.actionSheet.title}
              actions={this.state.actionSheet.list}
              onActionClick={this.onActionItemClicked.bind(this)}
            />
            {/* {this.state.toolTipVisibility && (
              <View style={styles.tooltipVisibleStyle}>
                <View style={styles.tooltipStyle}>
                  <Text
                    style={styles.colabratiesTextStyle}>
                    {'Tap here to invite collaborators to help you'}
                  </Text>
                </View>
                <View style={styles.toolTipArrow}></View>
              </View>
            )} */}
            {/* <BottomPicker
              ref={this.bottomPicker}
              onItemSelect={(selectedItem: any) => {
                this.dateSelected(selectedItem);
              }}
              title={this.state.selectionData.title}
              actions={this.state.selectionData.actions}
              value={this.state.selectionData.selectionValue}
              selectedValues={[this.state.selectionData.selectionValue]}
            /> */}
          </View>
          {/* {this.state.memoryDraftVisibility && (
            <MemoryDraftIntro
              cancelMemoryDraftTour={() => {
                this.setState({ memoryDraftVisibility: false });
                DefaultPreference.set('hide_memory_draft', 'true').then(
                  function () { },
                );
              }}></MemoryDraftIntro>
          )} */}
        </SafeAreaView>
      </View>
    );
  }
}

const mapState = (state: { [x: string]: any }) => {
  return {
    locationList: state.MemoryInitials.locationList,
    tagsList: state.MemoryInitials.tags,
    whoElseWhereThereList: state.MemoryInitials.whoElseWhereThere,
    collection: state.MemoryInitials.collection,
    nid: state.MemoryInitials.nid,
    shareOption: state.MemoryInitials.shareOption,
    whoCanSeeMemoryUids: state.MemoryInitials.whoCanSeeMemoryUids,
    whoCanSeeMemoryGroupIds: state.MemoryInitials.whoCanSeeMemoryGroupIds,
    memoryDescription: state.MemoryInitials.description,
    memoryObject: state.MemoryInitials,
    goToDashboard: state.MemoryInitials.goToDashboard,
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    onLocationUpdate: (payload: any) =>
      dispatch({ type: LocationAPI, payload: payload }),
    fetchMemoryList: (payload: any) =>
      dispatch({ type: GET_MEMORY_LIST, payload: payload }),
    resetLocation: () => dispatch({ type: ResetLocation, payload: '' }),
    onInitialUpdate: (payload: any) =>
      dispatch({ type: MemoryInitialsUpdate, payload: payload }),
    recentTags: (payload: any) =>
      dispatch({ type: MemoryTagsAPI, payload: payload }),
    collectionAPI: () => dispatch({ type: CollectinAPI }),
    saveNid: (payload: any) => dispatch({ type: SaveNid, payload: payload }),
    saveFiles: (payload: any) =>
      dispatch({ type: SaveAttachedFile, payload: payload }),
    setNid: (payload: any) => dispatch({ type: SaveNid, payload: payload }),
    resetAll: (payload: any) => dispatch({ type: ResetALL, payload: payload }),
    setPadID: (payload: any) => dispatch({ type: SaveNid, payload: payload }),
    setCreateMemory: (payload: any) =>
      dispatch({ type: CreateAMemory, payload: payload }),
    showAlertCall: (payload: any) =>
      dispatch({ type: showCustomAlert, payload: payload }),
    showAlertCallData: (payload: any) =>
      dispatch({ type: showCustomAlertData, payload: payload }),
    navigateToDashboard: (payload: any) =>
      dispatch({ type: NavigateToDashboard, payload: payload }),
    setDescription: (payload: any) =>
      dispatch({ type: SaveDescription, payload: payload }),
    etherpadContentUpdate: (payload: any) =>
      dispatch({ type: EtherPadContentAPI, payload: payload }),
    setEditContent: (payload: any) =>
      dispatch({ type: EditContent, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(CreateMemory);
