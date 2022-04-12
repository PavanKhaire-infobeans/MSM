import {
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';
import {Actions} from 'react-native-router-flux';
import {Colors, fontSize} from '../../common/constants';
import NavigationThemeBar from '../../common/component/navigationBarForEdit/navigationBarWithTheme';
import {pdf_icon, icon_collaborators, close_white} from '../../images';
import AccessoryView from '../../common/component/accessoryView';
import Text from '../../common/component/Text';
import NavigationBar from '../dashboard/NavigationBar';
import {TabItems} from '../../common/component/TabBarIcons';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
type Props = {[x: string]: any};

export default class CommonWebView extends React.Component<Props> {
  _webView: WebView;
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {}

  renderLoader = () => {
    return (
      <ActivityIndicator
        color={Colors.NewThemeColor}
        size="large"
        style={{flex: 6, justifyContent: 'center'}}
      />
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView
          style={{
            width: '100%',
            flex: 0,
            backgroundColor: Colors.NewThemeColor,
          }}
        />
        <SafeAreaView style={{width: '100%', flex: 1, backgroundColor: '#fff'}}>
          <View style={{flex: 1}}>
            <StatusBar
              barStyle={'dark-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            {/* <NavigationBar title={TabItems.AllMemories}/>             */}
            <WebView
              useWebKit={true}
              ref={ref => (this._webView = ref)}
              source={{uri: this.props.url}}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              renderLoading={this.renderLoader}
              startInLoadingState={true}
              injectedJavaScript={
                "document.cookie = 'show_hide_header_footer=" +
                true +
                "; path=/'"
              }
            />
            <View style={{width: '100%', position: 'absolute', top: 0}}>
              <NavigationHeaderSafeArea
                backgroundColor={Colors.NewThemeColor}
                hideClose={false}
                heading={this.props.title}
                cancelAction={() => {
                  Keyboard.dismiss();
                  if (this.props.deepLinkBackClick) {
                    Actions.dashBoard();
                  } else {
                    Actions.pop();                    
                  }
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
