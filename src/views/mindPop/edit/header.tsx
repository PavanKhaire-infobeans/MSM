import React from 'react';
import {View, TouchableOpacity, Image, Platform} from 'react-native';
import Text from '../../../common/component/Text';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {EditMode} from './reducer';
import DeviceInfo from 'react-native-device-info';
import NavigationHeader from '../../../common/component/navigationHeader';
import {Colors, fontFamily, fontSize} from '../../../common/constants';

class EditHeader extends React.Component<{
  navigation: {[x: string]: any};
  isEdit: boolean;
  editMode: Function;
  reset: Function;
  save: Function;
  updatePrev: Function;
  selectedItem?: any;
  cancel: Function;
}> {
  render() {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingBottom: 8,
          backgroundColor: Colors.NewThemeColor,
          flexDirection: 'row',
        }}>
        {this.props.isEdit ||
        !this.props.selectedItem ||
        DeviceInfo.isTablet() ? (
          <View
            style={{
              width: 150,
              paddingTop: 12,
              height: 44,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                width: 50,
                marginLeft: 4,
                marginRight: 4,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                this.props.updatePrev && this.props.updatePrev();
              }}>
              <Image
                style={{height: 28, width: 28}}
                source={require('../../../images/back/back.png')}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: Colors.TextColor,
                ...fontSize(18),
                fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
                fontWeight: '500',
              }}>
              MindPops
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={{
              width: 70,
              marginLeft: 10,
              paddingTop: 15,
              justifyContent: 'center',
              alignItems: 'center',
              height: 44,
            }}
            onPress={() => {
              // this.props.reset();
              this.props.cancel();
            }}>
            <Text style={{color: Colors.TextColor, ...fontSize(16)}}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{
            width: 70,
            paddingTop: 15,
            justifyContent: 'center',
            alignItems: 'center',
            height: 44,
          }}
          onPress={this.onRightPress}>
          <Text style={{color: Colors.TextColor, ...fontSize(16)}}>
            {this.props.isEdit ? 'Edit' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  onRightPress = () => {
    if (this.props.isEdit) {
      this.props.editMode();
    } else {
      this.props.save();
    }
  };
}

const mapState = (state: {[x: string]: any}) => ({
  isEdit: state.mindPopEditMode.mode,
  selectedItem: state.mindPopEditMode.selectedMindPop,
});

const mapDispatch = (dispatch: Function) => ({
  editMode: () => dispatch({type: EditMode.RESET}),
  reset: () => dispatch({type: EditMode.EDIT}),
});
export default connect(mapState, mapDispatch)(EditHeader);
