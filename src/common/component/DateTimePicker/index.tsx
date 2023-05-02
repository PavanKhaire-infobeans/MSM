import React, { Component, useEffect, useState } from 'react';
import { View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import styles from './styles';
type Props = {
  onDateSelection: Function;
  onCancel: Function;
  isVisible: boolean;
  defaultDate: any
};
const DateTimePickerView = (props: Props) => {

  const [state, setState] = useState({
    isDateTimePickerVisible: props.isVisible,
    dateSelected: props.defaultDate ? props.defaultDate : new Date(),
  });

  useEffect(() => {
    if (props.defaultDate) {
      if (typeof (props.defaultDate) === 'string') {
        setState({ ...state, dateSelected: new Date(props.defaultDate) })
      }
    }
  }, [props.defaultDate])

  const _showDateTimePicker = () => setState({ ...state, isDateTimePickerVisible: true });

  const _hideDateTimePicker = () => setState({ ...state, isDateTimePickerVisible: false });

  const _handleDatePicked = (date: any) => {
    setState({ ...state, dateSelected: date })
    _hideDateTimePicker();
    props.onDateSelection(date);
  };

  const _onCancel = () => {
    _hideDateTimePicker();
    props.onCancel();
  };

  const getMinimumDate = () => {
    let date = new Date();
    date.setFullYear(1917);
    date.setMonth(0);
    date.setDate(1);
    return date;
  };

  return (
    <View style={styles.container}>
      <DateTimePicker
        isVisible={props.isVisible}
        onConfirm={_handleDatePicked}
        onCancel={_onCancel}
        date={state.dateSelected}
        maximumDate={new Date()}
        minimumDate={getMinimumDate()}
      />
    </View>
  );
}

export default DateTimePickerView;