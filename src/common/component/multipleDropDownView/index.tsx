import React, { useEffect, useState } from 'react';
import { View, Animated, Platform, Dimensions } from 'react-native';
import Text from '../Text';
import { Props, State } from './types';
import { styles } from './styles';
import { fontSize, Colors } from '../../constants';
import BottomPicker, { ActionSheetItem } from '../bottomPicker';
import DropDownSelector from '../dropDown';
const defaultProps = {
  placeholderText: '',
  placeholderTextColor: 'gray',
  errorMessage: '',
  showError: false,
  value: '',
  onOptionSelected: () => { },
  viewID: 0,
  isRequired: false,
  inputViewStyle: styles.inputViewStyle,
  inputTextStyle: styles.inputTextStyle,
  selectedValue: '',
};
const MultipleDropDownSelector = (props: Props) => {
  let bottomPicker: React.RefObject<BottomPicker> = React.useRef<BottomPicker>();

  const [state, setState] = useState({
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
                                maxLimit: 0,
                              },
                            });

  const [selectedOption, setSelectedOption] = useState('');
  useEffect(() => {
    Animated.timing(state.opacity, {
      toValue: props.showError ? 1 : 0,
      duration: 100,
    }).start();
  }, [props.showError])
  // componentWillReceiveProps(nextProps: Props) {
  //   if (this.props.showError !== nextProps.showError) {

  //   }
  // }

  const showPicker = () => { };
  return (
    <View
      style={[
        props.style,
        { justifyContent: 'flex-start', flexDirection: 'column' },
      ]}>
      <View style={{ minWidth: 180, flexDirection: 'row', marginBottom: 5 }}>
        <Text style={{ lineHeight: 26, fontSize: 18, color: '#6B6B6B' }}>
          {props.placeholderText}
        </Text>
        {props.isRequired ? (
          <Text style={{ color: Colors.NewRadColor }}>{' *'}</Text>
        ) : null}
      </View>

      <View
        style={{
          height: 100,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <DropDownSelector
          value={[props.view1Value]}
          placeholderText={props.view1Title}
          selectedValue={props.view1Value}
          onOptionSelected={() =>{
            setSelectedOption(props.view1Title);
            props.onOptionSelected(props.view1Title)}
          }></DropDownSelector>
        <DropDownSelector
          value={[props.view2Value]}
          placeholderText={props.view2Title}
          selectedValue={props.view2Value}
          onOptionSelected={() =>{
            setSelectedOption(props.view2Title);
            props.onOptionSelected(props.view2Title)}
          }></DropDownSelector>
      </View>

      <Animated.View
        style={{
          width: '100%',
          height: props.animatedViewHeight,
          opacity: state.opacity,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
        <View style={{ minWidth: 180 }}>
          <Text
            style={{
              ...fontSize(11),
              color: Colors.ErrorColor,
              marginTop: 1,
              lineHeight: 13,
              letterSpacing: -0.1,
            }}>
            {`*${props.errorMessage}`}
          </Text>
        </View>
      </Animated.View>
      <BottomPicker
        ref={bottomPicker}
        onItemSelect={(selectedItem: ActionSheetItem) => {
          //let fieldName = state.selectionData.fieldName;
          //setState({ [fieldName]: { [selectedItem.key]: selectedItem.text } });
          //console.log(state)
        }}
        title={props.view2Title}
        actions={state.selectionData.actions}
        value={state.selectionData.selectionValue}
        selectedValues={state.selectionData.selectedValues}
        selectionType={0}
        fieldName={state.selectionData.fieldName}
        fullscreen={true}
        label={state.selectionData.label}
        maxLimit={state.selectionData.maxLimit}
      />
    </View>
  );

};

export default MultipleDropDownSelector;