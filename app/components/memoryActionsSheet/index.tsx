import React from 'react';
import {
  View,
  Image,
  Animated,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Modal,
  Keyboard,
  Platform,
} from 'react-native';
// import {fontSize, Colors} from '../../constants';
import { Actions } from 'react-native-router-flux';
// import TextNew from '../Text';
import Utility from './../../../src/common/utility';
import { No_Internet_Warning } from './../../../src/common/component/Toast';
import { blackStar, redstar } from './../../images'
import TextNew from '../../../src/common/component/Text';
import { Colors, fontSize } from '../../../src/common/constants';
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
  render() {
    if (this.state.hidden || this.props.actions.length == 0) {
      return <View style={{ height: 0, width: 0 }} />;
    } else {
      let actions = this.props.actions.sort((a: any, b: any) => (b.isDestructive - a.isDestructive)).reverse();

      return (
        <Modal transparent >
          <View
            style={{
              position: 'absolute',
              // backgroundColor: '#00000045',
              width: Dimensions.get('window').width * 1,
              // width: '100%',
              height: '100%',
              alignItems: 'center',
              top: 0,
              // right:20,
              flexDirection: 'row'
            }}
            onStartShouldSetResponder={() => true}
            onResponderStart={() => this.hideSheet()}>
            <TouchableOpacity style={{
              width: Dimensions.get('window').width * 0.4,
              height: '100%',

            }}
              onPress={() => this.hideSheet()}
            >

            </TouchableOpacity>

            <Animated.View
              style={{
                backgroundColor: Colors.actionBg,
                maxWidth: 768,
                marginRight: 20,
                // width: this.props.width,
                width: Dimensions.get('window').width * 0.6,
                position: 'absolute',
                alignSelf: 'center',
                bottom: this.state.bottom,
                marginBottom: Dimensions.get('window').height * 0.6,
                borderRadius: 20,
                right: 0
                // borderTopRightRadius: 10,
              }}>
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
                  style={{ borderRadius: 10, borderWidth: 1, borderColor: Colors.actionBg }}
                  // ItemSeparatorComponent={({ leadingItem }: { highlighted: boolean, leadingItem: MemoryActionsSheetItem }) => {
                  //     return (<View style={{ height: 1, backgroundColor: (leadingItem.index == (this.props.actions.length - 1)) ? 'rgba(0.35, 0.35, 0.35, 0.2)' : 'white' }} />)
                  // }}
                  renderItem={({
                    item: data,
                  }: {
                    item: MemoryActionsSheetItem;
                  }) => {
                    return (
                      <>
                        {this.firstpart == false && data.isDestructive == 1 ? this.doSome() : null}

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
                                Actions.popTo('addContent');
                            }
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              // justifyContent: 'space-between',
                              padding: 10,
                              paddingStart: 10,
                              // paddingStart: 24,
                              paddingRight: 20,
                              backgroundColor: Colors.actionBg,
                              height: 44,
                              borderBottomWidth: 0.5,
                              borderBottomColor: 'rgba(60, 60, 67, 0.36)',
                              borderTopLeftRadius: data.index == 1 ? 10 : 0,
                              borderTopRightRadius: data.index == 1 ? 10 : 0,
                              borderBottomLeftRadius: data.index == 4 ? 10 : 0,
                              borderBottomRightRadius: data.index == 4 ? 10 : 0,
                            }}>

                            {
                              Platform.OS == 'android' ?
                                <View
                                  style={{
                                    height: '100%',
                                    // width: 21,
                                    overflow: 'visible',
                                    marginLeft:20,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTopLeftRadius: data.index == 0 ? 10 : 0,
                                    borderTopRightRadius: data.index == 0 ? 10 : 0,
                                  }}>
                                  <Image source={data.image ? data.image : data.isDestructive == 1 ? redstar : blackStar} resizeMode="contain" />
                                  {/* <Image source={ data.isDestructive == 1 ? redstar : blackStar } resizeMode="contain" /> */}
                                </View>
                                :
                                null
                            }


                            <TextNew
                              style={{
                                color:
                                  data.isDestructive == 1
                                    ? Colors.NewRadColor
                                    : 'black',
                                marginLeft: 20,
                                ...fontSize(17),
                                fontWeight: '400',
                                lineHeight: 22,
                                letterSpacing: -0.4,
                              }}>
                              {data.text}
                            </TextNew>

                            {
                              Platform.OS == 'ios' ?
                                <View
                                  style={{
                                    height: '100%',
                                    overflow: 'visible',
                                    alignItems: 'center',
                                    position:'absolute',
                                    right:25,
                                    justifyContent: 'center',
                                    borderTopLeftRadius: data.index == 0 ? 10 : 0,
                                    borderTopRightRadius: data.index == 0 ? 10 : 0,
                                  }}>
                                  <Image source={data.image ? data.image : data.isDestructive == 1 ? redstar : blackStar} resizeMode="contain" />
                                </View>
                                :
                                null
                            }

                          </View>
                        </TouchableOpacity>
                      </>
                    );
                  }}
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
