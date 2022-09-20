import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import TabIcon, {
  kNotificationIndicator,
  NewTabItems,
  TabItems,
} from '../../common/component/TabBarIcons';
import { Colors, decode_utf8 } from '../../common/constants';
import Utility from '../../common/utility';
import NewNavigationBar from '../../../app/components/NewNavigationBarWrite';
// @ts-ignore
import DefaultPreference from 'react-native-default-preference';
// @ts-ignore
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import CustomAlert from '../../common/component/customeAlert';
import DefaultTabBar from '../../common/component/ScrollableTabViewForWrite/DefaultTabBar';
// import ScrollableTabViewForWrite from '../../common/component/ScrollableTabViewForWrite/DefaultTabBar';
import { No_Internet_Warning, ToastMessage } from '../../common/component/Toast';
import EventManager from '../../common/eventManager';
import AddContentDetails from '../addContent';
import { Account } from '../../common/loginStore';
import {
  CreateUpdateMemory,
  promptIdListener,
} from '../createMemory/createMemoryWebService';
import { DefaultDetailsMemory } from '../createMemory/dataHelper';
import { showCustomAlert } from '../createMemory/reducer';
import { ACTIVE_TAB_ON_DASHBOARD } from '../dashboard/dashboardReducer';
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
import AppGuidedTour from './../dashboard/appGuidedTour';
import MyMemories from './../myMemories';
import Prompts from './../promptsView';
import Styles from './styles';

