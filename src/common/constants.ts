import { GetMemoryDrafts } from "../views/myMemories/myMemoriesWebService";
import { PixelRatio, Platform, Dimensions } from "react-native";
import DeviceInfo from "react-native-device-info";
import { kAdmin, isCueBackInstance } from "../views/registration/getInstancesSaga";
import loaderHandler from "./component/busyindicator/LoaderHandler";
import AsyncStorage from "@react-native-community/async-storage";

//const punycode = require('punycode');
export const keyObject = "object"
export const keyString = "string";
export const keyArray = "array";
export const keyInt = "int";
export const keyBoolean = "boolean"

export function testEmail(email: string) {
	return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email);
}

export function testPhone(phoneNo: string) {
	return /^(\+\[0-9]{1,3}[- ]?)?\d{10}$/.test(phoneNo);

	// /^(\+\d{1,3}[- ]?)?\d{10}$/
	// /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/ 
}
export function validFileName(fileName: string) {
	return /^([A-Za-z0-9 ])+$/.test(fileName);
}

var lastSavedSize : number = 0;
const DEFAULT = {
	WIDTH: 375,
	HEIGHT: 667
};
export const Colors = {
	ErrorColor: '#DD4040',
	ThemeColor: '#207D89',
	//ThemeColor: '#026D60',
	NewThemeColor: '#94D6DB',
	NewDarkThemeColor: '#31C7DB',
	NewLightThemeColor: "#F2F8F8",
	NewLight:'rgba(148, 214, 219, 0.4)',
	NewLightCommentHeader: "#DFF3F4",
	NewYellowColor: '#DE8B00',
	NewTitleColor: '#207D89',
	TextColor: "#373852",
	AudioViewBg:"#F8D5DA",
	AudioViewBorderColor: "#EB8898",
	BtnBgColor: '#207D89',
	NewRadColor:"#DD4040",
	ThemeLight: '#169D8C',
	WarningColor: '#FF0000',
	passwordWeak: "#FF4D4D",
	passwordMedium: "#FFC700",
	passwordStrong: "#60F048",
	filterBG : '#EDF4F4',
	dullText : 'rgba(81, 82, 108, 0.75)',
	selectedFilter : '#BCDDE0',
};
export const MyMemoriesTapBarOptions = {
    published: "Published",
    drafts: "Drafts",
    activity: "Activity",
};

export const DraftType = {
	allDrafts : "All Drafts",
	myPersonalDrafts : "My Personal Drafts",
	myCollaborationDrafts : "My Collaboration Drafts" ,
	friendsDrafts : "Friends Drafts",
	recentryDeleteDrafts : "Recently Deleted"
}
export const DraftActions = {
	deleteDrafts : "delete_memory", 
	undeleteDrafts : "undelete_memory"
}

export const DashBoardTapBarOptions = {
	timeline: "Timeline",
	recent: "Recent"
}

export const MemoryType = {
	timeline : "timeline", 
	recent : "feed"
}

export const MemoryRequestType = {
	timeline : "newer", 
	recent : "older"
}

export const TimelineMemoryTypes = {

	TYPE_INTERNAL_CUES : "internal_cues",

	TYPE_MY_STORIES: "my_stories", 

    TYPE_BOOK_COLLECTION : "book_collection", //Collection
    TYPE_MOVIES_COLLECTION : "movies_collection", //Collection
    TYPE_TV_SHOWS_COLLECTION : "tv_shows_collection", //Collection
    TYPE_NEWS_COLLECTION : "news_collection", //Collection in req notable_us_events
	TYPE_SPORTS_COLLECTION : "sports_collection", //Collection in req notable_us_events
	TYPE_NOTABLE_US_EVENTS : "notable_us_events",

    TYPE_PROMPT_QUESTION : "prompt_question",
    TYPE_SONGS : "songs",
    TIMELINE_TYPE_FEED : "feed",
    TIMELINE_TYPE_TIMELINE : "timeline",
    TIMELINE_FILTER_ALL_YEARS : "all_years",
    TIMELINE_FILTER_MY_YEARS : "my_years",
    TIMELINE_LIKE_TYPE : "node"
}
 
export const MemoryActionKeys = {
	addToCollection: "add_to_collection",
	deleteMemoryKey: "delete_memory",
	editMemoryKey: "edit_memory",
	moveToDraftKey: "move_to_draft",
	removeMeFromThisPostKey: "remove_me_from_this_post", 
	blockMemoryKey: "block_memory",
	blockUserKey: "block_user", 
	cancelActionKey : "cancelActions",
	reportMemoryKey : "report_memory",
	blockAndReportKey : "block_user_report_memory",
	unblockUserKey : "unblock_user"
}

