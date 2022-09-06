import React from 'react';
import {
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';

import WebView from 'react-native-webview';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import {Colors} from '../../common/constants';
import Utility from '../../common/utility';
import Styles from './styles';
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
        style={Styles.activityIndicatorStyle}
      />
    );
  };

  render() {
    return (
      <View style={Styles.container}>
        <SafeAreaView style={Styles.noViewStyle} />
        <SafeAreaView style={Styles.safeAreaContextStyle}>
          <View style={Styles.container}>
            <StatusBar
              barStyle={
                Utility.currentTheme == 'light'
                  ? 'dark-content'
                  : 'light-content'
              }
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
            <View style={Styles.navigatopnHeaderContainer}>
              <NavigationHeaderSafeArea
                backgroundColor={Colors.NewThemeColor}
                hideClose={false}
                heading={this.props.title}
                cancelAction={() => {
                  Keyboard.dismiss();
                  if (this.props.deepLinkBackClick) {
                    this.props.navigation.dashBoard();
                  } else {
                    this.props.navigation.goBack();
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
