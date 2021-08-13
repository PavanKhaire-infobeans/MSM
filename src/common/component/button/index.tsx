import React from 'react';
import { TouchableOpacity, ViewStyle, Platform } from 'react-native';
import Text from '../../component/Text';
//@ts-ignore
import EStyleSheet from 'react-native-extended-stylesheet';
import { Size, Colors, fontSize } from '../../constants';

//80B762
const styles = EStyleSheet.create({
  $buttonColor: Colors.NewTitleColor,
  $buttonTextColor: '#ffffff',
  $buttonUnderlayColor: '#01B732',
  button: {
    marginTop: Size.byWidth(16),
    width: '100%',
    height: Size.byWidth(48),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Size.byWidth(5),
    backgroundColor: "$buttonColor"
  },

  text: {
    color: '$buttonTextColor',
    fontWeight : Platform.OS === "ios"? '500':'bold',
    ...fontSize(Size.byWidth(18)),
    textAlign: 'center',
  },
});

type Props = {
  text: string, onPress: (event: any) => void,
  style?: ViewStyle
}

export const SubmitButton = (props: Props) => {
  //   if (Platform.OS === 'ios') {
  var customStyle = props.style || {}
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.button, customStyle]}
    >
      <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  );
  //   } 
}

