import React, {Component} from 'react';
import {
  View,
} from 'react-native';
import PlaceholderImageView from '../placeHolderImageView';
import Utility from '../../utility';
import styles from './styles';
import Styles from './styles';

type Props = {items: any};
export default class GroupPicHolder extends Component<Props> {
  renderItem = (index: any) => {
    if (this.props.items[index]) {
      let uri = Utility.getFileURLFromPublicURL(this.props.items[index].uri);
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

  render() {
    return (
      <View
        style={Styles.container}>
        <View style={Styles.rowSpaceBetween}>
          {this.renderItem(0)}
          {this.renderItem(1)}
        </View>
        <View style={Styles.rowSpaceBetween}>
          {this.renderItem(2)}
          {this.renderItem(3)}
        </View>
      </View>
    );
  }
}
