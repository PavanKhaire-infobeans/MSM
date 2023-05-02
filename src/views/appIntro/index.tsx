import React, {useState} from 'react';
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
import {Pagination} from 'react-native-snap-carousel';
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

const AppIntro = props => {
  const images = [
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const onDoneTap = () => {
    DefaultPreference.set('hide_app_intro', 'true').then(function () {});
    props.navigation.replace('prologue');
  };

  const renderAppIntro = ({item, index}) => {
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
                  style={[style.AnimatedViewStyle, style.imangeconatinerStyle]}>
                  <Image
                    source={item.image}
                    style={[
                      style.ScrollImagesStyle,
                      {
                        resizeMode: index == 1 ? 'stretch' : 'contain',
                      },
                    ]}></Image>
                </View>
              </View>
              <View style={style.emptyView} />
            </View>
            <View style={style.descriptionContainer}>
              <View style={[style.descriptionAnimatedViewStyle]}>
                <View style={style.descTextContainer}>
                  <Text style={style.titleTextStyle}>{item.title}</Text>
                  <Text style={style.descTextStyle}>{item.description}</Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const pagination = () => {
    let activeSlide = currentIndex;
    return (
      <Pagination
        dotsLength={images.length}
        activeDotIndex={activeSlide}
        containerStyle={Colors.transparent}
        dotStyle={style.dotStyle}
        inactiveDotStyle={style.inactiveDotStyle}
        inactiveDotOpacity={1.0}
        inactiveDotScale={1.0}
      />
    );
  };

  const onScroll = (e: any) => {
    let page = Math.ceil(
      e.nativeEvent.contentOffset.x / Dimensions.get('window').width,
    );
    if (page !== currentIndex) {
      if (page >= images.length) {
        page = images.length - 1;
      }
      setCurrentIndex(page);
    }
  };

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
          <Image source={app_intro_msm} style={style.appIntroImageStyle} />
          <FlatList
            data={images}
            initialNumToRender={images.length}
            removeClippedSubviews={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={renderAppIntro}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_item, index) => index + ''}
            onScroll={onScroll}
          />
          <View style={style.paginationContainer}>{pagination()}</View>
          {currentIndex == images.length - 1 && (
            <View style={style.startButtonContainer}>
              <TouchableHighlight
                underlayColor={Colors.touchableunderlayColor}
                onPress={onDoneTap}
                style={style.startButtonStyle}>
                <Text style={style.startTextStyle}>Start</Text>
              </TouchableHighlight>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AppIntro;
