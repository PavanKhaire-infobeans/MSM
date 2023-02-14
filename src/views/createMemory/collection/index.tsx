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
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { create_checkbox, create_checkbox_tick } from '../../../../app/images';
import NavigationHeaderSafeArea from '../../../common/component/profileEditHeader/navigationHeaderSafeArea';
import { No_Internet_Warning } from '../../../common/component/Toast';
import {
  Colors,
  CommonTextStyles,
  ConsoleType,
  decode_utf8,
  fontFamily,
  fontSize,
  showConsoleLog,
} from '../../../common/constants';
import Utility from '../../../common/utility';
import {
  action_close,
  add_icon,
  checkbox,
  checkbox_active,
  settings_icon,
} from '../../../images';
import { MemoryAction } from '../../myMemories/myMemoriesWebService';
import { SaveCollection } from '../reducer';
import { CollectinAPI } from '../saga';
import Styles from './styles';

type State = { [x: string]: any };
type Props = { [x: string]: any };

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
      //showConsoleLog(ConsoleType.LOG,Object.keys(empty).length === 0 && empty.constructor === Object);
      if (Object.keys(empty).length === 0 && empty.constructor === Object) {
        this.setState({
          collections: [],
        });
      } else {
        // showConsoleLog(ConsoleType.LOG,"2");
        this.setState({
          collections: this.props.collections,
        });
      }
    } else {
      // showConsoleLog(ConsoleType.LOG,"3");
      this.setState({
        collections: [],
      });
    }
  }

  UNSAFE_componentWillReceiveProps=(nextProps: Readonly<Props>, nextContext: any): void =>{
    if(nextProps != this.props){
      this.setState({
        collections: this.props.collections,
      });
    }    
  };

  cancelAction = () => {
    Keyboard.dismiss();
    this.props.navigation.goBack();
  };

  goToNewCollection = ()=>{
    this.props.navigation.navigate('createRenameCollection', {
      isRename: false,
      callback: this.newCollectionCreated,
    })
  };

  saveValue = () => {
    let collections_nids : any = [];
    this.state.collections.forEach((element) => {
        collections_nids.push(element.tid);
    })
    if(this.props.route?.params?.isFromMemoryAction){
        if(Utility.isInternetConnected){
            //loaderHandler.showLoader();
            MemoryAction("my_stories", this.props.nid, "add_to_collection",'', collections_nids);
            Keyboard.dismiss();
            this.props.navigation.goBack();
        } else{
             No_Internet_Warning();
         }
    } 
    else{
    this.props.setCollection(this.state.collections);
    Keyboard.dismiss();
    this.props.navigation.goBack();
    }
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
    showConsoleLog(ConsoleType.LOG, 'collections..', this.state.collections);
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
      this.setState({ collections: collections });
    } catch (error) {
      showConsoleLog(ConsoleType.LOG, error);
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
      <View style={Styles.collectionListContainer}>
        <TouchableHighlight
          underlayColor={Colors.white}
          onPress={() => this.setCollection(item.item)}
          style={Styles.collectionListButtonStyle}>
          <View style={Styles.collectionListButtonContainerStyle}>
            <View style={Styles.collectionTitleContainer}>
              <Image
                style={Styles.moveImage}
                resizeMode="contain"
                source={isSelected ? create_checkbox_tick : create_checkbox}></Image>
              <View style={Styles.titleContainer}>
                <Text style={Styles.titleText}>
                  {`${decode_utf8(item.item.name)} (${item.item.memory_count} memories)`}
                </Text>
               
              </View>
            </View>
            {/* <TouchableHighlight
              style={Styles.nameContainer}
              underlayColor={'#ffffff44'}
              onPress={() =>
                this.props.navigation.navigate('collectionDetails', {
                  tid: item.item.tid,
                  collectionName: decode_utf8(item.item.name),
                })
              }>
              <Image source={settings_icon}></Image>
            </TouchableHighlight> */}
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  newCollectionCreated = (collection: any) => {
    this.setState({ collection: collection });
  };

  render() {
    return (
      <View style={Styles.container}>
        <SafeAreaView style={Styles.invisibleContainer} />
        <SafeAreaView style={Styles.safeAreaContainer}>
          <View style={Styles.container}>
            <NavigationHeaderSafeArea
              // heading={''}
              cancelAction={() => this.cancelAction()}
              showRightText={true}
              showNewCollection={true}
              rightIcon={true}
              backIcon={action_close}
              rightText={'New\nCollection'}
              saveValues={this.goToNewCollection}
            />
            <StatusBar
              barStyle={
                Utility.currentTheme == 'light'
                  ? 'dark-content'
                  : 'light-content'
              }
              backgroundColor={Colors.NewThemeColor}
            />
            <View style={Styles.borderStyle}></View>

            {/* <TouchableHighlight
              underlayColor={'#ffffff55'}
              style={Styles.addNewCollectionContainer}
              onPress={() =>
                this.props.navigation.navigate('createRenameCollection', {
                  isRename: false,
                  callback: this.newCollectionCreated,
                })
              }>
              <View style={Styles.addNewCollectionSubContainer}>
                <Image source={add_icon}></Image>
                <Text style={Styles.NewCollectionTextColor}>
                  Create New Collection
                </Text>
              </View>
            </TouchableHighlight> */}

            <Text style={Styles.collectionTextStyle}>
              Collections are a great way to organize your memories based on a common theme or trait. It also helps readers find your related memories.
            </Text>


            <FlatList
              extraData={this.state}
              ref={ref => (this._listRef = ref)}
              style={Styles.collectionListStyle}
              onScroll={() => {
                Keyboard.dismiss();
              }}
              keyboardShouldPersistTaps={'handled'}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={this.props.collectionList}
              keyExtractor={(_, index: number) => `${index}`}
              ItemSeparatorComponent={()=><View style={{height:24}}/>}
              renderItem={(item: any) => this.renderRow(item)}
            />
             <TouchableWithoutFeedback
                // disabled={(this.state.username != '' && this.state.password != '') ? false : true}
                onPress={this.saveValue}
                >
                <View
                  style={Styles.loginSSOButtonStyle}>
                  <Text
                    style={[
                      CommonTextStyles.fontWeight500Size17Inter,
                      Styles.loginTextStyle,
                    ]}>
                    Done
                  </Text>
                </View>
              </TouchableWithoutFeedback>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const mapState = (state: { [x: string]: any }) => {
  return {
    collections: state.MemoryInitials.collections,
    collectionList: state.MemoryInitials.collectionList,
    // memoryCollections : state.MemoryInitials.memoryCollectionsList
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    collectionAPI: () => dispatch({ type: CollectinAPI }),
    //   MemoryCollectionsAPI : (payload: any) => dispatch({type: MemoryCollectionsAPI, payload : payload}),
    setCollection: (payload: any) =>
      dispatch({ type: SaveCollection, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(CollectionList);
