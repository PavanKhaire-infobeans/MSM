import React from 'react';
import { Image, Platform, StatusBar, TouchableOpacity, View } from 'react-native';
import Text from '../../../common/component/Text';
//@ts-ignore
import styles from './styles';
import { connect } from 'react-redux';
import NavigationHeader from '../../../common/component/navigationHeader';
import { Colors, fontFamily, fontSize } from '../../../common/constants';
import { backBtn, navBarCrossIconWhite } from '../../../images';
import { EditMode } from '../edit/reducer';
import Styles from './styles';

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



class MindPopIPadNavigationBar extends React.Component<{[x: string]: any}> {
  _renderRight() {
    let action = this.props.isSelectionOn
      ? this.props.selectedItemCount == this.props.listCount
        ? this.props.clearAllAction
        : this.props.selectAllAction
      : this.props.selectAction;
    let title = this.props.isSelectionOn
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
          <Text style={styles.titleTextStyle}>{title}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    let action = this.props.isSelectionOn
      ? this.props.backAction
      : this.props.cancelAction;
    let leftImg = this.props.isSelectionOn ? backBtn : navBarCrossIconWhite;
    return (
      <NavigationHeader
        testID={testID.dashboardNavBar}
        backgroundColor={Colors.NewThemeColor}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.NewThemeColor}
        />
        <View
          style={[
            styles.leftIMAGCONTAINER,
            {
              width: this.props.listCount > 0 ? 320 : '100%',
            },
          ]}>
          <TouchableOpacity
            style={styles.leftButtonTouchableContainer}
            testID={testID.leftButtons.menu}
            onPress={() => action()}>
            <Image
              style={styles.imageSTyle}
              resizeMode="center"
              source={leftImg}
            />
          </TouchableOpacity>
          <View style={styles.titleContainer} testID={testID.title.text}>
            <Text style={styles.titleText}>MindPops</Text>
          </View>
          {this.props.listCount == 0 ? null : this._renderRight()}
        </View>
        {this.props.listCount > 0 ? (
          <React.Fragment>
            <View key="sepeartor" style={styles.separator} />
            <View key="rightSection" style={styles.rightSections}>
              <TouchableOpacity
                onPress={() => {
                  this.props.reset();
                  this.props.navigation.navigate('mindPopEdit',{
                    updateList: this.props.updateList,
                  });
                }}
                style={[styles.rightButtonsTouchable, {marginLeft: 3}]}
                testID={'headerCreateMindPop'}>
                <Text style={Styles.titleTextStyle}>+Create a MindPop</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.saveMode();
                  this.props.navigation.navigate('mindPopEdit',{
                    updateList: this.props.updateList,
                  });
                }}
                style={[styles.rightButtonsTouchable, {marginRight: 3}]}
                testID={'headerCreateMindPop'}>
                <Text style={styles.titleTextStyle}>Edit</Text>
              </TouchableOpacity>
              {this.props.isSelectingItem ? (
                <View style={styles.selectingItem} />
              ) : null}
            </View>
          </React.Fragment>
        ) : null}
      </NavigationHeader>
    );
  }
}

const mapStateToProps = (state: {[x: string]: any}) => ({
  isSelectionOn: state.mindPopListSelectionStatus as boolean,
  listCount: state.listCount as number,
  selectedItemCount: state.selectedItemCount,
  isSelectingItem: state.mindPopListSelectionStatus,
});

const mapDispatch = (dispatch: Function) => ({
  saveMode: () => dispatch({type: EditMode.RESET}),
  reset: () => dispatch({type: EditMode.UNSELECT}),
});

export default connect(mapStateToProps, mapDispatch)(MindPopIPadNavigationBar);
