import React from 'react';
import {Image, Keyboard, StatusBar, TouchableOpacity, View} from 'react-native';

import Text from '../../common/component/Text';
import {close_white} from '../../images';
//@ts-ignore
import NavigationHeader from '../../common/component/navigationHeader';
import {Colors} from '../../common/constants';
import EventManager from '../../common/eventManager';
import {Account} from '../../common/loginStore';
import styles from './styles';

export const kShowHideMenu = 'show_or_hide_menu';
export const kSaveDraft = 'save_memory_draft';

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
    this.props.navigation.goBack();
  };

  _renderRight() {
    return (
      <View style={styles.rightButtonsContainer}>
        <TouchableOpacity onPress={() => this.saveMemoryDraft()}>
          <Text style={styles.doneTextStyle}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.showHideMenu()}>
          <View style={styles.menuContainer}>
            <View style={styles.rowStyle}></View>
            <View style={styles.rowStyle}></View>
            <View style={styles.rowStyle}></View>
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
