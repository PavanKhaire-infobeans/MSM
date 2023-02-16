import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Image,
  Slider,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
//@ts-ignore
import { Player } from '@react-native-community/audio-toolkit';
import {
  audio_details_close,
  audio_details_open,
  music_note,
  small_close_white_,
} from '../../../images';
import {
  Colors,
  ConsoleType,
  encode_utf8,
  showConsoleLog,
} from '../../constants';
import Utility from '../../utility';
import { No_Internet_Warning, ToastMessage } from '../Toast';
import styles from './styles';

type Props = {
  files?: any;
  memoryTitle?: any;
  by?: any;
  playerCallback?: (event: any) => void;
  bottom?: any;
};

export const kPlaying = 'playing';
export const kPaused = 'paused';
export const kEnded = 'ended';
export const kNext = 'next';
export const kPrevious = 'previous';
export const kClosed = 'closed';

const AudioPlayer = forwardRef((props: Props, ref: any) => {
  let playershow: Player = null;
  let totalDuration: any;
  let currentDuration: any;
  let timeOutBuffering: any;

  const [player, setPlayer] = useState(null);
  const [state, setState] = useState({
    minimizedView: true,
    playerShowing: false,
    playing: true,
    ended: false,
    totalDuration: '00:00',
    currentDuration: '00:00',
    maximumSeekValue: 0,
    sliderValue: 0,
    slidingInProgess: false,
    songTitle: '',
    nextEnabled: false,
    previousEnabled: false,
    index: 0,
    loadingText: false,
  });

  useImperativeHandle(ref, () => ({
    tooglePlayPause: () => {
      showConsoleLog(ConsoleType.LOG, 'tooglePlayPause');
      let play = !state.playing;
      try {
        if (play) {
          player?.play();
          props.playerCallback(kPlaying);
        } else {
          player?.pause();
          props.playerCallback(kPaused);
        }
        setState(prev => ({
          ...prev,
          playing: play,
        }));
      } catch (e) {
        //showConsoleLog(ConsoleType.LOG,"File corrupted")
      }
    },
    showPlayer: (index: any) => {
      if (Utility.isInternetConnected) {
        try {
          if (props.files[index].url == null || props.files[index].url == '') {
            //ToastMessage('Audio file is corrupted', Colors.ErrorColor);
            tooglePlayPause();
            return;
          }
          if (
            props.files[index].filesize &&
            props.files[index].filesize != '0'
          ) {
            let songTitle = props.files[index].file_title
              ? props.files[index].file_title
              : props.files[index].title
                ? props.files[index].title
                : props.files[index].filename
                  ? props.files[index].filename
                  : '';
            try {
              setState(prev => ({
                ...prev,
                playerShowing: true,
                songTitle: songTitle,
                playing: true,
                ended: false,
                totalDuration: '00:00',
                currentDuration: '00:00',
                maximumSeekValue: 0,
                sliderValue: 0,
                slidingInProgess: true,
                loadingText: true,
                index: index,
              }));
            } catch (error) { }

            if (player && player?.canPlay) {
              player?.stop();
            }
            settingPreviousAndNext(index);
            let path = encode_utf8(
              props.files[index].url
                ? props.files[index].url
                : props.files[index].filePath
                  ? props.files[index].filePath
                  : '',
            );
            // showConsoleLog(ConsoleType.LOG,"Path before ::", path);
            if (
              path.indexOf('https://') == -1 &&
              path.indexOf('http://') == -1 &&
              path.indexOf('file://') == -1
            ) {
              path = 'file://' + path;
            }
            // showConsoleLog(ConsoleType.LOG,"props.files[index]::", JSON.stringify(props.files[index].url));
            // showConsoleLog(ConsoleType.LOG,"Path::", path);
            let newplayer = new Player(path);

            newplayer.volume = 0;
            playershow = newplayer;

            newplayer.prepare(
              () => {
                newplayer.play(
                  () => {
                    timeOutBuffering = setTimeout(() => {
                      setState(prev => ({
                        ...prev,
                        slidingInProgess: false,
                        loadingText: false,
                      }));

                      newplayer.volume = 0.5;
                      newplayer.currentTime = 0;
                      playershow = newplayer;
                      currentDuration = setInterval(setCurrentTime, 500);
                    }, 2000);
                  },
                  () => { },
                );
                setPlayer(newplayer);
              },
              () => { },
            );
            totalDuration = setInterval(setTotalTime, 500);
          } else {
            //ToastMessage('This audio file is corrupted', Colors.ErrorColor);
            setTimeout(() => {
              hidePlayer();
            }, 1000);
          }
        } catch (e) {
          showConsoleLog(ConsoleType.LOG, 'e rr :', e);
        }
      } else {
        No_Internet_Warning();
      }
    },
    hidePlayer: () => {
      setState(prev => ({
        ...prev,
        playerShowing: false,
      }));
      if (player) {
        player?.stop();
      }
      let newplayer = new Player();
      setPlayer(newplayer);
      playershow = newplayer;
      clearInterval(totalDuration);

      props.playerCallback(kClosed);
    },
  }));

  const settingPreviousAndNext = (index: any) => {
    let previous = false;
    let next = false;
    if (index > 0) {
      previous = true;
    }

    if (index < props.files.length - 1) {
      next = true;
    }

    setState(prev => ({
      ...prev,
      nextEnabled: next,
      previousEnabled: previous,
    }));
  };

  const showPlayer = (index: any) => {
    if (Utility.isInternetConnected) {
      try {
        if (props.files[index].url == null || props.files[index].url == '') {
          //ToastMessage('Audio file is corrupted', Colors.ErrorColor);
          tooglePlayPause();
          return;
        }
        if (props.files[index].filesize && props.files[index].filesize != '0') {
          let songTitle = props.files[index].file_title
            ? props.files[index].file_title
            : props.files[index].title
              ? props.files[index].title
              : props.files[index].filename
                ? props.files[index].filename
                : '';
          setState(prev => ({
            ...prev,
            playerShowing: true,
            songTitle: songTitle,
            playing: true,
            ended: false,
            totalDuration: '00:00',
            currentDuration: '00:00',
            maximumSeekValue: 0,
            sliderValue: 0,
            slidingInProgess: true,
            loadingText: true,
            index: index,
          }));

          if (player && player?.canPlay) {
            player?.stop();
          }
          settingPreviousAndNext(index);
          let path = encode_utf8(
            props.files[index].url
              ? props.files[index].url
              : props.files[index].filePath
                ? props.files[index].filePath
                : '',
          );
          if (path.indexOf('https://') == -1 && path.indexOf('file://') == -1) {
            path = 'file://' + path;
          }
          let newplayer = new Player(path);
          newplayer.volume = 0;
          newplayer.prepare(
            () => {
              newplayer.play(
                () => {
                  timeOutBuffering = setTimeout(() => {
                    setState(prev => ({
                      ...prev,
                      slidingInProgess: false,
                      loadingText: false,
                    }));

                    newplayer.currentTime = 0;
                    newplayer.volume = 0.5;
                    currentDuration = setInterval(setCurrentTime, 500);
                  }, 2000);
                });
            });
          setPlayer(newplayer);
          playershow = newplayer;

          totalDuration = setInterval(setTotalTime, 500);
        } else {
          //ToastMessage('This audio file is corrupted', Colors.ErrorColor);
          setTimeout(() => {
            hidePlayer();
          }, 1000);
        }
      } catch (e) {
        //showConsoleLog(ConsoleType.LOG,e);
      }
    } else {
      No_Internet_Warning();
    }
  };

  const setTotalTime = () => {
    if (playershow?.duration > 0) {
      setState(prev => ({
        ...prev,
        totalDuration: setPlayTime(playershow?.duration / 1000),
        maximumSeekValue: Math.round(playershow?.duration / 1000),
      }));

      clearInterval(totalDuration);
    }
  };

  const setCurrentTime = () => {
    if (
      playershow?.currentTime > 0 &&
      (state.playing || state.slidingInProgess)
    ) {
      // showConsoleLog(  ConsoleType.LOG, 'player?._state :', playershow?.currentTime);
      setState(prev => ({
        ...prev,
        currentDuration: setPlayTime(playershow?.currentTime / 1000),
      }));

      // if (!state.slidingInProgess) {
      setState(prev => ({
        ...prev,
        sliderValue: Math.round(playershow?.currentTime / 1000),
      }));

      // }
      if (
        playershow?.duration - playershow?.currentTime < 500 &&
        state.playing
      ) {
        setState(prev => ({
          ...prev,
          ended: true,
          playing: false,
        }));

        playershow?.pause();

        playershow.currentTime = 0;
        // setPlayer(newplayer);
        // playershow = newplayer;
        props.playerCallback(kEnded);
        setState(prev => ({
          ...prev,
          sliderValue: Math.round(player?.duration / 1000),
        }));
      }
    }
  };

  const setPlayTime = (playTime: number) => {
    let minInt = parseInt(`${parseInt(`${playTime}`) / 60}`),
      secInt = parseInt(`${playTime}`) % 60;
    return `${minInt < 10 ? 0 : ''}${minInt}:${secInt < 10 ? 0 : ''}${secInt}`;
  };

  const tooglePlayPause = () => {
    let play = !state.playing;
    try {
      if (play) {
        player?.play();
        props.playerCallback(kPlaying);
      } else {
        player?.pause();
        props.playerCallback(kPaused);
      }
      setState(prev => ({
        ...prev,
        playing: play,
      }));
    } catch (e) {
      //showConsoleLog(ConsoleType.LOG,"File corrupted")
    }
  };

  const hidePlayer = () => {
    setState(prev => ({
      ...prev,
      playerShowing: false,
    }));

    // showConsoleLog(ConsoleType.LOG, 'stop Player', player);
    if (player) {
      player?.stop();
    }
    let newPlayer = new Player();

    setPlayer(newPlayer);
    playershow = newPlayer;

    props.playerCallback(kClosed);
  };

  const nextSong = () => {
    try {
      let currentIndex = state.index;
      if (currentIndex < props.files.length - 1) {
        currentIndex++;
      }
      clearTimeout(timeOutBuffering);
      showPlayer(currentIndex);
      props.playerCallback(kNext);
    } catch (e) {
      //showConsoleLog(ConsoleType.LOG,e);
    }
  };

  const previousSong = () => {
    try {
      let currentIndex = state.index;
      if (currentIndex > 0) {
        currentIndex--;
      }
      clearTimeout(timeOutBuffering);
      showPlayer(currentIndex);
      props.playerCallback(kPrevious);
    } catch (e) {
      //showConsoleLog(ConsoleType.LOG,e);
    }
  };

  const toggleSize = () => {
    let minimizedView = !state.minimizedView;
    setState(prev => ({
      ...prev,
      minimizedView: minimizedView,
    }));
  };

  const touchStartSlider = () => {
    setState(prev => ({
      ...prev,
      slidingInProgess: true,
    }));
  };

  const touchEndSlider = () => {
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        slidingInProgess: false,
      }));
    }, 700);
  };

  useEffect(() => {
    return () => {
      if (player) {
        player?.stop();
      }
    };
  }, []);

  // console.log("vallll ",isNaN(state.sliderValue)? state.maximumSeekValue : state.sliderValue)
  return (
    <View
      style={[
        styles.mainContainer,
        { bottom: props.bottom ? props.bottom : 80 },
      ]}>
      {state.playerShowing && (
        <View
          style={[
            styles.minimizedContainer,
            {
              height: state.playerShowing
                ? state.minimizedView
                  ? 100
                  : 200
                : 0,
            },
          ]}>
          {!state.minimizedView && (
            <View style={styles.height100}>
              <Text style={styles.memoryTitleText} numberOfLines={1}>
                {props.memoryTitle}
              </Text>
              <Text style={styles.byText} numberOfLines={1}>
                {props.by}
              </Text>
              <View style={styles.songTitleContainer}>
                <Image source={music_note} style={styles.marginRight} />
                <Text style={styles.byText} numberOfLines={1}>
                  {state.songTitle}
                </Text>
              </View>
            </View>
          )}
          <Slider
            // value={playershow?.currentTime ? Math.round(playershow?.currentTime / 1000): 0}
            value={
              state.ended ? 0 : isNaN(state.sliderValue) ? state.maximumSeekValue : state.sliderValue
            }
            minimumTrackTintColor={Colors.NewRadColor}
            maximumTrackTintColor={'rgba(196, 196, 196, 0.4)'}
            minimumValue={0}
            maximumValue={state.maximumSeekValue}
            thumbImage={require('../../../images/audio_kit/thumb_white.png')}
            style={styles.sliderStyle}
            onValueChange={(value: number) => {
              setState(prev => ({
                ...prev,
                sliderValue: value,
              }));
              let newplayer = player;
              newplayer.currentTime = value * 1000;
              if (playershow) {
                playershow.currentTime = value * 1000;
              }
              setPlayer(newplayer);
              playershow = newplayer;
            }}
            onSlidingComplete={(value: number) => {
              setTimeout(() => {
                setState(prev => ({
                  ...prev,
                  slidingInProgess: false,
                }));
              }, 700);
              let newplayer = player;
              newplayer.currentTime = value * 1000;
              if (newplayer?.duration - 500 <= value * 1000) {
                setState(prev => ({
                  ...prev,
                  ended: true,
                  playing: false,
                }));
                player?.pause();
                newplayer.currentTime = 0;
                props.playerCallback(kEnded);
              }
              setPlayer(newplayer);
              playershow = newplayer;
            }}
            onStartShouldSetResponder={() => true}
            onResponderStart={touchStartSlider}
            onResponderRelease={touchEndSlider}
          />

          <View style={styles.songTimeContainer}>
            {state.loadingText ? (
              <Text style={styles.durationText}>{'Loading...'}</Text>
            ) : (
              <Text style={styles.durationText}>
                {state.currentDuration}
                {'/'}
                {state.totalDuration}
              </Text>
            )}

            <View style={styles.songTimeContainer}>
              <BackwardIcon
                previousSong={() => {
                  previousSong();
                }}
                disabled={!state.previousEnabled}
              />
              <PlayPause
                playing={state.playing}
                togglePlayPause={() => {
                  tooglePlayPause();
                }}></PlayPause>
              <ForwardIcon
                nextSong={() => {
                  nextSong();
                }}
                disabled={!state.nextEnabled}
              />
            </View>
            <TouchableWithoutFeedback onPress={() => toggleSize()}>
              <View style={styles.imageAudioContainer}>
                <Image
                  source={
                    state.minimizedView
                      ? audio_details_open
                      : audio_details_close
                  }
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      )}
      {state.playerShowing && (
        <TouchableWithoutFeedback onPress={() => hidePlayer()}>
          <View
            style={[
              styles.playerShowing,
              { bottom: state.minimizedView ? 105 : 205 },
            ]}>
            <Image
              source={small_close_white_}
              style={{ height: 11, width: 11 }}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
});

AudioPlayer.defaultProps = {
  files: [
    {
      url: 'https://qa.cueback.com/sites/qa.cueback.com/default/files/thumb_6872/media/SampleAudio_0.4mb_0_0_0_0_0.mp3',
    },
  ],
  memoryTitle: 'This is a test memory',
  by: 'by You',
};

const PlayPause = (props: { playing: boolean; togglePlayPause: () => void }) => {
  return (
    <TouchableWithoutFeedback onPress={() => props.togglePlayPause()}>
      <View style={styles.PlayPauseTouch}>
        {props.playing ? (
          <View style={styles.PlayPauseContainer}>
            <View style={styles.column} />
            <View style={styles.transparentCol} />
            <View style={styles.column} />
          </View>
        ) : (
          <View style={styles.play} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const ForwardIcon = (props: { disabled: boolean; nextSong: () => void }) => {
  return (
    <TouchableHighlight
      underlayColor={Colors.underlayColor}
      disabled={props.disabled}
      onPress={() => props.nextSong()}>
      <View style={styles.flexRow}>
        <PlayButtonDefault
          color={
            props.disabled ? Colors.dullText : Colors.white
          }></PlayButtonDefault>
        <PlayButtonDefault
          color={
            props.disabled ? Colors.dullText : Colors.white
          }></PlayButtonDefault>
      </View>
    </TouchableHighlight>
  );
};

const BackwardIcon = (props: { disabled: boolean; previousSong: () => void }) => {
  return (
    <TouchableHighlight
      underlayColor={Colors.underlayColor}
      disabled={props.disabled}
      style={styles.BackwardIcon}
      onPress={() => props.previousSong()}>
      <View style={styles.flexRow}>
        <PlayButtonDefault
          color={
            props.disabled ? Colors.dullText : Colors.white
          }></PlayButtonDefault>
        <PlayButtonDefault
          color={
            props.disabled ? Colors.dullText : Colors.white
          }></PlayButtonDefault>
      </View>
    </TouchableHighlight>
  );
};

const PlayButtonDefault = (props: { color: any }) => {
  return (
    <View style={[styles.PlayButtonDefault, { borderLeftColor: props.color }]} />
  );
};

export default AudioPlayer;
