import React from 'react';
import {Image, TouchableHighlight, View} from 'react-native';
import Text from '../../component/Text';
//@ts-ignore
import {icon_arrow} from '../../../images';
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

const DefaultListItem =(props:Props)=> {

    return (
      <TouchableHighlight
        underlayColor="#cccccc3e"
        style={styles.width100}
        onPress={() => props.onPress(props.identifier)}>
        <View
          style={[
            styles.container,
            {borderBottomWidth: props.isLast ? 0 : 1},
          ]}>
          <View style={styles.headercontainer}>
            {props.icon && (
              <Image style={styles.imageStyle} source={props.icon} />
            )}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{props.title}</Text>
              {props.subTitle && (
                <Text style={styles.subTitle}>{props.subTitle}</Text>
              )}
            </View>
          </View>
          <View style={styles.countContainer}>
            {props.count > 0 && (
              <View style={styles.notificationCountBG}>
                <Text style={styles.notificationCountText}>
                  {props.count}
                </Text>
              </View>
            )}
            {props.showArrow && <Image source={icon_arrow} />}
          </View>
        </View>
      </TouchableHighlight>
    );
}

DefaultListItem.defaultProps ={
  title: '',
  showArrow: true,
  count: 0,
  identifier: '',
  isLast: false,
  onPress: () => {},
};

export default DefaultListItem;