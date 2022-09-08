import React from 'react';
import {
  FlatList, Image, Keyboard, Platform, SafeAreaView,
  StatusBar, TouchableHighlight, View
} from 'react-native';
import Text from '../../../common/component/Text';
// @ts-ignore
import { connect } from 'react-redux';
import {
  Colors, fontFamily, fontSize,
  ShareOptions
} from '../../../common/constants';
import {add_icon, radio, radio_active} from '../../../images';
import {SaveShareOption} from '../reducer';
// @ts-ignore
import NavigationHeaderSafeArea from '../../../common/component/profileEditHeader/navigationHeaderSafeArea';
import Utility from '../../../common/utility';
import { getUserCount } from '../dataHelper';
import Styles from './styles';
export const kWhoCanSeeThisMemory = 'whoCanSeeThisMemoryScreen';
type State = { [x: string]: any };
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
    this.setState({ selectedItemIndex: index });
  }

  componentWillUnmount = () => { };

  saveValue = () => {
    if (this.validateShareOptions()) {
      this.props.saveShareOption(
        Object.keys(ShareOptions)[this.state.selectedItemIndex],
      );
      Keyboard.dismiss();
      this.props.navigation.goBack();
    } else {
      this.setState({ showError: true });
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
    this.props.navigation.goBack();
  };

  whoCanSeeView = (item: any) => {
    this.setState({selectedItemIndex: item.index}, () => {
      this.props.navigation.navigate('commonFriendsSearchView', {
        title: 'Who can see this memory?',
        refListFriends: this.props.whoCanSeeMemoryUids,
        refListFriendCircles: this.props.whoCanSeeMemoryGroupIds,
        tag: kWhoCanSeeThisMemory,
      });
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
        <View style={Styles.ShareOptionsItemStyle}>
          <Image
            source={
              item.index == this.state.selectedItemIndex ? radio_active : radio
            }
            style={Styles.imageStyle}
            resizeMode="contain"
          />
          <View style={Styles.container}>
            <Text style={Styles.shareOptionsStyle}>{item.item}</Text>
            {Object['keys'](ShareOptions)[item.index] === 'custom' && (
              <View>
                <TouchableHighlight
                  onPress={() => this.whoCanSeeView(item)}
                  underlayColor={'#ffffff33'}
                  style={[
                    Styles.shareOptionContainerStyle,
                    {
                      borderBottomColor: this.state.showError
                        ? Colors.ErrorColor
                        : 'rgba(0,0,0,0.3)',
                    },
                  ]}>
                  <View style={Styles.shareOptionSubContainerStyle}>
                    <Text style={Styles.optionsTextStyle}>
                      {this.getCustomText()}
                    </Text>
                    <Image
                      style={Styles.imageStyle}
                      source={add_icon}
                      resizeMode={'contain'}></Image>
                  </View>
                </TouchableHighlight>
                {this.state.showError && (
                  <Text style={Styles.showErrorStyle}>
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
      <View style={Styles.container}>
        <SafeAreaView style={Styles.invisibleContainer} />
        <SafeAreaView style={Styles.safeAreaContainer}>
          <StatusBar
            barStyle={
              Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
            }
            backgroundColor={Colors.ThemeColor}
          />
          <View style={Styles.container}>
            <NavigationHeaderSafeArea
              hideBottomSeparator={true}
              heading={'Who can see this memory?'}
              cancelAction={() => this.cancelAction()}
              showRightText={true}
              rightText={'Done'}
              saveValues={this.saveValue}
            />
            {/* <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>                    */}
            <Text style={Styles.whoElsetextStyle}>
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

const mapState = (state: { [x: string]: any }) => {
  return {
    shareOption: state.MemoryInitials.shareOption,
    whoCanSeeMemoryUids: state.MemoryInitials.whoCanSeeMemoryUids,
    whoCanSeeMemoryGroupIds: state.MemoryInitials.whoCanSeeMemoryGroupIds,
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    saveShareOption: (payload: any) =>
      dispatch({ type: SaveShareOption, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(WhoCanSee);
