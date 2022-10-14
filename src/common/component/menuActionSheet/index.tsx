import React from 'react';
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
  firstpart = false;
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
        this.setState({ hidden: true }, () => this.firstpart = false);
      }, 20);
    });
  };

  doSome() {
    this.firstpart = true;
    return (
      <View style={{ height: 8, backgroundColor: 'linear-gradient(0deg, rgba(20, 20, 20, 0.15), rgba(20, 20, 20, 0.15)), rgba(255, 255, 255, 0.7)' }}></View>
    )
  }

  renderItem = ({
    item: data,
  }: {
    item: MemoryActionsSheetItem;
  }) => {
    return (
      <>
        {this.firstpart == false && data.isDestructive == 1
          ? this.doSome()
          : null}

        <TouchableOpacity
          onPress={() => {
            this.props.memoryActions
              ? this.props.onActionClick &&
              this.props.onActionClick(data.index, data)
              : this.props.onActionClick &&
              this.props.onActionClick(data.index);
            this.hideSheet();
            Keyboard.dismiss();

            {
              this.props.popToAddContent &&
                this.props.navigation.popTo('addContent');
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

  render() {
    if (this.state.hidden || this.props.actions.length == 0) {
      return <View style={styles.hiddenView} />;
    } else {
      let actions = this.props.actions.sort((a: any, b: any) => (b.isDestructive - a.isDestructive)).reverse();

      return (
        <Modal transparent >
          <View
            style={styles.container}
            onStartShouldSetResponder={() => true}
            onResponderStart={() => this.hideSheet()}>
            <TouchableOpacity style={styles.ActionView}
              onPress={() => this.hideSheet()}
            >
            </TouchableOpacity>

            <Animated.View

              style={[styles.AnimatedContainer, { bottom: this.state.bottom, }]}>
              <View>
                {/* <TextNew
                  style={{
                    color: Colors.TextColor,
                    paddingTop: 15,
                    paddingStart: 24,
                    height: 56,
                    ...fontSize(18),
                    fontWeight: 'bold',
                  }}>
                  Memory Actions
                </TextNew> */}
                {/* {this.props.title && this.props.title.length > 0 ?                          
                        <View></View>
                        } */}

                <FlatList
                  data={actions}
                  keyExtractor={(_, index: number) => `${index}`}
                  onScroll={() => {
                    Keyboard.dismiss();
                  }}
                  style={styles.flatListStyle}
                  // ItemSeparatorComponent={({ leadingItem }: { highlighted: boolean, leadingItem: MemoryActionsSheetItem }) => {
                  //     return (<View style={{ height: 1, backgroundColor: (leadingItem.index == (this.props.actions.length - 1)) ? 'rgba(0.35, 0.35, 0.35, 0.2)' : 'white' }} />)
                  // }}
                  renderItem={this.renderItem}
                />
              </View>
            </Animated.View>

            {/* <View style={{height: 50, width:"100%", backgroundColor: "#fff", bottom: -50, position:"absolute"}}></View> */}
          </View>
        </Modal>
      );
    }
  }
}
