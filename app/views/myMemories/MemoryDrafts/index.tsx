import React from 'react';
import {
  ActivityIndicator, Alert, FlatList, Image, ImageBackground, Keyboard, RefreshControl, SafeAreaView, StatusBar,
  TouchableHighlight, TouchableWithoutFeedback, View
} from 'react-native';
import { DeleteDraftService, kDeleteDraft } from '../../../../src/views/createMemory/createMemoryWebService';
import { Border } from '../../memoryDetails/componentsMemoryDetails';
import { GetMemoryDrafts, kMemoryDraftsFetched } from '../myMemoriesWebService';
import loaderHandler from './../../../../src/common/component/busyindicator/LoaderHandler';
import Text from './../../../../src/common/component/Text';
import {
  No_Internet_Warning, ToastMessage
} from './../../../../src/common/component/Toast';
import {
  Colors, DraftActions, DraftType, getValue
} from './../../../../src/common/constants';
import EventManager from './../../../../src/common/eventManager';
import { Account } from './../../../../src/common/loginStore';
import Utility from './../../../../src/common/utility';
import { collaborative, delete_comment, downImage, itemSelectedCheckMark, profile_placeholder, upImage } from './../../../../src/images';
import { MemoryDraftsDataModel } from './memoryDraftsDataModel';
import Styles from './styles';
import styles from './styles';

