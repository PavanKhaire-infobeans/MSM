import React from 'react';
import { FlatList, SafeAreaView, StatusBar, View } from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import DefaultListItem from '../../common/component/defaultListItem';
import { Colors } from '../../common/constants';
import { Account } from '../../common/loginStore';
import Utility from '../../common/utility';
import {
  block_user,
  guide_tour_icon,
  icon_faq,
  icon_info,
  icon_tickets,
} from '../../images';
import NavigationBar from '../dashboard/NavigationBar';
import Styles from './styles';

type items = {
  title: string;
  showArrow: boolean;
  icon?: any;
  count: number;
  key: string;
  isWebPage: boolean;
  isLast?: boolean;
  isTour?: boolean;
};

type Props = {
  fromDeepLink?: boolean;
  deepLinkBackClick?: boolean;
};

const People = 'People';
const BlockedUsers = 'Blocked Users';
const PrivacyPolicy = 'Privacy Policy';
const FAQs = 'FAQs';
const Contact = 'Contact Us';
const About = 'About My Stories Matter';
const GuidedTour = 'Guided Tour';

export default class MoreOptions extends React.Component<Props> {
  componentDidMount = () => {
    if (this.props.fromDeepLink) {
      this.segregateItemClick(About, true, false);
    }
  };

  Items: Array<items> = [
    // {title: People, showArrow : true, icon: icon_people, count : 0, key : People},
    // {title: Events, showArrow : true, icon: icon_events, count : 0, key : Events},
    // {title: Settings, showArrow : true, icon: icon_settings, count : 0, key : Settings},
    {
      title: FAQs,
      showArrow: true,
      icon: icon_faq,
      count: 0,
      key: FAQs,
      isWebPage: true,
    },
    // {title: Contact, showArrow : true, icon: icon_headset, count : 0, key : Contact},
    {
      title: About,
      showArrow: true,
      icon: icon_info,
      count: 0,
      key: About,
      isWebPage: true,
    },
    {
      title: PrivacyPolicy,
      showArrow: true,
      icon: icon_tickets,
      count: 0,
      key: PrivacyPolicy,
      isWebPage: true,
    },
    {
      title: GuidedTour,
      showArrow: false,
      icon: guide_tour_icon,
      count: 0,
      key: GuidedTour,
      isWebPage: false,
      isTour: true,
    },
    {
      title: BlockedUsers,
      showArrow: false,
      icon: block_user,
      count: 0,
      key: BlockedUsers,
      isLast: true,
      isWebPage: false,
    },
  ];

  segregateItemClick(identifier: any, isWebPage: boolean, isTour: boolean) {
    if (isWebPage) {
      var url = `https://${Account.selectedData().instanceURL}/`;
      switch (identifier) {
        case FAQs:
          url = url + 'faq';
          break;
        case Contact:
          url = url + 'contactus';
          break;
        case About:
          url = url + 'content/about-us';
          break;
        case PrivacyPolicy:
          url = url + 'content/privacy-policy';
          break;
        default:
      }
      url = url + '?no_header=1';
      this.props.navigation.navigate('commonWebView', {
        url: url,
        title: identifier,
        deepLinkBackClick: this.props.deepLinkBackClick,
      });
    } else if (isTour) {
      DefaultPreference.set('hide_guide_tour', 'false').then(function () { });
      this.props.navigation.navigate('dashBoard', { setTimer: 'false' });
    } else {
      this.props.navigation.navigate('blockedUsers');
    }
  }

  renderItem = ({ item: data }) => (
    <DefaultListItem
      key={data.key}
      title={data.title}
      showArrow={data.showArrow}
      icon={data.icon ? data.icon : ''}
      count={data.count}
      identifier={data.key}
      isLast={data.isLast ? data.isLast : false}
      onPress={(identifier: any) => {
        this.segregateItemClick(
          identifier,
          data.isWebPage,
          data.isTour,
        );
      }}></DefaultListItem>
  )

  render() {
    return (
      <View style={Styles.container}>
        <SafeAreaView style={Styles.noViewStyle} />
        <SafeAreaView style={Styles.safeAreaContextStyle}>
          <View style={Styles.container}>
            <NavigationBar
              title={'More Options'}
              navigation={this.props.navigation}
            />
            <StatusBar
              barStyle={
                Utility.currentTheme == 'light'
                  ? 'dark-content'
                  : 'light-content'
              }
              backgroundColor={Colors.NewThemeColor}
            />
            <FlatList
              data={this.Items}
              keyExtractor={(_, index: number) => `${index}`}
              style={Styles.flatListStyle}
              renderItem={this.renderItem}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
