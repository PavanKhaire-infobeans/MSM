import { requireNativeComponent, ViewPropTypes } from 'react-native';

module.exports = requireNativeComponent('AllMemoriesComponent', {
    name: "AllMemoriesComponent",
    propTypes: {
        ...ViewPropTypes
    }
});