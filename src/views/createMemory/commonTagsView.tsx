import React from 'react';
import {
  FlatList, Image, Keyboard, Platform, SafeAreaView,
  StatusBar, Text, TouchableHighlight, View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
// @ts-ignore
import { connect } from 'react-redux';
import PlaceholderImageView from '../../common/component/placeHolderImageView';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import SearchBar from '../../common/component/SearchBar';
import { Colors, fontSize } from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import { action_close } from '../../images';
import { kTags } from './publish';
import {
  SaveMemoryTagsList, SaveSearchList, SaveWhoElseWhereThere
} from './reducer';
import {
  kRecentTags, kSearchTags, kUsers, MemoryTagsAPI, UserSearchAPI
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

  componentWillUnmount() {

    this.backListner.removeListener();
    Keyboard.removeAllListeners("keyboardDidShow")
    Keyboard.removeAllListeners("keyboardDidHide")
    Keyboard.removeAllListeners("keyboardWillShow")
    Keyboard.removeAllListeners("keyboardWillHide")
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
    this.setState({ errorView: false }, () => {
      if (this.state.isMemoryTags)
        found = refList.some(
          (element: any) => element.tid === item.tid || element.name == item.name,
        );
      else found = refList.some((element: any) => element.uid === item.uid);

      if (!found) {
        refList.push(item);
        this.setState({ referenceList: refList });
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
    });

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
        style={Styles.searchListItemStyle}>
        <View
          style={Styles.searchListItemContainerStyle}>
          {this.state.isMemoryTags ? (
            <Text
              style={Styles.itemName}>
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
                    style={Styles.addButtonStyle}>
                    Add
                  </Text>
                </TouchableHighlight>
              )}
            </View>
          ) : (
            <TouchableHighlight
              style={Styles.imagebuttonStyle}
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
      <View style={style.searchContainer}>
        {item.uid != -1 && (
          <View
            style={style.placeholderImageViewStyle}>
            <PlaceholderImageView
              uri={Utility.getFileURLFromPublicURL(item.uri)}
              style={[style.placeholderImageStyleMargin, { alignContent: 'center' }]}
              resizeMode={'contain'}
              profilePic={true}
            />
          </View>
        )}
        <Text style={style.normalText}>
          {item.field_first_name_value + ' ' + item.field_last_name_value}
        </Text>
      </View>
    );
  };

  renderTagsItem = (item: any) => {
    return (
      <TouchableHighlight
        underlayColor={Colors.underlay33OpacityColor}
        onPress={() => this.addToList(item.item)}
        style={style.tagContainerStyle}>
        <Text style={style.tagName}>
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
            style={style.memoryTagContainer}>
            <FlatList
              horizontal
              keyExtractor={(_, index: number) => `${index}`}
              showsHorizontalScrollIndicator={false}
              data={this.props.recentTags}
              style={style.imagebuttonStyle}
              renderItem={(item: any) => this.renderTagsItem(item)}
            />
          </View>
        ) : null}
      </View>
    );
  };

  onChangeText = (text: any) => {
    if (text.trim().length > 0) {
      this.setState({ showSearchList: true });
    } else {
      this.setState({ showSearchList: false });
    }
    if (this.state.isMemoryTags) {
      this.props.memoryTagsSearch({ searchType: kSearchTags, searchTerm: text });
    } else {
      this.props.userSearch({ searchType: kUsers, searchTerm: text });
    }
  };

  render() {
    return (
      <View style={style.fullFlex}>
        <SafeAreaView
          style={style.emptySafeAreaStyle}
        />
        <SafeAreaView style={style.SafeAreaViewContainerStyle}>
          <View style={style.fullFlex} onStartShouldSetResponder={() => false}>
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
              barStyle={Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            <SearchBar
              ref={this.searchBar}
              style={[style.commonFriendSerachStyle, {
                backgroundColor: Colors.SerachbarColor,
                borderBottomColor: this.state.errorView ? Colors.ErrorColor : Colors.TextColor,
              }]}
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
                style={style.selectFriendTextStyle}>
                *Please select some friends
              </Text>
            )}
            {this.props.searchList.length == 0 && (
              <FlatList
                extraData={this.state}
                style={style.fullWidth}
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

            <View style={[style.fullWidth, { height: this.state.bottomView }]}></View>
            <View style={style.smallSeparator}></View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
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
