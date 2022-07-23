import React from 'react';
import {
  Image,TouchableHighlight, View
} from 'react-native';
import Text from '../../component/Text';
//@ts-ignore
import { icon_arrow } from '../../../images';
import styles from './styles';

type Props = {
  title: string;
  showArrow?: boolean;
  icon?: any;
  count: number;
  identifier: string;
  isLast?: boolean;
  subTitle?: string;
  onPress?: (key: any) => void;
};

export default class DefaultListItem extends React.Component<Props> {
  static defaultProps: Props = {
    title: '',
    showArrow: true,
    count: 0,
    identifier: '',
    isLast: false,
    onPress: () => {},
  };

  render() {
    //console.log("Key is " + this.props.identifier);
    return (
      <TouchableHighlight
        underlayColor="#cccccc3e"
        style={styles.width100}
        onPress={() => this.props.onPress(this.props.identifier)}>
        <View
          style={[
            styles.container,
            {borderBottomWidth: this.props.isLast ? 0 : 1},
          ]}>
          <View
            style={styles.headercontainer}>
            {this.props.icon && (
              <Image
                style={styles.imageStyle}
                source={this.props.icon}
              />
            )}
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                {this.props.title}
              </Text>
              {this.props.subTitle && (
                <Text
                  style={styles.subTitle}>
                  {this.props.subTitle}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.countContainer}>
            {this.props.count > 0 && (
              <View style={styles.notificationCountBG}>
                <Text style={styles.notificationCountText}>
                  {this.props.count}
                </Text>
              </View>
            )}
            {this.props.showArrow && <Image source={icon_arrow} />}
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
