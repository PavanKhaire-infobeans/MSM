import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert, Animated,
  Dimensions, Image, Keyboard, Modal, SafeAreaView, ScrollView, StatusBar, Text, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View
} from 'react-native';
// @ts-ignore
import Confetti from 'react-native-confetti';
import DefaultPreference from 'react-native-default-preference';
import { connect } from 'react-redux';
import { kPublish } from '.';
import { arrowRight, create_arrowright } from '../../../app/images';
import BusyIndicator from '../../common/component/busyindicator';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import TextNew from '../../common/component/Text';
import { No_Internet_Warning } from '../../common/component/Toast';
import {
  Colors,
  CommonTextStyles,
  getValue,
  ShareOptions
} from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import {
  add_icon_small, arrow7, edit_icon
} from '../../images';
import { SHOW_LOADER_READ, SHOW_LOADER_TEXT } from '../dashboard/dashboardReducer';
import Styles from './styles';

export const kTags = 'kTags';
export const kWhoElseWhereThere = 'kWhoElseWhereThere';
export const kCollaborators = 'kCollaborators';
const shareWith = 'Who can see this memory?';
const tagsTitle = 'Tags';
// const whoElse = 'Who else where there?';WHO ELSE WAS THERE?
const whoElse = 'WHO ELSE WAS THERE?';
const addCollections = 'COLLECTIONS';
// const addCollections = 'Add to Memory Collections';
type State = { [x: string]: any };
type Props = { [x: string]: any };

