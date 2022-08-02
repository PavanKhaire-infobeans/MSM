import React from 'react';
import {
  ActivityIndicator, Alert, FlatList, Image, Keyboard, Platform, SafeAreaView,
  StatusBar, TouchableHighlight, View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import Text from '../../common/component/Text';
import { No_Internet_Warning } from '../../common/component/Toast';
import { Colors, fontFamily, fontSize } from '../../common/constants';
import { backBlkBtn, user_drawable } from '../../images';
import InstanceView from '../registration/instanceView';
import { styles } from './designs';
import { Props } from './loginController';
// @ts-ignore
import Utility from '../../common/utility';

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
      <View style={{ width: '100%', paddingTop: 10 }}>
        {/* <View style={{height: (data.index != 0 ? 1 : 0), width: "100%", paddingRight: 15, paddingLeft: 15, marginBottom : 10 , backgroundColor : "#DDDDDD"}}></View> */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                style={{ fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium, fontWeight: '500' }}>
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
                style={{ fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium, fontWeight: '500' }}>
                {this.state.instanceString}
              </Text>
              {` if you want to login`}
              {this.state.disabledIndexs.length > 1
                ? ` these communities`
                : ` this community`}
              {` with `}
              <Text
                style={{ fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium, fontWeight: '500' }}>
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
    this.setState({ showLoader: false });
  }

  selectAllItems = () => {
    let indexs: any = [];
    let instanceNames: any = [];
    let disabledIndexs: any = [];
    this.props.listAccounts.forEach((element: any, index: any) => {
      if (!element.isDisabled) {
        indexs.push(index);
        this.setState({ allDisabled: false });
      } else {
        disabledIndexs.push(index);
        instanceNames.push(element.site_name);
        this.setState({ anyDisabled: true });
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
        this.setState({ showLoader: true });
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
            onPress: () => { },
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
    this.updateState({ errorViewHeight: height });
  };

  componentWillUnmount() {
    this.showErrorMessage(false);
    this.setState({ showLoader: false });
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
    this.setState({ selectedIndex: selectedIndex });
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
          style={{ opacity: data.isDisabled ? 0.5 : 1 }}
          disabled={data.isDisabled}
          underlayColor={Colors.white}
          onPress={() => this.cellTapped(index)}>
          <InstanceView
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
        this.setState({ showLoader: true });
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
      <View style={styles.mainContainer}>
        <SafeAreaView style={styles.container}>
          <View style={styles.mainContainer}>
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
              barStyle={Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
              backgroundColor={Colors.NewDarkThemeColor}
            />
            {(this.props.type == ListType.Login ||
              this.props.type == ListType.ForgotPassword) && (
                <Text style={styles.emailTextstyle}>
                  {`We have found ${this.props.listAccounts.length} communities that belong to `}
                  {this.props.type == ListType.ForgotPassword
                    ? 'your email address.'
                    : `the same credentials.`}
                </Text>
              )}
            {!this.state.allDisabled && (
              <Text
                style={styles.resetPasswordStyle}>{`Please select which communities from the list you want to ${this.props.type == ListType.ForgotPassword
                  ? 'reset your password'
                  : this.props.type == ListType.Logout
                    ? 'logout from'
                    : this.props.type
                  }.`}</Text>
            )}
            <View
              style={styles.yourComminityContainer}>
              <Text
                style={styles.comminityText}>
                {'Your Communities'}
              </Text>
              <TouchableHighlight
                onPress={() => this.selectAllItems()}
                underlayColor={'#ffffff00'}
                style={styles.selectAllContainer}>
                <Text
                  style={styles.selectAllText}>
                  {'Select all'}
                </Text>
              </TouchableHighlight>
            </View>
            <FlatList
              bounces={false}
              keyExtractor={(_, index: number) => `${index}`}
              data={this.props.listAccounts}
              style={styles.flatlistStyle}
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
              style={styles.resetMainContainer}
              underlayColor={'#ffffff00'}
              onPress={() =>
                this.props.type == ListType.Login
                  ? this.callLoginService()
                  : this.props.type == ListType.ForgotPassword
                    ? this.callForgotPassword()
                    : this.callLogoutService()
              }>
              <View
                style={[styles.titleProps,{
                  backgroundColor:
                    this.props.type == ListType.Login ? this.state.allDisabled
                        ? '#cccccc': Colors.ThemeColor: '#9a3427',
                }]}>
                <Text
                  style={styles.titleTextStyle}>
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
            style={styles.loaderContainer}>
            <View
              style={styles.activityContainer}>
              <ActivityIndicator
                color={Colors.newTextColor}
                size={'small'}
                style={styles.activityStyle}
              />

              <Text style={styles.loadingTextStyle}>
                {'Loading...'}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}
