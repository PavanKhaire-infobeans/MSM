import React from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import PlaceholderImageView from '../../common/component/placeHolderImageView';
import {
  Colors,
  fontFamily,
  fontSize,
  NO_INTERNET,
} from '../../common/constants';
import Utility from '../../common/utility';
//@ts-ignore
import * as Animatable from 'react-native-animatable';
import Carousel from 'react-native-snap-carousel';
import {No_Internet_Warning, ToastMessage} from '../../common/component/Toast';
import EventManager from '../../common/eventManager';
import {Account} from '../../common/loginStore';
import {
  black_arrow,
  blue_head_icon,
  pdf_icon,
  profile_placeholder,
  white_arrow,
  white_head_icon,
} from '../../images';
import {getUserName} from '../createMemory/dataHelper';
import PublishedMemory from '../myMemories/PublishedMemory';
export const kImage = 'image';
export const kAudio = 'audio';
export const kPDF = 'pdf';

const style = StyleSheet.create({
  normalText: {
    ...fontSize(16),
    fontWeight: 'normal',
    color: Colors.TextColor,
    marginBottom: 10,
  },
  boxShadow: {
    shadowOpacity: 1,
    elevation: 2,
    shadowColor: '#D9D9D9',
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 2},
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignContent: 'center',
  },
});

