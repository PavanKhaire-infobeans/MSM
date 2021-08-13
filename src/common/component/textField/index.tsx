import React from "react";
import { TextInput, TouchableOpacity, View, Animated, Platform, Image, TouchableHighlight } from "react-native";
import Text from "../Text";
import { Props, State } from "./types";
import { styles } from "./design";
import { visibility, visibility_off } from "../../../images";
import { Colors, fontSize } from "../../constants";

const kTop = 19,
	kTopAnimated = 5;
const kPlaceHolderFontSize = 18;
enum PasswordStrength{
	weak = "Weak",
	medium = "Medium",
	strong = "Strong"
}

export const rgularExp : any = {
	containsNumber : /\d+/,
	containsSmallLetters : /[a-z]/,
	containsCapitalLetters : /[A-Z]/,
	containsSpecialCharacters : /[!@#$%^&*(),.?":{}|<>]/
}
export default class TextField extends React.Component<Props, State> {
	isBlurred = true;
	ref : TextInput;
	static defaultProps = {
		value: "",
		secureTextEntry: false,
		placeholderTextColor: "gray",
		placeholder: "Enter the value",
		errorMessage: "Text entered is invalid",
		showError: false,
		supportAutoFocus: false,
		inputTextStyle: styles.inputTextStyle,
		inputViewStyle: styles.inputViewStyle,
		inputFieldForPayment: false,
		returnKeyType: "return",
		autoFocus: false,
		passwordToggle: false,
		isRequired: false,
		onSubmitEditing: () => { },
		isCuebackRegistration: false,
		showStrength : false
	};
	constructor(props: Props) {
		super(props);
		const val = this.props.value || "";

		this.state = {
			sizeFnt: new Animated.Value(val.length > 0 ? 13 : kPlaceHolderFontSize),
			top: new Animated.Value(val.length > 0 ? kTopAnimated : kTop),
			height: new Animated.Value(56),
			opacity: new Animated.Value(0),
			leftTextInput: Platform.OS === "ios" ? 0 : -5,
			animatedViewHeight: Platform.OS === "ios" ? 16 : 26,
			showClearImage: false,
			text: "",
			showPassword: props.passwordToggle ? true : false,
			numericValue: 0,
			passwordStrength : PasswordStrength.weak,
			showPasswordStrength : false
		};
	}

	componentWillReceiveProps(nextProps: Props) {
		if (this.props.showError !== nextProps.showError) {
			Animated.parallel([
				Animated.timing(this.state.height, {
					toValue: 56,
					duration: 100
				}),
				Animated.timing(this.state.opacity, {
					toValue: nextProps.showError ? 1 : 0,
					duration: 100
				})
			]).start();
		}
		if (nextProps.supportAutoFocus) {
			this.onFocus();
		}
		this.setState({
			showClearImage: this.isBlurred ? false : nextProps.value.length != 0
		});
	}

	onBlur = () => {
		this.setState({
			showClearImage: false
		});
		this.isBlurred = true;
		if (this.props.value.length == 0) {
			Animated.parallel([
				Animated.timing(this.state.sizeFnt, {
					toValue: kPlaceHolderFontSize,
					duration: 300
				}),
				Animated.timing(this.state.top, {
					toValue: this.props.inputFieldForPayment ? kTopAnimated : kTop,
					duration: 300
				})
			]).start();
		}
	};

	onFocus = () => {
		Animated.parallel([
			Animated.timing(this.state.sizeFnt, {
				toValue: 13,
				duration: 300
			}),
			Animated.timing(this.state.top, {
				toValue: kTopAnimated,
				duration: 300
			})
		]).start();
		this.isBlurred = false;
		this.setState({
			showClearImage: this.props.value.length != 0
		});
	};

	onTextChange=(text : any)=>{
		if(this.props.showStrength && text.trim().length > 0 && !this.state.showPasswordStrength){
			this.setState({showPasswordStrength: true})
		} else if(this.props.showStrength && text.trim().length == 0){
			this.setState({showPasswordStrength: false})
		}

		if(this.props.showStrength){
			let count = 0;
			rgularExp.containsNumber.test(text.trim()) ?  count++ : count;
			rgularExp.containsSmallLetters.test(text.trim()) ?  count++ : count;
			rgularExp.containsCapitalLetters.test(text.trim()) ?  count++ : count;
			// rgularExp.containsSpecialCharacters.test(text.trim()) ?  count++ : count;			
			this.setState({passwordStrength : count})
		}
		this.props.onChange(text);
	}

	render() {
		return (
			<View style={[this.props.style, { flexDirection: 'column', marginBottom : 5}]}>
				<View style={{ flex: 1, 
					justifyContent: "center", width: "100%",					
					}}>
					<Animated.View
						style={{							
							height: this.state.height,	
							backgroundColor: this.props.isCuebackRegistration ? "#fff" :Colors.NewLightCommentHeader,
							flexDirection: "row", borderRadius : 8, overflow: "hidden", 
							borderWidth: 1, 
							borderColor: this.props.showError ? "red" : this.props.isCuebackRegistration ? Colors.TextColor : "transparent"
						}}>
						<View style={[this.props.inputViewStyle, {}]}>
							<Animated.Text
								style={{
									color: this.props.isCuebackRegistration ? Colors.TextColor:!this.isBlurred || this.props.value.length > 0 ? Colors.NewTitleColor : this.props.placeholderTextColor,
									...fontSize(this.state.sizeFnt),
									fontFamily: "Rubik",
									position: "absolute",
									top: this.state.top,
									left: 8,
									opacity: this.props.isCuebackRegistration ? 0.6: 1
								}}>
								{this.props.placeholder}
								{this.props.isRequired ? <Animated.Text style={{ color: Colors.NewRadColor }}>{" *"}</Animated.Text> : null}
							</Animated.Text>

							<TextInput
								returnKeyType={this.props.returnKeyType}
								keyboardType={
									this.props.keyboardType == "numeric"
										? "numeric"
										: this.props.keyboardType == "email-address"
										? "email-address" 
										: this.props.keyboardType =="phone-pad" 
										?  "phone-pad"	: "ascii-capable"
								}								
								autoCapitalize={"none"}
								autoCorrect={false}
								onSubmitEditing={this.props.onSubmitEditing}
								blurOnSubmit={this.props.blurOnSubmit}
								maxLength={this.props.maxLength}
								secureTextEntry={this.state.showPassword ? this.props.secureTextEntry : false}
								onChangeText={(text : any) => this.onTextChange(text)}
								style={[this.props.inputTextStyle, {color : this.props.isCuebackRegistration ? Colors.TextColor : Colors.TextColor, backgroundColor: "transparent",left: this.state.leftTextInput, ...(!this.state.showPassword ? { fontFamily: "Rubik" } : {}) }]}
								numberOfLines={1}
								onFocus={this.onFocus}
								multiline={false}
								defaultValue={this.props.value}
								clearButtonMode={this.props.clearButtonMode}
								selectionColor={"darkgray"}
								spellCheck={false}
								onEndEditing={this.props.onEndEditing}
								underlineColorAndroid="transparent"
								onBlur={this.onBlur}
								ref={this.props.reference}
								autoFocus={this.props.autoFocus}
							/>
						</View>
						{this.props.passwordToggle ? (
							<View style={{ width: Platform.OS == "ios" ? 50 : 70, height: "100%", justifyContent: "center", alignItems:"center", paddingBottom: 5 }}>
								<TouchableOpacity
									onPress={() => {
										this.setState({ showPassword: !this.state.showPassword });
									}}
									style={{
										zIndex: 99999,										
										padding: 5,
										paddingTop: 10,
										paddingRight : 8,
										width: Platform.OS == "ios" ? 50 : 70,
										height: 60,																				
										justifyContent: "center",
										alignItems: "center"
									}}>
									<Image style={{tintColor : this.props.isCuebackRegistration ? Colors.TextColor: Colors.TextColor}} source={this.state.showPassword ? visibility_off : visibility} />
								</TouchableOpacity>
							</View>
						) : this.state.showClearImage ? (
							<TouchableOpacity
								onPress={this.props.onPressClear}
								style={{
									padding: 5,
									right: 0,
									top: this.props.inputFieldForPayment ? 3 : 2,
									position: "absolute",
									marginRight: 3
								}}>
								<Image
									source={require("../../../images/cross/cross_icon.png")}
									style={{
										justifyContent: "center",
										width: 1,
										height: 1
									}}
								/>
							</TouchableOpacity>
						) : null}
					</Animated.View>
				</View>
				{this.state.showPasswordStrength &&
					<View style={{marginLeft: 10}}>
						<View style={{flexDirection : "row", marginTop: 8, marginBottom: 2}}>
							{Array(this.state.passwordStrength).fill(this.state.passwordStrength).map(()=>{
								return <View style={{backgroundColor: this.state.passwordStrength > 2 ? Colors.passwordStrong: this.state.passwordStrength > 1 ? Colors.passwordMedium: Colors.passwordWeak, width : "31%", height: 2, marginRight: "2%", borderRadius: 19}}/>
							})}
						</View>
						<Text
							style={{
								...fontSize(14),
								color: this.props.isCuebackRegistration ? Colors.TextColor: Colors.TextColor,
								marginTop: 5,
								lineHeight: 13
							}}>
							Password Strength : <Text style={{fontWeight : Platform.OS === "ios"? '500':'bold'}}>{this.state.passwordStrength > 2 ? PasswordStrength.strong : this.state.passwordStrength > 1 ? PasswordStrength.medium: PasswordStrength.weak}</Text>
						</Text>					
					</View>
				}
				<Animated.View
					style={{
						width: "100%",
						height: this.props.animatedViewHeight,
						opacity: this.state.opacity,
						alignItems: "flex-start"
					}}>
					<View style={{ minWidth: 180 }}>
						<Text
							style={{
								...fontSize(11),
								color: "red",
								marginTop: 1,
								lineHeight: 13,
								letterSpacing: -0.1
							}}>
							{`*${this.props.errorMessage}`}
						</Text>
					</View>
				</Animated.View>
			</View>
		);
	}
}
