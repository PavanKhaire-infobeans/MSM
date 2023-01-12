import ImageCropPicker, {
  Image as PickerImage
} from 'react-native-image-crop-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { TempFile } from '../../../views/mindPop/edit';
import {
  Colors, ConsoleType, decode_utf8, encode_utf8, GenerateRandomID, requestPermission, showConsoleLog
} from '../../constants';
import { FileType } from '../../database/mindPopStore/mindPopStore';
import { ToastMessage } from '../Toast';
//@ts-ignore
import { Platform } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { Account } from '../../loginStore';
import Utility from '../../utility';
let options: any = {
  multiple: true,
  mediaType: 'photo',
  cropping: false,
  compressImageQuality: 0.8,
  selectionLimit: 5,
  quality:0.7,
  maxWidth: 1920,
  maxHeight: 1080,
  waitAnimationEnd: false,
  smartAlbums: ['UserLibrary', 'PhotoStream', 'Panoramas', 'Bursts'],
};

enum TempFileStatus {
  needsToUpload = 'needsToUpload',
  deleted = 'deleted',
  uploaded = 'uploaded',
}

export const CaptureImage = (callback: any) => {
  requestPermission('camera').then(success => {
    showConsoleLog(ConsoleType.LOG,'camera: ', success);
    if (success) {
      showConsoleLog(ConsoleType.LOG,'camera In: ', success);
      ImageCropPicker.openCamera(options)
        .then((response: PickerImage | any[]) => {
          var tempfilesArr: TempFile[] = [];
          //For iOS array is returned.
          if (Array.isArray(response)) {
            tempfilesArr = (response as Array<PickerImage>).map(obj => {
              let path =
                obj.path.indexOf('file://') != -1
                  ? obj.path
                  : 'file://' + obj.path;
              let fid = GenerateRandomID();
              return {
                fid: fid,
                filePath: path,
                thumb_uri: path,
                isLocal: true,
                type: `${FileType[FileType.image]}s`,
                status: TempFileStatus.needsToUpload,
                userId: Account.selectedData().userID,
                file_title: '',
                file_description: '',
                userName:
                  Account.selectedData().firstName +
                  ' ' +
                  Account.selectedData().lastName,
                date: Utility.dateObjectToDefaultFormat(new Date()),
              } as TempFile;
            });
          } else {
            //for android object is retured
            let path =
              response.path.indexOf('file://') != -1
                ? response.path
                : 'file://' + response.path;
            let fid = GenerateRandomID();
            var tempfile: TempFile = {
              fid: fid,
              filePath: encode_utf8(path),
              thumb_uri: path,
              isLocal: true,
              type: `${FileType[FileType.image]}s`,
              status: TempFileStatus.needsToUpload,
              userId: Account.selectedData().userID,
              file_title: '',
              file_description: '',
              userName:
                Account.selectedData().firstName +
                ' ' +
                Account.selectedData().lastName,
              date: Utility.dateObjectToDefaultFormat(new Date()),
            };
            tempfilesArr = [tempfile];
          }
          callback(tempfilesArr);
          return tempfilesArr;
        })
        .catch(e => {
          showConsoleLog(ConsoleType.LOG,"error in camera", e)
        });
    }
  });
};

