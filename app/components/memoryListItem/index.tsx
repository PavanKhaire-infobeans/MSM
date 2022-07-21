import React, { createRef } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import { ListType } from './../../../src/views/dashboard/dashboardReducer';
import { Border } from './../../../src/views/memoryDetails/componentsMemoryDetails';
import {
  CommentBox,
  MediaView,
  MemoryBasicDetails,
  RenderLikeAndCommentSection,
  _onShowMemoryDetails,
} from './../../views/myMemories/PublishedMemory';
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import { PublishedMemoryDataModel } from './../../../src/views/myMemories/PublishedMemory/publishedMemoryDataModel';
import { Colors, fontFamily, fontSize, MemoryActionKeys } from './../../../src/common/constants';
import Utility from './../../../src/common/utility';
import PlaceholderImageView from './../../../src/common/component/placeHolderImageView';
import TextNew from './../../../src/common/component/Text';
//@ts-ignore
import Carousel, { Pagination } from 'react-native-snap-carousel';
import WebView from 'react-native-webview';
// import { calendar } from './../../../src/images';
// import SelectDropdown from 'react-native-select-dropdown'
import { globesmall, calendarsmall, calender, moreoptions } from './../../images';
import Prompts from './../../../src/common/component/prompts/prompts';
import styles from './styles';
import Styles from './styles';
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
  MemoryActions?: any;
};

type State = { activeIndex: any };

export default class MemoryListItem extends React.Component<Props, State> {
  views = '';
  dropDownRef = createRef();
  externalCueItems = [
    'songs',
    'movies_collection',
    'news_collection',
    'book_collection',
    'tv_shows_collection',
    'sports_collection',
  ];
  state = {
    activeIndex: 0,
    item: {}
  };


