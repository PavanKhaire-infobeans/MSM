import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import {Colors} from '../../common/constants';
import {
  chevronleft,
  x,
  year1930,
  year1940,
  year1950,
  year1960,
  year1970,
  year1980,
  year1990,
  year2000,
  year2020,
} from './../../../app/images';
import Image2010 from './../../../app/images/dashboard/timeline/2010.svg';
import {default as styles, default as Styles} from './styles';

type Props = {[x: string]: any};
type State = {[x: string]: any};
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
    {
      year: "2020's",
      icon: <Image resizeMode="contain" source={year2020} />,
      value: 2020,
    },
    {year: "2010's", icon: <Image2010 height={35} width={28} />, value: 2010},
    {
      year: "2000's",
      icon: <Image resizeMode="contain" source={year2000} />,
      value: 2000,
    },
    {
      year: "1990's",
      icon: <Image resizeMode="contain" source={year1990} />,
      value: 1990,
    },
    {
      year: "1980's",
      icon: <Image resizeMode="contain" source={year1980} />,
      value: 1980,
    },
    {
      year: "1970's",
      icon: <Image resizeMode="contain" source={year1970} />,
      value: 1970,
    },
    {
      year: "1960's",
      icon: <Image resizeMode="contain" source={year1960} />,
      value: 1960,
    },
    {
      year: "1950's",
      icon: <Image resizeMode="contain" source={year1950} />,
      value: 1950,
    },
    {
      year: "1940's",
      icon: <Image resizeMode="contain" source={year1940} />,
      value: 1940,
    },
    {
      year: "1930's",
      icon: <Image resizeMode="contain" source={year1930} />,
      value: 1930,
    },
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
    let allYears = [],
      tempyearArr = [],
      yearArrayTemp = [...yearArray];

    props.jumpToYears?.forEach((element: any, index: any) => {
      allYears = allYears.concat(element);
    });

    allYears.forEach((element: any, index: any) => {
      yearArrayTemp.map(item => {
        if (item.name == element.year) {
          item.disabled = false;
          tempyearArr.push(item);
        }
      });
    });

    yearArrayTemp.map(item => {
      tempyearArr.forEach((element: any, index: any) => {
        if (item.name == element.name) {
          item.disabled = false;
        }
      });
    });

    setyearArrayDisplay(yearArrayTemp);
  }, [yearArray]);

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

  const jumpToClicked = selectedYear => {
    props.jumpToClick(selectedYear, ''); //month
    props.closeAction();
  };

  return (
    <View style={styles.jumptoScreenContainer}>
      <View style={Styles.jumptoCancelContainerStyle}>
        <TouchableHighlight
          underlayColor={Colors.transparent}
          style={Styles.jumptoCancelSubContainerStyle}
          onPress={() => props.closeAction()}>
          <>
            <Image style={Styles.cancelImageStyle} source={x} />
            <Text style={Styles.cancelTextStyle}>Cancel</Text>
          </>
        </TouchableHighlight>
      </View>

      <View style={styles.jumptoScreenSubContainer}>
        <ScrollView nestedScrollEnabled={true}>
          <View>
            <View style={[styles.fullWidth, styles.justifyalignCenetr]}>
              <View style={styles.separatorStyle}></View>
              <View style={styles.commonPaddingContainer}>
                <Text style={[styles.filterTextJumpto, {textAlign: 'left'}]}>
                  {'When would you like to jump to?'}
                </Text>
                {backPress ? null : (
                  <TouchableHighlight
                    underlayColor={'none'}
                    onPress={() => {
                      setBackPress(true);
                    }}
                    style={styles.imageBackContainerStyle}>
                    <>
                      <Image source={chevronleft} />
                      <Text style={styles.backTextJumpto}>{'Back'}</Text>
                    </>
                  </TouchableHighlight>
                )}
              </View>
              <View style={styles.separatorStyle}></View>
              {backPress ? (
                <FlatList
                  data={years}
                  keyExtractor={(_, index: number) => `${index}`}
                  numColumns={2}
                  nestedScrollEnabled={true}
                  style={styles.fullWidth}
                  ItemSeparatorComponent={() => {
                    return <View style={styles.separatorStyle} />;
                  }}
                  renderItem={({item, index, separators}) => (
                    <TouchableHighlight
                      underlayColor={'none'}
                      onPress={() => {
                        setSelectedDecade(item?.year);
                        setBackPress(false);
                        let tempYearArr = [];
                        for (let index = 0; index < 10; index++) {
                          let currentYear = new Date().getFullYear();
                          if (item?.value + index <= currentYear) {
                            tempYearArr.push(item?.value + index);
                          }
                        }
                        tempYearArr = tempYearArr.reverse();
                        tempYearArr = tempYearArr.map(item => {
                          return {name: item};
                        });
                        setyearArray(tempYearArr);
                        setyearArrayDisplay(tempYearArr);
                      }}
                      style={[
                        styles.newFilterItem,
                        item.year == selectedDecade
                          ? styles.shadowBoxStyle
                          : {},
                      ]}>
                      <>
                        <View style={styles.iconContainer}>{item.icon}</View>

                        <View style={styles.iconSeparator}></View>

                        <View style={styles.jumptoYearContainer}>
                          <Text style={[styles.filterTextJumpto]}>
                            {item.year}
                          </Text>
                        </View>
                      </>
                    </TouchableHighlight>
                  )}
                />
              ) : (
                <FlatList
                  data={yearArrayDisplay}
                  keyExtractor={(_, index: number) => `${index}`}
                  numColumns={2}
                  nestedScrollEnabled={true}
                  style={styles.fullWidth}
                  renderItem={(item: any) => {
                    return (
                      <TouchableHighlight
                        underlayColor={'none'}
                        onPress={() => {
                          if (item.item.disabled == false) {
                            loaderHandler.showLoader('Loading...');
                            setSelectedYear(item?.item.name);
                            jumpToClicked(item?.item.name);
                          }
                        }}
                        disabled={
                          item.item.disabled == undefined
                            ? true
                            : item.item.disabled
                        }
                        style={[
                          styles.newFilterItem,
                          item.item.disabled == undefined
                            ? {
                                borderWidth: 0,
                                backgroundColor: Colors.white,
                                height: 76,
                                marginBottom: 16,
                              }
                            : {
                                borderColor:
                                  item.item.name == selectedYear
                                    ? Colors.decadeFilterBorder
                                    : Colors.bottomTabColor,
                                borderWidth: 2,
                                height: 76,
                                shadowColor:
                                  item.item.name == selectedYear
                                    ? '(0,0,0,0.1)'
                                    : undefined,
                                shadowOffset: {
                                  width: 0,
                                  height:
                                    item.item.name == selectedYear ? 1 : 0,
                                },
                                shadowOpacity:
                                  item.item.name == selectedYear ? 0.2 : 0,
                                shadowRadius:
                                  item.item.name == selectedYear ? 2.22 : 0,
                                elevation: 3,
                                backgroundColor: Colors.white,
                                marginBottom: 16,
                              },
                        ]}>
                        <Text
                          style={[
                            styles.filterTextJumpto,
                            {
                              color:
                                item.item.disabled == undefined
                                  ? '#858587'
                                  : Colors.bordercolor,
                            },
                          ]}>
                          {item.item.name}
                        </Text>
                      </TouchableHighlight>
                    );
                  }}
                />
              )}
            </View>
          </View>
          <View style={Styles.ScrollToendView} />
        </ScrollView>
      </View>
    </View>
  );
};

export default JumpToScreen;
