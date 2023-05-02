import React, { useEffect, useState } from 'react';
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
const PlaceholderImageView =(props:Props) => {
  const [state,setState] = useState({
    uri: '',
    showErrorImage: false,
    showDefaultImage: true,
    resizeMode: 'contain',
  });

  useEffect(()=>{
    setTimeout(() => {
      setState({ ...state,showDefaultImage: false });
    }, 100);
  },[])
 

  const getImageToLoad = () => {
    if (state.showErrorImage) {
      if (props.openPDF) {
        return pdf_icon;
      }
      return props.profilePic ? profile_placeholder : default_error_img;
    } else if (state.showDefaultImage) {
      if (props.openPDF) {
        return pdf_icon;
      }
      return props.profilePic ? profile_placeholder : default_placeholder;
    } else {
      if (props.uri != '') {
        return { uri: props.uri };
      } else {
        return props.profilePic ? profile_placeholder : default_error_img;
      }
    }
  };

    return (
      // <CustomFastImage
      //   style={props.style}
      //   url={getImageToLoad()}
      // />
      <Image
        style={props.style}
        source={getImageToLoad()}
        defaultSource={
          props.profilePic ? profile_placeholder : default_placeholder
        }
        borderRadius={props.borderRadius ? props.borderRadius : 0}
        onError={() =>
          setState({
            ...state,
            showErrorImage: true,
            resizeMode: 'center',
          })
        }
        resizeMode={
          state.resizeMode.length > 0 ? state.resizeMode
            : props.profilePic
              ? 'stretch'
              :
              'contain'
        }
      />
    );
}
export default PlaceholderImageView;