import { BaseReply, BaseMessage } from "../legacyapi";
import { IRoxFile, IRoxFolder } from ".";
import { Instance, Process } from "..";
import { FieldContentMap } from "../data";

export const RequestRoutes = {
  GetRootFolder: "/api/phroxapi/getrootfolder",
  GetFolderContent: "/api/phroxapi/getfoldercontent",
  GetDocument: "/api/phroxapi/getdocument",
  GetRoxtraUrl: "/api/phroxapi/getroxtraurl",
  GetProcessesForRoxFile: "/api/phroxapi/getprocessesforroxfile",
  SetCoporateDesign: "/api/phroxapi/setcoporatedesign",
  DownloadRoxDocToServer: "/api/phroxapi/downloadroxdoctoserver",
};

export interface ProcessItem {
  processName: string;
  processId: string;
  startButtons: StartButtonItem[];
}

export interface StartButtonItem {
  startButtonName: string;
  startButtonId: string;
  singleRoxFile: boolean;
}

export interface SetCorporateDesignRequest {
  ButtonHoverColor: string;
  MainFontColor: string;
  MenuFontColor: string;
  MenuFontHoverColor: string;
  SubMenuColor: string;
  Darkblue: string;
  Warningred: string;
  Logo: string;
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

export interface DownloadRoxDocToServerReply extends BaseReply {
  fieldContents: FieldContentMap;
}

export interface DownloadRoxDocToServerRequest {
  instanceDetails: Instance.InstanceDetails;
  extVals: Process.TaskExtensions;
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