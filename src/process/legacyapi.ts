import { BaseMessage, BaseRequest, BaseReply } from "../legacyapi/apiinterfaces";
import { ProcessDetails, ProcessExtras, ProcessResult, TimerStartEventConfiguration, ServiceDetails } from "./processinterfaces";
import { StatisticRow } from "../data";

// API routes
export const ProcessRequestRoutes = {
  CreateProcess: "/api/process/createprocess",
  DeleteProcess: "/api/process/deleteprocess",
  GetProcessDetails: "/api/process/processdetails",
  GetProcessDetailsFromUrl: "/api/process/processfromurl",
  UpdateProcess: "/api/process/updateprocess",
  GetTimers: "/api/process/gettimers",
  SetTimers: "/api/process/settimers",
  DownloadProcess: "/api/process/download",
  ExportProcess: "/api/process/export",
  GetPublicProcesses: "/api/process/publicprocesses",
  CopyProcess: "/api/process/copyprocess",
  RateProcess: "/api/process/rateprocess",
  UploadFile: "/api/process/uploadfile",
  DeleteFile: "/api/process/deletefile",
  GetProcessStatistics: "/api/process/getstatistics",
  Comment: "/api/process/comment",
  DeleteComment: "/api/process/deletecomment",
  GetAllServices: "/api/process/getallservices",
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

export interface GetTimersOfProcessRequest extends BaseRequest {
  processId: string;
}
export interface GetTimersOfProcessReply extends ProcessReply {
  timers?: TimerStartEventConfiguration[];
}
export interface SetTimersOfProcessRequest extends BaseRequest {
  processId: string;
  timers: TimerStartEventConfiguration[];
}
export interface SetTimersOfProcessReply extends ProcessReply {
}

export interface DownloadProcessRequest extends BaseRequest {
  processId: string;
}
export interface DownloadProcessReply extends ProcessReply {
  doc: any;
}

export interface ExportProcessRequest extends BaseRequest {
  processId: string;
}
export interface ExportProcessReply extends BaseReply {
  urlName: string;
  bpmn: string;
}

export interface GetAllServicesRequest extends BaseRequest {
}
export interface GetAllServicesReply extends BaseReply {
  services: ServiceDetails[];
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

export interface GetProcessStatisticsRequest extends BaseRequest {
  processId: string;
  fromDate?: Date;
  tillDate?: Date;
}
export interface GetProcessStatisticsReply extends ProcessReply {
  statistics: StatisticRow[];
}

export interface CommentRequest extends BaseRequest {
  processId: string;
  comment: string;
  trailId: string;
}
export interface DeleteCommentRequest extends BaseRequest {
  trailId: string;
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
