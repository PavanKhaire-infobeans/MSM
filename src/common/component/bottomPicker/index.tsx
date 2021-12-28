import React from 'react';
import {
  View,
  Image,
  Animated,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Alert,
  Keyboard,
  Platform,
  StatusBar,
  DeviceEventEmitter,
  TouchableHighlight,
} from 'react-native';
import Text from '../Text';
import DeviceInfo from 'react-native-device-info';
import {fontSize, Colors} from '../../constants';
const {height} = Dimensions.get('screen');
import {
  checkbox,
  checkbox_active,
  action_close,
  icon_close_black,
} from '../../../images';
import SearchBar from '../../../common/component/SearchBar';
import {ToastMessage} from '../Toast';
import ProfileEditHeader from '../profileEditHeader';
import {StyleSheet} from 'react-native';
import MessageDialogue from '../messageDialogue';

export type ActionSheetItem = {
  key: any;
  text: string;
  disabled?: boolean;
};

type Props = {
  actions: Array<ActionSheetItem>;
  width?: string;
  value: any;
  onItemSelect: (item: ActionSheetItem) => void;
  selectionType?: any;
  fullscreen?: boolean;
  fieldName?: string;
  label?: string;
  selectionLimit?: number;
  saveSelectedValues?: (selectedValues: any) => void;
  selectedValues?: any;
  maxLimit?: number;
  title?: string;
  isFromMultipleDropDown?: boolean;
  fieldNameOfMultipleDropDown?: string;
  needHideCallback?: boolean;
  hideCallBack?: () => void;
};

type State = {
  showError: boolean;
  errorMessage: any;
  selectedIndex: any;
  bottom: any;
  hidden: boolean;
  selectedValueObject: any;
  allSelected: boolean;
  selectedValues: Array<any>;
  isMultiSelect: boolean;
  selectedValueObjects: Object;
  filteredList: Array<ActionSheetItem>;
  isSearching: boolean;
  searchText: string;
  availableHeight: any;
};

export default class BottomPicker extends React.Component<Props, State> {
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;
  listRef: any;
  static defaultProps: Props = {
    label: '',
    actions: [],
    width: '100%',
    value: '',
    selectionType: 0,
    onItemSelect: () => {},
    fullscreen: false,
    selectionLimit: 1,
    saveSelectedValues: () => {},
    selectedValues: {},
    maxLimit: 1,
  };

  state: State = {
    bottom: new Animated.Value(-height),
    hidden: false,
    allSelected: false,
    selectedValues: [],
    isMultiSelect: false,
    selectedValueObjects: {},
    filteredList: [],
    isSearching: false,
    searchText: '',
    availableHeight: 0,
    selectedValueObject: [],
    selectedIndex: 0,
    errorMessage: '',
    showError: false,
  };

