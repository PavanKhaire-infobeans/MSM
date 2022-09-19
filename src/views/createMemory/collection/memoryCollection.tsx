import React from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
// @ts-ignore
import {connect} from 'react-redux';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import NavigationHeaderSafeArea from '../../../common/component/profileEditHeader/navigationHeaderSafeArea';
import {No_Internet_Warning} from '../../../common/component/Toast';
import {
  Colors,
  ConsoleType,
  decode_utf8,
  fontFamily,
  fontSize,
  showConsoleLog,
} from '../../../common/constants';
import EventManager from '../../../common/eventManager';
import Utility from '../../../common/utility';
import {
  add_icon,
  checkbox,
  checkbox_active,
  settings_icon,
} from '../../../images';
import {
  GetPublishedMemoryCollections,
  kPublishedMemoryCollections,
  MemoryAction,
} from '../../myMemories/myMemoriesWebService';
import {CollectinAPI} from '../saga';
import styles from './styles';

type State = {[x: string]: any};
type Props = {[x: string]: any};

class MemoryCollectionList extends React.Component<Props, State> {
  _listRef: any;
  checkForScroll: any = true;
  selectedIndex: any = {};
  publishedMemoryCollectionsListener: EventManager;
  state = {
    collections: [],
  };
  constructor(props: Props) {
    super(props);
    this.publishedMemoryCollectionsListener = EventManager.addListener(
      kPublishedMemoryCollections,
      this.fetchPublishedMemoryCollections,
    );
  }

  componentDidMount() {
    loaderHandler.showLoader();
    this.props.collectionAPI();
    GetPublishedMemoryCollections(this.props.nid);
    this.checkForScroll = true;
  }

  componentWillUnmount() {
    this.publishedMemoryCollectionsListener.removeListener();
  }

  fetchPublishedMemoryCollections = (
    fetched?: boolean,
    publishedMemoryCollectionsData?: any,
  ) => {
    if (fetched) {
      loaderHandler.hideLoader();
      this.setState({collections: publishedMemoryCollectionsData});
    } else {
      loaderHandler.hideLoader();
      // ToastMessage(getAllLikes, Colors.ErrorColor);
    }
  };

  cancelAction = () => {
    Keyboard.dismiss();
    this.props.navigation.goBack();
  };

  saveValue = () => {
    let collections_nids: any = [];
    this.state.collections.forEach((element: any) => {
      collections_nids.push(element.nid ? element.nid : element.tid);
    });
    if (Utility.isInternetConnected) {
      loaderHandler.showLoader();
      MemoryAction(
        'my_stories',
        this.props.nid,
        'add_to_collection',
        '',
        collections_nids,
      );
      Keyboard.dismiss();
      this.props.navigation.goBack();
    } else {
      No_Internet_Warning();
    }
  };

  checkIfLastItemRendered = (item: any) => {};

  setCollection = (item: any) => {
    let collections = this.state.collections;
    let found = false;
    try {
      collections.forEach((element: any, index: any) => {
        if ((element.tid ? element.tid : element.nid) == item.tid) {
          found = true;
          collections.splice(index, 1);
        }
      });
      if (!found) {
        collections.push(item);
      }
      this.setState({collections: collections});
    } catch (error) {
    }
  };
  renderRow = (item: any) => {
    let isSelected = false;
    if (this.state && this.state.collections && this.state.collections.length) {
      this.state.collections.forEach((element: any, index: any) => {
        if ((element.tid ? element.tid : element.nid) == item.item.tid) {
          isSelected = true;
        }
      });
    }

    return (
      <View style={styles.collectionListContainer}>
        <TouchableHighlight
          underlayColor={Colors.white}
          onPress={() => this.setCollection(item.item)}
          style={styles.collectionListButtonStyle}>
          <View style={styles.collectionListButtonContainerStyle}>
            <View style={styles.collectionTitleContainer}>
              <Image
                style={styles.moveImage}
                resizeMode="contain"
                source={isSelected ? checkbox_active : checkbox}></Image>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                  {decode_utf8(item.item.name)}
                </Text>
                <Text style={styles.titleText}>
                  {'('}
                  {item.item.memory_count}
                  {' memories)'}
                </Text>
              </View>
            </View>
            <TouchableHighlight
              style={styles.nameContainer}
              underlayColor={'#ffffff44'}
              onPress={() =>
                this.props.navigation.navigate('collectionDetails', {
                  tid: item.item.tid,
                  collectionName: decode_utf8(item.item.name),
                })
              }>
              <Image source={settings_icon}></Image>
            </TouchableHighlight>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  newCollectionCreated = (collection: any) => {
    this.setState({collection: collection});
  };

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.invisibleContainer} />
        <SafeAreaView style={styles.safeAreaContainer}>
          <View style={styles.container}>
            <NavigationHeaderSafeArea
              heading={'Add to Collections'}
              cancelAction={() => this.cancelAction()}
              showRightText={true}
              rightText={'Done'}
              saveValues={this.saveValue}
            />
            <StatusBar
              barStyle={
                Utility.currentTheme == 'light'
                  ? 'dark-content'
                  : 'light-content'
              }
              backgroundColor={Colors.NewThemeColor}
            />
            <TouchableHighlight
              underlayColor={'#ffffff55'}
              style={styles.addNewCollectionContainer}
              onPress={() =>
                this.props.navigation.navigate('createRenameCollection', {
                  isRename: false,
                  callback: this.newCollectionCreated,
                })
              }>
              <View style={styles.addNewCollectionSubContainer}>
                <Image source={add_icon}></Image>
                <Text style={styles.NewCollectionTextColor}>
                  Create New Collection
                </Text>
              </View>
            </TouchableHighlight>
            <FlatList
              extraData={this.state}
              ref={ref => (this._listRef = ref)}
              style={styles.safeAreaContainer}
              onScroll={() => {
                Keyboard.dismiss();
              }}
              keyboardShouldPersistTaps={'handled'}
              showsHorizontalScrollIndicator={false}
              data={this.props.collectionList}
              keyExtractor={(_, index: number) => `${index}`}
              renderItem={(item: any) => this.renderRow(item)}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const mapState = (state: {[x: string]: any}) => {
  return {
    collectionList: state.MemoryInitials.collectionList,
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    collectionAPI: () => dispatch({type: CollectinAPI}),
  };
};

export default connect(mapState, mapDispatch)(MemoryCollectionList);
