import React from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Modal,
  Alert,
  Keyboard,
} from 'react-native';
import {profile_placeholder} from '../../images';
import TextField from '../../common/component/textField';
import DropDown from '../../common/component/dropDown';
import DeviceInfo from 'react-native-device-info';

import {action_camera, action_close, action_picture} from '../../images';
import {
  requestPermission,
  Colors,
  GenerateRandomID,
  getValue,
  testEmail,
  testPhone,
  NO_INTERNET,
  fontSize,
} from '../../common/constants';
import ImageCropPicker, {
  Image as PickerImage,
} from 'react-native-image-crop-picker';
import {Actions} from 'react-native-router-flux';
import {
  UpdateFormValues,
  UploadProfilePic,
  PhotoType,
  RemoveProfilePic,
  UserProfile,
} from './userProfileWebService';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import Utility from '../../common/utility';
import BottomPicker, {
  ActionSheetItem,
} from '../../common/component/bottomPicker';
import ActionSheet, {
  ActionSheetItem as ImageSelectionSheetItem,
} from '../../common/component/actionSheet';
//@ts-ignore
import {KeyboardAwareScrollView} from '../../common/component/keyboardaware-scrollview';
// import DatePickerView from "../../common/component/DatePicker";
import DateTimePicker from '../../common/component/DateTimePicker';
import {kSetUserProfileData} from './userProfileWebService';
import EventManager from '../../common/eventManager';
import {ToastMessage, No_Internet_Warning} from '../../common/component/Toast';
import NavigationBarForEdit from '../../common/component/navigationBarForEdit';
import ActivityIndicatorView from '../../common/component/ActivityIndicatorView';
import TextNew from '../../common/component/Text';
type State = {
  actionSheet: {
    type: 'none' | 'image' | 'audio';
    list: Array<ImageSelectionSheetItem>;
  };
  hasLoaded: boolean;
  [key: string]: any | string;
  error: {[x: string]: {error: boolean; message: string}};
};
type Props = {basicInfo: any; profilePicUri: any};
export default class UserProfileEdit extends React.Component<Props> {
  _actionSheet: any | ActionSheet = null;
  bottomPicker: React.RefObject<BottomPicker> = React.createRef<BottomPicker>();
  profileUpdated: EventManager;
  textFieldArray: {[key: string]: TextInput} = {};
  lastFieldName: string = '';
  isProfilePicAvailable: boolean;
  state: State = {
    error: {},
    selectionData: {
      actions: [],
      selectionValue: '',
      selectionType: {},
      fieldName: '',
      label: '',
      selectedValues: {},
    },

    modalVisible: true,
    actionSheet: {
      type: 'none',
      list: [],
    },
    basicInfo: null,
    contactInfo: null,
    isDatePickerVisible: false,
    hasLoaded: true,
  };

  _closeAction = () => {
    this.setState({modalVisible: false});
    Keyboard.dismiss();
    Actions.pop();
  };

  constructor(prop: Props) {
    super(prop);
    this.isProfilePicAvailable = false;
    this.setState({basicInfo: prop.basicInfo});
    this.profileUpdated = EventManager.addListener(kSetUserProfileData, () => {
      Keyboard.dismiss();
      Actions.popTo('profile');
    });
    this.isProfilePicAvailable = getValue(this.props, ['profilePicUri']) != '';
  }

  componentWillUnmount() {
    this.profileUpdated.removeListener();
  }

  onOptionSelection(field: any) {
    Keyboard.dismiss();
    if (field.type == 'date_select') {
      this.setState({
        isDatePickerVisible: true,
        selectionData: {fieldName: field.field_name},
      });
      return;
    }

    let values = getValue(field, ['values']) || [];
    var actions: ActionSheetItem[] = [];
    for (let key in values) {
      actions.push({key: key, text: values[key]});
    }

    this.setState(
      {
        selectionData: {
          ...this.state.selectionData,
          actions,
          selectionValue: this.state[field.field_name] || '',
          fieldName: field.field_name,
          selectionType: field.multipleSelection,
          label: field.label,
          selectedValues: this.state[field.field_name]
            ? this.state[field.field_name]
            : field.default_value,
        },
      },
      () => {
        this.bottomPicker.current &&
          this.bottomPicker.current.showPicker &&
          this.bottomPicker.current.showPicker();
      },
    );
  }

