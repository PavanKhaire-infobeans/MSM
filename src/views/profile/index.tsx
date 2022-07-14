import React, {Children} from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
} from 'react-native';
import BottomPicker, {
  ActionSheetItem,
} from '../../common/component/bottomPicker';
import EventManager from '../../common/eventManager';
import ImageCropPicker, {
  Image as PickerImage,
} from 'react-native-image-crop-picker';
import {
  UploadProfilePic,
  PhotoType,
  RemoveProfilePic,
} from './userProfileWebService';
import {
  edit_icon,
  icon_location,
  icon_mail,
  icon_telephone,
  default_cover_img,
  profile_placeholder,
  rubbish,
} from '../../images';
import {
  kGetUserProfileData,
  kSetUserProfileData,
  UserProfile,
} from './userProfileWebService';
import {ProfileDataModel} from './profileDataModel';
import {Actions} from 'react-native-router-flux';
import Utility from '../../common/utility';
import {getValue, NO_INTERNET, fontSize, fontFamily} from '../../common/constants';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import ActionSheet, {
  ActionSheetItem as ImageSelectionSheetItem,
} from '../../common/component/actionSheet';
import DeviceInfo from 'react-native-device-info';
import {action_camera, action_close, action_picture} from '../../images';
import {
  requestPermission,
  Colors,
  GenerateRandomID,
} from '../../common/constants';
import {ToastMessage, No_Internet_Warning} from '../../common/component/Toast';
import ActivityIndicatorView from '../../common/component/ActivityIndicatorView';
import NoInternetView from '../../common/component/NoInternetView';
import {Account} from '../../common/loginStore';
import Text from '../../common/component/Text';
import NavigationBar from '../dashboard/NavigationBar';
import {color} from 'react-native-reanimated';

type State = {
  [key: string]: any | string;
  error: {[x: string]: {error: boolean; message: string}};
  actionSheet: {
    type: 'none' | 'image' | 'audio';
    list: Array<ImageSelectionSheetItem>;
  };
  hasProfilePicLoaded: boolean;
  hasCoverPicLoaded: boolean;
};
export default class Profile extends React.Component<object> {
  bottomPicker: React.RefObject<BottomPicker> = React.createRef<BottomPicker>();
  showEditButtonOption: boolean = true;
  checkProfile: EventManager;
  // userProfileUpdated: EventManager;
  profileData: ProfileDataModel;
  _actionSheet: any | ActionSheet = null;

  state: State = {
    error: {},
    refreshing: false,
    selectionData: {
      actions: [],
      selectionValue: '',
      isMultiSelect: false,
      fieldName: '',
    },
    actionSheet: {
      type: 'none',
      list: [],
    },
    hasProfilePicLoaded: true,
    hasCoverPicLoaded: true,
  };

  constructor(props: object) {
    super(props);
    this.checkProfile = EventManager.addListener(
      kGetUserProfileData,
      this.getUserProfileDataCallBack,
    );
    // this.userProfileUpdated = EventManager.addListener(kUserAccountUpdated, this.userAccountChanged);
    this.profileData = new ProfileDataModel();
    if (
      Actions.currentScene == 'myAccount' ||
      Actions.currentScene == 'profile'
    ) {
      this.getUserProfileData();
    }
  }

  componentWillUnmount() {
    this.checkProfile.removeListener();
  }

  // userAccountChanged=()=>{
  //     this.profileData.allFormSections = [];
  //     this.profileData.basicInfoSection = { heading: "", fields: [] };
  //     this.profileData.contactInfoSection = { heading: "", fields: [] };
  //     this.setState({});
  //     this.getUserProfileData();
  // }
  // componentWillReceiveProps(){
  //     this.getUserProfileData()
  // }

  // Web-service call to fetch profile data
  getUserProfileData = () => {
    if (Utility.isInternetConnected) {
      loaderHandler.showLoader('Loading...');
      UserProfile();
    } else {
      No_Internet_Warning();
    }
  };

