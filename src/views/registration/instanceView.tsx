import React from 'react';
import { Image, StatusBar, View } from 'react-native';
type Props = {
  communityInfo: {name: string; instanceURL?: string; instanceImage?: string};
  style?: any;
  showSelection?: boolean;
  isSelected?: boolean;
};
//@ts-ignore
import EStyleSheet from 'react-native-extended-stylesheet';
import TextNew from '../../common/component/Text';
import { Colors, fontSize, Size } from '../../common/constants';
import Utility from '../../common/utility';
import { checkbox, checkbox_active } from '../../images';
import styles from './styles';

const InstanceView = ({
  communityInfo,
  style,
  showSelection,
  isSelected,
}: Props) => {
  let name = communityInfo.name;
  let url =
    communityInfo.instanceURL == '192.168.2.6'
      ? 'calpoly.cueback.com'
      : communityInfo.instanceURL;
  let imageURL = communityInfo.instanceImage;

  return (
    <View style={[styles.container, style]}>
      <StatusBar
        barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={Colors.NewThemeColor}
      />
      <View style={styles.instanceContainer}>
        <View style={styles.imageContainer}>
          <Image source={{uri: imageURL}} style={styles.image} />
        </View>
        <View style={styles.innerContainer}>
          <TextNew style={styles.name}>{name}</TextNew>

          <TextNew style={styles.url}>{url}</TextNew>
        </View>
      </View>
      {showSelection && (
        <Image
          style={styles.checkboxStyle}
          source={isSelected ? checkbox_active : checkbox}></Image>
      )}
    </View>
  );
};

export default InstanceView;
