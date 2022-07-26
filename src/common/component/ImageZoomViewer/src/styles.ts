import EStyleSheet from 'react-native-extended-stylesheet';

const Styles = EStyleSheet.create({
  overlayStyle:{
    flex: 1,
    overflow: 'hidden',
  },
  footerStyle:{ 
    bottom: 0, 
    position: 'absolute', 
    zIndex: 9 
  },
});

export default Styles;