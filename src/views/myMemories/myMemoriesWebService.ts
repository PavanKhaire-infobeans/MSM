import { Storage, MemoryActionKeys} from "../../common/constants";
import { Account } from "../../common/loginStore";
import { MemoryService} from "../../common/webservice/memoryServices";
import EventManager from "../../common/eventManager";
export const kMemoryDraftsFetched = "memoryDrafts";
export const kPublishedMemoriesFetched = "publishedMemories";
export const kPublishedMemoryCollections = "publishedMemoryCollections";
export const kAllLikes = "allLikesDataFromPublished";
export const kLiked = "likedFromPublished";
export const kUnliked = "unlikedFromPublished";
export const kPromptsList = "promptsList";
export const kHidePrompt = "hidePrompt";
export const kMemoryActionPerformed = "MemoryActionPerformed"
export const kMemoryActionPerformedPublished = "MemoryActionsPerformedPublished"
export const kMemoryActionPerformedOnDashboard = "MemoryActionsPerformedDashboard"
export const kMemoryActionPerformedOnMemoryDetails = "MemoryActionPerformedOnMemoryDetails"
export const kUpdateMemoryOnTimeline = "UpdateMemoryOnTimeline"
export const kUpdateMemoryOnPublised = "UpdateMemoryOnPublised"
export const kBlockedUsers = "users"
export const kBlockedMemories = "memories" 
export const kBlockedUsersFetched = "blocked users Fetched"
export const kBlockedMemoriessFetched = "blocked memories Fetched"
export const kUserUnblocked = "user unblocked"
export const GetMemoryDrafts = async (type : any, mineType: any, offset: any) => {
	try {
		let data = await Storage.get('userData')
		let response = await MemoryService(`https://${Account.selectedData().instanceURL}/api/memory_draft/get`,
			[{ "X-CSRF-TOKEN": data.userAuthToken, "Content-Type": "application/json" },
			{   "configurationTimestamp" : "0",         
                "details" : {
                    "search_term": "",
                    "type": type,
                    "mine_type": mineType,
                    "get_count": true,
                    "limit": "10",
                    "offset": offset
                }                      
			}
			])
			.then((response: Response) => response.json())
			.catch((err: Error) => {
				Promise.reject(err) 
			});
			if (response != undefined && response != null){
				if(response.ResponseCode==200){
					EventManager.callBack(kMemoryDraftsFetched, true, response["Data"]);
				}
				else{
					EventManager.callBack(kMemoryDraftsFetched, false, response["ResponseMessage"]);
				}
			}else{
				EventManager.callBack(kMemoryDraftsFetched, false, "Unable to process your request. Please try again later");
			}
						
	} catch (err) {
		EventManager.callBack(kMemoryDraftsFetched, false, "Unable to process your request. Please try again later");
	}
};

export const GetPublishedMemories = async (lastMemoryDate: any) => {
	try {
		let data = await Storage.get('userData')
		let response = await MemoryService(`https://${Account.selectedData().instanceURL}/api/timeline/list`,
		[{ "X-CSRF-TOKEN": data.userAuthToken, "Content-Type": "application/json" },
		{   "configurationTimestamp" : "0",         
			"type" : "feed",
			"filter": {
                "mystories": {
						"me": 1,
				}
			},
			"searchTerm" : {
				"length": 5,
				"request_type": "older",
				"last_memory_date": lastMemoryDate,
			} ,
			"randomPrompts": 0                     
		}
		])
		.then((response: Response) => response.json())
		.catch((err: Error) => {
			Promise.reject(err)
		});
		if (response != undefined && response != null){
			if(response.ResponseCode==200){
				EventManager.callBack(kPublishedMemoriesFetched, true, response["Details"]);
			}
			else{
				EventManager.callBack(kPublishedMemoriesFetched, false, response["ResponseMessage"]);
			}		
		}	
	} catch (err) {
		EventManager.callBack(kPublishedMemoriesFetched, false, "Unable to process your request. Please try again later");
	}
}
export const GetPublishedMemoryCollections = async (requestId: any) => {
	try {
		let data = await Storage.get('userData')
		let response = await MemoryService(`https://${Account.selectedData().instanceURL}/api/collection/list_memory_collections`,
		[{ "X-CSRF-TOKEN": data.userAuthToken, "Content-Type": "application/json" },
		{   "configurationTimestamp" : "0",
				"details" : {       
                	id: requestId
				}
			}
		])
		.then((response: Response) => response.json())
		.catch((err: Error) => {
			Promise.reject(err)
		});
		if (response != undefined && response != null){
			if(response.ResponseCode==200){
				EventManager.callBack(kPublishedMemoryCollections, true, response["CollectionMemories"]);
			}
			else{
				EventManager.callBack(kPublishedMemoryCollections, false, response["ResponseMessage"]);
			}		
		}	
	} catch (err) {
		EventManager.callBack(kPublishedMemoryCollections, false, "Unable to process your request. Please try again later");
	}
}

