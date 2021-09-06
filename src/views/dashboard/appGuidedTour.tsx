import React from "react";
import { Dimensions, Modal, View, Animated, TouchableHighlight, Image, TouchableOpacity, ScrollView, Platform, BackHandler } from "react-native";
import { Props } from "../login/loginController";
//@ts-ignore
import Carousel, { Pagination } from 'react-native-snap-carousel';
import TextNew from "../../common/component/Text";
import { Colors, fontSize,Size } from "../../common/constants";
import { add_content, arrow_left, arrow_right, close_big_grey, exit_tour, more_options_selected, msm_allPages_mindPop, msm_logo, msm_preserveYourMemories, progress_dot, progress_dot_check } from "../../images";
import { SubmitButton } from "../../common/component/button";
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Sound  from "react-native-sound";
import { Actions } from "react-native-router-flux";
const options = {
	enableVibrateFallback: true,
	ignoreAndroidSystemSettings: false
  };
export default class AppGuidedTour extends React.Component<Props> {
	_carousal : any;
	animation: any;
	state = {
		fadeIn: new Animated.Value(1),
		fadeInView: new Animated.Value(1),
		beginTour : false,
		tourEnded : false,
		currentIndex : 0, 
		scrolling : false,
		exitTour : false,
		tourSaveForLater : false,
		scrollViewWidth:0,
      	currentXOffset:0,
		autoPlay : true,
		width: 0,
		showPromptAnim: false,
		showMemoryCreationView: false,
		initialView:true
	}
	width_X = Dimensions.get('window').width;
	
    appIntro= [{title: 'Scroll through stories', desc : <><TextNew>Read stories on the</TextNew><TextNew style={{ fontWeight: Platform.OS=='ios' ? '500' : 'bold' }}> All Memories </TextNew>
		<TextNew>tab.</TextNew></>, imageSource : require('../../common/lottieFiles/msm_guidedTour_animation1.json')}, 
			   {title: 'Timeline', desc : 'Explore different time periods and read stories alongside cues from that era.',imageSource : require('../../common/lottieFiles/msm_guidedTour_animation2.json')}, 
			   {title: 'Recent', desc : 'Stay up to date and read the most recently published stories.',imageSource : require('../../common/lottieFiles/msm_guidedTour_animation3.json')}, 
			   {title: <TextNew><Image style={{width:35,height:25,marginVertical : 2,marginHorizontal:2}} source={add_content}></Image> Button</TextNew>, desc : <><TextNew>Add a memory by tapping {"\n"}the </TextNew><Image style={{height: 25, width: 30}} source={add_content}></Image>
			   <TextNew> button.</TextNew></>,imageSource : require('../../common/lottieFiles/msm_guidedTour_animation4.json')}, 
               {title: 'Get inspired', desc : <><TextNew>Choose a Prompt to answer and tap{"\n"}</TextNew><TextNew style={{ fontWeight: Platform.OS=='ios' ? '500' : 'bold' }}> Add your memory </TextNew>
			   <TextNew>to get started.</TextNew></>,imageSource : require('../../common/lottieFiles/msm_guidedTour_animation5_part1.json')},   
			]

	_scrollView: ScrollView;
	_timerId: any;
	_childrenCount = 5;
	_currentIndex = 0;
	_preScrollX: any;
	backHandler: any;
   