const selectAudio = async callback => {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.audio],
    });
    showConsoleLog(ConsoleType.LOG,'res : ' + JSON.stringify(res));
    if (res) {
      // let path = res.uri.indexOf("file://") != -1 ? res.uri : "file://" + res.uri;
      let fid = GenerateRandomID();
      if (Platform.OS === 'ios') {
        let path =
          res.uri.indexOf('file://') != -1 ? res.uri : 'file://' + res.uri;
        var tempfile: TempFile = {
          fid: fid,
          filePath: path,
          thumb_uri: path,
          isLocal: true,
          type: `${FileType[FileType.audio]}s`,
          status: TempFileStatus.needsToUpload,
          filename: res.name,
          userId: Account.selectedData().userID,
          file_title: '',
          file_description: '',
          userName:
            Account.selectedData().firstName +
            ' ' +
            Account.selectedData().lastName,
          date: Utility.dateObjectToDefaultFormat(new Date()),
        };
        callback([tempfile]);
      } else if (res.uri.indexOf('content://') != -1) {
        RNFetchBlob.fs.readFile(res.uri, 'base64').then(fileData => {
          // this.setState({base64Str:files
          // })
          // //showConsoleLog(ConsoleType.LOG,fileData)
          // const path = '${RNFS.DocumentDirectoryPath}/${attachment}.aac';
          RNFetchBlob.fs
            .stat(res.uri)
            .then(stats => {
              //showConsoleLog(ConsoleType.LOG,stats)
              const path = stats.path;
              var tempfile: TempFile = {
                fid: fid,
                filePath: path,
                thumb_uri: path,
                isLocal: true,
                type: `${FileType[FileType.audio]}s`,
                status: TempFileStatus.needsToUpload,
                filename: res.name,
                userId: Account.selectedData().userID,
                file_title: '',
                file_description: '',
                userName:
                  Account.selectedData().firstName +
                  ' ' +
                  Account.selectedData().lastName,
                date: Utility.dateObjectToDefaultFormat(new Date()),
              };
              callback([tempfile]);
            })
            .catch(err => {
              //showConsoleLog(ConsoleType.LOG,err)
              //    const path  =  RNFetchBlob.fs.dirs.DocumentDir + "/" + res.fileName;
              //    RNFetchBlob.fs.writeFile(encode_utf8(path),  fileData, "base64").then(() =>
              //     // //showConsoleLog(ConsoleType.LOG,encode_utf8(path)),
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
              //     //showConsoleLog(ConsoleType.LOG,err);
              // })
            });
        });
      } else {
        let path =
          res.uri.indexOf('file://') != -1 ? res.uri : 'file://' + res.uri;
        path = decode_utf8(path);
        var tempfile: TempFile = {
          fid: fid,
          filePath: path,
          thumb_uri: path,
          isLocal: true,
          type: `${FileType[FileType.audio]}s`,
          status: TempFileStatus.needsToUpload,
          filename: res.name,
          userId: Account.selectedData().userID,
          file_title: '',
          file_description: '',
          userName:
            Account.selectedData().firstName +
            ' ' +
            Account.selectedData().lastName,
          date: Utility.dateObjectToDefaultFormat(new Date()),
        };
        callback([tempfile]);
      }
    }
  } catch (err) {
    //Handling any exception (If any)
    if (DocumentPicker.isCancel(err)) {
      //If user canceled the document selection
      showConsoleLog(ConsoleType.LOG,'Canceled from single doc picker');
    } else {
      //For Unknown Error
      showConsoleLog(ConsoleType.LOG,'Unknown Error: ' + JSON.stringify(err));
      throw err;
    }
  }
};

export const PickAudio = (callback: any) => {
  console;
  showConsoleLog(ConsoleType.LOG,callback);
  requestPermission('storage').then(success => {
    showConsoleLog(ConsoleType.LOG,success);
    selectAudio(callback);
  });
};

const selectPDF = async callback => {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
    });
    showConsoleLog(ConsoleType.LOG,'res : ' + JSON.stringify(res));
    if (res) {
      let path =
        res.uri.indexOf('file://') != -1 ? res.uri : 'file://' + res.uri;
      let fid = GenerateRandomID();
      var tempfile: TempFile = {
        fid: fid,
        filePath: path,
        thumb_uri: path,
        isLocal: true,
        type: `${FileType[FileType.file]}s`,
        status: TempFileStatus.needsToUpload,
        filename: res.name,
        userId: Account.selectedData().userID,
        file_title: '',
        file_description: '',
        userName:
          Account.selectedData().firstName +
          ' ' +
          Account.selectedData().lastName,
        date: Utility.dateObjectToDefaultFormat(new Date()),
      };
      callback([tempfile]);
    }
  } catch (err) {
    //Handling any exception (If any)
    if (DocumentPicker.isCancel(err)) {
      //If user canceled the document selection
      showConsoleLog(ConsoleType.LOG,'Canceled from single doc picker');
    } else {
      //For Unknown Error
      showConsoleLog(ConsoleType.LOG,'Unknown Error: ' + JSON.stringify(err));
      throw err;
    }
  }
};

