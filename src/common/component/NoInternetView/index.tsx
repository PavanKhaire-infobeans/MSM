import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { warning_icon } from '../../../images';
import TextNew from '../Text';
import styles from './styles';
const NoInternetView = (props: { tryAgain: () => void }) => {
  return (
    <View
      style={styles.container}>
      <Image
        style={styles.marginBottomImageStyle}
        source={warning_icon}
        resizeMode="contain"
      />
      <TextNew
        style={styles.noInternetTextStyle}>
        No internet connection available
      </TextNew>
      <TextNew
        style={styles.normalTextStyle}>
        Please make sure your device is connected to the internet
      </TextNew>
      <TouchableOpacity
        onPress={() => {
          props.tryAgain();
        }}>
        <TextNew
          style={styles.tryAgainTextStyle}>
          Try Again
        </TextNew>
      </TouchableOpacity>
    </View>
  );
}
export default NoInternetView;