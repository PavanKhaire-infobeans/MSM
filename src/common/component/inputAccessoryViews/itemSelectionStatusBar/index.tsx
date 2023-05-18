import React, { Component } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import Text from '../../Text';

import { rubbish } from '../../../../images';
import styles from './styles';

const SelectionStatusBar = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.countTextStyle}>
          {props.selectedItemCount} Selected
        </Text>
      </View>

      {/*<TouchableHighlight key="convToMem"
                    onPress={() => {  }}
                >
                    <Text style={{ fontSize: 18, color: Colors.ThemeColor }}>Convert to Memory</Text>
        </TouchableHighlight>*/}

      <TouchableOpacity
        key="rubbish"
        style={styles.imageContainerStyle}
        onPress={() => {
          props.onPress();
        }}>
        <Image source={rubbish} />
      </TouchableOpacity>
    </View>
  );
}

const mapStateToProps = (state: { [x: string]: any }) => ({
  selectedItemCount: state.selectedItemCount,
});

export default connect(mapStateToProps)(SelectionStatusBar);
