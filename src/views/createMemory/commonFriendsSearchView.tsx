import React from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
// @ts-ignore
import { connect } from 'react-redux';
import SearchBar from '../../common/component/SearchBar';
import { Colors, CommonTextStyles, fontSize } from '../../common/constants';
import { action_close, icon_info } from '../../images';
import { kCollaborators, kTags } from './publish';
import style from './styles';

import GroupPicHolder from '../../common/component/group_pic_holder/group_pic_holder';
import PlaceholderImageView from '../../common/component/placeHolderImageView';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import { kSaveInvite } from './inviteCollaborators/noteToCollaborators';
import { SaveSearchList, SaveWhoCanSeeIds } from './reducer';
import { kUserCircles, kUsers, UserSearchAPI } from './saga';
import { kWhoCanSeeThisMemory } from './whoCanSee';
import { create_plus, tagx } from '../../../app/images';

type State = { [x: string]: any };
type Props = {
  tag: string;
  title: string;
  showRecent: boolean;
  [x: string]: any;
  referenceList: any;
  placeholder: any;
};

class CommonFriendsSearchView extends React.Component<Props, State> {
  backListner: EventManager;
  searchBar: React.RefObject<SearchBar> = React.createRef<SearchBar>();
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;

  state: any = {
    userTabSelected: true,
    referenceListFriends: [],
    referenceListFriendCircles: [],
    errorView: false,
    showSearchList: false,
    bottomView: 0,
    inputFocused: false
  };

