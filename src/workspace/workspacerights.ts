import * as PH from "../";

export function isFreeWorkspace(workspace: PH.Workspace.WorkspaceDetails): boolean {
  if (workspace == null)
    return false;

  return (workspace != null && workspace.workspaceType == PH.Workspace.WorkspaceType.Free);
}

export function isDemoWorkspace(workspace: PH.Workspace.WorkspaceDetails): boolean {
  if (workspace == null)
    return false;

  return (workspace != null && workspace.workspaceType == PH.Workspace.WorkspaceType.Demo);
}

export function isWorkspaceMember(workspace: PH.Workspace.WorkspaceDetails): boolean {
  if (workspace == null)
    return false;

  return (workspace.userRole != null && workspace.userRole != PH.Workspace.WorkspaceRole.None);
}

export function isWorkspaceAdmin(workspace: PH.Workspace.WorkspaceDetails): boolean {
  if (workspace == null)
    return false;

  return ((workspace.userRole & PH.Workspace.WorkspaceRole.WorkspaceAdmin) != 0);
}

// Access control in code should NOT use the roles above but instead the following can...-checks

export function canEditWorkspace(workspace: PH.Workspace.WorkspaceDetails): boolean {  
  return isWorkspaceAdmin(workspace);
}

export function canViewMembers(workspace: PH.Workspace.WorkspaceDetails): boolean {
  return isWorkspaceMember(workspace);
}

export function canInviteMembers(workspace: PH.Workspace.WorkspaceDetails): boolean {
  return isWorkspaceAdmin(workspace);
}

export function canCreateProcess(workspace: PH.Workspace.WorkspaceDetails): boolean {
  return isWorkspaceAdmin(workspace);
}