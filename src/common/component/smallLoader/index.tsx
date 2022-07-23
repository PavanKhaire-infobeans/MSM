import React from 'react';
import {
  View,
  ActivityIndicator,
} from 'react-native';
import Text from '../Text';
import { Colors } from '../../constants';
import style from './styles';

type Props = { [x: string]: any };
export default class SmallLoader extends React.Component<Props> {
  render() {
    return (
      <View
        style={style.container}>
        <ActivityIndicator
          color={Colors.black}
          size="large"
          style={style.progressBar}
        />

        <Text style={style.loadingTextStyle}>{'Loading'}</Text>

      </View>
    );
  }
}


