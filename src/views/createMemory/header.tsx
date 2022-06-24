import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  Alert,
  Keyboard,
} from 'react-native';
import Text from '../../common/component/Text';
import React from 'react';
import {Actions} from 'react-native-router-flux';
import {
  mindpopBarIcon,
  close_white,
  instanceLogo,
  profile_placeholder,
} from '../../images';
//@ts-ignore
import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors, fontSize} from '../../common/constants';
import NavigationHeader from '../../common/component/navigationHeader';
import {Account} from '../../common/loginStore';
import EventManager from '../../common/eventManager';

export const kShowHideMenu = 'show_or_hide_menu';
export const kSaveDraft = 'save_memory_draft';
import styles from './styles';

export default class CreateMemoryHeader extends React.Component<{
  [x: string]: any;
}> {
  _renderMiddle() {
    return (
      <View style={styles.titleContainernew}>
        <Text style={styles.name}>{Account.selectedData().name}</Text>
        <Text style={styles.titleText}>{this.props.title}</Text>
      </View>
    );
  }

  _closeAction = () => {
    Keyboard.dismiss();
    Actions.pop();
  };

  _renderRight() {
    return (
      <View style={styles.rightButtonsContainer}>
        <TouchableOpacity onPress={() => this.saveMemoryDraft()}>
          <Text
            style={styles.doneTextStyle}>
            Done
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.showHideMenu()}>
          <View
            style={styles.menuContainer}>
            <View
              style={styles.rowStyle}></View>
            <View
              style={styles.rowStyle}></View>
            <View
              style={styles.rowStyle}></View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  showHideMenu = () => {
    EventManager.callBack(kShowHideMenu);
  };

  saveMemoryDraft = () => {
    EventManager.callBack(kSaveDraft);
  };
  render() {
    let showClose: boolean = this.props.showClose
      ? this.props.showClose
      : false;
    return (
      <NavigationHeader backgroundColor={Colors.ThemeColor}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.NewThemeColor}
        />
        <TouchableOpacity
          style={styles.leftButtonTouchableContainer}
          onPress={() => {
            this._closeAction();
          }}>
          <View style={styles.closeButton}>
            <Image source={close_white} />
          </View>
        </TouchableOpacity>
        {this._renderMiddle()}
        {this._renderRight()}
      </NavigationHeader>
    );
  }
}
