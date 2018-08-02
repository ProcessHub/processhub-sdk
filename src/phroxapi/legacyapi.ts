import { BaseReply } from "../legacyapi";
import { IRoxFile, IRoxFolder } from ".";

export const RequestRoutes = {
  GetRootFolder: "/api/phroxapi/getrootfolder",
  GetFolderContent: "/api/phroxapi/getfoldercontent",
  GetDocument:  "/api/phroxapi/getdocument",
  GetRoxtraUrl: "/api/phroxapi/getroxtraurl",
  SetCoporateDesign: "/api/phroxapi/setcoporatedesign",
};

export interface SetCoporateDesignRequest {

}

export interface GetRootFolderReply extends BaseReply {
  folderId: number;
  name: string;
}

export interface GetFolderContentRequest {
  folderId: number;  
}

export interface GetDocumentRequest {
  roxFileId: number;
  fieldName: string;
  fileName: string;
  instanceId: string; 
}

export interface GetDocumentReply extends BaseReply {
  data: Buffer;
  fileName: string;
}

export interface GetFolderContentReply extends BaseReply {
  folderId: number;
  files: IRoxFile[];
  folders: IRoxFolder[];
}

export interface GetRoxtraUrlReply extends BaseReply {
  roXtraUrl: string;
}