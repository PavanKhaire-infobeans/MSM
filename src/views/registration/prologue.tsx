import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import Text from '../../common/component/Text';
import {
  Colors,
  CommonTextStyles,
  fontFamily,
  fontSize,
} from '../../common/constants';
import {GetInstances} from './reducer';
//@ts-ignore
import LinearGradient from 'react-native-linear-gradient';

import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import {apple, google, loginBack, Rectangle} from '../../../app/images';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import MessageDialogue from '../../common/component/messageDialogue';
import BottomDrawer from '../../common/component/rn-bottom-drawer';
import {No_Internet_Warning, ToastMessage} from '../../common/component/Toast';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import {kRegSignUp, loginType} from '../login';
import GetFormData, {
  kCueBackFormData,
  kCueBackRegistration,
} from './getFormData';
import RegFirstStep from './regFirstStep';
import Styles from './styles';

export enum Direction {
  upDirection = 'upward',
  downDirection = 'downward',
  reset = 'reset',
}

export var loginDrawerRef: BottomDrawer;
type Props = {
  showHeader: boolean;
  getAllInstances: Function;
  navigation: {[key: string]: any};
  end: Function;
  request: {completed: boolean; success: boolean};
};
class Prologue extends Component<Props> {
  _panel: any = null;
  currentIndex = 0;
  searchDrawerRef: any | BottomDrawer;
  loginIdentifier = 'loginDrawer';
  searchIdentifier = 'searchDrawer';
  registrationData: EventManager;
  navBar: any;
  messageRef: any;
  regStep: any;
  loginControllerRef: any;
  state = {
    isLoginUp: false,
    isLoginDrawerOpen: false,
    isSearchDrawerOpen: false,
    isRegistrationOpen: false,
    registrationFormData: null,
    isBottomPickerVisible: false,
    wasLoading: false,
  };
  static defaultProps = {
    showHeader: false,
  };

  componentWillUnmount = () => {
    this.setState({isBottomPickerVisible: false}, () => {
      this.registrationData.removeListener();
    });
  };
  componentDidMount() {
    // var { width, height } = Dimensions.get('window');
    // Alert.alert("Window Width : " + width + "Height : " + height);

    // var { width, height } = Dimensions.get('screen');
    // Alert.alert("Screen Width : " + width + "Height : " + height);
    // SafeArea.getSafeAreaInsetsForRootView()
    // .then((result) => {
    // 	console.log(result)
    // 	// { safeAreaInsets: { top: 44, left: 0, bottom: 34, right: 0 } }
    // })
    this.setState({isBottomPickerVisible: false}, () => {
      this.registrationData = EventManager.addListener(
        kCueBackFormData,
        this.cueBackRegistrationForm,
      );
      new GetFormData().callService(kCueBackRegistration, false, true);
      this.props.getAllInstances();
    });
  }

  cueBackRegistrationForm = (success: any, formList: any) => {
    if (success) {
      this.setState({registrationFormData: formList}, () => {
        if (this.state.wasLoading) {
          loaderHandler.hideLoader();
          this.setState({isRegistrationOpen: true, wasLoading: false});
        }
      });
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.request.completed &&
      this.props.navigation &&
      this.props.navigation?.state &&
      this.props.navigation?.state?.routeName &&
      this.props.navigation?.state?.routeName == 'prologue'
    ) {
      this.props.end();
    }
  }

  onDrawerExpand = (identifier: any) => {
    if (identifier == this.loginIdentifier) {
      this.setState({isLoginDrawerOpen: true, isLoginUp: true});
      // this.searchDrawerRef.refDrawer.expand()
    }
    if (identifier == this.searchIdentifier) {
      this.setState({isSearchDrawerOpen: true});
    }
  };

  onDrawerCollapse = (identifier: any) => {
    if (identifier == this.loginIdentifier) {
      this.setState({isLoginDrawerOpen: false, isLoginUp: false});
    }
    if (identifier == this.searchIdentifier) {
      this.setState({isSearchDrawerOpen: false}, () =>
        loginDrawerRef.refDrawer.collapse(),
      );
    }
    Keyboard.dismiss();
    this._hide();
  };

