import EStyleSheet from 'react-native-extended-stylesheet';
import { fontSize } from '../../../common/constants';

const Styles = EStyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    
      progressBar: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
      },
    
      nocontainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0.001,
        height: 0.001,
      },
    
      overlay: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 10,
      },
  });

export default Styles;