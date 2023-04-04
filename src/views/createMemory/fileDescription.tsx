import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import {Colors} from '../../common/constants';
import EventManager from '../../common/eventManager';
import {pdf_icon} from '../../images';
import Styles from './styles';

const FileDescription = props => {
  let fileTitle = '';
  let fileDesc = '';
  const [file_title, setFileTitle] = useState('');
  const [description, setDescription] = useState('');
  const [supportView, setSupportView] = useState(0);

  useEffect(() => {
    fileTitle = props.route.params.file.file_title;
    fileDesc = props.route.params.file.file_description;
    setFileTitle(props.route.params.file.file_title);
    setDescription(props.route.params.file.file_description);
    const backListner = EventManager.addListener(
      'hardwareBackPress',
      cancelAction,
    );

    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS == 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      _keyboardDidShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS == 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      _keyboardDidHide,
    );
    return () => {
      backListner.removeListener();
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const saveValue = () => {
    if (file_title != fileTitle || description != fileDesc) {
      props?.route.params.done(
        props.route.params.file,
        file_title.trim(),
        description.trim(),
      );
    }
    Keyboard.dismiss();
    if (props.route.params.doNotReload) {
      props.route.params.doNotReload(true);
    }
    props.navigation.goBack();
  };

  const _keyboardDidShow = (e: any) => {
    setSupportView(e.endCoordinates.height - 30);
  };

  const _keyboardDidHide = (e: any) => {
    setSupportView(0);
  };

  const cancelAction = () => {
    if (file_title == fileTitle && description == fileDesc) {
      Keyboard.dismiss();
    if (props.route.params.doNotReload) {
      props.route.params.doNotReload(true);
    }
    props.navigation.goBack();
    } else {
      Alert.alert('Save changes?', `Do you want to save your changes?`, [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => {
            Keyboard.dismiss();
            props.navigation.goBack();
          },
        },
        {
          text: 'Yes',
          style: 'default',
          onPress: () => {
            saveValue();
          },
        },
      ]);
    }
  };

  const renderFileView = () => {
    let file = props.route.params.file;
    switch (file?.type) {
      case 'images':
        return (
          <View style={Styles.fileHolderContainer}>
            <View style={Styles.fileHolderSubContainer}>
              <Image
                source={{
                  uri: file.filePath ? file.filePath : file.thumbnail_url,
                }}
                style={Styles.placeholderImageStyle}
              />
            </View>
          </View>
        );
      case 'files':
        return (
          <View style={Styles.fileHolderContainer}>
            <View style={Styles.fileHolderSubContainer}>
              <Image
                source={pdf_icon}
                resizeMode={'contain'}
                style={{backgroundColor: Colors.transparent}}
              />
              <Image source={pdf_icon} style={Styles.pdfIconImageStyle}></Image>
            </View>
          </View>
        );
      case 'audios':
        return (
          <View style={Styles.audioContainer}>
            <TouchableOpacity
              onPress={() => {}}
              style={Styles.playButtonContainer}>
              <View style={Styles.playStyle} />
            </TouchableOpacity>
            <View style={Styles.durationContainer}>
              <Text
                style={Styles.fileNameTextStyle}
                numberOfLines={1}
                ellipsizeMode="tail">
                {file.title ? file.title : file.filename ? file.filename : ''}
              </Text>
              <Text style={Styles.durationTextStyle}>{file.duration}</Text>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={Styles.fullFlex}>
      <SafeAreaView style={Styles.emptySafeAreaStyle} />
      <SafeAreaView style={Styles.SafeAreaViewContainerStyle}>
        <View style={Styles.fullFlex}>
          <NavigationHeaderSafeArea
            heading={'Add Details'}
            cancelAction={() => cancelAction()}
            showRightText={true}
            createMemoryPage={true}
            rightText={'Done'}
            saveValues={saveValue}
          />
          {renderFileView()}
          <View style={[Styles.imagebuttonStyle, Styles.fullFlex]}>
            <TextInput
              style={Styles.titleTextInputStyle}
              placeholder="Enter title here..."
              placeholderTextColor={Colors.darkGray}
              multiline={true}
              numberOfLines={5}
              value={file_title}
              onChangeText={(text: any) => setFileTitle(text)}></TextInput>
            <TextInput
              style={Styles.descTextInputStyle}
              placeholder="Enter description..."
              placeholderTextColor={Colors.darkGray}
              onChangeText={(text: any) => setDescription(text)}
              value={description}
              onScroll={() => {}}
              multiline={true}></TextInput>
          </View>
          {Platform.OS == 'ios' && (
            <View style={[Styles.fullWidth, {height: supportView}]}></View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default FileDescription;
