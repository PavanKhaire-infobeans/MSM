import React, { Component } from 'react';
import { Image } from 'react-native';
import {
  default_placeholder,
  default_error_img,
  profile_placeholder,
  pdf_icon,
} from '../../../images';
type State = { [x: string]: any };
type Props = {
  uri: any;
  style: any;
  resizeMode?: any;
  profilePic?: any;
  borderRadius?: any;
  openPDF?: any;
};
export default class PlaceholderImageView extends Component<Props> {
  state: State = {
    uri: '',
    showErrorImage: false,
    showDefaultImage: true,
    resizeMode: '',
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showDefaultImage: false });
    }, 100);
  }

  getImageToLoad = () => {
    if (this.state.showErrorImage) {
      if (this.props.openPDF) {
        return pdf_icon;
      }
      return this.props.profilePic ? profile_placeholder : default_error_img;
    } else if (this.state.showDefaultImage) {
      if (this.props.openPDF) {
        return pdf_icon;
      }
      return this.props.profilePic ? profile_placeholder : default_placeholder;
    } else {
      if (this.props.uri != '') {
        return { uri: this.props.uri };
      } else {
        return this.props.profilePic ? profile_placeholder : default_error_img;
      }
    }
  };

  render() {
    return (
      // <CustomFastImage
      //   style={this.props.style}
      //   url={this.getImageToLoad()}
      // />
      <Image
        style={this.props.style}
        source={this.getImageToLoad()}
        defaultSource={
          this.props.profilePic ? profile_placeholder : default_placeholder
        }
        borderRadius={this.props.borderRadius ? this.props.borderRadius : 0}
        onError={() =>
          this.setState({
            showErrorImage: true,
            resizeMode: 'center',
          })
        }
        resizeMode={
          this.state.resizeMode.length > 0
            ? this.state.resizeMode
            : this.props.profilePic
              ? 'stretch'
              :
              'contain'
        }
      />
    );
  }
}
