import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, TouchableHighlight, Slider, Platform, Alert } from "react-native";
//@ts-ignore
import { Recorder, Player } from "@react-native-community/audio-toolkit";
import { small_close_white, music_note, audio_details_open, audio_details_close, close_white_, small_close_white_ } from '../../../images';
import { fontSize, encode_utf8, NO_INTERNET, Colors } from '../../constants';
import { ToastMessage, No_Internet_Warning } from '../Toast';
import Utility from '../../utility';

type State = {[x: string] : any}
type Props = {files?: any, memoryTitle?: any, by?:any,  playerCallback?:(event : any) => void, bottom?: any}

export const kPlaying = "playing"
export const kPaused = "paused"
export const kEnded = "ended"
export const kNext = "next"
export const kPrevious = "previous"
export const kClosed = "closed"

export default class AudioPlayer extends React.Component<Props, State> {
    player?: Player = null;
    totalDuration : any;
    currentDuration : any;
    timeOutBuffering : any;
    static defaultProps: Props = {
        files : [{url:"https://qa.cueback.com/sites/qa.cueback.com/default/files/thumb_6872/media/SampleAudio_0.4mb_0_0_0_0_0.mp3"}],
        memoryTitle : "This is a test memory",
        by : "by You"      
    }
    state : State = {
       minimizedView : true,
       playerShowing: false,       
       playing : true,
       ended : false,
       totalDuration : "00:00",
       currentDuration : "00:00",
       maximumSeekValue : 0,
       sliderValue : 0,
       slidingInProgess : false,
       songTitle : "",
       nextEnabled : false,
       previousEnabled : false,
       index : 0
    }

    settingPreviousAndNext=(index: any)=>{
        let previous = false;
        let next = false;
            if(index > 0){
                previous = true;
            }
            
            if(index<this.props.files.length-1){
                next = true;
            }

        this.setState({
            nextEnabled : next,
            previousEnabled : previous
        })
    }
    showPlayer=(index : any)=>{      
        if(Utility.isInternetConnected){	
        try{
            if(this.props.files[index].url == null || this.props.files[index].url == ""){
                ToastMessage("Audio file is corrupted",Colors.ErrorColor);
                this.tooglePlayPause()
                return
            }
            if(this.props.files[index].filesize && this.props.files[index].filesize != "0"){
            let songTitle = this.props.files[index].file_title ? this.props.files[index].file_title : this.props.files[index].title ?  this.props.files[index].title : this.props.files[index].filename ? this.props.files[index].filename : "";
            this.setState({ playerShowing : true, 
                            songTitle : songTitle, 
                            playing : true,
                            ended : false,
                            totalDuration : "00:00",
                            currentDuration : "00:00",
                            maximumSeekValue : 0,
                            sliderValue : 0,
                            slidingInProgess : true,
                            loadingText : true,
                            index : index});
                if(this.player && this.player.canPlay){
                    this.player.stop();
                }
                this.settingPreviousAndNext(index); 
                let path = encode_utf8(this.props.files[index].url ? this.props.files[index].url : this.props.files[index].filePath ? this.props.files[index].filePath : "");
			    if (path.indexOf("https://") == -1 && path.indexOf("file://") == -1) {
				    path = "file://" + path;
			    }
                this.player = new Player(path);
                this.player.volume = 0;
                    this.player.prepare(() => {
                        this.player.play(() => {      
                            this.timeOutBuffering = setTimeout(() => {     
                                this.setState({slidingInProgess: false, loadingText : false})                 
                                this.player.currentTime = 0;               
                                this.player.volume = 0.5;
                                this.currentDuration = setInterval(this.setCurrentTime, 500);            
                            }, 2000);         
                        }, (err: any)=>{
                            //console.log(err)
                        });
                    }, (err: any)=>{
                        //console.log(err)
                    });       
                    this.totalDuration = setInterval(this.setTotalTime, 500);        
                } else {
                    ToastMessage("This audio file is corrupted", Colors.ErrorColor);
                    setTimeout(() => {
                        this.hidePlayer()                
                    }, 1000);
                }
            }
            catch(e){
                //console.log(e);
            }
        }else{
            No_Internet_Warning();
        }
    }   

    setTotalTime=()=>{
        if(this.player.duration > 0){
            this.setState({ totalDuration : this.setPlayTime(this.player.duration/ 1000), maximumSeekValue : Math.round(this.player.duration/1000)});
            clearInterval(this.totalDuration);
        }        
    }

