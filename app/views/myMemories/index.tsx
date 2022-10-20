import React from 'react';
import {
  Platform, SafeAreaView, StatusBar, View
} from 'react-native';
// @ts-ignore
import loaderHandler from './../../../src/common/component/busyindicator/LoaderHandler';
import ScrollableTabView from './../../../src/common/component/ScrollableTabView';
import {
  Colors, fontFamily, fontSize, MyMemoriesTapBarOptions
} from './../../../src/common/constants';
import EventManager from './../../../src/common/eventManager';
import Activities from './Activities';
import MemoryDrafts from './MemoryDrafts/index';
import PublishedMemory from './PublishedMemory/index';
// import NavigationBar from '../dashboard/NavigationBar';
import Utility from '../../../src/common/utility';
import NavigationBar from '../../../src/views/dashboard/NavigationBar';
import { TabItems } from './../../../src/common/component/TabBarIcons';
import styles from './styles';

type Props = {[x: string]: any};

export default class MyMemoriesContainer extends React.Component<Props> {
  backListner: EventManager;
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

  componentWillUnmount() {
    this.backListner.removeListener()
  }

  UNSAFE_componentWillReceiveProps() {
    if (this.props.isFromMenu) {
      setTimeout(() => this.scrollableTabView.goToPage(1), 300);
    }
  }

  _onBack = () => {
    //loaderHandler.hideLoader();
  };

  render() {
    return (
      <View style={styles.scene}>
        <SafeAreaView
          style={styles.container}>
          <View style={styles.scene}>
            <NavigationBar title={TabItems.MyMemories} />
            <StatusBar
              barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
              backgroundColor={Colors.NewThemeColor}
            />
            <ScrollableTabView
              nestedScrollEnabled={true} overScrollMode='always'
              ref={(ref: any) => {
                this.scrollableTabView = ref;
              }}
              style={{width: '100%', flex: 1,}}
              locked={Platform.OS == 'ios' ? false : true}
              tabBarBackgroundColor={Colors.NewThemeColor}
              tabBarTextStyle={{...fontSize(16), fontFamily: fontFamily.Inter}}
              tabBarActiveTextColor={Colors.newTextColor}
              tabBarInactiveTextColor={Colors.backColorWith75OPacity}
              tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
              initialPage={1}>
              <PublishedMemory tabLabel={MyMemoriesTapBarOptions.published} />
              <MemoryDrafts tabLabel={MyMemoriesTapBarOptions.drafts} fromDeepLink={this.props.fromDeepLink}/>
              <Activities tabLabel={MyMemoriesTapBarOptions.activity} />
            </ScrollableTabView>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

