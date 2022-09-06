import React, {createRef} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  action_audio,
  action_camera,
  action_close,
  action_pdf,
  audio_play,
  camera,
  icon_add_content_audio,
  icon_add_content_camera,
  icon_add_content_upload,
  icon_upload_file,
  keyboard_hide,
  pdf_icon,
  record,
  sound_wave,
} from '../../images';
// @ts-ignore
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import ActionSheet, {ActionSheetItem} from '../../common/component/actionSheet';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import {
  CaptureImage,
  PickAudio,
  PickImage,
  PickPDF,
} from '../../common/component/filePicker/filePicker';
import Text from '../../common/component/Text';
import {No_Internet_Warning, ToastMessage} from '../../common/component/Toast';
import {
  Colors,
  encode_utf8,
  fontFamily,
  GenerateRandomID,
  TimeStampMilliSeconds,
} from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import {createNew} from '../createMemory';
import {CreateUpdateMemory} from '../createMemory/createMemoryWebService';
import {
  DefaultDetailsMemory,
  DefaultDetailsWithoutTitleMemory,
} from '../createMemory/dataHelper';
import {TempFile} from '../mindPop/edit';
import {
  addEditMindPop,
  kMindPopUploadedIdentifier,
} from '../mindPop/edit/addMindPopflow';
import DefaultPreference from 'react-native-default-preference';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import {connect} from 'react-redux';
import CustomAlert from '../../common/component/customeAlert';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import CreateMemoryIntro from '../createMemory/createMemoryIntro';
import {showCustomAlert, showCustomAlertData} from '../createMemory/reducer';
import style from './styles';

type State = {[key: string]: any};

const ImageActions: Array<ActionSheetItem> = [
  {index: 0, text: 'Image', image: action_camera},
  {index: 1, text: 'Audio', image: action_audio},
  {index: 2, text: 'PDF', image: action_pdf},
  {index: 3, text: 'Cancel', image: action_close},
];

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

class AddContentDetails extends React.Component {
  _actionSheet: any | ActionSheet = null;
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;
  mindPopCallback: EventManager;
  backListner: any;
  createMemoryListener: EventManager;
  draftDetails: any = {};
  inputRef = createRef();
  state: State = {
    memoryIntroVisibility: false,
    textContent: '',
    files: [],
    bottomBar: {
      keyboardVisible: false,
      bottom: 0,
    },
    actionSheet: {
      type: 'none',
      list: ImageActions,
    },
    listItems: [{itemType: 'editor'}],
    content: '',
    showNextDialog: false,
    mindPopClick: false,
    titleError: '',
    placeholder: '|Tap to start writing...',
  };

  constructor(props: any) {
    super(props);
    this.addListeners();
  }

  componentDidMount = () => {
    // setTimeout(() => {
    DefaultPreference.get('hide_memory_intro').then((value: any) => {
      if (value == 'true') {
        this.setState({memoryIntroVisibility: false});
      } else {
        this.setState({memoryIntroVisibility: true});
      }
    });
    // }, 200);
  };
  nextDialogView = () => {
    return (
      <CustomAlert
        modalVisible={true}
        // setModalVisible={setModalVisible}
        title={'Save your memory'}
        message={
          'We always save your work, but you can choose to save writing this memory for later, or continue writing now.'
        }
        buttons={[
          {
            text: 'Save as Memory Draft',
            func: () => {
              ReactNativeHapticFeedback.trigger('impactMedium', options);
              this.createMemory();
            },
          },
          {
            text: 'Save as a MindPop',
            func: () => {
              this.setState(
                {
                  mindPopClick: true,
                  showNextDialog: false,
                },
                () => {
                  if (this.state.content != '') {
                    ReactNativeHapticFeedback.trigger('impactMedium', options);
                    this.saveMindPop();
                  } else {
                    ToastMessage('Title is mandatory');
                    this.setState({
                      titleError: 'Title is mandatory',
                    });
                  }
                },
              );
            },
          },
          {
            text: 'Cancel',
            func: () => {
              this.setState(
                {
                  showNextDialog: false,
                },
                () => {
                  this.props.beforeBack ? this.props.beforeBack() : null;
                  this.props.navigation.pop();
                },
              );
            },
            styles: {fontWeight: '400'},
          },
        ]}
      />
      // <View
      //   style={style.nextDialogViewContainer}
      //   onStartShouldSetResponder={() => true}
      //   onResponderStart={() => this.setState({ showNextDialog: false })}>
      //   <View>
      //     <View
      //       style={style.nextDialogViewSubContainer}>
      //       <View
      //         style={style.saveAsDraftButtonContainer}>
      //         {this.selectorButton(
      //           'Save as Memory Draft',
      //           memory_draft,
      //           this.createMemory,
      //         )}
      //         <Text style={style.textDialog}>
      //           {'If you want to set the Date, Location and Title now.'}
      //         </Text>
      //       </View>
      //       <View
      //         style={style.mindPopButtonContainer}>
      //         {this.selectorButton(
      //           'Save as a MindPop',
      //           mindpopBarWhiteIcon,
      //           this.saveMindPop,
      //         )}
      //         <Text style={style.textDialog}>
      //           {
      //             'If you want to quickly capture an inkling of a memory before you forget it.'
      //           }
      //         </Text>
      //       </View>
      //     </View>
      //     <TouchableOpacity
      //       style={style.canclebuttonStyle}
      //       onPress={() => this.setState({ showNextDialog: false })}>
      //       <Image
      //         source={small_close_white_}
      //         style={style.cancleImageStyle}
      //       />
      //     </TouchableOpacity>
      //   </View>
      // </View>
    );
  };