    constructor(props: Props) {
		super(props);
	}

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener(
		  "hardwareBackPress",
		  this.backAction
		);
	}

	backAction() {
		return true; 
	}

	componentWillUnmount() {
		this.backHandler.remove();
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

	fadeInView() {
		this.setState({fadeInView : new Animated.Value(0)},()=>{
			Animated.timing(
			this.state.fadeInView,           
			{
				toValue: 1,                   
				duration: 1000,              
			}
			).start();        
		});                
	 }

	fadeOutView() {
			Animated.timing(
			this.state.fadeInView,           
			{
				toValue: 0,                   
				duration: 1000,              
			}
			).start();        
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

	resumeTour(){
		setTimeout(() => {
			if(this._carousal) {
				//this.fadeIn(this.state.currentIndex);
				this._carousal.snapToItem(this.state.currentIndex)
			}
			
		}, 50);
	}

	onClick(){
		this.fadeOutView();
		 setTimeout(() => {
			this.props.cancelAppTour();
			Actions.push('promptsView',{animated : true});
		 }, 1000);
		
	}

	playSound(){
		Sound.setCategory('Playback');
		var mySound = new Sound('complete.mp3',Sound.MAIN_BUNDLE,(error)=>{
			if(error){
				console.log('Error loading sound: ' + JSON.stringify(error));
				return;
			}else{
				mySound.play((success)=>{
					if(success){
					console.log('Sound playing')
					}else{
					console.log('Issue playing file');
					}
				})
			}
			});
		mySound.setVolume(0.9);
		mySound.release();
		return mySound;
	}

	 navigateToIndex(index : any){
		 ReactNativeHapticFeedback.trigger("notificationSuccess", options);
		 if(this.state.currentIndex == this.appIntro.length -1){
			 this.setState({showPromptAnim : false });
		}
		 if(this._carousal) this._carousal.snapToItem(index);
	 }

	 renderAppIntro=(item: any)=>{
		let index = item.index;
        return <Animated.View style={{opacity: this.state.fadeIn, flex: 1, width: "100%", justifyContent: "center", alignItems : "center" , marginTop: 0}}>					
								{ this.state.currentIndex == index &&
									<View style={{flex: 1, width: '90%'}}>
										 <View style={{justifyContent:"center", alignItems : "center",margin:16}}>
													<TextNew style={{...fontSize(30), fontWeight: Platform.OS=='ios' ? '500' : 'bold', textAlign: 'center'}}>{this.appIntro[index].title}</TextNew>
													<TextNew style={{...fontSize(18), fontWeight: '400', textAlign: 'center', marginTop : 12, lineHeight : 30}}>{this.appIntro[index].desc}</TextNew>
										 </View>
										<View style={{flex: 0.95,justifyContent:'center',alignItems:'center'}} onStartShouldSetResponder={(e) => { if(this.state.currentIndex == this.appIntro.length-1) this.setState({showPromptAnim : true});return true}}>
										{/* { !this.state.showPromptAnim && <Image style={{width: "90%", flex:1,bottom:0, height: "90%",backgroundColor:"yellow"}} source={require("../../common/lottieFiles/1_alternate.gif")} /> } */}

										  { !this.state.showPromptAnim && <LottieView loop={true} speed={0.8} autoPlay={true} ref={(animation: any) => { this.animation = animation; }} style={{width: "90%", flex:1,bottom:0, height: "90%",backgroundColor:"#C0E7EA"}} source={this.appIntro[index].imageSource} /> }
										  { this.state.showPromptAnim &&  <LottieView speed={0.8} autoPlay={true} style={{width: "90%", flex:1,bottom:0, height: "90%",backgroundColor:"#C0E7EA"}} source={require("../../common/lottieFiles/msm_guidedTour_animation5_part2.json")} /> }
										</View>
                                    </View>
								}	
								</Animated.View>
    }

	renderDismissPopUp(){
        return <Modal transparent>
			<View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center'}}>
				<View style={{width : '90%', borderRadius: 10, backgroundColor: 'white', padding: 20, justifyContent: 'center', alignItems : 'center'}}>
						<View style={{width: '100%'}}>
							<View> 
								<TouchableOpacity underlayColor={'transparent'} onPress={()=> {this.setState({tourEnded: false}), this.setState({tourSaveForLater: true})}} style={{alignItems : "flex-end", paddingRight: 2}}> 
										<Image source={close_big_grey}></Image>
								</TouchableOpacity>           
							</View>
							<View style={{justifyContent:"center", alignItems : "center"}}> 
								<Image source={msm_logo} style={{margin: 10}} />
								<Image source={exit_tour} style={{margin: 10}} />
								<TextNew style={{...fontSize(30), fontWeight: Platform.OS=='ios' ? '500' : 'bold', textAlign: 'center'}}>Exit guided tour?</TextNew>
								<TextNew style={{...fontSize(18), fontWeight: Platform.OS=='ios' ? '400' : 'bold', textAlign: 'center', marginTop : 16}}>You’re only few steps away from completing the tour.</TextNew>
								<SubmitButton style={{ backgroundColor: Colors.ThemeColor, ...fontSize(22)}} text="Resume tour" onPress={()=> {this.setState({beginTour: true}); this.resumeTour();this.setState({tourEnded : false})}} />
								<TouchableOpacity onPress={()=> {this.setState({beginTour : false});this.setState({initialView: false});this.setState({tourSaveForLater: true});this.setState({tourEnded : false})}} style={{width : "100%",marginTop: 10,borderWidth : 2,borderColor : Colors.ThemeColor,borderRadius: 4,height: Size.byWidth(48),alignItems : "center",justifyContent : "center"}}>
									<TextNew style={{...fontSize(20), fontWeight: Platform.OS=='ios' ? '500' : 'bold', textAlign: 'center',color : "#207D89"}}>Save for later</TextNew>
								</TouchableOpacity>
							</View>
						</View>
				</View>
			</View>
			</Modal>
    }

	render() {
		return (
            <><Modal transparent>
				{this.state.beginTour ?
					<View style={{ width: "100%", height: "100%", backgroundColor: "#C0E7EA" }}>
						<View style={{ flex: 1, width: "100%", height: "100%", top: Platform.OS == "ios" ? 30 : 10, backgroundColor: "#C0E7EA" }}>
							<View style={{ flexDirection: "row", marginTop: Platform.OS == "ios" ? 20 : 10, justifyContent: "center", alignItems: "center" }}>
								{this.appIntro.length != null && this.appIntro.map((obj: any, index: any) => {
									return <View style={{ alignItems: "center" }}>
										<TouchableOpacity underlayColor={'transparent'} style={{ justifyContent: "center", margin: 5 }} onPress={() => { this.navigateToIndex(index); } }>
											<Image source={this.state.currentIndex >= index ? progress_dot_check : progress_dot}></Image>
										</TouchableOpacity>
									</View>;
								})}
								<View style={{ right: -90 }}>
									<TouchableOpacity underlayColor={'transparent'} onPress={() => { this.setState({ tourEnded: true });} }>
										<Image source={close_big_grey}></Image>
									</TouchableOpacity>
								</View>
							</View>
							<Carousel
								ref={(c: any) => { this._carousal = c; } }
								data={this.appIntro}
								renderItem={(item: any) => this.renderAppIntro(item)}
								onSnapToItem={(i: any) => {
									this.playSound();
									this.setState({ showPromptAnim: false });
									this.setState({ currentIndex: i });
									//this.fadeIn(i)
								} }
								sliderWidth={Dimensions.get('window').width}
								itemWidth={Dimensions.get('window').width}
								inactiveSlideScale={1}
								inactiveSlideOpacity={1}
								useScrollView={false} />
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 70, width: "100%", top: 0, paddingBottom: 10 }}>
							<TouchableHighlight underlayColor={'transparent'} style={{ borderColor: "#207D89", borderWidth: 2, marginLeft: 16, borderRadius: 5 }} onPress={() => { ReactNativeHapticFeedback.trigger("notificationSuccess", options); this.setState({ showPromptAnim: false }); this._carousal.snapToPrev(); } }>
								<View style={{ backgroundColor: "#FFFFFF", paddingTop: 10, paddingBottom: 10, paddingLeft: 16, paddingRight: 16, flexDirection: 'row', justifyContent: 'center', borderRadius: 5, alignItems: 'center' }}>
									<Image source={arrow_left}></Image>
									<TextNew style={{ fontWeight: Platform.OS == 'ios' ? '400' : 'bold', ...fontSize(17), color: '#207D89', marginLeft: 10 }}>Back</TextNew>
								</View>
							</TouchableHighlight>
							<TouchableHighlight underlayColor={'transparent'} style={{ borderColor: "#207D89", borderWidth: 2, marginRight: 16, borderRadius: 5 }} onPress={() => {
								ReactNativeHapticFeedback.trigger("notificationSuccess", options); if (this.state.currentIndex == this.appIntro.length - 1) {
									this.fadeInView();
									this.setState({ showMemoryCreationView: true });
									this.setState({ beginTour: false });
									this.setState({ showPromptAnim: false });
								} else { this._carousal.snapToNext(); }
							} }>
								<View style={{ backgroundColor: "#207D89", paddingTop: 10, paddingBottom: 10, paddingLeft: 16, paddingRight: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
									<TextNew style={{ fontWeight: Platform.OS == 'ios' ? '400' : 'bold', ...fontSize(17), color: '#FFFFFF', marginRight: 10 }}>Next</TextNew>
									<Image source={arrow_right}></Image>
								</View>
							</TouchableHighlight>
						</View>
					</View>
					: <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
						<View style={{ width: '90%', borderRadius: 10, backgroundColor: 'white', padding: 20, justifyContent: 'center', alignItems: 'center' }}>
							{
								//this.state.tourEnded ? 
								//  this.renderDismissPopUp()
								// <View style={{width: '100%'}}>
								// 	<View> 
								// 		<TouchableOpacity underlayColor={'transparent'} onPress={()=> {this.setState({tourEnded: false}), this.setState({tourSaveForLater: true})}} style={{alignItems : "flex-end", paddingRight: 2}}> 
								// 				<Image source={close_big_grey}></Image>
								// 		</TouchableOpacity>           
								// 	</View>
								// 	<View style={{justifyContent:"center", alignItems : "center"}}> 
								// 		<Image source={msm_logo} style={{margin: 10}} />
								// 		<Image source={exit_tour} style={{margin: 10}} />
								// 		<TextNew style={{...fontSize(30), fontWeight: Platform.OS=='ios' ? '500' : 'bold', textAlign: 'center'}}>Exit guided tour?</TextNew>
								// 		<TextNew style={{...fontSize(18), fontWeight: Platform.OS=='ios' ? '400' : 'bold', textAlign: 'center', marginTop : 16}}>You’re only few steps away from completing the tour.</TextNew>
								// 		<SubmitButton style={{ backgroundColor: Colors.ThemeColor, ...fontSize(22)}} text="Resume tour" onPress={()=> {this.setState({beginTour: true}); this.resumeTour();this.setState({tourEnded : false})}} />
								// 		{/* <SubmitButton style={{backgroundColor: "#fff",borderWidth: 1,...fontSize(22)}} text="Save for later" onPress={()=> this.setState({tourSaveForLater: true})} /> */}
								// 		<TouchableOpacity onPress={()=> {this.setState({tourSaveForLater: true});this.setState({tourEnded : false})}} style={{width : "100%",marginTop: 10,borderWidth : 2,borderColor : Colors.ThemeColor,borderRadius: 4,height: Size.byWidth(48),alignItems : "center",justifyContent : "center"}}>
								// 			<TextNew style={{...fontSize(20), fontWeight: Platform.OS=='ios' ? '500' : 'bold', textAlign: 'center',color : "#207D89"}}>Save for later</TextNew>
								// 		</TouchableOpacity>
								// 	</View>
								// </View>
								this.state.tourSaveForLater ? <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
									<Image source={msm_logo} style={{ margin: 10 }} />
									<TextNew style={{ ...fontSize(30), fontWeight: Platform.OS == 'ios' ? '500' : 'bold', textAlign: 'center', marginTop: 16 }}>Access this tour at anytime</TextNew>
									<TextNew style={{ ...fontSize(18), fontWeight: Platform.OS == 'ios' ? '400' : 'bold', textAlign: 'center', margin: 12 }}>Find this tour again when you tap the <Image style={{ height: 22, width: 25, marginBottom: -2 }} source={more_options_selected} /> icon</TextNew>
									<SubmitButton style={{ backgroundColor: Colors.ThemeColor, ...fontSize(22) }} text="Got it!" onPress={() => this.props.cancelAppTour()} />
								</View>
									: this.state.showMemoryCreationView ? <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor: "#C0E7EA" }}>
										<Animated.View style={{ opacity: this.state.fadeInView, width: "100%", height: "100%", backgroundColor: "#C0E7EA" }}>
											<View style={{ width: '100%' }}>
												<View style={{ top: Platform.OS == 'ios' ? 20 : 0, zIndex: 99999 }}>
													<TouchableOpacity underlayColor={'transparent'} onPress={() => { this.setState({ tourEnded: false }), this.setState({ tourSaveForLater: true }); } } style={{ alignItems: "flex-end", paddingRight: 20, paddingTop: 30 }}>
														<Image source={close_big_grey}></Image>
													</TouchableOpacity>
												</View>
												<View style={{ justifyContent: "center", alignItems: "center", height: "90%" }}>
													<Image source={msm_allPages_mindPop}></Image>
													<TextNew style={{ ...fontSize(30), fontWeight: Platform.OS == 'ios' ? '500' : 'bold', textAlign: 'center', marginTop:Platform.OS == 'ios' ? 20 : 10 }}>Let’s get started!</TextNew>
													<TextNew style={{ ...fontSize(20), fontWeight: '400', textAlign: 'center', marginTop: 16, color: "#000000" }}>Add your first memory.</TextNew>
													<SubmitButton style={{ backgroundColor: Colors.ThemeColor, ...fontSize(22), justifyContent: "center", width: "75%" }} text="Answer a Prompt" onPress={this.onClick.bind(this)} />
													<TextNew style={{ ...fontSize(20), textAlign: 'center', marginTop: 16, color: "#000000" }}>or</TextNew>
													<TouchableOpacity onPress={() => {
														this.fadeOutView();
														setTimeout(() => {
															Actions.push("addContent", { animated: true });
															this.props.cancelAppTour();
														}, 1000);
													} } style={{ width: "75%", marginTop: 10, borderWidth: 2, borderColor: Colors.ThemeColor, borderRadius: 4, height: Size.byWidth(48), alignItems: "center", justifyContent: "center" }}>
														<TextNew style={{ ...fontSize(20), fontWeight: Platform.OS == 'ios' ? '500' : 'bold', textAlign: 'center', color: "#207D89" }}>I have a Memory in mind</TextNew>
													</TouchableOpacity>
													{/* <TouchableOpacity underlayColor={'transparent'} onPress={() => {
															this.fadeOutView();
															setTimeout(() => {
																Actions.push("addContent",{animated : true});
																this.props.cancelAppTour();
															}, 1000);
														}}>
													<TextNew style={{...fontSize(20), fontWeight: Platform.OS=='ios' ? '500' : 'bold', textAlign: 'center',marginTop:16,color : "#207D89"}}>I have a Memory in mind</TextNew>
													</TouchableOpacity> */}
												</View>
												<View style={{ alignItems: 'flex-start', width: "100%", bottom:Platform.OS=='ios' ? 20 : 50, zIndex: 99999 }}>
													<TouchableHighlight underlayColor={'transparent'} style={{ marginLeft: 16 }} onPress={() => {
														ReactNativeHapticFeedback.trigger("notificationSuccess", options); this.fadeOutView(); setTimeout(() => {
															if (this._carousal) {
																this._carousal.snapToItem(this.state.currentIndex);
															}
														}, 50);
														this.setState({ showMemoryCreationView: false });
														this.setState({ beginTour: true });
														this.setState({ showPromptAnim: false });
													} }>
														<View style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 16, paddingRight: 16, flexDirection: 'row', justifyContent: 'center', borderRadius: 5, alignItems: 'center' }}>
															<Image source={arrow_left}></Image>
															<TextNew style={{ fontWeight: Platform.OS == 'ios' ? '400' : 'bold', ...fontSize(17), color: '#207D89', marginLeft: 10 }}>Back</TextNew>
														</View>
													</TouchableHighlight>
												</View>
											</View>
										</Animated.View>
									</View>
										: this.state.initialView && <View style={{ width: '100%' }}>
											<View>
												<TouchableOpacity underlayColor={'transparent'} onPress={() => {this.setState({ initialView : false });
												this.setState({ tourSaveForLater : false});
												this.setState({ tourEnded: true });
												this.setState({ showMemoryCreationView: false});
												this.setState({ beginTour: false })}} style={{ alignItems: "flex-end", paddingRight: 2 }}>
													<Image source={close_big_grey}></Image>
												</TouchableOpacity>
											</View>
											<View style={{ justifyContent: "center", alignItems: "center" }}>
												<Image source={msm_logo} style={{ margin: 10 }} />
												<Image source={msm_preserveYourMemories} style={{ margin: 10 }} />
												<TextNew style={{ ...fontSize(30), fontWeight: Platform.OS == 'ios' ? '500' : 'bold', textAlign: 'center' }}>Your memories are just a tap away!</TextNew>
												<TextNew style={{ ...fontSize(18), fontWeight: Platform.OS == 'ios' ? '400' : '', textAlign: 'center', marginTop: 16, lineHeight: 30 }}>Start with this quick tour of the app to start reminiscing today.</TextNew>
												<SubmitButton style={{ backgroundColor: Colors.ThemeColor, ...fontSize(22) }} text="Let’s get started!" onPress={() => {this.setState({ beginTour: true }); this.setState({initialView : false})}} />
											</View>
										</View>}
						</View>
					</View>}
					{this.state.tourEnded && this.renderDismissPopUp()}
			</Modal></>
		);
	}
}
// const styles = StyleSheet.create({
//     bottomView:{
//         height : Platform.OS == "ios" ? 70 : 100, 
// 		  width:"100%",
//         borderTopWidth : 0.5,
//         borderColor: '#fff',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 4,
//         shadowRadius: 2,  
//         elevation: 15,		
//     },
// })

function e(_e: any): (event: import("react-native").LayoutChangeEvent) => void {
	throw new Error("Function not implemented.");
}
