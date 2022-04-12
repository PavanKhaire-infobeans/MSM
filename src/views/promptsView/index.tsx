import React, {Component} from 'react';
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
  RefreshControl,
  TouchableHighlight,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import {TabItems} from '../../common/component/TabBarIcons';
import TextNew from '../../common/component/Text';
import {No_Internet_Warning, ToastMessage} from '../../common/component/Toast';
import {Colors, decode_utf8, fontSize} from '../../common/constants';
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
import {DefaultDetailsMemory} from '../createMemory/dataHelper';
import NavigationBar from '../dashboard/NavigationBar';
import edit from '../mindPop/edit';
import {
  GetPrompts,
  kPromptsList,
  kHidePrompt,
  HidePrompt,
} from '../myMemories/myMemoriesWebService';
type Props = {[x: string]: any};
type State = {[x: string]: any};
var promptList: any[] = [];
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
        this.flatListRef.scrollToOffset({offset: 0, animated: false});
      },
    );
    this.promptsListListener = EventManager.addListener(
      kPromptsList,
      (fetched?: boolean, ifLoadMore?: boolean, fetchPromptsList?: any) => {
        if (fetched) {
          let values: {id: string; desc: any}[] = [];
          this.setState({ 
                          loadMore: fetchPromptsList.load_more,
                          categoriesArray: fetchPromptsList.prompt_categories
                        });
          promptList = fetchPromptsList.memory_prompt_data;
          this.setState({offsetVal: fetchPromptsList.prompt_offset, prompt_count : fetchPromptsList.prompt_count});
          promptList.forEach(element => {
            for (var key in element) {
              values.push({id: key, desc: element[key]});
            }
          });
          ;
          if (ifLoadMore) {
            this.setState({
              items: this.state.items.concat(values),
            });
          } else {
            this.setState({items: values});
          }
          this.setState({loading: false});
          loaderHandler.hideLoader();
        } else {
          this.setState({loading: false});
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
          this.setState({items: filteredItems});
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
    else{
      this.setState({loading: true});
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
      <View style={{width: '100%', height: 40, marginTop: 20}}>
        <ActivityIndicator color={'white'} />
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView
          style={{
            width: '100%',
            flex: 0,
            backgroundColor: Colors.NewThemeColor,
          }}
        />
        <SafeAreaView style={{width: '100%', flex: 1, backgroundColor: '#fff'}}>
          <View style={{flex: 1, backgroundColor: Colors.NewThemeColor}}>
            <NavigationBar title={TabItems.Prompts} />
            <StatusBar
              barStyle={'dark-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            {!this.state.loading && (
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
            )}
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
              keyExtractor={(_, index: number) => `${index}`}
              style={{width: '100%', backgroundColor: Colors.NewThemeColor}}
              renderItem={(item: any) => {
                return (
                  <View
                    style={{
                      margin: 10,
                      width: '90%',
                      borderRadius: 15,
                      backgroundColor: '#FFFFFD',
                      height: 200,
                      borderWidth: 0,
                      justifyContent: 'space-between',
                      alignSelf: 'center',
                      shadowOpacity: 0.2,
                      elevation: 0.2,
                    }}>
                    <View>
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
                    </View>
                    <View style={{flex: 1}}>
                      <TextNew
                        numberOfLines={3}
                        style={{
                          ...fontSize(21),
                          color: '#373852',
                          fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                          marginLeft: 20,
                          flex: 1,
                          marginRight: 20,
                          marginBottom: 16,
                          textAlign: 'center',
                          paddingTop: 15,
                        }}>
                        {item.item.desc}
                      </TextNew>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() =>
                          this.convertToMemory(item.item.id, item.item.desc)
                        }>
                        <View
                          style={{
                            flexDirection: 'row',
                            backgroundColor: '#4EB79E',
                            padding: 16,
                            justifyContent: 'center',
                            borderBottomLeftRadius: 15,
                            borderBottomRightRadius: 15,
                          }}>
                          <Image source={edit_prompt}></Image>
                          <TextNew
                            style={{
                              ...fontSize(18),
                              marginLeft: 5,
                              fontWeight: '400',
                              color: '#FDFDFD',
                            }}>
                            Add your Memory
                          </TextNew>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
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
                    color={Colors.ThemeColor}
                    size="large"
                    style={{flex: 1, justifyContent: 'center'}}
                  />
                ) : (
                  <Text
                    style={{
                      ...fontSize(16),
                      color: Colors.dullText,
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
      this.setState({selectedPrompt: parseInt(id)},()=>{
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
    this.setState({items: filteredItems});
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
        onPress: () => {},
      },
    ]);
  }
}
