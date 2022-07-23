import React, { Component } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { warning_icon } from '../../../images';
import TextNew from '../Text';
import styles from './styles';
export default class NoInternetView extends Component<{ tryAgain: () => void }> {
  render() {
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
            this.props.tryAgain();
          }}>
          <TextNew
            style={styles.tryAgainTextStyle}>
            Try Again
          </TextNew>
        </TouchableOpacity>
      </View>
    );
  }
}
