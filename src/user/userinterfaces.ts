import { WorkspaceDetails } from "../workspace";
import { TodoDetails } from "../todo";
import * as PH from "../";

export class UserDetails {
  userId: string;
  mail: string;
  realName?: string;     
  displayName?: string; // realName or mail if no name is defined
  photoUrl?: string;  
  extras: {
    // New Extras must be added to cache-handling in useractions -> loadUser!
    workspaces?: WorkspaceDetails[];
    accessToken?: string;  // only used during login
  };
  accountState?: AccountState;
  isLibraryAdmin?: boolean;
}

export enum UserExtras {
  None = 0,
  ExtrasWorkspaces = 1 << 0, // get workspaces where user is a member
}

export const emptyUser: PH.User.UserDetails = {
  userId: PH.Tools.nullId(),
  mail: null,
  realName: null,
  extras: {},
};

export function getUserWorkspace(user: PH.User.UserDetails, workspaceId: string): PH.Workspace.WorkspaceDetails {
  if (user == null)
    return null; 

  // ExtrasWorkspaces required
  PH.Assert.isTrue(user.extras.workspaces != null, "getUserWorkspace: user.extras.workspaces == null");

  return user.extras.workspaces.find((workspace) => workspace.workspaceId == workspaceId);
}

export enum AccountState {
  // DON'T CHANGE NUMBER VALUES - used in database
  Preregistered = 0, // user invited, mail addres known but not yet registered
  Registered = 1, // user has registered but not yet confirmed mail address
  Confirmed = 2, // fully registered, mail address confirmed
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
      return PH.tl("Nur Prozessbeteiligte Mitglieder des Arbeitsbereichs");
  }
}

// Sonderfall weil seltsamerweise undefined wenn es in den Actions ist
export const UserActionsType = {
  LoggedIn: "USERACTION_LOGGEDIN", // Benutzer hat sich erfolgreich angemeldet
  LoggedOut: "USERACTION_LOGGEDOUT",
  Failed: "USERACTION_FAILED" // Allgemeiner Api-Aufruffehler
};
export type UserActionsType = keyof typeof UserActionsType;
