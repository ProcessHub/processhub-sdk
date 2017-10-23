import { InstanceDetails } from "../instance/instanceinterfaces";
import { tl } from "../tl";
import { isTrue } from "../tools/assert";
import { nullId } from "../tools/guid";
import { WorkspaceDetails } from "../workspace";

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
    instances?: InstanceDetails[];
    viewStates?: ViewStates;
  };
  accountState?: AccountState;
  isLibraryAdmin?: boolean;
}

export enum UserExtras {
  None = 0,
  ExtrasWorkspaces = 1 << 0, // get workspaces where user is a member
  ExtrasWorkspacesWithMembersAndProcesses = 1 << 1,  // the sidebar needs fully loaded workspaces to display
  ExtrasInstances = 1 << 2,  // instances visible to user
  ExtrasViewStates = 1 << 3  // user-specific last opening-dates of instances, used to sync notifications on all user devices
}

export const emptyUser: UserDetails = {
  userId: nullId(),
  mail: null,
  realName: null,
  extras: {},
};

export function getUserWorkspace(user: UserDetails, workspaceId: string): WorkspaceDetails {
  if (user == null)
    return null; 

  // ExtrasWorkspaces required
  isTrue(user.extras.workspaces != null, "getUserWorkspace: user.extras.workspaces == null");

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
      return tl("ProcessHub Community (öffentlich)");
    case PredefinedGroups.Everybody:
      return tl("Jeder (gestattet externe Teilnahme mit Mailadresse)");
    case PredefinedGroups.AllWorkspaceMembers:
      return tl("Alle Mitglieder des Teams");
    case PredefinedGroups.AllParticipants:
      return tl("Nur Prozessbeteiligte Mitglieder des Teams");
  }
}

// Sonderfall weil seltsamerweise undefined wenn es in den Actions ist
export const UserActionsType = {
  LoggedIn: "USERACTION_LOGGEDIN", // Benutzer hat sich erfolgreich angemeldet
  Failed: "USERACTION_FAILED" // Allgemeiner Api-Aufruffehler
};
export type UserActionsType = keyof typeof UserActionsType;

// tracks last view datetimes of instances and/or processes
// used to sync notification states across devices
export interface ViewState {
  lastViewedAt?: Date;  // last time instancePopup for this instance was opened
  isPinned?: boolean;  // instance/process pinned to sidebar?
}
export interface ViewStates {
  [objectId: string]: ViewState;
}