export const MemoryCollections = (props: {
  collectionList: any;
  selectedCollectionIndex: any;
  changeIndex: (index: any) => void;
}) => {
  return (
    <View
      style={[
        style.boxShadow,
        {
          elevation: 2,
          backgroundColor: Colors.NewThemeColor,
          width: '100%',
          paddingBottom: 10,
          marginTop: 5,
        },
      ]}>
      <View style={{padding: 15, paddingTop: 5}}>
        <Text
          style={{
            ...fontSize(16),
            marginTop: 5,
            marginBottom: 7,
            lineHeight: 20,
            color: Colors.TextColor,
          }}>
          {'Other Memories from the collection'}
        </Text>
        {/* {props.collectionList.length > 1 ? */}
        <FlatList
          data={props.collectionList}
          horizontal
          renderItem={(item: any) => (
            <TouchableHighlight
              underlayColor={'none'}
              onPress={() => props.changeIndex(item.index)}>
              <View
                style={{
                  padding: 5,
                  paddingRight: 16,
                  paddingLeft: 16,
                  borderRadius: 5,
                  backgroundColor:
                    item.index == props.selectedCollectionIndex
                      ? Colors.ThemeColor
                      : 'transparent',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      ...fontSize(18),
                      lineHeight: 20,
                      color: 'white',
                      fontFamily:
                        Platform.OS === 'ios'
                          ? fontFamily.Inter
                          : fontFamily.InterMedium,
                      fontWeight: '500',
                      marginBottom: 2,
                    }}>
                    {item.item.name}
                  </Text>
                  <View
                    style={{
                      padding: 1,
                      paddingLeft: 10,
                      paddingRight: 10,
                      marginLeft: 16,
                      marginBottom: 1,
                      borderRadius: 15,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}>
                    <Text
                      style={{
                        ...fontSize(14),
                        color: 'white',
                        fontWeight: '500',
                      }}>
                      {item.item.memories.length}
                    </Text>
                  </View>
                </View>
                <Text style={{...fontSize(14), color: Colors.NewThemeColor}}>
                  {'By '}
                  {Account.selectedData().userID ==
                  props.collectionList[props.selectedCollectionIndex].user.uid
                    ? 'You'
                    : props.collectionList[props.selectedCollectionIndex].user
                        .username}
                </Text>
              </View>
            </TouchableHighlight>
          )}
        />
        {/* : 
                        <Text style={{...fontSize(18), lineHeight: 20, color: Colors.TextColor, fontWeight: Platform.OS === "ios"? '500':'bold' , marginBottom:2}}>{props.collectionList[props.selectedCollectionIndex].name}</Text> 
                        } */}
        {/* */}
      </View>
      <Carousel
        data={props.collectionList[props.selectedCollectionIndex].memories}
        renderItem={(item: any) => (
          <TouchableHighlight
            underlayColor="#cccccc3e"
            onPress={() =>
              this.props.navigation.push('memoryDetails', {
                nid: item.item.nid,
                type: item.item.type,
              })
            }>
            <View
              style={{width: '100%', backgroundColor: '#fff', borderRadius: 5}}>
              <View
                style={{
                  backgroundColor: '#F3F3F3',
                  width: '100%',
                  flex: 1,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                }}>
                <PlaceholderImageView
                  style={{width: '100%', height: 150}}
                  uri={Utility.getFileURLFromPublicURL(item.item.uri)}
                  resizeMode={'contain'}
                />
              </View>

              <Text
                style={{
                  ...fontSize(24),
                  color: Colors.TextColor,
                  paddingRight: 15,
                  paddingLeft: 15,
                  paddingTop: 5,
                  paddingBottom: 5,
                }}
                numberOfLines={1}>
                {item.item.title}
              </Text>
              <Text
                style={{
                  ...fontSize(16),
                  color: Colors.TextColor,
                  padding: 15,
                  paddingTop: 5,
                  paddingBottom: 5,
                }}
                numberOfLines={1}>
                {item.item.date}
                {', '}
                {item.item.location}
              </Text>
              <Border />
              <View
                style={{
                  padding: 15,
                  paddingTop: 5,
                  paddingBottom: 5,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    ...fontSize(16),
                    color: Colors.NewTitleColor,
                    fontWeight: '500',
                    marginRight: 20,
                  }}>
                  {item.item.likeCount > 0
                    ? item.item.likeCount > 1
                      ? item.item.likeCount + ' Likes'
                      : item.item.likeCount + ' Like'
                    : ''}
                </Text>
                <Text style={{...fontSize(16), color: Colors.TextColor}}>
                  {item.item.commentCount > 0
                    ? item.item.commentCount > 1
                      ? item.item.commentCount + ' Comments'
                      : item.item.commentCount + ' Comment'
                    : ''}
                </Text>
              </View>

              <Text
                style={{
                  ...fontSize(16),
                  color: Colors.NewTitleColor,
                  fontWeight: '500',
                  padding: 15,
                  paddingTop: 5,
                  paddingBottom: 5,
                }}>
                {item.item.youWhereThere
                  ? item.item.whoElseWasThere.length > 0
                    ? 'You and '
                    : 'You '
                  : ''}
                {item.item.whoElseWasThere.length > 0
                  ? item.item.whoElseWasThere.length
                  : ''}
                {item.item.whoElseWasThere.length > 0
                  ? item.item.whoElseWasThere.length > 1
                    ? ' others '
                    : item.item.youWhereThere
                    ? ''
                    : ' other '
                  : ''}
                <Text style={{...fontSize(16), color: Colors.TextColor}}>
                  {item.item.whoElseWasThere.length > 0 ||
                  item.item.youWhereThere
                    ? item.item.whoElseWasThere.length > 1
                      ? 'were also there'
                      : 'was also there'
                    : ''}
                </Text>
              </Text>
            </View>
          </TouchableHighlight>
        )}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={Dimensions.get('window').width - 80}
      />
    </View>
  );
};

export const Border = (props: {paddingTop?: any; padding?: any}) => {
  return (
    <View
      style={{
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(55, 56, 82, 0.2)',
        marginBottom: 5,
        opacity: 0.4,
        marginTop: props.paddingTop ? props.paddingTop : 0,
        marginRight: props.padding ? props.padding : 0,
        marginLeft: props.padding ? props.padding : 0,
      }}
    />
  );
};

export const MemoryTags = (props: {memoryTags: any; onPressCallback?: any}) => {
  return (
    <FlatList
      horizontal
      keyExtractor={(_, index: number) => `${index}`}
      showsHorizontalScrollIndicator={false}
      data={props.memoryTags}
      style={{paddingBottom: 10}}
      renderItem={(item: any) => (
        <TouchableHighlight
          underlayColor={'#ffffff33'}
          onPress={() => {
            if (
              props.onPressCallback != undefined &&
              props.onPressCallback != null
            ) {
              props.onPressCallback();
            }
          }}
          style={{
            paddingRight: 10,
            paddingLeft: 10,
            paddingBottom: 5,
            borderWidth: 1,
            borderRadius: 20,
            paddingTop: 5,
            marginRight: 10,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: Colors.TextColor,
          }}>
          <Text style={[style.normalText, {...fontSize(14), marginBottom: 0}]}>
            {item.item.name ? item.item.name : item.item}
          </Text>
        </TouchableHighlight>
      )}
    />
  );
};

export const CollaboratorView = (props: {collaborators: any}) => {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={props.collaborators}
      style={{paddingBottom: 10}}
      keyExtractor={(_, index: number) => `${index}`}
      renderItem={(item: any) => (
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 5,
            marginRight: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ImageBackground
            source={profile_placeholder}
            style={{height: 40, width: 40}}
            imageStyle={{borderRadius: 20}}>
            <Image
              source={
                item.item.uri != '' ? {uri: item.item.uri} : profile_placeholder
              }
              style={{height: 40, width: 40, borderRadius: 20}}></Image>
          </ImageBackground>
          <Text
            style={{
              lineHeight: 20,
              fontSize: 16,
              marginLeft: 5,
              color: Colors.TextColor,
              backgroundColor: item.item.backgroundColor,
              padding: 5,
            }}>
            {item.item.name}
          </Text>
        </View>
      )}
    />
  );
};

