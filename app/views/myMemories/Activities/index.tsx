import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {NotificationDataModel} from '../../../../src/views/notificationView/notificationDataModel';
import {
  GetActivities,
  kActivities,
  kActivityListener,
} from '../../../../src/views/notificationView/notificationServices';
import loaderHandler from './../../../../src/common/component/busyindicator/LoaderHandler';
import PlaceholderImageView from './../../../../src/common/component/placeHolderImageView';
import Text from './../../../../src/common/component/Text';
import {
  No_Internet_Warning,
  ToastMessage,
} from './../../../../src/common/component/Toast';
import {Colors} from './../../../../src/common/constants';
import EventManager from './../../../../src/common/eventManager';
import Utility from './../../../../src/common/utility';
import styles from './styles';

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

  componentWillUnmount = () => {
    this.activitiesListener.removeListener();
    this.activitiesForeground.removeListener();
  };

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
    this.setState({isRefreshing: isReferesh, isLoadMore: isLoadMore}, () => {
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
    });
  };

  renderActivityView = (item: any): any => {
    let index = item.index;
    item = item.item;
    return (
      <View style={styles.activityViewStyle}>
        <View style={styles.authorContainer}>
          <PlaceholderImageView
            uri={item.userProfile ? item.userProfile : ''}
            borderRadius={21}
            style={styles.authorImageStyle}
            profilePic={true}
          />
          {item.userCount > 1 && (
            <View style={styles.activityUserCountStyle}>
              <Text style={styles.activityUserCountTextStyle}>
                {'+'}
                {item.userCount - 1}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.fullFlex}>
          <Text style={styles.displayNameTextStyle}>
            {item.displayName}{' '}
            <Text style={{color: Colors.TextColor}}>
              {item.descriptionText}
            </Text>{' '}
            '{item.title}'
          </Text>
          <Text style={styles.dateTextStyle}>{item.date}</Text>
          {item.isJoinInvite &&
          item.noteToCollaborator &&
          item.noteToCollaborator.length > 0 ? (
            <Text style={styles.notesToCollabrationTextStyle}>
              Notes to collaborators:{' '}
              <Text style={{fontWeight: 'normal'}}>
                {item.noteToCollaborator}
              </Text>
            </Text>
          ) : null}
          {item.isDisabled ? (
            <Text style={styles.errorTextStyle}>{item.errorMsg}</Text>
          ) : (
            <TouchableWithoutFeedback
              onPress={() => this.redirectActivities(item, index)}>
              <View style={styles.openMemoryButtonStyle}>
                <Text style={styles.buttonTextStyle}>Open Memory</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </View>
    );
  };

  renderFooter = () => {
    if (!this.state.isLoadMore) return null;
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator color={Colors.black} />
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
        this.props.navigation.push('createMemory', {
          editMode: true,
          draftNid: item.nid,
        });
      } else {
        this.props.navigation.push('memoryDetails', {
          nid: item.nid,
          type: 'my_stories',
        });
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
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar
          barStyle={
            Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
          }
          backgroundColor={Colors.ThemeColor}
        />
        <FlatList
          data={this.state.activityList}
          style={styles.flatlistStyle}
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
          // keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={this.renderFooter.bind(this)}
          onEndReachedThreshold={0.5}
          onEndReached={this.handleLoadMore.bind(this)}
        />
        {this.state.count == 0 && !this.state.loadingDataFromServer ? (
          <View style={styles.noActivityCOntainerStyle} pointerEvents="none">
            <Text style={styles.noActivityTextStyle}>
              There are no activities to display at this moment.
            </Text>
          </View>
        ) : null}
      </SafeAreaView>
    );
  }
}