const WriteTabs = props => {
  let notificationModel: NotificationDataModel;
  const scrollableTabView = useRef(null);
  const [appTourVisibility, setAppTourVisibility] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  let flatListRef = useRef(null);

  useEffect(() => {
    notificationModel = new NotificationDataModel();
    const notificationListener = EventManager.addListener(
      kGetInvidualNotification,
      notificationCallback,
    );
    const foregroundNotification = EventManager.addListener(
      kForegroundNotice,
      foregroundNotificationCallback,
    );
    const backgroundNotification = EventManager.addListener(
      kBackgroundNotice,
      checkNotificationAvailiability,
    );
    const eventListener = EventManager.addListener(
      kNotificationIndicator,
      changeNotification,
    );
    const memoryActionsListener = EventManager.addListener(
      kMemoryActionPerformedOnDashboard,
      memoryActionCallBack,
    );
    const memoryFromPrompt = EventManager.addListener(
      promptIdListener,
      promptToMemoryCallBack,
    );
    if (props.showPublishedPopup) {
      setShowCustomAlert(true);
    }
    // if (props.setTimer == 'false') {
    //   setAppTourVisibility(true);
    // } else {
    //   setTimeout(() => {
    //     DefaultPreference.get('hide_guide_tour').then((value: any) => {
    //       if (value == 'true') {
    //         setAppTourVisibility(false);
    //       } else {
    //         setAppTourVisibility(true);
    //       }
    //     });
    //   }, 2000);
    // }
    return () => {
      props.showAlertCall(false);
      notificationListener.removeListener();
      foregroundNotification.removeListener();
      backgroundNotification.removeListener();
      memoryActionsListener.removeListener();
      eventListener.removeListener();
      memoryFromPrompt.removeListener();
    };
  }, []);

  const changeNotification = () => {
    props.navigation.reset();
  };

  const foregroundNotificationCallback = (details: any) => {
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

  const checkNotificationAvailiability = () => {
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
  };

  const notificationCallback = (success: any, details: any) => {
    loaderHandler.hideLoader();
    if (success && Utility.isInternetConnected) {
      details = notificationModel.getNotificationDetails(
        details.data,
        false,
      )[0];
      if (Utility.notificationObject.isBackgroundNotification) {
        SetSeenActivity({ ids: details.ids }, 0);
        if (
          details.status == 0 &&
          (details.notificationType.indexOf('collaboration') != -1 ||
            details.notificationType.indexOf('new_edits') != -1)
        ) {
          props.navigation.navigate('createMemory', {
            editMode: true,
            draftNid: details.nid,
          });
        } else {
          if (
            details.notificationType === 'prompt_of_the_week_email' &&
            details.type === 'prompts'
          ) {
            //handle prompts to memory here
            convertToMemory(details.nid, details.title);
          } else {
            props.navigation.navigate('memoryDetails', {
              nid: details.nid,
              type: details.type,
            });
          }
        }
      } else {
        if (
          details.notificationType !== 'prompt_of_the_week_email' &&
          details.type !== 'prompts'
        ) {
          EventManager.callBack(kForegroundNotificationListener, details);
          if (notificationModel.isPartOfActivity(details)) {
            EventManager.callBack(kActivityListener, [details]);
          }
        }
      }
    } else if (!Utility.isInternetConnected) {
      No_Internet_Warning();
    }
  };

  const convertToMemory = (id: any, title: any) => {
    if (Utility.isInternetConnected) {
      loaderHandler.showLoader('Creating Memory...');
      let draftDetails: any = DefaultDetailsMemory(decode_utf8(title.trim()));
      draftDetails.prompt_id = parseInt(id);
      CreateUpdateMemory(draftDetails, [], promptIdListener, 'save');
    } else {
      No_Internet_Warning();
    }
  };

  const promptToMemoryCallBack = (success: boolean, draftDetails: any) => {
    setTimeout(() => {
      loaderHandler.hideLoader();
    }, 500);
    if (success) {
      props.navigation.navigate('createMemory', {
        editMode: true,
        draftNid: draftDetails,
        isFromPrompt: true,
      });
    } else {
      loaderHandler.hideLoader();
      ToastMessage(draftDetails);
    }
  };

  const memoryActionCallBack = (
    fetched: boolean,
    responseMessage: any,
    nid?: any,
    type?: any,
    uid?: any,
  ) => {
    loaderHandler.hideLoader();
    if (fetched) {
      props.sendMemoryActions({ nid, type, uid });
    } else {
      ToastMessage(responseMessage, Colors.ErrorColor);
    }
  };

  const setScreen = () => {
    if (scrollableTabView?.current?.goToPage) {
      scrollableTabView?.current?.goToPage(0);
    }
  };

  const onScroll = (e: any) => {
    let page = Math.ceil(e.nativeEvent.contentOffset.x / Dimensions.get('window').width);
    if (page !== currentIndex) {
      if (page >= 3) {
        page = 2;
      }
      setCurrentIndex(page);
    }
  }

  const _renderItem = ({ item, index }) => (
    index === 0 ?
      <View style={{ width: Dimensions.get('window').width }}>
        <MyMemories tabLabel={'Edit'} navigation={props.navigation} />
      </View>
      :
      index === 1 ?
        // props.navigation.navigate('addContent', {
        //   beforeBack: () => {
        //     setScreen();
        //   },
        // })
        <View style={{ width: Dimensions.get('window').width }}>
          {/* <AddContentDetails navigation={props.navigation} tabLabel={'New'} /> */}
        </View>
        :
        <View style={{ width: Dimensions.get('window').width }}>
          <Prompts tabLabel={'Prompts'} navigation={props.navigation} />
        </View>
  );

  const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    if (viewableItems && viewableItems.length) {
      if (viewableItems.length === 1) {
        if (viewableItems[0].index === 1) {
          props.navigation.navigate('addContent', {
            beforeBack: () => {
              setScreen();
            },
          });
        }
      }
    }
  }, []);

  return (
    <View style={Styles.fullFlex}>
      <SafeAreaView style={Styles.emptySafeAreaStyle} />
      <SafeAreaView style={Styles.SafeAreaViewContainerStyle}>
        <View style={Styles.fullFlex}>
          {props.showAlert && props.showAlertData?.title ? (
            <CustomAlert
              modalVisible={props.showAlert}
              title={props.showAlertData?.title}
              message={props.showAlertData?.desc}
              buttons={[
                {
                  text: Platform.OS === 'android' ? 'GREAT!' : 'Great!',
                  func: () => {
                    props.showAlertCall(false);
                  },
                },
              ]}
            />
          ) : null}
          <NewNavigationBar
            isWhite={true}
            title={props.filterName ? props.filterName : TabItems.AllMemories}
            showRight={false}
          />

          <StatusBar
            barStyle={
              Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
            }
            backgroundColor="#ffffff"
          />

          <FlatList
            data={[1, 2, 3]}
            ref={flatListRef}
            style={Styles.fullWidth}
            initialNumToRender={3}
            renderItem={_renderItem}
            horizontal={true}
            pagingEnabled={true}
            onViewableItemsChanged={onViewableItemsChanged}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_item, index) => index + ''}
            onScroll={(e) => onScroll(e)}
          />
          {/* <ScrollableTabViewForWrite
            ref={scrollableTabView}
            style={Styles.fullWidth}
            scrollEnabled={Platform.OS == 'ios' ? true : false}
            locked={Platform.OS == 'ios' ? false : true}
            initialPage={0}
            currentScreen={(screenName: any) => {
              if (screenName == 1) {
                if (
                  props?.route?.name != 'createMemory' &&
                  props?.route?.name != 'mindPopList' &&
                  props?.route?.name != 'addContent' &&
                  props?.route?.name != 'dashboard'
                ) {
                  // if (props.createAMemory) {
                  props.navigation.navigate('addContent', {
                      beforeBack: () => {
                        setScreen();
                      },
                    });
                  // }
                }
              }
              if (screenName == 2) {
                if (props?.route?.name === 'myAccount') {
                  setScreen();
                }
              }
            }}
            tabBarBackgroundColor={Colors.white}
            tabBarPosition="bottom"
            tabBarTextStyle={Styles.tabBarTextStyle}
            tabBarActiveTextColor={Colors.TextColor}
            tabBarUnderlineStyle={Styles.tabBarUnderlineStyle}>
            <MyMemories tabLabel={'Edit'} navigation={props.navigation} />
            <View tabLabel={'New'} /> */}
          {/* <AddContentDetails navigation={props.navigation} tabLabel={'New'} /> */}
          {/* <Prompts tabLabel={'Prompts'} navigation={props.navigation} />
          </ScrollableTabViewForWrite> */}
          <View style={Styles.bottomContainer}>
            <DefaultTabBar activeTab={currentIndex} goToPage={(page) => {

              if (flatListRef.current) {
                if (page === 1) {
                  props.navigation.navigate('addContent', {
                    beforeBack: () => {
                      setScreen();
                    },
                  });
                } else {
                  flatListRef?.current?.scrollToIndex({
                    animated: true,
                    index: page,
                  });
                }

              }
            }} containerWidth={Dimensions.get('window').width} tabs={['Edit', 'New', 'Prompts']} />
          </View>
          <View style={Styles.bottomBarContainer}>
            <View style={Styles.bottomBarSubContainer}>
              <TabIcon
                focused={false}
                navigation={props.navigation}
                title={NewTabItems.Read}
              />
              <TabIcon
                focused={true}
                navigation={props.navigation}
                title={NewTabItems.Write}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
      {appTourVisibility && (
        <AppGuidedTour
          cancelAppTour={() => {
            setAppTourVisibility(false);
            DefaultPreference.set('hide_guide_tour', 'true').then(
              function () { },
            );
          }}
        />
      )}
    </View>
  );
};

export const filterView = (onClick: any, screen: any) => {
  return (
    <TouchableHighlight
      onPress={() => onClick(screen)}
      underlayColor={Colors.transparent}
      style={Styles.filterButnContainerStyle}></TouchableHighlight>
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
    createAMemory: state.dashboardReducer.createAMemory,
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    showAlertCall: (payload: any) =>
      dispatch({ type: showCustomAlert, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(WriteTabs);
