import React from 'react';
import { SafeAreaView, FlatList, View, Image, TouchableOpacity, ImageBackground, Dimensions, StatusBar, Platform, Alert, Keyboard, ScrollView } from "react-native";
import Text from "../../../common/component/Text";
import { Actions } from 'react-native-router-flux';
import { fontSize, Colors } from '../../../common/constants';
import DeviceInfo from 'react-native-device-info';
//@ts-ignore
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { close_white, profile_placeholder, default_placeholder, close_white_ } from '../../../images';
//@ts-ignore
import NavigationHeader from '../../../common/component/navigationHeader';
import PlaceholderImageView from '../../../common/component/placeHolderImageView';
// import ImageViewerWithZoom from 'react-native-image-zoom-viewer';
import ImageViewerWithZoom from '../../../common/component/ImageZoomViewer/src/index';
import { Modal } from 'react-native';
//@ts-ignore
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
type Props = {[x: string] : any}
type State = {[x: string] : any}

const images = [{
  // Simplest usage.
  url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',

  // width: number
  // height: number
  // Optional, if you know the image size, you can set the optimization performance

  // You can pass props to <Image />.
  props: {
      // headers: ...
  }
},{
  // Simplest usage.
  url: 'https://sample-videos.com/img/Sample-jpg-image-5mb.jpg',

  // width: number
  // height: number
  // Optional, if you know the image size, you can set the optimization performance

  // You can pass props to <Image />.
  props: {
      // headers: ...
  }
},{
  
   // Simplest usage.
   url: 'https://sample-videos.com/img/Sample-jpg-image-2mb.jpg',

   // width: number
   // height: number
   // Optional, if you know the image size, you can set the optimization performance
 
   // You can pass props to <Image />.
   props: {
       // headers: ...
   }
}
]
var currentIndex = 0;
export default class ImageViewer extends React.Component<Props> {

  state: State={
    viewDetails: false,
    activeSlide: 0
  }
    constructor(props: Props){
        super(props);
        let activeSlideNumber = this.props.index ? this.props.index : 0;
        currentIndex  = this.props.index ? this.props.index : 0;
        this.setState({ 
          activeSlide : activeSlideNumber
        })
    }

    componentDidMount(){
      let activeSlideNumber = this.props.index ? this.props.index : 0;
      this.setState({ 
          activeSlide : activeSlideNumber
      })
    }

    cancelAction = () =>{
        Keyboard.dismiss();
        Actions.pop();
    }

    renderLoadingImage=()=>{            
      return <View style={{height: "100%", justifyContent: "center", alignItems: "center"}}>
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
              <Image source= {default_placeholder}/>
             </View>
            
    }
    onChange = (index?: number) =>{
      // Alert.alert(index+"");
      this.setState({ activeSlide: index })
      currentIndex = index;
    }
    changeViewVisibility=()=>{
      let viewVisibility = !this.state.viewDetails;
      this.setState({
        viewDetails : viewVisibility
      })
    }

    checkIfDescriptionIsDisabled=()=>{
      if((this.props.files[this.state.activeSlide].file_description && this.props.files[this.state.activeSlide].file_description.length > 0) 
        || this.props.files[this.state.activeSlide].file_title && this.props.files[this.state.activeSlide].file_title.length>0
        || (this.props.files[this.state.activeSlide].description && this.props.files[this.state.activeSlide].description.length > 0) 
        || this.props.files[this.state.activeSlide].title && this.props.files[this.state.activeSlide].title.length>0){
            return true;
      }
      return false;
    }
    render() {
       //console.log(this.props.files);
       var urls : any[];
       urls  = [];
       for (let fl of this.props.files){
         if(fl.thumbnail_large_url){
           fl.url = fl.thumbnail_large_url;
         }
         let url = {url: fl.url ? fl.url  : fl.filePath}
          urls.push(url)
       }
        return ( 
                  <View style={{flex: 1}}>
                  <SafeAreaView style={{backgroundColor: "#000", flex: 1}}>   
                    <View style={{flex:1, backgroundColor: "#000", justifyContent: "center"}}>
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
                        <StatusBar barStyle={'dark-content'} />   

                         <ImageViewerWithZoom 
                          style={{marginBottom : 10, backgroundColor : "transparent"}}
                          imageUrls={urls} index= {currentIndex}
                          loadingRender = {this.renderLoadingImage.bind(this)}
                          onMove={data => {}}
                          onChange = {this.onChange.bind(this)}
                          enablePreload = {true}
                          saveToLocalByLongPress = {false}
                          onSwipeDown={()=> Actions.pop()}
                          enableSwipeDown={true}
                          // pageAnimateTime = {0.05}
                         />
                          {this.state.viewDetails &&
                                <View style={{width: "100%",padding: 15, flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", position: "absolute", bottom: 50, left: 0}}>
                                          <ScrollView>       
                                            <Text style={{...fontSize(16), fontWeight: Platform.OS === "ios"? '500':'bold', color: "#D3D3D3", backgroundColor :  "transparent", marginBottom: 10}}>{this.props.files[this.state.activeSlide].file_title}</Text>
                                            <Text style={{...fontSize(14), backgroundColor :  "transparent", color: "#D3D3D3"}}>{this.props.files[this.state.activeSlide].file_description}</Text>
                                         </ScrollView>       
                                </View>                               
                          }
                          {/* <View style={{backgroundColor :  "#44000000", opacity: 0.7, width:"100%", bottom: 0, left: 0, padding: 15}}>  */}
                              {/* <Text style={{...fontSize(16), fontWeight: "500", color: "#D3D3D3", backgroundColor :  "#00000099", marginBottom: 10}}>{this.props.files[this.state.activeSlide].file_title}</Text>
                              <Text style={{...fontSize(14), backgroundColor :  "#00000099", color: "#D3D3D3"}}>{this.props.files[this.state.activeSlide].file_description}</Text> */}
                          {/* </View>} */}
                         {!this.props.hideDescription && 
                          <View style={{flexDirection:"row", height: 50, width: "100%", backgroundColor: "#fff", justifyContent: "space-between", padding: 15, alignItems: "flex-end"}}>
                            <Text style={{...fontSize(16), color: "#000" }}>{this.props.files.length > 1 ? (this.state.activeSlide+1)+"/"+this.props.files.length : ""}</Text>
                            <TouchableOpacity onPress={()=>this.changeViewVisibility()} disabled={!this.checkIfDescriptionIsDisabled()}>
                                <Text style={{...fontSize(16), color: this.checkIfDescriptionIsDisabled() ? Colors.ThemeColor : "#D3D3D3" }}>{"Description"}</Text>
                            </TouchableOpacity>
                          </View>  
                        }  
                        
                        <View style={{backgroundColor: "#595959", height: 40, width: 40, top: 20, borderRadius: 20, position: "absolute", marginLeft: 20, justifyContent: "center", alignItems: "center"}}>
                          <TouchableOpacity onPress={()=>this.cancelAction()} >
                            <Image source={close_white_} style={{padding: 15}}/>
                          </TouchableOpacity>
                        </View>
                        
                       {/* </Modal> */}
                      </View>  
                </SafeAreaView>   
                </View>            
        );
    }
}