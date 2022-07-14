import React from 'react';
import {
  SafeAreaView,
  FlatList,
  StatusBar,
  Alert,
  View,
  Platform,
  Text,
  TouchableOpacity,
  RefreshControl,
  TouchableHighlight,
  Image,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import DefaultListItem from '../../common/component/defaultListItem';
import {Colors, getValue, fontSize, fontFamily} from '../../common/constants';
import {
  kNotificationTypes,
  kForegroundNotificationListener,
} from './notificationServices';
import Utility from '../../common/utility';
import NoInternetView from '../../common/component/NoInternetView';
import {No_Internet_Warning, ToastMessage} from '../../common/component/Toast';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import EventManager from '../../common/eventManager';
import {connect} from 'react-redux';
import {
  NotificationsRedux,
  SeenFlag,
  MarkAllRead,
  AddNewNotification,
} from './reducer';
import {GetNotificationAPI, SetSeenFlag, LoadMoreNotifications} from './saga';
import NavigationThemeBar from '../../common/component/navigationBarForEdit/navigationBarWithTheme';
import {NotificationDataModel} from './notificationDataModel';
import PlaceholderImageView from '../../common/component/placeHolderImageView';
import {memory_read, memory_unread, memory_read_all} from '../../images';
import {NotificationListener} from '.';
import {kNotificationIndicator} from '../../common/component/TabBarIcons';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';

type Props = {[x: string]: any};
type State = {[x: string]: any};

class NotificationListing extends React.Component<Props> {
  loadMoreNotifications: EventManager;
  notificationReceivedForeground: EventManager;
  state: State = {
    index: 0,
    isRefreshing: false,
    isLoadMore: false,
  };

  constructor(props: Props) {
    super(props);
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

  componentDidMount() {
    this.setState({index: this.props.index});
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    //componentDidUpdate(props: Props){
    this.setState({isRefreshing: false});
  }

  cancelAction = () => {
    Keyboard.dismiss();
    Actions.pop();
    setTimeout(() => {
      EventManager.callBack(kNotificationIndicator);
    }, 1000);
  };

  setSeenFlag = (item: any, index: any) => {
    if (Utility.isInternetConnected) {
      if (item.unreadFlag) {
        this.props.updateReadAction({
          item: false,
          detailsIndex: this.state.index,
          dataIndex: index,
        });
        this.props.setNotificationFlag({ids: item.ids});
        this.setState({});
        EventManager.callBack(NotificationListener);
      }
    } else {
      No_Internet_Warning();
    }
  };

  markAllRead = () => {
    if (Utility.isInternetConnected) {
      this.props.markAllActions({detailsIndex: this.state.index});
      this.props.setNotificationFlag({
        group_ids: this.props.notificationList[this.state.index].group_id,
      });
      this.setState({});
      EventManager.callBack(NotificationListener);
    } else {
      No_Internet_Warning();
    }
  };

  redirectActivities = (item: any, index: any) => {
    if (Utility.isInternetConnected) {
      this.setSeenFlag(item, index);
      if (
        item.status == 0 &&
        (item.notificationType.indexOf('collaboration') != -1 ||
          item.notificationType.indexOf('new_edits') != -1)
      ) {
        Actions.push('createMemory', {editMode: true, draftNid: item.nid});
      } else {
        Actions.push('memoryDetails', {nid: item.nid, type: item.type});
      }
    } else {
      No_Internet_Warning();
    }
  };

  renderActivityView = (item: any): any => {
    let index = item.index;
    item = item.item;
    return (
      <View
        style={{
          padding: 15,
          paddingRight: 0,
          borderTopWidth: 16,
          borderBottomWidth: 0.5,
          borderColor: Colors.NewThemeColor,
          backgroundColor: item.unreadFlag ? '#DFF3F4' : '#fff',
          width: '100%',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              marginRight: 20,
              overflow: 'hidden',
            }}>
            <PlaceholderImageView
              uri={item.userProfile ? item.userProfile : ''}
              borderRadius={20}
              style={{
                height: 40,
                width: 40,
                marginRight: 20,
                borderRadius: Platform.OS === 'android' ? 40 : 20,
                backgroundColor: '#E3E3E3',
              }}
              profilePic={true}
            />
            {item.userCount > 1 && (
              <View
                style={{
                  position: 'absolute',
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  marginRight: 20,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    ...fontSize(18),
                    fontWeight: '500',
                    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                    color: Colors.white,
                  }}>
                  {'+'}
                  {item.userCount - 1}
                </Text>
              </View>
            )}
          </View>
          <View style={{flex: 1}}>
            <Text
              style={{
                color: Colors.NewTitleColor,
                ...fontSize(18),
                paddingRight: 5,
                textAlign: 'left',
              }}>
              {item.displayName}{' '}
              <Text style={{color: Colors.TextColor}} numberOfLines={2}>
                {item.descriptionText}
              </Text>{' '}
              '{item.title}'
            </Text>
            <Text
              style={{
                ...fontSize(14),
                color: Colors.TextColor,
                paddingTop: 10,
                paddingBottom: 15,
                fontStyle: 'italic',
              }}>
              {item.date}
            </Text>
            {item.isJoinInvite &&
            item.noteToCollaborator &&
            item.noteToCollaborator.length > 0 ? (
              <Text
                style={{
                  ...fontSize(16),
                  color: Colors.TextColor,
                  paddingBottom: 15,
                  fontWeight: '500',
                  fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                  fontStyle: 'italic',
                }}>
                Notes to collaborators:{' '}
                <Text style={{fontWeight: 'normal'}}>
                  {item.noteToCollaborator}
                </Text>
              </Text>
            ) : null}
            {item.isDisabled ? (
              <Text style={{color: Colors.ErrorColor, ...fontSize(16)}}>
                {item.errorMsg}
              </Text>
            ) : (
              <TouchableOpacity
                onPress={() => this.redirectActivities(item, index)}
                style={{
                  alignSelf: 'baseline',
                  paddingRight: 30,
                  paddingLeft: 34,
                  backgroundColor: Colors.BtnBgColor,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 17,
                }}>
                <Text style={{color: '#fff', ...fontSize(18)}}>
                  Open Memory
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableHighlight
            underlayColor="#ffffff33"
            style={{padding: 15, paddingTop: 0}}
            onPress={() => this.setSeenFlag(item, index)}>
            <Image source={item.unreadFlag ? memory_unread : memory_read} />
          </TouchableHighlight>
        </View>
      </View>
    );
  };

  refreshNotifications = () => {
    this.setState({isRefreshing: true});
    if (Utility.isInternetConnected) {
      this.props.getNotificationTypes();
    } else {
      No_Internet_Warning();
    }
  };

  renderFooter = () => {
    if (!this.state.isLoadMore) return null;
    return (
      <View style={{width: '100%', height: 50}}>
        <ActivityIndicator style={{color: '#000'}} />
      </View>
    );
  };

  handleLoadMore = () => {
    if (
      this.props.notificationList[this.state.index].total_count >
        this.props.notificationList[this.state.index].data.length &&
      !this.state.isLoadMore
    ) {
      this.setState({isLoadMore: true});
      this.props.loadMore({
        group_id: this.props.notificationList[this.state.index].group_id,
        limit: 20,
        offset: this.props.notificationList[this.state.index].data.length,
        index: this.state.index,
      });
      setTimeout(() => {
        this.setState({isLoadMore: false});
      }, 3000);
    }
  };

  render() {
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
            <NavigationHeaderSafeArea
              heading={this.props.heading}
              showCommunity={true}
              cancelAction={this.cancelAction}
              showRightText={false}
            />

            <View
              style={{
                width: '100%',
                flex: 1,
                backgroundColor: 'white',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <StatusBar
                barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
                backgroundColor={Colors.NewThemeColor}
              />
              {/* <SafeAreaView style={{ width : "100%", flex: 1,  alignItems: "center" }}>                 */}
              {this.props.notificationList[this.state.index].unseen_count >
                0 && (
                <View
                  style={{
                    width: '100%',
                    height: 50,
                    backgroundColor: '#fff',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      ...fontSize(16),
                      padding: 15,
                      color: Colors.TextColor,
                    }}>
                    {this.props.notificationList[this.state.index].unseen_count}{' '}
                    {'Unread'}
                  </Text>
                  <TouchableHighlight
                    onPress={() => this.markAllRead()}
                    underlayColor={'#ffffff33'}>
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{color: Colors.NewYellowColor, marginRight: 5}}>
                        Mark all as read
                      </Text>
                      <Image
                        style={{height: 18, width: 18}}
                        source={memory_read_all}
                      />
                    </View>
                  </TouchableHighlight>
                </View>
              )}
              <FlatList
                data={this.props.notificationList[this.props.index].data}
                style={{width: '100%', backgroundColor: '#fff'}}
                extraData={this.props}
                renderItem={(item: any) => this.renderActivityView(item)}
                maxToRenderPerBatch={50}
                keyExtractor={(_, index: number) => `${index}`}
                removeClippedSubviews={true}
                refreshControl={
                  <RefreshControl
                    colors={[
                      Colors.NewThemeColor,
                      Colors.NewThemeColor,
                      Colors.NewThemeColor,
                    ]}
                    tintColor={Colors.NewThemeColor}
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this.refreshNotifications()}
                  />
                }
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={this.renderFooter.bind(this)}
                onEndReachedThreshold={0.5}
                onEndReached={this.handleLoadMore.bind(this)}
              />
              {this.props.notificationList[this.state.index].total_count ==
              0 ? (
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'whitw',
                    alignSelf: 'center',
                    top: 0,
                    position: 'absolute',
                  }}
                  pointerEvents="none">
                  <Text
                    style={{
                      ...fontSize(18),
                      color: Colors.TextColor,
                      textAlign: 'center',
                      paddingLeft: 16,
                      paddingRight: 16,
                    }}>
                    There are no notifications to display at this moment.
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
const mapState = (state: {[x: string]: any}) => ({
  notificationList: state.NotificationsRedux.notificationData.slice(0),
});

const mapDispatch = (dispatch: Function) => {
  return {
    getNotificationTypes: () => dispatch({type: GetNotificationAPI}),
    updateReadAction: (payload: any) =>
      dispatch({type: SeenFlag, payload: payload}),
    markAllActions: (payload: any) =>
      dispatch({type: MarkAllRead, payload: payload}),
    setNotificationFlag: (payload: any) =>
      dispatch({type: SetSeenFlag, payload: payload}),
    loadMore: (payload: any) =>
      dispatch({type: LoadMoreNotifications, payload: payload}),
    addNotificationItem: (payload: any) =>
      dispatch({type: AddNewNotification, payload: payload}),
  };
};

export default connect(mapState, mapDispatch)(NotificationListing);
