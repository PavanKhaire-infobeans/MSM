import React, { useState } from 'react';
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

const Prompts = (props: Props) => {
  const [state, setState] = useState({
    activeIndex: 0,
  });

  const pagination = () => {
    let activeSlide = state.activeIndex;
    return (
      <Pagination
        dotsLength={props.data.length}
        activeDotIndex={activeSlide}
        containerStyle={Styles.paginationContainerStyle}
        dotStyle={Styles.dotStyle}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.7}
      />
    );
  }

  const renderAppIntro = (item: any) => {
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
    );
  }

  const onScroll = (e: any) => {
    let page = Math.ceil(e.nativeEvent.contentOffset.x / (Dimensions.get('window').width - 48));
    if (page !== state.activeIndex) {
      if (page >= props.data.length) {
        page = props.data.length - 1;
      }
      setState({
        ...state,
        activeIndex: page
      })
    }
  }

  return (
    <View>
      <FlatList
        data={props.data}
        initialNumToRender={props.data.length}
        renderItem={renderAppIntro}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_item, index) => index + ''}
        onScroll={(e) => onScroll(e)}
      />
      {pagination()}
      <TouchableHighlight
        underlayColor={'none'}
        onPress={() => {
          const { activeIndex } = state
          props.onAddToMemory && props.onAddToMemory(activeIndex);
          if (
            activeIndex == props.data.length - 1 &&
            activeIndex != 0
          ) {
            setState({ activeIndex: activeIndex - 1 });
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

export default Prompts;