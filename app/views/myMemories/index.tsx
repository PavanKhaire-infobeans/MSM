import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import Text from './../../../src/common/component/Text';
// @ts-ignore
import ScrollableTabView from './../../../src/common/component/ScrollableTabView';
import {
  Colors,
  MyMemoriesTapBarOptions,
  fontSize,
  fontFamily,
} from './../../../src/common/constants';
import MemoryDrafts from './MemoryDrafts/index';
import PublishedMemory from './PublishedMemory/index';
import EventManager from './../../../src/common/eventManager';
import loaderHandler from './../../../src/common/component/busyindicator/LoaderHandler';
import Activities from './Activities';
// import NavigationBar from '../dashboard/NavigationBar';
import {TabItems} from './../../../src/common/component/TabBarIcons';
import NavigationBar from '../../../src/views/dashboard/NavigationBar';
import Utility from '../../../src/common/utility';
import styles from './styles';

type Props = {[x: string]: any};

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

  componentDidMount() {}

  componentWillReceiveProps() {
    if (this.props.isFromMenu) {
      setTimeout(() => this.scrollableTabView.goToPage(1), 300);
    }
  }

  _onBack = () => {
    loaderHandler.hideLoader();
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
              ref={(ref: any) => {
                this.scrollableTabView = ref;
              }}
              style={{width: '100%'}}
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
