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
import {KeyboardAwareScrollView} from '../../common/component/keyboardaware-scrollview';
import {Colors, fontSize, decode_utf8, fontFamily} from '../../../common/constants';
import NavigationThemeBar from '../../../common/component/navigationBarForEdit/navigationBarWithTheme';
import {
  pdf_icon,
  add_icon,
  radio,
  radio_active,
  settings_icon,
  checkbox_active,
  checkbox,
} from '../../../images';
import {connect} from 'react-redux';
import {
  LocationAPI,
  MemoryTagsAPI,
  CollectinAPI,
  MemoryCollectionsAPI,
} from '../saga';
import {ResetLocation, MemoryInitialsUpdate, SaveCollection} from '../reducer';
import NavigationHeaderSafeArea from '../../../common/component/profileEditHeader/navigationHeaderSafeArea';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import {No_Internet_Warning} from '../../../common/component/Toast';
import Utility from '../../../common/utility';
import {MemoryAction} from '../../myMemories/myMemoriesWebService';

type State = {[x: string]: any};
type Props = {[x: string]: any};

class CollectionList extends React.Component<Props, State> {
  _listRef: any;
  checkForScroll: any = true;
  selectedIndex: any = {};
  state = {
    collections: [],
  };
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.checkForScroll = true;
    if (this.props.collectionList.length == 0) {
      this.props.collectionAPI();
    }
    if (this.props.collections) {
      let empty = this.props.collections;
      //console.log(Object.keys(empty).length === 0 && empty.constructor === Object);
      if (Object.keys(empty).length === 0 && empty.constructor === Object) {
        this.setState({
          collections: [],
        });
      } else {
        // console.log("2");
        this.setState({
          collections: this.props.collections,
        });
      }
    } else {
      // console.log("3");
      this.setState({
        collections: [],
      });
    }
  }

  cancelAction = () => {
    Keyboard.dismiss();
    Actions.pop();
  };

  saveValue = () => {
    // let collections_nids : any = [];
    // this.state.collections.forEach((element) => {
    //     collections_nids.push(element.tid);
    // })
    // if(this.props.isFromMemoryAction){
    //     if(Utility.isInternetConnected){
    //         loaderHandler.showLoader();
    //         MemoryAction("my_stories", this.props.nid, "add_to_collection",'', collections_nids);
    //         Keyboard.dismiss();
    //         Actions.pop();
    //     } else{
    //          No_Internet_Warning();
    //      }
    // } else{
    this.props.setCollection(this.state.collections);
    Keyboard.dismiss();
    Actions.pop();
    // }
  };

  checkIfLastItemRendered = (item: any) => {
    // setTimeout(() => {
    //     if(this.selectedItem.index){
    //         this._listRef.scrollToItem(this.selectedItem)
    //     }
    // }, 50);
    // this.checkForScroll = false;
  };

  setCollection = (item: any) => {
    console.log('collections..', this.state.collections);
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
                    fontWeight:'500',
                    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
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
              barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
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
                    fontWeight:'500',
                    fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
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
    collections: state.MemoryInitials.collections,
    collectionList: state.MemoryInitials.collectionList,
    // memoryCollections : state.MemoryInitials.memoryCollectionsList
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    collectionAPI: () => dispatch({type: CollectinAPI}),
    //   MemoryCollectionsAPI : (payload: any) => dispatch({type: MemoryCollectionsAPI, payload : payload}),
    setCollection: (payload: any) =>
      dispatch({type: SaveCollection, payload: payload}),
  };
};

export default connect(mapState, mapDispatch)(CollectionList);
