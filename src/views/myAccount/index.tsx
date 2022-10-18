import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import BusyIndicator from '../../common/component/busyindicator';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import DefaultListItem from '../../common/component/defaultListItem';
import TextNew from '../../common/component/Text';
import { No_Internet_Warning } from '../../common/component/Toast';
import { Colors, Storage } from '../../common/constants';
import EventManager from '../../common/eventManager';
import { Account, LoginStore, UserData } from '../../common/loginStore';
import Utility from '../../common/utility';
import { logoutMethod } from '../../common/webservice/webservice';
import {
  icon_drafts,
  icon_idea,
  icon_logout,
  icon_password,
  profile_placeholder,
} from '../../images';
import { SHOW_LOADER_READ, SHOW_LOADER_TEXT } from '../dashboard/dashboardReducer';
import NavigationBar from '../dashboard/NavigationBar';
import useProfileData from '../profile/profileDataModel';
import {
  kGetUserProfileData,
  UserProfile,
} from '../profile/userProfileWebService';
import { GetUserData } from './reducer';
import Styles from './styles';

const MyMessages = 'Messages';
const Mindops = 'MindPops';
const Drafts = 'Memory Drafts';
const Memories = 'Memory Collections';
const Tickets = 'Tickets';
const ChangePassword = 'Change Password';
const Logout = 'Logout';

