import { BaseMessage, BaseRequest } from "../legacyapi/apirequests";
import { ProcessDetails, ProcessExtras, ProcessResult } from "./processinterfaces";

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
export interface ProcessReply extends BaseMessage {
  errorMessage?: string;
}

export interface CreateProcessRequest extends BaseRequest {
  processDetails: ProcessDetails;
}

export interface DeleteProcessRequest extends BaseRequest {
  processId: string;
}

export interface GetProcessDetailsRequest extends BaseRequest {
  processId: string;
  instanceId?: string;
  getExtras?: ProcessExtras;
}
export interface GetProcessDetailsFromUrlRequest extends BaseRequest {
  processUrl: string;
}
export interface GetProcessDetailsReply extends ProcessReply {
  processDetails?: ProcessDetails;
}

export interface GetPublicProcessesReply extends ProcessReply {
  processes?: ProcessDetails[];
}

export interface UpdateProcessDetailsRequest extends BaseRequest {
  processDetails: ProcessDetails;
}

export interface CopyProcessRequest extends BaseRequest {
  processId: string;
  targetWorkspaceId: string;
  displayName: string;
}

export interface RateProcessRequest extends BaseRequest {
  processId: string;
  ratingDiff: number;
}

export interface UploadFileRequest extends BaseRequest {
  processId: string;
  fileName: string;
  data: string;
}

export interface DeleteFileRequest extends BaseRequest {
  processId: string;
  attachmentId: string;
}

export const PROCESSLOADED_MESSAGE = "ProcessLoadedMessage";
export interface ProcessLoadedMessage extends BaseMessage {
  type: "ProcessLoadedMessage";
  processDetails?: ProcessDetails;
}

export interface LoadTemplateReply {
  result: ProcessResult;
  bpmnXml: any;
  bpmnContext: any;
}
