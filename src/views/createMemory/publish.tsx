import React from 'react';
import {
  Alert, Animated,
  Dimensions, Image, Keyboard, Modal, SafeAreaView, ScrollView, StatusBar, Text, TouchableHighlight, TouchableOpacity, View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
// @ts-ignore
import Confetti from 'react-native-confetti';
import DefaultPreference from 'react-native-default-preference';
import { connect } from 'react-redux';
import { kPublish } from '.';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import TextNew from '../../common/component/Text';
import { No_Internet_Warning } from '../../common/component/Toast';
import {
  Colors,
  getValue,
  ShareOptions
} from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import {
  add_icon_small, arrow7, edit_icon
} from '../../images';
import Styles from './styles';

export const kTags = 'kTags';
export const kWhoElseWhereThere = 'kWhoElseWhereThere';
export const kCollaborators = 'kCollaborators';
const shareWith = 'Who can see this memory?';
const tags = 'Tags';
const whoElse = 'Who else where there?';
const addCollections = 'Add to Memory Collections';
type State = {[x: string]: any};
type Props = {[x: string]: any};

class PublishMemoryDraft extends React.Component<Props, State> {
  widthVal: any;
  state: State = {
    showMenu: false,
    showGuideOverlay: false,
  };
  _confettiView: any;
  // explosion: ConfettiCannon;
  showConfettiCanon: EventManager;

  constructor(props: Props) {
    super(props);
    this.widthVal = Dimensions.get('window').width;
    this.showConfettiCanon = EventManager.addListener('showConfetti', () => {
      //this.explosion && this.explosion.start();
      if (this._confettiView) {
        this._confettiView.startConfetti();
      }
    });
  }

  cancelAction = () => {
    Alert.alert('', `Are you sure you want to exit?`, [
      {
        text: 'No',
        style: 'cancel',
        onPress: () => {},
      },
      {
        text: 'Yes',
        style: 'default',
        onPress: () => {
          this.setState({showMenu: false});
          Keyboard.dismiss();
          Actions.pop();
        },
      },
    ]);
  };

  publishMemory = () => {
    this.setState({showMenu: false});
    this.props.publishMemoryDraft(kPublish);
  };

  commonListComponent = (
    title: any,
    value: any,
    placeholder: any,
    onPressCallback: any,
  ) => {
    return (
      <TouchableHighlight
        style={Styles.marginBottom30}
        onPress={() => onPressCallback()}
        underlayColor={Colors.underlay33OpacityColor}>
        <View>
          <TextNew
            style={Styles.textStyle18Weight500}>
            {title}
          </TextNew>
          <View
            style={Styles.commonListComponentContainer}>
            <View
              style={Styles.placeholderContainer}>
              <TextNew
                style={[Styles.placeholderTextStyle,{
                  color: value.length > 0 ? Colors.black : Colors.redgray,
                }]}>
                {value.length > 0 ? this.getText(title, value) : placeholder}
              </TextNew>
              <Image
                style={Styles.leftButtonLogo}
                resizeMode={'contain'}
                source={value.length > 0 ? edit_icon : add_icon_small}></Image>
            </View>
            {this.showViewAll(title, value) && (
              <Text
                style={Styles.viewAllTextStyle}>
                View all
              </Text>
            )}
          </View>
          {title == shareWith &&
            value == 'custom' &&
            this.getCustomFriendsView()}
        </View>
      </TouchableHighlight>
    );
  };

  getCustomFriendsView = () => {
    let names_array: any = [];
    this.props.whoCanSeeIds.forEach((element: any) => {
      names_array.push(
        element.field_first_name_value + ' ' + element.field_last_name_value,
      );
    });
    this.props.whoCanSeeGroups.forEach((element: any) => {
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
              <Text
                style={Styles.viewAllTextStyle}>
                View all
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  showViewAll = (title: any, value: any) => {
    switch (title) {
      case tags:
      case whoElse:
        if (value.length > 2) {
          return true;
        }
        break;
      default:
    }
    return false;
  };

  getText = (title: any, value: any) => {
    let textToReturn = '';
    switch (title) {
      case shareWith:
        textToReturn = ShareOptions[value];
        break;
      case tags:
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
        value;
    }
    return textToReturn;
  };

  tags = () => {
    this.setState({showMenu: false});
    if (Utility.isInternetConnected) {
      Actions.push('commonListCreateMemory', {
        tag: kTags,
        title: 'Memory Tags',
        showRecent: true,
        referenceList: this.props.tagsList,
        placeholder: 'Enter tags here...',
      });
    } else {
      No_Internet_Warning();
    }
  };

  whoELseWhereThere = () => {
    this.setState({showMenu: false});
    if (Utility.isInternetConnected) {
      Actions.push('commonListCreateMemory', {
        tag: kWhoElseWhereThere,
        title: 'Who else where there',
        showRecent: false,
        referenceList: this.props.whoElseWhereThereList,
        placeholder: 'Enter name of friends...',
      });
    } else {
      No_Internet_Warning();
    }
  };

  collection = () => {
    this.setState({showMenu: false});
    if (Utility.isInternetConnected) {
      Actions.push('collectionList');
    } else {
      No_Internet_Warning();
    }
  };

  whoCanSee = () => {
    this.setState({showMenu: false});
    if (Utility.isInternetConnected) {
      Actions.push('whoCanSee');
    } else {
      No_Internet_Warning();
    }
  };

  showHideMenu = () => {
    let showHide = !this.state.showMenu;
    this.setState({showMenu: showHide});
  };

  componentDidMount = () => {
    DefaultPreference.get('hide_tour').then((value: any) => {
      if (value == 'true') {
        this.setState({showGuideOverlay: false});
      } else {
        this.setState({showGuideOverlay: true});
      }
    });
  };
  componentWillUnmount = () => {
    if (this._confettiView) {
      this._confettiView.stopConfetti();
    }
    //  this.explosion.stop();
    this.setState({showMenu: false});
  };

  render() {
    return (
      <View style={Styles.fullFlex}>
        <SafeAreaView
          style={Styles.emptySafeAreaStyle}
        />
        <SafeAreaView style={Styles.SafeAreaViewContainerStyle}>
          <Confetti
            confettiCount={200}
            ref={(node: any) => (this._confettiView = node)}
            untilStopped={false}
          />
          {/* <ConfettiCannon
            count={200}
            origin={{x: -10, y: 0}}
            autoStart={false}
            ref={ref => (this.explosion = ref)}
        /> */}
          <View
            style={Styles.fullFlex}
            onStartShouldSetResponder={() => true}
            onResponderStart={() => this.setState({showMenu: false})}>
            <NavigationHeaderSafeArea
              heading={'Memory Draft'}
              showCommunity={true}
              cancelAction={() => this.cancelAction()}
              showRightText={true}
              rightText={'Publish'}
              saveValues={this.publishMemory}
              rightIcon={true}
              showHideMenu={() => this.showHideMenu()}
            />
            {/* <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>                    */}
            <StatusBar
              barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            <ScrollView style={Styles.imagebuttonStyle}>
              {this.commonListComponent(
                shareWith,
                this.props.shareOption,
                '',
                this.whoCanSee,
              )}
              <TextNew
                style={Styles.additionalTextStyle}>
                {'Additional Details (Optional)'}
              </TextNew>
              {this.commonListComponent(
                tags,
                this.props.tagsList,
                'Add Tags',
                this.tags,
              )}
              {this.commonListComponent(
                whoElse,
                this.props.whoElseWhereThereList,
                'Add people',
                this.whoELseWhereThere,
              )}
              {this.commonListComponent(
                addCollections,
                this.props.collections && this.props.collections.length > 0
                  ? this.props.collections
                  : '',
                'Select collection',
                this.collection,
              )}
            </ScrollView>
            {this.state.showMenu && (
              <View
                style={[Styles.renderLoaderStyle,{ top: 0 }]}
                onStartShouldSetResponder={() => true}
                onResponderStart={() => this.setState({showMenu: false})}>
                <View style={Styles.sideMenu}>
                  <TouchableOpacity
                    style={Styles.titleContainer}
                    onPress={() => this.props.preview()}>
                    <Text style={{fontSize: 16, color: '#000'}}>
                      Preview...
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={Styles.titleContainer}
                    onPress={() => this.props.delete()}>
                    <Text style={{fontSize: 16, color: Colors.NewRadColor}}>
                      Delete Draft...
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          {this.state.showGuideOverlay && (
            <Modal transparent>
              <SafeAreaView
                style={Styles.memoryDraftContainer}>
                <Animated.View
                  style={[Styles.animatedContainer,{ opacity: this.state.fadeIn }]}>
                  <View style={[Styles.fullFlex,Styles.fullWidth]}>
                    <View
                      style={[Styles.drawerContainer,{ right: -1025 + this.widthVal * 0.16 }]}></View>
                    <View style={Styles.arrowImageContainerStyle}>
                      <Image source={arrow7}></Image>
                    </View>
                    <View
                      style={[Styles.memoryPublishContainer,{ width: this.widthVal - 90 }]}>
                      <TextNew
                        style={Styles.guideTitleTextStyle}>
                        {'Memory Publish'}
                      </TextNew>
                      <TextNew
                        style={Styles.guideDescTextStyle}>
                        {
                          'Publish the Memory and share your story! and Your published Memory will appear at the top of your Recent feed'
                        }
                      </TextNew>
                      <View style={Styles.prevContainer}>
                        <TouchableHighlight
                          underlayColor={Colors.transparent}
                          style={Styles.memoryDraftIntroButnStyle}
                          onPress={() => {
                            this.setState({showGuideOverlay: false});
                            DefaultPreference.set('hide_tour', 'true').then(
                              function () {},
                            );
                          }}>
                          <View
                            style={Styles.doneBtnContainer}>
                            <TextNew
                              style={Styles.doneBtnTextStyle}>
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
          )}
        </SafeAreaView>
      </View>
    );
  }
}

const mapState = (state: {[x: string]: any}) => {
  return {
    shareOption: state.MemoryInitials.shareOption,
    tagsList: state.MemoryInitials.tags,
    whoElseWhereThereList: state.MemoryInitials.whoElseWhereThere,
    collections: state.MemoryInitials.collections,
    whoCanSeeIds: state.MemoryInitials.whoCanSeeMemoryUids,
    whoCanSeeGroups: state.MemoryInitials.whoCanSeeMemoryGroupIds,
  };
};

const mapDispatch = (dispatch: Function) => {
  return {};
};

export default connect(mapState, mapDispatch)(PublishMemoryDraft);

