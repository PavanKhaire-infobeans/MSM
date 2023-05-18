import React from 'react';
import {
  Dimensions, Image
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
const { height } = Dimensions.get('screen');
//@ts-ignore
import Carousel from 'react-native-snap-carousel';
import styles from './styles';

export type ActionSheetItem = {
  key: any;
  title: string;
  discription: string;
  url: string;
};

type Props = { actions: Array<ActionSheetItem> };

const ImageViewer = (props: Props) => {

  const renderItem = () => {
    <ImageZoom
      cropWidth={Dimensions.get('window').width}
      cropHeight={Dimensions.get('window').height}
      imageWidth={200}
      imageHeight={200}>
      <Image
        style={styles.imageStyle}
        source={{
          uri: 'http://v1.qzone.cc/avatar/201407/07/00/24/53b9782c444ca987.jpg!200x200.jpg',
        }}
      />
    </ImageZoom>;
  };

  let deviceWidth = Dimensions.get('window').width;
  return (
    <Carousel
      data={props.actions}
      renderItem={renderItem}
      sliderWidth={deviceWidth}
      itemWidth={deviceWidth}
    />
  );
}
ImageViewer.defaultProps = {
  actions: [],
};

export default ImageViewer;