  // CallBack for Profile data web service
  getUserProfileDataCallBack = (success: boolean, profileDetails: any) => {
    //stop refresh control
    if (success) {
      this.profileData.updateValues(profileDetails);
      this.setState({refreshing: false});
    }
    loaderHandler.hideLoader();
    this.setState({refreshing: false});
  };

  editForMultipleValues = (section: any, basicInfo: boolean) => {
    if (section.fields && section.fields.length > 0) {
      if (basicInfo) {
        Actions.multipleValuesEdit({
          basicInfo: this.profileData.basicInfoSection,
          profilePicUri: this.profileData.basicInfo.profilePicUri,
          sectionHeading: section.heading,
          editableFields: section.fields,
        });
      } else {
        Actions.multipleValuesEdit({
          sectionHeading: section.heading,
          editableFields: section.fields,
        });
      }
    } else {
      ToastMessage('Information not available', Colors.ErrorColor);
    }
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getUserProfileData();
  };

  prepareFormSections() {
    let allSections = this.profileData.allFormSections;
    let allFormSections: Array<JSX.Element> = [];
    allFormSections = allSections.map(this.prepareCard);
    return allFormSections;
  }

  prepareCard = (
    {heading, fields}: {heading: string; fields: Array<any>},
    index: number,
  ) => {
    return (
      <Card
        key={`${index}`}
        showEdit={true}
        editButtonClicked={() =>
          this.editForMultipleValues({heading: heading, fields: fields}, false)
        }
        heading={heading}>
        <View style={{paddingLeft: 10, paddingRight: 7}}>
          {fields.map((field: any, index) => {
            let default_value: string = '';
            let type = field.type;
            if (
              type == 'options_select' ||
              type == 'options' ||
              type == 'options_buttons'
            ) {
              let valueArray: string[] = [];
              for (let key in field.default_value) {
                valueArray.push(field.default_value[key]);
              }
              default_value = valueArray.join(', ');
            } else if (type == 'text_textfield') {
              default_value = field.default_value;
            } else if (type == 'date_select') {
              if (getValue(field, ['granularity', 'todate']) != 'required') {
                default_value = Utility.dateAccordingToFormat(
                  field.default_value.value,
                  field.granularity.date_format,
                );
              } else {
                let value1 = Utility.dateAccordingToFormat(
                  field.default_value.value,
                  field.granularity.date_format,
                );
                let value2 = Utility.dateAccordingToFormat(
                  field.default_value.value2,
                  field.granularity.date_format,
                );
                default_value =
                  (value1 ? value1 : 'None') +
                  ' - ' +
                  (value2 ? value2 : 'None');
              }
            }
            if (
              default_value == null ||
              (typeof default_value == 'string' &&
                (default_value.trim().length == 0 ||
                  default_value.trim() == '-'))
            ) {
              default_value = 'None';
            }
            return (
              <TextViewWithHeading
                key={`${index}`}
                heading={field.label}
                value={default_value}
              />
            );
          })}
        </View>
      </Card>
    );
  };

