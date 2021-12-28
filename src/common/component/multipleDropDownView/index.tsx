import React from 'react';
import {View, Animated, Platform} from 'react-native';
import Text from '../Text';
import {Props, State} from './types';
import {styles} from './design';
import {fontSize, Colors} from '../../constants';
import BottomPicker, {ActionSheetItem} from '../bottomPicker';
import DropDownSelector from '../dropDown';

export default class MultipleDropDownSelector extends React.Component<
  Props,
  State
> {
  bottomPicker: React.RefObject<BottomPicker> = React.createRef<BottomPicker>();
  static defaultProps = {
    placeholderText: '',
    placeholderTextColor: 'gray',
    errorMessage: '',
    showError: false,
    value: '',
    onOptionSelected: () => {},
    viewID: 0,
    isRequired: false,
    inputViewStyle: styles.inputViewStyle,
    inputTextStyle: styles.inputTextStyle,
    selectedValue: '',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      animatedViewHeight: Platform.OS === 'ios' ? 16 : 26,
      showClearImage: false,
      text: '',
      numericValue: 0,
      selectionData: {
        actions: [],
        selectionValue: '',
        selectionType: {},
        fieldName: '',
        label: '',
        selectedValues: {},
        maxLimit: {},
      },
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.showError !== nextProps.showError) {
      Animated.timing(this.state.opacity, {
        toValue: nextProps.showError ? 1 : 0,
        duration: 100,
      }).start();
    }
  }

  showPicker = () => {};

  render() {
    return (
      <View
        style={[
          this.props.style,
          {justifyContent: 'flex-start', flexDirection: 'column'},
        ]}>
        <View style={{minWidth: 180, flexDirection: 'row', marginBottom: 5}}>
          <Text style={{lineHeight: 26, fontSize: 18, color: '#6B6B6B'}}>
            {this.props.placeholderText}
          </Text>
          {this.props.isRequired ? (
            <Text style={{color: Colors.NewRadColor}}>{' *'}</Text>
          ) : null}
        </View>

        <View
          style={{
            height: 56,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <DropDownSelector
            value={[this.props.view1Value]}
            placeholderText={this.props.view1Title}
            selectedValue={this.props.view1Value}
            onOptionSelected={() =>
              this.props.onOptionSelected(this.props.view1Title)
            }></DropDownSelector>
          <DropDownSelector
            value={[this.props.view2Value]}
            placeholderText={this.props.view2Title}
            selectedValue={this.props.view2Value}
            onOptionSelected={() =>
              this.props.onOptionSelected(this.props.view2Title)
            }></DropDownSelector>
        </View>

        <Animated.View
          style={{
            width: '100%',
            height: this.props.animatedViewHeight,
            opacity: this.state.opacity,
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}>
          <View style={{minWidth: 180}}>
            <Text
              style={{
                ...fontSize(11),
                color: Colors.ErrorColor,
                marginTop: 1,
                lineHeight: 13,
                letterSpacing: -0.1,
              }}>
              {`*${this.props.errorMessage}`}
            </Text>
          </View>
        </Animated.View>
        <BottomPicker
          ref={this.bottomPicker}
          onItemSelect={(selectedItem: ActionSheetItem) => {
            //let fieldName = this.state.selectionData.fieldName;
            //this.setState({ [fieldName]: { [selectedItem.key]: selectedItem.text } });
            //console.log(this.state)
          }}
          actions={this.state.selectionData.actions}
          value={this.state.selectionData.selectionValue}
          selectedValues={this.state.selectionData.selectedValues}
          selectionType={0}
          fieldName={this.state.selectionData.fieldName}
          fullscreen={true}
          label={this.state.selectionData.label}
          maxLimit={this.state.selectionData.maxLimit}
        />
      </View>
    );
  }
}
