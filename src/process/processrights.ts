import { tl } from "../tl";
import { error, isFalse, isTrue } from "../tools/assert";
import { isGroupId, isUserId } from "../tools/guid";
import { PredefinedGroups } from "../user/index";
import { UserDetails } from "../user/userinterfaces";
import { WorkspaceDetails, WorkspaceType } from "../workspace/workspaceinterfaces";
import { isWorkspaceMember } from "../workspace/workspacerights";
import { BpmnProcess } from "./bpmn/bpmnprocess";
import { ProcessDetails } from "./processinterfaces";

export enum ProcessAccessRights {
  None = 0,
  EditProcess = 1 << 0,
  ManageProcess = 1 << 1,
  StartProcess = 1 << 2,
  ViewProcess = 1 << 3,
  ViewInstances = 1 << 4,  // access to instances tab, user sees instances with own roles
  ViewAllInstances = 1 << 5,  // user can see all instances
  ViewTodos = 1 << 6,
  ViewAllTodos = 1 << 7
}

export interface ProcessRoles {
  [roleId: string]: ProcessRole; // roleId ist RollenId bzw. LaneId des Prozesses
}
export const DefaultRoles = {
  Owner: "OWNER", // DO NOT CHANGE - string used in database
  Manager: "MANAGER", // DO NOT CHANGE - string used in database
  Viewer: "VIEWER", // DO NOT CHANGE - string used in database
  InstanceOwner: "IOWNER", // DO NOT CHANGE - string used in database
  Follower: "FOLLOWER" // DO NOT CHANGE - string used in database
};
export type DefaultRoles = keyof typeof DefaultRoles;

export function getDefaultRoleName(roleId: string): string {
  switch (roleId) {
    case DefaultRoles.Owner:
      return tl("Prozesseigner");
    case DefaultRoles.Manager:
      return tl("Prozessmanager");
    case DefaultRoles.Viewer:
      return tl("Sichtbarkeit");
    case DefaultRoles.Follower:
      return tl("Follower");      
  }
}

export interface ProcessRole {
  // DO NOT CHANGE MEMBER NAMES - object stored in Db in json-format 
  roleName?: string;
  potentialRoleOwners: RoleOwner[];
  isStartingRole?: boolean;  // this role is allowed to start the process
  allowMultipleOwners?: boolean;  // role can have multiple simultaneous role owners 
}
export interface PotentialRoleOwners {
  potentialRoleOwner: RoleOwner[];
}
export interface RoleOwnerMap {
  [roleId: string]: RoleOwner[]; // Array, da es später auch mehrere gleichzeitige Rolleninhaber geben könnte
}

export interface RoleOwner {
  memberId: string; // UserId, GroupId oder Mailadresse
  displayName?: string;
  user?: UserDetails;
}

export function isDefaultRole(roleId: string): boolean {
  return (roleId == DefaultRoles.Manager
    || roleId == DefaultRoles.Owner
    || roleId == DefaultRoles.Viewer);
}

