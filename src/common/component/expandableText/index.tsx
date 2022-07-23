import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import Text from '../../component/Text';
//@ts-ignore
import styles from './styles';

type Props = {
  text: string;
  onPress: (event: any) => void;
  style?: ViewStyle;
};

export const ExpandableTextView = (props: Props) => {
  //   if (Platform.OS === 'ios') {
  var customStyle = props.style || {};
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.button, customStyle]}>
      <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  );
  //   }
};
