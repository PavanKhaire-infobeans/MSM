import React from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Text from '../../common/component/Text';
import {Colors} from '../../common/constants';
import {close_white, icon_collaborators} from '../../images';
//@ts-ignore
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import Utility from '../../common/utility';
import Styles from './styles';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';

type State = {[x: string]: any};
type Props = {[x: string]: any};

export default class EtherPadEditing extends React.Component<Props, State> {
  state: State = {
    bottomToolbar: 0,
    showWarningNote: true,
  };

  keyboardDidShowListener: any;
  keyboardDidHideListener: any;

  constructor(props: Props) {
    super(props);
    if (Platform.OS == 'android') {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._keyboardDidHide,
      );
    } else {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardWillShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardWillHide',
        this._keyboardDidHide,
      );
    }
  }

  _keyboardDidShow = (e: any) => {
    this.setState({
      bottomToolbar: e.endCoordinates.height,
    });
  };

  _keyboardDidHide = (e: any) => {
    this.setState({
      bottomToolbar: 0,
    });
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  cancelAction = () => {
    this.props.updateContent('get', '');
    Keyboard.dismiss();
    this.props.navigation.goBack();
  };
  saveValue = () => {
    this.props.updateContent('get', '');
    Keyboard.dismiss();
    this.props.navigation.goBack();
  };

  renderLoader = () => {
    return (
      <View style={Styles.renderLoaderStyle}>
        <ActivityIndicator color={Colors.newTextColor} size="large" />
      </View>
    );
  };

  toolbar = () => {
    return Platform.OS == 'android' ? (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        style={Styles.toolBarKeyboardAwareScrollViewStyle}>
        <View
          style={[
            Styles.fullWidth,
            {
              height: this.state.showWarningNote ? 130 : 44,
            },
          ]}>
          {this.state.showWarningNote && (
            <View style={Styles.showWarningNoteContainerStyle}>
              <Text style={Styles.showWarningNoteTextStyle}>
                Please note: All changes to the memory description will be saved
                automatically.
              </Text>
              <TouchableOpacity
                onPress={() => this.setState({showWarningNote: false})}
                style={Styles.closeButtonStyle}>
                <Image source={close_white} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          )}
          <View style={Styles.collabrateContainer}>
            <TouchableOpacity
              onPress={() => this.props.inviteCollaboratorFlow()}
              style={Styles.collabrateButtonStyle}>
              <Text style={Styles.collaborateTextStyle}>Collaborate</Text>
              <Image
                style={Styles.width44}
                source={icon_collaborators}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    ) : (
      <KeyboardAccessory style={Styles.keyboardAccessoryStyle}>
        <View
          style={[
            Styles.fullWidth,
            {
              height: this.state.showWarningNote ? 130 : 44,
            },
          ]}>
          {this.state.showWarningNote && (
            <View style={Styles.showWarningNoteContainerStyle}>
              <Text style={Styles.showWarningNoteTextStyle}>
                Please note: All changes to the memory description will be saved
                automatically.
              </Text>
              <TouchableOpacity
                onPress={() => this.setState({showWarningNote: false})}
                style={Styles.closeButtonStyle}>
                <Image source={close_white} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          )}
          <View style={Styles.collabrateContainer}>
            <TouchableOpacity
              onPress={() => this.props.inviteCollaboratorFlow()}
              style={Styles.collabrateButtonStyle}>
              <Text style={Styles.collaborateTextStyle}>Collaborate</Text>
              <Image
                style={Styles.width44}
                source={icon_collaborators}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAccessory>
    );
  };
  render() {
    return (
      <View style={[Styles.fullFlex]}>
        {/* <SafeAreaView
          style={Styles.emptySafeAreaStyle}
        />
        <SafeAreaView style={Styles.SafeAreaViewContainerStyle}> */}
        <View style={Styles.etherpadContainer}>
          {/* <View style={{height : 54, width: "100%", backgroundColor: Colors.ThemeColor}}></View> */}

          {/* <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>  */}
          <WebView
            source={{uri: this.props.padDetails.padUrl}}
            style={Styles.webViewStyle}
            // onLoadStart={()=>loaderHandler.showLoader()}
            // onLoadEnd={()=>loaderHandler.hideLoader()}
            onShouldStartLoadWithRequest={() => true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            renderLoading={this.renderLoader}
            startInLoadingState={true}
            onMessage={() => {}}
            injectedJavaScript={
              "document.cookie = 'sessionID=" +
              this.props.padDetails.sessionId +
              "; path=/'"
            }
          />
          {/* {this.toolbar()}
            <View style={Styles.etherpadNavHeaderCOntainerStyle}>
              <NavigationHeaderSafeArea
                hideClose={true}
                heading={this.props.title}
                cancelAction={() => this.cancelAction()}
                showRightText={true}
                rightText={'Done'}
                saveValues={this.saveValue}
              />
            </View> */}
        </View>
        {/* </SafeAreaView> */}
      </View>
    );
  }
}
