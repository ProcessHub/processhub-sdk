import { ProcessDetails } from "../process";
import { UserDetails } from "../user";

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
    // Erweiterte Daten, die nach Bedarf ermittelt werden. 
    // Aus Performancegründen sind die in extras enthaltenen Knoten nicht immer befüllt, sondern müssen
    // über Flags bei der serverseitigen Abfrage explizit angefragt werden (siehe SWorkspace.getWorkspaceDetails)
    // Grundkonzept:
    // Wenn ein Knoten (z.B. extras.members) == null ist, wurden die Daten nicht ermittelt.
    // Falls es wirklich keine Inhalte zum Knoten gibt, wird z.B. extras.members = [] gesetzt.
    members?: WorkspaceMember[];
    processes?: ProcessDetails[];  // Nur Prozesse, auf die der angemeldete User Zugriff hat
  };
}

export enum WorkspaceRole {
  None = 0,
  WorkspaceAdmin = 1 << 0,     // WorkspaceAdmin erzwingt ebenfalls ProcessManagerLicense
  ProcessManagerLicense = 1 << 1,
  WorkspaceMember = 1 << 2,         // Einfaches Mitglied ohne Sonderrolle
}

export interface WorkspaceMember {
  userDetails: UserDetails;
  memberRole: WorkspaceRole;
}
