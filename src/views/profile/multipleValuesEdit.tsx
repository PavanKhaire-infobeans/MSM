import React, { useEffect, useState } from 'react';
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
import { profile_placeholder } from '../../images';
import useUserProfileData from './profileDataModel';

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
import { action_camera, action_close, action_picture } from '../../images';
import {
  RemoveProfilePic,
  UpdateFormValues,
  UploadProfilePic,
  UserProfile,
} from './userProfileWebService';
//@ts-ignore
import { KeyboardAwareScrollView } from '../../common/component/keyboardaware-scrollview';
// import DatePickerView from "../../common/component/DatePicker";
import ActivityIndicatorView from '../../common/component/ActivityIndicatorView';
import DateTimePicker from '../../common/component/DateTimePicker';
import MultipleDropDownSelector from '../../common/component/multipleDropDownView';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import TextNew from '../../common/component/Text';
import { No_Internet_Warning, ToastMessage } from '../../common/component/Toast';
import EventManager from '../../common/eventManager';
import { kSetUserProfileData } from './userProfileWebService';
import Styles from './styles';
import MessageDialogue from '../../common/component/messageDialogue';
import BusyIndicator from '../../common/component/busyindicator';
import moment from 'moment';

type Props = {
  sectionHeading: any;
  editableFields: any;
  basicInfo?: any;
  profilePicUri?: any;
  route?: any;
  navigation?: any;
};
type State = {
  actionSheet: {
    type: 'none' | 'image' | 'audio';
    list: Array<ImageSelectionSheetItem>;
  };
  hasLoaded: boolean;
  [key: string]: any | string;
  error: { [x: string]: { error: boolean; message: string } };
  isDatePickerVisible: boolean;
};