    setCurrentTime=()=>{             
        if(this.player.currentTime > 0 && (this.state.playing || this.state.slidingInProgess)){
            // //console.log(this.player._state);
            this.setState({ currentDuration : this.setPlayTime(this.player.currentTime/ 1000)});
            if(!this.state.slidingInProgess){
                this.setState({sliderValue : Math.round(this.player.currentTime/ 1000)});
            }      
            if((this.player.duration - this.player.currentTime) < 500 && this.state.playing){
                this.setState({ended: true, playing : false});
                this.player.pause();
                this.player.currentTime = 0;
                this.props.playerCallback(kEnded);
                this.setState({sliderValue : Math.round(this.player.duration/ 1000)});
            }          
        } 
    }

    setPlayTime = (playTime: number) => {
		let minInt = parseInt(`${parseInt(`${playTime}`) / 60}`),
            secInt = parseInt(`${playTime}`) % 60;
        return `${minInt < 10 ? 0 : ""}${minInt}:${secInt < 10 ? 0 : ""}${secInt}` ;     		
	};

    tooglePlayPause=()=>{
        let play = !this.state.playing;        
        try{
            if(play){                       
                this.player.play();  
                this.props.playerCallback(kPlaying);                
            } else{
                this.player.pause();            
                this.props.playerCallback(kPaused);
            }
            this.setState({playing : play})
        } 
        catch(e){
            //console.log("File corrupted")
        }
    }

    hidePlayer=()=>{
        this.setState({playerShowing : false})
        if(this.player){
            this.player.stop();
        }
        this.player = new Player();
        this.props.playerCallback(kClosed);
    }

    nextSong=()=>{
        try{
        let currentIndex = this.state.index;
        if(currentIndex<(this.props.files.length-1)){
            currentIndex++;
        }
        clearTimeout(this.timeOutBuffering);
        this.showPlayer(currentIndex);
        this.props.playerCallback(kNext);}
        catch(e){
            //console.log(e);
        }
    }

    previousSong=()=>{    
        try{
            let currentIndex = this.state.index;
            if(currentIndex>0){
                currentIndex--;
            }
            clearTimeout(this.timeOutBuffering);
            this.showPlayer(currentIndex);
            this.props.playerCallback(kPrevious);
        }   
        catch(e){
            //console.log(e);
        } 
    }

    toggleSize=()=>{
        let minimizedView = !this.state.minimizedView;        
        this.setState({minimizedView : minimizedView})
    }
    componentWillMount(){
          
    }
    
    touchStartSlider=()=>{
        this.setState({slidingInProgess: true})
    }

    touchEndSlider=()=>{
        setTimeout(() => {
            this.setState({slidingInProgess: false})            
        }, 700);
    }
    render() {
        return (
            <View style={{width:"100%", padding: 15, position: "absolute", bottom: this.props.bottom ? this.props.bottom : 80}}>
               {this.state.playerShowing && <View style={{shadowOpacity: 1,
                              elevation : 1,
                              shadowColor: '#D9D9D9',
                              shadowRadius: 10,
                              shadowOffset: { width: 0, height: 5}, 
                              width:"100%", 
                              borderRadius: 5, 
                              backgroundColor: "rgba(0,0,0,0.7)", 
                              padding: 20,
                              height: this.state.playerShowing ? (this.state.minimizedView ? 100 : 200) : 0}}>
                            {!this.state.minimizedView &&
                                <View style={{height: 100}}> 
                                    <Text style={{...fontSize(18), color : "#fff", marginBottom:5}} numberOfLines={1}>{this.props.memoryTitle}</Text>
                                    <Text style={{...fontSize(16), color : "#fff"}} numberOfLines={1}>{this.props.by}</Text>
                                    <View style={{flex: 1, width: "100%", flexDirection : "row", alignItems: "center"}}>
                                        <Image source={music_note} style={{marginRight:10}}/>
                                        <Text style={{...fontSize(16), color : "#fff"}} numberOfLines={1}>{this.state.songTitle}</Text>
                                    </View>
                                </View>
                            }
                            <Slider
								value={this.state.sliderValue}
								minimumTrackTintColor={Colors.NewRadColor}
                                maximumTrackTintColor={"rgba(196, 196, 196, 0.4)"}
                                minimumValue={0}
                                maximumValue={this.state.maximumSeekValue}
								thumbImage={require("../../../images/audio_kit/thumb_white.png")}
                                style={{ flex : 1, marginBottom:10, padding: 10}}                                
								onValueChange={(value: number) => {
                                    this.setState({ sliderValue: value });
                                    this.player.currentTime = value * 1000;                                    
								}}
								onSlidingComplete={(value: number) => {
                                    setTimeout(() => {
                                        this.setState({slidingInProgess: false})    
                                    }, 700);                                    
                                    this.player.currentTime = value * 1000;                                    
                                    if(this.player.duration - 500 <= value*1000){
                                        this.setState({ended: true, playing : false});
                                        this.player.pause();
                                        this.player.currentTime = 0;
                                        this.props.playerCallback(kEnded);
                                    }
                                }}
                                onStartShouldSetResponder={() => true} 
                                onResponderStart={this.touchStartSlider}
                                onResponderRelease={this.touchEndSlider}                                
								/>

                            <View style={{flexDirection: "row", justifyContent:"space-between", alignItems :"center"}}>
                                {this.state.loadingText ? 
                                        <Text style={{...fontSize(12), color : "white", width : 80}}>{"Loading..."}</Text>
                                        : <Text style={{...fontSize(12), color : "white", width : 80}}>{this.state.currentDuration}{"/"}{this.state.totalDuration}</Text>
                                }
                                
                                <View style={{flexDirection:"row", justifyContent:"space-between", alignItems :"center"}}>
                                    <BackwardIcon previousSong={()=>{this.previousSong()}} disabled={!this.state.previousEnabled}/>
                                    <PlayPause playing={this.state.playing} togglePlayPause={() => {this.tooglePlayPause()}}></PlayPause>
                                    <ForwardIcon nextSong={()=>{this.nextSong()}} disabled={!this.state.nextEnabled}/>
                                </View>
                                <TouchableOpacity onPress={()=>this.toggleSize()} style={{height: 40, width : 80, paddingTop:10, paddingBottom:10, justifyContent: "flex-end", alignItems:"flex-end"}}>
                                    <Image source={this.state.minimizedView ? audio_details_open : audio_details_close}/>
                                </TouchableOpacity>
                            </View>    
                            </View> }
                {this.state.playerShowing && 
                <TouchableOpacity style={{marginRight: 5, bottom : this.state.minimizedView ? 105 : 205, right : 0, 
                                        position: "absolute", backgroundColor: "#000", 
                                        height: 24, width: 24, borderRadius: 12, borderWidth : 2, 
                                        borderColor : "#fff", justifyContent: "center", alignItems:"center"}} onPress={()=>this.hidePlayer()}>
                    <Image source={small_close_white_} style={{height: 11, width: 11}}/>
                </TouchableOpacity>
               }
            </View>
        );
    }
}

