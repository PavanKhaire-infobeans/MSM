import React, {createRef} from 'react';
import {
  Dimensions,
  Image,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import PlaceholderImageView from './../../../src/common/component/placeHolderImageView';
import TextNew from './../../../src/common/component/Text';
import {Colors, MemoryActionKeys} from './../../../src/common/constants';
import Utility from './../../../src/common/utility';
import {PublishedMemoryDataModel} from './../../../src/views/myMemories/PublishedMemory/publishedMemoryDataModel';
import {
  MediaView,
  MemoryBasicDetails,
  onActionItemClicked,
  RenderLikeAndCommentSection,
  _onShowMemoryDetails,
} from './../../views/myMemories/PublishedMemory';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import WebView from 'react-native-webview';
// import { calendar } from './../../../src/images';
import Prompts from './../../../src/common/component/prompts/prompts';
import {calendarsmall, globesmall, moreoptions} from './../../images';
import styles from './styles';
import ContextMenu from 'react-native-context-menu-view';
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
  onLayout?: any;
  navigation?: any;
};

type State = {activeIndex: any};

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
    item: {},
  };

  setItem = item => {
    this.setState(
      {
        item,
      },
      () => {
        setTimeout(() => {
          this.dropDownRef.current.openDropdown();
        }, 1000);
      },
    );
  };

  MemoryActionsListArray = (item: any) => {
    var i = 0;
    let memoryActions: any = [];
    memoryActions.push({
      text: 'Share memory',
      title: 'Share memory',
      // image: add_icon_small,
      nid: item?.nid,
      memory_url: item?.memory_url,
      memoryType: item?.type,
      actionType: MemoryActionKeys.shareActionKey,
      uid: item?.user_details?.uid,
    });
    
    for (var value in item?.actions_on_memory) {
      i += 1;
      switch (value) {
        case MemoryActionKeys.addToCollection:
          memoryActions.push(
            {
              // index: i,
              text: item?.actions_on_memory[value],
              title: item?.actions_on_memory[value],
              // image: add_icon_small,
              nid: item?.nid,
              memoryType: item?.type,
              actionType: MemoryActionKeys.addToCollection,
              uid: item?.user_details.uid,
            }
          );
          break;
        case MemoryActionKeys.blockUserKey:
          memoryActions.push({
            // index: i,
            text: item?.actions_on_memory[value],
            title: item?.actions_on_memory[value],
            // image: Platform.OS == 'ios' ? personxmark :block,
            nid: item?.nid,
            memoryType: item?.type,
            actionType: MemoryActionKeys.blockUserKey,
            uid: item?.user_details.uid,
            destructive:true
          });
          break;
        case MemoryActionKeys.reportMemoryKey:
          memoryActions.push({
            // index: i,
            text: item?.actions_on_memory[value],
            title: item?.actions_on_memory[value],
            // image: Platform.OS == 'ios' ? flagandroid : flag,
            nid: item?.nid,
            memoryType: item?.type,
            actionType: MemoryActionKeys.reportMemoryKey,
            destructive:true
          });
          break;
        case MemoryActionKeys.blockAndReportKey:
          memoryActions.push({
            // index: i,
            text: item?.actions_on_memory[value],
            title: item?.actions_on_memory[value],
            // image: Platform.OS == 'ios' ? redstar : report,
            nid: item?.nid,
            memoryType: item?.type,
            actionType: MemoryActionKeys.blockAndReportKey,
            uid: item?.user_details.uid,
            destructive:true
          });
          break;
        case MemoryActionKeys.editMemoryKey:
          memoryActions.push({
            // index: i,
            text: item?.actions_on_memory[value],
            title: item?.actions_on_memory[value],
            // image: edit_memory,
            nid: item?.nid,
            memoryType: item?.type,
            actionType: MemoryActionKeys.editMemoryKey,
          });
          break;
        case MemoryActionKeys.deleteMemoryKey:
          memoryActions.push({
            // index: i,
            text: item?.actions_on_memory[value],
            title: item?.actions_on_memory[value],
            // image: delete_memory,
            nid: item?.nid,
            memoryType: item?.type,
            actionType: MemoryActionKeys.deleteMemoryKey,
          });
          break;
        case MemoryActionKeys.moveToDraftKey:
          memoryActions.push({
            // index: i,
            text: item?.actions_on_memory[value],
            title: item?.actions_on_memory[value],
            // image: move_to_draft,
            nid: item?.nid,
            memoryType: item?.type,
            actionType: MemoryActionKeys.moveToDraftKey,
          });
          break;
        case MemoryActionKeys.removeMeFromThisPostKey:
          memoryActions.push({
            // index: i,
            text: item?.actions_on_memory[value],
            title: item?.actions_on_memory[value],
            // image: remove_me_from_this_post,
            nid: item?.nid,
            memoryType: item?.type,
            actionType: MemoryActionKeys.removeMeFromThisPostKey,
          });
          break;
        case MemoryActionKeys.blockMemoryKey:
          memoryActions.push({
            // index: i,
            text: item?.actions_on_memory[value],
            title: item?.actions_on_memory[value],
            // image: block_memory,
            nid: item?.nid,
            memoryType: item?.type,
            actionType: MemoryActionKeys.blockMemoryKey,
            destructive:true
          });
          break;
      }
    }
   
    return memoryActions;
  };

  render() {
    let userDetails = !this.props?.item?.item?.isPrompt
      ? PublishedMemoryDataModel.getUserObj(this.props.item.item)
      : {};
    let memoryActions = this.MemoryActionsListArray(this.props.item.item);

    return (
      <>
        {!this.props?.item?.item?.isPrompt ? (
          <View onLayout={this.props.onLayout} style={styles.promptContainer}>
            {this.externalCueItems.includes(this.props.item.item.type) ? (
              this.props.item.item.type == 'songs' ? (
                <WebView
                  source={{uri: this.props.item.item.api_url}}
                  style={styles.WebViewContainerStyle}
                  containerStyle={{borderRadius: 12}}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={true}
                />
              ) : (
                <View>
                  <View style={styles.titleContainer}>
                    <TouchableHighlight
                      underlayColor={Colors.touchableunderlayColor}
                      style={styles.authorContainer}
                      onPress={() => {
                        _onShowMemoryDetails(this.props.item.item, 'Recent',this.props.navigation,);
                      }}>
                      <TextNew style={styles.titleText}>
                        {this.props.item.item.title}
                      </TextNew>
                      {/* <TouchableWithoutFeedback
                              onPress={() =>{

                              }
                                // this.props.openMemoryActions(this.props.item.item)
                              }>
                              <View style={styles.playContainer}>
                                <Image source={moreoptions} />
                              </View>

                            </TouchableWithoutFeedback> */}
                    </TouchableHighlight>
                    <View style={styles.moreoptionStyle}>
                      <ContextMenu
                        actions={memoryActions}
                        dropdownMenuMode={true}
                        previewBackgroundColor="transparent"
                        onPress={e => {
                          let data = memoryActions.filter(
                            itm => itm.title === e.nativeEvent.name,
                          );
                          if (data && data[0]) {
                            onActionItemClicked(
                              e.nativeEvent.index,
                              data[0],
                              this.props.navigation,
                            );
                          }
                        }}>
                        <Image source={moreoptions} />
                      </ContextMenu>
                    </View>
                  </View>
                  <View style={styles.carouselContainer}>
                    <Carousel
                      data={this.props.item.item.collection}
                      renderItem={(collection: any) => (
                        <TouchableHighlight
                          underlayColor={'none'}
                          onPress={() => {
                            _onShowMemoryDetails(
                              this.props.item.item,
                              'Recent',
                              this.props.navigation,
                            );
                          }}>
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '100%',
                            }}>
                            <PlaceholderImageView
                              style={styles.PlaceholderImageView}
                              uri={Utility.getFileURLFromPublicURL(
                                collection.item.images.thumbnail_url,
                              )}
                              resizeMode={'contain'}
                            />
                            <TextNew style={styles.collectionTitle}>
                              {collection.item.title}
                            </TextNew>
                          </View>
                        </TouchableHighlight>
                      )}
                      sliderWidth={Dimensions.get('window').width - 48}
                      itemWidth={Dimensions.get('window').width - 48}
                      onSnapToItem={(index: any) =>
                        this.setState({activeIndex: index})
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
                  </View>
                </View>
              )
            ) : (
              <View style={styles.mainMemoryContainerStyle}>
                <View style={styles.memoriesContainer}>
                  {MemoryBasicDetails(
                    userDetails,
                    this.props.item.item,
                    this.setItem,
                    this.props.listType,
                    this.props.navigation,
                    // this.props.openMemoryActions,
                    // _onShowMemoryDetails(this.props.item.item,"Recent")
                  )}
                  {/* <View style={styles.space}/> */}

                  <TouchableHighlight
                    underlayColor={Colors.touchableunderlayColor}
                    style={styles.mediaContainer}
                    onPress={() => {
                      _onShowMemoryDetails(
                        this.props.item.item,
                        'Recent',
                        this.props.navigation,
                      );
                    }}>
                    <View>
                      {MediaView(
                        this.props.item,
                        this.props.audioView,
                        this.props.navigation,
                      )}

                      <View style={styles.dateContainer}>
                        <View style={styles.shareTextContainerStyle}>
                          <Image source={globesmall} />
                          <TextNew style={styles.sharewithTextStyle}>
                            {this.props.item.item.shareText}
                          </TextNew>
                        </View>
                        <View style={styles.memoryDateContainer}>
                          <Image
                            style={styles.imageTopMargin}
                            source={calendarsmall}
                          />
                          <TextNew style={styles.memoryDatetext}>
                            {this.props.item.item.memoryDateDisplay}
                            {/* memory_date */}
                          </TextNew>
                        </View>
                      </View>

                      <View style={{height: 8}} />

                      <TextNew numberOfLines={2} style={styles.memoryTitle}>
                        {this.props.item.item.title}
                      </TextNew>
                      {/* {this.props.item.item.dateWithLocation &&
                        this.props.item.item.dateWithLocation.length != 0 && ( */}

                      {/* )} */}
                      {
                        <View
                          style={{
                            paddingRight: 16,
                            paddingLeft: 16,
                            height: 8,
                          }}>
                          {/* <Border /> */}
                        </View>
                      }
                      {this.props.item.item.description &&
                      this.props.item.item.description.length != 0 ? (
                        <Text numberOfLines={5} style={styles.descriptionText}>
                          {this.props.item.item.description}
                        </Text>
                      ) : // <RenderHtml
                      //   tagsStyles={{ p: Styles.descriptionText, li: Styles.descriptionText, span: Styles.descriptionText }}
                      //   source={{ html: this.props.item.item.memoryDescription }}
                      //   // ignoredDomTags={['br']}
                      //   enableExperimentalBRCollapsing={true}
                      //   contentWidth={Dimensions.get('window').width}
                      //   enableExperimentalMarginCollapsing={true}
                      // ></RenderHtml>
                      null}

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
              onLayout={this.props.onLayout}
              style={[styles.activepromptsContainer]}>
              <View style={styles.activepromptsSubContainer}>
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
