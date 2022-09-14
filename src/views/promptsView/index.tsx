import React from 'react';
import {
  ActivityIndicator, Alert, FlatList, Image, ImageBackground, Keyboard, Platform, SafeAreaView, StatusBar,
  Text, TouchableOpacity, View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { plus, sampleimage } from '../../../app/images';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import TextNew from '../../common/component/Text';
import { No_Internet_Warning, ToastMessage } from '../../common/component/Toast';
import { Colors, decode_utf8, fontFamily, fontSize } from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import {
  CreateUpdateMemory,
  promptIdListener
} from '../createMemory/createMemoryWebService';
import { DefaultDetailsMemory } from '../createMemory/dataHelper';
import {
  GetPrompts, HidePrompt, kHidePrompt, kPromptsList
} from '../myMemories/myMemoriesWebService';
import Styles from './styles';
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
            });

          }
          else {
            this.setState({
              items: values,
              loadMore: fetchPromptsList.load_more,
              categoriesArray: fetchPromptsList.prompt_categories,
              offsetVal: fetchPromptsList.prompt_offset,
              prompt_count: fetchPromptsList.prompt_count
            });
          }
          this.setState({ loading: false }, () => loaderHandler.hideLoader());

        }
        else {
          this.setState({ loading: false }, () => loaderHandler.hideLoader());
        }
      },
    );

    this.promptHideListener = EventManager.addListener(
      kHidePrompt,
      (fetched?: boolean, promptId?: any) => {
        if (fetched) {
          var array = [...this.state.items]; // make a separate copy of the array
          const filteredItems = array.filter(item => item.id !== promptId);
          this.setState({ items: filteredItems }, () => loaderHandler.hideLoader());

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
      this.setState({ loading: true }, () => GetPrompts(this.state.categoriesArray, false, this.state.offsetVal));
    }
  }

  componentWillUnmount = () => {
    this.promptHideListener.removeListener()
    this.scrollFlatlistListener.removeListener()
    // this.memoryFromPrompt.removeListener()
    this.promptsListListener.removeListener()
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
      <View style={Styles.footerStyle}>
        <ActivityIndicator color={Colors.newTextColor} />
      </View>
    );
  };

  render() {
    return (
      <View style={Styles.container}>
        <SafeAreaView
          style={Styles.noViewStyle}
        />
        <SafeAreaView style={Styles.safeAreaContextStyle}>
          <View style={Styles.subContainer}>
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
                    this.props.navigation.navigate('topicsFilter', {
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
              ItemSeparatorComponent={() => <View style={Styles.separator} />}
              keyExtractor={(_, index: number) => `${index}`}
              style={Styles.flatlistStyle}
              renderItem={(item: any) => {
                return (
                  <>
                    <View style={{height: item?.index == 0 ? 16 : 0}} />
                    <View style={Styles.promptContainer}>
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
                      <View style={Styles.imageContainer}>
                        <ImageBackground
                          borderTopLeftRadius={24} borderTopRightRadius={24}
                          source={item.item.prompt_image ? { uri: item.item.prompt_image } : sampleimage}
                          resizeMode='cover'
                          style={Styles.promptImage}>
                          <LinearGradient
                            // start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                            // locations={[0, 0.6]}
                            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
                            style={Styles.LinearGradientStyle}>
                          </LinearGradient>
                        </ImageBackground>
                      </View>
                      <View
                        style={Styles.propmptCategoryContainer}>
                        {item.item.prompt_category && item.item.prompt_category.length ?
                          item.item.prompt_category.length === 1 ?
                            <Text
                              style={Styles.promptLable}>
                              {item.item.prompt_category[0].label}
                            </Text>
                            :
                            item.item.prompt_category.map((category, categoryIndex) => (
                              <Text
                                style={Styles.promptCtegory}>
                                {category.label} {categoryIndex + 1 != item.item.prompt_category.length ? ',' : null}
                              </Text>
                            ))
                          :
                          null
                        }

                        <TextNew numberOfLines={3} style={Styles.desc}>
                          {item.item.desc}
                        </TextNew>
                        <View>
                          <TouchableOpacity
                            onPress={() =>
                              this.convertToMemory(item.item.id, item.item.desc)
                            }>
                            <View style={Styles.addmemoryContainer}>
                              <Image source={plus}></Image>
                              <TextNew style={Styles.AnsPrompt}>
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
              <View style={Styles.noPromptContainer}>
                {this.state.loading ? (
                  <ActivityIndicator
                    color={Colors.newTextColor}
                    size="large"
                    style={Styles.activityStyle}
                  />
                ) : (
                  <Text style={Styles.noPrompt}>
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
      this.setState({ selectedPrompt: parseInt(id) }, async () => {
        selectedIndex = id;
        loaderHandler.showLoader('Creating Memory...');
        let draftDetails: any = DefaultDetailsMemory(decode_utf8(title.trim()));
        draftDetails.prompt_id = parseInt(id);
        // this.memoryFromPrompt = EventManager.addListener(
        //   promptIdListener,
        //   this.promptToMemoryCallBack,
        // );
       
        let response = await CreateUpdateMemory(draftDetails, [], promptIdListener, 'save');
        console.warn("res > ", JSON.stringify(response))
        this.promptToMemoryCallBack(response.status, response.id ? response.id : null)

        Keyboard.dismiss();
      });

    } else {
      No_Internet_Warning();
    }
  }

  promptToMemoryCallBack = (success: boolean, draftDetails: any) => {
  
    console.warn("res s> ", JSON.stringify(success), draftDetails)

    // setTimeout(() => {
    //   loaderHandler.hideLoader();
    // }, 500);
    if (success) {

      this.removeSelectedPrompt();
      this.props.navigation.navigate('createMemory', {
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
