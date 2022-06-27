import React from 'react';
import { DeviceEventEmitter, TouchableHighlight, Image, SafeAreaView, StatusBar, StyleSheet, View, Alert, Platform } from 'react-native';
import { connect } from 'react-redux';
import { kNotificationIndicator, TabItems } from '../../common/component/TabBarIcons';
import { Colors, decode_utf8, fontFamily, fontSize, getDetails, Storage } from '../../common/constants';
import Utility from '../../common/utility';
import { configurations } from '../../common/webservice/loginServices';
// import { ACTIVE_TAB_ON_DASHBOARD, GET_FILTERS_DATA, GET_FILTERS_DATA_TIMELINE, GET_MEMORY_LIST, ListType, MEMORY_ACTIONS_DASHBOARD } from './dashboardReducer';
import NewNavigationBar from '../../../app/components/NewNavigationBarWrite';
// @ts-ignore
import DefaultPreference from 'react-native-default-preference';
// @ts-ignore
import ScrollableTabViewForWrite from "../../common/component/ScrollableTabViewForWrite";
import { MonthObj, months } from '../createMemory';
import { Account } from '../../common/loginStore';
import EventManager from '../../common/eventManager';
import { kProfilePicUpdated } from '../profile/profileDataModel';
import MyMemories from './../myMemories';
import AddContent from './../addContent';
import Prompts from './../promptsView';
import TextNew from '../../common/component/Text';
import { filter_icon } from '../../images';
import { Actions, Modal } from 'react-native-router-flux';
import { kMemoryActionPerformedOnDashboard, kUpdateMemoryOnTimeline } from '../myMemories/myMemoriesWebService';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import { No_Internet_Warning, ToastMessage } from '../../common/component/Toast';
import { NotificationDataModel } from '../notificationView/notificationDataModel';
import { GetActivities, kActivityListener, kBackgroundNotice, kForegroundNotice, kForegroundNotificationListener, kGetInvidualNotification, SetSeenActivity } from '../notificationView/notificationServices';
import AppGuidedTour from './../dashboard/appGuidedTour';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { DefaultDetailsMemory } from '../createMemory/dataHelper';
import { CreateUpdateMemory, promptIdListener } from '../createMemory/createMemoryWebService';
import { ACTIVE_TAB_ON_DASHBOARD, ListType } from '../dashboard/dashboardReducer';
import Styles from './styles';
import CustomAlert from '../../common/component/customeAlert';
import { showCustomAlert } from '../createMemory/reducer';

const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false
};
type Props = { [x: string]: any }

