import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {ListType} from '../../../views/dashboard/dashboardReducer';
import {Border} from '../../../views/memoryDetails/componentsMemoryDetails';
import {
  CommentBox,
  MediaView,
  MemoryBasicDetails,
  RenderLikeAndCommentSection,
  _onShowMemoryDetails,
} from '../../../views/myMemories/PublishedMemory';
import {PublishedMemoryDataModel} from '../../../views/myMemories/PublishedMemory/publishedMemoryDataModel';
import {Colors, fontFamily, fontSize} from '../../constants';
import Utility from '../../utility';
import PlaceholderImageView from '../placeHolderImageView';
import TextNew from '../Text';
//@ts-ignore
import Carousel, {Pagination} from 'react-native-snap-carousel';
import WebView from 'react-native-webview';
import {calendar} from '../../../images';
import Prompts from '../prompts/prompts';

type Props = {
  addMemoryFromPrompt?: (firstIndex: any, secondIndex: any) => void;
  item: any;
  like: any;
  animate: any;
  listType: any;
  previousItem?: any;
  audioView: any;
  openMemoryActions: (item: any) => void;
  jumpToVisibility?: (item: any) => void;
  navigation?: any;
};

type State = {activeIndex: any};

export default class MemoryListItem extends React.PureComponent<Props, State> {
  views = '';
  externalCueItems = [
    'songs',
    'movies_collection',
    'news_collection',
    'book_collection',
    'tv_shows_collection',
    'sports_collection',
  ];
  state = {activeIndex: 0};
  showJumpTo =
    this.props.listType == ListType.Timeline &&
    (this.props.previousItem == null ||
      this.props.item.item.memory_date != this.props.previousItem.memory_date);
  render() {
    let userDetails = !this.props?.item?.item?.isPrompt
      ? PublishedMemoryDataModel.getUserObj(this.props.item.item)
      : {};
    return (
      <View>
        {!this.props?.item?.item?.isPrompt ? (
          <View
            style={{
              backgroundColor: 'white',
              margin: 5,
              marginTop: 10,
              borderTopEndRadius: 5,
              borderTopStartRadius: 5,
            }}>
            {this.showJumpTo && (
              <TouchableHighlight
                underlayColor={'none'}
                onPress={() =>
                  this.props.jumpToVisibility(this.props.item.item.memory_date)
                }
                style={{backgroundColor: Colors.NewThemeColor}}>
                <View
                  style={{
                    backgroundColor: 'rgba(255, 255, 253, 0.4)',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginBottom: -5,
                    borderTopEndRadius: 5,
                    borderTopStartRadius: 5,
                    padding: 16,
                    paddingTop: 10,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Image source={calendar} />
                    <TextNew
                      style={{
                        color: '#373852',
                        paddingLeft: 7,
                        fontWeight: '400',
                        ...fontSize(16),
                      }}>
                      {this.props.item.item.memory_date}
                    </TextNew>
                  </View>
                  <TextNew
                    style={{
                      color: '#373852',
                      fontWeight: '400',
                      ...fontSize(16),
                    }}>
                    Jump to...
                  </TextNew>
                </View>
              </TouchableHighlight>
            )}
            {this.externalCueItems.includes(this.props.item.item.type) ? (
              this.props.item.item.type == 'songs' ? (
                <WebView
                  source={{uri: this.props.item.item.api_url}}
                  style={{width: '100%', minHeight: 400}}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={true}
                />
              ) : (
                <View>
                  <TouchableHighlight
                    underlayColor={'#ffffff00'}
                    style={{flex: 1, borderRadius: 5, marginTop: -2}}
                    onPress={() => {
                      // _onShowMemoryDetails(
                      //   this.props.item.item,
                      //   this.props.navigation,
                      // );
                    }}>
                    <View
                      style={{
                        padding: 5,
                        width: '100%',
                        flexDirection: 'row',
                        backgroundColor: Colors.ThemeColor,
                        borderTopEndRadius: 5,
                        borderTopStartRadius: 5,
                        justifyContent: 'space-between',
                      }}>
                      <TextNew
                        style={{
                          ...fontSize(30),
                          paddingLeft: 5,
                          color: 'white',
                          flex: 1,
                          fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                          fontFamily:
                            Platform.OS === 'ios'
                              ? fontFamily.Inter
                              : fontFamily.InterMedium,
                          textAlign: 'left',
                        }}>
                        {this.props.item.item.title}
                      </TextNew>
                      <TouchableWithoutFeedback
                        onPress={() =>
                          this.props.openMemoryActions(this.props.item.item)
                        }>
                        <View
                          style={{
                            padding: 8,
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View
                            style={{
                              justifyContent: 'space-between',
                              flex: 1,
                              width: 24,
                              alignItems: 'center',
                              flexDirection: 'row',
                            }}>
                            <View
                              style={{
                                backgroundColor: '#fff',
                                height: 6,
                                width: 6,
                                borderRadius: 3,
                              }}></View>
                            <View
                              style={{
                                backgroundColor: '#fff',
                                height: 6,
                                width: 6,
                                borderRadius: 3,
                              }}></View>
                            <View
                              style={{
                                backgroundColor: '#fff',
                                height: 6,
                                width: 6,
                                borderRadius: 3,
                              }}></View>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableHighlight>
                  <View
                    style={{flex: 1, backgroundColor: '#fff', paddingLeft: 0}}>
                    <View>
                      <Carousel
                        data={this.props.item.item.collection}
                        renderItem={(collection: any) => (
                          <TouchableHighlight
                            underlayColor={'none'}
                            onPress={() => {
                              // _onShowMemoryDetails(
                              //   this.props.item.item,
                              //   this.props.navigation,
                              // );
                            }}>
                            <View>
                              <PlaceholderImageView
                                style={{
                                  width: '100%',
                                  marginTop: 30,
                                  height: 300,
                                }}
                                uri={Utility.getFileURLFromPublicURL(
                                  collection.item.images.thumbnail_url,
                                )}
                                resizeMode={'center'}
                              />
                              <TextNew
                                style={{
                                  width: '100%',
                                  ...fontSize(14),
                                  paddingTop: 10,
                                  fontWeight: '500',
                                  fontFamily:
                                    Platform.OS === 'ios'
                                      ? fontFamily.Inter
                                      : fontFamily.InterMedium,
                                  textAlign: 'center',
                                }}>
                                {collection.item.title}
                              </TextNew>
                            </View>
                          </TouchableHighlight>
                        )}
                        sliderWidth={Dimensions.get('window').width - 10}
                        itemWidth={Dimensions.get('window').width - 150}
                        onSnapToItem={(index: any) =>
                          this.setState({activeIndex: index})
                        }
                      />
                      <Pagination
                        dotsLength={this.props.item.item.collection.length}
                        activeDotIndex={this.state.activeIndex}
                        dotStyle={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          marginHorizontal: 2,
                          backgroundColor: Colors.NewThemeColor,
                        }}
                        inactiveDotStyle={{
                          backgroundColor: 'grey',
                        }}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                      />
                    </View>
                  </View>
                </View>
              )
            ) : (
              <View style={{backgroundColor: Colors.NewThemeColor}}>
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 5,
                    marginTop: -2,
                  }}>
                  {MemoryBasicDetails(
                    userDetails,
                    this.props.item.item,
                    this.props.openMemoryActions,
                    this.props.listType,
                  )}
                  {this.props.listType == ListType.Published && (
                    <View style={{paddingRight: 16, paddingLeft: 16}}>
                      <Border />
                    </View>
                  )}
                  <TouchableHighlight
                    underlayColor={'#ffffff00'}
                    style={{flex: 1, borderRadius: 5}}
                    onPress={() => {
                      // _onShowMemoryDetails(
                      //   this.props.item.item,
                      //   this.props.navigation,
                      // );
                    }}>
                    <View>
                      <TextNew
                        style={{
                          ...fontSize(30),
                          color: Colors.NewTitleColor,
                          fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                          fontFamily:
                            Platform.OS === 'ios'
                              ? fontFamily.Inter
                              : fontFamily.InterMedium,
                          marginLeft: 16,
                          marginRight: 16,
                          textAlign: 'left',
                        }}>
                        {this.props.item.item.title}
                      </TextNew>
                      {/* {this.props.item.item.dateWithLocation &&
                        this.props.item.item.dateWithLocation.length != 0 && ( */}
                      <TextNew
                        numberOfLines={2}
                        style={{
                          ...fontSize(16),
                          color: Colors.dullText,
                          fontStyle: 'italic',
                          textAlign: 'left',
                          marginTop: 5,
                          marginBottom: 5,
                          marginLeft: 16,
                          marginRight: 16,
                        }}>
                        {this.props.item.item.dateWithLocation
                          ? this.props.item.item.dateWithLocation
                          : this.props.item.item.memory_date}
                        {this.props.listType != ListType.Published &&
                        this.props.item.item.viewCount > 0 ? (
                          <TextNew>
                            {' | '}
                            {this.props.item.item.viewCount}{' '}
                            {this.props.item.item.viewCount > 1
                              ? 'views'
                              : 'view'}
                          </TextNew>
                        ) : (
                          ''
                        )}
                      </TextNew>
                      {/* )} */}
                      {
                        <View style={{paddingRight: 16, paddingLeft: 16}}>
                          <Border />
                        </View>
                      }
                      {this.props.item.item.description &&
                      this.props.item.item.description.length != 0 ? (
                        <TextNew
                          numberOfLines={3}
                          style={{
                            ...fontSize(18),
                            color: Colors.TextColor,
                            marginLeft: 16,
                            marginRight: 16,
                            marginBottom: 8,
                            textAlign: 'left',
                          }}>
                          {this.props.item.item.description}
                        </TextNew>
                      ) : null}
                      <View
                        style={{
                          marginLeft: 16,
                          marginRight: 16,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          {this.props.item.item.mins_to_read ? (
                            <TextNew
                              style={{
                                ...fontSize(14),
                                fontStyle: 'italic',
                                color: Colors.dullText,
                                marginBottom: 8,
                              }}>
                              {'< '}
                              {this.props.item.item.mins_to_read}{' '}
                            </TextNew>
                          ) : null}
                        </View>
                        {Utility.getNumberOfLines(
                          this.props.item.item.description,
                          18,
                          Dimensions.get('window').width - 70,
                        ) > 3 && (
                          <TextNew
                            style={{
                              ...fontSize(18),
                              fontWeight:
                                Platform.OS === 'ios' ? '500' : 'bold',
                              fontFamily:
                                Platform.OS === 'ios'
                                  ? fontFamily.Inter
                                  : fontFamily.InterMedium,
                              color: Colors.NewYellowColor,
                              marginBottom: 16,
                            }}>
                            {'Continue reading'}
                          </TextNew>
                        )}
                      </View>
                      {MediaView(
                        this.props.item,
                        this.props.audioView,
                        this.props.navigation,
                      )}
                      {RenderLikeAndCommentSection(
                        this.props.item,
                        this.props.like,
                        this.props.animate,
                      )}
                      {CommentBox(this.props.item)}
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            )}
          </View>
        ) : (
          this.props.item.item.active_prompts.length > 0 && (
            <View
              style={{
                marginLeft: 5,
                marginRight: 5,
                marginBottom: 5,
                paddingTop: 14,
                backgroundColor: Colors.NewThemeColor,
              }}>
              <View
                style={{
                  width: '100%',
                  padding: 16,
                  paddingTop: 7,
                  borderRadius: 5,
                  backgroundColor: Colors.ThemeColor,
                }}>
                <Prompts
                  data={this.props.item.item.active_prompts}
                  onAddToMemory={(index: any) =>
                    this.props.addMemoryFromPrompt(this.props.item.index, index)
                  }></Prompts>
              </View>
            </View>
          )
        )}
      </View>
    );
  }
}
