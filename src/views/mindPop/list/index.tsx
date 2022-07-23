import React from "react";

import { Alert, DeviceEventEmitter, EmitterSubscription, Image, Keyboard, Platform, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Actions } from "react-native-router-flux";
import Text from "../../../common/component/Text";
//@ts-ignore
import DeviceInfo from "react-native-device-info";
import EStyleSheet from "react-native-extended-stylesheet";
import { connect } from "react-redux";
import { Colors, decode_utf8, ERROR_MESSAGE, fontFamily, fontSize, getValue, MindPopsInProgress, NO_INTERNET, Size, TimeStampMilliSeconds } from "../../../common/constants";
import { GetMindPopStatus, MindPopListCount, MindPopListSelectionState, MindPopSelectedItemCount } from "./reducer";
//@ts-ignore
import DefaultPreference from 'react-native-default-preference';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { SwipeListView } from "react-native-swipe-list-view";
import AccordionView from "../../../common/component/accordionView";
import { default as LoaderHandler, default as loaderHandler } from "../../../common/component/busyindicator/LoaderHandler";
import CustomAlert from "../../../common/component/customeAlert";
import SelectionStatusBar from "../../../common/component/inputAccessoryViews/itemSelectionStatusBar";
import SearchBar from "../../../common/component/SearchBar";
import { ToastMessage } from "../../../common/component/Toast";
import MindPopStore, { FileType } from "../../../common/database/mindPopStore/mindPopStore";
import EventManager from "../../../common/eventManager";
import Utility from "../../../common/utility";
import {
	cell_selected,
	cell_unselected, mindPopListCell_DeleteIcon_White, pdf_icon, thumb_audio_mindpop, thumb_text_mindpop
} from "../../../images";
import { createNew } from "../../createMemory";
import { CreateUpdateMemory } from "../../createMemory/createMemoryWebService";
import { DefaultDetailsMemory } from "../../createMemory/dataHelper";
import { showCustomAlert } from "../../createMemory/reducer";
import { EditMode } from "../edit/reducer";
import MindPopIPadNavigationBar from "../iPad/NavigationBar";
import { DeleteMindPopOperation } from "./deleteMindPopReducer";
import EmptyView from "./emptyView";
import MindPopIntro from "./mindPopIntro";
import MindPopNavigationBar from "./NavigationBar";

export type ListItem = {
	id: string;
	message: string;
	modified_on?: string;
	attachmentID?: number;
	fileMime?: string;
	fileName?: string;
	instanceID?: number;
	url?: string;
	thumbnailURL?: string;
	type?: number;
	audios?: any[];
	videos?: any[];
	images?: any[];
	files?: [];
};

type Section = { title: string; data: Array<ListItem> };
type SectionItems = Array<Section>;
const options = {
	enableVibrateFallback: true,
	ignoreAndroidSystemSettings: false
};
const buttonWidth = Size.byWidth(106);
class MindPopList extends React.Component<{ listMindPops: (payload: any) => void;[x: string]: any }> {
	state: {
		selectedItems: Array<string>;
		listSectionItems: SectionItems;
		searchMode: boolean;
		totalItems: number;
		selectedIndex: number;
		lastFetchedIndex: number;
		webserviceBeingCalled: boolean;
		mindPopInProgress: number;
		mindPopIntroVisibility: any;
	} = {
			selectedItems: [],
			totalItems: 0,
			searchMode: false,
			listSectionItems: [],
			selectedIndex: 0,
			lastFetchedIndex: 0,
			webserviceBeingCalled: false,
			mindPopInProgress: 0,
			mindPopIntroVisibility: false
		};
	searchKeyword: string = "";
	eventSubs: EmitterSubscription;
	listRef = React.createRef<SwipeListView>();
	createNew: boolean = false;
	uploadCompleted: EventManager;
	convertToMemoryObject: any = {};
	createMemoryListener: any;
	constructor(props: { [x: string]: any; listMindPops: (payload: any) => void; fromDeeplinking?: boolean; nid?: any; deepLinkBackClick?: boolean }) {
		super(props);
		this.eventSubs = DeviceEventEmitter.addListener("updateSelected", this._updateIndex);
		this.createMemoryListener = EventManager.addListener("mindpopEditMemoryListener", this.createMemoryCallBack)
	}

	createMemoryCallBack = (success: boolean, draftDetails: any) => {
		setTimeout(() => {
			loaderHandler.hideLoader();
		}, 500);
		if (success) {
			Actions.replace("createMemory", { editMode: true, draftNid: draftDetails, deepLinkBackClick: this.props.deepLinkBackClick })
		}
		else {
			loaderHandler.hideLoader()
			ToastMessage(draftDetails);
		}
	}

