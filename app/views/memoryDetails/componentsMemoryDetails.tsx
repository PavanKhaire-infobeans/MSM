import React from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PlaceholderImageView from './../../../src/common/component/placeHolderImageView';
import {
  Colors,
  fontSize,
  MemoryActionKeys,
  NO_INTERNET,
} from './../../../src/common/constants';
import Utility from './../../../src/common/utility';
//@ts-ignore
import Carousel from 'react-native-snap-carousel';
import {
  blue_head_icon,
  pdf_icon,
  profile_placeholder,
  white_head_icon,
} from './../../../src/images';

import { pen, share } from './../../images';
// import NavigationHeader from '../../common/component/navigationHeader';
import {
  No_Internet_Warning,
  ToastMessage,
} from './../../../src/common/component/Toast';
// import {getUserName} from '../createMemory/dataHelper';
import { Account } from './../../../src/common/loginStore';
// import PublishedMemory from '../myMemories/PublishedMemory';
import * as Animatable from 'react-native-animatable';
import { getUserName } from '../../../src/views/createMemory/dataHelper';
import PublishedMemory from '../../../src/views/myMemories/PublishedMemory';
import EventManager from './../../../src/common/eventManager';
import Styles from './styles';
export const kImage = 'image';
export const kAudio = 'audio';
export const kPDF = 'pdf';

// const style = StyleSheet.create({

// });

export const MemoryCollections = (props: {
  collectionList: any;
  selectedCollectionIndex: any;
  changeIndex: (index: any) => void;
  navigation: any
}) => {

  const renderItem = (item: any) => (
    <TouchableHighlight
      underlayColor={'none'}
      onPress={() => props.changeIndex(item.index)}>
      <View
        style={[
          Styles.collectionListContainer,
          {
            backgroundColor:
              item.index == props.selectedCollectionIndex
                ? Colors.ThemeColor
                : 'transparent',
          },
        ]}>
        <View style={Styles.collectionListContainerSub}>
          <Text style={Styles.collectionNameTextStyle}>
            {item.item.name}
          </Text>
          <View style={Styles.memoryLengthContainer}>
            <Text style={Styles.memorylengthTextStyle}>
              {item.item.memories.length}
            </Text>
          </View>
        </View>
        <Text style={Styles.byTextStyle}>
          {'By '}
          {Account.selectedData().userID ==
            props.collectionList[props.selectedCollectionIndex].user.uid
            ? 'You'
            : props.collectionList[props.selectedCollectionIndex].user
              .username}
        </Text>
      </View>
    </TouchableHighlight>
  );

  const carouselRenderItem = (item: any) => (
    <TouchableHighlight
      underlayColor="#cccccc3e"
      onPress={() =>{
        console.warn(item.item)
        props.navigation.replace('newmemoryDetails', {
          nid: item.item.nid,
          type: item.item.type,
        })
      }}>
      <View style={Styles.carouselContainer}>
        <View style={Styles.carouselContainerSub}>
          <PlaceholderImageView
            style={Styles.PlaceholderImageView}
            uri={Utility.getFileURLFromPublicURL(item.item.uri)}
            resizeMode={'contain'}
          />
        </View>

        <Text style={Styles.titleTextStyle} numberOfLines={1}>
          {item.item.title}
        </Text>
        <Text style={Styles.locationTextStyle} numberOfLines={1}>
          {item.item.date}
          {', '}
          {item.item.location}
        </Text>
        <Border />
        <View style={Styles.likeCommentContainer}>
          <Text style={Styles.likeTextStyle}>
            {item.item.likeCount > 0
              ? item.item.likeCount > 1
                ? item.item.likeCount + ' Likes'
                : item.item.likeCount + ' Like'
              : ''}
          </Text>
          <Text style={Styles.commentTextStyle}>
            {item.item.commentCount > 0
              ? item.item.commentCount > 1
                ? item.item.commentCount + ' Comments'
                : item.item.commentCount + ' Comment'
              : ''}
          </Text>
        </View>

        <Text style={Styles.whoelseTextStyle}>
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
          <Text style={Styles.whoelseSubTextStyle}>
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
  );

  return (
    <View style={[Styles.boxShadow, Styles.MemoryCollectionsContainer]}>
      <View style={Styles.MemoryCollectionsContainerSub}>
        <Text style={Styles.otherMemoryTextStyle}>
          {'Other Memories from the collection'}
        </Text>
        {/* {props.collectionList.length > 1 ? */}
        <FlatList
          data={props.collectionList}
          showsHorizontalScrollIndicator={false}
          horizontal
          nestedScrollEnabled
          renderItem={renderItem}
        />
      </View>
      <Carousel
        data={props.collectionList[props.selectedCollectionIndex].memories}
        renderItem={carouselRenderItem}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={Dimensions.get('window').width - 80}
      />
    </View>
  );
};

