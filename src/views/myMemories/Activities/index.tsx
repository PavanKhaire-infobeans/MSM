import React from 'react';
import Text from '../../../common/component/Text';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  TouchableHighlight,
  ImageBackground,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Platform,
  Keyboard,
} from 'react-native';
import {
  ToastMessage,
  No_Internet_Warning,
} from '../../../common/component/Toast';
import {
  Colors,
  fontSize,
  getValue,
  DraftType,
  DraftActions,
  NO_INTERNET,
  fontFamily,
} from '../../../common/constants';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import Utility from '../../../common/utility';
import EventManager from '../../../common/eventManager';
import PlaceholderImageView from '../../../common/component/placeHolderImageView';
import {Actions} from 'react-native-router-flux';
import {
  GetActivities,
  kActivities,
  kActivityListener,
} from '../../notificationView/notificationServices';
import {NotificationDataModel} from '../../notificationView/notificationDataModel';

type State = {[x: string]: any};
type Props = {[x: string]: any};

export default class Activities extends React.Component<Props, State> {
  activitiesListener: EventManager;
  activitiesForeground: EventManager;
  state: State = {
    activityList: [],
    count: 0,
    unreadCount: 0,
    isRefreshing: false,
    isLoadMore: false,
    loadingDataFromServer: true,
  };

  constructor(props: Props) {
    super(props);
    this.activitiesListener = EventManager.addListener(
      kActivities,
      this.populateActivities,
    );
    this.activitiesForeground = EventManager.addListener(
      kActivityListener,
      this.activityReceivedForeground,
    );
  }

  componentDidMount() {
    this.getActivities(false, false);
  }

  activityReceivedForeground = (details: any) => {
    let activityList: any = this.state.activityList;
    activityList.forEach((element: any, index: any) => {
      if (
        element.nid == details[0].nid &&
        element.notificationId == details[0].notificationId &&
        element.fromUid == details[0].fromUid &&
        (element.notificationType == 'other_memory_like' ||
          element.notificationType == 'my_memory_like' ||
          element.notificationType == 'collaboration_invite')
      ) {
        activityList.splice(index, 1);
      }
    });
    activityList = details.concat(activityList).slice(0);
    this.setState({activityList: activityList});
  };

  populateActivities = (success: any, activities: any) => {
    if (success) {
      let activityList = activities.data
        ? new NotificationDataModel().getNotificationDetails(
            activities.data,
            true,
          )
        : [];
      activityList = this.state.isLoadMore
        ? this.state.activityList.concat(activityList).slice(0)
        : activityList;
      this.setState({
        activityList: activityList,
        count: activities.count ? parseInt(activities.count) : 0,
        unreadCount: activities.unread_count
          ? parseInt(activities.unread_count)
          : 0,
        isRefreshing: false,
        isLoadMore: false,
        loadingDataFromServer: false,
      });
    } else {
      ToastMessage(activities, Colors.ErrorColor);
    }
    setTimeout(() => {
      loaderHandler.hideLoader();
    }, 500);
  };

  getActivities = (isReferesh: any, isLoadMore: any) => {
    this.setState({isRefreshing: isReferesh, isLoadMore: isLoadMore});
    let initialOffset = this.state.activityList.length;
    if (Utility.isInternetConnected) {
      if (!isReferesh && !isLoadMore) loaderHandler.showLoader();
      else if (isReferesh) {
        initialOffset = 0;
      }
      GetActivities(
        {type: 'activities', limit: 20, offset: initialOffset},
        kActivities,
      );
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
          borderTopWidth: 7,
          borderBottomWidth: 0.5,
          borderColor: Colors.NewThemeColor,
          backgroundColor: '#fff',
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
                paddingRight: 10,
                textAlign: 'left',
              }}>
              {item.displayName}{' '}
              <Text style={{color: Colors.TextColor}}>
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
          {/* <Image source={item.seenFlag == 0 ? memory_unread : memory_read} /> */}
        </View>
      </View>
    );
  };

  renderFooter = () => {
    if (!this.state.isLoadMore) return null;
    return (
      <View style={{width: '100%', height: 50}}>
        <ActivityIndicator style={{color: '#000'}} />
      </View>
    );
  };

  redirectActivities = (item: any, index: any) => {
    if (Utility.isInternetConnected) {
      if (
        item.status == 0 &&
        (item.notificationType.indexOf('collaboration') != -1 ||
          item.notificationType.indexOf('new_edits') != -1)
      ) {
        Actions.push('createMemory', {editMode: true, draftNid: item.nid});
      } else {
        Actions.push('memoryDetails', {nid: item.nid, type: 'my_stories'});
      }
    } else {
      No_Internet_Warning();
    }
  };

  handleLoadMore = () => {
    if (
      this.state.count > this.state.activityList.length &&
      !this.state.isLoadMore
    ) {
      this.getActivities(false, true);
    }
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <StatusBar
          barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
          backgroundColor={Colors.ThemeColor}
        />
        <FlatList
          data={this.state.activityList}
          style={{width: '100%', backgroundColor: '#fff'}}
          keyExtractor={(_, index: number) => `${index}`}
          extraData={this.state}
          onScroll={() => {
            Keyboard.dismiss();
          }}
          renderItem={(item: any) => this.renderActivityView(item)}
          maxToRenderPerBatch={50}
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
              onRefresh={() => {
                this.getActivities(true, false);
              }}
            />
          }
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={this.renderFooter.bind(this)}
          onEndReachedThreshold={0.5}
          onEndReached={this.handleLoadMore.bind(this)}
        />
        {this.state.count == 0 && !this.state.loadingDataFromServer ? (
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
                color: '#909090',
                textAlign: 'center',
                paddingLeft: 16,
                paddingRight: 16,
              }}>
              There are no activities to display at this moment.
            </Text>
          </View>
        ) : null}
      </SafeAreaView>
    );
  }
}