  showPicker = () => {
    this.initializePreselectedValues();
    let height = Dimensions.get('window').height;
    if (Platform.OS === 'android') {
      height = height - 20;
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._keyboardDidHide,
      );
    }
    this.setState(
      {
        availableHeight: height,
        filteredList: this.props.actions,
        hidden: false,
        showError: false,
        isMultiSelect: this.props.selectionType ? true : false,
      },
      () => {
        Animated.timing(this.state.bottom, {
          toValue: 0,
          duration: 200,
        }).start();
      },
    );
    // setTimeout(() => {
    //     if(!this.state.isMultiSelect && this.props.selectedValues.length == 1){
    //         let currentList = [...this.state.filteredList]
    //         let currentItem = currentList.filter((element : any) => element.text == this.props.selectedValues[0])
    //         let initialIndex = this.state.filteredList.indexOf(currentItem[0])
    //         if(initialIndex > -1){
    //             this.listRef.scrollToOffset({animated: false, offset : 56 * index})
    //         }
    //     }
    // }, 100);
  };

  hidePicker = () => {
    Animated.timing(this.state.bottom, {
      toValue: -height,
      duration: 200,
    }).start(() => {
      setTimeout(() => {
        this.setState({hidden: true});
      }, 20);
    });
    this.state.allSelected = false;
    this.state.searchText = '';
    this.state.isSearching = false;
    if (this.props.needHideCallback) {
      this.props.hideCallBack();
    }
  };

  initializePreselectedValues() {
    let selectionValues = [];
    let selectedValueObject = {};
    for (let keys in this.props.selectedValues) {
      selectionValues.push(keys);
      let strKey = `${[keys]}`;
      selectedValueObject = {
        ...selectedValueObject,
        [strKey]: this.props.selectedValues[keys],
      };
    }
    if (selectionValues.length == this.props.actions.length) {
      this.setState({
        allSelected: true,
      });
    }
    this.setStateForSelectedIndex(selectionValues, selectedValueObject);
  }
  saveSelectedValues = () => {
    this.hidePicker();
    this.props.saveSelectedValues(this.state.selectedValueObjects);
  };

  _keyboardDidShow = (e: any) => {
    let height = Dimensions.get('window').height - e.endCoordinates.height - 20;
    this.setState({
      availableHeight: height,
    });
  };

  _keyboardDidHide = (e: any) => {
    this.setState({
      availableHeight: Dimensions.get('window').height - 20,
    });
  };

  onItemClickInMultiSelect = (selectedIndex: string, text: string) => {
    let currentSelectedValues = this.state.selectedValues;
    let currentSelectedValueObj: any = this.state.selectedValueObjects;
    let index = currentSelectedValues.indexOf(selectedIndex);
    this.setState({showError: false});
    if (index >= 0) {
      delete currentSelectedValueObj[selectedIndex];
      currentSelectedValues.splice(index, 1);
      this.setStateForAllSelected(false);
    } else {
      if (
        this.props.maxLimit > 1 &&
        currentSelectedValues.length >= this.props.maxLimit
      ) {
        this.setState({
          showError: true,
          errorMessage:
            'You cannot put more than ' +
            this.props.maxLimit +
            ' values in the ' +
            this.props.label +
            ' field',
        });
        // MessageDialogue.showMessage()
        // ToastMessage();
      } else {
        currentSelectedValues.push(selectedIndex);
        currentSelectedValueObj = {
          ...currentSelectedValueObj,
          [selectedIndex]: text,
        };
      }
    }
    if (this.state.allSelected && this.props.fullscreen) {
      this.setStateForAllSelected(false);
    }
    this.allSelected(this.state.filteredList, currentSelectedValues);
    this.setStateForSelectedIndex(
      currentSelectedValues,
      currentSelectedValueObj,
    );
  };

  saveCurrentItemValue = (key: string, text: string, disabled: boolean) => {
    if (disabled) {
      // Do noting
    } else {
      if (this.props.isFromMultipleDropDown) {
        this.props.onItemSelect({
          key: [this.props.fieldNameOfMultipleDropDown],
          text,
        });
        this.hidePicker();
      } else if (!this.state.isMultiSelect) {
        this.props.onItemSelect({key, text});
        this.hidePicker();
      } else {
        this.onItemClickInMultiSelect(key, text);
      }
    }
  };

  selectAll = () => {
    let selectedValues = this.state.selectedValues;
    let selectedValueObject: any = this.state.selectedValueObjects;
    if (this.state.allSelected) {
      this.setStateForAllSelected(false);
      this.state.filteredList.forEach(element => {
        let index = selectedValues.indexOf(element.key);
        if (index >= 0) {
          selectedValues.splice(index, 1);
          // selectedValueObject = selectedValueObject.filter((x: any, i: any) => i != index)
          delete selectedValueObject[element.key];
        }
        //console.log(selectedValueObject);
      });
      this.setStateForSelectedIndex(selectedValues, selectedValueObject);
    } else {
      this.setStateForAllSelected(true);
      this.state.filteredList.forEach(element => {
        if (selectedValues.indexOf(element.key) < 0) {
          selectedValues.push(element.key);
          selectedValueObject = {
            ...selectedValueObject,
            [element.key]: element.text,
          };
        }
      });
      this.setStateForSelectedIndex(selectedValues, selectedValueObject);
    }
  };

  setStateForAllSelected = (value: boolean) => {
    this.setState({
      allSelected: value,
    });
  };

  setStateForSelectedIndex = (value: any, selectedValueObject: any) => {
    this.setState({
      selectedValues: value,
      selectedValueObjects: selectedValueObject,
    });
  };

  selectNone = () => {
    this.setStateForAllSelected(!this.state.allSelected);
    this.setStateForSelectedIndex([], []);
  };

  createHeader = () => {
    return <ProfileEditHeader />;
  };
  searchInFilteredList = () => {
    if (this.state.isSearching) {
      let filteredList: Array<ActionSheetItem> = [];
      if (this.state.searchText.trim() == '') {
        filteredList = this.props.actions;
      } else {
        filteredList = [];
        this.props.actions.forEach(element => {
          let index = element.text
            .toLocaleLowerCase()
            .indexOf(this.state.searchText.trim().toLocaleLowerCase());
          if (index >= 0) {
            filteredList.push(element);
          }
        });
      }
      this.allSelected(filteredList, this.state.selectedValues);
      this.setState({
        filteredList: filteredList,
      });
    } else {
      this.allSelected(this.props.actions, this.state.selectedValues);
      this.setState({
        filteredList: this.props.actions,
      });
    }
  };

  allSelected = (filteredList: any, selectedObjects: any) => {
    let selectedValue = selectedObjects;
    let allElementsPresent = true;
    if (filteredList.length > 0) {
      filteredList.forEach((element: any) => {
        if (selectedValue.indexOf(element.key) < 0) {
          allElementsPresent = false;
        }
      });
    } else {
      allElementsPresent = false;
    }
    this.setStateForAllSelected(allElementsPresent);
  };
  render() {
    var deviceHeight = this.state.availableHeight;
    if (this.state.hidden || this.props.actions.length == 0) {
      return <View style={{height: 0, width: 0}} />;
    } else {
      return (
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'transparent',
            bottom: 0,
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}
          onStartShouldSetResponder={() => true}
          onResponderStart={this.hidePicker}>
          <StatusBar
            barStyle={'dark-content'}
            backgroundColor={Colors.NewThemeColor}
          />
          <Animated.View
            style={[
              styles.animatedView,
              Platform.OS === 'ios'
                ? styles.halfScreenAnimatedView
                : this.props.fullscreen
                ? styles.fullScreenAnimatedView
                : styles.halfScreenAnimatedView,
              {height: this.props.fullscreen ? deviceHeight : 290},
            ]}
            onStartShouldSetResponder={() => true}>
            {this.props.fullscreen ? (
              <View>
                {/* showRightText={this.state.isMultiSelect} rightText="Done" fieldName={this.props.label} closeCurrentView={() => this.hidePicker()} saveValues={() => { this.saveSelectedValues() }} */}
                {Platform.OS === 'ios' ? (
                  <View
                    style={{
                      paddingTop: DeviceInfo.hasNotch() ? 30 : 15,
                      borderBottomColor: 'rgba(0, 0, 0, 0.24)',
                      borderBottomWidth: 2,
                    }}>
                    <ProfileEditHeader
                      showRightText={this.state.isMultiSelect}
                      heading={this.props.label}
                      cancelAction={() => this.hidePicker()}
                      rightText={'Done'}
                      saveValues={() => {
                        this.saveSelectedValues();
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      height: 54,
                      borderBottomColor: 'rgba(0, 0, 0, 0.24)',
                      borderBottomWidth: 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <ProfileEditHeader
                      showRightText={this.state.isMultiSelect}
                      heading={this.props.label}
                      cancelAction={() => this.hidePicker()}
                      rightText={'Done'}
                      saveValues={() => {
                        this.saveSelectedValues();
                      }}
                    />
                  </View>
                )}

                {this.state.showError && (
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: Colors.ErrorColor,
                      justifyContent: 'center',
                      paddingLeft: 10,
                    }}>
                    <Text
                      numberOfLines={2}
                      style={{
                        ...fontSize(14),
                        lineHeight: 16,
                        textAlign: 'left',
                        color: '#fff',
                        paddingBottom: 5,
                        paddingTop: 5,
                      }}>
                      {this.state.errorMessage}
                    </Text>
                  </View>
                )}
                <SearchBar
                  onChangeText={(text: string) => {
                    this.setState({searchText: text}, () => {
                      this.searchInFilteredList();
                    });
                  }}
                  onClearField={() => {
                    this.setState({searchText: '', isSearching: false}, () => {
                      this.searchInFilteredList();
                    });
                  }}
                  placeholder="Search community here..."
                  onFocus={() => {
                    this.setState({isSearching: true}, () => {
                      this.searchInFilteredList();
                    });
                  }}
                  showCancelClearButton={false}
                  style={{backgroundColor: '#F3F3F3'}}
                  onSearchButtonPress={() => {}}
                />
              </View>
            ) : (
              <View
                style={{
                  borderColor: '#aaaaaa',
                  borderBottomWidth: 1,
                  width: '100%',
                  height: 45,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <View
                  style={{flex: 1, justifyContent: 'center', paddingLeft: 16}}>
                  <Text
                    style={{
                      fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
                      ...fontSize(18),
                      color: '#3D3D3D',
                    }}>
                    Choose Your {this.props.title}
                  </Text>
                </View>
                <View style={{height: '100%'}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.hidePicker();
                    }}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: 11,
                      paddingRight: 16,
                    }}>
                    <Image source={icon_close_black} />
                    {/* <Text style={{ ...fontSize(14), padding: 5 }}>{"Cancel"}</Text> */}
                  </TouchableOpacity>
                </View>
                {/* {this.state.isMultiSelect &&
                                    <View style={{ position: "absolute", height: "100%", right: 0 }}>
                                        <TouchableOpacity onPress={() => { this.saveSelectedValues() }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ ...fontSize(14), padding: 5 }}>{"Save"}</Text>
                                        </TouchableOpacity>
                                    </View>} */}
              </View>
            )}
            {this.state.isMultiSelect &&
              this.state.filteredList.length > 0 &&
              this.props.maxLimit <= 1 && (
                <TouchableOpacity
                  onPress={() => {
                    this.selectAll();
                  }}>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        paddingStart: 5,
                        height: 56,
                      }}>
                      <Image
                        style={{marginLeft: 15}}
                        source={
                          this.state.allSelected ? checkbox_active : checkbox
                        }
                        resizeMode="contain"
                      />
                      <Text style={{marginLeft: 15, ...fontSize(16)}}>
                        {'Select All'}
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: '#ccc',
                        height: 1,
                        width: '100%',
                      }}
                    />
                  </View>
                </TouchableOpacity>
              )}
            <FlatList
              ref={ref => (this.listRef = ref)}
              data={this.state.filteredList}
              initialScrollIndex={this.state.selectedIndex}
              keyExtractor={(_, index: number) => `${index}`}
              onScroll={() => {
                Keyboard.dismiss();
              }}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    backgroundColor: '#ccc',
                    height: 1,
                    width: '100%',
                    marginRight: 15,
                    marginLeft: 15,
                  }}
                />
              )}
              renderItem={({item: data}: {item: ActionSheetItem}) => {
                return (
                  <TouchableHighlight
                    underlayColor={data.disabled ? 'transparent' : '#cccccc99'}
                    onPress={() => {
                      this.saveCurrentItemValue(
                        data.key,
                        data.text,
                        data.disabled ? true : false,
                      );
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: !this.props.fullscreen
                          ? 'center'
                          : 'flex-start',
                        alignItems: 'center',
                        padding: 10,
                        paddingStart: 5,
                        height: 56,
                        backgroundColor:
                          this.props.value == data.key ||
                          (!this.state.isMultiSelect &&
                            this.state.selectedValues.length > 0 &&
                            this.state.selectedValues[0] == data.key)
                            ? `${Colors.ThemeColor}23`
                            : '#fff',
                      }}>
                      {this.state.isMultiSelect && (
                        <Image
                          style={{marginLeft: 15}}
                          source={
                            this.state.selectedValues.indexOf(data.key) >= 0
                              ? checkbox_active
                              : checkbox
                          }
                          resizeMode="contain"
                        />
                      )}
                      <Text
                        style={{
                          marginLeft: 15,
                          ...fontSize(16),
                          color: data.disabled ? '#D3D3D3' : 'black',
                        }}>
                        {data.text}
                      </Text>
                    </View>
                  </TouchableHighlight>
                );
              }}
            />
          </Animated.View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  animatedView: {
    backgroundColor: 'white',
    maxWidth: '100%',
    width: '100%',
    position: 'absolute',
  },
  fullScreenAnimatedView: {
    top: 0,
  },
  halfScreenAnimatedView: {
    borderRadius: 15,
    bottom: -10,
  },
});
