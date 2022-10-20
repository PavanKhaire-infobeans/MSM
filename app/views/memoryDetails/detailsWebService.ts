import { Storage } from './../../../src/common/constants';
import EventManager from './../../../src/common/eventManager';
import { Account } from './../../../src/common/loginStore';
import { MemoryService, newMemoryService } from './../../../src/common/webservice/memoryServices';

export const kMemoryDetailsFetched = 'memoryDetails';
export const kAllLikes = 'allLikesData';
export const kLiked = 'liked';
export const kUnliked = 'unliked';
export const kLikeOnComment = 'likedComment';
export const kUnlikeOnComment = 'unlikedComment';
export const kComment = 'kComment';
export const kAllComment = 'allComments';
export const kDeleteComment = 'deleteComment';
export const kEditComment = 'editComment';
export const GetAllLikes = async (
  nid: any,
  type: string,
  callBackIdentifier: any,
  attr_id?: any,
  nodeType?: any,
) => {
  try {
    let data = await Storage.get('userData');
    let response = await MemoryService(
      `https://${Account.selectedData().instanceURL}/api/get/likes`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {
          details: {
            nid: nid,
            attr_id: attr_id ? attr_id : nid,
            type: type,
            like_type: nodeType ? nodeType : 'node',
          },
        },
      ],
    )
      .then((response: Response) => response.json())
      .catch((err: Error) => {
        Promise.reject(err);
      });

    if (response.ResponseCode == 200) {
      EventManager.callBack(callBackIdentifier, true, response['LikeList']);
    } else {
      EventManager.callBack(
        callBackIdentifier,
        false,
        response['ResponseMessage'],
      );
    }
  } catch (err) {
    EventManager.callBack(
      callBackIdentifier,
      false,
      'Unable to process at this moment, please try again later',
    );
  }
};

export const Like = async (
  nid: any,
  type: string,
  callBackIdentifier: any,
  likeType?: any,
  attr_id?: any,
) => {
  try {
    let data = await Storage.get('userData');
    let response = await MemoryService(
      `https://${Account.selectedData().instanceURL}/api/actions/like`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {
          configurationTimestamp: '0',
          details: {
            nid: nid,
            attr_id: attr_id ? attr_id : nid,
            type: type,
            like_type: likeType ? likeType : 'node',
            to_uid: Account.selectedData().userID,
          },
        },
      ],
    )
      .then((response: Response) => response.json())
      .catch((err: Error) => {
        Promise.reject(err);
      });

    if (response.ResponseCode == 200) {
      EventManager.callBack(
        callBackIdentifier,
        true,
        response['ResponseMessage'],
        nid,
      );
    } else {
      EventManager.callBack(
        callBackIdentifier,
        false,
        response['ResponseMessage'],
        nid,
      );
    }
  } catch (err) {
    EventManager.callBack(
      callBackIdentifier,
      false,
      'Unable to process at this moment, please try again later',
    );
  }
};

