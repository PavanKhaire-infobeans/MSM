import React from 'react';
import { Image, View, Platform, Text, Dimensions, Alert } from 'react-native';
//@ts-ignore
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  add_content,
  all_memories_selected,
  all_memories_unselected,
  more_options_selected,
  more_options_unselected,
  my_memories_selected,
  my_memories_unselected,
  notification_selected_active,
  notification_selected,
  notification_unselected,
  notification_unselected_active,
  prompts_selected,
  prompts_nonselected,
} from '../../images';
import { book, write } from '../../../app/images';
import { fontSize, Colors, constant, fontFamily } from '../constants';
import EventManager from '../eventManager';
import style from './styles';
import { Account } from '../loginStore';

export enum TabItems {
  AllMemories = 'All Memories',
  MyMemories = 'My Memories',
  AddContent = 'Add Content',
  Prompts = 'Prompts',
  //Notifications = "Notifications",
  MoreOptions = 'More Options',
}

export enum NewTabItems {
  Read = 'Read',
  Write = 'Write',
}

export const kNotificationIndicator = 'notificationIndicators';
export default class TabIcon extends React.Component<{ [x: string]: any }> {
  eventListener: EventManager;
  screenSize = Dimensions.get('screen');
  title = 'Notifications';
  key = Account.selectedData().instanceID + '_' + Account.selectedData().userID;
  constructor(props: any) {
    super(props);
    //  this.eventListener = EventManager.addListener(kNotificationIndicator, this.changeNotification)
  }

  changeNotification = (showIcon: boolean) => {
    // Alert.alert("show..Icon.."+ showIcon);
    // this.isNotification = showIcon;
  };

  render() {
    var img = this.props.focused
      ? all_memories_selected
      : all_memories_unselected;
    // var textColor = "#000000ff"
    var textColor = Colors.bordercolor;
    let paddingTop = 0;
    let font = 19;
    switch (this.props.title || this.title) {
      case TabItems.AllMemories:
        if (this.props.focused) {
          img = all_memories_selected;
          textColor = Colors.TextColor;
        } else {
          img = all_memories_unselected;
        }
        break;

      case TabItems.MyMemories:
        if (this.props.focused) {
          img = my_memories_selected;
          textColor = Colors.TextColor;
        } else {
          img = my_memories_unselected;
        }
        break;

      case TabItems.AddContent:
        img = add_content;
        if (this.props.focused) {
          textColor = Colors.TextColor;
        }
        break;

      case TabItems.Prompts:
        paddingTop = 4;
        if (this.props.focused) {
          img = prompts_selected;
          textColor = Colors.TextColor;
        } else {
          img = prompts_nonselected;
        }
        break;

      case TabItems.MoreOptions:
        paddingTop = 2;
        if (this.props.focused) {
          img = more_options_selected;
          textColor = Colors.TextColor;
        } else {
          img = more_options_unselected;
        }
        break;

      case NewTabItems.Read:
        if (this.props.focused) {
          img = all_memories_selected;
          textColor = Colors.TextColor;
        } else {
          img = all_memories_unselected;
        }
        break;

      case NewTabItems.Write:
        if (this.props.focused) {
          img = my_memories_selected;
          textColor = Colors.TextColor;
        } else {
          img = my_memories_unselected;
        }
        break;

      default:
        break;
    }

    return (
      <View style={[style.container,{
        borderTopLeftRadius: this.props.title == 'Read' ? 14 : 0,
        borderBottomLeftRadius: this.props.title == 'Read' ? 14 : 0,
        borderTopRightRadius: this.props.title == 'Write' ? 14 : 0,
        borderBottomRightRadius: this.props.title == 'Write' ? 14 : 0,
      }]}>

        <View
          style={[style.subContainer,{
            borderWidth: this.props.focused ? 1 : 0,
            borderBottomColor: this.props.focused ? Colors.bordercolor : Colors.transparent,
            backgroundColor: this.props.focused ? Colors.white : Colors.bottomTabColor,
          }]}>

          {this.props.title != TabItems.AddContent && (
            <>
              <Text
                style={[style.titleTextStyle,{
                  ...fontSize(font),
                  color: this.props.focused ? Colors.bordercolor : Colors.newTextColor,
                }]}>
                {this.props.title}
              </Text>
              {
                this.props.focused ?
                  <Image source={this.props.title == 'Write' ? write : book} />
                  :
                  null
              }
            </>
          )}
        </View>
        {/* <View
          style={{
            height: 100,
            position: 'absolute',
            bottom: -100,
            width: '100%',
          }}></View> */}
      </View>
    );
  }
}
