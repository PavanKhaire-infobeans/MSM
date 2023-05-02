import React, { useState } from 'react';
import {
  Animated, Dimensions, FlatList, Image, Keyboard, Modal, TouchableWithoutFeedback, View
} from 'react-native';
import { No_Internet_Warning } from '../../../common/component/Toast';
import Utility from '../../../common/utility';
import { Colors } from '../../constants';
import TextNew from '../Text';
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
  destructive?: boolean
};

type Props = {
  actions: Array<MemoryActionsSheetItem>;
  memoryActions?: boolean;
  title?: any;
  onActionClick?: (index: number, data?: any) => void;
  width: string | number;
  popToAddContent?: boolean;
  navigation?: any
};
type State = { bottom: any; hidden: boolean };

const MemoryActionsSheet = (props: Props) => {

  const [state, setState] = useState({
    bottom: new Animated.Value(-height),
    hidden: true,
  });

  const showSheet = () => {
    if (Utility.isInternetConnected) {
      setState({ ...state, hidden: false });
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
        setState({ ...state, hidden: true });
      }, 20);
    });
  };

  const renderItem = ({
    item: data,
  }: {
    item: MemoryActionsSheetItem;
  }) => {
    return (
      <TouchableWithoutFeedback
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
        <View style={styles.subView}>
          <View style={styles.imageStyle}>
            <Image source={data.image} resizeMode="contain" />
          </View>
          <TextNew
            style={[
              styles.textStyle,
              {
                color:
                  data.isDestructive == 1
                    ? Colors.NewRadColor
                    : Colors.black,
              },
            ]}>
            {data.text}
          </TextNew>
        </View>
      </TouchableWithoutFeedback>
    );
  };


  if (state.hidden || props.actions.length == 0) {
    return <View style={styles.hiddenView} />;
  } else {
    return (
      <Modal transparent>
        <View
          style={styles.container}
          onStartShouldSetResponder={() => true}
          onResponderStart={() => hideSheet()}>
          <Animated.View
            style={[
              styles.animatedContainer,
              {
                width: props.width,
                bottom: state.bottom,
              },
            ]}>
            <View>
              <TextNew style={styles.memoryActionsText}>
                Memory Actions
              </TextNew>

              <FlatList
                data={props.actions}
                keyExtractor={(_, index: number) => `${index}`}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                onScroll={() => {
                  Keyboard.dismiss();
                }}
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

};

MemoryActionsSheet.defaultProps = {
  actions: [],
  width: '100%',
};
export default MemoryActionsSheet;