	mindPopUploadCompleted = (success?: any, mindPopID?: any) => {
		try {
			this.setState({},
				() => {
					this.props.listMindPops({
						searchTerm: {
							start: 0,
							length: 40,
							SearchString: ""
						},
						configurationTimestamp: TimeStampMilliSeconds(),
						lastSyncTimeStamp: "0"
					});
				}
			)
		} catch (e) {

		}
	}

	_updateIndex = (selectedIndex: number) => {
		this.setState({ selectedIndex }, () => {
			this.listRef.current &&
				this.listRef.current._listView.scrollToLocation &&
				this.listRef.current._listView.scrollToLocation({ sectionIndex: 0, itemIndex: 0, animated: true });
		});
	};

	_listItems = (): ListItem[] => {
		var objects: Section = this.state.listSectionItems.find(obj => {
			return obj.title === "1";
		});
		return objects ? [...objects.data] : [];
	};

	_parseDatabaseResult(queryResult: any): ListItem[] {
		let rows = queryResult.rows.raw(); // shallow copy of rows Array
		let fetchedItems: ListItem[] = rows.map((row: any) => ({
			id: row.id,
			instanceID: row.instanceID,
			message: row.message,
			modified_on: row.lastModified,

			attachmentID: row.attachmentID,
			fileMime: row.fileMime,
			fileName: row.fileName,
			thumbnailURL: row.thumbnailURL,
			type: row.type,
			url: row.url
		}));

		return fetchedItems || [];
	}

	_populateListFromDB(results: any[], reloadList: (sectionData: SectionItems) => void) {
		let fetchedItems = this._parseDatabaseResult(results);
		var updatedArray: ListItem[] = [];
		if (this.searchKeyword.trim().length == 0) {
			// if (totalItems != 0) {
			var existingArray: ListItem[] = this._listItems();
			var updatedArray = [...existingArray];
			var ids = updatedArray.map(it => it.id);

			for (let item of fetchedItems) {
				let index = ids.indexOf(item.id);

				if (index == -1) {
					if (ids.length == 0) {
						updatedArray.push(item);
					} else {
						updatedArray = [item, ...updatedArray];
					}
				} else {
					updatedArray.splice(index, 1, item);
				}
				ids = updatedArray.map(it => it.id);
			}
		} else {
			updatedArray = fetchedItems;
		}

		updatedArray.sort(
			(obj1: ListItem, obj2: ListItem): number => {
				return parseInt(obj2.modified_on) - parseInt(obj1.modified_on);
			}
		);
		if (DeviceInfo.isTablet() && !this.createNew) {
			this.props.resetEdit(updatedArray[this.state.selectedIndex]);
		}

		var updatedSectionListData: SectionItems = [];
		if (this.searchKeyword.length == 0) {
			updatedSectionListData.push({
				title: "0",
				data: [{ message: "", id: "helpview" }, { message: "", id: "editor" }]
			});
		}
		updatedSectionListData.push({
			title: "1",
			data: updatedArray
		});
		reloadList(updatedSectionListData);
	}

