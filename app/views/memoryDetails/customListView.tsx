import React from 'react';
import {
  FlatList, Image, ImageBackground, Keyboard, SafeAreaView, StatusBar, TouchableHighlight, View
} from 'react-native';
import Text from './../../../src/common/component/Text';
import {
  action_close, profile_placeholder
} from './../../../src/images';
// import NavigationBar from '../dashboard/NavigationBar';
import { Actions } from 'react-native-router-flux';
import NavigationHeaderSafeArea from './../../../src/common/component/profileEditHeader/navigationHeaderSafeArea';
import { Colors } from './../../../src/common/constants';
import { Account } from './../../../src/common/loginStore';
import Utility from './../../../src/common/utility';
import styles from './styles';

type Props = { [x: string]: any };
export default class CustomListView extends React.Component<Props> {
  componentDidMount() {
    this.setState({ itemList: this.props.itemList });
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
        style={styles.renderCommentViewContainer}>

        <View style={styles.renderCommentSubViewContainer}>
          <ImageBackground
            source={profile_placeholder}
            style={styles.imagebgStyle}
            imageStyle={styles.imagebgStyleImageStyle}>
            <Image
              source={
                item.item.uri && item.item.uri != ''
                  ? { uri: Utility.getFileURLFromPublicURL(item.item.uri) }
                  : profile_placeholder
              }
              style={styles.imagebgStyleInnerImageStyle}></Image>
          </ImageBackground>
          <Text
            style={[styles.userNameTextStyle,{
              backgroundColor: item.item.backgroundColor,
            }]}>
            {name}
          </Text>
        </View>

        {this.props.showUnblock && (
          <TouchableHighlight
            underlayColor={'#ffffff33'}
            style={styles.unblockContainer}
            onPress={() => this.props.onClick(item.item.uid)}>
            <Text
              style={styles.unblockTextStyle}>
              Unblock
            </Text>
          </TouchableHighlight>
        )}

      </TouchableHighlight>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.customlistviewMainContainer}>
        <View>
          <NavigationHeaderSafeArea
            heading={this.props.heading}
            showCommunity={false}
            cancelAction={() => Actions.pop()}
            showRightText={false}
            isWhite={true}
            backIcon={action_close}
          />

          <StatusBar
            barStyle={Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
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
                style={styles.customlistviewMainContainerFlatlistTextContainer}>
                {this.props.loadingCompleted && (
                  <Text
                    style={styles.customlistviewMainContainerFlatlistTextStyle}>
                    {this.props.blankText}
                  </Text>
                )}
              </View>
            )}
            style={styles.customlistviewMainContainerFlatlistStyle}
            renderItem={(item: any) => this.renderCommentView(item)}
          />
        </View>
      </SafeAreaView>
    );
  }
}
