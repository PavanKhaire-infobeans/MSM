import React from 'react';
import {
  Alert,
  DeviceEventEmitter,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  SafeAreaView,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableOpacityProperties,
  FlatList,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import ImageCropPicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';
import ActionSheet, {
  ActionSheetItem,
} from '../../../common/component/actionSheet';
import analytics from '@react-native-firebase/analytics';
//@ts-ignore
import { EditHeader } from '..';
import {
  CaptureImage,
  PickAudio,
  PickImage,
  PickPDF,
} from '../../../common/component/filePicker/filePicker';
// import { KeyboardAwareFlatList as FlatList } from '../../../common/component/keyboardaware-scrollview';
import Text from '../../../common/component/Text';
import { ToastMessage } from '../../../common/component/Toast';
import {
  Colors,
  ConsoleType,
  decode_utf8,
  encode_utf8,
  ERROR_MESSAGE,
  fontFamily,
  fontSize,
  GenerateRandomID,
  GetFileType,
  getValue,
  NO_INTERNET,
  showConsoleLog,
  TimeStampMilliSeconds,
} from '../../../common/constants';
import MindPopStore, {
  MindPopAttachment,
} from '../../../common/database/mindPopStore/mindPopStore';
import EventManager from '../../../common/eventManager';
import Utility from '../../../common/utility';
import {
  action_audio,
  action_camera,
  action_close,
  action_pdf,
  audio_play,
  camera,
  icon_upload_file,
  keyboard_hide,
  pdf_icon,
  record,
  rubbish,
  sound_wave,
} from '../../../images';
import { CreateUpdateMemory } from '../../createMemory/createMemoryWebService';
import { DefaultDetailsMemory } from '../../createMemory/dataHelper';
import { DeleteMindPopOperation } from '../list/deleteMindPopReducer';
import { GetMindPopStatus } from '../list/reducer';
import { addEditMindPop, kAddEditIdentifier } from './addMindPopflow';
import { AddMindPopStatus, EditMode } from './reducer';
//@ts-ignore
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import Styles from './styles';
import MessageDialogue from '../../../common/component/messageDialogue';
import { SHOW_LOADER_READ, SHOW_LOADER_TEXT } from '../../dashboard/dashboardReducer';
import BusyIndicator from '../../../common/component/busyindicator';
const ScreenWidth = Dimensions.get('window').width;

type MainItem = { [y: string]: string | Array<{ [x: string]: any }> };

enum TempFileStatus {
  needsToUpload = 'needsToUpload',
  deleted = 'deleted',
  uploaded = 'uploaded',
}

export type TempFile = {
  fid: string;
  filePath: string;
  thumb_uri?: string;
  isLocal?: boolean;
  type?: string;
  status?: TempFileStatus;
  filename?: string;
  time?: number;
  uri?: string;
  file_title?: string;
  file_description?: string;
  userId?: any;
  userName?: any;
  date?: any;
  title?: any;
};

type State = {
  deletedAttachments: Array<any>;
  listItems: Array<MainItem>;
  selectedItem: any;
  content: string;
  oldcontent: string;
  actionSheet: {
    type: 'none' | 'image' | 'audio';
    list: Array<ActionSheetItem>;
  };
  id: string;
  bottomToolbar: number;
};

const ImageActions: Array<ActionSheetItem> = [
  { index: 0, text: 'Image', image: action_camera },
  { index: 1, text: 'Audio', image: action_audio },
  { index: 2, text: 'PDF', image: action_pdf },
  { index: 3, text: 'Cancel', image: action_close },
];

/**
 * Edit MindPop component
 */
class MindPopEdit extends React.Component<{ [x: string]: any }, State> {
  //Action sheet reference
  _actionSheet: any | ActionSheet = null;
  fileMain: string;
  moment: string;
  //InputRef reference
  _inputRef: TextInput | any;
  messageRef: any;
  //Camera Btn Ref
  _cameraBtnRef: TouchableOpacity | any;
  //Audio Btn Ref
  _audioBtnRef: TouchableOpacity | any;

  //Files array list
  files: Array<MindPopAttachment & { type: string; uri: string }>;

  //Component default state
  state: State = {
    deletedAttachments: [],
    selectedItem: null,
    listItems: [],
    content: '',
    oldcontent: '',
    actionSheet: {
      type: 'none',
      list: [],
    },
    id: '',
    bottomToolbar: 0,
  };

  isEdit: boolean = false;
  // filePathsToUpload: string[];

  filesToUpload: Array<TempFile> = [];
  listener: EventManager;
  backListner: any;
  callAction: boolean = true;
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;
  draftDetails: any = {};
  createMemoryListener: EventManager;
  isDeleteForMemory: boolean = false;

  constructor(props: { [x: string]: any }) {
    super(props);

    this.files = [];
    // this.filePathsToUpload = [];
    if (getValue(props, ['listItem', 'id']) && props.listItem.id !== '') {
      let decodedMsg = decode_utf8(props.listItem.message || '');
      this.state = {
        ...this.state,
        id: props.listItem.id,
        content: decodedMsg,
        oldcontent: decodedMsg,
      };
    }
    this.moment = '0';
    if (typeof this.props.isEdit != 'undefined') {
      this.isEdit = this.props?.isEdit;
    }

    this.listener = EventManager.addListener(
      kAddEditIdentifier,
      this.reloadData,
    );
    if (this.props?.route?.name == 'mindPopEdit') {
      this.backListner = EventManager.addListener(
        'hardwareBackPress',
        this._onBackIfEdit,
      );
    }
    // this.fileMain = `https://${Account.selectedData().instanceURL}/sites/${Account.selectedData().instanceURL}/default/files/`;
    this.fileMain = Utility.publicURL;
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
  }

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

  UNSAFE_componentWillMount() {
    if (getValue(this.props, ['listItem'])) {
      this.setupFiles(this.props.listItem);
    }
    this.updateFiles();
    if (
      (this.props.actionWrite ||
        this.props.actionRecord ||
        this.props.actionImageUpload) &&
      this.callAction
    ) {
      this.props.actionRecord && this.audioAttachmentPress();
      this.props.actionImageUpload && this.cameraAttachmentPress();
      this.callAction = false;
      setTimeout(() => {
        this.callAction = true;
      }, 500);
    }
  }

  _onBackIfEdit = () => {
    if (!this.isEdit) {
      if (this.state.id && !DeviceInfo.isTablet()) {
        this._cancel();
      } else {
        this._prevUpdate();
      }
      return;
    }
    Keyboard.dismiss();
    this.props.navigation.goBack();
  };

  _prevUpdate = () => {
    //Check if user has some unsaved changes
    const { filesToDelete, filesToUpload } = this._getUpdatedFiles();

    if (
      this.state.content != this.state.oldcontent ||
      filesToDelete.length != 0 ||
      filesToUpload.length != 0
    ) {
      Alert.alert('Save changes?', `Do you want to save your changes?`, [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => {
            let content = this.state.oldcontent;
            this.setState({ content }, () => {
              //Go Back
              Keyboard.dismiss();
              this.props.navigation.goBack();
              this.props?.route?.params?.updateList && this.props?.route?.params?.updateList();
            });
          },
        },
        {
          text: 'Yes',
          style: 'default',
          onPress: () => {
            this._save();
          },
        },
      ]);
    } else {
      //Go Back
      {
        this._actionSheet;
      }
      Keyboard.dismiss();
      this.props.navigation.goBack();
      this.props?.route?.params?.updateList && this.props?.route?.params?.updateList();
    }
  };

  _cancel = () => {
    //Check if user has some unsaved changes
    const { filesToDelete, filesToUpload } = this._getUpdatedFiles();

    if (
      this.state.content != this.state.oldcontent ||
      filesToDelete.length != 0 ||
      filesToUpload.length != 0
    ) {
      Alert.alert('Save changes?', `Do you want to save your changes?`, [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => {
            let content = this.state.oldcontent;
            this.setState({ content }, () => {
              this.removeTempFiles();
              this.updateFiles();
              //finish editing
              this.props.setValue(true);
            });
          },
        },
        {
          text: 'Yes',
          style: 'default',
          onPress: () => {
            this._save();
          },
        },
      ]);
    } else {
      //finish editing
      this.removeTempFiles();
      this.updateFiles();
      this.props.setValue(true);
    }
  };

  _saveCall = (filesToDelete: any[], filesToUpload: TempFile[]) => {
    let moment = TimeStampMilliSeconds();

    var req: {
      requestDetails: { mindPopContentArray: Array<any>; mindPopID?: string };
      configurationTimestamp: string;
    } = {
      requestDetails: {
        mindPopContentArray: [
          {
            contentType: 1,
            contentValue: encode_utf8(this.state.content),
          },
        ],
      },
      configurationTimestamp: moment,
    };

    var message = 'Saving...';
    if (this.state.id) {
      req = {
        ...req,
        requestDetails: { ...req.requestDetails, mindPopID: this.state.id },
      };

      if (filesToDelete.length > 0) {
        var mindPopContentArray = [...req.requestDetails.mindPopContentArray];
        for (let item of filesToDelete) {
          //already uploaded items only should be deleted
          if (item.fid) {
            mindPopContentArray.push({
              contentID: item.fid,
              contentType: GetFileType.getStatus(item.type),
              contentStatus: 2,
            });
          }
        }
        req = {
          ...req,
          requestDetails: { ...req.requestDetails, mindPopContentArray },
        };
      }
      message = 'Updating...';
    }
    this.moment = moment;
    //loaderHandler.showLoader(message);
    this.props.showLoader(true);
    this.props.loaderText(message);
    this.props.setValue(true);
    addEditMindPop(req, filesToUpload);
  };

  _getUpdatedFiles = (): { filesToDelete: any[]; filesToUpload: TempFile[] } => {
    let filesToDelete: any[] = [];
    let fids: string[] = this.filesToUpload.map((it: TempFile) => it.fid);
    let filesToUpload: TempFile[] = [...this.filesToUpload];
    for (let obj of this.state.deletedAttachments) {
      let isLocal = getValue(obj, ['isLocal']);
      let id = getValue(obj, ['fid']);
      if (isLocal) {
        let idx = fids.indexOf(id);
        if (idx != -1) {
          filesToUpload.splice(idx, 1);
        }
      } else {
        filesToDelete.push(obj);
      }
    }

    return { filesToDelete, filesToUpload };
  };

  _save = () => {
    Keyboard.dismiss();
    const { filesToDelete, filesToUpload: uploads } = this._getUpdatedFiles();

    // if (this.state.content.trim().length > 0 || uploads.length > 0 || filesToDelete.length > 0) {
    if (
      this.state.content == this.state.oldcontent &&
      filesToDelete.length == 0 &&
      uploads.length == 0
    ) {
      // ToastMessage('No changes were made', 'black');
      this.messageRef._show({ message: 'No changes were made', color: Colors.black });
    } else {
      // if (this.state.content.trim().length > 0 || uploads.length > 0 || filesToDelete.length > 0) {

      // } else {
      // 	ToastMessage("Please enter some text");
      // }

      if (this.state.content.trim().length == 0) {
        this.messageRef._show({ message: 'Please add a description', color: Colors.ErrorColor });
        // ToastMessage('Please add a description', Colors.ErrorColor);
      } else {
        if (filesToDelete.length > 0) {
          Alert.alert(
            'Delete',
            `Are you sure you want to delete ${filesToDelete.length
            } attachement${filesToDelete.length > 1 ? 's' : ''}`,
            [
              {
                text: 'No',
                style: 'cancel',
                onPress: () => {
                  this.setState({ deletedAttachments: [] });
                },
              },
              {
                text: 'Yes',
                style: 'default',
                onPress: () => {
                  this._saveCall(filesToDelete, uploads);
                  this.setState({ deletedAttachments: filesToDelete });
                },
              },
            ],
          );
        } else {
          this._saveCall([], uploads);
        }
      }
    }
  };

  private updateFiles = () => {
    var listItems: Array<MainItem> = [{ itemType: 'editor' }];
    // let itemCount = (item.data as Array<any>).length
    let paddingSpace = 30; // horizontal padding of container view (15*2)
    var editScreenWidth = ScreenWidth - paddingSpace;
    if (DeviceInfo.isTablet() && this.props.route.name === 'mindPopList') {
      editScreenWidth = editScreenWidth - 320;
    }
    var data: Array<{
      [x: string]: any;
    }> = [];

    let itemCount: number = parseInt(`${editScreenWidth / 140}`);
    if (this.files.length > 0) {
      var i = 0;

      for (let file of this.files) {
        i++;
        let uri = (file.uri as string).replace('public://', this.fileMain);
        let fItem: {
          [x: string]: any;
        } = { ...file, uri };
        if (fItem.type == 'images' && fItem.thumb_uri) {
          let thumb_uri = (fItem.thumb_uri as string).replace(
            'public://',
            this.fileMain,
          );
          fItem = { ...fItem, thumb_uri };
        }
        data.push(fItem);

        // if (i == (DeviceInfo.isTablet() ? 4 : 2) || this.files.indexOf(file) == this.files.length - 1) {
        // 	listItems.push({ itemType: "list", data: [...data] });
        // 	data = [];
        // 	i = 0;
        // }

        // if (i == (editScreenWidth) || this.files.indexOf(file) == this.files.length - 1) {
        // 	listItems.push({ itemType: "list", data: [...data] });
        // 	data = [];
        // 	i = 0;
        // }
      }
    }
    if (this.filesToUpload.length > 0) {
      var lData: any[] = [];
      var i = 0;
      if (
        listItems.length > 1 &&
        i == 0 &&
        listItems[listItems.length - 1].data.length <
        (DeviceInfo.isTablet() ? 4 : 2)
      ) {
        lData = [...listItems[listItems.length - 1].data];
        listItems.pop();
        i = lData.length;
      }
      for (let file of this.filesToUpload) {
        lData.push(file);
        i++;
        // if (i == (editScreenWidth) || this.filesToUpload.indexOf(file) == this.filesToUpload.length - 1) {
        // 	listItems.push({ itemType: "list", data: [...lData] });
        // 	lData = [];
        // 	i = 0;
        // }
      }
      let arr = [...data, ...lData];
      data = [...arr];
    }

    if (data.length > 0) {
      listItems.push({ itemType: 'list', data: [...data] });
    }
    this.props.actionRecord && this.audioAttachmentPress();
    this.props.actionImageUpload && this.cameraAttachmentPress();
    if (this.props.actionRecord || this.props.actionImageUpload) {
      //Do nothing
    } else {
      this.setState({ listItems }, () => {
        this.state.id &&
          this.state.id.length == 0 &&
          this.filesToUpload.length == 0 &&
          this._inputRef &&
          this._inputRef.focus &&
          this._inputRef.focus();
      });
    }
  };

  componentWillUnmount = () => {
    this.listener.removeListener();
    this.backListner.removeListener();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  };

  saveTempFiles = (filesObjArray: Array<TempFile>) => {
    //Add to fileToUpload Array.. to upload when save button is pressed
    this.filesToUpload = [...this.filesToUpload, ...filesObjArray];
    this.updateFiles();
  };

  removeTempFiles = (filePath: string = null) => {
    if (filePath == null) {
      for (let obj of this.filesToUpload) {
        //remove temp folder
        let tempFilePath = obj.filePath;
        let absoultePath = tempFilePath.replace('file:///', '/');
        ImageCropPicker.cleanSingle(absoultePath);
      }

      // clear filePathsToUpload
      // this.filePathsToUpload = [];
      this.filesToUpload = [];
      let localFIDs = this.files
        .filter((obj: any) => getValue(obj, ['isLocal']) != null)
        .map(obj => getValue(obj, ['fid']));
      let allFiles = [...this.files];
      for (let obj of this.files) {
        let id = getValue(obj, ['fid']);
        let idx = localFIDs.indexOf(id);
        if (idx != -1) {
          allFiles.splice(idx, 1);
        }
      }
      this.files = [...allFiles];
    }
  };

  render() {
    return (
      <View style={Styles.mainContainer}>
        {
          this.props.showLoaderValue ?
            <BusyIndicator startVisible={this.props.showLoaderValue} text={this.props.loaderTextValue != '' ? this.props.loaderTextValue : 'Loading...'} overlayColor={Colors.ThemeColor} />
            :
            null
        }
        <SafeAreaView style={Styles.invisibleView} />
        <SafeAreaView style={Styles.containerStyle}>
          <View style={Styles.mainContainer}>
            <EditHeader
              save={this._save}
              updatePrev={this._prevUpdate}
              cancel={this._cancel}
            />
            <MessageDialogue ref={(ref: any) => (this.messageRef = ref)} />
            <View
              style={{
                width:
                  DeviceInfo.isTablet() &&
                    this.props?.route?.name !== 'mindPopList'
                    ? '80%'
                    : '100%',
                ...(DeviceInfo.isTablet() &&
                  this.props?.route?.name === 'mindPopList'
                  ? {}
                  : { maxWidth: 786 }),
                flex: 1,
              }}>
              {this.renderHeader()}
              {this.state.listItems.length > 1 ? (
                this.renderItem(this.state.listItems[1])
              ) : Platform.OS == 'ios' ? (
                <View
                  style={{
                    width: '100%',
                    height: this.state.bottomToolbar,
                  }}></View>
              ) : null}
              {/* <FlatList
						style={{ backgroundColor: "white", width: "100%", marginBottom: 60 }}
						keyExtractor={(_: any, index: number) => `${index}`}
						data={this.state.listItems}
						extraData={this.state}
						renderItem={this._renderitem}
					/> */}
            </View>
            {/* {this.state.files.length > 0 ? <View></View>
                : <View style={{width : "100%", height: this.state.bottomBar.bottom}}></View>}  */}
            {this.toolbar()}
            <ActionSheet
              ref={ref => (this._actionSheet = ref)}
              width={DeviceInfo.isTablet() ? '65%' : '100%'}
              actions={this.state.actionSheet.list}
              onActionClick={this.onActionItemClicked.bind(this)}
              popToAddContent={this.props.actionImageUpload ? true : false}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  cameraAttachmentPress = () => {
    CaptureImage(this.fileCallbackHandler);
  };

  fileCallbackHandler = (file: any) => {
    this.saveTempFiles(file);
    this.props.setValue(false);
  };

  uploadAttachmentPress = () => {
    this.setState(
      {
        actionSheet: {
          ...this.state.actionSheet,
          type: 'image',
          list: ImageActions,
        },
      },
      () => {
        this._actionSheet && this._actionSheet.showSheet();
      },
    );
    //loaderHandler.hideLoader();
    this.props.showLoader(false);
    this.props.loaderText('Loading...');
  };
  // cameraAttachmentPress = () =>{
  // 	Keyboard.dismiss();
  // 	PickImage(this.fileCallbackHandler)
  // 	// this.setState(
  // 	// 	{
  // 	// 		actionSheet: {
  // 	// 			...this.state.actionSheet,
  // 	// 			type: "image",
  // 	// 			list: ImageActions
  // 	// 		}
  // 	// 	},
  // 	// 	() => {
  // 	// 		this._actionSheet && this._actionSheet.showSheet();
  // 	// 	}
  // 	// );
  // 	// //loaderHandler.hideLoader();
  // }

  audioAttachmentPress = () => {
    Keyboard.dismiss();
    this.props.navigation.navigate('commonAudioRecorder', {
      mindPopID: this.state.id || 0,
      editRefresh: (file: any[]) => {
        Keyboard.dismiss();
        let fid = GenerateRandomID();
        let tempFile: TempFile[] = file.map(obj => ({ ...obj, fid }));
        this.saveTempFiles(tempFile);
        this.props.setValue(false);
      },
    });
    //loaderHandler.hideLoader();
    this.props.showLoader(false);
    this.props.loaderText('Loading...');
  };

  convertToMemory = (id: any) => {
    if (Utility.isInternetConnected) {
      //loaderHandler.showLoader('Loading...');
      this.props.showLoader(true);
      this.props.loaderText('Creating Memory...');
      this.draftDetails = DefaultDetailsMemory(
        decode_utf8(this.state.content.trim()),
      );
      this.draftDetails.mindpop_id = id;
      MindPopStore._deleteMindPops([parseInt(id)]);
      CreateUpdateMemory(
        this.draftDetails,
        this.filesToUpload,
        'mindpopEditMemoryListener',
        'save',
        async(resp) => {
          if (resp.status) {
            await analytics().logEvent('memory_created_from_mindpop');
            this.props.navigation.replace('createMemory', {
              editMode: true,
              draftNid: resp.id,
              deepLinkBackClick: this.props.deepLinkBackClick,
            });
          } else {
            //loaderHandler.hideLoader();
            this.props.showLoader(false);
            this.props.loaderText('Loading...');
            this.messageRef._show({ message: resp.message });
            // ToastMessage(resp.message);
          }
        },
      );
      // Keyboard.dismiss();
      // this.props.navigation.goBack();
    } else {
      // ToastMessage(NO_INTERNET);
      this.messageRef._show({ message: NO_INTERNET, color: Colors.ErrorColor });

    }
  };

  toolbar = () => {
    return Platform.OS == 'android' ? (
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps="always"
        style={Styles.scrollViewStyle}>
        <View
          style={[
            Styles.toolBarContainer,
            {
              justifyContent:
                this.props?.route?.name == 'mindPopEdit'
                  ? 'space-between'
                  : 'flex-end',
              ...(DeviceInfo.isTablet() &&
                this.props?.route?.name == 'mindPopList'
                ? {
                  borderLeftColor: Colors.backrgba,
                  borderLeftWidth: 1,
                }
                : {}),
            },
          ]}>
          {this.state.bottomToolbar > 0 && (
            <TouchableHighlight
              underlayColor={Colors.white}
              onPress={() => Keyboard.dismiss()}
              style={Styles.keyboardHidContainer}>
              <Image source={keyboard_hide} />
            </TouchableHighlight>
          )}
          {this.props?.route?.name == 'mindPopEdit' ? (
            <View style={Styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  this.cameraAttachmentPress();
                }}
                style={Styles.buttonStyle}>
                <Image source={camera} resizeMode="stretch" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  this.audioAttachmentPress();
                }}
                style={Styles.buttonStyle}>
                <Image source={record} resizeMode="stretch" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  this.uploadAttachmentPress();
                }}
                style={Styles.buttonStyle}>
                <Image source={icon_upload_file} resizeMode="stretch" />
              </TouchableOpacity>
            </View>
          ) : null}
          {this.state.id ? (
            <React.Fragment>
              <View style={Styles.converMemoryContainer}>
                <TouchableOpacity
                  onPress={() => this.convertToMemory(this.state.id)}>
                  <Text style={Styles.converMemory}>Convert to Memory</Text>
                </TouchableOpacity>
                {this.isEdit ? (
                  <TouchableOpacity
                    onPress={() => {
                      Keyboard.dismiss();
                      Alert.alert(
                        'Are you sure you want to delete this MindPop?',
                        `You will lose all content${this.files.length > 0 ? ' and files attached.' : ''
                        }.`,
                        [
                          {
                            text: 'Yes',
                            style: 'destructive',
                            onPress: () => {
                              ////loaderHandler.showLoader("Deleting...");
                              this.props.showLoader(true);
                              this.props.loaderText('Deleting...');
                              this.props.deleteMindPops({
                                mindPopList: [{ mindPopID: this.state.id }],
                                configurationTimestamp: TimeStampMilliSeconds(),
                              });
                            },
                          },
                          {
                            text: 'No',
                            style: 'cancel',
                            onPress: () => { },
                          },
                        ],
                      );
                    }}
                    style={Styles.buttonContainerStyle}>
                    <Image source={rubbish} resizeMode="contain" />
                  </TouchableOpacity>
                ) : (
                  <View style={Styles.emptyContainerStyle}></View>
                )}
                {/* {this.state.bottomToolbar > 0 && <TouchableOpacity
							onPress={() => Keyboard.dismiss()}
							style={{ alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
							<Image source={keyboard_hide} resizeMode="contain" />
						</TouchableOpacity>  } */}
              </View>
            </React.Fragment>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    ) : (
      <KeyboardAccessory style={Styles.KeyboardAccessoryStyle}>
        <View
          style={[
            Styles.toolBarContainer,
            {
              justifyContent:
                this.props.route.name == 'mindPopEdit'
                  ? 'space-between'
                  : 'flex-end',
              ...(DeviceInfo.isTablet() &&
                this.props.route.name == 'mindPopList'
                ? {
                  borderLeftColor: Colors.backrgba,
                  borderLeftWidth: 1,
                }
                : {}),
            },
          ]}>
          {this.state.bottomToolbar > 0 && (
            <TouchableHighlight
              underlayColor={Colors.white}
              onPress={() => Keyboard.dismiss()}
              style={Styles.keyboardHidContainer}>
              <Image source={keyboard_hide} />
            </TouchableHighlight>
          )}
          {this.props?.route?.name == 'mindPopEdit' ? (
            <View style={Styles.buttonContainer}>
              {/* <TouchableOpacity
							onPress={() => {this.cameraAttachmentPress()}}
							style={{ alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
							<Image source={camera} resizeMode="contain" />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {this.audioAttachmentPress()}}
							style={{ alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
							<Image source={record} resizeMode="contain" />
						</TouchableOpacity> */}

              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  this.cameraAttachmentPress();
                }}
                style={Styles.buttonStyle}>
                <Image source={camera} resizeMode="stretch" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  this.audioAttachmentPress();
                }}
                style={Styles.buttonStyle}>
                <Image source={record} resizeMode="stretch" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  this.uploadAttachmentPress();
                }}
                style={Styles.buttonStyle}>
                <Image source={icon_upload_file} resizeMode="stretch" />
              </TouchableOpacity>
            </View>
          ) : null}
          {this.state.id ? (
            <React.Fragment>
              <View style={Styles.converMemoryContainer}>
                <TouchableOpacity
                  onPress={() => this.convertToMemory(this.state.id)}>
                  <Text style={Styles.converMemory}>Convert to Memory</Text>
                </TouchableOpacity>
                {this.isEdit ? (
                  <TouchableOpacity
                    onPress={() => {
                      Keyboard.dismiss();
                      Alert.alert(
                        'Are you sure you want to delete this MindPop?',
                        `You will lose all content${this.files.length > 0 ? ' and files attached.' : ''
                        }.`,
                        [
                          {
                            text: 'Yes',
                            style: 'destructive',
                            onPress: () => {
                              ////loaderHandler.showLoader("Deleting...");
                              this.props.showLoader(true);
                              this.props.loaderText('Deleting...');
                              this.props.deleteMindPops({
                                mindPopList: [{ mindPopID: this.state.id }],
                                configurationTimestamp: TimeStampMilliSeconds(),
                              });
                            },
                          },
                          {
                            text: 'No',
                            style: 'cancel',
                            onPress: () => { },
                          },
                        ],
                      );
                    }}
                    style={Styles.buttonStyle}>
                    <Image source={rubbish} resizeMode="contain" />
                  </TouchableOpacity>
                ) : (
                  <View style={Styles.emptyContainerStyle}></View>
                )}
                {/* {this.state.bottomToolbar > 0 && <TouchableOpacity
							onPress={() => Keyboard.dismiss()}
							style={{ alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
							<Image source={keyboard_hide} resizeMode="contain" />
						</TouchableOpacity>  } */}
              </View>
            </React.Fragment>
          ) : null}
        </View>
      </KeyboardAccessory>
    );
  };

  onActionItemClicked = (index: number): void => {
    this._actionSheet.hideSheet();
    this.setState({
      actionSheet: { ...this.state.actionSheet, type: 'none', list: [] },
    }, () => {
      setTimeout(() => {
        switch (index) {
          case 0:
            PickImage(this.fileCallbackHandler);
            break;
          case 1:
            PickAudio(this.fileCallbackHandler);
            break;
          case 2:
            PickPDF(this.fileCallbackHandler);
            break;
        }
      }, 200);
    });
  };

  componentDidMount() {
    setTimeout(() => {
      this._inputRef && this._inputRef.focus && this._inputRef.focus();
    }, 500);
  }

  reloadData = (success: boolean, data: any) => {

    if (success) {
      //Incase user was in creation mode
      if (!this.state.id) {
        //Go Back
        Keyboard.dismiss();
        DeviceEventEmitter.emit('updateSelected', 0);
        this.props?.route?.params?.updateList && this.props?.route?.params?.updateList();
        //loaderHandler.hideLoader();
        this.props.showLoader(false);
        this.props.loaderText('Loading...');
        this.props.navigation.goBack();
        return;
      }
      //remove all temporary files first
      this.removeTempFiles();
      let content = decode_utf8(decode_utf8(data.message || '') || '');
      this.setState(
        {
          id: data.id,
          content,
          oldcontent: content,
        },
        () => {
          if (data) {
            this.setupFiles(data);
            this.updateFiles();
          }
          if (this.state.deletedAttachments.length > 0) {
            let ids = [...this.state.deletedAttachments].map(
              (itm: { fid: string }) => parseInt(`${itm.fid}`),
            );
            MindPopStore.deleteMindPopAttachment(ids)
              .then((resp: any) => {
                //showConsoleLog(ConsoleType.LOG,"message", resp);
                // this._prevUpdate();
                DeviceEventEmitter.emit('updateSelected', 0);
                this.props?.route?.params?.updateList && this.props?.route?.params?.updateList();
                //loaderHandler.hideLoader();
                this.props.showLoader(false);
                this.props.loaderText('Loading...');
                if (DeviceInfo.isTablet()) {
                  Keyboard.dismiss();
                  this.props.navigation.goBack();
                } else {
                  this._removeDeletedFiles(ids);
                  this.updateFiles();
                  this.props.setValue(true, data);
                }
              })
              .catch((error: any) => {
                // this._prevUpdate();
                DeviceEventEmitter.emit('updateSelected', 0);
                this.props?.route?.params?.updateList && this.props?.route?.params?.updateList();
                //showConsoleLog(ConsoleType.LOG,"Error", error);
                //loaderHandler.hideLoader();
                this.props.showLoader(false);
                this.props.loaderText('Loading...');
                if (DeviceInfo.isTablet()) {
                  Keyboard.dismiss();
                  this.props.navigation.goBack();
                } else {
                  this.props.setValue(true, data);
                }
              });
          } else {
            DeviceEventEmitter.emit('updateSelected', 0);
            this.props?.route?.params?.updateList && this.props?.route?.params?.updateList();
            //loaderHandler.hideLoader();
            this.props.showLoader(false);
            this.props.loaderText('Loading...');
            if (DeviceInfo.isTablet()) {
              Keyboard.dismiss();
              this.props.navigation.goBack();
            } else {
              this.props.setValue(true, data);
            }
          }
        },
      );
    } else {
      let message =
        typeof data == 'object'
          ? data.message || ERROR_MESSAGE
          : typeof data == 'string'
            ? data
            : ERROR_MESSAGE;
      // ToastMessage(
      //   message,
      //   message == NO_INTERNET ? Colors.WarningColor : Colors.ErrorColor,
      // );
      //loaderHandler.hideLoader();
      this.props.showLoader(false);
      this.props.loaderText('Loading...');
      this.messageRef._show({ message, color: message == NO_INTERNET ? Colors.WarningColor : Colors.ErrorColor });

    }
  };

  UNSAFE_componentWillReceiveProps(nextProps: { [x: string]: any }) {
    //Delete MindPop Operation resolver
    if (this.props !== nextProps) {
      if (nextProps.deleteStatus && nextProps.deleteStatus.completed) {
        //loaderHandler.hideLoader();
        this.props.showLoader(false);
        this.props.loaderText('Loading...');
        if (
          nextProps.deleteStatus.success &&
          this.props?.route?.name == 'mindPopEdit'
        ) {
          let arrIds = [parseInt(this.state.id)];
          MindPopStore._deleteMindPops(arrIds);
          this.props.deleteMindPopsCallEnd();
          if (
            this.props?.route?.name == 'mindPopEdit' &&
            !this.isDeleteForMemory
          ) {
            Keyboard.dismiss();
            this.props.navigation.goBack();
            return;
          } else if (this.props?.route?.name == 'mindPopEdit') {
            this.isDeleteForMemory = false;
          }
        } else {
          var deleteMessage = getValue(nextProps, [
            'deleteStatus',
            'data',
            'message',
          ]);
          // ToastMessage(
          //   `${deleteMessage || ERROR_MESSAGE}`,
          //   deleteMessage ? 'black' : Colors.ErrorColor,
          // );
          this.messageRef._show({ message: `${deleteMessage || ERROR_MESSAGE}`, color: deleteMessage ? 'black' : Colors.ErrorColor });

        }
      }
      //To update files on Tablet in View mode
      if (
        this.props?.route?.name == 'mindPopList' ||
        Object.keys(this.props.listItem || {}).length <
        Object.keys(nextProps.listItem || {}).length
      ) {
        this.setupFiles(nextProps.listItem);
        this.updateFiles();
      }
      var state: { [x: string]: any } = {};
      if (
        ((this.state.id == '' && getValue(nextProps, ['listItem', 'id'])) ||
          DeviceInfo.isTablet()) &&
        this.props?.route?.name == 'mindPopList' &&
        nextProps.listItem
      ) {
        let content = decode_utf8(nextProps.listItem.message || '');
        state = {
          id: nextProps.listItem.id,
          content,
          oldcontent: content,
        };
      }

      if (this.props.isEdit != nextProps.isEdit) {
        if (nextProps.isEdit) {
          state['deletedAttachments'] = [];
        }
        this.isEdit = nextProps.isEdit;
        // this.setState({});
      }
      if (Object.keys(state).length > 0) {
        this.setState(state as State);
      }
    }
  }

  setupFiles = (itemData: { [x: string]: any }) => {
    this.files = [];
    for (let key in itemData) {
      let item = itemData[key];
      if (Array.isArray(item)) {
        let list = item.map(it => {
          return { ...it, type: key };
        });
        this.files = [...this.files, ...list];
      }
    }
  };

  _removeDeletedFiles = (ids: number[]) => {
    //clear from deletedMindPops.. need to consult prashoor fot this
    if (this.props.actionRecord || this.props.actionImageUpload) {
      //Do nothing
    } else {
      this.setState({ deletedAttachments: [] }, () => {
        this.state.id &&
          this.state.id.length == 0 &&
          this._inputRef &&
          this._inputRef.focus &&
          this._inputRef.focus();
      });
    }
  };

  enterEditMode = () => {
    this.props.setValue(false);
    setTimeout(() => {
      this._inputRef && this._inputRef.focus && this._inputRef.focus();
    }, 500);
  };

  renderHeader = () => {
    return (
      <View style={Styles.renderHeaderContainer}>
        {this.isEdit ? (
          <View
            onStartShouldSetResponder={() => true}
            onResponderStart={() => this.enterEditMode()}>
            <Text
              multiline={true}
              style={[
                Styles.captureMindPopText,
                {
                  fontStyle:
                    this.state.content.length > 0 ? 'normal' : 'italic',
                },
              ]}>
              {this.state.content || 'Capture your MindPop...'}
            </Text>
          </View>
        ) : (
          <TextInput
            placeholder="Capture your MindPop..."
            ref={ref => (this._inputRef = ref)}
            onChangeText={text => {
              this.setState({ content: text });
            }}
            placeholderTextColor="rgba(0, 0, 0, 0.8)"
            value={this.state.content}
            multiline={true}
            style={[
              Styles.textInputStyle,
              {
                fontStyle: this.state.content.length > 0 ? 'normal' : 'italic',
              },
            ]}
          />
        )}
      </View>
    );
  };

  renderItem = (item: any) => {
    // ToastMessage(this.state.deletedAttachments.length + "" + item.data.length)
    if (this.state.deletedAttachments.length == item.data.length) {
      return;
    }
    return (
      <FlatList
        style={[
          Styles.flatListContainer,
          {
            marginBottom:
              this.state.bottomToolbar > 0
                ? this.state.bottomToolbar -
                (Platform.OS == 'android' ? 230 : 160)
                : 60,
          },
        ]}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_: any, index: number) => `${index}`}
        keyboardShouldPersistTaps="always"
        horizontal={true}
        // extraData={this.props}
        scrollEnabled={true}
        data={item.data as Array<any>}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: 0, //!DeviceInfo.isTablet() ? 0 : this.props?.route?.name == "mindPopList" ? 5 : 35
            }}
          />
        )}
        renderItem={(element: any) =>
          this._renderRow({ item: element.item }, 180)
        }
      />
    );
  };

  // _renderitem = ({ item }: { item: MainItem }): JSX.Element => {
  // 	if (item.itemType == "editor") {
  // 	}
  // 	// let itemCount = (item.data as Array<any>).length
  // 	// let paddingSpace = (15 * itemCount) + 20
  // 	// let spaceToRender = ScreenWidth - paddingSpace
  // 	// let widthForThumbnail: number = spaceToRender / itemCount
  // 	let views: Element[] = (item.data as Array<any>).map(element => this._renderRow({ item: element }, 130))

  // 	return (
  // 		/*<View style={{ paddingRight: 15, paddingTop: 5, paddingLeft: 15, width: "100%", borderWidth: 1 }}>
  // 			<FlatList
  // 				style={{ width: "100%" }}
  // 				keyExtractor={(_: any, index: number) => `${index}`}
  // 				horizontal={true}
  // 				extraData={this.props}
  // 				scrollEnabled={false}
  // 				data={item.data as Array<any>}
  // 				ItemSeparatorComponent={() => (
  // 					<View
  // 						style={{
  // 							width: 0 //!DeviceInfo.isTablet() ? 0 : this.props?.route?.name == "mindPopList" ? 5 : 35
  // 						}}
  // 					/>
  // 				)}
  // 				renderItem={this._renderRow}
  // 			/>
  // 		</View>*/

  // 		<View style={{
  // 			flexDirection: 'row', justifyContent: DeviceInfo.isTablet() ? "flex-start" : "center",
  // 			flexWrap: "wrap", paddingLeft: DeviceInfo.isTablet() ? 10 : 5,
  // 		}}>
  // 			<View style={{ paddingTop: 10, flexDirection: 'row', justifyContent: DeviceInfo.isTablet() ? "flex-start" : "center", flexWrap: "wrap" }}>
  // 				{
  // 					views
  // 				}
  // 			</View>
  // 		</View>
  // 	);
  // };

  refresh = () => {
    if (this.moment != '0') {
      this.props.listMindPops &&
        this.props.listMindPops({
          searchTerm: {
            SearchString: '',
          },
          configurationTimestamp: TimeStampMilliSeconds(),
          lastSyncTimeStamp: this.moment,
        });
    }
  };

  _selDelete = (item: any, found: boolean = false) => {
    var deletedAttachments = [...this.state.deletedAttachments];

    // check if object represents temp file or uploaded item
    if (item.fid) {
      if (!found) {
        deletedAttachments = [...deletedAttachments, item];
      } else {
        // ToastMessage('Temp Attachment deleted');
        this.messageRef._show({ message: 'Temp Attachment deleted' });

        let ids = this.state.deletedAttachments.map(
          (itm: { fid: string }) => itm.fid,
        );
        deletedAttachments.splice(ids.indexOf(item.fid), 1);
      }
    }

    this.setState({ deletedAttachments });
  };

  _renderRow = (
    {
      item,
    }: {
      [x: string]: any;
      item: TempFile &
      MindPopAttachment & {
        type: string;
        fid: string;
        filename: string;
        thumb_uri: string;
      };
    },
    width: number,
  ) => {
    let thumbnailHeight = 120;
    var props: TouchableOpacityProperties = {
      style: {
        width: width,
        height: thumbnailHeight,
        justifyContent: 'center',
        alignItems: 'center',
      },
      onPress: () => {
        this.setState({ selectedItem: item }, () => {
          if (item.type == 'audios') {
            this.props.navigation.navigate('commonAudioRecorder', {
              mindPopID: this.state.id,
              selectedItem: this.state.selectedItem,
              deleteItem: () => {
                this.setState(
                  {
                    deletedAttachments: [
                      ...this.state.deletedAttachments,
                      { ...this.state.selectedItem },
                    ],
                    selectedItem: null,
                  },
                  () => {
                    this.props.setValue(false);
                  },
                );
              },
              reset: () => {
                this.setState({ selectedItem: null });
              },
            });
          } else if (item.type == 'images') {
            this.props.navigation.navigate('previewImage', {
              selectedItem: this.state.selectedItem,
              deleteItem: () => {
                this.setState(
                  {
                    deletedAttachments: [
                      ...this.state.deletedAttachments,
                      { ...this.state.selectedItem },
                    ],
                    selectedItem: null,
                  },
                  () => {
                    this.props.setValue(false);
                  },
                );
              },
              reset: () => {
                this.setState({ selectedItem: null });
              },
              isEditMode: this.props?.route?.name == 'mindPopEdit',
            });
          } else if (item.type == 'files') {
            item.url = item.uri;
            this.props.navigation.navigate('pdfViewer', { file: item });
          }
        });
      },
    };
    //showConsoleLog(ConsoleType.LOG,"Thumbnail Image:", item.thumb_uri);
    var found: boolean = false;
    var thumb_uri = item.thumb_uri;
    if (item.fid) {
      let ids = this.state.deletedAttachments.map(
        (itm: { fid: string }) => itm.fid,
      );
      found = ids.indexOf(item.fid || `${item.id}`) != -1;
    }
    /*
    else {
      //if the filePath doesnot exist in filePathsToUpload, that means it has been deleted.
      // hence, 'found' to be deleted
      let filePaths = this.filePathsToUpload.map((filePath: string) => filePath);
      found = this.filePathsToUpload.length == 0 || filePaths.indexOf(item.filePath) == -1;
    }*/
    return (
      <View>
        {found ? (
          <View></View>
        ) : (
          <TouchableOpacity {...props} key={item.fid} style={{ padding: 13 }}>
            <View
              style={{
                borderWidth: 1,
                width: width,
                height: thumbnailHeight,
                borderRadius: 5,
                overflow: 'hidden',
              }}>
              {item.type == 'audios' ? (
                <ImageBackground
                  style={Styles.imageBackgrounStyle}
                  source={sound_wave}
                  resizeMode="contain">
                  <View style={Styles.imageBackgrounContainerStyle}>
                    <View style={Styles.imageBackgrounsubContainerStyle}>
                      <Image
                        style={Styles.audioPlayStyle}
                        source={audio_play}
                      />
                    </View>
                  </View>
                  <Text numberOfLines={1} style={Styles.fileName}>{`${item.title ? item.title : item.filename ? item.filename : ''
                    }`}</Text>
                </ImageBackground>
              ) : item.type == 'images' ? (
                <Image
                  source={{ uri: item.thumb_uri }}
                  style={{ width: width, height: thumbnailHeight }}
                  resizeMode="contain"
                />
              ) : item.type == 'files' ? (
                <View style={Styles.imageBackgrounStyle}>
                  <ImageBackground
                    style={Styles.pdfImagebackground}
                    source={pdf_icon}
                    resizeMode="contain"
                  />
                  <Text numberOfLines={1} style={Styles.fileName}>
                    {`${item.filename}`}
                  </Text>
                </View>
              ) : null}
              {found ? <View style={Styles.found} /> : null}
            </View>

            {!this.isEdit && this.props.route.name == 'mindPopEdit' ? (
              <TouchableOpacity
                onPress={() => this._selDelete(item, found)}
                style={Styles.deleteContainer}>
                <View
                  style={[
                    Styles.deleteSubCon,
                    {
                      backgroundColor: found ? '#ff2315' : Colors.black,
                    },
                  ]}>
                  <Text style={Styles.crossText}>{`${found ? '-' : '✕'}`}</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </TouchableOpacity>
        )}
      </View>
    );
  };
}

const mapState = (state: { [x: string]: any }) => ({
  list: state.getMindPop,
  addMindPop: state.addMindPop,
  deleteStatus: state.deleteMindPop,
  ...(DeviceInfo.isTablet() ? {} : { isEdit: state.mindPopEditMode.mode }),
  listItem: state.mindPopEditMode.selectedMindPop,
  showLoaderValue: state.dashboardReducer.showLoader,
  loaderTextValue: state.dashboardReducer.loaderText,
});

const mapDispatch = (dispatch: Function) => {
  return {
    deleteMindPops: (payload: any) =>
      dispatch({ type: DeleteMindPopOperation.RequestStarted, payload }),
    deleteMindPopsCallEnd: () =>
      dispatch({ type: DeleteMindPopOperation.RequestEnded }),
    complete: () => dispatch({ type: AddMindPopStatus.RequestEnded }),
    cleanEdit: () => dispatch({ type: EditMode.UNSELECT }),
    edit: () => dispatch({ type: EditMode.RESET }),
    // callEnded: () => dispatch({ type: GetMindPopStatus.RequestEnded }),
    setValue: (mode: boolean, value: any) =>
      dispatch({ type: mode ? EditMode.EDIT : EditMode.RESET, payload: value }),
    listMindPops: (payload: any) =>
      dispatch({ type: GetMindPopStatus.RequestStarted, payload }),
    showLoader: (payload: any) =>
      dispatch({ type: SHOW_LOADER_READ, payload: payload }),
    loaderText: (payload: any) =>
      dispatch({ type: SHOW_LOADER_TEXT, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(MindPopEdit);