const MyAccount = props => {
  const [Items, setItems] = useState([]);
  const [userImage, setUserImage] = useState(null);

  const [userProfileDetails, setUserProfileDetails] = useState({});
  const { basicInfo } = useProfileData(userProfileDetails);

  useEffect(() => {
    initiazeItems();
    const checkProfile = EventManager.addListener(
      kGetUserProfileData,
      getUserProfileDataCallBack,
    );
    if (props.userData.group_basic_info) {
      setUserProfileDetails(props.userData);
    }
    else {
      getUserProfileData();
    }

    return () => {
      checkProfile.removeListener();
    };
  }, []);

  const segregateItemClick = (identifier: any) => {
    switch (identifier) {
      case MyMessages:
        break;
      case Mindops:
        props.navigation.navigate('mindPop');
        break;
      case Drafts:
        // props.navigation.reset({
        //   index: 0,
        //   routes: [{ name: 'writeTabs' }]
        // })
        props.navigation.replace('writeTabs', {
          navigation: props.navigation,
        });
        break;
      case Memories:
        break;
      case Tickets:
        break;
      case ChangePassword:
        props.navigation.navigate('changePassword');
        break;
      case Logout:
        _logout();
        break;
      default:
    }
  };

  const _logout = () => {
    LoginStore.listAllAccounts()
      .then((resp: any) => {
        let list = resp.rows.raw();
        list = list.filter((it: UserData) => it.userAuthToken != '');

        Alert.alert('', `Are you sure you want to log out ?`, [
          {
            text: 'No',
            style: 'cancel',
            onPress: () => { },
          },
          {
            text: 'Yes',
            style: 'default',
            onPress: () => {
              logoutMethod()
                .then(() => {
                  props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'prologue' }],
                  });
                  // }
                })
                .catch(() => {
                  props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'prologue' }],
                  });
                });
            },
          },
        ]);
      })
      .catch(() => {
        //showConsoleLog(ConsoleType.LOG,err);
      });
  };

  const initiazeItems = () => {
    let items = [{}];
    getUserProfileDataImage();
    if (Account.selectedData().isSSOLogin) {
      items = [
        {
          title: Mindops,
          showArrow: true,
          icon: icon_idea,
          count: 0,
          key: Mindops,
        },
        {
          title: Drafts,
          showArrow: true,
          icon: icon_drafts,
          count: 0,
          key: Drafts,
        },
        {
          title: Logout,
          showArrow: false,
          icon: icon_logout,
          count: 0,
          key: Logout,
          isLast: true,
        },
      ];
    } else {
      items = [
        {
          title: Mindops,
          showArrow: true,
          icon: icon_idea,
          count: 0,
          key: Mindops,
        },
        {
          title: Drafts,
          showArrow: true,
          icon: icon_drafts,
          count: 0,
          key: Drafts,
        },
        {
          title: ChangePassword,
          showArrow: true,
          icon: icon_password,
          count: 0,
          key: ChangePassword,
        },
        {
          title: Logout,
          showArrow: false,
          icon: icon_logout,
          count: 0,
          key: Logout,
          isLast: true,
        },
      ];
    }
    setItems(items);
  };

  const getUserProfileDataImage = async () => {
    let userImage = await Storage.get('user_profile_image');
    setUserImage(userImage);
  };

  // CallBack for Profile data web service
  const getUserProfileDataCallBack = (
    success: boolean,
    profileDetails: any,
  ) => {
    //stop refresh control
    if (success) {
      setUserProfileDetails(profileDetails);
      props.getUserData(profileDetails);
    }
    //loaderHandler.hideLoader();
    props.showLoader(false);
    props.loaderText('Loading...');
  };

  // Web-service call to fetch profile data
  const getUserProfileData = () => {
    if (Utility.isInternetConnected) {
      //loaderHandler.showLoader('Loading...');
      props.showLoader(true);
      props.loaderText('Loading...');
      UserProfile();
    } else {
      No_Internet_Warning();
    }
  };

  const getFullName = () => {
    return basicInfo?.first_name + ' ' + basicInfo?.last_name;
  };

  return (
    <View style={Styles.container}>
      {
        props.showLoaderValue ?
          <BusyIndicator startVisible={props.showLoaderValue} text={props.loaderTextValue !=''? props.loaderTextValue :'Loading...'} overlayColor={Colors.ThemeColor} />
          :
          null
      }
      <SafeAreaView style={Styles.noViewStyle} />
      <SafeAreaView style={Styles.safeAreaContextStyle}>
        <View style={Styles.container}>
          <NavigationBar
            title={'My Account'}
            showClose={true}
            navigation={props.navigation}
          />
          <StatusBar
            barStyle={
              Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
            }
            backgroundColor={Colors.NewThemeColor}
          />
          <View style={Styles.profileImage}>
            <ImageBackground
              style={Styles.imagebackGroundStyle}
              imageStyle={Styles.imageStyle}
              source={profile_placeholder}>
              <Image
                source={
                  Account.selectedData().profileImage != ''
                    ? { uri: Account.selectedData().profileImage }
                    : profile_placeholder
                }
                style={Styles.imageStyle}
              />
            </ImageBackground>

            <View style={Styles.fullNameContainer}>
              <TextNew style={Styles.fullName}>{getFullName()}</TextNew>
              <TouchableHighlight
                underlayColor="#cccccc3e"
                onPress={() => {
                  props.navigation.navigate('profile');
                }}>
                <TextNew style={Styles.viewProfile}>View your Profile</TextNew>
              </TouchableHighlight>
            </View>
          </View>
          {/* <FlatList
            data={Items}
            keyExtractor={(_, index: number) => `${index}`}
            style={Styles.flatListStyle}
            initialNumToRender={Items.length}
            removeClippedSubviews={true}
            renderItem={({item: data}) => {
              return (
                <DefaultListItem
                  title={data.title}
                  showArrow={data.showArrow}
                  icon={data.icon ? data.icon : ''}
                  count={data.count}
                  identifier={data.key}
                  isLast={data.isLast ? data.isLast : false}
                  onPress={(identifier: any) => {
                    segregateItemClick(identifier);
                  }}></DefaultListItem>
              );
            }}
          /> */}

          {
            Items.map((data: any, index: number) => (
              <DefaultListItem
                key={`Key ${index}`}
                title={data.title}
                showArrow={data.showArrow}
                icon={data.icon ? data.icon : ''}
                count={data.count}
                identifier={data.key}
                isLast={data.isLast ? data.isLast : false}
                onPress={(identifier: any) => {
                  segregateItemClick(identifier);
                }}></DefaultListItem>
            ))
          }
        </View>
      </SafeAreaView>
    </View>
  );
};

const mapState = (state: { [x: string]: any }) => ({
  userData: state.UserProfileRedux.userData,
  showLoaderValue: state.dashboardReducer.showLoader,
  loaderTextValue: state.dashboardReducer.loaderText,
});

const mapDispatch = (dispatch: Function) => {
  return {
    getUserData: (payload: any) =>
      dispatch({ type: GetUserData, payload: payload }),
    showLoader: (payload: any) =>
      dispatch({ type: SHOW_LOADER_READ, payload: payload }),
    loaderText: (payload: any) =>
      dispatch({ type: SHOW_LOADER_TEXT, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(MyAccount);
