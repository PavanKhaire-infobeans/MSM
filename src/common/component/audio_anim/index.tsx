import React, { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';

import Styles from './styles';
const duration = 44;
const multiPlier = 1.96;
const Animator = () => {
  let views: Array<string> = [
    'first',
    'second',
    'third',
    'fourth',
    'fifth',
    'sixth',
    'seventh',
  ];
  let isUnmounted: boolean = false;
  // state: {
  //   direction: {[x: string]: 'up' | 'down'};
  //   anim: {[x: string]: Animated.Value};
  // }
  const [state, setState] = useState({
    direction: {
      first: 'up',
      second: 'up',
      third: 'down',
      fourth: 'down',
      fifth: 'down',
      sixth: 'up',
      seventh: 'up',
    },
    anim: {
      first: new Animated.Value(Math.pow(multiPlier, 2)),
      second: new Animated.Value(Math.pow(multiPlier, 3)),
      third: new Animated.Value(Math.pow(multiPlier, 4)),
      fourth: new Animated.Value(Math.pow(multiPlier, 5)),
      fifth: new Animated.Value(Math.pow(multiPlier, 4)),
      sixth: new Animated.Value(Math.pow(multiPlier, 3)),
      seventh: new Animated.Value(Math.pow(multiPlier, 2)),
    },
  });

  const powerOf = (value: number, times: number = 1): number => {
    if (value !== Math.pow(multiPlier, times)) {
      return powerOf(value, times + 1);
    }
    return times;
  };

  const getNext = (value: Animated.Value, direction: string): { value: number; direction: string } => {
    var power = powerOf((value as any)._value);
    power = direction == 'up' ? power + 1 : power - 1;
    let val = Math.pow(multiPlier, power);
    return {
      value: val,
      direction:
        val == Math.pow(multiPlier, 5)
          ? 'down'
          : val == Math.pow(multiPlier, 2)
            ? 'up'
            : direction,
    };
  }

  const play = () => {
    if (isUnmounted) return;
    var value: { [x: string]: { value: number; direction: string } } = {};
    let { anim, direction } = { ...state };
    for (let it of views) {
      value[it] = getNext(anim[it] as Animated.Value, direction[it]);
    }
    // Animated.parallel([
    //   Animated.timing(state.anim.first, {
    //     toValue: value.first.value,
    //     duration,
    //     useNativeDriver: false,
    //   }),
    //   Animated.timing(state.anim.second, {
    //     toValue: value.second.value,
    //     duration,
    //     useNativeDriver: false,
    //   }),
    //   Animated.timing(state.anim.third, {
    //     toValue: value.third.value,
    //     duration,
    //     useNativeDriver: false,
    //   }),
    //   Animated.timing(state.anim.fourth, {
    //     toValue: value.fourth.value,
    //     duration,
    //     useNativeDriver: false,
    //   }),
    //   Animated.timing(state.anim.fifth, {
    //     toValue: value.fifth.value,
    //     duration,
    //     useNativeDriver: false,
    //   }),
    //   Animated.timing(state.anim.sixth, {
    //     toValue: value.sixth.value,
    //     duration,
    //     useNativeDriver: false,
    //   }),
    //   Animated.timing(state.anim.seventh, {
    //     toValue: value.seventh.value,
    //     duration,
    //     useNativeDriver: false,
    //   }),
    // ]).start(_ => {
    //   var direction: { [x: string]: string } = { ...state.direction };
    //   for (let key in value) {
    //     direction[key] = value[key].direction;
    //   }
    //   setState(prev => ({
    //     ...prev,
    //     direction: direction,
    //   }));
    //   setTimeout(() => {
    //     play();
    //   }, duration)
    // });
  }

  useEffect(() => {
    play();

    return () => {
      isUnmounted = true;
    }
  }, [])


  return (
    <View
      style={Styles.audioContainer}>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.first,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.second,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.third,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.fourth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.fifth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.sixth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.seventh,
        }]}></Animated.View>

      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.first,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.second,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.third,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.fourth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.fifth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.sixth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.seventh,
        }]}></Animated.View>

      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.first,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.second,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.third,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.fourth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.fifth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.sixth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.seventh,
        }]}></Animated.View>

      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.first,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.second,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.third,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.fourth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.fifth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.sixth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.seventh,
        }]}></Animated.View>

      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.first,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.second,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.third,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.fourth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.fifth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.sixth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.seventh,
        }]}></Animated.View>

      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.first,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.second,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.third,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.fourth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.fifth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.sixth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.seventh,
        }]}></Animated.View>

      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.first,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.second,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.third,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.fourth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.fifth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.sixth,
        }]}></Animated.View>
      <Animated.View
        style={[Styles.commonStyle, {
          height: state.anim.seventh,
        }]}></Animated.View>
    </View>
  );
}

interface Props {
  style: any;
  play: boolean;
};

const MainView = (props: Props) => {
  if (props.play) {
    return (
      <View
        style={[
          props.style, Styles.container
        ]}>
        {/* <Animator /> */}
      </View>
    );
  } else {
    return <View style={props.style} />;
  }
}

export default MainView;