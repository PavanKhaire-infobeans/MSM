import React from 'react';
import {
  ActivityIndicator,
  Alert, FlatList, Image, ImageBackground, Keyboard, Platform, RefreshControl, SafeAreaView, StatusBar, StyleSheet, TouchableHighlight, TouchableOpacity, View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import { styles } from '../../../common/component/multipleDropDownView/styles';
import Text from '../../../common/component/Text';
import {
  No_Internet_Warning, ToastMessage
} from '../../../common/component/Toast';
import {
  Colors, DraftActions, DraftType, fontFamily, fontSize,
  getValue
} from '../../../common/constants';
import EventManager from '../../../common/eventManager';
import { Account } from '../../../common/loginStore';
import Utility from '../../../common/utility';
import { collaborative, delete_comment, downImage, itemSelectedCheckMark, profile_placeholder, upImage } from '../../../images';
import {
  DeleteDraftService, kDeleteDraft
} from '../../createMemory/createMemoryWebService';
import { Border } from '../../memoryDetails/componentsMemoryDetails';
import { GetMemoryDrafts, kMemoryDraftsFetched } from '../myMemoriesWebService';
import { MemoryDraftsDataModel } from './memoryDraftsDataModel';

// import {CommonImageView} from '../../memoryDetails/index'

type State = {[x: string]: any};
type Props = {[x: string]: any};
var memoryDraftsArray: any[] = [];
var page: 0;
var loadingDataFromServer = true;
type menuOption = {
  key: number;
  title: any;
  onPress: (type: any, showLoader: boolean, isRefreshing: boolean) => void;
  color?: any;
};
export const kReloadDraft = 'reloadDraftlistener';
export default class MemoryDrafts extends React.Component<Props, State> {
  memoryDraftDetailsListener: EventManager;
  draftDetailsListener: EventManager;
  deleteDraftListener: EventManager;
  memoryDraftsDataModel: MemoryDraftsDataModel;
  refereshDraftList: EventManager;
  state = {
    draftType: DraftType.allDrafts,
    draftOptionsVisible: false,
    isRefreshing: false,
    loading: false,
  };

  /**Menu options for actions*/
  menuOptions: Array<menuOption> = [
    {key: 1, title: DraftType.allDrafts, onPress: this.draftOptionSelected},
    {
      key: 2,
      title: DraftType.myPersonalDrafts,
      onPress: this.draftOptionSelected,
    },
    {
      key: 3,
      title: DraftType.myCollaborationDrafts,
      onPress: this.draftOptionSelected,
    },
    {key: 4, title: DraftType.friendsDrafts, onPress: this.draftOptionSelected},
    {
      key: 5,
      title: DraftType.recentryDeleteDrafts,
      onPress: this.draftOptionSelected,
    },
  ];

  constructor(props: Props) {
    super(props);
    this.memoryDraftsDataModel = new MemoryDraftsDataModel();
    memoryDraftsArray = [];
    this.memoryDraftDetailsListener = EventManager.addListener(
      kMemoryDraftsFetched,
      this.memoryDraftDetails,
    );
    this.deleteDraftListener = EventManager.addListener(
      kDeleteDraft,
      this.deleteDraftCallback,
    );
    this.refereshDraftList = EventManager.addListener(
      kReloadDraft,
      this.onRefresh,
    );
    loadingDataFromServer = true;
    page = 0;
    // GetMemoryDrafts("mine","all", memoryDraftsArray.length)
  }

  componentDidMount() {
    if (Utility.isInternetConnected) {
      loaderHandler.showLoader();
      if (this.props.decodedDataFromURL) {
        this.draftOptionSelected(DraftType.myCollaborationDrafts, true, false);
      }
      else{
        GetMemoryDrafts('all', 'all', memoryDraftsArray.length);
      }
    } else {
      No_Internet_Warning();
    }
  }

  memoryDraftDetails = (fetched: boolean, memoryDraftDetails: any) => {
    loadingDataFromServer = false;
    loaderHandler.hideLoader();
    if (fetched) {
      if (this.state.isRefreshing) {
        memoryDraftsArray = [];
      }
      if (page == 0) {
        this.memoryDraftsDataModel.updateMemoryDraftDetails(
          memoryDraftDetails,
          true,
        );
      } else {
        this.memoryDraftsDataModel.updateMemoryDraftDetails(
          memoryDraftDetails,
          false,
        );
      }
      memoryDraftsArray = this.memoryDraftsDataModel.getMemoryDrafts();
      this.setState({memoryDetailAvailable: true});
    } else {
      if (page != 0) {
        page--;
      }
      if (memoryDraftsArray.length == 0) {
        ToastMessage(memoryDraftDetails, Colors.ErrorColor);
      }
    }
    this.setState({
      isRefreshing: false,
      loading: false,
    });
  };
  deleteDraft = (nid: any, isDeleting: boolean) => {
    if (isDeleting) {
      Alert.alert('Delete Draft?', `You wish to delete this Memory Draft ?`, [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: 'Yes',
          style: 'default',
          onPress: () => {
            this.hideMenu();
            if (Utility.isInternetConnected) {
              loaderHandler.showLoader('Deleting...');
              DeleteDraftService(nid, DraftActions.deleteDrafts, kDeleteDraft);
            } else {
              No_Internet_Warning();
            }
          },
        },
      ]);
    } else {
      Alert.alert(
        'Undelete Draft?',
        `Do you want to restore this Memory Draft?`,
        [
          {
            text: 'No',
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: 'Yes',
            style: 'default',
            onPress: () => {
              this.hideMenu();
              if (Utility.isInternetConnected) {
                loaderHandler.showLoader('Undeleting...');
                DeleteDraftService(
                  nid,
                  DraftActions.undeleteDrafts,
                  kDeleteDraft,
                );
              } else {
                No_Internet_Warning();
              }
            },
          },
        ],
      );
    }
  };
  draftOptionSelected(
    type: any,
    showLoader: boolean,
    isRefreshing: boolean,
    loadMore?: boolean,
  ) {
    this.hideMenu();
    if (this.state.draftType != type || isRefreshing || loadMore) {
      if (Utility.isInternetConnected) {
        loadingDataFromServer = true;
        this.setState({
          draftType: type,
        });
        if (showLoader) {
          loaderHandler.showLoader();
          memoryDraftsArray = [];
          this.setState({});
        }
        var length = memoryDraftsArray.length;
        if (isRefreshing) {
          length = 0;
        }
        switch (type) {
          case DraftType.allDrafts: {
            GetMemoryDrafts('all', 'all', length);
            break;
          }
          case DraftType.myCollaborationDrafts: {
            GetMemoryDrafts('mine', 'my_collaborative', length);
            break;
          }
          case DraftType.myPersonalDrafts: {
            GetMemoryDrafts('mine', 'my_personal', length);
            break;
          }
          case DraftType.friendsDrafts: {
            GetMemoryDrafts('friends', 'all', length);
            break;
          }
          case DraftType.recentryDeleteDrafts: {
            GetMemoryDrafts('deleted', 'all', length);
            break;
          }
        }
      } else {
        this.setState({
          isRefreshing: false,
          loading: false,
        });
        No_Internet_Warning();
      }
    }
  }
  showMenu = (showMenu?: boolean) => {
    this.setState({
      draftOptionsVisible: !this.state.draftOptionsVisible,
    });
  };
  hideMenu = () => {
    this.setState({
      draftOptionsVisible: false,
    });
  };
  onRefresh = () => {
    this.setState({
      isRefreshing: true,
    });
    page = 0;
    this.draftOptionSelected(this.state.draftType, false, true);
  };
  deleteDraftCallback = (success: any, response: any, nid: any) => {
    loaderHandler.hideLoader();
    if (success) {
      // Actions.pop();
      memoryDraftsArray = memoryDraftsArray.filter(
        (element: any) => element.nid != nid,
      );
      this.memoryDraftsDataModel.decreaseMemoryDraftCount();
      this.setState({});
    } else {
      ToastMessage('Unable to delete draft. Please try again later');
    }
  };
  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          backgroundColor: 'black',
        }}>
        <StatusBar
          barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
          backgroundColor={Colors.NewThemeColor}
        />
        <View style={style.draftOptionsView}>
          <TouchableOpacity
            style={{
              height: 50,
              paddingLeft: 16,
              paddingRight: 16,
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              flexDirection: 'row',
            }}
            onPress={() => {
              this.showMenu();
            }}>
            <Text
              style={{
                fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                fontSize: 16,
                fontWeight: '500',
                color: Colors.TextColor,
              }}>
              {this.state.draftType}{' '}
            </Text>
            {this.state.draftOptionsVisible ? (
              <Image source={upImage} />
            ) : (
              <Image source={downImage} />
            )}
          </TouchableOpacity>
        </View>

        <FlatList
          data={memoryDraftsArray}
          keyExtractor={(_, index: number) => `${index}`}
          onScroll={() => {
            Keyboard.dismiss();
          }}
          style={{width: '100%', backgroundColor: 'white'}}
          extraData={this.state}
          renderItem={(item: any) => this.renderDraftView(item)}
          maxToRenderPerBatch={50}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              colors={[
                Colors.NewThemeColor,
                Colors.NewThemeColor,
                Colors.NewThemeColor,
              ]}
              tintColor={Colors.NewThemeColor}
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter.bind(this)}
          onEndReachedThreshold={0.4}
          onEndReached={this.handleLoadMore.bind(this)}
        />
        {memoryDraftsArray.length == 0 && loadingDataFromServer == false ? (
          <View
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              alignSelf: 'center',
              top: 0,
              position: 'absolute',
            }}
            pointerEvents="none">
            <Text
              style={{...fontSize(18), color: '#909090', textAlign: 'center'}}>
              There are no drafts available to display at this moment.
            </Text>
          </View>
        ) : null}
        {this.state.draftOptionsVisible && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              height: '100%',
              width: '100%',
            }}
            onStartShouldSetResponder={() => true}
            onResponderStart={this.hideMenu}>
            <View style={style.sideMenu}>
              {this.menuOptions.map((data: any) => {
                return (
                  <TouchableOpacity
                    key={data.key}
                    style={{
                      height: 50,
                      justifyContent: 'space-between',
                      paddingLeft: 10,
                      paddingRight: 10,
                      flexDirection: 'row',
                    }}
                    onPress={() => {
                      page = 0;
                      this.draftOptionSelected(data.title, true, false);
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color:
                          this.state.draftType == data.title
                            ? '#DE8B00'
                            : Colors.TextColor,
                      }}>
                      {data.title}
                    </Text>
                    {this.state.draftType == data.title ? (
                      <Image source={itemSelectedCheckMark} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  getDraftDetails = (item: any) => {
    if (Utility.isInternetConnected) {
      loaderHandler.showLoader();
      Actions.push('createMemory', {editMode: true, draftNid: item.item.nid});
    } else {
      No_Internet_Warning();
    }
  };

  renderDraftView = (item: any) => {
    let file: any = {};
    file.url = getValue(item, ['item', 'image_path']);
    let files = [file];
    let title: any = getValue(item, ['item', 'title']);
    let journal_name: any = getValue(item, ['item', 'journal_name']);
    let collaborativeArray: any = getValue(item, ['item', 'collaborators']);
    return (
      <TouchableHighlight
        underlayColor={'#ffffff33'}
        onPress={
          () =>
            this.state.draftType != DraftType.recentryDeleteDrafts
              ? this.state.draftType == DraftType.friendsDrafts
                ? this.getDraftDetails(item)
                : this.getDraftDetails(item)
              : () => {}
          // this.deleteDraft(item.item.nid, false)
        }>
        <View style={{backgroundColor: Colors.NewThemeColor}}>
          <View style={{backgroundColor: 'white', marginTop: 7}}>
            <UserDetails item={item} />
            <CommonImageView file={file} files={files} />
            <Text
              style={{
                ...fontSize(30),
                color: Colors.NewTitleColor,
                fontWeight: '500',
                fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                marginLeft: 16,
                marginRight: 16,
                textAlign: 'left',
                marginBottom: 10,
              }}>
              {title}
            </Text>
            {journal_name && journal_name != '' ? (
              <Text
                style={{
                  ...fontSize(16),
                  fontFamily: 'Rubik',
                  color: Colors.TextColor,
                  marginLeft: 16,
                  marginBottom: 10,
                }}>
                {'In Collection '}
                <Text
                  style={{
                    color: Colors.NewTitleColor,
                    marginLeft: 0,
                    marginRight: 16,
                    marginBottom: 10,
                  }}>
                  {journal_name}
                </Text>
              </Text>
            ) : null}
            {collaborativeArray ? (
              collaborativeArray.length > 0 ? (
                <View style={{marginLeft: 16, marginBottom: 10}}>
                  <ImageBackground
                    source={collaborative}
                    style={{
                      width: 93,
                      height: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    resizeMode="contain">
                    <Text
                      style={{
                        textAlign: 'center',
                        ...fontSize(12),
                        color: 'white',
                      }}>
                      Collaborative
                    </Text>
                  </ImageBackground>
                </View>
              ) : null
            ) : null}

            <Border />
            {collaborativeArray != undefined && collaborativeArray != null ? (
              collaborativeArray.length > 0 ? (
                <View
                  style={{
                    marginLeft: 16,
                    marginRight: 16,
                    ...fontSize(17),
                    paddingTop: 10,
                  }}>
                  <Text style={{...fontSize(17), color: Colors.TextColor}}>
                    Last activity {item.item.activity}
                  </Text>
                  <Text
                    style={{
                      ...fontSize(17),
                      color: Colors.TextColor,
                      marginTop: 18,
                    }}>
                    {item.item.attachment_count} attachments{' '}
                    {item.item.new_attachment_count != undefined &&
                    item.item.new_attachment_count != null &&
                    item.item.new_attachment_count != '' ? (
                      <Text
                        style={{
                          fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                          fontWeight: '500',
                          color: Colors.TextColor,
                        }}>
                        ({item.item.new_attachment_count} new)
                      </Text>
                    ) : null}
                  </Text>
                  <Text style={{...fontSize(17), marginTop: 18}}>
                    {item.item.my_chat_count}{' '}
                    {item.item.my_chat_count == 1 ? 'message' : 'messages'}{' '}
                    {item.item.unread_chat_count != undefined &&
                    item.item.unread_chat_count != null &&
                    item.item.unread_chat_count != '' ? (
                      <Text
                        style={{
                          fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                          fontWeight: '500',
                          color: Colors.TextColor,
                        }}>
                        ({item.item.unread_chat_count} new)
                      </Text>
                    ) : null}
                  </Text>
                  <Text
                    style={{
                      ...fontSize(17),
                      marginTop: 18,
                      marginBottom: 18,
                      fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                      fontWeight: '500',
                      color: Colors.NewYellowColor,
                    }}>
                    {item.item.collaborators.length}{' '}
                    {item.item.collaborators.length == 1
                      ? 'collaborator'
                      : 'collaborators'}{' '}
                    {item.item.new_collaborator_count != undefined &&
                    item.item.new_collaborator_count != null &&
                    item.item.new_collaborator_count != '' ? (
                      <Text
                        style={{
                          fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                          fontWeight: '500',
                          color: Colors.TextColor,
                        }}>
                        ({item.item.new_collaborator_count} new)
                      </Text>
                    ) : null}
                  </Text>
                  <Border />
                </View>
              ) : null
            ) : null}
            <View
              style={{
                flex: 1,
                padding: 16,
                paddingTop: 11,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {this.state.draftType != DraftType.recentryDeleteDrafts ? (
                this.state.draftType == DraftType.friendsDrafts ? (
                  <TouchableOpacity
                    style={{alignSelf: 'center'}}
                    onPress={() => this.getDraftDetails(item)}>
                    <View
                      style={{
                        height: 32,
                        width: 126,
                        paddingRight: 10,
                        paddingLeft: 10,
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: Colors.BtnBgColor,
                        borderRadius: 32,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#fff',
                          ...fontSize(16),
                          borderRadius: 5,
                        }}>
                        {'Collaborate'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{alignSelf: 'center'}}
                    onPress={() => this.getDraftDetails(item)}>
                    <View
                      style={{
                        height: 32,
                        width: 126,
                        paddingRight: 10,
                        paddingLeft: 10,
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: Colors.BtnBgColor,
                        borderRadius: 32,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#fff',
                          ...fontSize(16),
                          borderRadius: 5,
                        }}>
                        {'Edit Draft'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              ) : (
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => this.deleteDraft(item.item.nid, false)}>
                  <View
                    style={{
                      height: 32,
                      width: 126,
                      paddingRight: 10,
                      paddingLeft: 10,
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: Colors.BtnBgColor,
                      borderRadius: 32,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#fff',
                        ...fontSize(16),
                        borderRadius: 5,
                      }}>
                      {'Undelete'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              {Account.selectedData().userID == item.item.uid &&
              this.state.draftType != DraftType.recentryDeleteDrafts ? (
                <TouchableOpacity
                  style={{alignSelf: 'center', padding: 16}}
                  onPress={() => this.deleteDraft(item.item.nid, true)}>
                  <Image
                    style={{
                      height: 25,
                      width: 22,
                      flex: 1,
                      resizeMode: 'stretch',
                    }}
                    source={delete_comment}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!this.state.loading) return null;
    return (
      <View style={{width: '100%', height: 50}}>
        <ActivityIndicator style={{color: '#000'}} />
      </View>
    );
  };
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };
  handleLoadMore = () => {
    let draftCount = this.memoryDraftsDataModel.getMemoryDraftsCount();
    if (memoryDraftsArray.length < draftCount) {
      if (!this.state.loading) {
        // increase page by 1
        this.setState({
          loading: true,
        });
        page++;
        this.draftOptionSelected(this.state.draftType, false, false, true);
      }
    }
  };
}
const UserDetails = (item: any) => {
  let createdOn: any = getValue(item, ['item', 'item', 'created']);
  // createdOn = Utility.timeDuration(createdOn, "M d, Y");

  let name: any = getValue(item, ['item', 'item', 'name']);
  let userProfileImage: any = getValue(item, [
    'item',
    'item',
    'userProfilePic',
  ]);
  return (
    <View
      style={{
        paddingTop: 15,
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/* <TouchableOpacity style={{paddingLeft: 15, paddingRight: 10}} onPress={()=>Actions.pop()}>
                        <Image source={black_arrow}/>
                    </TouchableOpacity> */}
        {
          <View
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              marginRight: 10,
              marginLeft: 16,
              overflow: 'hidden',
              borderColor: 'rgba(0,0,0,0.2)',
            }}>
            <ImageBackground
              style={[styles.avatar]}
              imageStyle={{borderRadius: 20}}
              source={profile_placeholder}>
              <Image
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  alignContent: 'center',
                }}
                source={
                  Account.selectedData().profileImage != ''
                    ? {uri: Account.selectedData().profileImage}
                    : profile_placeholder
                }
              />
            </ImageBackground>
          </View>
        }

        <View>
          <Text
            style={{
              ...fontSize(16),
              fontFamily: 'Rubik-italic',
              color: Colors.TextColor,
            }}>
            {'Created by '}
            <Text style={{color: Colors.NewYellowColor}}>{name}</Text>
          </Text>
          <Text
            style={{
              ...fontSize(16),
              fontFamily: 'Rubik-italic',
              color: Colors.TextColor,
            }}>
            {''}
            <Text>{createdOn}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};
const CommonImageView = (props: {file: any; files: any}) => {
  let currentIndex = props.files.indexOf(props.file);
  return (
    <View
      style={[
        {backgroundColor: Colors.ligh, marginBottom: 15, marginTop: 15},
        style.boxShadow,
      ]}>
      {/* <TouchableOpacity onPress={()=>Actions.push("imageViewer", {files : props.files, index : currentIndex})}> */}
      <View
        style={{
          backgroundColor: Colors.NewLightThemeColor,
          width: '100%',
          height: 185,
        }}>
        <Image
          source={{uri: props.file.url}}
          style={{
            height: '100%',
            width: '100%',
            resizeMode: 'contain',
            backgroundColor: 'transparent',
          }}
        />
      </View>
      {/* </TouchableOpacity> */}
      {/* <TitleAndDescription file={props.file} type={kImage}/> */}
    </View>
  );
};

const style = StyleSheet.create({
  boxShadow: {
    shadowOpacity: 1,
    elevation: 3,
    shadowColor: '#D9D9D9',
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 2},
  },
  draftOptionsView: {
    height: 50,
    width: '100%',
    backgroundColor: 'white',
  },
  sideMenu: {
    paddingTop: 15,
    paddingBottom: 15,
    top: 40,
    left: 10,
    backgroundColor: '#fff',
    minHeight: 50,
    width: 233,
    height: 252,
    position: 'absolute',
    borderRadius: 5,
    shadowOpacity: 1,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0, 0.5)',
    shadowColor: '#CACACA',
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 2},
  },
});
