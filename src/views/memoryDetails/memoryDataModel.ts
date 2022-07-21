import { getValue, getDetails, keyInt, keyString, keyArray, keyObject } from "../../common/constants";
import Utility from '../../common/utility';
import { Account } from "../../common/loginStore";
import { profile_placeholder } from "../../images";
import { any } from "prop-types";
import { Alert } from "react-native";

export const kNews = "news";
export const kSports = "sports";
export const kBooks = "books";
export const kTvShows = "tvshows";
export const kMovies = "movies";
export class MemoryDataModel {    
    userDetails : any = {
        name : "",
        createdOn : "",
        userProfilePic : profile_placeholder,
        isProfileAvailable : false,
        viewCount: 0,
        uid : ""
    };
    shareOption : any = {
        available : false,
        shareText : "",
        color : ""
    }
    actions_on_memory: any = {}                
    memoryTags: any = [];
    nid : 0;
    memory : any = {
        memoryTitle : "",
        memoryDate : "",
        memoryPlace : "",       
        memoryReadTime : "",
        collaborators : [],
        whoElseWasThere: [],
        youWhereThere: false,
        description: "", 
    }
    collection_list : any = {
    }
    spotify_url : any = ""
    likesComments : any = {
        noOfLikes : 0,
        noOfComments : 0,
        isLikedByUser : 0,
        likesList : [],
        commentsList : [],
        showLikeCount : true
    }
    files : any = {
        images : [],
        audios : [],
        pdf: []
    }
    externalQueue : any = {
        collection : { 
            nid: 0,
            title : "",
            date : "",
            image : any,
            description : "",            
            details : [],
            likesComments : {},
            memoryTags : []},
        collectionTitle : "",
        collectionType : "",
        
    }
    constructor() {
    }

    // updates value in profile data 
    updateMemoryDetails(memoryDetails: any) {
        this.nid = getDetails(memoryDetails, ["nid"], keyInt);
        this.updateUserObj(memoryDetails);
        {memoryDetails["type"].indexOf("collection") != -1 ? 
        this.updateExternalQueue(memoryDetails)
        :
        
        this.updateMemoryObj(memoryDetails);
        this.updateFilesObj(memoryDetails);
        this.updateShareObj(memoryDetails)
        }
        this.updateLikesAndComments(memoryDetails);
        if(memoryDetails["type"].indexOf("song")!= -1){
            this.spotify_url = getDetails(memoryDetails, ["api_url"]);
        }
    }    

    updateShareObj(memoryDetails: any){
        this.shareOption.available = memoryDetails.share_option_value ? true : false;
        let shareValue = getDetails(memoryDetails, ["share_option_value"], keyString);
        switch(shareValue){
            case "only_me" : this.shareOption.shareText = 'Shared only with me';
                             this.shareOption.color = "#50B660";
                    break;
            case "only_me" :
            case "allfriends" :
            case "custom" : let share_count = getDetails(memoryDetails, ["share_count"], keyInt);
                            this.shareOption.shareText = 'Shared with ' + share_count + (share_count > 1 ? " members": " member");
                            this.shareOption.color = "#0077B2" ;
                    break;        
            case "cueback" : this.shareOption.shareText = 'Public';//Shared with 
                             this.shareOption.color = "#BE6767";
                    break;
        }
    }
    
