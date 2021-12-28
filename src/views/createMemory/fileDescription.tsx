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
  Alert,
} from 'react-native';
import React from 'react';
import {Actions} from 'react-native-router-flux';
import {Colors, fontSize} from '../../common/constants';
import NavigationThemeBar from '../../common/component/navigationBarForEdit/navigationBarWithTheme';
import {pdf_icon} from '../../images';
import EventManager from '../../common/eventManager';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';

type State = {[x: string]: any};
type Props = {[x: string]: any};

export default class FileDescription extends React.Component<Props, State> {
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;
  backListner: EventManager;
  file_title: '';
  description: '';
  state = {
    file_title: '',
    description: '',
    supportView: 0,
  };
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.file_title = this.props.file.file_title;
    this.description = this.props.file.file_description;
    this.setState({
      file_title: this.file_title,
      description: this.description,
    });
    this.backListner = EventManager.addListener(
      'hardwareBackPress',
      this.cancelAction,
    );
    if (Platform.OS == 'android') {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._keyboardDidHide,
      );
    } else {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardWillShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardWillHide',
        this._keyboardDidHide,
      );
    }
  }

  componentWillUnmount() {}

  _keyboardDidShow = (e: any) => {
    this.setState({
      supportView: e.endCoordinates.height - 30,
    });
  };

  _keyboardDidHide = (e: any) => {
    this.setState({
      supportView: 0,
    });
  };

  cancelAction = () => {
    if (
      this.state.file_title == this.file_title &&
      this.state.description == this.description
    ) {
      Keyboard.dismiss();
      Actions.pop();
    } else {
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.ThemeColor}
      />;
      Alert.alert('Save changes?', `Do you want to save your changes?`, [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => {
            Keyboard.dismiss();
            Actions.pop();
          },
        },
        {
          text: 'Yes',
          style: 'default',
          onPress: () => {
            this.saveValue();
          },
        },
      ]);
    }
  };

  renderFileView = () => {
    let file = this.props.file;
    switch (file.type) {
      case 'images':
        return (
          <View
            style={{
              width: '100%',
              height: 200,
              backgroundColor: Colors.NewLightThemeColor,
            }}>
            <View
              style={{
                width: '100%',
                height: 200,
                position: 'absolute',
                top: 0,
                backgroundColor: '#cccccc99',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={{
                  uri: file.filePath ? file.filePath : file.thumbnail_url,
                }}
                style={{
                  height: '100%',
                  width: '100%',
                  resizeMode: 'contain',
                  backgroundColor: 'transparent',
                }}
              />
            </View>
          </View>
        );
        break;
      case 'files':
        return (
          <View
            style={{
              width: '100%',
              height: 200,
              backgroundColor: Colors.NewLightThemeColor,
            }}>
            <View
              style={{
                width: '100%',
                height: 200,
                position: 'absolute',
                top: 0,
                backgroundColor: '#cccccc99',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={pdf_icon}
                resizeMode={'contain'}
                style={{backgroundColor: 'transparent'}}
              />
              <Image
                source={pdf_icon}
                style={{position: 'absolute', bottom: 5, right: 5}}></Image>
            </View>
          </View>
        );
        break;
      case 'audios':
        return (
          <View
            style={{
              width: '100%',
              height: 90,
              justifyContent: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.NewLightThemeColor,
            }}>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                width: 55,
                height: 55,
                marginLeft: 15,
                backgroundColor: Colors.ThemeColor,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 24,
                  width: 24,
                  marginLeft: 10,
                  borderLeftColor: 'white',
                  borderLeftWidth: 18,
                  borderTopColor: 'transparent',
                  borderTopWidth: 12,
                  borderBottomColor: 'transparent',
                  borderBottomWidth: 12,
                }}
              />
            </TouchableOpacity>
            <View style={{marginLeft: 10}}>
              <Text
                style={{
                  ...fontSize(16),
                  color: '#000',
                  marginBottom: 5,
                  paddingRight: 80,
                }}
                numberOfLines={1}
                ellipsizeMode="tail">
                {file.title ? file.title : file.filename ? file.filename : ''}
              </Text>
              <Text style={{...fontSize(16), color: '#000'}}>
                {file.duration}
              </Text>
            </View>
          </View>
        );
        break;
    }
  };

  saveValue = () => {
    if (
      this.state.file_title != this.file_title ||
      this.state.description != this.description
    ) {
      this.props.done(
        this.props.file,
        this.state.file_title.trim(),
        this.state.description.trim(),
      );
    }
    Keyboard.dismiss();
    Actions.pop();
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
              heading={'Add Details'}
              cancelAction={() => this.cancelAction()}
              showRightText={true}
              rightText={'Done'}
              saveValues={this.saveValue}
            />
            {/* <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>                    */}
            <StatusBar
              barStyle={'dark-content'}
              backgroundColor={Colors.ThemeColor}
            />
            {this.renderFileView()}
            <View style={{padding: 15, flex: 1}}>
              <TextInput
                style={{
                  ...fontSize(16),
                  height: 50,
                  textAlignVertical: 'top',
                  borderBottomColor: 'rgba(0,0,0,0.2)',
                  fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                  maxHeight: 70,
                  paddingBottom: 10,
                  borderBottomWidth: 0.5,
                }}
                placeholder="Enter title here..."
                placeholderTextColor="#909090"
                multiline={true}
                numberOfLines={5}
                value={this.state.file_title}
                onChangeText={(text: any) =>
                  this.setState({file_title: text})
                }></TextInput>

              <TextInput
                style={{
                  minHeight: 40,
                  ...fontSize(16),
                  textAlignVertical: 'top',
                }}
                placeholder="Enter description..."
                placeholderTextColor="#909090"
                onChangeText={(text: any) => this.setState({description: text})}
                value={this.state.description}
                onScroll={() => {}}
                multiline={true}></TextInput>
            </View>
            {Platform.OS == 'ios' && (
              <View
                style={{width: '100%', height: this.state.supportView}}></View>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
