import React, { Component } from 'react';
import { View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import styles from './styles';
type Props = {
  onDateSelection: Function;
  onCancel: Function;
  isVisible: boolean;
  defaultDate: any
};
export default class DateTimePickerView extends Component<Props> {
 
  state = {
    isDateTimePickerVisible: this.props.isVisible,
    dateSelected: this.props.defaultDate ? this.props.defaultDate : new Date(),
  };

  constructor(props: Props) {
    super(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props != nextProps) {
      if (nextProps.defaultDate) {
        if (typeof(nextProps.defaultDate)==='string') {
          this.setState({dateSelected:new Date(nextProps.defaultDate)})
        }
      }
    }
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date: any) => {
    this.setState({ dateSelected: date },()=>{
      this._hideDateTimePicker();
      this.props.onDateSelection(date);
    })
  };

  _onCancel = () => {
    this._hideDateTimePicker();
    this.props.onCancel();
  };

  getMinimumDate = () => {
    let date = new Date();
    date.setFullYear(1917);
    date.setMonth(0);
    date.setDate(1);
    return date;
  };
  render() {

    return (
      <View style={styles.container}>
        <DateTimePicker
          isVisible={this.props.isVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._onCancel}
          date={this.state.dateSelected}
          maximumDate={new Date()}
          minimumDate={this.getMinimumDate()}
        />
      </View>
    );
  }
}
