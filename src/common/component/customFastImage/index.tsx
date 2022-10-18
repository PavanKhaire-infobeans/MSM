import React from 'react';
import FastImage from 'react-native-fast-image'
import { default_placeholder } from '../../../images';

const CustomFastImage = (props) => (
    <FastImage
        style={props.style}
        source={{
            uri: props.url,
            // headers: { Authorization: 'someAuthToken' },
            priority: FastImage.priority.high,
        }}
        fallback={default_placeholder}
        resizeMode={FastImage.resizeMode.contain}
    />
);

export default CustomFastImage;