export const UserDetails = (props: {
  userDetails: any;
  isExternalQueue: any;
  shareDetails: any;
  storyType: any;
  onPressCallback?: any;
  previewDraft?: any;
  deepLinkBackClick?: boolean;
}) => {
  let showCueBackLogo =
    props.userDetails.name.toLowerCase().trim() == 'cueback' ||
    props.userDetails.name.toLowerCase().trim() == 'my stories matter'
      ? true
      : props.storyType == 'internal_cues'
      ? true
      : false;
  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: props.isExternalQueue ? Colors.ThemeColor : '#fff',
        flexDirection: 'row',
      }}>
      <View style={{flexDirection: 'column', width: '100%', paddingTop: 10}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{width: 60, alignItems: 'center', paddingTop: 10}}
            onPress={() => {
              Keyboard.dismiss();
              if (props.deepLinkBackClick) {
                this.props.navigation.dashBoard();
              } else {
                this.props.navigation.goBack();
              }
            }}>
            <Image source={props.isExternalQueue ? white_arrow : black_arrow} />
          </TouchableOpacity>
          {showCueBackLogo ? (
            // showCueBackLogo ? props.isExternalQueue ? white_head_icon: blue_head_icon :
            <View
              style={{
                height: props.isExternalQueue ? 50 : 40,
                width: 40,
                alignItems: 'center',
                paddingBottom: props.isExternalQueue ? 10 : 0,
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  height: 35,
                  width: 40,
                  resizeMode: 'contain',
                  marginRight: 10,
                }}
                source={
                  props.isExternalQueue ? white_head_icon : blue_head_icon
                }
              />
            </View>
          ) : (
            <ImageBackground
              style={[style.avatar, {marginRight: 10}]}
              imageStyle={{borderRadius: 20}}
              source={profile_placeholder}>
              <Image
                style={{height: 40, width: 40, borderRadius: 20}}
                source={
                  props.userDetails.isProfileAvailable
                    ? {uri: props.userDetails.userProfilePic}
                    : props.userDetails.userProfilePic
                }
              />
            </ImageBackground>
          )}
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingBottom: props.isExternalQueue ? 10 : 0,
            }}>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={{
                  ...fontSize(16),
                  color: props.isExternalQueue ? '#fff' : Colors.TextColor,
                }}>
                {'By '}
                <Text
                  style={{
                    color: props.isExternalQueue
                      ? '#fff'
                      : Colors.NewYellowColor,
                    fontWeight: '500',
                  }}>
                  {props.userDetails.name}
                </Text>
              </Text>
              {!props.isExternalQueue && (
                <Text
                  style={{
                    ...fontSize(16),
                    color: props.isExternalQueue ? '#fff' : Colors.TextColor,
                  }}>
                  <Text>
                    {props.userDetails.createdOn}
                    {props.userDetails.viewCount > 0 && (
                      <Text>
                        {' | '}
                        {props.userDetails.viewCount}
                        {props.userDetails.viewCount > 1 ? ' views' : ' view'}
                      </Text>
                    )}
                  </Text>
                </Text>
              )}
              <View style={{width: '100%'}}>
                {props.shareDetails.available && (
                  <View
                    style={{
                      height: 20,
                      paddingRight: 10,
                      paddingLeft: 10,
                      marginTop: 2,
                      alignSelf: 'baseline',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: props.shareDetails.color,
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#fff',
                        ...fontSize(12),
                        borderRadius: 5,
                      }}>
                      {props.shareDetails.shareText}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {props.previewDraft && props.previewDraft == true ? null : (
              <TouchableOpacity
                style={{
                  padding: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  if (
                    props.onPressCallback != undefined &&
                    props.onPressCallback != null
                  ) {
                    props.onPressCallback();
                  }
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flex: 1,
                    width: 24,
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      backgroundColor: props.isExternalQueue
                        ? '#fff'
                        : Colors.NewYellowColor,
                      height: 6,
                      width: 6,
                      borderRadius: 3,
                    }}></View>
                  <View
                    style={{
                      backgroundColor: props.isExternalQueue
                        ? '#fff'
                        : Colors.NewYellowColor,
                      height: 6,
                      width: 6,
                      borderRadius: 3,
                    }}></View>
                  <View
                    style={{
                      backgroundColor: props.isExternalQueue
                        ? '#fff'
                        : Colors.NewYellowColor,
                      height: 6,
                      width: 6,
                      borderRadius: 3,
                    }}></View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Border paddingTop={5} padding={15} />
      </View>
      <StatusBar
        barStyle={
          Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
        }
        backgroundColor={props.isExternalQueue ? Colors.ThemeColor : '#fff'}
      />
    </View>
  );
};

export const FilesView = (props: {
  files: any;
  type: string;
  togglePlayPause?: any;
}) => {
  if (props.files.length > 0)
    return (
      <View style={{marginBottom: 10}}>
        {props.type == kImage &&
          props.files.map((file: any) => {
            return <CommonImageView file={file} files={props.files} />;
          })}
        {props.type == kPDF &&
          props.files.map((file: any) => {
            return <CommonPDFView file={file} files={props.files} />;
          })}
      </View>
    );
  return null;
};

export const CommonPDFView = (props: {file: any; files: any}) => {
  return (
    <View
      style={[
        {
          elevation: 2,
          backgroundColor: Colors.NewLightThemeColor,
          marginBottom: 15,
          borderWidth: 1,
          borderColor: '#D3D3D3',
        },
        style.boxShadow,
      ]}>
      <TouchableOpacity
        onPress={() => {
          if (Utility.isInternetConnected) {
            this.props.navigation.push('pdfViewer', {file: props.file});
          } else {
            ToastMessage(NO_INTERNET, Colors.WarningColor);
          }
        }}>
        <View>
          <ImageBackground
            source={null}
            resizeMode="stretch"
            style={{width: '100%', height: 190, backgroundColor: '#fff'}}>
            <View
              style={{
                width: '100%',
                height: 190,
                position: 'absolute',
                top: 0,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={
                  props.file.pdf_image_url
                    ? {uri: props.file.pdf_image_url}
                    : pdf_icon
                }
                defaultSource={pdf_icon}
                style={{
                  height: '100%',
                  width: '100%',
                  resizeMode: 'center',
                  backgroundColor: 'transparent',
                }}
              />

              <Image
                source={pdf_icon}
                style={{bottom: 10, right: 10, position: 'absolute'}}
              />
            </View>
          </ImageBackground>
          <TitleAndDescription file={props.file} type={kPDF} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const CommonImageView = (props: {file: any; files: any}) => {
  let currentIndex = props.files.indexOf(props.file);
  return (
    <View
      style={[
        {
          backgroundColor: Colors.NewLightThemeColor,
          marginBottom: 15,
          width: '100%',
          elevation: 2,
        },
        style.boxShadow,
      ]}>
      <TouchableOpacity
        onPress={() => {
          if (Utility.isInternetConnected) {
            this.props.navigation.push('imageViewer', {
              files: props.files,
              index: currentIndex,
            });
          } else {
            No_Internet_Warning();
          }
        }}>
        <View>
          <View
            style={{
              width: '100%',
              height: 185,
              backgroundColor: Colors.NewLightThemeColor,
            }}>
            <PlaceholderImageView
              style={{width: '100%', height: '100%'}}
              uri={
                props.file.thumbnail_url
                  ? props.file.thumbnail_url
                  : props.file.url
                  ? props.file.url
                  : props.file.filePath
              }
              resizeMode={'contain'}
            />
          </View>
          <TitleAndDescription file={props.file} type={kImage} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const TitleAndDescription = (props: {file: any; type: any}) => {
  let fileTitle = props.file.file_title
    ? props.file.file_title.replace(/["']/g, "\\'").toString()
    : '';
  let fileDescription = props.file.file_description
    ? props.file.file_description.replace(/["']/g, "\\'").toString()
    : '';
  return (
    <View style={{width: '100%'}}>
      {fileTitle.length > 0 || fileDescription.length > 0 ? (
        <View
          style={{backgroundColor: 'transparent', padding: 15, paddingTop: 10}}>
          <View>
            {fileTitle.length > 0 && (
              <Text
                style={{
                  fontWeight: '500',
                  ...fontSize(18),
                  color: Colors.TextColor,
                }}>
                {fileTitle}
              </Text>
            )}

            {fileDescription.length > 0 && (
              <Text
                style={{...fontSize(16), marginTop: 5, color: Colors.TextColor}}
                numberOfLines={3}>
                {fileDescription}
              </Text>
            )}
            <View
              style={{
                justifyContent: 'space-between',
                width: '100%',
                flexDirection: 'row',
                paddingTop: 5,
              }}>
              {Utility.getNumberOfLines(
                fileDescription,
                16,
                Dimensions.get('window').width - 70,
              ) > 3 && (
                <Text
                  style={{
                    ...fontSize(16),
                    fontWeight: '500',
                    color: Colors.NewYellowColor,
                  }}>
                  {'See more'}
                </Text>
              )}
              <Text></Text>
              <Text
                style={{
                  textAlign: 'right',
                  ...fontSize(16),
                  fontStyle: 'italic',
                  color: Colors.TextColor,
                }}>
                {'By: '}
                {getUserName(props.file)}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={{justifyContent: 'flex-end', width: '100%', padding: 15}}>
          <Text
            style={{
              textAlign: 'right',
              ...fontSize(16),
              fontStyle: 'italic',
              color: Colors.TextColor,
            }}>
            {'By: '}
            {getUserName(props.file)}
          </Text>
        </View>
      )}
    </View>
  );
};

export const LikeView = (props: {
  name: string;
  icon: any;
  flexDirection?: string;
  onPress?: () => void;
}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
      <Image source={props.icon} style={{padding: 1}} resizeMode="contain" />
      <TouchableHighlight
        underlayColor={'#ffffffff'}
        onPress={() => props.onPress()}>
        <Text
          style={{
            ...fontSize(16),
            marginLeft: 5,
            fontWeight: '500',
            flex: 1,
            color: Colors.NewTitleColor,
          }}>
          {props.name}
        </Text>
      </TouchableHighlight>
    </View>
  );
};

export const LikeCommentShare = (props: {
  id?: any;
  selectedItem?: any;
  name: string;
  icon: any;
  flexDirection?: string;
  animate?: any;
  animateType?: any;
}) => {
  let eventListener: EventManager = EventManager.addListener(
    'startAnim',
    () => {
      Animated.sequence([
        Animated.timing(PublishedMemory.shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(PublishedMemory.shakeAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(PublishedMemory.shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(PublishedMemory.shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    },
  );
  let localId = props.id;
  return (
    <View>
      {props.animate == localId && props.animateType == 'like' ? (
        <Animatable.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            width: 40,
            borderRadius: 20,
            backgroundColor: Colors.timeLinebackground,
            transform: [{translateX: PublishedMemory.shakeAnimation}],
          }}>
          <Image
            source={props.icon}
            style={{padding: 1}}
            resizeMode="contain"
          />
          {/* <Text
            style={{
              ...fontSize(16),
              fontWeight: '500',
              height: '100%',
              color: Colors.NewTitleColor,
            }}>
            {props.name}
          </Text> */}
        </Animatable.View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            width: 40,
            borderRadius: 20,
            backgroundColor: Colors.timeLinebackground,
          }}>
          <Image
            source={props.icon}
            style={{padding: 1}}
            resizeMode="contain"
          />
          {/* <Text
            style={{
              ...fontSize(16),
              fontWeight: '500',
              height: '100%',
              color: Colors.NewTitleColor,
            }}>
            {props.name}
          </Text> */}
        </View>
      )}
    </View>
  );
};

export const TitleAndValue = (props: {title: string; description: string}) => {
  return (
    <View style={{flex: 1}}>
      <Text
        style={{
          ...fontSize(18),
          fontWeight: '500',
        }}>
        {props.title}
      </Text>
      <Text style={{...fontSize(18)}}>{props.description}</Text>
    </View>
  );
};
export const FilterIcon = (props: {
  name: string;
  icon: any;
  flexDirection?: string;
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 48,
        paddingHorizontal: 16,
      }}>
      <Text
        style={{
          ...fontSize(18),
          fontWeight: 'normal',
          color: Colors.ThemeColor,
        }}>
        {props.name}
      </Text>
      <Image
        source={props.icon}
        style={{marginRight: 5, padding: 1}}
        resizeMode="contain"
      />
    </View>
  );
};
