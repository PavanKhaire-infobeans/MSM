import { DeviceEventEmitter } from 'react-native';
import { getValue, Storage } from '../../common/constants';
import EventManager from '../../common/eventManager';
import { Account, LoginStore } from '../../common/loginStore';
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

export class ProfileDataModel {
  basicInfo: BasicInfo = {
    first_name: '',
    last_name: '',
    birthday: '',
    relationship_status: '',
    profilePicUri: '',
    coverPicUri: '',
    isProfilePicAvailable: false,
    isCoverPicAvailable: false,
  };

  contactInfo: ContactInfo = {
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
  };

  allFormSections: Array<FormSection> = [];
  basicInfoSection: FormSection = { heading: '', fields: [] };
  contactInfoSection: FormSection = { heading: '', fields: [] };

  constructor() { }

  // updates value in profile data
  updateValues(profileDetails: any) {
    this.allFormSections = [];
    for (let key in profileDetails) {
      let heading = '';
      let fields = [];
      let subSections: Object = getValue(profileDetails, [key]);
      if (subSections.hasOwnProperty('children')) {
        subSections = getValue(subSections, ['children']);
        for (let keys in subSections) {
          let currentField = getValue(subSections, [keys]);
          let allKeys = Object.keys(currentField);
          if (allKeys.length > 0) {
            let currentKey = allKeys[0];
            heading = getValue(currentField, [currentKey, 'label']);
            fields = getValue(currentField, [currentKey, 'all_fields']);
            let formSection = this.updateAllFormSections(heading, fields);
            if (key == 'group_basic_info') {
              switch (currentKey) {
                case 'group_user_contact_info':
                  this.contactInfoSection = formSection;
                  this.updateContactInfo(fields);
                  break;
                case 'group_user_basic_info':
                  this.basicInfoSection = formSection;
                  this.updateBasicInfo(fields);
                  break;
                default:
              }
            } else {
              this.allFormSections.push(formSection);
            }
          }
        }
      } else {
        heading = getValue(subSections, ['label']);
        fields = getValue(subSections, ['all_fields']);
        if (key == 'group_profile_picture') {
          this.updateProfilePicSection(fields);
        } else {
          let formSection = this.updateAllFormSections(heading, fields);
          this.allFormSections.push(formSection);
        }
      }
    }
    //console.log(this.allFormSections);
  }

