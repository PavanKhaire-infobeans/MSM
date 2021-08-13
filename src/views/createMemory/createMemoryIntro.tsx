import React, { Component } from "react";
import { View, Image, Dimensions, Animated, Modal} from "react-native";
//@ts-ignore
import { add_content_step1, add_content_step2, add_content_step3 } from "../../images";
import { fontSize, Colors } from "../../common/constants";
//@ts-ignore
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Props } from "../login/loginController";
import TextNew from "../../common/component/Text";
import { SubmitButton } from "../../common/component/button";
export default class CreateMemoryIntro extends React.Component<Props> {
	_carousal : any;
	state = {
		fadeIn: new Animated.Value(1),
		currentIndex : 0, 
		scrolling : false
	}
	
    createMemoryIntro= [{title: 'Step 1', desc : 'Write your memories and add\n images, videos and voice notes.', imageSrc : add_content_step1}, 
         {title: 'Step 2', desc : 'Add details to your memory like,\n date, place, who were there etc.' , imageSrc : add_content_step2}, 
         {title: 'Step 3', desc : 'Publish memory so that people\n in your network to relive those\n moments', imageSrc : add_content_step3}]	

    constructor(props: Props) {
		super(props);
	}

    fadeIn=(index : any)=>{
		this.setState({currentIndex : index, fadeIn : new Animated.Value(0), scrolling : false}, ()=>{
			Animated.timing(                  
				this.state.fadeIn,            
				{
				  toValue: 1,                   
				  duration: 500,              
				}
			 ).start();  
		})		              
	}

	fadeOut=()=>{
			Animated.timing(                  
				this.state.fadeIn,            
				{
				  toValue: 0,                   
				  duration: 200,              
				}
			 ).start();     
    }
    
    renderCreateMemoryIntro=(item: any)=>{
        let index = item.index;
        return<View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <TextNew style={{...fontSize(18), fontWeight: '700', textAlign: 'center'}}>{this.createMemoryIntro[index].title}</TextNew>
                <TextNew style={{...fontSize(18), fontWeight: '400', textAlign: 'center'}}>{this.createMemoryIntro[index].desc}</TextNew>
                <Image source={this.createMemoryIntro[index].imageSrc} style={{margin: 20}} />
            </View>
    }
	render() {
		return (
            <Modal transparent>
                <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',justifyContent: 'center', alignItems: 'center'}}>
                 <View style={{width : '90%', borderRadius: 5, backgroundColor: 'white', padding: 20, justifyContent: 'center', alignItems : 'center'}}>
                <Carousel			
                    ref={(c: any) => { this._carousal = c; }}   						
                    data={this.createMemoryIntro}
                    renderItem={(item : any ) => this.renderCreateMemoryIntro(item)}
                    onSnapToItem={(i : any )=> this.fadeIn(i)}
                    sliderWidth={Dimensions.get('window').width - 50}
                    itemWidth={Dimensions.get('window').width - 50}
                    inactiveSlideOpacity={1}
                    inactiveSlideScale={1}	
                    useScrollView={false}			 		
                    onScroll={(event: any)=>{
                        if(this.state.scrolling){
                            this.setState({
                                fadeIn : new Animated.Value(1 - Math.abs(this.state.currentIndex - event.nativeEvent.contentOffset.x/Dimensions.get('window').width)) 
                            })
                        }
                        
                    }}					
			        onScrollBeginDrag={()=> this.setState({scrolling: true, fadeIn : new Animated.Value(1)})}/>
                <View style={{flexDirection: 'row', marginTop: 10}}>
					{this.createMemoryIntro.map((obj: any, index1 : any) => {
                         return <View style={{height: 5, borderRadius: 1, width: 16, marginRight: 5, backgroundColor : index1 <= this.state.currentIndex ? '#207D89' : '#C4C4C4'}}/>
                     })}
                </View>
                <SubmitButton style={{width: '90%', backgroundColor: Colors.ThemeColor, ...fontSize(22)}} text={this.state.currentIndex != this.createMemoryIntro.length-1 ? 'Close' : 'Finish'} onPress={()=> this.props.cancelMemoryIntro()} />
                </View>
            </View>
            </Modal>
		);
	}
}