import {
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  ActivityIndicator,
  ColorPropType,
} from 'react-native';
import {WebView} from 'react-native-webview';
import React from 'react';
import {Actions} from 'react-native-router-flux';
import {Colors, fontSize} from '../../common/constants';
import NavigationThemeBar from '../../common/component/navigationBarForEdit/navigationBarWithTheme';
import {pdf_icon, icon_collaborators, close_white} from '../../images';
import AccessoryView from '../../common/component/accessoryView';
import Text from '../../common/component/Text';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
//@ts-ignore
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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

  componentDidMount() {}

  componentWillUnmount() {}

  cancelAction = () => {
    this.props.updateContent('get', '');
    Keyboard.dismiss();
    Actions.pop();
  };
  saveValue = () => {
    this.props.updateContent('get', '');
    Keyboard.dismiss();
    Actions.pop();
  };

  renderLoader = () => {
    return (
      <View style={{height: '100%', width: '100%', position: 'absolute'}}>
        <ActivityIndicator
          color={Colors.ThemeColor}
          size="large"
          style={{flex: 1, justifyContent: 'center'}}
        />
      </View>
    );
  };

  toolbar = () => {
    return Platform.OS == 'android' ? (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#F5F5F5',
        }}>
        <View
          style={{
            width: '100%',
            height: this.state.showWarningNote ? 130 : 44,
          }}>
          {this.state.showWarningNote && (
            <View
              style={{
                backgroundColor: Colors.BtnBgColor,
                width: '100%',
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 15,
                paddingRight: 0,
              }}>
              <Text
                style={{
                  flex: 1,
                  color: '#fff',
                  fontStyle: 'italic',
                  ...fontSize(16),
                }}>
                Please note: All changes to the memory description will be saved
                automatically.
              </Text>
              <TouchableOpacity
                onPress={() => this.setState({showWarningNote: false})}
                style={{
                  width: 44,
                  height: '100%',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Image source={close_white} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              width: '100%',
              height: 44,
              justifyContent: 'flex-end',
              backgroundColor: Colors.NewLightThemeColor,
              alignItems: 'flex-end',
              padding: 10,
              paddingRight: 0,
              borderTopColor: 'rgba(0.0, 0.0, 0.0, 0.25)',
              borderTopWidth: 1,
              borderLeftColor: 'rgba(0.0, 0.0, 0.0, 0.25)',
            }}>
            <TouchableOpacity
              onPress={() => this.props.inviteCollaboratorFlow()}
              style={{
                height: '100%',
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  ...fontSize(16),
                  fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                  color: Colors.NewTitleColor,
                  marginRight: 5,
                }}>
                Collaborate
              </Text>
              <Image
                style={{width: 44}}
                source={icon_collaborators}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    ) : (
      <KeyboardAccessory
        style={{
          backgroundColor: '#fff',
          position: 'absolute',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: 'rgba(0,0,0,0.4)',
        }}>
        <View
          style={{
            width: '100%',
            height: this.state.showWarningNote ? 130 : 44,
          }}>
          {this.state.showWarningNote && (
            <View
              style={{
                backgroundColor: Colors.BtnBgColor,
                width: '100%',
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 15,
                paddingRight: 0,
              }}>
              <Text
                style={{
                  flex: 1,
                  color: '#fff',
                  fontStyle: 'italic',
                  ...fontSize(16),
                }}>
                Please note: All changes to the memory description will be saved
                automatically.
              </Text>
              <TouchableOpacity
                onPress={() => this.setState({showWarningNote: false})}
                style={{
                  width: 44,
                  height: '100%',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Image source={close_white} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              width: '100%',
              height: 44,
              justifyContent: 'flex-end',
              backgroundColor: Colors.NewLightThemeColor,
              alignItems: 'flex-end',
              padding: 10,
              paddingRight: 0,
              borderTopColor: 'rgba(0.0, 0.0, 0.0, 0.25)',
              borderTopWidth: 1,
              borderLeftColor: 'rgba(0.0, 0.0, 0.0, 0.25)',
            }}>
            <TouchableOpacity
              onPress={() => this.props.inviteCollaboratorFlow()}
              style={{
                height: '100%',
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  ...fontSize(16),
                  fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                  color: Colors.NewTitleColor,
                  marginRight: 5,
                }}>
                Collaborate
              </Text>
              <Image
                style={{width: 44}}
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
            {/* <View style={{height : 54, width: "100%", backgroundColor: Colors.ThemeColor}}></View> */}

            {/* <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>  */}
            <WebView
              source={{uri: this.props.padDetails.padUrl}}
              style={{
                marginTop: 60,
                flex: 1,
                marginBottom:
                  Platform.OS == 'ios' ? this.state.bottomToolbar + 20 : 0,
              }}
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
            {this.toolbar()}
            <View style={{width: '100%', position: 'absolute', top: 0}}>
              <NavigationHeaderSafeArea
                hideClose={true}
                heading={this.props.title}
                cancelAction={() => this.cancelAction()}
                showRightText={true}
                rightText={'Done'}
                saveValues={this.saveValue}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
