import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import styles from './styles'

type Props = { size: 'small' | 'large' };
const ActivityIndicatorView = (props: Props) => {
  return (
    <View
      style={styles.container}>
      <ActivityIndicator animating={true} size={props.size} />
    </View>
  );
  
}

export default ActivityIndicatorView;