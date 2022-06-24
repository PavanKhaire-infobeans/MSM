import React from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  Platform,
} from 'react-native';
// @ts-ignore
import DraggableFlatList from 'react-native-draggable-dynamic-flatlist';
import {Actions} from 'react-native-router-flux';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import NavigationThemeBar from '../../../common/component/navigationBarForEdit/navigationBarWithTheme';
import {ToastMessage} from '../../../common/component/Toast';
import {Colors, decode_utf8, fontSize} from '../../../common/constants';
import EventManager from '../../../common/eventManager';
import {move_arrow, visibility_theme} from '../../../images';
import {
  GetCollectionDetails,
  kCollectionMemories,
  kSequenceUpdated,
  UpdateMemoryCollection,
} from '../createMemoryWebService';
import NavigationHeaderSafeArea from '../../../common/component/profileEditHeader/navigationHeaderSafeArea';
import Utility from '../../../common/utility';

type State = {[x: string]: any};
type Props = {tid: any; collectionName: any};

export default class CollectionDetails extends React.Component<Props, State> {
  collectionFetch: EventManager;
  collectionUpdated: EventManager;
  state: State = {
    collectionList: [],
    initialSequence: [],
    finalSequence: [],
    collectionName: '',
  };
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    loaderHandler.showLoader('Loading...');
    this.collectionFetch = EventManager.addListener(
      kCollectionMemories,
      this.collectionFetched,
    );
    this.collectionUpdated = EventManager.addListener(
      kSequenceUpdated,
      this.collectionUpdate,
    );
    this.setState({collectionName: this.props.collectionName});
    GetCollectionDetails(this.props.tid);
  }

  componentWillUnmount = () => {
    //this.collectionFetch.removeListener();
    //this.collectionUpdated.removeListener();
  };

  collectionFetched = (success: any, responseList: any) => {
    loaderHandler.hideLoader();
    if (success) {
      let initialSequence: any = [];
      responseList.forEach((element: any, index: any) => {
        initialSequence.push(element.id);
      });
      this.setState({
        collectionList: responseList,
        initialSequence: initialSequence,
        finalSequence: initialSequence,
      });
    }
  };

  collectionUpdate = (success: any) => {
    loaderHandler.hideLoader();
    if (!success) {
      ToastMessage('Unable to update memory');
    }
    Keyboard.dismiss();
    Actions.pop();
  };

  cancelAction = () => {
    Keyboard.dismiss();
    Actions.pop();
  };

  renameCollection = (name: any) => {
    this.setState({collectionName: name});
  };

  saveValue = () => {
    let sequenceUpdated = false;
    this.state.initialSequence.forEach((element: any, index: any) => {
      if (element !== this.state.finalSequence[index]) {
        sequenceUpdated = true;
      }
    });
    if (sequenceUpdated) {
      loaderHandler.showLoader('Saving...');
      let commaSeparatedValue = this.state.finalSequence.join(',');
      UpdateMemoryCollection(
        {
          collection_tid: this.props.tid,
          memories_sequence: commaSeparatedValue,
        },
        true,
      );
    } else {
      Keyboard.dismiss();
      Actions.pop();
    }
  };

  renderRow = (
    item: any,
    index: any,
    move: any,
    moveEnd: any,
    isActive: any,
  ) => {
    return (
      <TouchableOpacity
        style={{
          height: 60,
          flex: 1,
          backgroundColor: isActive ? '#f3f3f3' : '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onLongPress={move}
        onPressOut={moveEnd}>
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
              source={move_arrow}></Image>
            <View style={{paddingRight: 30}}>
              <Text
                style={{
                  ...fontSize(16),
                  fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                  color: Colors.TextColor,
                }}>
                {decode_utf8(item.item.title)}
              </Text>
              {/* <Text style={{...fontSize(16)}}>{"("}{item.item.memory_count}{" memories)"}</Text> */}
            </View>
          </View>
          <Image source={visibility_theme}></Image>
        </View>
      </TouchableOpacity>
    );
  };

  moveEnd(item: any) {
    let finalSequence: any = [];
    item.data.forEach((element: any, index: any) => {
      finalSequence.push(element.id);
    });
    this.setState({collectionList: item.data, finalSequence: finalSequence});
    //console.log(item);
  }

  renderItem = ({item, index, move, moveEnd, isActive}: any) => {
    return (
      <TouchableOpacity
        onPress={() => {}}
        style={{
          borderBottomWidth: 1,
          flex: 1,
          borderBottomColor: 'rgba(0, 0, 0, 0.2)',
          minHeight: 60,
          backgroundColor: '#fff',
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onLongPress={move}
        onPressOut={moveEnd}>
        <View
          style={{
            flexDirection: 'row',
            height: '100%',
            flex: 1,
            padding: 15,
            paddingRight: 0,
            backgroundColor: isActive ? 'rgba(2, 109, 96, 0.4)' : '#fff',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{flex: 1, alignItems: 'flex-start', flexDirection: 'row'}}>
            <Image
              style={{height: 25, width: 25, marginRight: 10}}
              resizeMode="contain"
              source={move_arrow}></Image>
            <View style={{paddingRight: 40}}>
              <Text
                style={{
                  ...fontSize(16),
                  fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                  color: Colors.TextColor,
                }}>
                {decode_utf8(item.title)}
              </Text>
            </View>
          </View>
          {item.status != 0 && (
            <TouchableOpacity
              style={{padding: 15}}
              onPress={() =>
                Actions.push('memoryDetails', {
                  nid: item.id,
                  type: 'my_stories',
                })
              }>
              <Image source={visibility_theme}></Image>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView
          style={{width: '100%', flex: 0, backgroundColor: Colors.ThemeColor}}
        />
        <SafeAreaView style={{width: '100%', flex: 1, backgroundColor: '#fff'}}>
          <View style={{flex: 1}}>
            <NavigationHeaderSafeArea
              heading={'Manage Collection'}
              cancelAction={() => this.cancelAction()}
              showRightText={true}
              rightText={'Done'}
              saveValues={this.saveValue}
            />
            {/* <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>                    */}
            <StatusBar
              barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
              backgroundColor={Colors.ThemeColor}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 15,
                backgroundColor: Colors.NewLightThemeColor,
              }}>
              <Text style={{...fontSize(18), flex: 1}}>
                {this.state.collectionName}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Actions.push('createRenameCollection', {
                    tid: this.props.tid,
                    isRename: true,
                    collectionName: this.props.collectionName,
                    callback: this.renameCollection,
                  })
                }>
                <Text style={{...fontSize(16), color: Colors.ThemeColor}}>
                  Rename
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
              <DraggableFlatList
                data={this.state.collectionList}
                renderItem={this.renderItem}
                keyExtractor={(item: any, index: any) =>
                  `draggable-item-${item.id}`
                }
                scrollPercent={5}
                onMoveEnd={(data: any) => this.moveEnd(data)}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
