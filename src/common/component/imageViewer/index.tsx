import React from 'react';
import {
  View,
  Image,
  Animated,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Alert,
  Keyboard,
  Platform,
  StatusBar,
  DeviceEventEmitter,
  TouchableHighlight,
} from 'react-native';
import Text from '../Text';
import DeviceInfo from 'react-native-device-info';
import {fontSize, Colors} from '../../constants';
const {height} = Dimensions.get('screen');
import ImageZoom from 'react-native-image-pan-zoom';
//@ts-ignore
import Carousel from 'react-native-snap-carousel';

export type ActionSheetItem = {
  key: any;
  title: string;
  discription: string;
  url: string;
};

type Props = {actions: Array<ActionSheetItem>};

export default class ImageViewer extends React.Component<Props> {
  static defaultProps: Props = {
    actions: [],
  };

  renderItem = (data: any) => {
    <ImageZoom
      cropWidth={Dimensions.get('window').width}
      cropHeight={Dimensions.get('window').height}
      imageWidth={200}
      imageHeight={200}>
      <Image
        style={{width: 200, height: 200}}
        source={{
          uri: 'http://v1.qzone.cc/avatar/201407/07/00/24/53b9782c444ca987.jpg!200x200.jpg',
        }}
      />
    </ImageZoom>;
  };

  render() {
    let deviceWidth = Dimensions.get('window').width;
    return (
      <Carousel
        data={this.props.actions}
        renderItem={this.renderItem}
        sliderWidth={deviceWidth}
        itemWidth={deviceWidth}
      />
    );
  }
}
