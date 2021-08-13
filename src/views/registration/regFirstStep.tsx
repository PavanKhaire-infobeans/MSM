import React, { Component } from "react";
import { SafeAreaView, View, TouchableOpacity, Keyboard, TextInput, StatusBar, TouchableHighlight, Image, Dimensions, Platform } from "react-native";
import { connect } from "react-redux";
import InstanceView from "./instanceView";
import { Account } from "../../common/loginStore";
//@ts-ignore
import { KeyboardAwareScrollView } from "../../common/component/keyboardaware-scrollview";
import { SubmitButton } from "../../common/component/button";
import TextField from "../../common/component/textField";
import Text from "../../common/component/Text";
import DropDown from "../../common/component/dropDown";
import { Size, Colors, fontSize, ERROR_MESSAGE, testEmail, TimeStampMilliSeconds, getValue } from "../../common/constants";
import { Actions } from "react-native-router-flux";
import EventManager from "../../common/eventManager";
import { ToastMessage } from "../../common/component/Toast";
import BottomPicker, { ActionSheetItem } from "../../common/component/bottomPicker";
import {
	FormStruct,
	checkUserRegistration,
	submitRegistration,
	kCheckUserProfile,
	kSubmitFormItem
} from "./registrationWebService";
import NavigationHeaderSafeArea from "../../common/component/profileEditHeader/navigationHeaderSafeArea";
import { backBlkBtn, icon_arrow, black_arrow, backArrowWhite, registration_vector, info_icon, info_icon_ } from "../../images";
import DeviceInfo from 'react-native-device-info';
import Login from "../login";
import TextNew from "../../common/component/Text";
import MessageDialogue from "../../common/component/messageDialogue";
import { loginDrawerRef } from "./prologue";
import StaticSafeAreaInsets from "react-native-static-safe-area-insets";

type State = { [key: string]: any | string; error: { [x: string]: { error: boolean; message: string } } };
type Props = { formList: FormStruct[] } & any;

export default class RegFirstStep extends Component<Props> {
	checkProfile: EventManager;
	submitReg: EventManager;
	form: FormStruct[] = [];
	textFieldArray: { [key: string]: TextInput } = {};
	submitForm: any;
	bottomPicker: React.RefObject<BottomPicker> = React.createRef<BottomPicker>();
	navBar : any;
	isBirthYear: boolean = false;
	constructor(props: Props) {
		super(props);
		this.checkProfile = EventManager.addListener(kCheckUserProfile, this.checkUserProfile);
		this.submitReg = EventManager.addListener(kSubmitFormItem, this.submitRegisterResponse);
		this.isBirthYear = false;
		if(this.props.navBar){
			this.navBar = this.props.navBar;			
		}
		this.form = this.props.formList;
	}

	state: State = {
		error: {},
		selectionData: {
			actions: [],
			selectionValue: "",
			isMultiSelect: false,
			fieldName: "",
			title:""
		}, 
		errorHeight: 0
	};

	//On CheckProfile web service end
	checkUserProfile = (success: boolean, isRegistered: any, personalInfo?: any) => {
		if (success) {
			let role = getValue(personalInfo, ["role"]);
			if (isRegistered && role == "Alumni") {
				if(this.props.isCuebackRegistration){					
					this.navBar.onRegFinalCallBack(`An account with the email already exists, please login to continue`)
				}
				//Go to Result screen showing user is already registered				
				else{
					Actions.replace("userRegStatus", { isAlreadyRegistered: true, registeredSuccess: false, userDetails: this.submitForm });
				}
				// Actions.userRegStatus({ isAlreadyRegistered: true, registeredSuccess: false, userDetails: this.submitForm });
			} else {
				//Call Register request if profile doesn't exists or is ghost
				submitRegistration(this.submitForm);
			}
		} else {
			this.showErrorMessage(true, typeof isRegistered == "string" ? isRegistered : ERROR_MESSAGE)
			// ToastMessage(typeof isRegistered == "string" ? isRegistered : ERROR_MESSAGE, Colors.ErrorColor);
		}
	};

