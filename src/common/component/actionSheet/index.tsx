import React, { useState, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  Image,
  Animated,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { fontSize, Colors } from '../../constants';
import { Actions } from 'react-native-router-flux';
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
    }).start();
  };

  const hideSheet = () => {
    Animated.timing(state.bottom, {
      toValue: -height,
      duration: 200,
    }).start(() => {
      setTimeout(() => {
        setState(prevState =>
        ({
          ...prevState,
          hidden: true
        }))
      }, 20);
    });
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
        }).start();
      },
      hideSheet: () => {
        Animated.timing(state.bottom, {
          toValue: -height,
          duration: 200,
        }).start(() => {
          setTimeout(() => {
            setState(prevState =>
            ({
              ...prevState,
              hidden: true
            }))
          }, 20);
        });
      }

    }));

  if (state.hidden || props.actions.length == 0) {
    return <View style={{ height: 0, width: 0 }} />;
  }
  else {
    return (
      <Modal
        animationType="none"
        transparent={true}
        // onRequestClose={() => { setShowModal(false)}}
        style={{ backgroundColor: Colors.blacknewrgb, flex: 1 }}
        visible={true}//showModal
      >
        <View
          style={styles.container}>
          <Animated.View
            style={[styles.cellContainer, { width: props.width, bottom: state.bottom, borderRadius: 13 }]}>

            <View>
              {props.title && props.title.length > 0 ? (
                <TextNew
                  style={styles.textTitle}>
                  {props.title}
                </TextNew>
              ) : (
                <View></View>
              )}

              <FlatList
                data={props.actions}
                keyExtractor={(_, index: number) => `${index}`}
                scrollEnabled={false}
                style={{ borderRadius: 13 }}
                onScroll={() => {
                  Keyboard.dismiss();
                }}
                ListHeaderComponent={() => (
                  <View
                    style={[styles.listContainer, {
                      borderTopLeftRadius: 13,
                      borderTopRightRadius: 13,
                      borderBottomColor: Colors.a5a5a7,
                      height: 42,
                      borderBottomWidth: 1
                    }]}>
                    {/* <Image source={data.image} resizeMode="contain" /> */}
                    <TextNew
                      style={[styles.listText, {
                        color: Colors.c3c3c3,
                        ...fontSize(13),
                        textAlign: 'center'
                      }]}>
                      {props.actions && props.actions.length && props.actions[0] && props.actions[0].text.includes('Yes,') ? `Are you done writing this memory?` : `Save for later?`}
                    </TextNew>
                  </View>
                )}
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
                renderItem={({ item: data }: { item: ActionSheetItem }) => {
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
                }}
              />
            </View>
          </Animated.View>
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