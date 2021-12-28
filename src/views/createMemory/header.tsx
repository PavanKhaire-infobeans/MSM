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
const styles = EStyleSheet.create({
  name: {
    color: '#fff',
    ...fontSize(10),
    lineHeight: 15,
    textAlign: 'left',
    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
  },
  titleText: {
    color: '#fff',
    ...fontSize(18),
    lineHeight: 20,
    textAlign: 'left',
    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
  },

  titleContainer: {justifyContent: 'center', paddingTop: 10},

  leftButtonTouchableContainer: {
    justifyContent: 'center',
    padding: 15,
    marginTop: 5,
  },

  leftButtonContainer: {
    backgroundColor: 'transparent',
    borderColor: '#ffffff',
    borderWidth: 2,
    height: 28,
    width: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftCrossButtonContainer: {
    backgroundColor: Colors.NewRadColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftButtonLogo: {width: 20, height: 20},

  rightButtonsContainer: {
    flex: 1,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  rightButtonsTouchable: {padding: 5, paddingRight: 10},

  avatar: {height: 30, width: 30, borderRadius: 15, alignContent: 'center'},

  rightButtonsBackgroundImage: {width: 30, height: 30},

  rightButtonsBadge: {
    position: 'absolute',
    height: 12,
    width: 12,
    right: 5,
    top: 5,
    backgroundColor: '#ff0000',
    borderColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 8,
    alignContent: 'center',
  },

  rightButtonsBadgeText: {...fontSize(10), color: '#ffffff'},
});

export default class CreateMemoryHeader extends React.Component<{
  [x: string]: any;
}> {
  _renderMiddle() {
    return (
      <View style={styles.titleContainer}>
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
            style={{
              fontStyle: 'normal',
              fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
              lineHeight: 20,
              ...fontSize(16),
              padding: 10,
              color: 'white',
            }}>
            Done
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.showHideMenu()}>
          <View
            style={{
              justifyContent: 'space-between',
              height: '100%',
              width: 30,
              padding: 15,
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                height: 4,
                width: 4,
                borderRadius: 2,
              }}></View>
            <View
              style={{
                backgroundColor: 'white',
                height: 4,
                width: 4,
                borderRadius: 2,
              }}></View>
            <View
              style={{
                backgroundColor: 'white',
                height: 4,
                width: 4,
                borderRadius: 2,
              }}></View>
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