	//On Register web service end
	submitRegisterResponse = (success: boolean, message: string, registrationData: any, formError: any) => {
		if (success) {
			if(this.props.isCuebackRegistration){				
				this.navBar.onRegFinalCallBack('User registered successfully. Please verify link on email and login to continue');
			} else{
				Actions.replace("userRegStatus", { isAlreadyRegistered: false, registeredSuccess: true, message });
			}
		} else {
			var error = {};
			for (let key in formError) {
				let strKey = key.replace(/].*$/, "");
				error = { ...error, [strKey]: { error: true, message: formError[key] } };
			}
			if (Object.keys(error).length > 0) {
				this.setState({ error });
			}
			this.showErrorMessage(true, typeof message == "string" ? message : ERROR_MESSAGE);
			//ToastMessage(typeof message == "string" ? message : ERROR_MESSAGE, Colors.ErrorColor);
		}
	};

	//Dynamic Form generator
	getFormEntity(form: FormStruct, { fieldID = "", isLast, hasParent = false, parentType = null }: { fieldID: string, isLast: boolean; hasParent?: boolean; parentType?: any }) {
		//Show horizonatal form items
		if (form.type.indexOf("sub") !== -1) {
			let parentType = form.type;
			if (form.form.length > 0) {
				let formLength = form.form.length;
				return (
					<View key={form.field_name} style={{ flexDirection: "column", marginBottom: 15, alignItems: "flex-start" }}>
						<Text style={{ marginTop: 10, color : this.props.isCuebackRegistration ? Colors.TextColor: Colors.TextColor }}>{form.label}</Text>
						<View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12, height: 70, width: '100%'}}>
							{form.form.map((form: FormStruct, index: number) => {
								return this.getFormEntity(form, { fieldID: `${index}`, isLast: formLength - 1 == index, hasParent: true, parentType });
							})}
						</View>
					</View>
				);
			} else {
				return <React.Fragment key={form.field_name} />;
			}
		}

		//If form element
		let valueKey = form.module == "date" || form.module == "options" || form.type == "options_select" ? "selectedValue" : "value";
		var extra: { [x: string]: any } = {
			[valueKey]: this.state[`${form.field_name}${form.module == "date" || form.module == "options" || form.type == "options_select" ? "_text" : ""}`] || ""
		};
		if (form.isPassword) {
			extra = {
				...extra,
				secureTextEntry: true,
				passwordToggle: true
			};
		}
		var showError = false,
			errorMessage = "";
		if (this.state.error[form.field_name]) {
			showError = this.state.error[form.field_name].error;
			errorMessage = this.state.error[form.field_name].message;
		}

		if (hasParent) {
			extra = {
				...extra,
				style: { width: parentType == "sub-single" ? "100%" : "48%" }
			};
		}

		extra = {
			...extra,
			showError,
			errorMessage,
			isRequired: form.required
		};

		if (form.field_name == "emailAddress") {
			extra = {
				...extra,
				keyboardType: "email-address"
			}
		}
		if (form.module == "date" || form.module == "options" || form.type == "options_select" || form.type == "options_buttons") {	
			if(form.label == "Year"){
				this.isBirthYear = true;
			}		
			return 	<DropDown isCuebackRegistration={this.props.isCuebackRegistration} key={form.field_name} placeholderText={form.label} {...extra} onOptionSelected={this.onOptionSelection(form)} />						
		}
		var txtF = (
			<View>
				<TextField
					key={form.field_name}
					isCuebackRegistration={this.props.isCuebackRegistration}
					reference={(input: TextInput) => {
						this.textFieldArray = {
							...this.textFieldArray,
							[fieldID]: input
						}
					}}
					showStrength={form.field_name == "password"}
					placeholder={form.label}
					{...extra}
					returnKeyType={isLast ? "done" : "next"}
					onChange={(text: string) => {
						this.setState({ [form.field_name]: text, error: { ...this.state.error, [form.field_name]: { error: false, message: "" } } });
					}}
					onSubmitEditing={() => {
						let nextRef = `${(parseInt(fieldID) + 1)}`;
						this.textFieldArray[nextRef] && typeof this.textFieldArray[nextRef].focus == "function" && (this.textFieldArray[nextRef] as TextInput).focus();
					}}
				/>				
			</View>
		);
		return txtF;
	}

	onOptionSelection = (form: FormStruct) => () => {
		Keyboard.dismiss();
		var actions: ActionSheetItem[] = [];
		if (form.module == "date") {
			let least = 1917, most = new Date().getFullYear();
			if (form.field_name == "default_value2") {
				if (this.state["default_value"]) {
					least = this.state["default_value"] - 1
				}
			}
			if (form.field_name == "default_value") {
				if (this.state["default_value2"]) {
					most = this.state["default_value2"] - 1
				}
			}
			for (var i = most; i > least; i--) {
				actions.push({ key: i, text: `${i}` });
			}
		} else {
			for (let key in form.values) {
				actions.push({ key, text: form.values[key] });
			}
		}

		this.setState({
			selectionData: {
				...this.state.selectionData,
				actions,
				selectionValue: this.state[form.field_name] || "",
				fieldName: form.field_name,
				title : form.label
			}
		}, () => {
			this.bottomBarCallBack(true)
			this.bottomPicker.current && this.bottomPicker.current.showPicker && this.bottomPicker.current.showPicker();
		});
	};

	showErrorMessage=(show: boolean, message?: string)=>{
        let height = 0;
        if(show){
			height = 0;
			this.navBar._showWithOutClose(message, Colors.ErrorColor);
        } 
        else{
            this.navBar._hide();
        }
        this.setState({errorHeight : height})
	}
	
	renderCueBackRegistertaion=()=>{
		let formLength = this.form.length;
		return <View style={{flex: 1, height : Dimensions.get('window').height-100, paddingBottom : 20 + (Platform.OS == "ios" && StaticSafeAreaInsets.safeAreaInsetsBottom ? StaticSafeAreaInsets.safeAreaInsetsBottom + 50 : 0)}}>
					<KeyboardAwareScrollView
								keyboardShouldPersistTaps="always"
								style={{ width: "100%", flex : 1, backgroundColor: "transparent"}}
								contentContainerStyle={{ alignItems: "center" }}
								bounces={false}>
								<View style={{ width: "100%", padding : 15 }}>								
									{this.form.map((form: FormStruct, index: number) => {
										return this.getFormEntity(form, { fieldID: `${index}`, isLast: formLength - 1 == index });
									})}
									{/* {this.props.placeholderText == "Year" &&  */}
									{this.isBirthYear && <View style={{flexDirection : "row", top: -15, marginBottom: 10, justifyContent: "flex-start"}}>
										<Image source={info_icon_} style={{tintColor: Colors.TextColor, marginTop: 2}}/>
										<Text style={{flex: 1, marginLeft: 5, ...fontSize(15), fontWeight: "300", fontStyle: "italic", color: Colors.TextColor}}>We only use your birth year to customize what you see on My Stories Matter, such as your personal Timeline.</Text> 
									</View>}
									<TouchableHighlight underlayColor={"#ffffff00"} style={{width: "100%", marginBottom : 10}} onPress={()=>this.onSubmit()}>							
										<View style={{flex : 1, backgroundColor : "rgba(55, 56, 82, 0.6)", borderRadius: 8, alignItems: "center", justifyContent: "center"}}> 
											<Text style={{padding: 12, fontWeight: Platform.OS === "ios"? '500':'bold', ...fontSize(22), color: "#fff"}}>Join</Text>
										</View>
									</TouchableHighlight>
									{/* <SubmitButton style={{backgroundColor: "#fff"}} text="Join" onPress={this.onSubmit} />									 */}
								</View>
							</KeyboardAwareScrollView>
							<BottomPicker
								ref={this.bottomPicker}
								onItemSelect={(selectedItem: ActionSheetItem) => {
									let fieldName = this.state.selectionData.fieldName;
									this.setState({
										[fieldName]: selectedItem.key !== "_none" ? selectedItem.key : "",
										[`${fieldName}_text`]: selectedItem.key !== "_none" ? selectedItem.text : "",
										error: { ...this.state.error, ...(selectedItem.key !== "_none" ? { [fieldName]: { error: false, message: "" } } : {}) },
										selectionData: {
											actions: [],
											selectionValue: "",
											fieldName: "",
											isMultiSelect: false
										}
									});
								}}
								title={this.state.selectionData.title}
								actions={this.state.selectionData.actions}
								value={this.state.selectionData.selectionValue}
								needHideCallback={true}
								hideCallBack={()=> this.bottomBarCallBack(false)}
							/>
				</View>

	}

	bottomBarCallBack=(isVisible : boolean)=>{
		if(this.props.bottomPicker){
			this.props.bottomPicker(isVisible)	
		}
	}

	render() {
		let formLength = this.form.length;
		return (
			<View style={{flex: 1}}>
			{this.props.isCuebackRegistration ? this.renderCueBackRegistertaion() : 
			<SafeAreaView style={{ flex: 1, backgroundColor: "#fff", alignItems: "center" }}>
				<View style={{flex: 1, width: "100%", alignItems: "center"}}>
				<NavigationHeaderSafeArea isRegisteration={true} ref={(ref) => this.navBar = ref}/>
				<StatusBar barStyle={'dark-content'} backgroundColor={Colors.NewThemeColor} />
				<View style={{height : this.state.errorHeight, width : '100%'}}></View>
				<KeyboardAwareScrollView
					keyboardShouldPersistTaps="always"
					style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
					contentContainerStyle={{ alignItems: "center" }}
					bounces={false}>
					<View style={{ width: "100%", padding : 15}}>
						<View style={{flexDirection : "row", alignItems : "center", paddingBottom: 15}}>
							<Image source={registration_vector}/>
							<Text style={{fontWeight: Platform.OS === "ios"? '600':'bold', ...fontSize(18), paddingLeft : 10}}>Registration</Text>
						</View>
						{this.form.map((form: FormStruct, index: number) => {
							return this.getFormEntity(form, { fieldID: `${index}`, isLast: formLength - 1 == index });
						})}
						{this.isBirthYear && <View style={{flexDirection : "row", top: -15, marginBottom: 10, justifyContent: "flex-start"}}>
										<Image source={info_icon} style={{tintColor: "#000", marginTop: 2}}/>
										<Text style={{flex: 1, marginLeft: 5, ...fontSize(15), fontWeight: "300", fontStyle: "italic", color: "#000"}}>We only use your birth year to customize what you see on My Stories Matter, such as your personal Timeline.</Text> 
						</View>}
						<SubmitButton  text="Send Request to Join" onPress={this.onSubmit} />
						{/** Join now UI */}
						<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: Size.byWidth(32) }}>
							<Text style={{ alignContent: "center", ...fontSize(Size.byWidth(18)) }}>{"Already a member? "}</Text>
							<TouchableOpacity
								onPress={() => {
									this.props.openLoginDrawer();
									setTimeout(() => {
										Actions.pop();
									}, 500); 
								}}
								style={{
									width: "auto",
									height: Size.byWidth(44),
									alignItems: "flex-end",
									justifyContent: "center",
									backgroundColor: "transparent"
								}}>
								<Text style={{ fontWeight: Platform.OS === "ios"? '600':'bold', color: Colors.NewTitleColor, ...fontSize(Size.byWidth(18)) }}>Login</Text>
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAwareScrollView>
				<BottomPicker
					ref={this.bottomPicker}
					onItemSelect={(selectedItem: ActionSheetItem) => {
						let fieldName = this.state.selectionData.fieldName;
						this.setState({
							[fieldName]: selectedItem.key !== "_none" ? selectedItem.key : "",
							[`${fieldName}_text`]: selectedItem.key !== "_none" ? selectedItem.text : "",
							error: { ...this.state.error, ...(selectedItem.key !== "_none" ? { [fieldName]: { error: false, message: "" } } : {}) },
							selectionData: {
								actions: [],
								selectionValue: "",
								fieldName: "",
								isMultiSelect: false
							}
						});
					}}
					title={this.state.selectionData.title}
					actions={this.state.selectionData.actions}
					value={this.state.selectionData.selectionValue}
				/>
				</View>
			</SafeAreaView>}
			</View>
		);
	}

	//Submit Form
	onSubmit = () => {
		var submitForm: any = {};
		for (let frm of this.form) {
			let parentKey = "personalInfo";
			var frmEnt: any = {};

			if (frm.field_name == "emailAddress" || frm.field_name == "password" || frm.field_name == "repeat_password") {
				parentKey = "authorizationInfo";
				submitForm = { ...submitForm, [parentKey]: { ...(submitForm[parentKey] || {}), [frm.field_name]: this.state[frm.field_name] } };
			} else {
				if (frm.type.indexOf("sub") !== -1) {
					let main = frm.form[0];
					if (frm.type == "sub-single" && this.state[main.field_name]) {
						frmEnt = {
							...frmEnt,
							value: this.state[main.field_name],
							value2: this.state[main.field_name] + 4
						};
					} else {
						for (let fiTm of frm.form) {
							if (this.state[fiTm.field_name]) {
								frmEnt = {
									...frmEnt,
									[fiTm.field_name.replace("default_", "")]: this.state[fiTm.field_name]
								};
							}
						}
					}
					if (Object.keys(frmEnt).length > 0) {
						frmEnt = {
							...frmEnt,
							module: main.module,
							type: main.type
						};
					}
				} else {
					let value = this.state[frm.field_name]
					if (frm.type == "options_select") {
						value = {
							[value]: frm.values[value]
						}
					}
					if (this.state[frm.field_name]) {
						frmEnt = {
							...frmEnt,
							module: frm.module,
							type: frm.type,
							value
						};
					}
				}
				submitForm = { ...submitForm, [parentKey]: { ...(submitForm[parentKey] || {}), [frm.field_name]: frmEnt } };
			}
		}

		var error = {};
		for (let key in submitForm) {
			if (key == "authorizationInfo") {
				let sbForm = submitForm[key];
				for (let sKey in sbForm) {
					if (typeof sbForm[sKey] == "undefined" || (typeof sbForm[sKey] == "string" && sbForm[sKey].length == 0)) {
						var message = `Please enter text`;
						if (sKey == "emailAddress") {
							message = "Please enter your Email";
						}
						error = { ...error, [sKey]: { error: true, message } };
					} else {
						if (sKey == "emailAddress") {
							let email = sbForm[sKey];
							if (!testEmail(email)) {
								error = { ...error, [sKey]: { error: true, message: "Please enter a valid Email" } };
							}
						}
						if (sKey == "password") {
							let password = sbForm[sKey];
							if (password.length < 6) {
								error = { ...error, [sKey]: { error: true, message: "Password must be at least 6 characters long" } };
							}
						}
						if (sKey == "repeat_password") {
							let password = sbForm["password"];
							let repeat_password = sbForm[sKey];
							if (password.length >= 6 && password != repeat_password) {
								error = { ...error, [sKey]: { error: true, message: "Please enter the same Password again" } };
							}
						}

					}
				}
			} else {
				let sbForm = submitForm[key];
				for (let sKey in sbForm) {
					let frmItem = this.form.find((it) => it.field_name == sKey)
					if (frmItem.type.indexOf("sub") == 0) {
						for (let fitm of frmItem.form) {
							if (typeof sbForm[sKey] == "undefined" || (typeof sbForm[sKey] == "object" && Object.keys(sbForm[sKey]).length == 0)) {
								error = { ...error, [fitm.field_name]: { error: true, message: `Please select ${fitm.label}${fitm.module == "date" && fitm.label != "Year" ? " year" : ""}` } };
							} else {
								let keyVal = fitm.field_name.replace("default_", "");
								if (!getValue(sbForm, [sKey, keyVal])) {
									error = { ...error, [fitm.field_name]: { error: true, message: `Please select ${fitm.label}${fitm.module == "date" ? " year" : ""}` } };
								}
							}
						}
					} else if (typeof sbForm[sKey] == "undefined" || (typeof sbForm[sKey] == "object" && Object.keys(sbForm[sKey]).length == 0)) {
						error = { ...error, [sKey]: { error: true, message: `Please enter ${frmItem.label}` } };
						if (sKey == "emailAddress") {
							let email = sbForm[sKey];
							if (!testEmail(email)) {
								error = { ...error, [sKey]: { error: true, message: "Please enter Email" } };
							}
						}
						if (sKey == "password") {
							let password = sbForm[sKey];
							if (password.length < 6) {
								error = { ...error, [sKey]: { error: true, message: "Please enter a Password" } };
							}
						}
						if (sbForm[sKey] == "repeat_password") {
							let password = sbForm["password"];
							let repeat_password = sbForm[sKey];
							if (password.length >= 6 && password != repeat_password) {
								error = { ...error, [sKey]: { error: true, message: "Please enter the same Password again" } };
							}
						}
					} else {
						if (sKey == "field_first_name" || sKey == "field_last_name") {
							let text = getValue(sbForm, [sKey, "value"]);
							let onlyChars = /^[a-z|A-Z]*$/;
							if (!onlyChars.test(text)) {
								error = { ...error, [sKey]: { error: true, message: "Only characters are allowed" } };
							}
						}
					}
				}
			}
		}
		if (Object.keys(error).length > 0) {
			this.showErrorMessage(true, "Please check the highlighted fields")
			// ToastMessage();
			this.setState({ error });
			return;
		}
		//console.log(submitForm);
		delete submitForm["authorizationInfo"]["repeat_password"];
		submitForm["configurationTimestamp"] = TimeStampMilliSeconds();
		this.submitForm = submitForm;
		var obj = {}
		var name = ""
		var email = ""
		if (getValue(submitForm.personalInfo, ["field_first_name"])) {
			name = `${submitForm.personalInfo.field_first_name.value} ${submitForm.personalInfo.field_last_name.value}`
		}
		if (getValue(submitForm.authorizationInfo, ["emailAddress"])) {
			email = submitForm.authorizationInfo.emailAddress
		}
		obj = {
			...obj,
			name: name,
			emailId: email,
		}

		checkUserRegistration({			
			...obj,
			configurationTimestamp: submitForm["configurationTimestamp"]
		});
	};

	componentWillUnmount() {
		this.checkProfile.removeListener();
		this.submitReg.removeListener();
		this.navBar._hide();
	}
}