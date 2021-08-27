import React from 'react';
import {
  TouchableHighlight,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import TextNew from '../../common/component/Text';
import {Colors, fontSize} from '../../common/constants';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';

type Props = {[x: string]: any};
type State = {[x: string]: any};
enum fieldType {
  to = 'To',
  from = 'From',
}
export default class JumpToScreen extends React.Component<Props> {
  allMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  monthsSecond = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  state = {
    selectedMonths: [],
    selectedYear: 2020,
    selectedMonth: '',
  };
  constructor(props: Props) {
    super(props);
  }

  componentDidMount = () => {
    var parts = this.props.memoryDate.split(' ');
    let selectedMonths = [];
    this.props.jumpToYears.forEach((element: any, index: any) => {
      element.forEach((element1: any) => {
        if (element1.year == parts[1]) {
          this.setState({
            selectedMonth: parts[0],
            selectedYear: parseInt(parts[1]),
            selectedMonths: element1.months,
          });
        }
      });
    });
  };

  checkVisibility = (index: any) => {
    let years: any = [];
    let yearsAtIndex = this.props.jumpToYears[index];
    yearsAtIndex.forEach((element: any) => {
      years.push(element.year);
    });
    return years.indexOf(this.state.selectedYear) >= 0;
  };

  selectYear = (selectedObj: any) => {
    if (selectedObj.year != this.state.selectedYear) {
      let selectedMonth = '';
      this.allMonths.forEach((element: any) => {
        if (selectedObj.months.indexOf(element) >= 0 && selectedMonth == '') {
          selectedMonth = element;
        }
      });
      this.setState({
        selectedYear: selectedObj.year,
        selectedMonths: selectedObj.months,
        selectedMonth: selectedMonth,
      });
    }
  };

  jumpToClicked = () => {
    if (this.state.selectedMonth != '' && this.state.selectedMonth.length > 0) {
      let index = this.allMonths.indexOf(this.state.selectedMonth) + 1;
      let month = (index < 10 ? '0' : '') + index;
      this.props.jumpToClick(this.state.selectedYear, month);
      loaderHandler.showLoader();
      this.props.closeAction();
    }
  };

  render() {
    return (
      <SafeAreaView style={{height: '100%', width: '100%'}}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={Colors.NewThemeColor}
        />
        <View
          style={{
            height: '30%',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
          onStartShouldSetResponder={() => true}
          onResponderStart={() => this.props.closeAction()}
        />
        <View style={{height: '70%', width: '100%', backgroundColor: '#fff'}}>
          <ScrollView style={{paddingTop: 16, paddingBottom: 16}}>
            <View>
              {this.props.jumpToYears.map((obj: any, index: any) => {
                return (
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingBottom: 16,
                        justifyContent: 'space-around',
                      }}>
                      {obj.map((obj1: any, index1: any) => {
                        return (
                          <TouchableHighlight
                            onPress={() => this.selectYear(obj1)}
                            underlayColor={'none'}
                            style={[
                              styles.filterItem,
                              {
                                backgroundColor:
                                  this.state.selectedYear == obj1.year
                                    ? 'black'
                                    : 'transparent',
                              },
                            ]}>
                            <Text
                              style={[
                                styles.filterText,
                                {
                                  color:
                                    this.state.selectedYear == obj1.year
                                      ? 'white'
                                      : Colors.TextColor,
                                },
                              ]}>
                              {obj1.year}
                            </Text>
                          </TouchableHighlight>
                        );
                      })}
                    </View>
                    {this.checkVisibility(index) && (
                      <View
                        style={{
                          margin: 16,
                          marginTop: 0,
                          flex: 1,
                          backgroundColor: Colors.NewLight,
                          padding: 16,
                          borderRadius: 5,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          {this.months.map((obj: any, index: any) => {
                            return (
                              <TouchableHighlight
                                onPress={() =>
                                  this.setState({selectedMonth: obj})
                                }
                                disabled={
                                  this.state.selectedMonths.indexOf(obj) < 0
                                }
                                underlayColor={'none'}
                                style={{
                                  flex: 1,
                                  padding: 5,
                                  backgroundColor:
                                    this.state.selectedMonth == obj
                                      ? 'black'
                                      : 'transparent',
                                  borderRadius: 5,
                                  opacity:
                                    this.state.selectedMonths.indexOf(obj) < 0
                                      ? 0.5
                                      : 1,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <Text
                                  style={[
                                    styles.monthsText,
                                    {
                                      color:
                                        this.state.selectedMonth == obj
                                          ? 'white'
                                          : Colors.TextColor,
                                    },
                                  ]}>
                                  {obj}
                                </Text>
                              </TouchableHighlight>
                            );
                          })}
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            paddingTop: 10,
                            justifyContent: 'space-between',
                          }}>
                          {this.monthsSecond.map((obj: any, index: any) => {
                            return (
                              <TouchableHighlight
                                onPress={() =>
                                  this.setState({selectedMonth: obj})
                                }
                                disabled={
                                  this.state.selectedMonths.indexOf(obj) < 0
                                }
                                underlayColor={'none'}
                                style={{
                                  flex: 1,
                                  padding: 5,
                                  backgroundColor:
                                    this.state.selectedMonth == obj
                                      ? 'black'
                                      : 'transparent',
                                  borderRadius: 5,
                                  opacity:
                                    this.state.selectedMonths.indexOf(obj) < 0
                                      ? 0.5
                                      : 1,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <Text
                                  style={[
                                    styles.monthsText,
                                    {
                                      color:
                                        this.state.selectedMonth == obj
                                          ? 'white'
                                          : Colors.TextColor,
                                    },
                                  ]}>
                                  {obj}
                                </Text>
                              </TouchableHighlight>
                            );
                          })}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <View style={styles.bottomView}>
            <TouchableHighlight
              underlayColor={'none'}
              onPress={() => this.jumpToClicked()}>
              <View
                style={{
                  backgroundColor: Colors.ThemeColor,
                  width: 100,
                  padding: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                }}>
                <TextNew
                  style={{fontWeight: '400', ...fontSize(16), color: '#fff'}}>
                  Jump
                </TextNew>
              </View>
            </TouchableHighlight>
          </View>
          <View
            style={{
              height: 50,
              position: 'absolute',
              bottom: -50,
              width: '100%',
              backgroundColor: 'white',
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  bottomView: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 0.5,
    borderColor: '#fff',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 4,
    shadowRadius: 2,
    elevation: 5,
  },
  filterItem: {
    width: Dimensions.get('window').width * 0.18,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  filterText: {...fontSize(18), color: 'white'},
  monthsText: {...fontSize(16), color: 'white'},
});
