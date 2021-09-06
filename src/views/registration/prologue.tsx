import React, { Component } from "react";
import { SafeAreaView, View, Image, Platform, StatusBar, TouchableOpacity, Alert, Keyboard, StyleSheet, Button, Dimensions, Animated, TouchableHighlight, TouchableWithoutFeedback, ImageBackground } from "react-native";
import DeviceInfo from 'react-native-device-info';
import { Size, fontSize, Colors } from "../../common/constants";
import Text from "../../common/component/Text";
import { connect } from "react-redux";
import { GetInstances } from "./reducer";
//@ts-ignore
import BottomDrawer from '../../common/component/rn-bottom-drawer';
import FindCommunity from "./findCommunity";
import Login, { kRegSignUp, loginType } from "../login";
import RegFirstStep from "./regFirstStep";
import GetFormData, { kCueBackRegistration, kCueBackFormData } from "./getFormData";
import { request } from "http";
import { type } from "os";
import { No_Internet_Warning, ToastMessage } from "../../common/component/Toast";
import RegistrationBackground from "./registrationBackground";
import { search_theme, login_icon, recordRegistration, icon_arrow, backArrowWhite, apple_icon, google_icon, icon_mail, background_msm } from "../../images";
import EventManager from "../../common/eventManager";
import NavigationHeaderSafeArea from "../../common/component/profileEditHeader/navigationHeaderSafeArea";
import { Account } from "../../common/loginStore";
import { Actions } from "react-native-router-flux";
import Utility from "../../common/utility";
import loaderHandler from "../../common/component/busyindicator/LoaderHandler";
import MessageDialogue from "../../common/component/messageDialogue";
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

export enum Direction{
	upDirection = "upward",
	downDirection = "downward",
	reset = "reset"
}

export var loginDrawerRef : BottomDrawer;
type Props = {
	showHeader: boolean;
	getAllInstances: Function;
	navigation: { [key: string]: any };
	end: Function;
	request: { completed: boolean; success: boolean };
};
class Prologue extends Component<Props> {
	_panel : any = null;
	currentIndex = 0;
	searchDrawerRef : any | BottomDrawer;
	loginIdentifier = "loginDrawer"
	searchIdentifier = "searchDrawer"	
	registrationData : EventManager;
	navBar : any;
	messageRef : any;
	regStep : any;
	loginControllerRef : any;
	state={
		isLoginUp : false,
		isLoginDrawerOpen : false,
		isSearchDrawerOpen : false,
		isRegistrationOpen : false,
		registrationFormData : null,
		isBottomPickerVisible : false,
		wasLoading : false
	}
	static defaultProps = {
		showHeader: false
	};

	componentWillUnmount=()=>{
		this.setState({isBottomPickerVisible: false})
	}
	componentDidMount() {
		// var { width, height } = Dimensions.get('window');
		// Alert.alert("Window Width : " + width + "Height : " + height);

		// var { width, height } = Dimensions.get('screen');
		// Alert.alert("Screen Width : " + width + "Height : " + height);
		// SafeArea.getSafeAreaInsetsForRootView()
		// .then((result) => {
		// 	console.log(result)
		// 	// { safeAreaInsets: { top: 44, left: 0, bottom: 34, right: 0 } }
		// })		
		this.setState({isBottomPickerVisible: false})
		this.registrationData = EventManager.addListener(kCueBackFormData, this.cueBackRegistrationForm);
		new GetFormData().callService(kCueBackRegistration, false, true)
		this.props.getAllInstances();	
	}

	cueBackRegistrationForm=(success: any, formList: any)=>{
		if(success){
			this.setState({registrationFormData : formList})
			if(this.state.wasLoading){
				loaderHandler.hideLoader()
				this.setState({isRegistrationOpen : true, wasLoading: false})		
			}
		}
	}
	
	componentWillReceiveProps(nextProps: Props) {
		if (nextProps.request.completed && this.props.navigation.state.routeName == "prologue") {
			this.props.end();
		}
	}

	onDrawerExpand=(identifier: any)=>{
		if(identifier==this.loginIdentifier){
			this.setState({isLoginDrawerOpen : true, isLoginUp : true});
			// this.searchDrawerRef.refDrawer.expand()
		} 
		if(identifier == this.searchIdentifier){
			this.setState({isSearchDrawerOpen : true});			
		}		
	}