  prepareBasicInfo = () => {
    let imageURL =
      getValue(this.profileData, ['basicInfo', 'profilePicUri']) || '';
    let profilePicURL =
      imageURL != '' ? Utility.getFileURLFromPublicURL(imageURL) : '';
    let covImageURL =
      getValue(this.profileData, ['basicInfo', 'coverPicUri']) || '';
    let coverImageURL =
      covImageURL != '' ? Utility.getFileURLFromPublicURL(covImageURL) : '';
    let isCoverImageAvailable = this.profileData.basicInfo.isCoverPicAvailable;
    let isProfieImageAvailable =
      this.profileData.basicInfo.isProfilePicAvailable;
    // this.props.updateName();
    return (
      <View
        style={{
          width: '100%',
          minHeight: 330,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <ImageBackground
          defaultSource={default_cover_img}
          source={
            isCoverImageAvailable ? {uri: coverImageURL} : default_cover_img
          }
          style={{resizeMode: 'stretch', width: '100%', height: 170}}>
          <View
            style={{
              width: '100%',
              height: 170,
              position: 'absolute',
              top: 0,
              backgroundColor: '#cccccc56',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={
                isCoverImageAvailable ? {uri: coverImageURL} : default_cover_img
              }
              style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                top: 0,
                resizeMode: isCoverImageAvailable ? 'cover' : 'stretch',
                backgroundColor: 'transparent',
              }}
              onLoad={() => this.setState({hasCoverPicLoaded: true})}
              onLoadStart={() => this.setState({hasCoverPicLoaded: false})}
            />
            {!this.state.hasCoverPicLoaded ? (
              <ActivityIndicatorView size="small" />
            ) : null}
          </View>
        </ImageBackground>
        <TouchableOpacity
          style={{
            borderRadius: 20,
            backgroundColor: '#fff',
            padding: 10,
            position: 'absolute',
            top: 10,
            right: 5,
          }}
          onPress={() => {
            this.setState(
              {
                actionSheet: {
                  ...this.state.actionSheet,
                  type: 'image',
                  list: this.getImagePickerActions(isCoverImageAvailable),
                },
              },
              () => {
                this._actionSheet && this._actionSheet.showSheet();
              },
            );
          }}>
          <Image source={edit_icon} />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            width: '100%',
            marginTop: 0,
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            paddingTop: 10,
            paddingRight: 5,
          }}>
          <TouchableOpacity
            style={cardStyles.buttonStyle}
            onPress={() => {
              this.editForMultipleValues(
                this.profileData.basicInfoSection,
                true,
              );
            }}>
            <Image source={edit_icon} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '80%',
            minHeight: 240,
            alignItems: 'center',
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              defaultSource={profile_placeholder}
              source={
                isProfieImageAvailable
                  ? {uri: profilePicURL}
                  : profile_placeholder
              }
              style={{width: 150, height: 150, borderRadius: 75}}
              onLoad={() => this.setState({hasProfilePicLoaded: true})}
              onLoadStart={() => this.setState({hasProfilePicLoaded: false})}
            />
            {!this.state.hasProfilePicLoaded ? (
              <ActivityIndicatorView size="small" />
            ) : null}
          </View>
          <Text
            style={{
              fontWeight: '500',
              fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
              marginTop: 7,
              ...fontSize(18),
              color: Colors.TextColor,
            }}>
            {' '}
            {this.profileData.basicInfo.first_name}{' '}
            {this.profileData.basicInfo.last_name}
          </Text>
          <Text
            style={{...fontSize(16), marginTop: 7, color: Colors.TextColor}}>
            {' '}
            Birthday:{' '}
            {this.profileData.basicInfo.birthday != undefined
              ? this.profileData.basicInfo.birthday.length > 0
                ? this.profileData.basicInfo.birthday
                : 'None'
              : 'None'}
          </Text>
          <Text style={{...fontSize(16), padding: 5, color: Colors.TextColor}}>
            {' '}
            Relationship Status:{' '}
            {this.profileData.basicInfo.relationship_status.length > 0
              ? this.profileData.basicInfo.relationship_status
              : 'None'}
          </Text>
        </View>
      </View>
    );
  };