  constructor(props: Props) {
    super(props);
    this.backListner = EventManager.addListener(
      'hardwareBackPress',
      this.cancelAction,
    );
    if (Platform.OS == 'android') {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._keyboardDidHide,
      );
    } else {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardWillShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardWillHide',
        this._keyboardDidHide,
      );
    }
  }

  _keyboardDidShow = (e: any) => {
    // this.setState({
    //     bottomView : e.endCoordinates.height - (Platform.OS == "ios" ? (DeviceInfo.hasNotch() ? 40 : 100) : 100)
    // })
  };

  _keyboardDidHide = (e: any) => {
    this.setState({
      bottomView: 0,
    });
  };

  UNSAFE_componentWillMount() {
    this.props.saveSearchList([]);
    this.backListner.removeListener();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentDidMount() {
    let refListFriends = this.props.route.params?.refListFriends?.slice(0);
    let refListFriendCircles = this.props.route?.params?.refListFriendCircles?.slice(0);
    this.setState({
      isMemoryTags: this.props.route.params.tag == kTags,
      isCollaborator: this.props.route.params.tag == kCollaborators,
      referenceListFriends: refListFriends,
      referenceListFriendCircles: refListFriendCircles,
    });
  }

  cancelAction = () => {
    this.props.saveSearchList([]);
    Keyboard.dismiss();
    this.props.navigation.goBack();
  };

  addToList = (item: any) => {
    let refList: any = this.state.referenceListFriendCircles;
    if (this.state.userTabSelected) {
      refList = this.state.referenceListFriends;
    }
    let found = false;
    this.setState({ errorView: false }, () => {
      if (this.state.userTabSelected)
        found = refList.some((element: any) => element.uid === item.uid);
      else found = refList.some((element: any) => element.id === item.id);

      if (!found) {
        refList.push(item);
        this.setState({ referenceList: refList });
      }

      let searchList = this.props.searchList;
      if (this.state.userTabSelected)
        searchList = searchList.filter(
          (element: any) => element.uid != item.uid,
        );
      else
        searchList = searchList.filter((element: any) => element.id != item.id);
      this.props.saveSearchList(searchList);
      this.searchBar.current &&
        this.searchBar.current.clearField &&
        this.searchBar.current.clearField();
    });
  };

  removeFromList = (item: any) => {
    let refList: any = this.state.referenceListFriendCircles;
    if (this.state.userTabSelected) {
      refList = this.state.referenceListFriends;
    }

    if (this.state.userTabSelected)
      refList = refList.filter((element: any) => element.uid != item.uid);
    else refList = refList.filter((element: any) => element.id != item.id);

    let refObj = {};
    if (this.state.userTabSelected) {
      refObj = { referenceListFriends: refList };
    } else {
      refObj = { referenceListFriendCircles: refList };
    }

    this.setState(refObj);
  };

  onChangeText = (text: any) => {
    if (text.trim().length > 0) {
      this.setState({ showSearchList: true });
    } else {
      this.setState({ showSearchList: false });
    }
    if (this.state.userTabSelected) {
      this.props.userSearch({ searchType: kUsers, searchTerm: text });
    } else {
      this.props.userSearch({ searchType: kUserCircles, searchTerm: text });
    }
  };

  navigateToGroupInfo = (item: any) => {
    let heading = item.name + ' (' + item.users_count + ')';
    this.props.navigation.navigate('customListMemoryDetails', {
      heading: heading,
      itemList: item.users,
    });
  };

  renderRow = (item: any, searchList: boolean) => {
    item = item.item;
    return (
      <View
        style={[
          style.rowmainContainerStyle,

        ]}>
        <View style={style.rowContainerStyle}>
          <View style={style.searchContainer}>
            {item.uid != -1 && this.state.userTabSelected && (
              <View style={style.placeholderImageViewStyle}>
                <PlaceholderImageView
                  uri={Utility.getFileURLFromPublicURL(item.uri)}
                  borderRadius={20}
                  style={style.placeholderImageStyleMargin}
                  profilePic={true}
                />
              </View>
            )}
            {item.uid != -1 && !this.state.userTabSelected && (
              <GroupPicHolder items={item.users ? item.users : []} />
            )}
            <View>
              <Text
                style={[
                  style.normalText,
                  {
                    marginBottom: 0,
                  },
                ]}>
                {this.state.userTabSelected
                  ? item.field_first_name_value +
                  ' ' +
                  item.field_last_name_value
                  : item.name}
              </Text>
              {!this.state.userTabSelected && item.uid != -1 && (
                <Text style={[style.userCountText]}>
                  {item.users_count} member{item.users_count > 1 ? 's' : ''}
                </Text>
              )}
            </View>
          </View>
          <View style={style.infoIconContainerStyle}>
            {!this.state.userTabSelected && item.uid != -1 && (
              <TouchableOpacity
                onPress={() => this.navigateToGroupInfo(item)}
                style={style.imagebuttonStyle}>
                <Image
                  style={style.infoIconStyle}
                  source={icon_info}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            )}
            {searchList ? (
              <View style={style.searchContainer}>
                {item.uid != -1 && (
                  <TouchableHighlight
                    underlayColor={Colors.overlayOpacityColor}
                    onPress={() => this.addToList(item)}>

                    <Image source={create_plus}></Image>
                    {/* <Text style={style.collaborateTextStyle}>Add</Text> */}
                  </TouchableHighlight>
                )}
              </View>
            ) : (
              <TouchableHighlight
                style={style.imagebuttonStyle}
                underlayColor={Colors.overlayOpacityColor}
                onPress={() => this.removeFromList(item)}>
                <Image source={action_close}></Image>
              </TouchableHighlight>
            )}
          </View>
        </View>
      </View>
    );
  };

  renderSelectedItems = (item: any, searchList: boolean) => {
    item = item.item;
    return (

      <View >
        <View style={style.rowContainerStyle}>
          <View style={[style.searchContainer, style.selectedRowmainContainerStyle]}>
            {item.uid != -1 && this.state.userTabSelected && (
              <View style={style.placeholderImageViewStyle}>
                <PlaceholderImageView
                  uri={Utility.getFileURLFromPublicURL(item.uri)}
                  borderRadius={20}
                  style={style.placeholderImageStyleMargin}
                  profilePic={true}
                />
              </View>
            )}
            {item.uid != -1 && !this.state.userTabSelected && (
              <GroupPicHolder items={item.users ? item.users : []} />
            )}
            <Text
              style={[
                style.normalText,
                {
                  marginBottom: 0,
                },
              ]}>
              {this.state.userTabSelected
                ? item.field_first_name_value +
                ' ' +
                item.field_last_name_value
                : item.name}
            </Text>
            {!this.state.userTabSelected && item.uid != -1 && (
              <Text style={[style.userCountText]}>
                {item.users_count} member{item.users_count > 1 ? 's' : ''}
              </Text>
            )}

            {/* <View style={[style.infoIconContainerStyle,{backgroundColor:'green'}]}> */}
            {!this.state.userTabSelected && item.uid != -1 && (
              <TouchableOpacity
                onPress={() => this.navigateToGroupInfo(item)}
              // style={style.imagebuttonStyle}
              >
                <Image
                  style={style.infoIconStyle}
                  source={icon_info}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            )}

            <TouchableHighlight
              // style={style.imagebuttonStyle}
              underlayColor={Colors.overlayOpacityColor}
              onPress={() => this.removeFromList(item)}>
              <Image source={action_close}></Image>
            </TouchableHighlight>

            {/* </View> */}
          </View>

        </View>
      </View>
    );
  };
  saveValue = () => {
    if (this.props.route.params.tag == kWhoCanSeeThisMemory) {
      this.props.saveWhoCanSee({
        userIds: this.state.referenceListFriends,
        groupIds: this.state.referenceListFriendCircles,
      });
      Keyboard.dismiss();
      this.props.navigation.goBack();
    } else if (this.props.route.params.tag == kCollaborators) {
      if (
        this.state.referenceListFriends.length > 0 ||
        this.state.referenceListFriendCircles.length > 0
      ) {
        this.props.navigation.navigate('notesToCollaborators', {
          friendsList: this.state.referenceListFriends,
          friendsCircleList: this.state.referenceListFriendCircles,
          type: kSaveInvite,
          isOwner: true,
        });
      } else {
        this.setState({ errorView: true });
      }
    }
  };

  tabChange = (setUserTab: boolean) => {
    this.props.saveSearchList([]);
    this.setState({ userTabSelected: setUserTab }, () => {
      this.searchBar.current &&
        this.searchBar.current.clearField &&
        this.searchBar.current.clearField();
    });
  };
  render() {
    return (
      <View style={style.fullFlex}>
        <SafeAreaView style={style.emptySafeAreaStyle} />
        <SafeAreaView style={style.SafeAreaViewContainerStyle}>
          <View style={style.fullFlex}>

            <NavigationHeaderSafeArea
              heading={''}
              cancelAction={() => this.cancelAction()}
              showRightText={false}
              rightText={'Done'}
              backIcon={action_close}
              saveValues={this.saveValue}
            />
            <View style={style.borderStyle}></View>

            {/* <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>                    */}
            <StatusBar
              barStyle={
                Utility.currentTheme == 'light'
                  ? 'dark-content'
                  : 'light-content'
              }
              backgroundColor={Colors.NewThemeColor}
            />

            <Text style={style.collectionTextStyle}>
              Which friends and/or friend circles would you like to see this memory?
            </Text>

            {/* <View style={style.tabsContainer}>
              <TouchableHighlight
                underlayColor={Colors.underlayBlackOpacityColor}
                style={[
                  style.tabs,
                  {
                    borderBottomColor: this.state.userTabSelected
                      ? Colors.TextColor
                      : Colors.NewThemeColor,
                    borderBottomWidth: 3,
                  },
                ]}
                onPress={() => this.tabChange(true)}>
                <Text
                  style={[
                    style.tabsText,
                    {
                      fontWeight: this.state.userTabSelected ? '500' : 'normal',
                    },
                  ]}>
                  Friends
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={Colors.underlayBlackOpacityColor}
                style={[
                  style.tabs,
                  {
                    borderBottomColor: !this.state.userTabSelected
                      ? Colors.TextColor
                      : Colors.NewThemeColor,
                    borderBottomWidth: 3,
                  },
                ]}
                onPress={() => this.tabChange(false)}>
                <Text
                  style={[
                    style.tabsText,
                    {
                      fontWeight: !this.state.userTabSelected
                        ? '500'
                        : 'normal',
                    },
                  ]}>
                  Friend Circle
                </Text>
              </TouchableHighlight>
            </View> */}
            <SearchBar
              ref={this.searchBar}
              style={[
                style.commonFriendSerachStyle,
                // this.state.inputFocused
                // ? 
                style.onFocusStyle,
                // : 
                // {},

              ]}
              placeholder={this.props.route.params.placeholder}
              onSearchButtonPress={(text: string) => {
                this.onChangeText(text);
              }}
              onClearField={() => {
                this.props.saveSearchList([]);
              }}
              onChangeText={(text: any) => {
                this.onChangeText(text);
              }}
              onFocus={() => {
                this.setState({
                  inputFocused: true
                })
              }}
              showCancelClearButton={false}
            />
            {this.state.errorView && (
              <Text style={style.errortextStyle}>
                * Please select at least 1 friend/friend circle to invite
              </Text>
            )}

            {this.props.searchList.length == 0 && (
              <FlatList
                // extraData={this.state}
                // style={style.fullWidth}
                onScroll={() => {
                  Keyboard.dismiss();
                }}
                keyboardShouldPersistTaps={'handled'}
                keyExtractor={(_, index: number) => `${index}`}
                showsHorizontalScrollIndicator={false}
                data={
                  this.state.userTabSelected
                    ? this.state.referenceListFriends
                    : this.state.referenceListFriendCircles
                }
                renderItem={(item: any) => this.renderSelectedItems(item, false)}
              />
            )}

            {this.state.showSearchList && this.props.searchList.length > 0 && (
              <FlatList
                // extraData={this.state}
                keyExtractor={(_, index: number) => `${index}`}
                style={style.SafeAreaViewContainerStyle}
                keyboardShouldPersistTaps={'handled'}
                onScroll={() => {
                  Keyboard.dismiss();
                }}
                showsHorizontalScrollIndicator={true}
                data={this.props.searchList}
                renderItem={(item: any) => this.renderRow(item, true)}
              />
            )}
            <View
              style={[style.fullWidth, { height: this.state.bottomView }]}></View>
          
          <TouchableWithoutFeedback
            // disabled={(this.state.username != '' && this.state.password != '') ? false : true}
            onPress={
              this.saveValue
            }>
            <View
              style={style.loginSSOButtonStyle}>
              <Text
                style={[
                  CommonTextStyles.fontWeight500Size17Inter,
                  style.loginTextStyle,
                ]}>
                Done
              </Text>
            </View>
          </TouchableWithoutFeedback>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const mapState = (state: { [x: string]: any }) => {
  return {
    searchList: state.MemoryInitials.searchList,
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    userSearch: (payload: any) =>
      dispatch({ type: UserSearchAPI, payload: payload }),
    saveSearchList: (payload: any) =>
      dispatch({ type: SaveSearchList, payload: payload }),
    saveWhoCanSee: (payload: any) =>
      dispatch({ type: SaveWhoCanSeeIds, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(CommonFriendsSearchView);