	onDrawerCollapse=(identifier: any)=>{
		if(identifier==this.loginIdentifier){			
			this.setState({isLoginDrawerOpen : false, isLoginUp : false});
		} 
		if(identifier == this.searchIdentifier){			
			this.setState({isSearchDrawerOpen : false});
			loginDrawerRef.refDrawer.collapse()
		}
		Keyboard.dismiss();
		this._hide();
	}

	onResponder=(e: any, guesture: any, identifier: any, direction : any, isRelease : any)=>{		
		switch(direction){
			case Direction.reset : 	
									// this.searchDrawerRef.refDrawer._resetPosition();
									loginDrawerRef.refDrawer._resetPosition();
				break;			
			case Direction.upDirection :
					if(identifier==this.loginIdentifier && !this.state.isSearchDrawerOpen){
						if(!this.state.isLoginUp){
							this.setState({isLoginUp : true})
						}
						// if(isRelease)
						// 	this.searchDrawerRef.refDrawer.expand();
						// else 	
						// this.searchDrawerRef.refDrawer._handlePanResponderMove(e, guesture);
					}

				break;
			case Direction.downDirection :
					if(identifier==this.searchIdentifier && this.state.isLoginDrawerOpen){
						if(this.state.isLoginUp){
							this.setState({isLoginUp : false})
						}
						if(isRelease)
							loginDrawerRef.refDrawer.collapse();
						else
							loginDrawerRef.refDrawer._handlePanResponderMove(e, guesture);
					}
				break;		
		}		
	}

	drawerTapped=(identifier : any)=>{
		switch(identifier){
			case this.loginIdentifier: if(this.state.isLoginDrawerOpen){
											loginDrawerRef.refDrawer.collapse();
										}
										else{
											// this.searchDrawerRef.refDrawer.expand();
											loginDrawerRef.refDrawer.expand();
										}
				break;
			case this.searchIdentifier:	if(this.state.isSearchDrawerOpen){
											// this.searchDrawerRef.refDrawer.collapse();
											loginDrawerRef.refDrawer.collapse();
										}
										else{
											// this.searchDrawerRef.refDrawer.expand();
										}
				break;	
		}
	}

	joinPressed=()=>{
		if(Utility.isInternetConnected){			
			if(this.state.registrationFormData != null){
				this.setState({isRegistrationOpen : true})		
			}
			else{
				this.setState({wasLoading : true})
				loaderHandler.showLoader('Loading...')	
			}
		} else{
			No_Internet_Warning();
		}
	}

	onBackPressed=()=>{
		if(this.state.isRegistrationOpen && !this.state.isLoginDrawerOpen && !this.state.isSearchDrawerOpen){
			this.setState({isRegistrationOpen : false})
			// this.searchDrawerRef.refDrawer.collapse();
			loginDrawerRef.refDrawer.collapse();
		} else if(this.props.showHeader){
			Actions.pop();
		}
		// if(this.searchDrawerRef!=null && this.searchDrawerRef.refDrawer!=null){
		// 	this.searchDrawerRef.refDrawer.collapse();
		// }
		loginDrawerRef.refDrawer.collapse();
	}

	onRegFinalCallBack=(msg: any)=>{
		this.setState({isRegistrationOpen : false})
		loginDrawerRef.refDrawer.expand();
		ToastMessage(msg, Colors.ThemeColor, false, true)		
	}

	prologueHeader=()=>{
		console.log("Login controller ref : ", this.loginControllerRef)
		return <View>
					<View style={{ flexDirection: "row", width: "100%", justifyContent: "flex-start", 								
									backgroundColor: 'transparent'}}>														
							{(!this.state.isBottomPickerVisible || this.props.showHeader) && <TouchableHighlight underlayColor={"#ffffff00"} 
							onPress={()=> this.onBackPressed()}
							style={{width: "100%",alignItems: "flex-start", justifyContent:  "flex-start" , paddingTop: 3}}>
							<View style={{ flexDirection: "row", justifyContent: "flex-start", paddingLeft: 16, paddingTop: (Platform.OS == "ios" && StaticSafeAreaInsets.safeAreaInsetsBottom ? 0: 10), alignItems: "center"}}>   
								{((this.state.isLoginDrawerOpen || this.state.isSearchDrawerOpen || this.state.isRegistrationOpen || this.props.showHeader) && !this.state.isBottomPickerVisible) && <Image source={backArrowWhite}/>}
								{(this.state.isLoginDrawerOpen || this.state.isSearchDrawerOpen) && <Text style={{color: Colors.TextColor, ...fontSize(18), paddingLeft: 15}}>Go Back</Text>}
							</View>
							</TouchableHighlight>}
					</View> 
				</View>
	}