export const Unlike = async (
  nid: any,
  type: string,
  callBackIdentifier: any,
  likeType?: any,
  attr_id?: any,
) => {
  try {
    let data = await Storage.get('userData');
    let response = await MemoryService(
      `https://${Account.selectedData().instanceURL}/api/actions/unlike`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {
          configurationTimestamp: '0',
          details: {
            nid: nid,
            attr_id: attr_id ? attr_id : nid,
            type: type,
            like_type: likeType ? likeType : 'node',
            to_uid: Account.selectedData().userID,
          },
        },
      ],
    )
      .then((response: Response) => response.json())
      .catch((err: Error) => {
        Promise.reject(err);
      });

    if (response.ResponseCode == 200) {
      EventManager.callBack(callBackIdentifier, true, response['LikeList']);
    } else {
      EventManager.callBack(
        callBackIdentifier,
        false,
        response['ResponseMessage'],
      );
    }
  } catch (err) {
    EventManager.callBack(
      callBackIdentifier,
      false,
      'Unable to process at this moment, please try again later',
    );
  }
};
export const DeleteComment = async (cid: any, nid: any, type: string) => {
  try {
    let data = await Storage.get('userData');
    let response = await MemoryService(
      `https://${Account.selectedData().instanceURL}/api/actions/comment`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {
          configurationTimestamp: '0',
          details: {
            comment_id: cid,
            type: type,
            action: 'delete',
            nid: nid,
          },
        },
      ],
    )
      .then((response: Response) => response.json())
      .catch((err: Error) => {
        Promise.reject(err);
      });

    if (response.ResponseCode == 200) {
      EventManager.callBack(
        kDeleteComment,
        true,
        response['ResponseMessage'],
        cid,
      );
    } else {
      EventManager.callBack(kDeleteComment, false, response['ResponseMessage']);
    }
  } catch (err) {
    EventManager.callBack(
      kDeleteComment,
      false,
      'Comment cannot be deleted, please try again',
    );
  }
};
export const EditComment = async (
  cid: any,
  nid: any,
  type: string,
  comment: String,
) => {
  try {
    let data = await Storage.get('userData');
    let response = await MemoryService(
      `https://${Account.selectedData().instanceURL}/api/actions/comment`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {
          configurationTimestamp: '0',
          details: {
            comment_id: cid,
            type: type,
            nid: nid,
            comment: comment,
          },
        },
      ],
    )
      .then((response: Response) => response.json())
      .catch((err: Error) => {
        Promise.reject(err);
      });

    if (response.ResponseCode == 200) {
      EventManager.callBack(
        kEditComment,
        true,
        response['ResponseMessage'],
        cid,
      );
    } else {
      EventManager.callBack(kEditComment, false, response['ResponseMessage']);
    }
  } catch (err) {
    EventManager.callBack(
      kEditComment,
      false,
      'Comment cannot be editted, please try again',
    );
  }
};
export const PostComment = async (
  nid: any,
  type: string,
  commentData: string,
  tempCommentId: any,
) => {
  try {
    let data = await Storage.get('userData');
    let response = await MemoryService(
      `https://${Account.selectedData().instanceURL}/api/actions/comment`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {
          configurationTimestamp: '0',
          details: {
            nid: nid,
            type: type,
            comment: commentData,
          },
        },
      ],
    )
      .then((response: Response) => response.json())
      .catch((err: Error) => {
        Promise.reject(err);
      });

    if (response.ResponseCode == 200) {
      EventManager.callBack(
        kComment,
        true,
        response['ResponseMessage'],
        response.Status.comment_id,
        tempCommentId,
      );
    } else {
      EventManager.callBack(kComment, false, response['ResponseMessage']);
    }
  } catch (err) {
    EventManager.callBack(
      kComment,
      false,
      'Comment cannot be added, please try again',
    );
  }
};

export const GetAllComments = async (
  nid: any,
  type: string,
  listCount: string,
  latestComments?: boolean,
) => {
  try {
    let data = await Storage.get('userData');
    let response = await MemoryService(
      `https://${Account.selectedData().instanceURL}/api/get/comments`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {
          configurationTimestamp: '0',
          details: {
            nid: nid,
            type: type,
            limit: listCount,
            offset: 0,
          },
        },
      ],
    )
      .then((response: Response) => response.json())
      .catch((err: Error) => {
        Promise.reject(err);
      });

    if (response.ResponseCode == 200) {
      if (latestComments) {
        EventManager.callBack(kAllComment, true, response['commentList'], true);
      } else {
        EventManager.callBack(kAllComment, true, response['commentList']);
      }
    } else {
      EventManager.callBack(kAllComment, false, response['ResponseMessage']);
    }
  } catch (err) {
    EventManager.callBack(
      kAllComment,
      false,
      'Comment cannot be added, please try again',
    );
  }
};

export const GetMemoryDetails = async (nid: any, type: string,CB: any) => {
  try {
    let data = await Storage.get('userData');
    let response = await newMemoryService(
      `https://${Account.selectedData().instanceURL}/api/timeline/get_memory`,
      [
        {
          'X-CSRF-TOKEN': data.userAuthToken,
          'Content-Type': 'application/json',
        },
        {
          configurationTimestamp: '0',
          memoryDetails: {
            nid: nid,
            type: type,
          },
        },
      ],
      response => {
        CB(response);
        // if (response.ResponseCode == 200) {
        //   EventManager.callBack(kMemoryDetailsFetched, true, response['Details']);
        // } else {
        //   EventManager.callBack(
        //     kMemoryDetailsFetched,
        //     false,
        //     response['ResponseMessage'],
        //   );
        // }
      })
      // .then((response: Response) => response.json())
      // .catch((err: Error) => {
      //   Promise.reject(err);
      // });
  } 
  catch (err) {
    CB({ResponseCode:400,ResponseMessage:'Unable to process your request. Please try again later'})
    // EventManager.callBack(
    //   kMemoryDetailsFetched,
    //   false,
    //   'Unable to process your request. Please try again later',
    // );
  }
};