	componentWillReceiveProps(nextProps: { [x: string]: any }) {
		if (nextProps.list.completed) {
			LoaderHandler.hideLoader();
			if (nextProps.list.success) {
				let { count: totalItems, fetchedItems } = getValue(nextProps, ["list", "data"]);
				if (totalItems > 0) {
					this.setState({
						totalItems,
						webserviceBeingCalled: false,
						selectedIndex: this.searchKeyword.trim().length != 0 ? 0 : this.state.selectedIndex
					});
					this._populateListFromDB(fetchedItems, updatedSectionListData => {
						this.props.callEnded();
						this.setState({ listSectionItems: updatedSectionListData }, () => {
							this.props.updateListCount(this._listItems().length);
							if (this.state.totalItems == 0) {
								this.props.cleanEdit();
							}
						});
					});
				} else {
					this.props.callEnded();
					this.setState({ listSectionItems: [], totalItems: 0, webserviceBeingCalled: false }, () => {
						this.props.updateListCount(0);
						if (this.state.totalItems == 0) {
							this.props.cleanEdit();
						}
					});
				}
			} else {
				this.props.callEnded();
				let data =
					this.state.listSectionItems && this.state.listSectionItems.length > 0
						? this.state.listSectionItems[this.state.listSectionItems.length - 1].data || []
						: [];
				this.setState({ totalItems: data.length, webserviceBeingCalled: false });
				this.props.updateListCount(0);
				// No_Internet_Warning();
			}

		}
		else if (nextProps.deleteStatus.completed) {
			LoaderHandler.hideLoader();
			if (nextProps.deleteStatus.success) {
				// var deletedIds: string[] = (getValue(nextProps, ["deleteStatus", "data", "reqData", "mindPopList"]) || []).map(
				// 	(it: { mindPopID: string }) => it.mindPopID
				// );

				var deletedIds: number[] = (getValue(nextProps, ["deleteStatus", "data", "reqData", "mindPopList"]) || []).map((it: { mindPopID: string }) =>
					parseInt(it.mindPopID)
				);

				if (Actions.currentScene == "mindPopList") {
					this.props.deleteMindPopsCallEnd();
					MindPopStore._deleteMindPops(deletedIds);
				}

				var objects: Section = this.state.listSectionItems.find(obj => {
					return obj.title === "1";
				});
				if (objects) {
					var rowItems: Array<ListItem & { id: any }> = [...objects.data];
					var updatedItems = rowItems.filter(obj => {
						return deletedIds.indexOf(obj.id) == -1;
					});
					var updatedSectionListData: SectionItems = [
						{
							title: "0",
							data: [{ message: "", id: "helpview" }, { message: "", id: "editor" }]
						},
						{
							title: "1",
							data: updatedItems
						}
					];
					if (updatedItems.length == 0) {
						this.props.cleanEdit();
						// this.props.listMindPops();
						// MindPopStore._getMindPopFromLocalDB('');
					}

					this.setState(
						{
							totalItems: updatedItems.length,
							listSectionItems: updatedItems.length > 0 ? updatedSectionListData : [],
							webserviceBeingCalled: false
						},
						() => {

							this.props.updateListCount(this._listItems().length);

							this.setState({ selectedItems: [] }, () => {
								this.props.updateSelectedItemCount(this.state.selectedItems.length);
							});

							this.props.updateSelectionState(false);
						}
					);
				}
				if (this.convertToMemoryObject.callForCreateMemory) {
					this.convertToMemoryObject.callForCreateMemory = false;
					Actions.push("createMemory", {
						attachments: this.convertToMemoryObject.attachments,
						id: this.convertToMemoryObject.nid, textTitle: this.convertToMemoryObject.details.title,
						memoryDate: this.convertToMemoryObject.details.memory_date, type: createNew
					})
				}
			} else {
				this.props.deleteMindPopsCallEnd();
				let errorMsg = getValue(nextProps, ["deleteStatus", "data", "error", "message"]);
				let message: string = errorMsg || ERROR_MESSAGE;
				ToastMessage(message, message == NO_INTERNET ? Colors.WarningColor : Colors.ErrorColor);
			}
		}

	}
	componentDidMount() {
		setTimeout(() => {
			DefaultPreference.get('hide_mindpop_intro').then((value: any) => {
				if (value == 'true') {
					this.setState({ mindPopIntroVisibility: false });
				} else {
					if (this.state.listSectionItems.length == 0) {
						this.setState({ mindPopIntroVisibility: false });
					} else {
						this.setState({ mindPopIntroVisibility: true });
					}

				}
			});
		}, 2000);
	}

	componentWillMount() {
		//Fetch from server
		this.updateList();

		this.props.navigation.setParams({
			selectAction: this._select,
			selectAllAction: this._selectAll,
			backAction: this._backAction,
			updateList: this.updateList,
			cancelAction: this._cancelAction,
			clearAllAction: this._clearAllSelection
		});
		if (this.props.actionWrite || this.props.actionRecord || this.props.actionImageUpload) {
			this.createNewMindPop(true);
		}
	}

	componentWillUnmount() {
		//Reset states..
		this.props.showAlertCall(false);
		this.props.updateSelectionState(false);
		this.props.updateListCount(0);
		this.props.updateSelectedItemCount(0);
		this.eventSubs.remove();
		// this.createMemoryListener.removeListener();
	}

	onRowDidOpen = (rowKey: string, rowMap: any) => {
		setTimeout(() => {
			this.closeRow(rowMap, rowKey);
		}, 2000);
	};

	closeRow(rowMap: any, rowKey: string) {
		if (rowMap[rowKey]) {
			rowMap[rowKey].closeRow();
		}
	}

	_cancelAction = () => {
		Keyboard.dismiss();
		if (this.props.deepLinkBackClick) {
			Actions.dashBoard();
		} else {
			Actions.pop();
		}
	};

	_backAction = () => {
		//0.Update state
		this.props.updateSelectionState(false);
		this.props.cleanEdit();
		//1. Deselect All
		this.setState({ selectedItems: [] }, () => {
			this.props.updateSelectedItemCount(this.state.selectedItems.length);
		});
	};

	_selectAll = () => {
		var ids = this._listItems().map(obj => {
			return obj.id;
		});

		this.setState({ selectedItems: ids }, () => {
			this.props.updateSelectedItemCount(this.state.selectedItems.length);
		});
	};

	_clearAllSelection = () => {
		this.setState({ selectedItems: [] }, () => {
			this.props.updateSelectedItemCount(this.state.selectedItems.length);
		});
	};

	_select = () => {
		this.props.updateSelectionState(true);
	};

