import Utility from '../../common/utility';
import { getDetails, keyInt, keyArray, keyString, keyObject } from "../../common/constants";
import { profile_placeholder } from '../../images';
import { Account } from '../../common/loginStore';

export class DashboardDataModel {
    static getConvertedData = (memory : any) =>{
        let memories : any = [];
        if(memory == undefined || memory == null)
            return []
        memory.forEach((element : any) => {
            let parsedMemory: any = {};
            parsedMemory.api_url = getDetails(element, ['api_url'] , keyArray); 
            parsedMemory.collection = getDetails(element, ['collection'] , keyArray); 
            parsedMemory.actions_on_memory = getDetails(element, ['actions_on_memory'] , keyObject); 
            parsedMemory.comments_count = getDetails(element, ['comments_count'] , keyString); 
            parsedMemory.created = getDetails(element, ['created'] , keyString); 
            parsedMemory.description = getDetails(element, ['description'] , keyString).trim(); 
            parsedMemory.noOfComments = getDetails(element, ["comments_count"], keyInt);
            parsedMemory.noOfLikes = getDetails(element, ["like_comment_data", "like_count"], keyInt);
            parsedMemory.viewCount = getDetails(element, ["view_count"], keyInt); 
            parsedMemory.isLikedByUser = getDetails(element, ["like_comment_data", "like_flag"], keyInt);
            parsedMemory.location = getDetails(element, ['location'] , keyString); 
            parsedMemory.memory_date = getDetails(element, ['memory_date'] , keyString); 
            parsedMemory.mins_to_read = getDetails(element, ['mins_to_read'] , keyString); 
            parsedMemory.nid = getDetails(element, ['nid'] , keyString); 
            parsedMemory.season = getDetails(element, ['season'] , keyString); 
            parsedMemory.share_count = getDetails(element, ['share_count'] , keyInt); 
            parsedMemory.title = getDetails(element, ['title'] , keyString); 
            parsedMemory.type = getDetails(element, ['type'] , keyString); 
            parsedMemory.updated = getDetails(element, ['updated'] , keyString); 
            parsedMemory.user_details = getDetails(element, ['user_details'] , keyObject); 
            parsedMemory.images = getDetails(element, ['images'] , keyArray); 
            parsedMemory.pdf = getDetails(element, ['pdf'] , keyArray); 
            parsedMemory.audios = getDetails(element, ['audios'] , keyArray);   
            parsedMemory.season =  getDetails(element, ['season'] , keyString);      
            if(element.like_comment_data.like_count != undefined && element.like_comment_data.like_count != null){
                parsedMemory.showLikeCount = true;
            } else{
                parsedMemory.showLikeCount = false;
            }
            parsedMemory.memory_date = Utility.dateObjectToDefaultFormat(new Date(parseInt(getDetails(parsedMemory, ["memory_date"])) * 1000));                    
            if(parsedMemory.season && parsedMemory.season.trim().length > 0){
                let season = parsedMemory.season.trim();
                parsedMemory.memory_date = Utility.dateAccordingToFormat(""+parsedMemory.memory_date, "Y");  
                parsedMemory.memory_date = season.charAt(0).toUpperCase() + season.slice(1) + " " + parsedMemory.memory_date;
            } else{
                parsedMemory.memory_date = Utility.dateAccordingToFormat(""+parsedMemory.memory_date, "M Y");
            }
            if (parsedMemory.location){
                parsedMemory.dateWithLocation = parsedMemory.memory_date+", " + parsedMemory.location
            }
            
            const regex = /(<([^>]+)>)/ig;
            parsedMemory.description = parsedMemory.description.replace(regex, '');
            memories.push(parsedMemory);
        });
        return memories;
  }
 
  static getUserObj = (memoryDetails: any) =>{
        let userDetails : any = {}
        if(Account.selectedData().userID!=memoryDetails.user_details.uid){
            let first_name = getDetails(memoryDetails, ["user_details", "field_first_name_value"]);
            let last_name = getDetails(memoryDetails, ["user_details", "field_last_name_value"]);
            userDetails.name =   first_name + " " + last_name;
        }
        else{
            userDetails.name = "You"
        }
        userDetails.createdOn = parseInt(getDetails(memoryDetails, ["updated"], keyInt));                    
        userDetails.createdOn = Utility.timeDuration(""+userDetails.createdOn, "M d, Y");
        let uriPic = getDetails(memoryDetails, ["user_details", "uri"]);
        userDetails.userProfilePic = Utility.getFileURLFromPublicURL(uriPic);                        
        if(userDetails.userProfilePic != profile_placeholder){
            userDetails.isProfileAvailable = true;
        }
        return userDetails;
  }
}