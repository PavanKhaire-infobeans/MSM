import React, { useEffect, useRef, useState } from 'react';
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
  pdf_icon,
  sound_wave,
} from '../../images';
// @ts-ignore
import DeviceInfo from 'react-native-device-info';
import ActionSheet, { ActionSheetItem } from '../../common/component/actionSheet';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import {
  PickAudio,
  PickImage,
  PickPDF,
} from '../../common/component/filePicker/filePicker';
import Text from '../../common/component/Text';
import { No_Internet_Warning, ToastMessage } from '../../common/component/Toast';
import {
  Colors,
  ConsoleType,
  encode_utf8,
  GenerateRandomID,
  showConsoleLog,
  TimeStampMilliSeconds,
} from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import { createNew } from '../createMemory';
import { CreateUpdateMemory } from '../createMemory/createMemoryWebService';
import {
  DefaultDetailsMemory,
  DefaultDetailsWithoutTitleMemory,
} from '../createMemory/dataHelper';
import { TempFile } from '../mindPop/edit';
import {
  addEditMindPop,
  kMindPopUploadedIdentifier,
} from '../mindPop/edit/addMindPopflow';
// import DefaultPreference from 'react-native-default-preference';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { connect } from 'react-redux';
import CustomAlert from '../../common/component/customeAlert';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import CreateMemoryIntro from '../createMemory/createMemoryIntro';
import { showCustomAlert, showCustomAlertData } from '../createMemory/reducer';
import style from './styles';

