import * as PH from "../";

export enum ProcessAccessRights {
  None = 0,
  EditProcess = 1 << 0,
  ManageProcess = 1 << 1,
  StartProcess = 1 << 2, // User darf Prozess starten
  ViewProcess = 1 << 3,
  ViewDashboard = 1 << 4,
  CouldViewDashboard = 1 << 5,  // User würde Dashboard sehen, hat jedoch keine ausreichende Lizenz
}

export interface ProcessRoles {
  [roleId: string]: ProcessRole; // roleId ist RollenId bzw. LaneId des Prozesses
}
export const DefaultRoles = {
  Owner: "OWNER", // String in Datenbank - nicht ändern
  Manager: "MANAGER", // String in Datenbank - nicht ändern
  Viewer: "VIEWER" // String in Datenbank - nicht ändern
};
export type DefaultRoles = keyof typeof DefaultRoles;

export function getDefaultRoleName(roleId: string): string {
  switch (roleId) {
    case DefaultRoles.Owner:
      return PH.tl("Prozesseigner");
    case DefaultRoles.Manager:
      return PH.tl("Prozessmanager");
    case DefaultRoles.Viewer:
      return PH.tl("Sichtbarkeit");
  }
}

export interface ProcessRole {
  // Objekt wird als Json in Datenbank gespeichert - Membernamen nicht ändern!
  roleName?: string;
  potentialRoleOwners: RoleOwner[];
  isStartingRole?: boolean; // Diese Rolle kann den Prozess starten
}
export interface PotentialRoleOwners {
  allowGuests?: boolean; // Gäste sind für die Rolle ebenfalls zugelassen
  potentialRoleOwner: RoleOwner[];
}
export interface RoleOwnerMap {
  [roleId: string]: RoleOwner[]; // Array, da es später auch mehrere gleichzeitige Rolleninhaber geben könnte
}

export interface RoleOwner {
  memberId: string; // UserId, GroupId oder Mailadresse
  displayName?: string;
}

export function isDefaultRole(roleId: string): boolean {
  return (roleId == DefaultRoles.Manager
    || roleId == DefaultRoles.Owner
    || roleId == DefaultRoles.Viewer);
}