export function getProcessRoles(currentRoles: ProcessRoles, bpmnProcess: BpmnProcess, workspace: WorkspaceDetails): ProcessRoles {
  // add entries for all existing roles in the process
  let processRoles = currentRoles;
  if (processRoles == null)
    processRoles = {};

  if (processRoles[DefaultRoles.Viewer] == null) {
    // Vorgabewert für Prozessansicht
    if (workspace.workspaceType == WorkspaceType.Demo || workspace.workspaceType == WorkspaceType.Free)
      processRoles[DefaultRoles.Viewer] = { potentialRoleOwners: [{ memberId: PredefinedGroups.Public }] };
    else
      processRoles[DefaultRoles.Viewer] = { potentialRoleOwners: [{ memberId: PredefinedGroups.AllWorkspaceMembers }] };
  }

  if (processRoles[DefaultRoles.Owner] == null && workspace.workspaceType != WorkspaceType.Demo && workspace.workspaceType != WorkspaceType.Free) {
    processRoles[DefaultRoles.Owner] = { potentialRoleOwners: [] };
  }
  if (processRoles[DefaultRoles.Manager] == null && workspace.workspaceType != WorkspaceType.Demo && workspace.workspaceType != WorkspaceType.Free) {
    processRoles[DefaultRoles.Manager] = { potentialRoleOwners: [] };
  }

  // Everybody can be added as a follower
  processRoles[DefaultRoles.Follower] = { potentialRoleOwners: [{ memberId: PredefinedGroups.Everybody }], allowMultipleOwners: true };

  if (bpmnProcess != null) {
    // Alle Lanes mit Vorgabewerten belegen
    let lanes = bpmnProcess.getLanes(bpmnProcess.processId(), true);
    lanes.map(lane => {
      if (processRoles[lane.id] == null) {
        processRoles[lane.id] = { potentialRoleOwners: [{ memberId: PredefinedGroups.Everybody }] };
      }
      processRoles[lane.id].roleName = lane.name;
    });

    // set starting roles
    const startLanes: string[] = bpmnProcess.getStartLaneIds();
    for (const role in processRoles) {
      processRoles[role].isStartingRole = (startLanes && (undefined !== startLanes.find(s => s === role)));
    }

    // Im Prozess nicht mehr vorhandene Lanes entfernen
    for (let role in processRoles) {
      if (role != DefaultRoles.Owner && role != DefaultRoles.Manager && role != DefaultRoles.Viewer) {
        if (lanes.find(lane => lane.id == role) == null)
          delete (processRoles[role]);
      }
    }
  }

  return processRoles;
}

export function isPotentialRoleOwner(user: UserDetails, roleId: string, workspace: WorkspaceDetails, process: ProcessDetails, ignorePublic: boolean = false): boolean {
  // user == null -> check if guest is PotentialRoleOwner
  // roleId == null -> check if user is PotentialRoleOwner of any role
  let roles = process.extras.processRoles;
  if (roles == null) {
    console.error("isPotentialRoleOwner called without valid process.extras.processRoles");  
    return false;
  }

  if (roleId == null) {
    // check if user is PotentialRoleOwner of any role
    for (let role in roles) {
      if (isPotentialRoleOwner(user, role, workspace, process, ignorePublic) == true)
        return true;
    }
    return false;
  }

  if (roles[roleId] == null || roles[roleId].potentialRoleOwners == null)
    return false;

  for (let member of roles[roleId].potentialRoleOwners) {
    if (user && member.memberId == user.userId) {
      // always accept current roleOwners (process might have been changed, we still want to accept existing owners)
      return true;
    }
    if (!ignorePublic && (member.memberId == PredefinedGroups.Public
      || member.memberId == PredefinedGroups.Everybody))
      return true;
    if (member.memberId == PredefinedGroups.AllWorkspaceMembers ||
      (ignorePublic && (member.memberId == PredefinedGroups.Public || member.memberId == PredefinedGroups.Everybody))) {
      if (isWorkspaceMember(workspace))
        return true;
    }
  }

  if (roleId == DefaultRoles.Viewer) {
    if (roles[roleId].potentialRoleOwners.find(potentialRoleOwner => potentialRoleOwner.memberId == PredefinedGroups.AllParticipants)
      || roles[roleId].potentialRoleOwners.find(potentialRoleOwner => potentialRoleOwner.memberId == PredefinedGroups.Public)) {
      // Bei Sichtbarkeit "AllParticipants" oder "Public" muss geprüft werden, ob User in einer der anderen Rollen eingetragen ist
      // Der Fall Public ist nur bei ignorePublic relevant
      for (let role in roles) {
        if (role != DefaultRoles.Viewer
          // AllParticipants soll allen Teilnehmern, die eine Rolle im Prozess haben, Lesezugriff gewähren. Allerdings 
          // nur den explizit genannten Teilnehmern, nicht der Public-Gruppe, sonst wäre jeder Prozess,
          // bei dem externe Personen teilnehmen dürfen, automatisch Public.
          && isPotentialRoleOwner(user, role, workspace, process, true)) {
          return true;
        }
      }
    }
  }

  return false;
}

