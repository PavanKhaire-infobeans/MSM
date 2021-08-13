import React from 'react';
import { SafeAreaView, Dimensions, StatusBar, Platform, Alert, WebView, ActivityIndicator, Keyboard, Image, View } from "react-native";
import Text from "../../../common/component/Text";
import { Actions } from 'react-native-router-flux';
import {ToastMessage } from '../../../common/component/Toast';
//@ts-ignore
import { close_white, close_white_, profile_placeholder } from '../../../images';
import DeviceInfo from 'react-native-device-info';
import {Colors, decode_utf8} from '../../../common/constants'
import Pdf from 'react-native-pdf';
type Props = {[x: string] : any}
type State = {[x: string] : any}
export default class PDFViewer extends React.Component<Props> {

    state: State={
      loading: true
    }
    constructor(props: Props){
        super(props);       
    }

    cancelAction = () =>{
        Keyboard.dismiss();
        Actions.pop();
    }

    render() {
        let filePath = this.props.file.url ? this.props.file.url : this.props.file.filePath;
        if(filePath.indexOf('file://') > -1 ){
            filePath = decode_utf8(filePath);
        }
        let source={uri: filePath, cache: false}

        // if(this.props.file.isLocal){
        //     source = {uri:filePath,cache:true};
        // }
        
      return ( <SafeAreaView style={{flex: 1, width: "100%", backgroundColor: "#000"}}>   
                    <StatusBar barStyle={'dark-content'}  />                    
                    {/* <WebView 
                        automaticallyAdjustContentInsets={false}
                        source={{uri: 'http://docs.google.com/gview?embedded=true&url='+filePath}}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        decelerationRate="normal"                        
                        startInLoadingState={true}
                        scalesPageToFit={this.state.scalesPageToFit}
                        style={{width:"100%", height: "100%"}}/>      */}
                 <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        //console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        //console.log(`current page: ${page}`);
                    }}
                    onError={(error)=>{
                        //console.log(error);
                        // setTimeout(() => this.cancelAction(), 3000);
                        ToastMessage("This pdf file is corrupted", Colors.ErrorColor)
                    }}
                    style={{flex:1,width:Dimensions.get('window').width,}}/>
                    {/* <View style={{backgroundColor: "#595959", height: 40, width: 40, top: 30, borderRadius: 20, position: "absolute", marginLeft: 20, justifyContent: "center", alignItems: "center"}}>
                          <TouchableOpacity onPress={()=>this.cancelAction()} >
                            <Image source={close_white_} style={{padding: 15}}/>
                          </TouchableOpacity>
                        </View> */}
                </SafeAreaView>               
        );
    }
}