import NetInfo from '@react-native-community/netinfo';
import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  ListRenderItemInfo,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import SearchBar from '../../common/component/SearchBar';
import Text from '../../common/component/Text';
import { Colors, fontSize, Size } from '../../common/constants';
import { Account, LoginStore, UserData } from '../../common/loginStore';
import InstanceView from './instanceView';

import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import loaderHandler from '../../common/component/busyindicator/LoaderHandler';
import MessageDialogue from '../../common/component/messageDialogue';
import { No_Internet_Warning, ToastMessage } from '../../common/component/Toast';
import Utility from '../../common/utility';
import { search_illustration } from '../../images';
import GetFormData from './getFormData';
import { GetInstances } from './reducer';
import Styles from './styles';

type Item = {
  InstanceID: string;
  InstanceName: string;
  InstanceURL: string;
  InstanceImageURL: string;
};

type State = { isSearching: boolean; searchText: string; selectedItem?: Item };
type FindProps = {
  request: { completed: boolean };
  end: Function;
  getAllInstances: Function;
  list: Item[];
  openLoginDrawer?: () => void;
};

class FindCommunity extends Component<FindProps, State> {
  state: State = {
    isSearching: false,
    searchText: '',
    selectedItem: null,
  };
  screenSize = Dimensions.get('screen');
  instanceList: UserData[] = [];
  connected: boolean = false;

  constructor(props: FindProps) {
    super(props);
  }

  componentDidMount() {
    this.getAll();
    // this.props.getAllInstances();

    /*const netInfo = useNetInfo();
    if(netInfo.isConnected && this.filteredList.length == 0){
      this.props.getAllInstances();
    }*/

    NetInfo.fetch().then(state => {
      this.connected = state.isConnected;
      if (state.isConnected && this.filteredList.length == 0) {
        this.props.getAllInstances();
      }
    });

    /*NetInfo.isConnected.addEventListener("connectionChange", (connected: boolean) => {
      this.connected = connected;
      if (connected && this.filteredList.length == 0) {
        this.props.getAllInstances();
      }
    });*/
  }

  getAll = async () => {
    try {
      let resp: any = await LoginStore.listAllAccounts();
      this.instanceList = resp.rows.raw() as Array<UserData>;
    } catch (err) { }
  };

  UNSAFE_componentWillReceiveProps(nextProps: FindProps) {
    if (this.props !== nextProps) {
      if (nextProps.request.completed) {
        this.getAll();
        this.props.end();
      }
    }
  }

  componentWillUnmount = () => {
    MessageDialogue.hideMessage();
  };
  get filteredList(): Item[] {
    // var ids = this.instanceList.filter((item: UserData) => (item.userAuthToken !== "" && item.instanceID != 2001)).map((item: UserData) => `${item.instanceID}`);
    // var list =
    // 	ids.length > 0
    // 		? this.props.list.filter((value: Item) => {
    // 				return ids.indexOf(value.InstanceID) == -1;
    // 		  })
    // 		: [...this.props.list];
    var list = this.props.list.filter((value: Item) => {
      return value.InstanceID != '2001' && value.InstanceID != '2002';
    });
    if (this.state.searchText.length == 0) {
      return [...list];
    } else {
      var copyList = [...list];
      let searchText = this.state.searchText.toLowerCase();
      return copyList.filter((item: Item) => {
        let name = item.InstanceName.toLowerCase();
        let email = item.InstanceURL.toLowerCase();
        return name.indexOf(searchText) == 0 || email.indexOf(searchText) != -1;
      });
    }
  }

