import React from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Keyboard,
  Platform,
} from 'react-native';
import Text from '../../common/component/Text';
import {Actions} from 'react-native-router-flux';
import {backBtn} from '../../images';
import {Colors, fontSize} from '../../common/constants';

export default class TipsAndTricks extends React.Component<{[x: string]: any}> {
  static navigationOptions = ({
    navigation,
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
              color: '#fff',
              ...fontSize(18),
              fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
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
          barStyle={'dark-content'}
          backgroundColor={Colors.NewDarkThemeColor}
        />
      </SafeAreaView>
    );
  }
}
