import * as PH from "../";

// API routes
export const ProcessEngineApiRoutes = {
  execute: "/api/processengine/execute",
  resume: "/api/processengine/resume",
  updateInstance: "/api/processengine/updateInstance",
  abort: "/api/processengine/abort",
  jump: "/api/processengine/jump",
  getInstances: "/api/processengine/getinstances",
  getInstanceDetails: "/api/processengine/getinstancedetails",
  uploadAttachment: "/api/processengine/uploadattachment",
  deleteAttachment: "/api/processengine/deleteattachment",
  comment: "/api/processengine/comment",
};
export type ProcessEngineApiRoutes = keyof typeof ProcessEngineApiRoutes;

// API request/reply objects
export interface InstanceRequest {
}
export interface InstanceReply extends PH.LegacyApi.BaseReply {
  errorMessage?: string;
}

export interface ExecuteRequest extends InstanceRequest {
  processId: string;
  displayName: string;
  instanceDetails?: PH.Instance.InstanceDetails;
}
export interface ExecuteReply extends InstanceReply { // ExecuteReply ist das selbe wie ResumeReply
  instanceId?: string;
}

export interface UpdateInstanceRequest extends InstanceRequest {
  instanceDetails: PH.Instance.InstanceDetails;
}
export interface UpdateInstanceReply extends InstanceReply {
}

export interface ResumeRequest extends InstanceRequest {
  resumeDetails: PH.Instance.ResumeInstanceDetails;
}
// export interface ResumeReply extends InstanceReply {
//   instanceId?: string;
// }

export interface AbortRequest extends InstanceRequest {
  instanceId: string;
}
export interface AbortReply extends InstanceReply {
}

export interface JumpRequest extends InstanceRequest {
  fromTodoId: string;
  toBpmnTaskId: string;
}
export interface JumpReply extends InstanceReply {
}

export interface GetInstancesRequest extends InstanceRequest {
  processId: string;
}
export interface GetInstancesReply extends InstanceReply {
  instances?: PH.Instance.InstanceDetails[];
}

export interface GetInstanceDetailsRequest extends InstanceRequest {
  instanceId: string;
  getExtras: PH.Instance.InstanceExtras;
}
export interface GetInstanceDetailsReply extends InstanceReply {
  instanceDetails?: PH.Instance.InstanceDetails;
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
  instanceId: string;
  fileName: string;
}
export interface DeleteAttachmentReply extends InstanceReply {
}

export interface CommentRequest extends InstanceRequest {
  instanceId: string;
  comment: string;
}

export enum AuditTrailAction {
  instanceStarted = 1,
  completedTodo = 2,
  comment = 3,
}
export interface AuditTrailEntryDetails {
  // must be set for AuditTrailAction.completedTodo
  todoDisplayName: string;
  // must be set for AuditTrailAction.comment
  comment: string;
}
export type Partial<T> = {
  [P in keyof T]?: T[P];
};
export interface AuditTrailEntry { 
  action: AuditTrailAction;
  userDisplayName: string;
  userMail: string;
  userId: string;
  // time of action in UTC
  createdAt: Date;
  details: Partial<AuditTrailEntryDetails>;
}

export const INSTANCELOADED_MESSAGE = "InstanceLoadedMessage";
export interface InstanceLoadedMessage extends PH.LegacyApi.BaseMessage {
  type: "InstanceLoadedMessage";
  instance?: PH.Instance.InstanceDetails;
}
