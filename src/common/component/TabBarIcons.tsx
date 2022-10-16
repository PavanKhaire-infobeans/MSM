import React from 'react';
import { Dimensions, Image, Text, TouchableHighlight, View } from 'react-native';
//@ts-ignore
import { book, write } from '../../../app/images';
import {
  add_content,
  all_memories_selected,
  all_memories_unselected,
  more_options_selected,
  more_options_unselected,
  my_memories_selected,
  my_memories_unselected, prompts_nonselected, prompts_selected
} from '../../images';
import { Colors } from '../constants';
import EventManager from '../eventManager';
import { Account } from '../loginStore';
import style from './styles';

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
      <TouchableHighlight
        underlayColor={Colors.bottomTabColor}
        style={[style.container, {
          borderTopLeftRadius: this.props.title == 'Read' ? 14 : 0,
          borderBottomLeftRadius: this.props.title == 'Read' ? 14 : 0,
          borderTopRightRadius: this.props.title == 'Write' ? 14 : 0,
          borderBottomRightRadius: this.props.title == 'Write' ? 14 : 0,
        }]}
        onPress={() => {
          if (this.props.title == 'Read') {
            this.props.navigation.replace('dashBoard')
          }
          else if (this.props.title == 'Write') {
            this.props.navigation.replace('writeTabs')
          }
        }}
      >

        <View
          style={[style.subContainer, {
            borderWidth: this.props.focused ? 1 : 0,
            borderBottomColor: this.props.focused ? Colors.bordercolor : Colors.transparent,
            backgroundColor: this.props.focused ? Colors.white : Colors.bottomTabColor,
          },
          this.props.focused ?
            style.shadowBox
            :
            {}]}>

          {this.props.title != TabItems.AddContent && (
            <>
              <Text
                style={[style.titleTextStyle, {
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

      </TouchableHighlight>
    );
  }
}
