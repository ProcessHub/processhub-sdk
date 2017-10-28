import { BaseRequest, BaseReply, BaseMessage, ApiResult } from "../legacyapi/apiinterfaces";
import { WorkspaceDetails } from "../workspace/workspaceinterfaces";
import { ProcessDetails } from "../process/processinterfaces";
import { PathDetails } from "./pathinterfaces";

export const PathRequestRoutes = {
  Load: "/api/path/load"
};
export type PathRequestRoutes = keyof typeof PathRequestRoutes;

// Reply: ApiReply
export interface GetPathRequest extends BaseRequest {
  path: string;
}

export interface GetPathReply extends BaseReply {
  workspace?: WorkspaceDetails;
  process?: ProcessDetails;

  pathDetails?: PathDetails; // Falls ein nicht vorhandener Path angefragt wird, sind pathStack und pathDetails = null
}

export const PATHLOADED_MESSAGE = "PathLoadedMessage";
export interface PathLoadedMessage extends BaseMessage {
  type: "PathLoadedMessage";
  pathDetails?: PathDetails;
  error?: ApiResult;  // Nur gesetzt, falls Seitenaufruf gescheitert
}

