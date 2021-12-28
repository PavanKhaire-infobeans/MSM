import {requireNativeComponent, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';

module.exports = requireNativeComponent('AllMemoriesComponent', {
    name: "AllMemoriesComponent",
    propTypes: {
        ...ViewPropTypes
    }
});