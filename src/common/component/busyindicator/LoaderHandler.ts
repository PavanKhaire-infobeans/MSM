import { DeviceEventEmitter } from 'react-native';
const loaderHandler = {
  hideLoader () {
    DeviceEventEmitter.emit('changeLoadingEffect', {isVisible: false});
  },
  showLoader (title?: string) {
    DeviceEventEmitter.emit('changeLoadingEffect', {title: title || "Loading...", isVisible: true});
  }
};

export default loaderHandler;