import React from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  View,
  TouchableHighlight,
  StatusBar,
  Platform,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import DefaultListItem from '../../common/component/defaultListItem';
import TextNew from '../../common/component/Text';
import {Colors, fontFamily, fontSize} from '../../common/constants';
import EventManager from '../../common/eventManager';
import {Account} from '../../common/loginStore';
import {
  icon_drafts,
  icon_idea,
  icon_logout,
  icon_memories,
  icon_messages,
  icon_password,
  icon_tickets,
  profile_placeholder,
} from '../../images';
import {kLogoutPressed} from '../../views/menu';
import {kProfilePicUpdated} from '../profile/profileDataModel';
import NavigationBar from '../dashboard/NavigationBar';
import Utility from '../../common/utility';
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
  state = {
    Items: [],
  };

  fullname =
    Account.selectedData().firstName + ' ' + Account.selectedData().lastName;

  segregateItemClick(identifier: any) {
    switch (identifier) {
      case MyMessages:
        break;
      case Mindops:
        Actions.push('mindPop');
        break;
      case Drafts:
        Actions.jump('memoriesDrafts', {isFromMenu: true});
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
    this.setState({Items: items});
    this.profilePicUpdate = EventManager.addListener(
      kProfilePicUpdated,
      this.updateProfilePic,
    );
  };

  updateProfilePic = () => {
    this.fullname =
      Account.selectedData().firstName + ' ' + Account.selectedData().lastName;
    this.setState({});
  };

  render() {
    let profilePic = Account.selectedData().profileImage;
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
            <NavigationBar title={'My Account'} showClose={true} />
            <StatusBar
              barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            <View
              style={{
                width: '100%',
                height: 115,
                backgroundColor: '#E6F0EF',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <ImageBackground
                style={{width: 75, height: 75, marginLeft: 16}}
                imageStyle={{borderRadius: 40}}
                source={profile_placeholder}>
                <Image
                  source={
                    profilePic != '' ? {uri: profilePic} : profile_placeholder
                  }
                  style={{width: 75, height: 75, borderRadius: 40}}
                />
              </ImageBackground>

              <View style={{alignItems: 'flex-start', paddingLeft: 10}}>
                <TextNew
                  style={{
                    fontWeight: '500',
                    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                    ...fontSize(18),
                    color: Colors.TextColor,
                  }}>
                  {this.fullname}
                </TextNew>
                <TouchableHighlight
                  underlayColor="#cccccc3e"
                  onPress={() => {
                    Actions.push('profile');
                  }}>
                  <TextNew
                    style={{
                      paddingTop: 6,
                      fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                      fontWeight: '500',
                      ...fontSize(16),
                      color: Colors.NewTitleColor,
                    }}>
                    View your Profile
                  </TextNew>
                </TouchableHighlight>
              </View>
            </View>
            <FlatList
              data={this.state.Items}
              keyExtractor={(_, index: number) => `${index}`}
              style={{width: '100%', backgroundColor: 'white'}}
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
