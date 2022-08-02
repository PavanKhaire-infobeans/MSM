import React from 'react';
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import Text from '../../../common/component/Text';
import { Colors, fontFamily, fontSize } from '../../../common/constants';
import { EditMode } from './reducer';
import Styles from './styles';

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
        style={Styles.container}>
        {this.props.isEdit ||
        !this.props.selectedItem ||
        DeviceInfo.isTablet() ? (
          <View
            style={Styles.tabletSubContainer}>
            <TouchableOpacity
              style={Styles.backButton}
              onPress={() => {
                this.props.updatePrev && this.props.updatePrev();
              }}>
              <Image
                style={Styles.backImage}
                source={require('../../../images/back/back.png')}
              />
            </TouchableOpacity>
            <Text
              style={Styles.mindPopText}>
              MindPops
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={Styles.cancelButton}
            onPress={() => {
              // this.props.reset();
              this.props.cancel();
            }}>
            <Text style={Styles.cancelText}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={Styles.editButton}
          onPress={this.onRightPress}>
          <Text style={Styles.cancelText}>
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