  onItemSelect = (item: any) => {
    if (!item.is_fake) {
      MessageDialogue.hideMessage();
      if (Utility.isInternetConnected) {
        Account.tempData().values = {
          name: item.InstanceName,
          instanceID: parseInt(item.InstanceID),
          instanceImage:
            item.InstanceImageURL ||
            'https://admin.cueback.com/sites/default/files/gradcap_icon.png', //"https://facebook.github.io/react-native/docs/assets/favicon.png"
          instanceURL: item.InstanceURL.replace('https://', '').replace(
            'http://',
            '',
          ), //'192.168.2.6'
        };
        //loaderHandler.showLoader('Loading...');
        new GetFormData().callService('push', this.props.openLoginDrawer);
      } else {
        No_Internet_Warning();
      }
    } else {
      //ToastMessage('Sorry, that community is not activated',Colors.ErrorColor,false,true);
    }
  };
  render() {
    return (
      <SafeAreaView style={Styles.safeAreaViewContainer}>
        <StatusBar
          barStyle={
            Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'
          }
          backgroundColor={Colors.NewThemeColor}
        />
        {/* <TouchableHighlight onPress={() => Keyboard.dismiss()} underlayColor="#fff" style={{ width: "100%", flex: 1, alignItems: "center" }}> */}
        <View style={Styles.communityContainer}>
          <Text style={Styles.communitytext}>
            Search for your private community by organization or URL
          </Text>
          <SearchBar
            onChangeText={(text: string) => {
              this.setState({ searchText: text });
            }}
            onClearField={() => {
              this.setState({ searchText: '', isSearching: false });
            }}
            placeholder="Your community name"
            onFocus={() => {
              this.setState({ isSearching: true });
            }}
            onSearchButtonPress={() => { }}
            showCancelClearButton={false}
            style={{ backgroundColor: Colors.NewLightThemeColor }}
          />
          <View
            style={[
              Styles.communityListContainer,
              {
                width: this.screenSize.width,
                marginBottom:
                  60 +
                  (Platform.OS == 'ios' &&
                    StaticSafeAreaInsets.safeAreaInsetsBottom
                    ? StaticSafeAreaInsets.safeAreaInsetsBottom + 10
                    : 0),
              },
            ]}>
            {this.state.isSearching ? (
              <ListItems
                list={this.filteredList}
                onSelect={(item: Item) => this.onItemSelect(item)}
              />
            ) : (
              !this.state.selectedItem && (
                <View style={Styles.selectedItemStyle}>
                  <Image source={search_illustration} />
                </View>
              )
            )}
          </View>
        </View>
        {/* </TouchableHighlight> */}
      </SafeAreaView>
    );
  }
}
const mapState = (state: { [x: string]: any }) => ({
  request: state.requestInstances,
  list: state.intanceList.list,
});

const mapDispatch = (dispatch: Function) => ({
  getAllInstances: () => dispatch({ type: GetInstances.GetCall }),
  end: () => dispatch({ type: GetInstances.GetEnd }),
});

export default connect(mapState, mapDispatch)(FindCommunity);

class ListItems extends React.Component<{
  list: Item[];
  onSelect: (item: Item) => void;
}> {
  _renderItem = ({
    item: rowData,
    index,
  }: ListRenderItemInfo<Item>): React.ReactElement<any> => {
    let style = {};
    return (
      <TouchableHighlight
        underlayColor={Colors.white}
        onPress={() => {
          this.props.onSelect(rowData);
        }}>
        <InstanceView
          style={style}
          communityInfo={{
            name: rowData.InstanceName,
            instanceURL: rowData.InstanceURL.replace('https://', '').replace(
              'http://',
              '',
            ),
            instanceImage:
              rowData.InstanceImageURL ||
              'https://admin.cueback.com/sites/default/files/gradcap_icon.png',
          }}
        />
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <View
        style={Styles.findCommunityContainer}
        onMoveShouldSetResponder={() => false}
        onTouchStart={() => Keyboard.dismiss()}>
        <Text style={Styles.communitytext}>
          Select the community you want to log into or send a request to join
        </Text>
        <FlatList
          bounces={false}
          data={this.props.list}
          keyboardShouldPersistTaps={'handled'}
          onScroll={() => {
            Keyboard.dismiss();
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_: any, index: number) => `${index}`}
          renderItem={this._renderItem}
          // matchFieldName={'InstanceName'}
          extraData={this.props}
          ListEmptyComponent={() => (
            <View style={Styles.noCommunityContainer}>
              <Text style={Styles.noCommunity}>No Community Available</Text>
            </View>
          )}
        />
      </View>
    );
  }
}
