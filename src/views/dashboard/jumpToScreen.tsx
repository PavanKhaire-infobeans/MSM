import React, { useEffect, useState } from 'react';
import {
  TouchableHighlight,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Colors, fontSize } from '../../common/constants';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import { action_close } from '../../images';
import Image2020 from './../../../app/images/dashboard/timeline/2020.svg';
import Image2010 from './../../../app/images/dashboard/timeline/2010.svg';
import Image2000 from './../../../app/images/dashboard/timeline/2000.svg';
import Image1990 from './../../../app/images/dashboard/timeline/1990.svg';
import Image1980 from './../../../app/images/dashboard/timeline/1980.svg';
import Image1970 from './../../../app/images/dashboard/timeline/1970.svg';
import Image1960 from './../../../app/images/dashboard/timeline/1960.svg';
import Image1950 from './../../../app/images/dashboard/timeline/1950.svg';
import Image1940 from './../../../app/images/dashboard/timeline/1940.svg';
import Image1930 from './../../../app/images/dashboard/timeline/1930.svg';
import { chevronleft, year1930, year1940, year1950, year1960, year1970, year1980, year1990, year2000, year2010, year2020 } from './../../../app/images'
import styles from './styles';
type Props = { [x: string]: any };
type State = { [x: string]: any };
enum fieldType {
  to = 'To',
  from = 'From',
}
const JumpToScreen = (props: Props) => {
  let allMonths = [
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
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  let monthsSecond = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // let years = [
  //   { year: "2020's", icon: <Image resizeMode='contain' style={{ height: 35, width: 28 }} source={year2020} />, value: 2020 },
  //   { year: "2010's", icon: <Image2010 height={35} width={28} />, value: 2010 },
  //   { year: "2000's", icon: <Image2000 height={35} width={28} />, value: 2000 },
  //   { year: "1990's", icon: <Image1990 height={35} width={28} />, value: 1990 },
  //   { year: "1980's", icon: <Image1980 height={35} width={28} />, value: 1980 },
  //   { year: "1970's", icon: <Image1970 height={35} width={28} />, value: 1970 },
  //   { year: "1960's", icon: <Image1960 height={35} width={28} />, value: 1960 },
  //   { year: "1950's", icon: <Image1950 height={35} width={28} />, value: 1950 },
  //   { year: "1940's", icon: <Image resizeMode='contain' style={{ height: 35, width: 28 }} source={year1940} />, value: 1940 },
  //   { year: "1930's", icon: <Image1930 height={35} width={28} />, value: 1930 }
  // ];
  let years = [
    { year: "2020's", icon: <Image resizeMode='contain' source={year2020} />, value: 2020 },
    { year: "2010's", icon: <Image2010 height={35} width={28} />, value: 2010 },
    { year: "2000's", icon: <Image resizeMode='contain' source={year2000} />, value: 2000 },
    { year: "1990's", icon: <Image resizeMode='contain' source={year1990} />, value: 1990 },
    { year: "1980's", icon: <Image resizeMode='contain' source={year1980} />, value: 1980 },
    { year: "1970's", icon: <Image resizeMode='contain' source={year1970} />, value: 1970 },
    { year: "1960's", icon: <Image resizeMode='contain' source={year1960} />, value: 1960 },
    { year: "1950's", icon: <Image resizeMode='contain' source={year1950} />, value: 1950 },
    { year: "1940's", icon: <Image resizeMode='contain' source={year1940} />, value: 1940 },
    { year: "1930's", icon: <Image resizeMode='contain' source={year1930} />, value: 1930 },
  ];

  const [state, setState] = useState({
    selectedMonths: [],
    selectedYear: 2020,
    selectedMonth: '',
  });
  const [selectedDecade, setSelectedDecade] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [yearArray, setyearArray] = useState(Array());
  const [yearArrayDisplay, setyearArrayDisplay] = useState(Array());
  const [backPress, setBackPress] = useState(true);

  useEffect(() => {
    // var parts = props.memoryDate.split(' ');
    let allYears = [], tempyearArr = [], yearArrayTemp = [...yearArray];

    props.jumpToYears?.forEach((element: any, index: any) => {
      allYears = allYears.concat(element)
    });

    allYears.forEach((element: any, index: any) => {

      yearArrayTemp.map((item) => {
        if (item.name == element.year) {
          item.disabled = false
          tempyearArr.push(item);
        }
      })
    });

    yearArrayTemp.map((item) => {
      tempyearArr.forEach((element: any, index: any) => {
        if (item.name == element.name) {
          item.disabled = false
        }
      })
    });

    setyearArrayDisplay(yearArrayTemp);
  }, [yearArray])

  const checkVisibility = (index: any) => {
    let years: any = [];
    let yearsAtIndex = props.jumpToYears[index];
    yearsAtIndex.forEach((element: any) => {
      years.push(element.year);
    });
    return years.indexOf(state.selectedYear) >= 0;
  };

  const selectYear = (selectedObj: any) => {
    if (selectedObj.year != state.selectedYear) {
      let selectedMonth = '';
      allMonths.forEach((element: any) => {
        if (selectedObj.months.indexOf(element) >= 0 && selectedMonth == '') {
          selectedMonth = element;
        }
      });
      setState(prevState => ({
        ...prevState,
        selectedYear: selectedObj.year,
        selectedMonths: selectedObj.months,
        selectedMonth: selectedMonth,
      }));
    }
  };

  const jumpToClicked = (selectedYear) => {
    // if (state.selectedMonth != '' && state.selectedMonth.length > 0) {
    //   let index = allMonths.indexOf(state.selectedMonth) + 1;
    //   let month = (index < 10 ? '0' : '') + index;
    props.jumpToClick(selectedYear, '');//month
    loaderHandler.showLoader();
    props.closeAction();
    // }
  };

  return (
    <View style={styles.jumptoScreenContainer}>

      <NavigationHeaderSafeArea
        // heading={'Filters'}
        height="120"
        heading={''}
        padding={20}
        showCommunity={false}
        cancelAction={() => props.closeAction()}
        showRightText={false}
        isWhite={true}
        backIcon={action_close}
      />

      {/* <View
        style={{
          height: '30%',
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
        onStartShouldSetResponder={() => true}
        onResponderStart={() => this.props.closeAction()}
      /> */}
      <View style={styles.jumptoScreenSubContainer}>
        <ScrollView>

          <View>
            {/* {props.jumpToYears.map((obj: any, index: any) => {
              return ( */}
            <View style={[styles.fullWidth, styles.justifyalignCenetr]}>
              <View style={styles.height16}></View>
              <View style={styles.commonPaddingContainer} >
                <Text
                  style={[styles.filterTextJumpto, { textAlign: 'left' }]}>
                  {'When would you like to jump to?'}
                </Text>
                {
                  backPress ?
                    null
                    :
                    <TouchableHighlight
                      underlayColor={'none'}
                      onPress={() => {
                        setBackPress(true);
                      }}
                      style={styles.imageBackContainerStyle}>
                      <>
                        <Image source={chevronleft} />
                        <Text
                          style={[
                            styles.filterTextJumpto, { fontWeight: '500' }
                          ]}>
                          {'Back'}
                        </Text>
                      </>
                    </TouchableHighlight>
                }

              </View>
              <View style={styles.height16}></View>
              {
                backPress ?
                  <FlatList
                    data={years}
                    keyExtractor={(_, index: number) => `${index}`}
                    numColumns={2}
                    style={styles.fullWidth}
                    ItemSeparatorComponent={() => { return (<View style={styles.separatorStyle} />) }}
                    renderItem={({ item, index, separators }) => (
                      <TouchableHighlight
                        underlayColor={'none'}
                        onPress={() => {
                          setSelectedDecade(item?.year);
                          setBackPress(false);
                          let tempYearArr = [];
                          for (let index = 0; index < 10; index++) {
                            let currentYear = new Date().getFullYear();
                            if ((item?.value + index) <= currentYear) {
                              tempYearArr.push(item?.value + index);
                            }
                          }
                          tempYearArr = tempYearArr.reverse()
                          tempYearArr = tempYearArr.map((item) => { return ({ name: item }) });
                          setyearArray(tempYearArr);
                          setyearArrayDisplay(tempYearArr);
                        }}
                        style={[
                          styles.newFilterItem,
                          item.disabled ? {
                            borderWidth: 2,
                            borderColor: Colors.transparent
                          }
                            :
                            item.year == selectedDecade ? {
                              borderWidth: 2,
                              shadowColor: Colors.black,
                              shadowOffset: { width: 0, height: 3 },
                              shadowOpacity: 0.2,
                              shadowRadius: 3.22,
                            }
                              :
                              {
                                borderWidth: item.year == selectedDecade ? 2 : 0,
                              },
                        ]}>
                        <View style={{ height: '100%', width: '100%', zIndex: 99, justifyContent: 'center', alignItems: 'center', borderRadius: 12, backgroundColor: Colors.white, overflow: 'hidden' }}>
                          <View style={{ backgroundColor: Colors.unSelectedFilterbg, height: '100%', justifyContent: 'center', alignItems: 'center', width: '100%', borderRadius: 12 }}>

                            <View style={[styles.justifyContentCenterAlignCenter,{padding:10}]}>
                              {/* <SvgXml xml={xml} /> */}
                              {item.icon}
                            </View>

                            <View style={styles.height8}></View>

                            <View style={[styles.justifyContentCenterAlignCenter, { height: 52 }]}>
                              <Text
                                style={[
                                  styles.filterTextJumpto,
                                  // { margin: 8 }
                                ]}>
                                {item.year}
                              </Text>

                            </View>

                          </View>
                        </View>
                      </TouchableHighlight>
                    )}
                  />
                  :
                  <FlatList
                    data={yearArrayDisplay}
                    keyExtractor={(_, index: number) => `${index}`}
                    numColumns={2}
                    style={styles.fullWidth}
                    ItemSeparatorComponent={() => { return (<View style={styles.separatorStyle} />) }}
                    renderItem={(item: any) => {
                      return (
                        <TouchableHighlight
                          underlayColor={'none'}
                          onPress={() => {
                            if (item.item.disabled == false) {
                              setSelectedYear(item?.item.name);
                              setTimeout(() => {
                                jumpToClicked(item?.item.name)
                              }, 200);
                            }
                          }}
                          disabled={item.item.disabled == undefined ? true : item.item.disabled}
                          style={[
                            styles.newFilterItem,
                            item.item.disabled == undefined ? {
                              borderWidth: 0,
                              borderColor: Colors.transparent,
                              backgroundColor: Colors.white,
                              height: 77,
                            }
                              :
                              {
                                borderColor: item.item.name == selectedYear ? Colors.decadeFilterBorder : Colors.bottomTabColor,
                                borderWidth: 2,
                                height: 77,
                                shadowColor: item.item.name == selectedYear ? '(0,0,0,0.1)' : '',
                                shadowOffset: { width: 0, height: item.item.name == selectedYear ? 1 : 0 },
                                shadowOpacity: item.item.name == selectedYear ? 0.2 : 0,
                                shadowRadius: item.item.name == selectedYear ? 2.22 : 0,
                                backgroundColor: Colors.white
                              }
                          ]}>
                          <View style={{ height: '100%', width: '100%', zIndex: 99, justifyContent: 'center', alignItems: 'center', borderRadius: 12, backgroundColor: Colors.white, overflow: 'hidden' }}>
                            <View style={[styles.justifyContentCenterAlignCenter,{ backgroundColor: Colors.white, height: '100%', justifyContent: 'center', alignItems: 'center', width: '100%', borderRadius: 12 }]}>

                              <Text
                                style={[
                                  styles.filterTextJumpto, { color: item.item.disabled == undefined ? '#858587' : Colors.bordercolor }
                                ]}>
                                {item.item.name}
                              </Text>
                            </View>
                          </View>
                        </TouchableHighlight>
                      )
                    }}
                  />
              }

              {/* <View
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
                            styles.filterItemJumpto,
                            {
                              backgroundColor:
                                this.state.selectedYear == obj1.year
                                  ? 'black'
                                  : 'transparent',
                            },
                          ]}>
                          <Text
                            style={[
                              styles.filterTextJumpto,
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
                  )} */}
            </View>
            {/* );
            })} */}
          </View>
          <View style={{ height: 140 }} />
        </ScrollView>
        {/* <View style={styles.bottomView}>
          <TouchableHighlight
            underlayColor={'none'}
            onPress={() => jumpToClicked()}>
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
                style={{ fontWeight: '400', ...fontSize(16), color: '#fff' }}>
                Jump
              </TextNew>
            </View>
          </TouchableHighlight>
        </View> */}
        {/* <View
          style={{
            height: 50,
            position: 'absolute',
            bottom: -50,
            width: '100%',
            backgroundColor: 'white',
          }}
        /> */}
      </View>
    </View>
  );

}


export default JumpToScreen;