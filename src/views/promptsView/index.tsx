import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  StatusBar,
  Text,
  Alert,
  Keyboard,
  ActivityIndicator,
  ImageBackground,
  TouchableHighlight,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import { plus, sampleimage } from '../../../app/images';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import { TabItems } from '../../common/component/TabBarIcons';
import TextNew from '../../common/component/Text';
import { No_Internet_Warning, ToastMessage } from '../../common/component/Toast';
import { Colors, decode_utf8, fontFamily, fontSize } from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import {
  close_big,
  edit_icon,
  edit_prompt,
  filter_icon,
  topics_filter,
} from '../../images';
import {
  CreateUpdateMemory,
  promptIdListener,
} from '../createMemory/createMemoryWebService';
import { DefaultDetailsMemory } from '../createMemory/dataHelper';
import NavigationBar from '../dashboard/NavigationBar';
import edit from '../mindPop/edit';
import {
  GetPrompts,
  kPromptsList,
  kHidePrompt,
  HidePrompt,
} from '../myMemories/myMemoriesWebService';
type Props = { [x: string]: any };
type State = { [x: string]: any };
var promptList: any[] = [];
var promptCategoriesArray: any[] = [];

var selectedIndex = '';
export default class PromptsView extends React.Component<State, Props> {
  state: State = {
    offsetVal: 0,
    categoriesArray: {},
    loadMore: 0,
    items: [],
    loading: false,
    prompt_count: 0
  };
  memoryFromPrompt: EventManager;
  promptsListListener: EventManager;
  flatListRef: FlatList<unknown>;
  scrollFlatlistListener: EventManager;
  promptHideListener: EventManager;

  constructor(props: Props) {
    super(props);
    this.scrollFlatlistListener = EventManager.addListener(
      'scrollFlatlist',
      () => {
        this.flatListRef.scrollToOffset({ offset: 0, animated: false });
      },
    );
    this.promptsListListener = EventManager.addListener(
      kPromptsList,
      (fetched?: boolean, ifLoadMore?: boolean, fetchPromptsList?: any) => {
        if (fetched) {

          // console.log("data: ",JSON.stringify(fetchPromptsList))

          debugger;
          let values: { id: string; desc: any, prompt_category?: any, prompt_image?: any }[] = [];
          // this.setState({
          //   loadMore: fetchPromptsList.load_more,
          //   categoriesArray: fetchPromptsList.prompt_categories
          // });
          if (fetchPromptsList.prompt_categories && Object.keys(fetchPromptsList.prompt_categories).length) {

            promptCategoriesArray = Object.values(fetchPromptsList.prompt_categories);

          }

          promptList = fetchPromptsList.memory_prompt_data;
          // this.setState({ offsetVal: fetchPromptsList.prompt_offset, prompt_count: fetchPromptsList.prompt_count });
          let promptWithCategory: any[] = fetchPromptsList.memory_prompt_data_detail, promptWithCategoryValues: any = [];

          if (promptWithCategory && promptWithCategory.length) {
            // promptWithCategoryValues = Object.values(fetchPromptsList.memory_prompt_data_detail);

            promptWithCategory.forEach((element, index) => {
              let categoriesArray: any = [];

              for (var key in element) {
                if (element[key]['prompt_category'] && element[key]['prompt_category'].length) {
                  element[key]['prompt_category'].forEach(promptCategory => {
                    let selectedCategory = (promptCategoriesArray.filter((item) => item.value == promptCategory));
                    if (selectedCategory.length) {
                      categoriesArray = [...categoriesArray, ...selectedCategory];
                    }
                  });
                }
                values.push({ id: key, desc: element[key]['title'], prompt_category: categoriesArray, prompt_image: element[key]['prompt_image'] });
              }
            });
          }
          // console.log("data >> ", JSON.stringify(values));

          // promptList.forEach(element => {
          //   for (var key in element) {
          //     values.push({ id: key, desc: element[key] });
          //   }
          // });

          if (ifLoadMore) {
            this.setState({
              items: this.state.items.concat(values),
              loadMore: fetchPromptsList.load_more,
              categoriesArray: fetchPromptsList.prompt_categories,
              offsetVal: fetchPromptsList.prompt_offset,
              prompt_count: fetchPromptsList.prompt_count
            }, () => {
              // console.log("loadmore: ",JSON.stringify(this.state.items))
            });

          }
          else {
            this.setState({
              items: values,
              loadMore: fetchPromptsList.load_more,
              categoriesArray: fetchPromptsList.prompt_categories,
              offsetVal: fetchPromptsList.prompt_offset,
              prompt_count: fetchPromptsList.prompt_count
            }, () => {
              // console.log("data: ",JSON.stringify(this.state.items))
            });
          }
          this.setState({ loading: false });
          loaderHandler.hideLoader();
        }
        else {
          this.setState({ loading: false });
          loaderHandler.hideLoader();
        }
      },
    );

    this.promptHideListener = EventManager.addListener(
      kHidePrompt,
      (fetched?: boolean, promptId?: any) => {
        if (fetched) {
          var array = [...this.state.items]; // make a separate copy of the array
          const filteredItems = array.filter(item => item.id !== promptId);
          this.setState({ items: filteredItems });
          loaderHandler.hideLoader();
        } else {
          loaderHandler.hideLoader();
        }
      },
    );
  }

