import React from 'react';
import {
  TouchableHighlight,
  ViewStyle,
  Platform,
  View,
  Dimensions,
} from 'react-native';
import Text from '../Text';
//@ts-ignore
import EStyleSheet from 'react-native-extended-stylesheet';
import {Size, Colors, fontSize} from '../../constants';
//@ts-ignore
import Carousel, {Pagination} from 'react-native-snap-carousel';
type Props = {
  data: any;
  onAddToMemory?: (activeIndex: any) => void;
};

type State = {activeIndex: Number};
export let promptCarousel = {};
// export default class Prompt extends React.Component<Props, State> {
//   state = {
//     activeIndex: 0
//   }

//   render() {
//     <View>
//       <Carousel
// 						data={this.images}
// 						renderItem={(item : any ) => this.renderAppIntro(item)}
// 						onSnapToItem={(i : any )=> this.fadeIn(i)}
// 						sliderWidth={Dimensions.get('window').width}
// 						itemWidth={Dimensions.get('window').width}
// 						slideStyle={{ width: Dimensions.get('window').width, flex : 1}}
// 						inactiveSlideOpacity={1}
// 						inactiveSlideScale={1}
// 						useScrollView={false}
// 						onScroll={(event: any)=>{
// 							if(this.state.scrolling){
// 								this.setState({
// 									fadeIn : new Animated.Value(1 - Math.abs(this.state.currentIndex - event.nativeEvent.contentOffset.x/Dimensions.get('window').width))
// 								})
// 							}

// 						}}
// 						onScrollBeginDrag={()=> this.setState({scrolling: true, fadeIn : new Animated.Value(1)})}/>
//     </View>

//   }
// }

export default class Prompts extends React.Component<Props, State> {
  state: State = {
    activeIndex: 0,
  };

  get pagination() {
    let activeSlide = this.state.activeIndex;
    return (
      <Pagination
        dotsLength={this.props.data.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          backgroundColor: 'transparent',
          marginTop: -35,
          marginBottom: -15,
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: -5,
          backgroundColor: '#fff',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.7}
      />
    );
  }

  render() {
    return (
      <View>
        <Carousel
          ref={(ref: any) => (promptCarousel = ref)}
          data={this.props.data}
          extraData={this.state}
          renderItem={(item: any) => (
            <View
              style={{
                width: '100%',
                padding: 16,
                paddingTop: 0,
                alignItems: 'center',
                height: 100,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  margin: 1,
                  textAlign: 'center',
                  ...fontSize(22),
                  color: '#fff',
                }}
                numberOfLines={3}>
                {item.item?.prompt_title}
              </Text>
            </View>
          )}
          onSnapToItem={(i: any) => this.setState({activeIndex: i})}
          sliderWidth={Dimensions.get('window').width - 50}
          itemWidth={Dimensions.get('window').width - 50}
          slideStyle={{width: Dimensions.get('window').width - 50, flex: 1}}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          useScrollView={false}
        />
        {this.pagination}
        <TouchableHighlight
          underlayColor={'none'}
          onPress={() => {
            this.props.onAddToMemory(this.state.activeIndex);
            if (
              this.state.activeIndex == this.props.data.length - 1 &&
              this.state.activeIndex != 0
            ) {
              this.setState({activeIndex: this.state.activeIndex - 1});
            }
          }}>
          <View
            style={{
              width: 200,
              padding: 10,
              borderRadius: 50,
              borderColor: '#fff',
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <Text style={{...fontSize(18), color: '#fff', fontWeight: '400'}}>
              Add your memory
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}
