import React, { useState } from 'react';
import { View, StyleSheet, Text, Animated, TouchableOpacity } from 'react-native';

import { Header, Days } from '.';
import { useCalendar } from '../DatePicker';

const Calendar = () => {
  const { options, state, utils, onSelectedChange } = useCalendar();
  const [mainState] = state;
  const style = styles(options);
  const [{ shownAnimation }, changeMonthAnimation] = utils.useMonthAnimation(
    mainState.activeDate,
    options.daysAnimationDistance,
  );
  const [itemSize, setItemSize] = useState(0);

  // useEffect(() => {
  //   mainState.selectedDate && onSelectedChange(mainState.selectedDate);
  // }, [mainState.selectedDate, onSelectedChange]);

  const changeItemHeight = ({ nativeEvent }) => {
    const { width } = nativeEvent.layout;
    !itemSize && setItemSize((width / 7).toFixed(2) * 1 - 0.5);
  };

  return (
    <View style={style.container} onLayout={changeItemHeight}>
      <Header changeMonth={changeMonthAnimation} />
      <View style={[style.daysName, utils.flexDirection,]} >
        {utils.config.dayNamesShort.map(item => (
          <Text key={item} style={[style.daysNameText, {
            // width: itemSize,
            // height: itemSize,
          }]}>
            {item}
          </Text>
        ))}
      </View>
      <View style={style.daysContainer}>
        <Animated.View style={[style.days, shownAnimation]}>
          <Days />
        </Animated.View>
      </View>
      <View style={style.footer}>
        <TouchableOpacity
          style={[style.button, style.cancelButton]}
          onPress={() => {
            mainState.selectedDate && onSelectedChange("");
          }}
          activeOpacity={0.8}>
          <Text style={[style.btnText, { color: '#0B0C0F' }]}>{utils.config.timeClose}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button} activeOpacity={0.8} onPress={() => {
          mainState.selectedDate && onSelectedChange(mainState.selectedDate);
        }}>
          <Text style={style.btnText}>{utils.config.timeSelect}</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      // flex: 1,
      width: '100%',
      height: 400,
      alignSelf: 'center',
      borderRadius: 12,
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingTop: 16
    },
    daysName: {
      // paddingBottom: 10,
      marginBottom: 5,
      alignItems: 'center',
      justifyContent: 'space-around',
      // borderBottomColor: theme.borderColor,
      // borderBottomWidth: 1,
      marginHorizontal: 16,
    },
    daysNameText: {
      fontFamily: theme.defaultFont,
      color: '#c4c4c6',
      fontSize: 13,//theme.textFontSize,
      fontWeight: '600'
    },
    daysContainer: {
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      marginHorizontal: 12,
      marginTop: 5,
      marginBottom: 0,
    },
    days: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      right: 0,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      // marginTop: 15,
    },
    button: {
      paddingVertical: 17.5,
      paddingHorizontal: 40,
      borderRadius: 8,
      backgroundColor: '#052747',
      margin: 8,
    },
    btnText: {
      fontSize: 17,//theme.textFontSize,
      color: theme.selectedTextColor,
      fontFamily: theme.defaultFont,
    },
    cancelButton: {
      backgroundColor: '#ffffff',
      borderColor: '#E2E4E9',
      borderWidth: 2,
    },
  });

export { Calendar };
