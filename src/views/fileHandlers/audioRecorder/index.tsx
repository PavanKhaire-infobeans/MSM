import React from 'react';
import {
  AppState,
  AppStateStatus,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  Slider,
  StatusBar,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Text from '../../../common/component/Text';
import {
  Colors,
  ConsoleType,
  fontSize,
  getValue,
  requestPermission,
  showConsoleLog,
  Size,
  validFileName,
} from '../../../common/constants';
import {Player, Recorder} from '@react-native-community/audio-toolkit';
import MainView from '../../../common/component/audio_anim';
import {audio_pause, audio_play, recordStart, rubbish} from '../../../images';
import SoundRecorder, {
  ENCODER_AAC,
  ENCODER_HE_AAC,
  FORMAT_MPEG4AAC,
} from 'react-native-sound-recorder';
import {FileType} from '../../../common/database/mindPopStore/mindPopStore';
import Styles from './styles';

type AudioState =
  | 'none'
  | 'recording'
  | 'record-pause'
  | 'playing'
  | 'paused'
  | 'recorded';

type State = {
  time: string;
  audioState: AudioState;
  path?: string;
  modalVisible: boolean;
  changedName: string;
  sliderValue: number;
  error: {errMsg: string; show: boolean};
};

type Props = {
  mindPopID: number | string;
  deleteItem?: Function;
  reset?: Function;
  selectedItem?: {uri: string; [x: string]: any};
  editRefresh: (data: {[x: string]: any}[]) => void;
  recordingFromAddContent?: boolean;
  hideDelete?: boolean;
};

type Upload = {uploadTask: Function};

export default class CommonAudioRecorder extends React.Component<
  Props & Upload,
  {} | State
> {
  state = {
    time: '00:00',
    totalTime: 0,
    audioState: 'none',
    sliderValue: 0,
    path: '',
    modalVisible: false,
    changedName: '',
    error: {
      errMsg: '',
      show: false,
    },
  };

  processing = false;

  recorder?: Recorder = null;
  player?: Player = null;
  recording?: string = null;
  isRecordingFromAddContent: boolean = false;
  constructor(props: Props & Upload) {
    super(props);
    this.isRecordingFromAddContent = this.props.recordingFromAddContent
      ? true
      : false;
    AppState.addEventListener('change', this.isBackground);
    this.state = {
      ...this.state,
      time: '00:00',
      totalTime: 0,
      sliderValue: 0,
      modalVisible: false,
      changedName: '',
      error: {errMsg: '', show: false},
    };
    if (this.props.selectedItem) {
      this.state = {
        ...this.state,
        audioState: 'recorded',
        path: this.props.selectedItem.uri || this.props.selectedItem.filePath,
      };
    } else {
      this.state = {...this.state, audioState: 'none', path: ''};
    }
  }

  componentDidMount = () => {};

  isBackground = (state: AppStateStatus) => {
    if (state == 'background') {
      if (this.player && this.player.isPlaying) {
        this.processing = false;
        this.player.pause();
        this.setState({audioState: 'paused'});
      }
    } else {
      if (state == 'active') {
        // this.setState({});
      }
    }
  };

  back = () => {
    this.isRecordingFromAddContent
      ? this.navigateBackOrReset()
      : this.props.navigation.goBack();
  };

  navigateBackOrReset = () => {
    // {this.state.audioState !== "none" && this.state.audioState !== "recording" && this.state.audioState !== "record-pause" ? (
    this.setState({
      time: '00:00',
      totalTime: 0,
      audioState: 'none',
      sliderValue: 0,
      path: '',
      modalVisible: false,
      changedName: '',
      error: {
        errMsg: '',
        show: false,
      },
    });
    // ) : this.props.navigation.popTo("addContent")}
  };

  /**
   * Set time while User is recording
   * Gets called recursively
   */
  time = () => {
    if (this.processing) {
      const [min, sec] = this.state.time.split(':');
      let minInt = parseInt(min);
      let secInt = parseInt(sec);
      if (secInt == 59) {
        secInt = 0;
        minInt++;
      } else {
        secInt++;
      }
      this.setState({
        totalTime: this.state.totalTime + 1,
        time: `${minInt < 10 ? 0 : ''}${minInt}:${
          secInt < 10 ? 0 : ''
        }${secInt}`,
      });
      setTimeout(this.time, 1000);
    }
  };

  /**
   * Shows calculated time while playing the track
   */
  playTime = () => {
    if (this.processing) {
      let playTime = parseInt(`${parseFloat(this.player.currentTime) / 1000}`);
      let minInt = parseInt(`${parseInt(`${playTime}`) / 60}`);
      let secInt = parseInt(`${playTime}`) % 60;
      if (secInt == 59) {
        secInt = 0;
        minInt++;
      } else {
        secInt++;
      }
      if (this.player.isStopped) {
        this.processing = false;
        secInt = 0;
      }

      let sliderValue =
        (parseFloat(`${playTime}`) * 1000) / this.state.totalTime;
      this.setState({
        audioState: this.processing ? 'playing' : 'recorded',
        sliderValue:
          this.player.currentTime > 0
            ? this.state.sliderValue > sliderValue
              ? this.state.sliderValue
              : sliderValue
            : 0,
        time: `${minInt < 10 ? 0 : ''}${minInt}:${
          secInt < 10 ? 0 : ''
        }${secInt}`,
      });
      setTimeout(() => this.playTime(), 1000);
    }
  };

  /**
   * Performs and manages audio recording to playing tasks
   * According to state of player
   */
  audioActions = () => {
    if (this.state.audioState == 'none') {
      let today = new Date();
      this.recording = `Rec${
        today.getMonth() +
        1 +
        '' +
        today.getFullYear() +
        '' +
        today.getDate() +
        today.getHours() +
        '' +
        today.getMinutes() +
        '' +
        today.getSeconds()
      }.m4a`;

      requestPermission('microphone').then(success => {
        if (success) {
          let path = SoundRecorder.PATH_CACHE + `/${this.recording}`;
          var options: {[key: string]: any} = {
            format: Platform.OS == 'ios' ? FORMAT_MPEG4AAC : ENCODER_HE_AAC,
          };
          if (Platform.OS == 'android') {
            options = {...options, encoder: ENCODER_AAC};
          }
          SoundRecorder.start(path, options)
            .then(() => {
              this.processing = true;
              this.setState({path, audioState: 'recording'}, () => {
                this.time();
              });
            })
            .catch((err: Error) => {
              showConsoleLog(ConsoleType.LOG, 'Error', err);
            });
          // this.recorder = new Recorder(this.recording);
          // this.recorder.prepare((error: any, path: string) => {
          // 	if (error && error.err) {
          // 		ToastMessage(error.message, '#DE1616')
          // 		return;
          // 	}
          // 	this.setState({ path });
          // 	this.recorder.record(() => {
          // 		this.processing = true;
          // 		this.setState({ audioState: "recording" });
          // 		this.time();
          // 	});
          // });
        }
      });
    } else if (this.state.audioState == 'recording') {
      // if (Platform.OS == "android" && DeviceInfo.getAPILevel() < 24) {
      // 	SoundRecorder.stop().then((result: { path: string; duration: number }) => {
      // 		this.processing = false;
      // 		this.setState({ audioState: "recorded", path: result.path, totalTime: result.duration });
      // 		// this.recorder && this.recorder.destroy && this.recorder.destroy();
      // 	});
      // } else {
      SoundRecorder.pause().then(() => {
        this.processing = false;
        this.setState({audioState: 'record-pause'});
      });
      // }
      // this.recorder = null;
      // this.recorder.stop(() => {
      // 	this.processing = false;
      // 	this.setState({ audioState: "recorded" });
      // 	this.recorder && this.recorder.destroy && this.recorder.destroy();
      // 	this.recorder = null;
      // });
    } else if (this.state.audioState == 'record-pause') {
      SoundRecorder.resume().then(() => {
        this.processing = true;
        this.setState({audioState: 'recording'}),
          () => {
            this.time();
          };
      });
    } else {
      if (this.state.audioState == 'recorded') {
        let path = this.state.path;
        if (this.recording || path) {
          if (path.indexOf('https://') == -1 && path.indexOf('file://') == -1) {
            path = 'file://' + path;
          }
          this.player = new Player(path);
          this.player.volume = 0.5;

          this.player.prepare(() => {
            this.player.play(() => {
              this.seek();
              this.processing = true;
              this.setState(
                {
                  time: this.state.time != '00:00' ? this.state.time : '00:00',
                  audioState: 'playing',
                },
                () => {
                  this.playTime();
                },
              );
            });
          });
        }
      } else if (this.state.audioState == 'playing') {
        this.player.pause(() => {
          this.processing = false;
          this.setState({audioState: 'paused'}, () => {
            this.playTime();
          });
        });
      } else if (this.state.audioState == 'paused') {
        if (!this.props.selectedItem) {
          this.seek();
        }
        this.player.play(() => {
          this.processing = true;
          this.setState({audioState: 'playing'}, () => {
            this.playTime();
          });
        });
      }
    }
  };

  /**
   * Sets player title according to recorder/player states
   */
  get buttonTitle(): string {
    switch (this.state.audioState) {
      case 'none':
        return 'Record';
      case 'recording':
        // return Platform.OS == "android" && DeviceInfo.getAPILevel() < 24 ? "Stop" : "Pause";
        return 'Pause';
      case 'recorded':
        return 'Play';
      case 'paused':
      case 'record-pause':
        return 'Resume';
      case 'playing':
        return 'Pause';
    }
  }

  componentWillUnmount() {
    /**
     * Reset player before exiting player
     */
    this.processing = false;
    SoundRecorder.stop();
    AppState.removeEventListener('change', this.isBackground);
    this.recorder && this.recorder.destroy && this.recorder.destroy();
    this.player && this.player.destroy && this.player.destroy();
  }

  /**
   * Sets player image according to recorder/player states
   */
  get buttonImage(): object {
    switch (this.state.audioState) {
      case 'none':
      case 'record-pause':
        return recordStart;
      case 'recording':
        // return Platform.OS == "android" && DeviceInfo.getAPILevel() < 24 ? audio_stop : audio_pause;
        return audio_pause;
      case 'recorded':
        return audio_play;
      case 'paused':
        return audio_play;
      case 'playing':
        return audio_pause;
    }
  }
  /**
   * Seek player at position of slider
   */
  seek = () => {
    if (!this.player) {
      let path = this.state.path;
      if (path.indexOf('https://') == -1 && path.indexOf('file://') == -1) {
        path = 'file://' + path;
      }
      this.player = new Player(path);
    }
    if (this.player && this.state.sliderValue > 0) {
      let timeVal = this.state.totalTime * this.state.sliderValue;
      if (this.player.isPlaying) {
        this.player.seek(parseInt(`${timeVal}`), () => {
          let playTime = parseInt(`${this.player.currentTime / 1000}`);
          this.setPlayTime(playTime);
        });
      } else {
        let playTime = parseInt(`${timeVal / 1000}`);
        this.setPlayTime(playTime);
      }
    }
  };

  setPlayTime = (playTime: number) => {
    let minInt = parseInt(`${parseInt(`${playTime}`) / 60}`),
      secInt = parseInt(`${playTime}`) % 60;
    this.setState({
      time: `${minInt < 10 ? 0 : ''}${minInt}:${secInt < 10 ? 0 : ''}${secInt}`,
    });
  };

  openModal = () => {
    this.setState({
      modalVisible: true,
      changedName: this.recording.split('.')[0],
    });
  };

  /**
   * Upload recorded audio
   */
  uploadAudio = () => {
    if (this.state.changedName.length == 0) {
      this.setState({error: {errMsg: 'No name entered', show: true}});
      return;
    }
    if (!validFileName(this.state.changedName)) {
      this.setState({
        error: {
          errMsg: "Only alphanumeric characters & '-' is allowed",
          show: true,
        },
      });
      return;
    }

    this.setState({modalVisible: false}, () => {
      let timeVal = this.state.totalTime / 1000;
      let minInt = parseInt(`${parseInt(`${timeVal}`) / 60}`),
        secInt = parseInt(`${timeVal}`) % 60;
      this.props.editRefresh([
        {
          filePath: this.state.path,
          isLocal: true,
          filename: `${this.state.changedName}.${this.recording.split('.')[1]}`,
          type: `${FileType[FileType.audio]}s`,
          time: `time1-${minInt < 10 ? 0 : ''}${minInt}:${
            secInt < 10 ? 0 : ''
          }${secInt}`,
        },
      ]);
      this.props.navigation.goBack();
    });
  };

  render() {
    return (
      <SafeAreaView
        style={[
          Styles.container,
          {
            backgroundColor: !this.props.selectedItem
              ? Colors.white
              : Colors.SerachbarColor,
          },
        ]}>
        <View style={Styles.ViewFullContainer} />
        <StatusBar barStyle="dark-content" />
        {DeviceInfo.isTablet() && !this.props.selectedItem ? (
          <TouchableOpacity
            disabled={
              this.state.audioState == 'recording' ||
              this.state.audioState == 'record-pause'
            }
            onPress={() => this.back()}
            style={Styles.cancelContainer}>
            <Text style={Styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        ) : null}
        <View style={Styles.containerStyle}>
          <View style={Styles.sliderContainer}>
            {(this.state.audioState == 'recorded' ||
              this.state.audioState == 'playing' ||
              this.state.audioState == 'paused') &&
            !this.props.selectedItem ? (
              <Slider
                value={this.state.sliderValue}
                minimumTrackTintColor={Colors.ThemeColor}
                maximumTrackTintColor={'#909090'}
                thumbImage={require('../../../images/audio_kit/thumb.png')}
                style={Styles.SliderStyle}
                onValueChange={(value: number) => {
                  this.setState({sliderValue: value});
                }}
                onSlidingComplete={() => {
                  this.seek();
                }}
              />
            ) : (
              <MainView
                play={this.state.audioState == 'recording'}
                style={Styles.recordingStyle}
              />
            )}
          </View>
          <View style={Styles.timeContainer}>
            <Text style={Styles.timeTextStyle}>{this.state.time}</Text>
            <TouchableHighlight
              onPress={this.audioActions}
              underlayColor={`${Colors.ThemeColor}ae`}
              style={[
                Styles.buttonActionContainer,
                {
                  backgroundColor:
                    this.state.audioState == 'recording'
                      ? Colors.NewRadColor
                      : this.state.audioState == 'playing'
                      ? Colors.NewRadColor
                      : Colors.ThemeColor,
                },
              ]}>
              <View style={Styles.recordImageContainer}>
                <View
                  style={[
                    Styles.recordImageSubContainer,
                    {
                      paddingLeft:
                        this.state.audioState == 'recorded' ||
                        this.state.audioState == 'paused'
                          ? 10
                          : 0,
                    },
                  ]}>
                  <Image source={this.buttonImage} />
                </View>
                <Text style={Styles.buttonTitleStyle}>{this.buttonTitle}</Text>
              </View>
            </TouchableHighlight>
          </View>
          {this.props.selectedItem ? null : (
            <View
              style={[
                Styles.selectedItemContainer,
                {
                  justifyContent: DeviceInfo.isTablet()
                    ? 'center'
                    : this.state.audioState !== 'none' &&
                      this.state.audioState !== 'recording' &&
                      this.state.audioState !== 'record-pause'
                    ? 'space-around'
                    : 'center',
                },
              ]}>
              {/** If Device is not tablet or state is recording */}
              {!DeviceInfo.isTablet() ||
              this.state.audioState == 'recording' ||
              this.state.audioState == 'record-pause' ? (
                <TouchableOpacity
                  style={Styles.SoundRecorderContainer}
                  onPress={
                    this.state.audioState == 'recording' ||
                    this.state.audioState == 'record-pause'
                      ? () => {
                          SoundRecorder.stop().then(
                            (result: {path: string; duration: number}) => {
                              this.processing = false;
                              this.setState({
                                audioState: 'recorded',
                                path: result.path,
                                totalTime: result.duration,
                              });
                              //this.recorder && this.recorder.destroy && this.recorder.destroy();
                            },
                          );
                        }
                      : () => this.back()
                  }>
                  <Text
                    style={{
                      ...fontSize(24),
                      color:
                        this.state.audioState == 'recording'
                          ? Colors.NewYellowColor
                          : Colors.newTextColor,
                    }}>
                    {this.state.audioState == 'recording' ||
                    this.state.audioState == 'record-pause'
                      ? 'Done'
                      : 'Cancel'}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {this.state.audioState !== 'none' &&
              this.state.audioState !== 'recording' &&
              this.state.audioState !== 'record-pause' ? (
                <TouchableOpacity
                  onPress={this.openModal}
                  style={Styles.SoundRecorderContainer}>
                  <Text style={Styles.savetextStyle}>Save</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>
        {this.props.selectedItem ? (
          <View
            style={[
              Styles.selectedRecordItemContainer,
              {
                justifyContent: getValue(this.props.selectedItem, ['isLocal'])
                  ? 'flex-end'
                  : 'space-between',
              },
            ]}>
            {!getValue(this.props.selectedItem, ['isLocal']) ? (
              <TouchableOpacity
                onPress={() => {
                  this.props.deleteItem();
                  this.props.navigation.goBack();
                }}
                style={Styles.selectedRecordItemButton}>
                <Image source={rubbish} resizeMode="contain" />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
                this.props.reset();
              }}
              style={Styles.closeContainer}>
              <Text style={Styles.cancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <Modal
          transparent={true}
          animationType="slide"
          onRequestClose={() => {}}
          presentationStyle="overFullScreen"
          visible={this.state.modalVisible}>
          <View style={Styles.modalContainer}>
            <View style={Styles.modalSubContainer}>
              <View style={Styles.SaveAsContainer}>
                <Text style={Styles.buttonTitleStyle}>Save as</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      modalVisible: false,
                      error: {errMsg: '', show: false},
                    });
                  }}
                  style={Styles.cancelButton}>
                  <Text style={Styles.crossText}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={Styles.textInputContainer}>
                <View style={Styles.textInputSubContainer}>
                  <TextInput
                    style={Styles.textInputStyle}
                    placeholder="File name"
                    returnKeyType="send"
                    keyboardType="ascii-capable"
                    value={this.state.changedName}
                    onChangeText={(text: string) => {
                      this.setState({
                        changedName: text,
                        error: {errMsg: '', show: false},
                      });
                    }}
                  />
                  {this.state.error.show ? (
                    <View style={Styles.errorContainer}>
                      <Text numberOfLines={2} style={Styles.errortextStyle}>
                        {'*' + this.state.error.errMsg}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <View style={Styles.recordingContainer}>
                  <Text style={Styles.recordingText}>
                    {this.recording ? this.recording.split('.')[1] : ''}
                  </Text>
                </View>
              </View>
              <View style={Styles.saveContainer}>
                <TouchableOpacity
                  style={Styles.saveButton}
                  onPress={() => {
                    this.uploadAudio();
                  }}>
                  <Text style={Styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
  // state = {
  // 	time: "00:00",
  // 	totalTime: 0,
  // 	audioState: "none",
  // 	sliderValue: 0,
  // 	path: "",
  // 	modalVisible: false,
  // 	changedName: "",
  // 	error: {
  // 		errMsg: "",
  // 		show: false
  // 	}
  // };

  // processing = false;
  // recorder?: Recorder = null;
  // player?: Player = null;
  // recording?: string = null;

  // constructor(props: Props & Upload) {
  // 	super(props);
  // 	AppState.addEventListener("change", this.isBackground);
  // 	if (this.props.selectedItem) {
  // 		this.state = { ...this.state, audioState: "recorded", path: this.props.selectedItem.uri || this.props.selectedItem.url || this.props.selectedItem.filePath };
  // 	}
  // }

  // isBackground = (state: AppStateStatus) => {
  // 	if (state == "background") {
  // 		if (this.player && this.player.isPlaying) {
  // 			this.processing = false;
  // 			this.player.pause();
  // 			this.setState({ audioState: "paused" });
  // 		}
  // 	} else {
  // 		if (state == "active") {
  // 			this.setState({});
  // 		}
  // 	}
  // }

  // navigateBackOrReset = () =>{
  // 	{this.state.audioState !== "none"
  // 		&& this.state.audioState !== "recording"
  // 		&& this.state.audioState !== "record-pause" && this.state.audioState !== "playing"? (
  // 			this.setState({
  // 				time: "00:00",
  // 				totalTime: 0,
  // 				audioState: "none",
  // 				sliderValue: 0,
  // 				path: "",
  // 				modalVisible: false,
  // 				changedName: "",
  // 				error: {
  // 					errMsg: "",
  // 					show: false
  // 				}
  // 			})
  // 		) :
  // 		this.state.audioState == "playing" ?
  // 				this.player.pause(() => {
  // 					this.processing = false;
  // 					// this.setState({ audioState: "none" }, () => {
  // 					// 	this.playTime();
  // 					// });
  // 					this.setState({
  // 						time: "00:00",
  // 						totalTime: 0,
  // 						audioState: "none",
  // 						sliderValue: 0,
  // 						path: "",
  // 						modalVisible: false,
  // 						changedName: "",
  // 						error: {
  // 							errMsg: "",
  // 							show: false
  // 						}
  // 					})
  // 				})
  // 			:
  // 			Keyboard.dismiss();
  // 			this.props.navigation.goBack();

  // 		}

  // }

  // /**
  //  * Set time while User is recording
  //  * Gets called recursively
  //  */
  // time = () => {
  // 	if (this.processing) {
  // 		const [min, sec] = this.state.time.split(":");
  // 		let minInt = parseInt(min);
  // 		let secInt = parseInt(sec);
  // 		if (secInt == 59) {
  // 			secInt = 0;
  // 			minInt++;
  // 		} else {
  // 			secInt++;
  // 		}
  // 		this.setState({ totalTime: this.state.totalTime + 1, time: `${minInt < 10 ? 0 : ""}${minInt}:${secInt < 10 ? 0 : ""}${secInt}` });
  // 		setTimeout(this.time, 1000);
  // 	}
  // };

  // /**
  //  * Shows calculated time while playing the track
  //  */
  // playTime = () => {
  // 	if (this.processing) {
  // 		let playTime = parseInt(`${parseFloat(this.player.currentTime) / 1000}`);
  // 		let minInt = parseInt(`${parseInt(`${playTime}`) / 60}`);
  // 		let secInt = parseInt(`${playTime}`) % 60;
  // 		if (secInt == 59) {
  // 			secInt = 0;
  // 			minInt++;
  // 		} else {
  // 			secInt++;
  // 		}
  // 		if (this.player.isStopped) {
  // 			this.processing = false;
  // 			secInt = 0;
  // 		}

  // 		let sliderValue = (parseFloat(`${playTime}`) * 1000) / this.state.totalTime;
  // 		this.setState({
  // 			audioState: this.processing ? "playing" : "recorded",
  // 			sliderValue: this.player.currentTime > 0 ? (this.state.sliderValue > sliderValue ? this.state.sliderValue : sliderValue) : 0,
  // 			time: `${minInt < 10 ? 0 : ""}${minInt}:${secInt < 10 ? 0 : ""}${secInt}`
  // 		});
  // 		setTimeout(() => this.playTime(), 1000);
  // 	}
  // };

  // /**
  //  * Performs and manages audio recording to playing tasks
  //  * According to state of player
  //  */
  // audioActions = () => {
  // 	if (this.state.audioState == "none") {
  // 		let today = new Date();
  // 		this.recording = `Rec${(today.getMonth() + 1) + "" + today.getFullYear() + "" + today.getDate() + "" + today.getHours() + "" + today.getMinutes() + "" + today.getSeconds()}.m4a`;

  // 		requestPermission("microphone").then(success => {
  // 			if (success) {
  // 				let path = SoundRecorder.PATH_CACHE + `/${this.recording}`;
  // 				var options: { [key: string]: any } = { format: Platform.OS == "ios" ? FORMAT_MPEG4AAC : ENCODER_HE_AAC }
  // 				if (Platform.OS == "android") {
  // 					options = { ...options, encoder: ENCODER_AAC }
  // 				}
  // 				SoundRecorder.start(path, options)
  // 					.then(() => {
  // 						this.processing = true;
  // 						this.setState({ path, audioState: "recording" });
  // 						this.time();
  // 					})
  // 					.catch((err: Error) => {
  // 						//showConsoleLog(ConsoleType.LOG,"Error", err);
  // 					});
  // 				}
  // 		});
  // 	} else if (this.state.audioState == "recording") {
  // 		if (Platform.OS == "android"){
  // 		// 	DeviceInfo.getApiLevel().then(apiLevel => {
  // 		// 		if(apiLevel < 24){
  // 		// 			SoundRecorder.stop().then((result: { path: string; duration: number }) => {
  // 		// 				this.processing = false;
  // 		// 				this.setState({ audioState: "recorded", path: result.path, totalTime: result.duration });
  // 		// 			});
  // 		// 		} else{
  // 		// 			SoundRecorder.pause().then(() => {
  // 		// 				this.processing = false;
  // 		// 				this.setState({ audioState: "record-pause" });
  // 		// 			});
  // 		// 		}},
  // 		// 		(err)=>{
  // 		// 			SoundRecorder.pause().then(() => {
  // 		// 				this.processing = false;
  // 		// 				this.setState({ audioState: "record-pause" });
  // 		// 			});
  // 		// 		}
  // 		// 		);
  // 		// } else {
  // 			SoundRecorder.pause().then(() => {
  // 				this.processing = false;
  // 				this.setState({ audioState: "record-pause" });
  // 			});
  // 		}
  // 	} else if (this.state.audioState == "record-pause") {
  // 		SoundRecorder.resume().then(() => {
  // 			this.processing = true;
  // 			this.setState({ audioState: "recording" });
  // 			this.time();
  // 		});
  // 	} else {
  // 		if (this.state.audioState == "recorded") {
  // 			let path = this.state.path;
  // 			if (this.recording || path) {
  // 				if (path.indexOf("https://") == -1 && path.indexOf("file://") == -1) {
  // 					path = "file://" + path;
  // 				}else{
  // 					if(!Utility.isInternetConnected){
  // 						No_Internet_Warning();
  // 						return;
  // 					}
  // 				}
  // 				// let encodedPath = decode_utf8(path);
  // 				// this.player = new Player(encode_utf8(encodedPath));
  // 				// if(path.indexOf("file://") == -1){
  //                 //     this.player = new Player(encode_utf8(path));
  // 				// } else {
  // 				this.player = new Player(path);
  // 				// }
  // 				// this.player = new Player(path);
  // 				this.player.volume = 0.5;

  // 				this.player.prepare(() => {
  // 					this.player.play(() => {
  // 						this.seek();
  // 						this.processing = true;
  // 						this.setState({ time: this.state.time != "00:00" ? this.state.time : "00:00", audioState: "playing" }, () => {
  // 							this.playTime();
  // 						});
  // 					}, (err: any) =>
  // 						{
  // 							showConsoleLog(ConsoleType.LOG,"Error is : ", err)
  // 						}
  // 					);
  // 				});
  // 			}
  // 		} else if (this.state.audioState == "playing") {
  // 			this.player.pause(() => {
  // 				this.processing = false;
  // 				this.setState({ audioState: "paused" }, () => {
  // 					this.playTime();
  // 				});
  // 			});
  // 		} else if (this.state.audioState == "paused") {
  // 			if (!this.props.selectedItem) {
  // 				this.seek();
  // 			}
  // 			this.player.play(() => {
  // 				this.processing = true;
  // 				this.setState({ audioState: "playing" }, () => {
  // 					this.playTime();
  // 				});
  // 			});
  // 		}
  // 	}
  // };

  // /**
  //  * Sets player title according to recorder/player states
  //  */
  // get buttonTitle(): string {
  // 	switch (this.state.audioState) {
  // 		case "none":
  // 			return "Record";
  // 		case "recording":
  // 				// if(Platform.OS=="android"){
  // 				// 	DeviceInfo.getApiLevel().then(apiLevel => {
  // 				// 		if(apiLevel < 24){
  // 				// 			return "Stop";
  // 				// 		} else{
  // 				// 			return "Pause";
  // 				// 		}
  // 				// 	}, (err : any) => {
  // 				// 		return "Pause";
  // 				// 	});
  // 				// } else{
  // 					return "Pause";
  // 				// }
  // 		case "recorded":
  // 			return "Play";
  // 		case "paused":
  // 		case "record-pause":
  // 			return "Resume";
  // 		case "playing":
  // 			return "Pause";
  // 	}
  // }

  // componentWillUnmount() {
  // 	/**
  // 	 * Reset player before exiting player
  // 	 */
  // 	this.processing = false;
  // 	AppState.removeEventListener("change", this.isBackground);
  // 	this.recorder && this.recorder.destroy && this.recorder.destroy();
  // 	this.player && this.player.destroy && this.player.destroy();
  // }

  // /**
  //  * Sets player image according to recorder/player states
  //  */
  // get buttonImage(): object {
  // 	switch (this.state.audioState) {
  // 		case "none":
  // 		case "record-pause":
  // 			return recordStart;
  // 		case "recording":
  // 			// if(Platform.OS=="android"){
  // 			// 	DeviceInfo.getApiLevel().then(apiLevel => {
  // 			// 		if(apiLevel < 24){
  // 			// 			return audio_stop;
  // 			// 		} else{
  // 			// 			return audio_pause;
  // 			// 		}
  // 			// 	}, (err : any) => {
  // 			// 		return audio_pause;
  // 			// 	});
  // 			// } else{
  // 				return audio_pause;
  // 			// }
  // 		case "recorded":
  // 			return audio_play;
  // 		case "paused":
  // 			return audio_play;
  // 		case "playing":
  // 			return audio_pause;
  // 	}
  // }
  // /**
  //  * Seek player at position of slider
  //  */
  // seek = () => {
  // 	if (!this.player) {
  // 		let path = this.state.path;
  // 		if (path.indexOf("https://") == -1 && path.indexOf("file://") == -1) {
  // 			path = "file://" + path;
  // 		}else{
  // 			if(!Utility.isInternetConnected){
  // 				No_Internet_Warning();
  // 				return;
  // 			}
  // 		}
  // 		this.player = new Player(path);
  // 	}
  // 	if (this.player && this.state.sliderValue > 0) {
  // 		let timeVal = this.state.totalTime * this.state.sliderValue;
  // 		if (this.player.isPlaying) {
  // 			this.player.seek(parseInt(`${timeVal}`), () => {
  // 				let playTime = parseInt(`${this.player.currentTime / 1000}`);
  // 				this.setPlayTime(playTime);
  // 			});
  // 		} else {
  // 			let playTime = parseInt(`${timeVal / 1000}`);
  // 			this.setPlayTime(playTime);
  // 		}
  // 	}
  // };

  // setPlayTime = (playTime: number) => {
  // 	let minInt = parseInt(`${parseInt(`${playTime}`) / 60}`),
  // 		secInt = parseInt(`${playTime}`) % 60;
  // 	this.setState({ time: `${minInt < 10 ? 0 : ""}${minInt}:${secInt < 10 ? 0 : ""}${secInt}` });
  // };

  // openModal = () => {
  // 	this.setState({ modalVisible: true, changedName: this.recording.split(".")[0] });
  // };

  // /**
  //  * Upload recorded audio
  //  */
  // uploadAudio = () => {
  // 	if (this.state.changedName.length == 0) {
  // 		this.setState({ error: { errMsg: "No name entered", show: true } });
  // 		return;
  // 	}
  // 	if (!validFileName(this.state.changedName)) {
  // 		this.setState({ error: { errMsg: "User should be able to enter any name here. No restrictions.", show: true } });
  // 		return;
  // 	}

  // 	this.setState({ modalVisible: false });
  // 	let timeVal = this.state.totalTime / 1000;
  // 	let minInt = parseInt(`${parseInt(`${timeVal}`) / 60}`),
  // 		secInt = parseInt(`${timeVal}`) % 60;
  // 	this.props.editRefresh([
  // 		{
  // 			filePath: this.state.path,
  // 			isLocal: true,
  // 			filename: `${this.state.changedName}.${this.recording.split(".")[1]}`,
  // 			type: `${FileType[FileType.audio]}s`,
  // 			time: `time1-${minInt < 10 ? 0 : ""}${minInt}:${secInt < 10 ? 0 : ""}${secInt}`,
  // 			userId : Account.selectedData().userID,
  //             file_title : "",
  // 			file_description : "",
  // 			userName: Account.selectedData().firstName + " " + Account.selectedData().lastName,
  // 			date : Utility.dateObjectToDefaultFormat(new Date())
  // 		}
  // 	]);
  // 	Keyboard.dismiss();
  // 	this.props.navigation.goBack();
  // };

  // render() {
  // 	return (
  // 		<SafeAreaView style={{ flex: 1, backgroundColor: !this.props.selectedItem ? "white" : "#F3F3F3" }}>
  // 			<View style={{ position: "absolute", backgroundColor: "white", height: "100%", width: "100%" }} />
  // 			<StatusBar barStyle="dark-content" />
  // 			{DeviceInfo.isTablet() && !this.props.selectedItem ? (
  // 				<TouchableOpacity
  // 					disabled={this.state.audioState == "recording" || this.state.audioState == "record-pause"}
  // 					onPress={()=> this.navigateBackOrReset()}
  // 					style={{ padding: 16, width: 100, alignItems: "center" }}>
  // 					<Text style={{ ...fontSize(18), color: Colors.ThemeColor }}>Cancel</Text>
  // 				</TouchableOpacity>
  // 			) : null}
  // 			<View style={Styles.containerStyle}>
  // 				<View style={{ alignSelf: "center", marginTop: 95, marginBottom: 20, height: 60 }}>
  // 					{(this.state.audioState == "recorded" || this.state.audioState == "playing" || this.state.audioState == "paused") &&
  // 						!this.props.selectedItem ? (
  // 							<Slider
  // 								value={this.state.sliderValue}
  // 								minimumTrackTintColor={Colors.ThemeColor}
  // 								maximumTrackTintColor={"#909090"}
  // 								thumbImage={require("../../../images/audio_kit/thumb.png")}
  // 								style={{ width: 300 }}
  // 								onValueChange={(value: number) => {
  // 									this.setState({ sliderValue: value });
  // 								}}
  // 								onSlidingComplete={() => {
  // 									this.seek();
  // 								}}
  // 							/>
  // 						) : (
  // 							<MainView play={this.state.audioState == "recording"} style={{ width: 320, height: 38, alignItems: "center" }} />
  // 						)}
  // 				</View>
  // 				<View style={{ flex: 1, alignItems: "center" }}>
  // 					<Text style={{ ...fontSize(24), color: "#595959" }}>{this.state.time}</Text>
  // 					<TouchableHighlight
  // 						onPress={this.audioActions}
  // 						underlayColor={`${Colors.ThemeColor}ae`}
  // 						style={{
  // 							justifyContent: "center",
  // 							alignItems: "center",
  // 							backgroundColor: this.state.audioState == "recording" ? Colors.ErrorColor : Colors.ThemeColor,
  // 							height: Size.byWidth(153),
  // 							width: Size.byWidth(153),
  // 							borderRadius: Size.byWidth(153) / 2,
  // 							marginTop: 30
  // 						}}>
  // 						<View style={{ alignItems: "center", height: "70%" }}>
  // 							<View
  // 								style={{
  // 									width: 85,
  // 									marginTop: 13,
  // 									marginBottom: 10,
  // 									alignItems: "center",
  // 									height: "60%",
  // 									justifyContent: "center",
  // 									paddingLeft: this.state.audioState == "recorded" || this.state.audioState == "paused" ? 10 : 0
  // 								}}>
  // 								<Image source={this.buttonImage} />
  // 							</View>
  // 							<Text style={{ ...fontSize(16), color: "#fff", bottom: 0 }}>{this.buttonTitle}</Text>
  // 						</View>
  // 					</TouchableHighlight>
  // 				</View>
  // 				{this.props.selectedItem ? null : (
  // 					<View
  // 						style={{
  // 							position: "absolute",
  // 							height: 100,
  // 							bottom: 0,
  // 							flexDirection: "row",
  // 							width: "100%",
  // 							justifyContent: DeviceInfo.isTablet()
  // 								? "center"
  // 								: this.state.audioState !== "none" && this.state.audioState !== "recording" && this.state.audioState !== "record-pause"
  // 									? "space-around"
  // 									: "center"
  // 						}}>
  // 						{/** If Device is not tablet or state is recording */}
  // 						{!DeviceInfo.isTablet() || this.state.audioState == "recording" || this.state.audioState == "record-pause" ? (
  // 							<TouchableOpacity
  // 								style={{ padding: 16, width: 150, alignItems: "center" }}
  // 								onPress={
  // 									this.state.audioState == "recording" || this.state.audioState == "record-pause"
  // 										? () => {
  // 											SoundRecorder.stop().then((result: { path: string; duration: number }) => {
  // 												this.processing = false;
  // 												this.setState({ audioState: "recorded", path: result.path, totalTime: result.duration });
  // 												//this.recorder && this.recorder.destroy && this.recorder.destroy();
  // 											});
  // 										}
  // 										: () => this.navigateBackOrReset()
  // 								}>
  // 								<Text style={{ ...fontSize(24), color: "#595959" }}>
  // 									{this.state.audioState == "recording" || this.state.audioState == "record-pause" ? "Done" : "Cancel"}
  // 								</Text>
  // 							</TouchableOpacity>
  // 						) : null}
  // 						{this.state.audioState !== "none" && this.state.audioState !== "recording" && this.state.audioState !== "record-pause" ? (
  // 							<TouchableOpacity onPress={this.openModal} style={{ padding: 16, width: 150, alignItems: "center" }}>
  // 								<Text style={{ ...fontSize(24), color: Colors.ThemeColor }}>Save</Text>
  // 							</TouchableOpacity>
  // 						) : null}
  // 					</View>
  // 				)}
  // 			</View>
  // 			{this.props.selectedItem ? (
  // 				<View
  // 					style={{
  // 						width: "100%",
  // 						height: 60,
  // 						flexDirection: "row",
  // 						backgroundColor: "#F3F3F3",
  // 						justifyContent: getValue(this.props.selectedItem, ["isLocal"]) ? "flex-end" : "space-between",
  // 						alignItems: "center",
  // 						paddingLeft: 10,
  // 						paddingRight: 10,
  // 						borderTopColor: "rgba(0.0, 0.0, 0.0, 0.25)",
  // 						borderTopWidth: 1
  // 					}}>
  // 					{!getValue(this.props.selectedItem, ["isLocal"]) ? !this.props.hideDelete && (
  // 						<TouchableOpacity
  // 							onPress={() => {
  // 								this.props.deleteItem();
  // 								Keyboard.dismiss();
  // 								this.props.navigation.goBack();
  // 							}}
  // 							style={{ marginLeft: 10, alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
  // 							<Image source={rubbish} resizeMode="contain" />
  // 						</TouchableOpacity>
  // 					) : null}
  // 					<TouchableOpacity
  // 						onPress={() => {
  // 							Keyboard.dismiss();
  // 							this.props.navigation.goBack();
  // 							this.props.reset();
  // 						}}
  // 						style={{ marginLeft: 10, alignItems: "center", justifyContent: "center", width: 80, height: 44 }}>
  // 						<Text style={{ ...fontSize(18), color: Colors.ThemeColor }}>Close</Text>
  // 					</TouchableOpacity>
  // 				</View>
  // 			) : null}
  // 			<Modal transparent={true} animationType="slide" onRequestClose={() => { }}
  // 				presentationStyle="overFullScreen" visible={this.state.modalVisible}>
  // 				<View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "#0000009f" }}>
  // 					<View
  // 						style={{
  // 							backgroundColor: "white",
  // 							height: 200,
  // 							width: 300,
  // 							alignItems: "flex-start",
  // 							borderRadius: 7,
  // 							paddingRight: 15,
  // 							paddingLeft: 15,
  // 							paddingBottom : 10,
  // 							justifyContent: "space-around"
  // 						}}>
  // 						<View style={{ width: "100%", height: 44, justifyContent: "center" }}>
  // 							<Text style={{ ...fontSize(17), fontWeight: "500", color: "#1c1c1c" }}>Save as</Text>
  // 							<TouchableOpacity
  // 								onPress={() => {
  // 									this.setState({ modalVisible: false, error: { errMsg: "", show: false } });
  // 								}}
  // 								style={{
  // 									width: 44,
  // 									height: 44,
  // 									borderRadius: 22,
  // 									justifyContent: "center",
  // 									alignItems: "center",
  // 									position: "absolute",
  // 									top: -3,
  // 									right: -15
  // 								}}>
  // 								<Text style={{ ...fontSize(15), color: "black", fontWeight: "600" }}>✕</Text>
  // 							</TouchableOpacity>
  // 						</View>
  // 						<View style={{ height: 45, width: "100%", flexDirection: "row"}}>
  // 							<View style={{width: "85%"}}>
  // 								<TextInput
  // 									style={{width: "100%", borderBottomColor: Colors.ThemeColor, borderBottomWidth: 2, height: 45, ...fontSize(15) }}
  // 									placeholder="File name"
  // 									returnKeyType="send"
  // 									keyboardType="ascii-capable"
  // 									value={this.state.changedName}
  // 									onChangeText={(text: string) => {
  // 										this.setState({ changedName: text, error: { errMsg: "", show: false } });
  // 									}}
  // 								/>
  // 							</View>
  // 							<View style={{flex : 1, alignItems: "center", marginLeft: 6, height: 45, justifyContent: "center" }}>
  // 								<Text style={{ ...fontSize(14), color: "black" }}>{this.recording ? this.recording.split(".")[1] : ""}</Text>
  // 							</View>
  // 						</View>
  // 						<View style={{flex : 1, marginBottom : -10}}>
  // 							{this.state.error.show ? (
  // 									<View style={{ alignItems: "flex-start", minHeight: 15, justifyContent: "center" }}>
  // 										<Text numberOfLines={2} style={{ ...fontSize(11), color: Colors.ErrorColor }}>{this.state.error.errMsg}</Text>
  // 									</View>
  // 							) : null}
  // 						</View>
  // 						<View style={{ width: "100%", alignItems: "center", paddingBottom : 20}}>
  // 							<TouchableOpacity
  // 								style={{
  // 									borderRadius: 4,
  // 									backgroundColor: Colors.ThemeColor,
  // 									width: 200,
  // 									height: 44,
  // 									alignItems: "center",
  // 									justifyContent: "center"
  // 								}}
  // 								onPress={() => {
  // 									this.uploadAudio();
  // 								}}>
  // 								<Text style={{ ...fontSize(18), fontWeight : "500", color: "white" }}>SAVE</Text>
  // 							</TouchableOpacity>
  // 						</View>
  // 					</View>
  // 				</View>
  // 			</Modal>
  // 		</SafeAreaView>
  // 	);
  // }
}