const MutilpleValueEdit = (props: Props) => {
  let bottomPicker: React.RefObject<BottomPicker> = React.createRef<BottomPicker>();
  let profileUpdated: EventManager;
  let textFieldArray: { [key: string]: TextInput } = {};
  let lastFieldName: string = '';
  let _actionSheet: any | ActionSheet = null;
  let isProfilePicAvailable: boolean;
  let StateData: any;
  let messageRef: any;

  const [state, setState] = useState({
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
    showLoaderValue: false,
    loaderTextValue: ''

  })

  // constructor(props: Props) {
  //   super(props);
  // showConsoleLog(ConsoleType.LOG, 'Editable fields : ',     this.props.route.params.editableFields);
  useEffect(() => {
    props?.route?.params?.editableFields?.forEach((element: any) => {
      setState(prevState => ({
        ...prevState,
        [element.field_name]: element.default_value,
      }));
    });

    profileUpdated = EventManager.addListener(kSetUserProfileData, () => {
      showConsoleLog(ConsoleType.INFO, "Profile response in listener: ");
      setState(prevState => ({
        ...prevState,
        showLoaderValue: false,
        loaderTextValue: 'Loading...'
      }))
      Keyboard.dismiss();
      // const {
      //   setAllFormSections,
      // } = useUserProfileData({});
      // setAllFormSections([]);

      props.navigation.replace('profile');
    });

    if (props.basicInfo) {
      isProfilePicAvailable = false;
      setState(prevState => ({
        ...prevState,
        basicInfo: props.basicInfo
      }));

      profileUpdated = EventManager.addListener(
        kSetUserProfileData,
        () => {
          showConsoleLog(ConsoleType.INFO, "Profile response in listenerssss: ");
          setState(prevState => ({
            ...prevState,
            showLoaderValue: false,
            loaderTextValue: 'Loading...'
          }));
          Keyboard.dismiss();
          props.navigation.replace('profile');

        });
      isProfilePicAvailable =
        getValue(props, ['profilePicUri']) != '';
    }

    return () => {
      setState(prevState => ({
        ...prevState,
        showLoaderValue: false,
        loaderTextValue: 'Loading...'
      }));
      profileUpdated.removeListener();
    }
  }, []);

  // }

  const _closeAction = () => {
    setState(prevState => ({
      ...prevState,
      modalVisible: false
    }));
    Keyboard.dismiss();
    props.navigation.goBack();
  };

  const onOptionSelection = (field: any) => {
    Keyboard.dismiss();
    var actions = [];
    if (field.type == 'date' || field.type == 'date_select') {
      if (getValue(field, ['granularity', 'todate']) != 'required') {

        console.log(state[field.field_name].value)
        let field_date: any = state[field.field_name]?.value
          ? state[field.field_name].value
          :
          state[field.field_name] ?
            state[field.field_name].value
            : field.default_value.value;
        field_date =
          field_date.length > 0
            ? Utility.dateAccordingToFormat(
              field_date,
              field.granularity.date_format,
            )
            : new Date().toString();

        setState(prevState => ({
          ...prevState,
          isDatePickerVisible: true,
          selectionData: { ...state.selectionData, fieldName: field.field_name, selectionValue: field_date },
        }));

        return;
      }

      let least = 1917,
        most = new Date().getFullYear();
      if (field.field_name == 'default_value2') {
        if (state['default_value']) {
          least = state['default_value'] - 1;
        }
      }
      if (field.field_name == 'default_value') {
        if (state['default_value2']) {
          most = state['default_value2'] - 1;
        }
      }
      for (var i = most; i > least; i--) {
        actions.push({ key: i, text: `${i}` });
      }
    } else {
      for (let key in field.values) {
        actions.push({ key, text: field.values[key] });
      }
    }

    setState(prevState => ({
      ...prevState,
      selectionData: {
        ...state.selectionData,
        actions,
        selectionValue: state[field.field_name] || '',
        fieldName: field.field_name,
        selectionType: field.multipleSelection,
        label: field.label,
        selectedValues: state[field.field_name]
          ? state[field.field_name]
          : field.default_value,
        maxLimit: field.maxLimit,
        isFromMultipleDropDown: false,
        fieldNameOfMultipleDropDown: '',
      }
    }));
    console.log("actionsss ?",JSON.stringify(actions),field.multipleSelection)

      bottomPicker.current &&
      bottomPicker.current.showPicker &&
      bottomPicker.current.showPicker();  

  }

  const onOptionSelectForMultipleDropDown = (
    field_name: string,
    default_value_from: string,
    default_value_to: string,
    view1Title: string,
    view2Title: string,
    selectedViewName: string,
  ) => {
    var actions = [];

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
      actions.push({ key: i, text: `${i}` });
    }

    setState(prevState => ({
      ...prevState,
      selectionData: {
        ...state.selectionData,
        actions,
        selectionValue: selectedValue,
        fieldName: field_name,
        selectionType: 0,
        label: selectedViewName,
        selectedValues: { [selectedValue]: selectedValue },
        maxLimit: 1,
        isFromMultipleDropDown: true,
        fieldNameOfMultipleDropDown:
          selectedViewName == view1Title ? 'value' : 'value2',
      }
    }));

    console.log("actions ?",JSON.stringify(actions))
    bottomPicker.current &&
      bottomPicker.current.showPicker &&
      bottomPicker.current.showPicker();
  };

  const getValueForField = (field: any) => {
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
      showConsoleLog(ConsoleType.LOG, "Values while selection ", default_value)
      return default_value;
    } else if (type == 'text_textfield') {
      let val = getValue(field, ['default_value']);
      if (val) {
        default_value = val;
      }

      return default_value;
    } else if (type == 'date_select') {
      if (getValue(field, ['granularity', 'todate']) == 'required') {
        let default_value_from = state[field.field_name]
          ? state[field.field_name].value
            ? state[field.field_name].value
            : field.default_value.value
          : field.default_value.value;
        let default_value_to = state[field.field_name]
          ? state[field.field_name].value2
            ? state[field.field_name].value2
            : field.default_value.value2
          : field.default_value.value2;
        return { value: default_value_from, value2: default_value_to };
      } else {
        let val = getValue(field, ['default_value', 'value']);
        if (val) {
          default_value = val;
        }
        return default_value;
      }
    }
  }

  const generateSectionFields = () => {
    props.route.params.editableFields.forEach((element: any) => {
      if (element.type == 'text_textfield') {
        lastFieldName = element.field_name;
      }
    });
    return (
      <View>
        {props.route.params.editableFields.map(
          (field: any, index: number) => {
            let default_value: any = '';
            let type = field.type;

            var showError = false,
              errorMessage = '';
            if (state.error[field.field_name]) {
              showError = state.error[field.field_name].error;
              errorMessage = state.error[field.field_name].message;
            }
            var extra: { [x: string]: any } = {
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
              let default_values = state[field.field_name]
                ? state[field.field_name]
                : field.default_value;
              for (let key in default_values) {
                valueArray.push(default_values[key]);
              }
              default_value = valueArray.join(', ');
              showConsoleLog(ConsoleType.LOG, "state val ", JSON.stringify(default_value), field.field_name,type)
              // showConsoleLog(ConsoleType.LOG, "generateSectionFields Values while selection ", default_value)

              // default_value = getValueForField(field)
              return (
                <DropDown
                  key={`${index}`}
                  placeholderText={field.label}
                  value={default_value}
                  selectedValue={default_value}
                  {...extra}
                  onOptionSelected={() => onOptionSelection(field)}
                />
              );
            } else if (type == 'text_textfield') {
              let val = getValue(field, ['default_value']);
              if (val) {
                default_value = val;
              }
              // default_value = getValueForField(field)
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
                    textFieldArray = {
                      ...textFieldArray,
                      [index]: input,
                    };
                  }}
                  placeholder={field.label}
                  onChange={(text: string) => {
                    setState(prevState => ({
                      ...prevState,
                      [field.field_name]: text,
                      error: {
                        ...state.error,
                        [field.field_name]: { error: false, message: '' },
                      },
                    }));
                    StateData = state;

                  }}
                  {...extra}
                  returnKeyType={
                    lastFieldName === field.field_name ? 'done' : 'next'
                  }
                  value={
                    state[field.field_name]
                      ? state[field.field_name]
                      : state[field.field_name] == ''
                        ? ''
                        : default_value
                  }
                  keyboardType={keyboardBoardType}
                  onSubmitEditing={() => {
                    let nextRef = `${index + 1}`;
                    textFieldArray[nextRef] &&
                      typeof textFieldArray[nextRef].focus == 'function' &&
                      (textFieldArray[nextRef] as TextInput).focus();
                  }}
                />
              );
            } else if (type == 'date_select') {
              if (getValue(field, ['granularity', 'todate']) == 'required') {
                let default_value_from = state[field.field_name]
                  ? state[field.field_name].value
                    ? state[field.field_name].value
                    : field.default_value.value
                  : field.default_value.value;
                let default_value_to = state[field.field_name]
                  ? state[field.field_name].value2
                    ? state[field.field_name].value2
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
                      onOptionSelectForMultipleDropDown(
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
              }
              else {

                let field_date: any = state[field.field_name]
                  ? state[field.field_name].value
                  : field.default_value.value;
                // showConsoleLog(ConsoleType.LOG, "jjhsdjadhhsdihj val ", JSON.stringify(state[field.field_name]), field_date)
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
                      onOptionSelection(field);
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

  const saveProfileData = () => {
    Keyboard.dismiss();
    if (Utility.isInternetConnected) {
      try {
        if (validateFields()) {
          setState(prevState => ({
            ...prevState,
            showLoaderValue: true,
            loaderTextValue: 'Loading...'
          }));

          showConsoleLog(ConsoleType.INFO, "state before send: ", JSON.stringify(state));

          UpdateFormValues(state, props.route.params.editableFields,
            resp => {

            });
        }
      } catch (error) {
      }

    } else {
      No_Internet_Warning();
    }
  }

  const generateProfilePicView = () => {
    let stateValue = getValue(state, ['basicInfo', 'profilePicUri']);
    let imageURL =
      stateValue && stateValue != ''
        ? stateValue
        : getValue(props, ['profilePicUri']);
    imageURL = imageURL || '';
    let profilePicURL =
      imageURL != '' ? Utility.getFileURLFromPublicURL(imageURL) : '';
    // let isProfilePicAvailable = isProfilePicAvailable;
    return (
      <View style={Styles.profilePicContainer}>
        <View style={Styles.removeTextButton}>
          <Image
            defaultSource={profile_placeholder}
            source={
              isProfilePicAvailable ? { uri: profilePicURL } : profile_placeholder
            }
            style={Styles.profileImage}
            onLoad={() => {
              setState(prevState => ({
                ...prevState,
                hasLoaded: true
              }));
            }}
            onLoadStart={() => {
              setState(prevState => ({
                ...prevState,
                hasLoaded: false
              }));
            }}
          />
          {!state.hasLoaded ? (
            <ActivityIndicatorView size="small" />
          ) : null}
        </View>

        <TouchableOpacity
          style={Styles.changeProfileButton}
          onPress={() => {
            setState(prevState => ({
              ...prevState,
              actionSheet: {
                // ...state.actionSheet,
                type: 'image',
                list: ImageActions,
              }
            }));

            setTimeout(() => {
              _actionSheet && _actionSheet.showSheet();
            }, 500);
          }}>
          <TextNew style={Styles.changeProfile}>
            {'Change Profile Picture'}
          </TextNew>
        </TouchableOpacity>

        {profilePicURL != '' ? (
          <TouchableOpacity
            style={Styles.removeTextButton}
            onPress={() => {
              removeImage();
            }}>
            <TextNew style={Styles.removeText}>{'Remove Photo'}</TextNew>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const validateFields = () => {
    try {
      let editablefields = props.route.params.editableFields;
      var error = {};
      let hasChangedAnyValue = false;
      // showConsoleLog(ConsoleType.LOG, "state val submit", JSON.stringify(state))

      for (let keys in editablefields) {
        let currentField = editablefields[keys];
        let isRequired: boolean = currentField.required;
        let type = currentField.type;
        //check if given field has existing or value is updated
        let isUpdated = false;

        // showConsoleLog(ConsoleType.WARN, "state val submit", JSON.stringify(currentField?.field_name), state[currentField?.field_name])

        let updatedValue: any = state[currentField?.field_name];
        if (state[currentField?.field_name] != null) {
          if (updatedValue != null && updatedValue != 'undefined') {
            isUpdated = true;
          }
        }

        hasChangedAnyValue = hasChangedAnyValue || isUpdated;

        let existingValue = getValueForField(currentField);
        let hasExistingValue =
          existingValue != null &&
          existingValue != '' &&
          typeof existingValue != 'undefined';

        if (currentField?.type == 'date_select') {

          // showConsoleLog(ConsoleType.WARN, "state val submit", JSON.stringify(currentField?.field_name), state[currentField?.field_name])

          if (getValue(currentField, ['granularity', 'todate']) == 'required') {
            let valueObj = getValueForField(currentField);
            let default_value_from: string = valueObj['value'];
            let default_value_to: string = valueObj['value2'];
            hasExistingValue =
              default_value_from.length > 0 && default_value_to.length > 0;
          }
        }

        //check for email
        if (currentField?.field_name.indexOf('email') != -1 && isUpdated) {
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
        if (currentField?.field_name.indexOf('phone') != -1 && isUpdated) {
          if (!testPhone(updatedValue)) {
            error = {
              ...error,
              [currentField?.field_name]: {
                error: true,
                message: 'Please enter valid phone number ',
              },
            };
          }
        }

        if (currentField?.field_name.indexOf('name') != -1 && isRequired) {
          let fieldName = currentField?.field_name;
          let value =
            state[fieldName] != null && state[fieldName] != undefined
              ? state[fieldName]
              : existingValue;
          if (value == null || value == undefined || value.trim().length == 0) {
            error = {
              ...error,
              [currentField?.field_name]: {
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
              [currentField?.field_name]: {
                error: true,
                message: `Please select ${currentField?.label}`,
              },
            };
          } else {
            error = {
              ...error,
              [currentField?.field_name]: {
                error: true,
                message: 'Please enter text',
              },
            };
          }
        }
      }
      if (Object.keys(error).length > 0) {
        messageRef._show({ message: 'Please check the highlighted fields', color: Colors.ErrorColor });
        setTimeout(() => {
          messageRef && messageRef._hide();
        }, 4000);
        //ToastMessage('Please check the highlighted fields', Colors.ErrorColor);
        setState(prevState => ({
          ...prevState,
          error
        }));
        return false;
      } else if (hasChangedAnyValue == false) {
        messageRef._show({ message: 'No changes found', color: Colors.ErrorColor });
        setTimeout(() => {
          messageRef && messageRef._hide();
          props.navigation.replace('profile');
        }, 4000);
        //ToastMessage('No changes found', Colors.ThemeColor);
        Keyboard.dismiss();
      }
      return hasChangedAnyValue;

    } catch (error) {
      console.error("validate err >", error)
    }

  };

  const uploadImage = (imageFile: TempFile) => {
    //loaderHandler.showLoader();

    setState(prevState => ({
      ...prevState,
      showLoaderValue: true,
      loaderTextValue: 'Loading...'
    }));
    UploadProfilePic(imageFile)
      .then((response: any) => {
        messageRef._show({ message: 'Profile photo updated successfully' });
        setTimeout(() => {
          messageRef && messageRef._hide();
        }, 4000);
        //ToastMessage('Profile photo updated successfully');
        UserProfile();

        //loaderHandler.hideLoader();
        isProfilePicAvailable = true;
        setState(prevState => ({
          ...prevState,
          hasLoaded: true,
          showLoaderValue: false
        }));
      })
      .catch((error: any) => {
        //loaderHandler.hideLoader();
        isProfilePicAvailable = false;
        setState(prevState => ({
          ...prevState,
          hasLoaded: true,
          showLoaderValue: false
        }));
      });


  };

  const removeImage = () => {
    //loaderHandler.showLoader('Removing...');

    setState(prevState => ({
      ...prevState,
      showLoaderValue: true,
      loaderTextValue: 'Removing...'
    }));
    RemoveProfilePic()
      .then((response: any) => {
        //loaderHandler.hideLoader();
        messageRef._show({ message: 'Profile photo removed successfully' });
        setTimeout(() => {
          messageRef && messageRef._hide();
        }, 4000);
        //ToastMessage('Profile photo removed successfully');
        UserProfile();
        isProfilePicAvailable = false;
        setState(prevState => ({
          ...prevState,
          basicInfo: {
            ...state.basicInfo,
            profilePicUri: '',
          },
          showLoaderValue: false,
          loaderTextValue: 'Loading...'
        }));

      })
      .catch((error: any) => {
        messageRef._show({ message: error.message, color: Colors.ErrorColor });
        setTimeout(() => {
          messageRef && messageRef._hide();
        }, 4000);
        setState(prevState => ({
          ...prevState,
          basicInfo: {
            ...state.basicInfo,
            profilePicUri: '',
          },
          showLoaderValue: false,
          loaderTextValue: 'Loading...'
        }));

        //ToastMessage(error.message, Colors.ErrorColor);
        //loaderHandler.hideLoader();
      });

  };


  const onActionItemClicked = (index: number): void => {
    //compressImageQuality: 0.7
    // DO NOT make quality more than 0.8 as this will allow upload of large and heavy image
    if (state.actionSheet.type == 'image') {
      let options: any = {
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
                    setState(prevState => ({
                      ...prevState,
                      basicInfo: {
                        ...state.basicInfo,
                        profilePicUri: tempfile.filePath,
                      },
                    }));

                    uploadImage(tempfile);
                    isProfilePicAvailable = true;
                  }
                  //saveTempFiles(tempfilesArr);
                  //props.setValue(false);
                })
                .catch(e => { });
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
                  isProfilePicAvailable = true;
                  setState(prevState => ({
                    ...prevState,
                    basicInfo: {
                      ...state.basicInfo,
                      profilePicUri: tempfile.filePath,
                    },
                  }));

                  uploadImage(tempfile);
                  // saveTempFiles(tempfiles);
                  // props.setValue(false);
                })
                .catch(e => { });
            }
          });
          break;
      }
    }
  };

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
          saveValues={() => saveProfileData()}
          heading={props.route.params.sectionHeading}
          cancelAction={() => {
            Keyboard.dismiss();
            props.navigation.goBack();
          }}
        />
        <MessageDialogue
          ref={(ref: any) => (messageRef = ref)}
        />

        {
          state.showLoaderValue ?
            <BusyIndicator startVisible={state.showLoaderValue} text={state.loaderTextValue != '' ? state.loaderTextValue : 'Loading...'} overlayColor={Colors.ThemeColor} />
            :
            null
        }
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          style={Styles.KeyboardAwareScrollViewStyle}
          contentContainerStyle={{ alignItems: 'center' }}
          bounces={false}>
          {props.basicInfo && generateProfilePicView()}
          <View style={Styles.basicInfostyle}>
            {generateSectionFields()}
            <DateTimePicker
              isVisible={state.isDatePickerVisible}
              onCancel={() => {
                setState(prevState => ({
                  ...prevState,
                  isDatePickerVisible: false
                }));
              }}
              defaultDate={state.selectionData.selectionValue}
              onDateSelection={(date: any) => {
                setState(prevState => ({
                  ...prevState,
                  isDatePickerVisible: false,
                  [state.selectionData.fieldName]:
                    { value: Utility.dateObjectToDefaultFormat(date) },
                }));

              }}
            />
          </View>
        </KeyboardAwareScrollView>
        <ActionSheet
          ref={ref => (_actionSheet = ref)}
          width={DeviceInfo.isTablet() ? '65%' : '100%'}
          actions={state.actionSheet.list}
          onActionClick={onActionItemClicked.bind(this)}
        />
      </SafeAreaView>
      <BottomPicker
        ref={bottomPicker}
        onItemSelect={(selectedItem: ActionSheetItem) => {
          let fieldName = state.selectionData.fieldName;
          if (state.selectionData.isFromMultipleDropDown) {
            let date: Date = new Date();
            date.setFullYear(parseInt(selectedItem.text));
            setState(prevState => ({
              ...prevState,
              [fieldName]: {
                ...state[fieldName],
                [selectedItem.key]: Utility.dateObjectToDefaultFormat(date),
              },
              error: {
                ...state.error,
                [fieldName]: { error: false, message: '' },
              }
            }));

          } else {
            setState(prevState => ({
              ...prevState,
              [fieldName]: { [selectedItem.key]: selectedItem.text },
              error: {
                ...state.error,
                [fieldName]: { error: false, message: '' },
              },
            }));

          }

        }}
        actions={state.selectionData.actions}
        value={state.selectionData.selectionValue}
        selectedValues={state.selectionData.selectedValues}
        selectionType={state.selectionData.selectionType}
        fieldName={state.selectionData.fieldName}
        fullscreen={true}
        label={state.selectionData.label}
        maxLimit={state.selectionData.maxLimit}
        isFromMultipleDropDown={
          state.selectionData.isFromMultipleDropDown
        }
        fieldNameOfMultipleDropDown={
          state.selectionData.fieldNameOfMultipleDropDown
        }
        saveSelectedValues={(selectedValueObjects: any) => {
          let fieldName = state.selectionData.fieldName;
          setState(prevState => ({
            ...prevState,
            [fieldName]: selectedValueObjects,
            error: {
              ...state.error,
              [fieldName]: { error: false, message: '' },
            },
          }));
          StateData = state;
          //showConsoleLog(ConsoleType.LOG,state)
        }}
        multipleValuesComponent={true}
      />
    </View>
  );

}

const ImageActions: Array<ImageSelectionSheetItem> = [
  { index: 0, text: 'Capture from Camera', image: action_camera },
  { index: 1, text: 'Upload from Gallery', image: action_picture },
  { index: 2, text: 'Cancel', image: action_close },
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

export default MutilpleValueEdit;