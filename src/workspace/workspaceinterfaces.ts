import * as PH from "../";

// WorkspaceType
export const WorkspaceType = {
  Free: "Free",
  Business: "Business",
  Enterprise: "Enterprise",
  Demo: "Demo"
};
export type WorkspaceType = keyof typeof WorkspaceType;

export interface WorkspaceDetails {
  workspaceId: string;
  workspaceType: WorkspaceType;
  urlName: string;    // Eindeutiger, url-kompatibler Name
  fullUrl?: string;
  displayName: string;
  description?: string;
  userRole?: WorkspaceRole;  // Rolle des angemeldeten Users im Workspace  
  extras: {
    // New Extras must be added to cache-handling in workspaceactions -> loadWorkspace!
    members?: WorkspaceMember[];
    processes?: PH.Process.ProcessDetails[];  // Nur Prozesse, auf die der angemeldete User Zugriff hat
    settings?: WorkspaceSettings;
  };
}

export interface WorkspaceSettings {
  mailSignature?: string;
}

export enum WorkspaceRole {
  None = 0,
  WorkspaceAdmin = 1 << 0,     // WorkspaceAdmin erzwingt ebenfalls ProcessManagerLicense
  ProcessManagerLicense = 1 << 1,
  WorkspaceMember = 1 << 2,         // Einfaches Mitglied ohne Sonderrolle
}

export interface WorkspaceMember {
  userDetails: PH.User.UserDetails;
  memberRole: WorkspaceRole;
}
