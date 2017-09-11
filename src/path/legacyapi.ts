import * as PH from "../";

export const PathRequestRoutes = {
  Load: "/api/path/load"
};
export type PathRequestRoutes = keyof typeof PathRequestRoutes;

// Reply: ApiReply
export interface GetPathRequest extends PH.LegacyApi.BaseRequest {
  path: string;
}

export interface GetPathReply extends PH.LegacyApi.BaseReply {
  workspace?: PH.Workspace.WorkspaceDetails;
  process?: PH.Process.ProcessDetails;

  pathDetails?: PH.Path.PathDetails; // Falls ein nicht vorhandener Path angefragt wird, sind pathStack und pathDetails = null
}

export const PATHLOADED_MESSAGE = "PathLoadedMessage";
export interface PathLoadedMessage extends PH.LegacyApi.BaseMessage {
  type: "PathLoadedMessage";
  pathDetails?: PH.Path.PathDetails;
  error?: PH.LegacyApi.ApiResult;  // Nur gesetzt, falls Seitenaufruf gescheitert
}

