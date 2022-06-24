import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  TouchableHighlight,
  FlatList,
  Keyboard,
  ActivityIndicator,
  Image,
  Alert,
  Platform,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import {Colors, fontSize} from '../../common/constants';
import {styles} from './designs';
import {Props} from './loginController';
import {backBlkBtn, user_drawable} from '../../images';
import Text from '../../common/component/Text';
import InstanceView from '../registration/instanceView';
import {ToastMessage, No_Internet_Warning} from '../../common/component/Toast';
// @ts-ignore
import BusyIndicator from '../../common/component/busyindicator';
import Utility from '../../common/utility';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import {Account} from '../../common/loginStore';

export enum ListType {
  Login = 'login',
  Logout = 'logout',
  ForgotPassword = 'forgotPassword',
}

export default class CommonInstanceListsSelection extends React.Component<Props> {
  state = {
    selectedIndex: [],
    showLoader: false,
    disabledIndexs: [],
    allDisabled: true,
    anyDisabled: false,
    instanceString: '',
  };
  navBar: NavigationHeaderSafeArea = null;
  userEmail = '';

  drawHeader = (email: any) => {
    this.userEmail = email;
    return (
      <View style={{width: '100%', paddingTop: 10}}>
        {/* <View style={{height: (data.index != 0 ? 1 : 0), width: "100%", paddingRight: 15, paddingLeft: 15, marginBottom : 10 , backgroundColor : "#DDDDDD"}}></View> */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={user_drawable}></Image>
          <Text
            style={{
              paddingLeft: 10,
              ...fontSize(14),
              color: 'rgba(61, 61, 61, 0.8)',
            }}>
            {email}
          </Text>
        </View>
      </View>
    );
  };

  drawFooter = () => {
    return (
      <View>
        {this.state.anyDisabled && (
          <View>
            <Text
              style={{
                paddingTop: 15,
                paddingBottom: 15,
                ...fontSize(16),
                color: 'black',
              }}>
              {`You're already logged into`}{' '}
              <Text
                style={{fontWeight: Platform.OS === 'ios' ? '500' : 'bold'}}>
                {this.state.instanceString}
                {this.state.disabledIndexs.length > 1
                  ? ` communities`
                  : ` community`}
              </Text>
            </Text>
            <Text
              style={{
                paddingTop: 10,
                paddingBottom: 15,
                ...fontSize(16),
                color: 'black',
              }}>
              {`Please logout from `}
              <Text
                style={{fontWeight: Platform.OS === 'ios' ? '500' : 'bold'}}>
                {this.state.instanceString}
              </Text>
              {` if you want to login`}
              {this.state.disabledIndexs.length > 1
                ? ` these communities`
                : ` this community`}
              {` with `}
              <Text
                style={{fontWeight: Platform.OS === 'ios' ? '500' : 'bold'}}>
                {this.props.username}
              </Text>
            </Text>
          </View>
        )}
      </View>
    );
  };
  constructor(props: Props) {
    super(props);
    this.navBar = this.props.navBar;
    this.setState({showLoader: false});
  }

  selectAllItems = () => {
    let indexs: any = [];
    let instanceNames: any = [];
    let disabledIndexs: any = [];
    this.props.listAccounts.forEach((element: any, index: any) => {
      if (!element.isDisabled) {
        indexs.push(index);
        this.setState({allDisabled: false});
      } else {
        disabledIndexs.push(index);
        instanceNames.push(element.site_name);
        this.setState({anyDisabled: true});
      }
    });
    this.setState(
      {
        selectedIndex: indexs,
        instanceString: instanceNames.join(', '),
        disabledIndexs: disabledIndexs,
      },
      () => {
        console.log('Index are : ', this.state.selectedIndex, indexs);
      },
    );
  };

  componentDidMount() {
    this.selectAllItems();
    this.userEmail = '';
  }

  callLoginService = () => {
    if (this.state.selectedIndex.length > 0) {
      let selectedCommunitiesId: any = [];
      this.state.selectedIndex.forEach((element: any) => {
        selectedCommunitiesId.push(this.props.listAccounts[element].id);
      });
      selectedCommunitiesId = selectedCommunitiesId.join(', ');
      if (Utility.isInternetConnected) {
        this.setState({showLoader: true});
        this.props.onClick(selectedCommunitiesId);
      } else {
        No_Internet_Warning();
      }
    } else {
      this.showErrorMessage(
        true,
        'Please select atleast 1 community to continue',
      );
    }
  };

  callLogoutService = () => {
    let selectedCommunities: any = [];
    this.state.selectedIndex.forEach((element: any) => {
      selectedCommunities.push(this.props.listAccounts[element]);
    });
    if (this.state.selectedIndex.length > 0) {
      Alert.alert(
        '',
        `Are you sure you want to log out from the accounts you selected?`,
        [
          {
            text: 'No',
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: 'Yes',
            style: 'default',
            onPress: () => {
              this.props.onClick(selectedCommunities);
            },
          },
        ],
      );
    } else {
      this.showErrorMessage(
        true,
        'Please select atleast 1 community to logout',
      );
    }
  };

  updateState(state: object, showErrorMessage?: boolean, msgObject?: string) {
    if (showErrorMessage) {
    } else {
      this.setState(state);
    }
  }

  showErrorMessage = (show: boolean, message?: string) => {
    let height = 0;
    if (show) {
      height = 70;
      this.navBar._showWithOutClose(message, Colors.ErrorColor);
    } else {
      this.navBar._hide();
    }
    this.updateState({errorViewHeight: height});
  };

  componentWillUnmount() {
    this.showErrorMessage(false);
    this.setState({showLoader: false});
  }

  cellTapped = (index: any) => {
    this.showErrorMessage(false);
    let tappedIndex = this.state.selectedIndex.indexOf(index);
    let selectedIndex = this.state.selectedIndex;
    console.log('Index are ', tappedIndex, selectedIndex, index);
    if (tappedIndex > -1) {
      selectedIndex.splice(tappedIndex, 1);
    } else {
      selectedIndex.push(index);
    }
    this.setState({selectedIndex: selectedIndex});
  };

  renderRow = (data: any) => {
    let index = data.index;
    data = data.item;
    let url = data.site_url || data.instanceURL;
    let name = data.site_name || data.name;
    let instanceImage = data.site_logo_url || data.instanceImage;
    let usersEmail =
      this.props.type == ListType.Login
        ? this.props.username
        : this.props.type == ListType.ForgotPassword
        ? this.props.email
        : data.email;
    if (index == 0) {
      this.userEmail = '';
    }
    return (
      <View>
        {usersEmail != this.userEmail && this.drawHeader(usersEmail)}
        <TouchableHighlight
          style={{opacity: data.isDisabled ? 0.5 : 1}}
          disabled={data.isDisabled}
          underlayColor={'#fff'}
          onPress={() => this.cellTapped(index)}>
          <InstanceView
            style={{}}
            showSelection={true}
            isSelected={
              this.state.selectedIndex.indexOf(index) > -1 ? true : false
            }
            communityInfo={{
              name: name,
              instanceURL: url.replace('https://', '').replace('http://', ''),
              instanceImage:
                instanceImage ||
                'https://qa.cueback.com/sites/qa.cueback.com/default/files/cal-poly-cp_0.png',
            }}
          />
        </TouchableHighlight>
        {index == this.props.listAccounts.length - 1 && this.drawFooter()}
      </View>
    );
  };

  callForgotPassword = () => {
    if (this.state.selectedIndex.length > 0) {
      let selectedCommunitiesId: any = [];
      this.state.selectedIndex.forEach((element: any) => {
        selectedCommunitiesId.push(this.props.listAccounts[element].id);
      });
      if (Utility.isInternetConnected) {
        this.setState({showLoader: true});
        this.props.onClick(selectedCommunitiesId);
        Actions.pop();
      } else {
        No_Internet_Warning();
      }
    } else {
      this.showErrorMessage(
        true,
        'Please select atleast 1 community to continue',
      );
    }
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={styles.container}>
          <View style={{flex: 1}}>
            <NavigationHeaderSafeArea
              ref={ref => (this.navBar = ref)}
              heading={this.props.title}
              showCommunity={false}
              cancelAction={() =>
                this.props.type == ListType.Login
                  ? this.props.onRequestClose()
                  : Actions.pop()
              }
              showRightText={false}
              isWhite={true}
              backIcon={backBlkBtn}
            />
            <StatusBar
              barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
              backgroundColor={Colors.NewDarkThemeColor}
            />
            {(this.props.type == ListType.Login ||
              this.props.type == ListType.ForgotPassword) && (
              <Text style={{padding: 16, ...fontSize(16), color: 'black'}}>
                {`We have found ${this.props.listAccounts.length} communities that belong to `}
                {this.props.type == ListType.ForgotPassword
                  ? 'your email address.'
                  : `the same credentials.`}
              </Text>
            )}
            {!this.state.allDisabled && (
              <Text
                style={{
                  padding: 16,
                  color: 'rgba(61, 61, 61, 0.6)',
                  ...fontSize(16),
                }}>{`Please select which communities from the list you want to ${
                this.props.type == ListType.ForgotPassword
                  ? 'reset your password'
                  : this.props.type == ListType.Logout
                  ? 'logout from'
                  : this.props.type
              }.`}</Text>
            )}
            <View
              style={{
                flexDirection: 'row',
                height: 35,
                paddingLeft: 16,
                paddingRight: 16,
                paddingBottom: 5,
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}>
              <Text
                style={{
                  ...fontSize(16),
                  fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                  color: '#3D3D3D',
                }}>
                {'Your Communities'}
              </Text>
              <TouchableHighlight
                onPress={() => this.selectAllItems()}
                underlayColor={'#ffffff00'}
                style={{
                  flex: 1,
                  height: 35,
                  paddingBottom: 5,
                  position: 'absolute',
                  right: 16,
                  justifyContent: 'flex-end',
                }}>
                <Text
                  style={{
                    ...fontSize(14),
                    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                    color: Colors.ThemeColor,
                    textDecorationLine: 'underline',
                  }}>
                  {'Select all'}
                </Text>
              </TouchableHighlight>
            </View>
            <FlatList
              bounces={false}
              keyExtractor={(_, index: number) => `${index}`}
              data={this.props.listAccounts}
              style={{padding: 15, paddingTop: -10, flex: 1, marginBottom: 80}}
              keyboardShouldPersistTaps={'handled'}
              onScroll={() => {
                Keyboard.dismiss();
              }}
              keyExtractor={(_: any, index: number) => `${index}`}
              renderItem={(item: any) => this.renderRow(item)}
              extraData={this.props}
            />

            <TouchableHighlight
              disabled={this.state.allDisabled}
              style={{
                width: '100%',
                height: 54,
                padding: 15,
                position: 'absolute',
                bottom: 40,
              }}
              underlayColor={'#ffffff00'}
              onPress={() =>
                this.props.type == ListType.Login
                  ? this.callLoginService()
                  : this.props.type == ListType.ForgotPassword
                  ? this.callForgotPassword()
                  : this.callLogoutService()
              }>
              <View
                style={{
                  height: 60,
                  backgroundColor:
                    this.props.type == ListType.Login
                      ? this.state.allDisabled
                        ? '#cccccc'
                        : Colors.ThemeColor
                      : '#9a3427',
                  width: '100%',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    ...fontSize(22),
                    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                    color: '#ffffff',
                  }}>
                  {this.props.type == ListType.ForgotPassword
                    ? 'Reset Password'
                    : this.props.title}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </SafeAreaView>
        {this.state.showLoader && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              flex: 1,
              width: '100%',
              height: '100%',
              backgroundColor: '#333333aa',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                padding: 10,
                backgroundColor: Colors.ThemeColor,
                borderRadius: 10,
              }}>
              <ActivityIndicator
                color={'white'}
                size={'small'}
                style={{justifyContent: 'center', alignItems: 'center'}}
              />

              <Text style={{color: '#f5f5f5', ...fontSize(14), marginTop: 10}}>
                {'Loading...'}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}