  prepareContactInfo = () => {
    return (
      <Card
        showEdit={true}
        editButtonClicked={() => {
          Actions.multipleValuesEdit({
            sectionHeading: this.profileData.contactInfoSection.heading,
            editableFields: this.profileData.contactInfoSection.fields,
          });
        }}
        heading="Contact Info">
        <View style={{paddingLeft: 10, paddingRight: 7}}>
          <TextWithIcon
            iconUri={icon_location}
            items={[
              this.profileData.contactInfo.completeAddress.length > 0
                ? this.profileData.contactInfo.completeAddress
                : 'None',
            ]}
          />
          <TextWithIcon
            iconUri={icon_mail}
            items={[
              Account.selectedData().email,
              this.profileData.contactInfo.secondary_email_address.length > 0
                ? this.profileData.contactInfo.secondary_email_address
                : 'None',
            ]}
          />
          <TextWithIcon
            iconUri={icon_telephone}
            items={[
              this.profileData.contactInfo.phone.length > 0
                ? this.profileData.contactInfo.phone
                : 'None',
            ]}
          />
        </View>
      </Card>
    );
  };

  render() {
    const {width: deviceWidth} = Dimensions.get('window');
    //console.log(Utility.isInternetConnected);
    return (
      //showClose={true} hideNavBar={false} navBar={NavigationBar}
      <View style={{flex: 1}}>
        <SafeAreaView
          style={{
            width: '100%',
            flex: 0,
            backgroundColor: Colors.NewThemeColor,
          }}
        />
        <SafeAreaView style={{width: '100%', flex: 1, backgroundColor: '#fff'}}>
          <View style={{flex: 1, backgroundColor: Colors.NewThemeColor}}>
            <NavigationBar title={'My Profile'} showClose={true} />
            <StatusBar
              barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            {Utility.isInternetConnected ? (
              <ScrollView
                contentContainerStyle={{width: deviceWidth}}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }>
                {this.prepareBasicInfo()}
                {this.prepareContactInfo()}
                {this.prepareFormSections()}
              </ScrollView>
            ) : (
              <NoInternetView
                tryAgain={() => {
                  this.getUserProfileData();
                }}>
                {' '}
              </NoInternetView>
            )}

            <ActionSheet
              ref={ref => (this._actionSheet = ref)}
              width={DeviceInfo.isTablet() ? '65%' : '100%'}
              actions={this.state.actionSheet.list}
              onActionClick={this.onActionItemClicked.bind(this)}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  onActionItemClicked = (index: number): void => {
    if (this.state.actionSheet.type == 'image') {
      let options = {
        multiple: false,
        mediaType: 'photo',
        cropping: false,
        waitAnimationEnd: false,
        smartAlbums: ['UserLibrary', 'PhotoStream', 'Panoramas', 'Bursts'],
      };

      switch (index) {
        case 0:
          requestPermission('camera').then(success => {
            if (success) {
              ImageCropPicker.openCamera(options)
                .then((response: PickerImage | any[]) => {
                  var tempfilesArr: TempFile[] = [];
                  if (Array.isArray(response)) {
                    tempfilesArr = (response as Array<PickerImage>).map(obj => {
                      let path =
                        obj.path.indexOf('file://') != -1
                          ? obj.path
                          : 'file://' + obj.path;
                      let fid = GenerateRandomID();
                      return {
                        fid: fid,
                        filePath: path,
                        thumb_uri: path,
                        isLocal: true,
                        //type: `${FileType[FileType.image]}s`,
                        status: TempFileStatus.needsToUpload,
                      } as TempFile;
                    });
                  } else {
                    let path =
                      response.path.indexOf('file://') != -1
                        ? response.path
                        : 'file://' + response.path;
                    let fid = GenerateRandomID();
                    var tempfile: TempFile = {
                      fid: fid,
                      filePath: path,
                      thumb_uri: path,
                      isLocal: true,
                      type: '',
                      status: TempFileStatus.needsToUpload,
                    };

                    tempfilesArr = [tempfile];
                  }

                  //console.log(response, typeof response);
                  if (tempfilesArr.length > 0) {
                    let tempfile = tempfilesArr[0];
                    this.setState({
                      basicInfo: {
                        ...this.state.basicInfo,
                        coverPicUri: tempfile.filePath,
                      },
                    });
                    this.profileData.basicInfo.isCoverPicAvailable = true;
                    this.uploadImage(tempfile);
                  }
                })
                .catch(e => {});
            }
          });

          break;
        case 1:
          requestPermission('photo').then(success => {
            if (success) {
              ImageCropPicker.openPicker(options)
                .then((response: PickerImage) => {
                  //console.log(response, typeof response);
                  let path =
                    response.path.indexOf('file://') != -1
                      ? response.path
                      : 'file://' + response.path;
                  let fid = GenerateRandomID();
                  var tempfile: TempFile = {
                    fid: fid,
                    filePath: path,
                    thumb_uri: path,
                    isLocal: true,
                    type: '',
                    status: TempFileStatus.needsToUpload,
                  };
                  this.setState({
                    basicInfo: {
                      ...this.state.basicInfo,
                      coverPicUri: tempfile.filePath,
                    },
                  });
                  this.profileData.basicInfo.isCoverPicAvailable = true;
                  this.uploadImage(tempfile);

                  // this.saveTempFiles(tempfiles);
                  // this.props.setValue(false);
                })
                .catch(e => {});
            }
          });
          break;
        case this.state.actionSheet.list.length - 2:
          this.removeImage();
          break;
      }
    }
  };

  //Upload Image
  uploadImage = (imageFile: TempFile) => {
    loaderHandler.showLoader();
    UploadProfilePic(imageFile, PhotoType.cover)
      .then((response: any) => {
        loaderHandler.hideLoader();
        this.getUserProfileData();
        this.setState({hasCoverPicLoaded: true});
        this.profileData.basicInfo.isCoverPicAvailable = true;
      })
      .catch((error: any) => {
        loaderHandler.hideLoader();
        this.setState({hasCoverPicLoaded: true});
        this.profileData.basicInfo.isCoverPicAvailable = false;
      });
  };

  //remove image
  removeImage = () => {
    Alert.alert(
      '',
      `Are you sure? Your cover picture will be permanently deleted.`,
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
            loaderHandler.showLoader('Removing...');
            RemoveProfilePic(PhotoType.cover)
              .then((response: any) => {
                loaderHandler.hideLoader();
                //reload UI
                this.profileData.basicInfo.coverPicUri = '';
                this.profileData.basicInfo.isCoverPicAvailable = false;
                this.getUserProfileData();
                this.setState({});
              })
              .catch((error: any) => {
                ToastMessage(error.message, Colors.ErrorColor);
                loaderHandler.hideLoader();
              });
          },
        },
      ],
    );
  };

  getImagePickerActions(isImageAvailable: boolean) {
    //console.log("is image available:", isImageAvailable);
    return isImageAvailable ? AllImageActions : ImageActions;
  }
}
// const mapState = (state: any) => ({
//     account : state.account
// })