	bottomPicker=(isVisible : boolean)=>{
		this.setState({isBottomPickerVisible : isVisible})			
	}

	openLoginDrawer=()=>{
		loginDrawerRef.refDrawer.expand();
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
		let heightScreenHeight = Dimensions.get('window').height
		console.log("Device interensic height is : ", StaticSafeAreaInsets.safeAreaInsetsBottom);
		return (
			<View style={{flex: 1}}>
			<StatusBar barStyle={'dark-content'} backgroundColor = {Colors.NewThemeColor}/>
			 <SafeAreaView style={{flex: 1, backgroundColor:  Colors.NewThemeColor}}>
			 <ImageBackground source={background_msm} style={{flex: 1, justifyContent: "center"}}>	
			 <View style={{flex: 1}}>	

				{/*<RegistrationBackground/>*/}
				{/* <NavigationHeaderSafeArea height={0} ref={(ref)=> this.navBar = ref} showCommunity={false} cancelAction={()=> Actions.pop()} 
                                      hideClose={true} showRightText={false} isWhite={false}/>	 */}
				<View style={{height: "100%", width: "100%", position: "absolute",  top: "50%"}}></View>
				<View style={{top: 30, width: "100%", position: "absolute"}}>
					{this.state.isRegistrationOpen ?
					<View>
						<Text style={{padding: 16, paddingTop: 35, fontWeight: Platform.OS === "ios"? '500':'bold', ...fontSize(24), color: Colors.TextColor}}>Join My Stories Matter</Text>
						<RegFirstStep ref={(ref: any) => {this.regStep = ref}} formList={this.state.registrationFormData} isCuebackRegistration={true} navBar={this} bottomPicker={(isVisible : any)=> this.bottomPicker(isVisible)}/>
					</View>
					:<View>
						<Image style={{margin: 16, marginBottom: 0}} source={recordRegistration}></Image>
						
						<Text style={{padding: 16, paddingBottom: 10, fontWeight: Platform.OS === "ios"? '500':'bold', ...fontSize(24), color: Colors.TextColor}}>'New to{"\n"}My Stories Matter?'</Text>
						<Text style={{paddingTop: 0, padding: 16, paddingBottom: 16, fontWeight: Platform.OS === "ios"? '600':'bold', ...fontSize(20), color: Colors.TextColor}}>A life worth remembering is a life worth recording.</Text>
						
						{Platform.OS == "ios" && (Platform.Version >= 13 || Platform.Version >= "13")&&
							<TouchableHighlight underlayColor={"#ffffff00"} style={{padding: 16, paddingTop: 0}} onPress={()=>{EventManager.callBack(kRegSignUp, loginType.appleLogin)}}>
							<View style={{width: '100%', 
								borderWidth: 0.5, borderColor: "#707070", height: Size.byHeight(42), 
								alignItems: "center", justifyContent: "center", flexDirection: "row", 
								borderRadius: Size.byWidth(5), backgroundColor: "#ffffff"}}>
								<Image source={apple_icon} style={{tintColor: "#5c5c5c"}}/>
								<Text style={{marginLeft: 10, color: Colors.TextColor, fontWeight : Platform.OS === "ios"? '400':'bold', ...fontSize(20)}}>Sign up with Apple</Text>
							</View>
						</TouchableHighlight>}

						<TouchableHighlight underlayColor={"#ffffff00"} style={{padding: 16, paddingTop: 0}} onPress={()=>{EventManager.callBack(kRegSignUp, loginType.googleLogin)}}>
							<View style={{width: '100%', 
								borderWidth: 0.5, borderColor: "#707070", height: Size.byHeight(42), 
								alignItems: "center", justifyContent: "center", flexDirection: "row", 
								borderRadius: Size.byWidth(5), backgroundColor: "#ffffff"}}>
								<Image source={google_icon}/>
								<Text style={{marginLeft: 10, color: Colors.TextColor, fontWeight : Platform.OS === "ios"? '400':'bold', ...fontSize(20)}}>Sign up with Google</Text>
							</View>
						</TouchableHighlight>

						<TouchableHighlight underlayColor={"#ffffff00"} style={{padding: 16, paddingTop: 0, paddingBottom: 0}} onPress={()=>this.joinPressed()}>
							<View style={{width: '100%', 
								borderWidth: 0.5, borderColor: "#707070", height: Size.byHeight(42), 
								alignItems: "center", justifyContent: "center", flexDirection: "row", 
								borderRadius: Size.byWidth(5), backgroundColor: "#ffffff"}}>
								<Image source={icon_mail} style={{height: 14, width: 20, resizeMode: "cover",tintColor: "#5c5c5c"}}/>
								<Text style={{marginLeft: 10, color: Colors.TextColor, fontWeight : Platform.OS === "ios"? '400':'bold', ...fontSize(20)}}>Sign up with Email</Text>
							</View>
						</TouchableHighlight>

						<TouchableHighlight underlayColor={"#ffffff00"} style={{padding: 16, justifyContent: "center", alignItems: "center"}} onPress={()=>{Actions.push("commonWebView", {url : "https://mystoriesmatter.com/content/end-user-license-agreement?no_header=1", title : "Terms and Conditions"})}}>							
							<Text style={{marginLeft: 10, textAlign:"center",color: Colors.TextColor, fontWeight :Platform.OS === "ios"? '600':'bold', ...fontSize(14)}}>By Signing up,  I agree to the <Text style={{fontWeight: Platform.OS === "ios"? '500':'bold', textDecorationLine: 'underline'}}>Terms and Conditions</Text> </Text>							
						</TouchableHighlight>

						<View style={{padding: 16, paddingTop: 5, paddingBottom: 10}}>
							<View style={{height: 0, width:"100%", backgroundColor : "#555555"}}></View>
						</View>

						<TouchableHighlight underlayColor={"#ffffff00"} onPress={()=> loginDrawerRef.refDrawer.expand()} style={{width: "100%", alignItems: "center", paddingTop: 3, justifyContent: "center"}}>
							<Text style={{color: Colors.TextColor, ...fontSize(20), fontWeight: Platform.OS === "ios"? '600':'bold'}}>Already a member? Login</Text>
						</TouchableHighlight>
						
						
						{/* <TouchableHighlight underlayColor={"#ffffff00"} style={{flex: 1, padding: 16}} onPress={()=> this.joinPressed()}>							
							<View style={{flex : 1, backgroundColor : "#fff", borderRadius: 8, alignItems: "center", justifyContent: "center"}}> 
								<Text style={{padding: 16, fontWeight: 'bold', ...fontSize(22), color: Colors.ThemeLight}}>Sign up for free</Text>
							</View>
						</TouchableHighlight>
						<TouchableHighlight underlayColor={"#ffffff00"} style={{flex: 1, padding: 16}} onPress={()=>loginDrawerRef.refDrawer.expand()}>							 */}
						{/* <TouchableHighlight underlayColor={"#ffffff00"} style={{flex: 1, padding: 16}} onPress={()=>{EventManager.callBack(kRegSignUp, loginType.googleLogin)}}>							 */}
							{/* <View style={{flex : 1, backgroundColor : "#fff", borderRadius: 8, alignItems: "center", justifyContent: "center"}}> 
								<Text style={{padding: 16, fontWeight: 'bold', ...fontSize(22), color: Colors.ThemeLight}}>Login</Text>
							</View>
						</TouchableHighlight> */}

						{/* <TouchableHighlight underlayColor={"#ffffff00"} style={{width: "100%", marginTop: -10, padding: 16, justifyContent: "center", alignItems: "center"}} onPress={()=>loginDrawerRef.refDrawer.expand()}>														
								<Text style={{padding: 16, fontWeight: 'bold', ...fontSize(16), color: "#ffffff", textDecorationLine: 'underline'}}>Already a member, continue to Login</Text>							
						</TouchableHighlight> */}
					</View>
					}
				</View>		
				{/* {!this.state.isBottomPickerVisible && <BottomDrawer
					ref={(ref: any) => {this.searchDrawerRef = ref}}
					identifier={this.searchIdentifier}
					containerHeight={heightScreenHeight-70}
					startUp={false}
					downDisplay={heightScreenHeight-180-(Platform.OS == "ios" && StaticSafeAreaInsets.safeAreaInsetsBottom ? StaticSafeAreaInsets.safeAreaInsetsBottom + 10 : 0)}
					backgroundColor={"white"}
					shadow={true}
					onExpanded = {(identifier: any) => this.onDrawerExpand(identifier)}
					onCollapsed = {(identifier: any) => this.onDrawerCollapse(identifier)}
					drawerTapped = {(identifier: any) => this.drawerTapped(identifier)}
					responseRelease = {(e: any, guesture: any, identifier: any, direction: any) => 
										this.onResponder(e, guesture, identifier, direction, true)}
					panResponderMove = {(e: any, guesture: any, identifier: any, direction: any)=> 
										this.onResponder(e, guesture, identifier, direction, false)}
					offset={10}>
					<View style={{flexDirection: "row", width: "100%", padding : 15, justifyContent: "space-between"}}>
						<View style={{flexDirection: "row", alignItems: "center"}}>
							<Image source={search_theme}></Image>
							<Text style={{paddingLeft: 10, fontWeight: "500", ...fontSize(18)}}>Find your private community</Text>
						</View>
						<Image source={icon_arrow} style={{transform: [{ rotate: this.state.isSearchDrawerOpen ? '90deg' : '-90deg' }]}}/>
					</View>
					<FindCommunity openLoginDrawer={()=> this.openLoginDrawer()}/>
				</BottomDrawer>} */}
				{!this.state.isBottomPickerVisible && <BottomDrawer
					ref={(ref: any) => {loginDrawerRef = ref}}
					identifier={this.loginIdentifier}
					containerHeight={heightScreenHeight-60}
					startUp={false}
					// downDisplay={heightScreenHeight-170-(Platform.OS == "ios" && StaticSafeAreaInsets.safeAreaInsetsBottom ? StaticSafeAreaInsets.safeAreaInsetsBottom + 10 : 0)}
					downDisplay={heightScreenHeight}
					backgroundColor={"white"}
					shadow={true}					
					onExpanded = {(identifier: any) => this.onDrawerExpand(identifier)}
					onCollapsed = {(identifier: any) => this.onDrawerCollapse(identifier)}
					responseRelease = {(e: any, guesture: any, identifier: any, direction: any) => 
						this.onResponder(e, guesture, identifier, direction, true)}
					panResponderMove = {(e: any, guesture: any, identifier: any, direction: any)=> 
						this.onResponder(e, guesture, identifier, direction, false)}
					drawerTapped = {(identifier: any) => this.drawerTapped(identifier)}	
					offset={10}>
					<View style={{flexDirection: "row", width: "100%", padding : 15, justifyContent: "space-between"}}>
						<View style={{flexDirection: "row", alignItems: "center"}}>
							<Image style={{height: 25, width: 25}} resizeMode={"stretch"} source={login_icon}></Image>
							<Text style={{paddingLeft: 10, fontWeight: Platform.OS === "ios"? '500':'bold', ...fontSize(22)}}>Login</Text>
						</View>
						<Image source={icon_arrow} style={{transform: [{ rotate: this.state.isLoginDrawerOpen ? '90deg' : '-90deg' }]}}/>
					</View>
					<Login navBar={this} isLoginUp={this.state.isLoginUp}/> 							
				</BottomDrawer>}
				{(this.state.isLoginDrawerOpen || this.state.isSearchDrawerOpen || this.state.isRegistrationOpen || this.props.showHeader) && this.prologueHeader()}				
				<View style={[]}>
				</View>
				<MessageDialogue ref={(ref: any)=> this.messageRef = ref}/>
				</View>		
			</ImageBackground>
			</SafeAreaView >
			</View>
		);
	}
}
const mapState = (state: { [x: string]: any }) => ({
	request: state.requestInstances
});

const mapDispatch = (dispatch: Function) => ({
	getAllInstances: () => dispatch({ type: GetInstances.GetCall }),
	end: () => dispatch({ type: GetInstances.GetEnd })
});

export default connect(
	mapState,
	mapDispatch
)(Prologue);