  generateSectionFields() {
    this.props.basicInfo.fields.forEach((element: any) => {
      if (element.type == 'text_textfield') {
        this.lastFieldName = element.field_name;
      }
    });
    return (
      <View>
        {this.props.basicInfo.fields.map((field: any, index: number) => {
          let default_value: any = '';
          let type = field.type;
          var showError = false,
            errorMessage = '';
          if (this.state.error[field.field_name]) {
            showError = this.state.error[field.field_name].error;
            errorMessage = this.state.error[field.field_name].message;
          }
          var extra: {[x: string]: any} = {
            showError,
            errorMessage,
            isRequired: field.required,
          };
          if (
            type == 'options_select' ||
            type == 'options' ||
            type == 'options_buttons'
          ) {
            let valueArray: string[] = [];
            let default_values = this.state[field.field_name]
              ? this.state[field.field_name]
              : field.default_value;
            for (let key in default_values) {
              //console.log("Values while selection ", default_values[key])
              valueArray.push(default_values[key]);
            }
            default_value = valueArray.join(', ');

            // default_value = this.getValueForField(field)
            return (
              <DropDown
                key={`${index}`}
                placeholderText={field.label}
                value={default_value}
                selectedValue={default_value}
                {...extra}
                onOptionSelected={() => this.onOptionSelection(field)}
              />
            );
          } else if (type == 'text_textfield') {
            let keyboardBoardType =
              field.field_name && field.field_name.indexOf('phone') >= 0
                ? 'phone-pad'
                : field.field_name.indexOf('email') >= 0
                ? 'email-address'
                : 'ascii-capable';
            let val = getValue(field, ['default_value']);
            if (val) {
              default_value = val;
            }
            return (
              <TextField
                key={field.field_name}
                placeholder={field.label}
                reference={(input: TextInput) => {
                  this.textFieldArray = {
                    ...this.textFieldArray,
                    [index]: input,
                  };
                }}
                onChange={(text: string) => {
                  this.setState({
                    [field.field_name]: text,
                    error: {
                      ...this.state.error,
                      [field.field_name]: {error: false, message: ''},
                    },
                  });
                }}
                returnKeyType={
                  this.lastFieldName === field.field_name ? 'done' : 'next'
                }
                value={
                  this.state[field.field_name]
                    ? this.state[field.field_name]
                    : this.state[field.field_name] == ''
                    ? ''
                    : default_value
                }
                keyboardType={keyboardBoardType}
                onSubmitEditing={() => {
                  let nextRef = `${index + 1}`;
                  this.textFieldArray[nextRef] &&
                    typeof this.textFieldArray[nextRef].focus == 'function' &&
                    (this.textFieldArray[nextRef] as TextInput).focus();
                }}
              />
            );
          } else if (type == 'date_select') {
            let field_date: any = this.state[field.field_name]
              ? this.state[field.field_name]
              : field.default_value.value;
            field_date =
              field_date.length > 0
                ? Utility.dateAccordingToFormat(
                    field_date,
                    field.granularity.date_format,
                  )
                : '';
            return (
              <DropDown
                key={field.field_name}
                selectedValue={field_date}
                value={field_date}
                placeholderText={field.label}
                onOptionSelected={() => {
                  this.onOptionSelection(field);
                }}
              />
            );
          }
        })}
        <DateTimePicker
          isVisible={this.state.isDatePickerVisible}
          onCancel={() => {
            this.setState({isDatePickerVisible: false});
            //console.log("cancelled")
          }}
          onDateSelection={(date: any) => {
            this.setState(
              {
                isDatePickerVisible: false,
                [this.state.selectionData.fieldName]:
                  Utility.dateObjectToDefaultFormat(date),
              },
              () => {
                //console.log(this.state);
              },
            );
          }}
        />
      </View>
    );
  }

  saveProfileData() {
    Keyboard.dismiss();
    if (Utility.isInternetConnected) {
      if (this.validateFields()) {
        UpdateFormValues(this.state, this.props.basicInfo.fields);
      }
    } else {
      No_Internet_Warning(
        'Your changes may not be saved as you are not connected to the Internet. Please check your connection and try again.',
      );
    }
  }

