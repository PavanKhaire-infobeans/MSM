import {Account} from './../../../../src/common/loginStore';
import {
  getValue,
  getDetails,
  keyInt,
  keyArray,
  TimeStampMilliSeconds,
} from './../../../../src/common/constants';
import Utility from './../../../../src/common/utility';
import { months } from '../../../../src/views/createMemory';
// import {months} from '../../createMemory';
var memoryDraftsArray: any[] = [];
var data_count = 0;
export class MemoryDraftsDataModel {
  constructor() {
    memoryDraftsArray = [];
  }
  // updates value in profile data
  updateMemoryDraftDetails(memoryDraftDetails: any, shouldReplace: boolean) {
    this.updateMemoryDraftObj(memoryDraftDetails, shouldReplace);
  }

  updateMemoryDraftObj(memoryDraftDetails: any, shouldReplace: boolean) {
    if (shouldReplace) {
      memoryDraftsArray.length = 0;
    }
    data_count = getDetails(memoryDraftDetails, ['data_count'], keyInt);
    getDetails(memoryDraftDetails, ['data'], keyArray).forEach(
      (element: any) => {
        let memoryDraft: any = {};
        memoryDraft.activity = getDetails(element, ['activity']);
        memoryDraft.attachment_count = getDetails(
          element,
          ['attachment_count'],
          keyInt,
        );
        memoryDraft.changed = Utility.dateObjectToDefaultFormat(
          new Date(parseInt(getDetails(element, ['changed'])) * 1000),
        );
        memoryDraft.collaborators = getDetails(
          element,
          ['collaborators'],
          keyArray,
        );

        memoryDraft.created = parseInt(getDetails(element, ['created']));
        memoryDraft.created = Utility.timeDuration(
          '' + memoryDraft.created,
          'M d, Y',
        );

        memoryDraft.field_is_draft_value = getDetails(element, [
          'field_is_draft_value',
        ]);
        memoryDraft.image_path = getDetails(element, ['image_path']);
        memoryDraft.my_chat_count = getDetails(
          element,
          ['my_chat_count'],
          keyInt,
        );
        memoryDraft.new_attachment_count = getDetails(element, [
          'new_attachment_count',
        ]);
        memoryDraft.new_collaborator_count = getDetails(
          element,
          ['new_collaborator_count'],
          keyInt,
        );
        memoryDraft.nid = getDetails(element, ['nid']);
        memoryDraft.title = getDetails(element, ['title']);
        memoryDraft.unread_chat_count = getDetails(element, [
          'unread_chat_count',
        ]);
        memoryDraft.journal_name = getDetails(element, ['journal_name']);

        if (Account.selectedData().userID != element.uid) {
          let first_name = getDetails(element.user_details, [
            'field_first_name_value',
          ]);
          let last_name = getDetails(element.user_details, [
            'field_last_name_value',
          ]);
          memoryDraft.name = first_name + ' ' + last_name;
        } else {
          memoryDraft.name = 'You';
        }
        memoryDraft.userProfilePic = '';
        let uri = getDetails(element.user_details, ['uri']);
        if (uri != undefined && uri != null && uri.trim().length != 0) {
          memoryDraft.userProfilePic = element.user_details['uri']
            ? Utility.getFileURLFromPublicURL(uri)
            : '';
        }
        memoryDraft.uid = parseInt(getDetails(element, ['uid']));
        memoryDraftsArray.push(memoryDraft);
      },
    );
  }
  getMemoryDrafts = () => {
    return memoryDraftsArray;
  };
  getMemoryDraftsCount = () => {
    return data_count;
  };
  decreaseMemoryDraftCount = () => {
    if (data_count > 0) {
      data_count--;
    }
  };
  getEditContentObject(draftDetails: any) {
    const regex = /(<([^>]+)>)/gi;
    let description = getDetails(draftDetails, ['description']);
    description = description.replace(regex, '');
    let date: any = {year: 'Year*', month: 'Month*', day: 'Day'}; // memory_date, season
    let season = getDetails(draftDetails, ['season']).trim();
    let memoryDate = new Date(
      parseInt(getDetails(draftDetails, ['memory_date'])) * 1000,
    );
    if (season && season.trim().length > 0) {
      date.year = memoryDate.getFullYear();
      date.month = season.charAt(0).toUpperCase() + season.slice(1);
    } else {
      date.year = memoryDate.getFullYear();
      date.month = months[memoryDate.getMonth()].name;
      date.day = memoryDate.getDate();
    }
    let tags = getDetails(draftDetails, ['memory_tags']).map(
      (element: any, index: any) => {
        return {tid: TimeStampMilliSeconds() + index, name: element};
      },
    );
    let shareOption =
      getDetails(draftDetails, ['share_option_value']).length > 0
        ? getDetails(draftDetails, ['share_option_value'])
        : 'allfriends';
    let images: any = [];
    getDetails(draftDetails, ['images'], keyArray).forEach((element: any) => {
      images.push({...element, type: 'images'});
    });
    let audios: any = [];
    getDetails(draftDetails, ['audios'], keyArray).forEach((element: any) => {
      audios.push({...element, type: 'audios'});
    });
    let pdf: any = [];
    getDetails(draftDetails, ['pdf'], keyArray).forEach((element: any) => {
      pdf.push({...element, type: 'files'});
    });
    let whoElseWhereThere = getDetails(
      draftDetails,
      ['who_else_was_there'],
      keyArray,
    );
    let youWhereThere = whoElseWhereThere.some(
      (element: any) => element.uid === Account.selectedData().userID,
    );
    let taggedCount = youWhereThere
      ? whoElseWhereThere.length - 1
      : whoElseWhereThere.length;
    let etherpad_details = getDetails(draftDetails, ['etherpad_details']);
    let collaboratorsGroups = getDetails(
      draftDetails,
      ['collaborators', 'groups'],
      keyArray,
    );
    let collaboratorsUsers = getDetails(
      draftDetails,
      ['collaborators', 'users'],
      keyArray,
    );
    let details: any = {
      isCreatedByUser: getDetails(draftDetails, ['user_details']),
      etherpad_details: {
        padId: getValue(etherpad_details, ['padid']),
        padUrl: getValue(etherpad_details, ['etherpad_url']),
        sessionId: getValue(etherpad_details, ['sessionId']),
      },
      title: getDetails(draftDetails, ['title']),
      description: description,
      date: date,
      locationList: [],
      taggedCount: taggedCount,
      location: {description: getDetails(draftDetails, ['location'])},
      tags: tags,
      recentTags: [],
      whoElseWhereThere: whoElseWhereThere,
      whoCanSeeMemoryUids:
        shareOption == 'custom'
          ? getDetails(draftDetails, ['share_users'], keyArray)
          : [],
      whoCanSeeMemoryGroupIds:
        shareOption == 'custom'
          ? getDetails(draftDetails, ['share_groups'], keyArray)
          : [],
      shareOption: shareOption,
      files: images.concat(audios.concat(pdf)),
      collectionList: [],
      collections: getDetails(draftDetails, ['collections']),
      collection: {
        name: getDetails(draftDetails, ['collection_name']),
        tid: getDetails(draftDetails, ['collection_tid']),
      },
      collection_tid: {},
      searchList: [],
      collaborators: collaboratorsUsers.concat(collaboratorsGroups),
      collaboratorOwner: getDetails(draftDetails, ['collaborators', 'owner']),
      nid: getDetails(draftDetails, ['nid']),
      notesToCollaborators: getDetails(draftDetails, ['notes_to_collaborator']),
      deleteFiles: [],
      youWhereThere: youWhereThere,
    };
    return details;
  }
}
