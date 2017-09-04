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
    // New Extras must be added to cache-handling in useractions -> loadUser!
    workspaces?: WorkspaceDetails[];  // Workspaces, zu denen User gehört (>=1)
    accessToken?: string;  // Wird bei Api-Zugriffen vom Server gesetzt (z.B. für Logout erforderlich)
    todos?: TodoDetails[];
  };
  accountState?: AccountState;
  isLibraryAdmin?: boolean;
}

export const emptyUser: PH.User.UserDetails = {
  userId: PH.Tools.nullId(),
  mail: null,
  realName: null,
  extras: {},
};

export function getUserWorkspace(user: PH.User.UserDetails, workspaceId: string): PH.Workspace.WorkspaceDetails {
  if (user == null)
    return null; // Kein PH.Assert, falls kein User angemeldet

  // ExtrasWorkspaces erforderlich
  PH.Assert.isTrue(user.extras.workspaces != null, "getUserWorkspace: user.extras.workspaces == null");

  return user.extras.workspaces.find((workspace) => workspace.workspaceId == workspaceId);
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

// Sonderfall weil seltsamerweise undefined wenn es in den Actions ist
export const UserActionsType = {
  LoggedIn: "USERACTION_LOGGEDIN", // Benutzer hat sich erfolgreich angemeldet
  LoggedOut: "USERACTION_LOGGEDOUT",
  Failed: "USERACTION_FAILED" // Allgemeiner Api-Aufruffehler
};
export type UserActionsType = keyof typeof UserActionsType;