	_LoadMoreData = (info: any[]) => {
		if (Actions.currentScene == "mindPopList") {
			this.updateList();
		}
	};

	updateList = (searchKeyword: string = "") => {
		this.createNew = false;
		let index = this.searchKeyword.trim() == "" ? this._listItems().length : this.state.lastFetchedIndex;
		var totalItems = this.state.totalItems;
		if (totalItems == 0) {
			this.setState({ totalItems: 0, webserviceBeingCalled: true });
			LoaderHandler.showLoader();
		}
		this.props.resetEdit();
		MindPopStore._getMindPopFromLocalDB(this.searchKeyword).then((list: any[]) => {
			this._populateListFromDB(list, updatedSectionListData => {
				let list = updatedSectionListData[updatedSectionListData.length - 1].data;
				if (list.length > 0) {
					this.setState(
						{
							listSectionItems: updatedSectionListData,
							totalItems: list.length,
							selectedIndex: this.searchKeyword.trim().length != 0 ? 0 : this.state.selectedIndex
						},
						() => {
							this.props.updateListCount(this._listItems().length);
							if (this.state.totalItems == 0) {
								this.props.cleanEdit();
							}
						}
					);
				}
			});
		});
		if (totalItems == 0 || totalItems > index) {
			this.props.listMindPops({
				searchTerm: {
					start: index,
					length: 40,
					SearchString: this.searchKeyword
				},
				configurationTimestamp: TimeStampMilliSeconds(),
				lastSyncTimeStamp: "0"
			});
		}
	};

	_editAction(rowMap: any, data: any, edit: boolean = false) {
		this.closeRow(rowMap, data.item.id);
		if (edit) {
			this.props.editMode(data.item);
		} else {
			this.props.resetEdit(data.item);
		}
		Actions.mindPopEdit({ updateList: this.updateList });
		if (DeviceInfo.isTablet()) {
			this.setState({ selectedIndex: data.index });
		}
	}

	_selectRow(item: ListItem) {
		var idx = this.state.selectedItems.indexOf(item.id);
		let existingIDs = [...this.state.selectedItems];

		if (idx >= 0) {
			//if index is present then row is already selected
			existingIDs.splice(idx, 1);
		} else {
			//unselect row if already selected
			existingIDs.push(item.id);
		}

		this.setState({ selectedItems: existingIDs }, () => {
			this.props.updateSelectedItemCount(this.state.selectedItems.length);
		});
	}

	_deleteMindPopAction(selectedItems: string[]) {
		Alert.alert(`Delete attachment?`, `You wish to delete ${selectedItems.length > 1 ? "selected" : "this"} MindPop${selectedItems.length > 1 ? "s" : ""}?`, [
			{
				text: "Delete",
				style: "destructive",
				onPress: () => {
					LoaderHandler.showLoader("Deleting...");
					this.deleteMindpop(selectedItems);
				}
			},
			{
				text: "Cancel",
				style: "cancel",
				onPress: () => { }
			}
		]);
	}

	deleteMindpop = (selectedItems: any) => {
		var requstBodyObj = selectedItems.map((id: any) => {
			return { mindPopID: id };
		});
		this.props.deleteMindPops({
			mindPopList: requstBodyObj,
			configurationTimestamp: TimeStampMilliSeconds()
		});
	}
	private _empty = () => (
		<View style={{ height: 300, width: 300, backgroundColor: "transparent", alignItems: "center", alignSelf: "center" }}>
			<Text style={{ color: "black", ...fontSize(18), marginTop: 41, fontWeight: '600',fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.IntersemiBold, }}>No Results Found</Text>
			<Text style={{ color: "#1c1c1c", ...fontSize(18), lineHeight: 26, marginTop: 16, textAlign: "center" }}>{`We couldn't find any results for '${this.searchKeyword}'. Try searching for something else`}</Text>
		</View>
	);

