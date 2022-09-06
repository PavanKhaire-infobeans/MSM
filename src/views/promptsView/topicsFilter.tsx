import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import TextNew from '../../common/component/Text';
import {Colors} from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import {action_close, check, plus} from '../../images';
import {GetPrompts} from '../myMemories/myMemoriesWebService';
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

  applyFilters() {
    if (filterAdded) {
      loaderHandler.showLoader();
      GetPrompts(this.state.filteredTopics, false, 0);
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
            cancelAction={() => this.props.navigation.pop()}
            showRightText={false}
            isWhite={true}
            backIcon={action_close}
          />
          <StatusBar
            barStyle={
              Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
            }
            backgroundColor={Colors.NewThemeColor}
          />
          <ScrollView style={Styles.filterSubScroll}>
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
                            backgroundColor:
                              obj.checked == 1
                                ? Colors.selectedFilter
                                : Colors.filterBG,
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
                                color:
                                  obj.checked == 1
                                    ? Colors.TextColor
                                    : Colors.TextColor,
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
