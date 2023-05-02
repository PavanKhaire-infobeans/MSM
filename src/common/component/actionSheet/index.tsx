import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Animated, Dimensions, FlatList, Keyboard, Modal, TouchableWithoutFeedback, View
} from 'react-native';
import { Colors, fontSize } from '../../constants';
import TextNew from '../Text';
import styles from './styles';

const { height } = Dimensions.get('window');

export type ActionSheetItem = {
  index: number;
  image: object;
  isDestructive?: number;
  text: string;
  nid?: any;
  memoryType?: any;
  actionType?: any;
};

type Props = {
  actions: Array<ActionSheetItem>;
  memoryActions?: boolean;
  title?: any;
  onActionClick?: (index: number, data?: any) => void;
  width: string | number;
  popToAddContent?: boolean;
};
type State = { bottom: any; hidden: boolean };

const ActionSheet = forwardRef((props: Props, ref: any) => {

  const [state, setState] = useState({
    bottom: new Animated.Value(-height),
    hidden: true,
  });
  const [showModal, setShowModal] = useState(true);

  const showSheet = () => {
    setState(prevState =>
    ({
      ...prevState,
      hidden: false
    }))

    Animated.timing(state.bottom, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const hideSheet = () => {
    Animated.timing(state.bottom, {
      toValue: -height,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // setTimeout(() => {
      setState(prevState =>
      ({
        ...prevState,
        hidden: true
      }))
      // }, 20);
    });
  };

  const listHeader = () => (
    <View
      style={[styles.listContainer, styles.listHeaderStyle]}>
      {/* <Image source={data.image} resizeMode="contain" /> */}
      <TextNew
        style={[styles.listText, styles.actionSheetHeaderText]}>
        {props.actions && props.actions.length && props.actions[0] && props.actions[0].text.includes('Yes,') ? `Are you done writing this memory?` : `Save for later?`}
      </TextNew>
    </View>
  );

  const renderItem = ({ item: data }: { item: ActionSheetItem }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          props.memoryActions ? props.onActionClick && props.onActionClick(data.index, data)
            : props.onActionClick && props.onActionClick(data.index);
          hideSheet();
          Keyboard.dismiss();
          // {
          //   props.popToAddContent &&
          //     Actions.popTo('addContent');
          // }
          // setShowModal(false)
        }}>
        <View
          style={[styles.listContainer, {
            borderRadius: data.text.toLowerCase().includes('cancel') ? 13 : 0,
            borderBottomColor: Colors.a5a5a7,
            borderBottomWidth: 1,
            borderBottomLeftRadius: data.index == props.actions.length - 2 ? 13 : 0,
            borderBottomRightRadius: data.index == props.actions.length - 2 ? 13 : 0,
            backgroundColor: data.text.toLowerCase().includes('cancel') ? Colors.white : Colors.e0e0e0
          }]}>
          {/* <Image source={data.image} resizeMode="contain" /> */}
          <TextNew
            style={[styles.listText, {
              color: data.text.includes('No,') ? Colors.systemRed : Colors.systemBlue,
              fontWeight: data.index == props.actions.length - 1 ? '600' : '400',
              textAlign: 'center'
            }]}>
            {data.text}
          </TextNew>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  useImperativeHandle(ref,
    () => ({
      showSheet: () => {
        setState(prevState =>
        ({
          ...prevState,
          hidden: false
        }))

        Animated.timing(state.bottom, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
      hideSheet: () => {
        Animated.timing(state.bottom, {
          toValue: -height,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          // setTimeout(() => {
          setState(prevState =>
          ({
            ...prevState,
            hidden: true
          }))
          // }, 20);
        });
      }

    }));

  if (state.hidden || props.actions.length == 0) {
    return <View style={styles.hiddenView} />;
  }
  else {
    return (
      <Modal
        animationType="none"
        transparent={true}
        // onRequestClose={() => { setShowModal(false)}}
        style={styles.modalStyle}
        visible={true}//showModal
      >
        <View
          style={styles.container}>
          <Animated.View
            style={[styles.cellContainer, { width: props.width, bottom: 0 }]}>

            <View>
              {props.title && props.title.length > 0 ? (
                <></>
                // <TextNew
                //   style={styles.textTitle}>
                //   {props.title}
                // </TextNew>
              ) : (
                <View></View>
              )}

              <FlatList
                data={props.actions}
                keyExtractor={(_, index: number) => `${index}`}
                scrollEnabled={false}
                style={styles.borderRadius13}
                onScroll={() => {
                  Keyboard.dismiss();
                }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                initialNumToRender={props.actions.length}
                removeClippedSubviews={true}
                ListHeaderComponent={listHeader}
                ItemSeparatorComponent={({
                  leadingItem,
                }: {
                  highlighted: boolean;
                  leadingItem: ActionSheetItem;
                }) => {
                  return (
                    <View
                      style={[styles.flatlistContainer, {
                        backgroundColor: leadingItem.index == props.actions.length - 2 ? Colors.transparent : Colors.blacknewrgb,
                        height: leadingItem.index == props.actions.length - 2 ? 8 : 0
                      }]}
                    />
                  );
                }}
                renderItem={renderItem}
              />
            </View>
          </Animated.View>
          {/* <View style={{height: parseInt(state.bottom)}}></View> */}
        </View>
      </Modal>
    );
  }

});

ActionSheet.defaultProps = {
  actions: [],
  width: '100%',
};

export default ActionSheet;