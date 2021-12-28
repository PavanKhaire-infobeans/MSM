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
import {pdf_icon, add_icon_small, edit_icon, action_close} from '../../images';
import {connect} from 'react-redux';
import TextNew from '../../common/component/Text';
import SearchBar from '../../common/component/SearchBar';
import {kTags, kWhoElseWhereThere} from './publish';
import {MemoryTags} from '../memoryDetails/componentsMemoryDetails';
import {
  SaveMemoryTagsList,
  SaveWhoElseWhereThere,
  SaveSearchList,
} from './reducer';
import {
  MemoryTagsAPI,
  kSearchTags,
  UserSearchAPI,
  kUsers,
  kRecentTags,
} from './saga';
import EventManager from '../../common/eventManager';
import PlaceholderImageView from '../../common/component/placeHolderImageView';
import Utility from '../../common/utility';
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

class CommonListCreateMemory extends React.Component<Props, State> {
  backListner: any;
  searchBar: React.RefObject<SearchBar> = React.createRef<SearchBar>();
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;

  state: any = {
    isMemoryTags: false,
    referenceList: [],
    errorView: false,
    content: '',
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
    //         bottomView : e.endCoordinates.height - (Platform.OS == "ios" ? (DeviceInfo.hasNotch() ? 40 : 100) : 100)
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
    let refList: any = this.props.referenceList.slice(0);
    this.setState({
      isMemoryTags: this.props.tag == kTags,
      referenceList: refList,
    });
  }

  cancelAction = () => {
    this.props.saveSearchList([]);
    Keyboard.dismiss();
    Actions.pop();
  };

  publishMemory = () => {
    if (this.state.isMemoryTags) {
      this.props.setMemoryTags(this.state.referenceList);
      this.props.recentTagsSearch();
    } else {
      this.props.setWhoElseWhereThere(this.state.referenceList);
    }
    Keyboard.dismiss();
    Actions.pop();
  };

  addToList = (item: any) => {
    let refList = this.state.referenceList;
    let found = false;
    this.setState({errorView: false});
    if (this.state.isMemoryTags)
      found = refList.some(
        (element: any) => element.tid === item.tid || element.name == item.name,
      );
    else found = refList.some((element: any) => element.uid === item.uid);

    if (!found) {
      refList.push(item);
      this.setState({referenceList: refList});
    }

    let searchList = this.props.searchList;
    if (this.state.isMemoryTags)
      searchList = searchList.filter((element: any) => element.tid != item.tid);
    else
      searchList = searchList.filter((element: any) => element.uid != item.uid);
    this.props.saveSearchList(searchList);
    this.searchBar.current &&
      this.searchBar.current.clearField &&
      this.searchBar.current.clearField();
  };

  removeFromList = (item: any) => {
    let refList = this.state.referenceList;
    if (this.state.isMemoryTags)
      refList = refList.filter((element: any) => element.tid != item.tid);
    else refList = refList.filter((element: any) => element.uid != item.uid);
    this.setState({
      referenceList: refList,
    });
  };

