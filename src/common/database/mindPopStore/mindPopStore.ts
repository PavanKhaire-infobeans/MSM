import { DatabaseName, Table } from '../';
import { ConsoleType, getValue, showConsoleLog } from '../../constants';
import { Account } from '../../loginStore';

const SQLite = require('react-native-sqlite-storage');

export enum FileType {
  text = 1,
  image = 2,
  audio = 3,
  file = 4,
  video = 5,
}

/**
 * ENUM:MindPop---- MindPop Table Details & Type
 */
export type MindPop = {
  id: number;
  instanceID: number;
  message?: string;
  lastModified: number;
  audios: MindPopAttachment[];
  videos: MindPopAttachment[];
  images: MindPopAttachment[];
  files: MindPopAttachment[];

  /**
     * {
                        "fid": "12372",
                        "uri": "public://mindpops_media/media_4929/images/3B06638D-C3DE-47CD-9137-66D759A581FD.jpg",
                        "filename": "3B06638D-C3DE-47CD-9137-66D759A581FD.jpg",
                        "filemime": "image/jpeg"
                    }
     */
};

/**
 * ENUM:MindPopAttachment---- MindPopAttachment Table Details & Type
 */
export type MindPopAttachment = {
  instanceID: number;
  mindpopID: number;
  id: number;
  type: number;
  url: string;
  fileName: string;
  fileMime: string;
  fileSize: string;
  thumbnailURL?: string;
  title?: string;
};

export const Convert = (value: MindPopAttachment) => {
  return {
    fid: value.id,
    instanceID: value.instanceID,
    uri: value.url,
    filesize: value.fileSize,
    thumb_uri: value.thumbnailURL,
    filename: value.fileName,
    filemime: value.fileMime,
    title: value.title,
  };
};

