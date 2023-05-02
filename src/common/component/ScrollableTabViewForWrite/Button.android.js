const React = require('react');
const ReactNative = require('react-native');
const {
  TouchableNativeFeedback,
} = ReactNative;

const Button = (props) => {
  return <ReactNative.TouchableOpacity activeOpacity={1}
    delayPressIn={0}
    background={TouchableNativeFeedback.SelectableBackground()} // eslint-disable-line new-cap
    {...props}
  >
    {props.children}
  </ReactNative.TouchableOpacity>;
};

module.exports = Button;
