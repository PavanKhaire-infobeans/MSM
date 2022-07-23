import React from 'react';
import {
  Image, Keyboard, Platform, SafeAreaView, StatusBar, TouchableOpacity, View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Text from '../../common/component/Text';
import { Colors, fontFamily, fontSize } from '../../common/constants';
import Utility from '../../common/utility';
import { backBtn } from '../../images';

export default class TipsAndTricks extends React.Component<{[x: string]: any}> {
  static navigationOptions = ({
  }: {
    navigation: {getParam: (param: string) => () => void};
  }) => {
    return {
      headerStyle: {
        backgroundColor: Colors.ThemeColor,
        height: 54,
        paddingTop: 1,
      },
      headerTintColor: '#fff',
      headerLeft: (
        <View
          style={{
            width: 158,
            marginLeft: 8,
            height: 44,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'flex-end',
          }}>
          <TouchableOpacity
            style={{
              width: 50,
              marginLeft: 6,
              bottom: -2,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              Keyboard.dismiss();
              Actions.pop();
            }}>
            <Image source={backBtn} />
          </TouchableOpacity>
          <Text
            style={{
              color: Colors.white,
              ...fontSize(18),
              fontWeight:'600',
              fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.IntersemiBold,
              marginLeft: 30,
              marginBottom: 8,
            }}>
            Tips and Tricks
          </Text>
        </View>
      ),
    };
  };

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.NewThemeColor,
        }}>
        <StatusBar
          barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
          backgroundColor={Colors.NewDarkThemeColor}
        />
      </SafeAreaView>
    );
  }
}
