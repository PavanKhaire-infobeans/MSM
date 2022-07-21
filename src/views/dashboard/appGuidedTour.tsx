import React from "react";
import { Dimensions, Modal, View, Animated, TouchableHighlight, Image, TouchableOpacity, ScrollView, Platform, BackHandler, SafeAreaView } from "react-native";
import { Props } from "../login/loginController";
//@ts-ignore
import Carousel, { Pagination } from 'react-native-snap-carousel';
import TextNew from "../../common/component/Text";
import { Colors, fontFamily, fontSize, Size } from "../../common/constants";
import { add_content, arrow_left, arrow_right, close_big_grey, exit_tour, more_options_selected, msm_allPages_mindPop, msm_logo, msm_preserveYourMemories, progress_dot, progress_dot_check } from "../../images";
import { SubmitButton } from "../../common/component/button";
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Sound from "react-native-sound";
import { Actions } from "react-native-router-flux";
import styles from "./styles";
const options = {
	enableVibrateFallback: true,
	ignoreAndroidSystemSettings: false
};
export default class AppGuidedTour extends React.Component<Props> {
	_carousal: any;
	animation: any;
	state = {
		fadeIn: new Animated.Value(1),
		fadeInView: new Animated.Value(1),
		beginTour: false,
		tourEnded: false,
		currentIndex: 0,
		scrolling: false,
		exitTour: false,
		tourSaveForLater: false,
		scrollViewWidth: 0,
		currentXOffset: 0,
		autoPlay: true,
		width: 0,
		showPromptAnim: false,
		showMemoryCreationView: false,
		initialView: true
	}
	width_X = Dimensions.get('window').width;

