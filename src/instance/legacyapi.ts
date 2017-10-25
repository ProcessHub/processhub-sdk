import { BaseReply, BaseMessage } from "../legacyapi/apirequests";
import { InstanceDetails, ResumeInstanceDetails, InstanceExtras } from "./instanceinterfaces";

// API routes
export const ProcessEngineApiRoutes = {
  execute: "/api/processengine/execute",
  resume: "/api/processengine/resume",
  updateInstance: "/api/processengine/updateInstance",
  abort: "/api/processengine/abort",
  jump: "/api/processengine/jump",
  getInstanceDetails: "/api/processengine/getinstancedetails",
  uploadAttachment: "/api/processengine/uploadattachment",
  deleteAttachment: "/api/processengine/deleteattachment",
  comment: "/api/processengine/comment",
  deleteComment: "/api/processengine/deletecomment",
  deleteMail: "/api/processengine/deletemail",
  deleteInstances: "/api/processengine/deleteinstances",
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
  displayName: string;
  instanceDetails?: InstanceDetails;
}
export interface ExecuteReply extends InstanceReply { // ExecuteReply ist das selbe wie ResumeReply
  instanceId?: string;
}

export interface UpdateInstanceRequest extends InstanceRequest {
  instanceDetails: InstanceDetails;
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