	render() {
		return (
			<View style={{ flex: 1 }}>
				<SafeAreaView style={{ width: "100%", flex: 0, backgroundColor: Colors.NewThemeColor }} />
				<SafeAreaView style={{ width: "100%", flex: 1, backgroundColor: "#fff" }}>
					<View style={{ flex: 1 }}>
						{
							this.props.showAlert && this.props.showAlertData?.title ?
								<CustomAlert
									// modalVisible={this.state.showCustomAlert}
									modalVisible={this.props.showAlert}
									// setModalVisible={setModalVisible}
									title={this.props.showAlertData?.title}
									message={this.props.showAlertData?.desc}
									android={{
										container: {
											backgroundColor: '#ffffff'
										},
										title: {
											color: Colors.black,
											fontFamily: "SF Pro Text",
											fontSize: 17,
											fontWeight: '600',
											lineHeight: 22
										},
										message: {
											color: Colors.black,
											fontFamily: "SF Pro Text",
											// fontFamily: fontFamily.Inter,
											fontSize: 16,
											fontWeight: '500',
										},
									}}
									ios={{
										container: {
											backgroundColor: '#D3D3D3'
										},
										title: {
											color: Colors.black,
											// fontFamily: fontFamily.Inter,
											lineHeight: 22,
											fontSize: 17,
											fontWeight: '600',
										},
										message: {
											color: Colors.black,
											// fontFamily: fontFamily.Inter,
											fontSize: 13,
											lineHeight: 18,
											fontWeight: '400',
										},
									}}
									buttons={[
										{
											text:  Platform.OS==='android'?'GREAT!':'Great!',
											func: () => {
												this.props.showAlertCall(false);
											},
											styles: {
												lineHeight: 22,
												fontSize: 17,
												fontWeight: '600',
											}
										}
									]}
								/>
								:
								null
						}
						{DeviceInfo.isTablet() ? <MindPopIPadNavigationBar
							selectAction={this.props.selectAction}
							selectAllAction={this.props.selectAllAction}
							backAction={() => Actions.writeTabs()}
							// backAction={this.props.backAction}
							updateList={this.props.updateList}
							// cancelAction={this.props.cancelAction}
							cancelAction={() => Actions.dashboard()}
							clearAllAction={this.props.clearAllAction} /> :
							<MindPopNavigationBar selectAction={this.props.selectAction}
								selectAllAction={this.props.selectAllAction}
								backAction={() => Actions.dashboard()}
								cancelAction={() => Actions.dashboard()}
								// backAction={this.props.backAction}
								updateList={this.props.updateList}
								// cancelAction={this.props.cancelAction}
								clearAllAction={this.props.clearAllAction}
							/>}
						{/* <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}> */}
						{this.getListView()}
						{this.state.selectedItems.length > 0 ? (
							<SelectionStatusBar
								onPress={() => {
									this._deleteMindPopAction(this.state.selectedItems);
								}}
							/>
						) : null}
					</View>
				</SafeAreaView>
				{this.state.mindPopIntroVisibility && <MindPopIntro cancelMindPopIntro={() => {
					this.setState({ mindPopIntroVisibility: false });
					DefaultPreference.set('hide_mindpop_intro', "true").then(function () { })
				}
				}></MindPopIntro>}
			</View>
		);
	}

	convertToMemory = (id: any, content: any, filesToUpload: []) => {
		if (Utility.isInternetConnected) {
			loaderHandler.showLoader("Loading...")
			let draftDetails: any = DefaultDetailsMemory(content);
			draftDetails.mindpop_id = id;
			MindPopStore._deleteMindPops([parseInt(id)])
			CreateUpdateMemory(draftDetails, filesToUpload, "mindpopEditMemoryListener", "save");
		} else {
			ToastMessage(NO_INTERNET);
		}
	}

	_renderBackHiddenCell = (data: any, rowMap: any): JSX.Element => {
		let ItemInProgress = MindPopsInProgress.indexOf(parseInt(data.item.id)) != -1 ? true : false;
		if (data.section.title === "1") {
			return (
				ItemInProgress ? null : <View style={styles.rowBack}>
					<TouchableOpacity
						style={[styles.backRightBtn, styles.backRightBtnLeft]}
						onPress={() => {
							this._deleteMindPopAction([data.item.id]);
						}}>
						<Image source={mindPopListCell_DeleteIcon_White} />
						<Text style={styles.backTextWhite}>Delete</Text>
					</TouchableOpacity>

					{/*
				<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]}
					onPress={_ => {
						//console.log("Convert To memory pressed");
					}}>
					<Image source={mindPopListCell_MindPopIcon} />
					<Text style={styles.backTextWhite}>Convert to memory</Text>
				</TouchableOpacity>*/}

					{/* <TouchableOpacity
					style={[styles.backRightBtn, styles.backRightBtnRight]}
					onPress={() => {
						this._editAction(rowMap, data);
					}}>
					<Image source={mindPopListCell_EditIcon} />
					<Text style={styles.backTextWhite}>Edit</Text>
				</TouchableOpacity> */}
				</View>
			);
		} else {
			return null;
		}
	};

	/*_getFileURLFromPublicURL(publicPath: string): string {
		var instancePath = `https://${Account.selectedData().instanceURL}/sites/${Account.selectedData().instanceURL}/default/files/`;
		var actualPath = publicPath.replace("public://", instancePath);
		return actualPath;
	}*/

	_getThumbnailImage(item: ListItem): any | string {
		var placeHolder: any = "";

		switch (item.type) {
			case FileType.image:
				placeHolder = Utility.getFileURLFromPublicURL(item.thumbnailURL);
				break;
			case FileType.file:
				placeHolder = pdf_icon;
				break;
			case FileType.audio:
				placeHolder = thumb_audio_mindpop;
				break;
			case FileType.video:
				placeHolder = thumb_text_mindpop;
				break;
			default:
				placeHolder = thumb_text_mindpop;
				break;
		}

		return placeHolder;
	}

