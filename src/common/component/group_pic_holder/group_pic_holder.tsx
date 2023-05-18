import React, {Component} from 'react';
import {
  View,
} from 'react-native';
import PlaceholderImageView from '../placeHolderImageView';
import Utility from '../../utility';
import styles from './styles';
import Styles from './styles';

type Props = {items: any};

const GroupPicHolder =(props:Props)=> {

  const renderItem = (index: any) => {
    if (props.items[index]) {
      let uri = Utility.getFileURLFromPublicURL(props.items[index].uri);
      return (
        <View
          style={styles.mainContainer}>
          <PlaceholderImageView
            uri={uri}
            style={styles.placeholderStyle}
            profilePic={true}
          />
        </View>
      );
    } else {
      return (
        <View
          style={styles.emptyContainer}
        />
      );
    }
  };

    return (
      <View
        style={Styles.container}>
        <View style={Styles.rowSpaceBetween}>
          {renderItem(0)}
          {renderItem(1)}
        </View>
        <View style={Styles.rowSpaceBetween}>
          {renderItem(2)}
          {renderItem(3)}
        </View>
      </View>
    );
}
export default GroupPicHolder;