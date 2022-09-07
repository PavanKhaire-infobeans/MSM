import React from 'react';
import {Image, StatusBar, TouchableOpacity, View} from 'react-native';
import Text from '../../../common/component/Text';
//@ts-ignore

import {connect} from 'react-redux';
import {Colors, fontSize} from '../../../common/constants';
import {backBtn, mindpopBarIcon, navBarCrossIconWhite} from '../../../images';
import styles from './styles';

const testID = {
  dashboardNavBar: 'dashboard_navigation_bar',
  leftButtons: {menu: 'navbar_leftbtn_menu'},
  rightButtons: {
    mindpop: 'mindpop_btn',
    message: 'message_btn',
    notification: 'notification_btn',
  },
  title: {text: 'title'},
};
//Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,

class MindPopNavigationBar extends React.Component<{[x: string]: any}> {
  _renderLeft() {
    let leftImg = this.props.isSelectionOn ? backBtn : navBarCrossIconWhite;
    return (
      <TouchableOpacity
        style={[styles.leftButtonTouchableContainer]}
        testID={testID.leftButtons.menu}
        onPress={() => this.props.navigation.goBack()}>
        {/* onPress={() => this.props.navigation.dashBoard()}> */}
        {/* action() */}
        <Image style={styles.imageStyle} resizeMode="center" source={leftImg} />
      </TouchableOpacity>
    );
  }

  _renderMiddle() {
    return (
      <View style={styles.titleContainer} testID={testID.title.text}>
        <Text style={styles.titleText}>MindPops</Text>
      </View>
    );
  }
  _renderIcon() {
    let mindPopImg = mindpopBarIcon;
    return (
      <View style={styles.iconContainer}>
        <Image
          style={styles.imageStyle}
          resizeMode="center"
          source={mindPopImg}
        />
      </View>
    );
  }

  _renderRight() {
    var action = this.props.isSelectionOn
      ? this.props.selectedItemCount == this.props.listCount
        ? this.props.clearAllAction
        : this.props.selectAllAction
      : this.props.selectAction;
    var title = this.props.isSelectionOn
      ? this.props.selectedItemCount == this.props.listCount
        ? 'Clear All'
        : 'Select All'
      : 'Select';

    return (
      <View style={styles.rightButtonsContainer}>
        <TouchableOpacity
          onPress={() => action()}
          style={styles.rightButtonsTouchable}
          testID={testID.rightButtons.mindpop}>
          <Text style={styles.titleStyle}>{title}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.navigationBarContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.NewThemeColor}
        />
        {this._renderLeft()}
        {this._renderIcon()}
        {this._renderMiddle()}

        {this.props.listCount == 0 ? null : this._renderRight()}
      </View>
    );
  }
}

const mapStateToProps = (state: {[x: string]: any}) => ({
  isSelectionOn: state.mindPopListSelectionStatus as boolean,
  listCount: state.listCount as number,
  selectedItemCount: state.selectedItemCount,
});

export default connect(mapStateToProps)(MindPopNavigationBar);
