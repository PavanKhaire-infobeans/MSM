import React, { createRef } from 'react';
import {
  DeviceEventEmitter,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import NewNavigationBar from '../../../app/components/NewNavigationBar';
import TabIcon, {
  kNotificationIndicator,
  NewTabItems,
  TabItems,
} from '../../common/component/TabBarIcons';
import {
  Colors,
  decode_utf8,
  fontFamily,
  fontSize,
  Storage,
} from '../../common/constants';
import Utility from '../../common/utility';
import { configurations } from '../../common/webservice/loginServices';
import {
  ACTIVE_TAB_ON_DASHBOARD,
  CreateAMemory,
  GET_FILTERS_DATA,
  GET_FILTERS_DATA_TIMELINE,
  GET_MEMORY_LIST,
  ListType,
  MEMORY_ACTIONS_DASHBOARD,
} from './dashboardReducer';
// @ts-ignore
import DefaultPreference from 'react-native-default-preference';
// @ts-ignore
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import CustomAlert from '../../common/component/customeAlert';
import ScrollableTabView from '../../common/component/ScrollableTabView';
import TextNew from '../../common/component/Text';
import { No_Internet_Warning, ToastMessage } from '../../common/component/Toast';
import EventManager from '../../common/eventManager';
import { Account } from '../../common/loginStore';
import { filter_icon } from '../../images';
import { MonthObj, months } from '../createMemory';
import {
  CreateUpdateMemory,
  promptIdListener,
} from '../createMemory/createMemoryWebService';
import { DefaultDetailsMemory } from '../createMemory/dataHelper';
import { showCustomAlert } from '../createMemory/reducer';
import { kMemoryActionPerformedOnDashboard } from '../myMemories/myMemoriesWebService';
import { NotificationDataModel } from '../notificationView/notificationDataModel';
import {
  GetActivities,
  kActivityListener,
  kBackgroundNotice,
  kForegroundNotice,
  kForegroundNotificationListener,
  kGetInvidualNotification,
  SetSeenActivity,
} from '../notificationView/notificationServices';
import { kProfilePicUpdated } from '../profile/profileDataModel';
import AppGuidedTour from './appGuidedTour';
import Recent from './recent';
import Styles from './styles';
import Timeline from './timeline';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
type Props = { [x: string]: any };

class DashboardIndex extends React.Component<Props> {
  notificationListener: EventManager;
  foregroundNotification: EventManager;
  backgroundNotification: EventManager;
  scrollableTabView: any;
  eventManager: EventManager;
  memoryActionsListener: EventManager;
  notificationModel: NotificationDataModel;
  eventListener: EventManager;
  state = {
    filterScreenVisibility: false,
    jumpToVisibility: false,
    currentScreen: ListType.Recent,
    appTourVisibility: false,
  };
  memoryFromPrompt: EventManager;
  screen = '';
  timelineRef = createRef();
  constructor(props: Props) {
    super(props);
    this.FetchConfigurations();
    this.notificationModel = new NotificationDataModel();
    // this.eventManager = EventManager.addListener(
    //   'addContentTabPressed',
    //   this.navigateToAddContent,
    // );
    // this.notificationListener = EventManager.addListener(
    //   kGetInvidualNotification,
    //   this.notificationCallback,
    // );
    // this.foregroundNotification = EventManager.addListener(
    //   kForegroundNotice,
    //   this.foregroundNotificationCallback,
    // );
    // this.backgroundNotification = EventManager.addListener(
    //   kBackgroundNotice,
    //   this.checkNotificationAvailiability,
    // );
    // this.eventListener = EventManager.addListener(
    //   kNotificationIndicator,
    //   this.changeNotification,
    // );
    // this.memoryActionsListener = EventManager.addListener(
    //   kMemoryActionPerformedOnDashboard,
    //   this.memoryActionCallBack,
    // );
    // this.memoryFromPrompt = EventManager.addListener(
    //   promptIdListener,
    //   this.promptToMemoryCallBack,
    // );
  }

  navigateToAddContent = () => {
    ReactNativeHapticFeedback.trigger('notificationSuccess', options);
    // this.props.navigation.navigate('addContent');
  };

  componentDidMount = () => {
    this.props.setCreateMemory(false);
    if (this.props.setTimer == 'false') {
      this.state.appTourVisibility = true;
    } else {
      setTimeout(() => {
        DefaultPreference.get('hide_guide_tour').then((value: any) => {
          if (value == 'true') {
            this.state.appTourVisibility = false;
          } else {
            this.state.appTourVisibility = true;
          }
        });
      }, 2000);
    }
  };

  changeNotification = () => {
    this.props.navigation.reset('root');
  };

  foregroundNotificationCallback = (details: any) => {
    if (Utility.isInternetConnected) {
      let key =
        Account.selectedData().instanceID + '_' + Account.selectedData().userID;
      Utility.unreadNotification[key] = Utility.unreadNotification[key]++;
      setTimeout(() => {
        EventManager.callBack(kNotificationIndicator);
      }, 2000);
      Utility.notificationObject.isBackgroundNotification = false;
      GetActivities(
        {
          notification_params: {
            nid: details.nid,
            notification_id: details.notification_id,
          },
        },
        kGetInvidualNotification,
      );
    } else {
      No_Internet_Warning();
    }
  };

  checkNotificationAvailiability() {
    if (Utility.notificationObject.hasNotification) {
      if (Utility.isInternetConnected) {
        Utility.notificationObject.hasNotification = false;
        Utility.notificationObject.isBackgroundNotification = true;
        loaderHandler.showLoader();
        GetActivities(
          {
            notification_params: {
              nid: Utility.notificationObject.data.nid,
              notification_id: Utility.notificationObject.data.notification_id,
            },
          },
          kGetInvidualNotification,
        );
      } else {
        No_Internet_Warning();
      }
    }
  }

  notificationCallback = (success: any, details: any) => {
    loaderHandler.hideLoader();
    if (success && Utility.isInternetConnected) {
      details = this.notificationModel.getNotificationDetails(
        details.data,
        false,
      )[0];
      // console.log("Final data:",details);
      if (Utility.notificationObject.isBackgroundNotification) {
        SetSeenActivity({ ids: details.ids }, 0);
        if (
          details.status == 0 &&
          (details.notificationType.indexOf('collaboration') != -1 ||
            details.notificationType.indexOf('new_edits') != -1)
        ) {
          // this.props.navigation.navigate("createMemory", { editMode: true, draftNid: details.nid })
        } else {
          if (
            details.notificationType === 'prompt_of_the_week_email' &&
            details.type === 'prompts'
          ) {
            //handle prompts to memory here
            this.convertToMemory(details.nid, details.title);
          } else {
            // this.props.navigation.navigate("memoryDetails", { "nid": details.nid, "type": details.type })
          }
        }
      } else {
        //console.log("foreground",details);
        if (
          details.notificationType !== 'prompt_of_the_week_email' &&
          details.type !== 'prompts'
        ) {
          EventManager.callBack(kForegroundNotificationListener, details);
          if (this.notificationModel.isPartOfActivity(details)) {
            EventManager.callBack(kActivityListener, [details]);
          }
        }
      }
    } else if (!Utility.isInternetConnected) {
      No_Internet_Warning();
    }
  };

  convertToMemory(id: any, title: any) {
    if (Utility.isInternetConnected) {
      loaderHandler.showLoader('Creating Memory...');
      let draftDetails: any = DefaultDetailsMemory(decode_utf8(title.trim()));
      draftDetails.prompt_id = parseInt(id);
      CreateUpdateMemory(draftDetails, [], promptIdListener, 'save');
    } else {
      No_Internet_Warning();
    }
  }

  promptToMemoryCallBack = (success: boolean, draftDetails: any) => {
    setTimeout(() => {
      loaderHandler.hideLoader();
    }, 500);
    if (success) {
      // this.props.navigation.navigate("createMemory", { editMode: true, draftNid: draftDetails, isFromPrompt: true })
    } else {
      loaderHandler.hideLoader();
      ToastMessage(draftDetails);
    }
  };

  componentWillUnmount = () => {
    this.props.showAlertCall(false);
    // this.eventManager.removeListener();
    // this.memoryFromPrompt.removeListener();
    // this.notificationListener.removeListener();
    // this.foregroundNotification.removeListener();
    // this.backgroundNotification.removeListener();
    // this.eventListener.removeListener();
    // this.memoryActionsListener.removeListener();
  };

  memoryActionCallBack = (
    fetched: boolean,
    responseMessage: any,
    nid?: any,
    type?: any,
    uid?: any,
  ) => {
    loaderHandler.hideLoader();
    if (fetched) {
      // if (type == MemoryActionKeys.removeMeFromThisPostKey){
      //     publishedMemoriesArray.forEach((element: any, index: any) => {
      //         if (element.nid == nid) {
      //             delete publishedMemoriesArray[index].actions_on_memory.remove_me_from_this_post
      //         }
      //     });
      // }
      // else if(type == MemoryActionKeys.blockAndReportKey || type == MemoryActionKeys.blockUserKey){
      //     publishedMemoriesArray = publishedMemoriesArray.filter((element: any) => element.user_details.uid != uid)
      // }
      // else{
      //     publishedMemoriesArray = publishedMemoriesArray.filter((element: any) => element.nid != nid)
      // }
      // this.publishedMemoryDataModel.updatePublishedMemories(publishedMemoriesArray)
      this.props.sendMemoryActions({ nid, type, uid });
      // this.setState({});
    } else {
      ToastMessage(responseMessage, Colors.ErrorColor);
    }
  };

  onFilterClick = () => {
    this.setState({ currentScreen: this.screen }, () => {
      // this.props.navigation.navigate("filtersScreen", { currentScreen: this.screen });
    });
  };

  render() {
    return (
      <View style={Styles.fullFlex}>
        <SafeAreaView style={Styles.emptySafeAreaStyle} />
        <SafeAreaView style={Styles.SafeAreaViewContainerStyle}>
          <View style={Styles.fullFlex}>
            {/* <NavigationBar title={TabItems.AllMemories}/> */}
            {this.props.showAlert && this.props.showAlertData?.title ? (
              <CustomAlert
                // modalVisible={this.state.showCustomAlert}
                modalVisible={this.props.showAlert}
                // setModalVisible={setModalVisible}
                title={this.props.showAlertData?.title}
                message={this.props.showAlertData?.desc}
                buttons={[
                  {
                    text: Platform.OS === 'android' ? 'GREAT!' : 'Great!',
                    func: () => {
                      this.props.showAlertCall(false);
                    },
                  },
                ]}
              />
            ) : null}

            <NewNavigationBar
              isWhite={true}
              filterClick={() => this.onFilterClick()}
              title={
                this.props.filterName
                  ? this.props.filterName
                  : TabItems.AllMemories
              }
              showRight={this.screen == ListType.Timeline ? true : false}
            />

            <StatusBar
              barStyle={
                Utility.currentTheme == 'light'
                  ? 'dark-content'
                  : 'light-content'
              }
              backgroundColor="#ffffff"
            />
            <ScrollableTabView
              ref={(ref: any) => {
                this.scrollableTabView = ref;
              }}
              style={Styles.fullWidth}
              scrollEnabled={Platform.OS == 'ios' ? true : false}
              locked={Platform.OS == 'ios' ? false : true}
              initialPage={0}
              currentScreen={(screenName: any) => {
                this.screen =
                  screenName == 0 ? ListType.Recent : ListType.Timeline;
                this.props.setCurrentTabActions(
                  screenName == 0 ? ListType.Recent : ListType.Timeline,
                );
              }}
              tabBarBackgroundColor={Colors.white}
              tabBarPosition="bottom"
              tabBarTextStyle={{
                ...fontSize(16),
                fontFamily:
                  Platform.OS === 'ios'
                    ? fontFamily.Inter
                    : fontFamily.InterMedium,
              }}
              tabBarActiveTextColor={Colors.TextColor}
              // tabBarInactiveTextColor = "rgba(0.216, 0.22, 0.322, 0.75)"
              tabBarUnderlineStyle={{ backgroundColor: Colors.white, height: 0 }}>
              <Recent
                tabLabel={'Recent'}
                filterClick={() => this.onFilterClick.bind(this)}
                navigation={this.props.navigation}
              />
              <Timeline
                ref={this.timelineRef}
                tabLabel={'Timeline'}
                filterClick={() => this.onFilterClick.bind(this)}
                navigation={this.props.navigation}
              />
            </ScrollableTabView>
            {/* {this.state.filterScreenVisibility && <FilterScreen currentScreen={this.state.currentScreen} onCancel={()=> this.setState({filterScreenVisibility : false})}/>} */}
          </View>

          <View style={Styles.bottomBarContainer}>
            <View style={Styles.bottomBarSubContainer}>
              <TabIcon focused={true} navigation={this.props.navigation} title={NewTabItems.Read} />
              <TabIcon focused={false} navigation={this.props.navigation} title={NewTabItems.Write} />
            </View>
          </View>
        </SafeAreaView>
        {this.state.appTourVisibility && (
          <AppGuidedTour
            cancelAppTour={() => {
              this.setState({ appTourVisibility: false }, () =>
                DefaultPreference.set('hide_guide_tour', 'true').then(
                  function () { },
                ),
              );
            }}
          />
        )}
      </View>
    );
  }

  FetchConfigurations = async () => {
    if (Utility.isInternetConnected) {
      try {
        let data = await Storage.get('userData');
        let response: any = await configurations(
          `https://${data.instanceURL}`,
          data.userAuthToken,
        )
          .then((response: Response) => response.json())
          .catch((err: Error) => {
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: 'prologue' }],
            });
            return Promise.reject(err);
          });
        DefaultPreference.set(
          'seasons',
          JSON.stringify(response.Details.seasons),
        ).then(function () { });
        let monthArray = [{ name: 'Month*', tid: 0 }];
        let seasonArray = response.Details.seasons
          ? response.Details.seasons
          : [];
        seasonArray.forEach((element: any) => {
          monthArray.push(element);
        });
        MonthObj.serverMonthsCount = monthArray.length;
        monthArray = monthArray.concat(months);
        MonthObj.month = monthArray;
        // Account.selectedData().start_year = response.Details.years.start;
        // Account.selectedData().end_year = response.Details.years.end;
        DefaultPreference.set(
          'allow_redaction',
          response.Details.allow_redaction,
        ).then(function () { });
        DefaultPreference.set(
          'default_share_option',
          response.Details.default_share_option,
        ).then(function () { });
        DefaultPreference.set(
          'digital_archive_checkbox',
          response.Details.digital_archive_checkbox,
        ).then(function () { });
        DefaultPreference.set(
          'etherpad_key',
          response.Details.etherpad_key,
        ).then(function () { });
        DefaultPreference.set(
          'internal_filter',
          response.Details.internal_filter,
        ).then(function () { });
        DefaultPreference.set(
          'privacy_policy_url',
          response.Details.privacy_policy_url,
        ).then(function () { });
        DefaultPreference.set(
          'public_file_path',
          response.Details.public_file_path,
        ).then(function () { });
        DefaultPreference.set('site_logo', response.Details.site_logo).then(
          function () { },
        );
        DefaultPreference.set(
          'site_short_name',
          response.Details.site_short_name,
        ).then(function () { });
        DefaultPreference.set('start_year', response.Details.years.start).then(
          function () { },
        );
        DefaultPreference.set('end_year', response.Details.years.end).then(
          function () { },
        );
        DefaultPreference.get('public_file_path').then((value: any) => {
          Utility.setPublicURL();
          var actualPath = Account.selectedData().profileImage.replace(
            'public://',
            value,
          );
          Account.selectedData().profileImage = actualPath;
          DeviceEventEmitter.emit(kProfilePicUpdated);
          // DefaultPreference.get('start_year').then((value: any) => {
          // Account.selectedData().start_year = value
          // DefaultPreference.get('end_year').then((value: any) => {
          //     Account.selectedData().end_year = value;
          // });
          // });
        });
      } catch (err) {
        console.log('Error fetching configurations', err);
      }
    } else {
      setTimeout(() => {
        this.setState({ showNoInternetView: true });
      }, 500);
    }
  };
}