  validateFields = (): boolean => {
    let editablefields = this.props.basicInfo.fields;
    var error = {};
    let hasChangedAnyValue = false;

    for (let keys in editablefields) {
      let currentField = editablefields[keys];
      let isRequired: boolean = currentField.required;
      let type = currentField.type;
      //check if given field has existing or value is updated
      let isUpdated = false;
      let updatedValue: any = this.state[currentField.field_name];
      if (updatedValue != null && updatedValue != 'undefined') {
        isUpdated = true;
      }
      hasChangedAnyValue = hasChangedAnyValue || isUpdated;

      let existingValue = this.getValueForField(currentField);
      let hasExistingValue =
        existingValue != null &&
        existingValue != '' &&
        typeof existingValue != 'undefined';

      if (currentField.type == 'date_select') {
        if (getValue(currentField, ['granularity', 'todate']) == 'required') {
          let valueObj = this.getValueForField(currentField);
          let default_value_from: string = valueObj['value'];
          let default_value_to: string = valueObj['value2'];
          hasExistingValue =
            default_value_from.length > 0 && default_value_to.length > 0;
        }
      }

      //check for email
      if (currentField.field_name.indexOf('email') != -1 && isUpdated) {
        if (!testEmail(updatedValue)) {
          error = {
            ...error,
            [currentField.field_name]: {
              error: true,
              message: 'Please enter valid email address',
            },
          };
        }
      }
      //check for valid phone no
      if (currentField.field_name.indexOf('phone') != -1 && isUpdated) {
        if (!testPhone(updatedValue)) {
          error = {
            ...error,
            [currentField.field_name]: {
              error: true,
              message: 'Please enter valid phone number ',
            },
          };
        }
      }

      //console.log("existing value to update:", existingValue)
      //console.log("updated value:", this.state[currentField.field_name])
      //if the field is requird and has existing value or the value is changed
      //then only web service will be called else error will be shown
      if (!(hasExistingValue || isUpdated) && isRequired) {
        if (
          type == 'options_select' ||
          type == 'options' ||
          type == 'options_buttons' ||
          type == 'date_select'
        ) {
          error = {
            ...error,
            [currentField.field_name]: {
              error: true,
              message: `Please select ${currentField.label}`,
            },
          };
        } else {
          error = {
            ...error,
            [currentField.field_name]: {
              error: true,
              message: `Please enter ${currentField.label}`,
            },
          };
        }
      }
    }
    if (Object.keys(error).length > 0) {
      ToastMessage('Please check the highlighted fields', Colors.ErrorColor);
      this.setState({error});
      return false;
    } else if (hasChangedAnyValue == false) {
      ToastMessage('No changes found', Colors.NewTitleColor);
      Keyboard.dismiss();
      Actions.popTo('profile');
    }
    return hasChangedAnyValue;
  };

  getValueForField(field: any): any {
    let default_value: any = '';
    let type = field.type;
    if (
      type == 'options_select' ||
      type == 'options' ||
      type == 'options_buttons'
    ) {
      let valueArray: string[] = [];
      let default_values = getValue(field, ['default_value']) || {};
      for (let key in default_values) {
        //console.log("Values while selection ", default_values[key])
        valueArray.push(default_values[key]);
      }
      default_value = valueArray.join(', ');
      return default_value;
    } else if (type == 'text_textfield') {
      let val = getValue(field, ['default_value']);
      if (val) {
        default_value = val;
      }

      return default_value;
    } else if (type == 'date_select') {
      if (getValue(field, ['granularity', 'todate']) == 'required') {
        let default_value_from = this.state[field.field_name]
          ? this.state[field.field_name].value
            ? this.state[field.field_name].value
            : field.default_value.value
          : field.default_value.value;
        let default_value_to = this.state[field.field_name]
          ? this.state[field.field_name].value2
            ? this.state[field.field_name].value2
            : field.default_value.value2
          : field.default_value.value2;
        return {value: default_value_from, value2: default_value_to};
      } else {
        let val = getValue(field, ['default_value', 'value']);
        if (val) {
          default_value = val;
        }
        return default_value;
      }
    }
  }

