import React, {useState} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Platform,
  StatusBar,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import SearchBar from '../../../common/component/SearchBar';
import {checkbox, checkbox_active, icon_close_black} from '../../../images';
import {Colors} from '../../constants';
import ProfileEditHeader from '../profileEditHeader';
import Text from '../Text';
const {height} = Dimensions.get('screen');

import Utility from '../../utility';
import styles from './styles';

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

const BottomPicker = (props: Props) => {
  let keyboardDidShowListener: any;
  let keyboardDidHideListener: any;
  let listRef: any;

  const [state, setState] = useState({
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
  });

  const hidePicker = () => {
    Animated.timing(state.bottom, {
      toValue: -height,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setState(prev => ({...prev, hidden: true}));
      }, 20);
    });
    state.allSelected = false;
    state.searchText = '';
    state.isSearching = false;
    if (props.needHideCallback) {
      props.hideCallBack();
    }
  };

  const initializePreselectedValues = () => {
    let selectionValues = [];
    let selectedValueObject = {};
    for (let keys in props.selectedValues) {
      selectionValues.push(keys);
      let strKey = `${[keys]}`;
      selectedValueObject = {
        ...selectedValueObject,
        [strKey]: props.selectedValues[keys],
      };
    }
    if (selectionValues.length == props.actions.length) {
      setState(prev => ({
        ...prev,
        allSelected: true,
      }));
    }
    setStateForSelectedIndex(selectionValues, selectedValueObject);
  };
  const saveSelectedValues = () => {
    hidePicker();
    props.saveSelectedValues(state.selectedValueObjects);
  };

  const _keyboardDidShow = (e: any) => {
    let height = Dimensions.get('window').height - e.endCoordinates.height - 20;
    setState(prev => ({
      ...prev,
      availableHeight: height,
    }));
  };

  const _keyboardDidHide = () => {
    setState(prev => ({
      ...prev,
      availableHeight: Dimensions.get('window').height - 20,
    }));
  };

  const onItemClickInMultiSelect = (selectedIndex: string, text: string) => {
    let currentSelectedValues = state.selectedValues;
    let currentSelectedValueObj: any = state.selectedValueObjects;
    let index = currentSelectedValues.indexOf(selectedIndex);
    setState(prev => ({...prev, showError: false}));
    if (index >= 0) {
      delete currentSelectedValueObj[selectedIndex];
      currentSelectedValues.splice(index, 1);
      setStateForAllSelected(false);
    } else {
      if (
        props.maxLimit > 1 &&
        currentSelectedValues.length >= props.maxLimit
      ) {
        setState(prev => ({
          ...prev,
          showError: true,
          errorMessage:
            'You cannot put more than ' +
            props.maxLimit +
            ' values in the ' +
            props.label +
            ' field',
        }));
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
    if (state.allSelected && props.fullscreen) {
      setStateForAllSelected(false);
    }
    allSelected(state.filteredList, currentSelectedValues);
    setStateForSelectedIndex(currentSelectedValues, currentSelectedValueObj);
  };

  const saveCurrentItemValue = (
    key: string,
    text: string,
    disabled: boolean,
  ) => {
    if (disabled) {
      // Do noting
    } else {
      if (props.isFromMultipleDropDown) {
        props.onItemSelect({
          key: [props.fieldNameOfMultipleDropDown],
          text,
        });
        hidePicker();
      } else if (!state.isMultiSelect) {
        props.onItemSelect({key, text});
        hidePicker();
      } else {
        onItemClickInMultiSelect(key, text);
      }
    }
  };

  const selectAll = () => {
    let selectedValues = state.selectedValues;
    let selectedValueObject: any = state.selectedValueObjects;
    if (state.allSelected) {
      setStateForAllSelected(false);
      state.filteredList.forEach(element => {
        let index = selectedValues.indexOf(element.key);
        if (index >= 0) {
          selectedValues.splice(index, 1);
          // selectedValueObject = selectedValueObject.filter((x: any, i: any) => i != index)
          delete selectedValueObject[element.key];
        }
        //showConsoleLog(ConsoleType.LOG,selectedValueObject);
      });
      setStateForSelectedIndex(selectedValues, selectedValueObject);
    } else {
      setStateForAllSelected(true);
      state.filteredList.forEach(element => {
        if (selectedValues.indexOf(element.key) < 0) {
          selectedValues.push(element.key);
          selectedValueObject = {
            ...selectedValueObject,
            [element.key]: element.text,
          };
        }
      });
      setStateForSelectedIndex(selectedValues, selectedValueObject);
    }
  };

  const setStateForAllSelected = (value: boolean) => {
    setState(prev => ({
      ...prev,
      allSelected: value,
    }));
  };

  const setStateForSelectedIndex = (value: any, selectedValueObject: any) => {
    setState(prev => ({
      ...prev,
      selectedValues: value,
      selectedValueObjects: selectedValueObject,
    }));
  };

  const searchInFilteredList = () => {
    if (state.isSearching) {
      let filteredList: Array<ActionSheetItem> = [];
      if (state.searchText.trim() == '') {
        filteredList = props.actions;
      } else {
        filteredList = [];
        props.actions.forEach(element => {
          let index = element.text
            .toLocaleLowerCase()
            .indexOf(state.searchText.trim().toLocaleLowerCase());
          if (index >= 0) {
            filteredList.push(element);
          }
        });
      }
      allSelected(filteredList, state.selectedValues);
      setState(prev => ({
        ...prev,
        filteredList: filteredList,
      }));
    } else {
      allSelected(props.actions, state.selectedValues);
      setState(prev => ({
        ...prev,
        filteredList: props.actions,
      }));
    }
  };

  const allSelected = (filteredList: any, selectedObjects: any) => {
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
    setStateForAllSelected(allElementsPresent);
  };

  var deviceHeight = state.availableHeight;
  if (state.hidden || props.actions.length == 0) {
    return <View style={styles.invisibleView} />;
  } else {
    return (
      <View
        style={styles.container}
        onStartShouldSetResponder={() => true}
        onResponderStart={hidePicker}>
        <StatusBar
          barStyle={
            Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
          }
          backgroundColor={Colors.NewThemeColor}
        />
        <Animated.View
          style={[
            styles.animatedView,
            Platform.OS === 'ios'
              ? styles.halfScreenAnimatedView
              : props.fullscreen
              ? styles.fullScreenAnimatedView
              : styles.halfScreenAnimatedView,
            {height: props.fullscreen ? deviceHeight : 290},
          ]}
          onStartShouldSetResponder={() => true}>
          {props.fullscreen ? (
            <View>
              {/* showRightText={state.isMultiSelect} rightText="Done" fieldName={props.label} closeCurrentView={() => hidePicker()} saveValues={() => { saveSelectedValues() }} */}
              {Platform.OS === 'ios' ? (
                <View style={styles.containerFull}>
                  <ProfileEditHeader
                    showRightText={state.isMultiSelect}
                    heading={props.label}
                    cancelAction={() => hidePicker()}
                    rightText={'Done'}
                    saveValues={() => {
                      saveSelectedValues();
                    }}
                  />
                </View>
              ) : (
                <View style={styles.profileEditor}>
                  <ProfileEditHeader
                    showRightText={state.isMultiSelect}
                    heading={props.label}
                    cancelAction={() => hidePicker()}
                    rightText={'Done'}
                    saveValues={() => {
                      saveSelectedValues();
                    }}
                  />
                </View>
              )}

              {state.showError && (
                <View style={styles.errorContainer}>
                  <Text numberOfLines={2} style={styles.errorText}>
                    {state.errorMessage}
                  </Text>
                </View>
              )}
              <SearchBar
                onChangeText={(text: string) => {
                  setState(prev => ({...prev, searchText: text}));
                  searchInFilteredList();
                }}
                onClearField={() => {
                  setState(prev => ({
                    ...prev,
                    searchText: '',
                    isSearching: false,
                  }));
                  searchInFilteredList();
                }}
                placeholder="Search community here..."
                onFocus={() => {
                  setState(prev => ({...prev, isSearching: true}));
                  searchInFilteredList();
                }}
                showCancelClearButton={false}
                style={styles.searchBar}
                onSearchButtonPress={() => {}}
              />
            </View>
          ) : (
            <View style={styles.pickerContainer}>
              <View style={styles.pickerSubContainer}>
                <Text style={styles.pickerText}>Choose Your {props.title}</Text>
              </View>
              <View style={styles.height100}>
                <TouchableOpacity
                  onPress={() => {
                    hidePicker();
                  }}
                  style={styles.imageClose}>
                  <Image source={icon_close_black} />
                  {/* <Text style={{ ...fontSize(14), padding: 5 }}>{"Cancel"}</Text> */}
                </TouchableOpacity>
              </View>
              {/* {state.isMultiSelect &&
                                    <View style={{ position: "absolute", height: "100%", right: 0 }}>
                                        <TouchableOpacity onPress={() => { saveSelectedValues() }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ ...fontSize(14), padding: 5 }}>{"Save"}</Text>
                                        </TouchableOpacity>
                                    </View>} */}
            </View>
          )}
          {state.isMultiSelect &&
            state.filteredList.length > 0 &&
            props.maxLimit <= 1 && (
              <TouchableOpacity
                onPress={() => {
                  selectAll();
                }}>
                <View>
                  <View style={styles.checkboxContainer}>
                    <Image
                      style={styles.imageMargin}
                      source={state.allSelected ? checkbox_active : checkbox}
                      resizeMode="contain"
                    />
                    <Text style={styles.sellectAllText}>{'Select All'}</Text>
                  </View>

                  <View style={styles.emptyView} />
                </View>
              </TouchableOpacity>
            )}
          <FlatList
            ref={ref => (listRef = ref)}
            data={state.filteredList}
            initialScrollIndex={state.selectedIndex}
            keyExtractor={(_, index: number) => `${index}`}
            onScroll={() => {
              Keyboard.dismiss();
            }}
            ItemSeparatorComponent={() => (
              <View style={styles.renderSeparator} />
            )}
            renderItem={({item: data}: {item: ActionSheetItem}) => {
              return (
                <TouchableHighlight
                  underlayColor={data.disabled ? 'transparent' : '#cccccc99'}
                  onPress={() => {
                    saveCurrentItemValue(
                      data.key,
                      data.text,
                      data.disabled ? true : false,
                    );
                  }}>
                  <View
                    style={[
                      styles.flatlistContainer,
                      {
                        justifyContent: !props.fullscreen
                          ? 'center'
                          : 'flex-start',
                        backgroundColor:
                          props.value == data.key ||
                          (!state.isMultiSelect &&
                            state.selectedValues.length > 0 &&
                            state.selectedValues[0] == data.key)
                            ? `${Colors.unSelectedFilterbg}23`
                            : '#fff',
                      },
                    ]}>
                    {state.isMultiSelect && (
                      <Image
                        style={styles.imageMargin}
                        source={
                          state.selectedValues.indexOf(data.key) >= 0
                            ? checkbox_active
                            : checkbox
                        }
                        resizeMode="contain"
                      />
                    )}
                    <Text style={styles.sellectAllText}>{data.text}</Text>
                  </View>
                </TouchableHighlight>
              );
            }}
          />
        </Animated.View>
      </View>
    );
  }
};

BottomPicker.defaultProps = {
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

export default BottomPicker;