export const GetBlockedUsersAndMemory = async (type : any) => {
	try {
		let data = await Storage.get('userData')
		let response = await MemoryService(`https://${Account.selectedData().instanceURL}/api/get/users_blocked_data`,
			[{ "X-CSRF-TOKEN": data.userAuthToken, "Content-Type": "application/json" },
			{   "configurationTimestamp" : "0",         
				"details" : {"type": type}                     
			}
			])
			.then((response: Response) => response.json())
			.catch((err: Error) => {
				Promise.reject(err)
			});
			if (response != undefined && response != null){
				if(response.ResponseCode==200){
					EventManager.callBack(kBlockedUsersFetched, true, response["Data"]);
				}
				else{
					EventManager.callBack(kBlockedUsersFetched, false, response["ResponseMessage"]);
				}
			}else{
				EventManager.callBack(kBlockedUsersFetched, false, "Unable to process your request. Please try again later");
			}
						
	} catch (err) {
		EventManager.callBack(kBlockedUsersFetched, false, "Unable to process your request. Please try again later");
	}
};
// export const GetActivities = async (offset: any) => {
// 	try {
// 		let data = await Storage.get('userData')
// 		let response = await MemoryService(`https://${Account.selectedData().instanceURL}/api/activities/get_activity_data`,
// 		[{ "X-CSRF-TOKEN": data.userAuthToken, "Content-Type": "application/json" },
// 		{   "configurationTimestamp" : "0",        
// 			"details": {
// 					"type": "activities",
// 					"limit": 10,
// 					"offset": offset
// 			}                    
// 		}
// 		])
// 		.then((response: Response) => response.json())
// 		.catch((err: Error) => {
// 			Promise.reject(err)
// 		});
// 		if (response != undefined && response != null){
// 			if(response.ResponseCode==200){
// 				EventManager.callBack(kActivities, true, response["Details"]);
// 			}
// 			else{
// 				EventManager.callBack(kActivities, false, response["ResponseMessage"]);
// 			}		
// 		}	
// 	} catch (err) {
// 		EventManager.callBack(kActivities, false, "Unable to process your request. Please try again later");
// 	}
// }

