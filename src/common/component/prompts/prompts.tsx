import React from 'react';
import {
  Dimensions, FlatList, TouchableHighlight,
  View
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Text from '../Text';
// import Carousel from 'react-native-reanimated-carousel';
import Styles from './styles';
type Props = {
  data: any;
  onAddToMemory?: (activeIndex: any) => void;
};

type State = { activeIndex: Number };
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
        containerStyle={Styles.paginationContainerStyle}
        dotStyle={Styles.dotStyle}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.7}
      />
    );
  }

  renderAppIntro = (item: any) => {
    item = item.item;
    return (
      <View
        style={Styles.carouselContainer}>
        <Text
          style={Styles.promptTextStyle}
          numberOfLines={3}>
          {item?.prompt_title}
        </Text>
      </View>
    )
  }

  onScroll(e: any) {
    let page = Math.ceil(e.nativeEvent.contentOffset.x / (Dimensions.get('window').width-48));
    if (page !== this.state.activeIndex) {
      if (page >= this.props.data.length) {
        page = this.props.data.length - 1;
      }
      this.setState({
        activeIndex: page
      })
    }
  }

  render() {
    return (
      <View>
        <FlatList
              data={this.props.data}
              initialNumToRender={this.props.data.length}
              renderItem={this.renderAppIntro}
              horizontal={true}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_item, index) => index + ''}
              onScroll={(e) => this.onScroll(e)}
            />
        {this.pagination}
        <TouchableHighlight
          underlayColor={'none'}
          onPress={() => {
            const {activeIndex} = this.state
            this.props.onAddToMemory(activeIndex);
            if (
              activeIndex == this.props.data.length - 1 &&
              activeIndex != 0
            ) {
              this.setState({ activeIndex: activeIndex - 1 });
            }
          }}>
          <View
            style={Styles.buttonContainer}>
            <Text style={Styles.buttonTextColor}>
              Add your memory
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}
