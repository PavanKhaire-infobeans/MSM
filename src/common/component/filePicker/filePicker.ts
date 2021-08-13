import { requestPermission, GenerateRandomID, Colors, encode_utf8, decode_utf8 } from "../../constants";
import ImageCropPicker, { Image as PickerImage } from "react-native-image-crop-picker";
import { TempFile } from "../../../views/mindPop/edit";
import { FileType } from "../../database/mindPopStore/mindPopStore";
import { ToastMessage } from "../Toast";
//@ts-ignore
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { Alert, Platform } from "react-native";
import { Account } from "../../loginStore";
import Utility from "../../utility";
import RNFetchBlob from 'rn-fetch-blob';
import { Console } from "console";
let options = {
    multiple: true,
    mediaType: "photo",
    cropping: false,
    compressImageQuality: 0.8,
    waitAnimationEnd: false,
    smartAlbums: ['UserLibrary', 'PhotoStream', 'Panoramas', 'Bursts']
};

enum TempFileStatus {
	needsToUpload = "needsToUpload",
	deleted = "deleted",
	uploaded = "uploaded"
}

export const CaptureImage=(callback: any)=>{ 
    requestPermission("camera").then(success => {
        console.log("camera: ",success);
        if (success) {
            console.log("camera In: ",success);
            ImageCropPicker.openCamera(options)
            .then((response: PickerImage | any[]) => {
                var tempfilesArr: TempFile[] = []
                //For iOS array is returned.
                if (Array.isArray(response)) {
                    tempfilesArr = (response as Array<PickerImage>).map(obj => {
                        let path = obj.path.indexOf("file://") != -1 ? obj.path : "file://" + obj.path;
                        let fid = GenerateRandomID();
                        return {
                            fid: fid,
                            filePath: path,
                            thumb_uri: path,
                            isLocal: true,
                            type: `${FileType[FileType.image]}s`,
                            status: TempFileStatus.needsToUpload,
                            userId : Account.selectedData().userID,
                            file_title : "",
                            file_description : "",
                            userName: Account.selectedData().firstName + " " + Account.selectedData().lastName,
                            date : Utility.dateObjectToDefaultFormat(new Date())
                        } as TempFile;
                    })
                } else {
                    //for android object is retured
                    let path = response.path.indexOf("file://") != -1 ? response.path : "file://" + response.path;
                    let fid = GenerateRandomID();
                    var tempfile: TempFile = {
                        fid: fid,
                        filePath: encode_utf8(path),
                        thumb_uri: path,
                        isLocal: true,
                        type: `${FileType[FileType.image]}s`,
                        status: TempFileStatus.needsToUpload,
                        userId : Account.selectedData().userID,
                        file_title : "",
                        file_description : "",
                        userName: Account.selectedData().firstName + " " + Account.selectedData().lastName,
                        date : Utility.dateObjectToDefaultFormat(new Date())
                    }
                    tempfilesArr = [tempfile]
                }
                callback(tempfilesArr);
                return tempfilesArr;
            })
            .catch(e => {});
        }
    });
}