  updateProfilePicSection = async(fields: any) => {
    for (let key in fields) {
      let currentField = fields[key];
      if (currentField.field_name == 'field_profile_picture') {
        let currentValue = getValue(currentField, ['current_value']);
        if (currentValue && typeof currentValue != 'undefined') {
          for (let ky in currentField.current_value) {
            this.basicInfo.profilePicUri =
              currentField.current_value[ky].thumbnail_preview;
            Account.selectedData().profileImage =
              Utility.getFileURLFromPublicURL(
                currentField.current_value[ky].thumbnail90,
              );
            console.log(Utility.getFileURLFromPublicURL(
              currentField.current_value[ky].thumbnail90,
            ))
            await Storage.save("user_profile_image", Utility.getFileURLFromPublicURL( currentField.current_value[ky].thumbnail90,))
            EventManager.callBack(kProfilePicUpdated);
            DeviceEventEmitter.emit(kProfilePicUpdated);
            this.basicInfo.isProfilePicAvailable = true;
          }
        } else {
          this.basicInfo.profilePicUri = '';
          Account.selectedData().profileImage = '';
          EventManager.callBack(kProfilePicUpdated);
          DeviceEventEmitter.emit(kProfilePicUpdated);
          this.basicInfo.isProfilePicAvailable = false;
        }
        Storage.save('userData', Account.selectedData());
        LoginStore.updateProfilePic(Account.selectedData());
      } else if (currentField.field_name == 'field_cover_photo') {
        let currentValue = getValue(currentField, ['current_value']);
        if (currentValue && typeof currentValue != 'undefined') {
          if (currentValue && typeof currentValue != 'undefined') {
            for (let ky in currentField.current_value) {
              this.basicInfo.coverPicUri = currentField.current_value[ky].uri;
              this.basicInfo.isCoverPicAvailable = true;
            }
          }
        } else {
          this.basicInfo.coverPicUri = '';
          this.basicInfo.isCoverPicAvailable = false;
        }
      }
    }
  }
  //update academicEducationFields
  updateAllFormSections(heading: string, fields: []) {
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
          //console.log("DOB Granulaity before", granularityObj);
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
        //console.log("DOB Granulaity after", granularity);
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
            //console.log("Object is array")
            if (currentObj.length > 0) {
              let ky = Object.keys(currentObj[0]);
              if (ky.length > 0) {
                default_value = { [currentObj[0][ky[0]]]: currentObj[0][ky[0]] };
              }
            }
          } else {
            for (let keys in currentObj) {
              let mappedValue = values[keys];
              default_value = { ...default_value, [keys]: mappedValue };
            }
          }
        }
      } else if (type == 'text_textfield') {
        default_value = getValue(
          this.valueForObjectArray(getValue(currentField, ['current_value'])),
          ['value'],
        );
      } else if (type == 'date_select') {
        let valueObject = this.valueForObjectArray(
          getValue(currentField, ['current_value']),
        );
        let value = getValue(valueObject, ['value'])
          ? getValue(valueObject, ['value'])
          : '';
        let value2 = getValue(valueObject, ['value2'])
          ? getValue(valueObject, ['value2'])
          : '';
        default_value = { value: value, value2: value2 };
      }
      //console.log("fields : ", fields);
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
    let formSection: FormSection = { heading: heading, fields: structuredFields };
    return formSection;
  }

  //udpates basic info of the user
  updateBasicInfo(fieldsForBasicInfo: any) {
    for (let keys in fieldsForBasicInfo) {
      let currentObject = fieldsForBasicInfo[keys];
      let value: any = '';

      let fetchedValue = getValue(currentObject, ['current_value']);
      if (fetchedValue) {
        let val: any = getValue(this.valueForObjectArray(fetchedValue), [
          'value',
        ]);
        if (val) {
          value = val;
        }
      }
      switch (currentObject.field_name) {
        case 'field_first_name':
          this.basicInfo.first_name = value;
          break;
        case 'field_last_name':
          this.basicInfo.last_name = value;
          break;
        case 'field_birthday':
          let date_format = currentObject.date_settings.date_format;
          let date_value = Utility.dateAccordingToFormat(
            value,
            currentObject.date_settings.date_format,
          ); //getValue(this.valueForObjectArray(getValue(currentObject, ["current_value"])), ["value"])
          this.basicInfo.birthday = date_value != '' ? date_value : '';
          break;
        case 'field_relationship_satus':
          this.basicInfo.relationship_status = value;
          break;
      }
    }
    Account.selectedData().firstName = this.basicInfo.first_name;
    Account.selectedData().lastName = this.basicInfo.last_name;
    EventManager.callBack(kProfilePicUpdated);
    DeviceEventEmitter.emit(kProfilePicUpdated);
  }

  //udpates contact info of the user
  updateContactInfo(fieldsForContactInfo: any) {
    for (let keys in fieldsForContactInfo) {
      let currentContactObject = fieldsForContactInfo[keys];
      let value: any = '';

      let fetchedValue = getValue(currentContactObject, ['current_value']);
      //console.log("fetched val", fetchedValue)
      if (fetchedValue) {
        let val: any = getValue(this.valueForObjectArray(fetchedValue), [
          'value',
        ]);
        //console.log("fetched val", val)
        if (val) {
          value = val;
        }
      }
      //console.log("Value", value)
      switch (currentContactObject.field_name) {
        case 'field_secondary_email_address':
          this.contactInfo.secondary_email_address = value;
          break;
        case 'field_maiden_name':
          this.contactInfo.maiden_name = value;
          break;
        case 'field_country':
          let countryName = getValue(currentContactObject, ['current_value']);
          if (countryName) {
            let ky = Object.keys(countryName);
            if (ky.length > 0) {
              let values = getValue(currentContactObject, ['values']);
              if (values) {
                let mappedValue = values[ky[0]];
                this.contactInfo.country = mappedValue;
              }
            }
          }
          break;
        case 'field_address_line_1':
          this.contactInfo.address_line_1 = value;
          break;
        case 'field_address_line_2':
          this.contactInfo.address_line_2 = value;
          break;
        case 'field_city':
          this.contactInfo.city = value;
          break;
        case 'field_state':
          this.contactInfo.state = value;
          break;
        case 'field_zipcode':
          this.contactInfo.zipcode = value;
          break;
        case 'field_phone':
          this.contactInfo.phone = value;
          break;
      }
    }
    let validArray: string[] = [];
    let completeAddressValues = [
      this.contactInfo.address_line_1,
      this.contactInfo.address_line_2,
      this.contactInfo.city,
      this.contactInfo.state,
      this.contactInfo.country,
      this.contactInfo.zipcode,
    ];

    completeAddressValues.forEach(str => {
      if (str != '') {
        validArray.push(str);
      }
    });
    this.contactInfo.completeAddress = validArray.join(', ');
  }

  valueForObjectArray(currentObject: Array<any>) {
    if (currentObject ? currentObject.length > 0 : 0) {
      return currentObject[0];
    }
    return null;
  }
}
