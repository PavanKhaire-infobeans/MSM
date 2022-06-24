import { kPublish, MonthObj } from '.';
import { getValue, decode_utf8 } from '../../common/constants';
import { Account } from '../../common/loginStore';
import { get } from 'http';
import collection from './collection';

export const DefaultDetailsMemory = (title: any) => {
  let description = title;
  title = title.replace(/\n/g, ' ');
  description = description.replace(/\n/g, '<br>');
  if (title.length > 150) {
    title = title.substring(0, 150);
  }
  let draftDetails = {
    title: title,
    description: description,
    memory_date: {
      year: new Date().getFullYear(),
      month:
        MonthObj.month[new Date().getMonth() + MonthObj.serverMonthsCount].tid,
      day: new Date().getDate(),
    },
    location: {
      description: '',
      reference: '',
    },
  };
  return draftDetails;
};

export const DefaultDetailsWithoutTitleMemory = (title: any) => {
  let description = title;
  title = title.replace(/\n/g, ' ');
  description = description.replace(/\n/g, '<br>');
  if (title.length > 150) {
    title = title.substring(0, 150);
  }
  let draftDetails = {
    title: "my memory",
    description: description,
    memory_date: {
      year: new Date().getFullYear(),
      month:
        MonthObj.month[new Date().getMonth() + MonthObj.serverMonthsCount].tid,
      day: new Date().getDate(),
    },
    location: {
      description: '',
      reference: '',
    },
  };
  return draftDetails;
};

export class CreateMemoryHelper {
  getDateOptions(fieldName: any, year: any) {
    let actions: Array<any> = [];
    if (fieldName == 'year') {
      // actions.push({ key: 'Year*', text: 'Year*' });
      let minYear = 1917;
      let lastYear = new Date().getFullYear();
      for (let i = lastYear; i >= minYear; i--) {
        actions.push({ key: i, text: i.toString() });
      }
    } else if (fieldName == 'month') {
      if (parseInt(year) == new Date().getFullYear()) {
        let currentMonth = new Date().getMonth();
        for (let i = 0; i < MonthObj.month.length; i++) {
          if (i > MonthObj.serverMonthsCount - 1) {
            let index = i;
            index - MonthObj.serverMonthsCount <= currentMonth
              ? actions.push({
                key: MonthObj.month[i].tid,
                text: MonthObj.month[i].name,
              })
              : actions.push({
                key: MonthObj.month[i].tid,
                text: MonthObj.month[i].name,
                disabled: true,
              });
          } else {
            actions.push({
              key: MonthObj.month[i].tid,
              text: MonthObj.month[i].name,
            });
          }
        }
      } else {
        MonthObj.month.forEach((element: any) => {
          actions.push({ key: element.tid, text: element.name });
        });
      }
    } else if (fieldName == 'day') {
      actions.push({ key: 'Day', text: 'Day' });
      let min = 1;
      let max = 31;
      let limit = 31;
      if (MonthObj.selectedIndex > MonthObj.serverMonthsCount - 1) {
        switch (MonthObj.month[MonthObj.selectedIndex].name) {
          case 'Feb':
            limit = 28;
            if (year != 'Year*') {
              if (parseInt(year) % 4 == 0) {
                limit = 29;
              }
            }
            break;
          case 'Apr' || 'Jun' || 'Sep' || 'Nov':
            limit = 30;
            break;
          default:
        }
      }
      if (
        year == new Date().getFullYear() &&
        MonthObj.selectedIndex ==
        new Date().getMonth() + MonthObj.serverMonthsCount
      ) {
        limit = new Date().getDate();
      }
      for (let i = min; i <= max; i++) {
        if (i > limit) {
          actions.push({ key: i, text: i.toString(), disabled: true });
        } else {
          actions.push({ key: i, text: i.toString() });
        }
      }
    }
    return actions;
  }
}

export const getCommaSeparatedArray = (key: any, array: any) => {
  let requiredArray = array.map((value: any) => getValue(value, [key]));
  return requiredArray.join(',');
};

