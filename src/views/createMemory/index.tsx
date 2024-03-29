import React, { createRef, useEffect, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomActionSheet, { ActionSheetItem } from '../../common/component/actionSheet';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';

import SelectDropdown from 'react-native-select-dropdown';
import Text from '../../common/component/Text';
import {
  Colors,
  CommonTextStyles,
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
// import EtherPadEditing from './etherpadWebView';
import { kSaveDraft, kShowHideMenu } from './header';
import styles from './styles';
// @ts-ignore
import { connect } from 'react-redux';
import {
  CaptureImage,
  PickAudio,
  PickImage,
  PickPDF,
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
import analytics from '@react-native-firebase/analytics';
import {
  EditContent,
  MemoryInitials,
  MemoryInitialsUpdate,
  NavigateToDashboard,
  ResetALL,
  ResetLocation,
  SaveAttachedFile,
  SaveDescription,
  SaveNid,
  SelectedLocation,
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
import { arrowRight, audio, calendarWrite, image, images, map_pin, pdf, upload, x } from '../../../app/images';
import CustomAlert from '../../common/component/customeAlert';
import {
  CreateAMemory,
  dashboardReducer,
  GET_MEMORY_LIST,
  ListType,
  SHOW_LOADER_READ,
  SHOW_LOADER_TEXT,
} from '../dashboard/dashboardReducer';
import DatePicker from './../../common/component/datePicker';
import Styles from './styles';
import BusyIndicator from '../../common/component/busyindicator';
import TextField from '../../common/component/textField';
import SearchBar from '../../common/component/SearchBar';
import { useIsFocused } from '@react-navigation/native';

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
const countries = ["Egypt", "Canada", "Australia", "Ireland"];

export const MonthObj: any = {
  serverMonthsCount: 0,
  selectedIndex: 0,
  month: months,
};

const CreateMemory = (props: Props) => {
  let showHideMenuListener: EventManager;
  let saveDraftListener: EventManager;
  let createMemoryHelper: any = new CreateMemoryHelper();
  let _actionSheet = useRef();
  let optionsActionSheetRef = useRef<ActionSheetRef>(null);

  let _mainItemList: any = null;
  let kUploadAction: 'uploadAction';
  let kSaveAction: 'saveAction';

  // let moment: string;
  //InputRef reference
  let _inputRef: TextInput | any;
  let keyboardDidShowListener: any;
  let keyboardDidHideListener: any;

  let dateOptions: DatePickerOptions = {
    display: 'calendar',
    maximumDate: new Date(),
    value: new Date(),
    minimumDate: new Date(1917, 1, 1),
    onChange: (event, date) => {
      setShowCalendar(false)
      setMemoryDate(moment(date).utc().format('DD/MM/YYYY'))
    },
  };

  //Files array list
  files: Array<MindPopAttachment & { type: string; uri: string }>;

  let newMemoryYears = new CreateMemoryHelper().getDateOptions(
    'year',
    new Date().getFullYear(),
  );

  //Component default state
  let currentDate = new Date();
  let etherpadUrl: string = '';

  const [menuVisibility, setMenuVisibility] = useState(false);
  const [actionSheet, setActionSheet] = useState({
    title: '',
    type: '',
    list: ImageActions,
  })
  const [itemList, setItemList] = useState([])
  const [year, setYear] = useState({
    value: '',//currentDate.getUTCFullYear().toString(),
    error: false,
  })
  const [month, setMonth] = useState({
    value: '',// MonthObj.month[currentDate.getUTCMonth()],
    error: false,
  })
  const [day, setDay] = useState({
    value: '',//currentDate.getDate(),
    error: false,
  })
  const [yearNew, setYearNew] = useState({
    value: '',//currentDate.getUTCFullYear().toString(),
    error: false,
  })
  const [monthNew, setMonthNew] = useState({
    value: '',// MonthObj.month[currentDate.getUTCMonth()],
    error: false,
  })
  const [dayNew, setDayNew] = useState({
    value: '',//currentDate.getDate(),
    error: false,
  })
  const [doNotReload, setDoNotReload] = useState(false)
  const [memory_date, setMemoryDate] = useState('')
  const [description, setDescription] = useState('')
  const [dateError, setDateError] = useState('')
  const [locationError, setLocationError] = useState('')
  const [locationText, setLocationText] = useState('')
  const [showDay, setShowDay] = useState(true)
  const [location, setLocation] = useState({ description: '', reference: '' })
  const [selectionData, setSelectionData] = useState({
    actions: [],
    selectionValue: '',
    fieldName: '',
    title: '',
  })
  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState('')
  const [bottomToolbar, setBottomBar] = useState(0)
  const [isCreatedByUser, setIsCreatedByUser] = useState(true)
  const [taggedCount, setTaggedCount] = useState(0)
  const [collaboratorOwner, setCollaboratorOwner] = useState('')
  const [memoryDraftVisibility, setMemoryDraftVisibility] = useState(false)
  const [showActionAndroid, setShowActionAndroid] = useState(false)
  const [padDetails, setPadDetails] = useState({})
  const [showCustomAlert, setShowCustomAlert] = useState(false)
  const [showCalender, setShowCalendar] = useState(false)
  const [showEtherPad, setShowEtherPad] = useState(true)
  const [showCustomValidationAlert, setShowCustomValidationAlert] = useState(false)
  const [placeholder, setPlaceHolder] = useState('Tap to title your memory...')
  const [toolTipVisibility, setToolTilvisibility] = useState(false)
  const [youWhereThere, setYouWhereThere] = useState('')
  const [ownerDetails, setOwnerDetails] = useState('')

  const [optionToShow, setOptionToShow] = useState('')

  let isEdit: boolean = false;
  let isFocused = useIsFocused();
  // filePathsToUpload: string[];

  // let filesToUpdate: Array<any> = [];
  const [filesToUpdate, setFilesToUpdate]: any[] = useState([]);
  let listener: EventManager;
  let backListner: EventManager;

  const _keyboardDidShow = (e: any) => {
    setBottomBar(e.endCoordinates.height)
  };

  const _keyboardDidHide = (e: any) => {
    setBottomBar(0)
  };

  const cancelAction = () => {

  };


  if (Platform.OS == 'android') {
    keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );
  }
  else {
    keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      _keyboardDidShow,
    );
    keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      _keyboardDidHide,
    );
  }
  MonthObj.selectedIndex =
    currentDate.getMonth() + MonthObj.serverMonthsCount;
  backListner = EventManager.addListener(
    'hardwareBackPress',
    cancelAction,
  );

  const deleteDraftCallback = (success: any) => {

    if (success) {
      //loaderHandler.showLoader();
      props.showLoader(true);
      props.loaderText('Loading...');
      // props.navigation.navigate('dashBoard');
      setLocation({ description: '', reference: '' })
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'dashBoard' }]
      })
    } else {
      //ToastMessage('Unable to delete draft. Please try again later');
    }
  };

  const draftDetailsCallBack = (success: any, draftDetails: any) => {
    if (success) {
      draftDetails = new MemoryDraftsDataModel().getEditContentObject(
        draftDetails
      );

      props.setEditContent(draftDetails);
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
      let validAlphabatesReg = /^[a-zA-Z]*$/;

      let newMemoryDate = draftDetails.memory_date
        ? new Date(parseInt(draftDetails.memory_date) * 1000).getUTCDate() +
        '/' +
        (new Date(parseInt(draftDetails.memory_date) * 1000).getUTCMonth() + 1) +
        '/' +
        new Date(parseInt(draftDetails.memory_date) * 1000).getUTCFullYear()
        : '';
      // console.warn("draftDetails >", JSON.stringify(draftDetails))

      setTitle(decode_utf8(draftDetails.title))
      if (draftDetails.location.description) {
        setLocation(draftDetails.location)
      }
      setLocationText(draftDetails.location.description)
      setItemList(draftDetails.files)
      props.saveFiles(draftDetails.files);

      if (draftDetails.date.year) {
        setYear({ ...year, value: draftDetails.date.year ? draftDetails.date.year : '' })
        setYearNew({ ...year, value: draftDetails.date.year ? draftDetails.date.year : '' })
      }
      if (draftDetails.date.month && validAlphabatesReg.test(draftDetails.date.month)) {
        setMonth({
          ...month,
          value: draftDetails.date.month
        })
        setMonthNew({
          ...month,
          value: draftDetails.date.month
        })
      }
      else if (draftDetails.date.month) {
        setMonth({
          ...month,
          value: draftDetails.date.month ? draftDetails.date.month : '',//MonthObj.month[MonthObj.selectedIndex],
        })
        setMonthNew({
          ...month,
          value: draftDetails.date.month ? draftDetails.date.month : '',//MonthObj.month[MonthObj.selectedIndex],
        })
      }

      if (draftDetails.date.day) {
        setDay({
          ...day,
          value: draftDetails.date.day ? draftDetails.date.day : '',
        })
        setDayNew({
          ...day,
          value: draftDetails.date.day ? draftDetails.date.day : '',
        })
        setShowDay(parseInt(draftDetails.date.day) > 0 ? true : false)
      }

      setMemoryDate(newMemoryDate ? newMemoryDate : '')
      setIsCreatedByUser(draftDetails.isCreatedByUser.uid == Account.selectedData().userID)
      setPadDetails(draftDetails.etherpad_details)
      // ownerDetails
      setOwnerDetails(draftDetails.isCreatedByUser)
      // youWhereThere
      setYouWhereThere(draftDetails.youWhereThere)
      setTaggedCount(draftDetails.taggedCount)
      setCollaboratorOwner(draftDetails.collaboratorOwner),

        //loaderHandler.hideLoader();
        props.showLoader(false);
      props.loaderText('Loading...');
      setEtherPadContent(
        'get',
        '',
        draftDetails.etherpad_details.padId,
      );

      // if(!(draftDetails.isCreatedByUser.uid == Account.selectedData().userID)){
      // 	CollaboratorActionAPI({nid : props.draftNid,
      // 		id : Account.selectedData().userID,
      // 		action_type: CollaboratorsAction.joinCollaboration})
      // }
      // //loaderHandler.hideLoader();
    }
    else {
      //loaderHandler.hideLoader();

      //ToastMessage(draftDetails, Colors.ErrorColor);
    }
    props.showLoader(false);
    props.loaderText('Loading...');
  };

  const getData = async () => {
    let recentTag = { searchType: kRecentTags, searchTerm: '' };
    setLocation({ description: '', reference: '' });
    if (props.route.params.editMode) {
      //loaderHandler.showLoader('Loading...');
      props.showLoader(true);
      props.loaderText('Loading...');
      let response: any = await GetDraftsDetails(
        props.route.params.draftNid,
        resp => draftDetailsCallBack(resp.status, resp.responseData),
      );
    }
    else {

      let title = decode_utf8(props.route.params.textTitle);
      title = title.replace(/\n/g, ' ');
      if (title.length > 150) {
        title = title.substring(0, 150);
      }

      setItemList(props.route.params.attachments)
      props.saveFiles(props.route.params.attachments);

      setPadDetails(props.route.params.padDetails)
      setTitle(decode_utf8(props.route.params.textTitle))
      setLocation(props.route.params.location)
      if (props.route.params?.memoryDate?.year) {
        setYear({
          ...year,
          value: typeof (props.route.params?.memoryDate?.year) == 'string' ? props.route.params?.memoryDate?.year : JSON.stringify(props.route.params?.memoryDate?.year),
        })
        setYearNew({
          ...year,
          value: typeof (props.route.params?.memoryDate?.year) == 'string' ? props.route.params?.memoryDate?.year : JSON.stringify(props.route.params?.memoryDate?.year),
        })

        if (props.route.params?.memoryDate?.month) {
          let navigationMonth = !isNaN(parseInt(props.route.params?.memoryDate?.month)) ? parseInt(props.route.params?.memoryDate?.month) : '';

          setMonth({
            ...month,
            value: navigationMonth <= 9 ? ('0' + navigationMonth) : navigationMonth.toString()
          })
          setMonthNew({
            ...month,
            value: navigationMonth <= 9 ? ('0' + navigationMonth) : navigationMonth.toString()
          })
        }

        if (props.route.params?.memoryDate?.day) {
          let navigationDay = !isNaN(parseInt(props.route.params?.memoryDate?.day)) ? parseInt(props.route.params?.memoryDate?.day) : '';
          setDay({
            ...day,
            value: navigationDay <= 9 ? ('0' + navigationDay) : navigationDay.toString()
          })
          setDayNew({
            ...day,
            value: navigationDay <= 9 ? ('0' + navigationDay) : navigationDay.toString()
          })
        }

      }

      setIsCreatedByUser(true)
      props.setNid(props.route.params.id);
      //loaderHandler.hideLoader();
      props.showLoader(false);
      props.loaderText('Loading...');
      setEtherPadContent(
        'get',
        '',
        props.route.params.padDetails.padId,
      );

    }
    props.recentTags(recentTag);
    props.collectionAPI();
  };

  useEffect(() => {
    props.resetAll();
    props.setCreateMemory(true);

    getData();

    return () => {
      Keyboard.dismiss();
      console.log("useeffect doNotReload >", doNotReload)
      setDoNotReload(false);
      props.resetAll();
      setLocation({ description: '', reference: '' });
      backListner.removeListener();
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();

    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      console.log("props.route.params >", JSON.stringify(props.route.params), doNotReload, (props.route.params?.isFromPrompt, props.route.params?.editPublsihedMemory, props.route.params?.editPublsihedMemory, props.route.params?.editMode))
      if (!doNotReload && (props.route.params?.isFromPrompt || props.route.params?.editPublsihedMemory || props.route.params?.editPublsihedMemory || props.route.params?.editMode)) {
        // props.resetAll();
        props.setCreateMemory(true);
        getData();
      }
    }

    return () => {
      console.log("focured doNotReload >", doNotReload)
      // setLocation({ description: '', reference: '' })
      // props.resetAll();
      Keyboard.dismiss();
      setDoNotReload(false);
    }
  }, [isFocused]);


  // };

  const setEtherPadContent = (type: any, description: any, padId?: any) => {
    try {
      props.etherpadContentUpdate({
        padId: padId ? padId : padDetails?.padId,
        content: description,
        type: type,
      });
    } catch (error) { }
  }

  const memorySaveCallback = async (success: any, id?: any, padId?: any, key?: any) => {
    // //loaderHandler.hideLoader();

    if (success) {
      if (key == kPublish) {
        props.showAlertCall(true);
        props.showAlertCallData({
          title: 'Memory published! 🎉',
          desc: `Nice work writing Shakespeare! Your new memory has been published!`,
        });
        // props.navigateToDashboard(true);
        // props.fetchMemoryList({ type: ListType.Recent, isLoading: true });
        await analytics().logEvent('new_memory_published');
        props.resetAll();
        setLocation({ description: '', reference: '' })
        props.showLoader(false);
        props.loaderText('Loading...');
        props.navigation.replace('dashBoard');

      } else if (props.route.params.editPublsihedMemory) {
        props.showAlertCall(true);
        props.showAlertCallData({
          title: 'Memory saved',
          desc: `Your memory has been saved.`,
        });
        await analytics().logEvent('memory_save_as_draft');
        setLocation({ description: '', reference: '' })

        Keyboard.dismiss();
        props.resetAll();
        props.navigation.reset({
          index: 0,
          routes: [{ name: 'writeTabs' }]
        })
        // props.navigation.writeTabs();
        // //loaderHandler.showLoader();
        props.showLoader(true);
        props.loaderText('Loading...');
      }
      else {
        props.showAlertCall(true);
        setLocation({ description: '', reference: '' })
        props.resetAll();
        props.showAlertCallData({
          title: 'New draft saved!',
          desc: `You can see your new draft added with the rest of your in-progress work now.`,
        });
        props.navigation.replace('writeTabs', {
          showPublishedPopup: true,
          title: 'New draft saved!',
          desc: `You can see your new draft added with the rest of your in-progress work now.`,
        });

      }
    } else {
      //loaderHandler.hideLoader();
      props.showLoader(false);
      props.loaderText('Loading...');
      //ToastMessage(id, Colors.ErrorColor);
    }
  };

  const showMenu = (showMenu?: boolean) => {
    Keyboard.dismiss();
    hideToolTip();
    _actionSheet &&
      _actionSheet &&
      _actionSheet.hideSheet();
    setMenuVisibility(!menuVisibility)
  };

  const preview = () => {
    //loaderHandler.showLoader();
    props.showLoader(true);
    props.loaderText('Loading...');
    saveIntitals();
    hideMenu();
    setTimeout(() => {
      //loaderHandler.hideLoader();
      props.showLoader(false);
      props.loaderText('Loading...');
      props.navigation.navigate('memoryDetails', {
        previewDraft: true,
        // memoryDetails: getDetailsForPreview(),
      });
    }, 1000);
  };

  const getDetailsForPreview = () => {
    let memoryDataModel = new MemoryDataModel();
    memoryDataModel.shareOption.available = true;
    switch (props.shareOption) {
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
        props.whoCanSeeMemoryGroupIds.forEach((element: any) => {
          share_count =
            share_count + element.users_count ? element.users_count : 0;
        });
        share_count = share_count + props.whoCanSeeMemoryUids.length;
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
      '<p><p>' + props.memoryDescription + '</p></p>';
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
    memoryDataModel.memoryTags = props.memoryObject.tags;
    memoryDataModel.memory.memoryTitle = props.memoryObject.title;
    memoryDataModel.memory.memoryDate =
      month.value.name + ' ' + props.memoryObject.date.year;
    memoryDataModel.memory.memoryPlace = props.memoryObject.location
      .description
      ? props.memoryObject.location.description
      : '';
    memoryDataModel.memory.whoElseWasThere = props.whoElseWhereThereList;
    memoryDataModel.memory.whoElseWasThere.forEach(
      (element: any, index: any) => {
        if (element.uid == Account.selectedData().userID) {
          memoryDataModel.memory.youWhereThere = true;
          memoryDataModel.memory.whoElseWasThere.splice(index, 1);
        }
      },
    );
    // if(props.collection.tid){
    // 		memoryDataModel.memorycollection.collectionName =  props.collection.name
    // 		memoryDataModel.memorycollection.collectionId = props.collection.tid
    // }
    memoryDataModel.files = {
      images: itemList.filter(
        (element: any) => element.type == 'images',
      ),
      audios: itemList.filter(
        (element: any) => element.type == 'audios',
      ),
      pdf: itemList.filter(
        (element: any) => element.type == 'files',
      ),
    };
    return memoryDataModel;
  };

  const deleteDraft = () => {
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
          hideMenu();
          if (Utility.isInternetConnected) {
            //loaderHandler.showLoader('Deleting...');
            props.showLoader(true);
            props.loaderText('Deleting...');
            DeleteDraftService(
              props.nid,
              DraftActions.deleteDrafts,
              response => {
                deleteDraftCallback(response.status)
              }
            );
          } else {
            No_Internet_Warning();
          }
        },
      },
    ]);
  };

  const saveDraft = () => {
    Keyboard.dismiss();
    // saveIntitals();
    hideMenu();
    if (
      title != '' &&
      memory_date != ''
      && description != ''
    ) {
      setActionSheet({
        title: 'Memory Draft',
        type: kSaveAction,
        list: publishActions,
      })
    }

    if (Platform.OS == 'ios') {
      debugger
      _actionSheet &&
        _actionSheet &&
        _actionSheet.showSheet();
    } else {
      setShowActionAndroid(true)
    }
    // if (props.editPublsihedMemory) {
    //   saveORPublish('save');
    // }
    // else if (isCreatedByUser) {
    //   setState(
    //     {
    //       actionSheet: {
    //         title: 'Memory Draft',
    //         type: kSaveAction,
    //         list: SaveActions,
    //       },
    //     },
    //     _actionSheet && _actionSheet.showSheet(),
    //   );
    // } else {
    //   saveORPublish('save');
    // }
  };

  const validateDateAndLocation = (checkLocation: boolean) => {
    if (
      year.value != 'Year*' &&
      title.trim().length > 0 &&
      month.value.tid != 0 &&
      (!checkLocation || locationText.trim().length > 0)
    ) {
      return true;
    } else {
      if (_mainItemList) {
        _mainItemList.scrollToOffset({ animated: true, offset: 0 });
      }
    }

    if (year.value == 'Year*') {
      setYear({ ...year, error: true })
      setDateError('* Please enter a year and month to publish your memory')
    }

    if (month.value.tid == 0) {
      setMonth({ ...month, error: true })
      setDateError('* Please enter a year and month to publish your memory')
    }

    if (checkLocation && locationText.trim().length == 0) {
      setLocationError('* Please enter a location to publish your memory')
    }

    if (title.trim().length == 0) {
      setTitleError('* Title is mandatory')
    }

    return false;
  };

  /**Menu options for actions*/
  // const menuOptions: Array<menuOption> = [
  //   { key: 1, title: 'Preview...', onPress: preview },
  //   { key: 2, title: 'Who can see...', onPress: whoCanSee },
  //   { key: 3, title: 'Add/Remove Tags...', onPress: addRemoveTags },
  //   { key: 5, title: 'Who else was there...', onPress: whoElseWasthere },
  //   { key: 4, title: 'Add to Collections...', onPress: addToCollections },
  //   {
  //     key: 6,
  //     title: 'Delete Draft...',
  //     onPress: deleteDraft,
  //     color: Colors.NewRadColor,
  //   },
  // ];

  const fileUpdateCallback = (success: boolean, message: any, key: any) => {
    if (success) {
      // filesToUpdate = [];
      setFilesToUpdate([]);
      setTimeout(() => {
        saveORPublish(key);
      }, 500);
    } else {
      //ToastMessage(message, Colors.ErrorColor);
      //loaderHandler.hideLoader();
      props.showLoader(false);
      props.loaderText('Loading...');
    }
  };

  const saveORPublish = (key: any, fromPublish?: any, data?: any) => {
    if (!fromPublish) {
      saveIntitals();
    }
    //loaderHandler.showLoader('Saving');
    props.showLoader(true);
    props.loaderText('Saving...');
    setTimeout(async () => {
      if (Utility.isInternetConnected) {
        // setTimeout(() => {

        if (filesToUpdate.length > 0) {
         await UpdateAttachments(props.nid, filesToUpdate, key,
            async(response) => {
              if (response.ResponseCode == 200) {

                 await setFilesToUpdate([]);
                  setTimeout(() => {
                    saveORPublish(key);
                  }, 500);
               
              } else {
                   //ToastMessage(message, Colors.ErrorColor);
                  //loaderHandler.hideLoader();
                  props.showLoader(false);
                  props.loaderText('Loading...');
                // EventManager.callBack(kFilesUpdated, false, response.ResponseMessage);
              }
            });
        }
        // else {
        let memoryDetails = await DefaultCreateMemoryObj(
          key,
          data ? data : props.memoryObject,
          isCreatedByUser,
        );
        let filesToUpload = itemList.filter(
          (element: any) => element.isLocal,
        );

        let resp = await CreateUpdateMemory(
          memoryDetails,
          filesToUpload,
          'createMemoryMainListener',
          key,
          resp => {
            if (resp?.Status) {
              memorySaveCallback(
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
        //loaderHandler.hideLoader();
        props.showLoader(false);
        props.loaderText('Loading...');
        No_Internet_Warning();
      }
    }, 1000);
  };

  const saveIntitals = () => {

    let details: any = {
      title: title, //.trim(),
      // memory_date: {
      //   year:
      //     memory_date != ''
      //       ? memory_date.split('/')[2]
      //       : '', //new Date(memory_date).getFullYear(),
      //   month:
      //     memory_date != ''
      //       ? parseInt(memory_date.split('/')[1])
      //       : '', // new Date(memory_date).getMonth(),
      //   day:
      //     memory_date != ''
      //       ? memory_date.split('/')[0]
      //       : '', // new Date(memory_date).getDate(),
      // },
      memory_date: {
        year:
          year.value != ''
            ? year.value
            : '',//new Date().getUTCDate().toString(), //new Date(memory_date).getFullYear(),
        month:
          month.value != ''
            ? month.value.length > 2 ? month.value : month.value
            : '',//new Date().getUTCMonth() + 1, // new Date(memory_date).getMonth(),
        day:
          day.value != ''
            ? day.value
            : '',//new Date().getUTCFullYear().toString(), // new Date(memory_date).getDate(),
      },
      location: { description: location.description, reference: locationText == location.description ? location.reference : '' },
      files: itemList,
      description: '',
    };
    // {
    //   description: locationText,
    //   reference:
    //     locationText == location.description
    //       ? location.reference
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
    //     day: day.value != 'Day' ? day.value : undefined,
    //   };
    // }

    props.onInitialUpdate(details);

  };

  const saveIntitalsForDate = (year, month, day) => {

    let details: any = {
      title: title, //.trim(),
      // memory_date: {
      //   year:
      //     memory_date != ''
      //       ? memory_date.split('/')[2]
      //       : '', //new Date(memory_date).getFullYear(),
      //   month:
      //     memory_date != ''
      //       ? parseInt(memory_date.split('/')[1])
      //       : '', // new Date(memory_date).getMonth(),
      //   day:
      //     memory_date != ''
      //       ? memory_date.split('/')[0]
      //       : '', // new Date(memory_date).getDate(),
      // },
      memory_date: {
        year:
          year.value != ''
            ? year.value
            : '',//new Date().getUTCFullYear().toString(), //new Date(memory_date).getFullYear(),
        month:
          month.value != ''
            ? month.value.length > 2 ? month.value : (month.value)
            : '',//new Date().getUTCMonth() + 1, // new Date(memory_date).getMonth(),
        day:
          day.value != ''
            ? day.value
            : '',//new Date().getUTCDate().toString(), // new Date(memory_date).getDate(),
      },
      location: { description: location.description, reference: locationText == location.description ? location.reference : '' },
      files: itemList,
      description: '',
    };
    // {
    //   description: locationText,
    //   reference:
    //     locationText == location.description
    //       ? location.reference
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
    //     day: day.value != 'Day' ? day.value : undefined,
    //   };
    // }
    // console.log(year, month, day, details)

    props.onInitialUpdate(details);

  };

  const hideMenu = () => {
    setMenuVisibility(false)
  };

  const uploadOption = () => {
    Keyboard.dismiss();
    setActionSheet({
      title: '',
      type: kUploadAction,
      list: ImageActions,
    })

    if (Platform.OS == 'ios') {
      debugger
      _actionSheet &&
        _actionSheet &&
        _actionSheet.showSheet();
    } else {
      setShowActionAndroid(true)
    }
  };

  const audioAttachmentPress = (selectedItem?: any) => {
    console.log(selectedItem)
    Keyboard.dismiss();
    if (
      selectedItem &&
      !selectedItem.isLocal &&
      (selectedItem.filesize == null ||
        selectedItem.filesize == undefined ||
        selectedItem.filesize == '0')
    ) {
      //ToastMessage('This audio file is corrupted', Colors.ErrorColor);
    } else {
      props.navigation.navigate('commonAudioRecorder', {
        mindPopID: 0,
        selectedItem: selectedItem ? selectedItem : null,
        hideDelete: true,
        doNotReload: val => {
          setDoNotReload(val)
        },
        editRefresh: (file: any[]) => {
          Keyboard.dismiss();
          let fid = GenerateRandomID();
          let tempFile: TempFile[] = file.map(obj => ({ ...obj, fid }));
          fileCallback(tempFile);
        },
        reset: () => { },
        deleteItem: () => {
          deleteFile(selectedItem?.fid, selectedItem?.isLocal);
        },
      });
    }
  };

  const inviteCollaboratorFlow = () => {
    let collaborators = props.memoryObject.collaborators;
    let keyForPreference =
      Account.selectedData().instanceURL +
      Account.selectedData().userID +
      '-doNotShowAgain';
    // DefaultPreference.get(`${keyForPreference}`).then((value: any) => {
    //   if (value != 'true' || collaborators.length > 0) {
    //     props.navigation.navigate('inviteCollaborators', {
    //       showLeaveConversation: !isCreatedByUser,
    //       owner: ownerDetails
    //         ? ownerDetails
    //           ? collaboratorOwner
    //           : {}
    //         : {},
    //     });
    //   } else {
    //     props.navigation.navigate('commonFriendsSearchView', {
    //       title: 'Invite Collaborators',
    //       refListFriends: [],
    //       refListFriendCircles: [],
    //       tag: kCollaborators,
    //     });
    //   }
    // });
  };

  const toolbar = () => {
    return Platform.OS == 'android' ? (
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps="always"
        style={styles.toolBarKeyboardAwareScrollViewStyle}>
        <View style={styles.toolBarKeyboardAwareScrollViewContainerStyle}>
          <View style={styles.buttonContainerStyle}>
            <TouchableOpacity
              onPress={() => {
                CaptureImage(fileCallback);
              }}
              style={styles.toolbarIcons}>
              <Image source={camera} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                audioAttachmentPress();
              }}
              style={styles.toolbarIcons}>
              <Image source={record} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => uploadOption()}
              style={styles.toolbarIcons}>
              <Image source={icon_upload_file} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          {props.route.params.editPublsihedMemory ? null : (
            <TouchableOpacity
              onPress={() => inviteCollaboratorFlow()}
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
                CaptureImage(fileCallback);
              }}
              style={styles.toolbarIcons}>
              <Image source={camera} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                audioAttachmentPress();
              }}
              style={styles.toolbarIcons}>
              <Image source={record} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => uploadOption()}
              style={styles.toolbarIcons}>
              <Image source={icon_upload_file} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          {props.route.params.editPublsihedMemory ? null : (
            <TouchableOpacity
              onPress={() => inviteCollaboratorFlow()}
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
    // 		bottom: bottomToolbar,
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
    // 				onPress={() => {CaptureImage(fileCallback)}}
    // 				style={styles.toolbarIcons}>
    // 	    		<Image source={camera} resizeMode="contain" />
    // 			</TouchableOpacity>
    // 			<TouchableOpacity
    // 				onPress={() => {audioAttachmentPress()}}
    // 				style={styles.toolbarIcons}>
    // 				<Image source={record} resizeMode="contain" />
    // 			</TouchableOpacity>
    // 			<TouchableOpacity
    // 				onPress={() => uploadOption()}
    // 				style={styles.toolbarIcons}>
    // 				<Image source={icon_upload_file} resizeMode="contain" />
    // 			</TouchableOpacity>
    // 		</View>
    // 		{
    // 				props.editPublsihedMemory?
    // 					null
    // 				:
    // 					<TouchableOpacity
    // 					onPress={() => inviteCollaboratorFlow()}
    // 					style={[styles.toolbarIcons, {flexDirection: "row"}]}>
    // 					<Text style={{...fontSize(16), fontWeight:"500", color : Colors.ThemeColor, marginRight: 5}}>Collaborate</Text>
    // 					<Image source={icon_collaborators} resizeMode="contain" />
    // 					</TouchableOpacity>
    // 			}

    // 	</View>
    // </AccessoryView>
  };

  const fileDescriptionClicked = (file: any) => {
    hideToolTip();
    props.navigation.navigate('fileDescription', {
      file: file,
      doNotReload: val => {
        setDoNotReload(val)
      },
      done: updateFileContent,
    });
  };

  const renderRow = (data: any, index: number) => {
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
        {/* {index == 0 && viewBeforList()} */}
        <View style={styles.rowConatiner}>
          <View style={styles.textContainer}>
            <Text style={styles.TextStyle}>
              By <Text style={{ fontWeight: '500' }}>{data.by}</Text> on{' '}
              <Text>{date}</Text>
            </Text>
            {(isCreatedByUser || data.by == 'You') && (
              <TouchableOpacity
                onPress={() => {
                  deleteFile(data.fid, data.isLocal);
                }}>
                <Image source={delete_icon}></Image>
              </TouchableOpacity>
            )}
          </View>
          <View>{fileHolderView(data)}</View>
          <View style={[styles.fullWidth, styles.fileContainerSTyle]}>
            <TouchableHighlight
              disabled={data.by != 'You'}
              underlayColor={'#cccccc11'}
              onPress={() => fileDescriptionClicked(data)}>
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

  const deleteFile = (fid: any, isTempFile: boolean) => {
    if (!isTempFile) {
      setFilesToUpdate([...filesToUpdate,{ fid: fid, action: 'delete' }]);
      // filesToUpdate.push({ fid: fid, action: 'delete' });
    }
    let tempFileArray = itemList;
    console.log("tempFileArray > ",JSON.stringify(isTempFile),fid)
    let index = tempFileArray.findIndex((element: any) => element.fid === fid);
    tempFileArray.splice(index, 1);
    props.saveFiles(tempFileArray);
    setTimeout(() => {
      setItemList(tempFileArray)
    }, 500);
  };

  const updateFileContent = (file: any, title: any, description: any) => {
    let updatelist: any = itemList;
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
      setFilesToUpdate([...filesToUpdate,{
        fid: file.fid,
        file_title: title,
        file_description: description,
      }]);

      // filesToUpdate.push({
      //   fid: file.fid,
      //   file_title: title,
      //   file_description: description,
      // });
    }
    setItemList(updatelist)
    props.saveFiles(updatelist);

  };

  const fileHolderView = (file: any) => {
    switch (file.type) {
      case 'images':
        return (
          <TouchableHighlight
            underlayColor={'#ffffff33'}
            onPress={() =>
              props.navigation.navigate('imageViewer', {
                files: [
                  {
                    url: file.thumbnail_large_url
                      ? file.thumbnail_large_url
                      : file.thumbnail_url
                        ? file.thumbnail_url
                        : file.thumb_uri,
                  },
                ],
                doNotReload: val => {
                  setDoNotReload(val)
                },
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
              props.navigation.navigate('pdfViewer', {
                file: file,
                doNotReload: val => {
                  setDoNotReload(val)
                },
              })
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
            onPress={() => audioAttachmentPress(file)}
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

  const hideToolTip = () => {
    if (toolTipVisibility) {
      setToolTilvisibility(false)
    }
  };

  const onActionItemClicked = (index: number): void => {
    saveIntitals();

    switch (index) {
      case 0:
        deleteDraft();
        break;
      case 1:
        //loaderHandler.showLoader('Saving...');
        props.showLoader(true);
        props.loaderText('Saving...');
        saveORPublish('save');
        // }, 2500);
        break;
      case 2:
        if (Platform.OS == 'ios') {
          _actionSheet &&
            _actionSheet &&
            _actionSheet.hideSheet();
        } else {
          setShowActionAndroid(false)
        }
        break;
      case 3:
        props.showLoader(true);
        props.loaderText('Publishing...');
        //loaderHandler.showLoader('Publishing...');
        // setTimeout(() => {
        saveORPublish(kPublish);
        // }, 2500);
        break;
    }
    // switch (index) {
    //   case 0:
    //     file = PickImage(fileCallback);
    //     break;
    //   case 1:
    //     file = PickAudio(fileCallback);
    //     break;
    //   case 2:
    //     file = PickPDF(fileCallback);
    //     break;
    //   case 4:
    //     if (validateDateAndLocation(false)) {
    //       saveORPublish('');
    //     }
    //     break;
    //   case 5:
    //     saveIntitals();
    //     if (validateDateAndLocation(true)) {
    //       props.navigation.navigate('publishMemoryDraft', {
    //         publishMemoryDraft: saveORPublish,
    //         preview: preview,
    //         delete: deleteDraft,
    //       });
    //     }
    //     break;
    // }
  };

  const fileCallback = (file: any) => {
    let tempfiles = itemList;
    file.forEach((element: any) => {
      tempfiles.push(element);
    });
    props.saveFiles(tempfiles);
    setItemList(tempfiles);
    optionsActionSheetRef?.current?.hide();
  };

  const validateDateField = (text) => {
    let limit = 31;
    if (text) {
      switch (parseInt(month.value)) {
        case 2:
          limit = 28;
          if (year.value != 'Year*') {
            if (parseInt(year.value) % 4 == 0) {
              limit = 29;
            }
          }
          break;
        case 4 || 6 || 9 || 11:
          limit = 30;
          break;
        default:
      }
    }
    console.error("valid >", text);
    if (parseInt(text) <= limit) {
      setDay({ ...day, value: text, error: false })
    }
    else {
      setDay({ ...day, value: text, error: true })
    }
  };

  const createLabelSelector = (
    selectedValue: any,
    marginEnd: any,
    flex: any,
    fieldName: string,
  ) => {
    return (
      <TouchableOpacity
        style={[
          styles.labelSelectorContainer,
          styles.commonFriendSerachStyleView,
          {
            flex: flex,
            marginEnd: marginEnd,
            borderColor: selectedValue.error
              ? Colors.ErrorColor
              : Colors.TextColor,
          },
        ]}
        onPress={() => onOptionSelection(fieldName, selectedValue.value)}>
        <Text style={styles.selectedValueTextStyle}>
          {fieldName == 'month'
            ? selectedValue.value.name
            : selectedValue.value}
        </Text>
        <View style={styles.emptyView}></View>
      </TouchableOpacity>
    );
  };

  const onOptionSelection = (fieldName: any, value: any) => {
    Keyboard.dismiss();
    let actions = createMemoryHelper.getDateOptions(
      fieldName,
      year.value,
    );
    setSelectionData({
      actions,
      selectionValue: value,
      fieldName: fieldName,
      title: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
    })
    // bottomPicker.current &&
    //   bottomPicker.current.showPicker &&
    //   bottomPicker.current.showPicker();

  };

  const dateSelected = (selectedItem: any) => {
    let currentDate = new Date();
    if (selectionData.fieldName == 'month') {
      selectedItem = { name: selectedItem.text, tid: selectedItem.key };
      MonthObj.month.forEach((element: any, index: any) => {
        if (element.name == selectedItem.name) {
          MonthObj.selectedIndex = index;
        }
      });
    }
    switch (selectionData.fieldName) {
      case 'year':
        if (
          month.value.tid > 0 &&
          selectedItem.text == currentDate.getFullYear()
        ) {
          let currentMonth = currentDate.getMonth();
          let selectedMonth =
            MonthObj.selectedIndex - MonthObj.serverMonthsCount;
          if (currentMonth < selectedMonth) {
            setMonth({ ...selectionData, value: MonthObj.month[0] })
            setDay({ ...selectionData, value: 'Day' })

          } else if (
            currentMonth == selectedMonth &&
            day.value != 'Day'
          ) {
            let currentDay = currentDate.getDate();
            let selectedDay = parseInt(day.value);
            if (currentDay < selectedDay) {
              setDay({ ...selectionData, value: 'Day' })
            }
          }
        }
        year.error = false;
        break;
      case 'month':
        if (
          MonthObj.selectedIndex > 0 &&
          MonthObj.selectedIndex < MonthObj.serverMonthsCount
        ) {
          setDay({ ...selectionData, value: 'Day' })
          setShowDay(false)

        } else if (day.value != 'Day') {
          setShowDay(true)
          let currentDay = parseInt(day.value);
          if (currentDay >= 28) {
            let maxDay = 28;
            switch (selectedItem.text) {
              case 'Feb':
                maxDay = 28;
                if (year.value != 'Year*') {
                  if (parseInt(year.value) % 4 == 0) {
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
              setDay({ ...selectionData, value: 'Day' })
              setShowDay(true)

            }
          }
        } else {
          setDay({ ...selectionData, value: 'Day' })
          setShowDay(true)
        }
        month.error = false;
        break;
      case 'day':
        break;
    }
    if (selectionData.fieldName == 'month') {
      // setState(prevState => ({
      //   ...prevState,
      //   [selectionData.fieldName]: {
      //     ...selectionData,
      //     value: selectedItem,
      //   },
      // }));

    } else {
      // setState(prevState => ({
      //   ...prevState,
      //   [selectionData.fieldName]: {
      //     ...selectionData,
      //     value: selectedItem.text,
      //   },
      // }));

    }
    if (!month.error && !year.error) {
      setDateError('')
    }
  };

  const _renderLocation = ({ item, index }: any) => {

    return (
      <TouchableOpacity
        style={styles.locationContainer}
        onPress={() => {
          setLocation(item)
          setLocationText(item.description)
          // setLocationList([])
          setLocationError('')
          props.userSelectedLocation(item)
          props.resetLocation();
        }}>
        <Text
          style={styles.locationDescTextStyle}
          ellipsizeMode="tail"
          numberOfLines={2}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  const viewBeforList = () => {
    return (
      // onStartShouldSetResponder={() => true}
      <View style={Styles.viewBeforListContainerStyle}>
        <View>
          {isCreatedByUser ? (
            <View style={styles.ViewBeforeStyle}>

              {
                <>
                  <TextInput
                    style={[
                      styles.memoryDescriptionInput,
                      {
                        borderBottomColor:
                          titleError.length > 0
                            ? Colors.ErrorColor
                            : Colors.white,
                        borderBottomWidth:
                          titleError.length > 0 ? 0.5 : 0,
                      },
                    ]}
                    // selection={{start:0}}//, end:0
                    value={title}
                    maxLength={250}
                    multiline={false}
                    onChangeText={(text: any) => {
                      setTitle(text)
                      setTitleError('')
                    }}
                    placeholder={placeholder}
                    placeholderTextColor={
                      Colors.memoryTitlePlaceholderColor
                    }></TextInput>

                  <Text style={Styles.errortextStyle}>
                    {titleError}
                  </Text>
                </>
              }
            </View>
          ) : (
            <View style={styles.ViewBeforeStyle}>
              <Text style={styles.memoryDescriptionInput}>
                {title}
              </Text>
            </View>
            // ownersViewForCollaborators()
          )}
          <View style={Styles.etherPadStyle}>

            {props.route.params.editMode || showEtherPad ? (
              <>
                <Text
                  style={styles.memoryDescriptionTextStyle}
                  numberOfLines={15}
                  ellipsizeMode={'tail'}>
                  {props.memoryDescription}
                </Text>

                {
                  padDetails?.padUrl &&
                  <TouchableOpacity
                    onPress={() => {
                      if (padDetails?.padUrl) {
                        props.navigation.navigate('etherPadEditing', {
                          title: title.trim(),
                          padDetails: padDetails,
                          doNotReload: val => {
                            setDoNotReload(val)
                          },
                          updateContent: setEtherPadContent,
                          inviteCollaboratorFlow: inviteCollaboratorFlow,
                        })
                      }
                    }}>
                    <Text
                      style={styles.editDescriptionTextStyle}>
                      Edit Description
                    </Text>
                  </TouchableOpacity>
                }

              </>

              // <EtherPadEditing
              //   editMode={props.route.params.editMode}
              //   title={title.trim()}
              //   padDetails={padDetails}
              //   inviteCollaboratorFlow={inviteCollaboratorFlow.bind(this)}
              // />
            ) : (
              <TouchableOpacity
                onPress={() => setShowEtherPad(true)}>
                <Text style={Styles.etherpadTextInputStyle}>
                  {'|Tap to start writing...'}
                </Text>
              </TouchableOpacity>
            )}
            {/* </View> */}
            {/* <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('etherPadEditing', {
                title: this.title.trim(),
                padDetails: this.padDetails,
                inviteCollaboratorFlow: this.inviteCollaboratorFlow.bind(this),
              })
            }>
            <Text
              style={styles.editDescriptionTextStyle}>
              Edit Description
            </Text>
          </TouchableOpacity> */}
          </View>

          {/* {Platform.OS === 'android' && showCalender && (
            <DateTimePicker
              isVisible={showCalender}
              onCancel={() => {
                setShowCalendar(false)
              }}
              onDateSelection={(date: any) => {
                setShowCalendar(false)
                setMemoryDate(moment(date).format('DD/MM/YYYY'))

              }}
            />
          )} */}
        </View>

        {/* {
          bottomToolbar ?
            null
            : */}
        <View style={Styles.buttonsContainerStyle}>
          {/* {props.memoryDescription &&
            props.memoryDescription != '' ? ( */}
          <>
            <TouchableOpacity
              style={Styles.buttonsStyle}
              onPress={() => {
                setOptionToShow('date')
                optionsActionSheetRef?.current?.show();
                // if (Platform.OS === 'android') {
                //   DateTimePickerAndroid.open(this.dateOptions);
                // } else {
                // this.setState({
                //   showCalender: true,
                // });
                // }
              }}>
              <Image style={styles.imageStyles} source={calendarWrite} />
              <Text style={styles.buttonsTextStyle}>Date</Text>
            </TouchableOpacity>
            <View style={{ width: 8 }} />
          </>
          {/* ) : null} */}

          <TouchableOpacity
            style={Styles.buttonsStyle}
            onPress={() => {
              optionsActionSheetRef?.current?.show();
              setOptionToShow('location')
            }}>
            <Image style={styles.imageStyles} source={map_pin} />
            <Text style={styles.buttonsTextStyle}>Location</Text>
          </TouchableOpacity>
          <View style={{ width: 8 }} />

          <TouchableOpacity
            style={Styles.buttonsStyle}
            onPress={() => {
              optionsActionSheetRef?.current?.show();
              setOptionToShow('upload')
            }}>
            <Image style={styles.imageStyles} source={upload} />
            <Text style={styles.buttonsTextStyle}>Upload</Text>
          </TouchableOpacity>

          <View style={{ width: 8 }} />
          <TouchableOpacity
            style={[
              Styles.buttonsStyle,
              { backgroundColor: Colors.bordercolor },
            ]}
            onPress={() => {
              if (
                memory_date == '' || year.value == '' || month.value == ''
              ) {
                setShowCustomValidationAlert(true)
              }
              else if (
                location.description == '' || location.description == null || location.description == undefined
              ) {
                setShowCustomValidationAlert(true)
              }
              else {
                // preview
                props.navigation.navigate('publishMemoryDraft', {
                  publishMemoryDraft: val => saveORPublish(val.key, true, val.data),
                  doNotReload: val => {
                    setDoNotReload(val)
                  },
                  preview: () => { },
                  delete: deleteDraft,
                });
              }

              // if (
              //   title != '' &&
              //   memory_date != '' &&
              //   description != '' &&
              //   location.description != ''
              // ) {
              //   Keyboard.dismiss();
              //   hideMenu();
              //   setState(prev => ({
              //     ...prev,
              //     actionSheet: {
              //       title: 'Memory Draft',
              //       type: kSaveAction,
              //       list: publishActions,
              //     },
              //   }));

              //   if (Platform.OS == 'ios') {
              //     _actionSheet &&
              //       _actionSheet &&
              //       _actionSheet.showSheet();
              //   } else {
              //     setState(prev => ({
              //       ...prev,
              //       showActionAndroid: true,
              //     }));
              //   }
              // }
            }}>
            <Image style={styles.imageStyles} source={arrowRight} />
            <Text
              style={[styles.buttonsTextStyle, { color: Colors.white }]}>
              Next
            </Text>
          </TouchableOpacity>
          {/* <View style={{ width: 8 }} /> */}
        </View>
        {/* } */}

        {/* {this.itemList.length > 0 && (
          <View style={{ marginTop: 15 }}>
            <Border />
            <Text
              style={[styles.memoryDescriptionTextStyle, styles.paddingVerticalStyle]}>
              {'Attachments ('}
              {this.itemList.length}
              {')'}
            </Text>
          </View>
        )} */}
      </View>
    );
  };

  const ownersViewForCollaborators = () => {
    return (
      <View style={styles.collabratorMainContainer}>
        <View style={styles.fullFexDirectionRowStyle}>
          <View style={styles.placeHolderContainerStyle}>
            <PlaceholderImageView
              uri={Utility.getFileURLFromPublicURL(ownerDetails.uri)}
              borderRadius={Platform.OS === 'android' ? 48 : 24}
              style={styles.placeHolderImageStyle}
              profilePic={true}
            />
          </View>
          <View style={styles.flexMarginLeftStyle}>
            <View style={styles.directionFlex}>
              <Text style={styles.ownerNameTextStyle}>
                {ownerDetails.field_first_name_value}{' '}
                {ownerDetails.field_last_name_value}
                <Text
                  style={[
                    styles.ownerNameTextStyle,
                    {
                      fontWeight: 'normal',
                    },
                  ]}>
                  {youWhereThere
                    ? taggedCount == 0
                      ? ' and You'
                      : ', You and '
                    : taggedCount == 0
                      ? ''
                      : ' and '}
                </Text>
              </Text>
              {/* {taggedCount > 0 && (
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('customListMemoryDetails', {
                      heading: 'Who else where there',
                      itemList: props.whoElseWhereThereList,
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
                    {taggedCount}
                    {taggedCount > 1 ? ' others' : ' other'}
                  </Text>
                </TouchableOpacity>
              )} */}
            </View>
            <Text style={[styles.ownerNameTextStyle, { paddingTop: 5 }]}>
              {month.value.name}{' '}
              {showDay && day.value},{' '}
              {year.value}{' '}
              <Text style={{ color: Colors.newDescTextColor }}>
                {' '}
                {locationText}{' '}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const validateDate = (yearNew, monthNew, dayNew) => {

    let yearactions = createMemoryHelper.getDateOptions(
      'year',
      yearNew.value,
    ), isValidYear = false;
    let monthactions = createMemoryHelper.getDateOptions(
      'month',
      yearNew.value,
    ), isValidMonth = false;
    let isValidDate = false;

    if (yearactions && yearactions.length && yearactions.filter(item => (item.text.toLowerCase() === yearNew.value) || (item.key.toString().toLowerCase() === yearNew.value)).length) {
      isValidYear = true;
    }

    let validNumberReg = /^[0-9]+$/;
    let validAlphabatesReg = /^[a-zA-Z]*$/;
    if (validNumberReg.test(monthNew?.value) || validAlphabatesReg.test(monthNew?.value)) {
      let val = monthNew?.value?.toLowerCase();
      let getMonthIsValid = monthactions.filter(item => (item.text.toLowerCase() === val) || (item.key && (item.key <= 9 ? ('0' + item.key.toString().toLowerCase() === val) : item.key.toString().toLowerCase() === val)));
      let monthData = monthactions.filter(item => (item.key <= 9 ? (('0' + item.key.toString().toLowerCase()) === monthNew.value.toString().toLowerCase()) : item.key.toString().toLowerCase() == monthNew.value.toString().toLowerCase()));
      if (monthNew?.value?.length > 2) {
        if (monthactions && monthactions.length && getMonthIsValid.length && getMonthIsValid[0]?.disabled != true) {
          if (parseInt(yearNew.value) == new Date().getFullYear()) {

            let seasonArray = MonthObj?.month?.filter(itm => itm.name == monthNew.value)
            // seasonArray = seasonArray.length ? seasonArray.sort(function (a, b) { return a - b }) :[]
            // && itm.months.filter(monthitm => monthitm.id == new Date().getMonth()+1).length
            let monthsInSeason = seasonArray.length ? seasonArray[0].months.map(ii => ii.id).sort(function (a, b) { return a - b }) : []
            if (parseInt(yearNew.value) <= new Date().getFullYear() && monthsInSeason.length && (monthsInSeason.indexOf(new Date().getUTCMonth() + 1) != -1)) {
              if (!isNaN(parseInt(monthNew.value)) && (parseInt(monthNew.value) <= (new Date().getMonth() + 1))) {

                isValidMonth = true;
                isValidDate = true;
                setDayNew({ ...dayNew, value: '' })
              }
              else if (validAlphabatesReg.test(monthNew?.value)) {
                setDayNew({ ...dayNew, value: '' })
                isValidMonth = true;
                isValidDate = true;
              }
            }
          }
          else {
            if (parseInt(yearNew.value) < new Date().getFullYear()) {
              if (!isNaN(parseInt(monthNew.value)) && (parseInt(monthNew.value) <= (new Date().getMonth() + 1))) {
                isValidMonth = true;
                isValidDate = true;
                setDayNew({ ...dayNew, value: '' })
              }
              else if (validAlphabatesReg.test(monthNew?.value)) {
                setDayNew({ ...dayNew, value: '' })
                isValidMonth = true;
                isValidDate = true;
              }
            }
          }
        }
      }
      else if ((monthNew?.value?.length == 2) && (parseInt(yearNew.value) <= new Date().getFullYear()) && monthactions && monthactions.length && monthData.length && monthData[0]?.disabled != true) {
        isValidMonth = true;
      }
    }

    if (dayNew.value != '') {
      let dayactions = createMemoryHelper.getDateOptions(
        'day',
        yearNew.value,
        monthNew.value,
      );
      let dayArray = dayactions.filter(item => item.text.toString() === dayNew.value.toString());
      // console.log("sssss >>",JSON.stringify(dayactions),JSON.stringify(dayArray))
      if (dayArray.length && (dayArray[0]?.disabled != true)) {
        isValidDate = true;
      }
      else if (validAlphabatesReg.test(monthNew?.value)) {
        isValidDate = true;
      }

    }

    setYearNew({ ...yearNew, error: !isValidYear })
    setMonthNew({ ...monthNew, error: !isValidMonth })
    setDayNew({ ...dayNew, error: !isValidDate })
    console.log(isValidMonth, isValidYear, isValidDate)

    if (isValidMonth && isValidYear && isValidDate) {
      optionsActionSheetRef?.current?.hide();
      setMemoryDate(`${yearNew.value}/${monthNew.value}/${yearNew.value}`)

      setYear({ ...yearNew, error: !isValidYear })
      setMonth({ ...monthNew, error: !isValidMonth })
      setDay({ ...dayNew, error: !isValidDate })
      saveIntitalsForDate(yearNew, monthNew, dayNew)
    };

  };

  // render() {
  return (
    <View style={styles.fullFlex}>
      {
        props.showLoaderValue ?
          <BusyIndicator startVisible={props.showLoaderValue} text={props.loaderTextValue != '' ? props.loaderTextValue : 'Loading...'} overlayColor={Colors.ThemeColor} />
          :
          null
      }
      <SafeAreaView style={styles.emptySafeAreaStyle} />
      {/* <SafeAreaView style={styles.SafeAreaViewContainerStyle}> */}
      {/* {Platform.OS === 'ios' && showCalender && (
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
            newMemoryYears={newMemoryYears}
            mode="datepicker"
            selected={memory_date}
            current={memory_date}
            selectorEndingYear={new Date().getUTCFullYear()}
            selectorStartingYear={1917}
            onSelectedChange={date => {
              setShowCalendar(false)
              setMemoryDate(date)

            }}
            style={styles.calendar}
          />
        </View>
      )} */}
      <CustomAlert
        modalVisible={showCustomAlert}
        title={'Save your memory'}
        message={
          'We always save your work, but you can choose to save writing this memory for later, or continue writing now.'
        }
        buttons={[
          {
            text: 'Close and save as draft',
            func: () => {
              setShowCustomAlert(false)
              saveORPublish('save');

              // ReactNativeHapticFeedback.trigger('impactMedium', options);
            },
          },
          {
            text: 'Continue editing',
            func: () => {
              setShowCustomAlert(false)
              // ReactNativeHapticFeedback.trigger('impactMedium', options);
            },
            styles: { fontWeight: '400' },
          },
          {
            text: 'Cancel',
            func: () => {
              setShowCustomAlert(false)
              props.fetchMemoryList({
                type: ListType.Recent,
                isLoading: true,
              });
              props.fetchMemoryList({
                type: ListType.Timeline,
                isLoading: true,
              });
              //loaderHandler.showLoader();
              props.showLoader(true);
              props.loaderText('Loading...');
              props.navigation.goBack();
              // ReactNativeHapticFeedback.trigger('impactMedium', options);
            },
            styles: { fontWeight: '400' },
          },
        ]}
      />

      <CustomAlert
        modalVisible={showCustomValidationAlert}
        // setModalVisible={setModalVisible}
        title={`${memory_date == '' ? 'Date' : 'Location'} needed`}
        message={
          `To prepare to publish, please input the ${memory_date == '' ? 'date' : 'location'} of this memory.`
        }
        buttons={[
          {
            text: 'Ok',
            func: () => {
              setShowCustomValidationAlert(false)
            },
          }
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
          cancelAction={() => saveDraft()} //this.setState({ showCustomAlert: true }) //this.cancelAction}
          showRightText={true}
          createMemoryPage={true}
          rightText={
            props.route.params.editPublsihedMemory
              ? 'Save'
              : // : isCreatedByUser
              //   ? 'Done'
              'Save'
          }
          backIcon={action_close}
          saveValues={() => {
            setShowCustomAlert(true)
          }} //saveDraft
        // rightIcon={isCreatedByUser}
        // showHideMenu={() => showMenu(!menuVisibility)}
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
          modalVisible={showActionAndroid}
          setModalVisible={
            actionSheet?.list?.actions &&
              actionSheet?.list?.actions.length &&
              actionSheet?.list?.actions[0] &&
              actionSheet?.list?.actions[0]?.text?.includes('Yes,')
              ? `Are you done writing this memory?`
              : `Save for later?`
          }
          title={actionSheet.title}
          message={
            actionSheet?.list?.actions &&
              actionSheet?.list?.actions.length &&
              actionSheet?.list?.actions[0] &&
              actionSheet?.list?.actions[0]?.text?.includes('Yes,')
              ? ``
              : 'Choose to completely discard your work, or save writing this memory for later.'
          }
          buttons={
            (actionSheet.list = actionSheet.list.map(
              (item: any) => {
                return {
                  text: item.text,
                  index: item.index,
                  func: () => {
                    setShowActionAndroid(false)
                    onActionItemClicked(item.index);
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
          // this.itemList.length ?

          <ScrollView
            contentContainerStyle={
              Styles.viewBeforListContentContainerStyle
            }
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            overScrollMode='always'
            style={[styles.fullWidth, { flex: 1 }]}
            scrollEnabled={itemList.length ? true : false}>
            {/* {itemList.length == 0 ? ( */}
            {viewBeforList()}
            {/* ) : ( */}

            {
              // bottomToolbar ?
              //   null
              //   :
              // <FlatList
              //   ref={ref => (_mainItemList = ref)}
              //   extraData={state}
              //   nestedScrollEnabled={true}
              //   keyExtractor={(_, index: number) => `${index}`}
              //   style={[styles.fullWidth, { marginBottom: 100 }]}
              //   onScroll={() => Keyboard.dismiss()}
              //   // keyboardShouldPersistTaps={'handled'}
              //   showsHorizontalScrollIndicator={false}
              //   // showsVerticalScrollIndicator={false}
              //   data={itemList}
              //   renderItem={(item: any) => renderRow(item)}
              // />
              props.files?.length
                ? props.files.map((item, index) =>
                  renderRow(item, index)
                )
                : null
            }
            {/* )} */}
          </ScrollView>
          // :
          // <View style={styles.fullWidth} >
          //   {viewBeforList()}
          // </View>
        }
        {/* {menuVisibility && (
              <View
                style={styles.menuVisibleContainer}
                onStartShouldSetResponder={() => true}
                onResponderStart={hideMenu}>
                <View style={styles.sideMenu}>
                  {menuOptions.map((data: any) => {
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

        {/* {toolbar()} */}
        {
          Platform.OS === 'ios' &&
          <CustomActionSheet
            ref={ref => _actionSheet = ref}
            width={DeviceInfo.isTablet() ? '65%' : '100%'}
            title={actionSheet.title}
            actions={actionSheet.list}
            onActionClick={onActionItemClicked}
          />
        }

        <ActionSheet
          closeOnTouchBackdrop={false}
          closeOnPressBack={false}
          ref={optionsActionSheetRef}>
          <>
            <View style={Styles.actionSheetContainer}>
              <View style={Styles.actionSheetHeaderContainer}>
                <TouchableHighlight
                  underlayColor={Colors.transparent}
                  style={Styles.jumptoCancelSubContainerStyle}
                  onPress={() => {
                    if (optionToShow == 'date') {
                      setYearNew({ ...year })
                      setMonthNew({ ...month })
                      setDayNew({ ...day })
                      if (month.value.length < 3) {
                        setShowDay(true)
                      }
                    }
                    optionsActionSheetRef?.current?.hide()
                  }}>
                  <>
                    <Image style={Styles.cancelImageStyle} source={x} />
                    <Text style={Styles.cancelTextStyle}>Close</Text>
                  </>
                </TouchableHighlight>
              </View>

              {
                optionToShow == 'date' ?
                  <View >
                    <Text
                      style={styles.colabratiesTextStyle}>
                      {'When did this memory happen?'}
                    </Text>
                    <View style={styles.textInputContainer}>
                      <Text
                        style={styles.labelStyle}>
                        {'YEAR'}
                        <Text
                          style={{ color: Colors.newErrorColor }}>
                          {'*'}
                        </Text>
                      </Text>
                      <TextInput
                        style={styles.textInputBoxStyle}
                        onChangeText={(text: any) => {
                          setYearNew({ ...yearNew, value: text, error: false })
                        }}
                        placeholderTextColor={Colors.newTextColor}
                        value={yearNew.value}
                        maxLength={4}
                        placeholder="YYYY"
                        returnKeyType="next"
                        keyboardType="number-pad"
                      />

                      {
                        yearNew.error &&
                        <Text style={styles.errorMessageStyle}>
                          {`Please enter valid year`}
                        </Text>
                      }
                    </View>

                    <View style={styles.textInputContainer}>
                      <Text
                        style={styles.labelStyle}>
                        {'MONTH'}
                        <Text
                          style={{ color: Colors.newErrorColor }}>
                          {'*'}
                        </Text>
                      </Text>
                      <TextInput
                        style={styles.textInputBoxStyle}
                        onChangeText={(text: any) => {
                          let validAlphabatesReg = /^[a-zA-Z]{0,6}$/;
                          let validNumberReg = /^[0-9]{1,2}$/;

                          if (validAlphabatesReg.test(text)) {
                            setDayNew({ value: '', error: false })
                            setShowDay(false)
                            setMonthNew({ ...monthNew, value: text, error: false })
                          }
                          else if (validNumberReg.test(text)) {
                            setShowDay(true)
                            if (parseInt(text) <= 12) {
                              setMonthNew({ ...monthNew, value: text, error: false })
                            }
                          }
                          else {
                            // setShowDay(true)
                          }
                        }}
                        value={monthNew.value}
                        placeholderTextColor={Colors.newTextColor}
                        // maxLength={12}
                        placeholder="Month(MM) or Season"
                        returnKeyType="done"
                      // keyboardType="number-pad"
                      />
                      {
                        monthNew.error &&
                        <Text style={styles.errorMessageStyle}>
                          {`Please enter valid month or season`}
                        </Text>
                      }

                    </View>

                    {
                      showDay &&
                      <View style={styles.textInputContainer}>
                        <Text
                          style={styles.labelStyle}>
                          {'DAY'}
                          <Text
                            style={{ color: Colors.newErrorColor }}>
                            {'*'}
                          </Text>
                        </Text>
                        <TextInput
                          style={styles.textInputBoxStyle}
                          onChangeText={(text: any) => {
                            setDayNew({ ...dayNew, value: text, error: false })
                          }}
                          value={dayNew.value}
                          maxLength={2}
                          placeholder="DD"
                          placeholderTextColor={Colors.newTextColor}
                          returnKeyType="done"
                          keyboardType="number-pad"
                        />
                        {
                          dayNew.error &&
                          <Text style={styles.errorMessageStyle}>
                            {`Please enter valid date`}
                          </Text>
                        }

                      </View>
                    }


                    <TouchableWithoutFeedback
                      // disabled={(this.username != '' && this.password != '') ? false : true}
                      onPress={() => {
                        validateDate(yearNew, monthNew, dayNew);
                      }}>
                      <View
                        style={Styles.loginSSOButtonStyle}>
                        <Text
                          style={[
                            CommonTextStyles.fontWeight500Size17Inter,
                            Styles.loginTextStyle,
                          ]}>
                          Done
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  :
                  optionToShow == 'location' ?
                    <View >
                      <Text
                        style={styles.colabratiesTextStyle}>
                        {'Where did this memory happen?'}
                      </Text>
                      <Text
                        style={[styles.labelStyle, { marginLeft: 24, }]}>
                        {'LOCATION'}
                        <Text
                          style={{ color: Colors.newErrorColor }}>
                          {'*'}
                        </Text>
                      </Text>
                      <SearchBar
                        style={[styles.searchBarStyle, {
                          borderBottomColor: locationError.length > 0 ? Colors.ErrorColor : Colors.TextColor,
                        }]}
                        placeholder="Add location..."
                        onBlur={() => {
                          // setState(prev => ({
                          //   ...prev,
                          //   locationList: []
                          // }));
                        }}
                        onSearchButtonPress={(keyword: string) => {
                          // setState(prev => ({
                          //   ...prev,
                          //   showLocationLoader: true
                          // }));
                          props.onLocationUpdate(keyword);
                        }}
                        onClearField={() => {
                          props.resetLocation();
                          // setState(prev => ({
                          //   ...prev,
                          //   locationList: []
                          // }));
                        }}
                        onChangeText={(text: any) => {
                          props.onLocationUpdate(text);
                          // setState(prev => ({
                          //   ...prev,
                          //   locationError: '',
                          //   locationText: text
                          // }));
                        }}
                        // onFocus={()=> this._mainItemList.scrollToOffset({ animated: true, offset: 100})}
                        showCancelClearButton={false}
                        value={locationText}
                      />
                      {props.locationList.length > 0 && (
                        <FlatList
                          keyExtractor={(_, index: number) => `${index}`}
                          keyboardShouldPersistTaps={'never'}
                          // onScroll={() => {
                          //   Keyboard.dismiss();
                          // }}
                          nestedScrollEnabled={true}
                          showsHorizontalScrollIndicator={false}
                          showsVerticalScrollIndicator={false}
                          style={styles.locationFlatListStyle}
                          data={props.locationList}
                          renderItem={_renderLocation}
                          ItemSeparatorComponent={() => (
                            <View
                              style={styles.locationListSeparator}></View>
                          )}
                        />
                      )}

                      <Text style={styles.locationErrorTextStyle}>
                        {locationError}
                      </Text>

                      <TouchableWithoutFeedback
                        // disabled={(this.username != '' && this.password != '') ? false : true}
                        onPress={() => {
                          if (location.description != '') {
                            optionsActionSheetRef?.current?.hide();
                            setTimeout(() => {
                              saveIntitals();
                            }, 1000);
                          }
                          else {
                            setLocationError('* Please enter a location to publish your memory')
                          }
                        }}>
                        <View
                          style={Styles.loginSSOButtonStyle}>
                          <Text
                            style={[
                              CommonTextStyles.fontWeight500Size17Inter,
                              Styles.loginTextStyle,
                            ]}>
                            Done
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                    :
                    <View >
                      <Text
                        style={styles.colabratiesTextStyle}>
                        {'What would you like to upload?'}
                      </Text>

                      <View style={{ flexDirection: 'row' }}>
                        <TouchableWithoutFeedback
                          // disabled={(this.username != '' && this.password != '') ? false : true}
                          onPress={() => {
                            PickImage(fileCallback);
                          }}>
                          <View style={styles.newFilterItem}>
                            <View style={styles.iconContainer}>
                              <Image source={images} />
                            </View>

                            <View style={styles.iconSeparator}></View>

                            <View style={styles.jumptoYearContainer}>
                              <Text style={[styles.filterTextJumpto]}>
                                {'Photo'}
                              </Text>
                            </View>
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          // disabled={(this.username != '' && this.password != '') ? false : true}
                          onPress={() => {
                            PickPDF(fileCallback);
                          }}>
                          <View style={styles.newFilterItem}>
                            <View style={styles.iconContainer}>
                              <Image source={pdf} />
                            </View>

                            <View style={styles.iconSeparator}></View>

                            <View style={styles.jumptoYearContainer}>
                              <Text style={[styles.filterTextJumpto]}>
                                {'PDF'}
                              </Text>
                            </View>
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          // disabled={(this.username != '' && this.password != '') ? false : true}
                          onPress={() => {
                            PickAudio(fileCallback)
                          }}>
                          <View style={styles.newFilterItem}>
                            <View style={styles.iconContainer}>
                              <Image source={audio} />
                            </View>

                            <View style={styles.iconSeparator}></View>

                            <View style={styles.jumptoYearContainer}>
                              <Text style={[styles.filterTextJumpto]}>
                                {'Audio'}
                              </Text>
                            </View>
                          </View>
                        </TouchableWithoutFeedback>

                      </View>
                    </View>
              }

            </View>
            {Platform.OS == 'android' &&
              <View style={{ height: bottomToolbar }}></View>
            }
          </>
        </ActionSheet>


        {/* {toolTipVisibility && (
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
              ref={bottomPicker}
              onItemSelect={(selectedItem: any) => {
                dateSelected(selectedItem);
              }}
              title={selectionData.title}
              actions={selectionData.actions}
              value={selectionData.selectionValue}
              selectedValues={[selectionData.selectionValue]}
            /> */}
      </View>
      {/* {memoryDraftVisibility && (
            <MemoryDraftIntro
              cancelMemoryDraftTour={() => {
                setState({ memoryDraftVisibility: false });
                DefaultPreference.set('hide_memory_draft', 'true').then(
                  function () { },
                );
              }}></MemoryDraftIntro>
          )} */}
      {/* </SafeAreaView> */}
    </View>
  );
  // }
}

const mapState = (state: { [x: string]: any }) => {
  return {
    locationList: state.MemoryInitials.locationList,
    files: state.MemoryInitials.files,
    tagsList: state.MemoryInitials.tags,
    whoElseWhereThereList: state.MemoryInitials.whoElseWhereThere,
    // collection: state.MemoryInitials.collection,
    collection: state.MemoryInitials.collections,
    nid: state.MemoryInitials.nid,
    shareOption: state.MemoryInitials.shareOption,
    whoCanSeeMemoryUids: state.MemoryInitials.whoCanSeeMemoryUids,
    whoCanSeeMemoryGroupIds: state.MemoryInitials.whoCanSeeMemoryGroupIds,
    memoryDescription: state.MemoryInitials.description,
    memoryObject: state.MemoryInitials,
    goToDashboard: state.MemoryInitials.goToDashboard,
    showLoaderValue: state.dashboardReducer.showLoader,
    loaderTextValue: state.dashboardReducer.loaderText
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
    userSelectedLocation: (payload: any) =>
      dispatch({ type: SelectedLocation, payload: payload }),
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
    showLoader: (payload: any) =>
      dispatch({ type: SHOW_LOADER_READ, payload: payload }),
    loaderText: (payload: any) =>
      dispatch({ type: SHOW_LOADER_TEXT, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(CreateMemory);
