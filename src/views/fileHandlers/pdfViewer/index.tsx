import React from 'react';
import { Dimensions, Image, Keyboard, SafeAreaView, StatusBar, TouchableOpacity, View } from 'react-native';

import { ToastMessage } from '../../../common/component/Toast';
//@ts-ignore
import Pdf from 'react-native-pdf';
import { Colors, decode_utf8 } from '../../../common/constants';
import Utility from '../../../common/utility';
import Styles from './styles';
import { close_white_ } from '../../../images';
type Props = { [x: string]: any };
type State = { [x: string]: any };
export default class PDFViewer extends React.Component<Props> {
  state: State = {
    loading: true,
  };
  constructor(props: Props) {
    super(props);
  }

  cancelAction = () => {
    Keyboard.dismiss();
    if (this.props.route.params.doNotReload) {
      this.props.route.params.doNotReload(true);
    }
    this.props.navigation.goBack();
  };

  render() {
    let filePath = this.props?.route?.params?.file.url
      ? this.props?.route?.params?.file.url
      // ? unescape(this.props?.route?.params?.file.url)
      : this.props?.route?.params?.file.filePath;
    if (filePath.indexOf('file://') > -1) {
      filePath = decode_utf8(filePath);
      console.log("source >>",JSON.stringify(filePath))
    }
    let source = { uri: filePath, cache: false };

    // if(this.props?.route?.params?.file.isLocal){
    //     source = {uri:filePath,cache:true};
    // }
    return (
      <SafeAreaView style={Styles.container}>
        <StatusBar
          barStyle={
            Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
          }
        />
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
          onLoadComplete={(numberOfPages, filePath) => {
            //showConsoleLog(ConsoleType.LOG,`number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            //showConsoleLog(ConsoleType.LOG,`current page: ${page}`);
          }}
          onError={error => {
            //showConsoleLog(ConsoleType.LOG,error);
            // setTimeout(() => this.cancelAction(), 3000);
            //ToastMessage('This pdf file is corrupted', Colors.ErrorColor);
          }}
          style={Styles.pdfStyle}
        />
        <View
          style={{
            backgroundColor: '#595959',
            height: 40,
            width: 40,
            top: 30,
            borderRadius: 20,
            position: 'absolute',
            right: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity activeOpacity={1} onPress={this.cancelAction}>
            <Image source={close_white_} style={{ padding: 16 }} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
