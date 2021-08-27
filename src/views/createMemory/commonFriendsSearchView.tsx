import {
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableHighlight,
  FlatList,
  StyleSheet,
  SegmentedControlIOSBase,
  Alert,
} from 'react-native';
import React from 'react';
import {Actions} from 'react-native-router-flux';
// @ts-ignore
import {KeyboardAwareScrollView} from '../../common/component/keyboardaware-scrollview';
import {Colors, fontSize} from '../../common/constants';
import NavigationThemeBar from '../../common/component/navigationBarForEdit/navigationBarWithTheme';
import {
  pdf_icon,
  add_icon_small,
  edit_icon,
  action_close,
  icon_info,
} from '../../images';
import {connect} from 'react-redux';
import TextNew from '../../common/component/Text';
import SearchBar from '../../common/component/SearchBar';
import {kTags, kWhoElseWhereThere, kCollaborators} from './publish';
import {MemoryTags} from '../memoryDetails/componentsMemoryDetails';
import {
  SaveMemoryTagsList,
  SaveSearchList,
  SaveCollaborators,
  SaveWhoCanSeeIds,
} from './reducer';
import {
  MemoryTagsAPI,
  kSearchTags,
  UserSearchAPI,
  kUsers,
  kUserCircles,
} from './saga';
import EventManager from '../../common/eventManager';
import PlaceholderImageView from '../../common/component/placeHolderImageView';
import Utility from '../../common/utility';
import {kWhoCanSeeThisMemory} from './whoCanSee';
import {kSaveInvite} from './inviteCollaborators/noteToCollaborators';
import GroupPicHolder from '../../common/component/group_pic_holder/group_pic_holder';
import DeviceInfo from 'react-native-device-info';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';

type State = {[x: string]: any};
type Props = {
  tag: string;
  title: string;
  showRecent: boolean;
  [x: string]: any;
  referenceList: any;
  placeholder: any;
};

class CommonFriendsSearchView extends React.Component<Props, State> {
  backListner: any;
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

  componentWillMount() {
    this.props.saveSearchList([]);
  }

  componentDidMount() {
    let refListFriends = this.props.refListFriends.slice(0);
    let refListFriendCircles = this.props.refListFriendCircles.slice(0);
    this.setState({
      isMemoryTags: this.props.tag == kTags,
      isCollaborator: this.props.tag == kCollaborators,
      referenceListFriends: refListFriends,
      referenceListFriendCircles: refListFriendCircles,
    });
  }

  cancelAction = () => {
    this.props.saveSearchList([]);
    Keyboard.dismiss();
    Actions.pop();
  };

  addToList = (item: any) => {
    let refList: any = this.state.referenceListFriendCircles;
    if (this.state.userTabSelected) {
      refList = this.state.referenceListFriends;
    }
    let found = false;
    this.setState({errorView: false});
    if (this.state.userTabSelected)
      found = refList.some((element: any) => element.uid === item.uid);
    else found = refList.some((element: any) => element.id === item.id);

    if (!found) {
      refList.push(item);
      this.setState({referenceList: refList});
    }

    let searchList = this.props.searchList;
    if (this.state.userTabSelected)
      searchList = searchList.filter((element: any) => element.uid != item.uid);
    else
      searchList = searchList.filter((element: any) => element.id != item.id);
    this.props.saveSearchList(searchList);
    this.searchBar.current &&
      this.searchBar.current.clearField &&
      this.searchBar.current.clearField();
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
      refObj = {referenceListFriends: refList};
    } else {
      refObj = {referenceListFriendCircles: refList};
    }

