import React, { Component } from 'react';
import { Image, Platform, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Actions } from 'react-native-router-flux';
import { SubmitButton } from '../../../common/component/button';
import Text from '../../../common/component/Text';
import { Colors, fontFamily, fontSize, Size } from '../../../common/constants';
import { emptyMindPop as EmptyMindPop } from '../../../images';

export default class EmptyView extends Component<{
  resetEdit: Function;
  updateList: Function;
}> {
  bottomPadding = DeviceInfo.isTablet ? 55 : 46;
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{paddingTop: 30, color: Colors.TextColor, ...fontSize(18)}}>
          {' '}
          Currently there are no MindPops.{' '}
        </Text>
        <View
          style={{
            alignItems: 'center',
            padding: 15,
            paddingBottom: this.bottomPadding,
          }}>
          <Image source={EmptyMindPop} style={{alignSelf: 'center'}} />
          <Text
            style={{
              padding: 20,
              paddingTop: 22,
              paddingBottom: 8,
              textAlign: 'center',
              ...fontSize(18),
              fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.IntersemiBold,
              fontWeight:'600',
              color: Colors.TextColor,
            }}>
            What are MindPops?
          </Text>
          <Text
            style={{
              textAlign: 'center',
              paddingBottom: 24,
              ...fontSize(18),
              fontWeight: '400',
              color: Colors.TextColor,
            }}>
            MindPops are inklings of memories that suddenly pop into your head.
            Quickly jot them down to write about later.
          </Text>
          <SubmitButton
            style={{width: Size.byWidth(246)}}
            text="Create a MindPop"
            onPress={() => {
              this.props.resetEdit();
              Actions.mindPopEdit({updateList: this.props.updateList});
            }}
          />
        </View>
      </View>
    );
  }
}