  onResponder = (
    e: any,
    guesture: any,
    identifier: any,
    direction: any,
    isRelease: any,
  ) => {
    try {
      switch (direction) {
        case Direction.reset:
          // this.searchDrawerRef.refDrawer._resetPosition();
          loginDrawerRef.refDrawer._resetPosition();
          break;
        case Direction.upDirection:
          if (
            identifier == this.loginIdentifier &&
            !this.state.isSearchDrawerOpen
          ) {
            if (!this.state.isLoginUp) {
              this.setState({isLoginUp: true});
            }
            // if(isRelease)
            // 	this.searchDrawerRef.refDrawer.expand();
            // else
            // this.searchDrawerRef.refDrawer._handlePanResponderMove(e, guesture);
          }

          break;
        case Direction.downDirection:
          if (
            identifier == this.searchIdentifier &&
            this.state.isLoginDrawerOpen
          ) {
            if (this.state.isLoginUp) {
              this.setState({isLoginUp: false});
            }
            if (isRelease) loginDrawerRef.refDrawer.collapse();
            else loginDrawerRef.refDrawer._handlePanResponderMove(e, guesture);
          }
          break;
      }
    } catch (error) {
      console.log('errrrr ', error);
    }
  };

  drawerTapped = (identifier: any) => {
    switch (identifier) {
      case this.loginIdentifier:
        if (this.state.isLoginDrawerOpen) {
          loginDrawerRef.refDrawer.collapse();
        } else {
          // this.searchDrawerRef.refDrawer.expand();
          loginDrawerRef.refDrawer.expand();
        }
        break;
      case this.searchIdentifier:
        if (this.state.isSearchDrawerOpen) {
          // this.searchDrawerRef.refDrawer.collapse();
          loginDrawerRef.refDrawer.collapse();
        } else {
          // this.searchDrawerRef.refDrawer.expand();
        }
        break;
    }
  };

  joinPressed = () => {
    if (Utility.isInternetConnected) {
      if (this.state.registrationFormData != null) {
        this.setState({isRegistrationOpen: true});
      } else {
        this.setState({wasLoading: true}, () =>
          loaderHandler.showLoader('Loading...'),
        );
      }
    } else {
      No_Internet_Warning();
    }
  };

  onBackPressed = () => {
    if (
      this.state.isRegistrationOpen &&
      !this.state.isLoginDrawerOpen &&
      !this.state.isSearchDrawerOpen
    ) {
      this.setState({isRegistrationOpen: false}, () =>
        loginDrawerRef.refDrawer.collapse(),
      );
      // this.searchDrawerRef.refDrawer.collapse();
    } else if (this.props.showHeader) {
      this.props.navigation.goBack();
    }
    // if(this.searchDrawerRef!=null && this.searchDrawerRef.refDrawer!=null){
    // 	this.searchDrawerRef.refDrawer.collapse();
    // }
    loginDrawerRef.refDrawer.collapse();
  };

  onRegFinalCallBack = (msg: any) => {
    this.setState({isRegistrationOpen: false}, () => {
      loginDrawerRef.refDrawer.expand();
      ToastMessage(msg, Colors.ThemeColor, false, true);
    });
  };

  prologueHeader = () => {
    console.log('Login controller ref : ', this.loginControllerRef);
    return <View />;
  };

  bottomPicker = (isVisible: boolean) => {
    this.setState({isBottomPickerVisible: isVisible});
  };

  openLoginDrawer = () => {
    loginDrawerRef.refDrawer.expand();
  };

  _showWithOutClose = (message: any, color: any) => {
    this.messageRef &&
      this.messageRef._showWithOutClose({message: message, color: color});
  };

  _show = (message: any, color: any) => {
    this.messageRef && this.messageRef._show({message: message, color: color});
  };

  _hide = () => {
    this.messageRef && this.messageRef._hide();
  };