    this.setState(refObj);
  };

  onChangeText = (text: any) => {
    if (text.trim().length > 0) {
      this.setState({showSearchList: true});
    } else {
      this.setState({showSearchList: false});
    }
    if (this.state.userTabSelected) {
      this.props.userSearch({searchType: kUsers, searchTerm: text});
    } else {
      this.props.userSearch({searchType: kUserCircles, searchTerm: text});
    }
  };

  navigateToGroupInfo = (item: any) => {
    let heading = item.name + ' (' + item.users_count + ')';
    Actions.push('customListMemoryDetails', {
      heading: heading,
      itemList: item.users,
    });
  };

  renderRow = (item: any, searchList: boolean) => {
    item = item.item;
    return (
      <View
        style={{
          paddingTop: 10,
          width: '100%',
          paddingBottom: 10,
          backgroundColor: searchList ? '#E6F0EF' : '#fff',
          height: 70,
          borderBottomColor: 'rgba(0,0,0,0.2)',
          borderBottomWidth: 1,
        }}>
        <View
          style={{
            paddingLeft: 15,
            width: '100%',
            flex: 1,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {item.uid != -1 && this.state.userTabSelected && (
              <View
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  marginRight: 20,
                  overflow: 'hidden',
                }}>
                <PlaceholderImageView
                  uri={Utility.getFileURLFromPublicURL(item.uri)}
                  borderRadius={20}
                  style={{
                    height: 40,
                    width: 40,
                    marginRight: 20,
                    borderRadius: Platform.OS === 'android' ? 40 : 20,
                  }}
                  profilePic={true}
                />
              </View>
            )}
            {item.uid != -1 && !this.state.userTabSelected && (
              <GroupPicHolder items={item.users ? item.users : []} />
            )}
            <View>
              <Text
                style={{
                  ...fontSize(16),
                  fontWeight: 'normal',
                  color: '#595959',
                }}>
                {this.state.userTabSelected
                  ? item.field_first_name_value +
                    ' ' +
                    item.field_last_name_value
                  : item.name}
              </Text>
              {!this.state.userTabSelected && item.uid != -1 && (
                <Text
                  style={{
                    ...fontSize(14),
                    fontStyle: 'italic',
                    fontWeight: 'normal',
                    color: '#595959',
                    paddingTop: 5,
                  }}>
                  {item.users_count} member{item.users_count > 1 ? 's' : ''}
                </Text>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingRight: 10,
            }}>
            {!this.state.userTabSelected && item.uid != -1 && (
              <TouchableOpacity
                onPress={() => this.navigateToGroupInfo(item)}
                style={{padding: 15}}>
                <Image
                  style={{height: 25, width: 25}}
                  source={icon_info}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            )}
            {searchList ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {item.uid != -1 && (
                  <TouchableHighlight
                    underlayColor={'#ffffff22'}
                    onPress={() => this.addToList(item)}>
                    <Text
                      style={{
                        color: Colors.NewTitleColor,
                        ...fontSize(16),
                        paddingRight: 7,
                      }}>
                      Add
                    </Text>
                  </TouchableHighlight>
                )}
              </View>
            ) : (
              <TouchableHighlight
                style={{padding: 15}}
                underlayColor={'#ffffff22'}
                onPress={() => this.removeFromList(item)}>
                <Image source={action_close}></Image>
              </TouchableHighlight>
            )}
          </View>
        </View>
      </View>
    );
  };

  saveValue = () => {
    if (this.props.tag == kWhoCanSeeThisMemory) {
      this.props.saveWhoCanSee({
        userIds: this.state.referenceListFriends,
        groupIds: this.state.referenceListFriendCircles,
      });
      Keyboard.dismiss();
      Actions.pop();
    } else if (this.props.tag == kCollaborators) {
      if (
        this.state.referenceListFriends.length > 0 ||
        this.state.referenceListFriendCircles.length > 0
      ) {
        Actions.push('notesToCollaborators', {
          friendsList: this.state.referenceListFriends,
          friendsCircleList: this.state.referenceListFriendCircles,
          type: kSaveInvite,
          isOwner: true,
        });
      } else {
        this.setState({errorView: true});
      }
    }
  };

  tabChange = (setUserTab: boolean) => {
    this.props.saveSearchList([]);
    this.setState({userTabSelected: setUserTab});
    this.searchBar.current &&
      this.searchBar.current.clearField &&
      this.searchBar.current.clearField();
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView
          style={{
            width: '100%',
            flex: 0,
            backgroundColor: Colors.NewThemeColor,
          }}
        />
        <SafeAreaView style={{width: '100%', flex: 1, backgroundColor: '#fff'}}>
          <View style={{flex: 1}} onStartShouldSetResponder={() => false}>
            <NavigationHeaderSafeArea
              hideBottomSeparator={true}
              heading={this.props.title}
              cancelAction={() => this.cancelAction()}
              showRightText={true}
              rightText={'Done'}
              saveValues={() => this.saveValue()}
            />
            {/* <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>                    */}
            <StatusBar
              barStyle={'dark-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            <View style={style.tabsContainer}>
              <TouchableHighlight
                underlayColor={'#00000011'}
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
                      fontWeight: this.state.userTabSelected
                        ? Platform.OS === 'ios'
                          ? '500'
                          : 'bold'
                        : 'normal',
                    },
                  ]}>
                  Friends
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={'#00000011'}
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
                        ? Platform.OS === 'ios'
                          ? '500'
                          : 'bold'
                        : 'normal',
                    },
                  ]}>
                  Friend Circle
                </Text>
              </TouchableHighlight>
            </View>
            <SearchBar
              ref={this.searchBar}
              style={{
                height: 50,
                padding: 10,
                alignItems: 'center',
                borderBottomWidth: 1,
                backgroundColor: 'white',
                width: '100%',
                retainFocus: true,
                borderBottomColor: this.state.errorView
                  ? Colors.ErrorColor
                  : Colors.TextColor,
              }}
              placeholder={this.props.placeholder}
              onSearchButtonPress={(text: string) => {
                this.onChangeText(text);
              }}
              onClearField={() => {
                this.props.saveSearchList([]);
              }}
              onChangeText={(text: any) => {
                this.onChangeText(text);
              }}
              showCancelClearButton={false}
            />
            {this.state.errorView && (
              <Text style={{color: Colors.ErrorColor, ...fontSize(14)}}>
                * Please select at least 1 friend/friend circle to invite
              </Text>
            )}

            {this.props.searchList.length == 0 && (
              <FlatList
                extraData={this.state}
                style={{width: '100%'}}
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
                renderItem={(item: any) => this.renderRow(item, false)}
              />
            )}

            {this.state.showSearchList && this.props.searchList.length > 0 && (
              <FlatList
                extraData={this.state}
                keyExtractor={(_, index: number) => `${index}`}
                style={{width: '100%', backgroundColor: '#fff', flex: 1}}
                keyboardShouldPersistTaps={'handled'}
                onScroll={() => {
                  Keyboard.dismiss();
                }}
                showsHorizontalScrollIndicator={true}
                data={this.props.searchList}
                renderItem={(item: any) => this.renderRow(item, true)}
              />
            )}
            <View style={{width: '100%', height: this.state.bottomView}}></View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const style = StyleSheet.create({
  normalText: {
    ...fontSize(16),
    fontWeight: 'normal',
    color: '#595959',
    marginBottom: 10,
  },
  tabsContainer: {
    width: '100%',
    height: 40,
    backgroundColor: Colors.NewThemeColor,
    flexDirection: 'row',
    shadowOpacity: 0.2,
    elevation: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0,
    },
  },
  tabs: {
    flex: 1,
    backgroundColor: Colors.NewThemeColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsText: {
    ...fontSize(16),
    color: Colors.TextColor,
  },
});

const mapState = (state: {[x: string]: any}) => {
  return {
    searchList: state.MemoryInitials.searchList,
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    userSearch: (payload: any) =>
      dispatch({type: UserSearchAPI, payload: payload}),
    saveSearchList: (payload: any) =>
      dispatch({type: SaveSearchList, payload: payload}),
    saveWhoCanSee: (payload: any) =>
      dispatch({type: SaveWhoCanSeeIds, payload: payload}),
  };
};

export default connect(mapState, mapDispatch)(CommonFriendsSearchView);