  componentDidMount() {
    if (this.props.fromDeepLinking) {

      this.convertToMemory(this.props.nid, this.props.title)
    }
    else {
      this.setState({ loading: true });
      console.log('on mounting', this.state.categoriesArray);
      GetPrompts(this.state.categoriesArray, false, this.state.offsetVal);
    }
  }

  loadMorePrompts() {
    if (this.state.loadMore == 1) {
      if (Utility.isInternetConnected) {
        GetPrompts(this.state.categoriesArray, true, this.state.offsetVal);
      } else {
        No_Internet_Warning();
      }
    }
  }

  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (this.state.loadMore == 0) return null;
    return (
      <View style={{ width: '100%', height: 40, marginTop: 20 }}>
        <ActivityIndicator color={'white'} />
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView
          style={{
            width: '100%',
            flex: 0,
            backgroundColor: Colors.timeLinebackground,
          }}
        />
        <SafeAreaView style={{ width: '100%', flex: 1, backgroundColor: Colors.timeLinebackground }}>
          <View style={{ flex: 1, backgroundColor: Colors.NewThemeColor }}>
            {/* <NavigationBar title={TabItems.Prompts} /> */}
            <StatusBar
              barStyle={Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            {/* {!this.state.loading && (
              <View
                style={{
                  borderTopColor: '#fff',
                  borderTopWidth: 0.5,
                  opacity: 0.75,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    Actions.push('topicsFilter', {
                      categories: this.state.categoriesArray,
                    })
                  }
                  underlayColor={'transparent'}
                  style={{
                    height: 40,
                    borderRadius: 200,
                    margin: 10,
                    borderWidth: 1,
                    borderColor: '#373852',
                    backgroundColor: '#373852',
                    paddingRight: 16,
                    paddingLeft: 16,
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingTop: Platform.OS == 'ios' ? 8 : 6,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <TextNew
                      style={{
                        fontWeight: '400',
                        color: '#fff',
                        ...fontSize(18),
                        marginRight: 5,
                      }}>
                      Topics
                    </TextNew>
                    <Image source={topics_filter}></Image>
                  </View>
                </TouchableOpacity>
              </View>
            )} */}
            <FlatList
              ref={ref => {
                this.flatListRef = ref;
              }}
              data={this.state.items}
              extraData={this.state}
              onScroll={() => {
                Keyboard.dismiss();
              }}
              maxToRenderPerBatch={50}
              removeClippedSubviews={true}
              ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
              keyExtractor={(_, index: number) => `${index}`}
              style={{ width: '100%', backgroundColor: Colors.timeLinebackground }}
              renderItem={(item: any) => {
                return (
                  <>
                    <View style={{ height: item?.index == 0 ? 16 : 0 }} />
                    <View
                      style={{
                        // margin: 10,
                        width: Utility.getDeviceWidth() - 48,
                        borderRadius: 24,
                        backgroundColor: Colors.white,
                        height: 350,
                        flex: 1,
                        shadowColor: '#073562',
                        shadowOffset: { height: 1, width: 0 },
                        borderWidth: 0,
                        alignSelf: 'center',
                        shadowOpacity: 0.2,
                        elevation: 0.2,
                      }}>
                      {/* <View>
                      <TouchableOpacity
                        underlayColor={'transparent'}
                        onPress={() => this.hidePrompt(item.item.id)}
                        style={{
                          alignItems: 'flex-end',
                          margin: 11,
                          paddingRight: 2,
                        }}>
                        <Image source={close_big}></Image>
                      </TouchableOpacity>
                    </View> */}
                      <View style={{ flex: 2, borderTopLeftRadius: 24, borderTopRightRadius: 24, }}>
                        <ImageBackground borderTopLeftRadius={24} borderTopRightRadius={24} source={item.item.prompt_image ? {uri:item.item.prompt_image} : sampleimage} resizeMode='cover' style={{ flex: 2, height: '100%', width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, alignItems: 'center' }}>
                          <LinearGradient
                            // start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            // locations={[0, 0.6]}
                            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
                            style={{ height: '100%', width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
                          </LinearGradient>
                        </ImageBackground>
                      </View>
                      <View
                        style={{
                          flex: 3,
                          justifyContent: 'space-between',
                          alignContent: 'space-between'
                        }}>


                        {item.item.prompt_category && item.item.prompt_category.length ?
                          item.item.prompt_category.length === 1 ?
                            <Text
                              style={{
                                fontSize: 14,
                                lineHeight: 14,
                                marginBottom: 22,
                                fontFamily: fontFamily.Inter,
                                fontWeight: '500',
                                color: Colors.newTextColor,
                                textAlign: 'center',
                              }}>
                              {item.item.prompt_category[0].label}
                            </Text>
                            :
                            item.item.prompt_category.map((category, categoryIndex) => (
                              <Text
                                style={{
                                  fontSize: 14,
                                  lineHeight: 14,
                                  marginBottom: 22,
                                  fontFamily: fontFamily.Inter,
                                  fontWeight: '500',
                                  color: Colors.newTextColor,
                                  textAlign: 'center',
                                }}>
                                {category.label} {categoryIndex + 1 != item.item.prompt_category.length ? ',' : null}
                              </Text>
                            ))
                          :
                          null
                        }

                        <TextNew
                          numberOfLines={3}
                          style={{
                            fontSize: 22,
                            lineHeight: 27.5,
                            color: Colors.newDescTextColor,
                            fontWeight: '600',
                            // marginLeft: 20,
                            flex: 1,
                            // marginRight: 20,
                            // marginBottom: 16,
                            fontFamily: fontFamily.Lora,
                            textAlign: 'center',
                            paddingHorizontal: 15,
                          }}>
                          {item.item.desc}
                        </TextNew>
                        <View>
                          <TouchableOpacity
                            onPress={() =>
                              this.convertToMemory(item.item.id, item.item.desc)
                            }>
                            <View
                              style={{
                                flexDirection: 'row',
                                backgroundColor: Colors.timeLinebackground,
                                marginHorizontal: 16,
                                marginBottom: 24,
                                height: 40,
                                borderColor: Colors.bottomTabColor,
                                borderWidth: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 1000,
                              }}>
                              <Image source={plus}></Image>
                              <TextNew
                                style={{
                                  fontSize: 14,
                                  lineHeight: 17,
                                  marginLeft: 5,
                                  fontWeight: '500',
                                  fontFamily: fontFamily.Inter,
                                  color: Colors.newDescTextColor,
                                }}>
                                Answer Prompt
                              </TextNew>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>

                    </View>
                  </>
                );
              }}
              ListFooterComponent={this.renderFooter.bind(this)}
              onEndReachedThreshold={0.4}
              onEndReached={this.loadMorePrompts.bind(this)}
            />
            {this.state.items.length == 0 && (
              <View
                style={{
                  height: '100%',
                  width: '100%',
                  alignContent: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                }}>
                {this.state.loading ? (
                  <ActivityIndicator
                    color={Colors.newTextColor}
                    size="large"
                    style={{ flex: 1, justifyContent: 'center' }}
                  />
                ) : (
                  <Text
                    style={{
                      ...fontSize(16),
                      fontFamily: fontFamily.Inter,
                      color: Colors.newDescTextColor,
                      textAlign: 'center',
                    }}>
                    There are no prompts to display at this moment
                  </Text>
                )}
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }
  convertToMemory(id: any, title: any) {
    if (Utility.isInternetConnected) {
      this.setState({ selectedPrompt: parseInt(id) }, () => {
        selectedIndex = id;
        loaderHandler.showLoader('Creating Memory...');
        let draftDetails: any = DefaultDetailsMemory(decode_utf8(title.trim()));
        draftDetails.prompt_id = parseInt(id);
        this.memoryFromPrompt = EventManager.addListener(
          promptIdListener,
          this.promptToMemoryCallBack,
        );
        CreateUpdateMemory(draftDetails, [], promptIdListener, 'save');
        Keyboard.dismiss();
      });

    } else {
      No_Internet_Warning();
    }
  }

  promptToMemoryCallBack = (success: boolean, draftDetails: any) => {
    this.memoryFromPrompt.removeListener();
    setTimeout(() => {
      loaderHandler.hideLoader();
    }, 500);
    if (success) {

      this.removeSelectedPrompt();
      Actions.push('createMemory', {
        editMode: true,
        draftNid: draftDetails,
        isFromPrompt: true,
      });
    } else {
      loaderHandler.hideLoader();
      ToastMessage(draftDetails);
    }
  };

  removeSelectedPrompt() {
    var array = [...this.state.items]; // make a separate copy of the array
    const filteredItems = array.filter(item => item.id !== selectedIndex);
    this.setState({ items: filteredItems });
  }

  hidePrompt(promptId: any) {
    Alert.alert('Hide Prompt', `Are you sure you want to hide this prompt?`, [
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          if (Utility.isInternetConnected) {
            loaderHandler.showLoader();
            HidePrompt(promptId);
          } else {
            No_Internet_Warning();
          }
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => { },
      },
    ]);
  }
}