const ImageActions: Array<ActionSheetItem> = [
  { index: 0, text: 'Image', image: action_camera },
  { index: 1, text: 'Audio', image: action_audio },
  { index: 2, text: 'PDF', image: action_pdf },
  { index: 3, text: 'Cancel', image: action_close },
];

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const AddContentDetails = props => {
  const _actionSheet = useRef(null);
  let draftDetails = DefaultDetailsMemory('My memory');
  const inputRef = useRef(null);

  const [memoryIntroVisibility, setMemoryIntroVisibility] = useState(false);
  const [files, setFiles]: any[] = useState([]);
  const [bottomBar, setBottomBar] = useState({
    keyboardVisible: false,
    bottom: 0,
  });
  const [actionSheet, setActionSheet] = useState({
    type: 'none',
    list: ImageActions,
  });

  const [content, setContent] = useState('');
  const [showNextDialog, setShowNextDialog] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [placeholder, setPlaceholder] = useState('|Tap to start writing...');

  useEffect(() => {
    // DefaultPreference.get('hide_memory_intro').then((value: any) => {
    //   if (value == 'true') {
    //     setMemoryIntroVisibility(false);
    //   } else {
    //     setMemoryIntroVisibility(true);
    //   }
    // });
    // const keyboardDidShowListener = Keyboard.addListener(
    //   Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
    //   _keyboardDidShow,
    // );
    // const keyboardDidHideListener = Keyboard.addListener(
    //   Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
    //   _keyboardDidHide,
    // );
    // const mindPopCallback = EventManager.addListener(
    //   kMindPopUploadedIdentifier,
    //   mindPopUpdated,
    // );
    // const backListner = EventManager.addListener('hardwareBackPress', _onBack);
    // const createMemoryListener = EventManager.addListener(
    //   'addContentCreateMemory',
    //   createMemoryCallBack,
    // );

    return () => {
      // mindPopCallback.removeListener();
      // backListner.removeListener();
      // createMemoryListener.removeListener();
      // keyboardDidShowListener.remove();
      // keyboardDidHideListener.remove();
      props?.route?.params?.beforeBack && props?.route?.params?.beforeBack();
    };
  });

  const nextDialogView = () => {
    return (
      <CustomAlert
        modalVisible={true}
        title={'Save your memory'}
        message={
          'We always save your work, but you can choose to save writing this memory for later, or continue writing now.'
        }
        buttons={[
          {
            text: 'Save as Memory Draft',
            func: () => {
              ReactNativeHapticFeedback.trigger('impactMedium', options);
              createMemory();
            },
          },
          {
            text: 'Save as a MindPop',
            func: () => {
              setShowNextDialog(false);
              if (content != '') {
                ReactNativeHapticFeedback.trigger('impactMedium', options);
                saveMindPop();
              } else {
                ToastMessage('Title is mandatory');
                setTitleError('Title is mandatory');
              }
            },
          },
          {
            text: 'Cancel',
            func: () => {
              setShowNextDialog(false);
              props?.route?.params?.beforeBack &&
                props?.route?.params?.beforeBack();
              props?.navigation?.goBack();
            },
            styles: { fontWeight: '400' },
          },
        ]}
      />
    );
  };

  const createMemoryCallBack = (
    success: boolean,
    nid: any,
    padDetails: any,
  ) => {
    showConsoleLog(ConsoleType.WARN, 'in call back ::', success);
    loaderHandler.hideLoader();
    if (success) {
      props.navigation.replace('createMemory', {
        attachments: files,
        id: nid,
        textTitle: draftDetails.title,
        editMode: false,
        padDetails: padDetails,
        location: { description: '', reference: '' },
        memoryDate: draftDetails.memory_date,
        type: createNew,
      });
    } else {
      ToastMessage('Unable to create memory');
    }
  };

  const _onBack = () => {
    if (content.trim() != '' || files.length > 0) {
      Keyboard.dismiss();
      setTimeout(() => {
        Alert.alert('Save changes?', `Do you want to save your changes?`, [
          {
            text: 'No',
            style: 'cancel',
            onPress: () => {
              let textContent = content;
              setContent(textContent);
              Keyboard.dismiss();
              props.navigation.goBack();
            },
          },
          {
            text: 'Yes',
            style: 'default',
            onPress: () => {
              saveMemoryOrMindpop();
            },
          },
        ]);
      }, 10);
    } else {
      Keyboard.dismiss();
      props.navigation.goBack();
    }
  };

  const mindPopUpdated = (success: any) => {
    if (success) {
      props.showAlertCall(true);
      props.showAlertCallData({
        title: 'New MindPop saved!',
        desc: `See your new MindPop added with the rest of your in-progress work now.`,
      });
      props.navigation.replace('mindPop');
    } else {
      loaderHandler.hideLoader();
    }
  };

  const _keyboardDidShow = (e: any) => {
    setBottomBar({
      keyboardVisible: true,
      bottom: e.endCoordinates.height,
    });
  };

  const _keyboardDidHide = () => {
    setBottomBar({
      keyboardVisible: false,
      bottom: 0,
    });
  };

  const saveMemoryOrMindpop = () => {
    if (Utility.isInternetConnected) {
      Keyboard.dismiss();
      setShowNextDialog(true);
    } else {
      No_Internet_Warning();
    }
  };

  const createMemory = () => {
    setShowNextDialog(false);
    if (Utility.isInternetConnected) {
      if (content.trim() !== '') {
        draftDetails = DefaultDetailsWithoutTitleMemory(content);
      }
      loaderHandler.showLoader('Loading...');
      CreateUpdateMemory(
        draftDetails,
        [],
        'addContentCreateMemory',
        '',
        res => {
          showConsoleLog(ConsoleType.WARN, 'sadadadsd ::', res);
          if (res.status) {
            // createMemoryCallBack(res.status, res.id, res.padDetails);
            if (res.status) {
              props.navigation.replace('createMemory', {
                attachments: files,
                id: res.id,
                textTitle: draftDetails.title,
                editMode: false,
                padDetails: res.padDetails,
                location: { description: '', reference: '' },
                memoryDate: draftDetails.memory_date,
                type: createNew,
              });
            } else {
              ToastMessage('Unable to create memory');
            }
          }
        },
      );
    } else {
      No_Internet_Warning();
    }
  };

  const saveMindPop = () => {
    setShowNextDialog(false);
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
              contentValue: encode_utf8(content),
            },
          ],
        },
        configurationTimestamp: moment,
      };
      loaderHandler.showLoader('Saving...');
      addEditMindPop(req, files, true);
    } else {
      No_Internet_Warning();
    }
  };

  const fileCallback = (file: any) => {
    let tempfiles: any[] = [...files];
    file.forEach((element: any) => {
      tempfiles.push(element);
    });
    setFiles(tempfiles);
  };

  const audioAttachmentPress = (selectedItem?: any) => {
    Keyboard.dismiss();
    props.navigation.navigate('commonAudioRecorder', {
      mindPopID: 0,
      selectedItem: selectedItem ? selectedItem : null,
      hideDelete: true,
      editRefresh: (file: any[]) => {
        Keyboard.dismiss();
        let fid = GenerateRandomID();
        let tempFile: TempFile[] = file.map(obj => ({ ...obj, fid }));
        fileCallback(tempFile);
      },
      reset: () => { },
      deleteItem: () => { },
    });
  };

  const rowItemPressed = (file: any) => {
    Keyboard.dismiss();
    switch (file.type) {
      case 'audios':
        if (file.filesize != 0) {
          audioAttachmentPress(file);
        } else {
          ToastMessage('This audio file is corrupted', Colors.ErrorColor);
        }
        break;
      case 'files':
        props.navigation.navigate('pdfViewer', { file: file });
        break;
      case 'images':
        props.navigation.navigate('imageViewer', {
          files: [{ url: file.thumb_uri }],
          hideDescription: true,
        });
        break;
    }
  };

  const onActionItemClicked = (index: number): void => {
    Keyboard.dismiss();
    let file: any = {};
    switch (index) {
      case 0:
        file = PickImage(fileCallback);
        break;
      case 1:
        file = PickAudio(fileCallback);
        break;
      case 2:
        file = PickPDF(fileCallback);
        break;
    }
  };

  const removeFile = (fid: any) => {
    let tempFiles = [...files];
    tempFiles = tempFiles.filter((element: any) => element.fid != fid);
    setFiles(tempFiles);
  };

  const _renderRow = (element: any, width: any) => {
    return (
      <TouchableHighlight
        onPress={() => rowItemPressed(element)}
        underlayColor={Colors.touchableunderlayColor}
        key={element.fid}
        style={style.padding15}>
        <View>
          <View style={[style.RecordContainer, { width }]}>
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
                source={{ uri: element.thumb_uri }}
                style={{ width: width, height: 120 }}
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
            onPress={() => removeFile(element.fid)}
            style={style.deletefileContainer}>
            <View style={style.deletefileSubContainer}>
              <Text style={style.crossTextStyle}>{'✕'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableHighlight>
    );
  };

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
          inputRef?.current?.focus();
        }}>
        <View style={style.container}>
          <NavigationHeaderSafeArea
            height="120"
            heading={''}
            showCommunity={false}
            cancelAction={saveMemoryOrMindpop}
            showRightText={content.length ? true : false}
            isWhite={true}
            rightText={'Save'}
            saveValues={saveMemoryOrMindpop}
            backIcon={action_close}
          />
          <TouchableWithoutFeedback
            onPress={() => {
              // this.setState({
              //   showNextDialog: true
              // })
            }}
            style={style.fullWidth}>
            <View style={style.fullFlex}>
              <View style={style.inputContainer}>
                <>
                  <TextInput
                    placeholder={placeholder}
                    autoFocus={false}
                    ref={inputRef}
                    onChangeText={text => {
                      setContent(text);
                      setTitleError('');
                    }}
                    onFocus={() => {
                      setPlaceholder('Start writing...');
                    }}
                    placeholderTextColor={Colors.bordercolor}
                    value={content}
                    multiline={true}
                    style={style.textInputStyle}
                  />
                  {titleError != '' && (
                    <Text style={style.titleError}>{titleError}</Text>
                  )}
                </>
              </View>
              {files.length > 0 ? (
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
                          bottomBar.bottom > 0
                            ? bottomBar.bottom -
                            (Platform.OS == 'android' ? 230 : 160)
                            : 120,
                      },
                    ]}
                    data={files}
                    renderItem={(item: any) => _renderRow(item.item, 180)}
                  />
                </View>
              ) : (
                <View
                  style={{
                    width: '100%',
                    height:
                      Platform.OS == 'android'
                        ? 0
                        : bottomBar.bottom == 0
                          ? 130
                          : bottomBar.bottom,
                  }}></View>
              )}
            </View>
          </TouchableWithoutFeedback>
          {showNextDialog && nextDialogView()}
          <ActionSheet
            ref={_actionSheet}
            width={DeviceInfo.isTablet() ? '65%' : '100%'}
            actions={actionSheet?.list}
            onActionClick={onActionItemClicked}
          />
          <View style={style.emptyView}></View>
        </View>
      </TouchableWithoutFeedback>

      {memoryIntroVisibility && (
        <CreateMemoryIntro
          cancelMemoryIntro={() => {
            setMemoryIntroVisibility(false);
            // DefaultPreference.set('hide_memory_intro', 'true').then(
            //   function () {},
            // );
          }}></CreateMemoryIntro>
      )}
    </SafeAreaView>
  );
};

const mapState = (state: { [x: string]: any }) => ({
  showAlert: state.MemoryInitials.showAlert,
});

const mapDispatch = (dispatch: Function) => {
  return {
    showAlertCall: (payload: any) =>
      dispatch({ type: showCustomAlert, payload: payload }),
    showAlertCallData: (payload: any) =>
      dispatch({ type: showCustomAlertData, payload: payload }),
  };
};
export default connect(mapState, mapDispatch)(AddContentDetails);