class WriteTabs extends React.Component<Props>{
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
        showCustomAlert: false
    };
    memoryFromPrompt: EventManager;
    screen = '';
    constructor(props: Props) {
        super(props);
        this.notificationModel = new NotificationDataModel();
    }

    navigateToAddContent = () => {
        // ReactNativeHapticFeedback.trigger("notificationSuccess", options);
        // Actions.push("addContent");
    }

    componentDidMount = () => {

        // this.eventManager = EventManager.addListener("addContentTabPressed", this.navigateToAddContent);
        this.notificationListener = EventManager.addListener(kGetInvidualNotification, this.notificationCallback);
        this.foregroundNotification = EventManager.addListener(kForegroundNotice, this.foregroundNotificationCallback);
        this.backgroundNotification = EventManager.addListener(kBackgroundNotice, this.checkNotificationAvailiability);
        this.eventListener = EventManager.addListener(kNotificationIndicator, this.changeNotification)
        this.memoryActionsListener = EventManager.addListener(kMemoryActionPerformedOnDashboard, this.memoryActionCallBack)

        debugger;
        if (this.props.showPublishedPopup) {
            this.setState({
                showCustomAlert: true
            })
        }
        if (this.props.setTimer == "false") {
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
    }

    changeNotification = () => {
        Actions.refresh('root')
    }

    foregroundNotificationCallback = (details: any) => {
        if (Utility.isInternetConnected) {
            let key = Account.selectedData().instanceID + "_" + Account.selectedData().userID;
            Utility.unreadNotification[key] = Utility.unreadNotification[key]++;
            setTimeout(() => {
                EventManager.callBack(kNotificationIndicator);
            }, 2000);
            Utility.notificationObject.isBackgroundNotification = false;
            GetActivities({
                "notification_params": {
                    "nid": details.nid,
                    "notification_id": details.notification_id
                }
            }, kGetInvidualNotification);
        } else {
            No_Internet_Warning();
        }
    }

    checkNotificationAvailiability() {
        if (Utility.notificationObject.hasNotification) {
            if (Utility.isInternetConnected) {
                Utility.notificationObject.hasNotification = false;
                Utility.notificationObject.isBackgroundNotification = true;
                loaderHandler.showLoader();
                GetActivities({
                    "notification_params": {
                        "nid": Utility.notificationObject.data.nid,
                        "notification_id": Utility.notificationObject.data.notification_id
                    }
                }, kGetInvidualNotification);

            } else {
                No_Internet_Warning();
            }
        }

    }

    notificationCallback = (success: any, details: any) => {
        loaderHandler.hideLoader();
        if (success && Utility.isInternetConnected) {
            details = this.notificationModel.getNotificationDetails(details.data, false)[0];
            // console.log("Final data:",details);
            if (Utility.notificationObject.isBackgroundNotification) {
                SetSeenActivity({ "ids": details.ids }, 0)
                if (details.status == 0 && (details.notificationType.indexOf("collaboration") != -1 || details.notificationType.indexOf("new_edits") != -1)) {
                    Actions.push("createMemory", { editMode: true, draftNid: details.nid })
                } else {
                    if (details.notificationType === "prompt_of_the_week_email" && details.type === 'prompts') {
                        //handle prompts to memory here
                        this.convertToMemory(details.nid, details.title);
                    } else {
                        Actions.push("memoryDetails", { "nid": details.nid, "type": details.type })
                    }
                }
            } else {
                //console.log("foreground",details);
                if (details.notificationType !== "prompt_of_the_week_email" && details.type !== 'prompts') {
                    EventManager.callBack(kForegroundNotificationListener, details);
                    if (this.notificationModel.isPartOfActivity(details)) {
                        EventManager.callBack(kActivityListener, [details]);
                    }
                }
            }
        } else if (!Utility.isInternetConnected) {
            No_Internet_Warning();
        }
    }

    convertToMemory(id: any, title: any) {
        if (Utility.isInternetConnected) {
            loaderHandler.showLoader("Creating Memory...");
            let draftDetails: any = DefaultDetailsMemory(decode_utf8(title.trim()));
            draftDetails.prompt_id = parseInt(id);
            this.memoryFromPrompt = EventManager.addListener(promptIdListener, this.promptToMemoryCallBack);
            CreateUpdateMemory(draftDetails, [], promptIdListener, "save");
        } else {
            No_Internet_Warning();
        }
    }

    promptToMemoryCallBack = (success: boolean, draftDetails: any) => {
        setTimeout(() => {
            loaderHandler.hideLoader();
        }, 500);
        if (success) {
            Actions.push("createMemory", { editMode: true, draftNid: draftDetails, isFromPrompt: true })
        }
        else {
            loaderHandler.hideLoader()
            ToastMessage(draftDetails);
        }
    }

    componentWillUnmount = () => {
        this.props.showAlertCall(false);
        this.eventManager.removeListener();
    }

    componentWillReceiveProps(props: Props) {
        if (this.props.showPublishedPopup) {
            debugger

        }
    }

    memoryActionCallBack = (fetched: boolean, responseMessage: any, nid?: any, type?: any, uid?: any) => {
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
            this.props.sendMemoryActions({ nid, type, uid })
            this.setState({});
        } else {
            ToastMessage(responseMessage, Colors.ErrorColor);
        }
    }

    componentDidUpdate(prevProps, prevState) {

    }

    onFilterClick = () => {
        this.setState({ currentScreen: this.screen }, () => {
            Actions.push("filtersScreen", { currentScreen: this.screen });
        })
    }
    render() {
        return (
            <View style={Styles.fullFlex}>
                <SafeAreaView style={Styles.emptySafeAreaStyle} />
                <SafeAreaView style={Styles.SafeAreaViewContainerStyle}>
                    <View style={Styles.fullFlex}>

                        {
                            this.props.showAlert && this.props.showAlertData?.title ?
                                <CustomAlert
                                    // modalVisible={this.state.showCustomAlert}
                                    modalVisible={this.props.showAlert}
                                    // setModalVisible={setModalVisible}
                                    title={this.props.showAlertData?.title}
                                    message={this.props.showAlertData?.desc}
                                    android={{
                                        container: {
                                            backgroundColor: '#ffffff'
                                        },
                                        title: {
                                            color: Colors.black,
                                            fontFamily: "SF Pro Text",
                                            fontSize: 17,
                                            fontWeight: '600',
                                            lineHeight: 22
                                        },
                                        message: {
                                            color: Colors.black,
                                            fontFamily: "SF Pro Text",
                                            // fontFamily: fontFamily.Inter,
                                            fontSize: 16,
                                            fontWeight: '500',
                                        },
                                    }}
                                    ios={{
                                        container: {
                                            backgroundColor: '#D3D3D3'
                                        },
                                        title: {
                                            color: Colors.black,
                                            // fontFamily: fontFamily.Inter,
                                            lineHeight: 22,
                                            fontSize: 17,
                                            fontWeight: '600',
                                        },
                                        message: {
                                            color: Colors.black,
                                            // fontFamily: fontFamily.Inter,
                                            fontSize: 13,
                                            lineHeight: 18,
                                            fontWeight: '400',
                                        },
                                    }}
                                    buttons={[
                                        {
                                            text: 'Great!',
                                            func: () => {
                                                this.props.showAlertCall(false);
                                            },
                                            styles: {
                                                lineHeight: 22,
                                                fontSize: 17,
                                                fontWeight: '600',
                                            }
                                        }
                                    ]}
                                />
                                :
                                null
                        }

                        {/* <NavigationBar title={TabItems.AllMemories}/> */}
                        <NewNavigationBar
                            isWhite={true}
                            // filterClick={() => this.onFilterClick()}
                            title={this.props.filterName ? this.props.filterName : TabItems.AllMemories}
                            showRight={false}
                        />
                        
                        <StatusBar barStyle={Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'} backgroundColor='#ffffff' />
                        <ScrollableTabViewForWrite
                            ref={(ref: any) => { this.scrollableTabView = ref; }}
                            style={Styles.fullWidth}
                            scrollEnabled={Platform.OS == 'ios' ? true : false}
                            locked={Platform.OS == 'ios' ? false : true}
                            initialPage={0}
                            currentScreen={(screenName: any) => {
                                if (screenName == 1) {
                                    if (Actions.currentScene != 'createMemory' && Actions.currentScene != 'mindPopList' && Actions.currentScene != 'addContent' && Actions.currentScene != 'dashboard') {
                                        Actions.addContent();
                                    }
                                }
                            }}
                            tabBarBackgroundColor={Colors.white}
                            tabBarPosition="bottom"
                            tabBarTextStyle={{ ...fontSize(16), fontFamily: fontFamily.Inter }}
                            tabBarActiveTextColor={Colors.TextColor}
                            // tabBarInactiveTextColor = "rgba(0.216, 0.22, 0.322, 0.75)"
                            tabBarUnderlineStyle={{ backgroundColor: Colors.white, height: 2 }} >
                            <MyMemories tabLabel={'Edit'} />
                            <MyMemories tabLabel={'New'} />
                            {/* <AddContent tabLabel={'New'} /> */}
                            {/* <View tabLabel={'New'} ></View> */}
                            <Prompts tabLabel={'Prompts'} />
                        </ScrollableTabViewForWrite>
                        {/* {this.state.filterScreenVisibility && <FilterScreen currentScreen={this.state.currentScreen} onCancel={()=> this.setState({filterScreenVisibility : false})}/>} */}
                    </View>
                </SafeAreaView>
                {this.state.appTourVisibility && <AppGuidedTour cancelAppTour={() => {
                    this.setState({ appTourVisibility: false });
                    DefaultPreference.set('hide_guide_tour', "true").then(function () { })
                }
                } />}
            </View>);
    }

}