  render() {
    let stateValue = getValue(this.state, ['basicInfo', 'profilePicUri']);
    let imageURL =
      stateValue && stateValue != ''
        ? stateValue
        : getValue(this.props, ['profilePicUri']);
    imageURL = imageURL || '';
    let profilePicURL =
      imageURL != '' ? Utility.getFileURLFromPublicURL(imageURL) : '';
    let isProfilePicAvailable = this.isProfilePicAvailable;

    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <NavigationBarForEdit
          rightText="Save"
          saveValues={() => this.saveProfileData()}
          heading={'Basic Info'}
          cancelAction={() => this._closeAction()}></NavigationBarForEdit>
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
            }}
            contentContainerStyle={{alignItems: 'center'}}
            bounces={false}>
            {/* <ScrollView contentContainerStyle={{ width: deviceWidth }}> */}

            <View
              style={{
                width: DeviceInfo.isTablet() ? 320 : '90%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 40,
                marginBottom: 20,
              }}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  defaultSource={profile_placeholder}
                  source={
                    isProfilePicAvailable
                      ? {uri: profilePicURL}
                      : profile_placeholder
                  }
                  style={{width: 100, height: 100, borderRadius: 50}}
                  onLoad={() => this.setState({hasLoaded: true})}
                  onLoadStart={() => this.setState({hasLoaded: false})}
                />
                {!this.state.hasLoaded ? (
                  <ActivityIndicatorView size="small" />
                ) : null}
              </View>

              <TouchableOpacity
                style={{
                  height: 33,
                  width: 200,
                  margin: 20,
                  backgroundColor: Colors.NewYellowColor,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState(
                    {
                      actionSheet: {
                        ...this.state.actionSheet,
                        type: 'image',
                        list: ImageActions,
                      },
                    },
                    () => {
                      this._actionSheet && this._actionSheet.showSheet();
                    },
                  );
                }}>
                <TextNew
                  style={{
                    lineHeight: 20,
                    ...fontSize(16),
                    textAlign: 'center',
                    color: '#fff',
                  }}>
                  {'Change Profile Picture'}
                </TextNew>
              </TouchableOpacity>

              {profilePicURL != '' ? (
                <TouchableOpacity
                  style={{justifyContent: 'center', alignItems: 'center'}}
                  onPress={() => {
                    this.removeImage();
                  }}>
                  <TextNew
                    style={{
                      lineHeight: 20,
                      ...fontSize(16),
                      textAlign: 'center',
                      color: Colors.NewRadColor,
                    }}>
                    {'Remove Photo'}
                  </TextNew>
                </TouchableOpacity>
              ) : null}
            </View>
            <View
              style={{
                width: DeviceInfo.isTablet() ? 320 : '90%',
                justifyContent: 'center',
              }}>
              {this.generateSectionFields()}
            </View>
          </KeyboardAwareScrollView>

          <ActionSheet
            ref={ref => (this._actionSheet = ref)}
            width={DeviceInfo.isTablet() ? '65%' : '100%'}
            actions={this.state.actionSheet.list}
            onActionClick={this.onActionItemClicked.bind(this)}
          />
        </SafeAreaView>
        <BottomPicker
          ref={this.bottomPicker}
          onItemSelect={(selectedItem: ActionSheetItem) => {
            let fieldName = this.state.selectionData.fieldName;
            this.setState({
              [fieldName]: {[selectedItem.key]: selectedItem.text},
            });
            //console.log(this.state)
          }}
          actions={this.state.selectionData.actions}
          value={this.state.selectionData.selectionValue}
          selectedValues={this.state.selectionData.selectedValues}
          selectionType={this.state.selectionData.selectionType}
          fieldName={this.state.selectionData.fieldName}
          fullscreen={true}
          label={this.state.selectionData.label}
          saveSelectedValues={(selectedValueObjects: any) => {
            let fieldName = this.state.selectionData.fieldName;
            this.setState({[fieldName]: selectedValueObjects});
            //console.log(this.state)
          }}
        />
      </View>
    );
  }

  onActionItemClicked = (index: number): void => {
    //compressImageQuality: 0.7
    // DO NOT make quality more than 0.8 as this will allow upload of large and heavy image
    if (this.state.actionSheet.type == 'image') {
      let options = {
        multiple: false,
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 0.7,
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
                        profilePicUri: tempfile.filePath,
                      },
                    });
                    this.uploadImage(tempfile);
                    this.isProfilePicAvailable = true;
                  }

                  //this.saveTempFiles(tempfilesArr);
                  //this.props.setValue(false);
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
                  this.isProfilePicAvailable = true;
                  this.setState({
                    basicInfo: {
                      ...this.state.basicInfo,
                      profilePicUri: tempfile.filePath,
                    },
                  });
                  this.uploadImage(tempfile);

                  // this.saveTempFiles(tempfiles);
                  // this.props.setValue(false);
                })
                .catch(e => {});
            }
          });
          break;
      }
    }
  };

  uploadImage = (imageFile: TempFile) => {
    loaderHandler.showLoader();
    UploadProfilePic(imageFile)
      .then((response: any) => {
        ToastMessage('Profile photo updated successfully');
        UserProfile();
        loaderHandler.hideLoader();
        this.isProfilePicAvailable = true;
        this.setState({hasLoaded: true});
        loaderHandler.hideLoader();
      })
      .catch((error: any) => {
        loaderHandler.hideLoader();
        this.isProfilePicAvailable = false;
        this.setState({hasLoaded: true});
      });
  };

  removeImage = () => {
    Alert.alert(
      '',
      `Are you sure? Your profile picture will be permanently deleted.`,
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
            RemoveProfilePic()
              .then((response: any) => {
                loaderHandler.hideLoader();
                ToastMessage('Profile photo removed successfully');
                UserProfile();
                this.isProfilePicAvailable = false;
                this.setState({
                  basicInfo: {
                    ...this.state.basicInfo,
                    profilePicUri: '',
                  },
                });
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
}

const ImageActions: Array<ImageSelectionSheetItem> = [
  {index: 0, text: 'Capture from Camera', image: action_camera},
  {index: 1, text: 'Upload from Gallery', image: action_picture},
  {index: 2, text: 'Cancel', image: action_close},
];

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
