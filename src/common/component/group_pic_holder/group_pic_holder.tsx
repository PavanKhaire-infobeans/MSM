import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import {Colors, fontSize} from '../../constants';
import {
  warning_icon,
  default_placeholder,
  default_error_img,
  profile_placeholder,
} from '../../../images';
import TextNew from '../Text';
import {any} from 'prop-types';
import {Url} from 'url';
import {Account} from '../../loginStore';
import PlaceholderImageView from '../placeHolderImageView';
import Utility from '../../utility';
import styles from './styles';

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
        style={{
          height: 50,
          width: 50,
          marginRight: 5,
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {this.renderItem(0)}
          {this.renderItem(1)}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {this.renderItem(2)}
          {this.renderItem(3)}
        </View>
      </View>
    );
  }
}
