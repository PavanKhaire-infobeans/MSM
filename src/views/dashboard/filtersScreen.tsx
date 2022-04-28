import { group } from 'console';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  TouchableHighlight,
  Image,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import MultipleDropDownSelector from '../../common/component/multipleDropDownView';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import { TabItems } from '../../common/component/TabBarIcons';
import TextNew from '../../common/component/Text';
import { Colors, fontSize, Size } from '../../common/constants';
import { Account } from '../../common/loginStore';
import { action_close, check, icon_arrow, plus } from '../../images';
import {
  GET_MEMORY_LIST,
  GET_TIMELINE_LIST,
  SET_RECENT_FILTERS,
  SET_TIMELINE_FILTERS,
  ListType,
  SET_FILTERS_NAME,
  JUMP_TO_TO_DATE,
  JUMP_TO_FROM_DATE
} from './dashboardReducer';
import NavigationBar from './NavigationBar';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import BottomPicker, {
  ActionSheetItem,
} from '../../common/component/bottomPicker';
import EventManager from '../../common/eventManager';
import { ScrollView } from 'react-native-gesture-handler';
import { lock, users, globe, usercheck } from './../../../app/images'

type Props = { [x: string]: any };
type State = { [x: string]: any };
enum fieldType {
  to = 'To',
  from = 'From',
}
const FilterScreen = (props: Props) => {

  const [state, setState] = useState({
    fromDate: Account.selectedData().start_year,
    toDate: Account.selectedData().end_year,
    filters: {},
    externalCueVisibility: true,
    mystoriesVisibility: true,
    friendCircleVisibility: true,
    selectionData: {},
  });
  let eventLoader: EventManager;
  let bottomPicker: React.RefObject<BottomPicker> = React.useRef<BottomPicker>();

  const onOptionSelection = (field: any) => {
    Keyboard.dismiss();
    var actions: ActionSheetItem[] = [];
    for (let i = new Date().getFullYear(); i >= 1917; i--) {
      actions.push({ key: i, text: i });
    }

    setState(prevState => ({
      ...prevState,
      selectionData: {
        ...state.selectionData,
        actions,
        fieldName: field,
        label: field,
        selectedValues:
          field == fieldType.to ? state.toDate : state.fromDate,
      }
    }));
    setTimeout(() => {
      bottomPicker.current &&
        bottomPicker.current.showPicker &&
        bottomPicker.current.showPicker();
    }, 500);

  }

  const filterItemClicked = (obj: any, key: any, value1: any) => {
    let value = value1 == 1 ? 0 : 1;
    let filters: any = { ...state.filters };
    if (obj.id == 'all') {
      filters.allSelected.value = value;
      for (let key in filters.mystories) {
        if (key == 'groups') continue;
        filters.mystories[key].value = value;
      }
    }

    if (
      props.currentScreen != ListType.Recent &&
      (obj.id == 'all' || obj.id == 'msm')
    ) {
      filters.cueSelected.value = value;
      for (let key in filters.external_cues.categories) {
        filters.external_cues.categories[key].value = value;
      }
    }

    if (obj.id == 'all' || key == 'my_friends') {
      filters.mystories.my_friends.value = value;
      for (let key in filters.mystories.groups) {
        filters.mystories.groups[key].value = value;
      }
    }

    if (!(obj.id == 'all' || obj.id == 'msm' || key == 'my_friends')) {
      obj[key].value = value;
    }

    //check for all selections and unselection
    let all_external_selected = true;
    let all_stories = true;
    let all_groups = true;

    for (let key in filters.mystories.groups) {
      if (filters.mystories.groups[key].value == 0) {
        all_groups = false;
        break;
      }
    }
    filters.mystories.my_friends.value = all_groups ? 1 : 0;

    for (let key in filters.mystories) {
      if (key == 'groups') continue;
      if (filters.mystories[key].value == 0) {
        all_stories = false;
        break;
      }
    }

    if (filters.external_cues) {
      for (let key in filters.external_cues.categories) {
        if (filters.external_cues.categories[key].value == 0) {
          all_external_selected = false;
          break;
        }
      }
      filters.cueSelected.value = all_external_selected ? 1 : 0;
    }

    filters.allSelected.value =
      all_external_selected && all_stories && all_groups ? 1 : 0;

    setState(prevState => ({
      ...prevState,
      filters
    }));
    console.log("obj.id ?> ",obj.id)
    if (obj.id == 'all') {
      if (value) {
        applyFilters(filters)
      }
    }
    else if (obj.id == undefined) {
        applyFilters(filters)
    }

  };

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      fromDate: Account.selectedData().start_year,
      toDate: Account.selectedData().end_year,
      filters:
        props.currentScreen == ListType.Recent
          ? props.filterDataRecent
          : props.filterDataTimeline,
    }));

    eventLoader = EventManager.addListener('loadingDone', () => {
      loaderHandler.hideLoader();
      Actions.pop();
    });
    return () => eventLoader.removeListener();
  }, [])

  const applyFilters = (filters) => {
    Account.selectedData().end_year = state.toDate;
    Account.selectedData().start_year = state.fromDate;
    props.setFilterData(
      props.currentScreen == ListType.Recent
        ? SET_RECENT_FILTERS
        : SET_TIMELINE_FILTERS,
      filters,
    );
    loaderHandler.showLoader();
    // setTimeout(() => {
      props.fetchMemoryList(
        props.currentScreen == ListType.Recent
          ? GET_MEMORY_LIST
          : GET_TIMELINE_LIST,
        {
          type:
            props.currentScreen == ListType.Recent
              ? ListType.Recent
              : ListType.Timeline,
          isLoading: true,
          filters: filters,
        },
      );
    // }, 100);
  };

  const bottomPickerSelection = (selectedItem: any) => {
    if (state.selectionData.fieldName == fieldType.to) {
      setState(prevState => ({
        ...prevState,
        toDate: selectedItem.text
      }));
      props.setToDate(selectedItem.text)
    } else {
      setState(prevState => ({
        ...prevState,
        fromDate: selectedItem.text
      }));
      props.setFromDate(selectedItem.text)
    }
  };

  return (
    <View
      style={{
        height: Dimensions.get('window').height,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <NavigationHeaderSafeArea
          // heading={'Filters'}
          height="80"
          heading={''}
          showCommunity={false}
          cancelAction={() => Actions.pop()}
          showRightText={false}
          isWhite={true}
          backIcon={action_close}
        />
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={Colors.NewThemeColor}
        />
        <ScrollView style={{ flex: 1, marginBottom: 30 }}>
          <View style={{ justifyContent: 'space-between' }}>
            <View>
              {props.currentScreen == ListType.Timeline && (
                <View style={{ padding: 16 }}>
                  <TextNew style={{ fontWeight: '500', fontFamily: 'Inter', color: Colors.newTextColor, ...fontSize(18) }}>
                    Memories from
                  </TextNew>
                  <MultipleDropDownSelector
                    view1Value={state.fromDate}
                    view2Value={state.toDate}
                    view1Title="From"
                    view2Title="To"
                    onOptionSelected={(selectedFrom: string) =>
                      onOptionSelection(selectedFrom)
                    }
                  />
                </View>
              )}
              <View style={{ justifyContent: 'space-evenly', alignItems: 'center' }}>
                {/* <TouchableHighlight
                    underlayColor={'none'}
                    onPress={() =>
                      setState({
                        mystoriesVisibility: !state.mystoriesVisibility,
                      })
                    }>
                    <View style={styles.filterHeader}>
                      <TextNew style={styles.filterHeaderText}>
                        My Stories Matter
                      </TextNew>
                      <Image
                        style={{
                          transform: [
                            {
                              rotate: state.mystoriesVisibility
                                ? '-90deg'
                                : '90deg',
                            },
                          ],
                        }}
                        source={icon_arrow}
                      />
                    </View>
                  </TouchableHighlight> */}
                <TextNew style={styles.filterHeaderText}>
                  Whose memories would you like to view?
                </TextNew>
                {state.mystoriesVisibility && (
                  <View>
                    {state.filters && state.filters.mystories && (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <TouchableHighlight
                          underlayColor={'none'}
                          onPress={() => {
                            filterItemClicked(
                              state.filters.allSelected,
                              '',
                              state.filters.allSelected.value,
                            )
                            // applyFilters();
                            props.setFiltersName(state.filters.allSelected.name)
                          }}
                          style={[
                            styles.filterItem,
                            {
                              backgroundColor:
                                state.filters.allSelected.value == 1
                                  ? Colors.selectedFilterbg
                                  : Colors.unSelectedFilterbg,
                              borderColor: Colors.filterborder,
                              borderWidth: state.filters.allSelected.value == 1 ? 1 : 0
                            },
                          ]}>
                          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                              source={
                                // state.filters.allSelected.value == 1
                                //   ? check: 
                                // plus
                                globe
                              }
                              style={{
                                // width: 15,
                                // height: 15,
                                resizeMode: 'contain',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                // marginRight: 5,
                                marginBottom: 5,
                              }}></Image>
                            <Text
                              style={[
                                styles.filterText,
                                {
                                  color:
                                    state.filters.allSelected.value == 1
                                      ? Colors.TextColor
                                      : Colors.TextColor,
                                },
                              ]}>
                              {state.filters.allSelected.name}
                            </Text>

                          </View>
                        </TouchableHighlight>
                        {Object.entries(state.filters.mystories).map(
                          ([key, value]: any, i) => {
                            if (key == 'groups') return null;
                            return (
                              <TouchableHighlight
                                underlayColor={'none'}
                                onPress={() => {
                                  filterItemClicked(
                                    state.filters.mystories,
                                    key,
                                    value.value,
                                  )
                                  // applyFilters();
                                  props.setFiltersName(value.name)
                                }}
                                style={[
                                  styles.filterItem,
                                  {
                                    backgroundColor:
                                      value.value == 1
                                        ? Colors.selectedFilterbg
                                        : Colors.unSelectedFilterbg,
                                    borderColor: Colors.filterborder,
                                    borderWidth: value.value == 1 ? 1 : 0
                                  },
                                ]}>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                                  <Image
                                    source={value.name == 'Me' ? lock : value.name == 'My Friends' ? usercheck : value.name == 'Non Friends' ? users : value.name == 'Close Friends' ? users : globe}
                                    // source={value.value == 1 ? check : plus}
                                    style={{
                                      // width: 15,
                                      // height: 15,
                                      resizeMode: 'contain',
                                      alignSelf: 'center',
                                      justifyContent: 'center',
                                      // marginRight: 5,
                                      marginBottom: 5,
                                    }}></Image>
                                  <Text
                                    style={[
                                      styles.filterText,
                                      {
                                        color:
                                          value.value == 1
                                            ? Colors.TextColor
                                            : Colors.TextColor,
                                      },
                                    ]}>
                                    {value.name}
                                  </Text>

                                </View>
                              </TouchableHighlight>
                            );
                          },
                        )}
                        {props.currentScreen != ListType.Recent && (
                          <TouchableHighlight
                            underlayColor={'none'}
                            onPress={() => {
                              filterItemClicked(
                                state.filters.cueSelected,
                                '',
                                state.filters.cueSelected.value,
                              )
                              // applyFilters();
                              props.setFiltersName(state.filters.cueSelected.name)
                            }}
                            style={[
                              styles.filterItem,
                              {
                                backgroundColor:
                                  state.filters.cueSelected.value == 1
                                    ? Colors.selectedFilterbg
                                    : Colors.unSelectedFilterbg,
                                borderColor: Colors.filterborder,
                                borderWidth: state.filters.cueSelected.value == 1 ? 1 : 0
                              },
                            ]}>
                            <View style={{ flexDirection: 'column' }}>
                              <Image
                                source={
                                  state.filters.cueSelected.value == 1
                                    ? globe
                                    : globe
                                }
                                style={{
                                  // width: 15,
                                  // height: 15,
                                  resizeMode: 'contain',
                                  alignSelf: 'center',
                                  justifyContent: 'center',
                                  // marginRight: 5,
                                  marginBottom: 5,
                                }}
                              ></Image>
                              <Text
                                style={[
                                  styles.filterText,
                                  {
                                    color:
                                      state.filters.cueSelected.value ==
                                        1
                                        ? Colors.TextColor
                                        : Colors.TextColor,
                                    textAlign: 'center'
                                  },
                                ]}>
                                {state.filters.cueSelected.name}
                              </Text>
                            </View>
                          </TouchableHighlight>
                        )}
                      </View>
                    )}
                  </View>
                )}
              </View>
              <View>
                {/* <TouchableHighlight
                    underlayColor={'none'}
                    onPress={() =>
                      setState({
                        friendCircleVisibility:
                          !state.friendCircleVisibility,
                      })
                    }>
                    <View style={styles.filterHeader}>
                      <TextNew style={styles.filterHeaderText}>
                        Friend Circles
                      </TextNew>
                      <Image
                        style={{
                          transform: [
                            {
                              rotate: state.friendCircleVisibility
                                ? '-90deg'
                                : '90deg',
                            },
                          ],
                        }}
                        source={icon_arrow}
                      />
                    </View>
                  </TouchableHighlight> */}
                {state.friendCircleVisibility && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {state.filters &&
                      state.filters.mystories &&
                      state.filters.mystories.groups &&
                      state.filters.mystories.groups.map(
                        (obj: any, index: any) => {
                          return (
                            <TouchableHighlight
                              underlayColor={'none'}
                              onPress={() => {
                                filterItemClicked(
                                  state.filters.mystories.groups,
                                  index,
                                  obj.value,
                                )
                                // applyFilters();
                                props.setFiltersName(obj.name)
                              }}
                              style={[
                                styles.filterItem,
                                {
                                  backgroundColor:
                                    obj.value == 1
                                      ? Colors.selectedFilterbg
                                      : Colors.unSelectedFilterbg,
                                  borderColor: Colors.filterborder,
                                  borderWidth: obj.value == 1 ? 1 : 0
                                },
                              ]}>
                              <View style={{ flexDirection: 'column' }}>
                                <Image
                                  source={(obj.name == 'Close Friends') || (obj.name == 'New Friends') ? users : globe}
                                  // source={obj.value == 1 ? check : plus}

                                  style={{
                                    // width: 15,
                                    // height: 15,
                                    resizeMode: 'contain',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    // marginRight: 5,
                                    marginBottom: 5,
                                  }}></Image>
                                <Text
                                  style={[
                                    styles.filterText,
                                    {
                                      color:
                                        obj.value == 1
                                          ? Colors.TextColor
                                          : Colors.TextColor,
                                      textAlign: 'center'
                                    },
                                  ]}>
                                  {obj.name}
                                </Text>
                              </View>
                            </TouchableHighlight>
                          );
                        },
                      )}
                  </View>
                )}
              </View>

              {props.currentScreen != ListType.Recent && (
                <View>
                  {/* <TouchableHighlight
                      underlayColor={'none'}
                      onPress={() =>
                        setState({
                          externalCueVisibility:
                            !state.externalCueVisibility,
                        })
                      }>
                      <View style={styles.filterHeader}>
                        <TextNew style={styles.filterHeaderText}>
                          Cue Categories
                        </TextNew>
                        <Image
                          style={{
                            transform: [
                              {
                                rotate: state.externalCueVisibility
                                  ? '-90deg'
                                  : '90deg',
                              },
                            ],
                          }}
                          source={icon_arrow}
                        />
                      </View>
                    </TouchableHighlight> */}

                  {state.externalCueVisibility && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {state.filters &&
                        state.filters.external_cues &&
                        state.filters.external_cues.categories.map(
                          (obj: any, index: any) => {
                            return (
                              <TouchableHighlight
                                underlayColor={'none'}
                                onPress={() => {
                                  filterItemClicked(
                                    state.filters.external_cues
                                      .categories,
                                    index,
                                    obj.value,
                                  )
                                  // props.setFiltersName(obj.name)
                                }
                                }
                                style={[
                                  styles.filterItem,
                                  {
                                    backgroundColor:
                                      obj.value == 1
                                        ? Colors.selectedFilterbg
                                        : Colors.unSelectedFilterbg,
                                    borderColor: Colors.filterborder,
                                    borderWidth: obj.value == 1 ? 1 : 0
                                  },
                                ]}>
                                <View style={{ flexDirection: 'row' }}>
                                  {/* <Image
                                      source={obj.value == 1 ? check : plus}
                                      style={{
                                        width: 15,
                                        height: 15,
                                        resizeMode: 'contain',
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        marginRight: 5,
                                        marginBottom: 3,
                                      }}></Image> */}
                                  <Text
                                    style={[
                                      styles.filterText,
                                      {
                                        color:
                                          obj.value == 1
                                            ? Colors.TextColor
                                            : Colors.TextColor,
                                      },
                                    ]}>
                                    {obj.name}
                                  </Text>
                                </View>
                              </TouchableHighlight>
                            );
                          },
                        )}
                    </View>
                  )}
                </View>
              )}
            </View>
            {/* <TouchableHighlight underlayColor={"none"} onPress={()=> // applyFilters()} style={{width: '100%', height: 40, alignItems : 'center',justifyContent: 'center'}}>
                        <View style={{width: '80%', backgroundColor : Colors.ThemeColor, borderRadius: 50, height: 40, margin: 50, justifyContent: 'center', alignItems : 'center'}}>
                                <Text style={{...fontSize(18), color: '#fff'}}>Apply Filters</Text>
                        </View>
                    </TouchableHighlight> */}
          </View>
        </ScrollView>
        {/* <View style={styles.bottomView}> */}
        {/* <TouchableHighlight
              underlayColor={'none'}
              onPress={() => // applyFilters()}>
              <View
                style={{
                  backgroundColor: Colors.ThemeColor,
                  width: 300,
                  padding: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                }}>
                <TextNew
                  style={{fontWeight: '400', ...fontSize(16), color: '#fff'}}>
                  Apply Filters
                </TextNew>
              </View>
            </TouchableHighlight> */}
        {/* <View style={{height: 50, position : 'absolute', bottom : -50, width : '100%', backgroundColor : '#fff'}}/> */}
        {/* </View> */}
      </SafeAreaView>
      <BottomPicker
        ref={bottomPicker}
        onItemSelect={(selectedItem: ActionSheetItem) =>
          bottomPickerSelection(selectedItem)
        }
        value={state.selectionData.selectedValues}
        actions={state.selectionData.actions}
        selectedValues={state.selectionData.selectedValues}
        label={state.selectionData.label}
      />
    </View>
  );

}

