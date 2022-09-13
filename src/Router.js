import React, {useEffect} from 'react';
import {
  Appearance,
  BackHandler,
  Linking,
  Platform,
  Text,
  LogBox,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';

import {Provider} from 'react-redux';
import Busyindicator from './common/component/busyindicator';
import TabIcon, {NewTabItems} from './common/component/TabBarIcons';
import {Colors} from './common/constants';
import EventManager from './common/eventManager';
import store from './common/reducer/reducers';
import Utility, {
  getFontScale,
  networkConnectivitySaga,
  themechanges,
} from './common/utility';

import CreateMemory from './views/createMemory';
import CollectionList from './views/createMemory/collection';
import CollectionDetails from './views/createMemory/collection/collectionDetails';
import CreateRenameCollection from './views/createMemory/collection/createRename';
import MemoryCollectionList from './views/createMemory/collection/memoryCollection';
import CommonFriendsSearchView from './views/createMemory/commonFriendsSearchView';
import CommonListCreateMemory from './views/createMemory/commonTagsView';
import EtherPadEditing from './views/createMemory/etherpadWebView';
import FileDescription from './views/createMemory/fileDescription';
import InviteCollaborators from './views/createMemory/inviteCollaborators';
import NotesToCollaborators from './views/createMemory/inviteCollaborators/noteToCollaborators';
import PublishMemoryDraft from './views/createMemory/publish';
import WhoCanSee from './views/createMemory/whoCanSee';

import AddContentView from './views/addContent';
import CommonAudioRecorder from './views/fileHandlers/audioRecorder';
import ImageViewer from './views/fileHandlers/imageViewer';
import PDFViewer from './views/fileHandlers/pdfViewer';
import ForgotPassword from './views/forgotPassword';
import LoginView from './views/login';
import CommonInstanceListsSelection from './views/login/commonInstanceListSelection';
import MemoryDetails from './views/memoryDetails';
import CustomListView from './views/memoryDetails/customListView';
import FilesDetail from './views/memoryDetails/fileDetails';

import NewMemoryDetails from './../app/views/memoryDetails';
import NewCustomListView from './../app/views/memoryDetails/customListView';
import NewFilesDetail from './../app/views/memoryDetails/fileDetails';

import Menu from './views/menu';
import {
  iPadList,
  MindPopEdit,
  MindPopList,
  PreviewImage,
} from './views/mindPop';
import BlockedUsers from './views/moreOptions/blockedUsers';
import CommonWebView from './views/moreOptions/commonWebView';
import MyAccount from './views/myAccount';
// import MyMemoriesContainer from './views/myMemories';
//import AllMemoriesContainer from "./views/newDashboard"
import SplashScreen from 'react-native-splash-screen';
import ChangePassword from './views/changePassword';
import NotificationView from './views/notificationView';
import NotificationListing from './views/notificationView/notificationListing';
import Profile from './views/profile';
import MultipleValuesEdit from './views/profile/multipleValuesEdit';
import UserProfileEdit from './views/profile/userProfileEdit';
import FindCommunity from './views/registration/findCommunity';
import Prologue from './views/registration/prologue';
import RegFinalStep from './views/registration/regFinalStep';
import RegFirstStep from './views/registration/regFirstStep';
import UserRegistrationStatus from './views/registration/userRegistrationStatus';
import Splash from './views/splashscreen';
import TipsAndTricks from './views/tipsAndTricks';
// import firebase from "react-native-firebase";
import messaging from '@react-native-firebase/messaging';
import DeepLinking from 'react-native-deep-linking';
import DefaultPreference from 'react-native-default-preference';
// import { Notification, NotificationOpen } from 'react-native-firebase';
import analytics from '@segment/analytics-react-native';
import loaderHandler from './common/component/busyindicator/LoaderHandler';
import AppIntro from './views/appIntro';
import DashboardIndex from './views/dashboard/dashboardIndex';
import FilterScreen from './views/dashboard/filtersScreen';
import {
  kBackgroundNotice,
  kForegroundNotice,
} from './views/notificationView/notificationServices';
import TopicsFilter from './views/promptsView/topicsFilter';
import WriteTabs from './views/writeTabs';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

EStyleSheet.build();

if (Text.defaultProps == null) Text.defaultProps = {};

Text.defaultProps.allowFontScaling = false;

const RootStack = createStackNavigator();
const MindPopStack = createStackNavigator();

const MindPopNavigator = () => {
  return (
    <MindPopStack.Navigator initialRouteName="mindPopList">
      <MindPopStack.Screen
        name="mindPopList"
        component={DeviceInfo.isTablet() ? iPadList : MindPopList}
        options={{headerShown: false}}
      />
      <MindPopStack.Screen
        name="tipsAndTricks"
        component={TipsAndTricks}
        options={{headerShown: false}}
      />
      <MindPopStack.Screen
        name="previewImage"
        component={PreviewImage}
        options={{headerShown: false}}
      />
      <MindPopStack.Screen
        name="mindPopEdit"
        component={MindPopEdit}
        options={{headerShown: false}}
      />
    </MindPopStack.Navigator>
  );
};

const AppNavigationRouter = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="splash">
        <RootStack.Screen
          name="splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="prologue"
          component={Prologue}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="appIntro"
          component={AppIntro}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="findCommunity"
          component={FindCommunity}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="registrationPre"
          component={RegFirstStep}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="registrationFinal"
          component={RegFinalStep}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="userRegStatus"
          component={UserRegistrationStatus}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="login"
          component={LoginView}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="commonInstanceListsSelection"
          component={CommonInstanceListsSelection}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="forgotPassword"
          component={ForgotPassword}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="filtersScreen"
          component={FilterScreen}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="dashBoard"
          component={DashboardIndex}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="mindPop"
          component={MindPopNavigator}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="addContent"
          component={AddContentView}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="userProfileEdit"
          component={UserProfileEdit}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="multipleValuesEdit"
          component={MultipleValuesEdit}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="profile"
          component={Profile}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="myAccount"
          title={'My Account'}
          component={MyAccount}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="createMemory"
          title={'Memory Draft'}
          component={CreateMemory}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="memoryDetails"
          component={MemoryDetails}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="customListMemoryDetails"
          component={CustomListView}
          options={{headerShown: false}}
        />

        <RootStack.Screen
          name="newmemoryDetails"
          component={NewMemoryDetails}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="newcustomListMemoryDetails"
          component={NewCustomListView}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="newfileDetails"
          component={NewFilesDetail}
          options={{headerShown: false}}
        />

        <RootStack.Screen
          name="blockedUsers"
          component={BlockedUsers}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="fileDetails"
          component={FilesDetail}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="imageViewer"
          component={ImageViewer}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="pdfViewer"
          component={PDFViewer}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="commonAudioRecorder"
          component={CommonAudioRecorder}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="fileDescription"
          component={FileDescription}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="publishMemoryDraft"
          component={PublishMemoryDraft}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="commonListCreateMemory"
          component={CommonListCreateMemory}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="collectionList"
          component={CollectionList}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="memoryCollectionList"
          component={MemoryCollectionList}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="collectionDetails"
          component={CollectionDetails}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="createRenameCollection"
          component={CreateRenameCollection}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="whoCanSee"
          component={WhoCanSee}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="inviteCollaborators"
          component={InviteCollaborators}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="notesToCollaborators"
          component={NotesToCollaborators}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="commonFriendsSearchView"
          component={CommonFriendsSearchView}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="etherPadEditing"
          component={EtherPadEditing}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="notificationListing"
          component={NotificationListing}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="changePassword"
          component={ChangePassword}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="commonWebView"
          component={CommonWebView}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="notificationView"
          title={'Notifications'}
          component={NotificationView}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="topicsFilter"
          component={TopicsFilter}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="writeTabs"
          component={WriteTabs}
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
// const AppRouter = () => (
//   <Router sceneStyle={{backgroundColor: Colors.white}}>
//     <Scene key="root">
//       {/* <Scene key="animatedAppIntro" type={ActionConst.RESET} hideNavBar component={AnimatedAppIntro} /> */}
//       <Scene
//         key="splash"
//         type={ActionConst.RESET}
//         hideNavBar
//         component={Splash}
//       />
//       <Scene
//         key="prologue"
//         type={ActionConst.RESET}
//         hideNavBar
//         component={Prologue}
//       />
//       <Scene
//         key="appIntro"
//         type={ActionConst.RESET}
//         hideNavBar
//         component={AppIntro}
//       />
//       <Scene
//         key="findCommunity"
//         type={ActionConst.PUSH}
//         hideNavBar
//         component={FindCommunity}
//       />
//       <Scene
//         key="registrationPre"
//         type={ActionConst.PUSH}
//         hideNavBar
//         component={RegFirstStep}
//       />
//       <Scene
//         key="registrationFinal"
//         type={ActionConst.PUSH}
//         hideNavBar
//         component={RegFinalStep}
//       />
//       <Scene
//         key="userRegStatus"
//         type={ActionConst.PUSH}
//         hideNavBar
//         component={UserRegistrationStatus}
//       />
//       <Scene
//         key="login"
//         type={ActionConst.PUSH}
//         hideNavBar
//         component={LoginView}
//       />
//       <Scene
//         key="commonInstanceListsSelection"
//         type={ActionConst.PUSH}
//         hideNavBar
//         component={CommonInstanceListsSelection}
//       />
//       <Scene
//         key="forgotPassword"
//         type={ActionConst.PUSH}
//         hideNavBar
//         component={ForgotPassword}
//       />
//       <Scene
//         key="filtersScreen"
//         type={ActionConst.PUSH}
//         hideNavBar
//         component={FilterScreen}
//       />
//       <Drawer
//         key="dashBoard"
//         type={ActionConst.RESET}
//         hideNavBar
//         contentComponent={Menu}>
//         <Scene key="wrapper" hideNavBar>
//           <Tabs
//             key="root"
//             showLabel={false}
//             lazy={true}
//             showIcon={true}
//             tabBarPosition="bottom"
//             activeTintColor={Colors.ThemeColor}
//             tabBarOnPress={({navigation, defaultHandler}) => {
//               navigateToParticular(navigation, defaultHandler);
//             }}
//             tabBarStyle={{
//               height: 40,
//               backgroundColor: Colors.white,
//               borderWidth: 1,
//               borderTopWidth: 3,
//               borderTopColor: Colors.white,
//               width: '94%',
//               borderRadius: 12,
//               borderColor: Colors.white,
//               marginBottom: 4,
//               alignSelf: 'center',
//             }}>
//             <Stack title={NewTabItems.Read} tabBarIcon={TabIcon}>
//               <Scene hideNavBar key="dashboard" component={DashboardIndex} />
//             </Stack>
//             <Stack title={NewTabItems.Write} tabBarIcon={TabIcon}>
//               <Scene hideNavBar key="writeTabs" component={WriteTabs} />
//             </Stack>
//             {/* <Stack title={TabItems.MyMemories} tabBarIcon={TabIcon}>
//               <Scene
//                 hideNavBar
//                 key="memoriesDrafts"
//                 title={TabItems.MyMemories}
//                 component={MyMemoriesContainer}
//               />
//             </Stack>
//             <Stack title={TabItems.AddContent} tabBarIcon={TabIcon}>
//               <Scene
//                 hideNavBar
//                 key="contentView"
//                 title={TabItems.AddContent}
//                 component={Dashboard}
//               />
//             </Stack>
//             <Stack title={TabItems.Prompts} tabBarIcon={TabIcon}>
//               <Scene
//                 hideNavBar
//                 key="promptsView"
//                 title={TabItems.Prompts}
//                 component={PromptsView}
//               />
//             </Stack> */}
//             {/* <Stack title={TabItems.Notifications} tabBarIcon={TabIcon}>
//                             <Scene hideNavBar key="notificationView" title={TabItems.Notifications} component={NotificationView} />
//                         </Stack> */}
//             {/* <Stack title={TabItems.MoreOptions} tabBarIcon={TabIcon}>
//               <Scene key="moreOptions" hideNavBar component={MoreOptions} />
//             </Stack> */}
//           </Tabs>
//         </Scene>
//         {/* <Scene key="dashboardIndex" type={ActionConst.RESET} hideNavBar component={DashboadIndex}/> */}
//       </Drawer>
//       <Scene hideNavBar key="mindPop">
//         <Scene
//           hideNavBar
//           gesturesEnabled={false}
//           key="mindPopList"
//           component={DeviceInfo.isTablet() ? iPadList : MindPopList}
//           initial
//         />
//         <Scene key="tipsAndTricks" hideNavBar component={TipsAndTricks} />
//         <Scene key="previewImage" hideNavBar component={PreviewImage} />
//         <Scene key="mindPopEdit" hideNavBar component={MindPopEdit} />
//       </Scene>
//       <Scene
//         key="addContent"
//         type={ActionConst.PUSH}
//         hideNavBar
//         component={AddContentView}
//       />
//       <Scene
//         key="userProfileEdit"
//         type={ActionConst.PUSH}
//         hideNavBar
//         component={UserProfileEdit}
//       />
//       <Scene
//         key="multipleValuesEdit"
//         type={ActionConst.PUSH}
//         hideNavBar
//         component={MultipleValuesEdit}
//       />
//       <Scene
//         key="profile"
//         type={ActionConst.PUSH}
//         hideNavBar
//         component={Profile}
//       />
//       <Scene
//         key="myAccount"
//         type={ActionConst.PUSH}
//         title={'My Account'}
//         hideNavBar
//         component={MyAccount}
//       />
//       <Scene
//         key="createMemory"
//         type={ActionConst.PUSH}
//         title={'Memory Draft'}
//         hideNavBar
//         component={CreateMemory}
//       />
//       <Scene key="memoryDetails" hideNavBar component={MemoryDetails} />
//       <Scene
//         key="customListMemoryDetails"
//         hideNavBar
//         component={CustomListView}
//       />

//       <Scene key="newmemoryDetails" hideNavBar component={NewMemoryDetails} />
//       <Scene
//         key="newcustomListMemoryDetails"
//         hideNavBar
//         component={NewCustomListView}
//       />
//       <Scene key="newfileDetails" hideNavBar component={NewFilesDetail} />

//       <Scene key="blockedUsers" hideNavBar component={BlockedUsers} />
//       <Scene key="fileDetails" hideNavBar component={FilesDetail} />
//       <Scene key="imageViewer" hideNavBar component={ImageViewer} />
//       <Scene key="pdfViewer" component={PDFViewer} />
//       <Scene
//         key="commonAudioRecorder"
//         hideNavBar
//         component={CommonAudioRecorder}
//       />
//       <Scene key="fileDescription" hideNavBar component={FileDescription} />
//       <Scene
//         key="publishMemoryDraft"
//         hideNavBar
//         component={PublishMemoryDraft}
//       />
//       <Scene
//         key="commonListCreateMemory"
//         hideNavBar
//         component={CommonListCreateMemory}
//       />
//       <Scene key="collectionList" hideNavBar component={CollectionList} />
//       <Scene
//         key="memoryCollectionList"
//         hideNavBar
//         component={MemoryCollectionList}
//       />
//       <Scene key="collectionDetails" hideNavBar component={CollectionDetails} />
//       <Scene
//         key="createRenameCollection"
//         hideNavBar
//         component={CreateRenameCollection}
//       />
//       <Scene key="whoCanSee" hideNavBar component={WhoCanSee} />
//       <Scene
//         key="inviteCollaborators"
//         hideNavBar
//         component={InviteCollaborators}
//       />
//       <Scene
//         key="notesToCollaborators"
//         hideNavBar
//         component={NotesToCollaborators}
//       />
//       <Scene
//         key="commonFriendsSearchView"
//         hideNavBar
//         component={CommonFriendsSearchView}
//       />
//       <Scene key="etherPadEditing" hideNavBar component={EtherPadEditing} />
//       <Scene
//         key="notificationListing"
//         hideNavBar
//         component={NotificationListing}
//       />
//       <Scene
//         key="changePassword"
//         type={ActionConst.PUSH}
//         hideNavBar={true}
//         component={ChangePassword}
//       />
//       <Scene key="commonWebView" hideNavBar component={CommonWebView} />
//       <Scene
//         key="notificationView"
//         title={'Notifications'}
//         hideNavBar
//         component={NotificationView}
//       />
//       <Scene key="topicsFilter" hideNavBar component={TopicsFilter} />
//       {/* <Scene navBar={NavigationBar} key="addContentView" title={TabItems.AddContent} component={AddContentView} /> */}
//     </Scene>
//   </Router>
// );

LogBox.ignoreAllLogs(true);

const App = _props => {
  let backEvent: EventManager;

  // alert(useWindowDimensions().fontScale)

  /*
   * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
   * */
  const notificationOpenedListener = messaging().onNotificationOpenedApp(
    notificationOpen => {
      // const { data  } = notificationOpen.notification;
      const {data} = notificationOpen;
      Utility.notificationObject.hasNotification = true;
      Utility.notificationObject.data = data;
      // Utility.notificationObject.isBackgroundNotification = true;
      EventManager.callBack(kBackgroundNotice, data);
    },
  );

  useEffect(() => {
    setTimeout(() => SplashScreen.hide(), 500);
    networkConnectivitySaga();
    loadSegmentAnalytics();
    checkPermission();
    getFontScale();
    createNotificationListeners();
    if (Platform.OS == 'android') {
      backEvent = BackHandler.addEventListener(
        'hardwareBackPress',
        _backPressAnd,
      );
    }
    themechanges(Appearance.getColorScheme());

    return () => {
      Linking.removeEventListener('url', handleUrl);
      notificationListener();
      notificationOpenedListener();
      if (notificationOpen != null) {
        notificationOpen();
      }
      backEvent && backEvent.removeListener() && onTokenRefreshListener();
    };
  }, []);

  // async componentDidMount() {
  //   setTimeout(() => SplashScreen.hide(), 500);
  //   networkConnectivitySaga();
  //   loadSegmentAnalytics();
  //   checkPermission();
  //   createNotificationListeners();
  //   if (Platform.OS == 'android') {
  //     backEvent = BackHandler.addEventListener(
  //       'hardwareBackPress',
  //       _backPressAnd,
  //     );
  //   }
  // }

  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      //    showAlert("Permission", "enabled")
      return await getToken();
    } else {
      requestPermission();
    }
  };

  //3
  const getToken = async () => {
    // DefaultPreference.get('firebaseToken').then(value=>{
    //   if(value && value.length > 0){
    //         return true;
    //   } else {
    try {
      messaging()
        .requestPermission()
        .then(() => {
          messaging()
            .getToken()
            .then(fcmToken => {
              if (fcmToken) {
                DefaultPreference.set('firebaseToken', fcmToken).then(
                  function () {},
                );
                return true;
              }
            });
        })
        .catch(_error => {
          //console.log("Error fetching token " + error)
        });
    } catch (error) {
      //console.log("Error fetching token " + error)
    }
    // }
    // })
  };

  //2
  const requestPermission = async () => {
    try {
      await messaging().requestPermission();
      // User has authorised
      return await getToken();
    } catch (error) {
      // User has rejected permissions
      return false;
      //console.log('permission rejected');
    }
  };

  const createNotificationListeners = async () => {
    // showAlert("Listener", "added")
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    notificationListener = messaging().onMessage(notification => {
      const {data} = notification;
      EventManager.callBack(kForegroundNotice, data);
    });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    notificationOpen = await messaging().getInitialNotification();
    if (notificationOpen) {
      const {data} = notificationOpen;
      Utility.notificationObject.hasNotification = true;
      Utility.notificationObject.data = data;
    }
    /*
     * Triggered for data only payload in foreground
     * */
    messageListener = messaging().onMessage(_message => {});
  };

  //Back event handler
  const _backPressAnd = () => {
    loaderHandler.hideLoader();
    // if (this.props?.route?.name == 'mindPopEdit') {
    //   EventManager.callBack('hardwareBackPress', true);
    //   return true;
    // }
    // return false;
  };

  const handleUrl = ({url}) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  };

  // componentWillUnmount() {
  //   Linking.removeEventListener('url', handleUrl);
  //   notificationListener();
  //   notificationOpenedListener();
  //   if (notificationOpen != null) {
  //     notificationOpen();
  //   }
  //   backEvent &&
  //     backEvent.removeListener() &&
  //     onTokenRefreshListener();
  //   }

  const loadSegmentAnalytics = async () => {
    await analytics.setup('UIejGdlPobXDuxYQC2YU19IBomGe5oQO', {
      // Record screen views automatically!
      recordScreenViews: true,
      // Record certain application events automatically!
      trackAppLifecycleEvents: true,
    });
  };

  return (
    <Provider store={store}>
      {/* <View style={{flex: 1}}> */}
      <AppNavigationRouter />
      <Busyindicator overlayColor={Colors.ThemeColor} />
      {/* </View> */}
    </Provider>
  );
};
export default App;
