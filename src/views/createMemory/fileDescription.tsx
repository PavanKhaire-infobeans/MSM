import React from 'react';
import {
  Alert, Image, Keyboard, Platform, SafeAreaView, Text,
  TextInput, TouchableOpacity, View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import { Colors } from '../../common/constants';
import EventManager from '../../common/eventManager';
import { pdf_icon } from '../../images';
import Styles from './styles';

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
            style={Styles.fileHolderContainer}>
            <View
              style={Styles.fileHolderSubContainer}>
              <Image
                source={{
                  uri: file.filePath ? file.filePath : file.thumbnail_url,
                }}
                style={Styles.placeholderImageStyle}
              />
            </View>
          </View>
        );
        break;
      case 'files':
        return (
          <View
            style={Styles.fileHolderContainer}>
            <View
              style={Styles.fileHolderSubContainer}>
              <Image
                source={pdf_icon}
                resizeMode={'contain'}
                style={{backgroundColor: Colors.transparent}}
              />
              <Image
                source={pdf_icon}
                style={Styles.pdfIconImageStyle}></Image>
            </View>
          </View>
        );
        break;
      case 'audios':
        return (
          <View
            style={Styles.audioContainer}>
            <TouchableOpacity
              onPress={() => {}}
              style={Styles.playButtonContainer}>
              <View
                style={Styles.playStyle}
              />
            </TouchableOpacity>
            <View style={{marginLeft: 10}}>
              <Text
                style={[Styles.fileNameTextStyle,{ paddingRight: 80 }]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {file.title ? file.title : file.filename ? file.filename : ''}
              </Text>
              <Text style={Styles.durationTextStyle}>
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
      <View style={Styles.fullFlex}>
        <SafeAreaView
          style={Styles.emptySafeAreaStyle}
        />
        <SafeAreaView style={Styles.SafeAreaViewContainerStyle}>
          <View style={Styles.fullFlex}>
            <NavigationHeaderSafeArea
              heading={'Add Details'}
              cancelAction={() => this.cancelAction()}
              showRightText={true}
              rightText={'Done'}
              saveValues={this.saveValue}
            />
            {/* <SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>                    */}
            {/* <StatusBar
              barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
              backgroundColor={Colors.ThemeColor}
            /> */}
            {this.renderFileView()}
            <View style={[Styles.padding15,Styles.fullFlex]}>
              <TextInput
                style={Styles.titleTextInputStyle}
                placeholder="Enter title here..."
                placeholderTextColor={Colors.darkGray}
                multiline={true}
                numberOfLines={5}
                value={this.state.file_title}
                onChangeText={(text: any) =>
                  this.setState({file_title: text})
                }></TextInput>

              <TextInput
                style={Styles.descTextInputStyle}
                placeholder="Enter description..."
                placeholderTextColor={Colors.darkGray}
                onChangeText={(text: any) => this.setState({description: text})}
                value={this.state.description}
                onScroll={() => {}}
                multiline={true}></TextInput>
            </View>
            {Platform.OS == 'ios' && (
              <View
                style={[ Styles.fullWidth,{height: this.state.supportView}]}></View>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
