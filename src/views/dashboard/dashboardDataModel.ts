import moment from 'moment';
import { getDetails, keyArray, keyInt, keyObject, keyString } from "../../common/constants";
import { Account } from '../../common/loginStore';
import Utility from '../../common/utility';
import { profile_placeholder } from '../../images';

export class DashboardDataModel {
    static getConvertedData = (memory: any) => {
        let memories: any = [];
        if (memory == undefined || memory == null)
            return []
        memory.forEach((element: any) => {
            let parsedMemory: any = {};
            parsedMemory.api_url = getDetails(element, ['api_url'], keyArray);
            parsedMemory.collection = getDetails(element, ['collection'], keyArray);
            parsedMemory.actions_on_memory = getDetails(element, ['actions_on_memory'], keyObject);
            parsedMemory.comments_count = getDetails(element, ['comments_count'], keyString);
            parsedMemory.created = getDetails(element, ['created'], keyString);
            parsedMemory.description = getDetails(element, ['description'], keyString);//.trim(); 
            parsedMemory.noOfComments = getDetails(element, ["comments_count"], keyInt);
            parsedMemory.noOfLikes = getDetails(element, ["like_comment_data", "like_count"], keyInt);
            parsedMemory.viewCount = getDetails(element, ["view_count"], keyInt);
            parsedMemory.isLikedByUser = getDetails(element, ["like_comment_data", "like_flag"], keyInt);
            parsedMemory.location = getDetails(element, ['location'], keyString);
            parsedMemory.memoryDate = getDetails(element, ['memory_date'], keyString);
            parsedMemory.memory_date = getDetails(element, ['memory_date'], keyString);
            parsedMemory.memory_url = getDetails(element, ['memory_url'], keyString);
            parsedMemory.mins_to_read = getDetails(element, ['mins_to_read'], keyString);
            parsedMemory.nid = getDetails(element, ['nid'], keyString);
            parsedMemory.season = getDetails(element, ['season'], keyString);
            parsedMemory.share_count = getDetails(element, ['share_count'], keyInt);
            parsedMemory.share_option_value = getDetails(element, ['share_option_value'], keyString);
            switch (parsedMemory.share_option_value) {
                case "only_me": parsedMemory.shareText = 'Shared only with me';
                    parsedMemory.color = "#50B660";
                    break;
                case "allfriends" || 'custom':
                    parsedMemory.shareText = 'Shared with ' + parsedMemory.share_count + (parsedMemory.share_count > 1 ? " members" : " member");
                    parsedMemory.color = "#0077B2";
                    break;
                case "cueback": parsedMemory.shareText = 'Public';//Shared with 
                    parsedMemory.color = "#BE6767";
                    break;
                default:
                    parsedMemory.shareText = 'Shared with ' + parsedMemory.share_count + (parsedMemory.share_count > 1 ? " members" : " member");
                    parsedMemory.color = "#0077B2";
                    break;

            }
            parsedMemory.title = getDetails(element, ['title'], keyString);
            parsedMemory.type = getDetails(element, ['type'], keyString);
            parsedMemory.updated = getDetails(element, ['updated'], keyString);
            parsedMemory.user_details = getDetails(element, ['user_details'], keyObject);
            parsedMemory.version_data = getDetails(element, ['version_data'], keyObject);
            parsedMemory.images = getDetails(element, ['images'], keyArray);
            parsedMemory.pdf = getDetails(element, ['pdf'], keyArray);
            parsedMemory.audios = getDetails(element, ['audios'], keyArray);
            parsedMemory.season = getDetails(element, ['season'], keyString);
            if (element.like_comment_data.like_count != undefined && element.like_comment_data.like_count != null) {
                parsedMemory.showLikeCount = true;
            } else {
                parsedMemory.showLikeCount = false;
            }
            let memDate = parseInt(getDetails(parsedMemory, ["memory_date"])) * 1000;
            parsedMemory.memory_date = Utility.dateObjectToDefaultFormat(new Date(memDate));
            parsedMemory.memoryDateDisplay = moment(memDate).format('ll');
            console.warn("memoryDate >",parsedMemory.memoryDate)
            parsedMemory.memoryYear = new Date(memDate).getFullYear();
            if (parsedMemory.season && parsedMemory.season.trim().length > 0) {
                let season = parsedMemory.season.trim();
                parsedMemory.memory_date = Utility.dateAccordingToFormat("" + parsedMemory.memory_date, "Y");
                parsedMemory.memory_date = season.charAt(0).toUpperCase() + season.slice(1) + " " + parsedMemory.memory_date;
            } else {
                parsedMemory.memory_date = Utility.dateAccordingToFormat("" + parsedMemory.memory_date, "M Y");
            }
            if (parsedMemory.location) {
                parsedMemory.dateWithLocation = parsedMemory.memory_date + ", " + parsedMemory.location
            }

            if (parsedMemory.version_data && parsedMemory['version_data']['data'] && parsedMemory['version_data']['data'][0] && parsedMemory['version_data']['data'][0]['content']) {
                parsedMemory.memoryDescription = parsedMemory['version_data']['data'][0]['content'];
            }

            // console.warn("parsedMemory.description > ",parsedMemory.description)
            parsedMemory.description = parsedMemory.description.replace(/<\/p><br\/><p>/ig, ' \n \n');
            parsedMemory.description = parsedMemory.description.replace(/<\/p><br><p>/ig, ' \n \n');
            parsedMemory.description = parsedMemory.description.replace(/<\/p><p>/ig, ' \n');
            parsedMemory.description = parsedMemory.description.trim().replace(/<br>/ig, ' \n');
            parsedMemory.description = parsedMemory.description.replace(/<br \/>/ig, ' \n');
            parsedMemory.description = parsedMemory.description.replace(/<br\/>/ig, ' \n');
            parsedMemory.description = parsedMemory.description.replace(/<p>/ig, '');
            parsedMemory.description = parsedMemory.description.replace(/<\/p>/ig, '');
            parsedMemory.description = parsedMemory.description.trim();
            // console.warn("after replace > ",JSON.stringify(parsedMemory.description))
            memories.push(parsedMemory);
        });
        return memories;
    }

    static getUserObj = (memoryDetails: any) => {
        let userDetails: any = {}
        if (Account.selectedData().userID != memoryDetails.user_details.uid) {
            let first_name = getDetails(memoryDetails, ["user_details", "field_first_name_value"]);
            let last_name = getDetails(memoryDetails, ["user_details", "field_last_name_value"]);
            userDetails.name = first_name + " " + last_name;
        }
        else {
            userDetails.name = "You"
        }
        userDetails.createdOn = parseInt(getDetails(memoryDetails, ["updated"], keyInt));
        userDetails.createdOn = Utility.timeDuration("" + userDetails.createdOn, "M d, Y");
        let uriPic = getDetails(memoryDetails, ["user_details", "uri"]);
        userDetails.userProfilePic = Utility.getFileURLFromPublicURL(uriPic);
        if (userDetails.userProfilePic != profile_placeholder) {
            userDetails.isProfileAvailable = true;
        }
        return userDetails;
    }
}