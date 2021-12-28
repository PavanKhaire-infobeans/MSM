import {group} from 'console';
import React from 'react';
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
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import MultipleDropDownSelector from '../../common/component/multipleDropDownView';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import {TabItems} from '../../common/component/TabBarIcons';
import TextNew from '../../common/component/Text';
import {Colors, fontSize, Size} from '../../common/constants';
import {Account} from '../../common/loginStore';
import {action_close, check, icon_arrow, plus} from '../../images';
import {
  GET_MEMORY_LIST,
  GET_TIMELINE_LIST,
  SET_RECENT_FILTERS,
  SET_TIMELINE_FILTERS,
  ListType,
} from './dashboardReducer';
import NavigationBar from './NavigationBar';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import BottomPicker, {
  ActionSheetItem,
} from '../../common/component/bottomPicker';
import EventManager from '../../common/eventManager';
import {ScrollView} from 'react-native-gesture-handler';

type Props = {[x: string]: any};
type State = {[x: string]: any};
enum fieldType {
  to = 'To',
  from = 'From',
}
class FilterScreen extends React.Component<Props> {
  state: State = {
    fromDate: Account.selectedData().start_year,
    toDate: Account.selectedData().end_year,
    filters: {},
    externalCueVisibility: true,
    mystoriesVisibility: true,
    friendCircleVisibility: true,
    selectionData: {},
  };
  eventLoader: EventManager;
  bottomPicker: React.RefObject<BottomPicker> = React.createRef<BottomPicker>();

  onOptionSelection(field: any) {
    Keyboard.dismiss();
    var actions: ActionSheetItem[] = [];
    for (let i = new Date().getFullYear(); i >= 1917; i--) {
      actions.push({key: i, text: i});
    }
    this.setState(
      {
        selectionData: {
          ...this.state.selectionData,
          actions,
          fieldName: field,
          label: field,
          selectedValues:
            field == fieldType.to ? this.state.toDate : this.state.fromDate,
        },
      },
      () => {
        this.bottomPicker.current &&
          this.bottomPicker.current.showPicker &&
          this.bottomPicker.current.showPicker();
      },
    );
  }
  constructor(props: Props) {
    super(props);
  }

