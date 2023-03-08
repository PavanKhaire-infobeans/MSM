import React, {useEffect} from 'react';
import {Platform, SafeAreaView, StatusBar, View} from 'react-native';
// @ts-ignore
import analytics from '@react-native-firebase/analytics';
import CustomAlert from '../../common/component/customeAlert';
import {Colors, MyMemoriesTapBarOptions} from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import MemoryDrafts from './MemoryDrafts/index';

const MyMemoriesContainer = props => {
  useEffect(() => {
    const screenLog = async () => {
      await analytics().logScreenView({
        screen_name: "MemoryDrafts",
        screen_class: "MemoryDrafts",
      });
    };
    screenLog();
    const backListner = EventManager.addListener('hardwareBackPress', _onBack);
    return () => {
      backListner.removeListener();
    };
  }, []);

  const _onBack = () => {
    //loaderHandler.hideLoader();
  };

  const showMemoryActionAlert = (title, message) => {
    return (
      <CustomAlert
        modalVisible={true}
        title={title}
        message={message}
        buttons={[
          {
            text: Platform.OS === 'android' ? 'GREAT!' : 'Great!',
            func: () => {},
          },
        ]}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={{
          width: '100%',
          flex: 0,
          backgroundColor: Colors.NewThemeColor,
        }}
      />
      <SafeAreaView
        style={{
          width: '100%',
          flex: 111111111111111,
          backgroundColor: '#fff',
        }}>
        <View style={{flex: 1}}>
          <StatusBar
            barStyle={
              Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
            }
            backgroundColor={Colors.NewThemeColor}
          />
          <MemoryDrafts
            tabLabel={MyMemoriesTapBarOptions.drafts}
            fromDeepLink={props.fromDeepLink}
            navigation={props.navigation}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default MyMemoriesContainer;
