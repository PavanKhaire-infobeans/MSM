import React from 'react';
import { FlatList, SafeAreaView, StatusBar, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import DefaultListItem from '../../common/component/defaultListItem';
import {
  kNotificationIndicator
} from '../../common/component/TabBarIcons';
import { No_Internet_Warning } from '../../common/component/Toast';
import { Colors } from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import NavigationBar from '../dashboard/NavigationBar';
import { NotificationDataModel } from './notificationDataModel';
import {
  kForegroundNotificationListener
} from './notificationServices';
import { AddNewNotification, CurrentList } from './reducer';
import { GetNotificationAPI } from './saga';
import Styles from './styles';

type items = {
  title: string;
  showArrow: boolean;
  icon?: any;
  subtitle?: string;
  count: number;
  key: string;
  isLast?: boolean;
};
type Props = {[x: string]: any};
type State = {[x: string]: any};
export const NotificationListener = 'noticeListerner';
class NotificationView extends React.Component<Props> {
  notificationListener: EventManager;
  notificationReceivedForeground: EventManager;
  state: State = {
    item: [],
  };

  constructor(props: Props) {
    super(props);
    this.notificationListener = EventManager.addListener(
      NotificationListener,
      this.updateListing,
    );
    this.notificationReceivedForeground = EventManager.addListener(
      kForegroundNotificationListener,
      this.notificationReceived,
    );
  }

  notificationReceived = (details: any) => {
    let group_id = new NotificationDataModel().getGroupId(
      details.notificationType,
    );
    this.props.addNotificationItem({group_id: group_id, details: [details]});
    setTimeout(() => {
      EventManager.callBack(kNotificationIndicator);
    }, 2000);
  };

  sendcallback = () => {};

  updateListing = () => {
    this.setState({});
  };

  componentDidMount() {
    if (Utility.isInternetConnected) {
      loaderHandler.showLoader();
      this.props.getNotificationTypes();
    } else {
      No_Internet_Warning();
    }
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    // componentWillReceiveProps(props: Props){
    this.setState({});
    loaderHandler.hideLoader();
  }

  navigateToNotificationListing = (item: any) => {
    Actions.push('notificationListing', {
      heading: item.item.group_name,
      index: item.index,
    });
  };

  render() {
    return (
      <View style={Styles.container}>
        <SafeAreaView
          style={Styles.noViewStyle}
        />
        <SafeAreaView style={Styles.safeAreaContextStyle}>
          <View style={Styles.container}>
            <NavigationBar title={'Notifications'} showClose={true} />
            {/* <NavigationBar title={TabItems.Notifications}/> */}
            <StatusBar
              barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            <FlatList
              data={this.props.notificationList}
              keyExtractor={(_, index: number) => `${index}`}
              style={Styles.flatListStyle}
              renderItem={(item: any) => {
                return (
                  <DefaultListItem
                    title={item.item.group_name}
                    showArrow={true}
                    count={item.item.unseen_count}
                    identifier={item.item.group_id}
                    isLast={false}
                    subTitle={item.item.group_description}
                    onPress={() =>
                      this.navigateToNotificationListing(item)
                    }></DefaultListItem>
                );
              }}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
const mapState = (state: {[x: string]: any}) => ({
  notificationList: state.NotificationsRedux.notificationData,
});

const mapDispatch = (dispatch: Function) => {
  return {
    getNotificationTypes: () => dispatch({type: GetNotificationAPI}),
    setCurrentList: (payload: any) =>
      dispatch({type: CurrentList, payload: payload}),
    addNotificationItem: (payload: any) =>
      dispatch({type: AddNewNotification, payload: payload}),
  };
};

export default connect(mapState, mapDispatch)(NotificationView);
