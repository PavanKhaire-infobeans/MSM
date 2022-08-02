import React from 'react';

import { Image, View } from 'react-native';

import {
  registrationGreenDark,
  registrationGreenLight, registrationOrangeDark,
  registrationOrangeLight
} from '../../images';
import Styles from './styles';

export default class RegistrationBackground extends React.Component {
  render() {
    return (
      <View style={Styles.RegistrationBackground}>
        <Image
          style={Styles.darkImage}
          resizeMode="cover"
          source={registrationOrangeDark}
        />

        <Image
          style={Styles.lightImage}
          resizeMode="cover"
          source={registrationOrangeLight}
        />

        <Image
          style={Styles.greenDarkImage}
          resizeMode="cover"
          source={registrationGreenDark}
        />

        <Image
          style={Styles.greenlinghtImg}
          resizeMode="cover"
          source={registrationGreenLight}
        />
      </View>
    );
  }
}
