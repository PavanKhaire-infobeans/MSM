import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import ImageCropPicker, {
  Image as PickerImage,
  Options,
} from 'react-native-image-crop-picker';
import { connect } from 'react-redux';
import ActionSheet, {
  ActionSheetItem as ImageSelectionSheetItem,
} from '../../common/component/actionSheet';
import ActivityIndicatorView from '../../common/component/ActivityIndicatorView';
import BusyIndicator from '../../common/component/busyindicator';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import NoInternetView from '../../common/component/NoInternetView';
import Text from '../../common/component/Text';
import {No_Internet_Warning, ToastMessage} from '../../common/component/Toast';
import {
  Colors,
  GenerateRandomID,
  getValue,
  requestPermission,
} from '../../common/constants';
import EventManager from '../../common/eventManager';
import {Account} from '../../common/loginStore';
import Utility from '../../common/utility';
import {
  action_camera,
  action_close,
  action_picture,
  default_cover_img,
  edit_icon,
  icon_location,
  icon_mail,
  icon_telephone,
  profile_placeholder,
  rubbish,
} from '../../images';
import { SHOW_LOADER_READ, SHOW_LOADER_TEXT } from '../dashboard/dashboardReducer';
import NavigationBar from '../dashboard/NavigationBar';
import { GetUserData } from '../myAccount/reducer';
import useUserProfileData from './profileDataModel';
import Styles from './styles';
import {
  kGetUserProfileData,
  PhotoType,
  RemoveProfilePic,
  UploadProfilePic,
  UserProfile,
} from './userProfileWebService';

const {width: deviceWidth} = Dimensions.get('window');

const options: Options = {
  multiple: false,
  mediaType: 'photo',
  cropping: false,
  waitAnimationEnd: false,
  smartAlbums: ['UserLibrary', 'PhotoStream', 'Panoramas', 'Bursts'],
};