export const filterView = (onClick: any, screen: any) => {
    return (
        <TouchableHighlight onPress={() => onClick(screen)} underlayColor={Colors.transparent} style={Styles.filterButnContainerStyle}>
            <View style={[Styles.navigationHeaderContainer, { flexDirection: 'row', paddingRight: 16, paddingLeft: 16 }]}>
                <TextNew style={{ ...fontSize(16) }}>Filters</TextNew>
                <Image source={filter_icon}></Image>
            </View>
        </TouchableHighlight>
    )
};

const mapState = (state: any) => {
    return {
        filterDataTimeLine: state.dashboardReducer.filterDataTimeline,
        filterDataRecent: state.dashboardReducer.filterDataRecent,
        loadingRecent: state.dashboardReducer.loadingRecent,
        showAlert: state.MemoryInitials.showAlert,
        showAlertData: state.MemoryInitials.showAlertData,
        filterName: state.dashboardReducer.filterName,
    }
};

const mapDispatch = (dispatch: Function) => {
    return {
        showAlertCall: (payload: any) => dispatch({ type: showCustomAlert, payload: payload }),
        // fetchFiltersData: (payload: any) => dispatch({ type: GET_FILTERS_DATA, payload: payload }),
        // fetchFiltersDataTimeline: (payload: any) => dispatch({ type: GET_FILTERS_DATA_TIMELINE, payload: payload }),
        // fetchMemoryList: (payload: any) => dispatch({ type: GET_MEMORY_LIST, payload: payload }),
        // sendMemoryActions: (payload: any) => dispatch({ type: MEMORY_ACTIONS_DASHBOARD, payload: payload }),
        setCurrentTabActions: (payload: any) => dispatch({ type: ACTIVE_TAB_ON_DASHBOARD, payload: payload })
    };
};

export default connect(
    mapState,
    mapDispatch
)(WriteTabs);