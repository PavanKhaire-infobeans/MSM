import React from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { Props } from '../login/loginController';
//@ts-ignore
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Actions } from 'react-native-router-flux';
import Sound from 'react-native-sound';
import { SubmitButton } from '../../common/component/button';
import TextNew from '../../common/component/Text';
import { Colors, fontFamily } from '../../common/constants';
import {
  add_content,
  arrow_left,
  arrow_right,
  close_big_grey,
  exit_tour,
  more_options_selected,
  msm_allPages_mindPop,
  msm_logo,
  msm_preserveYourMemories,
  progress_dot,
  progress_dot_check,
} from '../../images';
import Styles from './styles';
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
export default class AppGuidedTour extends React.Component<Props> {
  _carousal: any;
  animation: any;
  state = {
    fadeIn: new Animated.Value(1),
    fadeInView: new Animated.Value(1),
    beginTour: false,
    tourEnded: false,
    currentIndex: 0,
    scrolling: false,
    exitTour: false,
    tourSaveForLater: false,
    autoPlay: true,
    showPromptAnim: false,
    showMemoryCreationView: false,
    initialView: true,
  };
  width_X = Dimensions.get('window').width;

  appIntro = [
    {
      title: 'Scroll through stories',
      desc: (
        <>
          <TextNew>Read stories on the</TextNew>
          <TextNew
            style={{
              fontFamily:
                Platform.OS === 'ios'
                  ? fontFamily.Inter
                  : fontFamily.InterMedium,
              fontWeight: '500',
            }}>
            {' '}
            All Memories{' '}
          </TextNew>
          <TextNew>tab.</TextNew>
        </>
      ),
      imageSource: require('../../common/lottieFiles/msm_guidedTour_animation1.json'),
    },
    {
      title: 'Timeline',
      desc: 'Explore different time periods and read stories alongside cues from that era.',
      imageSource: require('../../common/lottieFiles/msm_guidedTour_animation2.json'),
    },
    {
      title: 'Recent',
      desc: 'Stay up to date and read the most recently published stories.',
      imageSource: require('../../common/lottieFiles/msm_guidedTour_animation3.json'),
    },
    {
      title: (
        <TextNew>
          <Image
            style={{
              width: 35,
              height: 25,
              marginVertical: 2,
              marginHorizontal: 2,
            }}
            source={add_content}></Image>{' '}
          Button
        </TextNew>
      ),
      desc: (
        <>
          <TextNew>Add a memory by tapping {'\n'}the </TextNew>
          <Image style={{ height: 25, width: 30 }} source={add_content}></Image>
          <TextNew> button.</TextNew>
        </>
      ),
      imageSource: require('../../common/lottieFiles/msm_guidedTour_animation4.json'),
    },
    {
      title: 'Get inspired',
      desc: (
        <>
          <TextNew>Choose a Prompt to answer and tap{'\n'}</TextNew>
          <TextNew
            style={{
              fontFamily:
                Platform.OS === 'ios'
                  ? fontFamily.Inter
                  : fontFamily.InterMedium,
              fontWeight: '500',
            }}>
            {' '}
            Add your memory{' '}
          </TextNew>
          <TextNew>to get started.</TextNew>
        </>
      ),
      imageSource: require('../../common/lottieFiles/msm_guidedTour_animation5_part1.json'),
    },
  ];
  _scrollView: ScrollView;
  _timerId: any;
  _childrenCount = 5;
  _currentIndex = 0;
  _preScrollX: any;
  backHandler: any;

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }

  backAction() {
    return true;
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  fadeIn = (index: any) => {
    this.setState(
      { currentIndex: index, fadeIn: new Animated.Value(0), scrolling: false },
      () => {
        Animated.timing(this.state.fadeIn, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      },
    );
  };

  fadeInView() {
    this.setState({ fadeInView: new Animated.Value(0) }, () => {
      Animated.timing(this.state.fadeInView, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    });
  }

  fadeOutView() {
    Animated.timing(this.state.fadeInView, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }

  fadeOut = () => {
    Animated.timing(this.state.fadeIn, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  resumeTour() {
    setTimeout(() => {
      if (this._carousal) {
        const { currentIndex } = this.state;
        let newIndex = currentIndex;
        if (newIndex >= this.appIntro.length) {
          newIndex = this.appIntro.length - 1;
        }
        if (newIndex <= 0) {
          newIndex = 0;
        }
        this.setState({ currentIndex: newIndex, tourEnded: false }, () => {
          this._carousal?.scrollToIndex({
            animated: true,
            index: newIndex,
          });
        });
      }
    }, 50);
  }

  onClick() {
    this.fadeOutView();
    setTimeout(() => {
      this.props.cancelAppTour();
      Actions.push('promptsView', { animated: true });
    }, 1000);
  }

  playSound() {
    Sound.setCategory('Playback');
    var mySound = new Sound('complete.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Error loading sound: ' + JSON.stringify(error));
        return;
      } else {
        mySound.play(success => {
          if (success) {
            console.log('Sound playing');
          } else {
            console.log('Issue playing file');
          }
        });
      }
    });
    mySound.setVolume(0.9);
    mySound.release();
    return mySound;
  }

  navigateToIndex(index: any) {
    ReactNativeHapticFeedback.trigger('notificationSuccess', options);
    if (this.state.currentIndex == this.appIntro.length - 1) {
      this.setState({ showPromptAnim: false });
    }
    this.setState({ currentIndex: index }, () => {
      this._carousal?.scrollToIndex({
        animated: true,
        index: index,
      });
    });

  }

  renderAppIntro = (item: any) => {
    let index = item.index;
    return (
      <View style={Styles.animatedViewContainer}>
        <View style={Styles.appIntroContainer}>
          <View style={Styles.titleDescContainer}>
            <TextNew style={Styles.appIntroTitleStyle}>
              {this.appIntro[index].title}
            </TextNew>
            <TextNew style={[Styles.appIntroDescStyle, Styles.textTopStyle]}>
              {this.appIntro[index].desc}
            </TextNew>
          </View>
          <View
            style={Styles.lottieContainer}
            onStartShouldSetResponder={e => {
              if (this.state.currentIndex == this.appIntro.length - 1)
                this.setState({ showPromptAnim: true });
              return true;
            }}>
            {/* { !this.state.showPromptAnim && <Image style={{width: "90%", flex:1,bottom:0, height: "90%",backgroundColor:"yellow"}} source={require("../../common/lottieFiles/1_alternate.gif")} /> } */}

            {!this.state.showPromptAnim && (
              <LottieView
                loop={true}
                speed={0.8}
                autoPlay={true}
                ref={(animation: any) => {
                  this.animation = animation;
                }}
                style={Styles.lottieImageSourceStyle}
                source={this.appIntro[index].imageSource}
              />
            )}
            {this.state.showPromptAnim && (
              <LottieView
                speed={0.8}
                autoPlay={true}
                style={Styles.lottieImageSourceStyle}
                source={require('../../common/lottieFiles/msm_guidedTour_animation5_part2.json')}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  renderDismissPopUp() {
    return (
      <Modal transparent>
        <View style={Styles.renderDismissPopUpContainerStyle}>
          <View style={Styles.renderDismissPopUpSubContainerStyle}>
            <View style={Styles.fullWidth}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ tourSaveForLater: true, tourEnded: false })
                  }}
                  style={{ alignItems: 'flex-end', paddingRight: 2 }}>
                  <Image source={close_big_grey}></Image>
                </TouchableOpacity>
              </View>
              <View style={Styles.justifyalignCenetr}>
                <Image source={msm_logo} style={Styles.imageLogoStyle} />
                <Image source={exit_tour} style={Styles.imageLogoStyle} />
                <TextNew style={Styles.appIntroTitleStyle}>
                  Exit guided tour?
                </TextNew>
                <TextNew
                  style={[Styles.appIntroDescStyle, Styles.textTopStyle]}>
                  You’re only few steps away from completing the tour.
                </TextNew>
                <SubmitButton
                  style={Styles.submitButnStyle}
                  text="Resume tour"
                  onPress={() => {
                    this.setState({ beginTour: true }, () => {
                      this.resumeTour();
                      // this.setState({tourEnded: false});
                    });
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ tourEnded: false, tourSaveForLater: true, initialView: false, beginTour: false });
                  }}
                  style={Styles.buttonContainer}>
                  <TextNew style={Styles.orTextStyle}>Save for later</TextNew>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  onScroll(e: any) {
    let page = Math.ceil(
      e.nativeEvent.contentOffset.x / Dimensions.get('window').width,
    );
    if (page !== this.state.currentIndex) {
      if (page >= this.appIntro.length) {
        page = this.appIntro.length - 1;
      }
      this.playSound();
      this.setState({
        currentIndex: page,
        showPromptAnim: false,
      });
    }
  }

  render() {
    return (
      <SafeAreaView>
        <Modal transparent>
          {this.state.beginTour ? (
            <View style={Styles.beginTourContainer}>
              <View style={Styles.beginTourCarouselContainer}>
                <View style={Styles.beginTourCarouselBtnContainer}>
                  {this.appIntro.length != null &&
                    this.appIntro.map((obj: any, index: any) => {
                      return (
                        <View style={Styles.alignItemsCenter}>
                          <TouchableOpacity
                            style={Styles.imageContainerStyle}
                            onPress={() => {
                              this.navigateToIndex(index);
                            }}>
                            <Image
                              source={
                                this.state.currentIndex >= index
                                  ? progress_dot_check
                                  : progress_dot
                              }></Image>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  <View style={Styles.closeContainerSTyle}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ tourEnded: true });
                      }}>
                      <Image source={close_big_grey}></Image>
                    </TouchableOpacity>
                  </View>
                </View>
                <FlatList
                  ref={(c: any) => {
                    this._carousal = c;
                  }}
                  data={this.appIntro}
                  initialNumToRender={this.appIntro.length}
                  renderItem={this.renderAppIntro}
                  horizontal
                  pagingEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(_item, index) => index + ''}
                  onScroll={e => this.onScroll(e)}
                />
              </View>
              <View style={Styles.butnContainerStyle}>
                <TouchableHighlight
                  underlayColor={Colors.transparent}
                  style={Styles.prevBtnContainer}
                  onPress={() => {
                    ReactNativeHapticFeedback.trigger(
                      'notificationSuccess',
                      options,
                    );
                    const { currentIndex } = this.state;
                    let newIndex = currentIndex - 1;
                    if (newIndex <= 0) {
                      newIndex = 0;
                    }
                    this.setState({ currentIndex: newIndex },()=>{
                      this._carousal?.scrollToIndex({
                        animated: true,
                        index: newIndex,
                      });
                    });
                    
                  }}>
                  <View style={Styles.backBtnContainer}>
                    <Image source={arrow_left}></Image>
                    <TextNew style={Styles.backTextStyle}>Back</TextNew>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={Colors.transparent}
                  style={Styles.nextBtnStyle}
                  onPress={() => {
                    ReactNativeHapticFeedback.trigger(
                      'notificationSuccess',
                      options,
                    );
                    if (this.state.currentIndex == this.appIntro.length - 1) {
                      this.fadeInView();
                      this.setState({ showPromptAnim: false, beginTour: false, showMemoryCreationView: true });
                    } else {
                      const { currentIndex } = this.state;
                      let newIndex = currentIndex + 1;
                      if (newIndex >= this.appIntro.length) {
                        newIndex = this.appIntro.length - 1;
                      }
                      this.setState({ currentIndex: newIndex },()=>{
                        this._carousal?.scrollToIndex({
                          animated: true,
                          index: newIndex,
                        });
                      });
                      
                    }
                  }}>
                  <View
                    style={[
                      Styles.backBtnContainer,
                      { backgroundColor: Colors.BtnBgColor },
                    ]}>
                    <TextNew
                      style={[Styles.backTextStyle, Styles.nextTextStyle]}>
                      Next
                    </TextNew>
                    <Image source={arrow_right}></Image>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          ) : (
            <View style={Styles.renderDismissPopUpContainerStyle}>
              <View
                style={[
                  Styles.renderDismissPopUpSubContainerStyle,
                  { borderRadius: 10 },
                ]}>
                {
                  this.state.tourSaveForLater ? (
                    <View style={Styles.saveLaterContainer}>
                      <Image source={msm_logo} style={Styles.imageLogoStyle} />
                      <TextNew
                        style={[Styles.appIntroTitleStyle, { marginTop: 16 }]}>
                        Access this tour at anytime
                      </TextNew>
                      <TextNew style={[Styles.appIntroDescStyle, { margin: 12 }]}>
                        Find this tour again when you tap the{' '}
                        <Image
                          style={Styles.iconStyle}
                          source={more_options_selected}
                        />{' '}
                        icon
                      </TextNew>
                      <SubmitButton
                        style={Styles.submitButnStyle}
                        text="Got it!"
                        onPress={() => this.props.cancelAppTour()}
                      />
                    </View>
                  ) : this.state.showMemoryCreationView ? (
                    <View style={Styles.showMemoryCreationView}>
                      <Animated.View
                        style={[
                          Styles.beginTourContainer,
                          { opacity: this.state.fadeInView },
                        ]}>
                        <View style={Styles.fullWidth}>
                          <View style={Styles.closeImage}>
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ tourEnded: false, tourSaveForLater: true })
                                  // this.setState({ tourSaveForLater: true });
                              }}
                              style={Styles.closeContainerStyle}>
                              <Image source={close_big_grey}></Image>
                            </TouchableOpacity>
                          </View>
                          <View style={Styles.tourContainerStyle}>
                            <Image source={msm_allPages_mindPop}></Image>
                            <TextNew
                              style={[
                                Styles.appIntroTitleStyle,
                                Styles.getStartedText,
                              ]}>
                              Let’s get started!
                            </TextNew>
                            <TextNew
                              style={[
                                Styles.appIntroDescStyle,
                                Styles.textTopStyle,
                              ]}>
                              Add your first memory.
                            </TextNew>
                            <SubmitButton
                              style={Styles.submitButtonStyle}
                              text="Answer a Prompt"
                              onPress={this.onClick.bind(this)}
                            />
                            <TextNew
                              style={[Styles.orTextStyle, Styles.textStyles]}>
                              or
                            </TextNew>
                            <TouchableOpacity
                              onPress={() => {
                                this.fadeOutView();
                                setTimeout(() => {
                                  Actions.push('addContent', { animated: true });
                                  this.props.cancelAppTour();
                                }, 1000);
                              }}
                              style={Styles.buttonContainer}>
                              <TextNew style={Styles.orTextStyle}>
                                I have a Memory in mind
                              </TextNew>
                            </TouchableOpacity>
                            {/* <TouchableOpacity underlayColor={Colors.transparent} onPress={() => {
															this.fadeOutView();
															setTimeout(() => {
																Actions.push("addContent",{animated : true});
																this.props.cancelAppTour();
															}, 1000);
														}}>
													<TextNew style={{...fontSize(20), fontWeight: Platform.OS=='ios' ? '500' : 'bold', textAlign: 'center',marginTop:16,color : Colors.BtnBgColor}}>I have a Memory in mind</TextNew>
													</TouchableOpacity> */}
                          </View>
                          <View style={Styles.newBackContainer}>
                            <TouchableHighlight
                              underlayColor={Colors.transparent}
                              style={Styles.newBackbuttonStyle}
                              onPress={() => {
                                ReactNativeHapticFeedback.trigger(
                                  'notificationSuccess',
                                  options,
                                );
                                this.fadeOutView();
                                const { currentIndex } = this.state;
                                this._carousal?.scrollToIndex({
                                  animated: true,
                                  index: currentIndex,
                                });
                                this.setState({
                                  beginTour: true,
                                  showPromptAnim: false,
                                  showMemoryCreationView: false
                                });
                              }}>
                              <View style={Styles.backBtnContainer}>
                                <Image source={arrow_left}></Image>
                                <TextNew style={Styles.backTextStyle}>
                                  Back
                                </TextNew>
                              </View>
                            </TouchableHighlight>
                          </View>
                        </View>
                      </Animated.View>
                    </View>
                  ) : (
                    this.state.initialView && (
                      <View style={Styles.fullWidth}>
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                beginTour: false,
                                showMemoryCreationView: false, tourEnded: true, tourSaveForLater: false, initialView: false
                              });
                            }}
                            style={Styles.closeBtnStyle}>
                            <Image source={close_big_grey}></Image>
                          </TouchableOpacity>
                        </View>
                        <View style={Styles.justifyalignCenetr}>
                          <Image
                            source={msm_logo}
                            style={Styles.imageLogoStyle}
                          />
                          <Image
                            source={msm_preserveYourMemories}
                            style={Styles.imageLogoStyle}
                          />
                          <TextNew style={Styles.appIntroTitleStyle}>
                            Your memories are just a tap away!
                          </TextNew>
                          <TextNew
                            style={[
                              Styles.appIntroDescStyle,
                              Styles.textTopStyle,
                            ]}>
                            Start with this quick tour of the app to start
                            reminiscing today.
                          </TextNew>
                          <SubmitButton
                            style={Styles.submitButnStyle}
                            text="Let’s get started!"
                            onPress={() => {
                              this.setState({ initialView: false, beginTour: true });
                            }}
                          />
                        </View>
                      </View>
                    )
                  )
                }
              </View>
            </View>
          )}
          {this.state.tourEnded && this.renderDismissPopUp()}
        </Modal>
      </SafeAreaView>
    );
  }
}

function e(_e: any): (event: import('react-native').LayoutChangeEvent) => void {
  throw new Error('Function not implemented.');
}
