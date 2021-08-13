import { UserData } from "./database";

let account: Account = null, tempAccount: Account = null;

export default class Account implements UserData {

    static selectedData(): Account {
        if (account == null) {
            account = new Account();
        }
        return account;
    }

    static tempData(): Account {
        if (tempAccount == null) {
            tempAccount = new Account();
        }
        return tempAccount;
    }

    clean = () => {
        this.name = ""
        this.instanceID = 0
        this.email = ""
        this.userAuthToken = ""
        this.instanceURL = ""
        this.userID = ""
        this.firstName = ""
        this.lastName = ""
        this.instanceImage = ""
        this.profileImage = ""
        this.is_public_site = false
        this.start_year = ""
        this.end_year = ""
        this.isSSOLogin = false
    }

    name = ""
    instanceID = 0
    email = ""
    userAuthToken = ""
    instanceURL = ""
    userID = ""
    firstName = ""
    lastName = ""
    instanceImage = ""
    profileImage = ""
    is_public_site = false
    start_year = ""
    end_year = ""
    isSSOLogin = false

    set values(user: UserData) {
        this.instanceID = user.instanceID || this.instanceID
        this.email = user.email || this.email
        this.name = user.name || this.name
        this.userAuthToken = user.userAuthToken || this.userAuthToken
        this.instanceURL = user.instanceURL || this.instanceURL
        this.userID = user.userID || this.userID
        this.firstName = user.firstName || this.firstName
        this.lastName = user.lastName || this.lastName
        this.instanceImage = user.instanceImage || this.instanceImage
        this.profileImage = user.profileImage || ""
        this.is_public_site = user.is_public_site || false
        this.isSSOLogin = user.isSSOLogin || false
    }
}