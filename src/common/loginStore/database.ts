import {DatabaseName} from '../database';
import MindPopStore from '../database/mindPopStore/mindPopStore';
import Utility from '../utility';
import {Account} from '.';

const SQLite = require('react-native-sqlite-storage');

export type UserData = {
  instanceID: number;
  name: string;
  email?: string;
  userAuthToken?: string;
  instanceURL?: string;
  userID?: string;
  firstName?: string;
  lastName?: string;
  instanceImage?: string;
  profileImage?: string;
  is_public_site?: boolean;
  isSSOLogin?: boolean;
};
const LoginStore = (() => {
  function errorCB(err: Error) {
    //console.log("SQL Error: " + err);
  }

  function openCB() {
    //console.log("Database OPENED");
  }

  function checkDB(db: any) {
    return new Promise((resolve: Function) => {
      db.transaction((tx: any) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS accounts_table ' +
            '(instanceID INTEGER, email VARCHAR(50), ' +
            'userAuthToken VARCHAR(100), name VARCHAR(40), instanceURL VARCHAR(100), userID VARCHAR(12), ' +
            'firstName VARCHAR(20), lastName VARCHAR(30), ' +
            'profileImage VARCHAR(120), ' +
            'instanceImage VARCHAR(100), isSSOLogin BOOLEAN, is_public_site BOOLEAN, PRIMARY KEY (instanceID, userID));',
          [],
          (_: any, results: any) => {
            if (results) {
              console.log('Query completed', results);
              resolve(results);
            } else {
              resolve(false);
            }
          },
        );
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

  return {
    saveOnLogin: (loginDetails: UserData) => {
      return new Promise((resolve: Function, reject: Function) => {
        openDB((db: any) => {
          if (db) {
            db.transaction((tx: any) => {
              if (tx) {
                let query =
                  'INSERT INTO accounts_table (instanceID, email, ' +
                  'userAuthToken, name, instanceURL, userID, firstName, lastName, profileImage, ' +
                  'instanceImage, is_public_site, isSSOLogin) VALUES (' +
                  `${loginDetails.instanceID}, '${loginDetails.email}', ` +
                  `'${loginDetails.userAuthToken}', '${loginDetails.name}', '${loginDetails.instanceURL}', ` +
                  `${loginDetails.userID}, '${getSanitizedString(
                    loginDetails.firstName,
                  )}', ` +
                  `'${getSanitizedString(loginDetails.lastName)}',` +
                  `'${loginDetails.profileImage}',` +
                  `'${loginDetails.instanceImage}',` +
                  `'${loginDetails.is_public_site}',` +
                  `'${loginDetails.isSSOLogin}'` +
                  ')';
                console.log('Query is : ', query);
                tx.executeSql(
                  query,
                  [],
                  (_: any, results: any) => {
                    if (results) {
                      resolve(results);
                    } else {
                      resolve(false);
                    }
                  },
                  (err: any) => {
                    // console.log(err)
                    LoginStore.updateLogin(loginDetails);
                  },
                );
              } else {
                // console.log("Transaction not completed")
                reject('Transaction not available');
              }
            });
          } else {
            // console.log("DB failed to connect")
            reject('DB failed to connect');
          }
        });
      });
    },
    logout: (instanceID: number, userID: number) => {
      return new Promise((resolve: Function, reject: Function) => {
        openDB((db: any) => {
          if (db) {
            db.transaction((tx: any) => {
              if (tx) {
                let query =
                  "UPDATE accounts_table SET userAuthToken = ''" +
                  ' WHERE instanceID=' +
                  `${instanceID}` +
                  ' AND userID=' +
                  `${userID}`;
                //  console.log("Query is : ", query);
                tx.executeSql(query, [], (_: any, results: any) => {
                  //  console.log("Query completed", results);
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
          }
        });
      });
    },
    updateLogin: (loginDetails: UserData) => {
      return new Promise((resolve: Function, reject: Function) => {
        openDB((db: any) => {
          if (db) {
            db.transaction((tx: any) => {
              if (tx) {
                let query =
                  'UPDATE accounts_table SET ' +
                  'email = ' +
                  `'${loginDetails.email}', ` +
                  'userAuthToken = ' +
                  `'${loginDetails.userAuthToken}', ` +
                  'name = ' +
                  `'${loginDetails.name}', ` +
                  'instanceURL = ' +
                  `'${loginDetails.instanceURL}', ` +
                  'firstName = ' +
                  `'${getSanitizedString(loginDetails.firstName)}', ` +
                  'lastName = ' +
                  `'${getSanitizedString(loginDetails.lastName)}', ` +
                  'profileImage = ' +
                  `'${loginDetails.profileImage}', ` +
                  'instanceImage = ' +
                  `'${loginDetails.instanceImage}', ` +
                  'is_public_site = ' +
                  `'${loginDetails.is_public_site}',` +
                  'isSSOLogin = ' +
                  `'${loginDetails.isSSOLogin}'` +
                  ' WHERE instanceID=' +
                  `${loginDetails.instanceID}` +
                  ' AND userID=' +
                  `${loginDetails.userID}`;
                // console.log("Update query is : ", query)
                tx.executeSql(query, [], (_: any, results: any) => {
                  //  console.log("Query completed", results);
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
    updateProfilePic: (loginDetails: UserData) => {
      return new Promise((resolve: Function, reject: Function) => {
        openDB((db: any) => {
          if (db) {
            db.transaction((tx: any) => {
              if (tx) {
                let query =
                  'UPDATE accounts_table SET ' +
                  'profileImage = ' +
                  `'${loginDetails.profileImage}'` +
                  ' WHERE instanceID=' +
                  `${loginDetails.instanceID}`;
                //  console.log("Query ", query);
                tx.executeSql(query, [], (_: any, results: any) => {
                  //  console.log("Query completed", results);
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
    listAllAccounts: () => {
      return new Promise((resolve: Function, reject: Function) => {
        openDB((db: any) => {
          if (db) {
            db.transaction((tx: any) => {
              if (tx) {
                tx.executeSql(
                  'SELECT * FROM accounts_table order by email',
                  [],
                  (_: any, results: any) => {
                    // console.log("Query completed", results);
                    if (results) {
                      resolve(results);
                    } else {
                      resolve(false);
                    }
                  },
                );
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
    getActiveAccount: (instanceID: number) => {
      new Promise((resolve: Function, reject: Function) => {
        openDB((db: any) => {
          if (db) {
            db.transaction((tx: any) => {
              if (tx) {
                tx.executeSql(
                  'SELECT * FROM accounts_table WHERE instanceID=' + instanceID,
                  [],
                  (_: any, results: any) => {
                    //console.log("Query completed", results);
                    if (results) {
                      resolve(results);
                    } else {
                      resolve(false);
                    }
                  },
                );
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

    clearLastUserData(userID?: number) {
      MindPopStore._deleteMindPops();
    },
  };

  function getSanitizedString(input: string) {
    input = input.replace(/["']/g, "\\'");
    //console.log(input);
    return input;
  }
})();

export default LoginStore;
