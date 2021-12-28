import React, {Component} from 'react';
import {
  View,
  Image,
  StatusBar,
  Dimensions,
  ScrollView,
  Animated,
  SafeAreaView,
  Alert,
  TouchableHighlight,
  Platform,
  ImageBackground,
} from 'react-native';
//@ts-ignore
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {
  appIntroBg1,
  appIntroBg2,
  appIntroBg3,
  appIntroBg4,
  appIntroBg5,
  appIntro1,
  appIntro2,
  appIntro3,
  appIntro4,
  app_intro_msm,
  appIntroBg,
} from '../../images';
import {ToastMessage} from '../../common/component/Toast';
import Text from '../../common/component/Text';
import {fontSize, Colors} from '../../common/constants';
import {Actions} from 'react-native-router-flux';
// @ts-ignore
import DefaultPreference from 'react-native-default-preference';
export default class AppIntro extends React.Component {
  _externalQueue: Carousel;
  _appIntroData: any = [{text: 'first'}, {text: 'second'}];
  images = [
    {
      image: appIntro1,
      background: appIntroBg,
      title: 'Recall',
      description:
        'Reawaken your dormant Memories with our personalized Prompts and Memory Cues.',
    },
    {
      image: appIntro2,
      background: appIntroBg,
      title: 'Record and Collaborate',
      description:
        'Collaborate with family and friends as you recount your Memories, or just record them by yourself.',
    },
    {
      image: appIntro3,
      background: appIntroBg,
      title: 'Controlled Sharing',
      description:
        'Some Memories are more private than others. Specify exactly who can read each Memory - and soon, which parts of each Memory',
    },
    {
      image: appIntro4,
      background: appIntroBg,
      title: 'Your Stories Matter',
      description: 'A life worth remembering is a life worth recording.',
    },
  ];
  state: any = {
    fadeIn: new Animated.Value(1),
    currentIndex: 0,
    // eventX : 0,
    // scrollStartted : false,
    scrolling: false,
  };
  onDoneTap = () => {
    DefaultPreference.set('hide_app_intro', 'true').then(function () {});
    Actions.prologue();
  };

  renderAppIntro = (item: any) => {
    let index = item.index;
    item = item.item;
    return (
      <View
        style={{
          paddingTop: 30,
          width: Dimensions.get('window').width,
          flex: 1,
          marginBottom: 50,
        }}>
        <ImageBackground source={item.background} style={{flex: 1}}>
          <View
            style={{
              width: '100%',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 2,
                width: Dimensions.get('window').width,
                justifyContent: 'center',
              }}>
              <Image
                source={item.background1}
                style={{
                  resizeMode: 'stretch',
                  width: Dimensions.get('window').width,
                }}></Image>
            </View>
            <View
              style={{
                position: 'absolute',
                width: Dimensions.get('window').width,
                height: '100%',
                bottom: 0,
              }}>
              <View
                style={{
                  flex: 2,
                  maxHeight: '72%',
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Animated.View
                  style={{
                    opacity: this.state.fadeIn,
                    flex: 1,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop:
                      this.state.currentIndex == 0
                        ? 40
                        : this.state.currentIndex == 2
                        ? 30
                        : 0,
                  }}>
                  {this.state.currentIndex == index && (
                    <Image
                      source={item.image}
                      style={{
                        maxHeight: '100%',
                        width: Dimensions.get('window').width,
                        resizeMode:
                          this.state.currentIndex == 1 ? 'stretch' : 'contain',
                      }}></Image>
                  )}
                </Animated.View>
              </View>
              <View style={{flex: 0.5, width: '100%'}}></View>
            </View>
            <View
              style={{
                flex: 1,
                maxHeight: '28%',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                width: '100%',
                paddingTop: 0,
              }}>
              <Animated.View
                style={{
                  opacity: this.state.fadeIn,
                  width: '100%',
                  flex: 1,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                {this.state.currentIndex == index && (
                  <View
                    style={{
                      flex: 1,
                      width: '100%',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                    }}>
                    <Text
                      style={{
                        ...fontSize(24),
                        color: Colors.TextColor,
                        width: Dimensions.get('window').width,
                        fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                        textAlign: 'center',
                      }}>
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        ...fontSize(18),
                        color: Colors.TextColor,
                        width: Dimensions.get('window').width,
                        textAlign: 'center',
                        padding: 10,
                      }}>
                      {item.description}
                    </Text>
                  </View>
                )}
              </Animated.View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  fadeIn = (index: any) => {
    this.setState(
      {currentIndex: index, fadeIn: new Animated.Value(0), scrolling: false},
      () => {
        Animated.timing(this.state.fadeIn, {
          toValue: 1,
          duration: 500,
        }).start();
      },
    );
  };

  fadeOut() {
    Animated.timing(this.state.fadeIn, {
      toValue: 0,
      duration: 1500,
    }).start();
  }

  get pagination() {
    let activeSlide = this.state.currentIndex;
    return (
      <Pagination
        dotsLength={this.images.length}
        activeDotIndex={activeSlide}
        containerStyle={{backgroundColor: 'transpa'}}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 4,
          marginHorizontal: 0,
          backgroundColor: Colors.TextColor,
        }}
        inactiveDotStyle={{
          width: 8,
          height: 8,
          borderRadius: 4,
          marginHorizontal: 0,
          backgroundColor: '#D4E9E6',
        }}
        inactiveDotOpacity={1.0}
        inactiveDotScale={1.0}
      />
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView
          style={{flex: 0, backgroundColor: Colors.NewThemeColor}}
        />
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}>
          <StatusBar
            barStyle={'dark-content'}
            backgroundColor={Colors.NewThemeColor}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.NewThemeColor,
              alignItems: 'center',
            }}>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: 100,
                backgroundColor: 'white',
              }}
            />
            <Image
              source={app_intro_msm}
              style={{resizeMode: 'center', marginTop: 20}}></Image>
            <Carousel
              data={this.images}
              renderItem={(item: any) => this.renderAppIntro(item)}
              onSnapToItem={(i: any) => this.fadeIn(i)}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width}
              slideStyle={{width: Dimensions.get('window').width, flex: 1}}
              inactiveSlideOpacity={1}
              inactiveSlideScale={1}
              useScrollView={false}
              onScroll={(event: any) => {
                if (this.state.scrolling) {
                  this.setState({
                    fadeIn: new Animated.Value(
                      1 -
                        Math.abs(
                          this.state.currentIndex -
                            event.nativeEvent.contentOffset.x /
                              Dimensions.get('window').width,
                        ),
                    ),
                  });
                }
              }}
              onScrollBeginDrag={() =>
                this.setState({scrolling: true, fadeIn: new Animated.Value(1)})
              }
            />
            <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
              {this.pagination}
            </View>
            {this.state.currentIndex == this.images.length - 1 && (
              <View style={{position: 'absolute', bottom: 50}}>
                <TouchableHighlight
                  underlayColor="#ffffff11"
                  onPress={() => this.onDoneTap()}
                  style={{padding: 5, paddingRight: 15, paddingLeft: 15}}>
                  <Text
                    style={{
                      ...fontSize(22),
                      fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                      color: Colors.TextColor,
                    }}>
                    Start
                  </Text>
                </TouchableHighlight>
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
