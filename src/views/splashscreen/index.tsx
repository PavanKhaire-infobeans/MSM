import React, {Component} from 'react';
import {
  View,
  Image,
  StatusBar,
  NativeEventEmitter,
  NativeModules,
  Alert,
  DeviceEventEmitter,
  ImageBackground,
} from 'react-native';
import Text from '../../common/component/Text';
import {
  splashText,
  msm_banner_white,
  msm_coloured_banner,
  splash_bg,
} from '../../images';
import {Storage, Colors, fontSize} from '../../common/constants';
import {Account} from '../../common/loginStore';
import {Actions} from 'react-native-router-flux';
import LoginStore, {UserData} from '../../common/loginStore/database';
import {connect} from 'react-redux';
import {UserAccount} from '../menu/reducer';
import DeviceInfo from 'react-native-device-info';
import EventManager from '../../common/eventManager';
// @ts-ignore
import DefaultPreference from 'react-native-default-preference';
import {constants} from 'buffer';
import Utility from '../../common/utility';
console.log(NativeModules, 'NativeModules.EventHandling');
// export const eventEmitter = new NativeEventEmitter(NativeModules.EventHandling);//commented native module issue

type Props = {getUser: Function; user: UserData & {notLoggedIn: boolean}};
class Splash extends Component<Props> {
  componentWillMount() {
    LoginStore.listAllAccounts().then((resp: any) => {
      let list = resp.rows.raw() as Array<UserData>;
      let obj = {};
      list.forEach((element: any) => {
        obj = {...obj, [`${element.instanceID}_${element.userID}`]: 0};
      });
      Utility.unreadNotification = {...obj};
      console.log('Notification object has : ', Utility.unreadNotification);
    });
    setTimeout(() => {
      this.props.getUser();
    }, 2500);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.user.instanceID != 0 &&
      nextProps.user.userAuthToken != null
    ) {
      Account.selectedData().values = nextProps.user;
      // Actions.reset("dashboardIndex")
      Actions.dashBoard();
    } else if (
      (nextProps.user.instanceID != 0 &&
        (nextProps.user.userAuthToken == null ||
          nextProps.user.userAuthToken.length == 0)) ||
      nextProps.user.notLoggedIn
    ) {
      DefaultPreference.get('hide_app_intro').then((value: any) => {
        if (value == 'true') {
          Actions.prologue();
        } else {
          Actions.appIntro();
        }
      });
    }
  }
  render() {
    let versionNumber = DeviceInfo.getVersion();
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={Colors.NewThemeColor}
        />
        <ImageBackground
          source={splash_bg}
          style={{flex: 1, width: '100%', height: '100%'}}>
          {/*<View style={{ maxWidth: 240, alignItems: "center", alignSelf: 'center', paddingTop : 30 }}>
					<Image style={{ width: 300, height: 100 }} resizeMode="contain" source={msm_coloured_banner} />
					<Image style={{ width: 240, height: 65, marginTop: 24, tintColor: "#000"}}resizeMode="center" source={splashText}/>
		</View>*/}
          <View
            style={{
              position: 'absolute',
              bottom: 15,
              alignItems: 'center',
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}>
            <Text style={{...fontSize(16), color: '#fff', textAlign: 'center'}}>
              Version: {versionNumber}
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const mapState = (state: {[x: string]: any}): {user: UserData} => ({
  user: state.account,
});
const mapDispatch = (dispatch: Function) => ({
  getUser: () => dispatch({type: UserAccount.Get}),
});

export default connect(mapState, mapDispatch)(Splash);
