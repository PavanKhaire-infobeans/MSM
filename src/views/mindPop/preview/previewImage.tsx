import React from 'react';
import {
  ActivityIndicator, Image, Keyboard, SafeAreaView, TouchableOpacity, View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Text from '../../../common/component/Text';
import { Colors, fontSize, getValue } from '../../../common/constants';
import EventManager from '../../../common/eventManager';
import { rubbish } from '../../../images';

type Props = {
  selectedItem: {
    uri?: string;
    filePath?: string;
    isLocal?: boolean;
    thumb_uri?: string;
  };
  deleteItem: Function;
  reset: Function;
  isEditMode: boolean;
};
type State = {hasLoaded: boolean; error: boolean};
export default class ImagePreview extends React.Component<Props, State> {
  backListner: EventManager;
  componentDidMount() {
    this.backListner = EventManager.addListener('hardwareBackPress', this.back);
  }

  back = () => {
    Keyboard.dismiss();
    Actions.pop();
    this.props.reset();
  };

  componentWillUnmount() {
    this.backListner.removeListener();
  }

  state = {
    hasLoaded: false,
    error: false,
  };

  private _errorView: JSX.Element = (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{...fontSize(14), color: 'black'}}>
        Image could not be loaded
      </Text>
    </View>
  );

  private _view: JSX.Element = (
    <View
      style={{
        height: '100%',
        width: '100%',
        position: 'absolute',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator animating={true} size="large" />
    </View>
  );

  render() {
    if (getValue(this.props.selectedItem, ['isLocal'])) {
      //console.log("local")
    } else {
      //console.log("uploaded")
    }
    if (this.props.selectedItem.thumb_uri) {
      this.props.selectedItem.uri = this.props.selectedItem.thumb_uri;
    }
    let uri = !getValue(this.props.selectedItem, ['isLocal'])
      ? this.props.selectedItem.uri
      : this.props.selectedItem.filePath;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.NewLightThemeColor,
        }}>
        <View style={{flex: 1, width: '100%'}}>
          {this.state.error ? (
            this._errorView
          ) : (
            <Image
              style={{flex: 1}}
              resizeMode="contain"
              source={{uri: uri}}
              onLoad={() => this.setState({hasLoaded: true})}
              onLoadStart={() => this.setState({hasLoaded: false})}
              onError={error => {
                this._errorHandler(error);
              }}
            />
          )}
          {!this.state.hasLoaded ? this._view : null}
        </View>
        <View
          style={{
            width: '100%',
            height: 60,
            flexDirection: 'row',
            backgroundColor: Colors.NewLightThemeColor,
            justifyContent: this.props.selectedItem.isLocal
              ? 'flex-end'
              : 'space-between',
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            borderTopColor: 'rgba(0.0, 0.0, 0.0, 0.25)',
            borderTopWidth: 1,
          }}>
          {this.props.selectedItem.isLocal ? null : (
            <TouchableOpacity
              onPress={() => {
                this.props.deleteItem();
                Keyboard.dismiss();
                Actions.pop();
              }}
              style={{
                marginLeft: 10,
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
              }}>
              {this.props.isEditMode ? (
                <Image source={rubbish} resizeMode="contain" />
              ) : null}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              Actions.pop();
              this.props.reset();
            }}
            style={{
              marginLeft: 10,
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 44,
            }}>
            <Text style={{...fontSize(18), color: Colors.NewTitleColor}}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  _errorHandler = (error: any) => {
    //console.log("error in loading image", error)
    this.setState({hasLoaded: true, error: true});
  };
}