const Profile = props => {
  const _actionSheet = useRef(null);

  const [refreshing, setRefreshing] = useState(false);

  const [actionSheet, setActionSheet] = useState({
    type: 'none',
    list: [],
  });
  const [hasProfilePicLoaded, setHasProfilePicLoaded] = useState(true);
  const [hasCoverPicLoaded, setHasCoverPicLoaded] = useState(true);

  const [userProfileDetails, setUserProfileDetails] = useState({});

  const {
    basicInfo,
    basicInfoSection,
    contactInfo,
    contactInfoSection,
    allFormSections,
    userProfilePicInfo,
    userCoverPicInfo,
    setAllFormSections,
  } = useUserProfileData(userProfileDetails);

  useEffect(() => {
    const checkProfile = EventManager.addListener(
      kGetUserProfileData,
      getUserProfileDataCallBack,
    );
      getUserProfileData();

    return () => {
      checkProfile.removeListener();
    };
  }, []);

  // Web-service call to fetch profile data
  const getUserProfileData = () => {
    setAllFormSections([]);
    if (Utility.isInternetConnected) {
      //loaderHandler.showLoader('Loading...');
      props.showLoader(true);
      props.loaderText('Loading...');
      UserProfile();
    } else {
      No_Internet_Warning();
    }
  };

  // CallBack for Profile data web service
  const getUserProfileDataCallBack = (
    success: boolean,
    profileDetails: any,
  ) => {
    //stop refresh control
    if (success) {
      setUserProfileDetails(profileDetails);
      setRefreshing(false);
    }
    //loaderHandler.hideLoader();
    props.showLoader(false);
    props.loaderText('Loading...');
    setRefreshing(false);
  };

  const editForMultipleValues = (section: any, basicInfo: any) => {
    if (section.fields && section.fields.length > 0) {
      if (basicInfo) {
        props.navigation.navigate('multipleValuesEdit', {
          basicInfo,
          profilePicUri: basicInfo?.profilePicUri,
          sectionHeading: section.heading,
          editableFields: section.fields,
        });
      } else {
        props.navigation.navigate('multipleValuesEdit', {
          sectionHeading: section.heading,
          editableFields: section.fields,
        });
      }
    } else {
     //ToastMessage('Information not available', Colors.ErrorColor);
    }
  };

  const _onRefresh = () => {
    setAllFormSections([]);
    setRefreshing(true);
    getUserProfileData();
  };

  const prepareFormSections = () => {
    let allSections = [...allFormSections];
    return allSections.map(prepareCard);
  };

  const prepareCard = (
    {heading, fields}: {heading: string; fields: Array<any>},
    index: number,
  ) => {
    return (
      <Card
        key={`${index}`}
        showEdit={true}
        editButtonClicked={() =>
          editForMultipleValues({heading: heading, fields: fields}, false)
        }
        heading={heading}>
        <View style={Styles.cardContainer}>
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

  const prepareBasicInfo = () => {
    let imageURL = userProfilePicInfo?.profilePicUri ?? '';
    let profilePicURL =
      imageURL != '' ? Utility.getFileURLFromPublicURL(imageURL) : '';
    let covImageURL = userCoverPicInfo?.coverPicUri ?? '';
    let coverImageURL =
      covImageURL != '' ? Utility.getFileURLFromPublicURL(covImageURL) : '';
    let isCoverImageAvailable = userCoverPicInfo.isCoverPicAvailable;
    let isProfieImageAvailable = userProfilePicInfo.isProfilePicAvailable;
    return (
      <View style={Styles.prepareBasicInfoContainer}>
        <ImageBackground
          defaultSource={default_cover_img}
          source={
            isCoverImageAvailable ? {uri: coverImageURL} : default_cover_img
          }
          resizeMode="stretch"
          style={Styles.ImageBackgroundStyle}>
          <View style={Styles.imageCoontainer}>
            <Image
              source={
                isCoverImageAvailable ? {uri: coverImageURL} : default_cover_img
              }
              style={[
                Styles.imageSTyle,
                {
                  resizeMode: isCoverImageAvailable ? 'cover' : 'stretch',
                },
              ]}
              onLoad={() => setHasCoverPicLoaded(true)}
              onLoadStart={() => setHasCoverPicLoaded(false)}
            />
            {!hasCoverPicLoaded ? <ActivityIndicatorView size="small" /> : null}
          </View>
        </ImageBackground>
        <TouchableOpacity
          style={Styles.editButtonStyle}
          onPress={() => {
            setActionSheet({
              ...actionSheet,
              type: 'image',
              list: getImagePickerActions(isCoverImageAvailable),
            });
            _actionSheet?.current?.showSheet();
          }}>
          <Image source={edit_icon} />
        </TouchableOpacity>
        <View style={Styles.editButtonContainer}>
          <TouchableOpacity
            style={cardStyles.buttonStyle}
            onPress={() => {
              editForMultipleValues(basicInfoSection, true);
            }}>
            <Image source={edit_icon} />
          </TouchableOpacity>
        </View>
        <View style={Styles.basicInfoContainer}>
          <View style={Styles.basicInfoSubContainer}>
            <Image
              defaultSource={profile_placeholder}
              source={
                isProfieImageAvailable
                  ? {uri: profilePicURL}
                  : profile_placeholder
              }
              style={Styles.profileimage}
              onLoad={() => setHasProfilePicLoaded(true)}
              onLoadStart={() => setHasProfilePicLoaded(false)}
            />
            {!hasProfilePicLoaded ? (
              <ActivityIndicatorView size="small" />
            ) : null}
          </View>
          <Text style={Styles.usernameStyle}>
            {' '}
            {basicInfo.first_name} {basicInfo.last_name}
          </Text>
          <Text style={Styles.birthDate}>
            {' '}
            Birthday:{' '}
            {basicInfo.birthday != undefined
              ? basicInfo.birthday.length > 0
                ? basicInfo.birthday
                : 'None'
              : 'None'}
          </Text>
          <Text style={Styles.relationStatus}>
            {' '}
            Relationship Status:{' '}
            {basicInfo.relationship_status.length > 0
              ? basicInfo.relationship_status
              : 'None'}
          </Text>
        </View>
      </View>
    );
  };

  const prepareContactInfo = () => {
    return (
      <Card
        showEdit={true}
        editButtonClicked={() => {
          props.navigation.navigate('multipleValuesEdit', {
            sectionHeading: contactInfoSection.heading,
            editableFields: contactInfoSection.fields,
          });
        }}
        heading="Contact Info">
        <View style={Styles.cardContainer}>
          <TextWithIcon
            iconUri={icon_location}
            items={[
              contactInfo.completeAddress.length > 0
                ? contactInfo.completeAddress
                : 'None',
            ]}
          />
          <TextWithIcon
            iconUri={icon_mail}
            items={[
              Account.selectedData().email,
              contactInfo.secondary_email_address.length > 0
                ? contactInfo.secondary_email_address
                : 'None',
            ]}
          />
          <TextWithIcon
            iconUri={icon_telephone}
            items={[contactInfo.phone.length > 0 ? contactInfo.phone : 'None']}
          />
        </View>
      </Card>
    );
  };

  const onActionItemClicked = (index: number): void => {
    if (actionSheet?.type == 'image') {
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
                  if (tempfilesArr.length > 0) {
                    let tempfile = tempfilesArr[0];
                    // setBasicInfo({
                    //   ...basicInfo,
                    //   coverPicUri: tempfile.filePath,
                    //   isCoverPicAvailable: true,
                    // });
                    uploadImage(tempfile);
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
                  // setBasicInfo({
                  //   ...basicInfo,
                  //   coverPicUri: tempfile.filePath,
                  //   isCoverPicAvailable: true,
                  // });
                  uploadImage(tempfile);
                })
                .catch(e => {});
            }
          });
          break;
        case actionSheet?.list.length - 2:
          removeImage();
          break;
      }
    }
  };

  //Upload Image
  const uploadImage = (imageFile: TempFile) => {
    //loaderHandler.showLoader();
    props.showLoader(true);
    props.loaderText('Loading...');
    UploadProfilePic(imageFile, PhotoType.cover)
      .then((response: any) => {
        //loaderHandler.hideLoader();
        props.showLoader(false);
        props.loaderText('Loading...');
        getUserProfileData();
        setHasCoverPicLoaded(true);
        // setBasicInfo({
        //   ...basicInfo,
        //   isCoverPicAvailable: true,
        // });
      })
      .catch((error: any) => {
        //loaderHandler.hideLoader();
        props.showLoader(false);
        props.loaderText('Loading...');
        setHasCoverPicLoaded(true);
        // setBasicInfo({
        //   ...basicInfo,
        //   isCoverPicAvailable: false,
        // });
      });
  };

  //remove image
  const removeImage = () => {
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
            //loaderHandler.showLoader('Removing...');
            props.showLoader(true);
            props.loaderText('Removing...');
            RemoveProfilePic(PhotoType.cover)
              .then((response: any) => {
                //loaderHandler.hideLoader();
                props.showLoader(false);
                props.loaderText('Loading...');
                //reload UI
                // setBasicInfo({
                //   ...basicInfo,
                //   coverPicUri: '',
                //   isCoverPicAvailable: false,
                // });
                getUserProfileData();
                // setState({});
              })
              .catch((error: any) => {
                props.showLoader(false);
                props.loaderText('Loading...');
               //ToastMessage(error.message, Colors.ErrorColor);
                //loaderHandler.hideLoader();
              });
          },
        },
      ],
    );
  };

  const getImagePickerActions = (isImageAvailable: boolean) => {
    return isImageAvailable ? AllImageActions : ImageActions;
  };

  const FriendListView = (props: {
    heading: String;
    friendsList: Array<{uri: any; name: String; index?: any}>;
    viewFriendsList: () => void;
  }) => {
    return (
      <View style={cardStyles.container}>
        <View style={cardStyles.headerComponent}>
          <Text style={Styles.heading}>{props.heading}</Text>
          <TouchableOpacity onPress={() => props.viewFriendsList}>
            <Text style={Styles.ViewAll}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={props.friendsList}
          horizontal
          keyExtractor={(_, index: number) => `${index}`}
          showsHorizontalScrollIndicator={false}
          style={Styles.friendListStyle}
          onScroll={() => {
            Keyboard.dismiss();
          }}
          renderItem={({item}) => (
            <View style={Styles.friendlistContainer}>
              <Image source={item.uri} style={Styles.friendIcon} />
              <Text style={Styles.friendName}> {item.name} </Text>
            </View>
          )}
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
          <Text style={Styles.heading}>{props.heading}</Text>
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

  const TextViewWithHeading = (props: {heading: String; value: String}) => {
    return (
      <View style={Styles.TextViewWithHeadingContainer}>
        <Text style={Styles.headingText}> {props.heading} </Text>
        <Text style={Styles.valueText} multiLine={true}>
          {props.value}{' '}
        </Text>
      </View>
    );
  };

  const TextWithIcon = (props: {iconUri: any; items: Array<String>}) => {
    if (props.iconUri != null)
      return (
        <View style={Styles.TextWithIconContainer}>
          <Image style={Styles.TextWithIconStyle} source={props.iconUri} />
          <View style={{flexDirection: 'column'}}>
            {props.items.map((itemInformation, index) => {
              return (
                <Text key={`${index}`} style={Styles.information}>
                  {itemInformation}
                </Text>
              );
            })}
          </View>
        </View>
      );
    return null;
  };

  return (
    <View style={Styles.container}>
      {
        props.showLoaderValue ?
          <BusyIndicator startVisible={props.showLoaderValue} text={props.loaderTextValue !=''? props.loaderTextValue :'Loading...'} overlayColor={Colors.ThemeColor} />
          :
          null
      }
      <SafeAreaView style={Styles.noViewStyle} />
      <SafeAreaView style={Styles.safeAreaContextStyle}>
        <View style={Styles.safeAreaSubContextStyle}>
          <NavigationBar
            title={'My Profile'}
            showClose={true}
            navigation={props.navigation}
          />
          <StatusBar
            barStyle={
              Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
            }
            backgroundColor={Colors.NewThemeColor}
          />
          {Utility.isInternetConnected ? (
            <ScrollView
              contentContainerStyle={{width: deviceWidth}}
              nestedScrollEnabled={true} overScrollMode='always'style={{flex: 1}}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={_onRefresh}
                />
              }>
              {prepareBasicInfo()}
              {prepareContactInfo()}
              {prepareFormSections()}
            </ScrollView>
          ) : (
            <NoInternetView
              tryAgain={() => {
                getUserProfileData();
              }}>
              {' '}
            </NoInternetView>
          )}

          <ActionSheet
            ref={_actionSheet}
            width={DeviceInfo.isTablet() ? '65%' : '100%'}
            actions={actionSheet?.list}
            onActionClick={onActionItemClicked}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const mapState = (state: { [x: string]: any }) => ({
  userData: state.UserProfileRedux.userData,
  showLoaderValue: state.dashboardReducer.showLoader,
  loaderTextValue: state.dashboardReducer.loaderText,
});

const mapDispatch = (dispatch: Function) => {
  return {
    getUserData: (payload: any) =>
      dispatch({ type: GetUserData, payload: payload }),
    showLoader: (payload: any) =>
      dispatch({ type: SHOW_LOADER_READ, payload: payload }),
    loaderText: (payload: any) =>
      dispatch({ type: SHOW_LOADER_TEXT, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(Profile);

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
