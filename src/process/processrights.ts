import { tl } from "../tl";
import { UserDetails } from "../user/userinterfaces";
import { BpmnProcess, BPMN_TIMEREVENTDEFINITION, BPMN_MESSAGEEVENTDEFINITION } from "./bpmn/bpmnprocess";
import { WorkspaceDetails, WorkspaceType } from "../workspace/workspaceinterfaces";
import { PredefinedGroups, getDefaultRoleGroup } from "../user/index";
import { ProcessDetails } from "./processinterfaces";
import { isWorkspaceMember } from "../workspace/workspacerights";
import { error } from "../tools/assert";
import { isGroupId, isUserId } from "../tools/guid";
import { Bpmn } from "./bpmn";
import * as WorkspaceLicenses from "../workspace/workspacelicenses";
import { GroupDetails } from "../group";
import _ = require("lodash");
import { isRoxtraEdition } from "../settings";

export enum ProcessAccessRights {
  None = 0,
  EditProcess = 1 << 0,
  ManageProcess = 1 << 1,
  StartProcess = 1 << 2,
  ViewProcess = 1 << 3,
  ViewArchive = 1 << 4,  // access to archive tab (available for all workspace members)
  ViewTodos = 1 << 6,  // access to dashboard tab (available for all members and guests)
  ViewAllTodos = 1 << 7,  // user can see all instances, not only instance with own role
  StartProcessByMail = 1 << 8,  // user can start this process by mail
  StartProcessByTimer = 1 << 9  // user can start this process by timer
}

export interface ProcessRoles {
  [roleId: string]: ProcessRole; // roleId ist RollenId bzw. LaneId des Prozesses
}
export const DefaultRoles = {
  Owner: "OWNER", // DO NOT CHANGE - string used in database
  Manager: "MANAGER", // DO NOT CHANGE - string used in database
  Viewer: "VIEWER", // DO NOT CHANGE - string used in database
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
      return tl("Weitere Beteiligte");
  }
}

export interface ProcessRole {
  // DO NOT CHANGE MEMBER NAMES - object stored in Db in json-format 
  roleName?: string;
  potentialRoleOwners: RoleOwner[];
  isStartingRole?: boolean;  // this role is allowed to start the process
  isStartingByMailRole?: boolean;  // this role is allowed to start the process with an incoming mail
  isStartingByTimerRole?: boolean;  // this role is allowed to start the process with an timer
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
    || roleId == DefaultRoles.Follower
    || roleId == DefaultRoles.Viewer);
}

export function isDefaultProcessRole(roleId: string): boolean {
  return (roleId == DefaultRoles.Manager
    || roleId == DefaultRoles.Owner
    || roleId == DefaultRoles.Viewer);
}

