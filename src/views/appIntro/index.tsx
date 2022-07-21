import React, { Component } from 'react';
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
import Carousel, { Pagination } from 'react-native-snap-carousel';
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
import { ToastMessage } from '../../common/component/Toast';
import Text from '../../common/component/Text';
import { fontSize, Colors } from '../../common/constants';
import { Actions } from 'react-native-router-flux';
// @ts-ignore
import DefaultPreference from 'react-native-default-preference';
import Utility from '../../common/utility';
import style from './styles';
export default class AppIntro extends React.Component {
  _externalQueue: Carousel;
  _appIntroData: any = [{ text: 'first' }, { text: 'second' }];
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
    DefaultPreference.set('hide_app_intro', 'true').then(function () { });
    Actions.prologue();
  };

  renderAppIntro = (item: any) => {
    let index = item.index;
    item = item.item;
    return (
      <View
        style={style.renderAppIntroContainer}>
        <ImageBackground source={item.background} style={style.flexContainer}>
          <View
            style={style.imageBgContainer}>
            <View
              style={style.imageBgSubContainer}>
              <Image
                source={item.background1}
                style={style.imageStyle}></Image>
            </View>
            <View
              style={style.containtContainerStyle}>
              <View
                style={style.animatedViewContainer}>
                <Animated.View
                  style={[style.AnimatedViewStyle, {
                    flex: 1,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }]}>
                  {this.state.currentIndex == index && (
                    <Image
                      source={item.image}
                      style={[style.ScrollImagesStyle, {
                        resizeMode: this.state.currentIndex == 1 ? 'stretch' : 'contain',
                      }]}></Image>
                  )}
                </Animated.View>
              </View>
              <View style={style.emptyView}></View>
            </View>

            <View
              style={style.descriptionContainer}>
              <Animated.View
                style={[style.descriptionAnimatedViewStyle, {
                  opacity: this.state.fadeIn,
                }]}>
                {this.state.currentIndex == index && (
                  <View
                    style={style.descTextContainer}>
                    <Text
                      style={style.titleTextStyle}>
                      {item.title}
                    </Text>
                    <Text
                      style={style.descTextStyle}>
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
      { currentIndex: index, fadeIn: new Animated.Value(0), scrolling: false },
      () => {
        Animated.timing(this.state.fadeIn, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }).start();
      },
    );
  };

  fadeOut() {
    Animated.timing(this.state.fadeIn, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true
    }).start();
  }

  get pagination() {
    let activeSlide = this.state.currentIndex;
    return (
      <Pagination
        dotsLength={this.images.length}
        activeDotIndex={activeSlide}
        containerStyle={Colors.transparent}
        dotStyle={style.dotStyle}
        inactiveDotStyle={style.inactiveDotStyle}
        inactiveDotOpacity={1.0}
        inactiveDotScale={1.0}
      />
    );
  }

  render() {
    return (
      <View style={style.flexContainer}>
        <SafeAreaView
          style={style.statusBarConstainer}
        />
        <SafeAreaView
          style={style.mainContainer}>
          <StatusBar
            barStyle={Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
            backgroundColor={Colors.NewThemeColor}
          />
          <View
            style={style.container}>
            <View
              style={style.absoluteView}
            />
            <Image
              source={app_intro_msm}
              style={style.appIntroImageStyle}></Image>
            <Carousel
              data={this.images}
              renderItem={(item: any) => this.renderAppIntro(item)}
              // contentContainerCustomStyle={{alignItems: 'center', justifyContent: 'center', width:'100%'}}
              onSnapToItem={(i: any) => this.fadeIn(i)}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width}
              slideStyle={{ width: Dimensions.get('window').width, flex: 1 }}
              inactiveSlideOpacity={1}
              removeClippedSubviews={false}
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
                this.setState({ scrolling: true, fadeIn: new Animated.Value(1) })
              }
            />
            <View style={style.paginationContainer}>
              {this.pagination}
            </View>
            {this.state.currentIndex == this.images.length - 1 && (
              <View style={style.startButtonContainer}>
                <TouchableHighlight
                  underlayColor={Colors.touchableunderlayColor}
                  onPress={() => this.onDoneTap()}
                  style={style.startButtonStyle}>
                  <Text
                    style={style.startTextStyle}>
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
