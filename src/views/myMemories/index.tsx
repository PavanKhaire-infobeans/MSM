import React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
// @ts-ignore
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import CustomAlert from '../../common/component/customeAlert';
import {
  Colors,
  fontFamily,
  MyMemoriesTapBarOptions,
} from '../../common/constants';
import EventManager from '../../common/eventManager';
import Utility from '../../common/utility';
import MemoryDrafts from './MemoryDrafts/index';
type Props = {[x: string]: any};

const FirstRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#ff4081'}]} />
);
const SecondRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#673ab7'}]} />
);

export default class MyMemoriesContainer extends React.Component<Props> {
  backListner: any;
  scrollableTabView: any;
  state = {
    index: 0,
    routes: [
      {key: 'first', title: 'First'},
      {key: 'second', title: 'Second'},
    ],
  };
  constructor(props: Props) {
    super(props);
    this.backListner = EventManager.addListener(
      'hardwareBackPress',
      this._onBack,
    );
  }

  UNSAFE_componentWillReceiveProps() {
    if (this.props.isFromMenu) {
      setTimeout(() => this.scrollableTabView.goToPage(1), 300);
    }
  }

  _onBack = () => {
    loaderHandler.hideLoader();
  };

  showMemoryActionAlert = (title, message) => {
    return (
      <CustomAlert
        modalVisible={true}
        // setModalVisible={setModalVisible}
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

  render() {
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
            {/* <NavigationBar title={TabItems.MyMemories} /> */}
            <StatusBar
              barStyle={
                Utility.currentTheme == 'light'
                  ? 'dark-content'
                  : 'light-content'
              }
              backgroundColor={Colors.NewThemeColor}
            />
            {/* <ScrollableTabView
              ref={(ref: any) => {
                this.scrollableTabView = ref;
              }}
              style={{width: '100%'}}
              locked={Platform.OS == 'ios' ? false : true}
              tabBarBackgroundColor={Colors.NewThemeColor}
              tabBarTextStyle={{...fontSize(16), fontFamily: 'Rubik'}}
              tabBarActiveTextColor={Colors.TextColor}
              tabBarInactiveTextColor="rgba(0.216, 0.22, 0.322, 0.75)"
              tabBarUnderlineStyle={{
                backgroundColor: Colors.TextColor,
                height: 2,
              }}
              initialPage={1}> */}
            {/* <PublishedMemory tabLabel={MyMemoriesTapBarOptions.published} /> */}
            <MemoryDrafts
              tabLabel={MyMemoriesTapBarOptions.drafts}
              fromDeepLink={this.props.fromDeepLink}
              navigation={this.props.navigation}
            />
            {/* <Activities tabLabel={MyMemoriesTapBarOptions.activity} /> */}
            {/* </ScrollableTabView> */}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});
