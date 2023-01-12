import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
// @ts-ignore
import { connect } from 'react-redux';
import { create_plus, plus_circle, tagx } from '../../../app/images';
import PlaceholderImageView from '../../common/component/placeHolderImageView';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import SearchBar from '../../common/component/SearchBar';
import { Colors, CommonTextStyles, fontSize } from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import { action_close } from '../../images';
import { kTags } from './publish';
import {
  SaveMemoryTagsList,
  SaveSearchList,
  SaveWhoElseWhereThere,
} from './reducer';
import {
  kRecentTags,
  kSearchTags,
  kUsers,
  MemoryTagsAPI,
  UserSearchAPI,
} from './saga';
import Styles from './styles';
import style from './styles';

type State = { [x: string]: any };
type Props = {
  tag: string;
  title: string;
  showRecent: boolean;
  [x: string]: any;
  referenceList: any;
  placeholder: any;
};

const CommonListCreateMemory = (props: Props) => {
  let backListner: any;
  let searchBar: React.RefObject<SearchBar> = React.createRef<SearchBar>();
  let keyboardDidShowListener: any;
  let keyboardDidHideListener: any;

  const [state, setState] = useState({
    isMemoryTags: false,
    referenceList: [],
    errorView: false,
    content: '',
    showSearchList: false,
    bottomView: 0,
  });

  useEffect(() => {
    props.saveSearchList([]);
    backListner = EventManager.addListener(
      'hardwareBackPress',
      cancelAction,
    );
    if (Platform.OS == 'android') {
      keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        _keyboardDidShow,
      );
      keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        _keyboardDidHide,
      );
    } else {
      keyboardDidShowListener = Keyboard.addListener(
        'keyboardWillShow',
        _keyboardDidShow,
      );
      keyboardDidHideListener = Keyboard.addListener(
        'keyboardWillHide',
        _keyboardDidHide,
      );
    }

    let refList: any = props.route.params.referenceList?.slice(0);
    console.log("refList >", refList)
    setState(prev => ({
      ...prev,
      isMemoryTags: props.route.params.tag == kTags,
      referenceList: refList,
    }));

    return () => {
      backListner.removeListener();
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    }
  }, []);


  const _keyboardDidShow = (e: any) => {
    // setState({
    //         bottomView : e.endCoordinates.height - (Platform.OS == "ios" ? (DeviceInfo.hasNotch() ? 40 : 100) : 100)
    // })
  };

  const _keyboardDidHide = (e: any) => {
    setState(prev => ({
      ...prev,
      bottomView: 0,
    }));
  };

  const cancelAction = () => {
    props.saveSearchList([]);
    Keyboard.dismiss();
    props.navigation.goBack();
  };

  const publishMemory = () => {
    if (state.isMemoryTags) {
      props.setMemoryTags(state.referenceList);
      props.recentTagsSearch();
    } else {
      props.setWhoElseWhereThere(state.referenceList);
    }
    Keyboard.dismiss();
    props.navigation.goBack();
  };

  const addToList = (item: any) => {
    let refList = state.referenceList;
    let found = false;
    setState(prev => ({
      ...prev,
      errorView: false
    }));
    if (state.isMemoryTags)
      found = refList.some(
        (element: any) =>
          element.tid === item.tid || element.name == item.name,
      );
    else found = refList.some((element: any) => element.uid === item.uid);

    if (!found) {
      refList.push(item);
      setState(prev => ({
        ...prev,
        referenceList: refList
      }));
    }

    let searchList = props.searchList;
    if (state.isMemoryTags)
      searchList = searchList.filter(
        (element: any) => element.tid != item.tid,
      );
    else
      searchList = searchList.filter(
        (element: any) => element.uid != item.uid,
      );
    props.saveSearchList(searchList);
    searchBar.current &&
      searchBar.current.clearField &&
      searchBar.current.clearField();
  };

  const removeFromList = (item: any) => {
    let refList = state.referenceList;
    if (state.isMemoryTags)
      refList = refList.filter((element: any) => element.tid != item.tid);
    else refList = refList.filter((element: any) => element.uid != item.uid);

    setState(prev => ({
      ...prev,
      referenceList: refList
    }));
  };

  const renderRow = (item: any, searchList: boolean) => {
    return (
      <View style={Styles.searchListItemStyle}>
        {/* <View style={Styles.searchListItemContainerStyle}> */}
        {state.isMemoryTags ? (
          <Text style={Styles.itemName}>{item.name}</Text>
        ) : (
          userList(item)
        )}
        {searchList ? (
          <View>
            {item.uid != -1 && (
              <TouchableHighlight
                underlayColor={'#ffffff22'}
                onPress={() => addToList(item)}>
                <Image source={create_plus}></Image>
                {/* <Text style={Styles.addButtonStyle}>Add</Text> */}
              </TouchableHighlight>
            )}
          </View>
        ) : (
          <TouchableHighlight
            // style={Styles.imagebuttonStyle}
            underlayColor={'#ffffff22'}
            onPress={() => removeFromList(item)}>
            <Image source={tagx}></Image>
          </TouchableHighlight>
        )}
        {/* </View> */}
      </View>
    );
  };

  const renderSelectedItems = (item: any, searchList: boolean) => {
    return (
      <View style={Styles.selectedListItemStyle}>
        {/* <View style={Styles.searchListItemContainerStyle}> */}
        {state.isMemoryTags ? (
          <Text style={Styles.itemName}>{item.name}</Text>
        ) : (
          userList(item)
        )}

        <TouchableHighlight
          // style={Styles.imagebuttonStyle}
          underlayColor={'#ffffffff'}
          onPress={() => removeFromList(item)}>
          <Image source={tagx}></Image>
        </TouchableHighlight>

        {/* </View> */}
      </View>
    );
  };

  const userList = (item: any) => {
    return (
      <View style={style.searchContainer}>
        {item.uid != -1 && (
          <View style={style.placeholderImageViewStyle}>
            <PlaceholderImageView
              uri={Utility.getFileURLFromPublicURL(item.uri)}
              style={[
                style.placeholderImageViewStyle,
                { alignContent: 'center' },
              ]}
              resizeMode={'contain'}
              profilePic={true}
            />
          </View>
        )}
        <Text style={style.userTextStyle}>
          {item.field_first_name_value + ' ' + item.field_last_name_value}
        </Text>
      </View>
    );
  };

  const renderTagsItem = ({ item, index }) => {
    return (
      <TouchableHighlight
        underlayColor={Colors.underlay33OpacityColor}
        onPress={() => addToList(item)}
      >
        <View style={style.tagContainerStyle}>
          <Text style={style.tagName}>{item.name}</Text>
          <Image style={{ marginLeft: 12, }} source={tagx}></Image>
        </View>
      </TouchableHighlight>
    );
  };

  const memoryTags = () => {
    return (
      <View >
        {props.recentTags.length > 0 ? (
          <View style={style.memoryTagContainer}>
            <FlatList
              horizontal
              keyExtractor={(_, index: number) => `${index}`}
              showsHorizontalScrollIndicator={false}
              data={props.recentTags}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              // style={style.imagebuttonStyle}
              renderItem={renderTagsItem}
            />
          </View>
        ) : null}
      </View>
    );
  };

  const onChangeText = (text: any) => {
    if (text.trim().length > 0) {
      setState(prev => ({
        ...prev,
        showSearchList: true
      }));

    }
    else {
      setState(prev => ({
        ...prev,
        showSearchList: false
      }));
    }
    if (state.isMemoryTags) {
      props.memoryTagsSearch({ searchType: kSearchTags, searchTerm: text });
    } else {
      props.userSearch({ searchType: kUsers, searchTerm: text });
    }
  };

  return (
    <View style={style.fullFlex}>
      <SafeAreaView style={style.emptySafeAreaStyle} />
      <SafeAreaView style={style.SafeAreaViewContainerStyle}>
        <View style={style.fullFlex} onStartShouldSetResponder={() => false}>
          {/* <NavigationHeaderSafeArea
            heading={props.title}
            showCommunity={false}
            cancelAction={() => cancelAction()}
            showRightText={true}
            rightText={'Done'}
            saveValues={publishMemory}
          /> */}
          <NavigationHeaderSafeArea
            // heading={'Memory Draft'}
            showCommunity={false}
            cancelAction={() => cancelAction()} //this.setState({ showCustomAlert: true }) //this.cancelAction}
            showRightText={false}
            backIcon={action_close}
            saveValues={() => { }} //saveDraft  publishMemory
          />
          <View style={Styles.borderStyle}></View>

          {/* <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>                    */}
          <StatusBar
            barStyle={
              Utility.currentTheme == 'light'
                ? 'dark-content'
                : 'light-content'
            }
            backgroundColor={Colors.NewThemeColor}
          />

          <View style={{ padding: 24 }}>
            <Text style={Styles.filterTextJumpto}>
              {
                state.isMemoryTags ?
                  `Add tags to help you categorize your memories and find them later.`
                  :
                  `Mention your friends or loved ones who were a part of this special year with you! To add someone, they will need to have an account with My Stories Matter and you will need to be friends.`
              }

            </Text>
          </View>


          <SearchBar
            ref={searchBar}
            style={[
              style.commonFriendSerachStyle,
              {
                backgroundColor: Colors.SerachbarColor,
                borderBottomColor: state.errorView
                  ? Colors.ErrorColor
                  : Colors.TextColor,
              },
            ]}
            placeholder={props.route.params.placeholder}
            onSearchButtonPress={(text: string) => {
              onChangeText(text);
            }}
            onClearField={() => {
              props.saveSearchList([]);
            }}
            onChangeText={(text: any) => {
              onChangeText(text);
            }}
            showCancelClearButton={false}
          />

          {props.searchList.length == 0 &&
            props.route.params.showRecent &&
            memoryTags()
          }

          {state.errorView && (
            <Text style={style.selectFriendTextStyle}>
              *Please select some friends
            </Text>
          )}

          {props.searchList.length == 0 && (
            <FlatList
              extraData={state}
              style={style.memoryTagContainer}
              keyExtractor={(_, index: number) => `${index}`}
              onScroll={() => {
                Keyboard.dismiss();
              }}
              horizontal={true}
              keyboardShouldPersistTaps={'handled'}
              showsHorizontalScrollIndicator={false}
              data={state.referenceList}
              ItemSeparatorComponent={()=><View style={{width:12}}/>}
              renderItem={({ item, index }) => renderSelectedItems(item, false)}
            />
          )}

          {state.showSearchList && props.searchList.length > 0 && (
            <FlatList
              extraData={state}
              keyExtractor={(_, index: number) => `${index}`}
              style={style.SafeAreaViewContainerStyle}
              keyboardShouldPersistTaps={'handled'}
              onScroll={() => {
                Keyboard.dismiss();
              }}
              showsHorizontalScrollIndicator={true}
              data={props.searchList}
              renderItem={({ item, index }) => renderRow(item, true)}
            />
          )}

          <TouchableWithoutFeedback
            // disabled={(this.state.username != '' && this.state.password != '') ? false : true}
            onPress={() => {
              publishMemory();
            }}>
            <View
              style={Styles.loginSSOButtonStyle}>
              <Text
                style={[
                  CommonTextStyles.fontWeight500Size17Inter,
                  Styles.loginTextStyle,
                ]}>
                Done
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <View
            style={[style.fullWidth, { height: state.bottomView }]}></View>
          <View style={style.smallSeparator}></View>
        </View>
      </SafeAreaView>
    </View>
  );

}

const mapState = (state: { [x: string]: any }) => {
  return {
    recentTags: state.MemoryInitials.recentTags,
    searchList: state.MemoryInitials.searchList,
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    recentTagsSearch: () =>
      dispatch({
        type: MemoryTagsAPI,
        payload: { searchType: kRecentTags, searchTerm: '' },
      }),
    memoryTagsSearch: (payload: any) =>
      dispatch({ type: MemoryTagsAPI, payload: payload }),
    userSearch: (payload: any) =>
      dispatch({ type: UserSearchAPI, payload: payload }),
    setMemoryTags: (payload: any) =>
      dispatch({ type: SaveMemoryTagsList, payload: payload }),
    setWhoElseWhereThere: (payload: any) =>
      dispatch({ type: SaveWhoElseWhereThere, payload: payload }),
    saveSearchList: (payload: any) =>
      dispatch({ type: SaveSearchList, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(CommonListCreateMemory);
