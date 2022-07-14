import React from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  TouchableHighlight,
  StatusBar,
  Keyboard,
  Platform,
} from 'react-native';
import Text from '../../common/component/Text';
import {
  icon_people,
  icon_events,
  icon_settings,
  icon_faq,
  icon_info,
  icon_headset,
  profile_placeholder,
  action_close,
} from '../../images';
import NavigationBar from '../dashboard/NavigationBar';
import NavigationBarForEdit from '../../common/component/navigationBarForEdit';
import {Actions} from 'react-native-router-flux';
import {Colors, fontFamily, fontSize, Size} from '../../common/constants';
import Utility from '../../common/utility';
import {Account} from '../../common/loginStore';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';

type Props = {[x: string]: any};
export default class CustomListView extends React.Component<Props> {
  componentDidMount() {
    this.setState({itemList: this.props.itemList});
  }

  cancelAction = () => {
    Keyboard.dismiss();
    Actions.pop();
  };

  renderCommentView = (item: any) => {
    let name =
      item.item.uid == Account.selectedData().userID
        ? 'You'
        : item.item.field_first_name_value +
          ' ' +
          item.item.field_last_name_value;
    return (
      <TouchableHighlight
        underlayColor={'#cccccc3e'}
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          borderBottomColor: '#d3d3d3',
          borderBottomWidth: 1,
          paddingBottom: 15,
          paddingTop: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <ImageBackground
              source={profile_placeholder}
              style={{height: 50, width: 50}}
              imageStyle={{borderRadius: 25}}>
              <Image
                source={
                  item.item.uri && item.item.uri != ''
                    ? {uri: Utility.getFileURLFromPublicURL(item.item.uri)}
                    : profile_placeholder
                }
                style={{height: 50, width: 50, borderRadius: 25}}></Image>
            </ImageBackground>
            <Text
              style={{
                marginLeft: 10,
                fontWeight: '500',
                fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                lineHeight: 20,
                fontSize: 16,
                color: Colors.TextColor,
                backgroundColor: item.item.backgroundColor,
              }}>
              {name}
            </Text>
          </View>
          {this.props.showUnblock && (
            <TouchableHighlight
              underlayColor={'#ffffff33'}
              style={{
                padding: 16,
                paddingTop: 7,
                paddingBottom: 7,
                borderRadius: 20,
                backgroundColor: Colors.NewTitleColor,
              }}
              onPress={() => this.props.onClick(item.item.uid)}>
              <Text
                style={{
                  color: Colors.white,
                  fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                  fontWeight: '500',
                }}>
                Unblock
              </Text>
            </TouchableHighlight>
          )}
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{flex: 1}}>
          <NavigationHeaderSafeArea
            heading={this.props.heading}
            showCommunity={false}
            cancelAction={() => Actions.pop()}
            showRightText={false}
            isWhite={true}
            backIcon={action_close}
          />

          <StatusBar
            barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
            backgroundColor={Colors.NewThemeColor}
          />
          <FlatList
            onScroll={() => {
              Keyboard.dismiss();
            }}
            data={this.props.itemList}
            keyExtractor={(_, index: number) => `${index}`}
            ListEmptyComponent={() => (
              <View
                style={{
                  height: 120,
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {this.props.loadingCompleted && (
                  <Text
                    style={{
                      fontStyle: 'normal',
                      ...fontSize(Size.byWidth(16)),
                      color: 'black',
                      textAlign: 'center',
                    }}>
                    {this.props.blankText}
                  </Text>
                )}
              </View>
            )}
            style={{
              padding: 15,
              paddingTop: 0,
              marginBottom: 15,
              backgroundColor: '#fff',
            }}
            renderItem={(item: any) => this.renderCommentView(item)}
          />
        </View>
      </SafeAreaView>
    );
  }
}
