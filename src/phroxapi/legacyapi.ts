import { BaseReply } from "../legacyapi";
import { IRoxFile, IRoxFolder } from ".";

export const RequestRoutes = {
  GetRootFolder: "/api/phroxapi/getrootfolder",
  GetFolderContent: "/api/phroxapi/getfoldercontent",
  GetDocument: "/api/phroxapi/getdocument",
  GetRoxtraUrl: "/api/phroxapi/getroxtraurl",
  GetProcessesForRoxFile: "/api/phroxapi/getprocessesforroxfile",
  SetCoporateDesign: "/api/phroxapi/setcoporatedesign",
};

export interface ProcessItem {
  processName: string;
  processId: string;
}

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

export interface GetProcessesForRoxFileRequest {
  roxFileId: number;
}

export interface GetProcessesForRoxFileReply extends BaseReply {
  processes: ProcessItem[];
}

export interface GetFolderContentReply extends BaseReply {
  folderId: number;
  files: IRoxFile[];
  folders: IRoxFolder[];
}

export interface GetRoxtraUrlReply extends BaseReply {
  roXtraUrl: string;
}