export function getProcessRoles(currentRoles: ProcessRoles, bpmnProcess: BpmnProcess, workspace: WorkspaceDetails): ProcessRoles {
  // add entries for all existing roles in the process
  let processRoles = currentRoles;
  if (processRoles == null)
    processRoles = {};

  // public processes have been removed for now, does not seem to make sense with current version
  if (workspace.workspaceType == WorkspaceType.Templates) {
    processRoles[DefaultRoles.Viewer] = { potentialRoleOwners: [{ memberId: PredefinedGroups.Public }] };
  }

  // Demo and Free workspaces don't have owners or managers -> remove from roles if they exists
  if (!WorkspaceLicenses.licenseHasManagersAndOwners(workspace)) {
    delete (processRoles[DefaultRoles.Owner]);
    delete (processRoles[DefaultRoles.Manager]);
  }

  // everybody can be added as a follower
  processRoles[DefaultRoles.Follower] = { potentialRoleOwners: [{ memberId: getDefaultRoleGroup() }], allowMultipleOwners: true };

  if (bpmnProcess != null) {
    // set default owners for all roles
    let lanes = bpmnProcess.getLanes(false);
    lanes.map(lane => {
      if (processRoles[lane.id] == null) {
        processRoles[lane.id] = { potentialRoleOwners: [{ memberId: getDefaultRoleGroup() }] };
      }
      processRoles[lane.id].roleName = lane.name;

      // clean up starting role setting from all lanes, will be added again in next step
      delete (processRoles[lane.id].isStartingRole);
      delete (processRoles[lane.id].isStartingByMailRole);
      delete (processRoles[lane.id].isStartingByTimerRole);
    });

    // set starting roles
    const startEvents = bpmnProcess.getStartEvents(bpmnProcess.processId());
    startEvents.map(startEvent => {
      const isMessageStartEvent: boolean = startEvent.eventDefinitions != null && startEvent.eventDefinitions.find(e => e.$type === BPMN_MESSAGEEVENTDEFINITION) != null;
      const isTimerStartEvent: boolean = startEvent.eventDefinitions != null && startEvent.eventDefinitions.find(e => e.$type === BPMN_TIMEREVENTDEFINITION) != null;
      let role = bpmnProcess.getLaneOfFlowNode(startEvent.id);
      if (role) { // in new processes somehow the start element is not in a lane (yet)
        if (isMessageStartEvent) {
          processRoles[role.id].isStartingByMailRole = true;
        } else if (isTimerStartEvent) {
          processRoles[role.id].isStartingByTimerRole = true;
        } else {
          processRoles[role.id].isStartingRole = true;
        }
      }
    });

    // remove roles that are not used any more
    for (let role in processRoles) {
      if (role != DefaultRoles.Owner && role != DefaultRoles.Manager && role != DefaultRoles.Viewer && role != DefaultRoles.Follower) {
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

  const { groups } = workspace.extras;
  if (!groups) {
    console.error("isPotentialRoleOwner called without valid workspace.extras.groups");
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
      || member.memberId == PredefinedGroups.Everybody)) {
      return true;
    }
    if (member.memberId == PredefinedGroups.AllWorkspaceMembers ||
      (ignorePublic && (member.memberId == PredefinedGroups.Public || member.memberId == PredefinedGroups.Everybody))) {
      if (isWorkspaceMember(workspace))
        return true;
    }
    if (user && isGroupId(member.memberId)) {
      const group: GroupDetails = groups.find(g => g.groupId === member.memberId);
      if (group) {
        if (group.members.find(gm => gm.userId === user.userId) != null) {
          return true;
        }
      }
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

function addIfLicenseAllows(owners: PotentialRoleOwners, user: UserDetails): void {
  if (isRoxtraEdition) {
    if (user.extras.roXtra.HasEFormulareEditAccess) {
      owners.potentialRoleOwner.push({
        memberId: user.userId,
        displayName: user.displayName
      });
    }
  } else {
    owners.potentialRoleOwner.push({
      memberId: user.userId,
      displayName: user.displayName
    });
  }
}

export function getPotentialRoleOwners(workspaceDetails: WorkspaceDetails, processDetails: ProcessDetails, roleId: string = null): { [roleId: string]: PotentialRoleOwners } {
  let allOwners: { [roleId: string]: PotentialRoleOwners } = {};

  if (processDetails.extras.processRoles == null) {
    return allOwners;
  }

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
          // all workspace members are potential owners
          if (workspaceDetails.extras.members) {
            // if someone is not a workspace member he does not have access to the member list, so this list is empty
            for (let member of workspaceDetails.extras.members) {
              addIfLicenseAllows(owners, member.userDetails);
            }
            addedWsMembers = true; // Merken, damit Member nicht mehrfach hinzugefügt werden, falls beide Gruppen genannt werden
          }
        } else if (isUserId(potentialOwner.memberId)) {
          owners.potentialRoleOwner.push({
            memberId: potentialOwner.memberId,
            displayName: potentialOwner.displayName
          });
        } else if (isGroupId(potentialOwner.memberId)) {
          if (workspaceDetails.extras.groups) {
            const group: GroupDetails = workspaceDetails.extras.groups.find(g => g.groupId === potentialOwner.memberId);
            if (group && group.members) {
              for (const member of group.members) {
                addIfLicenseAllows(owners, member);
              }
            }
          }
        } else {
          error("invalid call");
        }
      }
      allOwners[role] = owners;
    }
  }
  return allOwners;
}

export function processIsPublic(process: ProcessDetails): boolean {
  if (process.extras.processRoles)
    return (process.extras.processRoles[DefaultRoles.Viewer].potentialRoleOwners[0].memberId == PredefinedGroups.Public);

  else
    return false;
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
  if (process != null && !process.isNewProcess) {
    const bpmnProcess: BpmnProcess = process.extras.bpmnProcess;
    if (bpmnProcess) {
      const startEvents: Bpmn.StartEvent[] = bpmnProcess.getStartEvents(bpmnProcess.processId());
      const startEventsWithoutDefinitions: Bpmn.StartEvent[] = startEvents.filter(e => e.eventDefinitions == null || e.eventDefinitions.length === 0);
      return startEventsWithoutDefinitions.length > 0;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function canStartProcess(process: ProcessDetails, startEventId: string): boolean {
  if (process == null)
    return false;

  if (startEventId == null)
    return false;

  if (process.userStartEvents == null || _.isEqual(process.userStartEvents, {}))
    return canStartProcessOld(process);

  // if userStartEvent is in map, user is allowed to start process
  return process.userStartEvents[startEventId] != null;
}
export function canStartProcessOld(process: ProcessDetails): boolean {
  if (process == null)
    return false;

  // Only users in the start lane may start the process - even administrators don't inherit that right!
  return ((process.userRights & ProcessAccessRights.StartProcess) != 0);
}
export function canStartProcessByMail(process: ProcessDetails): boolean {
  if (process == null)
    return false;

  // Only users in the start lane may start the process - even administrators don't inherit that right!
  return ((process.userRights & ProcessAccessRights.StartProcessByMail) != 0);
}
export function canStartProcessByTimer(process: ProcessDetails): boolean {
  if (process == null)
    return false;

  // Only timer in the start lane may start the process - even administrators don't inherit that right!
  return ((process.userRights & ProcessAccessRights.StartProcessByTimer) != 0);
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

export function canViewArchive(process: ProcessDetails): boolean {
  if (process == null)
    return false;

  return ((process.userRights & ProcessAccessRights.ViewArchive) != 0);
}

export function canDeleteProcess(process: ProcessDetails): boolean {
  return isProcessOwner(process) && !process.isNewProcess;
}