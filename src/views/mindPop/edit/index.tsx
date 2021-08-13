import React from "react";
import { Alert, DeviceEventEmitter, Dimensions, Image, ImageBackground, Keyboard, SafeAreaView, TextInput, TouchableOpacity, TouchableOpacityProperties, View, EventEmitterListener, Platform, TouchableHighlight } from "react-native";
import DeviceInfo from "react-native-device-info";
import ImageCropPicker, { Image as PickerImage } from "react-native-image-crop-picker";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import AccessoryView from "../../../common/component/accessoryView";
import ActionSheet, { ActionSheetItem } from "../../../common/component/actionSheet";
import loaderHandler from "../../../common/component/busyindicator/LoaderHandler";
//@ts-ignore
import { KeyboardAwareFlatList as FlatList } from "../../../common/component/keyboardaware-scrollview";
import Text from "../../../common/component/Text";
import { ToastMessage } from "../../../common/component/Toast";
import { Colors, decode_utf8, encode_utf8, ERROR_MESSAGE, fontSize, GenerateRandomID, GetFileType, getValue, NO_INTERNET, requestPermission, TimeStampMilliSeconds } from "../../../common/constants";
import MindPopStore, { FileType, MindPopAttachment } from "../../../common/database/mindPopStore/mindPopStore";
import EventManager from "../../../common/eventManager";
import { Account } from "../../../common/loginStore";
import { action_camera, action_close, action_picture, audio_play, camera, record, rubbish, sound_wave, pdf_icon, icon_upload_file, action_audio, action_pdf, keyboard_hide } from "../../../images";
import { DeleteMindPopOperation } from "../list/deleteMindPopReducer";
import { GetMindPopStatus } from "../list/reducer";
import { addEditMindPop, kAddEditIdentifier } from "./addMindPopflow";
import { AddMindPopStatus, EditMode } from "./reducer";
import { PickImage, CaptureImage, PickAudio, PickPDF } from "../../../common/component/filePicker/filePicker";
import Utility from "../../../common/utility";
import { createNew } from "../../createMemory";
import { DefaultDetailsMemory } from "../../createMemory/dataHelper";
import { CreateUpdateMemory } from "../../createMemory/createMemoryWebService";
import { MemoryDraftsDataModel } from "../../myMemories/MemoryDrafts/memoryDraftsDataModel";
import { EditHeader } from "..";
//@ts-ignore
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';

const ScreenWidth = Dimensions.get('window').width

type MainItem = { [y: string]: string | Array<{ [x: string]: any }> };

enum TempFileStatus {
	needsToUpload = "needsToUpload",
	deleted = "deleted",
	uploaded = "uploaded"
}

export type TempFile = {
	fid: string;
	filePath: string;
	thumb_uri?: string;
	isLocal?: boolean;
	type?: string;
	status?: TempFileStatus;
	filename?: string;
	time?: number;
	uri?: string;
	file_title?: string;
	file_description? : string;
	userId? : any;
	userName? : any; 
	date?:any;
	title?: any
};

type State = {
	deletedAttachments: Array<any>;
	listItems: Array<MainItem>;
	selectedItem: any;
	content: string;
	oldcontent: string;
	actionSheet: {
		type: "none" | "image" | "audio";
		list: Array<ActionSheetItem>;
	};
	id: string;
	bottomToolbar: number;
};

const ImageActions: Array<ActionSheetItem> = [
	{ index: 0, text: "Image", image: action_camera },
    { index: 1, text: "Audio", image: action_audio },
    { index: 2, text: "PDF", image: action_pdf },
	{ index: 3, text: "Cancel", image: action_close }
];

/**
 * Edit MindPop component
 */
class MindPopEdit extends React.Component<{ [x: string]: any }, State> {
	//Action sheet reference
	_actionSheet: any | ActionSheet = null;
	fileMain: string;
	moment: string;
	//InputRef reference
	_inputRef: TextInput | any;


	//Camera Btn Ref
	_cameraBtnRef: TouchableOpacity | any;
	//Audio Btn Ref
	_audioBtnRef: TouchableOpacity | any;
	
	//Files array list
	files: Array<MindPopAttachment & { type: string; uri: string }>;

	//Component default state
	state: State = {
		deletedAttachments: [],
		selectedItem: null,
		listItems: [],
		content: "",
		oldcontent: "",
		actionSheet: {
			type: "none",
			list: []
		},
		id: "",
		bottomToolbar: 0
	};

	isEdit: boolean = false;
	// filePathsToUpload: string[];

	filesToUpload: Array<TempFile> = [];
	listener: EventManager;
	backListner: any;
	callAction : boolean = true;
	keyboardDidShowListener : any;
	keyboardDidHideListener : any;
	draftDetails : any = {}
	createMemoryListener : EventManager;
	isDeleteForMemory : boolean = false;

