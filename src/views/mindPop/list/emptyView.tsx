import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {SubmitButton} from '../../../common/component/button';
import Text from '../../../common/component/Text';
import {Size} from '../../../common/constants';
import {emptyMindPop as EmptyMindPop} from '../../../images';
import Styles from './styles';

const bottomPadding = DeviceInfo.isTablet ? 55 : 46;

const EmptyView = props => {
  const navigation = useNavigation();

  return (
    <View style={Styles.emptyViewContainer}>
      <Text style={Styles.noMindpop}>{'Currently there are no MindPops.'}</Text>
      <View
        style={[
          Styles.emptyMindpop,
          {
            paddingBottom: bottomPadding,
          },
        ]}>
        <Image source={EmptyMindPop} style={{alignSelf: 'center'}} />
        <Text style={Styles.whataremindpopText}>{'What are MindPops?'}</Text>
        <Text style={Styles.mindpopdesc}>
          {
            'MindPops are inklings of memories that suddenly pop into your head.Quickly jot them down to write about later.'
          }
        </Text>
        <SubmitButton
          style={{width: Size.byWidth(246)}}
          text="Create a MindPop"
          onPress={() => {
            props.resetEdit();
            navigation.navigate('mindPopEdit', {
              updateList: props.updateList,
              updatePrev: () => {
                props.navigation.goBack();
              },
              navigation,
            });
          }}
        />
      </View>
    </View>
  );
};

export default EmptyView;
