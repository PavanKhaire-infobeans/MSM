import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { plus, sampleimage } from '../../../app/images';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import TextNew from '../../common/component/Text';
import { No_Internet_Warning, ToastMessage } from '../../common/component/Toast';
import {
  Colors,
  ConsoleType,
  decode_utf8,
  fontFamily,
  fontSize,
  showConsoleLog,
} from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import {
  CreateUpdateMemory,
  promptIdListener,
} from '../createMemory/createMemoryWebService';
import { DefaultDetailsMemory } from '../createMemory/dataHelper';
import { SHOW_LOADER_READ, SHOW_LOADER_TEXT } from '../dashboard/dashboardReducer';
import {
  GetPrompts,
  HidePrompt,
  kHidePrompt,
  kPromptsList,
} from '../myMemories/myMemoriesWebService';
import Styles from './styles';
import TopicsFilter from './topicsFilter';
type Props = { [x: string]: any };
type State = { [x: string]: any };
var promptList: any[] = [];
var promptCategoriesArray: any[] = [];

var selectedIndex = '';
const PromptsView = (props: Props) => {
  const actionSheetRef = useRef(null);

  const [state, setState] = useState({
    offsetVal: 0,
    categoriesArray: {},
    loadMore: 0,
    items: [],
    loading: false,
    prompt_count: 0,
  })
  let flatListRef: FlatList<unknown>;
  let scrollFlatlistListener: EventManager;


  useEffect(() => {
    scrollFlatlistListener = EventManager.addListener(
      'scrollFlatlist',
      () => {
        flatListRef.scrollToOffset({ offset: 0, animated: false });
      },
    );

    if (props.fromDeepLinking) {
      convertToMemory(props.nid, props.title);
    }
    else {
      setState(prevState => ({
        ...prevState,
        loading: true
      }));

      GetPrompts(state.categoriesArray, false, state.offsetVal,
        response => {
          let fetched = response.fetched, ifLoadMore = response.ifLoadMore, fetchPromptsList = response.fetchPromptsList;
          if (fetched) {

            let values: {
              id: string;
              desc: any;
              prompt_category?: any;
              prompt_image?: any;
            }[] = [];
            if (
              fetchPromptsList.prompt_categories &&
              Object.keys(fetchPromptsList.prompt_categories).length
            ) {
              promptCategoriesArray = Object.values(
                fetchPromptsList.prompt_categories,
              );
            }

            promptList = fetchPromptsList.memory_prompt_data;
            let promptWithCategory: any[] = fetchPromptsList.memory_prompt_data_detail,
              promptWithCategoryValues: any = [];

            if (promptWithCategory && promptWithCategory.length) {

              promptWithCategory.forEach((element, index) => {
                let categoriesArray: any = [];

                for (var key in element) {
                  if (
                    element[key]['prompt_category'] &&
                    element[key]['prompt_category'].length
                  ) {
                    element[key]['prompt_category'].forEach(promptCategory => {
                      let selectedCategory = promptCategoriesArray.filter(
                        item => item.value == promptCategory,
                      );
                      if (selectedCategory.length) {
                        categoriesArray = [
                          ...categoriesArray,
                          ...selectedCategory,
                        ];
                      }
                    });
                  }
                  values.push({
                    id: key,
                    desc: element[key]['title'],
                    prompt_category: categoriesArray,
                    prompt_image: element[key]['prompt_image'],
                  });
                }
              });
            }
          
            if (ifLoadMore) {
              setState(prevState => ({
                ...prevState,
                items: state.items.concat(values),
                loadMore: fetchPromptsList.load_more,
                categoriesArray: fetchPromptsList.prompt_categories,
                offsetVal: fetchPromptsList.prompt_offset,
                prompt_count: fetchPromptsList.prompt_count,
              }));

            } else {
              setState(prevState => ({
                ...prevState,
                items: values,
                loadMore: fetchPromptsList.load_more,
                categoriesArray: fetchPromptsList.prompt_categories,
                offsetVal: fetchPromptsList.prompt_offset,
                prompt_count: fetchPromptsList.prompt_count,
              }));

            }
            setState(prevState => ({
              ...prevState,
              loading: false
            }));
            props.showLoader(false);
            props.loaderText('Loading...');
          }
          else {
            setState(prevState => ({
              ...prevState,
              loading: false
            }));
            props.showLoader(false);
            props.loaderText('Loading...');
          }
        });
    }

    return () => {
      scrollFlatlistListener.removeListener();
    }
  }, [])

  useEffect(() => {
    if (props.showTopicFilters) {
      if (state.categoriesArray && Object.values(state.categoriesArray).length) {
        actionSheetRef.current?.show();
      }
    } else {
      actionSheetRef.current?.hide();
    }
  }, [props.showTopicFilters, state.categoriesArray]);

  const applyFilters = (filteredTopics) => {
    props.hideFilters();
    setState(prevState => ({
      ...prevState,
      loading: true,
      items:[]
    }));
    GetPrompts(filteredTopics, false, 0,
      response => {
        let fetched = response.fetched, ifLoadMore = response.ifLoadMore, fetchPromptsList = response.fetchPromptsList;
        if (fetched) {

          let values: {
            id: string;
            desc: any;
            prompt_category?: any;
            prompt_image?: any;
          }[] = [];
          if (
            fetchPromptsList.prompt_categories &&
            Object.keys(fetchPromptsList.prompt_categories).length
          ) {
            promptCategoriesArray = Object.values(
              fetchPromptsList.prompt_categories,
            );
          }

          promptList = fetchPromptsList.memory_prompt_data;
          let promptWithCategory: any[] = fetchPromptsList.memory_prompt_data_detail,
            promptWithCategoryValues: any = [];

          if (promptWithCategory && promptWithCategory.length) {

            promptWithCategory.forEach((element, index) => {
              let categoriesArray: any = [];

              for (var key in element) {
                if (
                  element[key]['prompt_category'] &&
                  element[key]['prompt_category'].length
                ) {
                  element[key]['prompt_category'].forEach(promptCategory => {
                    let selectedCategory = promptCategoriesArray.filter(
                      item => item.value == promptCategory,
                    );
                    if (selectedCategory.length) {
                      categoriesArray = [
                        ...categoriesArray,
                        ...selectedCategory,
                      ];
                    }
                  });
                }
                values.push({
                  id: key,
                  desc: element[key]['title'],
                  prompt_category: categoriesArray,
                  prompt_image: element[key]['prompt_image'],
                });
              }
            });
          }
          showConsoleLog(ConsoleType.LOG, "data >> ", JSON.stringify(values));

          if (ifLoadMore) {
            setState(prevState => ({
              ...prevState,
              items: state.items.concat(values),
              loadMore: fetchPromptsList.load_more,
              categoriesArray: fetchPromptsList.prompt_categories,
              offsetVal: fetchPromptsList.prompt_offset,
              prompt_count: fetchPromptsList.prompt_count,
            }));

          } else {
            setState(prevState => ({
              ...prevState,
              items: values,
              loadMore: fetchPromptsList.load_more,
              categoriesArray: fetchPromptsList.prompt_categories,
              offsetVal: fetchPromptsList.prompt_offset,
              prompt_count: fetchPromptsList.prompt_count,
            }));

          }
          setState(prevState => ({
            ...prevState,
            loading: false
          }));
          props.showLoader(false);
          props.loaderText('Loading...');
        }
        else {
          setState(prevState => ({
            ...prevState,
            loading: false
          }));
          props.showLoader(false);
          props.loaderText('Loading...');
        }
      });
  }

  const loadMorePrompts = () => {
    if (state.loadMore == 1) {
      if (Utility.isInternetConnected) {
        GetPrompts(state.categoriesArray, true, state.offsetVal,
          response => {
            let fetched = response.fetched, ifLoadMore = response.ifLoadMore, fetchPromptsList = response.fetchPromptsList;
            if (fetched) {

              let values: {
                id: string;
                desc: any;
                prompt_category?: any;
                prompt_image?: any;
              }[] = [];

              if (
                fetchPromptsList.prompt_categories &&
                Object.keys(fetchPromptsList.prompt_categories).length
              ) {
                promptCategoriesArray = Object.values(
                  fetchPromptsList.prompt_categories,
                );
              }

              promptList = fetchPromptsList.memory_prompt_data;
              let promptWithCategory: any[] =
                fetchPromptsList.memory_prompt_data_detail,
                promptWithCategoryValues: any = [];

              if (promptWithCategory && promptWithCategory.length) {

                promptWithCategory.forEach((element, index) => {
                  let categoriesArray: any = [];

                  for (var key in element) {
                    if (
                      element[key]['prompt_category'] &&
                      element[key]['prompt_category'].length
                    ) {
                      element[key]['prompt_category'].forEach(promptCategory => {
                        let selectedCategory = promptCategoriesArray.filter(
                          item => item.value == promptCategory,
                        );
                        if (selectedCategory.length) {
                          categoriesArray = [
                            ...categoriesArray,
                            ...selectedCategory,
                          ];
                        }
                      });
                    }
                    values.push({
                      id: key,
                      desc: element[key]['title'],
                      prompt_category: categoriesArray,
                      prompt_image: element[key]['prompt_image'],
                    });
                  }
                });
              }

              if (ifLoadMore) {
                setState(prevState => ({
                  ...prevState,
                  items: state.items.concat(values),
                  loadMore: fetchPromptsList.load_more,
                  categoriesArray: fetchPromptsList.prompt_categories,
                  offsetVal: fetchPromptsList.prompt_offset,
                  prompt_count: fetchPromptsList.prompt_count,
                }));

              } else {
                setState(prevState => ({
                  ...prevState,
                  items: values,
                  loadMore: fetchPromptsList.load_more,
                  categoriesArray: fetchPromptsList.prompt_categories,
                  offsetVal: fetchPromptsList.prompt_offset,
                  prompt_count: fetchPromptsList.prompt_count,
                }));

              }
              setState(prevState => ({
                ...prevState,
                loading: false
              }));
              props.showLoader(false);
              props.loaderText('Loading...');
            }
            else {
              setState(prevState => ({
                ...prevState,
                loading: false
              }));
              props.showLoader(false);
              props.loaderText('Loading...');
            }
          });
      } else {
        No_Internet_Warning();
      }
    }
  }

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (state.loadMore == 0) return null;
    return (
      <View style={Styles.footerStyle}>
        <ActivityIndicator color={Colors.newTextColor} />
      </View>
    );
  };

  const renderItem = (item: any) => {
    return (
      <View key={item.index}>
        <View style={{ height: item?.index == 0 ? 16 : 0 }} />
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
              borderTopLeftRadius={24}
              borderTopRightRadius={24}
              source={
                item.item.prompt_image
                  ? { uri: item.item.prompt_image }
                  : sampleimage
              }
              resizeMode="cover"
              style={Styles.promptImage}>
              <LinearGradient
                // start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                // locations={[0, 0.6]}
                colors={[
                  'rgba(255, 255, 255, 0)',
                  'rgba(255, 255, 255, 1)',
                ]}
                style={Styles.LinearGradientStyle}></LinearGradient>
            </ImageBackground>
          </View>
          <View style={Styles.propmptCategoryContainer}>
            {item.item.prompt_category &&
              item.item.prompt_category.length ? (
              item.item.prompt_category.length === 1 ? (
                <Text style={Styles.promptLable}>
                  {item.item.prompt_category[0].label}
                </Text>
              ) : (
                item.item.prompt_category.map(
                  (category, categoryIndex) => (
                    <Text style={Styles.promptCtegory}>
                      {category.label}{' '}
                      {categoryIndex + 1 !=
                        item.item.prompt_category.length
                        ? ','
                        : null}
                    </Text>
                  ),
                )
              )
            ) : null}

            <TextNew numberOfLines={3} style={Styles.desc}>
              {item.item.desc}
            </TextNew>
            <View>
              <TouchableOpacity
                onPress={() =>
                  convertToMemory(item.item.id, item.item.desc)
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
      </View>
    );
  };

  const convertToMemory = async (id: any, title: any) => {
    if (Utility.isInternetConnected) {
      setState(prevState => ({
        ...prevState,
        selectedPrompt: parseInt(id)
      }));

      {
        selectedIndex = id;
        //loaderHandler.showLoader('Creating Memory...');
        let draftDetails: any = DefaultDetailsMemory(decode_utf8(title.trim()));
        draftDetails.prompt_id = parseInt(id);
        props.showLoader(true);
        props.loaderText('Creating Memory...');
        let response: any = await CreateUpdateMemory(
          draftDetails,
          [],
          promptIdListener,
          'save',
          response => {
            promptToMemoryCallBack(
              response.status,
              response.id ? response.id : null,
            );
          },
        );

        Keyboard.dismiss();
      };
    } else {
      No_Internet_Warning();
    }
  }

  const promptToMemoryCallBack = (success: boolean, draftDetails: any) => {
    if (success) {
      removeSelectedPrompt();
      props.showLoader(false);
      props.loaderText('Loading...');
      props.navigation.navigate('createMemory', {
        editMode: true,
        draftNid: draftDetails,
        isFromPrompt: true,
      });
    } else {
      //loaderHandler.hideLoader();
      props.showLoader(false);
      props.loaderText('Loading...');
      //ToastMessage(draftDetails);
    }
  };

  const removeSelectedPrompt = () => {
    var array = [...state.items]; // make a separate copy of the array
    const filteredItems = array.filter(item => item.id !== selectedIndex);
    setState(prevState => ({
      ...prevState,
      items: filteredItems
    }));
  }

  const hidePrompt = (promptId: any) => {
    Alert.alert('Hide Prompt', `Are you sure you want to hide this prompt?`, [
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          if (Utility.isInternetConnected) {
            //loaderHandler.showLoader();

            props.showLoader(true);
            props.loaderText('Loading...');
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

  return (
    <View style={Styles.container}>
      <SafeAreaView style={Styles.noViewStyle} />
      <SafeAreaView style={Styles.safeAreaContextStyle}>
        <View style={Styles.subContainer}>
          {/* <NavigationBar title={TabItems.Prompts} /> */}
          <StatusBar
            barStyle={
              Utility.currentTheme == 'light'
                ? 'dark-content'
                : 'light-content'
            }
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
              flatListRef = ref;
            }}
            data={state.items}
            // extraData={state}
            onScroll={() => {
              Keyboard.dismiss();
            }}
            maxToRenderPerBatch={5}
            windowSize={5}
            initialNumToRender={10}
            removeClippedSubviews={true}
            ItemSeparatorComponent={() => <View style={Styles.separator} />}
            keyExtractor={(_, index: number) => `${index}`}
            style={Styles.flatlistStyle}
            renderItem={renderItem}
            ListFooterComponent={() => renderFooter()}
            onEndReachedThreshold={0.4}
            onEndReached={() => loadMorePrompts()}
          />
          {state.items.length == 0 && (
            <View style={Styles.noPromptContainer}>
              {state.loading ? (
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

        <ActionSheet
          closeOnTouchBackdrop={false}
          closeOnPressBack={false}
          ref={actionSheetRef}>
          <TopicsFilter
            categories={state.categoriesArray}
            closeAction={() => {
              props.hideFilters();
            }}
            applyFilters={applyFilters}
          />
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0)',
              'rgba(255, 255, 255, 0.9)',
              'rgba(255, 255, 255, 1)',
            ]}
            style={Styles.linearGardStyle}></LinearGradient>
          <LinearGradient
            colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)']}
            style={Styles.linearGardBottomStyle}></LinearGradient>
        </ActionSheet>

      </SafeAreaView>
    </View>
  );

}

const mapState = (state: any) => {
  return {
    showLoaderValue: state.dashboardReducer.showLoader,
    loaderTextValue: state.dashboardReducer.loaderText,
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    showLoader: (payload: any) =>
      dispatch({ type: SHOW_LOADER_READ, payload: payload }),
    loaderText: (payload: any) =>
      dispatch({ type: SHOW_LOADER_TEXT, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(PromptsView)