const MindPopStore = (() => {
  function errorCB(err: Error) {
    showConsoleLog(ConsoleType.LOG,'SQL Error: ' + err);
  }

  function openCB() {
    showConsoleLog(ConsoleType.LOG,'Database OPENED');
  }

  function checkDB(db: any) {
    return new Promise((resolve: Function) => {
      db.transaction((tx: any) => {
        /**
         *  check if table exists if not then create a new table
         *
         *  CREATE  TABLE IF NOT EXISTS MindPop (instanceID integer, id long ,
         *  lastModified long, message text,  PRIMARY KEY (instanceID, id));
         *
         * CREATE TABLE IF NOT EXISTS MindPopAttachment
         *  (instanceID integer, mindPopID long, fid long,  fileName VARCHAR(100),
         *  fileType integer, fileMime VARCHAR(30), url text, thumbnailURL text, PRIMARY KEY(instanceID,
         *  mindPopID, fid));
         */

        var queryCreateMindPop = `CREATE TABLE IF NOT EXISTS ${Table.Names.MindPop} (${Table.MindPop.instanceID} INTEGER NOT NULL,
                             ${Table.MindPop.id} LONG NOT NULL, ${Table.MindPop.message} TEXT NULL,
                             ${Table.MindPop.lastModified} LONG NOT NULL, 
                             ${Table.MindPop.userId} INTEGER NOT NULL,
                             PRIMARY KEY (${Table.MindPop.instanceID}, ${Table.MindPop.id}, ${Table.MindPop.userId})
                             );`;

        var queryCreateMindPopAttachment = `CREATE TABLE IF NOT EXISTS ${Table.Names.MindPopAttachments} (${Table.MindPopAttachment.instanceID} INTEGER NOT NULL,
                                ${Table.MindPopAttachment.mindPopID} LONG NOT NULL, ${Table.MindPopAttachment.id} LONG NOT NULL, 
                                ${Table.MindPopAttachment.fileName} VARCHAR(100) NOT NULL,  ${Table.MindPopAttachment.type} INTEGER NOT NULL,
                                ${Table.MindPopAttachment.fileMime} VARCHAR(30) NOT NULL,                                
                                ${Table.MindPopAttachment.url} TEXT NOT NULL, ${Table.MindPopAttachment.thumbnailURL} TEXT NOT NULL, ${Table.MindPopAttachment.title} TEXT,
                                ${Table.MindPop.userId} INTEGER NOT NULL,
                                PRIMARY KEY (${Table.MindPopAttachment.instanceID}, 
                                    ${Table.MindPopAttachment.mindPopID}, ${Table.MindPopAttachment.id}, ${Table.MindPop.userId}));`;
        showConsoleLog(ConsoleType.LOG,'Query to create MindPop Table:', queryCreateMindPop);
        showConsoleLog(ConsoleType.LOG,
          'Query to create MindPop Attachment Table:',
          queryCreateMindPopAttachment,
        );

        tx.executeSql(queryCreateMindPop, [], (_: any, results: any) => {
          showConsoleLog(ConsoleType.LOG,'Mindpop create table Query completed', results);
          if (results) {
            //create mind pop attachment tables
            tx.executeSql(
              queryCreateMindPopAttachment,
              [],
              (_: any, results: any) => {
                showConsoleLog(ConsoleType.LOG,
                  'Mindpop attachment create table Query completed',
                  results,
                );
                if (results) {
                  resolve(results);
                } else {
                  resolve(false);
                }
              },
            );
          } else {
            resolve(false);
          }
        });
      });
    });
  }

  async function openDB(onOpened: (db: any) => void) {
    var dbName = `${DatabaseName.Cueback}.db`;
    var db = SQLite.openDatabase(
      dbName,
      '1.0',
      'Cueback Database',
      200000,
      openCB,
      errorCB,
    );
    await checkDB(db);
    onOpened(db);
  }

  async function close() { }

  function _getAttachmentEntities(
    attachementArray: any[],
    fileType: number,
    mindPopID: number,
    instanceID: number,
  ): MindPopAttachment[] {
    var attachment: MindPopAttachment[] = attachementArray.map((obj: any) => {
      return {
        instanceID: instanceID,
        mindpopID: mindPopID,
        id: Number(obj.fid),
        type: fileType,
        fileName: obj.filename,
        fileMime: obj.filemime,
        fileSize: obj.filesize,
        url: obj.uri,
        thumbnailURL: obj.thumb_uri || '',
        title: obj.title ? obj.title : null,
      };
    });

    return attachment;
  }

  function _createDBEntities(dataObj: { [x: string]: any }): MindPop[] {
    let itemsWebservice: any[] =
      getValue(dataObj, ['Details', 'mindPopList']) || [];
    var mindpopItems: MindPop[] = [];
    if (itemsWebservice.length > 0) {
      mindpopItems = itemsWebservice.map(obj => {
        let instanceID = Account.selectedData().instanceID;
        let mindPopID = Number(obj.id);
        let images = getValue(obj, ['images']) || [];
        let audios = getValue(obj, ['audios']) || [];
        let videos = getValue(obj, ['videos']) || [];
        let files = getValue(obj, ['files']) || [];

        let imageAttachments = _getAttachmentEntities(
          images,
          FileType.image,
          mindPopID,
          instanceID,
        );
        let audioAttachments = _getAttachmentEntities(
          audios,
          FileType.audio,
          mindPopID,
          instanceID,
        );
        let videoAttachments = _getAttachmentEntities(
          videos,
          FileType.video,
          mindPopID,
          instanceID,
        );
        let fileAttachments = _getAttachmentEntities(
          files,
          FileType.file,
          mindPopID,
          instanceID,
        );

        return {
          id: mindPopID,
          instanceID: instanceID,
          message: obj.message,
          lastModified: Number(obj.modified_on),
          images: imageAttachments,
          audios: audioAttachments,
          videos: videoAttachments,
          files: fileAttachments,
        };
      });
    }
    return mindpopItems;
  }

  function prepareInsertionStatement(
    attachments: MindPopAttachment[],
  ): string[] {
    var arrayOfAttachmentValue: string[] = [];
    for (var i = 0; i < attachments.length; i++) {
      let file = attachments[i];
      var values = `(${file.instanceID}, ${file.mindpopID}, '${file.id}', '${file.fileName
        }', ${file.type},'${file.fileMime}', '${file.url}', '${file.thumbnailURL
        }', '${file.title}', '${Account.selectedData().userID}')`;
      arrayOfAttachmentValue.push(values);
    }
    return arrayOfAttachmentValue;
  }

  // function getAttachmentInsertionStatement(mindPop: MindPop): string {
  function getAttachmentInsertionStatement(mindPop: MindPop): string[] {
    var statementString = '';
    var arrayOfAttachmentValue: string[] = [];

    let audio = prepareInsertionStatement(mindPop.audios);
    let video = prepareInsertionStatement(mindPop.videos);
    let images = prepareInsertionStatement(mindPop.images);
    let files = prepareInsertionStatement(mindPop.files);

    arrayOfAttachmentValue = [...audio, ...video, ...images, ...files];

    statementString =
      arrayOfAttachmentValue.length > 0 ? arrayOfAttachmentValue.join(',') : '';
    showConsoleLog(ConsoleType.LOG,'Attachment Statement', statementString);
    // return statementString
    return arrayOfAttachmentValue;
  }

  function saveMindPopAttachments(statement: string) {
    return new Promise((resolve: Function, reject: Function) => {
      openDB((db: any) => {
        if (db) {
          db.transaction((tx: any) => {
            if (tx) {
              var query =
                `REPLACE INTO ${Table.Names.MindPopAttachments} VALUES` + ' ';
              query = query + statement;
              showConsoleLog(ConsoleType.LOG,'Insert Attachment Query: ', query);
              tx.executeSql(query, [], (_: any, results: any) => {
                showConsoleLog(ConsoleType.LOG,'Query completed', results);
                if (results) {
                  resolve(results);
                } else {
                  showConsoleLog(ConsoleType.LOG,'Unable to save attachment', results);
                  resolve(false);
                }
              });
            } else {
              reject('Transaction not available');
            }
          });
        } else {
          reject('DB failed to connect');
        }
      });
    });
  }

  const _deleteMindPopAttachment = (ids?: number[], mindPopIDs?: number[]) => {
    var query: string = '';
    let instanceID = Account.selectedData().instanceID;

    if (ids != null && ids.length !== 0) {
      query = `DELETE FROM ${Table.Names.MindPopAttachments} WHERE ${Table.MindPopAttachment.id
        } IN (${ids.join(',')}) AND ${Table.MindPopAttachment.instanceID
        } = ${instanceID} AND ${Table.MindPopAttachment.userId} = ${Account.selectedData().userID
        }`;
    } else if (mindPopIDs != null && mindPopIDs.length != 0) {
      query = `DELETE FROM ${Table.Names.MindPopAttachments} WHERE ${Table.MindPopAttachment.mindPopID
        } IN (${mindPopIDs.join(',')}) AND ${Table.MindPopAttachment.instanceID
        } = ${instanceID}  AND ${Table.MindPopAttachment.userId} = ${Account.selectedData().userID
        }`;
    } else {
      query = `DELETE FROM ${Table.Names.MindPopAttachments}  WHERE ${Table.MindPopAttachment.instanceID
        } = ${instanceID}  AND ${Table.MindPopAttachment.userId} = ${Account.selectedData().userID
        }`;
    }

    let promise = new Promise((resolve: Function, reject: Function) => {
      openDB((db: any) => {
        if (db) {
          showConsoleLog(ConsoleType.LOG,'Query to delete mindpop attachemnt', query);
          db.transaction((tx: any) => {
            if (tx) {
              tx.executeSql(query, [], (_: any, results: any) => {
                showConsoleLog(ConsoleType.LOG,'Query completed', results);
                if (results) {
                  resolve(results);
                } else {
                  resolve(false);
                }
              });
            } else {
              reject('Transaction not available');
            }
          });
        } else {
          reject('DB failed to connect');
        }
      });
    });
    return promise;
  };

  return {
    saveMindPop: (dataObj: { [x: string]: any }) => {
      //Delete from MindPopAttachments where instanceID = 649
      //AND mindPopID = 5670 AND id NOT IN (13112)

      let mindPopDBEntities: MindPop[] = _createDBEntities(dataObj);

      let promise = new Promise((resolve: Function, reject: Function) => {
        showConsoleLog(ConsoleType.LOG,'total mindpops: ', mindPopDBEntities.length);
        if (mindPopDBEntities.length > 0) {
          openDB((db: any) => {
            if (db) {
              db.transaction((tx: any) => {
                if (tx) {
                  /**
                                     * ${Table.Names.MindPop} (${Table.MindPop.instanceID} INTEGER,
                                 ${Table.MindPop.id} LONG, ${Table.MindPop.message} TEXT,
                                 ${Table.MindPop.lastModified} LONG, PRIMARY KEY (${Table.MindPop.instanceID}, ${Table.MindPop.id})
                                 )
                                     */
                  var query: string =
                    `REPLACE INTO ${Table.Names.MindPop} VALUES` + ' ';
                  var queryAttachment: string = '';
                  var arrayOfValues: string[] = [];
                  var arrayOfAttachmentValue: string[] = [];
                  for (var i = 0; i < mindPopDBEntities.length; i++) {
                    let obj = mindPopDBEntities[i];
                    var values = `(${obj.instanceID}, ${obj.id}, "${obj.message
                      }", ${obj.lastModified}, ${Account.selectedData().userID})`;
                    arrayOfValues.push(values);
                    let attachments: string[] =
                      getAttachmentInsertionStatement(obj);
                    arrayOfAttachmentValue.push(...attachments);
                  }

                  let valueString = arrayOfValues.join(',');
                  query = query + valueString;
                  showConsoleLog(ConsoleType.LOG,'Insert Query: ', query);

                  queryAttachment = arrayOfAttachmentValue.join(',');

                  tx.executeSql(query, [], (_: any, results: any) => {
                    showConsoleLog(ConsoleType.LOG,'Query completed', results);
                    if (results) {
                      if (queryAttachment.trim().length != 0) {
                        saveMindPopAttachments(queryAttachment).then(
                          result => {
                            resolve(result);
                          },
                          error => {
                            showConsoleLog(ConsoleType.LOG,'Query completed', error);
                            resolve(false);
                          },
                        );
                      } else {
                        resolve(results);
                      }
                    } else {
                      resolve(false);
                    }
                  });
                } else {
                  reject('Transaction not available');
                }
              });
            } else {
              reject('DB failed to connect');
            }
          });
        } else {
          resolve(true);
        }
      });

      return promise;
    },
    addMindPop: (
      itemList: Array<{
        instanceID: number;
        id: string;
        message: string;
        lastModified: string;
      }>,
    ) => {
      var query: string = `INSERT INTO ${Table.Names.MindPop} VALUES` + ' ';
      var arrayOfValues = [];
      for (let obj of itemList) {
        arrayOfValues.push(
          `(${obj.instanceID}, ${obj.id}, '${obj.message}', ${obj.lastModified
          }, ${Account.selectedData().userID})`,
        );
      }
      let valueString = arrayOfValues.join(',');
      query = query + valueString;
      showConsoleLog(ConsoleType.LOG,'Insert Query: ', query);
      return new Promise((resolve: Function, reject: Function) => {
        openDB((db: any) => {
          if (db) {
            db.transaction((tx: any) => {
              if (tx) {
                tx.executeSql(query, [], (_: any, results: any) => {
                  if (results) {
                    resolve(results);
                  } else {
                    resolve(false);
                  }
                });
              } else {
                reject('Transaction not available');
              }
            });
          } else {
            reject('DB failed to connect');
          }
        });
      });
    },
    replaceMindPop: (
      itemList: Array<{
        instanceID: number;
        id: string;
        message: string;
        lastModified: string;
      }>,
    ) => {
      var query: string = `REPLACE INTO ${Table.Names.MindPop} VALUES` + ' ';
      var arrayOfValues = [];
      for (let obj of itemList) {
        arrayOfValues.push(
          `(${obj.instanceID}, ${obj.id}, '${obj.message}', ${obj.lastModified
          }, ${Account.selectedData().userID})`,
        );
      }
      let valueString = arrayOfValues.join(',');
      query = query + valueString;
      showConsoleLog(ConsoleType.LOG,'Insert Query: ', query);
      return new Promise((resolve: Function, reject: Function) => {
        openDB((db: any) => {
          if (db) {
            db.transaction((tx: any) => {
              if (tx) {
                tx.executeSql(query, [], (_: any, results: any) => {
                  if (results) {
                    resolve(results);
                  } else {
                    resolve(false);
                  }
                });
              } else {
                reject('Transaction not available');
              }
            });
          } else {
            reject('DB failed to connect');
          }
        });
      });
    },
    _getMindPopFromLocalDB: (searchKeyword: string) => {
      return new Promise((resolve: Function, reject: Function) => {
        openDB((db: any) => {
          if (db) {
            db.transaction((tx: any) => {
              if (tx) {
                let query = `SELECT mp.instanceID, mp.id, mp.message, mp.lastModified, mpa.id as attachmentID, mpa.fileName, mpa.url, mpa.type, mpa.fileMime, mpa.thumbnailURL from ${Table.Names.MindPop
                  } mp LEFT JOIN ${Table.Names.MindPopAttachments
                  } mpa on mp.id = mpa.mindPopID WHERE mp.message  like '%${searchKeyword}%' and mp.instanceID = ${Account.selectedData().instanceID
                  }  and mp.userId = ${Account.selectedData().userID
                  } ORDER BY mp.id DESC, mpa.id DESC`;
                showConsoleLog(ConsoleType.LOG,'Query to search mindpop', query);
                tx.executeSql(query, [], (_: any, results: any) => {
                  showConsoleLog(ConsoleType.LOG,'Query completed', results);
                  if (results) {
                    resolve(results);
                  } else {
                    resolve(false);
                  }
                });
              } else {
                reject('Transaction not available');
              }
            });
          } else {
            reject('DB failed to connect');
          }
        });
      });
    },

    _deleteMindPops: (ids: number[] = null) => {
      var query: String = '';
      let instanceID = Account.selectedData().instanceID;
      if (ids == null || ids.length == 0) {
        query = `DELETE FROM ${Table.Names.MindPop} WHERE ${Table.MindPop.instanceID
          } = ${instanceID} AND ${Table.MindPop.userId} = ${Account.selectedData().userID
          }`;
      } else {
        query = `DELETE FROM ${Table.Names.MindPop} WHERE ${Table.MindPop.id
          } IN (${ids.join(',')}) AND ${Table.MindPop.instanceID
          } = ${instanceID} AND ${Table.MindPop.userId} = ${Account.selectedData().userID
          }`;
      }

      let promise = new Promise((resolve: Function, reject: Function) => {
        openDB((db: any) => {
          if (db) {
            db.transaction((tx: any) => {
              if (tx) {
                tx.executeSql(query, [], (_: any, results: any) => {
                  showConsoleLog(ConsoleType.LOG,'Query completed', results);
                  if (results) {
                    resolve(results);
                  } else {
                    resolve(false);
                  }
                });
              } else {
                reject('Transaction not available');
              }
            });
          } else {
            reject('DB failed to connect');
          }
        });
      });

      //if mindpops are deleted successfully then delete related attachments
      return promise.then(
        () => {
          return _deleteMindPopAttachment(null, ids).then((result: any) => {
            showConsoleLog(ConsoleType.LOG,`delete mind pop ${result}`);
            return Promise.resolve(result);
          });
        },
        failedResult => {
          showConsoleLog(ConsoleType.LOG,`failed to delete mind pop ${failedResult}`);
          return Promise.reject(failedResult);
        },
      );
    },

    _getMindPopAttachments: (id: string) => {
      let instanceID = Account.selectedData().instanceID;
      let query: string = `SELECT * FROM ${Table.Names.MindPopAttachments
        } WHERE ${Table.MindPopAttachment.mindPopID} = "${id}" AND ${Table.MindPopAttachment.instanceID
        } = ${instanceID} AND ${Table.MindPop.userId} = ${Account.selectedData().userID
        }`;

      let promise = new Promise((resolve: Function, reject: Function) => {
        openDB((db: any) => {
          if (db) {
            showConsoleLog(ConsoleType.LOG,'Get Mindpop attachments', query);
            db.transaction((tx: any) => {
              if (tx) {
                tx.executeSql(query, [], (_: any, results: any) => {
                  showConsoleLog(ConsoleType.LOG,'Query completed', results);
                  if (results) {
                    resolve(results);
                  } else {
                    resolve(false);
                  }
                });
              } else {
                reject('Transaction not available');
              }
            });
          } else {
            reject('DB failed to connect');
          }
        });
      });
      return promise;
    },
    deleteMindPopAttachment(ids: number[]) {
      var query: string = '';
      let instanceID = Account.selectedData().instanceID;
      query = `DELETE FROM ${Table.Names.MindPopAttachments} WHERE ${Table.MindPopAttachment.id
        } IN (${ids.join(',')}) AND ${Table.MindPopAttachment.instanceID
        } = ${instanceID} AND ${Table.MindPopAttachment.userId} = ${Account.selectedData().userID
        }`;
      let promise = new Promise((resolve: Function, reject: Function) => {
        openDB((db: any) => {
          if (db) {
            showConsoleLog(ConsoleType.LOG,'Query to delete mindpop attachemnt', query);
            db.transaction((tx: any) => {
              if (tx) {
                tx.executeSql(query, [], (_: any, results: any) => {
                  showConsoleLog(ConsoleType.LOG,'Query completed', results);
                  if (results) {
                    resolve(results);
                  } else {
                    resolve(false);
                  }
                });
              } else {
                reject('Transaction not available');
              }
            });
          } else {
            reject('DB failed to connect');
          }
        });
      });
      return promise;
    },
  };
})();

export default MindPopStore;
