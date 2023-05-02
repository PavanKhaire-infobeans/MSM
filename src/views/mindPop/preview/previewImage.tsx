import React from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../../../common/component/Text';
import {Colors, fontSize, getValue} from '../../../common/constants';
import EventManager from '../../../common/eventManager';
import {rubbish} from '../../../images';
import Styles from './styles';

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
    this.props.navigation.goBack();
    if (this.props.route?.params.reset) {
      this.props.route?.params?.reset();
    }
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
    <View style={Styles.ActivityContainer}>
      <ActivityIndicator animating={true} size="large" />
    </View>
  );

  render() {
    if (getValue(this.props.route?.params?.selectedItem, ['isLocal'])) {
      //showConsoleLog(ConsoleType.LOG,"local")
    } else {
      //showConsoleLog(ConsoleType.LOG,"uploaded")
    }
    let selectedItemProps = this.props.route?.params?.selectedItem
    if (selectedItemProps?.thumb_uri) {
      selectedItemProps.uri = selectedItemProps.thumb_uri;
    }
    let uri = !getValue(selectedItemProps, ['isLocal'])
      ? selectedItemProps.uri
      : selectedItemProps.filePath;
    return (
      <SafeAreaView style={Styles.safeAreaContainer}>
        <View style={Styles.subContainer}>
          {this.state.error ? (
            this._errorView
          ) : (
            <Image
              style={Styles.container}
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
          style={[
            Styles.buttonContainer,
            {
              justifyContent: selectedItemProps.isLocal
                ? 'flex-end'
                : 'space-between',
            },
          ]}>
          {selectedItemProps?.isLocal ? null : (
            <TouchableOpacity
              onPress={() => {
                this.props.route?.params?.deleteItem();
                Keyboard.dismiss();
                this.props.navigation.goBack();
              }}
              style={Styles.buttonStyle}>
              {this.props.route?.params?.isEditMode ? (
                <Image source={rubbish} resizeMode="contain" />
              ) : null}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              this.props.navigation.goBack();
              if (this.props.route?.params.reset) {
                this.props.route?.params?.reset();
              }
            }}
            style={Styles.closeButton}>
            <Text style={Styles.closeStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  _errorHandler = (error: any) => {
    //showConsoleLog(ConsoleType.LOG,"error in loading image", error)
    this.setState({hasLoaded: true, error: true});
  };
}
