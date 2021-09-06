import React from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableHighlight,
  Platform,
  StatusBar,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import ImageCropPicker, {
  Image as PickerImage,
} from 'react-native-image-crop-picker';
import {Actions} from 'react-native-router-flux';
import AccessoryView from '../../common/component/accessoryView';
import ActionSheet, {ActionSheetItem} from '../../common/component/actionSheet';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
// @ts-ignore
import {KeyboardAwareScrollView} from '../../common/component/keyboardaware-scrollview';
import Text from '../../common/component/Text';
import {
  Colors,
  fontSize,
  GenerateRandomID,
  requestPermission,
  encode_utf8,
  getValue,
  decode_utf8,
  DraftActions,
  NO_INTERNET,
} from '../../common/constants';
import {
  FileType,
  MindPopAttachment,
} from '../../common/database/mindPopStore/mindPopStore';
import EventManager from '../../common/eventManager';
import {Account} from '../../common/loginStore';
import Utility from '../../common/utility';
import {
  action_camera,
  action_close,
  action_picture,
  camera,
  delete_icon,
  edit_icon,
  icon_collaborators,
  icon_upload_file,
  record,
  action_audio,
  action_pdf,
  pdf_icon,
  save_memory_draft,
  publish_memory_draft,
  profile_placeholder,
} from '../../images';
import {TempFile} from '../mindPop/edit';
import {kSaveDraft, kShowHideMenu} from './header';
// @ts-ignore
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';
import {connect} from 'react-redux';
import {
  MemoryInitials,
  ResetLocation,
  MemoryInitialsUpdate,
  SaveNid,
  SaveAttachedFile,
  ResetALL,
  SaveDescription,
  EditContent,
} from './reducer';
import {
  PickImage,
  PickAudio,
  PickPDF,
  CaptureImage,
} from '../../common/component/filePicker/filePicker';
import SearchBar from '../../common/component/SearchBar';
import BottomPicker from '../../common/component/bottomPicker';
import {
  CreateMemoryHelper,
  DefaultDetailsMemory,
  DefaultCreateMemoryObj,
  getEtherPadUrl,
  getUserName,
} from './dataHelper';
import {ToastMessage, No_Internet_Warning} from '../../common/component/Toast';
import {
  CreateUpdateMemory,
  kDeleteDraft,
  DeleteDraftService,
  UpdateAttachments,
  kFilesUpdated,
  GetDraftsDetails,
  kDraftDetailsFetched,
  CollaboratorActionAPI,
  kDeleteDraftCreateMemo,
} from './createMemoryWebService';
import {Border} from '../memoryDetails/componentsMemoryDetails';
import PlaceholderImageView from '../../common/component/placeHolderImageView';
import {
  LocationAPI,
  MemoryTagsAPI,
  kRecentTags,
  kSearchTags,
  CollectinAPI,
  EtherPadContentAPI,
} from './saga';
import {kTags, kWhoElseWhereThere, kCollaborators} from './publish';
import {MemoryDataModel} from '../memoryDetails/memoryDataModel';
//@ts-ignore
import DefaultPreference from 'react-native-default-preference';
import {kReloadDraft} from '../myMemories/MemoryDrafts';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import {MemoryDraftsDataModel} from '../myMemories/MemoryDrafts/memoryDraftsDataModel';
import {CollaboratorsAction} from './inviteCollaborators';
//@ts-ignore
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import MemoryDraftIntro from './memoryDraftIntro';

export const createNew = 'Create New';
export const editDraft = 'Edit Draft';

const ScreenWidth = Dimensions.get('window').width;
export const kPublish = 'publish';
type Props = {[x: string]: any};
type State = {
  [x: string]: any;
};

enum TempFileStatus {
  needsToUpload = 'needsToUpload',
  deleted = 'deleted',
  uploaded = 'uploaded',
}

type menuOption = {key: number; title: any; onPress: () => void; color?: any};
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
const ImageActions: Array<ActionSheetItem> = [
  {index: 0, text: 'Image', image: action_camera},
  {index: 1, text: 'Audio', image: action_audio},
  {index: 2, text: 'PDF', image: action_pdf},
  {index: 3, text: 'Cancel', image: action_close},
];

const SaveActions: Array<ActionSheetItem> = [
  {index: 4, text: 'Save and Exit', image: save_memory_draft},
  {index: 5, text: 'Prepare to publish', image: publish_memory_draft},
  {index: 3, text: 'Cancel', image: action_close},
];

