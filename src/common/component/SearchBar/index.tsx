import React, { RefObject } from "react";
import { TextInput, View, StyleSheet, Image, Platform, Dimensions, TouchableOpacity, ViewStyle, StyleProp, ImageStyle } from "react-native";
import Text from '../Text';
import DeviceInfo from "react-native-device-info";
import { searchIcon, icon_close_black } from '../../../images'
import { fontSize } from "../../constants";

type Props = { [x: string]: any, placeholder: string }
export default class SearchBar extends React.Component<Props> {
	inputField : RefObject<TextInput> = React.createRef<TextInput>()
	state = {
		editing: false,
		value: "",
		barWidth: 0,
		searchWidth: 0,
		isFocused: false
	};

	componentWillReceiveProps(props: Props) {
		if (this.props.value != props.value && props.value != this.state.value) {
			this.setState({ value: props.value || "" })
		}
	}

	componentDidMount() {
		this.setState({ isFocused: this.inputField.current.isFocused() });
	}

	constructor(props: Props) {
		super(props);
		this.state = {
			...this.state,
			value: props.value || ""
		}
	}

	static defaultProps = {
		placeholder: "Search",
		onFocus: () => { }
	};

	render() {
		var design: any[] = [searchStyle.imageParent];
		var showCancelClear = true;
		var borderRadius = false;
		if (typeof this.props.showCancelClearButton !== "undefined") {
			showCancelClear = this.props.showCancelClearButton;
		}

		if (typeof this.props.borderRadius !== "undefined") {
			borderRadius = this.props.borderRadius;
		}

		design.push({
			left: 0,
			position: "absolute"
		});

		return (
			<View style={[searchStyle.parent, { backgroundColor: this.props.barTintColor, flexDirection: "row" }, (this.props.style || {})]}>
				<View
					style={[
						searchStyle.baseFlex,
						{
							backgroundColor: this.props.textFieldBackgroundColor,
							borderRadius: borderRadius ? 20 : 8,
							borderColor: borderRadius ? "#CCCCCC" : null,
							borderWidth: borderRadius ? 1 : null
						}
					]}>
					<View style={design}>
						<Image resizeMode="contain" style={searchStyle.imageStyle as StyleProp<ImageStyle>} source={searchIcon} />
						<Text
							style={[
								searchStyle.placeholder,
								{ opacity: this.state.value.length > 0 ? 0 : 1, ...fontSize(16), lineHeight: 20 }
							]}>
							{this.props.placeholder}
						</Text>
					</View>
					<View style={searchStyle.inputView}>
						<TextInput
							ref={this.inputField}
							autoCapitalize="none"
							allowFontScaling={false}
							clearButtonMode="always"
							autoCorrect={false}
							style={searchStyle.inputStyle}
							maxLength={20}
							onChangeText={text => {
								this.setState({
									value: text
								});

								if (this.props.onChangeText) {
									this.props.onChangeText(text);
								}

								if (this.props.onClearField && text.length == 0) {
									if(!this.props.retainFocus){
										this.inputField.current.blur()
									}
									this.props.onClearField();
								}
							}}
							keyboardType="ascii-capable"
							value={this.state.value}
							enablesReturnKeyAutomatically={true}
							returnKeyType="search"
							underlineColorAndroid="transparent"
							onFocus={this.focus.bind(this)}
							onBlur={this.blur.bind(this)}
							onSubmitEditing={() => this.props.onSearchButtonPress(this.state.value)}
						/>
						{this.showClear()}
					</View>
				</View>
				{showCancelClear ? this.showCancelOnIos() : null}
			</View>
		);
	}

	cancelPressed() {
		//dismissKeyboard();
		this.blur();
		this.clearField();
	}

	focus() {
		this.setState({
			editing: true
		});

		if (this.props.onFocus) {
			this.props.onFocus();
		}
	}

	blur() {
		this.setState({
			editing: false
		});
		if (this.inputField) {
			this.inputField.current.blur();
		}
		if (this.props.onBlur) {
			this.props.onBlur();
		}
	}

	clearField() {
		this.inputField.current.clear();
		this.setState({ value: "" });
		if (this.props.onClearField) {
			this.props.onClearField();
		}
	}

	showClear() {
		if (Platform.OS === "android") {
			if (this.state.value.length > 0) {
				return (
					<TouchableOpacity
						onPress={() => {
							this.clearField();
						}}
						style={searchStyle.clearButton}>
						<Image source={icon_close_black} style={{ width: 18, height: 18 }} resizeMode="contain" />
					</TouchableOpacity>
				);
			}
		}
	}

	showCancelOnIos() {
		if (Platform.OS == "ios") {
			if (this.state.editing) {
				return (
					<TouchableOpacity
						onPress={() => {
							this.cancelPressed();
						}}
						style={{ flex: 1, justifyContent: "center", alignItems: "center", marginLeft: 8 }}>
						<Text style={searchStyle.cancel}>Cancel</Text>
					</TouchableOpacity>
				);
			}
		}
		return null;
	}
}

const searchStyle = StyleSheet.create({
	parent: {
		height: 48,
		paddingRight: 5,
		paddingLeft: 5,
		paddingTop: 4,
		paddingBottom: 4,
		shadowColor: '#000000',
		backgroundColor: "white",
		borderBottomWidth: 0.3,
		borderBottomColor: 'transparent',
	},
	baseFlex: {
		borderRadius: 8,
		flex: 6,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center"
	},
	inputView: {
		width: "100%",
		height: "100%",
		paddingLeft: 15,
		flexDirection: "row"
	},
	clearButton: {
		height: "100%",
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		opacity: 0.5
	},
	inputStyle: {
		flex: 9,
		height: 38,
		marginLeft: 28,
		...fontSize(16),
		lineHeight: 20,
		color: "black",
		backgroundColor: "transparent",
	},
	placeholder: {
		color: "rgba(85, 85, 85, 0.75)",
		marginLeft: 12
	},
	imageParent: {
		height: "100%",
		paddingLeft: 9,
		paddingRight: 9,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	errorStyle: {
		position: "absolute",
		color: "red",
		...fontSize(10),
		height: 12,
		bottom: 3,
		right: 2
	},
	imageStyle: {
		width: 24,
		height: 24
	},
	cancel: {
		color: 'gray',
		...fontSize(DeviceInfo.isTablet() ? 12 : 13)
	}
});