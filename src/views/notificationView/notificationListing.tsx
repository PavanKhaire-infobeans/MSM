import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {NotificationListener} from '.';
import PlaceholderImageView from '../../common/component/placeHolderImageView';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import {kNotificationIndicator} from '../../common/component/TabBarIcons';
import {No_Internet_Warning} from '../../common/component/Toast';
import {Colors, fontFamily, fontSize} from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import {memory_read, memory_read_all, memory_unread} from '../../images';
import {NotificationDataModel} from './notificationDataModel';
import {kForegroundNotificationListener} from './notificationServices';
import {AddNewNotification, MarkAllRead, SeenFlag} from './reducer';
import {GetNotificationAPI, LoadMoreNotifications, SetSeenFlag} from './saga';
import Styles from './styles';

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
    this.setState({index: this.props.route.params.index});
  }

  componentWillUnmount = () => {
    this.notificationReceivedForeground.removeListener();
  };

  UNSAFE_componentWillReceiveProps(props: Props) {
    //componentDidUpdate(props: Props){
    if (this.props !== props) {
      this.setState({isRefreshing: false});
    }
  }

  cancelAction = () => {
    Keyboard.dismiss();
    this.props.navigation.goBack();
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
        // this.setState({});
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
      // this.setState({});
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
        this.props.navigation.navigate('createMemory', {
          editMode: true,
          draftNid: item.nid,
          navigation: this.props.navigation,
        });
      } else {
        this.props.navigation.navigate('newmemoryDetails', {
          nid: item.nid,
          type: item.type,
          navigation: this.props.navigation,
        });
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
        style={[
          Styles.flatListContainer,
          {
            backgroundColor: item.unreadFlag ? '#DFF3F4' : Colors.white,
          },
        ]}>
        <View style={Styles.flatListSubContainer}>
          <View style={Styles.profileContainer}>
            <PlaceholderImageView
              uri={item.userProfile ? item.userProfile : ''}
              borderRadius={20}
              style={Styles.profileImageSTyle}
              profilePic={true}
            />
            {item.userCount > 1 && (
              <View style={Styles.userCountContainer}>
                <Text style={Styles.userCount}>
                  {'+'}
                  {item.userCount - 1}
                </Text>
              </View>
            )}
          </View>
          <View style={Styles.container}>
            <Text style={Styles.displayName}>
              {item.displayName}{' '}
              <Text style={{color: Colors.TextColor}} numberOfLines={2}>
                {item.descriptionText}
              </Text>{' '}
              '{item.title}'
            </Text>
            <Text style={Styles.date}>{item.date}</Text>
            {item.isJoinInvite &&
            item.noteToCollaborator &&
            item.noteToCollaborator.length > 0 ? (
              <Text style={Styles.collaborators}>
                Notes to collaborators:{' '}
                <Text style={{fontWeight: 'normal'}}>
                  {item.noteToCollaborator}
                </Text>
              </Text>
            ) : null}
            {item.isDisabled ? (
              <Text style={Styles.errorStyle}>{item.errorMsg}</Text>
            ) : (
              <TouchableOpacity
                onPress={() => this.redirectActivities(item, index)}
                style={Styles.openMemoryContainer}>
                <Text style={Styles.openmemory}>Open Memory</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableHighlight
            underlayColor="#ffffff33"
            style={Styles.readContainer}
            onPress={() => this.setSeenFlag(item, index)}>
            <Image source={item.unreadFlag ? memory_unread : memory_read} />
          </TouchableHighlight>
        </View>
      </View>
    );
  };

  refreshNotifications = () => {
    this.setState({isRefreshing: true}, () => {
      if (Utility.isInternetConnected) {
        this.props.getNotificationTypes();
      } else {
        No_Internet_Warning();
      }
    });
  };

  renderFooter = () => {
    if (!this.state.isLoadMore) return null;
    return (
      <View style={Styles.footer}>
        <ActivityIndicator style={{color: Colors.black}} />
      </View>
    );
  };

  handleLoadMore = () => {
    if (
      this.props.notificationList[this.state.index].total_count >
        this.props.notificationList[this.state.index].data.length &&
      !this.state.isLoadMore
    ) {
      this.setState({isLoadMore: true}, () => {
        this.props.loadMore({
          group_id: this.props.notificationList[this.state.index].group_id,
          limit: 20,
          offset: this.props.notificationList[this.state.index].data.length,
          index: this.state.index,
        });
        setTimeout(() => {
          this.setState({isLoadMore: false});
        }, 3000);
      });
    }
  };

  render() {
    return (
      <View style={Styles.container}>
        <SafeAreaView style={Styles.noViewStyle} />
        <SafeAreaView style={Styles.safeAreaContextStyle}>
          <View style={Styles.container}>
            <NavigationHeaderSafeArea
              heading={this.props.heading}
              showCommunity={true}
              cancelAction={this.cancelAction}
              showRightText={false}
            />

            <View style={Styles.subContainer}>
              <StatusBar
                barStyle={
                  Utility.currentTheme == 'light'
                    ? 'dark-content'
                    : 'light-content'
                }
                backgroundColor={Colors.NewThemeColor}
              />
              {/* <SafeAreaView style={{ width : "100%", flex: 1,  alignItems: "center" }}>                 */}
              {this.props.notificationList[this.state.index].unseen_count >
                0 && (
                <View style={Styles.unSeenContainer}>
                  <Text style={Styles.unread}>
                    {this.props.notificationList[this.state.index].unseen_count}{' '}
                    {'Unread'}
                  </Text>
                  <TouchableHighlight
                    onPress={() => this.markAllRead()}
                    underlayColor={'#ffffff33'}>
                    <View style={Styles.allreadCOntainer}>
                      <Text style={Styles.allread}>Mark all as read</Text>
                      <Image
                        style={Styles.allReadImage}
                        source={memory_read_all}
                      />
                    </View>
                  </TouchableHighlight>
                </View>
              )}
              <FlatList
                data={
                  this.props.notificationList[this.props.route.params.index]
                    .data
                }
                style={Styles.flatListStyle}
                // extraData={this.props}
                renderItem={this.renderActivityView}
                maxToRenderPerBatch={15}
                windowSize={15}
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
                ListFooterComponent={()=>this.renderFooter()}
                onEndReachedThreshold={0.5}
                onEndReached={()=>this.handleLoadMore()}
              />
              {this.props.notificationList[this.state.index].total_count ==
              0 ? (
                <View style={Styles.noCountContainer} pointerEvents="none">
                  <Text style={Styles.noCount}>
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
