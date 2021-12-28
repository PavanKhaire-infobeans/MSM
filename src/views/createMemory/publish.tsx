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
  StyleSheet,
  Alert,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import React from 'react';
import {Actions} from 'react-native-router-flux';
// @ts-ignore
import {KeyboardAwareScrollView} from '../../common/component/keyboardaware-scrollview';
import {
  Colors,
  fontSize,
  getValue,
  ShareOptions,
  NO_INTERNET,
} from '../../common/constants';
import NavigationThemeBar from '../../common/component/navigationBarForEdit/navigationBarWithTheme';
import {
  pdf_icon,
  add_icon_small,
  edit_icon,
  close_guide_tour,
  arrow7,
} from '../../images';
import {connect} from 'react-redux';
import TextNew from '../../common/component/Text';
import whoCanSee from './whoCanSee';
import {kPublish} from '.';
import {getUserCount} from './dataHelper';
import Utility from '../../common/utility';
import {ToastMessage, No_Internet_Warning} from '../../common/component/Toast';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import DefaultPreference from 'react-native-default-preference';
import Confetti from 'react-native-confetti';
import ConfettiCannon from 'react-native-confetti-cannon';
import EventManager from '../../common/eventManager';

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
        style={{marginBottom: 30}}
        onPress={() => onPressCallback()}
        underlayColor="#ffffff33">
        <View>
          <TextNew
            style={{
              ...fontSize(18),
              fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
            }}>
            {title}
          </TextNew>
          <View
            style={{
              borderBottomColor: 'rgba(0,0,0,0.2)',
              paddingTop: 10,
              paddingBottom: 7,
              borderBottomWidth: 0.5,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextNew
                style={{
                  flex: 1,
                  ...fontSize(18),
                  color: value.length > 0 ? '#000' : '#A3A3A3',
                }}>
                {value.length > 0 ? this.getText(title, value) : placeholder}
              </TextNew>
              <Image
                style={{width: 20, height: 20}}
                resizeMode={'contain'}
                source={value.length > 0 ? edit_icon : add_icon_small}></Image>
            </View>
            {this.showViewAll(title, value) && (
              <Text
                style={{
                  width: '100%',
                  textAlign: 'left',
                  paddingTop: 10,
                  color: Colors.ThemeColor,
                  ...fontSize(16),
                }}>
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
          <View style={{width: '100%', paddingTop: 10}}>
            <TextNew style={{...fontSize(16), color: '#000'}}>
              {splicedArray}
              {names_array.length > 2
                ? ' (+' + (names_array.length - 2) + ' more)'
                : ''}
            </TextNew>
            {names_array.length > 2 && (
              <Text
                style={{
                  width: '100%',
                  textAlign: 'left',
                  paddingTop: 10,
                  color: Colors.ThemeColor,
                  ...fontSize(16),
                }}>
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
      <View style={{flex: 1}}>
        <SafeAreaView
          style={{
            width: '100%',
            flex: 0,
            backgroundColor: Colors.NewThemeColor,
          }}
        />
        <SafeAreaView style={{width: '100%', flex: 1, backgroundColor: '#fff'}}>
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
            style={{flex: 1}}
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
              barStyle={'dark-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            <ScrollView style={{padding: 15}}>
              {this.commonListComponent(
                shareWith,
                this.props.shareOption,
                '',
                this.whoCanSee,
              )}
              <TextNew
                style={{
                  ...fontSize(18),
                  fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                  marginBottom: 30,
                }}>
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
                style={{
                  position: 'absolute',
                  top: 0,
                  height: '100%',
                  width: '100%',
                }}
                onStartShouldSetResponder={() => true}
                onResponderStart={() => this.setState({showMenu: false})}>
                <View style={style.sideMenu}>
                  <TouchableOpacity
                    style={{
                      height: 45,
                      justifyContent: 'center',
                      paddingLeft: 10,
                    }}
                    onPress={() => this.props.preview()}>
                    <Text style={{fontSize: 16, color: '#000'}}>
                      Preview...
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      height: 45,
                      justifyContent: 'center',
                      paddingLeft: 10,
                    }}
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
                style={{width: '100%', height: '100%', overflow: 'hidden'}}>
                <Animated.View
                  style={{
                    opacity: this.state.fadeIn,
                    flex: 1,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 0,
                  }}>
                  <View style={{flex: 1, width: '100%'}}>
                    <View
                      style={{
                        borderRadius: 1500,
                        position: 'absolute',
                        right: -1025 + this.widthVal * 0.16,
                        top: -995,
                        width: 2080,
                        height: 2080,
                        backgroundColor: 'transparent',
                        borderWidth: 1000,
                        borderColor: 'rgba(0, 0, 0, 0.7)',
                      }}></View>
                    <View style={{position: 'absolute', top: 80, left: 230}}>
                      <Image source={arrow7}></Image>
                    </View>
                    <View
                      style={{
                        position: 'absolute',
                        width: this.widthVal - 90,
                        top: 150,
                        left: 90,
                      }}>
                      <TextNew
                        style={{
                          ...fontSize(24),
                          color: 'white',
                          fontWeight: '500',
                        }}>
                        {'Memory Publish'}
                      </TextNew>
                      <TextNew
                        style={{
                          ...fontSize(20),
                          color: 'white',
                          fontWeight: '400',
                          marginTop: 5,
                        }}>
                        {
                          'Publish the Memory and share your story! and Your published Memory will appear at the top of your Recent feed'
                        }
                      </TextNew>
                      <View style={{flexDirection: 'row', marginTop: 5}}>
                        <TouchableHighlight
                          underlayColor={'transparent'}
                          style={{paddingVertical: 20}}
                          onPress={() => {
                            this.setState({showGuideOverlay: false});
                            DefaultPreference.set('hide_tour', 'true').then(
                              function () {},
                            );
                          }}>
                          <View
                            style={{
                              backgroundColor: Colors.NewYellowColor,
                              width: 80,
                              paddingVertical: 10,
                              borderRadius: 5,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <TextNew
                              style={{
                                ...fontSize(18),
                                color: 'white',
                                fontWeight: '500',
                              }}>
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

const style = StyleSheet.create({
  sideMenu: {
    right: 10,
    backgroundColor: '#fff',
    minHeight: 50,
    width: 180,
    position: 'absolute',
    borderRadius: 5,
    shadowOpacity: 1,
    elevation: 2,
    shadowColor: '#CACACA',
    shadowRadius: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {width: 0, height: 2},
  },
});