export const PickPDF = async (callback: any) => {
    requestPermission('storage').then(success => {
      selectPDF(callback);
  }).catch(err=>console.log("err",err));
};

export const PickImage = async (callback: any) => {
  requestPermission('photo').then(async (success) => {
    showConsoleLog(ConsoleType.LOG,'PickImage: ', success);
    if (success) {

      // try {
      //   // ImageCropPicker.openPicker(options)
      //   //   .then(response => {
      //   //     //showConsoleLog(ConsoleType.LOG,response, typeof response);
      //   //     var tempfiles: TempFile[] = (response as Array<PickerImage>).map(
      //   //       obj => {
      //   //         let path =
      //   //           obj.path.indexOf('file://') != -1
      //   //             ? obj.path
      //   //             : 'file://' + obj.path;
      //   //         let fid = GenerateRandomID();
      //   //         let TempFile = {
      //   //           fid: fid,
      //   //           filePath: path,
      //   //           thumb_uri: path,
      //   //           isLocal: true,
      //   //           type: `${FileType[FileType.image]}s`,
      //   //           status: TempFileStatus.needsToUpload,
      //   //           userId: Account.selectedData().userID,
      //   //           file_title: '',
      //   //           file_description: '',
      //   //           userName:
      //   //             Account.selectedData().firstName +
      //   //             ' ' +
      //   //             Account.selectedData().lastName,
      //   //           date: Utility.dateObjectToDefaultFormat(new Date()),
      //   //         };
      //   //         return TempFile;
      //   //       },
      //   //     );
      //   //     if (tempfiles.length > 5) {
      //   //       tempfiles.splice(5, tempfiles.length - 1);
      //   //       ToastMessage('Maximum 5 photos can be selected', Colors.ErrorColor);
      //   //     }
      //   //     callback(tempfiles);
      //   //     return tempfiles;
      //   //   })
      //   //   .catch(e => { });

      //    const response = await launchImageLibrary(options, (response:any) => {

      //     try {
      //       var tempfiles: any[] = response.assets.map(
      //         obj => {
      //           let path =
      //             obj.uri.indexOf('file://') != -1
      //               ? obj.uri
      //               : 'file://' + obj.uri;
      //           let fid = GenerateRandomID();
      //           let TempFile = {
      //             fid: fid,
      //             filePath: path,
      //             thumb_uri: path,
      //             isLocal: true,
      //             type: `${FileType[FileType.image]}s`,
      //             status: TempFileStatus.needsToUpload,
      //             userId: Account.selectedData().userID,
      //             file_title: '',
      //             file_description: '',
      //             userName:
      //               Account.selectedData().firstName +
      //               ' ' +
      //               Account.selectedData().lastName,
      //             date: Utility.dateObjectToDefaultFormat(new Date()),
      //           };
      //           return TempFile;
      //         },
      //       );
      //       if (tempfiles.length > 5) {
      //         tempfiles.splice(5, tempfiles.length - 1);
      //         ToastMessage('Maximum 5 photos can be selected', Colors.ErrorColor);
      //       }
      //       callback(tempfiles);
      //       return tempfiles;
      //     } catch (error) {
      //       showConsoleLog(ConsoleType.LOG,error)
      //     }

      //   });
      // } catch (err) {
      //   //Handling any exception (If any)
      //   if (DocumentPicker.isCancel(err)) {
      //     //If user canceled the document selection
      //     showConsoleLog(ConsoleType.LOG,'Canceled from single doc picker');
      //   } else {
      //     //For Unknown Error
      //     showConsoleLog(ConsoleType.LOG,'Unknown Error: ' + JSON.stringify(err));
      //     throw err;
      //   }
      // }
      try {
        const response = await launchImageLibrary(options, (response:any) => {

          try {
            var tempfiles: any[] = response.assets.map(
              obj => {
                let path =
                  obj.uri.indexOf('file://') != -1
                    ? obj.uri
                    : 'file://' + obj.uri;
                let fid = GenerateRandomID();
                let TempFile = {
                  fid: fid,
                  filePath: path,
                  thumb_uri: path,
                  isLocal: true,
                  type: `${FileType[FileType.image]}s`,
                  status: TempFileStatus.needsToUpload,
                  userId: Account.selectedData().userID,
                  file_title: '',
                  file_description: '',
                  userName:
                    Account.selectedData().firstName +
                    ' ' +
                    Account.selectedData().lastName,
                  date: Utility.dateObjectToDefaultFormat(new Date()),
                };
                return TempFile;
              },
            );
            if (tempfiles.length > 5) {
              tempfiles.splice(5, tempfiles.length - 1);
              //ToastMessage('Maximum 5 photos can be selected', Colors.ErrorColor);
            }
            callback(tempfiles);
            return tempfiles;
          } catch (error) {
            showConsoleLog(ConsoleType.LOG,error)
          }

        });

        //showConsoleLog(ConsoleType.LOG,response, typeof response);
        // try {
        //   var tempfiles: TempFile[] = []//.map(

        //     // obj => {
        //       response.assets
        //       let path =
        //         response.path.indexOf('file://') != -1
        //           ? obj.path
        //           : 'file://' + obj.path;
        //       let fid = GenerateRandomID();
        //       let TempFile = {
        //         fid: fid,
        //         filePath: path,
        //         thumb_uri: path,
        //         isLocal: true,
        //         type: `${FileType[FileType.image]}s`,
        //         status: TempFileStatus.needsToUpload,
        //         userId: Account.selectedData().userID,
        //         file_title: '',
        //         file_description: '',
        //         userName:
        //           Account.selectedData().firstName +
        //           ' ' +
        //           Account.selectedData().lastName,
        //         date: Utility.dateObjectToDefaultFormat(new Date()),
        //       };
        //       // return TempFile;
        //     // };
        //   // );
        //   if (tempfiles.length > 5) {
        //     tempfiles.splice(5, tempfiles.length - 1);
        //     ToastMessage('Maximum 5 photos can be selected', Colors.ErrorColor);
        //   }
        //   callback(tempfiles);
        //   return tempfiles;
        // } catch (error) {
        //   showConsoleLog(ConsoleType.LOG,error)
        // }


        // openPicker({compressImageQuality:0.8,mediaType:'photo'})
        // .then(response => {
        //   //showConsoleLog(ConsoleType.LOG,response, typeof response);
        //   try {
        //     var tempfiles: TempFile[] = (response as Array<PickerImage>).map(
        //       obj => {
        //         let path =
        //           obj.path.indexOf('file://') != -1
        //             ? obj.path
        //             : 'file://' + obj.path;
        //         let fid = GenerateRandomID();
        //         let TempFile = {
        //           fid: fid,
        //           filePath: path,
        //           thumb_uri: path,
        //           isLocal: true,
        //           type: `${FileType[FileType.image]}s`,
        //           status: TempFileStatus.needsToUpload,
        //           userId: Account.selectedData().userID,
        //           file_title: '',
        //           file_description: '',
        //           userName:
        //             Account.selectedData().firstName +
        //             ' ' +
        //             Account.selectedData().lastName,
        //           date: Utility.dateObjectToDefaultFormat(new Date()),
        //         };
        //         return TempFile;
        //       },
        //     );
        //     if (tempfiles.length > 5) {
        //       tempfiles.splice(5, tempfiles.length - 1);
        //       ToastMessage('Maximum 5 photos can be selected', Colors.ErrorColor);
        //     }
        //     callback(tempfiles);
        //     return tempfiles;
        //   } catch (error) {
        //     showConsoleLog(ConsoleType.LOG,error)
        //   }

        // })
        // .catch(e => {});
      } catch (error) {
        showConsoleLog(ConsoleType.LOG,"error in file picker :", error)
      }
    }
  });
};
