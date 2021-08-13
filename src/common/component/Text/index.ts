import React from 'react';
import { Text } from 'react-native';

const TextNew = (props: {[x: string]: any}) => {
    var newProps = {...props};
    var nStyle: {[x: string]: any} = {};
    if (Array.isArray(newProps.style)) {
        for (let item of newProps.style) {
            nStyle = {...nStyle, ...item}
        }
    } else {
        nStyle = {...newProps.style}
    }
    var style = {...nStyle, fontFamily: 'Rubik'}
    delete newProps.style
    return (
        React.createElement(Text,  {...newProps, style})
    )
}
export default TextNew;