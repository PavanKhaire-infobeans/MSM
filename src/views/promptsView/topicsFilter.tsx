import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { achieve, adventure, career, career_Advice, childhood, college, create, family, financial_Advice, friendship, general, growing_Up, heal, historial_Events, Inspire, life_Advice, life_Reflection, love_Marriage, military, parents, recreation, reflect, religious, reminisce, school, travel, unusual_Experiences, x } from '../../../app/images';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import TextNew from '../../common/component/Text';
import { Colors } from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import { action_close, check, plus } from '../../images';
import { GetPrompts } from '../myMemories/myMemoriesWebService';
import { default as Styles } from './../dashboard/styles';

type Props = { [x: string]: any };
type State = { [x: string]: any };
var topicsArr: any = [];
var filterValues: any = [];
var filterAdded: boolean = false;

const icons = {
  "Adventure": adventure,
  "Career": career,
  "Career Advice": career_Advice,
  "Childhood": childhood,
  "College": college,
  "Family": family,
  "Financial Advice": financial_Advice,
  "Friendship": friendship,
  "General": general,
  "Growing Up": growing_Up,
  "Historical Events": historial_Events,
  "Life Advice": life_Advice,
  "Life Reflection": life_Reflection,
  "Love/Marriage": love_Marriage,
  "Military": military,
  "Parents": parents,
  "Recreation": recreation,
  "Religious": religious,
  "School": school,
  "Travel": travel,
  "Unusual Experiences": unusual_Experiences,
  "Reminisce": reminisce,
  "Inspire": Inspire,
  "Reflect": reflect,
  "Heal": heal,
  "Achieve": achieve,
  "Create": create,
};

let topicsThemeArr = [
  {
    name: 'Reminisce',
    desc: 'Prompts about sharing experiences, stories, and past memories.'
  },
  {
    name: 'Inspire',
    desc: 'Prompts about sharing advice, wisdom, and knowledge.'
  },
  {
    name: 'Reflect',
    desc: 'Prompts that are thought-provoking that involve deep reflection on life.'
  },
  {
    name: 'Heal',
    desc: 'Prompts aimed to help write through hard times and struggles.'
  },
  {
    name: 'Achieve',
    desc: 'Prompts about goals, goal-setting, aspirations, and ambitions.'
  },
  {
    name: 'Create',
    desc: 'Prompts for creative writing - from developing short stories to crafting poems.'
  }
]

