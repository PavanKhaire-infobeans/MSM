import React from 'react';
import {
  Animated, Dimensions, Image, Modal, SafeAreaView,
  TouchableHighlight, TouchableOpacity, View
} from 'react-native';
import { Props } from '../login/loginController';
//@ts-ignore
import Carousel from 'react-native-snap-carousel';
import TextNew from '../../common/component/Text';
import { Colors } from '../../common/constants';
import { arrow2, arrow5, arrow6, arrow7, close_guide_tour } from '../../images';
import Styles from './styles';

export default class MemoryDraftIntro extends React.Component<Props> {
  _carousal: any;
  state = {
    fadeIn: new Animated.Value(1),
    currentIndex: 0,
    scrolling: false,
  };
  width = Dimensions.get('window').width;
  memoryDraftIntro = [
    {
      title: 'Memory Date',
      desc: 'Add the approximate date of when the Memory occurred \n \nThis date is used while displaying your Memory on the Timeline',
    },
    {
      title: 'Location',
      desc: 'Add the location of the Memory\n \nYou can be as specific as the address, or as general as the country',
    },
    {
      title: 'Collaborators ',
      desc: 'If your Memory was shared with others, add collaborators to capture each perspective',
    },
    { title: 'Memory Save', desc: 'Tap Done to save or publish your Memory' },
  ];

  circleStyles = [
    {
      borderRadius: 1500,
      position: 'absolute',
      left: -1060 + this.width * 0.16,
      top: -920,
      width: 2080,
      height: 2080,
      backgroundColor: 'transparent',
      borderWidth: 1000,
      borderColor: 'rgba(0, 0, 0, 0.7)',
    },
    {
      borderRadius: 1500,
      position: 'absolute',
      left: -1050 + this.width * 0.16,
      top: -820,
      width: 2080,
      height: 2080,
      backgroundColor: 'transparent',
      borderWidth: 1000,
      borderColor: 'rgba(0, 0, 0, 0.7)',
    },
    {
      borderRadius: 1500,
      position: 'absolute',
      right: -1015,
      bottom: -1030,
      width: 2100,
      height: 2100,
      backgroundColor: 'transparent',
      borderWidth: 1000,
      borderColor: 'rgba(0, 0, 0, 0.6)',
    },
    {
      borderRadius: 1500,
      position: 'absolute',
      right: -1030 + this.width * 0.16,
      top: -995,
      width: 2080,
      height: 2080,
      backgroundColor: 'transparent',
      borderWidth: 1000,
      borderColor: 'rgba(0, 0, 0, 0.7)',
    },
  ];
  arrowStyles = [
    { position: 'absolute', imageSource: arrow2, top: 150, left: 110 },
    { position: 'absolute', imageSource: arrow6, top: 250, left: 110 },
    { position: 'absolute', imageSource: arrow5, bottom: 90, left: 310 },
    { position: 'absolute', imageSource: arrow7, top: 75, left: 230 },
  ];

  viewStyle = [
    { position: 'absolute', width: this.width - 130, top: 190, left: 70 },
    { position: 'absolute', width: this.width - 110, top: 310, left: 60 },
    { position: 'absolute', width: this.width - 100, bottom: 70, left: 70 },
    { position: 'absolute', width: this.width - 100, top: 150, left: 100 },
  ];

  constructor(props: Props) {
    super(props);
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

  renderAppIntro = (item: any) => {
    let index = item.index;
    return (
      <Animated.View
        style={[Styles.animatedContainer, { opacity: this.state.fadeIn }]}>
        {this.state.currentIndex == index && (
          <View style={[Styles.fullWidth, Styles.fullFlex]}>
            {index != this.memoryDraftIntro.length - 1 && (
              <TouchableOpacity
                style={Styles.closeGuidButtonStyle}
                onPress={() => this.props.cancelMemoryDraftTour()}>
                <Image source={close_guide_tour} />
              </TouchableOpacity>
            )}
            <View style={this.circleStyles[index]}></View>
            <View style={this.arrowStyles[index]}>
              <Image source={this.arrowStyles[index].imageSource}></Image>
            </View>
            <View style={this.viewStyle[index]}>
              <TextNew
                style={Styles.guideTitleTextStyle}>
                {item.item.title}
              </TextNew>
              <TextNew
                style={Styles.guideDescTextStyle}>
                {item.item.desc}
              </TextNew>
              <View style={Styles.createMemoryIntroStyle}>
                {this.circleStyles.map((_obj: any, index1: any) => {
                  return (
                    <View
                      style={[Styles.createMemoryIntroContainerStyle, {
                        backgroundColor: index1 <= index ? Colors.white : Colors.brownrgba,
                      }]}
                    />
                  );
                })}
              </View>
              <View style={Styles.prevContainer}>
                <TouchableHighlight
                  underlayColor={Colors.transparent}
                  onPress={() => {
                    if (index != 0) {
                      // this.fadeOut();
                      // setTimeout(() => {
                      // 	this.fadeIn(index-1)
                      // }, 200);
                      this._carousal.snapToPrev();
                    }
                  }}
                  style={Styles.paddingVerticalStyle}>
                  <View
                    style={Styles.prevBtnContainer}>
                    <TextNew
                      style={[Styles.textStyle18Weight500, {
                        color: index == 0 ? Colors.newBagroundColor : Colors.NewYellowColor,
                      }]}>
                      Prev
                    </TextNew>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  underlayColor={Colors.transparent}
                  style={Styles.memoryDraftIntroButnStyle}
                  onPress={() => {
                    if (index != this.memoryDraftIntro.length - 1) {
                      // this.fadeOut();
                      // setTimeout(() => {
                      // 	this.fadeIn(index+1)
                      // }, 200);
                      this._carousal.snapToNext();
                    } else {
                      this.props.cancelMemoryDraftTour();
                    }
                  }}>
                  <View
                    style={Styles.doneBtnContainer}>
                    <TextNew
                      style={Styles.doneBtnTextStyle}>
                      {index != this.memoryDraftIntro.length - 1 ? 'Next' : 'Done'}
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
          style={Styles.memoryDraftContainer}>
          <Carousel
            ref={(c: any) => {
              this._carousal = c;
            }}
            data={this.memoryDraftIntro}
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
