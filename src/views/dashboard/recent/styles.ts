import EStyleSheet from 'react-native-extended-stylesheet';
import { fontSize } from '../../../common/constants';

const Styles = EStyleSheet.create({
    normalText: {
        ...fontSize(16),
        fontWeight: "normal",
        color: "#595959",
        marginBottom: 10
    },
    boxShadow: {
        shadowOpacity: 1,
        shadowColor: '#D9D9D9',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 }
    },
  });

export default Styles;