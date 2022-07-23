import React from 'react';
import {
  Alert, DeviceEventEmitter, EmitterSubscription, FlatList, Image, SafeAreaView, TouchableOpacity, View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Text from '../../common/component/Text';
import {
  Colors, fontSize, Size
} from '../../common/constants';
import { Account, LoginStore, UserData } from '../../common/loginStore';
import EStyleSheet from 'react-native-extended-stylesheet';
import { connect } from 'react-redux';
import EventManager from '../../common/eventManager';
import { logoutMethod, logoutMultiple } from '../../common/webservice/webservice';
import { user_drawable } from '../../images';
import { UserAccount } from './reducer';

type MenuProps = {
  user: UserData;
  setUser: (payload: UserData) => void;
};
const kOnLogout = 'UserLogoutListener';
export const kLogoutPressed = 'logoutPressed';
export const kUserAccountUpdated = 'userAccountUpdated';
class Menu extends React.Component<MenuProps> {
  state: { list: any } = {
    list: [],
  };
  listener?: EmitterSubscription = null;
  onlogout?: EventManager = null;
  logoutPressed?: EventManager = null;
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
        //console.log(err);
      });
  }

  componentWillUnmount() {
    this.listener.remove();
    this.onlogout.removeListener();
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            paddingTop: 1,
            backgroundColor: '#fff',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15,
          }}>
          <Text style={{ color: 'black', ...fontSize(16) }}>
            Your communities
          </Text>
          {false ? (
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
          ) : null}
        </View>
        <FlatList
          data={[...this.state.list, { type: 'AddCommunity' }]}
          keyExtractor={(_: any, index: number) => `${index}`}
          keyExtractor={(_, index: number) => `${index}`}
          renderItem={this.renderRow}
        />
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
          }}>
          <TouchableOpacity
            onPress={() => this._logout()}
            style={{
              alignItems: 'center',
              borderRadius: 5,
              justifyContent: 'center',
              height: 45,
              paddingLeft: 20,
              paddingRight: 20,
              backgroundColor: '#9a3427',
              width: '80%',
            }}>
            <Text style={{ color: '#fff' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  updateUser = ({ accounts, user }: { accounts: UserData[]; user: UserData }) => {
    this.setState({ list: accounts });
    this.props.setUser(user);
    Actions.replace('prologue');
    Actions.dashBoard();
  };

  _logout = () => {
    LoginStore.listAllAccounts()
      .then((resp: any) => {
        let list = resp.rows.raw();
        list = list.filter((it: UserData) => it.userAuthToken != '');
        if (list.length > 1) {
          Actions.push('commonInstanceListsSelection', {
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
              onPress: () => { },
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
                      Actions.reset('prologue');
                    }
                  })
                  .catch(() => {
                    Actions.reset('prologue');
                  });
              },
            },
          ]);
        }
      })
      .catch(() => {
        //console.log(err);
      });
  };

  afterLogout = (accounts: UserData[]) => {
    //show alert for logout
    let lastInstanceName = Account.selectedData().name;
    this.showAlert(lastInstanceName);

    let user: UserData = accounts[accounts.length - 1];
    this.setState({ list: accounts });
    this.props.setUser(user);
    if (accounts.length > 0) {
      EventManager.callBack(kUserAccountUpdated);
      Actions.reset('dashBoard');
    }
    Actions.drawerClose();
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
          style={{
            width: '100%',
            padding: 15,
            paddingTop: data.index == 0 ? 0 : 15,
            paddingBottom: 7,
            paddingLeft: 5,
          }}>
          <View
            style={{
              height: data.index != 0 ? 1 : 0,
              width: '100%',
              paddingRight: 15,
              paddingLeft: 15,
              marginBottom: 10,
              backgroundColor: '#DDDDDD',
            }}></View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={user_drawable}></Image>
            <Text
              style={{
                paddingLeft: 10,
                ...fontSize(14),
                color: 'rgba(61, 61, 61, 0.8)',
              }}>
              {data.item.email}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  renderRow = (data: { item: UserData & { type: string }; index: number }) => {
    if (data.item.type == 'AddCommunity') {
      return null;
      // return (
      // 	<TouchableOpacity
      // 		onPress={() => {
      // 			Actions.push("prologue", { showHeader: true });
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
              Actions.push('dashBoard', { animationEnabled: false });
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
        Actions.reset('prologue');
      }
    })
    .catch(() => {
      Actions.reset('prologue');
    });
};

const mapState = (state: { [x: string]: any }) => ({
  user: state.account,
});

const mapDispatch = (dispatch: Function) => ({
  /**
   * Save selected user to reducer and AsyncStorage
   */
  setUser: (payload: UserData) => dispatch({ type: UserAccount.Store, payload }),
});
export default connect(mapState, mapDispatch)(Menu);

const styles = EStyleSheet.create({
  $size: Size.byWidth(40),
  $sizeIcon: Size.byWidth(38),
  row: {
    padding: Size.byWidth(10),
    flexDirection: 'row',
    flex: 1,
    margin: 10,
    backgroundColor: '#F4F1EA',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 5,
  },
  rowSelected: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    margin: 10,
    backgroundColor: '#E6F0EF',
    padding: Size.byWidth(10),
    borderLeftColor: Colors.ThemeColor,
    borderLeftWidth: 5,
    borderRadius: 10,
    marginBottom: 5,
  },
  container: {
    borderRadius: 5,
    borderColor: 'rgb(230,230,230)',
    borderWidth: 2,
    padding: Size.byWidth(16),
    flexDirection: 'row',
    shadowOpacity: 0.75,
    elevation: 3,
    shadowRadius: 5,
    shadowColor: 'rgb(210,210,210)',
    shadowOffset: { height: 0, width: 1 },
    width: '100%',
  },

  actionAdd: {
    height: 40,
    width: 40,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: Colors.ThemeColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  innerContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: Size.byWidth(13),
  },

  name: {
    fontStyle: 'normal',
    ...fontSize(Size.byWidth(16)),
    color: 'black',
    textAlign: 'left',
  },

  url: {
    fontStyle: 'normal',
    ...fontSize(Size.byWidth(14)),
    marginTop: Size.byWidth(5),
    color: '#595959',
    textAlign: 'left',
  },
  email: {
    fontStyle: 'normal',
    ...fontSize(Size.byWidth(11)),
    marginTop: Size.byWidth(5),
    marginBottom: Size.byWidth(5),
    color: '#595959',
    textAlign: 'left',
  },
  image: {
    width: '$sizeIcon',
    height: '$sizeIcon',
    backgroundColor: 'transparent',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 2
  },
  imageIcon: {
    width: '$size-8',
    height: '$size-8',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
});

type Props = { communityInfo: UserData; style?: any };

const Banner = ({ communityInfo, style }: Props) => {
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
          source={{ uri: imageURL }}
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
