import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import Text from '../../common/component/Text';
// @ts-ignore
import ScrollableTabView from '../../common/component/ScrollableTabView';
import {
  Colors,
  MyMemoriesTapBarOptions,
  fontSize,
  fontFamily,
} from '../../common/constants';
import MemoryDrafts from './MemoryDrafts/index';
import PublishedMemory from './PublishedMemory/index';
import EventManager from '../../common/eventManager';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import Activities from './Activities';
import NavigationBar from '../dashboard/NavigationBar';
import {TabItems} from '../../common/component/TabBarIcons';
import Utility from '../../common/utility';
import CustomAlert from '../../common/component/customeAlert';
import { ListType } from '../dashboard/dashboardReducer';
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

  componentWillReceiveProps() {
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
        android={{
          container: {
            backgroundColor: '#ffffff'
          },
          title: {
            color: Colors.black,
            fontFamily: "SF Pro Text",
            fontSize: 17,
            fontWeight: '600',
            lineHeight: 22
          },
          message: {
            color: Colors.black,
            // fontFamily: fontFamily.Inter,
            fontSize: 16,
            fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
            fontWeight: '500',
          },
        }}
        ios={{
          container: {
            backgroundColor: '#D3D3D3'
          },
          title: {
            color: Colors.black,
            // fontFamily: fontFamily.Inter,
            lineHeight: 22,
            fontSize: 17,
            fontWeight: '600',
          },
          message: {
            color: Colors.black,
            // fontFamily: fontFamily.Inter,
            fontSize: 13,
            lineHeight: 18,
            fontWeight: '400',
          },
        }}
        buttons={[
          {
            text:  Platform.OS==='android'?'GREAT!':'Great!',
            func: () => {

            },
            styles: {
              lineHeight: 22,
              fontSize: 17,
              fontWeight: '600',
            }
          }
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
              barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
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
              <MemoryDrafts tabLabel={MyMemoriesTapBarOptions.drafts} fromDeepLink={this.props.fromDeepLink}/>
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