  render() {
    return (
      <View style={Styles.flexContainer}>
        <StatusBar
          barStyle={
            Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
          }
          backgroundColor={Colors.AudioViewBg}
        />
        <View style={{flex: 1, backgroundColor: Colors.NewThemeColor}}>
          <ImageBackground
            source={Rectangle}
            resizeMode="stretch"
            style={{
              height: Utility.getDeviceHeight() * 1,
              width: Utility.getDeviceWidth() * 1,
              justifyContent: 'center',
            }}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.6)']}
              style={Styles.findCommunityContainer}>
              <SafeAreaView style={Styles.flexContainer}>
                <View style={Styles.prologSubContainer}>
                  {this.state.isRegistrationOpen ? (
                    <View>
                      <View style={Styles.prologHeaderContainer}>
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({isRegistrationOpen: false})
                          }>
                          <Image source={loginBack} />
                        </TouchableOpacity>
                        <Text style={Styles.signUp}>Sign up</Text>
                        <View style={Styles.prologHeaderContainerEmpty} />
                      </View>

                      <View style={Styles.separatorHeightStyle16} />

                      <View style={Styles.prologHeaderEmptyView} />
                      <RegFirstStep
                        ref={(ref: any) => {
                          this.regStep = ref;
                        }}
                        formList={this.state.registrationFormData}
                        isCuebackRegistration={true}
                        navBar={this}
                        bottomPicker={(isVisible: any) =>
                          this.bottomPicker(isVisible)
                        }
                      />
                    </View>
                  ) : (
                    <View>
                      {/* <Image style={{ margin: 16, marginBottom: 0 }} source={recordRegistration}></Image> */}

                      {/* <Text style={{ padding: 16, paddingBottom: 10, fontWeight: '500', ...fontSize(24), color: Colors.TextColor }}>'New to{"\n"}My Stories Matter?'</Text> */}
                      <View style={Styles.ReadyContainer}>
                        <Text style={Styles.readyText}>
                          Ready to start reminiscing?
                        </Text>
                      </View>
                      <View style={Styles.separatorHeightStyle16} />

                      <View style={Styles.prologSubContainerStyle}>
                        {Platform.OS == 'ios' &&
                          (Platform.Version >= 13 ||
                            Platform.Version >= '13') && (
                            <TouchableHighlight
                              underlayColor={'#ffffff00'}
                              onPress={() => {
                                EventManager.callBack(
                                  kRegSignUp,
                                  loginType.appleLogin,
                                );
                              }}>
                              <View style={Styles.loginSSOButtonStyle}>
                                <Image source={apple} />
                                <Text
                                  style={[
                                    CommonTextStyles.fontWeight400Size19Inter,
                                    Styles.ssoTextStyle,
                                  ]}>
                                  Continue with Apple
                                </Text>
                              </View>
                            </TouchableHighlight>
                          )}
                        <View style={Styles.separatorHeightStyle32} />

                        <TouchableHighlight
                          underlayColor={'#ffffff00'}
                          onPress={() => {
                            EventManager.callBack(
                              kRegSignUp,
                              loginType.googleLogin,
                            );
                          }}>
                          <View style={Styles.loginSSOButtonStyle}>
                            <Image source={google} />
                            <Text
                              style={[
                                CommonTextStyles.fontWeight400Size19Inter,
                                Styles.ssoTextStyle,
                              ]}>
                              Continue with Google
                            </Text>
                          </View>
                        </TouchableHighlight>

                        <View style={Styles.separatorHeightStyle32} />
                        <View style={Styles.orContainer}>
                          <Text
                            style={[
                              CommonTextStyles.fontWeight400Size19Inter,
                              Styles.ssoTextStyle,
                            ]}>
                            or
                          </Text>
                        </View>
                        <View style={Styles.separatorHeightStyle32} />

                        <TouchableHighlight
                          underlayColor={'#ffffff00'}
                          onPress={() => this.joinPressed()}>
                          <View
                            style={[
                              Styles.loginSSOButtonStyle,
                              {backgroundColor: Colors.decadeFilterBorder},
                            ]}>
                            {/* <Image source={icon_mail} style={{ height: 14, width: 20, resizeMode: "cover", tintColor: "#5c5c5c" }} /> */}
                            <Text
                              style={[
                                CommonTextStyles.fontWeight400Size19Inter,
                                Styles.ssoTextStyle,
                                {color: Colors.white},
                              ]}>
                              Create an account
                            </Text>
                          </View>
                        </TouchableHighlight>
                        <View style={Styles.separatorHeightStyle32} />
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.props.navigation.navigate('dashboard');
                          }}>
                          <View
                            style={[
                              Styles.loginSSOButtonStyle,
                              Styles.loginContainer,
                            ]}>
                            <Text
                              style={[
                                CommonTextStyles.fontWeight400Size19Inter,
                                Styles.ssoTextStyle,
                              ]}>
                              Login
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </View>
                  )}
                </View>
                <MessageDialogue ref={(ref: any) => (this.messageRef = ref)} />
              </SafeAreaView>
            </LinearGradient>
          </ImageBackground>
        </View>
      </View>
    );
  }
}
const mapState = (state: {[x: string]: any}) => ({
  request: state.requestInstances,
});

const mapDispatch = (dispatch: Function) => ({
  getAllInstances: () => dispatch({type: GetInstances.GetCall}),
  end: () => dispatch({type: GetInstances.GetEnd}),
});

export default connect(mapState, mapDispatch)(Prologue);
