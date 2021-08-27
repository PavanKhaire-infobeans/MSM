import React from 'react';
import {
  View,
  Image,
  Animated,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import {fontSize, Colors} from '../../constants';
import {Actions} from 'react-native-router-flux';
import TextNew from '../Text';
const {height} = Dimensions.get('window');

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
type State = {bottom: any; hidden: boolean};

export default class ActionSheet extends React.Component<Props, State> {
  static defaultProps: Props = {
    actions: [],
    width: '100%',
  };

  state: State = {
    bottom: new Animated.Value(-height),
    hidden: true,
  };

  showSheet = () => {
    this.setState({hidden: false}, () => {
      Animated.timing(this.state.bottom, {
        toValue: 0,
        duration: 200,
      }).start();
    });
  };

  hideSheet = () => {
    Animated.timing(this.state.bottom, {
      toValue: -height,
      duration: 200,
    }).start(() => {
      setTimeout(() => {
        this.setState({hidden: true});
      }, 20);
    });
  };

  render() {
    if (this.state.hidden || this.props.actions.length == 0) {
      return <View style={{height: 0, width: 0}} />;
    } else {
      return (
        <View
          style={{
            position: 'absolute',
            backgroundColor: '#00000045',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            top: 0,
          }}>
          <Animated.View
            style={{
              backgroundColor: 'white',
              maxWidth: 768,
              width: this.props.width,
              position: 'absolute',
              bottom: this.state.bottom,
              paddingBottom: 15,
            }}>
            <View>
              {this.props.title && this.props.title.length > 0 ? (
                <TextNew
                  style={{
                    color: '#595959',
                    paddingTop: 15,
                    paddingStart: 24,
                    height: 56,
                    ...fontSize(18),
                    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
                  }}>
                  {this.props.title}
                </TextNew>
              ) : (
                <View></View>
              )}

              <FlatList
                data={this.props.actions}
                keyExtractor={(_, index: number) => `${index}`}
                onScroll={() => {
                  Keyboard.dismiss();
                }}
                ItemSeparatorComponent={({
                  leadingItem,
                }: {
                  highlighted: boolean;
                  leadingItem: ActionSheetItem;
                }) => {
                  return (
                    <View
                      style={{
                        height: 1,
                        backgroundColor:
                          leadingItem.index == this.props.actions.length - 2
                            ? 'rgba(0.35, 0.35, 0.35, 0.2)'
                            : 'white',
                      }}
                    />
                  );
                }}
                renderItem={({item: data}: {item: ActionSheetItem}) => {
                  return (
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
                          padding: 10,
                          paddingStart: 24,
                          height: 56,
                        }}>
                        <Image source={data.image} resizeMode="contain" />
                        <TextNew
                          style={{
                            color:
                              data.isDestructive == 1
                                ? Colors.NewRadColor
                                : 'black',
                            marginLeft: 24,
                            ...fontSize(18),
                          }}>
                          {data.text}
                        </TextNew>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </Animated.View>
          {/* <View style={{height: 50, width:"100%", backgroundColor: "#fff", bottom: -50, position:"absolute"}}></View> */}
        </View>
      );
    }
  }
}
