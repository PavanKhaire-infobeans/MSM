import { Image, TouchableOpacity, View, StatusBar, Dimensions, Keyboard, Platform } from 'react-native';
import React from 'react';
//@ts-ignore
import EStyleSheet from 'react-native-extended-stylesheet';
import { fontSize, Colors, Size } from '../../constants';
import { close_white, action_close, black_arrow } from '../../../images';
import Text from '../Text'
import { Account } from '../../loginStore';
import MessageDialogue from '../messageDialogue';
import { Actions } from 'react-native-router-flux';
import TextNew from '../Text';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false
  };
const styles = EStyleSheet.create({
    $size: Size.byWidth(43),
    container: {
        padding: Size.byWidth(10),       
        borderWidth : 1,
        borderColor : "#EAE7DF",
        flexDirection: 'row',        
        backgroundColor: "#F4F1EA",        
        width: '100%',
        borderRadius: 8,        
        marginTop: 20
    },

    innerContainer: { 
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: Size.byWidth(13)
    },

    communityName: {
        fontStyle: "normal",
        ...fontSize(Size.byWidth(16)),
        color: 'black',
        textAlign: 'left'
    },

    url: {
        fontStyle: "normal",
        ...fontSize(Size.byWidth(14)),
        marginTop: Size.byWidth(5),
        color: '#595959',
        textAlign: 'left'
    },
    imageContainer: {
        width: '$size',
        height: '$size',
        backgroundColor: Colors.NewLightThemeColor,
        justifyContent: 'center'
    },
    
    image: {
        width: '$size - 16',
        height: '$size - 16',        
        alignSelf: 'center'
    },
    name: {
        color: Colors.TextColor, ...fontSize(10), lineHeight: 15, textAlign: 'left',
        fontWeight: Platform.OS === "ios"? '500':'bold',
    },
    titleText: {
        color: Colors.TextColor, ...fontSize(18), lineHeight: 20, textAlign: 'left',
        fontWeight: Platform.OS === "ios"? '500':'bold',
    },

    titleContainer: { justifyContent: 'center', paddingTop: 10, flex: 1, paddingRight : 10 },

    leftButtonTouchableContainer: {
        justifyContent: 'center', padding: 15, marginTop: 5,
    },

    leftButtonContainer: {
        backgroundColor: 'transparent', height: 28, width: 28, alignItems: 'center',
        justifyContent: 'center',
    },

    leftCrossButtonContainer: {
        backgroundColor: Colors.NewRadColor,
        alignItems: 'center',
        justifyContent: 'center',
    },

    rightButtonsContainer: { paddingTop: 10, paddingRight: 0, height: "100%", flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },

    rightButtonsTouchable: { padding: 0, paddingRight: 10 }
});

class NavigationHeaderSafeArea extends React.Component<{ [x: string]: any }> {
    messageRef : any | MessageDialogue = null;
    static defaultProps = {
		showRightText: true
	};
    _renderLeft() {
        return  <View>

            {!this.props.hideClose ?
            <TouchableOpacity style={[styles.leftButtonTouchableContainer]} onPress={() => this.props.cancelAction()}>
                <Image
                    style={{ height: 28, width: 28 }}
                    resizeMode="center"
                    source={this.props.backIcon ? this.props.backIcon : this.props.isWhite ? black_arrow : close_white}
                    />
            </TouchableOpacity> : <View style={{height: 10, width: 15}}></View>}
                    </View>
        
    }

    _renderMiddle() {
        return (
            <View style={styles.titleContainer}>
                {this.props.showCommunity && <Text style={styles.name}>{Account.selectedData().name}</Text>}
                <Text style={[styles.titleText, {color : this.props.isWhite  ? "#000" : Colors.TextColor}]} numberOfLines={1} ellipsizeMode='tail'>{this.props.heading}</Text>
            </View>
        );
    }

    _renderRight() {
        return (
            <View style={[styles.rightButtonsContainer]}>
                {this.props.showRightText && <TouchableOpacity onPress={() =>{ 
                     if(this.props.showRightText=="Publish"){
                         ReactNativeHapticFeedback.trigger("impactMedium", options);
                     }
                     this.props.saveValues()}}
                    style={styles.rightButtonsTouchable} >
                    <Text style={{ ...fontSize(16), fontWeight: 'bold', color: this.props.isWhite ? "#000" : Colors.TextColor, paddingRight : 10 }}>{this.props.rightText}</Text>
                </TouchableOpacity>}
                {this.props.rightIcon && 
                    <TouchableOpacity onPress={()=>this.props.showHideMenu()}>
                    <View style={{justifyContent: "space-between", height: "100%" , width: 30, padding: 13.5, paddingLeft: 3, alignItems: "center"}}>
                      <View style={{backgroundColor: Colors.TextColor, height: 4, width: 4, borderRadius: 2}}></View>
                      <View style={{backgroundColor: Colors.TextColor, height: 4, width: 4, borderRadius: 2}}></View>
                      <View style={{backgroundColor: Colors.TextColor, height: 4, width: 4, borderRadius: 2}}></View>
                    </View>
                  </TouchableOpacity>
                }
            </View>
        )
    }

    _showWithOutClose = (message : any, color : any) => {
        this.messageRef && this.messageRef._showWithOutClose({message : message, color: color})
    }

    _show = (message : any, color : any) => {
        this.messageRef && this.messageRef._show({message : message, color: color})
    }

    _hide = () => {
        this.messageRef && this.messageRef._hide();
    }

    render() {
        let accData = Account.tempData()
        let url =  accData.instanceURL == "192.168.2.6" ? "calpoly.cueback.com" : accData.instanceURL
        return (
            <View>
                {this.props.isRegisteration ? 
                 <View style={{ flexDirection: "row", width: Dimensions.get('window').width, height: 54, justifyContent: "flex-start",
                 alignItems: "center", backgroundColor: 'white', borderBottomWidth:1, borderBottomColor: 'rgba(0, 0, 0, 0.24)'}}>									
                    <TouchableOpacity style={{width: 60, alignItems: "center"}} onPress={()=>{Keyboard.dismiss(); Actions.pop()}}>
                        <Image source={black_arrow}/>
                    </TouchableOpacity>	
                    <View style={styles.imageContainer}><Image source={{ uri: accData.instanceImage }} style={styles.image} /></View>
                        <View style={styles.innerContainer}>
                            <TextNew style={styles.communityName}>
                                {accData.name}
                            </TextNew>

                            <TextNew style={styles.url}>
                                {url}
                            </TextNew>
                        </View>													
                    </View>	:  		
                        
                <View style={{ flexDirection: "row", width: "100%", height: this.props.height == 0 ? this.props.height: 54, justifyContent: "space-between", 
                            borderBottomWidth: this.props.isWhite ? 2 : 0, borderBottomColor: 'rgba(0, 0, 0, 0.24)',
                                backgroundColor: this.props.isWhite || this.props.isRegisteration? "#fff" : Colors.NewThemeColor}}>
                    <View style={{ flexDirection: "row", justifyContent: "flex-start", flex: 1}}>                    
                    {this._renderLeft()}
                    {this._renderMiddle()}
                    </View>
                    {(this.props.showRightText || this.props.rightIcon) && this._renderRight()}
                </View>}
                <MessageDialogue ref={(ref)=> this.messageRef = ref}/>
                {this.props.isWhite && <StatusBar barStyle={'dark-content'}/>}
            </View>
        );
    }
}

export default NavigationHeaderSafeArea;