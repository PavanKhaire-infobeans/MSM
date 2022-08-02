import React from 'react';
import {
  Animated, Dimensions, Image, Modal, Platform, SafeAreaView,
  TouchableHighlight, TouchableOpacity, View
} from 'react-native';
import { Props } from '../../login/loginController';
//@ts-ignore
import Carousel from 'react-native-snap-carousel';
import TextNew from '../../../common/component/Text';
import { Colors, fontFamily, fontSize } from '../../../common/constants';
import {
  arrow1, arrow2, arrow5, close_guide_tour
} from '../../../images';
import Styles from './styles';

export default class MindPopIntro extends React.Component<Props> {
  _carousal: any;
  state = {
    fadeIn: new Animated.Value(1),
    currentIndex: 0,
    scrolling: false,
  };
  width = Dimensions.get('window').width;
  height = Dimensions.get('window').height;
  mindPopIntro = [
    {
      title: 'Capture Mindpop',
      desc: 'Write down enough to jog your memory when you have time to flesh out the full story',
    },
    {
      title: 'Upload Media',
      desc: 'Add photos and videos that help tell your story\n \nRecord an audio file to get more thoughts down',
    },
    {
      title: 'Convert to Memory ',
      desc: 'Easily convert your MindPop to a Memory Draft and fill in more details',
    },
  ];

  circleStyles = [
    {
      borderRadius: 1500,
      position: 'absolute',
      left: -1050 + this.width * 0.16,
      top: -910,
      width: 2080,
      height: 2080,
      backgroundColor: 'transparent',
      borderWidth: 1000,
      borderColor: 'rgba(0, 0, 0, 0.7)',
    },
    {
      borderRadius: 1500,
      position: 'absolute',
      left:
        this.height == 812 || this.height == 667
          ? -730
          : this.height == 816
            ? -670
            : -760 + this.width * 0.16,
      bottom:
        this.height > 736 && this.height < 812
          ? -740
          : this.height == 812 || this.height == 736
            ? -840
            : this.height > 812 && this.height < 889
              ? -730
              : this.height > 890
                ? -790
                : -860,
      width: 2080,
      height: 2080,
      backgroundColor: 'transparent',
      borderWidth: 1000,
      borderColor: 'rgba(0, 0, 0, 0.7)',
    },
    {
      borderRadius: 1500,
      position: 'absolute',
      left: -970,
      bottom:
        this.height > 736 && this.height < 811
          ? -840
          : this.height == 816
            ? -820
            : -970,
      width: 2100,
      height: 2100,
      backgroundColor: 'transparent',
      borderWidth: 1000,
      borderColor: 'rgba(0, 0, 0, 0.6)',
    },
  ];
  arrowStyles = [
    { position: 'absolute', imageSource: arrow2, top: 150, left: 110 },
    {
      position: 'absolute',
      imageSource: arrow5,
      bottom:
        this.height > 736 && this.height < 812
          ? 360
          : this.height == 812 || this.height == 736
            ? 300
            : this.height > 812 && this.height < 889
              ? 350
              : this.height > 890
                ? 320
                : 250,
      left: this.height == 812 || this.height == 667 ? 260 : 300,
    },
    {
      position: 'absolute',
      imageSource: arrow1,
      bottom:
        this.height > 736 && this.height < 812
          ? 280
          : this.height == 816
            ? 300
            : 150,
      left: 60,
    },
  ];

  viewStyle = [
    { position: 'absolute', width: this.width - 130, top: 210, left: 70 },
    {
      position: 'absolute',
      width: this.width - 110,
      top:
        this.height > 736 && this.height < 812
          ? 230
          : this.height > 812 && this.height < 889
            ? 250
            : this.height > 890
              ? 280
              : 200,
      left: 40,
    },
    {
      position: 'absolute',
      width: this.width - 130,
      top:
        this.height > 736 && this.height < 812
          ? 250
          : this.height > 812 && this.height < 889
            ? 250
            : this.height > 890
              ? 420
              : 250,
      left: 100,
    },
  ];

  constructor(props: Props) {
    super(props);
    //414 and 411
    // height 896 683 776 816
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

  fadeOut = () => {
    Animated.timing(this.state.fadeIn, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  componentDidMount() { }

  renderAppIntro = (item: any) => {
    let index = item.index;
    return (
      <Animated.View
  
    style={[Styles.AppIntroContainer,{
          opacity: this.state.fadeIn,
        }]}>
        {this.state.currentIndex == index && (
          <View style={Styles.currentIndexStyle}>
            {index != this.mindPopIntro.length - 1 && (
              <TouchableOpacity
                style={Styles.closeGuideButton}
                onPress={() => this.props.cancelMindPopIntro()}>
                <Image source={close_guide_tour} />
              </TouchableOpacity>
            )}
            <View style={this.circleStyles[index]}></View>
            <View style={this.arrowStyles[index]}>
              <Image source={this.arrowStyles[index].imageSource}></Image>
            </View>
            <View style={this.viewStyle[index]}>
              <TextNew
                style={{ ...fontSize(24), color: Colors.white, fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium, fontWeight: '500' }}>
                {item.item.title}
              </TextNew>
              <TextNew
                style={Styles.descTextStyle}>
                {item.item.desc}
              </TextNew>
              <View style={Styles.circleContainer}>
                {this.circleStyles.map((obj: any, index1: any) => {
                  return (
                    <View
                      style={[Styles.circleStyle,{
                        backgroundColor: index1 <= index ? Colors.white : 'rgba(144, 144, 144, 0.85)',
                      }]}
                    />
                  );
                })}
              </View>
              <View style={Styles.circleContainer}>
                <TouchableHighlight
                  underlayColor={'transparent'}
                  onPress={() => {
                    if (index != 0) {
                      this._carousal.snapToPrev();
                    }
                  }}
                  style={Styles.buttonhighLightStyle}>
                  <View
                    style={Styles.prevContainer}>
                    <TextNew
                      style={[Styles.prevText,{
                        color: index == 0 ? '#c4c4c4' : Colors.NewYellowColor,
                      }]}>
                      Prev
                    </TextNew>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  underlayColor={'transparent'}
                  style={Styles.nextButton}
                  onPress={() => {
                    if (index != this.mindPopIntro.length - 1) {
                      // this.fadeOut();
                      // setTimeout(() => {
                      // 	this.fadeIn(index+1)
                      // }, 200);
                      this._carousal.snapToNext();
                    } else {
                      this.props.cancelMindPopIntro();
                    }
                  }}>
                  <View
                    style={[Styles.prevContainer,{
                      backgroundColor: Colors.NewYellowColor,
                    }]}>
                    <TextNew
                      style={Styles.nextText}>
                      {index != this.mindPopIntro.length - 1 ? 'Next' : 'Done'}
                    </TextNew>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        )}
      </Animated.View>
    );
  };
  render() {
    return (
      <Modal transparent>
        <SafeAreaView
          style={Styles.safeAreaContainer}>
          <Carousel
            ref={(c: any) => {
              this._carousal = c;
            }}
            data={this.mindPopIntro}
            renderItem={(item: any) => this.renderAppIntro(item)}
            onSnapToItem={(i: any) => this.fadeIn(i)}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width}
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
              this.setState({ scrolling: true, fadeIn: new Animated.Value(1) })
            }
          />
        </SafeAreaView>
      </Modal>
    );
  }
}