	fetchAndPushMindPop = async (data: any) => {
		// loaderHandler.showLoader("Loading...")
		// let value : any = await MindPopStore._getMindPopAttachments(data.id);
		// let medias: MindPopAttachment[] = value.rows.raw();
		// let attachments : any = []
		// medias.forEach((element: any) => {
		// 	attachments.push(Convert(element))
		// });
		// this.convertToMemoryObject.id = data.id;
		// this.convertToMemoryObject.details = DefaultDetailsMemory(data.message.trim());
		// this.convertToMemoryObject.attachments = attachments;
		// CreateUpdateMemory(this.convertToMemoryObject.details, [], "mindpopListCreateMemory")  
		// Actions.push("createMemory", {attachments : this.state., type : createNew}
	}
	_renderFrontCell = (data: any, item: any): JSX.Element => {
		var frontCellWidth = this.props.isSelectingItem ? "85%" : "100%";
		var selectionCellWidth = this.props.isSelectingItem ? "15%" : "0%";

		var isSelected = this.state.selectedItems.indexOf(data.item.id) >= 0 || false;
		let placeHolder = this._getThumbnailImage(data.item);
		var isURL = typeof placeHolder == "string";
		var style = { height: 64, width: 64, borderRadius: 5 };
		let ItemInProgress = MindPopsInProgress.indexOf(parseInt(data.item.id)) != -1 ? true : false;
		if (data.section.title === "1") {

			if (this.props.fromDeeplinking && (this.props.nid == data.item.id)) {
				this.convertToMemory(data.item.id, decode_utf8(data.item.message), [])
			}
			return (
				<View key={data?.item?.id}>
					<View style={{ opacity: ItemInProgress ? 0.3 : 1.0 }}>
						<TouchableWithoutFeedback
							style={{ flex: 1 }}
							disabled={ItemInProgress}
							onPress={() => {
								if (DeviceInfo.isTablet()) {
									if (this.props.isSelectingItem) {
										this._selectRow(data.item);
									} else {
										this.setState({ selectedIndex: data.index });
										this.props.editMode(data.item);
									}
								} else {
									this.props.isSelectingItem ? this._selectRow(data.item) : this._editAction(item, data, true);
								}
							}}>
							<View style={styles.rowFront}>
								{this.props.isSelectingItem && (
									<View
										style={{
											width: selectionCellWidth,
											backgroundColor: "transparent",
											justifyContent: "center",
											alignItems: "center"
										}}>
										<Image source={isSelected ? cell_selected : cell_unselected} style={{ height: 24, width: 24 }} />
									</View>
								)}

								<View
									style={{
										width: frontCellWidth,
										backgroundColor: DeviceInfo.isTablet() ? (this.state.selectedIndex == data.index ? "#E6F0EF" : "#fff") : "#fff",
										borderColor: "#DCDCDC",
										borderWidth: 2,
										borderTopWidth: 1,
										borderRadius: 5
									}}>
									<View
										style={{
											width: "100%",
											padding: 16,
											flexDirection: "row",
											flex: 1,
											justifyContent: "space-between"
										}}>
										<View style={{ flex: 1, marginLeft: 5 }}>
											<Text ellipsizeMode="tail" numberOfLines={4} style={{ color: Colors.TextColor, ...fontSize(18), fontWeight: "400" }}>
												{decode_utf8(data.item.message)}
											</Text>
										</View>

										<View
											style={{
												height: 64,
												width: 64,
												borderRadius: 5,
												justifyContent: "center",
												alignItems: "center",
												backgroundColor: "#F3F3F3"
											}}>
											<Image style={style} resizeMode={"contain"} source={isURL ? { uri: placeHolder } : placeHolder} />
										</View>
									</View>
								</View>
								{!this.props.isSelectingItem &&
									<TouchableOpacity onPress={() => this.convertToMemory(data.item.id, decode_utf8(data.item.message), [])}
										style={{
											height: 50, width: "100%", backgroundColor: Colors.NewLightThemeColor, position: "absolute", bottom: 0, borderColor: "#DCDCDC",
											borderWidth: 2,
											borderTopWidth: 1,
											borderBottomWidth: 2,
											justifyContent: "center",
											borderBottomRadius: 5
										}}>
										<Text style={{
											fontWeight: '500',
											...fontSize(18),
											fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
											color: Colors.NewTitleColor,
											paddingLeft: 15
										}}>{"Convert to Memory"}</Text>
									</TouchableOpacity>}
							</View>
						</TouchableWithoutFeedback>
					</View>
					{ItemInProgress && <Text style={{ position: "absolute", width: "100%", textAlign: "center", top: "50%" }}>{"Files are being uploaded..."}</Text>}
				</View>
			);
		} else {
			if (this.props.isSelectingItem) {
				return <View style={{ height: 0, width: 0 }} />;
			} else {
				if (data.item.id === "helpview") {
					return this._getHelpCell;
				} else {
					return this._getEditorCell();
				}
			}
		}
	};