export const months = [
  {name: 'Jan', tid: 1},
  {name: 'Feb', tid: 2},
  {name: 'Mar', tid: 3},
  {name: 'Apr', tid: 4},
  {name: 'May', tid: 5},
  {name: 'Jun', tid: 6},
  {name: 'Jul', tid: 7},
  {name: 'Aug', tid: 8},
  {name: 'Sep', tid: 9},
  {name: 'Oct', tid: 10},
  {name: 'Nov', tid: 11},
  {name: 'Dec', tid: 12},
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
  _actionSheet: any | ActionSheet = null;
  _mainItemList: any = null;
  kUploadAction: 'uploadAction';
  kSaveAction: 'saveAction';

  moment: string;
  //InputRef reference
  _inputRef: TextInput | any;
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;

  //Files array list
  files: Array<MindPopAttachment & {type: string; uri: string}>;

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
    dateError: '',
    locationError: '',
    locationText: '',
    showDay: true,
    location: {description: '', reference: ''},
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
  };

  isEdit: boolean = false;
  // filePathsToUpload: string[];

  filesToUpdate: Array<any> = [];
  listener: EventManager;
  backListner: any;
  bottomPicker: React.RefObject<BottomPicker> = React.createRef<BottomPicker>();
  memoryCallback: EventManager;
  deleteDraftListener: EventManager;
  initialSaveManager: EventManager;
  updateFilesListener: EventManager;
  draftDetailsListener: EventManager;
  constructor(props: Props) {
    super(props);
    this.createMemoryHelper = new CreateMemoryHelper();
    this.showHideMenuListener = EventManager.addListener(
      kShowHideMenu,
      this.showMenu,
    );
    this.saveDraftListener = EventManager.addListener(
      kSaveDraft,
      this.saveDraft,
    );
    this.memoryCallback = EventManager.addListener(
      'createMemoryMainListener',
      this.memorySaveCallback,
    );
    this.deleteDraftListener = EventManager.addListener(
      kDeleteDraftCreateMemo,
      this.deleteDraftCallback,
    );
    this.updateFilesListener = EventManager.addListener(
      kFilesUpdated,
      this.fileUpdateCallback,
    );
    this.draftDetailsListener = EventManager.addListener(
      kDraftDetailsFetched,
      this.draftDetailsCallBack,
    );
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
      Actions.dashBoard();
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
      this.setState({
        title: decode_utf8(draftDetails.title),
        locationText: draftDetails.location.description,
        itemList: draftDetails.files,
        year: {...this.state.year, value: draftDetails.date.year},
        month: {
          ...this.state.month,
          value: MonthObj.month[MonthObj.selectedIndex],
        },
        day: {
          ...this.state.day,
          value: draftDetails.date.day > 0 ? draftDetails.date.day : 'Day',
        },
        showDay: draftDetails.date.day > 0 ? true : false,
        isCreatedByUser:
          draftDetails.isCreatedByUser.uid == Account.selectedData().userID,
        padDetails: draftDetails.etherpad_details,
        ownerDetails: draftDetails.isCreatedByUser,
        youWhereThere: draftDetails.youWhereThere,
        taggedCount: draftDetails.taggedCount,
        collaboratorOwner: draftDetails.collaboratorOwner,
      });
      // if(!(draftDetails.isCreatedByUser.uid == Account.selectedData().userID)){
      // 	CollaboratorActionAPI({nid : this.props.draftNid,
      // 		id : Account.selectedData().userID,
      // 		action_type: CollaboratorsAction.joinCollaboration})
      // }
      this.setEtherPadContent('get', '', draftDetails.etherpad_details.padId);
    } else {
      ToastMessage(draftDetails, Colors.ErrorColor);
    }
    setTimeout(() => {
      loaderHandler.hideLoader();
    }, 500);
  };

  componentDidMount = () => {
    DefaultPreference.get('hide_memory_draft').then((value: any) => {
      if (value == 'true') {
        this.state.memoryDraftVisibility = false;
      } else {
        this.state.memoryDraftVisibility = true;
      }
    });
    this.props.resetAll();
    let recentTag = {searchType: kRecentTags, searchTerm: ''};
    if (this.props.editMode) {
      loaderHandler.showLoader('Loading...');
      GetDraftsDetails(this.props.draftNid);
    } else {
      let title = decode_utf8(this.props.textTitle);
      title = title.replace(/\n/g, ' ');
      if (title.length > 150) {
        title = title.substring(0, 150);
      }
      // this.setEtherPadContent("set", description);
      this.setState({
        itemList: this.props.attachments,
        padDetails: this.props.padDetails,
        title: decode_utf8(this.props.textTitle),
        location: this.props.location,
        year: {...this.state.year, value: this.props.memoryDate.year},
        month: {
          ...this.state.month,
          value:
            MonthObj.month[
              this.currentDate.getMonth() + MonthObj.serverMonthsCount
            ],
        },
        isCreatedByUser: true,
        date: {...this.state.day, value: this.props.memoryDate.day},
      });
      this.props.setNid(this.props.id);
      this.setEtherPadContent('get', '', this.props.padDetails.padId);
    }
    // this.setEtherPadContent('set', decode_utf8(this.props.textTitle), this.props.padDetails.padId);
    this.props.recentTags(recentTag);
    this.props.collectionAPI();
  };

  setEtherPadContent(type: any, description: any, padId?: any) {
    this.props.etherpadContentUpdate({
      padId: padId ? padId : this.state.padDetails.padId,
      content: description,
      type: type,
    });
  }

  memorySaveCallback = (success: any, id?: any, padId?: any, key?: any) => {
    loaderHandler.hideLoader();
    if (success) {
      EventManager.callBack('showConfetti');
      if (key == kPublish) {
        Alert.alert(
          'Memory created',
          `Your Memory is published. Check your Recent to view your memory.`,
          [
            {
              text: 'Ok',
              style: 'default',
              onPress: () => {
                Actions.dashBoard();
                loaderHandler.showLoader();
              },
            },
          ],
        );
      } else if (this.props.editPublsihedMemory) {
        Alert.alert('Memory saved', `Your memory has been saved.`, [
          {
            text: 'Ok',
            style: 'default',
            onPress: () => {
              Keyboard.dismiss();
              EventManager.callBack('memoryUpdateRecentListener');
              EventManager.callBack('memoryUpdateTimelineListener');
              EventManager.callBack('memoryUpdatePublishedListener');
              EventManager.callBack('memoryDetailsListener');
              Actions.pop();
              loaderHandler.showLoader();
            },
          },
        ]);
      } else {
        Alert.alert(
          'Memory saved',
          `Your memory has been saved! Check the My Memories to view your draft.`,
          [
            {
              text: 'Ok',
              style: 'default',
              onPress: () => {
                EventManager.callBack(kReloadDraft);
                Actions.jump('memoriesDrafts');
              },
            },
          ],
        );
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
    this._actionSheet && this._actionSheet.hideSheet();
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
      Actions.push('memoryDetails', {
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
        memoryDataModel.shareOption.color = '#50B660';
        break;
      case 'allfriends':
        memoryDataModel.shareOption.shareText = 'Shared with All Friends';
        memoryDataModel.shareOption.color = '#0077B2';
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
        memoryDataModel.shareOption.color = '#0077B2';
        break;
      case 'cueback':
        memoryDataModel.shareOption.shareText = 'Shared with Public';
        memoryDataModel.shareOption.color = '#BE6767';
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
      Actions.push('commonListCreateMemory', {
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
      Actions.push('collectionList');
    } else {
      No_Internet_Warning();
    }
  };

  whoElseWasthere = () => {
    this.hideMenu();
    if (Utility.isInternetConnected) {
      Actions.push('commonListCreateMemory', {
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
        onPress: () => {},
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
      Actions.push('whoCanSee');
    } else {
      No_Internet_Warning();
    }
  };

  saveDraft = () => {
    Keyboard.dismiss();
    this.saveIntitals();
    this.hideMenu();
    // this._actionSheet && this._actionSheet.hideSheet()
    if (this.props.editPublsihedMemory) {
      this.saveORPublish('save');
    } else if (this.state.isCreatedByUser) {
      this.setState(
        {
          actionSheet: {
            title: 'Memory Draft',
            type: this.kSaveAction,
            list: SaveActions,
          },
        },
        this._actionSheet && this._actionSheet.showSheet(),
      );
    } else {
      this.saveORPublish('save');
    }
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
        this._mainItemList.scrollToOffset({animated: true, offset: 0});
      }
    }

    if (this.state.year.value == 'Year*') {
      this.setState({
        year: {...this.state.year, error: true},
        dateError: '* Please enter a year and month to publish your memory',
      });
    }

    if (this.state.month.value.tid == 0) {
      this.setState({
        month: {...this.state.month, error: true},
        dateError: '* Please enter a year and month to publish your memory',
      });
    }

    if (checkLocation && this.state.locationText.trim().length == 0) {
      this.setState({
        locationError: '* Please enter a location to publish your memory',
      });
    }

    if (this.state.title.trim().length == 0) {
      this.setState({titleError: '* Title is mandatory'});
    }

    return false;
  };

  /**Menu options for actions*/
  menuOptions: Array<menuOption> = [
    {key: 1, title: 'Preview...', onPress: this.preview},
    {key: 2, title: 'Who can see...', onPress: this.whoCanSee},
    {key: 3, title: 'Add/Remove Tags...', onPress: this.addRemoveTags},
    {key: 5, title: 'Who else was there...', onPress: this.whoElseWasthere},
    {key: 4, title: 'Add to Collections...', onPress: this.addToCollections},
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
    if (Utility.isInternetConnected) {
      loaderHandler.showLoader('Saving');
      setTimeout(() => {
        if (this.filesToUpdate.length > 0) {
          UpdateAttachments(this.props.nid, this.filesToUpdate, key);
        } else {
          let memoryDetails = DefaultCreateMemoryObj(
            key,
            this.props.memoryObject,
            this.state.isCreatedByUser,
          );
          let filesToUpload = this.state.itemList.filter(
            (element: any) => element.isLocal,
          );
          CreateUpdateMemory(
            memoryDetails,
            filesToUpload,
            'createMemoryMainListener',
            key,
          );
        }
      }, 500);
    } else {
      No_Internet_Warning();
    }
  };

  saveIntitals = () => {
    let details: any = {
      title: this.state.title.trim(),
      memory_date: {
        year: this.state.year.value,
      },
      location: {
        description: this.state.locationText,
        reference:
          this.state.locationText == this.state.location.description
            ? this.state.location.reference
            : '',
      },
      files: this.state.itemList,
    };
    if (MonthObj.selectedIndex <= MonthObj.serverMonthsCount - 1) {
      details.memory_date = {
        ...details.memory_date,
        season: MonthObj.month[MonthObj.selectedIndex].tid,
      };
    } else {
      details.memory_date = {
        ...details.memory_date,
        month: MonthObj.month[MonthObj.selectedIndex].tid,
        day: this.state.day.value != 'Day' ? this.state.day.value : undefined,
      };
    }
    this.props.onInitialUpdate(details);
  };

  componentWillUnmount = () => {
    Keyboard.dismiss();
    this.props.resetLocation();
    this.showHideMenuListener.removeListener();
    this.saveDraftListener.removeListener();
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
      this._actionSheet && this._actionSheet.showSheet(),
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
      Actions.commonAudioRecorder({
        mindPopID: 0,
        selectedItem: selectedItem ? selectedItem : null,
        hideDelete: true,
        editRefresh: (file: any[]) => {
          Keyboard.dismiss();
          let fid = GenerateRandomID();
          let tempFile: TempFile[] = file.map(obj => ({...obj, fid}));
          this.fileCallback(tempFile);
        },
        reset: () => {},
        deleteItem: () => {},
      });
    }
  };

  inviteCollaboratorFlow = () => {
    let collaborators = this.props.memoryObject.collaborators;
    let keyForPreference =
      Account.selectedData().instanceURL +
      Account.selectedData().userID +
      '-doNotShowAgain';
    DefaultPreference.get(`${keyForPreference}`).then((value: any) => {
      if (value != 'true' || collaborators.length > 0) {
        Actions.push('inviteCollaborators', {
          showLeaveConversation: !this.state.isCreatedByUser,
          owner: this.state.ownerDetails
            ? this.state.ownerDetails
              ? this.state.collaboratorOwner
              : {}
            : {},
        });
      } else {
        Actions.push('commonFriendsSearchView', {
          title: 'Invite Collaborators',
          refListFriends: [],
          refListFriendCircles: [],
          tag: kCollaborators,
        });
      }
    });
  };
  toolbar = () => {
    return (
      <KeyboardAccessory
        style={{
          backgroundColor: '#fff',
          position: 'absolute',
          width: '100%',
          flexDirection: 'row',
          paddingRight: 15,
          paddingLeft: 15,
          justifyContent: 'center',
          alignItems: 'center',
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: 'rgba(0,0,0,0.4)',
        }}>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '100%',
          }}>
          <View style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                CaptureImage(this.fileCallback);
              }}
              style={style.toolbarIcons}>
              <Image source={camera} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.audioAttachmentPress();
              }}
              style={style.toolbarIcons}>
              <Image source={record} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.uploadOption()}
              style={style.toolbarIcons}>
              <Image source={icon_upload_file} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          {this.props.editPublsihedMemory ? null : (
            <TouchableOpacity
              onPress={() => this.inviteCollaboratorFlow()}
              style={[style.toolbarIcons, {flexDirection: 'row'}]}>
              <Text
                style={{
                  ...fontSize(16),
                  fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                  color: Colors.NewTitleColor,
                  marginRight: 5,
                }}>
                Collaborate
              </Text>
              <Image source={icon_collaborators} resizeMode="contain" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAccessory>
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
      // 				style={style.toolbarIcons}>
      // 	    		<Image source={camera} resizeMode="contain" />
      // 			</TouchableOpacity>
      // 			<TouchableOpacity
      // 				onPress={() => {this.audioAttachmentPress()}}
      // 				style={style.toolbarIcons}>
      // 				<Image source={record} resizeMode="contain" />
      // 			</TouchableOpacity>
      // 			<TouchableOpacity
      // 				onPress={() => this.uploadOption()}
      // 				style={style.toolbarIcons}>
      // 				<Image source={icon_upload_file} resizeMode="contain" />
      // 			</TouchableOpacity>
      // 		</View>
      // 		{
      // 				this.props.editPublsihedMemory?
      // 					null
      // 				:
      // 					<TouchableOpacity
      // 					onPress={() => this.inviteCollaboratorFlow()}
      // 					style={[style.toolbarIcons, {flexDirection: "row"}]}>
      // 					<Text style={{...fontSize(16), fontWeight:"500", color : Colors.ThemeColor, marginRight: 5}}>Collaborate</Text>
      // 					<Image source={icon_collaborators} resizeMode="contain" />
      // 					</TouchableOpacity>
      // 			}

      // 	</View>
      // </AccessoryView>
    );
  };

  fileDescriptionClicked = (file: any) => {
    this.hideToolTip();
    Actions.push('fileDescription', {file: file, done: this.updateFileContent});
  };

  renderRow = (data: any) => {
    let index = data.index;
    data = data.item;
    data.by = data.file_owner ? getUserName(data) : 'You';
    let date = data.file_date
      ? data.file_date
      : Utility.dateAccordingToFormat(data.date, 'M d, Y');
    let fileTitle = data.file_title ? data.file_title : '';
    let fileDescription = data.file_description ? data.file_description : '';
    return (
      <View style={{width: '100%'}}>
        {index == 0 && this.viewBeforList()}
        <View
          style={{
            marginTop: 15,
            paddingRight: 15,
            paddingLeft: 15,
            marginBottom: 15,
            borderRadius: 1,
            backgroundColor: 'white',
            borderWidth: 0.5,
            borderColor: 'rgba(0,0,0,0.2)',
            elevation: 2,
            shadowOpacity: 1,
            shadowColor: '#CACACA',
            shadowRadius: 2,
            shadowOffset: {width: 0, height: 2},
          }}>
          <View
            style={{
              height: 40,
              justifyContent: 'space-between',
              padding: 10,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 14, color: Colors.TextColor}}>
              By{' '}
              <Text
                style={{fontWeight: Platform.OS === 'ios' ? '500' : 'bold'}}>
                {data.by}
              </Text>{' '}
              on <Text>{date}</Text>
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
          <View style={{width: '100%', padding: 10}}>
            <TouchableHighlight
              disabled={data.by != 'You'}
              underlayColor={'#cccccc11'}
              onPress={() => this.fileDescriptionClicked(data)}>
              <View>
                {(fileTitle ? fileTitle.length == 0 : true) &&
                (fileDescription ? fileDescription.length == 0 : true) &&
                data.by == 'You' ? (
                  <Text
                    style={{
                      fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                      lineHeight: 20,
                      fontSize: 16,
                      color: Colors.NewYellowColor,
                    }}>
                    {' '}
                    {'Add details'}
                  </Text>
                ) : (
                  <View style={{paddingRight: 25}}>
                    {fileTitle.length > 0 && (
                      <Text
                        style={{
                          ...fontSize(18),
                          fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                          marginBottom: 10,
                          color: Colors.TextColor,
                        }}
                        numberOfLines={3}
                        ellipsizeMode="tail">
                        {fileTitle}
                      </Text>
                    )}
                    {fileDescription.length > 0 && (
                      <Text
                        style={{...fontSize(16), color: Colors.TextColor}}
                        numberOfLines={5}
                        ellipsizeMode="tail">
                        {fileDescription}
                      </Text>
                    )}
                    {data.by == 'You' && (
                      <Image
                        source={edit_icon}
                        style={{position: 'absolute', right: 0, top: 0}}
                      />
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
      this.filesToUpdate.push({fid: fid, action: 'delete'});
    }
    let tempFileArray = this.state.itemList;
    let index = tempFileArray.findIndex((element: any) => element.fid === fid);
    tempFileArray.splice(index, 1);
    this.setState({itemList: tempFileArray});
  };

  updateFileContent = (file: any, title: any, description: any) => {
    // title = title.trim();
    // description = description.trim();
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
    this.setState({itemList: updatelist});
  };

  fileHolderView = (file: any) => {
    switch (file.type) {
      case 'images':
        return (
          <TouchableHighlight
            underlayColor={'#ffffff33'}
            onPress={() =>
              Actions.push('imageViewer', {
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
            style={{
              width: '100%',
              height: 200,
              backgroundColor: Colors.NewLightThemeColor,
            }}>
            <View
              style={{
                width: '100%',
                height: 200,
                position: 'absolute',
                top: 0,
                backgroundColor: Colors.NewLightThemeColor,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <PlaceholderImageView
                uri={file.filePath ? file.filePath : file.thumbnail_url}
                style={{
                  height: '100%',
                  width: '100%',
                  resizeMode: 'contain',
                  backgroundColor: 'transparent',
                }}
              />
            </View>
          </TouchableHighlight>
        );
        break;
      case 'files':
        return (
          <TouchableHighlight
            underlayColor={'#ffffff33'}
            onPress={() => Actions.push('pdfViewer', {file: file})}
            style={{
              width: '100%',
              height: 200,
              backgroundColor: Colors.NewLightThemeColor,
            }}>
            <View
              style={{
                width: '100%',
                height: 200,
                position: 'absolute',
                top: 0,
                backgroundColor: '#cccccc99',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={pdf_icon}
                resizeMode={'contain'}
                style={{
                  backgroundColor: 'transparent',
                  flex: 1,
                }}
              />
              <Image
                source={pdf_icon}
                style={{position: 'absolute', height: 30, bottom: 5, right: 5}}
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
            style={{
              width: '100%',
              height: 90,
              justifyContent: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.AudioViewBg,
              borderColor: Colors.AudioViewBorderColor,
              borderRadius: 10,
              borderWidth: 2,
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  width: 55,
                  height: 55,
                  marginLeft: 15,
                  backgroundColor: 'white',
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: Colors.AudioViewBorderColor,
                  borderWidth: 4,
                }}>
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
              </View>
              <View style={{marginLeft: 10, flex: 1}}>
                <Text
                  style={{
                    flex: 1,
                    ...fontSize(16),
                    color: Colors.TextColor,
                    marginBottom: 5,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {file.filename ? file.filename : file.title ? file.title : ''}
                </Text>
                <Text style={{...fontSize(16), color: Colors.TextColor}}>
                  {file.duration}
                </Text>
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
    let file: any = {};
    switch (index) {
      case 0:
        file = PickImage(this.fileCallback);
        break;
      case 1:
        file = PickAudio(this.fileCallback);
        break;
      case 2:
        file = PickPDF(this.fileCallback);
        break;
      case 4:
        if (this.validateDateAndLocation(false)) {
          this.saveORPublish('');
        }
        break;
      case 5:
        this.saveIntitals();
        if (this.validateDateAndLocation(true)) {
          Actions.push('publishMemoryDraft', {
            publishMemoryDraft: this.saveORPublish,
            preview: this.preview,
            delete: this.deleteDraft,
          });
        }
        break;
    }
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
          {
            flex: flex,
            justifyContent: 'space-between',
            marginEnd: marginEnd,
            flexDirection: 'row',
            borderColor: selectedValue.error
              ? Colors.ErrorColor
              : Colors.TextColor,
          },
          style.inputView,
        ]}
        onPress={() => this.onOptionSelection(fieldName, selectedValue.value)}>
        <Text style={{fontSize: 18}}>
          {fieldName == 'month'
            ? selectedValue.value.name
            : selectedValue.value}
        </Text>
        <View
          style={{
            height: 6,
            width: 10,
            borderTopColor: Colors.TextColor,
            borderTopWidth: 6,
            borderLeftColor: 'transparent',
            borderLeftWidth: 5,
            borderRightColor: 'transparent',
            borderRightWidth: 5,
          }}></View>
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
      selectedItem = {name: selectedItem.text, tid: selectedItem.key};
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
            this.setState({
              month: {...this.state.selectionData, value: MonthObj.month[0]},
            });
            this.setState({day: {...this.state.selectionData, value: 'Day'}});
          } else if (
            currentMonth == selectedMonth &&
            this.state.day.value != 'Day'
          ) {
            let currentDay = currentDate.getDate();
            let selectedDay = parseInt(this.state.day.value);
            if (currentDay < selectedDay) {
              this.setState({day: {...this.state.selectionData, value: 'Day'}});
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
            day: {...this.state.selectionData, value: 'Day'},
            showDay: false,
          });
        } else if (this.state.day.value != 'Day') {
          this.setState({showDay: true});
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
                day: {...this.state.selectionData, value: 'Day'},
                showDay: true,
              });
            }
          }
        } else {
          this.setState({
            day: {...this.state.selectionData, value: 'Day'},
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

  _renderLocation = (locationRow: any) => {
    //console.log(locationRow)
    return (
      <TouchableOpacity
        style={{height: 40, justifyContent: 'center', padding: 10}}
        onPress={() => {
          this.setState({
            location: locationRow.item,
            locationText: locationRow.item.description,
            locationList: [],
          });
          this.props.resetLocation();
        }}>
        <Text
          style={{...fontSize(16), width: '100%'}}
          ellipsizeMode="tail"
          numberOfLines={2}>
          {locationRow.item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  viewBeforList = () => {
    return (
      <View onStartShouldSetResponder={() => true}>
        {this.state.isCreatedByUser ? (
          <View style={{padding: 15}}>
            <Text
              style={{fontSize: 18, marginBottom: 10, color: Colors.TextColor}}>
              {'When did it happen? (Approximate)'}
              <Text style={{color: Colors.ErrorColor}}>{' *'}</Text>
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}
              onStartShouldSetResponder={() => true}>
              {this.createLabelSelector(this.state.year, 10, 2, 'year')}
              {this.createLabelSelector(this.state.month, 10, 3, 'month')}
              {this.state.showDay ? (
                this.createLabelSelector(this.state.day, 0, 2, 'day')
              ) : (
                <View style={{flex: 2, padding: 10}} />
              )}
            </View>

            <Text
              style={{color: Colors.ErrorColor, fontSize: 14, marginBottom: 5}}>
              {this.state.dateError}
            </Text>

            <Text
              style={{fontSize: 18, marginBottom: 10, color: Colors.TextColor}}>
              {'Where did it happen?'}
              <Text style={{color: Colors.ErrorColor}}>{' *'}</Text>
            </Text>
            <SearchBar
              style={{
                height: 50,
                padding: 10,
                alignItems: 'center',
                borderBottomWidth: 1,
                backgroundColor: Colors.NewLightThemeColor,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                borderBottomColor:
                  this.state.locationError.length > 0
                    ? Colors.ErrorColor
                    : Colors.TextColor,
              }}
              placeholder="Enter location here"
              onBlur={() => {
                this.setState({locationList: []});
              }}
              onSearchButtonPress={(keyword: string) => {
                this.setState({showLocationLoader: true});
                this.props.onLocationUpdate(keyword);
              }}
              onClearField={() => {
                this.props.resetLocation();
                this.setState({locationList: []});
              }}
              onChangeText={(text: any) => {
                this.props.onLocationUpdate(text);
                this.setState({locationError: '', locationText: text});
              }}
              // onFocus={()=> this._mainItemList.scrollToOffset({ animated: true, offset: 100})}
              showCancelClearButton={false}
              value={this.state.locationText}
            />
            {this.props.locationList.length > 0 && (
              <FlatList
                keyExtractor={(_, index: number) => `${index}`}
                keyboardShouldPersistTaps={'handled'}
                onScroll={() => {
                  Keyboard.dismiss();
                }}
                style={{
                  backgroundColor: '#F3F3F3',
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  width: '100%',
                }}
                keyExtractor={(_: any, index: number) => `${index}`}
                data={this.props.locationList}
                renderItem={this._renderLocation}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: Colors.TextColor,
                      opacity: 0.5,
                    }}></View>
                )}
              />
            )}

            <Text style={{color: Colors.ErrorColor, fontSize: 14}}>
              {this.state.locationError}
            </Text>

            <TextInput
              style={{
                ...fontSize(18),
                width: '100%',
                height: 50,
                backgroundColor: 'white',
                borderBottomColor:
                  this.state.titleError.length > 0
                    ? Colors.ErrorColor
                    : 'rgba(0.0, 0.0, 0.0, 0.25)',
                borderBottomWidth: 0.5,
                fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
              }}
              value={this.state.title}
              maxLength={150}
              multiline={false}
              onChangeText={(text: any) => {
                this.setState({title: text, titleError: ''});
              }}
              placeholder="Add a title for your memory...*"
              placeholderTextColor={Colors.TextColor}></TextInput>
            <Text style={{color: Colors.ErrorColor, fontSize: 14}}>
              {this.state.titleError}
            </Text>
          </View>
        ) : (
          this.ownersViewForCollaborators()
        )}
        <View
          style={{
            width: '100%',
            backgroundColor: '#fff',
            paddingRight: 15,
            paddingLeft: 15,
          }}>
          {!this.state.isCreatedByUser && (
            <View>
              <Text
                style={{
                  ...fontSize(18),
                  fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                  color: Colors.TextColor,
                  marginBottom: 15,
                  marginTop: 15,
                }}>
                {this.state.title}
              </Text>
              <Border />
            </View>
          )}
          <Text
            style={{...fontSize(16), width: '100%', color: Colors.TextColor}}
            numberOfLines={3}
            ellipsizeMode={'tail'}>
            {this.props.memoryDescription}
          </Text>
          <TouchableOpacity
            onPress={() =>
              Actions.push('etherPadEditing', {
                title: this.state.title.trim(),
                padDetails: this.state.padDetails,
                updateContent: this.setEtherPadContent.bind(this),
                inviteCollaboratorFlow: this.inviteCollaboratorFlow.bind(this),
              })
            }>
            <Text
              style={{
                ...fontSize(16),
                paddingBottom: 10,
                paddingTop: 13,
                width: '100%',
                fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                color: Colors.NewYellowColor,
              }}>
              Edit Description
            </Text>
          </TouchableOpacity>
          {this.state.itemList.length > 0 && (
            <View style={{marginTop: 15}}>
              <Border />
              <Text
                style={{
                  ...fontSize(16),
                  paddingTop: 10,
                  paddingBottom: 10,
                  width: '100%',
                  color: Colors.TextColor,
                }}>
                {'Attachments ('}
                {this.state.itemList.length}
                {')'}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  ownersViewForCollaborators = () => {
    return (
      <View
        style={{
          padding: 15,
          borderBottomColor: '#DFDFDF',
          borderBottomWidth: 12,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View
            style={{
              height: 48,
              width: 48,
              borderRadius: 24,
              overflow: 'hidden',
            }}>
            <PlaceholderImageView
              uri={Utility.getFileURLFromPublicURL(this.state.ownerDetails.uri)}
              borderRadius={Platform.OS === 'android' ? 48 : 24}
              style={{
                height: 48,
                width: 48,
                borderRadius: Platform.OS === 'android' ? 48 : 24,
              }}
              profilePic={true}
            />
          </View>
          <View style={{flex: 1, marginLeft: 12}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                  ...fontSize(16),
                  color: Colors.TextColor,
                }}>
                {this.state.ownerDetails.field_first_name_value}{' '}
                {this.state.ownerDetails.field_last_name_value}
                <Text
                  style={{
                    fontWeight: 'normal',
                    ...fontSize(16),
                    color: Colors.TextColor,
                  }}>
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
                    Actions.push('customListMemoryDetails', {
                      heading: 'Who else where there',
                      itemList: this.props.whoElseWhereThereList,
                    })
                  }>
                  <Text
                    style={{
                      fontWeight: 'normal',
                      ...fontSize(16),
                      color: Colors.NewTitleColor,
                    }}>
                    {this.state.taggedCount}
                    {this.state.taggedCount > 1 ? ' others' : ' other'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Text
              style={{...fontSize(16), paddingTop: 5, color: Colors.TextColor}}>
              {this.state.month.value.name}{' '}
              {this.state.showDay && this.state.day.value},{' '}
              {this.state.year.value}{' '}
              <Text style={{color: '#595959'}}>
                {' '}
                {this.state.locationText}{' '}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    );
  };
  renderForCollaborator = () => {};
  cancelAction = () => {
    Alert.alert('', `Are you sure you want to exit?`, [
      {
        text: 'No',
        style: 'cancel',
        onPress: () => {},
      },
      {
        text: 'Yes',
        style: 'default',
        onPress: () => {
          EventManager.callBack(kReloadDraft);
          this.setState({showMenu: false});
          Keyboard.dismiss();
          Actions.pop();
        },
      },
    ]);
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView
          style={{
            width: '100%',
            flex: 0,
            backgroundColor: Colors.NewThemeColor,
          }}
        />
        <SafeAreaView
          style={{width: '100%', flex: 1, backgroundColor: 'white'}}>
          <View
            style={{
              width: '100%',
              flex: 1,
              backgroundColor: 'white',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
            onStartShouldSetResponder={() => true}
            onResponderStart={this.hideToolTip}>
            <NavigationHeaderSafeArea
              heading={'Memory Draft'}
              showCommunity={true}
              cancelAction={this.cancelAction}
              showRightText={true}
              rightText={
                this.props.editPublsihedMemory
                  ? 'Save'
                  : this.state.isCreatedByUser
                  ? 'Done'
                  : 'Save'
              }
              saveValues={this.saveDraft}
              rightIcon={this.state.isCreatedByUser}
              showHideMenu={() => this.showMenu(!this.state.menuVisibility)}
            />
            <StatusBar
              barStyle={'dark-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            <View
              style={{width: '100%', paddingBottom: 0}}
              onStartShouldSetResponder={() => true}>
              {this.state.itemList.length == 0 ? (
                this.viewBeforList()
              ) : (
                <FlatList
                  ref={ref => (this._mainItemList = ref)}
                  extraData={this.state}
                  keyExtractor={(_, index: number) => `${index}`}
                  style={{width: '100%', marginBottom: 100}}
                  onScroll={() => Keyboard.dismiss()}
                  keyboardShouldPersistTaps={'handled'}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={this.state.itemList}
                  renderItem={(item: any) => this.renderRow(item)}
                />
              )}
            </View>
            {this.state.menuVisibility && (
              <View
                style={{
                  position: 'absolute',
                  top: 50,
                  height: '100%',
                  width: '100%',
                }}
                onStartShouldSetResponder={() => true}
                onResponderStart={this.hideMenu}>
                <View style={style.sideMenu}>
                  {this.menuOptions.map((data: any) => {
                    return (
                      <TouchableOpacity
                        key={data.key}
                        style={{
                          height: 45,
                          justifyContent: 'center',
                          paddingLeft: 10,
                        }}
                        onPress={data.onPress}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: data.color ? data.color : Colors.TextColor,
                          }}>
                          {data.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
            {this.toolbar()}
            <ActionSheet
              ref={ref => (this._actionSheet = ref)}
              width={DeviceInfo.isTablet() ? '65%' : '100%'}
              title={this.state.actionSheet.title}
              actions={this.state.actionSheet.list}
              onActionClick={this.onActionItemClicked.bind(this)}
            />
            {this.state.toolTipVisibility && (
              <View style={{bottom: 0, right: 0, position: 'absolute'}}>
                <View style={style.tooltipStyle}>
                  <Text
                    style={{
                      width: 200,
                      padding: 10,
                      fontSize: 16,
                      color: '#fff',
                    }}>
                    {'Tap here to invite collaborators to help you'}
                  </Text>
                </View>
                <View style={style.toolTipArrow}></View>
              </View>
            )}
            <BottomPicker
              ref={this.bottomPicker}
              onItemSelect={(selectedItem: any) => {
                this.dateSelected(selectedItem);
              }}
              title={this.state.selectionData.title}
              actions={this.state.selectionData.actions}
              value={this.state.selectionData.selectionValue}
              selectedValues={[this.state.selectionData.selectionValue]}
            />
          </View>
          {this.state.memoryDraftVisibility && (
            <MemoryDraftIntro
              cancelMemoryDraftTour={() => {
                this.setState({memoryDraftVisibility: false});
                DefaultPreference.set('hide_memory_draft', 'true').then(
                  function () {},
                );
              }}></MemoryDraftIntro>
          )}
        </SafeAreaView>
      </View>
    );
  }
}
const style = StyleSheet.create({
  toolbarIcons: {
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    paddingRight: 5,
    paddingLeft: 5,
  },
  selectedText: {
    lineHeight: 20,
    fontSize: 16,
    color: Colors.TextColor,
  },
  sideMenu: {
    right: 10,
    backgroundColor: '#fff',
    minHeight: 50,
    width: 180,
    position: 'absolute',
    borderRadius: 5,
    shadowOpacity: 1,
    elevation: 2,
    shadowColor: '#CACACA',
    shadowRadius: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {width: 0, height: 2},
  },
  tooltipStyle: {
    width: 210,
    height: 60,
    backgroundColor: 'black',
    borderRadius: 5,
    position: 'absolute',
    bottom: 50,
    right: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolTipArrow: {
    height: 15,
    width: 15,
    borderTopColor: 'black',
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftWidth: 7.5,
    borderRightWidth: 7.5,
    bottom: 37,
    right: 22,
    position: 'absolute',
  },
  inputView: {
    height: 50,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    backgroundColor: Colors.NewLightThemeColor,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
});

const mapState = (state: {[x: string]: any}) => {
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
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    onLocationUpdate: (payload: any) =>
      dispatch({type: LocationAPI, payload: payload}),
    resetLocation: () => dispatch({type: ResetLocation, payload: ''}),
    onInitialUpdate: (payload: any) =>
      dispatch({type: MemoryInitialsUpdate, payload: payload}),
    recentTags: (payload: any) =>
      dispatch({type: MemoryTagsAPI, payload: payload}),
    collectionAPI: () => dispatch({type: CollectinAPI}),
    saveNid: (payload: any) => dispatch({type: SaveNid, payload: payload}),
    saveFiles: (payload: any) =>
      dispatch({type: SaveAttachedFile, payload: payload}),
    setNid: (payload: any) => dispatch({type: SaveNid, payload: payload}),
    resetAll: (payload: any) => dispatch({type: ResetALL, payload: payload}),
    setPadID: (payload: any) => dispatch({type: SaveNid, payload: payload}),
    setDescription: (payload: any) =>
      dispatch({type: SaveDescription, payload: payload}),
    etherpadContentUpdate: (payload: any) =>
      dispatch({type: EtherPadContentAPI, payload: payload}),
    setEditContent: (payload: any) =>
      dispatch({type: EditContent, payload: payload}),
  };
};

export default connect(mapState, mapDispatch)(CreateMemory);