  setItem = (item) => {
    // alert(JSON.stringify(item))
    this.setState({
      item
    }, () => {
      setTimeout(() => {
        this.dropDownRef.current.openDropdown()
      }, 1000);
    })
  }
  showJumpTo =
    this.props.listType == ListType.Timeline &&
    (this.props.previousItem == null ||
      this.props.item.item.memory_date != this.props.previousItem.memory_date);
  render() {
    let userDetails = !this.props.item.item.isPrompt
      ? PublishedMemoryDataModel.getUserObj(this.props.item.item)
      : {};

    return (
      <>
        {!this.props.item.item.isPrompt ? (
          <View
            style={[styles.promptContainer, { shadowColor: '(7, 53, 98, 0.05)',}]}>

            {this.externalCueItems.includes(this.props.item.item.type) ? (
              this.props.item.item.type == 'songs' ? (
                <WebView
                  source={{ uri: this.props.item.item.api_url }}
                  style={styles.WebViewContainerStyle}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={true}
                />
              ) : (
                <View >
                  <TouchableHighlight
                    underlayColor={Colors.touchableunderlayColor}
                    style={styles.authorContainer}
                    onPress={() => {
                      _onShowMemoryDetails(this.props.item.item, "Recent");
                    }}>
                    <View
                      style={styles.titleContainer}>
                      <TextNew
                        style={styles.titleText}>
                        {this.props.item.item.title}
                      </TextNew>
                      <TouchableWithoutFeedback
                        onPress={() =>
                          this.props.openMemoryActions(this.props.item.item)
                        }>
                        <View style={styles.playContainer}>
                          <Image source={moreoptions} />
                        </View>

                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableHighlight>
                  <View
                    style={styles.carouselContainer}>
                    <>
                      <Carousel
                        data={this.props.item.item.collection}
                        renderItem={(collection: any) => (
                          <TouchableHighlight
                            underlayColor={'none'}
                            onPress={() => {
                              _onShowMemoryDetails(this.props.item.item, "Recent");
                            }}>
                            <View>
                              <PlaceholderImageView
                                style={styles.PlaceholderImageView}
                                uri={Utility.getFileURLFromPublicURL(
                                  collection.item.images.thumbnail_url,
                                )}
                                resizeMode={'center'}
                              />
                              <TextNew
                                style={styles.collectionTitle}>
                                {collection.item.title}
                              </TextNew>
                            </View>
                          </TouchableHighlight>
                        )}
                        sliderWidth={Dimensions.get('window').width - 10}
                        itemWidth={Dimensions.get('window').width - 150}
                        onSnapToItem={(index: any) =>
                          this.setState({ activeIndex: index })
                        }
                      />
                      <Pagination
                        dotsLength={this.props.item.item.collection.length}
                        activeDotIndex={this.state.activeIndex}
                        dotStyle={styles.dotStyle}
                        inactiveDotStyle={{
                          backgroundColor: 'grey',
                        }}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                      />
                    </>
                  </View>
                </View>
              )
            ) : (
              <View style={styles.mainMemoryContainerStyle}>
                <View
                  style={styles.memoriesContainer}>
                  {MemoryBasicDetails(
                    userDetails,
                    this.props.item.item,
                    this.setItem,
                    this.props.listType,
                    // this.props.openMemoryActions,
                    // _onShowMemoryDetails(this.props.item.item,"Recent")
                  )}
                  {/* <View style={styles.space}/> */}

                  <TouchableHighlight
                    underlayColor={Colors.touchableunderlayColor}
                    style={styles.mediaContainer}
                    onPress={() => {
                      _onShowMemoryDetails(this.props.item.item, "Recent");
                    }}>
                    <View>

                      {MediaView(this.props.item, this.props.audioView)}

                      <View style={styles.dateContainer}>
                        <View style={styles.shareTextContainerStyle}>
                          <Image source={globesmall} />
                          <TextNew
                            style={styles.sharewithTextStyle}>
                            {this.props.item.item.shareText}
                          </TextNew>
                        </View>
                        <View style={styles.memoryDateContainer}>
                          <Image style={styles.imageTopMargin} source={calendarsmall} />
                          <TextNew
                            style={styles.memoryDatetext}>
                            {this.props.item.item.memoryDateDisplay}
                            {/* memory_date */}
                          </TextNew>
                        </View>
                      </View>

                      <View style={{ height: 8 }} />

                      <TextNew
                        numberOfLines={2}
                        style={styles.memoryTitle}>
                        {this.props.item.item.title}
                      </TextNew>
                      {/* {this.props.item.item.dateWithLocation &&
                        this.props.item.item.dateWithLocation.length != 0 && ( */}

                      {/* )} */}
                      {
                        <View style={{ paddingRight: 16, paddingLeft: 16, height: 8 }}>
                          {/* <Border /> */}
                        </View>
                      }
                      {this.props.item.item.description &&
                        this.props.item.item.description.length != 0 ? (
                        <Text
                          numberOfLines={5}
                          style={styles.descriptionText}>
                          {this.props.item.item.description}
                        </Text>
                       
                          // <RenderHtml
                          //   tagsStyles={{ p: Styles.descriptionText, li: Styles.descriptionText, span: Styles.descriptionText }}
                          //   source={{ html: this.props.item.item.memoryDescription }}
                          //   // ignoredDomTags={['br']}
                          //   enableExperimentalBRCollapsing={true}
                          //   contentWidth={Dimensions.get('window').width}
                          //   enableExperimentalMarginCollapsing={true}
                          // ></RenderHtml>
                      ) : null}

                      {RenderLikeAndCommentSection(
                        this.props.item,
                        this.props.like,
                        this.props.animate,
                      )}
                      <View style={styles.height16} />
                      {/* {CommentBox(this.props.item)} */}
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            )}
          </View>
        ) : (
          this.props.item.item.active_prompts.length > 0 && (
            <View
              style={[styles.activepromptsContainer, { shadowColor: '(7, 53, 98, 0.05)', }]}>
              <View
                style={styles.activepromptsSubContainer}>
                <Prompts
                  data={this.props.item.item.active_prompts}
                  onAddToMemory={(index: any) =>
                    this.props.addMemoryFromPrompt(this.props.item.index, index)
                  }></Prompts>
              </View>
            </View>
          )
        )}

      </>
    );
  }
}