// export default connect(
// 	mapState
// )(Profile);

const FriendListView = (props: {
  heading: String;
  friendsList: Array<{uri: any; name: String; index?: any}>;
  viewFriendsList: () => void;
}) => {
  return (
    <View style={cardStyles.container}>
      <View style={cardStyles.headerComponent}>
        <Text
          style={{
            fontWeight: '500',
            fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
            ...fontSize(18),
          }}>
          {props.heading}
        </Text>
        <TouchableOpacity onPress={() => props.viewFriendsList}>
          <Text
            style={{
              fontWeight: '500',
              lineHeight: 20,
              ...fontSize(16),
              fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
              color: Colors.NewTitleColor,
              paddingRight: 10,
            }}>
            View all
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={props.friendsList}
        horizontal
        keyExtractor={(_, index: number) => `${index}`}
        showsHorizontalScrollIndicator={false}
        style={{flexDirection: 'row', marginTop: 15}}
        onScroll={() => {
          Keyboard.dismiss();
        }}
        renderItem={({item}) => (
          <View
            style={{
              flexDirection: 'column',
              marginRight: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={item.uri}
              style={{
                height: 50,
                borderRadius: 25,
                width: 50,
                overflow: 'hidden',
              }}
            />
            <Text
              style={{
                ...fontSize(16),
                marginTop: 10,
                width: 50,
                textAlign: 'center',
              }}>
              {' '}
              {item.name}{' '}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => item.index}
      />
    </View>
  );
};
const Card = (props: {
  showEdit: boolean;
  editButtonClicked: () => void;
  children?: JSX.Element;
  heading: string;
}) => {
  return (
    <View style={cardStyles.container}>
      <View style={cardStyles.headerComponent}>
        <Text
          style={{
            color: Colors.TextColor,
            fontWeight: '500',
            fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
            ...fontSize(18),
          }}>
          {props.heading}
        </Text>
        {props.showEdit ? (
          <TouchableOpacity
            style={cardStyles.buttonStyle}
            onPress={props.editButtonClicked}>
            <Image source={edit_icon} />
          </TouchableOpacity>
        ) : null}
      </View>
      {props.children}
    </View>
  );
};

const TextView = (props: {value: String}) => {
  return (
    <Text
      style={{
        ...fontSize(18),
        width: '100%',
        marginBottom: 10,
        marginRight: 10,
      }}>
      {props.value}
    </Text>
  );
};

const TextViewWithHeading = (props: {heading: String; value: String}) => {
  return (
    <View style={{marginBottom: 10, width: '100%'}}>
      <Text
        style={{
          ...fontSize(16),
          fontWeight: '500',
          color: Colors.TextColor,
          fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
        }}>
        {' '}
        {props.heading}{' '}
      </Text>
      <Text
        style={{
          ...fontSize(16),
          width: '100%',
          paddingLeft: 3,
          textAlign: 'justify',
          color: Colors.TextColor,
        }}
        multiLine={true}>
        {props.value}{' '}
      </Text>
    </View>
  );
};

const TextWithIcon = (props: {iconUri: any; items: Array<String>}) => {
  if (props.iconUri != null)
    return (
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 5,
          marginTop: 10,
          width: '100%',
        }}>
        <Image
          style={{height: 22, width: 22, resizeMode: 'contain'}}
          source={props.iconUri}
        />
        <View style={{flexDirection: 'column'}}>
          {props.items.map((itemInformation, index) => {
            return (
              <Text
                key={`${index}`}
                style={{
                  ...fontSize(16),
                  paddingLeft: 6,
                  paddingTop: 2,
                  paddingBottom: 5,
                  paddingRight: 5,
                  color: Colors.TextColor,
                }}>
                {itemInformation}
              </Text>
            );
          })}
        </View>
      </View>
    );
  return null;
};

const cardStyles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    marginTop: 15,
    paddingBottom: 15,
  },
  headerComponent: {
    width: '100%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 5,
  },
  buttonStyle: {borderRadius: 20, backgroundColor: '#fff', padding: 10},
});

export type TempFile = {
  fid: string;
  filePath: string;
  thumb_uri?: string;
  isLocal: boolean;
  type: string;
  status: TempFileStatus;
  filename?: string;
  time?: number;
};

enum TempFileStatus {
  needsToUpload = 'needsToUpload',
  deleted = 'deleted',
  uploaded = 'uploaded',
}

const AllImageActions: Array<ImageSelectionSheetItem> = [
  {index: 0, text: 'Capture from Camera', image: action_camera},
  {index: 1, text: 'Upload from Gallery', image: action_picture},
  {index: 2, text: 'Remove cover photo', isDestructive: 1, image: rubbish},
  {index: 3, text: 'Cancel', image: action_close},
];

const ImageActions: Array<ImageSelectionSheetItem> = [
  {index: 0, text: 'Capture from Camera', image: action_camera},
  {index: 1, text: 'Upload from Gallery', image: action_picture},
  {index: 2, text: 'Cancel', image: action_close},
];