export const filterView = (onClick: any, screen: any) => {
  return (
    <TouchableHighlight
      onPress={() => onClick(screen)}
      underlayColor={Colors.transparent}
      style={Styles.filterButnContainerStyle}>
      <View style={Styles.navigationHeaderContainer}>
        <TextNew style={Styles.filter}>Filters</TextNew>
        <Image source={filter_icon}></Image>
      </View>
    </TouchableHighlight>
  );
};

const mapState = (state: any) => {
  return {
    filterDataTimeLine: state.dashboardReducer.filterDataTimeline,
    filterDataRecent: state.dashboardReducer.filterDataRecent,
    loadingRecent: state.dashboardReducer.loadingRecent,
    showAlert: state.MemoryInitials.showAlert,
    showAlertData: state.MemoryInitials.showAlertData,
    filterName: state.dashboardReducer.filterName,
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    setCreateMemory: (payload: any) => dispatch({ type: CreateAMemory, payload: payload }),
    fetchFiltersData: (payload: any) =>
      dispatch({ type: GET_FILTERS_DATA, payload: payload }),
    fetchFiltersDataTimeline: (payload: any) =>
      dispatch({ type: GET_FILTERS_DATA_TIMELINE, payload: payload }),
    fetchMemoryList: (payload: any) =>
      dispatch({ type: GET_MEMORY_LIST, payload: payload }),
    showAlertCall: (payload: any) =>
      dispatch({ type: showCustomAlert, payload: payload }),
    sendMemoryActions: (payload: any) =>
      dispatch({ type: MEMORY_ACTIONS_DASHBOARD, payload: payload }),
    setCurrentTabActions: (payload: any) =>
      dispatch({ type: ACTIVE_TAB_ON_DASHBOARD, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(DashboardIndex);
