import React, { Component } from 'react';
import { Image, Platform, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Actions } from 'react-native-router-flux';
import { SubmitButton } from '../../../common/component/button';
import Text from '../../../common/component/Text';
import { Colors, fontFamily, fontSize, Size } from '../../../common/constants';
import { emptyMindPop as EmptyMindPop } from '../../../images';
import Styles from './styles';

export default class EmptyView extends Component<{
  resetEdit: Function;
  updateList: Function;
}> {
  bottomPadding = DeviceInfo.isTablet ? 55 : 46;
  render() {
    return (
      <View
        style={Styles.emptyViewContainer}>
        <Text
          style={Styles.noMindpop}>
          {' '}
          Currently there are no MindPops.{' '}
        </Text>
        <View
          style={[Styles.emptyMindpop, {
            paddingBottom: this.bottomPadding,
          }]}>
          <Image source={EmptyMindPop} style={{ alignSelf: 'center' }} />
          <Text
            style={Styles.whataremindpopText}>
            What are MindPops?
          </Text>
          <Text
            style={Styles.mindpopdesc}>
            MindPops are inklings of memories that suddenly pop into your head.
            Quickly jot them down to write about later.
          </Text>
          <SubmitButton
            style={{ width: Size.byWidth(246) }}
            text="Create a MindPop"
            onPress={() => {
              this.props.resetEdit();
              Actions.mindPopEdit({ updateList: this.props.updateList });
            }}
          />
        </View>
      </View>
    );
  }
}
