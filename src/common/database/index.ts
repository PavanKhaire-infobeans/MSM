import { Module } from "module"

/**
 * ENUM:DatabaseName---- Database Names
 */
export enum DatabaseName {
    Cueback = "Cueback"
}


/**
 * Module:TableName---- TableNames available in Database
 */
export module Table {
    export enum Names {
        Instances = "Instances",
        User = "User",
        MindPop = "MindPop",
        MindPopAttachments = "MindPopAttachments",
        Configurations = "Configurations",
        LastSyncTimestamp = "LastSyncTimestamp"
    }

    export enum Instances {
        id = "id",
        name = "name",
        instanceURL = "instanceURL",
        imageURL = "imageURL"
    }

    export enum MindPop {
        instanceID = "instanceID",
        id = "id",
        message = "message",
        lastModified = "lastModified",
        userId = "userId"
    }

    export enum MindPopAttachment {
        instanceID = "instanceID",
        id = "id",
        mindPopID = "mindPopID",
        fileName = "fileName",
        type = "type",
        fileMime = "fileMime",
        url = "url",
        thumbnailURL = "thumbnailURL",
        title = "title",
        userId = "userId"
    }
}