  filterItemClicked = (obj: any, key: any, value1: any) => {
    let value = value1 == 1 ? 0 : 1;
    let filters = {...this.state.filters};
    if (obj.id == 'all') {
      filters.allSelected.value = value;
      for (let key in filters.mystories) {
        if (key == 'groups') continue;
        filters.mystories[key].value = value;
      }
    }

    if (
      this.props.currentScreen != ListType.Recent &&
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
    this.setState({filters: filters});
  };

  componentDidMount = () => {
    this.setState({
      fromDate: Account.selectedData().start_year,
      toDate: Account.selectedData().end_year,
      filters:
        this.props.currentScreen == ListType.Recent
          ? this.props.filterDataRecent
          : this.props.filterDataTimeline,
    });
    this.eventLoader = EventManager.addListener('loadingDone', () => {
      loaderHandler.hideLoader();
      Actions.pop();
    });
  };

  componentWillUnmount = () => {
    this.eventLoader.removeListener();
  };

  applyFilters = () => {
    Account.selectedData().end_year = this.state.toDate;
    Account.selectedData().start_year = this.state.fromDate;
    this.props.setFilterData(
      this.props.currentScreen == ListType.Recent
        ? SET_RECENT_FILTERS
        : SET_TIMELINE_FILTERS,
      this.state.filters,
    );
    loaderHandler.showLoader();
    setTimeout(() => {
      this.props.fetchMemoryList(
        this.props.currentScreen == ListType.Recent
          ? GET_MEMORY_LIST
          : GET_TIMELINE_LIST,
        {
          type:
            this.props.currentScreen == ListType.Recent
              ? ListType.Recent
              : ListType.Timeline,
          isLoading: true,
          filters: this.state.filters,
        },
      );
    }, 100);
  };

  bottomPickerSelection = (selectedItem: any) => {
    if (this.state.selectionData.fieldName == fieldType.to) {
      this.setState({toDate: selectedItem.text});
    } else {
      this.setState({fromDate: selectedItem.text});
    }
  };

  render() {
    return (
      <View
        style={{
          height: Dimensions.get('window').height,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }}>
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <NavigationHeaderSafeArea
            heading={'Filters'}
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
          <ScrollView style={{flex: 1, marginBottom: 30}}>
            <View style={{justifyContent: 'space-between'}}>
              <View>
                {this.props.currentScreen == ListType.Timeline && (
                  <View style={{padding: 16}}>
                    <TextNew style={{fontWeight: '500', ...fontSize(18)}}>
                      Memories from
                    </TextNew>
                    <MultipleDropDownSelector
                      view1Value={this.state.fromDate}
                      view2Value={this.state.toDate}
                      view1Title="From"
                      view2Title="To"
                      onOptionSelected={(selectedFrom: string) =>
                        this.onOptionSelection(selectedFrom)
                      }
                    />
                  </View>
                )}
                <View>
                  <TouchableHighlight
                    underlayColor={'none'}
                    onPress={() =>
                      this.setState({
                        mystoriesVisibility: !this.state.mystoriesVisibility,
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
                              rotate: this.state.mystoriesVisibility
                                ? '-90deg'
                                : '90deg',
                            },
                          ],
                        }}
                        source={icon_arrow}
                      />
                    </View>
                  </TouchableHighlight>
                  {this.state.mystoriesVisibility && (
                    <View>
                      {this.state.filters && this.state.filters.mystories && (
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                          <TouchableHighlight
                            underlayColor={'none'}
                            onPress={() =>
                              this.filterItemClicked(
                                this.state.filters.allSelected,
                                '',
                                this.state.filters.allSelected.value,
                              )
                            }
                            style={[
                              styles.filterItem,
                              {
                                backgroundColor:
                                  this.state.filters.allSelected.value == 1
                                    ? Colors.selectedFilter
                                    : Colors.filterBG,
                              },
                            ]}>
                            <View style={{flexDirection: 'row'}}>
                              <Image
                                source={
                                  this.state.filters.allSelected.value == 1
                                    ? check
                                    : plus
                                }
                                style={{
                                  width: 15,
                                  height: 15,
                                  resizeMode: 'contain',
                                  alignSelf: 'center',
                                  justifyContent: 'center',
                                  marginRight: 5,
                                  marginBottom: 3,
                                }}></Image>
                              <Text
                                style={[
                                  styles.filterText,
                                  {
                                    color:
                                      this.state.filters.allSelected.value == 1
                                        ? Colors.TextColor
                                        : Colors.TextColor,
                                  },
                                ]}>
                                {this.state.filters.allSelected.name}
                              </Text>
                            </View>
                          </TouchableHighlight>
                          {Object.entries(this.state.filters.mystories).map(
                            ([key, value], i) => {
                              if (key == 'groups') return null;
                              return (
                                <TouchableHighlight
                                  underlayColor={'none'}
                                  onPress={() =>
                                    this.filterItemClicked(
                                      this.state.filters.mystories,
                                      key,
                                      value.value,
                                    )
                                  }
                                  style={[
                                    styles.filterItem,
                                    {
                                      backgroundColor:
                                        value.value == 1
                                          ? Colors.selectedFilter
                                          : Colors.filterBG,
                                    },
                                  ]}>
                                  <View style={{flexDirection: 'row'}}>
                                    <Image
                                      source={value.value == 1 ? check : plus}
                                      style={{
                                        width: 15,
                                        height: 15,
                                        resizeMode: 'contain',
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        marginRight: 5,
                                        marginBottom: 3,
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
                          {this.props.currentScreen != ListType.Recent && (
                            <TouchableHighlight
                              underlayColor={'none'}
                              onPress={() =>
                                this.filterItemClicked(
                                  this.state.filters.cueSelected,
                                  '',
                                  this.state.filters.cueSelected.value,
                                )
                              }
                              style={[
                                styles.filterItem,
                                {
                                  backgroundColor:
                                    this.state.filters.cueSelected.value == 1
                                      ? Colors.selectedFilter
                                      : Colors.filterBG,
                                },
                              ]}>
                              <View style={{flexDirection: 'row'}}>
                                <Image
                                  source={
                                    this.state.filters.cueSelected.value == 1
                                      ? check
                                      : plus
                                  }
                                  style={{
                                    width: 15,
                                    height: 15,
                                    resizeMode: 'contain',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    marginRight: 5,
                                    marginBottom: 3,
                                  }}></Image>
                                <Text
                                  style={[
                                    styles.filterText,
                                    {
                                      color:
                                        this.state.filters.cueSelected.value ==
                                        1
                                          ? Colors.TextColor
                                          : Colors.TextColor,
                                    },
                                  ]}>
                                  {this.state.filters.cueSelected.name}
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
                  <TouchableHighlight
                    underlayColor={'none'}
                    onPress={() =>
                      this.setState({
                        friendCircleVisibility:
                          !this.state.friendCircleVisibility,
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
                              rotate: this.state.friendCircleVisibility
                                ? '-90deg'
                                : '90deg',
                            },
                          ],
                        }}
                        source={icon_arrow}
                      />
                    </View>
                  </TouchableHighlight>
                  {this.state.friendCircleVisibility && (
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                      {this.state.filters &&
                        this.state.filters.mystories &&
                        this.state.filters.mystories.groups &&
                        this.state.filters.mystories.groups.map(
                          (obj: any, index: any) => {
                            return (
                              <TouchableHighlight
                                underlayColor={'none'}
                                onPress={() =>
                                  this.filterItemClicked(
                                    this.state.filters.mystories.groups,
                                    index,
                                    obj.value,
                                  )
                                }
                                style={[
                                  styles.filterItem,
                                  {
                                    backgroundColor:
                                      obj.value == 1
                                        ? Colors.selectedFilter
                                        : Colors.filterBG,
                                  },
                                ]}>
                                <View style={{flexDirection: 'row'}}>
                                  <Image
                                    source={obj.value == 1 ? check : plus}
                                    style={{
                                      width: 15,
                                      height: 15,
                                      resizeMode: 'contain',
                                      alignSelf: 'center',
                                      justifyContent: 'center',
                                      marginRight: 5,
                                      marginBottom: 3,
                                    }}></Image>
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

                {this.props.currentScreen != ListType.Recent && (
                  <View>
                    <TouchableHighlight
                      underlayColor={'none'}
                      onPress={() =>
                        this.setState({
                          externalCueVisibility:
                            !this.state.externalCueVisibility,
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
                                rotate: this.state.externalCueVisibility
                                  ? '-90deg'
                                  : '90deg',
                              },
                            ],
                          }}
                          source={icon_arrow}
                        />
                      </View>
                    </TouchableHighlight>

                    {this.state.externalCueVisibility && (
                      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        {this.state.filters &&
                          this.state.filters.external_cues &&
                          this.state.filters.external_cues.categories.map(
                            (obj: any, index: any) => {
                              return (
                                <TouchableHighlight
                                  underlayColor={'none'}
                                  onPress={() =>
                                    this.filterItemClicked(
                                      this.state.filters.external_cues
                                        .categories,
                                      index,
                                      obj.value,
                                    )
                                  }
                                  style={[
                                    styles.filterItem,
                                    {
                                      backgroundColor:
                                        obj.value == 1
                                          ? Colors.selectedFilter
                                          : Colors.filterBG,
                                    },
                                  ]}>
                                  <View style={{flexDirection: 'row'}}>
                                    <Image
                                      source={obj.value == 1 ? check : plus}
                                      style={{
                                        width: 15,
                                        height: 15,
                                        resizeMode: 'contain',
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        marginRight: 5,
                                        marginBottom: 3,
                                      }}></Image>
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
              {/* <TouchableHighlight underlayColor={"none"} onPress={()=> this.applyFilters()} style={{width: '100%', height: 40, alignItems : 'center',justifyContent: 'center'}}>
                        <View style={{width: '80%', backgroundColor : Colors.ThemeColor, borderRadius: 50, height: 40, margin: 50, justifyContent: 'center', alignItems : 'center'}}>
                                <Text style={{...fontSize(18), color: '#fff'}}>Apply Filters</Text>
                        </View>
                    </TouchableHighlight> */}
            </View>
          </ScrollView>
          <View style={styles.bottomView}>
            <TouchableHighlight
              underlayColor={'none'}
              onPress={() => this.applyFilters()}>
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
            </TouchableHighlight>
            {/* <View style={{height: 50, position : 'absolute', bottom : -50, width : '100%', backgroundColor : '#fff'}}/> */}
          </View>
        </SafeAreaView>
        <BottomPicker
          ref={this.bottomPicker}
          onItemSelect={(selectedItem: ActionSheetItem) =>
            this.bottomPickerSelection(selectedItem)
          }
          value={this.state.selectionData.selectedValues}
          actions={this.state.selectionData.actions}
          selectedValues={this.state.selectionData.selectedValues}
          label={this.state.selectionData.label}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.NewLightCommentHeader,
    padding: 16,
  },
  filterHeaderText: {
    ...fontSize(16),
    fontWeight: '500',
    color: Colors.TextColor,
  },
  filterItem: {
    margin: 10,
    padding: 12,
    paddingBottom: 7,
    paddingTop: 7,
    borderRadius: 5,
  },
  filterText: {
    ...fontSize(16),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    paddingLeft: 6,
    paddingTop: 2,
    paddingBottom: 5,
    paddingRight: 5,
  },
  bottomView: {
    height: Platform.OS == 'ios' ? 70 : 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 0.5,
    borderColor: '#fff',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
    setFilterData: (type: any, payload: any) =>
      dispatch({type: type, payload: payload}),
    fetchMemoryList: (type: any, payload: any) =>
      dispatch({type: type, payload: payload}),
  };
};

export default connect(mapState, mapDispatch)(FilterScreen);
