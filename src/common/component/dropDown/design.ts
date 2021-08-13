import { StyleSheet } from 'react-native';
import { fontSize } from '../../constants';

export const styles = StyleSheet.create({
    inputViewStyle: {
      flex: 1,
      height: 50,
      backgroundColor: 'transparent',
      borderWidth: 0.3,
      borderColor: 'transparent',
      borderRadius: 3,
      justifyContent: "center",
      paddingLeft: 8,
      paddingRight: 3,
      paddingTop: 3
    },
    inputTextStyle: {
      top: 12,
      ...fontSize(18),
      height: "100%",
      color: 'black',
      lineHeight: 24,
      letterSpacing: -0.1,
      paddingRight: 20      
    }
});