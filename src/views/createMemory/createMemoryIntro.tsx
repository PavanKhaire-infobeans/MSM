import React from 'react';
import { Animated, Dimensions, Image, Modal, View } from 'react-native';
//@ts-ignore
import { Colors } from '../../common/constants';
import {
  add_content_step1,
  add_content_step2,
  add_content_step3
} from '../../images';
//@ts-ignore
import Carousel from 'react-native-snap-carousel';
import { SubmitButton } from '../../common/component/button';
import TextNew from '../../common/component/Text';
import { Props } from '../login/loginController';
import styles from './styles';
export default class CreateMemoryIntro extends React.Component<Props> {
  _carousal: any;
  state = {
    fadeIn: new Animated.Value(1),
    currentIndex: 0,
    scrolling: false,
  };

  createMemoryIntro = [
    {
      title: 'Step 1',
      desc: 'Write your memories and add\n images, videos and voice notes.',
      imageSrc: add_content_step1,
    },
    {
      title: 'Step 2',
      desc: 'Add details to your memory like,\n date, place, who were there etc.',
      imageSrc: add_content_step2,
    },
    {
      title: 'Step 3',
      desc: 'Publish memory so that people\n in your network to relive those\n moments',
      imageSrc: add_content_step3,
    },
  ];

  constructor(props: Props) {
    super(props);
  }

  fadeIn = (index: any) => {
    this.setState(
      {currentIndex: index, fadeIn: new Animated.Value(0), scrolling: false},
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

  renderCreateMemoryIntro = (item: any) => {
    let index = item.index;
    return (
      <View
        key={index}
        style={styles.createMemoryIntroContainer}>
        <TextNew
          style={styles.introTitle}>
          {this.createMemoryIntro[index].title}
        </TextNew>
        <TextNew
          style={styles.introdesc}>
          {this.createMemoryIntro[index].desc}
        </TextNew>
        <Image
          source={this.createMemoryIntro[index].imageSrc}
          style={styles.introImgStyle}
        />
      </View>
    );
  };
  render() {
    return (
      <Modal transparent>
        <View
          style={styles.containerMemoIntro}>
          <View
            style={styles.subContainerMemoIntro}>
            <Carousel
              ref={(c: any) => {
                this._carousal = c;
              }}
              data={this.createMemoryIntro}
              renderItem={(item: any) => this.renderCreateMemoryIntro(item)}
              onSnapToItem={(i: any) => this.fadeIn(i)}
              sliderWidth={Dimensions.get('window').width - 50}
              itemWidth={Dimensions.get('window').width - 50}
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
            <View style={styles.createMemoryIntroStyle}>
              {this.createMemoryIntro.map((obj: any, index1: any) => {
                return (
                  <View
                    key={index1}
                    style={[styles.createMemoryIntroContainerStyle,{
                      backgroundColor: index1 <= this.state.currentIndex ? Colors.BtnBgColor : Colors.newBagroundColor,
                    }]}
                  />
                );
              })}
            </View>
            <SubmitButton
              style={styles.submitBtnStyle}
              text={
                this.state.currentIndex != this.createMemoryIntro.length - 1 ? 'Close': 'Finish'
              }
              onPress={() => this.props.cancelMemoryIntro()}
            />
          </View>
        </View>
      </Modal>
    );
  }
}
