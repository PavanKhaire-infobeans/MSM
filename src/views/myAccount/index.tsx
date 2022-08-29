import React from 'react';
import {
  FlatList,
  Image,
  ImageBackground, Platform, SafeAreaView, StatusBar, TouchableHighlight, View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import DefaultListItem from '../../common/component/defaultListItem';
import TextNew from '../../common/component/Text';
import { No_Internet_Warning } from '../../common/component/Toast';
import { Colors, fontFamily, fontSize, getValue, Storage } from '../../common/constants';
import EventManager from '../../common/eventManager';
import { Account } from '../../common/loginStore';
import Utility from '../../common/utility';
import {
  icon_drafts,
  icon_idea,
  icon_logout,
  icon_password,
  profile_placeholder
} from '../../images';
import { kLogoutPressed } from '../../views/menu';
import NavigationBar from '../dashboard/NavigationBar';
import { kProfilePicUpdated, ProfileDataModel } from '../profile/profileDataModel';
import { kGetUserProfileData, UserProfile } from '../profile/userProfileWebService';
import Styles from './styles';
type items = {
  title: string;
  showArrow: boolean;
  icon: any;
  count: number;
  key: string;
  isLast?: boolean;
};

const MyMessages = 'Messages';
const Mindops = 'MindPops';
const Drafts = 'Memory Drafts';
const Memories = 'Memory Collections';
const Tickets = 'Tickets';
const ChangePassword = 'Change Password';
const Logout = 'Logout';

export default class MyAccount extends React.Component {
  profilePicUpdate: EventManager;
  checkProfile: EventManager;
  profileData: ProfileDataModel;
  state = {
    Items: [],
    userImage: null
  };

  constructor(props: object) {
    super(props);

    this.checkProfile = EventManager.addListener(
      kGetUserProfileData,
      this.getUserProfileDataCallBack,
    );
    // this.userProfileUpdated = EventManager.addListener(kUserAccountUpdated, this.userAccountChanged);
    this.profileData = new ProfileDataModel();
    // if ( Actions.currentScene == 'myAccount' || Actions.currentScene == 'profile' ) {
    this.getUserProfileData();
    // }

    this.profilePicUpdate = EventManager.addListener(
      kProfilePicUpdated,
      this.updateProfilePic,
    );

  }

  fullname = Account.selectedData().firstName + ' ' + Account.selectedData().lastName;

  componentWillUnmount =()=>{
    this.checkProfile.removeListener()
    this.profilePicUpdate.removeListener()
  }

  segregateItemClick(identifier: any) {
    switch (identifier) {
      case MyMessages:
        break;
      case Mindops:
        Actions.push('mindPop');
        break;
      case Drafts:
        // Actions.jump('memoriesDrafts', {isFromMenu: true});
        Actions.replace('writeTabs')
        break;
      case Memories:
        break;
      case Tickets:
        break;
      case ChangePassword:
        Actions.push('changePassword');
        break;
      case Logout:
        EventManager.callBack(kLogoutPressed);
        break;
      default:
    }
  }

  componentDidMount = () => {
    let items = [{}];
    this.getUserProfileDataImage();
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
    this.setState({ Items: items });

  };

  getUserProfileDataImage = async () => {
    let userImage = (await Storage.get("user_profile_image"));
    this.setState({userImage});
  }

  // CallBack for Profile data web service
  getUserProfileDataCallBack = (success: boolean, profileDetails: any) => {
    //stop refresh control
    if (success) {
      this.profileData.updateValues(profileDetails);
      // this.setState({ refreshing: false });
      loaderHandler.hideLoader();
    }
    // this.setState({ refreshing: false });
  };

  // Web-service call to fetch profile data
  getUserProfileData = () => {
    if (Utility.isInternetConnected) {
      // loaderHandler.showLoader('Loading...');
      UserProfile();
    } else {
      No_Internet_Warning();
    }
  };

  updateProfilePic = () => {
    this.fullname =
      Account.selectedData().firstName + ' ' + Account.selectedData().lastName;
    // this.setState({});
  };

  render() {
    let profilePic = Account.selectedData().profileImage;
    let imageURL =
      getValue(this.profileData, ['basicInfo', 'profilePicUri']) || '';
    let profilePicURL =
      imageURL != '' ? Utility.getFileURLFromPublicURL(imageURL) : '';
    return (
      <View style={Styles.container}>
        <SafeAreaView
          style={Styles.noViewStyle}
        />
        <SafeAreaView style={Styles.safeAreaContextStyle}>
          <View style={Styles.container}>
            <NavigationBar title={'My Account'} showClose={true} />
            <StatusBar
              barStyle={Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            <View
              style={Styles.profileImage}>
              <ImageBackground
                style={Styles.imagebackGroundStyle}
                imageStyle={Styles.imageStyle}
                source={profile_placeholder}>
                <Image
                  source={
                    profilePic != '' ? { uri: profilePic } : profile_placeholder
                    // this.state.userImage ? { uri: this.state.userImage } : profilePic != '' ? { uri: profilePic } : profile_placeholder
                  }
                  style={Styles.imageStyle}
                />
              </ImageBackground>

              <View style={Styles.fullNameContainer}>
                <TextNew
                  style={Styles.fullName}>
                  {this.fullname}
                </TextNew>
                <TouchableHighlight
                  underlayColor="#cccccc3e"
                  onPress={() => {
                    Actions.push('profile');
                  }}>
                  <TextNew
                    style={Styles.viewProfile}>
                    View your Profile
                  </TextNew>
                </TouchableHighlight>
              </View>
            </View>
            <FlatList
              data={this.state.Items}
              keyExtractor={(_, index: number) => `${index}`}
              style={Styles.flatListStyle}
              renderItem={({ item: data }) => {
                return (
                  <DefaultListItem
                    title={data.title}
                    showArrow={data.showArrow}
                    icon={data.icon ? data.icon : ''}
                    count={data.count}
                    identifier={data.key}
                    isLast={data.isLast ? data.isLast : false}
                    onPress={(identifier: any) => {
                      this.segregateItemClick(identifier);
                    }}></DefaultListItem>
                );
              }}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
