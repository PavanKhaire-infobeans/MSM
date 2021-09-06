import {
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableHighlight,
  FlatList,
  Alert,
} from 'react-native';
import React from 'react';
import {Actions} from 'react-native-router-flux';
// @ts-ignore
import {Colors, fontSize, decode_utf8} from '../../../common/constants';
import {
  add_icon,
  settings_icon,
  checkbox_active,
  checkbox,
} from '../../../images';
import {connect} from 'react-redux';
import {CollectinAPI} from '../saga';
import NavigationHeaderSafeArea from '../../../common/component/profileEditHeader/navigationHeaderSafeArea';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import {
  No_Internet_Warning,
  ToastMessage,
} from '../../../common/component/Toast';
import Utility from '../../../common/utility';
import {
  GetPublishedMemoryCollections,
  kPublishedMemoryCollections,
  MemoryAction,
} from '../../myMemories/myMemoriesWebService';
import EventManager from '../../../common/eventManager';

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
    Actions.pop();
  };

  saveValue = () => {
    let collections_nids: any = [];
    this.state.collections.forEach(element => {
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
      Actions.pop();
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
      console.log(error);
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
      <View style={{minHeight: 80, flex: 1}}>
        <TouchableHighlight
          underlayColor={'#ffffffff'}
          onPress={() => this.setCollection(item.item)}
          style={{
            borderBottomWidth: 1,
            flex: 1,
            padding: 15,
            paddingRight: 0,
            borderBottomColor: 'rgba(0, 0, 0, 0.2)',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{flex: 1, alignItems: 'flex-start', flexDirection: 'row'}}>
              <Image
                style={{height: 25, width: 25, marginRight: 10}}
                resizeMode="contain"
                source={isSelected ? checkbox_active : checkbox}></Image>
              <View style={{paddingRight: 30}}>
                <Text
                  style={{
                    ...fontSize(16),
                    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                    color: Colors.TextColor,
                  }}>
                  {decode_utf8(item.item.name)}
                </Text>
                <Text style={{...fontSize(16), color: Colors.TextColor}}>
                  {'('}
                  {item.item.memory_count}
                  {' memories)'}
                </Text>
              </View>
            </View>
            <TouchableHighlight
              style={{height: '100%', padding: 15}}
              underlayColor={'#ffffff44'}
              onPress={() =>
                Actions.push('collectionDetails', {
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
      <View style={{flex: 1}}>
        <SafeAreaView
          style={{
            width: '100%',
            flex: 0,
            backgroundColor: Colors.NewThemeColor,
          }}
        />
        <SafeAreaView style={{width: '100%', flex: 1, backgroundColor: '#fff'}}>
          <View style={{flex: 1}}>
            <NavigationHeaderSafeArea
              heading={'Add to Collections'}
              cancelAction={() => this.cancelAction()}
              showRightText={true}
              rightText={'Done'}
              saveValues={this.saveValue}
            />
            <StatusBar
              barStyle={'dark-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            <TouchableHighlight
              underlayColor={'#ffffff55'}
              style={{height: 70, width: '100%'}}
              onPress={() =>
                Actions.push('createRenameCollection', {
                  isRename: false,
                  callback: this.newCollectionCreated,
                })
              }>
              <View
                style={{
                  height: 70,
                  width: '100%',
                  backgroundColor: Colors.NewLightThemeColor,
                  flexDirection: 'row',
                  padding: 15,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <Image source={add_icon}></Image>
                <Text
                  style={{
                    ...fontSize(16),
                    marginLeft: 10,
                    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                    color: Colors.NewTitleColor,
                  }}>
                  Create New Collection
                </Text>
              </View>
            </TouchableHighlight>
            <FlatList
              extraData={this.state}
              ref={ref => (this._listRef = ref)}
              style={{width: '100%', flex: 1}}
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
