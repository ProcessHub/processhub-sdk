import { WorkspaceDetails } from "../workspace";
import { TodoDetails } from "../todo";
import * as PH from "../";

export class UserDetails {
  userId: string;
  mail: string;
  urlName?: string;     // Eindeutiger, url-kompatibler Name. Wird derzeit als userId.toLowerCase() gesetzt,
  // damit in Urls Privatsphäre geschützt wird
  realName: string;     // Realname des Users
  displayName?: string; // Realname oder Mailadresse, falls kein Name angegeben
  photoUrl?: string;    // Url zum Profilbild
  extras: {             // Erweiterte Daten, die nach Bedarf ermittelt werden. 
    // Details zum extras-Prinzip siehe workspaceobjects.ts
    workspaces?: WorkspaceDetails[];  // Workspaces, zu denen User gehört (>=1)
    accessToken?: string;  // Wird bei Api-Zugriffen vom Server gesetzt (z.B. für Logout erforderlich)
    todos?: TodoDetails[]; // 
  };
  accountState?: AccountState;
  isLibraryAdmin?: boolean;
}

export enum AccountState {
  Preregistered, // Einladung versandt oder als Gastuser im System
  Registered, // User hat sich registriert, Mailadresse aber noch nicht bestätigt
  Confirmed, // Mailadresse wurde bestätigt
  Deleted
}

// Erste Gruppendefinitionen - echtes Gruppenmanagement folgt später
export const PredefinedGroups = {
  Public: "10000000060F0001", // Fixe GruppenId für öffentlichen Zugriff
  Everybody: "10000000060E0004", // Jeder (entspricht Public mit anderer Bezeichnung für anderen Einsatzbereich)
  AllWorkspaceMembers: "100000003A500002", // Fixe GruppenId für alle Workspace-Mitglieder
  AllParticipants: "1000000000445003" // Alle Beteiligten am Prozess
};
export type PredefinedGroups = keyof typeof PredefinedGroups;

export function isPredefinedGroup(groupId: string): boolean {
  return (groupId == PredefinedGroups.Public
    || groupId == PredefinedGroups.Everybody
    || groupId == PredefinedGroups.AllWorkspaceMembers
    || groupId == PredefinedGroups.AllParticipants);
}

export function getPredefinedGroupName(groupId: string): string {
  switch (groupId) {
    case PredefinedGroups.Public:
      return PH.tl("ProcessHub Community (öffentlich)");
    case PredefinedGroups.Everybody:
      return PH.tl("Jeder (gestattet externe Teilnahme mit Mailadresse)");
    case PredefinedGroups.AllWorkspaceMembers:
      return PH.tl("Alle Mitglieder des Arbeitsbereichs");
    case PredefinedGroups.AllParticipants:
      return PH.tl("Nur Prozessbeteiligte");
  }
}
