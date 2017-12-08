import { WorkspaceDetails, WorkspaceType, WorkspaceRole } from "./workspaceinterfaces";

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

export function isWorkspaceGuest(workspace: WorkspaceDetails): boolean {
  if (workspace == null)
    return false;

  return ((workspace.userRole & WorkspaceRole.WorkspaceGuest) != 0);
}

export function isWorkspaceMember(workspace: WorkspaceDetails): boolean {
  if (workspace == null)
    return false;

  return (workspace.userRole != null && workspace.userRole != WorkspaceRole.None
    && (workspace.userRole & WorkspaceRole.WorkspaceGuest) == 0);
}

export function isWorkspaceAdmin(workspace: WorkspaceDetails): boolean {
  if (workspace == null)
    return false;

  // in free workspaces all members are admins
  if (workspace.workspaceType == WorkspaceType.Free && isWorkspaceMember(workspace))
    return true;

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