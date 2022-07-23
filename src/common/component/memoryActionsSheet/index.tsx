import React from 'react';
import {
  Animated,Dimensions,FlatList, Image, Keyboard, Modal, TouchableWithoutFeedback, View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
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
};

type Props = {
  actions: Array<MemoryActionsSheetItem>;
  memoryActions?: boolean;
  title?: any;
  onActionClick?: (index: number, data?: any) => void;
  width: string | number;
  popToAddContent?: boolean;
};
type State = { bottom: any; hidden: boolean };

export default class MemoryActionsSheet extends React.Component<Props, State> {
  static defaultProps: Props = {
    actions: [],
    width: '100%',
  };

  state: State = {
    bottom: new Animated.Value(-height),
    hidden: true,
  };

  showSheet = () => {
    if (Utility.isInternetConnected) {
      this.setState({ hidden: false }, () => {
        Animated.timing(this.state.bottom, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else {
      No_Internet_Warning();
    }
  };

  hideSheet = () => {
    Animated.timing(this.state.bottom, {
      toValue: -height,
      duration: 50,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        this.setState({ hidden: true });
      }, 20);
    });
  };

  render() {
    if (this.state.hidden || this.props.actions.length == 0) {
      return <View style={styles.hiddenView} />;
    } else {
      return (
        <Modal transparent>
          <View
            style={styles.container}
            onStartShouldSetResponder={() => true}
            onResponderStart={() => this.hideSheet()}>
            <Animated.View
              style={[styles.animatedContainer, {
                width: this.props.width,
                bottom: this.state.bottom,
              }]}>
              <View>
                <TextNew
                  style={styles.memoryActionsText}>
                  Memory Actions
                </TextNew>
                {/* {this.props.title && this.props.title.length > 0 ?                          
                        <View></View>
                        } */}

                <FlatList
                  data={this.props.actions}
                  keyExtractor={(_, index: number) => `${index}`}
                  onScroll={() => {
                    Keyboard.dismiss();
                  }}
                  // ItemSeparatorComponent={({ leadingItem }: { highlighted: boolean, leadingItem: MemoryActionsSheetItem }) => {
                  //     return (<View style={{ height: 1, backgroundColor: (leadingItem.index == (this.props.actions.length - 1)) ? 'rgba(0.35, 0.35, 0.35, 0.2)' : 'white' }} />)
                  // }}
                  renderItem={({
                    item: data,
                  }: {
                    item: MemoryActionsSheetItem;
                  }) => {
                    return (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.props.memoryActions ? this.props.onActionClick && this.props.onActionClick(data.index, data)
                            : this.props.onActionClick && this.props.onActionClick(data.index);
                          this.hideSheet();
                          Keyboard.dismiss();
                          {
                            this.props.popToAddContent &&
                              Actions.popTo('addContent');
                          }
                        }}>
                        <View
                          style={styles.subView}>
                          <View
                            style={styles.imageStyle}>
                            <Image source={data.image} resizeMode="contain" />
                          </View>
                          <TextNew
                            style={[styles.textStyle, {
                              color: data.isDestructive == 1 ? Colors.NewRadColor : Colors.black,

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
  }
}