type State = { [x: string]: any };
type Props = { [x: string]: any };
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
  refereshDraftList: EventManager;
  memoryDraftsDataModel: MemoryDraftsDataModel;
  state = {
    draftType: DraftType.allDrafts,
    draftOptionsVisible: false,
    isRefreshing: false,
    loading: false,
  };

  /**Menu options for actions*/
  menuOptions: Array<menuOption> = [
    { key: 1, title: DraftType.allDrafts, onPress: this.draftOptionSelected },
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
    { key: 4, title: DraftType.friendsDrafts, onPress: this.draftOptionSelected },
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
      //loaderHandler.showLoader();
      if (this.props.decodedDataFromURL) {
        this.draftOptionSelected(DraftType.myCollaborationDrafts, true, false);
      }
      else {
        GetMemoryDrafts('all', 'all', memoryDraftsArray.length,
        response =>{
          if (response.ResponseCode == 200) {
            this.memoryDraftDetails(true, response['Data'])
          } else {
            this.memoryDraftDetails(false, response['ResponseMessage'])
          }

        });
      }
    } else {
      No_Internet_Warning();
    }
  }

  componentWillUnmount = () => {
    this.memoryDraftDetailsListener.removeListener();
    this.draftDetailsListener.removeListener();
    this.deleteDraftListener.removeListener();
    this.refereshDraftList.removeListener();
  }

  memoryDraftDetails = (fetched: boolean, memoryDraftDetails: any) => {
    loadingDataFromServer = false;
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
      this.setState({ memoryDetailAvailable: true });
    } else {
      if (page != 0) {
        page--;
      }
      if (memoryDraftsArray.length == 0) {
       //ToastMessage(memoryDraftDetails, Colors.ErrorColor);
      }
    }
    this.setState({
      isRefreshing: false,
      loading: false,
    },()=>{
      // //loaderHandler.hideLoader()
    });
  };

  deleteDraft = (nid: any, isDeleting: boolean) => {
    if (isDeleting) {
      Alert.alert('Delete Draft?', `You wish to delete this Memory Draft ?`, [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => { },
        },
        {
          text: 'Yes',
          style: 'default',
          onPress: () => {
            this.hideMenu();
            if (Utility.isInternetConnected) {
              //loaderHandler.showLoader('Deleting...');
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
            onPress: () => { },
          },
          {
            text: 'Yes',
            style: 'default',
            onPress: () => {
              this.hideMenu();
              if (Utility.isInternetConnected) {
                //loaderHandler.showLoader('Undeleting...');
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
        }, () => {
          if (showLoader) {
            //loaderHandler.showLoader();
            memoryDraftsArray = [];
            // this.setState({});
          }
          var length = memoryDraftsArray.length;
          if (isRefreshing) {
            length = 0;
          }
          switch (type) {
            case DraftType.allDrafts: {
              GetMemoryDrafts('all', 'all', length,
              response =>{
                if (response.ResponseCode == 200) {
                  this.memoryDraftDetails(true, response['Data'])
                } else {
                  this.memoryDraftDetails(false, response['ResponseMessage'])
                }
      
              });
              break;
            }
            case DraftType.myCollaborationDrafts: {
              GetMemoryDrafts('mine', 'my_collaborative', length,
              response =>{
                if (response.ResponseCode == 200) {
                  this.memoryDraftDetails(true, response['Data'])
                } else {
                  this.memoryDraftDetails(false, response['ResponseMessage'])
                }
      
              });
              break;
            }
            case DraftType.myPersonalDrafts: {
              GetMemoryDrafts('mine', 'my_personal', length,
              response =>{
                if (response.ResponseCode == 200) {
                  this.memoryDraftDetails(true, response['Data'])
                } else {
                  this.memoryDraftDetails(false, response['ResponseMessage'])
                }
      
              });
              break;
            }
            case DraftType.friendsDrafts: {
              GetMemoryDrafts('friends', 'all', length,
              response =>{
                if (response.ResponseCode == 200) {
                  this.memoryDraftDetails(true, response['Data'])
                } else {
                  this.memoryDraftDetails(false, response['ResponseMessage'])
                }
      
              });
              break;
            }
            case DraftType.recentryDeleteDrafts: {
              GetMemoryDrafts('deleted', 'all', length,
              response =>{
                if (response.ResponseCode == 200) {
                  this.memoryDraftDetails(true, response['Data'])
                } else {
                  this.memoryDraftDetails(false, response['ResponseMessage'])
                }
      
              });
              break;
            }
          }
        });

      } else {
        this.setState({
          isRefreshing: false,
          loading: false,
        }, () => No_Internet_Warning());

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
    },()=>{
      page = 0;
      this.draftOptionSelected(this.state.draftType, false, true);
    });
    
  };

  deleteDraftCallback = (success: any, response: any, nid: any) => {
    //loaderHandler.hideLoader();
    if (success) {
      // this.props.navigation.goBack();
      memoryDraftsArray = memoryDraftsArray.filter(
        (element: any) => element.nid != nid,
      );
      this.memoryDraftsDataModel.decreaseMemoryDraftCount();
      // this.setState({});
    } else {
     //ToastMessage('Unable to delete draft. Please try again later');
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar
          barStyle={Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
          backgroundColor={Colors.NewThemeColor}
        />
        <View style={styles.draftOptionsView}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.showMenu();
            }}>
            <View style={styles.draftOptionsViewSubContainer}>
              <Text style={styles.draftTypeTextStyle}>
                {this.state.draftType}{' '}
              </Text>
              {this.state.draftOptionsVisible ? (
                <Image source={upImage} />
              ) : (
                <Image source={downImage} />
              )}
            </View>

          </TouchableWithoutFeedback>
        </View>

        <FlatList
          data={memoryDraftsArray}
          keyExtractor={(_, index: number) => `${index}`}
          onScroll={() => {
            Keyboard.dismiss();
          }}
          style={styles.flatlistCOntainerSTyle}
          extraData={this.state}
          renderItem={this.renderDraftView}
          // maxToRenderPerBatch={50}
          initialNumToRender={10}
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
              onRefresh={()=>this.onRefresh()}
            />
          }
          // keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={()=>this.renderSeparator()}
          ListFooterComponent={()=>this.renderFooter()}
          onEndReachedThreshold={0.4}
          onEndReached={()=>this.handleLoadMore()}
        />
        {memoryDraftsArray.length == 0 && loadingDataFromServer == false ? (
          <View style={styles.memoryDraftsArrayStyle} pointerEvents="none">
            <Text style={styles.noDraftTextStyle}>
              There are no drafts available to display at this moment.
            </Text>
          </View>
        ) : null}
        {this.state.draftOptionsVisible && (
          <View
            style={styles.draftOptionsVisibleContainer}
            onStartShouldSetResponder={() => true}
            onResponderStart={this.hideMenu}>
            <View style={styles.sideMenu}>
              {this.menuOptions.map((data: any) => {
                return (
                  <TouchableWithoutFeedback
                    key={data.key}
                    onPress={() => {
                      page = 0;
                      this.draftOptionSelected(data.title, true, false);
                    }}>
                    <View style={styles.draftOptionSelectedTouchableStyle}>
                      <Text
                        style={[styles.draftTitleTextStyle, {
                          color: this.state.draftType == data.title ? Colors.newTextColor : Colors.newTextColor,
                        }]}>
                        {data.title}
                      </Text>
                      {this.state.draftType == data.title ? (
                        <Image source={itemSelectedCheckMark} />
                      ) : null}
                    </View>
                  </TouchableWithoutFeedback>
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
      //loaderHandler.showLoader();
      this.props.navigation.navigate('createMemory', { editMode: true, draftNid: item.item.nid });
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
              : () => { }
          // this.deleteDraft(item.item.nid, false)
        }>
        <View style={styles.renderDraftViewContainer}>
          <View style={styles.renderDraftViewSubContainer}>
            <UserDetails item={item} />
            <CommonImageView file={file} files={files} />
            <Text style={styles.titleTextStyle}>{title}</Text>
            {journal_name && journal_name != '' ? (
              <Text style={styles.inCollectionTextStyle}>
                {'In Collection '}
                <Text style={styles.journal_nameStyle}>{journal_name}</Text>
              </Text>
            ) : null}
            {collaborativeArray ? (
              collaborativeArray.length > 0 ? (
                <View style={styles.collaborativeContainer}>
                  <ImageBackground
                    source={collaborative}
                    style={styles.collaborativeImagestyle}
                    resizeMode="contain">
                    <Text style={styles.CollaborativeTextStyle}>
                      Collaborative
                    </Text>
                  </ImageBackground>
                </View>
              ) : null
            ) : null}

            <Border />
            {collaborativeArray != undefined && collaborativeArray != null ? (
              collaborativeArray.length > 0 ? (
                <View style={styles.collaborativeArrayContainer}>
                  <Text style={styles.lastActivityTextStyle}>
                    Last activity {item.item.activity}
                  </Text>
                  <Text
                    style={[styles.lastActivityTextStyle, {
                      marginTop: 18,
                    }]}>
                    {item.item.attachment_count} attachments{' '}
                    {item.item.new_attachment_count != undefined &&
                    item.item.new_attachment_count != null &&
                    item.item.new_attachment_count != '' ? (
                      <Text style={styles.attachmentCountTextStyle}>
                        ({item.item.new_attachment_count} new)
                      </Text>
                    ) : null}
                  </Text>
                  <Text style={[styles.lastActivityTextStyle, {
                    marginTop: 18,
                  }]}>
                    {item.item.my_chat_count}{' '}
                    {item.item.my_chat_count == 1 ? 'message' : 'messages'}{' '}
                    {item.item.unread_chat_count != undefined &&
                      item.item.unread_chat_count != null &&
                      item.item.unread_chat_count != '' ? (
                      <Text
                        style={styles.attachmentCountTextStyle}>
                        ({item.item.unread_chat_count} new)
                      </Text>
                    ) : null}
                  </Text>
                  <Text style={styles.new_collaborator_countTextStyle}>
                    {item.item.collaborators.length}{' '}
                    {item.item.collaborators.length == 1
                      ? 'collaborator'
                      : 'collaborators'}{' '}
                    {item.item.new_collaborator_count != undefined &&
                    item.item.new_collaborator_count != null &&
                    item.item.new_collaborator_count != '' ? (
                      <Text style={styles.lastActivityTextStyle}>
                        ({item.item.new_collaborator_count} new)
                      </Text>
                    ) : null}
                  </Text>
                  <Border />
                </View>
              ) : null
            ) : null}

            <View style={styles.collaborateMainContainer}>
              {this.state.draftType != DraftType.recentryDeleteDrafts ? (
                this.state.draftType == DraftType.friendsDrafts ? (
                  <TouchableWithoutFeedback
                    onPress={() => this.getDraftDetails(item)}>
                    <View style={styles.alignSelfCenter}>
                      <View style={styles.CollaborateContainer}>
                        <Text style={styles.CollaborateTextStyle}>
                          {'Collaborate'}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                ) : (
                  <TouchableWithoutFeedback
                    onPress={() => this.getDraftDetails(item)}>
                    <View style={styles.alignSelfCenter}>
                      <View style={styles.CollaborateContainer}>
                        <Text style={styles.CollaborateTextStyle}>
                          {'Edit Draft'}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                )
              ) : (
                <TouchableWithoutFeedback
                  onPress={() => this.deleteDraft(item.item.nid, false)}>
                  <View style={styles.alignSelfCenter}>
                    <View style={styles.CollaborateContainer}>
                      <Text style={styles.CollaborateTextStyle}>
                        {'Undelete'}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
              {Account.selectedData().userID == item.item.uid &&
                this.state.draftType != DraftType.recentryDeleteDrafts ? (
                <TouchableWithoutFeedback
                  style={[styles.alignSelfCenter, styles.deleteImageContainerStyle]}
                  onPress={() => this.deleteDraft(item.item.nid, true)}>
                  <Image
                    style={styles.deleteImageStyle}
                    source={delete_comment}
                  />
                </TouchableWithoutFeedback>
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
      <View style={styles.footerContainer}>
        <ActivityIndicator color={Colors.black} />
      </View>
    );
  };

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  handleLoadMore = () => {
    let draftCount = this.memoryDraftsDataModel.getMemoryDraftsCount();
    if (memoryDraftsArray.length < draftCount) {
      if (!this.state.loading) {
        // increase page by 1
        this.setState({
          loading: true,
        },()=>{
          page++;
          this.draftOptionSelected(this.state.draftType, false, false, true);
        });
        
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
    <View style={styles.userDetailsContainer}>
      <View style={styles.userDetailsSubContainer}>
        {
          <View style={styles.imagebackgroundContainer}>
            <ImageBackground
              style={Styles.avatar}
              imageStyle={styles.ImageBackgroundStyle}
              source={profile_placeholder}>
              <Image
                style={styles.userImageStyle}
                source={
                  Account.selectedData().profileImage != ''
                    ? { uri: Account.selectedData().profileImage }
                    : profile_placeholder
                }
              />
            </ImageBackground>
          </View>
        }

        <View>
          <Text style={styles.nameTextStyle}>
            {'Created by '}
            <Text style={styles.createdbyNameTextStyle}>{name}</Text>
          </Text>
          <Text style={styles.nameTextStyle}>
            {''}
            <Text>{createdOn}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const CommonImageView = (props: { file: any; files: any }) => {
  let currentIndex = props.files.indexOf(props.file);
  return (
    <View style={[styles.commonImageContainer, styles.boxShadow]}>
      {/* <TouchableOpacity onPress={()=>this.props.navigation.navigate("imageViewer", {files : props.files, index : currentIndex})}> */}
      <View style={styles.commonImageContainerSub}>
        <Image source={{uri: props.file.url}} style={styles.fileImageStyle} />
      </View>
      {/* </TouchableOpacity> */}
      {/* <TitleAndDescription file={props.file} type={kImage}/> */}
    </View>
  );
};
