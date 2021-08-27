import React, {Component} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import Text from '../../Text';
import {connect} from 'react-redux';

import {rubbish} from '../../../../images';
import {Colors, fontSize} from '../../../constants';

class SelectionStatusBar extends Component<{[x: string]: any}> {
  render() {
    return (
      <View
        style={{
          width: '100%',
          height: 53,
          flexDirection: 'row',
          backgroundColor: '#F3F3F3',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 10,
          paddingRight: 10,
          borderTopColor: 'rgba(0.0, 0.0, 0.0, 0.25)',
          borderTopWidth: 1,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 26,
            paddingLeft: 10,
            paddingRight: 10,
            backgroundColor: 'white',
            borderRadius: 13,
          }}>
          <Text style={{...fontSize(16), color: '#909090'}}>
            {this.props.selectedItemCount} Selected
          </Text>
        </View>

        {/*<TouchableHighlight key="convToMem"
                    onPress={() => { //console.log('Convert to memory pressed') }}
                >
                    <Text style={{ fontSize: 18, color: Colors.ThemeColor }}>Convert to Memory</Text>
        </TouchableHighlight>*/}

        <TouchableOpacity
          key="rubbish"
          style={{
            marginLeft: 10,
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
          }}
          onPress={() => {
            this.props.onPress();
          }}>
          <Image source={rubbish} />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state: {[x: string]: any}) => ({
  selectedItemCount: state.selectedItemCount,
});

export default connect(mapStateToProps)(SelectionStatusBar);
