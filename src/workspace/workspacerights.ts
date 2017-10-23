import { WorkspaceDetails, WorkspaceRole, WorkspaceType } from "./workspaceinterfaces";

export function isFreeWorkspace(workspace: WorkspaceDetails): boolean {
  if (workspace == null)
    return false;

  return (workspace != null && workspace.workspaceType == WorkspaceType.Free);
}

export function isDemoWorkspace(workspace: WorkspaceDetails): boolean {
  if (workspace == null)
    return false;

  return (workspace != null && workspace.workspaceType == WorkspaceType.Demo);
}

export function isWorkspaceMember(workspace: WorkspaceDetails): boolean {
  if (workspace == null)
    return false;

  return (workspace.userRole != null && workspace.userRole != WorkspaceRole.None);
}

export function isWorkspaceAdmin(workspace: WorkspaceDetails): boolean {
  if (workspace == null)
    return false;

  return ((workspace.userRole & WorkspaceRole.WorkspaceAdmin) != 0);
}

// Access control in code should NOT use the roles above but instead the following can...-checks

export function canEditWorkspace(workspace: WorkspaceDetails): boolean {  
  return isWorkspaceAdmin(workspace);
}

export function canViewMembers(workspace: WorkspaceDetails): boolean {
  return isWorkspaceMember(workspace);
}

export function canInviteMembers(workspace: WorkspaceDetails): boolean {
  return isWorkspaceAdmin(workspace);
}

export function canCreateProcess(workspace: WorkspaceDetails): boolean {
  return isWorkspaceAdmin(workspace);
}