import React from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  TouchableHighlight,
  View,
} from 'react-native';
import DefaultPreference from 'react-native-default-preference';

import Carousel, {Pagination} from 'react-native-snap-carousel';
import Text from '../../common/component/Text';
import {Colors} from '../../common/constants';
import Utility from '../../common/utility';
import {
  appIntro1,
  appIntro2,
  appIntro3,
  appIntro4,
  appIntroBg,
  app_intro_msm,
} from '../../images';
import style from './styles';
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
    currentIndex: 0,
    fadeInOut: new Animated.Value(1),
  };

  onDoneTap = () => {
    DefaultPreference.set('hide_app_intro', 'true').then(function () {});
    this.props.navigation.replace('prologue');
  };

  renderAppIntro = ({item, index}) => {
    // let index = item.index;
    // item = item.item;
    return (
      <View style={style.renderAppIntroContainer}>
        <ImageBackground source={item.background} style={style.flexContainer}>
          <View style={style.imageBgContainer}>
            <View style={style.imageBgSubContainer}>
              <Image source={item.background1} style={style.imageStyle}></Image>
            </View>
            <View style={style.containtContainerStyle}>
              <View style={style.animatedViewContainer}>
                <View
                  style={[
                    style.AnimatedViewStyle,
                    style.imangeconatinerStyle,
                    {
                      // opacity: this.state.fadeInOut
                    },
                  ]}>
                  {/* {this.state.currentIndex == index && ( */}
                  <Image
                    source={item.image}
                    style={[
                      style.ScrollImagesStyle,
                      {
                        resizeMode: index == 1 ? 'stretch' : 'contain',
                      },
                    ]}></Image>
                  {/* )} */}
                </View>
              </View>
              <View style={style.emptyView}></View>
            </View>

            <View style={style.descriptionContainer}>
              <View style={[style.descriptionAnimatedViewStyle]}>
                {/* {this.state.currentIndex === index && ( */}
                <View style={style.descTextContainer}>
                  <Text style={style.titleTextStyle}>{item.title}</Text>
                  <Text style={style.descTextStyle}>{item.description}</Text>
                </View>
                {/* )} */}
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

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

  fadeIn = () => {
    this.setState({fadeIn: new Animated.Value(0)}, () => {
      Animated.timing(this.state.fadeIn, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    });
  };

  fadeOut() {
    Animated.timing(this.state.fadeIn, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }

  onScroll(e: any) {
    let page = Math.ceil(
      e.nativeEvent.contentOffset.x / Dimensions.get('window').width,
    );
    if (page !== this.state.currentIndex) {
      if (page >= this.images.length) {
        page = this.images.length - 1;
      }
      this.setState({
        currentIndex: page,
      });
    }
  }

  render() {
    return (
      <View style={style.flexContainer}>
        <SafeAreaView style={style.statusBarConstainer} />
        <SafeAreaView style={style.mainContainer}>
          <StatusBar
            barStyle={
              Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
            }
            backgroundColor={Colors.NewThemeColor}
          />
          <View style={style.container}>
            <View style={style.absoluteView} />
            <Image
              source={app_intro_msm}
              style={style.appIntroImageStyle}></Image>
            <FlatList
              data={this.images}
              initialNumToRender={this.images.length}
              renderItem={this.renderAppIntro}
              horizontal={true}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_item, index) => index + ''}
              onScroll={e => this.onScroll(e)}
            />
            <View style={style.paginationContainer}>{this.pagination}</View>
            {this.state.currentIndex == this.images.length - 1 && (
              <View style={style.startButtonContainer}>
                <TouchableHighlight
                  underlayColor={Colors.touchableunderlayColor}
                  onPress={() => this.onDoneTap()}
                  style={style.startButtonStyle}>
                  <Text style={style.startTextStyle}>Start</Text>
                </TouchableHighlight>
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