const PublishMemoryDraft = (props) => {
  let widthVal: any;

  const [showMenu, setShowMenu] = useState(false);
  const [showGuideOverlay, setShowGuideOverlay] = useState(false);

  let _confettiView: any;
  // explosion: ConfettiCannon;

  const isFocused = useIsFocused();

  useEffect(() => {
    // setShowMenu(false);
    widthVal = Dimensions.get('window').width;
    let showConfettiCanon = EventManager.addListener('showConfetti', () => {
      //explosion && explosion.start();
      if (_confettiView) {
        _confettiView.startConfetti();
      }
    });

    DefaultPreference.get('hide_tour').then((value: any) => {
      if (value == 'true') {
        setShowGuideOverlay(false);
      } else {
        setShowGuideOverlay(true);
      }
    });
    
    return () => {
      showConfettiCanon.removeListener();
      if (_confettiView) {
        _confettiView.stopConfetti();
      }
      //  explosion.stop();
      setShowMenu(false);
    }
  }, [isFocused])

  const cancelAction = () => {
    Alert.alert('', `Are you sure you want to exit?`, [
      {
        text: 'No',
        style: 'cancel',
        onPress: () => { },
      },
      {
        text: 'Yes',
        style: 'default',
        onPress: () => {
          setShowMenu(false);
          Keyboard.dismiss();
          props.route.params.doNotReload(true);
          props.navigation.goBack();
        },
      },
    ]);
  };

  const publishMemory = () => {
    setShowMenu(false);
    props.showLoader(true);
    props.loaderText('Loading...');
    props.route.params.publishMemoryDraft(kPublish);
  };

  const commonListComponent = (
    title: any,
    value: any,
    placeholder: any,
    onPressCallback: any,
    isRequired?: boolean
  ) => {
    return (
      <TouchableHighlight
        key={value?.length > 0 ? getText(title, value) : placeholder}
        style={Styles.commonListComponentButtonContainer}
        onPress={() => onPressCallback()}
        underlayColor={Colors.underlay33OpacityColor}>
        <View key={value?.length > 0 ? getText(title, value) : placeholder}>
          <TextNew style={[Styles.textStyle18Weight500, { paddingLeft: 8, }]}>
            {title?.toUpperCase()}
            {
              isRequired &&
              <Text style={{color:Colors.ErrorColor}}>*</Text>
            }
          </TextNew>
          <View style={Styles.commonListComponentContainer}>
            <View style={Styles.placeholderContainer}>
              <TextNew
                numberOfLines={1}
                style={[
                  Styles.placeholderTextStyle,
                  {
                    color: value?.length > 0 ? Colors.newTextColor : Colors.newTextColor,
                  },
                ]}>
                {value?.length > 0 ? getText(title, value) : placeholder}
              </TextNew>
              <Image
                style={Styles.leftButtonLogo}
                resizeMode={'contain'}
                source={create_arrowright}></Image>
              {/* source={value.length > 0 ? edit_icon : add_icon_small}></Image> */}
            </View>
            {showViewAll(title, value) && (
              <Text style={Styles.viewAllTextStyle}>View all</Text>
            )}
          </View>
          {title == shareWith &&
            value == 'custom' &&
            getCustomFriendsView()}
        </View>
      </TouchableHighlight>
    );
  };

  const getCustomFriendsView = () => {
    let names_array: any = [];
    props.whoCanSeeIds.forEach((element: any) => {
      names_array.push(
        element.field_first_name_value + ' ' + element.field_last_name_value,
      );
    });
    props.whoCanSeeGroups.forEach((element: any) => {
      names_array.push(element.name);
    });

    let splicedArray = names_array.slice(0);
    if (splicedArray.length > 1) {
      splicedArray = splicedArray.splice(0, 2);
    } else if (splicedArray.length > 0) {
      splicedArray = splicedArray.splice(0, 1);
    }
    splicedArray = splicedArray.join(', ');
    return (
      <View>
        {names_array.length > 0 && (
          <View style={Styles.getCustomFriendsViewCOntainerStyle}>
            <TextNew style={Styles.friendNameTextStyle}>
              {splicedArray}
              {names_array.length > 2
                ? ' (+' + (names_array.length - 2) + ' more)'
                : ''}
            </TextNew>
            {names_array.length > 2 && (
              <Text style={Styles.viewAllTextStyle}>View all</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const showViewAll = (title: any, value: any) => {
    switch (title) {
      case tagsTitle:
      case whoElse:
        if (value.length > 2) {
          return true;
        }
        break;
      default:
    }
    return false;
  };

  const getText = (title: any, value: any) => {
    let textToReturn = '';
    switch (title) {
      case shareWith:
        textToReturn = ShareOptions[value];
        break;
      case tagsTitle:
        textToReturn = getValue(value[0], ['name']);
        if (value.length > 1)
          textToReturn = textToReturn + ', ' + getValue(value[1], ['name']);
        if (value.length > 2) {
          textToReturn = textToReturn + ' (+' + (value.length - 2) + ' more)';
        }
        break;
      case whoElse:
        textToReturn =
          getValue(value[0], ['field_first_name_value']) +
          ' ' +
          getValue(value[0], ['field_last_name_value']);
        if (value.length > 1)
          textToReturn =
            textToReturn +
            ', ' +
            getValue(value[1], ['field_first_name_value']) +
            ' ' +
            getValue(value[1], ['field_last_name_value']);
        if (value.length > 2) {
          textToReturn = textToReturn + ' (+' + (value.length - 2) + ' more)';
        }
        break;
      case addCollections:
        let collectionNames: any = [];
        value.forEach((element: any) => {
          let name = element.name ? element.name : element.title;
          collectionNames.push(name);
        });
        textToReturn = collectionNames.join(', ');
        break;
      default:
        textToReturn = value;
    }
    return textToReturn;
  };

  const tags = () => {
    setShowMenu(false);
    if (Utility.isInternetConnected) {
      props.navigation.navigate('commonListCreateMemory', {
        tag: kTags,
        title: 'Memory Tags',
        showRecent: true,
        referenceList: props.tagsList,
        placeholder: 'Enter tags here...',
      });
    } else {
      No_Internet_Warning();
    }
  };

  const whoELseWhereThere = () => {
    setShowMenu(false);
    if (Utility.isInternetConnected) {
      props.navigation.navigate('commonListCreateMemory', {
        tag: kWhoElseWhereThere,
        title: 'Who else where there',
        showRecent: false,
        referenceList: props.whoElseWhereThereList,
        placeholder: 'Enter name of friends...',
      });
    } else {
      No_Internet_Warning();
    }

  };

  const collection = () => {
    setShowMenu(false);
    if (Utility.isInternetConnected) {
      props.navigation.navigate('collectionList');
    } else {
      No_Internet_Warning();
    }

  };

  const whoCanSee = () => {
    setShowMenu(false);
    if (Utility.isInternetConnected) {
      props.navigation.navigate('whoCanSee');
    } else {
      No_Internet_Warning();
    }

  };

  const showHideMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <View style={Styles.fullFlex}>
      <SafeAreaView style={Styles.emptySafeAreaStyle} />
      <SafeAreaView style={Styles.SafeAreaViewContainerStyle}>
        <Confetti
          confettiCount={200}
          ref={(node: any) => (_confettiView = node)}
          untilStopped={false}
        />
        {
        props.showLoaderValue ?
          <BusyIndicator startVisible={props.showLoaderValue} text={props.loaderTextValue != '' ? props.loaderTextValue : 'Loading...'} overlayColor={Colors.ThemeColor} />
          :
          null
      }
        {/* <ConfettiCannon
            count={200}
            origin={{x: -10, y: 0}}
            autoStart={false}
            ref={ref => (this.explosion = ref)}
        /> */}
        <View
          style={Styles.fullFlex}
          onStartShouldSetResponder={() => true}
          onResponderStart={() => setShowMenu(false)}>
          <NavigationHeaderSafeArea
            heading={''}
            showCommunity={false}
            cancelAction={() => cancelAction()}
            showRightText={true}
            publishScreen={true}
            rightText={'Delete\nDraft'}
            cancleText={'Back'}
            saveValues={() => {
              props.route.params.delete();
            }}
            rightIcon={true}
            showHideMenu={() => showHideMenu()}
          />
          <View style={Styles.borderStyle}></View>
          {/* <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>                    */}
          <StatusBar
            barStyle={Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
            backgroundColor={Colors.NewThemeColor}
          />
          <View style={{ height: 24 }} />
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true} style={[Styles.imagebuttonStyle, { flex: 1 }]}>
            {commonListComponent(
              'Date',
              !isNaN(parseInt((props.date?.month))) ? `${props.date?.day}/ ${props.date?.month}/ ${props.date?.year}` : `${props.date?.month} ${props.date?.year}`,
              'Add Date',
              () => props.navigation.goBack(),
              true
            )}
            {commonListComponent(
              'Location',
              props.location?.description,
              'Add location...',
              () => props.navigation.goBack(),
              true
            )}
            {commonListComponent(
              shareWith,
              props.shareOption,
              '',
              whoCanSee,
              true
            )}
            <TextNew style={Styles.additionalTextStyle}>
              {'Additional Details (Optional)'}
            </TextNew>
            {commonListComponent(
              tagsTitle,
              props.tagsList,
              'Add tags',
              tags,
            )}
            {commonListComponent(
              whoElse,
              props.whoElseWhereThereList,
              'Add people',
              whoELseWhereThere,
            )}
            {commonListComponent(
              addCollections,
              // props.collections && props.collections.length > 0 ? 
              props.collections,
              // : '',
              'Select collection',
              collection,
            )}

            {/* */}
            <TouchableWithoutFeedback
              disabled={(props.location?.description == '' || props.date?.month == '' || props.date?.year == '') ? true : false}
              onPress={publishMemory}>
              <View
                style={[Styles.loginSSOButtonStyle, (props.location?.description == '' || props.date?.month == '' || props.date?.year == '') ? { opacity: 0.5 } : {opacity: 1}, { overflow: 'hidden', width: '100%' }]}>
                <Text
                  style={[
                    CommonTextStyles.fontWeight500Size17Inter,
                    Styles.loginTextStyle,
                  ]}>
                  Publish
                </Text>
                <Image style={Styles.arrowStyle} source={arrowRight} />
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
          {/* {showMenu && (
            <View
              style={[Styles.renderLoaderStyle, { top: 0 }]}
              onStartShouldSetResponder={() => true}
              onResponderStart={() => setShowMenu(false)}> */}
              {/* <View style={Styles.sideMenu}>
                  <TouchableOpacity
                    style={Styles.titleContainer}
                    onPress={() => this.props.preview()}>
                    <Text style={Styles.previewTextStyle}>Preview...</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={Styles.titleContainer}
                    onPress={() => this.props.delete()}>
                    <Text style={Styles.deleteTextStyle}>Delete Draft...</Text>
                  </TouchableOpacity>
                </View> */}
            {/* </View>
          )} */}
        </View>
        {/* {showGuideOverlay && (
          <Modal transparent>
            <SafeAreaView style={Styles.memoryDraftContainer}>
              <Animated.View
                style={[
                  Styles.animatedContainer,
                  // { opacity: fadeIn },
                ]}>
                <View style={[Styles.fullFlex, Styles.fullWidth]}>
                  <View
                    style={[Styles.drawerContainer, { right: -1025 + widthVal * 0.16 }]}></View>
                  <View style={Styles.arrowImageContainerStyle}>
                    <Image source={arrow7}></Image>
                  </View>
                  <View
                    style={[Styles.memoryPublishContainer, { width: widthVal - 90 }]}>
                    <TextNew
                      style={Styles.guideTitleTextStyle}>
                      {'Memory Publish'}
                    </TextNew>
                    <TextNew style={Styles.guideDescTextStyle}>
                      {
                        'Publish the Memory and share your story! and Your published Memory will appear at the top of your Recent feed'
                      }
                    </TextNew>
                    <View style={Styles.prevContainer}>
                      <TouchableHighlight
                        underlayColor={Colors.transparent}
                        style={Styles.memoryDraftIntroButnStyle}
                        onPress={() => {
                          setShowGuideOverlay(false)
                          DefaultPreference.set('hide_tour', 'true').then(
                            function () { },
                          );
                        }}>
                        <View style={Styles.doneBtnContainer}>
                          <TextNew style={Styles.doneBtnTextStyle}>
                            Done
                          </TextNew>
                        </View>
                      </TouchableHighlight>
                    </View>
                  </View>
                </View>
              </Animated.View>
            </SafeAreaView>
          </Modal>
        )} */}
      </SafeAreaView>
    </View>
  );
};

const mapState = (state: { [x: string]: any }) => {
  return {
    shareOption: state.MemoryInitials.shareOption,
    date: state.MemoryInitials.date,
    location: state.MemoryInitials.location,
    tagsList: state.MemoryInitials.tags,
    whoElseWhereThereList: state.MemoryInitials.whoElseWhereThere,
    collections: state.MemoryInitials.collections,
    whoCanSeeIds: state.MemoryInitials.whoCanSeeMemoryUids,
    whoCanSeeGroups: state.MemoryInitials.whoCanSeeMemoryGroupIds,
    showLoaderValue: state.dashboardReducer.showLoader,
    loaderTextValue: state.dashboardReducer.loaderText
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    showLoader: (payload: any) =>
      dispatch({ type: SHOW_LOADER_READ, payload: payload }),
    loaderText: (payload: any) =>
      dispatch({ type: SHOW_LOADER_TEXT, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(PublishMemoryDraft);

