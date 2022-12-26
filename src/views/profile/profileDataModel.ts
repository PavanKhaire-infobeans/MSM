import {useEffect, useMemo, useState} from 'react';
import {DeviceEventEmitter} from 'react-native';
import {getValue, Storage} from '../../common/constants';
import EventManager from '../../common/eventManager';
import {Account, LoginStore} from '../../common/loginStore';
import Utility from '../../common/utility';

export const kProfilePicUpdated = 'ProfilePicUpdated';

export type ContactInfo = {
  secondary_email_address: string;
  maiden_name: string;
  country: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  zipcode: any;
  phone: any;
  completeAddress: string;
};

export type BasicInfo = {
  first_name: string;
  last_name: string;
  birthday: any;
  relationship_status: string;
  profilePicUri: any;
  coverPicUri: '';
  isProfilePicAvailable: boolean;
  isCoverPicAvailable: boolean;
};

type FormSection = {
  heading: string;
  fields: Array<FieldStruct>;
};

type ProfilePicSection = {
  label: string;
  field_name: string;
  type: string;
  filename: string;
  uri: string;
};

export interface FieldStruct {
  label: string;
  type:
    | 'sub'
    | 'sub-single'
    | 'date_select'
    | 'options_select'
    | 'text_textfield';
  default_value?: object;
  module?: 'date' | 'options' | 'text' | 'taxonomy';
  multipleSelection?: MultipleSelection;
  field_name?: string;
  required?: boolean;
  values?: any;
  granularity?: {};
  valueWhileEditing?: any;
  maxLimit: number;
}

export enum MultipleSelection {
  Unlimited = -1,
  Single = 0,
  MultipleWithMaxLimit = 1,
  MultipleWithLimit = 2,
}