    updateExternalQueue(memoryDetails: any){
        this.actions_on_memory = getDetails(memoryDetails, ["actions_on_memory"],keyObject)
        this.externalQueue.collectionTitle = "From "+getDetails(memoryDetails, ["title"]);  
        let type = getDetails(memoryDetails, ["type"]);
        if(type.indexOf("news")!=-1){
            this.externalQueue.collectionType = kNews;
        }      
        else if(type.indexOf("sport")!=-1){
            this.externalQueue.collectionType = kSports;
        }      
        else if(type.indexOf("movie")!=-1){
            this.externalQueue.collectionType = kMovies;
        }      
        else if(type.indexOf("book")!=-1){
            this.externalQueue.collectionType = kBooks;
        }      
        else if(type.indexOf("tv")!=-1){
            this.externalQueue.collectionType = kTvShows;
        }      
        this.externalQueue.showDetails = getDetails(memoryDetails, ["type"]).indexOf("news") != -1 ? false : true;  
        let collection = getDetails(memoryDetails, ["collection"], keyArray);   
        this.externalQueue.collection=[];
        collection.forEach((element: any) => {
            let year = Utility.dateAccordingToFormat(""+Utility.dateObjectToDefaultFormat(new Date(parseInt(getDetails(element, ["memory_year"])) * 1000)), "Y");
            let yearObject =  {title : "Year", value : year ? year : "None"};
            let actorAuthor = (getDetails(memoryDetails, ["type"]).indexOf("book") != -1 ? "Author" : "Actor")            
            let authorActorObject =  {title : actorAuthor , value : this.getCommaSeparatedArray(getDetails(element, ["actors"], keyArray))};
            let genreObject = {title : "Genre", value : this.getCommaSeparatedArray(getDetails(element, ["genre"], keyArray))}
            let languageObject = {title : "Language", value : getDetails(element, ["language"]).length > 0 ? getDetails(element, ["language"]) : "None"}
            let countryObject = {title : "Country", value : this.getCommaSeparatedArray(getDetails(element, ["country"], keyArray))}
            let collectionItem = { nid : getDetails(element, ["nid"], keyInt),
                                   title : getDetails(element, ["title"]),            
                                   date : Utility.dateAccordingToFormat(""+Utility.dateObjectToDefaultFormat(new Date(parseInt(getDetails(element, ["memory_year"])) * 1000)), "M d, Y"),
                                   image : getDetails(element, ["image"]),
                                   description : getDetails(element, ["description"]),            
                                   details : this.externalQueue.collectionType == kSports ? [yearObject, countryObject] : [yearObject, authorActorObject, genreObject, languageObject, countryObject],
                                   memoryTags : getDetails(element, ["tags"], keyArray),
                                   likesComments : {noOfLikes : getDetails(element, ["like_data", ["like_count"]], keyInt),
                                                    noOfComments : getDetails(element, ["comments_count"], keyInt),   
                                                    isLikedByUser : getDetails(element, ["like_data", ["like_flag"]], keyInt),
                                                    likesList : getDetails(element, ["likes"], keyArray),
                                                    commentsList : getDetails(element, ["comments"], keyArray).reverse()}
            }
            this.externalQueue.collection.push(collectionItem);
        });
    }

    getCommaSeparatedArray=(arrayItems : any)=>{
        if(arrayItems.length>0){
            return arrayItems.join(', ');
        }
        return "None"
    }
    updateUserObj(memoryDetails: any){
        if(Account.selectedData().userID!=memoryDetails.user_details.uid){
            let first_name = getDetails(memoryDetails, ["user_details", "field_first_name_value"]);
            let last_name = getDetails(memoryDetails, ["user_details", "field_last_name_value"]);
            this.userDetails.name =   first_name + " " + last_name;
        }
        else{
            this.userDetails.name = "You"
        }
        this.userDetails.uid = getDetails(memoryDetails, ["user_details", "uid"]);
        this.userDetails.createdOn = parseInt(getDetails(memoryDetails, ["updated"], keyInt));                    
        this.userDetails.createdOn = Utility.timeDuration(""+this.userDetails.createdOn, "M d, Y");
        this.userDetails.viewCount = getDetails(memoryDetails, ["view_count"], keyInt)
        let uriPic = getDetails(memoryDetails, ["user_details", "uri"]);
        this.userDetails.userProfilePic = (uriPic != "" ? Utility.getFileURLFromPublicURL(uriPic) : profile_placeholder);                        
        if(this.userDetails.userProfilePic != profile_placeholder){
            this.userDetails.isProfileAvailable = true;
        }
        this.memoryTags = getDetails(memoryDetails, ["memory_tags"], keyArray);    
    }