export const Border = (props: {
  paddingTop?: any;
  padding?: any;
  paddingLeft?: any;
  width?: any;
  marginBottom?: any;
}) => {
  return (
    <View
      style={[
        Styles.borderStyle,
        {
          width: props.width ? props.width : '100%',
          marginTop: props.paddingTop ? props.paddingTop : 0,
          marginRight: props.padding ? props.padding : 0,
          marginLeft: props.padding ? props.padding : 0,
          marginBottom: props.marginBottom ? props.marginBottom : 0,
          paddingLeft: props.paddingLeft ? props.paddingLeft : 0,
        },
      ]}
    />
  );
};

export const MemoryTags = (props: { memoryTags: any; onPressCallback?: any }) => {
  const renderItem = (item: any) => (
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
      style={Styles.MemoryTagsContainer}>
      <Text style={[Styles.normalText, Styles.MemoryTagsNamestyle]}>
        {item.item.name ? item.item.name : item.item}
      </Text>
    </TouchableHighlight>
  );

  return (
    <FlatList
      horizontal
      keyExtractor={(_, index: number) => `${index}`}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={props.memoryTags}
      style={Styles.MemoryTagsFlatlistStyle}
      renderItem={renderItem}
    />
  );
};

export const CollaboratorView = (props: { collaborators: any }) => {

  const renderItem = (item: any) => (
    <View style={Styles.CollaboratorViewContainer}>
      <ImageBackground
        source={profile_placeholder}
        style={Styles.CollaboratorImageBackgroundStyle}
        imageStyle={Styles.CollaboratorImageStyle}>
        <Image
          source={
            item.item.uri != '' ? { uri: item.item.uri } : profile_placeholder
          }
          style={Styles.CollaboratorProfileImageStyle}></Image>
      </ImageBackground>
      <Text style={Styles.CollaboratorNameTextStyle}>{item.item.name}</Text>
    </View>
  );
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={props.collaborators}
      style={Styles.MemoryTagsFlatlistStyle}
      keyExtractor={(_, index: number) => `${index}`}
      renderItem={renderItem}
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
    <View style={Styles.userDetailsContainer}>
      <View style={Styles.userDetailsSubContainer}>
        {showCueBackLogo ? (
          // showCueBackLogo ? props.isExternalQueue ? white_head_icon: blue_head_icon :
          <View>
            <Image
              style={Styles.userImageStyle}
              resizeMode="stretch"
              source={props.isExternalQueue ? white_head_icon : blue_head_icon}
            />
          </View>
        ) : (
          <ImageBackground
            style={[Styles.avatar]}
            imageStyle={Styles.userImageBackgrounStyle}
            source={profile_placeholder}>
            <Image
              style={Styles.userImageStyle}
              resizeMode="cover"
              source={
                props.userDetails.isProfileAvailable
                  ? { uri: props.userDetails.userProfilePic }
                  : props.userDetails.userProfilePic
              }
            />
          </ImageBackground>
        )}
        <View style={Styles.userNameContainer}>
          <Text style={Styles.userDetailsNameTextStyle}>
            {props.userDetails.name}
          </Text>

          {/* {props.previewDraft && props.previewDraft == true ? null : (
            <TouchableOpacity
              style={{
                padding: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                // if (
                //   props.onPressCallback != undefined &&
                //   props.onPressCallback != null
                // ) {
                //   props.onPressCallback();
                // }
              }}>
               <Image source={moreoptions}></Image> 
            </TouchableOpacity>
          )} */}
        </View>
      </View>
      {/* <Border paddingTop={5} padding={15} /> */}
      <StatusBar
        barStyle={
          Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
        }
        backgroundColor={
          props.isExternalQueue ? Colors.ThemeColor : Colors.white
        }
      />
    </View>
  );
};