const TopicsFilter = (props: Props) => {
  const [state, setState] = useState({
    topicsArray: [],
    filteredTopics: [],
  })

  let flatlistRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState({"label":"","value":"","checked":0});
  const isFocused = useIsFocused()
  useEffect(() => {
    topicsArr = [];
    filterValues = [];
    filterAdded = false;

    for (var key in props.categories) {
      topicsArr.push(props.categories[key]);
      setState(prevState => ({ ...prevState, topicsArray: topicsArr }));
    }
    setSelectedFilter({"label":"","value":"","checked":0});
    console.log()
  }, [isFocused])


  const topicItemClicked = (value: any, checkValue: any) => {
    filterAdded = true;
    let checkVal = checkValue == 1 ? 0 : 1;
    filterValues = [];
    state.topicsArray.filter((element: any) => {
      if (element.value == value) {
        element.checked = checkVal;
      }
      if (element.checked == 1) {
        filterValues.push(element.value);
      }
    });
    let finalFilter = filterValues.join();
    setState(prevState => ({ ...prevState, filteredTopics: finalFilter }));

  }


  const renderItem = ({ item, index }) => (
    <TouchableHighlight
      underlayColor={'none'}
      onPress={() => {
        if (flatlistRef.current) {
          flatlistRef.current.scrollTo({x: 0, y: 0, animated: true});
        }
        if (item.label == selectedFilter.label) {
          setSelectedFilter({"label":"","value":"","checked":0})
        }
        else {
          setSelectedFilter(item)
        }
      }}
      style={[Styles.newFilterItem,
      item.label == selectedFilter.label ?
        Styles.shadowBoxStyle
        : {}
      ]}>
      <>
        <View style={Styles.iconContainer}>
          <Image resizeMode="contain" source={icons[item.label]} />
        </View>

        <View style={Styles.iconSeparator}></View>

        <View style={[Styles.jumptoYearContainer,{width:'100%'}]}>
          <Text style={[Styles.filterTextJumpto,{width:'100%',textAlign:'center'}]}>
            {item.label}
          </Text>
        </View>
      </>
    </TouchableHighlight>
  );

  const renderThemeItem = ({ item, index }) => (
    <TouchableWithoutFeedback
      // underlayColor={'none'}
      onPress={() => {
        props.applyFilters(selectedFilter.value);
      }}
      >
      <View style={Styles.renderThemeContainerStyle}>
        <View style={Styles.filterIconContainer}>
          <Image style={Styles.filterThemeImageStyle} resizeMode="contain" source={icons[item.name]} />
          <Text style={[Styles.filterThemeText]}>
            {item.name}
          </Text>
        </View>

        <View style={Styles.iconSeparator}></View>

        <View style={Styles.filterDescContainer}>
          <Text style={Styles.filterDescThemeText}>
            {item.desc}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={Styles.jumptoScreenContainer}>
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

      <View style={Styles.jumptoScreenSubContainer}>
        <ScrollView ref={flatlistRef} showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false} nestedScrollEnabled={true} overScrollMode='always' style={Styles.flexContainer}>
          <>
            <View style={[Styles.fullWidth, Styles.justifyalignCenetr]}>
              <View style={Styles.separatorStyle}></View>
              <View style={Styles.commonPaddingContainer}>
                <Text style={[Styles.filterTextJumpto, { textAlign: 'left' }]}>
                  {'What are you looking for?'}
                </Text>
              </View>
              <View style={Styles.separatorStyle}></View>
              {
                selectedFilter.label === '' ?
                  <FlatList
                    data={state.topicsArray}
                    keyExtractor={(_, index: number) => `${index}`}
                    numColumns={2}
                    nestedScrollEnabled={true}
                    initialNumToRender={state.topicsArray.length}
                    removeClippedSubviews={true}
                    style={Styles.fullWidth}
                    ItemSeparatorComponent={() => {
                      return <View style={Styles.separatorStyle} />;
                    }}
                    renderItem={renderItem}
                  />
                  :
                  null
              }

              {
                selectedFilter.label === '' ?
                  null
                  :
                  <FlatList
                    data={topicsThemeArr}
                    keyExtractor={(_, index: number) => `${index}`}
                    nestedScrollEnabled={true}
                    initialNumToRender={topicsThemeArr.length}
                    removeClippedSubviews={true}
                    style={Styles.fullWidth}
                    ItemSeparatorComponent={() => {
                      return <View style={Styles.separatorStyle} />;
                    }}
                    renderItem={renderThemeItem}
                  />
              }

            </View>
          </>
          <View style={Styles.ScrollToendView} />
        </ScrollView>
      </View>
    </View>

    //  <View style={Styles.filterContainer}>

    //     <SafeAreaView style={Styles.filterSubContainer}>
    //       <NavigationHeaderSafeArea
    //         heading={'Topics'}
    //         showCommunity={false}
    //         cancelAction={() => props.navigation.goBack()}
    //         showRightText={false}
    //         isWhite={true}
    //         backIcon={action_close}
    //       />
    //       <StatusBar
    //         barStyle={Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
    //         backgroundColor={Colors.NewThemeColor}
    //       />
    //       <ScrollView nestedScrollEnabled={true} overScrollMode='always' style={[Styles.filterSubScroll, { flex: 1 }]}>
    //         <View>
    //           <View style={Styles.topicContainer}>
    //             {state.topicsArray.length > 0 &&
    //               state.topicsArray.map((obj: any, index: any) => {
    //                 return (
    //                   <TouchableHighlight
    //                     underlayColor={'none'}
    //                     onPress={() =>
    //                       topicItemClicked(obj.value, obj.checked)
    //                     }
    //                     style={[
    //                       Styles.filterItem,
    //                       {
    //                         backgroundColor: obj.checked == 1 ? Colors.selectedFilter : Colors.filterBG,
    //                       },
    //                     ]}>
    //                     <View style={{ flexDirection: 'row' }}>
    //                       <Image
    //                         source={obj.checked == 1 ? check : plus}
    //                         style={Styles.checkBoximageSTyle}></Image>
    //                       <Text
    //                         style={[
    //                           Styles.filterText,
    //                           {
    //                             color: obj.checked == 1 ? Colors.TextColor : Colors.TextColor,
    //                           },
    //                         ]}>
    //                         {obj.label}
    //                       </Text>
    //                     </View>
    //                   </TouchableHighlight>
    //                 );
    //               })}
    //           </View>
    //         </View>
    //       </ScrollView>
    //       <View style={Styles.bottomView}>
    //         <TouchableHighlight
    //           underlayColor={'none'}
    //           onPress={() => applyFilters()}>
    //           <View style={Styles.ApplyContainer}>
    //             <TextNew style={Styles.applyText}>Apply Topics</TextNew>
    //           </View>
    //         </TouchableHighlight>
    //       </View>
    //     </SafeAreaView> 
    //   </View>

  );
}

export default TopicsFilter;