	appIntro = [{
		title: 'Scroll through stories', desc: <><TextNew>Read stories on the</TextNew><TextNew style={{ fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium, fontWeight: '500' }}> All Memories </TextNew>
			<TextNew>tab.</TextNew></>, imageSource: require('../../common/lottieFiles/msm_guidedTour_animation1.json')
	},
	{ title: 'Timeline', desc: 'Explore different time periods and read stories alongside cues from that era.', imageSource: require('../../common/lottieFiles/msm_guidedTour_animation2.json') },
	{ title: 'Recent', desc: 'Stay up to date and read the most recently published stories.', imageSource: require('../../common/lottieFiles/msm_guidedTour_animation3.json') },
	{
		title: <TextNew><Image style={{ width: 35, height: 25, marginVertical: 2, marginHorizontal: 2 }} source={add_content}></Image> Button</TextNew>, desc: <><TextNew>Add a memory by tapping {"\n"}the </TextNew><Image style={{ height: 25, width: 30 }} source={add_content}></Image>
			<TextNew> button.</TextNew></>, imageSource: require('../../common/lottieFiles/msm_guidedTour_animation4.json')
	},
	{
		title: 'Get inspired', desc: <><TextNew>Choose a Prompt to answer and tap{"\n"}</TextNew><TextNew style={{ fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium, fontWeight: '500' }}> Add your memory </TextNew>
			<TextNew>to get started.</TextNew></>, imageSource: require('../../common/lottieFiles/msm_guidedTour_animation5_part1.json')
	},
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

	fadeIn = (index: any) => {
		this.setState({ currentIndex: index, fadeIn: new Animated.Value(0), scrolling: false }, () => {
			Animated.timing(
				this.state.fadeIn,
				{
					toValue: 1,
					duration: 500,
					useNativeDriver: true,
				}
			).start();
		})
	}

	fadeInView() {
		this.setState({ fadeInView: new Animated.Value(0) }, () => {
			Animated.timing(
				this.state.fadeInView,
				{
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
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
				useNativeDriver: true,
			}
		).start();
	}


	fadeOut = () => {
		Animated.timing(
			this.state.fadeIn,
			{
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}
		).start();
	}

	resumeTour() {
		setTimeout(() => {
			if (this._carousal) {
				//this.fadeIn(this.state.currentIndex);
				this._carousal.snapToItem(this.state.currentIndex)
			}

		}, 50);
	}

	onClick() {
		this.fadeOutView();
		setTimeout(() => {
			this.props.cancelAppTour();
			Actions.push('promptsView', { animated: true });
		}, 1000);

	}

	playSound() {
		Sound.setCategory('Playback');
		var mySound = new Sound('complete.mp3', Sound.MAIN_BUNDLE, (error) => {
			if (error) {
				console.log('Error loading sound: ' + JSON.stringify(error));
				return;
			} else {
				mySound.play((success) => {
					if (success) {
						console.log('Sound playing')
					} else {
						console.log('Issue playing file');
					}
				})
			}
		});
		mySound.setVolume(0.9);
		mySound.release();
		return mySound;
	}

	navigateToIndex(index: any) {
		ReactNativeHapticFeedback.trigger("notificationSuccess", options);
		if (this.state.currentIndex == this.appIntro.length - 1) {
			this.setState({ showPromptAnim: false });
		}
		if (this._carousal) this._carousal.snapToItem(index);
	}

	renderAppIntro = (item: any) => {
		let index = item.index;
		return <View style={styles.animatedViewContainer}>
			{this.state.currentIndex == index &&
				<View style={styles.flex1Width90}>
					<View style={styles.titleDescContainer}>
						<TextNew style={styles.font30Weight500}>{this.appIntro[index].title}</TextNew>
						<TextNew style={[styles.font18Weight400, styles.textTopStyle]}>{this.appIntro[index].desc}</TextNew>
					</View>
					<View style={styles.lottieContainer} onStartShouldSetResponder={(e) => { if (this.state.currentIndex == this.appIntro.length - 1) this.setState({ showPromptAnim: true }); return true }}>
						{/* { !this.state.showPromptAnim && <Image style={{width: "90%", flex:1,bottom:0, height: "90%",backgroundColor:"yellow"}} source={require("../../common/lottieFiles/1_alternate.gif")} /> } */}

						{!this.state.showPromptAnim && <LottieView loop={true} speed={0.8} autoPlay={true} ref={(animation: any) => { this.animation = animation; }} style={styles.lottieImageSourceStyle} source={this.appIntro[index].imageSource} />}
						{this.state.showPromptAnim && <LottieView speed={0.8} autoPlay={true} style={styles.lottieImageSourceStyle} source={require("../../common/lottieFiles/msm_guidedTour_animation5_part2.json")} />}
					</View>
				</View>
			}
		</View>
	}

	renderDismissPopUp() {
		return <Modal transparent>
			<View style={styles.renderDismissPopUpContainerStyle}>
				<View style={styles.renderDismissPopUpSubContainerStyle}>
					<View style={styles.fullWidth}>
						<View>
							<TouchableOpacity underlayColor={Colors.transparent} onPress={() => { this.setState({ tourEnded: false }), this.setState({ tourSaveForLater: true }) }} style={{ alignItems: "flex-end", paddingRight: 2 }}>
								<Image source={close_big_grey}></Image>
							</TouchableOpacity>
						</View>
						<View style={styles.justifyalignCenetr}>
							<Image source={msm_logo} style={styles.margin10} />
							<Image source={exit_tour} style={styles.margin10} />
							<TextNew style={styles.font30Weight500}>Exit guided tour?</TextNew>
							<TextNew style={[styles.font18Weight400, styles.textTopStyle]}>You’re only few steps away from completing the tour.</TextNew>
							<SubmitButton style={styles.submitButnStyle} text="Resume tour" onPress={() => { this.setState({ beginTour: true }); this.resumeTour(); this.setState({ tourEnded: false }) }} />
							<TouchableOpacity onPress={() => { this.setState({ beginTour: false }); this.setState({ initialView: false }); this.setState({ tourSaveForLater: true }); this.setState({ tourEnded: false }) }} style={styles.buttonContainer}>
								<TextNew style={styles.font20Weight500textStyle}>Save for later</TextNew>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	}

	render() {
		return (
			<SafeAreaView><Modal transparent>
				{this.state.beginTour ?
					<View style={styles.beginTourContainer}>
						<View style={styles.beginTourCarouselContainer}>
							<View style={styles.beginTourCarouselBtnContainer}>
								{this.appIntro.length != null && this.appIntro.map((obj: any, index: any) => {
									return <View style={styles.alignItemsCenter}>
										<TouchableOpacity underlayColor={Colors.transparent} style={styles.justifyCentermargin5} onPress={() => { this.navigateToIndex(index); }}>
											<Image source={this.state.currentIndex >= index ? progress_dot_check : progress_dot}></Image>
										</TouchableOpacity>
									</View>;
								})}
								<View style={{ right: -90 }}>
									<TouchableOpacity underlayColor={Colors.transparent} onPress={() => { this.setState({ tourEnded: true }); }}>
										<Image source={close_big_grey}></Image>
									</TouchableOpacity>
								</View>
							</View>
							<Carousel
								ref={(c: any) => { this._carousal = c; }}
								data={this.appIntro}
								renderItem={(item: any) => this.renderAppIntro(item)}
								onSnapToItem={(i: any) => {
									this.playSound();
									this.setState({ showPromptAnim: false });
									this.setState({ currentIndex: i });
									//this.fadeIn(i)
								}}
								initialNumToRender={this.appIntro.length}
								sliderWidth={Dimensions.get('window').width}
								itemWidth={Dimensions.get('window').width}
								inactiveSlideScale={1}
								inactiveSlideOpacity={1}
								useScrollView={false} />
						</View>
						<View style={styles.butnContainerStyle}>
							<TouchableHighlight underlayColor={Colors.transparent} style={styles.prevBtnContainer} onPress={() => { ReactNativeHapticFeedback.trigger("notificationSuccess", options); this.setState({ showPromptAnim: false }); this._carousal.snapToPrev(); }}>
								<View style={styles.backBtnContainer}>
									<Image source={arrow_left}></Image>
									<TextNew style={styles.backTextStyle}>Back</TextNew>
								</View>
							</TouchableHighlight>
							<TouchableHighlight underlayColor={Colors.transparent} style={styles.nextBtnStyle} onPress={() => {
								ReactNativeHapticFeedback.trigger("notificationSuccess", options); if (this.state.currentIndex == this.appIntro.length - 1) {
									this.fadeInView();
									this.setState({ showMemoryCreationView: true });
									this.setState({ beginTour: false });
									this.setState({ showPromptAnim: false });
								} else { this._carousal.snapToNext(); }
							}}>
								<View style={[styles.backBtnContainer, { backgroundColor: Colors.BtnBgColor, }]}>
									<TextNew style={[styles.backTextStyle,styles.nextTextStyle]}>Next</TextNew>
									<Image source={arrow_right}></Image>
								</View>
							</TouchableHighlight>
						</View>
					</View>
					:
					<View style={styles.renderDismissPopUpContainerStyle}>
						<View style={[styles.renderDismissPopUpSubContainerStyle, { borderRadius: 10 }]}>
							{
								//this.state.tourEnded ? 
								//  this.renderDismissPopUp()
								// <View style={{width: '100%'}}>
								// 	<View> 
								// 		<TouchableOpacity underlayColor={Colors.transparent} onPress={()=> {this.setState({tourEnded: false}), this.setState({tourSaveForLater: true})}} style={{alignItems : "flex-end", paddingRight: 2}}> 
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
								// 			<TextNew style={{...fontSize(20), fontWeight: Platform.OS=='ios' ? '500' : 'bold', textAlign: 'center',color : Colors.BtnBgColor}}>Save for later</TextNew>
								// 		</TouchableOpacity>
								// 	</View>
								// </View>
								this.state.tourSaveForLater ? <View style={styles.saveLaterContainer}>
									<Image source={msm_logo} style={styles.margin10} />
									<TextNew style={[styles.font30Weight500, { marginTop: 16 }]}>Access this tour at anytime</TextNew>
									<TextNew style={[styles.font18Weight400, { margin: 12 }]}>Find this tour again when you tap the <Image style={styles.iconStyle} source={more_options_selected} /> icon</TextNew>
									<SubmitButton style={styles.submitButnStyle} text="Got it!" onPress={() => this.props.cancelAppTour()} />
								</View>
									: this.state.showMemoryCreationView ? <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor: Colors.lightSkyBlue }}>
										<Animated.View style={[styles.beginTourContainer, { opacity: this.state.fadeInView }]}>
											<View style={styles.fullWidth}>
												<View style={{ top: Platform.OS == 'ios' ? 20 : 0, zIndex: 99999 }}>
													<TouchableOpacity underlayColor={Colors.transparent} onPress={() => { this.setState({ tourEnded: false }), this.setState({ tourSaveForLater: true }); }} style={styles.closeContainerStyle}>
														<Image source={close_big_grey}></Image>
													</TouchableOpacity>
												</View>
												<View style={styles.tourContainerStyle}>
													<Image source={msm_allPages_mindPop}></Image>
													<TextNew style={[styles.font30Weight500, { marginTop: Platform.OS == 'ios' ? 20 : 10 }]}>Let’s get started!</TextNew>
													<TextNew style={[styles.font18Weight400, styles.textTopStyle]}>Add your first memory.</TextNew>
													<SubmitButton style={styles.submitButnStyleWidth75} text="Answer a Prompt" onPress={this.onClick.bind(this)} />
													<TextNew style={[styles.font20Weight500textStyle, { marginTop: 16, color: Colors.black }]}>or</TextNew>
													<TouchableOpacity onPress={() => {
														this.fadeOutView();
														setTimeout(() => {
															Actions.push("addContent", { animated: true });
															this.props.cancelAppTour();
														}, 1000);
													}} style={styles.buttonContainer}>
														<TextNew style={styles.font20Weight500textStyle}>I have a Memory in mind</TextNew>
													</TouchableOpacity>
													{/* <TouchableOpacity underlayColor={Colors.transparent} onPress={() => {
															this.fadeOutView();
															setTimeout(() => {
																Actions.push("addContent",{animated : true});
																this.props.cancelAppTour();
															}, 1000);
														}}>
													<TextNew style={{...fontSize(20), fontWeight: Platform.OS=='ios' ? '500' : 'bold', textAlign: 'center',marginTop:16,color : Colors.BtnBgColor}}>I have a Memory in mind</TextNew>
													</TouchableOpacity> */}
												</View>
												<View style={styles.newBackContainer}>
													<TouchableHighlight underlayColor={Colors.transparent} style={{ marginLeft: 16 }} onPress={() => {
														ReactNativeHapticFeedback.trigger("notificationSuccess", options); this.fadeOutView(); setTimeout(() => {
															if (this._carousal) {
																this._carousal.snapToItem(this.state.currentIndex);
															}
														}, 50);
														this.setState({ showMemoryCreationView: false });
														this.setState({ beginTour: true });
														this.setState({ showPromptAnim: false });
													}}>
														<View style={styles.backBtnContainer}>
															<Image source={arrow_left}></Image>
															<TextNew style={styles.backTextStyle}>Back</TextNew>
														</View>
													</TouchableHighlight>
												</View>
											</View>
										</Animated.View>
									</View>
										: this.state.initialView && <View style={styles.fullWidth}>
											<View>
												<TouchableOpacity onPress={() => {
													this.setState({ initialView: false });
													this.setState({ tourSaveForLater: false });
													this.setState({ tourEnded: true });
													this.setState({ showMemoryCreationView: false });
													this.setState({ beginTour: false })
												}} style={styles.closeBtnStyle}>
													<Image source={close_big_grey}></Image>
												</TouchableOpacity>
											</View>
											<View style={styles.justifyalignCenetr}>
												<Image source={msm_logo} style={styles.margin10} />
												<Image source={msm_preserveYourMemories} style={styles.margin10} />
												<TextNew style={styles.font30Weight500}>Your memories are just a tap away!</TextNew>
												<TextNew style={[styles.font18Weight400, styles.textTopStyle]}>Start with this quick tour of the app to start reminiscing today.</TextNew>
												<SubmitButton style={styles.submitButnStyle} text="Let’s get started!" onPress={() => { this.setState({ beginTour: true }); this.setState({ initialView: false }) }} />
											</View>
										</View>}
						</View>
					</View>}
				{this.state.tourEnded && this.renderDismissPopUp()}
			</Modal></SafeAreaView>
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