export const MemoryActionKeyValues = {
	deleteMemory : "Delete",
	editMemory : "Edit Memory",
	moveToDraft: "Move to Drafts",
	removeMeFromThisPost : "Remove me from this post",
	blockMemory : "Hide",
	blockUser : "Block User",
	reportMemory : "Report Memory",	
	blockAndReport : "Block and Report",
	unBlockUser : "Unblock User"
}
export const TimeStampMilliSeconds = () => {
	return `${new Date().getTime() / 1000}`.split(".")[0]
};
export const Size = (() => {
	const { width: myWidth, height: myHeight } = Dimensions.get("window");
	return {
		byHeight: (height: number) => {
			return (DeviceInfo.isTablet() || Platform.OS == "android") ? height : (height * myHeight) / DEFAULT.HEIGHT;
		},
		byWidth: (width: number) => {
			return (DeviceInfo.isTablet() || Platform.OS == "android") ? width : (width * myWidth) / DEFAULT.WIDTH;
		}
	};
})();

export const fontSize = (size: number): { fontSize: number } => {	
	if (Platform.OS == "android") {
		size > 0 ? size : size = 15	;
		let fontSize = PixelRatio.getPixelSizeForLayoutSize(size) / PixelRatio.get();		
		return { fontSize }
	}
	return { fontSize: size }
}

export const ERROR_MESSAGE = "Something went wrong, Please try again later";
export const NO_INTERNET = "You're offline! Please check your connection and try again.";
export const MindPopsInProgress : Array<number> = [];
export const ShareOptions : any = {    
    "only_me": "Only me (and collaborators I add)",
    "custom": "Selected friends and/or friend circles",
    "allfriends": "All friends",
    "cueback": "All members"    
}
export function uploadTask(success: (data: { [x: string]: any }) => void, failure: (error: any) => void): (options: object) => void {
	const UploadManager = require('react-native-background-upload').default
	const loaderHandler = require('../common/component/busyindicator/LoaderHandler').default	
	return function (options: object): void {
		try {
			asyncGen(function* () {
				loaderHandler.showLoader("Uploading..");
				try {
					let uploadId = yield UploadManager.startUpload(options);
					if (typeof uploadId == 'string') {
						UploadManager.addListener('error', uploadId, (data: any) => {
							hideLoaderWithTimeOut();
							failure(data)
						});
						UploadManager.addListener('cancelled', uploadId, (...data: any[]) => {
							hideLoaderWithTimeOut();
							failure({ message: "Upload cancelled", uploadId, data });
						});
						UploadManager.addListener('completed', uploadId, (data: any) => {
							hideLoaderWithTimeOut();
							success(data)
						});
					} else {
						hideLoaderWithTimeOut();
						failure(uploadId);
					}
				} catch (err) {
					hideLoaderWithTimeOut();
					failure(err);
				}
			})
		} catch (error) {
			hideLoaderWithTimeOut();
			failure(error)
		}
	}
	
}

function hideLoaderWithTimeOut(){
	setTimeout(() => {
		loaderHandler.hideLoader();
	}, 1000);
}
export const asyncGen = (starFunc: (options: object) => IterableIterator<any>) => {
	const iterator = starFunc(starFunc.arguments);
	const handle = (x: any) => {
		const iteration = iterator.next(x)
		if (!iteration.done) {
			iteration.value.then(handle)
		}
	}
	iterator.next().value.then(handle)
}

export const GetFileType = {
	getStatus: (key: string) => {
		var values: { [x: string]: number } = {
			image: 2, audio: 3, file: 4, video: 5
		}
		var keys = Object.keys(values)
		let value = keys.find((ky: string) => (key.indexOf(ky) != -1))
		return values[value]
	}
}

export const GenerateRandomID = (): string => {
	return `${parseInt(`${Math.random() * 1000000000}`)}`
}

export const Storage = (() => {
//	const { AsyncStorage } = require("@react-native-community/async-storage");
	return {
		save: async (path: string, value: any) => {
			try {
				let storeVal = `${typeof value}:=:${typeof value == "string" ? value : JSON.stringify(value)}`;
				await AsyncStorage.setItem(path, storeVal);
			} catch (err) {
				//console.log(err);
			}
		},
		get: async (path: string) => {
			try {
				let value = await AsyncStorage.getItem(path);
				if (value != null) {
					const [dataType, dataValue] = value.split(":=:");
					if (dataType == "object") {
						return JSON.parse(dataValue);
					}
					return dataValue;
				}
			} catch (err) {
				//console.log(err);
			}
		},
		delete: async (path: string) => {
			try {
				await AsyncStorage.removeItem(path);
			} catch (err) {
				//console.log(err);
			}
		},
		deleteAll: async () => {
			try {
				await AsyncStorage.clear((err: Error) =>{});
			} catch (err) {
				//console.log(err);
			}
		}
	};
})();