const useProfileData = (userProfileDetails) => {
  const [allFormSections, setAllFormSections] = useState([]);
  const [basicInfoSection, setBasicInfoSection] = useState({
    heading: '',
    fields: [],
  });
  const [contactInfoSection, setContactInfoSection] = useState({
    heading: '',
    fields: [],
  });
  const [basicInfo, setBasicInfo] = useState({
    first_name: '',
    last_name: '',
    birthday: '',
    relationship_status: '',
  });
  const [userProfilePicInfo, setUserProfilePicInfo] = useState({
    profilePicUri: '',
    isProfilePicAvailable: false,
  });
  const [userCoverPicInfo, setUserCoverPicInfo] = useState({
    coverPicUri: '',
    isCoverPicAvailable: false,
  });
  const [contactInfo, setContactInfo] = useState({
    secondary_email_address: '',
    maiden_name: '',
    country: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zipcode: '',
    phone: '',
    completeAddress: '',
  });

  useEffect(()=>{
    updateValues(userProfileDetails);
  },[userProfileDetails])

  // updates value in profile data
  const updateValues = (profileDetails: any) => {
    let formSections = [...allFormSections]
    for (const key in profileDetails) {
      let subSections: Object = getValue(profileDetails, [key]);
      if (subSections.hasOwnProperty('children')) {
        subSections = getValue(subSections, ['children']);
        for (const keys in subSections) {
          const currentField = getValue(subSections, [keys]);
          const allKeys = Object.keys(currentField);
          if (allKeys.length > 0) {
            const currentKey = allKeys[0];
            const heading = getValue(currentField, [currentKey, 'label']);
            const fields = getValue(currentField, [currentKey, 'all_fields']);
            const formSection = updateAllFormSections(heading, fields);
            if (key == 'group_basic_info') {
              switch (currentKey) {
                case 'group_user_contact_info':
                  setContactInfoSection(formSection);
                  updateContactInfo(fields);
                  break;
                case 'group_user_basic_info':
                  setBasicInfoSection(formSection);
                  updateBasicInfo(fields);
                  break;
                default:
              }
            } 
            else {
              formSections.push(formSection);
              setAllFormSections(formSections);
            }
          }
        }
      } else {
        const heading = getValue(subSections, ['label']);
        const fields = getValue(subSections, ['all_fields']);
        if (key == 'group_profile_picture') {
          updateProfilePicSection(fields);
        } else {
          const formSection = updateAllFormSections(heading, fields);
          formSections.push(formSection);
          setAllFormSections(formSections);
        }
      }
    }
  };

  const updateProfilePicSection = (fields: any) => {
    for (let key in fields) {
      let currentField = fields[key];
      if (currentField.field_name == 'field_profile_picture') {
        let currentValue = getValue(currentField, ['current_value']);
        if (currentValue && typeof currentValue != 'undefined') {
          for (let ky in currentField.current_value) {
            Account.selectedData().profileImage =
              Utility.getFileURLFromPublicURL(
                currentField.current_value[ky].thumbnail90,
              );
            Storage.save(
              'user_profile_image',
              Utility.getFileURLFromPublicURL(
                currentField.current_value[ky].thumbnail90,
              ),
            );
            EventManager.callBack(kProfilePicUpdated);
            DeviceEventEmitter.emit(kProfilePicUpdated);
            setUserProfilePicInfo({
              ...userProfilePicInfo,
              profilePicUri: currentField.current_value[ky].thumbnail_preview,
              isProfilePicAvailable: true
            });
          }
        } else {
          Account.selectedData().profileImage = '';
          EventManager.callBack(kProfilePicUpdated);
          DeviceEventEmitter.emit(kProfilePicUpdated);
          setUserProfilePicInfo({
            ...userProfilePicInfo,
            profilePicUri: '',
            isProfilePicAvailable: false,
          });
        }
        Storage.save('userData', Account.selectedData());
        LoginStore.updateProfilePic(Account.selectedData());
      } else if (currentField.field_name == 'field_cover_photo') {
        let currentValue = getValue(currentField, ['current_value']);
        if (currentValue && typeof currentValue != 'undefined') {
          if (currentValue && typeof currentValue != 'undefined') {
            for (let ky in currentField.current_value) {
              setUserCoverPicInfo({
                ...userCoverPicInfo,
                coverPicUri: currentField.current_value[ky].uri,
                isCoverPicAvailable: true,
              });
            }
          }
        } else {
          setUserCoverPicInfo({
            ...userCoverPicInfo,
            coverPicUri: '',
            isCoverPicAvailable: false,
          });
        }
      }
    }
  };

  //update academicEducationFields
  const updateAllFormSections = (heading: string, fields: []) => {
    let structuredFields: Array<FieldStruct> = [];
    for (let keys in fields) {
      let currentField = getValue(fields, [keys]);
      let cardinality = getValue(currentField, ['cardinality']);
      let multiple = getValue(currentField, ['multiple']);
      let multipleSelection: MultipleSelection;
      if (cardinality == 1 && multiple == 0) {
        multipleSelection = MultipleSelection.Single;
      } else if (cardinality > 1 && multiple == 0) {
        multipleSelection = MultipleSelection.MultipleWithMaxLimit;
      } else if (cardinality > 1 && multiple == 1) {
        multipleSelection = MultipleSelection.MultipleWithLimit;
      } else if (cardinality == -1 && multiple == 1) {
        multipleSelection = MultipleSelection.Unlimited;
      }
      let granularity = {};
      if (currentField.hasOwnProperty('date_settings')) {
        let granularityObj = getValue(currentField.date_settings, [
          'granularity',
        ]);
        if (granularityObj) {
          let toDateRequired =
            getValue(currentField.date_settings, ['todate']) || '';
          let dateFormat =
            getValue(currentField.date_settings, ['date_format']) || '';
          granularity = {
            ...granularityObj,
            todate: toDateRequired,
            date_format: dateFormat,
          };
        }
      }
      let default_value = {};
      let values = getValue(currentField, ['values']);
      let type = getValue(currentField, ['settings', 'type']);
      if (
        type == 'options_select' ||
        type == 'options' ||
        type == 'options_buttons'
      ) {
        default_value = {};
        let currentObj = getValue(currentField, ['current_value']);
        if (currentObj && typeof currentObj != 'undefined') {
          if (Array.isArray(currentObj)) {
            if (currentObj.length > 0) {
              let ky = Object.keys(currentObj[0]);
              if (ky.length > 0) {
                default_value = {[currentObj[0][ky[0]]]: currentObj[0][ky[0]]};
              }
            }
          } else {
            for (let keys in currentObj) {
              let mappedValue = values[keys];
              default_value = {...default_value, [keys]: mappedValue};
            }
          }
        }
      } else if (type == 'text_textfield') {
        default_value = getValue(
          valueForObjectArray(getValue(currentField, ['current_value'])),
          ['value'],
        );
      } else if (type == 'date_select') {
        let valueObject = valueForObjectArray(
          getValue(currentField, ['current_value']),
        );
        let value = getValue(valueObject, ['value'])
          ? getValue(valueObject, ['value'])
          : '';
        let value2 = getValue(valueObject, ['value2'])
          ? getValue(valueObject, ['value2'])
          : '';
        default_value = {value: value, value2: value2};
      }
      let structuredField: FieldStruct = {
        label: getValue(currentField, ['label']),
        type: type,
        module: getValue(currentField, ['settings', 'module']),
        multipleSelection: multipleSelection,
        maxLimit: cardinality ? cardinality : 0,
        default_value: default_value,
        field_name: getValue(currentField, ['field_name']),
        required: getValue(currentField, ['required']) ? true : false,
        values: values,
        granularity: granularity,
        valueWhileEditing: values,
      };
      structuredFields.push(structuredField);
    }
    let formSection: FormSection = {heading: heading, fields: structuredFields};
    return formSection;
  };

  //udpates basic info of the user
  const updateBasicInfo = (fieldsForBasicInfo: any) => {
    let currentBasicInfo = {...basicInfo};
    for (let keys in fieldsForBasicInfo) {
      let currentObject = fieldsForBasicInfo[keys];
      let value: any = '';

      let fetchedValue = getValue(currentObject, ['current_value']);
      if (fetchedValue) {
        let val: any = getValue(valueForObjectArray(fetchedValue), ['value']);
        if (val) {
          value = val;
        }
      }
      switch (currentObject.field_name) {
        case 'field_first_name':
          currentBasicInfo.first_name = value;
          break;
        case 'field_last_name':
          currentBasicInfo.last_name = value;
          break;
        case 'field_birthday':
          let date_value = Utility.dateAccordingToFormat(
            value,
            currentObject.date_settings.date_format,
          );
          currentBasicInfo.birthday = date_value != '' ? date_value : '';
          break;
        case 'field_relationship_satus':
          currentBasicInfo.relationship_status = value;
          break;
      }
    }

    setBasicInfo({
      ...basicInfo,
      ...currentBasicInfo,
    });
    Account.selectedData().firstName = basicInfo.first_name;
    Account.selectedData().lastName = basicInfo.last_name;
    EventManager.callBack(kProfilePicUpdated);
    DeviceEventEmitter.emit(kProfilePicUpdated);
  };

  //udpates contact info of the user
  const updateContactInfo = (fieldsForContactInfo: any) => {
    for (let keys in fieldsForContactInfo) {
      const currentContactObject = fieldsForContactInfo[keys];
      let value: any = '';
      let fetchedValue = getValue(currentContactObject, ['current_value']);
      if (fetchedValue) {
        const val: any = getValue(valueForObjectArray(fetchedValue), ['value']);
        if (val) {
          value = val;
        }
      }
      switch (currentContactObject.field_name) {
        case 'field_secondary_email_address':
          setContactInfo({
            ...contactInfo,
            secondary_email_address: value,
          });
          break;
        case 'field_maiden_name':
          setContactInfo({
            ...contactInfo,
            maiden_name: value,
          });
          break;
        case 'field_country':
          const countryName = getValue(currentContactObject, ['current_value']);
          if (countryName) {
            let ky = Object.keys(countryName);
            if (ky.length > 0) {
              let values = getValue(currentContactObject, ['values']);
              if (values) {
                let mappedValue = values[ky[0]];
                setContactInfo({
                  ...contactInfo,
                  country: mappedValue,
                });
              }
            }
          }
          break;
        case 'field_address_line_1':
          setContactInfo({
            ...contactInfo,
            address_line_1: value,
          });
          break;
        case 'field_address_line_2':
          setContactInfo({
            ...contactInfo,
            address_line_2: value,
          });
          break;
        case 'field_city':
          setContactInfo({
            ...contactInfo,
            city: value,
          });
          break;
        case 'field_state':
          setContactInfo({
            ...contactInfo,
            state: value,
          });
          break;
        case 'field_zipcode':
          setContactInfo({
            ...contactInfo,
            zipcode: value,
          });
          break;
        case 'field_phone':
          setContactInfo({
            ...contactInfo,
            phone: value,
          });
          break;
      }
    }
    let validArray: string[] = [];
    let completeAddressValues = [
      contactInfo.address_line_1,
      contactInfo.address_line_2,
      contactInfo.city,
      contactInfo.state,
      contactInfo.country,
      contactInfo.zipcode,
    ];

    completeAddressValues.forEach(str => {
      if (str != '') {
        validArray.push(str);
      }
    });
    setContactInfo({
      ...contactInfo,
      completeAddress: validArray.join(', '),
    });
  };

  const valueForObjectArray = (currentObject: Array<any>) => {
    if (currentObject ? currentObject.length > 0 : 0) {
      return currentObject[0];
    }
    return null;
  };

  return {
    basicInfo,
    allFormSections,
    basicInfoSection,
    contactInfoSection,
    contactInfo,
    userCoverPicInfo,
    userProfilePicInfo,
    setContactInfo,
    setAllFormSections,
  };
};

export default useProfileData;
