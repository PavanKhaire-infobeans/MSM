import {Image, TouchableOpacity, View, StatusBar, Platform} from 'react-native';
import Text from '../../../common/component/Text';
import React from 'react';
//@ts-ignore
import EStyleSheet from 'react-native-extended-stylesheet';
import {backBtn, navBarCrossIconWhite, mindpopBarIcon} from '../../../images';
import {connect} from 'react-redux';
import {Colors, fontSize} from '../../../common/constants';
import NavigationHeader from '../../../common/component/navigationHeader';
import { Actions } from 'react-native-router-flux';

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

const styles = EStyleSheet.create({
  titleText: {
    color: Colors.TextColor,
    ...fontSize(18),
    lineHeight: 20,
    textAlign: 'left',
    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
  },

  titleContainer: {justifyContent: 'center', paddingTop: 10},

  leftButtonTouchableContainer: {
    justifyContent: 'center',
    padding: 15,
    marginTop: 5,
  },

  leftButtonContainer: {
    backgroundColor: 'transparent',
    borderColor: '#ffffff',
    borderWidth: 2,
    height: 28,
    width: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftCrossButtonContainer: {
    backgroundColor: Colors.NewRadColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftButtonLogo: {width: 20, height: 20},

  rightButtonsContainer: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  rightButtonsTouchable: {padding: 5, paddingRight: 10},

  rightButtonsBackgroundImage: {width: 30, height: 30},

  rightButtonsBadge: {
    position: 'absolute',
    height: 16,
    right: 5,
    top: 5,
    backgroundColor: '#ff0000',
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 8,
    alignContent: 'center',
  },

  rightButtonsBadgeText: {...fontSize(10), color: '#ffffff'},
});

class MindPopNavigationBar extends React.Component<{[x: string]: any}> {
  _renderLeft() {
    let action = this.props.isSelectionOn
      ? this.props.backAction
      : this.props.cancelAction;
    let leftImg = this.props.isSelectionOn ? backBtn : navBarCrossIconWhite;
    return (
      <TouchableOpacity
        style={[styles.leftButtonTouchableContainer]}
        testID={testID.leftButtons.menu}
        onPress={() => Actions.dashBoard()}>
{/* action() */}
        <Image
          style={{height: 28, width: 28}}
          resizeMode="center"
          source={leftImg}
        />
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
      <View
        style={{alignItems: 'center', justifyContent: 'center', marginEnd: 10}}>
        <Image
          style={{height: 28, width: 28}}
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
          <Text
            style={{
              ...fontSize(16),
              fontWeight: '400',
              color: Colors.TextColor,
            }}>
            {title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.NewThemeColor,
          height: 54,
        }}>
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