	constructor(props: { [x: string]: any }) {
		super(props);

		this.files = [];
		// this.filePathsToUpload = [];		
		if (getValue(props, ["listItem", "id"]) && props.listItem.id !== "") {
			let decodedMsg = decode_utf8(props.listItem.message || "");
			this.state = { ...this.state, id: props.listItem.id, content: decodedMsg, oldcontent: decodedMsg };
		}
		this.moment = "0";
		if (typeof this.props.isEdit != "undefined") {
			this.isEdit = this.props.isEdit;
		}

		this.listener = EventManager.addListener(kAddEditIdentifier, this.reloadData);
		if (this.props.navigation.state.routeName == "mindPopEdit") {
			this.backListner = EventManager.addListener("hardwareBackPress", this._onBackIfEdit);
		}
		this.props.navigation.setParams({ save: this._save, updatePrev: this._prevUpdate, cancel: this._cancel });
		// this.fileMain = `https://${Account.selectedData().instanceURL}/sites/${Account.selectedData().instanceURL}/default/files/`;
		this.fileMain = Utility.publicURL;
		if(Platform.OS == "android"){
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);   
        } else{
            this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardDidHide);   
		}		
		
	}
	
	_keyboardDidShow=(e: any)=>{
		this.setState({
			bottomToolbar : e.endCoordinates.height
		})		
	}

	_keyboardDidHide=(e: any)=>{
		this.setState({
			bottomToolbar : 0
		})		
	}

	componentWillMount() {
		if (getValue(this.props, ["listItem"])) {
			this.setupFiles(this.props.listItem);
		}
		this.updateFiles();
		if((this.props.actionWrite || this.props.actionRecord || this.props.actionImageUpload) && this.callAction){		
			this.props.actionRecord && this.audioAttachmentPress();
			this.props.actionImageUpload && this.cameraAttachmentPress();		
			this.callAction = false;
			setTimeout(() => {
				this.callAction = true;
			}, 500);	
		}
	}

	
	_onBackIfEdit = () => {
		if (!this.isEdit) {
			if (this.state.id && !DeviceInfo.isTablet()) {
				this._cancel();
			} else {
				this._prevUpdate();
			}
			return;
		}
		Keyboard.dismiss();
		Actions.pop();
	}

	_prevUpdate = () => {
		//Check if user has some unsaved changes
		const { filesToDelete, filesToUpload } = this._getUpdatedFiles();

		if (this.state.content != this.state.oldcontent || filesToDelete.length != 0 || filesToUpload.length != 0) {
			Alert.alert("Save changes?", `Do you want to save your changes?`, [
				{
					text: "No",
					style: "cancel",
					onPress: () => {
						let content = this.state.oldcontent;
						this.setState({ content }, () => {
							//Go Back
							Keyboard.dismiss();
							Actions.pop();
							this.props.updateList && this.props.updateList();
						});
					}
				},
				{
					text: "Yes",
					style: "default",
					onPress: () => {
						this._save();
					}
				}
			]);
		} else {
			//Go Back
			{this._actionSheet}
			Keyboard.dismiss();
			Actions.pop();
			this.props.updateList && this.props.updateList();
		}
	};

	_cancel = () => {
		//Check if user has some unsaved changes
		const { filesToDelete, filesToUpload } = this._getUpdatedFiles();

		if (this.state.content != this.state.oldcontent || filesToDelete.length != 0 || filesToUpload.length != 0) {
			Alert.alert("Save changes?", `Do you want to save your changes?`, [
				{
					text: "No",
					style: "cancel",
					onPress: () => {
						let content = this.state.oldcontent;
						this.setState({ content }, () => {
							this.removeTempFiles();
							this.updateFiles();
							//finish editing
							this.props.setValue(true);
						});
					}
				},
				{
					text: "Yes",
					style: "default",
					onPress: () => {
						this._save();
					}
				}
			]);
		} else {
			//finish editing
			this.removeTempFiles();
			this.updateFiles();
			this.props.setValue(true);
		}
	};

	_saveCall = (filesToDelete: any[], filesToUpload: TempFile[]) => {
		let moment = TimeStampMilliSeconds();

		var req: { requestDetails: { mindPopContentArray: Array<any>; mindPopID?: string }; configurationTimestamp: string } = {
			requestDetails: {
				mindPopContentArray: [
					{
						contentType: 1,
						contentValue: encode_utf8(this.state.content)
					}
				]
			},
			configurationTimestamp: moment
		};

		var message = "Saving...";
		if (this.state.id) {
			req = { ...req, requestDetails: { ...req.requestDetails, mindPopID: this.state.id } };

			if (filesToDelete.length > 0) {
				var mindPopContentArray = [...req.requestDetails.mindPopContentArray];
				for (let item of filesToDelete) {
					//already uploaded items only should be deleted
					if (item.fid) {
						mindPopContentArray.push({
							contentID: item.fid,
							contentType: GetFileType.getStatus(item.type),
							contentStatus: 2
						});
					}
				}
				req = { ...req, requestDetails: { ...req.requestDetails, mindPopContentArray } };
			}
			message = "Updating...";
		}
		this.moment = moment;
		loaderHandler.showLoader(message);
		this.props.setValue(true);
		addEditMindPop(req, filesToUpload);
	};

	_getUpdatedFiles = (): { filesToDelete: any[]; filesToUpload: TempFile[] } => {
		let filesToDelete: any[] = [];
		let fids: string[] = this.filesToUpload.map((it: TempFile) => it.fid);
		let filesToUpload: TempFile[] = [...this.filesToUpload];
		for (let obj of this.state.deletedAttachments) {
			let isLocal = getValue(obj, ["isLocal"]);
			let id = getValue(obj, ["fid"]);
			if (isLocal) {
				let idx = fids.indexOf(id);
				if (idx != -1) {
					filesToUpload.splice(idx, 1);
				}
			} else {
				filesToDelete.push(obj)
			}
		}

		return { filesToDelete, filesToUpload };
	};

	_save = () => {
		Keyboard.dismiss();
		const { filesToDelete, filesToUpload: uploads } = this._getUpdatedFiles();

		// if (this.state.content.trim().length > 0 || uploads.length > 0 || filesToDelete.length > 0) {
		if (this.state.content == this.state.oldcontent && filesToDelete.length == 0 && uploads.length == 0) {
			ToastMessage("No changes were made", "black");
		} else {
			// if (this.state.content.trim().length > 0 || uploads.length > 0 || filesToDelete.length > 0) {

			// } else {
			// 	ToastMessage("Please enter some text");
			// }

			if (this.state.content.trim().length == 0) {
				ToastMessage("Please add a description", Colors.ErrorColor)
			} else {
				if (filesToDelete.length > 0) {
					Alert.alert(
						"Delete",
						`Are you sure you want to delete ${filesToDelete.length} attachement${filesToDelete.length > 1 ? "s" : ""}`,
						[
							{
								text: "No",
								style: "cancel",
								onPress: () => { this.setState({ deletedAttachments : []})}
							},
							{
								text: "Yes",
								style: "default",
								onPress: () => {
									this._saveCall(filesToDelete, uploads);
									this.setState({deletedAttachments : filesToDelete})
								}
							}
						]
					);
				} else {
					this._saveCall([], uploads);
				}
			}
		}
	};

	private updateFiles = () => {
		var listItems: Array<MainItem> = [{ itemType: "editor" }];
		// let itemCount = (item.data as Array<any>).length
		let paddingSpace = 30 // horizontal padding of container view (15*2)
		var editScreenWidth = (ScreenWidth - paddingSpace)
		if (DeviceInfo.isTablet() && this.props.navigation.state.routeName === "mindPopList") {
			editScreenWidth = editScreenWidth - 320
		}
		var data: Array<{
			[x: string]: any;
		}> = [];

		let itemCount: number = parseInt(`${(editScreenWidth / 140)}`)
		if (this.files.length > 0) {
			var i = 0

			for (let file of this.files) {
				i++;
				let uri = (file.uri as string).replace("public://", this.fileMain);
				let fItem: {
					[x: string]: any;
				} = { ...file, uri };
				if (fItem.type == "images") {
					let thumb_uri = (fItem.thumb_uri as string).replace("public://", this.fileMain);
					fItem = { ...fItem, thumb_uri };
				}
				data.push(fItem);


				// if (i == (DeviceInfo.isTablet() ? 4 : 2) || this.files.indexOf(file) == this.files.length - 1) {
				// 	listItems.push({ itemType: "list", data: [...data] });
				// 	data = [];
				// 	i = 0;
				// }

				// if (i == (editScreenWidth) || this.files.indexOf(file) == this.files.length - 1) {
				// 	listItems.push({ itemType: "list", data: [...data] });
				// 	data = [];
				// 	i = 0;
				// }				
			}
		}
		if (this.filesToUpload.length > 0) {
			var lData: any[] = [];
			var i = 0;
			if (listItems.length > 1 && i == 0 && listItems[listItems.length - 1].data.length < (DeviceInfo.isTablet() ? 4 : 2)) {
				lData = [...listItems[listItems.length - 1].data];
				listItems.pop();
				i = lData.length;
			}
			for (let file of this.filesToUpload) {
				lData.push(file);
				i++;
				// if (i == (editScreenWidth) || this.filesToUpload.indexOf(file) == this.filesToUpload.length - 1) {
				// 	listItems.push({ itemType: "list", data: [...lData] });
				// 	lData = [];
				// 	i = 0;
				// }
			}
			let arr = [...data, ...lData];
			data = [...arr]
		}

		if (data.length > 0) {
			listItems.push({ itemType: "list", data: [...data] });
		}
		this.props.actionRecord && this.audioAttachmentPress();
		this.props.actionImageUpload && this.cameraAttachmentPress();		
		if(this.props.actionRecord || this.props.actionImageUpload){
			//Do nothing
		} else{
			this.setState({ listItems }, () => {
				this.state.id && this.state.id.length == 0 && this.filesToUpload.length == 0 && this._inputRef && this._inputRef.focus && this._inputRef.focus();
			});
		}
	};

	saveTempFiles = (filesObjArray: Array<TempFile>) => {
		//Add to fileToUpload Array.. to upload when save button is pressed
		this.filesToUpload = [...this.filesToUpload, ...filesObjArray];
		this.updateFiles();
	};

	removeTempFiles = (filePath: string = null) => {
		if (filePath == null) {
			for (let obj of this.filesToUpload) {
				//remove temp folder
				let tempFilePath = obj.filePath;
				let absoultePath = tempFilePath.replace("file:///", "/");
				ImageCropPicker.cleanSingle(absoultePath);
			}

			// clear filePathsToUpload
			// this.filePathsToUpload = [];
			this.filesToUpload = [];
			let localFIDs = this.files.filter((obj: any) => getValue(obj, ["isLocal"]) != null).map(obj => getValue(obj, ["fid"]));
			let allFiles = [...this.files];
			for (let obj of this.files) {
				let id = getValue(obj, ["fid"]);
				let idx = localFIDs.indexOf(id);
				if (idx != -1) {
					allFiles.splice(idx, 1);
				}
			}
			this.files = [...allFiles];
		}
	};


	render() {
		return (
		<View style={{flex: 1}}>
			<SafeAreaView style={{width: "100%", flex: 0, backgroundColor : Colors.NewThemeColor}}/>                   
				<SafeAreaView style={{width: "100%", flex: 1, backgroundColor : "#fff"}}>    
			<View style={{flex: 1}}>
				<EditHeader save={this.props.save}
							updatePrev={this.props.updatePrev}
							cancel={this.props.cancel}/>
				<View
					style={{
						width: DeviceInfo.isTablet() && this.props.navigation.state.routeName !== "mindPopList" ? "80%" : "100%",
						...(DeviceInfo.isTablet() && this.props.navigation.state.routeName === "mindPopList" ? {} : { maxWidth: 786 }),
						flex: 1
					}}>
					{this.renderHeader()}					
					{this.state.listItems.length > 1 ? this.renderItem(this.state.listItems[1]) : 
					(Platform.OS == "ios" ?	<View style={{width : "100%", height: this.state.bottomToolbar}}></View> : null)}
					{/* <FlatList
						style={{ backgroundColor: "white", width: "100%", marginBottom: 60 }}
						keyExtractor={(_: any, index: number) => `${index}`}
						data={this.state.listItems}
						extraData={this.state}
						renderItem={this._renderitem}
					/> */}
				</View>
				{/* {this.state.files.length > 0 ? <View></View>
                : <View style={{width : "100%", height: this.state.bottomBar.bottom}}></View>}  */}
				{this.toolbar()}
				<ActionSheet
					ref={ref => (this._actionSheet = ref)}
					width={DeviceInfo.isTablet() ? "65%" : "100%"}
					actions={this.state.actionSheet.list}
					onActionClick={this.onActionItemClicked.bind(this)}
					popToAddContent={this.props.actionImageUpload ? true : false}
					/>
				</View>				
			</SafeAreaView>
			</View>
		);
	}

	cameraAttachmentPress = () =>{		
		CaptureImage(this.fileCallbackHandler);
	}

	fileCallbackHandler=(file: any)=>{
		this.saveTempFiles(file);
		this.props.setValue(false);
	}

	uploadAttachmentPress = () =>{				
		this.setState(
		{
			actionSheet: {
				...this.state.actionSheet,
				type: "image",
				list: ImageActions
			}
			},
			() => {				
				this._actionSheet && this._actionSheet.showSheet();

			}
			);
		loaderHandler.hideLoader();
	}
	// cameraAttachmentPress = () =>{
	// 	Keyboard.dismiss();
	// 	PickImage(this.fileCallbackHandler)
	// 	// this.setState(
	// 	// 	{
	// 	// 		actionSheet: {
	// 	// 			...this.state.actionSheet,
	// 	// 			type: "image",
	// 	// 			list: ImageActions
	// 	// 		}
	// 	// 	},
	// 	// 	() => {
	// 	// 		this._actionSheet && this._actionSheet.showSheet();
	// 	// 	}
	// 	// );
	// 	// loaderHandler.hideLoader();
	// }

	audioAttachmentPress = () =>{
		Keyboard.dismiss();
		Actions.commonAudioRecorder({			
			mindPopID: this.state.id || 0,
			editRefresh: (file: any[]) => {
				Keyboard.dismiss()
				let fid = GenerateRandomID();
				let tempFile: TempFile[] = file.map(obj => ({ ...obj, fid }));
				this.saveTempFiles(tempFile);
				this.props.setValue(false)
			}
		});
		loaderHandler.hideLoader();
	}

	convertToMemory=(id : any)=>{
		if(Utility.isInternetConnected){
			loaderHandler.showLoader("Loading...")			
			this.draftDetails = DefaultDetailsMemory(decode_utf8(this.state.content.trim()));						
			this.draftDetails.mindpop_id = id;
			MindPopStore._deleteMindPops([parseInt(id)])            
			CreateUpdateMemory(this.draftDetails, this.filesToUpload, "mindpopEditMemoryListener", "save")   
			Keyboard.dismiss();
			Actions.pop();         
		} else{
			ToastMessage(NO_INTERNET);
		}
	}

	toolbar = () => {
		return (
			<KeyboardAccessory style={{backgroundColor: "#fff", position:"absolute", width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center", borderTopWidth: 1, borderBottomWidth: 1, borderColor: "rgba(0,0,0,0.4)"}}>
			<View
				style={{
					width: "100%",					
					flexDirection: "row",
					backgroundColor: "#F3F3F3",
					justifyContent: this.props.navigation.state.routeName == "mindPopEdit" ? "space-between" : "flex-end",
					alignItems: "center",
					height:50,
					paddingLeft: 10,
					paddingRight: 10,
					paddingTop: 10,
					paddingBottom: 10,
					borderTopColor: "rgba(0.0, 0.0, 0.0, 0.25)",
					borderTopWidth: 1,
					...(DeviceInfo.isTablet() && this.props.navigation.state.routeName == "mindPopList"
						? {
							borderLeftColor: "rgba(0.0, 0.0, 0.0, 0.25)",
							borderLeftWidth: 1
						}
						: {})
				}}>

				{this.state.bottomToolbar > 0 && <TouchableHighlight underlayColor={"#fffffffff"} onPress={()=> Keyboard.dismiss()} style={{position :"absolute", right : 16, top : -30}}>
					<Image source={keyboard_hide}/>
				</TouchableHighlight>}
				{this.props.navigation.state.routeName == "mindPopEdit" ? (
					<View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
						{/* <TouchableOpacity
							onPress={() => {this.cameraAttachmentPress()}}
							style={{ alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
							<Image source={camera} resizeMode="contain" />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {this.audioAttachmentPress()}}
							style={{ alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
							<Image source={record} resizeMode="contain" />
						</TouchableOpacity> */}

						<TouchableOpacity
                            onPress={() => {Keyboard.dismiss(); this.cameraAttachmentPress()}}
                            style={{ alignItems: "center", justifyContent: "center", width : 40 ,height: 40 }}>
                            <Image source={camera} resizeMode="stretch" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {Keyboard.dismiss(); this.audioAttachmentPress()}}
                            style={{ alignItems: "center", justifyContent: "center", width: 40, height: 40 }}>
                            <Image source={record} resizeMode="stretch" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {Keyboard.dismiss(); this.uploadAttachmentPress()}}
                            style={{ alignItems: "center", justifyContent: "center", width: 40, height: 40 }}>
                            <Image source={icon_upload_file} resizeMode="stretch" />
                        </TouchableOpacity>
                                
						             
					</View>
				) : null}
				{this.state.id ? (
					<React.Fragment>
						<View style={{flex: 1,flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
						<TouchableOpacity onPress={()=> this.convertToMemory(this.state.id)}>
							<Text style={{ ...fontSize(18), marginLeft: 5, color: Colors.ThemeColor, ...(this.props.navigation.state.routeName == "mindPopList" ? {} : {}) }}>Convert to Memory</Text>
						</TouchableOpacity>
						{
							this.isEdit ?             
								<TouchableOpacity
									onPress={() => {
										Keyboard.dismiss();
										Alert.alert("Are you sure you want to delete this MindPop?", `You will lose all content${this.files.length > 0 ? " and files attached." : ""}.`, [
											{
												text: "Yes",
												style: "destructive",
												onPress: () => {
													//loaderHandler.showLoader("Deleting...");
													this.props.deleteMindPops({
														mindPopList: [{ mindPopID: this.state.id }],
														configurationTimestamp: TimeStampMilliSeconds()
													});
												}
											},
											{
												text: "No",
												style: "cancel",
												onPress: () => { }
											}
										]);
									}}
									style={{										
										alignItems: "center",
										justifyContent: "center",
										width: 44,
										height: 44							
									}}>
									<Image source={rubbish} resizeMode="contain" />
								</TouchableOpacity> : <View style={{
									marginLeft: 10,
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: 'transparent',
									width: 44,
									height: 44
								}}></View>
						}
						{/* {this.state.bottomToolbar > 0 && <TouchableOpacity
							onPress={() => Keyboard.dismiss()}
							style={{ alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
							<Image source={keyboard_hide} resizeMode="contain" />
						</TouchableOpacity>  } */}
						</View>
					</React.Fragment>
				) : null}
				</View>
			</KeyboardAccessory>

		);
	};

	onActionItemClicked = (index: number): void => {
		switch (index) {
			case 0: PickImage(this.fileCallbackHandler)	;
					break;
			case 1: PickAudio(this.fileCallbackHandler);
					break;
			case 2: PickPDF(this.fileCallbackHandler);
					break;	
		}
		this.setState({ actionSheet: { ...this.state.actionSheet, type: "none", list: [] } });
	};

	componentWillUnmount() {
		this.listener.removeListener();		
		this.backListner && this.backListner.removeListener();
		// this.createMemoryListener.removeListener();
	}
	componentDidMount(){
		setTimeout(() => {
			this._inputRef && this._inputRef.focus && this._inputRef.focus();
		}, 500);
	}
	reloadData = (success: boolean, data: any) => {
		loaderHandler.hideLoader();

		if (success) {
			//Incase user was in creation mode
			if (!this.state.id) {
				//Go Back
				Keyboard.dismiss();
				Actions.pop();
				DeviceEventEmitter.emit('updateSelected', 0);
				this.props.updateList && this.props.updateList();
				return;
			}
			//remove all temporary files first
			this.removeTempFiles()
			let content = decode_utf8(decode_utf8(data.message || "") || "");
			this.setState({
				id: data.id,
				content,
				oldcontent: content,
			});
			if (data) {
				this.setupFiles(data);
				this.updateFiles();
			}
			if (this.state.deletedAttachments.length > 0) {
				let ids = [...this.state.deletedAttachments].map((itm: { fid: string }) => parseInt(`${itm.fid}`));
				MindPopStore.deleteMindPopAttachment(ids)
					.then((resp: any) => {

						//console.log("message", resp);
						// this._prevUpdate();
						DeviceEventEmitter.emit('updateSelected', 0);
						this.props.updateList && this.props.updateList();
						if (DeviceInfo.isTablet()) {
							Keyboard.dismiss();
							Actions.pop();
						} else {
							this._removeDeletedFiles(ids);
							this.updateFiles();
							this.props.setValue(true, data);
						}

					})
					.catch((error: any) => {
						// this._prevUpdate();
						DeviceEventEmitter.emit('updateSelected', 0);
						this.props.updateList && this.props.updateList();
						//console.log("Error", error);
						if (DeviceInfo.isTablet()) {
							Keyboard.dismiss();
							Actions.pop();
						} else {
							this.props.setValue(true, data);
						}
					});
			} else {
				DeviceEventEmitter.emit('updateSelected', 0);
				this.props.updateList && this.props.updateList();
				if (DeviceInfo.isTablet()) {
					Keyboard.dismiss();
					Actions.pop();
				} else {
					this.props.setValue(true, data);
				}
			}
		} else {
			let message = typeof data == "object" ? (data.message || ERROR_MESSAGE) : (typeof data == "string" ? data : ERROR_MESSAGE)
			ToastMessage(message, message == NO_INTERNET ? Colors.WarningColor : Colors.ErrorColor);
		}
	};

	componentWillReceiveProps(nextProps: { [x: string]: any }) {
		//Delete MindPop Operation resolver
		if (nextProps.deleteStatus && nextProps.deleteStatus.completed) {
			loaderHandler.hideLoader();
			if (nextProps.deleteStatus.success && this.props.navigation.state.routeName == "mindPopEdit") {
				let arrIds = [parseInt(this.state.id)];
				MindPopStore._deleteMindPops(arrIds);
				this.props.deleteMindPopsCallEnd()
				if (this.props.navigation.state.routeName == "mindPopEdit" && !this.isDeleteForMemory) {
					Keyboard.dismiss();
					Actions.pop();
					return
				} else if(this.props.navigation.state.routeName == "mindPopEdit"){
					this.isDeleteForMemory = false;					         
				}
			} else {
				var deleteMessage = getValue(nextProps, ["deleteStatus", "data", "message"]);
				ToastMessage(`${deleteMessage || ERROR_MESSAGE}`, deleteMessage ? "black" : Colors.ErrorColor);
			}
		}
		//To update files on Tablet in View mode
		if (this.props.navigation.state.routeName == "mindPopList" || Object.keys(this.props.listItem || {}).length < Object.keys(nextProps.listItem || {}).length) {
			this.setupFiles(nextProps.listItem);
			this.updateFiles();
		}
		var state: { [x: string]: any } = {};
		if (
			((this.state.id == "" && getValue(nextProps, ["listItem", "id"])) || DeviceInfo.isTablet()) &&
			this.props.navigation.state.routeName == "mindPopList" &&
			nextProps.listItem
		) {
			let content = decode_utf8(nextProps.listItem.message || "");
			state = {
				id: nextProps.listItem.id,
				content,
				oldcontent: content
			};
		}

		if (this.props.isEdit != nextProps.isEdit) {
			if (nextProps.isEdit) {
				state["deletedAttachments"] = [];
			}
			this.isEdit = nextProps.isEdit;
			this.setState({});
		}
		if (Object.keys(state).length > 0) {
			this.setState(state as State);
		}
	}

	setupFiles = (itemData: { [x: string]: any }) => {
		this.files = [];
		for (let key in itemData) {
			let item = itemData[key];
			if (Array.isArray(item)) {
				let list = item.map(it => {
					return { ...it, type: key };
				});
				this.files = [...this.files, ...list];
			}
		}
	};

	_removeDeletedFiles = (ids: number[]) => {
		//clear from deletedMindPops.. need to consult prashoor fot this
		if(this.props.actionRecord || this.props.actionImageUpload){
			//Do nothing
		} else{
			this.setState({ deletedAttachments: [] }, () => {
				this.state.id && this.state.id.length == 0 && this._inputRef && this._inputRef.focus && this._inputRef.focus();
			});
		}
	};

	enterEditMode=()=>{
		this.props.setValue(false);
		setTimeout(() => {
			this._inputRef && this._inputRef.focus && this._inputRef.focus();
		}, 500);
	}

	renderHeader=()=>{
		return <View style={{padding: 15, width: "100%", flex: 1,  marginBottom: 20}}>
							{this.isEdit ? (
								<View onStartShouldSetResponder={() => true} 
									onResponderStart={()=> this.enterEditMode()}>
									<Text
										multiline={true}
										style={{
											paddingTop: 5,
											paddingBottom: 5,
											...fontSize(18),
											textAlignVertical: "top",
											fontStyle: this.state.content.length > 0 ? "normal" : "italic",
											minHeight: 220,
											textAlign: "left"
										}}>
										{this.state.content || "Capture your MindPop..."}
									</Text>
								</View>
							) : (
									<TextInput
										placeholder="Capture your MindPop..."
										ref={ref => (this._inputRef = ref)}
										onChangeText={text => {
											this.setState({ content: text });
										}}
										placeholderTextColor="rgba(0, 0, 0, 0.8)"
										value={this.state.content}
										multiline={true}
										style={{
											fontFamily: "Rubik",
											...fontSize(18),
											textAlignVertical: "top",
											fontStyle: this.state.content.length > 0 ? "normal" : "italic",
											flex : 1,
											textAlign: "left",											
											minHeight: 150,
											paddingBottom: 15,
											
										}}
									/>
								)}
						</View>
					
                    
	}

	renderItem=(item: any)=>{
		// ToastMessage(this.state.deletedAttachments.length + "" + item.data.length)
		if (this.state.deletedAttachments.length == item.data.length){
			return
		}
		return <FlatList
					style={{ width: "100%",  maxHeight: 160, backgroundColor : "#fff", marginBottom : this.state.bottomToolbar > 0 ? this.state.bottomToolbar - (Platform.OS == "android" ? 230 : 160) : 60, paddingTop : 10, borderTopColor : "#59595931", borderTopWidth : 1}}
					keyExtractor={(_: any, index: number) => `${index}`}
					keyboardShouldPersistTaps="always"
					horizontal={true}
					extraData={this.props}
					scrollEnabled={true}
					data={item.data as Array<any>}
					ItemSeparatorComponent={() => (
						<View
							style={{
								width: 0 //!DeviceInfo.isTablet() ? 0 : this.props.navigation.state.routeName == "mindPopList" ? 5 : 35
							}}
						/>
					)}
					renderItem={(element: any)=> this._renderRow({item: element.item}, 180)}
					/> 
	}

	// _renderitem = ({ item }: { item: MainItem }): JSX.Element => {
	// 	if (item.itemType == "editor") {
	// 	}
	// 	// let itemCount = (item.data as Array<any>).length
	// 	// let paddingSpace = (15 * itemCount) + 20
	// 	// let spaceToRender = ScreenWidth - paddingSpace
	// 	// let widthForThumbnail: number = spaceToRender / itemCount
	// 	let views: Element[] = (item.data as Array<any>).map(element => this._renderRow({ item: element }, 130))

	// 	return (
	// 		/*<View style={{ paddingRight: 15, paddingTop: 5, paddingLeft: 15, width: "100%", borderWidth: 1 }}>
	// 			<FlatList
	// 				style={{ width: "100%" }}
	// 				keyExtractor={(_: any, index: number) => `${index}`}
	// 				horizontal={true}
	// 				extraData={this.props}
	// 				scrollEnabled={false}
	// 				data={item.data as Array<any>}
	// 				ItemSeparatorComponent={() => (
	// 					<View
	// 						style={{
	// 							width: 0 //!DeviceInfo.isTablet() ? 0 : this.props.navigation.state.routeName == "mindPopList" ? 5 : 35
	// 						}}
	// 					/>
	// 				)}
	// 				renderItem={this._renderRow}
	// 			/>
	// 		</View>*/

	// 		<View style={{
	// 			flexDirection: 'row', justifyContent: DeviceInfo.isTablet() ? "flex-start" : "center",
	// 			flexWrap: "wrap", paddingLeft: DeviceInfo.isTablet() ? 10 : 5,
	// 		}}>
	// 			<View style={{ paddingTop: 10, flexDirection: 'row', justifyContent: DeviceInfo.isTablet() ? "flex-start" : "center", flexWrap: "wrap" }}>
	// 				{
	// 					views
	// 				}
	// 			</View>
	// 		</View>
	// 	);
	// };

	refresh = () => {
		if (this.moment != "0") {
			this.props.listMindPops &&
				this.props.listMindPops({
					searchTerm: {
						SearchString: ""
					},
					configurationTimestamp: TimeStampMilliSeconds(),
					lastSyncTimeStamp: this.moment
				});
		}
	};

	_selDelete = (item: any, found: boolean = false) => {
		var deletedAttachments = [...this.state.deletedAttachments];

		// check if object represents temp file or uploaded item
		if (item.fid) {
			if (!found) {
				deletedAttachments = [...deletedAttachments, item];
			} else {
				ToastMessage("Temp Attachment deleted")
				let ids = this.state.deletedAttachments.map((itm: { fid: string }) => itm.fid);
				deletedAttachments.splice(ids.indexOf(item.fid), 1);
			}
		}

		this.setState({ deletedAttachments }, () => { });
	};

	_renderRow = ({ item }: { [x: string]: any; item: TempFile & MindPopAttachment & { type: string; fid: string; filename: string; thumb_uri: string } }, width: number) => {
		let thumbnailHeight = 120
		var props: TouchableOpacityProperties = {
			style: { width: width, height: thumbnailHeight, justifyContent: "center", alignItems: "center" },
			onPress: () => {
				this.setState({ selectedItem: item }, () => {
					if (item.type == "audios") {												
						Actions.commonAudioRecorder({
							mindPopID: this.state.id,
							selectedItem: this.state.selectedItem,
							deleteItem: () => {
								this.setState({ deletedAttachments: [...this.state.deletedAttachments, { ...this.state.selectedItem }], selectedItem: null }, () => {
									this.props.setValue(false);
								});
							},
							reset: () => {
								this.setState({ selectedItem: null });
							}
						});
					} else if (item.type == "images") {
						Actions.previewImage({
							selectedItem: this.state.selectedItem,
							deleteItem: () => {
								this.setState({ deletedAttachments: [...this.state.deletedAttachments, { ...this.state.selectedItem }], selectedItem: null }, () => {
									this.props.setValue(false);
								});
							},
							reset: () => {
								this.setState({ selectedItem: null });
							},
							isEditMode: (this.props.navigation.state.routeName == "mindPopEdit")
						});
					} else if (item.type == "files") {
						item.url = item.uri
						Actions.push("pdfViewer", {file: item}) 						 
					}
				});
			}
		};
		//console.log("Thumbnail Image:", item.thumb_uri);
		var found: boolean = false;
		var thumb_uri = item.thumb_uri;
		if (item.fid) {
			let ids = this.state.deletedAttachments.map((itm: { fid: string }) => itm.fid);
			found = ids.indexOf(item.fid || `${item.id}`) != -1;
		}
		/*
		else {
			//if the filePath doesnot exist in filePathsToUpload, that means it has been deleted.
			// hence, 'found' to be deleted
			let filePaths = this.filePathsToUpload.map((filePath: string) => filePath);
			found = this.filePathsToUpload.length == 0 || filePaths.indexOf(item.filePath) == -1;
		}*/
		return  <View> 
				{found ? <View></View>:
				<TouchableOpacity {...props} key={item.fid} style={{ padding: 13}}>
				<View style={{ borderWidth: 1, width: width, height: thumbnailHeight, borderRadius: 5, overflow: "hidden" }}>
					{item.type == "audios" ? (
						<ImageBackground
							style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
							source={sound_wave}
							resizeMode="contain">
							<View
								style={{
									backgroundColor: Colors.NewTitleColor,
									borderRadius: 20,
									width: 40,
									height: 40,
									alignItems: "center",
									justifyContent: "center"
								}}>
								<View style={{ height: 20, width: 22, justifyContent: "center", alignItems: "flex-end" }}>
									<Image style={{ height: 18, width: 17.5 }} source={audio_play} />
								</View>
							</View>
							<Text
								numberOfLines={1}
								style={{ color: "#595959", ...fontSize(12), bottom: 5, position: "absolute", alignSelf: "center", textAlign: "center" }}>{`${
									item.title ? item.title : item.filename ? item.filename : "" 
									}`}</Text>
						</ImageBackground>
					): (item.type == "images" ? 
						(<Image source={{ uri: item.thumb_uri }} style={{ width: width, height: thumbnailHeight }} resizeMode="contain" />) 
				  	: (item.type == "files" ?                                 
						<View style={{justifyContent:"center", alignItems:"center", height:"100%", width : "100%"}}>
						<ImageBackground
							style={{ width: "85%", height: "85%", marginLeft: 10}}
							source={pdf_icon}
							resizeMode="contain"/>                               
						<Text
							numberOfLines={1}
							style={{ color: "#595959", ...fontSize(12), bottom: 5, position: "absolute", alignSelf: "center", textAlign: "center" }}>{`${
								item.filename
						}`}
						</Text>    
						</View>
						: null))}
					{found ? <View style={{ width: "100%", height: "100%", position: "absolute", borderRadius: 5, backgroundColor: "#cccccc85" }} /> : null}
				</View>

				{!this.isEdit && this.props.navigation.state.routeName == "mindPopEdit" ? (
					<TouchableOpacity
						onPress={() => this._selDelete(item, found)}
						style={{ width: 36, height: 36, position: "absolute", right: -3, top: -3, justifyContent: "center", alignItems: "center" }}>
						<View
							style={{
								width: 32,
								height: 32,
								borderWidth: 2,
								borderColor: "#fff",
								borderRadius: 16,
								backgroundColor: found ? "#ff2315" : "#000000",
								alignItems: "center",
								justifyContent: "center"
							}}>
							<Text style={{ color: "white", fontWeight: Platform.OS === "ios"? '500':'bold', ...fontSize(12), lineHeight: 14 }}>{`${found ? "-" : "✕"}`}</Text>
						</View>
					</TouchableOpacity>
				) : null}
			</TouchableOpacity>
		}
				
		</View> 
	
		
	};
}

const mapState = (state: { [x: string]: any }) => ({
	list: state.getMindPop,
	addMindPop: state.addMindPop,
	deleteStatus: state.deleteMindPop,
	...(DeviceInfo.isTablet() ? {} : { isEdit: state.mindPopEditMode.mode }),
	listItem: state.mindPopEditMode.selectedMindPop
});

const mapDispatch = (dispatch: Function) => {
	return {
		deleteMindPops: (payload: any) => dispatch({ type: DeleteMindPopOperation.RequestStarted, payload }),
		deleteMindPopsCallEnd: () => dispatch({ type: DeleteMindPopOperation.RequestEnded }),
		complete: () => dispatch({ type: AddMindPopStatus.RequestEnded }),
		cleanEdit: () => dispatch({ type: EditMode.UNSELECT }),
		edit: () => dispatch({ type: EditMode.RESET }),
		// callEnded: () => dispatch({ type: GetMindPopStatus.RequestEnded }),
		setValue: (mode: boolean, value: any) =>
			dispatch({
				type: mode ? EditMode.EDIT : EditMode.RESET,
				payload: value
			}),
		listMindPops: (payload: any) => dispatch({ type: GetMindPopStatus.RequestStarted, payload })
	};
};

export default connect(
	mapState,
	mapDispatch
)(MindPopEdit);