export const PickAudio=(callback: any)=>{
    console
    console.log(callback);
    requestPermission("storage").then(success => {
        console.log(success);
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.audio()]
        },(error:  any , res: any) => {
            if(res){
                // let path = res.uri.indexOf("file://") != -1 ? res.uri : "file://" + res.uri;
                let fid = GenerateRandomID();
                if (Platform.OS === 'ios'){
                    let path = res.uri.indexOf("file://") != -1 ? res.uri : "file://" + res.uri;
                    var tempfile: TempFile = {
                        fid: fid,
                        filePath: path,
                        thumb_uri: path,
                        isLocal: true,
                        type: `${FileType[FileType.audio]}s`,
                        status: TempFileStatus.needsToUpload,
                        filename: res.fileName,
                        userId : Account.selectedData().userID,
                        file_title : "",
                        file_description : "",
                        userName: Account.selectedData().firstName + " " + Account.selectedData().lastName,
                        date : Utility.dateObjectToDefaultFormat(new Date())
                    }
                    callback([tempfile]);
                }else if  (res.uri.indexOf("content://")!= -1){
                    RNFetchBlob.fs.readFile(res.uri,'base64')
                    .then((fileData) => {
                // this.setState({base64Str:files
                // })
                    // //console.log(fileData)
                    // const path = '${RNFS.DocumentDirectoryPath}/${attachment}.aac';
                    RNFetchBlob.fs.stat(res.uri)
                    .then((stats) => {
                        //console.log(stats)
                        const path = stats.path;
                        var tempfile: TempFile = {
                            fid: fid,
                            filePath: path,
                            thumb_uri: path,
                            isLocal: true,
                            type: `${FileType[FileType.audio]}s`,
                            status: TempFileStatus.needsToUpload,
                            filename: res.fileName,
                            userId : Account.selectedData().userID,
                            file_title : "",
                            file_description : "",
                            userName: Account.selectedData().firstName + " " + Account.selectedData().lastName,
                            date : Utility.dateObjectToDefaultFormat(new Date())
                        }
                        callback([tempfile]);
                    })
                    .catch((err) => {
                       //console.log(err)
                    //    const path  =  RNFetchBlob.fs.dirs.DocumentDir + "/" + res.fileName;
                    //    RNFetchBlob.fs.writeFile(encode_utf8(path),  fileData, "base64").then(() =>
                    //     // //console.log(encode_utf8(path)),
                    //     {
                    //         var tempfile: TempFile = {
                    //             fid: fid,
                    //             filePath: path,
                    //             thumb_uri: path,
                    //             isLocal: true,
                    //             type: `${FileType[FileType.audio]}s`,
                    //             status: TempFileStatus.needsToUpload,
                    //             filename: res.fileName,
                    //             userId : Account.selectedData().userID,
                    //             file_title : "",
                    //             file_description : "",
                    //             userName: Account.selectedData().firstName + " " + Account.selectedData().lastName,
                    //             date : Utility.dateObjectToDefaultFormat(new Date())
                    //         }
                    //         callback([tempfile]);
                    //     }
                    // )
                    // .catch((err) => {
                    //     //console.log(err);
                    // })
                    })
                    
                })
                
               }else{
                    let path = res.uri.indexOf("file://") != -1 ? res.uri : "file://" + res.uri;
                    path = decode_utf8(path)
                    var tempfile: TempFile = {
                        fid: fid,
                        filePath: path,
                        thumb_uri: path,
                        isLocal: true,
                        type: `${FileType[FileType.audio]}s`,
                        status: TempFileStatus.needsToUpload,
                        filename: res.fileName,
                        userId : Account.selectedData().userID,
                        file_title : "",
                        file_description : "",
                        userName: Account.selectedData().firstName + " " + Account.selectedData().lastName,
                        date : Utility.dateObjectToDefaultFormat(new Date())
                    }
                    callback([tempfile]);
               }
               
            }
        });			
    });			
}

export const PickPDF=(callback: any)=>{
    requestPermission("storage").then(success => {
      // Alert.alert("check" +success);
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.pdf()]
        },(error:  any , res: any) => {
            if(res){
                let path = res.uri.indexOf("file://") != -1 ? res.uri : "file://" + res.uri;        
                let fid = GenerateRandomID();
                var tempfile: TempFile = {
                    fid: fid,
                    filePath: path,
                    thumb_uri: path,
                    isLocal: true,
                    type: `${FileType[FileType.file]}s`,
                    status: TempFileStatus.needsToUpload,
                    filename: res.fileName,
                    userId : Account.selectedData().userID,
                    file_title : "",
                    file_description : "",
                    userName: Account.selectedData().firstName + " " + Account.selectedData().lastName,
                    date : Utility.dateObjectToDefaultFormat(new Date())
                }
                callback([tempfile]);
            }
        });			
    });			
}

export const PickImage=(callback: any)=>{
    requestPermission("photo").then(success => {
        console.log("PickImage: ",success);
    if (success) {
        ImageCropPicker.openPicker(options)
            .then(response => {
                //console.log(response, typeof response);
                var tempfiles: TempFile[] = (response as Array<PickerImage>).map(obj => {
                    let path = obj.path.indexOf("file://") != -1 ? obj.path : "file://" + obj.path;
                    let fid = GenerateRandomID();
                    let TempFile = {
                        fid: fid,
                        filePath: path,
                        thumb_uri: path,
                        isLocal: true,
                        type: `${FileType[FileType.image]}s`,
                        status: TempFileStatus.needsToUpload,
                        userId : Account.selectedData().userID,
                        file_title : "",
                        file_description : "",
                        userName: Account.selectedData().firstName + " " + Account.selectedData().lastName,
                        date : Utility.dateObjectToDefaultFormat(new Date())
                    }                   
                    return TempFile;
                });
                if(tempfiles.length > 5){
                    tempfiles.splice(5, tempfiles.length - 1);
                    ToastMessage("Maximum 5 photos can be selected", Colors.ErrorColor)
                }
                callback(tempfiles);
                return tempfiles;                
            })
            .catch(e => {});
        }
    });
}