export function getPotentialRoleOwners(workspaceDetails: WorkspaceDetails, processDetails: ProcessDetails, roleId: string = null): { [roleId: string]: PotentialRoleOwners } {
  // Diese Funktion soll die User auflisten, die die angegebene Rolle ausfüllen dürfen. Das ist nur für
  // normale Rollen im Prozess sinnvoll, nicht für die vordefinierten Rollen, da zu diesen kein Inhaber ausgewählt werden muss.
  isFalse(isDefaultRole(roleId));

  let allOwners: { [roleId: string]: PotentialRoleOwners } = {};

  isTrue(workspaceDetails != null, "WorkspaceDetails dürfen nicht null sein!");
  isTrue(workspaceDetails.extras.members != null, "Es müssen Workspace Details geliefert werden, die WorkspaceMembers beinhalten!");

  // todo überprüfen ob jeder user einen Namen hat der über die processDetails kommt (außer gruppen)
  if (processDetails.extras.processRoles == null)
    return allOwners;
  
  for (let role in processDetails.extras.processRoles) {
    if ((roleId == null || role == roleId) && processDetails.extras.processRoles[role]) {
      let owners: PotentialRoleOwners = {
        potentialRoleOwner: []
      };
      let addedWsMembers = false;
      for (let potentialOwner of processDetails.extras.processRoles[role].potentialRoleOwners) {
        if ((potentialOwner.memberId == PredefinedGroups.AllWorkspaceMembers
          || potentialOwner.memberId == PredefinedGroups.Everybody)
          && !addedWsMembers) {
          // Alle WorkspaceMember kommen als potentielle Rolleninhaber in Frage
          for (let member of workspaceDetails.extras.members) {
            owners.potentialRoleOwner.push({
              memberId: member.userDetails.userId,
              displayName: member.userDetails.realName
            });
          }
          addedWsMembers = true; // Merken, damit Member nicht mehrfach hinzugefügt werden, falls beide Gruppen genannt werden
        } else if (isUserId(potentialOwner.memberId)) {
          owners.potentialRoleOwner.push({
            memberId: potentialOwner.memberId,
            displayName: potentialOwner.displayName
          });
        } else if (isGroupId(potentialOwner.memberId)) {
          error("nicht implementiert");
        } else
          error("ungültiger Aufruf?!");
      }
      allOwners[role] = owners;
    }
  }

  return allOwners;
}

export function isProcessOwner(process: ProcessDetails): boolean {
  if (process == null)
    return false;

  return ((process.userRights & ProcessAccessRights.EditProcess) != 0);
}

export function isProcessManager(process: ProcessDetails): boolean {
  if (process == null)
    return false;

  // owner are managers
  return isProcessOwner(process) || ((process.userRights & ProcessAccessRights.ManageProcess) != 0);
}

export function canViewProcess(process: ProcessDetails): boolean {
  if (process == null)
    return false;

  return ((process.userRights & ProcessAccessRights.ViewProcess) != 0);
}

export function canEditProcess(process: ProcessDetails): boolean {
  return isProcessOwner(process);
}

export function canSimulateProcess(process: ProcessDetails): boolean {
  // Currently everybody is allowed to simulate
  return process != null && !process.isNewProcess;
}

export function canStartProcess(process: ProcessDetails): boolean {
  if (process == null)
    return false;

  // Only users in the start lane may start the process - even administrators don't inherit that right!
  return ((process.userRights & ProcessAccessRights.StartProcess) != 0);
}

export function canViewTodos(process: ProcessDetails): boolean {
  if (process == null)
    return false;

  return canViewAllTodos(process) || ((process.userRights & ProcessAccessRights.ViewTodos) != 0);
}
export function canViewAllTodos(process: ProcessDetails): boolean {
  if (process == null)
    return false;

  return ((process.userRights & ProcessAccessRights.ViewAllTodos) != 0);
}

export function canViewInstances(process: ProcessDetails): boolean {
  if (process == null)
    return false;

  return canViewAllInstances(process) || ((process.userRights & ProcessAccessRights.ViewInstances) != 0);
}
export function canViewAllInstances(process: ProcessDetails): boolean {
  if (process == null)
    return false;

  return ((process.userRights & ProcessAccessRights.ViewAllInstances) != 0);
}

export function canDeleteProcess(process: ProcessDetails): boolean {
  return isProcessOwner(process) && !process.isNewProcess;
}