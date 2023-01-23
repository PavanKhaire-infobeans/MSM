import React from 'react';
import {
  Keyboard, SafeAreaView,
  StatusBar,
  Text,
  TextInput, TouchableWithoutFeedback, View
} from 'react-native';
import { connect } from 'react-redux';
import loaderHandler from '../../../common/component/busyindicator/LoaderHandler';
import {
  Colors, CommonTextStyles, decode_utf8, fontSize, getValue
} from '../../../common/constants';
import EventManager from '../../../common/eventManager';
import {
  kCollectionUpdated, UpdateMemoryCollection
} from '../createMemoryWebService';
import { SaveCollection } from '../reducer';
import { CollectinAPI } from '../saga';
import NavigationHeaderSafeArea from '../../../common/component/profileEditHeader/navigationHeaderSafeArea';
import Utility from '../../../common/utility';
import styles from './styles';
import TextField from '../../../common/component/textField';
import { action_close } from '../../../images';

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
    //loaderHandler.hideLoader();
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
      this.props.navigation.goBack();
    } else {
      this.cancelAction();
    }
  };

  componentWillUnmount = () => {
    this.collectionUpdated.removeListener();
  };

  saveValue = () => {
    if (this.state.content.trim().length > 0) {
      //loaderHandler.showLoader('Saving...');
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
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView
          style={styles.invisibleContainer}
        />
        <SafeAreaView style={styles.safeAreaContainer}>
          <View style={styles.container}>
            
            <NavigationHeaderSafeArea
              heading={''}
              //   this.props.isRename
              //     ? 'Rename Collection '
              //     : 'Create New Collection'
              // }
              cancelAction={() => this.cancelAction()}
              showRightText={false}
              rightText={'Done'}
              backIcon={action_close}
              saveValues={this.saveValue}
            />
            <View style={styles.borderStyle}></View>

            {/* <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>                    */}
            <StatusBar
              barStyle={Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            <Text style={styles.collectionTextStyle}>
              Create a new collection
            </Text>
            <View
              style={styles.collectionTextinputContainer}>
              <TextField
                placeholder="Enter collection name..."
                autoFocus={true}
                onChange={text => {
                  this.setState({ content: text, showError: false });
                }}
                value={this.state.content}
                // multiline={false}
                maxLength={30}
                style={styles.CollectionInputStyle}
              //   borderBottomColor: this.state.showError
              //     ? Colors.ErrorColor : 'rgba(0,0,0,0.4)',
              // }]}
              />
              {this.state.showError && (
                <Text style={styles.errorMessageStyle}>
                  *Please enter collection name
                </Text>
              )}
            </View>

            <TouchableWithoutFeedback
                // disabled={(this.state.username != '' && this.state.password != '') ? false : true}
                onPress={this.saveValue}
                >
                <View
                  style={[styles.loginSSOButtonStyle,{position:'absolute',bottom:24}]}>
                  <Text
                    style={[
                      CommonTextStyles.fontWeight500Size17Inter,
                      styles.loginTextStyle,
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
