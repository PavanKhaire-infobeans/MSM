import React from 'react';
//@ts-ignore
import { Image, View } from 'react-native';
import { UserData } from '../../loginStore/database';
import Text from '../Text';
import styles from './styles';

type Props = {communityInfo: UserData; style?: any};

const CommunityBanner = ({communityInfo, style}: Props) => {
  let name = communityInfo.name;
  let url =
    communityInfo.instanceURL == '192.168.2.6'
      ? 'calpoly.cueback.com'
      : communityInfo.instanceURL;
  let imageURL = communityInfo.instanceImage;

  return (
    <View style={style || styles.container}>
      <View style={styles.imageContainer}>
        <Rounded imageURL={imageURL} style={styles.image} />
      </View>
      <View style={styles.innerContainer}>
        <Text style={styles.name}>{name}</Text>

        <Text style={styles.url}>{url}</Text>
      </View>
    </View>
  );
};

const Rounded = (props: {[x: string]: any}) => {
  return <Image source={{uri: props.imageURL}} style={props.style} />;
};

export default CommunityBanner;
