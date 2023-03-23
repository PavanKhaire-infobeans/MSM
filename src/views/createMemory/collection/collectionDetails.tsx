import React from 'react';
import {
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// @ts-ignore
import DraggableFlatList from 'react-native-draggable-dynamic-flatlist';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import styles from './styles';
import NavigationHeaderSafeArea from '../../../common/component/profileEditHeader/navigationHeaderSafeArea';
import {ToastMessage} from '../../../common/component/Toast';
import {
  Colors,
  decode_utf8,
  fontFamily,
  fontSize,
} from '../../../common/constants';
import EventManager from '../../../common/eventManager';
import Utility from '../../../common/utility';
import {move_arrow, visibility_theme} from '../../../images';
import {
  GetCollectionDetails,
  kCollectionMemories,
  kSequenceUpdated,
  UpdateMemoryCollection,
} from '../createMemoryWebService';

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
    //loaderHandler.showLoader('Loading...');
    this.collectionFetch = EventManager.addListener(
      kCollectionMemories,
      this.collectionFetched,
    );
    this.collectionUpdated = EventManager.addListener(
      kSequenceUpdated,
      this.collectionUpdate,
    );
    this.setState({collectionName: this.props.route.params.collectionName}, () => {
      GetCollectionDetails(this.props.route.params.tid);
    });
  }

  componentWillUnmount = () => {
    this.collectionFetch.removeListener();
    this.collectionUpdated.removeListener();
  };

  collectionFetched = (success: any, responseList: any) => {
    //loaderHandler.hideLoader();
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
    //loaderHandler.hideLoader();
    if (!success) {
      //ToastMessage('Unable to update memory');
    }
    Keyboard.dismiss();
    this.props.navigation.goBack();
  };

  cancelAction = () => {
    Keyboard.dismiss();
    this.props.navigation.goBack();
  };

  renameCollection = (name: any) => {
    console.log("Xccc >",JSON.stringify(name))
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
      //loaderHandler.showLoader('Saving...');
      let commaSeparatedValue = this.state.finalSequence.join(',');
      UpdateMemoryCollection(
        {
          collection_tid: this.props.route.params.tid,
          memories_sequence: commaSeparatedValue,
        },
        true,
      );
    } else {
      Keyboard.dismiss();
      this.props.navigation.goBack();
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
        style={[
          styles.renderRowContainer,
          {
            backgroundColor: isActive ? Colors.SerachbarColor : Colors.white,
          },
        ]}
        onLongPress={move}
        onPressOut={moveEnd}>
        <View style={styles.renderSubRowContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.moveImage}
              resizeMode="contain"
              source={move_arrow}></Image>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>
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
  }

  renderItem = ({item, index, move, moveEnd, isActive}: any) => {
    return (
      <TouchableOpacity
        onPress={() => {}}
        style={styles.collectionContainer}
        onLongPress={move}
        onPressOut={moveEnd}>
        <View
          style={[
            styles.collectionSubContainer,
            {
              backgroundColor: isActive
                ? 'rgba(2, 109, 96, 0.4)'
                : Colors.white,
            },
          ]}>
          <View style={styles.collectionTitleContainer}>
            <Image
              style={styles.moveImage}
              resizeMode="contain"
              source={move_arrow}></Image>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{decode_utf8(item.title)}</Text>
            </View>
          </View>
          {item.status != 0 && (
            <TouchableOpacity
              style={styles.visiblityImageContainer}
              onPress={() =>
                this.props.navigation.navigate('newmemoryDetails', {
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
      <View style={styles.container}>
        <SafeAreaView style={styles.invisibleContainer} />
        <SafeAreaView style={styles.safeAreaContainer}>
          <View style={styles.container}>
            <NavigationHeaderSafeArea
              heading={'Manage Collection'}
              multiValuesPage={true}
              cancelAction={() => this.cancelAction()}
              createMemoryPage={true}
              showRightText={true}
              rightText={'Done'}
              saveValues={this.saveValue}
            />
            {/* <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>                    */}
            <StatusBar
              barStyle={
                Utility.currentTheme == 'light'
                  ? 'dark-content'
                  : 'light-content'
              }
              backgroundColor={Colors.ThemeColor}
            />
            <View style={styles.collectionNameContainer}>
              <Text style={styles.collectionText}>
                {this.state.collectionName}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('createRenameCollection', {
                    tid: this.props.route.params.tid,
                    isRename: true,
                    collectionName: this.props.route.params.collectionName,
                    callback: this.renameCollection,
                  })
                }>
                <Text style={styles.titleText}>Rename</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
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
