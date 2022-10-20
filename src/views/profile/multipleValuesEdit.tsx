import React from 'react';
import {
  Image,
  Keyboard,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import DropDown from '../../common/component/dropDown';
import TextField from '../../common/component/textField';
import {profile_placeholder} from '../../images';

import ImageCropPicker, {
  Image as PickerImage,
} from 'react-native-image-crop-picker';
import ActionSheet, {
  ActionSheetItem as ImageSelectionSheetItem,
} from '../../common/component/actionSheet';
import BottomPicker, {
  ActionSheetItem,
} from '../../common/component/bottomPicker';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import {
  Colors,
  ConsoleType,
  fontSize,
  GenerateRandomID,
  getValue,
  requestPermission,
  showConsoleLog,
  testEmail,
  testPhone,
} from '../../common/constants';
import Utility from '../../common/utility';
import {action_camera, action_close, action_picture} from '../../images';
import {
  RemoveProfilePic,
  UpdateFormValues,
  UploadProfilePic,
  UserProfile,
} from './userProfileWebService';
//@ts-ignore
import {KeyboardAwareScrollView} from '../../common/component/keyboardaware-scrollview';
// import DatePickerView from "../../common/component/DatePicker";
import ActivityIndicatorView from '../../common/component/ActivityIndicatorView';
import DateTimePicker from '../../common/component/DateTimePicker';
import MultipleDropDownSelector from '../../common/component/multipleDropDownView';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import TextNew from '../../common/component/Text';
import {No_Internet_Warning, ToastMessage} from '../../common/component/Toast';
import EventManager from '../../common/eventManager';
import {kSetUserProfileData} from './userProfileWebService';
import Styles from './styles';

type Props = {
  sectionHeading: any;
  editableFields: any;
  basicInfo?: any;
  profilePicUri?: any;
  route?:any;
  navigation?: any;
};
type State = {
  actionSheet: {
    type: 'none' | 'image' | 'audio';
    list: Array<ImageSelectionSheetItem>;
  };
  hasLoaded: boolean;
  [key: string]: any | string;
  error: {[x: string]: {error: boolean; message: string}};
  isDatePickerVisible: boolean;
};

export default class MutilpleValueEdit extends React.Component<Props> {
  bottomPicker: React.RefObject<BottomPicker> = React.createRef<BottomPicker>();
  profileUpdated: EventManager;
  textFieldArray: {[key: string]: TextInput} = {};
  lastFieldName: string = '';
  _actionSheet: any | ActionSheet = null;
  isProfilePicAvailable: boolean;
  StateData: any;
  state: State = {
    error: {},
    selectionData: {
      actions: [],
      selectionValue: '',
      selectionType: {},
      fieldName: '',
      label: '',
      selectedValues: {},
      maxLimit: {},
      isFromMultipleDropDown: false,
      fieldNameOfMultipleDropDown: '',
    },
    isDatePickerVisible: false,
    modalVisible: true,
    actionSheet: {
      type: 'none',
      list: [],
    },
    basicInfo: null,
    contactInfo: null,
    hasLoaded: true,
  };

  constructor(props: Props) {
    super(props);
    // showConsoleLog(ConsoleType.LOG, 'Editable fields : ', this.props);
    this.props?.route?.params?.editableFields?.forEach((element: any) => {
      this.setState({
        [element.field_name]: element.default_value,
      });
    });
    this.profileUpdated = EventManager.addListener(kSetUserProfileData, () => {
      Keyboard.dismiss();
      this.props.navigation.navigate('profile');
    });
    if (props.basicInfo) {
      this.isProfilePicAvailable = false;
      this.setState({basicInfo: props.basicInfo}, () => {
        this.profileUpdated = EventManager.addListener(
          kSetUserProfileData,
          () => {
            Keyboard.dismiss();
            this.props.navigation.navigate('profile');
          },
        );
        this.isProfilePicAvailable =
          getValue(this.props, ['profilePicUri']) != '';
      });
    }
  }

  _closeAction = () => {
    this.setState({modalVisible: false}, () => {
      Keyboard.dismiss();
      this.props.navigation.goBack();
    });
  };

  componentWillUnmount() {
    this.profileUpdated.removeListener();
  }

  onOptionSelection(field: any) {
    Keyboard.dismiss();
    var actions: ActionSheetItem[] = [];
    if (field.type == 'date' || field.type == 'date_select') {
      if (getValue(field, ['granularity', 'todate']) != 'required') {
        this.setState({
          isDatePickerVisible: true,
          selectionData: {fieldName: field.field_name},
        });
        return;
      }

      let least = 1917,
        most = new Date().getFullYear();
      if (field.field_name == 'default_value2') {
        if (this.state['default_value']) {
          least = this.state['default_value'] - 1;
        }
      }
      if (field.field_name == 'default_value') {
        if (this.state['default_value2']) {
          most = this.state['default_value2'] - 1;
        }
      }
      for (var i = most; i > least; i--) {
        actions.push({key: i, text: `${i}`});
      }
    } else {
      for (let key in field.values) {
        actions.push({key, text: field.values[key]});
      }
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
          maxLimit: field.maxLimit,
          isFromMultipleDropDown: false,
          fieldNameOfMultipleDropDown: '',
        },
      },
      () => {
        this.bottomPicker.current &&
          this.bottomPicker.current.showPicker &&
          this.bottomPicker.current.showPicker();
      },
    );
  }

  onOptionSelectForMultipleDropDown = (
    field_name: string,
    default_value_from: string,
    default_value_to: string,
    view1Title: string,
    view2Title: string,
    selectedViewName: string,
  ) => {
    var actions: ActionSheetItem[] = [];

    let today = new Date().getFullYear();
    let least = 1917;
    let most = today;
    let defaultFrom =
      default_value_from != '' ? parseInt(default_value_from) : least;
    let defaultTo = default_value_to != '' ? parseInt(default_value_to) : most;

    let selectedValue: any = '';

    if (selectedViewName == view1Title) {
      selectedValue = defaultFrom;
      most = defaultTo - 1;
    }

    if (selectedViewName == view2Title) {
      selectedValue = defaultTo;
      least = defaultFrom - 1;
    }

    for (var i = most; i > least; i--) {
      actions.push({key: i, text: `${i}`});
    }

    this.setState(
      {
        selectionData: {
          ...this.state.selectionData,
          actions,
          selectionValue: selectedValue,
          fieldName: field_name,
          selectionType: 0,
          label: selectedViewName,
          selectedValues: {[selectedValue]: selectedValue},
          maxLimit: 1,
          isFromMultipleDropDown: true,
          fieldNameOfMultipleDropDown:
            selectedViewName == view1Title ? 'value' : 'value2',
        },
      },
      () => {
        this.bottomPicker.current &&
          this.bottomPicker.current.showPicker &&
          this.bottomPicker.current.showPicker();
      },
    );
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
        valueArray.push(default_values[key]);
      }
      default_value = valueArray.join(', ');
      showConsoleLog(ConsoleType.LOG,"Values while selection ", default_value)
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

  generateSectionFields() {
    this.props.route.params.editableFields.forEach((element: any) => {
      if (element.type == 'text_textfield') {
        this.lastFieldName = element.field_name;
      }
    });
    return (
      <View>
        {this.props.route.params.editableFields.map(
          (field: any, index: number) => {
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
                valueArray.push(default_values[key]);
              }
              default_value = valueArray.join(', ');
              showConsoleLog(ConsoleType.LOG,"generateSectionFields Values while selection ", default_value)

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
              let val = getValue(field, ['default_value']);
              if (val) {
                default_value = val;
              }
              // default_value = this.getValueForField(field)
              let keyboardBoardType =
                field.field_name && field.field_name.indexOf('phone') >= 0
                  ? 'phone-pad'
                  : field.field_name.indexOf('email') >= 0
                  ? 'email-address'
                  : 'ascii-capable';
              let maxLimit = field.field_name.indexOf('name') >= 0 ? 15 : 100;
              return (
                <TextField
                  maxLength={maxLimit}
                  key={`${index}`}
                  reference={(input: TextInput) => {
                    this.textFieldArray = {
                      ...this.textFieldArray,
                      [index]: input,
                    };
                  }}
                  placeholder={field.label}
                  onChange={(text: string) => {
                    this.setState({
                      [field.field_name]: text,
                      error: {
                        ...this.state.error,
                        [field.field_name]: {error: false, message: ''},
                      },
                    },()=>{
                      this.StateData = this.state;
                    });
                  }}
                  {...extra}
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
                //showConsoleLog(ConsoleType.LOG,"For date select");
                default_value_from = Utility.dateAccordingToFormat(
                  default_value_from,
                  'Y',
                )
                  ? Utility.dateAccordingToFormat(default_value_from, 'Y')
                  : '';
                default_value_to = Utility.dateAccordingToFormat(
                  default_value_to,
                  'Y',
                )
                  ? Utility.dateAccordingToFormat(default_value_to, 'Y')
                  : '';
                return (
                  <MultipleDropDownSelector
                    placeholderText={field.label}
                    {...extra}
                    view1Value={default_value_from}
                    view2Value={default_value_to}
                    view1Title="From"
                    view2Title="To"
                    onOptionSelected={(selectedFrom: string) => {
                      this.onOptionSelectForMultipleDropDown(
                        field.field_name,
                        default_value_from,
                        default_value_to,
                        'From',
                        'To',
                        selectedFrom,
                      );
                    }}
                  />
                );
              } else {
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
            }
          },
        )}
      </View>
    );
  }

  saveProfileData() {
    Keyboard.dismiss();
    if (Utility.isInternetConnected) {
      if (this.validateFields()) {

        UpdateFormValues(this.StateData, this.props.route.params.editableFields);
      }
    } else {
      No_Internet_Warning();
    }
  }

  generateProfilePicView = () => {
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
      <View style={Styles.profilePicContainer}>
        <View style={Styles.removeTextButton}>
          <Image
            defaultSource={profile_placeholder}
            source={
              isProfilePicAvailable ? {uri: profilePicURL} : profile_placeholder
            }
            style={Styles.profileImage}
            onLoad={() => this.setState({hasLoaded: true})}
            onLoadStart={() => this.setState({hasLoaded: false})}
          />
          {!this.state.hasLoaded ? (
            <ActivityIndicatorView size="small" />
          ) : null}
        </View>

        <TouchableOpacity
          style={Styles.changeProfileButton}
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
          <TextNew style={Styles.changeProfile}>
            {'Change Profile Picture'}
          </TextNew>
        </TouchableOpacity>

        {profilePicURL != '' ? (
          <TouchableOpacity
            style={Styles.removeTextButton}
            onPress={() => {
              this.removeImage();
            }}>
            <TextNew style={Styles.removeText}>{'Remove Photo'}</TextNew>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };
  validateFields = (): boolean => {
    let editablefields = this.props.route.params.editableFields;
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

      if (currentField.field_name.indexOf('name') != -1 && isRequired) {
        let fieldName = currentField.field_name;
        let value =
          this.state[fieldName] != null && this.state[fieldName] != undefined
            ? this.state[fieldName]
            : existingValue;
        if (value == null || value == undefined || value.trim().length == 0) {
          error = {
            ...error,
            [currentField.field_name]: {
              error: true,
              message: 'Please enter text',
            },
          };
        }
      }
      //showConsoleLog(ConsoleType.LOG,"existing value to update:", existingValue)
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
              message: 'Please enter text',
            },
          };
        }
      }
    }
    if (Object.keys(error).length > 0) {
     //ToastMessage('Please check the highlighted fields', Colors.ErrorColor);
      this.setState({error});
      return false;
    } else if (hasChangedAnyValue == false) {
     //ToastMessage('No changes found', Colors.ThemeColor);
      Keyboard.dismiss();
      this.props.navigation.navigate('profile');
    }
    return hasChangedAnyValue;
  };

  uploadImage = (imageFile: TempFile) => {
    //loaderHandler.showLoader();
    UploadProfilePic(imageFile)
      .then((response: any) => {
       //ToastMessage('Profile photo updated successfully');
        UserProfile();
        //loaderHandler.hideLoader();
        this.isProfilePicAvailable = true;
        this.setState({hasLoaded: true}, () => {
          //loaderHandler.hideLoader();
        });
      })
      .catch((error: any) => {
        //loaderHandler.hideLoader();
        this.isProfilePicAvailable = false;
        this.setState({hasLoaded: true}, () => {
          //loaderHandler.hideLoader();
        });
      });
  };

  removeImage = () => {
    //loaderHandler.showLoader('Removing...');
    RemoveProfilePic()
      .then((response: any) => {
        //loaderHandler.hideLoader();
       //ToastMessage('Profile photo removed successfully');
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
       //ToastMessage(error.message, Colors.ErrorColor);
        //loaderHandler.hideLoader();
      });
  };

  render() {
    return (
      <View style={Styles.container}>
        <SafeAreaView style={Styles.multipleValueContainer}>
          <StatusBar
            barStyle={
              Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
            }
          />
          <NavigationHeaderSafeArea
            isWhite={true}
            rightText="Save"
            saveValues={() => this.saveProfileData()}
            heading={this.props.sectionHeading}
            cancelAction={() => {
              Keyboard.dismiss();
              this.props.navigation.goBack();
            }}
          />
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            style={Styles.KeyboardAwareScrollViewStyle}
            contentContainerStyle={{alignItems: 'center'}}
            bounces={false}>
            {this.props.basicInfo && this.generateProfilePicView()}
            <View style={Styles.basicInfostyle}>
              {this.generateSectionFields()}
              <DateTimePicker
                isVisible={this.state.isDatePickerVisible}
                onCancel={() => {
                  this.setState({isDatePickerVisible: false});
                  //showConsoleLog(ConsoleType.LOG,"cancelled")
                }}
                onDateSelection={(date: any) => {
                  this.setState({
                    isDatePickerVisible: false,
                    [this.state.selectionData.fieldName]:
                      Utility.dateObjectToDefaultFormat(date),
                  });
                }}
              />
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
            if (this.state.selectionData.isFromMultipleDropDown) {
              let date: Date = new Date();
              date.setFullYear(parseInt(selectedItem.text));
              this.setState({
                [fieldName]: {
                  ...this.state[fieldName],
                  [selectedItem.key]: Utility.dateObjectToDefaultFormat(date),
                },
                error: {
                  ...this.state.error,
                  [fieldName]: {error: false, message: ''},
                },
              });
            } else {
              this.setState({
                [fieldName]: {[selectedItem.key]: selectedItem.text},
                error: {
                  ...this.state.error,
                  [fieldName]: {error: false, message: ''},
                },
              });
            }
          }}
          actions={this.state.selectionData.actions}
          value={this.state.selectionData.selectionValue}
          selectedValues={this.state.selectionData.selectedValues}
          selectionType={this.state.selectionData.selectionType}
          fieldName={this.state.selectionData.fieldName}
          fullscreen={true}
          label={this.state.selectionData.label}
          maxLimit={this.state.selectionData.maxLimit}
          isFromMultipleDropDown={
            this.state.selectionData.isFromMultipleDropDown
          }
          fieldNameOfMultipleDropDown={
            this.state.selectionData.fieldNameOfMultipleDropDown
          }
          saveSelectedValues={(selectedValueObjects: any) => {
            let fieldName = this.state.selectionData.fieldName;
            this.setState({
              [fieldName]: selectedValueObjects,
              error: {
                ...this.state.error,
                [fieldName]: {error: false, message: ''},
              },
            },()=>{
              this.StateData = this.state;
            });
            //showConsoleLog(ConsoleType.LOG,this.state)
          }}
          multipleValuesComponent={true}
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
                  //showConsoleLog(ConsoleType.LOG,response, typeof response);
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
                  //showConsoleLog(ConsoleType.LOG,response, typeof response);
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
