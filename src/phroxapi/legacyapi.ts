import { BaseReply } from "../legacyapi";
import { IRoxFile, IRoxFolder } from ".";

export const RequestRoutes = {
  GetRootFolder: "/api/phroxapi/getrootfolder",
  GetFolderContent: "/api/phroxapi/getfoldercontent",
};

export interface GetRootFolderReply extends BaseReply {
  folderId: number;
  name: string;
}

export interface GetFolderContentRequest {
  folderId: number;  
}
export interface GetFolderContentReply extends BaseReply {
  folderId: number;
  files: IRoxFile[];
  folders: IRoxFolder[];
}