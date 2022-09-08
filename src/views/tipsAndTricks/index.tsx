import React from 'react';
import {
  Image, Keyboard, Platform, SafeAreaView, StatusBar, TouchableOpacity, View
} from 'react-native';
import Text from '../../common/component/Text';
import { Colors, fontFamily, fontSize } from '../../common/constants';
import Utility from '../../common/utility';
import { backBtn } from '../../images';
import Styles from './styles';

export default class TipsAndTricks extends React.Component<{[x: string]: any}> {
  static navigationOptions = ({}: {
    navigation: {getParam: (param: string) => () => void};
  }) => {
    return {
      headerStyle: Styles.headerStyle,
      headerTintColor: Colors.white,
      headerLeft: (
        <View style={Styles.headerLeftContainer}>
          <TouchableOpacity
            style={Styles.backbutton}
            onPress={() => {
              Keyboard.dismiss();
              this.props.navigation.goBack();
            }}>
            <Image source={backBtn} />
          </TouchableOpacity>
          <Text style={Styles.tips}>Tips and Tricks</Text>
        </View>
      ),
    };
  };

  render() {
    return (
      <SafeAreaView style={Styles.container}>
        <StatusBar
          barStyle={
            Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
          }
          backgroundColor={Colors.NewDarkThemeColor}
        />
      </SafeAreaView>
    );
  }
}
