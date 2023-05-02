import { ConsoleType, showConsoleLog } from '../constants';
import { DatabaseName } from '../database';
import MindPopStore from '../database/mindPopStore/mindPopStore';

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
    //showConsoleLog(ConsoleType.LOG,"SQL Error: " + err);
  }

  function openCB() {
    //showConsoleLog(ConsoleType.LOG,"Database OPENED");
  }

  async function checkDB(db: any) {
    return await db.transaction((tx: any) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS accounts_table ' +
        '(instanceID INTEGER, email VARCHAR(50), ' +
        'userAuthToken VARCHAR(100), name VARCHAR(40), instanceURL VARCHAR(100), userID VARCHAR(12), ' +
        'firstName VARCHAR(20), lastName VARCHAR(30), ' +
        'profileImage VARCHAR(120), ' +
        'instanceImage VARCHAR(100), isSSOLogin BOOLEAN, is_public_site BOOLEAN, PRIMARY KEY (instanceID, userID));',
        [],
        async (_: any, results: any) => {
          let result = await results;
          // showConsoleLog(ConsoleType.LOG, 'Query completed', result);
          if (result) {
            return result;
            // resolve(result);
          } else {
            return false
            // resolve(false);
          }
        },
      );
    });

    // new Promise((resolve: Function) => {

    // });
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
    saveOnLogin: async (loginDetails: UserData) => {
      return openDB(async (db: any) => {
        if (db) {
          await db.transaction(async (tx: any) => {
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
              showConsoleLog(ConsoleType.LOG, 'Query is : ', query);
              await tx.executeSql(
                query,
                [],
                async (_: any, results: any) => {
                  let result = await results;
                  if (result) {
                    return result
                    // resolve(results);
                  } else {
                    return false
                    // resolve(false);
                  }
                },
                (err: any) => {
                  // showConsoleLog(ConsoleType.LOG,err)
                  LoginStore.updateLogin(loginDetails);
                },
              );
            } else {
              return 'Transaction not available'
              // reject('Transaction not available');
            }
          });
        } else {
          return 'DB failed to connect'
          // reject('DB failed to connect');
        }
      });
      // new Promise((resolve: Function, reject: Function) => {

      // });
    },
    logout: async (instanceID: number, userID: number) => {
      return await openDB(async (db: any) => {
        if (db) {
          await db.transaction(async (tx: any) => {
            if (tx) {
              let query =
                "UPDATE accounts_table SET userAuthToken = ''" +
                ' WHERE instanceID=' +
                `${instanceID}` +
                ' AND userID=' +
                `${userID}`;
              //  showConsoleLog(ConsoleType.LOG,"Query is : ", query);
              await tx.executeSql(query, [], async (_: any, results: any) => {
                //  showConsoleLog(ConsoleType.LOG,"Query completed", results);
                let result = await results;
                if (result) {
                  return result
                  // resolve(results);
                } else {
                  return false
                  // resolve(false);
                }
              });
            } else {
              return 'Transaction not available'
              // reject('Transaction not available');
            }
          });
        }
      });
      // new Promise((resolve: Function, reject: Function) => {

      // });
    },
    updateLogin: async (loginDetails: UserData) => {
      return await openDB(async (db: any) => {
        if (db) {
          await db.transaction(async (tx: any) => {
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
              // showConsoleLog(ConsoleType.LOG,"Update query is : ", query)
              await tx.executeSql(query, [], async (_: any, results: any) => {
                //  showConsoleLog(ConsoleType.LOG,"Query completed", results);
                let result = await results;
                if (result) {
                  return result
                  // resolve(results);
                } else {
                  return false
                  // resolve(false);
                }
              });
            } else {
              // reject('Transaction not available');
              return 'Transaction not available'
            }
          });
        } else {
          // reject('DB failed to connect');
          return 'DB failed to connect'
        }
      });
      // new Promise((resolve: Function, reject: Function) => {

      // });
    },
    updateProfilePic: async (loginDetails: UserData) => {
      return await openDB(async (db: any) => {
        if (db) {
          await db.transaction(async (tx: any) => {
            if (tx) {
              let query =
                'UPDATE accounts_table SET ' +
                'profileImage = ' +
                `'${loginDetails.profileImage}'` +
                ' WHERE instanceID=' +
                `${loginDetails.instanceID}`;
              //  showConsoleLog(ConsoleType.LOG,"Query ", query);
              await tx.executeSql(query, [], async (_: any, results: any) => {
                //  showConsoleLog(ConsoleType.LOG,"Query completed", results);
                if (results) {
                  return results
                  // resolve(results);
                } else {
                  return false
                  // resolve(false);
                }
              });
            } else {
              return 'Transaction not available'
              // reject('Transaction not available');
            }
          });
        } else {
          return 'DB failed to connect'
          // reject('DB failed to connect');
        }
      });
      // new Promise((resolve: Function, reject: Function) => {

      // });
    },
    listAllAccounts: async() => {
      return await new Promise((resolve: Function, reject: Function) => {
        openDB(async(db: any) => {
          if (db) {
            await db.transaction(async(tx: any) => {
              if (tx) {
                await tx.executeSql(
                  'SELECT * FROM accounts_table order by email',
                  [],
                  async(_: any, results: any) => {
                    // showConsoleLog(ConsoleType.LOG,"Query completed", results);
                    let result = await results;
                    if (result) {
                      // return result
                      resolve(results);
                    } else {
                      // return false
                      resolve(false);
                    }
                  },
                );
              } else {
                resolve('Transaction not available');
              }
            });
          } else {
            resolve('DB failed to connect');
          }
        });
      });
    },
    getActiveAccount: async(instanceID: number) => {
      // new Promise((resolve: Function, reject: Function) => {
        await openDB(async(db: any) => {
          if (db) {
            await db.transaction(async(tx: any) => {
              if (tx) {
                await tx.executeSql(
                  'SELECT * FROM accounts_table WHERE instanceID=' + instanceID,
                  [],
                  async(_: any, results: any) => {
                    //showConsoleLog(ConsoleType.LOG,"Query completed", results);
                    let result = await results;
                    if (result) {
                      return(result);
                    } else {
                      return(false);
                    }
                  },
                );
              } else {
                return('Transaction not available');
              }
            });
          } else {
            return('DB failed to connect');
          }
        });
      // });
    },

    clearLastUserData(userID?: number) {
      MindPopStore._deleteMindPops();
    },
  };

  function getSanitizedString(input: string) {
    input = input.replace(/["']/g, "\\'");
    //showConsoleLog(ConsoleType.LOG,input);
    return input;
  }
})();

export default LoginStore;
