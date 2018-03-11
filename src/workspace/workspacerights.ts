import { WorkspaceDetails, WorkspaceType, WorkspaceRole } from "./workspaceinterfaces";
import * as WorkspaceLicenses from "./workspacelicenses";

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

// only true if flag is set AND licenseHasWorkspaceProcessManagers()
export function isWorkspaceProcessManager(workspace: WorkspaceDetails): boolean {
  if (workspace == null || !WorkspaceLicenses.licenseHasWorkspaceProcessManagers(workspace))
    return false;

  return ((workspace.userRole & (WorkspaceRole.WorkspaceAdmin | WorkspaceRole.WorkspaceProcessManager)) != 0);
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

export function canStartTrial(workspace: WorkspaceDetails): boolean {
  // Admins can start a trial if they didn't have one before and workspace is Free
  return isWorkspaceAdmin(workspace) 
     && ((WorkspaceLicenses.licenseIsFree(workspace) && workspace.trialExpiresAt == null) || WorkspaceLicenses.licenseIsTrial(workspace));
}