  renderRow = (item: any, searchList: boolean) => {
    return (
      <View
        style={{
          paddingTop: 10,
          width: '100%',
          paddingBottom: 10,
          backgroundColor: searchList ? '#E6F0EF' : '#fff',
          height: 60,
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
          {this.state.isMemoryTags ? (
            <Text
              style={{...fontSize(16), fontWeight: 'normal', color: '#595959'}}>
              {item.item.name}
            </Text>
          ) : (
            this.userList(item.item)
          )}
          {searchList ? (
            <View>
              {item.item.uid != -1 && (
                <TouchableHighlight
                  underlayColor={'#ffffff22'}
                  onPress={() => this.addToList(item.item)}>
                  <Text
                    style={{
                      color: Colors.NewTitleColor,
                      ...fontSize(16),
                      paddingRight: 15,
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
              onPress={() => this.removeFromList(item.item)}>
              <Image source={action_close}></Image>
            </TouchableHighlight>
          )}
        </View>
      </View>
    );
  };

  userList = (item: any) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {item.uid != -1 && (
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
              style={{
                height: 40,
                width: 40,
                marginRight: 20,
                alignContent: 'center',
              }}
              resizeMode={'contain'}
              profilePic={true}
            />
          </View>
        )}
        <Text style={{...fontSize(16), fontWeight: 'normal', color: '#595959'}}>
          {item.field_first_name_value + ' ' + item.field_last_name_value}
        </Text>
      </View>
    );
  };
  renderTagsItem = (item: any) => {
    return (
      <TouchableHighlight
        underlayColor={'#ffffff33'}
        onPress={() => this.addToList(item.item)}
        style={{
          paddingRight: 10,
          paddingLeft: 10,
          paddingBottom: 0,
          borderWidth: 1,
          borderRadius: 20,
          paddingTop: 5,
          marginRight: 10,
          justifyContent: 'center',
          marginBottom: 0,
          alignItems: 'center',
          borderColor: '#595959',
        }}>
        <Text style={[style.normalText, {...fontSize(14), marginBottom: 5}]}>
          {item.item.name}
        </Text>
      </TouchableHighlight>
    );
  };

  memoryTags = () => {
    return (
      <View>
        {this.props.recentTags.length > 0 ? (
          <View
            style={{
              height: 50,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(0, 0, 0, 0.2)',
            }}>
            <FlatList
              horizontal
              keyExtractor={(_, index: number) => `${index}`}
              showsHorizontalScrollIndicator={false}
              data={this.props.recentTags}
              style={{padding: 10}}
              renderItem={(item: any) => this.renderTagsItem(item)}
            />
          </View>
        ) : null}
      </View>
    );
  };

  onChangeText = (text: any) => {
    if (text.trim().length > 0) {
      this.setState({showSearchList: true});
    } else {
      this.setState({showSearchList: false});
    }
    if (this.state.isMemoryTags) {
      this.props.memoryTagsSearch({searchType: kSearchTags, searchTerm: text});
    } else {
      this.props.userSearch({searchType: kUsers, searchTerm: text});
    }
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
              heading={this.props.title}
              showCommunity={false}
              cancelAction={() => this.cancelAction()}
              showRightText={true}
              rightText={'Done'}
              saveValues={this.publishMemory}
            />
            {/* <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>                    */}
            <StatusBar
              barStyle={'dark-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            <SearchBar
              ref={this.searchBar}
              style={{
                height: 50,
                padding: 10,
                alignItems: 'center',
                borderBottomWidth: 1,
                backgroundColor: '#F3F3F3',
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
            {this.props.searchList.length == 0 &&
              this.props.showRecent &&
              this.memoryTags()}
            {this.state.errorView && (
              <Text
                style={{
                  ...fontSize(12),
                  paddingLeft: 10,
                  color: Colors.ErrorColor,
                }}>
                *Please select some friends
              </Text>
            )}
            {this.props.searchList.length == 0 && (
              <FlatList
                extraData={this.state}
                style={{width: '100%'}}
                keyExtractor={(_, index: number) => `${index}`}
                onScroll={() => {
                  Keyboard.dismiss();
                }}
                keyboardShouldPersistTaps={'handled'}
                showsHorizontalScrollIndicator={true}
                data={this.state.referenceList}
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
            <View style={{height: 1, width: '100%'}}></View>
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
});
const mapState = (state: {[x: string]: any}) => {
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
        payload: {searchType: kRecentTags, searchTerm: ''},
      }),
    memoryTagsSearch: (payload: any) =>
      dispatch({type: MemoryTagsAPI, payload: payload}),
    userSearch: (payload: any) =>
      dispatch({type: UserSearchAPI, payload: payload}),
    setMemoryTags: (payload: any) =>
      dispatch({type: SaveMemoryTagsList, payload: payload}),
    setWhoElseWhereThere: (payload: any) =>
      dispatch({type: SaveWhoElseWhereThere, payload: payload}),
    saveSearchList: (payload: any) =>
      dispatch({type: SaveSearchList, payload: payload}),
  };
};

export default connect(mapState, mapDispatch)(CommonListCreateMemory);