	private _getHelpCell: JSX.Element = (
		<AccordionView
			sectionData={[
				{
					title: "What are MindPops?",
					content: "MindPops are inklings of memories that suddenly pop into your head. Quickly jot them down to write about later.",
					link: "Learn more ways to add MindPops >"
				}
			]}
		/>
	);

	createNewMindPop = (fromNavBar?: boolean) => {
		this.createNew = true;
		this.props.cleanEdit();
		if (fromNavBar) {
			loaderHandler.showLoader("Loading...");
			Actions.mindPopEdit({ updateList: this.updateList, actionImageUpload: this.props.actionImageUpload, actionRecord: this.props.actionRecord, actionWrite: this.props.actionWrite });
		} else {
			Actions.mindPopEdit({ updateList: this.updateList });
		}
	}
	_getEditorCell = (): JSX.Element => {
		return (
			<TouchableOpacity
				activeOpacity={0.9}
				onPress={() => {
					this.createNewMindPop();
				}}>
				<View
					style={{
						backgroundColor: DeviceInfo.isTablet() ? Colors.ThemeColor : "#fff",
						borderRadius: DeviceInfo.isTablet() ? 24 : 5,
						justifyContent: DeviceInfo.isTablet() ? "center" : "flex-start",
						alignItems: DeviceInfo.isTablet() ? "center" : "flex-start",
						height: DeviceInfo.isTablet() ? 48 : Size.byHeight(252),
						...(DeviceInfo.isTablet()
							? { marginTop: 16, marginLeft: 16, marginRight: 16 }
							: {
								margin: 16,
								borderColor: "#DCDCDC",
								borderWidth: 2,
								borderTopWidth: 1,
								marginBottom: 0,
								paddingTop: 10
							})
					}}>
					<Text
						multiline={true}
						editable={false}
						style={{
							color: DeviceInfo.isTablet() ? "#fff" : Colors.TextColor,
							opacity: DeviceInfo.isTablet() ? 1 : 0.8,
							...fontSize(18),
							padding: DeviceInfo.isTablet() ? 0 : 16,
							textAlignVertical: "top",
							fontStyle: DeviceInfo.isTablet() ? "normal" : "italic",
							minHeight: DeviceInfo.isTablet() ? 15 : 220
						}}>
						{(DeviceInfo.isTablet() ? "+" : "") + `Capture ${DeviceInfo.isTablet() ? "a" : "your"} MindPop` + (DeviceInfo.isTablet() ? "" : "...")}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	performSearch = (searchKeyword: string): void => {
		this.setState({ searchMode: true });
		this.updateList(searchKeyword);
		//set search keyword save last normal searched index
		/*this.setState({ searchKeyword: searchKeyword, listSectionItems: [], lastFetchedIndex: this._listItems().length }, () => {
			//fetch data from database
			MindPopStore._getMindPopFromLocalDB(this.state.searchKeyword).then((list: any[]) => {
				this._populateListFromDB(list, updatedSectionListData => {
					//update list with fetched data from database
					this.setState({ listSectionItems: updatedSectionListData }, () => {
						//update list count
						this.props.updateListCount(this._listItems().length);

						// get updated list from server
						this.updateList();
					});
				});
			});
		});*/
	};

	clearSearch: () => void = () => {
		this.searchKeyword = "";
		MindPopStore._getMindPopFromLocalDB("").then((list: any[]) => {
			this._populateListFromDB(list, updatedSectionListData => {
				let totalItems = 0;
				if (updatedSectionListData.length == 2) {
					totalItems = updatedSectionListData[1].data.length;
				}
				this.setState({ searchMode: false, listSectionItems: updatedSectionListData, totalItems }, () => {
					this.props.updateListCount(this._listItems().length);
				});
			});
		});
	};

	getListView(): JSX.Element {
		return (
			<View style={styles.container}>
				{this.props.isSelectingItem || (this.state.totalItems < 1 && !this.state.searchMode) ? null : (
					<SearchBar style={styles.containerSearch}
						value={this.searchKeyword.trim()}
						placeholder="Search"
						onSearchButtonPress={(keyword: string) => {
							this.performSearch(keyword.trim());
						}}
						onClearField={() => {
							this.clearSearch();
						}}
						onChangeText={(text: string) => {
							this.searchKeyword = text.trim();
						}}
						onBlur={() => {
							Keyboard.dismiss();
						}}
					/>
				)}
				{this.state.listSectionItems.length == 0 ? (
					this.state.searchMode ? (
						this._empty()
					) : this.state.webserviceBeingCalled ? (
						<View style={{ height: 0, width: 0 }} />
					) : (
						<EmptyView resetEdit={this.props.resetEdit} updateList={this.updateList} />
					)
				) : (
					<SwipeListView
						ref={this.listRef}
						onRowOpen={(rowKey, rowMap) => {
							ReactNativeHapticFeedback.trigger("impactMedium", options);
						}}
						style={{ backgroundColor: Colors.NewThemeColor }}
						useSectionList
						maxToRenderPerBatch={50}
						removeClippedSubviews={true}
						sections={this.state.listSectionItems}
						renderItem={this._renderFrontCell}
						renderHiddenItem={this.props.isSelectingItem ? null : this._renderBackHiddenCell}
						disableRightSwipe={true}
						rightOpenValue={-(buttonWidth * 1) - 8}
						stopRightSwipe={-(buttonWidth * 1) - 8}
						stopLeftSwipe={0}
						closeOnRowBeginSwipe={true}
						previewRowKey={"-1"}
						extraData={this.state}
						onScroll={() => { Keyboard.dismiss() }}
						keyExtractor={this._keyExtractor}
						onEndReached={this._LoadMoreData}
					/>
				)}
			</View>
		);
	}

	_keyExtractor: (item: ListItem, index: number) => string = (item, index) => {
		return item.id || index.toString();
	};

	_renderFooter = (data: any, item: any): JSX.Element | null => {
		if (data.section.title === "0") {
			return null;
		} else {
			return <View style={{ height: 30, width: "100%", backgroundColor: "red" }} />;
		}
	};
}

const styles = EStyleSheet.create({
	container: {
		backgroundColor: Colors.white,
		flex: 1,
		width: "100%"
	},
	containerSearch: {
		backgroundColor: Colors.white,
	},
	backTextWhite: {
		color: Colors.white,
		...fontSize(17),
		fontWeight: '500',
		fontFamily: Platform.OS === 'ios' ? fontFamily.Inter : fontFamily.InterMedium,
		padding: 12,
		textAlign: "center"
	},
	rowFront: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "stretch",
		margin: 16,
		marginBottom: 0,
		height: Size.byHeight(170)
	},

	rowBack: {
		alignItems: "center",
		backgroundColor: "#f3f3f3",
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
		margin: 16,
		borderRadius: 5,
		marginBottom: 0,
		height: Size.byHeight(170)
	},

	backLeftBtn: {
		alignItems: "center",
		bottom: 0,
		justifyContent: "center",
		position: "absolute",
		top: 0,
		width: buttonWidth,
		borderRadius: 5,
		backgroundColor: Colors.ErrorColor,
		height: Size.byHeight(170)
	},

	backRightBtn: {
		alignItems: "center",
		bottom: 0,
		justifyContent: "center",
		position: "absolute",
		top: 0,
		width: buttonWidth,
		borderRadius: 5,
		height: Size.byHeight(170)
	},
	backRightBtnLeft: {
		backgroundColor: Colors.ErrorColor,
		right: 0
	},
	backRightBtnRight: {
		backgroundColor: Colors.NewThemeColor,
		right: 0
	}
});

const mapState = (state: { [x: string]: any }) => ({
	list: state.getMindPop,
	deleteStatus: state.deleteMindPop,
	isSelectingItem: state.mindPopListSelectionStatus,
	showAlert: state.MemoryInitials.showAlert,
	showAlertData: state.MemoryInitials.showAlertData,
	listItem: state.mindPopEditMode.selectedMindPop
});

const mapDispatch = (dispatch: Function) => {
	return {
		editMode: (payload: any = null) => dispatch({ type: EditMode.EDIT, payload }),
		resetEdit: (payload: any = null) => dispatch({ type: EditMode.RESET, payload }),
		cleanEdit: () => dispatch({ type: EditMode.UNSELECT }),
		listMindPops: (payload: any) => dispatch({ type: GetMindPopStatus.RequestStarted, payload }),
		callEnded: () => dispatch({ type: GetMindPopStatus.RequestEnded }),
		updateSelectionState: (payload: boolean) => dispatch({ type: MindPopListSelectionState, payload }),
		updateListCount: (payload: number) => dispatch({ type: MindPopListCount, payload }),
		updateSelectedItemCount: (payload: number) => dispatch({ type: MindPopSelectedItemCount, payload }),
		deleteMindPops: (payload: any) => dispatch({ type: DeleteMindPopOperation.RequestStarted, payload }),
		showAlertCall: (payload: any) => dispatch({ type: showCustomAlert, payload: payload }),
		deleteMindPopsCallEnd: () => dispatch({ type: DeleteMindPopOperation.RequestEnded })
	};
};
export default connect(
	mapState,
	mapDispatch
)(MindPopList);