const _onShareMemory = async (url: any) => {
  try {
    setTimeout(async () => {
      const result: any = await Share.share({
        message: 'Share the Memory',
        url: url,
        title: 'Share',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      } else {
        // alert(JSON.stringify(result))
      }
    }, 1000);
  } catch (error) {
    // alert(error.message);
  }
};

export const ShowSharedaetilsDetails = (props: {
  userDetails: any;
  isExternalQueue?: any;
  shareDetails?: any;
  storyType?: any;
  onPressCallback?: any;
  previewDraft?: any;
  deepLinkBackClick?: boolean;
  renderLikeView?: any;
  memoryDetails?: any;
  onActionItemClicked?: any;
}) => {
  let showCueBackLogo =
    props.userDetails.name.toLowerCase().trim() == 'cueback' ||
      props.userDetails.name.toLowerCase().trim() == 'my stories matter'
      ? true
      : props.storyType == 'internal_cues'
        ? true
        : false;
  return (
    <View style={Styles.ShowSharedaetilsDetailsContainer}>
      {props.shareDetails.available && (
        <View style={Styles.ShowSharedaetilsDetailsContainerSub}>
          <TouchableWithoutFeedback
            onPress={() => {
              _onShareMemory(props.memoryDetails.memory_url);
            }}>
            <View style={Styles.ShareContainer}>
              <Text style={Styles.shareTextStyle}>Share</Text>
              <Image source={share}></Image>
            </View>
          </TouchableWithoutFeedback>

          <View style={Styles.widthSeparator} />
          {props.userDetails.name == 'You' ? (
            <TouchableWithoutFeedback
              onPress={() =>
                props.onActionItemClicked({
                  nid: props.memoryDetails.nid,
                  actionType: MemoryActionKeys.editMemoryKey,
                })
              }>
              <View style={Styles.EditContainer}>
                <Text style={[Styles.shareTextStyle, { color: Colors.white }]}>
                  Edit
                </Text>
                <Image source={pen}></Image>
              </View>
            </TouchableWithoutFeedback>
          ) : (
            <View style={Styles.shareWidthStyle} />
          )}
        </View>
      )}
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
      <View style={Styles.FilesViewContainerStyle}>
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

export const CarousalFilesView = (props: {
  files: any;
  type: string;
  togglePlayPause?: any;
  navigation?: any;
}) => {
  const showImage = (item: any) => (
    <CommonImageView
      showDesc={false}
      file={item.item}
      files={props.files}
      navigation={props.navigation}
    />
  );

  const showPDF = (item: any) => (
    <CommonPDFView file={item.item} files={props.files} />
  );

  if (props.files.length > 0)
    return (
      <View style={Styles.imageCarouselContainerStyle}>
        {props.type == kImage && props.files ? (
          <Carousel
            data={props.files}
            renderItem={showImage}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width}
          />
        ) : null}
        {props.type == kPDF && props.files ? (
          <Carousel
            data={props.files}
            renderItem={showPDF}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width}
          />
        ) : null}
      </View>
    );
  return null;
};

export const CommonPDFView = (props: { file: any; files: any }) => {
  const navigation = useNavigation();

  return (
    <View style={[Styles.commonPDFContainer, Styles.boxShadow]}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (Utility.isInternetConnected) {
            navigation.navigate('pdfViewer', { file: props.file });
          } else {
            //ToastMessage(NO_INTERNET, Colors.WarningColor);
          }
        }}>
        <View>
          <ImageBackground
            source={null}
            resizeMode="stretch"
            style={Styles.commonPDFContainerImagebgStyle}>
            <View style={Styles.commonPDFContainerImagebgViewStyle}>
              <Image
                source={
                  props.file.pdf_image_url
                    ? { uri: props.file.pdf_image_url }
                    : pdf_icon
                }
                defaultSource={pdf_icon}
                style={Styles.commonPDFImageStyle}
              />

              <Image source={pdf_icon} style={Styles.pdficonStyle} />
            </View>
          </ImageBackground>
          <TitleAndDescription file={props.file} type={kPDF} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export const CommonImageView = (props: {
  file: any;
  files: any;
  showDesc?: boolean;
  navigation?: any;
}) => {
  let currentIndex = props.files.indexOf(props.file);
  return (
    <View style={[Styles.CommonImageViewContainer, Styles.boxShadow]}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (Utility.isInternetConnected) {
            props.navigation?.navigate('imageViewer', {
              files: props.files,
              index: currentIndex,
            });
          } else {
            No_Internet_Warning();
          }
        }}>
        <View>
          <View style={Styles.PlaceholderImageViewContainer}>
            <PlaceholderImageView
              style={Styles.placeholderStyle}
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
          {props.showDesc == false ? null : (
            <TitleAndDescription file={props.file} type={kImage} />
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export const TitleAndDescription = (props: { file: any; type: any }) => {
  let fileTitle = props.file.file_title
    ? props.file.file_title.replace(/["']/g, "\\'").toString()
    : '';
  let fileDescription = props.file.file_description
    ? props.file.file_description.replace(/["']/g, "\\'").toString()
    : '';
  return (
    <View style={Styles.memoryDetailAvailable}>
      {fileTitle.length > 0 || fileDescription.length > 0 ? (
        <View style={Styles.TitleAndDescriptionContainer}>
          <View>
            {fileTitle.length > 0 && (
              <Text style={Styles.fileNameTextStyle}>{fileTitle}</Text>
            )}

            {fileDescription.length > 0 && (
              <Text style={Styles.fileDescriptionTextStyle} numberOfLines={3}>
                {fileDescription}
              </Text>
            )}
            <View style={Styles.descriptionContainerStyles}>
              {Utility.getNumberOfLines(
                fileDescription,
                16,
                Dimensions.get('window').width - 70,
              ) > 3 && (
                  <Text style={Styles.seemoreTextStyle}>{'See more'}</Text>
                )}
              <Text></Text>
              <Text style={Styles.fileDescTextStyle}>
                {'By: '}
                {getUserName(props.file)}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={Styles.DescriptionStyles}>
          <Text style={Styles.fileDescTextStyle}>
            {'By: '}
            {getUserName(props.file)}
          </Text>
        </View>
      )}
    </View>
  );
};

export const LikeView = (props: {
  name?: string;
  icon: any;
  flexDirection?: string;
  onPress?: () => void;
}) => {
  return (
    <View style={Styles.LikeViewContainer}>
      <Image source={props.icon} style={{ padding: 1 }} resizeMode="contain" />
      <TouchableHighlight
        underlayColor={Colors.touchableunderlayColor}
        onPress={() => props.onPress()}>
        <Text style={Styles.LikeViewTextStyle}>{props.name}</Text>
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
    // <View>
    props.animate == localId && props.animateType == 'like' ? (
      <Animatable.View
        style={[
          Styles.LikeCommentShareContainer,
          {
            transform: [{ translateX: PublishedMemory.shakeAnimation }],
            borderWidth: props.selectedItem ? 0 : 1,
          },
        ]}>
        <Image source={props.icon} resizeMode="contain" />
        {/* <Text
            style={{
              ...fontSize(16),
              fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
              height: '100%',
              color: Colors.NewTitleColor,
            }}>
            {props.name}
          </Text> */}
      </Animatable.View>
    ) : (
      <View
        style={[
          Styles.LikeCommentShareContainer,
          {
            borderWidth: props.selectedItem ? 0 : 1,
          },
        ]}>
        <Image source={props.icon} resizeMode="contain" />
        {/* <Text
            style={{
              ...fontSize(16),
              fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
              height: '100%',
              color: Colors.NewTitleColor,
            }}>
            {props.name}
          </Text> */}
      </View>
    )
    // </View>
  );
};

export const TitleAndValue = (props: { title: string; description: string }) => {
  return (
    <View style={Styles.TitleAndValueContainer}>
      <Text
        style={[Styles.titleandValueTextStyle, { color: Colors.newTextColor }]}>
        {props.title}
      </Text>
      <Text
        style={[Styles.titleandValueTextStyle, { color: Colors.bordercolor }]}>
        {props.description}
      </Text>
    </View>
  );
};
