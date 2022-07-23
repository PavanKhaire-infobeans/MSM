import React from 'react';
import {
  Keyboard, SafeAreaView,
  StatusBar,
  Text,
  TextInput, View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import {
  Colors, decode_utf8, fontSize, getValue
} from '../../../common/constants';
import EventManager from '../../../common/eventManager';
import {
  kCollectionUpdated, UpdateMemoryCollection
} from '../createMemoryWebService';
import { SaveCollection } from '../reducer';
import { CollectinAPI } from '../saga';
import NavigationHeaderSafeArea from '../../../common/component/profileEditHeader/navigationHeaderSafeArea';
import Utility from '../../../common/utility';

type State = { [x: string]: any };
type Props = {
  tid?: any;
  isRename: any;
  collectionName?: any;
  [x: string]: any;
  callback?: any;
};

class CreateRenameCollection extends React.Component<Props, State> {
  collectionUpdated: EventManager;
  state: State = {
    content: '',
    showError: false,
  };

  componentDidMount() {
    if (this.props.isRename) {
      this.setState({ content: this.props.collectionName });
    }
    this.collectionUpdated = EventManager.addListener(
      kCollectionUpdated,
      this.collectionUpdate,
    );
  }

  collectionUpdate = (success: any, response: any) => {
    loaderHandler.hideLoader();
    if (success) {
      let newCollection = getValue(response, ['CollectionStatus', 'data']);
      if (this.props.isRename) {
        if (this.props.collection.tid == this.props.tid) {
          this.props.setCollection(newCollection);
        }
        this.props.callback(this.state.content);
        this.props.collectionAPI();
      } else {
        newCollection = { ...newCollection, memory_count: 0 };
        this.props.setCollection(newCollection);
        this.props.collectionList.unshift(newCollection);
        this.props.callback(newCollection);
      }
      Keyboard.dismiss();
      Actions.pop();
    } else {
    }
  };

  componentWillUnmount = () => {
    this.collectionUpdated.removeListener();
  };

  saveValue = () => {
    if (this.state.content.trim().length > 0) {
      loaderHandler.showLoader('Saving...');
      if (this.props.isRename) {
        UpdateMemoryCollection(
          {
            collection_tid: this.props.tid,
            name: decode_utf8(this.state.content.trim()),
          },
          false,
        );
      } else {
        UpdateMemoryCollection(
          { name: decode_utf8(this.state.content.trim()) },
          false,
        );
      }
    } else {
      this.setState({ showError: true });
    }
  };

  cancelAction = () => {
    Keyboard.dismiss();
    Actions.pop();
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView
          style={{
            width: '100%',
            flex: 0,
            backgroundColor: Colors.NewThemeColor,
          }}
        />
        <SafeAreaView style={{ width: '100%', flex: 1, backgroundColor: '#fff' }}>
          <View style={{ flex: 1 }}>
            <NavigationHeaderSafeArea
              heading={
                this.props.isRename
                  ? 'Rename Collection '
                  : 'Create New Collection'
              }
              cancelAction={() => this.cancelAction()}
              showRightText={true}
              rightText={'Done'}
              saveValues={this.saveValue}
            />
            {/* <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>                    */}
            <StatusBar
              barStyle={Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                padding: 15,
              }}>
              <TextInput
                placeholder="Enter collection name"
                autoFocus={true}
                onChangeText={text => {
                  this.setState({ content: text, showError: false });
                }}
                value={this.state.content}
                multiline={false}
                maxLength={30}
                style={{
                  width: '100%',
                  fontFamily: 'Rubik',
                  ...fontSize(18),
                  textAlignVertical: 'center',
                  paddingTop: 15,
                  paddingBottom: 15,
                  paddingRight: 10,
                  paddingLeft: 10,
                  textAlign: 'left',
                  color: Colors.TextColor,
                  backgroundColor: '#F3F3F3',
                  borderBottomColor: this.state.showError
                    ? Colors.ErrorColor
                    : 'rgba(0,0,0,0.4)',
                  borderBottomWidth: 1,
                }}
              />
              {this.state.showError && (
                <Text style={{ ...fontSize(12), color: Colors.ErrorColor }}>
                  *Please enter collection name
                </Text>
              )}
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
const mapState = (state: { [x: string]: any }) => {
  return {
    collectionList: state.MemoryInitials.collectionList,
    collection: state.MemoryInitials.collection,
  };
};

const mapDispatch = (dispatch: Function) => {
  return {
    collectionAPI: () => dispatch({ type: CollectinAPI }),
    setCollection: (payload: any) =>
      dispatch({ type: SaveCollection, payload: payload }),
  };
};

export default connect(mapState, mapDispatch)(CreateRenameCollection);
