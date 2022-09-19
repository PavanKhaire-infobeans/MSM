import React from 'react';
import {
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../../../common/component/Text';
import {Colors, fontFamily, fontSize} from '../../../common/constants';
//@ts-ignore
import {close_white_, default_placeholder} from '../../../images';
//@ts-ignore
// import ImageViewerWithZoom from 'react-native-image-zoom-viewer';
import ImageViewerWithZoom from '../../../common/component/ImageZoomViewer/src/index';
//@ts-ignore
import Utility from '../../../common/utility';
import Styles from './styles';
type Props = {[x: string]: any};
type State = {[x: string]: any};

const images = [
  {
    // Simplest usage.
    url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',

    // width: number
    // height: number
    // Optional, if you know the image size, you can set the optimization performance

    // You can pass props to <Image />.
    props: {
      // headers: ...
    },
  },
  {
    // Simplest usage.
    url: 'https://sample-videos.com/img/Sample-jpg-image-5mb.jpg',

    // width: number
    // height: number
    // Optional, if you know the image size, you can set the optimization performance

    // You can pass props to <Image />.
    props: {
      // headers: ...
    },
  },
  {
    // Simplest usage.
    url: 'https://sample-videos.com/img/Sample-jpg-image-2mb.jpg',

    // width: number
    // height: number
    // Optional, if you know the image size, you can set the optimization performance

    // You can pass props to <Image />.
    props: {
      // headers: ...
    },
  },
];
var currentIndex = 0;
export default class ImageViewer extends React.Component<Props> {
  state: State = {
    viewDetails: false,
    activeSlide: 0,
  };
  constructor(props: Props) {
    super(props);
    let activeSlideNumber = this.props?.route?.params?.index ? this.props?.route?.params?.index : 0;
    currentIndex = this.props?.route?.params?.index ? this.props?.route?.params?.index : 0;
    this.setState({
      activeSlide: activeSlideNumber,
    });
  }

  componentDidMount() {
    let activeSlideNumber = this.props?.route?.params?.index ? this.props?.route?.params?.index : 0;
    this.setState({
      activeSlide: activeSlideNumber,
    });
  }

  cancelAction = () => {
    Keyboard.dismiss();
    this.props.navigation.goBack();
  };

  renderLoadingImage = () => {
    return (
      <View style={Styles.renderLoadingImagecontainer}>
        {/* <ImageZoom cropWidth={Dimensions.get('window').width}
                         cropHeight={Dimensions.get('window').height-100}
                         imageWidth={Dimensions.get('window').width}
                         imageHeight={Dimensions.get('window').height-200}
                         > */}
        {/* <PlaceholderImageView uri= {item.item.url ? item.item.url  : item.item.filePath} style={{height: "100%", width: "100%"}} resizeMode='center'/>                          */}
        {/* </ImageZoom>               */}
        {/* {this.state.viewDetails && <View style={{backgroundColor :  "rgba(0, 0, 0, 0.7)", position: "absolute", width:"100%", bottom: 0, left: 0, padding: 15}}> 
                <Text style={{...fontSize(16), fontWeight: "500", color: "#D3D3D3", marginBottom: 10}}>{item.item.file_title}</Text>
                <Text style={{...fontSize(14), color: "#D3D3D3"}}>{item.item.file_description}</Text>
              </View>} */}
        <Image source={default_placeholder} />
      </View>
    );
  };
  onChange = (index: number) => {
    // Alert.alert(index+"");
    if (index != undefined && index != null) {
      this.setState({activeSlide: index}, () => {
        currentIndex = index;
      });
    }
  };
  changeViewVisibility = () => {
    let viewVisibility = !this.state.viewDetails;
    this.setState({
      viewDetails: viewVisibility,
    });
  };

  checkIfDescriptionIsDisabled = () => {
    if (
      (this.props?.route?.params?.files[this.state.activeSlide].file_description &&
        this.props?.route?.params?.files[this.state.activeSlide].file_description.length > 0) ||
      (this.props?.route?.params?.files[this.state.activeSlide].file_title &&
        this.props?.route?.params?.files[this.state.activeSlide].file_title.length > 0) ||
      (this.props?.route?.params?.files[this.state.activeSlide].description &&
        this.props?.route?.params?.files[this.state.activeSlide].description.length > 0) ||
      (this.props?.route?.params?.files[this.state.activeSlide].title &&
        this.props?.route?.params?.files[this.state.activeSlide].title.length > 0)
    ) {
      return true;
    }
    return false;
  };
  render() {
    //showConsoleLog(ConsoleType.LOG,this.props.files);
    var urls: any[];
    urls = [];
    for (let fl of this.props?.route?.params?.files) {
      if (fl.thumbnail_large_url) {
        fl.url = fl.thumbnail_large_url;
      }
      let url = {url: fl.url ? fl.url : fl.filePath};
      urls.push(url);
    }
    return (
      <View style={Styles.container}>
        <SafeAreaView style={Styles.subContainer}>
          {/* <Carousel                        
                        data={this.props.files}
                        renderItem={this.renderItem.bind(this)}
                        sliderWidth={Dimensions.get('window').width}
                        itemWidth={Dimensions.get('window').width}
                        onSnapToItem={(index: any) => this.setState({ activeSlide: index }) }
                        firstItem={this.props.index}
                        style={{top: 0, position:"absolute", backgroundColor:"red", height: "100%", width:"100%"}}
                      />                             */}
          {/* <Modal visible={true} transparent={true}> */}
          <StatusBar
            barStyle={
              Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
            }
          />

          <ImageViewerWithZoom
            style={Styles.ImageViewerWithZoomStyle}
            imageUrls={urls}
            index={currentIndex}
            loadingRender={this.renderLoadingImage.bind(this)}
            onMove={data => {}}
            onChange={this.onChange.bind(this)}
            enablePreload={true}
            saveToLocalByLongPress={false}
            onSwipeDown={() => this.props.navigation.goBack()}
            enableSwipeDown={true}
            // pageAnimateTime = {0.05}
          />
          {this.state.viewDetails && (
            <View style={Styles.viewDetailsContainer}>
              <ScrollView>
                <Text style={Styles.fileTitle}>
                  {this.props?.route?.params?.files[this.state.activeSlide].file_title}
                </Text>
                <Text style={Styles.fileDesc}>
                  {this.props?.route?.params?.files[this.state.activeSlide].file_description}
                </Text>
              </ScrollView>
            </View>
          )}
          {/* <View style={{backgroundColor :  "#44000000", opacity: 0.7, width:"100%", bottom: 0, left: 0, padding: 15}}>  */}
          {/* <Text style={{...fontSize(16), fontWeight: "500", color: "#D3D3D3", backgroundColor :  "#00000099", marginBottom: 10}}>{this.props.files[this.state.activeSlide].file_title}</Text>
                              <Text style={{...fontSize(14), backgroundColor :  "#00000099", color: "#D3D3D3"}}>{this.props.files[this.state.activeSlide].file_description}</Text> */}
          {/* </View>} */}
          {!this.props.hideDescription && (
            <View style={Styles.hideDescriptionContainer}>
              <Text style={Styles.fileStext}>
                {this.props?.route?.params?.files.length > 1
                  ? this.state.activeSlide + 1 + '/' + this.props?.route?.params?.files.length
                  : ''}
              </Text>
              <TouchableOpacity
                onPress={() => this.changeViewVisibility()}
                disabled={!this.checkIfDescriptionIsDisabled()}>
                <Text
                  style={[
                    Styles.fileStext,
                    {
                      color: this.checkIfDescriptionIsDisabled()
                        ? Colors.ThemeColor
                        : Colors.grayColor,
                    },
                  ]}>
                  {'Description'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={Styles.closeContainer}>
            <TouchableOpacity onPress={() => this.cancelAction()}>
              <Image source={close_white_} style={Styles.closeImageStyle} />
            </TouchableOpacity>
          </View>

          {/* </Modal> */}
        </SafeAreaView>
      </View>
    );
  }
}
