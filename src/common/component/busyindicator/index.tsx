import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, DeviceEventEmitter, StyleSheet, Text, View
} from 'react-native';
import { fontSize } from '../../constants';
import styles from './styles';

const BusyIndicator = (props) => {

  const [state, setState] = useState({
    isVisible: props.startVisible,
  });
  

  useEffect(() => {

    return () => {
      // emitter.remove();
    }
  }, [])

  const changeLoadingEffect = (state) => {
    if (state) {
      setState(prev => ({
        ...prev,
        isVisible: state?.isVisible,
        text: state.title ? state.title : props.text,
      }));
    }
  }
  let emitter = DeviceEventEmitter.addListener(
    'changeLoadingEffect',
    changeLoadingEffect,
  );

  const customStyles = StyleSheet.create({
    overlay: {
      backgroundColor: props.overlayColor,
      minWidth: props.overlayWidth,
      height: props.overlayHeight,
    },

    text: {
      color: props.textColor,
      ...fontSize(props.textFontSize),
    },
  });

  return (
    !state.isVisible ?
      null
      :
      <View style={styles.container}>
        <View style={[styles.overlay, customStyles.overlay]}>
          <ActivityIndicator
            color={props.color}
            size={props.size}
            style={styles.progressBar}
          />

          <Text
            numberOfLines={props.textNumberOfLines}
            style={[styles.text, customStyles.text]}>
            {state.text}
          </Text>
        </View>
      </View>
  );
}

BusyIndicator.propTypes = {
  color: PropTypes.string,
  overlayColor: PropTypes.string,
  overlayHeight: PropTypes.number,
  overlayWidth: PropTypes.number,
  size: PropTypes.oneOf(['small', 'large']),
  startVisible: PropTypes.bool,
  text: PropTypes.string,
  textColor: PropTypes.string,
  textFontSize: PropTypes.number,
  textNumberOfLines: PropTypes.number,
};

BusyIndicator.defaultProps = {
  isDismissible: false,
  overlayWidth: 100,
  overlayHeight: 80,
  overlayColor: '#333333',
  color: '#ffffff',
  size: 'small',
  startVisible: false,
  text: 'Please wait...',
  textColor: '#ffffff',
  textFontSize: 14,
  textNumberOfLines: 2,
};

module.exports = BusyIndicator;
