import React from 'react';
import { View, Image, Animated, Dimensions, FlatList, TouchableOpacity, Modal, Keyboard } from 'react-native';
import { fontSize, Colors } from '../../constants';
import { Actions } from 'react-native-router-flux';
import TextNew from '../Text';
import Utility from '../../../common/utility';
import { No_Internet_Warning} from '../../../common/component/Toast';

const { height } = Dimensions.get('window')

export type MemoryActionsSheetItem = {
    index: number,
    image: object,
    isDestructive?: number,
    text: string, 
    nid? : any,
    memoryType? : any,
    actionType?: any,
    uid?: any
}

type Props = { actions: Array<MemoryActionsSheetItem>, memoryActions? : boolean, title?: any, onActionClick?: (index: number, data? : any) => void, width: string | number, popToAddContent? : boolean }
type State = { bottom: any, hidden: boolean }

export default class MemoryActionsSheet extends React.Component<Props, State> {

    static defaultProps: Props = {
        actions: [],
        width: '100%'
    }

    state: State = {
        bottom: new Animated.Value(-height),
        hidden: true
    }

    showSheet = () => {        
        if (Utility.isInternetConnected) {
            this.setState({ hidden: false }, () => {
                Animated.timing(
                    this.state.bottom,
                    {
                        toValue: 0,
                        duration: 200
                    }
                ).start()
            })
        } else {
            No_Internet_Warning();
        }
        
    }

    hideSheet = () => {
        Animated.timing(
            this.state.bottom,
            {
                toValue: -height,
                duration: 50
            }
        ).start(() => { setTimeout(() => { this.setState({ hidden: true }) }, 20) })
    }

    render() {
        if (this.state.hidden || this.props.actions.length == 0) {
            return <View style={{ height: 0, width: 0 }} />
        } else {
            return (
                <Modal
                transparent
                >
                <View style={{ position: 'absolute', backgroundColor: '#00000045', width: '100%', height: '100%', alignItems: 'center', top: 0}}  onStartShouldSetResponder={() => true} onResponderStart={()=> this.hideSheet()}>
                    <Animated.View style={{ backgroundColor: 'white', maxWidth: 768, width: this.props.width, position: 'absolute', bottom: this.state.bottom, paddingBottom : 15 }}>
                        <View>                        
                            <TextNew style={{color : Colors.TextColor, paddingTop: 15, paddingStart: 24, height: 56, ...fontSize(18), fontWeight: "bold"}}>Memory Actions</TextNew>
                        {/* {this.props.title && this.props.title.length > 0 ?                          
                        <View></View>
                        } */}
                                  
                        <FlatList
                            data={this.props.actions}
                            keyExtractor={(_, index: number) => `${index}`}
                            onScroll={()=>{Keyboard.dismiss()}}
                            // ItemSeparatorComponent={({ leadingItem }: { highlighted: boolean, leadingItem: MemoryActionsSheetItem }) => {
                            //     return (<View style={{ height: 1, backgroundColor: (leadingItem.index == (this.props.actions.length - 1)) ? 'rgba(0.35, 0.35, 0.35, 0.2)' : 'white' }} />)
                            // }}
                            renderItem={({ item: data }: { item: MemoryActionsSheetItem }) => {
                                return (
                                    <TouchableOpacity onPress={() => {
                                        this.props.memoryActions ? 
                                            this.props.onActionClick && this.props.onActionClick(data.index, data)
                                        : 
                                            this.props.onActionClick && this.props.onActionClick(data.index)
                                        this.hideSheet();
                                        Keyboard.dismiss();
                                        
                                        {this.props.popToAddContent && 
                                        Actions.popTo("addContent");}
                                    }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingStart: 24, height: 56 }}>
                                            <View style = {{height: "100%", width: 21, overflow: "visible", alignItems: 'center', justifyContent: "center"}}>
                                                <Image source={data.image} resizeMode="contain" />
                                            </View>
                                            <TextNew style={{ color: data.isDestructive == 1 ? Colors.NewRadColor : 'black', marginLeft: 20, ...fontSize(18) }}>{data.text}</TextNew>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                        </View>
                    </Animated.View>
                    {/* <View style={{height: 50, width:"100%", backgroundColor: "#fff", bottom: -50, position:"absolute"}}></View> */}
                </View>
                </Modal>
            )
        }
    }
}