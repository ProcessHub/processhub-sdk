import * as PH from "../";

// WorkspaceRequestRoutes
export const WorkspaceRequestRoutes = {
  LoadWorkspace: "/api/workspace/load",
  CreateWorkspace: "/api/workspace/create",
  InviteWorkspaceMember: "/api/workspace/invitemember",
  RemoveWorkspaceMember: "/api/workspace/removemember",
  UpdateWorkspace: "/api/workspace/update",
  DeleteWorkspace: "/api/workspace/delete",
  SetMemberRole: "/api/workspace/setmemberrole",
  GetWorkspacesForUser: "/api/workspace/workspacesforuser"
};
export type WorkspaceRequestRoutes = keyof typeof WorkspaceRequestRoutes;


export interface LoadWorkspaceRequest extends PH.LegacyApi.BaseRequest {
  workspaceId: string;
  getExtras: PH.Workspace.WorkspaceExtras;
}
export interface LoadWorkspaceReply extends PH.LegacyApi.BaseMessage {
  type: PH.Workspace.WorkspaceMessages;
  workspace?: PH.Workspace.WorkspaceDetails;
}


export interface WorkspaceLoadedMessage extends PH.LegacyApi.BaseMessage {
  type: PH.Workspace.WorkspaceMessages;
  workspace?: PH.Workspace.WorkspaceDetails;
}
export interface WorkspaceCreatedMessage extends PH.LegacyApi.BaseMessage {
  type: PH.Workspace.WorkspaceMessages;
  workspace?: PH.Workspace.WorkspaceDetails;
}

export interface CreateWorkspaceRequest extends PH.LegacyApi.BaseRequest {
  workspace: PH.Workspace.WorkspaceDetails;
}

export interface UpdateWorkspaceRequest extends PH.LegacyApi.BaseRequest {
  workspace: PH.Workspace.WorkspaceDetails;
}

export interface DeleteWorkspaceRequest extends PH.LegacyApi.BaseRequest {
  workspaceId: string;
}

export interface InviteWorkspaceMemberRequest extends PH.LegacyApi.BaseRequest {
  workspaceId: string;
  userIdOrUserMail: string[];
  memberRole: PH.Workspace.WorkspaceRole;
  invitationMessage: string; // Nachricht im Markdown-Format
}

export interface RemoveWorkspaceMemberRequest extends PH.LegacyApi.BaseRequest {
  workspaceId: string;
  userId: string;
}

export interface SetMemberRoleRequest extends PH.LegacyApi.BaseRequest {
  workspaceId: string;
  userId: string;
  memberRole: PH.Workspace.WorkspaceRole;
}

export interface GetWorkspacesForUserRequest extends PH.LegacyApi.BaseRequest {
  userId: string;
}
export interface GetWorkspacesForUserReply extends PH.LegacyApi.BaseMessage {
  workspaces?: Array<PH.Workspace.WorkspaceDetails>;
}