  selectorButton = (name: any, icon: any, onItemPressed: () => void) => {
    return (
      <View style={style.selectorButtonContainer}>
        <TouchableOpacity
          style={style.selectorButtonStyle}
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactMedium', options);
            onItemPressed();
          }}>
          <Image source={icon} />
          <Text style={style.textStyle}>{name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  addListeners = () => {
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
    this.mindPopCallback = EventManager.addListener(
      kMindPopUploadedIdentifier,
      this.mindPopUpdated,
    );
    this.backListner = EventManager.addListener(
      'hardwareBackPress',
      this._onBack,
    );
    this.createMemoryListener = EventManager.addListener(
      'addContentCreateMemory',
      this.createMemoryCallBack,
    );
  };

  createMemoryCallBack = (success: boolean, nid: any, padDetails: any) => {
    loaderHandler.hideLoader();
    if (success) {
      this.props.navigation.replace('createMemory', {
        attachments: this.state.files,
        id: nid,
        textTitle: this.draftDetails.title,
        editMode: false,
        padDetails: padDetails,
        location: {description: '', reference: ''},
        memoryDate: this.draftDetails.memory_date,
        type: createNew,
      });
    } else {
      ToastMessage('Unable to create memory');
    }
  };

  _onBack = () => {
    if (this.state.content.trim() != '' || this.state.files.length > 0) {
      Keyboard.dismiss();
      setTimeout(() => {
        Alert.alert('Save changes?', `Do you want to save your changes?`, [
          {
            text: 'No',
            style: 'cancel',
            onPress: () => {
              let content = this.state.oldcontent;
              this.setState({content}, () => {
                //Go Back
                Keyboard.dismiss();
                this.props.navigation.goBack();
              });
            },
          },
          {
            text: 'Yes',
            style: 'default',
            onPress: () => {
              this.saveMemoryOrMindpop();
            },
          },
        ]);
      }, 10);
    } else {
      Keyboard.dismiss();
      this.props.navigation.goBack();
    }
  };

  componentWillUnmount = () => {
    this.mindPopCallback.removeListener();
    Keyboard.removeAllListeners('keyboardDidShow');
    Keyboard.removeAllListeners('keyboardDidHide');
    Keyboard.removeAllListeners('keyboardWillShow');
    Keyboard.removeAllListeners('keyboardWillHide');
    this.backListner.removeListener();
    this.createMemoryListener.removeListener();
    // this.keyboardDidShowListener.removeListener();
    // this.keyboardDidHideListener.removeListener();
  };

  mindPopUpdated = (success: any, mindpopID: any) => {
    if (success) {
      // this.props.showAlertCall(true);
      // this.props.showAlertCallData({
      //   alertTitle: 'New MindPop saved!',
      //   desc: `See your new MindPop added with the rest of your in-progress work now.`,
      // });
      this.props.showAlertCall(true);
      this.props.showAlertCallData({
        title: 'New MindPop saved!',
        desc: `See your new MindPop added with the rest of your in-progress work now.`,
      });
      // Alert.alert('New MindPop saved!', `See your new MindPop added with the rest of your in-progress work now.`, [
      //   {
      //     text: 'Great!',
      //     style: 'cancel',
      //     onPress: () => {
      //     },
      //   }
      // ]);
      // this.props.navigation.replace('mindPop')
      this.props.navigation.mindPop();

      // , {
      //   showPublishedPopup: true,
      //   alertTitle: 'New MindPop saved!',
      //   desc: `See your new MindPop added with the rest of your in-progress work now.`,
      // });
    } else {
      loaderHandler.hideLoader();
    }
  };

  _keyboardDidShow = (e: any) => {
    this.setState({
      bottomBar: {
        keyboardVisible: true,
        bottom: e.endCoordinates.height,
      },
    });
  };

  _keyboardDidHide = (e?: any) => {
    this.setState({
      bottomBar: {
        keyboardVisible: false,
        bottom: 0,
      },
    });
  };

  saveMemoryOrMindpop = () => {
    if (Utility.isInternetConnected) {
      Keyboard.dismiss();
      // if (this.state.content.trim() == '' && this.state.files.length == 0) {
      //   ToastMessage('No changes were made', 'black');
      // } else {
      //   if (this.state.content.trim().length == 0) {
      //     ToastMessage('Please add a description', Colors.ErrorColor);
      //   } else {
      this.setState({
        showNextDialog: true,
      });
      //   }
      // }
    } else {
      No_Internet_Warning();
    }
  };

  createMemory = async () => {
    this.setState(
      {
        showNextDialog: false,
      },
      () => {
        if (Utility.isInternetConnected) {
          if (this.state.content.trim() === '') {
            this.draftDetails = DefaultDetailsMemory('My memory');
          } else {
            this.draftDetails = DefaultDetailsWithoutTitleMemory(
              this.state.content,
            ); //.trim()
          }
          loaderHandler.showLoader('Loading...');
          CreateUpdateMemory(this.draftDetails, [], 'addContentCreateMemory');
        } else {
          No_Internet_Warning();
        }
      },
    );
  };

  saveMindPop = () => {
    this.setState(
      {
        showNextDialog: false,
      },
      () => {
        if (Utility.isInternetConnected) {
          let moment = TimeStampMilliSeconds();
          var req: {
            requestDetails: {
              mindPopContentArray: Array<any>;
              mindPopID?: string;
            };
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
          loaderHandler.showLoader('Saving...');
          addEditMindPop(req, this.state.files, true);
        } else {
          No_Internet_Warning();
        }
      },
    );
  };

  cameraAttachmentPress = () => {
    CaptureImage(this.fileCallback);
  };

  fileCallback = (file: any) => {
    let tempfiles = this.state.files;
    file.forEach((element: any) => {
      tempfiles.push(element);
    });
    this.setState({
      files: tempfiles,
    });
  };

  audioAttachmentPress = (selectedItem?: any) => {
    Keyboard.dismiss();
    this.props.navigation.commonAudioRecorder({
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
  };

  rowItemPressed = (file: any) => {
    Keyboard.dismiss();
    switch (file.type) {
      case 'audios':
        if (file.filesize != 0) {
          this.audioAttachmentPress(file);
        } else {
          ToastMessage('This audio file is corrupted', Colors.ErrorColor);
        }
        break;
      case 'files':
        this.props.navigation.push('pdfViewer', {file: file});
        break;
      case 'images':
        this.props.navigation.push('imageViewer', {
          files: [{url: file.thumb_uri}],
          hideDescription: true,
        });
        break;
    }
  };

  onActionItemClicked = (index: number): void => {
    Keyboard.dismiss();
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
    }
  };

  toolbar = () => {
    return Platform.OS == 'android' ? (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        style={[
          style.toolbarContainer,
          {
            backgroundColor: this.state.bottomBar.keyboardVisible
              ? Colors.SerachbarColor
              : Colors.white,
          },
        ]}>
        {!this.state.bottomBar.keyboardVisible ? (
          <View style={style.keyboardVisible}>
            <TouchableHighlight onPress={() => this.cameraAttachmentPress()}>
              <View style={style.bottomRowView}>
                <Image
                  style={style.cameraImageStyle}
                  source={icon_add_content_camera}
                />
                <Text style={style.bottomTextStyle}>{'Photo/Scan'}</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => this.audioAttachmentPress()}>
              <View style={style.bottomRowView}>
                <Image
                  style={style.audioImageStyle}
                  source={icon_add_content_audio}
                />
                <Text style={style.bottomTextStyle}>{'Talk'}</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              onPress={() =>
                this._actionSheet && this._actionSheet.showSheet()
              }>
              <View style={style.bottomRowView}>
                <Image
                  style={style.cameraImageStyle}
                  source={icon_add_content_upload}
                />
                <Text style={style.bottomTextStyle}>{'Upload'}</Text>
              </View>
            </TouchableHighlight>
          </View>
        ) : (
          <View style={style.toolbarSubContainer}>
            <View style={style.bottomBarContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.cameraAttachmentPress();
                }}
                style={style.buttonContainerStyle}>
                <Image source={camera} resizeMode="stretch" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.audioAttachmentPress();
                }}
                style={style.buttonContainerStyle}>
                <Image source={record} resizeMode="stretch" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  this._actionSheet && this._actionSheet.showSheet();
                }}
                style={style.buttonContainerStyle}>
                <Image source={icon_upload_file} resizeMode="stretch" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
              }}
              style={style.buttonContainerStyle}>
              <Image
                source={keyboard_hide}
                style={style.keyboardHideImageStyle}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAwareScrollView>
    ) : (
      <KeyboardAccessory style={style.subContainerStyle}>
        <View
          style={[
            style.keyboardAccesoryContainer,
            {
              backgroundColor: this.state.bottomBar.keyboardVisible
                ? Colors.SerachbarColor
                : Colors.white,
            },
          ]}>
          {!this.state.bottomBar.keyboardVisible ? (
            <View style={style.keyboardVisible}>
              <TouchableHighlight onPress={() => this.cameraAttachmentPress()}>
                <View style={style.bottomRowView}>
                  <Image
                    style={style.cameraImageStyle}
                    source={icon_add_content_camera}
                  />
                  <Text style={style.bottomTextStyle}>{'Photo/Scan'}</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight onPress={() => this.audioAttachmentPress()}>
                <View style={style.bottomRowView}>
                  <Image
                    style={style.audioImageStyle}
                    source={icon_add_content_audio}
                  />
                  <Text style={style.bottomTextStyle}>{'Talk'}</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() =>
                  this._actionSheet && this._actionSheet.showSheet()
                }>
                <View style={style.bottomRowView}>
                  <Image
                    style={style.cameraImageStyle}
                    source={icon_add_content_upload}
                  />
                  <Text style={style.bottomTextStyle}>{'Upload'}</Text>
                </View>
              </TouchableHighlight>
            </View>
          ) : (
            <View style={style.toolbarSubContainer}>
              <View style={style.buttonSubContainer}>
                <TouchableOpacity
                  onPress={() => {
                    this.cameraAttachmentPress();
                  }}
                  style={style.buttonContainerStyle}>
                  <Image source={camera} resizeMode="stretch" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.audioAttachmentPress();
                  }}
                  style={style.buttonContainerStyle}>
                  <Image source={record} resizeMode="stretch" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    this._actionSheet && this._actionSheet.showSheet();
                  }}
                  style={style.buttonContainerStyle}>
                  <Image source={icon_upload_file} resizeMode="stretch" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                }}
                style={style.buttonContainerStyle}>
                <Image
                  source={keyboard_hide}
                  style={style.keyboardHideImageStyle}
                  resizeMode="stretch"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAccessory>
    );
    // <KeyboardAccessory style={{backgroundColor: "#fff",
    //                            position:"absolute",
    //                            width: "100%",
    //                            flexDirection: "row",
    //                            justifyContent: "center",
    //                            alignItems: "center", borderTopWidth: 1, borderBottomWidth: 1, borderColor: "rgba(0,0,0,0.4)"}}>
    // <View
    // 	style={{
    // 		width: "100%",
    // 		minHeight: 40,
    // 		position: "absolute",
    // 		flexDirection: "row",
    // 		backgroundColor: this.state.bottomBar.keyboardVisible ? "#F3F3F3" : "#FFF",
    // 		justifyContent: "space-between",
    // 		alignItems: "center",
    // 		paddingLeft: 10,
    // 		paddingRight: 10,
    // 		borderTopColor: "rgba(0.0, 0.0, 0.0, 0.25)",
    // 		borderTopWidth: 1}}>

    // 		{/* {this.state.bottomBar.keyboardVisible ?  */}
    //         <View style={{ width:"100%", justifyContent: "space-between", flexDirection: "row" }}>
    //             <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
    //                 <TouchableOpacity
    //                     onPress={() => {this.cameraAttachmentPress()}}
    //                     style={{ alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
    //                     <Image source={camera} resizeMode="contain" />
    //                 </TouchableOpacity>

    //                 <TouchableOpacity
    //                     onPress={() => {this.audioAttachmentPress()}}
    //                     style={{ alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
    //                     <Image source={record} resizeMode="contain" />
    //                 </TouchableOpacity>

    //                 <TouchableOpacity
    //                     onPress={() => { Keyboard.dismiss(); this._actionSheet && this._actionSheet.showSheet() }}
    //                     style={{ alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
    //                     <Image source={icon_upload_file} resizeMode="contain" />
    //                 </TouchableOpacity>
    //             </View>
    //             <TouchableOpacity
    //                     onPress={() => { Keyboard.dismiss();}}
    //                     style={{ alignItems: "center", justifyContent: "center",  width: 44, height: 44 }}>
    //                     <Image source={keyboard_hide} style={{ alignItems: "center", justifyContent: "center", width: 25, height: 25 }}resizeMode="contain" />
    //             </TouchableOpacity>
    //         </View>
    //         {/* :
    //         <View style={{width: "100%", height:140, alignItems:"center", flexDirection: "row", justifyContent: "space-around"}}>
    //             <TouchableHighlight  onPress={()=> this.cameraAttachmentPress()}>
    //                 <View style={style.bottomRowView}>
    //                     <Image style={{height: 35, resizeMode: "contain", padding: 15}} source={icon_add_content_camera}/>
    //                     <Text style={{...fontSize(16), color: "#fff", paddingTop: 10}}>{"Photo/Scan"}</Text>
    //                 </View>
    //             </TouchableHighlight>

    //             <TouchableHighlight onPress={()=> this.audioAttachmentPress()}>
    //                 <View style={style.bottomRowView}>
    //                     <Image style={{height: 35, resizeMode: "contain"}} source={icon_add_content_audio}/>
    //                     <Text style={{...fontSize(16), color: "#fff", paddingTop: 10}}>{"Talk"}</Text>
    //                 </View>
    //             </TouchableHighlight>

    //             <TouchableHighlight  onPress={()=> this._actionSheet && this._actionSheet.showSheet()}>
    //                 <View style={style.bottomRowView}>
    //                     <Image style={{height: 35, resizeMode: "contain", padding: 15}} source={icon_add_content_upload}/>
    //                     <Text style={{...fontSize(16), color: "#fff", paddingTop: 10}}>{"Upload"}</Text>
    //                 </View>
    //             </TouchableHighlight> */}
    //         {/* </View>} */}

    // </View>
    // </KeyboardAccessory>
  };

  removeFile = (fid: any) => {
    let tempFiles = this.state.files;
    tempFiles = tempFiles.filter((element: any) => element.fid != fid);
    this.setState({
      files: tempFiles,
    });
  };

  returnFileAttachments = () => {
    let views: Element[] = (this.state.files as Array<any>).map(
      (element: any) => this._renderRow(element, 130),
    );
    return views;
  };

  _renderRow = (element: any, width: any) => {
    return (
      <TouchableHighlight
        onPress={() => this.rowItemPressed(element)}
        underlayColor={Colors.touchableunderlayColor}
        key={element.fid}
        style={style.padding15}>
        <View>
          <View style={[style.RecordContainer, {width}]}>
            {element.type == 'audios' ? (
              <ImageBackground
                style={style.RecordContainerImgBackgrounStyle}
                source={sound_wave}
                resizeMode="contain">
                <View style={style.playButtonMainContainer}>
                  <View style={style.playButtonContainer}>
                    <Image style={style.audioImage} source={audio_play} />
                  </View>
                </View>
                <Text numberOfLines={1} style={style.filenameTextStyle}>
                  {`${element.filename}`}
                </Text>
              </ImageBackground>
            ) : element.type == 'images' ? (
              <Image
                source={{uri: element.thumb_uri}}
                style={{width: width, height: 120}}
                resizeMode="contain"
              />
            ) : element.type == 'files' ? (
              <View style={style.RecordContainerImgBackgrounStyle}>
                <ImageBackground
                  style={style.pdfImageStyle}
                  source={pdf_icon}
                  resizeMode="contain"
                />
                <Text numberOfLines={1} style={style.filenameTextStyle}>
                  {`${element.filename}`}
                </Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={() => this.removeFile(element.fid)}
            style={style.deletefileContainer}>
            <View style={style.deletefileSubContainer}>
              <Text style={style.crossTextStyle}>{'✕'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <SafeAreaView style={style.mainConTainer}>
        <StatusBar
          barStyle={
            Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
          }
          backgroundColor={Colors.NewThemeColor}
        />

        <TouchableWithoutFeedback
          onPress={() => {
            this.inputRef.focus();
          }}
          underlayColor={Colors.white}>
          {/* <NavigationHeaderSafeArea
            heading={'New Memory/MindPop'}
            showCommunity={true}
            cancelAction={this._onBack}
            showRightText={true}
            rightText={'Next'}
            saveValues={this.saveMemoryOrMindpop}
          /> */}
          <View style={style.container}>
            <NavigationHeaderSafeArea
              // heading={'Filters'}
              height="120"
              heading={''}
              // padding={20}
              showCommunity={false}
              cancelAction={this.saveMemoryOrMindpop}
              // cancelAction={this._onBack}
              showRightText={this.state.content.length ? true : false}
              isWhite={true}
              rightText={'Save'}
              saveValues={this.saveMemoryOrMindpop}
              backIcon={action_close}
            />
            <TouchableWithoutFeedback
              onPress={() => {
                // this.setState({
                //   showNextDialog: true
                // })
              }}
              underlayColor={Colors.white}
              style={style.fullWidth}>
              <View style={style.fullFlex}>
                <View style={style.inputContainer}>
                  {/* {
                    this.state.mindPopClick ? */}
                  <>
                    <TextInput
                      placeholder={this.state.placeholder}
                      autoFocus={false}
                      ref={ref => (this.inputRef = ref)}
                      onChangeText={text => {
                        this.setState({
                          content: text,
                          titleError: '',
                          placeholder: 'Start writing...',
                        });
                      }}
                      onFocus={() => {
                        this.setState({placeholder: 'Start writing...'});
                      }}
                      placeholderTextColor={Colors.bordercolor}
                      value={this.state.content}
                      multiline={true}
                      style={style.textInputStyle}
                    />
                    {this.state.titleError != '' && (
                      <Text style={style.titleError}>
                        {this.state.titleError}
                      </Text>
                    )}
                  </>
                  {/* :
                      <Text style={style.textInputStyle}>{"|Tap to start writing..."}</Text>
                  } */}
                  {/*  */}
                </View>
                {this.state.files.length > 0 ? (
                  <View>
                    <View key="seperator" style={style.attachmentContainer} />

                    <FlatList
                      horizontal={true}
                      keyboardShouldPersistTaps={'handled'}
                      keyExtractor={(_, index: number) => `${index}`}
                      style={[
                        style.flatlistStyle,
                        {
                          marginBottom:
                            this.state.bottomBar.bottom > 0
                              ? this.state.bottomBar.bottom -
                                (Platform.OS == 'android' ? 230 : 160)
                              : 120,
                        },
                      ]}
                      keyExtractor={(item: any, index: number) => `${index}`}
                      data={this.state.files}
                      renderItem={(item: any) =>
                        this._renderRow(item.item, 180)
                      }
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      width: '100%',
                      height:
                        Platform.OS == 'android'
                          ? 0
                          : this.state.bottomBar.bottom == 0
                          ? 130
                          : this.state.bottomBar.bottom,
                    }}></View>
                )}
              </View>
            </TouchableWithoutFeedback>

            {/* {this.toolbar()} */}
            {this.state.showNextDialog && this.nextDialogView()}
            <ActionSheet
              ref={ref => (this._actionSheet = ref)}
              width={DeviceInfo.isTablet() ? '65%' : '100%'}
              actions={this.state.actionSheet.list}
              onActionClick={this.onActionItemClicked.bind(this)}
            />
            <View style={style.emptyView}></View>
          </View>
        </TouchableWithoutFeedback>

        {this.state.memoryIntroVisibility && (
          <CreateMemoryIntro
            cancelMemoryIntro={() => {
              this.setState({memoryIntroVisibility: false}, () => {
                DefaultPreference.set('hide_memory_intro', 'true').then(
                  function () {},
                );
              });
            }}></CreateMemoryIntro>
        )}
      </SafeAreaView>
    );
  }
}

const mapState = (state: {[x: string]: any}) => ({
  showAlert: state.MemoryInitials.showAlert,
});

const mapDispatch = (dispatch: Function) => {
  return {
    showAlertCall: (payload: any) =>
      dispatch({type: showCustomAlert, payload: payload}),
    showAlertCallData: (payload: any) =>
      dispatch({type: showCustomAlertData, payload: payload}),
  };
};
export default connect(mapState, mapDispatch)(AddContentDetails);
