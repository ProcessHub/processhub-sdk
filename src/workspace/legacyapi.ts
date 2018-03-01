import { BaseRequest, BaseMessage } from "../legacyapi/apiinterfaces";
import { WorkspaceExtras, WorkspaceDetails, WorkspaceRole, WorkspaceType } from "./workspaceinterfaces";
import { WorkspaceMessages } from "./phclient";

// WorkspaceRequestRoutes
export const WorkspaceRequestRoutes = {
  LoadWorkspace: "/api/workspace/load",
  CreateWorkspace: "/api/workspace/create",
  InviteWorkspaceMember: "/api/workspace/invitemember",
  RemoveWorkspaceMember: "/api/workspace/removemember",
  UpdateWorkspace: "/api/workspace/update",
  DeleteWorkspace: "/api/workspace/delete",
  SetMemberRole: "/api/workspace/setmemberrole",
  StartTrial: "/api/workspace/starttrial",
};
export type WorkspaceRequestRoutes = keyof typeof WorkspaceRequestRoutes;


export interface LoadWorkspaceRequest extends BaseRequest {
  workspaceId: string;
  getExtras: WorkspaceExtras;
}
export interface LoadWorkspaceReply extends BaseMessage {
  type: WorkspaceMessages;
  workspace?: WorkspaceDetails;
}


export interface WorkspaceLoadedMessage extends BaseMessage {
  type: WorkspaceMessages;
  workspace?: WorkspaceDetails;
}
export interface WorkspaceCreatedMessage extends BaseMessage {
  type: WorkspaceMessages;
  workspace?: WorkspaceDetails;
}

export interface CreateWorkspaceRequest extends BaseRequest {
  workspace: WorkspaceDetails;
}

export interface StartTrialRequest extends BaseRequest {
  workspaceId: string;
  name: string;
  mail: string;
  company: string;
  phone: string;
  testType: WorkspaceType;
  userCount: string;
}

export interface UpdateWorkspaceRequest extends BaseRequest {
  workspace: WorkspaceDetails;
}

export interface DeleteWorkspaceRequest extends BaseRequest {
  workspaceId: string;
}

export interface InviteWorkspaceMemberRequest extends BaseRequest {
  workspaceId: string;
  userIdOrUserMail: string[];
  memberRole: WorkspaceRole;
  invitationMessage: string; // Nachricht im Markdown-Format
}

export interface RemoveWorkspaceMemberRequest extends BaseRequest {
  workspaceId: string;
  userId: string;
}

export interface SetMemberRoleRequest extends BaseRequest {
  workspaceId: string;
  userId: string;
  memberRole: WorkspaceRole;
}