const styles = StyleSheet.create({
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.NewLightCommentHeader,
    padding: 16,
  },
  filterHeaderText: {
    ...fontSize(19),
    padding: 10,
    fontWeight: '400',
    fontFamily: 'Inter',
    color: Colors.TextColor,
  },
  filterItem: {
    // margin: 10,
    marginLeft: '5%',
    // marginRight:'2%',
    marginTop: '2%',
    marginBottom: '2%',
    padding: 12,
    // paddingBottom: 7,
    // paddingTop: 7,
    height: 100,
    borderRadius: 5,
    width: '42%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    ...fontSize(19),
    fontWeight: '400',
    // fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    paddingLeft: 2,
    paddingTop: 2,
    paddingBottom: 5,
    paddingRight: 5,
    fontFamily: 'Inter'
  },
  bottomView: {
    height: Platform.OS == 'ios' ? 70 : 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 0.5,
    borderColor: '#fff',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 4,
    shadowRadius: 2,
    elevation: 15,
  },
});

const mapState = (state: any) => {
  return {
    filterDataTimeline: state.dashboardReducer.filterDataTimeline,
    filterDataRecent: state.dashboardReducer.filterDataRecent,
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    setFilterData: (type: any, payload: any) => dispatch({ type: type, payload: payload }),
    fetchMemoryList: (type: any, payload: any) => dispatch({ type: type, payload: payload }),
    setFiltersName: (payload: any) => dispatch({ type: SET_FILTERS_NAME, payload: payload }),
    setToDate: (payload: any) => dispatch({ type: JUMP_TO_TO_DATE, payload: payload }),
    setFromDate: (payload: any) => dispatch({ type: JUMP_TO_FROM_DATE, payload: payload }),
    
  };
};

export default connect(mapState, mapDispatch)(FilterScreen);
