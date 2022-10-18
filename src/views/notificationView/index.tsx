import React from 'react';
import { FlatList, SafeAreaView, StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import BusyIndicator from '../../common/component/busyindicator';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import DefaultListItem from '../../common/component/defaultListItem';
import { kNotificationIndicator } from '../../common/component/TabBarIcons';
import { No_Internet_Warning } from '../../common/component/Toast';
import { Colors } from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import { SHOW_LOADER_READ, SHOW_LOADER_TEXT } from '../dashboard/dashboardReducer';
import NavigationBar from '../dashboard/NavigationBar';
import { NotificationDataModel } from './notificationDataModel';
import { kForegroundNotificationListener } from './notificationServices';
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
type Props = { [x: string]: any };
type State = { [x: string]: any };
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
    this.props.addNotificationItem({ group_id: group_id, details: [details] });
    setTimeout(() => {
      EventManager.callBack(kNotificationIndicator);
    }, 2000);
  };

  sendcallback = () => { };

  componentWillUnmount = () => {
    this.notificationListener.removeListener();
    this.notificationReceivedForeground.removeListener();
  };

  updateListing = () => {
    this.setState({});
  };

  componentDidMount() {
    if (Utility.isInternetConnected) {
      //loaderHandler.showLoader();
      this.props.showLoader(true);
      this.props.loaderText('Loading...');
      this.props.getNotificationTypes();
    } else {
      No_Internet_Warning();
    }
  }

  navigateToNotificationListing = (item: any) => {
    this.props.navigation.navigate('notificationListing', {
      heading: item.item.group_name,
      index: item.index,
      // navigation: this.props.navigation,
    });
  };

  renderItem = (item: any) => {
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
  };

  render() {
    return (
      <View style={Styles.container}>
        {
          this.props.showLoaderValue ?
            <BusyIndicator startVisible={this.props.showLoaderValue} text={this.props.loaderTextValue != '' ? this.props.loaderTextValue : 'Loading...'} overlayColor={Colors.ThemeColor} />
            :
            null
        }
        <SafeAreaView style={Styles.noViewStyle} />
        <SafeAreaView style={Styles.safeAreaContextStyle}>
          <View style={Styles.container}>
            <NavigationBar
              title={'Notifications'}
              showClose={true}
              navigation={this.props.navigation}
            />
            {/* <NavigationBar title={TabItems.Notifications}/> */}
            <StatusBar
              barStyle={
                Utility.currentTheme == 'light'
                  ? 'dark-content'
                  : 'light-content'
              }
              backgroundColor={Colors.NewThemeColor}
            />
            <FlatList
              data={this.props.notificationList && this.props.notificationList.length ? this.props.notificationList : []}
              keyExtractor={(_, index: number) => `${index}`}
              style={Styles.flatListStyle}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
              removeClippedSubviews={true}
              renderItem={this.renderItem}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
const mapState = (state: { [x: string]: any }) => ({
  notificationList: state.NotificationsRedux.notificationData,
  showLoaderValue: state.dashboardReducer.showLoader,
  loaderTextValue: state.dashboardReducer.loaderText,
});

const mapDispatch = (dispatch: Function) => {
  return {
    getNotificationTypes: () => dispatch({ type: GetNotificationAPI }),
    setCurrentList: (payload: any) =>
      dispatch({ type: CurrentList, payload: payload }),
    addNotificationItem: (payload: any) =>
      dispatch({ type: AddNewNotification, payload: payload }),
    showLoader: (payload: any) =>
      dispatch({ type: SHOW_LOADER_READ, payload: payload }),
    loaderText: (payload: any) =>
      dispatch({ type: SHOW_LOADER_TEXT, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(NotificationView);
