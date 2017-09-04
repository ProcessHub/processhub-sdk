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

  return ((workspace.userRole & PH.Workspace.WorkspaceRole.WorkspaceAdmin) != 0 && hasProcessManagerLicense(workspace));
}

export function hasProcessManagerLicense(workspace: PH.Workspace.WorkspaceDetails): boolean {
  if (workspace == null)
    return false;

  return ((workspace.userRole & PH.Workspace.WorkspaceRole.ProcessManagerLicense) != 0);
}

// Die eigentliche Sicherheitsprüfung erfolgt NICHT über die Rollen, sondern über die folgenden canXX()-Prüffunktionen

export function canEditWorkspace(workspace: PH.Workspace.WorkspaceDetails): boolean {  
  // Alle Teilnehmer mit Benutzerlizenz können derzeit weitere Teilnehmer einladen
  return isWorkspaceAdmin(workspace);
}

export function canViewMembers(workspace: PH.Workspace.WorkspaceDetails): boolean {
  // TODO: Eigentlich sollen nur Mitglieder andere Teilnehmer sehen. Die im Hintergrund liegende Funktion getWorkspaceMembers
  // wird derzeit aber noch häufig benötigt. Das muss langfristig angepasst werden.
  return isWorkspaceMember(workspace);
}

export function canInviteMembers(workspace: PH.Workspace.WorkspaceDetails): boolean {
  // Alle Teilnehmer mit Benutzerlizenz können derzeit weitere Teilnehmer einladen
  return hasProcessManagerLicense(workspace);
}

export function canCreateProcess(workspace: PH.Workspace.WorkspaceDetails): boolean {
  return hasProcessManagerLicense(workspace);
}