// export const SetSeenActivity = async (ids: any, index : any) => {
// 	try {
// 		let data = await Storage.get('userData')
// 		let response = await MemoryService(`https://${Account.selectedData().instanceURL}/api/notifications/set_seen_data`,
// 		[{ "X-CSRF-TOKEN": data.userAuthToken, "Content-Type": "application/json" },
// 		{   "configurationTimestamp" : "0",        
// 			"details": ids          
// 		}
// 		])
// 		.then((response: Response) => response.json())
// 		.catch((err: Error) => {
// 			Promise.reject(err)
// 		});
// 		if (response != undefined && response != null){
// 			if(response.ResponseCode==200){
// 				EventManager.callBack(kSeenData, true, index);
// 			}
// 			else{
// 				EventManager.callBack(kSeenData, false, index, response["ResponseMessage"]);
// 			}		
// 		}	
// 	} catch (err) {
// 		//console.log("Error is : ", err)
// 		EventManager.callBack(kSeenData, false, index, "Unable to process your request. Please try again later");
// 	}
// };
export const MemoryAction = async (type : any, nid: any, actionType: any, uid?: any, collections_nids?: any, listner? : any) => {
	try {
		let data = await Storage.get('userData')
		let details : any = {
			"action_type": actionType,
            "type": uid ? "user" : type,
			"id": uid ? uid : nid
		}

		if(actionType == MemoryActionKeys.blockAndReportKey){
			details = {...details, "memory_id" : nid}
		}	
		
		if(actionType == MemoryActionKeys.addToCollection){
			details = {...details, "collections_nids" : collections_nids}
		}	
		let response = await MemoryService(`https://${Account.selectedData().instanceURL}/api/actions/memory`,
			[{ "X-CSRF-TOKEN": data.userAuthToken, "Content-Type": "application/json" },
			{   "configurationTimestamp" : "0",         
                details               
			}
			])
			.then((response: Response) => response.json())
			.catch((err: Error) => {
				Promise.reject(err)
			});
			if (response != undefined && response != null){
				if(response.ResponseCode==200){
					if(listner){
						EventManager.callBack(listner, true, "Data", nid, actionType, uid);
					} else {
						EventManager.callBack(kMemoryActionPerformedPublished, true, "Data", nid, actionType, uid);
						EventManager.callBack(kMemoryActionPerformedOnDashboard, true, "Data", nid, actionType, uid);
						EventManager.callBack(kMemoryActionPerformedOnMemoryDetails, true, "Data", nid, actionType, uid);
					}						
				}
				else{
					if(listner){
						EventManager.callBack(listner, false, response["ResponseMessage"]);
					} else {
						EventManager.callBack(kMemoryActionPerformedPublished, false, response["ResponseMessage"]);
						EventManager.callBack(kMemoryActionPerformedOnDashboard, false, response["ResponseMessage"]);
						EventManager.callBack(kMemoryActionPerformedOnMemoryDetails, false, response["ResponseMessage"]);
					}					
			}
		}
						
	} catch (err) {
		if(listner){
			EventManager.callBack(listner, false, "Unable to process your request. Please try again later");
		} else {
			EventManager.callBack(kMemoryActionPerformedPublished, false, "Unable to process your request. Please try again later");
			EventManager.callBack(kMemoryActionPerformedOnDashboard, false, "Unable to process your request. Please try again later");
			EventManager.callBack(kMemoryActionPerformedOnMemoryDetails, false, "Unable to process your request. Please try again later");
		}			
	}
};
export const GetPrompts = async (categories: any,loadMore : any ,offsetValue: any) => {
	try {
		let data = await Storage.get('userData')
		let response = await MemoryService(`https://${Account.selectedData().instanceURL}/api/prompts/list`,
		[{ "X-CSRF-TOKEN": data.userAuthToken, "Content-Type": "application/json" },
		{   "configurationTimestamp" : "0", 
			"searchTerm" : {
				"categories": categories,
				"prompt_offset": offsetValue
	        }                  
		}  
		])
		.then((response: Response) => response.json())
		.catch((err: Error) => {
			Promise.reject(err)
		});
		if (response != undefined && response != null){
			if(response.ResponseCode==200){
				EventManager.callBack(kPromptsList, true, loadMore, response["Details"]);
			}
			else{
				EventManager.callBack(kPromptsList, false, loadMore, response["ResponseMessage"]);
			}		
		}	
	} catch (err) {
		EventManager.callBack(kPromptsList, false, loadMore, "Unable to process your request. Please try again later");
	}
}

export const HidePrompt = async (promptId: any) => {
	try {
		let data = await Storage.get('userData')
		let response = await MemoryService(`https://${Account.selectedData().instanceURL}/api/prompts/hide`,
		[{ "X-CSRF-TOKEN": data.userAuthToken, "Content-Type": "application/json" },
		{   "configurationTimestamp" : "0", 
			"prompt_nid" :  promptId               
		}  
		])
		.then((response: Response) => response.json())
		.catch((err: Error) => {
			Promise.reject(err)
		});
		if (response != undefined && response != null){
			if(response.ResponseCode==200){
				EventManager.callBack(kHidePrompt, true, promptId ,response["Details"]);
			}
			else{
				EventManager.callBack(kHidePrompt, false, promptId,response["ResponseMessage"]);
			}		
		}	
	} catch (err) {
		EventManager.callBack(kPromptsList, false, "Unable to process your request. Please try again later");
	}
}