export const CueBackInsatance = (isCueBackInstance? {
	InstanceID: "2001", 
	InstanceName: "My Stories Matter", 
	InstanceURL: "mystoriesmatter.com", 
	InstanceImageURL : 'https://admin.cueback.com/sites/default/files/my-stories-matter.png',
	is_fake : 0
}: 
{	InstanceID: "2002", 
	InstanceName: "QA Public", 
	//InstanceURL: "qa-public.cueback.com", 
	InstanceURL: "public.cuebackqa.com",
	InstanceImageURL : null,
	is_fake : 0
}
)
export const constant = {
	deviceWidth: 375,
	deviceHeight: 667,
	iPhone5Height: 568,
}
export const getValue = (obj: { [x: string]: any }, path: Array<string>): any => {
	if (obj && typeof obj == "object") {
		if (path.length == 1) {
			return obj[path[0]]
		}
		let nPath = [...path]
		nPath.splice(0, 1)
		return getValue(obj[path[0]], nPath);
	}
	return null
};

export const getDetails = (object: any, params : any, typeOfField ? : any): any => {
	typeOfField = typeOfField ? typeOfField : keyString;
	if(getValue(object, params)){
		return getValue(object, params)
	}
	else{
        switch (typeOfField){
            case keyString : return ""
            case keyArray : return []
            case keyObject : return {}
            case keyInt: return 0
            case keyBoolean : return false
        }		
	}
	return null
};

export function encode_utf8(s: string): string {
	var encodedString = ""
	try {
		encodedString = encodeURI(s)//unescape(encodeURIComponent(s));//punycode.encode(str);//
	} catch {
		encodedString = s
	}
	return encodedString

}

export function decode_utf8(s: string): string {
	var decodedString = ""
	try {
		decodedString = decodeURI(s)// decodeURIComponent(escape(s));//punycode.decode(str);//
	} catch {
		decodedString = s
	}
	return decodedString
}



/*export const requestPermission = async (type: string): Promise<boolean> => {
	type PermissionState = "authorized" | "denied" | "restricted" | "undetermined";
	const Permissions = require('react-native-permissions').default;
	const { Alert } = require('react-native');
	var permission: PermissionState = "undetermined";
	try {
		permission = await Permissions.request(type);
		if (permission != "authorized") {
			permission = await Permissions.check(type);
			if (permission != "authorized") {
				Alert.alert("Change settings", "", [
					{
						text: "Cancel",
						style: "cancel",
						onPress: null
					},
					{
						text: "Open Settings",
						style: "default",
						onPress: () => {
							Permissions.openSettings();
						}
					}
				]);
				return false;
			}
		}
		return permission == "authorized";
	} catch (error) {
		//console.log(error);
		return false;
	}
}; */
import {check, request , PERMISSIONS, RESULTS} from 'react-native-permissions';

/*export const requestPermission = async (type: string): Promise<boolean> => {
	type PermissionStatus = 'unavailable' | 'denied' | 'blocked' | 'granted';
	
	String test = check(PERMISSIONS.IOS.CAMERA);
	try{
	request(PERMISSIONS.IOS.CAMERA).then((result) => {
		
		return true;

	  });
	}catch{
		return false;
	}
	
}*/

export const requestPermission = async (type: string): Promise<boolean> => {
	type PermissionState = "authorized" | "denied" | "restricted" | "undetermined";
	const Permissions = require('react-native-permissions').default;
	const { Alert } = require('react-native');
	//var permission: PermissionState = "undetermined";
	try {
		var permissionType ;

			if(Platform.OS === "ios"){

				if(type === "camera" )
				permissionType = PERMISSIONS.IOS.CAMERA;
				else if(type === "photo")
				permissionType = PERMISSIONS.IOS.PHOTO_LIBRARY;
				else if(type === "microphone")
				permissionType =PERMISSIONS.IOS.MICROPHONE
				else if(type === "storage")
				permissionType =PERMISSIONS.IOS.MEDIA_LIBRARY
			}else {

				if(type === "camera" )
				permissionType = PERMISSIONS.ANDROID.CAMERA;
				else if(type === "photo")
				permissionType = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
				else if(type === "microphone")
				permissionType =PERMISSIONS.ANDROID.RECORD_AUDIO
				else if(type === "storage")
				permissionType =PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
			}

			var test = await request(Platform.select({
			android: permissionType,
			ios: permissionType,
  			})).then((result) => {
			// …
			if(result === "granted")
			return true;
			else
			return false;
			
			  });
			  return test;
		  
		/*permission = await Permissions.request(type);
		if (permission != "authorized") {
		
			permission = await Permissions.check(type);
			if (permission != "authorized") {
				Alert.alert("Change settings", "", [
					{
						text: "Cancel",
						style: "cancel",
						onPress: null
					},
					{
						text: "Open Settings",
						style: "default",
						onPress: () => {
							Permissions.openSettings();
						}
					}
				]);
				return false;
			}
		}*/
		//return permission == "authorized";
	} catch (error) {
		//console.log(error);
		return false;
	}
};



 
