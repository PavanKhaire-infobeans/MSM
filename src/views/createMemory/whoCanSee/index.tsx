import {
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableHighlight,
  FlatList,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {Actions} from 'react-native-router-flux';
import Text from '../../../common/component/Text';
// @ts-ignore
import {KeyboardAwareScrollView} from '../../common/component/keyboardaware-scrollview';
import {
  Colors,
  fontSize,
  decode_utf8,
  getValue,
  ShareOptions,
} from '../../../common/constants';
import NavigationThemeBar from '../../../common/component/navigationBarForEdit/navigationBarWithTheme';
import {
  add_icon,
  visibility_theme,
  move_arrow,
  radio_active,
  radio,
} from '../../../images';
import {connect} from 'react-redux';
import {LocationAPI, MemoryTagsAPI, CollectinAPI} from '../saga';
import {
  ResetLocation,
  MemoryInitialsUpdate,
  SaveCollection,
  SaveShareOption,
} from '../reducer';
import {
  GetCollectionDetails,
  kCollectionMemories,
  UpdateMemoryCollection,
  kCollectionUpdated,
} from '../createMemoryWebService';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import EventManager from '../../../common/eventManager';
// @ts-ignore
import DraggableFlatList from 'react-native-draggable-flatlist';
import {ToastMessage} from '../../../common/component/Toast';
import {getUserCount} from '../dataHelper';
import NavigationHeader from '../../../common/component/navigationHeader';
import NavigationHeaderSafeArea from '../../../common/component/profileEditHeader/navigationHeaderSafeArea';
import Utility from '../../../common/utility';
export const kWhoCanSeeThisMemory = 'whoCanSeeThisMemoryScreen';
type State = {[x: string]: any};
type Props = {
  tid?: any;
  isRename: any;
  collectionName?: any;
  [x: string]: any;
  callback?: any;
};

class WhoCanSee extends React.Component<Props, State> {
  state: State = {
    selectedItemIndex: 2,
    showError: false,
  };

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    let index = Object.keys(ShareOptions).indexOf(this.props.shareOption);
    this.setState({selectedItemIndex: index});
  }

  componentWillUnmount = () => {};

  saveValue = () => {
    if (this.validateShareOptions()) {
      this.props.saveShareOption(
        Object.keys(ShareOptions)[this.state.selectedItemIndex],
      );
      Keyboard.dismiss();
      Actions.pop();
    } else {
      this.setState({showError: true});
    }
  };

  validateShareOptions = () => {
    if (
      Object['keys'](ShareOptions)[this.state.selectedItemIndex] === 'custom' &&
      this.props.whoCanSeeMemoryUids.length == 0 &&
      this.props.whoCanSeeMemoryGroupIds.length == 0
    ) {
      return false;
    }
    return true;
  };

  cancelAction = () => {
    Keyboard.dismiss();
    Actions.pop();
  };

  whoCanSeeView = (item: any) => {
    this.setState({selectedItemIndex: item.index});
    Actions.push('commonFriendsSearchView', {
      title: 'Who can see this memory?',
      refListFriends: this.props.whoCanSeeMemoryUids,
      refListFriendCircles: this.props.whoCanSeeMemoryGroupIds,
      tag: kWhoCanSeeThisMemory,
    });
  };

  getCustomText = () => {
    let allUsers = getUserCount(
      this.props.whoCanSeeMemoryUids,
      this.props.whoCanSeeMemoryGroupIds,
    );
    if (
      allUsers.length > 0 &&
      Object['keys'](ShareOptions)[this.state.selectedItemIndex] === 'custom'
    ) {
      let returnString = allUsers.length + ' Friend';
      if (allUsers.length > 1) {
        returnString = returnString + 's';
      }
      return returnString + ' added';
    }
    return 'Add friends and/or friend circles';
  };
  renderItem = (item: any) => {
    //console.log(item);
    return (
      <TouchableHighlight
        underlayColor={'#ffffff33'}
        onPress={() =>
          this.setState({selectedItemIndex: item.index, showError: false})
        }>
        <View style={{padding: 15, flexDirection: 'row'}}>
          <Image
            source={
              item.index == this.state.selectedItemIndex ? radio_active : radio
            }
            style={{height: 25, width: 25}}
            resizeMode="contain"
          />
          <View style={{flex: 1}}>
            <Text style={{...fontSize(18), marginLeft: 5}}>{item.item}</Text>
            {Object['keys'](ShareOptions)[item.index] === 'custom' && (
              <View>
                <TouchableHighlight
                  onPress={() => this.whoCanSeeView(item)}
                  underlayColor={'#ffffff33'}
                  style={{
                    flex: 1,
                    borderBottomWidth: 1,
                    paddingTop: 20,
                    borderBottomColor: this.state.showError
                      ? Colors.ErrorColor
                      : 'rgba(0,0,0,0.3)',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: 5,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        color: Colors.ThemeColor,
                        fontWeight: '500',
                        ...fontSize(16),
                      }}>
                      {this.getCustomText()}
                    </Text>
                    <Image
                      style={{height: 25, width: 25}}
                      source={add_icon}
                      resizeMode={'contain'}></Image>
                  </View>
                </TouchableHighlight>
                {this.state.showError && (
                  <Text
                    style={{
                      ...fontSize(14),
                      paddingTop: 5,
                      color: Colors.ErrorColor,
                    }}>
                    *Add atleast one Friend/Friend Circle to share.{' '}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </TouchableHighlight>
    );
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
          <StatusBar
            barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
            backgroundColor={Colors.ThemeColor}
          />
          <View style={{flex: 1}}>
            <NavigationHeaderSafeArea
              hideBottomSeparator={true}
              heading={'Who can see this memory?'}
              cancelAction={() => this.cancelAction()}
              showRightText={true}
              rightText={'Done'}
              saveValues={this.saveValue}
            />
            {/* <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>                    */}
            <Text
              style={{
                width: '100%',
                padding: 15,
                color: '#595959',
                ...fontSize(18),
              }}>
              Select who can see memories after publishing it.
            </Text>
            <FlatList
              onScroll={() => {
                Keyboard.dismiss();
              }}
              keyExtractor={(_, index: number) => `${index}`}
              data={Object['values'](ShareOptions)}
              renderItem={(item: any) => this.renderItem(item)}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const mapState = (state: {[x: string]: any}) => {
  return {
    shareOption: state.MemoryInitials.shareOption,
    whoCanSeeMemoryUids: state.MemoryInitials.whoCanSeeMemoryUids,
    whoCanSeeMemoryGroupIds: state.MemoryInitials.whoCanSeeMemoryGroupIds,
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    saveShareOption: (payload: any) =>
      dispatch({type: SaveShareOption, payload: payload}),
  };
};

export default connect(mapState, mapDispatch)(WhoCanSee);
