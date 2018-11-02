import { BaseReply, BaseMessage } from "../legacyapi/apiinterfaces";
import { InstanceDetails, ResumeInstanceDetails, InstanceExtras } from "./instanceinterfaces";
import { UserDetails } from "../user";

// API routes
export const ProcessEngineApiRoutes = {
  execute: "/api/processengine/execute",
  resume: "/api/processengine/resume",
  updateInstance: "/api/processengine/updateInstance",
  abort: "/api/processengine/abort",
  jump: "/api/processengine/jump",
  getInstanceDetails: "/api/processengine/getinstancedetails",
  uploadAttachment: "/api/processengine/uploadattachment",
  updateRoxFile: "/api/processengine/uploadroxfile",
  deleteAttachment: "/api/processengine/deleteattachment",
  comment: "/api/processengine/comment",
  deleteComment: "/api/processengine/deletecomment",
  deleteMail: "/api/processengine/deletemail",
  deleteInstances: "/api/processengine/deleteinstances",
  uploadCommentAttachment: "/api/processengine/uploadcommentattachment",
  setFieldContent: "/api/processengine/setfieldcontent",
  getArchive: "/api/processengine/getarchive",
  exportAuditTrail: "/api/processengine/exportaudittrail",
};

export type ProcessEngineApiRoutes = keyof typeof ProcessEngineApiRoutes;

// API request/reply objects
export interface InstanceRequest {
}
export interface InstanceReply extends BaseReply {
  errorMessage?: string;
}

export interface ExecuteRequest extends InstanceRequest {
  processId: string;
  instance?: InstanceDetails;
  startEventId?: string;
}
export interface ExecuteReply extends InstanceReply { // ExecuteReply ist das selbe wie ResumeReply
  instanceId?: string;
}

export interface UpdateInstanceRequest extends InstanceRequest {
  instance: InstanceDetails;
}
export interface UpdateInstanceReply extends InstanceReply {
  instance?: InstanceDetails;
}

export interface ResumeRequest extends InstanceRequest {
  resumeDetails: ResumeInstanceDetails;
}

export interface AbortRequest extends InstanceRequest {
  instanceId: string;
}
export interface AbortReply extends InstanceReply {
}

export interface JumpRequest extends InstanceRequest {
  instanceId: string;
  targetBpmnTaskId: string;
  resumeDetails: ResumeInstanceDetails;
}
export interface JumpReply extends InstanceReply {
}

export interface GetInstanceDetailsRequest extends InstanceRequest {
  instanceId: string;
  getExtras: InstanceExtras;
}
export interface GetInstanceDetailsReply extends InstanceReply {
  instanceDetails?: InstanceDetails;
}

export interface UploadAttachmentRequest extends InstanceRequest {
  instanceId: string;
  processId: string;
  fileName: string;
  data: string;
}
export interface UploadAttachmentReply extends InstanceReply {
  url: string;
}

export interface UploadRoxFileRequest extends InstanceRequest {
  instanceId: string;
  processId: string;
  fileName: string;
  oldFileName: string;
  fieldName: string;
  data: string;
}
export interface UploadRoxFileReply extends InstanceReply {
  url: string;
}

export interface GetArchiveRequest extends InstanceRequest {
  workspaces: string[];
  roxFileIds: number[];
}
export interface GetArchiveReply extends InstanceReply {
  instances: InstanceDetails[];
  instanceUsers: UserDetails[];
}

export interface UploadCommentAttachmentRequest extends InstanceRequest {
  instanceId: string;
  processId: string;
  fileName: string;
  data: string;
  trailId: string;
}
export interface UploadCommentAttachmentReply extends InstanceReply {
  url: string;
}

export interface SetFieldContentRequest extends InstanceRequest {
  instanceId: string;
  fieldName: string;
  fieldValue: string;
}
export interface SetFieldContentReply extends InstanceReply {
}

export interface DeleteAttachmentRequest extends InstanceRequest {
  processId: string;
  instanceId: string;
  fileName: string;
}
export interface DeleteAttachmentReply extends InstanceReply {
}

export interface CommentRequest extends InstanceRequest {
  instanceId: string;
  comment: string;
  trailId: string;  
  attachments: string[];
}
export interface DeleteCommentRequest extends InstanceRequest {
  trailId: string;
}

export interface DeleteMailRequest extends InstanceRequest {
  trailId: string;
}

export interface DeleteInstancesRequest extends InstanceRequest {
  instanceIds: string[];
}

export const INSTANCELOADED_MESSAGE = "InstanceLoadedMessage";
export interface InstanceLoadedMessage extends BaseMessage {
  type: "InstanceLoadedMessage";
  instance?: InstanceDetails;
}

export interface ExportAuditTrailRequest extends InstanceRequest {
  instanceId: string;
}
export interface ExportAuditTrailReply extends InstanceReply {
  doc: any;
}