const PlayPause=(props:{playing : boolean, togglePlayPause: () => void})=>{
    return <TouchableOpacity style={{height: 30, width: 30, marginLeft: 25, marginRight: 20}} onPress={()=>props.togglePlayPause()}>
                {props.playing ? <View style={{flex: 1, width: 30, paddingRight: 7, justifyContent:"space-between", flexDirection:"row"}}> 
                                    <View style={{backgroundColor: "white", flex: 1, width: 7}}/>
                                    <View style={{backgroundColor: "transparent", flex: 1, width: 7}}/>
                                    <View style={{backgroundColor: "white", flex: 1, width: 7}}/>                                    
                                 </View> 
                                : <View style={{height: 30, width: 30, paddingLeft: 5,
                                                       borderLeftColor:"white", borderLeftWidth: 25, 
                                                       borderTopColor: "transparent", borderTopWidth: 15,
                                                       borderBottomColor: "transparent", borderBottomWidth: 15}}/>}
           </TouchableOpacity>
}

const ForwardIcon = (props: {disabled: boolean, nextSong: () => void}) =>{
    return <TouchableHighlight underlayColor = {"#00000000"} disabled={props.disabled} style={{flexDirection: "row"}} onPress={()=> props.nextSong()}>
                <View style = {{flexDirection: "row"}}>
                <PlayButtonDefault color={props.disabled ? "#909090" : "white"}></PlayButtonDefault>
                <PlayButtonDefault color={props.disabled ? "#909090" : "white"}></PlayButtonDefault>
                </View>
              
           </TouchableHighlight>
}

const BackwardIcon = (props: {disabled: boolean, previousSong:() => void}) =>{
    return <TouchableHighlight underlayColor = {"#00000000"} disabled={props.disabled} style={{flexDirection: "row", transform : [{rotate: '180deg'}]}} onPress={()=> props.previousSong()}>
            <View style = {{flexDirection: "row"}}>
                <PlayButtonDefault color={props.disabled ? "#909090" : "white"}></PlayButtonDefault>
                <PlayButtonDefault color={props.disabled ? "#909090" : "white"}></PlayButtonDefault>
           </View>
           </TouchableHighlight>
}

const PlayButtonDefault=(props: {color : any})=>{
    return <View style={{height: 20, width: 20, paddingLeft: 3,
                        borderLeftColor: props.color, borderLeftWidth: 17, 
                        borderTopColor: "transparent", borderTopWidth: 10,
                        borderBottomColor: "transparent", borderBottomWidth: 10}}/>           
}