import {
  decode_utf8, getDetails, keyInt, keyString
} from '../../common/constants';
import Utility from '../../common/utility';

export class NotificationDataModel {
  getNotificationDetails(activities: any, isActivity: any) {
    let activityList: any = [];
    activities.forEach((item: any) => {
      let activity: any = {};
      var userArray = getDetails(item, ['from_uid'], keyString);
      userArray = userArray.split(',');
      userArray = [...new Set(userArray)];
      let userCount = userArray.length;
      switch (getDetails(item, ['flag_title'], keyString)) {
        case 'all_ok':
          activity.isDisabled = false;
          break;
        case 'memory_published':
          item.notification_title == 'collaboration_invite'
            ? (activity.isDisabled = true)
            : (activity.isDisabled = false);
          activity.errorMsg =
            'This memory is no longer available for collaboration';
          break;
        case 'memory_move_to_draft':
          item.notification_title == 'collaboration_join'
            ? (activity.isDisabled = false)
            : (activity.isDisabled = true);
          activity.errorMsg = 'This memory has been moved to draft';
          break;
        case 'memory_deleted':
          activity.isDisabled = true;
          activity.errorMsg = 'This memory is no longer available';
          break;
        case 'comment_deleted':
          activity.isDisabled = true;
          activity.errorMsg = 'This comment is no longer available';
          break;
        case 'memory_undeleted':
          activity.isDisabled = false;
          break;
        case 'collaborator_removed_left':
          item.notification_title == 'collaboration_invite'
            ? (activity.isDisabled = true)
            : (activity.isDisabled = false);
          activity.errorMsg =
            'This memory is no longer available for collaboration';
          break;
        case 'memory_blocked':
          activity.isDisabled = true;
          activity.errorMsg = 'This memory has been blocked';
          break;
      }
      let title = decode_utf8(getDetails(item, ['title'], keyString));
      title = title.replace(/\n/g, ' ');
      activity = {
        ...activity,
        userProfile: getDetails(
          item,
          ['from_user_data', 'thumbnail90'],
          keyString,
        ),
        displayName:
          getDetails(
            item,
            ['from_user_data', 'field_first_name_value'],
            keyString,
          ) +
          ' ' +
          getDetails(
            item,
            ['from_user_data', 'field_last_name_value'],
            keyString,
          ),
        title: title,
        status: getDetails(item, ['status'], keyInt),
        ids: getDetails(item, ['ids'], keyString),
        nid: getDetails(item, ['nid'], keyString),
        notificationId: getDetails(item, ['notification_id'], keyString),
        unreadFlag:
          getDetails(item, ['unread_status'], keyString) == '1' ? true : false,
        date: Utility.timeDuration(item.created, 'M d, Y, t'),
        notificationType: getDetails(item, ['notification_title'], keyString),
        noteToCollaborator: getDetails(
          item,
          ['notes_to_collaborator'],
          keyString,
        ),
        descriptionText: this.getDescriptionText(item),
        isJoinInvite: item.notification_title == 'collaboration_invite',
        userCount: userCount,
        fromUid: getDetails(item, ['from_uid'], keyString),
        type: getDetails(item, ['type'], keyString),
      };
      if (!isActivity) {
        activity.displayName =
          activity.displayName +
          (userCount > 1
            ? ' and ' + (userCount - 1) + (userCount > 2 ? ' others' : ' other')
            : '');
      }
      activityList.push(activity);
    });
    return activityList;
  }

  isPartOfActivity(item: any) {
    let notificationType = item.notificationType.trim();
    return (
      notificationType == 'my_memory_comment' ||
      notificationType == 'my_memory_like' ||
      notificationType == 'collaboration_invite' ||
      notificationType == 'collaboration_join' ||
      notificationType == 'collaborative_memory_like' ||
      notificationType == 'collaborative_memory_comment' ||
      notificationType == 'memory_draft_to_publish' ||
      notificationType == 'collaboration_reinvite'
    );
  }

  getGroupId(notificationType: any) {
    switch (notificationType) {
      case 'friend_request_sent':
        return 1;
      case 'friend_request_accept':
        return 1;
      case 'user_message':
        return 0;
      case 'everyone_memory':
        return 2;
      case 'shared_memory':
        return 2;
      case 'internal_cue':
        return 2;
      case 'external_cue':
        return 2;
      case 'my_memory_comment':
        return 2;
      case 'my_memory_like':
        return 2;
      case 'who_else_was_there':
        return 2;
      case 'collaboration_invite':
        return 3;
      case 'collaboration_reinvite':
        return 3;
      case 'prompt_answer':
        return 0;
      case 'collaboration_join':
        return 3;
      case 'new_chats':
        return 3;
      case 'new_edits':
        return 3;
      case 'new_edits_collaborators':
        return 3;
      case 'my_memory_comment_like':
        return 2;
      case 'my_memory_file_like':
        return 2;
      case 'internal_cue_comment':
        return 2;
      case 'external_cue_comment':
        return 2;
      case 'other_memory_comment_like':
        return 2;
      case 'other_memory_file_like':
        return 2;
      case 'other_memory_comment':
        return 2;
      case 'other_memory_like':
        return 2;
      case 'collaborative_memory_like':
        return 2;
      case 'collaborative_memory_comment_like':
        return 2;
      case 'collaborative_memory_file_like':
        return 2;
      case 'my_comment_like':
        return 2;
      case 'collaborative_memory_comment':
        return 2;
      case 'memory_draft_to_publish':
        return 2;
    }
  }

  getDescriptionText(item: any) {
    switch (item.notification_title) {
      case 'friend_request_sent':
        return 'sent you a friend request';
      case 'friend_request_accept':
        return 'accepted your friend request';
      case 'user_message':
        return 'sent you a message';
      case 'everyone_memory':
        return 'published a memory';
      case 'shared_memory':
        return '';
      case 'internal_cue':
        return 'shared a memory';
      case 'external_cue':
        return 'shared a memory';
      case 'my_memory_comment':
        return 'commented on your memory';
      case 'my_memory_like':
        return 'liked your memory';
      case 'who_else_was_there':
        return 'tagged you in';
      case 'collaboration_invite':
        return 'has invited you to collaborate on his memory';
      case 'prompt_answer':
        return '';
      case 'collaboration_join':
        return 'joined your collaborative memory';
      case 'collaboration_reinvite':
        return 'has reinvited you to collaborate on his memory';
      case 'new_chats':
        return '';
      case 'new_edits':
        return 'has edited your memory';
      case 'new_edits_collaborators':
        return 'has edited your memory';
      case 'my_memory_comment_like':
        return 'liked comment on';
      case 'my_memory_file_like':
        return 'liked your file in';
      case 'internal_cue_comment':
        return 'commented on';
      case 'external_cue_comment':
        return 'commented on';
      case 'other_memory_comment_like':
        return 'liked comment on';
      case 'other_memory_file_like':
        return 'liked file in';
      case 'other_memory_comment':
        return 'commented on memory';
      case 'other_memory_like':
        return 'liked a memory';
      case 'collaborative_memory_like':
        return 'liked a memory';
      case 'collaborative_memory_comment_like':
        return 'liked comment on';
      case 'collaborative_memory_file_like':
        return 'liked file in';
      case 'my_comment_like':
        return 'liked your comment on';
      case 'collaborative_memory_comment':
        return 'commented on memory';
      case 'memory_draft_to_publish':
        return 'published a memory';
      case 'prompt_of_the_week_email':
        return 'prompt notification';
    }
  }
}