export const DefaultCreateMemoryObj = (
  key: any,
  initialState: any,
  isOwner: boolean,
) => {
  let details: any = {};
  let description = initialState.description.replace(/\n/g, '<br>');
  if (isOwner) {
    details = {
      title: decode_utf8(initialState.title.trim()),
      memory_date: initialState.date && initialState.date.year ? {
        year: initialState.date.year,
        month: initialState.date.month,
        day: initialState.date.day != 'Day' ? initialState.date.day : undefined,
      } : undefined,
      // {
      //   year: initialState.date.year,
      //   month: initialState.date.month,
      //   day: initialState.date.day != 'Day' ? initialState.date.day : undefined,
      // },
      location: initialState.location,
      nid: initialState.nid,
      share_option: initialState.shareOption,
      description: description,
    };
    if (
      initialState.collections &&
      initialState.collections.length &&
      initialState.collections.length > 0
    ) {
      let collection_tid: any = [];
      initialState.collections.forEach((element: any) => {
        let tid = element.tid ? element.tid : element.nid;
        collection_tid.push(tid);
      });
      details = { ...details, collection_tid: collection_tid };
    }
    if (key == kPublish) {
      details = { ...details, action: kPublish };
    }
    if (initialState.tags) {
      details = {
        ...details,
        memory_tags_text: getCommaSeparatedArray('name', initialState.tags),
      };
    }
    if (initialState.whoElseWhereThere) {
      details = {
        ...details,
        who_else_was_there_uids: getCommaSeparatedArray(
          'uid',
          initialState.whoElseWhereThere,
        ),
      };
    }
    if (initialState.shareOption == 'custom') {
      if (initialState.whoCanSeeMemoryUids) {
        details = {
          ...details,
          who_can_see_memory_uids: getCommaSeparatedArray(
            'uid',
            initialState.whoCanSeeMemoryUids,
          ),
        };
      }
      if (initialState.whoCanSeeMemoryGroupIds) {
        details = {
          ...details,
          who_can_see_memory_group_ids: getCommaSeparatedArray(
            'id',
            initialState.whoCanSeeMemoryGroupIds,
          ),
        };
      }
    }

    // if (MonthObj.selectedIndex <= MonthObj.serverMonthsCount - 1) {
    //   details.memory_date = {
    //     ...details.memory_date,
    //     season: MonthObj.month[MonthObj.selectedIndex].tid,
    //   };
    // } else {
    //   details.memory_date = {
    //     ...details.memory_date,
    //     month: MonthObj.month[MonthObj.selectedIndex].tid,
    //     day: initialState.date.day != 'Day' ? initialState.date.day : undefined,
    //   };
    // }
  } else {
    details = { description: description, nid: initialState.nid };
  }
  return details;
};

export const getEtherPadUrl = (padId: any) => {
  let padUrl =
    'https://collaboration.cueback.com/p/' +
    padId +
    '?showControls=true&showChat=false&showLineNumbers=false&useMonospaceFont=false&noColors=false&userColor=true&hideQRCode=false&alwaysShowChat=false&userName=memoryuser1_' +
    Account.selectedData().userID;

  return padUrl;
};

export const getUserCount = (users: any, userGroups: any) => {
  let allUsers: any = [];
  users.forEach((element: any) => {
    allUsers.push(element);
  });
  userGroups.forEach((element: any) => {
    if (element.users)
      element.users.forEach((userElement: any) => {
        let found = allUsers.some((user: any) => user.uid === userElement.uid);
        if (!found) {
          allUsers.push(userElement);
        }
      });
  });
  return allUsers;
};

export const getUserName = (file: any) => {
  let user = file.file_owner;
  if (user) {
    if (user.uid == Account.selectedData().userID) {
      return 'You';
    } else {
      return user.field_first_name_value + ' ' + user.field_last_name_value;
    }
  }
  return 'You';
};
