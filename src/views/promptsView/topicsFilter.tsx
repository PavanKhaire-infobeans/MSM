import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import TextNew from '../../common/component/Text';
import { Colors } from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import { action_close, check, plus } from '../../images';
import { GetPrompts } from '../myMemories/myMemoriesWebService';
import Styles from './styles';

type Props = {[x: string]: any};
type State = {[x: string]: any};
var topicsArr: any = [];
var filterValues: any = [];
var filterAdded: boolean = false;
export default class TopicsFilter extends React.Component<State, Props> {
  state: State = {
    topicsArray: [],
    filteredTopics: [],
  };

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    for (var key in this.props.categories) {
      // this.props.categories["id"] = 0;
      topicsArr.push(this.props.categories[key]);
      // var result = topicsArr.map(function(el: any) {
      //     var o = Object.assign({}, el);
      //     o.isActive = 0;
      //     return o;
      //   })
      this.setState({topicsArray: topicsArr});
    }
  }

  topicItemClicked(value: any, checkValue: any) {
    filterAdded = true;
    let checkVal = checkValue == 1 ? 0 : 1;
    filterValues = [];
    this.state.topicsArray.filter((element: any) => {
      if (element.value == value) {
        element.checked = checkVal;
      }
      if (element.checked == 1) {
        filterValues.push(element.value);
      }
    });
    let finalFilter = filterValues.join();
    this.setState({filteredTopics: finalFilter});
  }

  componentWillUnmount() {
    topicsArr = [];
    filterValues = [];
    filterAdded = false;
  }

  applyFilters = ()=> {
    if (filterAdded) {
      //loaderHandler.showLoader();
      GetPrompts(this.state.filteredTopics, false, 0,
        response =>{
          let fetched = response.fetched, ifLoadMore = response.ifLoadMore, fetchPromptsList = response.fetchPromptsList;
            // if (fetched) {
    
            //   let values: {
            //     id: string;
            //     desc: any;
            //     prompt_category?: any;
            //     prompt_image?: any;
            //   }[] = [];
            //   // this.setState({
            //   //   loadMore: fetchPromptsList.load_more,
            //   //   categoriesArray: fetchPromptsList.prompt_categories
            //   // });
            //   if (
            //     fetchPromptsList.prompt_categories &&
            //     Object.keys(fetchPromptsList.prompt_categories).length
            //   ) {
            //     promptCategoriesArray = Object.values(
            //       fetchPromptsList.prompt_categories,
            //     );
            //   }
    
            //   promptList = fetchPromptsList.memory_prompt_data;
            //   // this.setState({ offsetVal: fetchPromptsList.prompt_offset, prompt_count: fetchPromptsList.prompt_count });
            //   let promptWithCategory: any[] =
            //       fetchPromptsList.memory_prompt_data_detail,
            //     promptWithCategoryValues: any = [];
    
            //   if (promptWithCategory && promptWithCategory.length) {
            //     // promptWithCategoryValues = Object.values(fetchPromptsList.memory_prompt_data_detail);
    
            //     promptWithCategory.forEach((element, index) => {
            //       let categoriesArray: any = [];
    
            //       for (var key in element) {
            //         if (
            //           element[key]['prompt_category'] &&
            //           element[key]['prompt_category'].length
            //         ) {
            //           element[key]['prompt_category'].forEach(promptCategory => {
            //             let selectedCategory = promptCategoriesArray.filter(
            //               item => item.value == promptCategory,
            //             );
            //             if (selectedCategory.length) {
            //               categoriesArray = [
            //                 ...categoriesArray,
            //                 ...selectedCategory,
            //               ];
            //             }
            //           });
            //         }
            //         values.push({
            //           id: key,
            //           desc: element[key]['title'],
            //           prompt_category: categoriesArray,
            //           prompt_image: element[key]['prompt_image'],
            //         });
            //       }
            //     });
            //   }
            //   // showConsoleLog(ConsoleType.LOG,"data >> ", JSON.stringify(values));
    
            //   // promptList.forEach(element => {
            //   //   for (var key in element) {
            //   //     values.push({ id: key, desc: element[key] });
            //   //   }
            //   // });
    
            //   if (ifLoadMore) {
            //     this.setState({
            //       items: this.state.items.concat(values),
            //       loadMore: fetchPromptsList.load_more,
            //       categoriesArray: fetchPromptsList.prompt_categories,
            //       offsetVal: fetchPromptsList.prompt_offset,
            //       prompt_count: fetchPromptsList.prompt_count,
            //     });
            //   } else {
            //     this.setState({
            //       items: values,
            //       loadMore: fetchPromptsList.load_more,
            //       categoriesArray: fetchPromptsList.prompt_categories,
            //       offsetVal: fetchPromptsList.prompt_offset,
            //       prompt_count: fetchPromptsList.prompt_count,
            //     });
            //   }
            //   this.setState({loading: false}, () => {
            //     //loaderHandler.hideLoader()
            //     this.props.showLoader(false);
            //     this.props.loaderText('Loading...');
            //   });
            // } else {
            //   this.setState({loading: false}, () => {
            //     //loaderHandler.hideLoader()
            //     this.props.showLoader(false);
            //     this.props.loaderText('Loading...');
            //   });
            // }
        });
      // this.setState({});
      EventManager.callBack('scrollFlatlist');
      this.props.navigation.goBack();
    } else {
      EventManager.callBack('scrollFlatlist');
      this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <View style={Styles.filterContainer}>
        <SafeAreaView style={Styles.filterSubContainer}>
          <NavigationHeaderSafeArea
            heading={'Topics'}
            showCommunity={false}
            cancelAction={() => this.props.navigation.goBack()}
            showRightText={false}
            isWhite={true}
            backIcon={action_close}
          />
          <StatusBar
            barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
            backgroundColor={Colors.NewThemeColor}
          />
          <ScrollView nestedScrollEnabled={true} overScrollMode='always'style={[Styles.filterSubScroll,{flex:1}]}>
            <View>
              <View style={Styles.topicContainer}>
                {this.state.topicsArray.length > 0 &&
                  this.state.topicsArray.map((obj: any, index: any) => {
                    return (
                      <TouchableHighlight
                        underlayColor={'none'}
                        onPress={() =>
                          this.topicItemClicked(obj.value, obj.checked)
                        }
                        style={[
                          Styles.filterItem,
                          {
                            backgroundColor: obj.checked == 1 ? Colors.selectedFilter : Colors.filterBG,
                          },
                        ]}>
                        <View style={{flexDirection: 'row'}}>
                          <Image
                            source={obj.checked == 1 ? check : plus}
                            style={Styles.checkBoximageSTyle}></Image>
                          <Text
                            style={[
                              Styles.filterText,
                              {
                                color: obj.checked == 1 ? Colors.TextColor : Colors.TextColor,
                              },
                            ]}>
                            {obj.label}
                          </Text>
                        </View>
                      </TouchableHighlight>
                    );
                  })}
              </View>
            </View>
          </ScrollView>
          <View style={Styles.bottomView}>
            <TouchableHighlight
              underlayColor={'none'}
              onPress={() => this.applyFilters()}>
              <View style={Styles.ApplyContainer}>
                <TextNew style={Styles.applyText}>Apply Topics</TextNew>
              </View>
            </TouchableHighlight>
            {/* <View style={{height: 50, position : 'absolute', bottom : -50, width : '100%', backgroundColor : '#fff'}}/> */}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}