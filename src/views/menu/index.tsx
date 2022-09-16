import React from 'react';
import {
  Alert,
  DeviceEventEmitter,
  EmitterSubscription,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../../common/component/Text';
import {Colors, fontSize, Size} from '../../common/constants';
import {Account, LoginStore, UserData} from '../../common/loginStore';
import styles from './styles';
import {connect} from 'react-redux';
import EventManager from '../../common/eventManager';
import {logoutMethod, logoutMultiple} from '../../common/webservice/webservice';
import {user_drawable} from '../../images';
import {UserAccount} from './reducer';

type MenuProps = {
  user: UserData;
  setUser: (payload: UserData) => void;
};
const kOnLogout = 'UserLogoutListener';
export const kLogoutPressed = 'logoutPressed';
export const kUserAccountUpdated = 'userAccountUpdated';
class Menu extends React.Component<MenuProps> {
  state: {list: any} = {
    list: [],
  };
  listener?: EmitterSubscription;
  onlogout?: EventManager;
  logoutPressed?: EventManager;
  userEmail = '';
  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('logout', this.updateUser);
    this.onlogout = EventManager.addListener(kOnLogout, this.afterLogout);
    this.logoutPressed = EventManager.addListener(kLogoutPressed, this._logout);
    LoginStore.listAllAccounts()
      .then((resp: any) => {
        let list = resp.rows.raw();
        this.setState({
          list: list.filter((it: UserData) => it.userAuthToken != ''),
        });
      })
      .catch(() => {
        //showConsoleLog(ConsoleType.LOG,err);
      });
  }

  componentWillUnmount() {
    this.onlogout.removeListener();
    DeviceEventEmitter.removeAllListeners('logout');
    this.logoutPressed?.removeListener();
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.communitiesContainer}>
          <Text style={styles.communityText}>Your communities</Text>
          {/* {false ? (
            <TouchableOpacity
              style={{
                height: 45,
                paddingLeft: 10,
                paddingRight: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ color: Colors.NewTitleColor, ...fontSize(16) }}>
                Edit
              </Text>
            </TouchableOpacity>
          ) : null} */}
        </View>
        <FlatList
          data={[...this.state.list, {type: 'AddCommunity'}]}
          keyExtractor={(_: any, index: number) => `${index}`}
          keyExtractor={(_, index: number) => `${index}`}
          renderItem={this.renderRow}
        />
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            onPress={() => this._logout()}
            style={styles.logoutbutton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  updateUser = ({accounts, user}: {accounts: UserData[]; user: UserData}) => {
    this.setState({list: accounts}, () => {
      this.props.setUser(user);
      this.props.navigation.reset({index: 0, routes: [{name: 'dashBoard'}]});
    });
  };

  _logout = () => {
    LoginStore.listAllAccounts()
      .then((resp: any) => {
        let list = resp.rows.raw();
        list = list.filter((it: UserData) => it.userAuthToken != '');
        if (list.length > 1) {
          this.props.navigation.navigate('commonInstanceListsSelection', {
            listAccounts: list,
            title: 'Logout',
            type: 'logout',
            onClick: logoutWorkFlow,
          });
        } else {
          Alert.alert('', `Are you sure you want to log out ?`, [
            {
              text: 'No',
              style: 'cancel',
              onPress: () => {},
            },
            {
              text: 'Yes',
              style: 'default',
              onPress: () => {
                logoutMethod()
                  .then((resp: any) => {
                    let list = resp.rows.raw();
                    var accounts = list.filter(
                      (it: UserData) => it.userAuthToken != '',
                    );
                    if (accounts.length > 0) {
                      EventManager.callBack(kOnLogout, accounts);
                    } else {
                      this.props.navigation.reset({
                        index: 0,
                        routes: [{name: 'prologue'}],
                      });
                    }
                  })
                  .catch(() => {
                    this.props.navigation.reset({
                      index: 0,
                      routes: [{name: 'prologue'}],
                    });
                  });
              },
            },
          ]);
        }
      })
      .catch(() => {
        //showConsoleLog(ConsoleType.LOG,err);
      });
  };

  afterLogout = (accounts: UserData[]) => {
    //show alert for logout
    let lastInstanceName = Account.selectedData().name;
    this.showAlert(lastInstanceName);

    let user: UserData = accounts[accounts.length - 1];
    this.setState({list: accounts}, () => {
      this.props.setUser(user);
      if (accounts.length > 0) {
        EventManager.callBack(kUserAccountUpdated);
        this.props.navigation.reset({index: 0, routes: [{name: 'dashBoard'}]});
      }
      //this.props.navigation.drawerClose();
    });
  };

  showAlert(instanceName: string) {
    Alert.alert('CueBack', `You have successfully logged out`, [
      {
        text: 'Ok',
        style: 'cancel',
      },
    ]);
  }

  drawHeader = (data: any) => {
    if (data.item.type != 'AddCommunity' && this.userEmail != data.item.email) {
      this.userEmail = data.item.email;
      return (
        <View
          style={[
            styles.drawHeaderContainer,
            {
              paddingTop: data.index == 0 ? 0 : 15,
            },
          ]}>
          <View
            style={[
              styles.drawHeaderEmptyContainer,
              {
                height: data.index != 0 ? 1 : 0,
              },
            ]}></View>
          <View style={styles.drawerContainer}>
            <Image source={user_drawable}></Image>
            <Text style={styles.emailText}>{data.item.email}</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  renderRow = (data: {item: UserData & {type: string}; index: number}) => {
    if (data.item.type == 'AddCommunity') {
      return null;
      // return (
      // 	<TouchableOpacity
      // 		onPress={() => {
      // 			this.props.navigation.navigate("prologue", { showHeader: true });
      // 		}}>
      // 		<View style={{ width: "100%", flexDirection: "row", padding: 16, height: 82, alignItems: "center" }}>
      // 			<View style={styles.actionAdd}>
      // 				<Text style={{ color: Colors.ThemeColor, ...fontSize(28), lineHeight: 32, fontWeight: "300" }}>+</Text>
      // 			</View>
      // 			<Text style={{ color: Colors.ThemeColor, ...fontSize(18), lineHeight: 26 }}>Add Community</Text>
      // 		</View>
      // 	</TouchableOpacity>
      // );
    }
    if (
      this.props.user.instanceID == data.item.instanceID &&
      this.props.user.userID == data.item.userID
    ) {
      return (
        <View>
          {this.drawHeader(data)}
          <Banner communityInfo={data.item} style={styles.rowSelected} />
        </View>
      );
    } else {
      return (
        <View>
          {this.drawHeader(data)}
          <TouchableOpacity
            onPress={() => {
              this.props.setUser(data.item);
              EventManager.callBack(kUserAccountUpdated);
              this.props.navigation.navigate('dashBoard', {
                animationEnabled: false,
              });
            }}>
            <Banner communityInfo={data.item} style={[styles.row]} />
          </TouchableOpacity>
        </View>
      );
    }
  };
}

const logoutWorkFlow = (selectedAccounts: any) => {
  logoutMultiple(selectedAccounts)
    .then((resp: any) => {
      let list = resp.rows.raw();
      var accounts = list.filter((it: UserData) => it.userAuthToken != '');
      if (accounts.length > 0) {
        EventManager.callBack(kOnLogout, accounts);
      } else {
        this.props.navigation.reset({index: 0, routes: [{name: 'prologue'}]});
      }
    })
    .catch(() => {
      this.props.navigation.reset({index: 0, routes: [{name: 'prologue'}]});
    });
};

const mapState = (state: {[x: string]: any}) => ({
  user: state.account,
});

const mapDispatch = (dispatch: Function) => ({
  /**
   * Save selected user to reducer and AsyncStorage
   */
  setUser: (payload: UserData) => dispatch({type: UserAccount.Store, payload}),
});
export default connect(mapState, mapDispatch)(Menu);

type Props = {communityInfo: UserData; style?: any};

const Banner = ({communityInfo, style}: Props) => {
  let name = communityInfo.name;
  let url =
    communityInfo.instanceURL == '192.168.2.6'
      ? 'calpoly.cueback.com'
      : communityInfo.instanceURL;
  let imageURL = communityInfo.instanceImage;
  return (
    <View style={style || styles.container}>
      {/* {!is_public_site  ? 
			<View style={styles.image}>
					<Image source={{ uri: imageURL }} style={styles.imageIcon} resizeMode="cover" />
			</View>
			:
			<Image
						style={styles.imageIcon}
						resizeMode="cover"
						source={cueback_logo}
			/> */}
      <View style={styles.image}>
        <Image
          source={{uri: imageURL}}
          style={styles.imageIcon}
          resizeMode="cover"
        />
      </View>

      <View style={styles.innerContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.url}>{url}</Text>
        {/* <Text style={styles.email}>{communityInfo.email}</Text>				 */}
      </View>
    </View>
  );
};
