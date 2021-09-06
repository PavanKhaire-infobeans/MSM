import {Image, Platform, TouchableOpacity, View, StatusBar} from 'react-native';
import Text from '../../../common/component/Text';
import React from 'react';
//@ts-ignore
import EStyleSheet from 'react-native-extended-stylesheet';
import {backBtn, navBarCrossIconWhite} from '../../../images';
import {connect} from 'react-redux';
import {EditMode} from '../edit/reducer';
import {Actions} from 'react-native-router-flux';
import {Colors, fontSize} from '../../../common/constants';
import NavigationHeader from '../../../common/component/navigationHeader';

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
    backgroundColor: 'red',
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
          style={{
            width: this.props.listCount > 0 ? 320 : '100%',
            height: '100%',
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={styles.leftButtonTouchableContainer}
            testID={testID.leftButtons.menu}
            onPress={() => action()}>
            <Image
              style={{height: 28, width: 28}}
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
            <View
              key="sepeartor"
              style={{
                width: 1,
                backgroundColor: '#fff',
                height: Platform.OS === 'ios' ? 76 : 54,
                top: Platform.OS === 'ios' ? -20 : 0,
              }}
            />
            <View
              key="rightSection"
              style={{
                paddingTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flex: 1,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.reset();
                  Actions.mindPopEdit({updateList: this.props.updateList});
                }}
                style={[styles.rightButtonsTouchable, {marginLeft: 3}]}
                testID={'headerCreateMindPop'}>
                <Text
                  style={{
                    ...fontSize(16),
                    fontWeight: '400',
                    color: Colors.TextColor,
                  }}>
                  +Create a MindPop
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.saveMode();
                  Actions.mindPopEdit({updateList: this.props.updateList});
                }}
                style={[styles.rightButtonsTouchable, {marginRight: 3}]}
                testID={'headerCreateMindPop'}>
                <Text
                  style={{
                    ...fontSize(16),
                    fontWeight: '400',
                    color: Colors.TextColor,
                  }}>
                  Edit
                </Text>
              </TouchableOpacity>
              {this.props.isSelectingItem ? (
                <View
                  style={{
                    height: Platform.OS === 'ios' ? 76 : 54,
                    top: Platform.OS == 'ios' ? -20 : 0,
                    width: '100%',
                    position: 'absolute',
                    backgroundColor: '#00000034',
                  }}
                />
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
