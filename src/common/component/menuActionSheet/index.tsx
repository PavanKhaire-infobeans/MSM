import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList, Keyboard, Modal, Platform, TouchableOpacity, View
} from 'react-native';
// import {fontSize, Colors} from '../../constants';
import Utility from '../../utility';
// import TextNew from '../Text';
import TextNew from '../Text';
import { No_Internet_Warning } from './../Toast';
import styles from './styles';
const { height } = Dimensions.get('window');

export type MemoryActionsSheetItem = {
  index: number;
  image: object;
  isDestructive?: number;
  text: string;
  nid?: any;
  memoryType?: any;
  actionType?: any;
  uid?: any;
};

type Props = {
  actions: Array<MemoryActionsSheetItem>;
  memoryActions?: boolean;
  title?: any;
  onActionClick?: (index: number, data?: any) => void;
  width: string | number;
  popToAddContent?: boolean;
  navigation?: any;
};
type State = { bottom: any; hidden: boolean };

const MemoryActionsSheet = (props: Props) => {

  const [state, setState] = useState({
    bottom: new Animated.Value(-height),
    hidden: true,
  });
  const [firstpart,setfirstpart] = useState(false);
  const showSheet = () => {
    if (Utility.isInternetConnected) {
      setState({ ...state, hidden: false })
      setTimeout(() => {
        Animated.timing(state.bottom, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }, 100);

    } else {
      No_Internet_Warning();
    }
  };

  const hideSheet = () => {
    Animated.timing(state.bottom, {
      toValue: -height,
      duration: 50,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setState({ ...state, hidden: true })
        setfirstpart(false);
      }, 20);
    });
  };

  const doSome = () => {
    setfirstpart(true);
    return (
      <View style={{ height: 8, backgroundColor: 'linear-gradient(0deg, rgba(20, 20, 20, 0.15), rgba(20, 20, 20, 0.15)), rgba(255, 255, 255, 0.7)' }}></View>
    )
  }

  const renderItem = ({
    item: data,
  }: {
    item: MemoryActionsSheetItem;
  }) => {
    return (
      <>
        {firstpart == false && data.isDestructive == 1
          ? doSome()
          : null}

        <TouchableOpacity
          onPress={() => {
            props.memoryActions
              ? props.onActionClick &&
              props.onActionClick(data.index, data)
              : props.onActionClick &&
              props.onActionClick(data.index);
            hideSheet();
            Keyboard.dismiss();

            {
              props.popToAddContent &&
                props.navigation.popTo('addContent');
            }
          }}>
          <View
            style={[
              styles.flatlistContainer,
              {
                borderTopLeftRadius: data.index == 1 ? 10 : 0,
                borderTopRightRadius: data.index == 1 ? 10 : 0,
              },
            ]}>
            {Platform.OS == 'android' ? (
              <View
                style={[
                  styles.ioSContainer,
                  {
                    borderTopLeftRadius:
                      data.index == 0 ? 10 : 0,
                    borderTopRightRadius:
                      data.index == 0 ? 10 : 0,
                  },
                ]}>
                {/* <Image source={data.image ? data.image : data.isDestructive == 1 ? redstar : blackStar} resizeMode="contain" /> */}
                {/* <Image source={ data.isDestructive == 1 ? redstar : blackStar } resizeMode="contain" /> */}
              </View>
            ) : null}

            <TextNew style={styles.textStyle}>
              {data.text}
            </TextNew>

            {Platform.OS == 'ios' ? (
              <View
                style={[
                  styles.iosTextStyle,
                  {
                    borderTopLeftRadius:
                      data.index == 0 ? 10 : 0,
                    borderTopRightRadius:
                      data.index == 0 ? 10 : 0,
                  },
                ]}>
                {/* <Image source={data.image ? data.image : data.isDestructive == 1 ? redstar : blackStar} resizeMode="contain" /> */}
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      </>
    );
  };

  if (state.hidden || props.actions.length == 0) {
    return <View style={styles.hiddenView} />;
  } else {
    let actions = props.actions.sort((a: any, b: any) => (b.isDestructive - a.isDestructive)).reverse();

    return (
      <Modal transparent >
        <View
          style={styles.container}
          onStartShouldSetResponder={() => true}
          onResponderStart={() => hideSheet()}>
          <TouchableOpacity style={styles.ActionView}
            onPress={() => hideSheet()}
          >
          </TouchableOpacity>

          <Animated.View

            style={[styles.AnimatedContainer, { bottom: state.bottom, }]}>
            <View>

              <FlatList
                data={actions}
                keyExtractor={(_, index: number) => `${index}`}
                onScroll={() => {
                  Keyboard.dismiss();
                }}
                style={styles.flatListStyle}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                // ItemSeparatorComponent={({ leadingItem }: { highlighted: boolean, leadingItem: MemoryActionsSheetItem }) => {
                //     return (<View style={{ height: 1, backgroundColor: (leadingItem.index == (props.actions.length - 1)) ? 'rgba(0.35, 0.35, 0.35, 0.2)' : 'white' }} />)
                // }}
                renderItem={renderItem}
              />
            </View>
          </Animated.View>

        </View>
      </Modal>
    );
  }
}
MemoryActionsSheet.defaultProps = {
  actions: [],
  width: '100%',
};
export default MemoryActionsSheet;