    updateMemoryObj(memoryDetails: any){
        this.actions_on_memory = getDetails(memoryDetails, ["actions_on_memory"],keyObject)
        this.memory.memoryTitle = getDetails(memoryDetails, ["title"]);        
        this.memory.memoryDate = Utility.dateObjectToDefaultFormat(new Date(parseInt(getDetails(memoryDetails, ["memory_date"])) * 1000));                    
        if(memoryDetails.season && memoryDetails.season.trim().length > 0){
            let season = memoryDetails.season.trim();
            this.memory.memoryDate = Utility.dateAccordingToFormat(""+this.memory.memoryDate, "Y");  
            this.memory.memoryDate = season.charAt(0).toUpperCase() + season.slice(1) + " " + this.memory.memoryDate;
        } else{
            this.memory.memoryDate = Utility.dateAccordingToFormat(""+this.memory.memoryDate, "M Y");
        }
        this.memory.memoryPlace = getDetails(memoryDetails, ["location"]);        
        this.memory.memoryReadTime = getDetails(memoryDetails, ["mins_to_read"], keyInt);        
        if(this.memory.memoryReadTime.length > 0){
            this.memory.memoryReadTime = "< " + this.memory.memoryReadTime;
        }
        this.memory.collaborators = [];
        getDetails(memoryDetails, ["collaborators"], keyArray).forEach((element : any) => {
            let collaborator = {name : element.field_first_name_value + " " + element.field_last_name_value,
                                uri : element.uri? Utility.getFileURLFromPublicURL(element.uri): "",
                                backgroundColor : getDetails(memoryDetails, ["author_color_mapping", parseInt(element.uid)])}
            this.memory.collaborators.push(collaborator);
        });
        //this.memory.collaborators = ["Test","Testing"]       
        this.memory.whoElseWasThere = getDetails(memoryDetails, ["who_else_was_there"], keyArray);    
        this.memory.whoElseWasThere.forEach((element : any, index : any) => {
            if(element.uid == Account.selectedData().userID){
                this.memory.youWhereThere = true;
                this.memory.whoElseWasThere.splice(index, 1);
            }
        });  
        this.memory.description = getDetails(memoryDetails, ["description"]);             
        if(getDetails(memoryDetails, ["collection_list"],keyArray).length > 0){
            this.updateCollectionData(memoryDetails);
        }
    }

    updateCollectionData(memoryDetails : any){
        let collectionList = getDetails(memoryDetails, ["collection_list"],keyArray);
        this.collection_list = [];
        collectionList.forEach((element : any) => {
            let collection : any = {};
            collection.name = element.collection_name;
            collection.tid = element.collection_tid;
            collection.user = element.collection_user_details;
            collection.memories = [];
            element.collection_memories.forEach((element: any) => {
                let memory = { likeCount : getDetails(element, ["count_data", "like_count"], keyInt),
                commentCount : getDetails(element, ["count_data", "comment_count"], keyInt),
                whoElseWasThere :  getDetails(element, ["who_else_was_there"], keyArray),                           
                nid : getDetails(element, ["nid"], keyInt),
                type : "my_stories",
                youWhereThere : false,
                title : getDetails(element, ["title"]),
                location : getDetails(element, ["location"]),
                date : getDetails(element, ["memory_date"]),
                uri : getDetails(element, ["uri"])}
                memory.whoElseWasThere.forEach((element:any, index: any) => {
                    if(element. uid == Account.selectedData().userID){
                        memory.youWhereThere = true;
                            memory.whoElseWasThere.splice(index, 1);
                        }
                });
                // if(!(getDetails(element, ["nid"], keyInt) == getDetails(memoryDetails, ["nid"], keyInt) && memorycollection.length > 1)){
                collection.memories.push(memory);
                // }
            });
            this.collection_list.push(collection);
        });    
    }

    updateLikesAndComments(memoryDetails: any){         
        if(memoryDetails["type"].indexOf("collection") != -1){
            this.nid = this.externalQueue.collection[0].nid;
            this.likesComments = this.externalQueue.collection[0].likesComments;
        }
        else{
            this.likesComments.noOfComments = getDetails(memoryDetails, ["comments_count"], keyInt);
            this.likesComments.noOfLikes = getDetails(memoryDetails, ["like_comment_data", "like_count"], keyInt);
            this.likesComments.isLikedByUser = getDetails(memoryDetails, ["like_comment_data", "like_flag"], keyInt);
            this.likesComments.commentsList = getDetails(memoryDetails, ["comments"], keyArray);
            this.likesComments.commentsList.reverse();        
            if(memoryDetails.like_comment_data.like_count != undefined && memoryDetails.like_comment_data.like_count != null){
                this.likesComments.showLikeCount = true;
            } else{
                this.likesComments.showLikeCount = false;
            }
        }    
    }

    updateFilesObj(memoryDetails: any){
        this.files.images= getDetails(memoryDetails, ["images"], keyArray);    
        this.files.audios= getDetails(memoryDetails, ["audios"], keyArray);    
        this.files.pdf= getDetails(memoryDetails, ["pdf"], keyArray);    
    }
    
}