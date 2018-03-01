import { WorkspaceDetails, WorkspaceType, WorkspaceRole } from "./workspaceinterfaces";

// does license include modeler?
export function licenseHasModeler(workspace: WorkspaceDetails): boolean {
  return licenseIsDemoOrHigher(workspace); 
}

// does license include PotentialRoleOwners?
export function licenseHasPotentialRoleOwners(workspace: WorkspaceDetails): boolean {
  return true;
}

// does license define managers and owners per process?
export function licenseHasManagersAndOwners(workspace: WorkspaceDetails): boolean {
  return licenseIsBusinessOrHigher(workspace);
}

// does license allow to select who can see instances?
export function licenseHasInstanceVisibility(workspace: WorkspaceDetails): boolean {
  return licenseIsTeamOrHigher(workspace);
}

// does license allow to select members as admins?
export function licenseHasWorkspaceAdmins(workspace: WorkspaceDetails): boolean {
  return licenseIsTeamOrHigher(workspace);
}
// does license allow to select members as process managers?
export function licenseHasWorkspaceProcessManagers(workspace: WorkspaceDetails): boolean {
  // seems too complicated
  return false;
}


export function licenseIsFree(workspace: WorkspaceDetails): boolean {
  return workspace && workspace.workspaceType == WorkspaceType.Free;
}

export function licenseIsDemo(workspace: WorkspaceDetails): boolean {
  return workspace && workspace.workspaceType == WorkspaceType.Demo;
}
export function licenseIsDemoOrHigher(workspace: WorkspaceDetails): boolean {
  return workspace && workspace.workspaceType >= WorkspaceType.Demo;
}

export function licenseIsTeam(workspace: WorkspaceDetails): boolean {
  return workspace && workspace.workspaceType == WorkspaceType.Team;
}
export function licenseIsTeamOrHigher(workspace: WorkspaceDetails): boolean {
  return workspace && workspace.workspaceType >= WorkspaceType.Team;
}

export function licenseIsBusiness(workspace: WorkspaceDetails): boolean {
  return workspace && workspace.workspaceType == WorkspaceType.Business;
}
export function licenseIsBusinessOrHigher(workspace: WorkspaceDetails): boolean {
  return workspace && workspace.workspaceType >= WorkspaceType.Business;
}
