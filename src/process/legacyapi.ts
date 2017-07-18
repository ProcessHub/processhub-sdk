import * as PH from "../";

// API routes
export const ProcessRequestRoutes = {
  CreateProcess: "/api/process/createprocess",
  DeleteProcess: "/api/process/deleteprocess",
  GetProcessDetails: "/api/process/processdetails",
  GetProcessDetailsFromUrl: "/api/process/processfromurl",
  UpdateProcess: "/api/process/updateprocess",
  GetPublicProcesses: "/api/process/publicprocesses",
  CopyProcess: "/api/process/copyprocess",
  RateProcess: "/api/process/rateprocess",
  UploadFile: "/api/process/uploadfile",
  DeleteFile: "/api/process/deletefile",
};
export type ProcessRequestRoutes = keyof typeof ProcessRequestRoutes;

// API request/reply objects
export interface ProcessReply extends PH.LegacyApi.BaseMessage {
  errorMessage?: string;
}

export interface CreateProcessRequest extends PH.LegacyApi.BaseRequest {
  processDetails: PH.Process.ProcessDetails;
}

export interface DeleteProcessRequest extends PH.LegacyApi.BaseRequest {
  processId: string;
}

export interface GetProcessDetailsRequest extends PH.LegacyApi.BaseRequest {
  processId: string;
  instanceId?: string;
  getExtras?: PH.Process.ProcessExtras;
}
export interface GetProcessDetailsFromUrlRequest extends PH.LegacyApi.BaseRequest {
  processUrl: string;
}
export interface GetProcessDetailsReply extends ProcessReply {
  processDetails?: PH.Process.ProcessDetails;
}

export interface GetPublicProcessesReply extends ProcessReply {
  processes?: PH.Process.ProcessDetails[];
}

export interface UpdateProcessDetailsRequest extends PH.LegacyApi.BaseRequest {
  processDetails: PH.Process.ProcessDetails;
}

export interface CopyProcessRequest extends PH.LegacyApi.BaseRequest {
  processId: string;
  targetWorkspaceId: string;
  displayName: string;
}

export interface RateProcessRequest extends PH.LegacyApi.BaseRequest {
  processId: string;
  ratingDiff: number;
}

export interface UploadFileRequest extends PH.LegacyApi.BaseRequest {
  processId: string;
  fileName: string;
  data: string;
}

export interface DeleteFileRequest extends PH.LegacyApi.BaseRequest {
  processId: string;
  attachmentId: string;
}

export const PROCESSLOADED_MESSAGE = "ProcessLoadedMessage";
export interface ProcessLoadedMessage extends PH.LegacyApi.BaseMessage {
  type: "ProcessLoadedMessage";
  processDetails?: PH.Process.ProcessDetails;
}

export interface LoadTemplateReply {
  result: PH.Process.ProcessResult;
  bpmnXml: any;
  bpmnContext: any;
}
