import {
  getDetails, keyArray, keyInt, keyObject, keyString
} from '../../../common/constants';
import { Account } from '../../../common/loginStore';
import Utility from '../../../common/utility';
import { profile_placeholder } from '../../../images';

var publishedMemoriesArray: any[] = [];
var data_count = 0;
export class PublishedMemoryDataModel {
  constructor() {
    publishedMemoriesArray = [];
  }

  setPublishedMemoriesDetails(publishedMemories: any, shouldReplace: boolean) {
    if (shouldReplace) {
      publishedMemoriesArray.length = 0;
    }
    data_count = getDetails(publishedMemories, ['count'], keyInt);
    getDetails(publishedMemories, ['data'], keyArray).forEach(
      (element: any) => {
        let publishedMemory: any = {};
        publishedMemory.actions_on_memory = getDetails(
          element,
          ['actions_on_memory'],
          keyObject,
        );
        publishedMemory.comments_count = getDetails(
          element,
          ['comments_count'],
          keyString,
        );
        publishedMemory.created = parseInt(
          getDetails(element, ['created'], keyInt),
        );
        publishedMemory.description = getDetails(
          element,
          ['description'],
          keyString,
        );
        publishedMemory.noOfComments = getDetails(
          element,
          ['comments_count'],
          keyInt,
        );
        publishedMemory.noOfLikes = getDetails(
          element,
          ['like_comment_data', 'like_count'],
          keyInt,
        );
        publishedMemory.viewCount = getDetails(element, ['view_count'], keyInt);
        publishedMemory.isLikedByUser = getDetails(
          element,
          ['like_comment_data', 'like_flag'],
          keyInt,
        );
        publishedMemory.location = getDetails(element, ['location'], keyString);
        publishedMemory.memory_date = getDetails(
          element,
          ['memory_date'],
          keyString,
        );
        publishedMemory.mins_to_read = getDetails(
          element,
          ['mins_to_read'],
          keyString,
        );
        publishedMemory.nid = getDetails(element, ['nid'], keyString);
        publishedMemory.season = getDetails(element, ['season'], keyString);
        publishedMemory.share_count = getDetails(
          element,
          ['share_count'],
          keyInt,
        );
        publishedMemory.title = getDetails(element, ['title'], keyString);
        publishedMemory.type = getDetails(element, ['type'], keyString);
        publishedMemory.updated = getDetails(element, ['updated'], keyString);
        publishedMemory.user_details = getDetails(
          element,
          ['user_details'],
          keyObject,
        );
        publishedMemory.images = getDetails(element, ['images'], keyArray);
        publishedMemory.pdf = getDetails(element, ['pdf'], keyArray);
        publishedMemory.audios = getDetails(element, ['audios'], keyArray);
        publishedMemory.season = getDetails(element, ['season'], keyString);
        if (
          element.like_comment_data.like_count != undefined &&
          element.like_comment_data.like_count != null
        ) {
          publishedMemory.showLikeCount = true;
        } else {
          publishedMemory.showLikeCount = false;
        }
        publishedMemory.memory_date = Utility.dateObjectToDefaultFormat(
          new Date(
            parseInt(getDetails(publishedMemory, ['memory_date'])) * 1000,
          ),
        );
        if (
          publishedMemory.season &&
          publishedMemory.season.trim().length > 0
        ) {
          let season = publishedMemory.season.trim();
          publishedMemory.memory_date = Utility.dateAccordingToFormat(
            '' + publishedMemory.memory_date,
            'Y',
          );
          publishedMemory.memory_date =
            season.charAt(0).toUpperCase() +
            season.slice(1) +
            ' ' +
            publishedMemory.memory_date;
        } else {
          publishedMemory.memory_date = Utility.dateAccordingToFormat(
            '' + publishedMemory.memory_date,
            'M Y',
          );
        }
        if (publishedMemory.location) {
          publishedMemory.dateWithLocation =
            publishedMemory.memory_date + ', ' + publishedMemory.location;
        }

        const regex = /(<([^>]+)>)/gi;
        publishedMemory.description = publishedMemory.description.replace(
          regex,
          '',
        );
        publishedMemoriesArray.push(publishedMemory);
      },
    );
  }
  static getUserObj = (memoryDetails: any) => {
    let userDetails: any = {};
    if (Account.selectedData().userID != memoryDetails.user_details.uid) {
      let first_name = getDetails(memoryDetails, [
        'user_details',
        'field_first_name_value',
      ]);
      let last_name = getDetails(memoryDetails, [
        'user_details',
        'field_last_name_value',
      ]);
      userDetails.name = first_name + ' ' + last_name;
    } else {
      userDetails.name = 'You';
    }
    userDetails.createdOn = parseInt(
      getDetails(memoryDetails, ['updated'], keyInt),
    );
    userDetails.createdOn = Utility.timeDuration(
      '' + userDetails.createdOn,
      'M d, Y',
    );
    let uriPic = getDetails(memoryDetails, ['user_details', 'uri']);
    userDetails.userProfilePic = Utility.getFileURLFromPublicURL(uriPic);
    if (userDetails.userProfilePic != profile_placeholder) {
      userDetails.isProfileAvailable = true;
    }
    return userDetails;
  };
  updatePublishedMemories = (publishedMemories: any) => {
    publishedMemoriesArray = publishedMemories;
  };
  getPublishedMemories = () => {
    return publishedMemoriesArray;
  };
  getMemoriesCount = () => {
    return data_count;
  };
}
