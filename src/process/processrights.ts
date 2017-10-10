import * as PH from "../";

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
      return PH.tl("Prozesseigner");
    case DefaultRoles.Manager:
      return PH.tl("Prozessmanager");
    case DefaultRoles.Viewer:
      return PH.tl("Sichtbarkeit");
    case DefaultRoles.Follower:
      return PH.tl("Follower");      
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
  user?: PH.User.UserDetails;
}

export function isDefaultRole(roleId: string): boolean {
  return (roleId == DefaultRoles.Manager
    || roleId == DefaultRoles.Owner
    || roleId == DefaultRoles.Viewer);
}

export function getProcessRoles(currentRoles: PH.Process.ProcessRoles, bpmnProcess: PH.Process.BpmnProcess, workspace: PH.Workspace.WorkspaceDetails): PH.Process.ProcessRoles {
  // add entries for all existing roles in the process
  let processRoles = currentRoles;
  if (processRoles == null)
    processRoles = {};

  if (processRoles[PH.Process.DefaultRoles.Viewer] == null) {
    // Vorgabewert für Prozessansicht
    if (workspace.workspaceType == PH.Workspace.WorkspaceType.Demo || workspace.workspaceType == PH.Workspace.WorkspaceType.Free)
      processRoles[PH.Process.DefaultRoles.Viewer] = { potentialRoleOwners: [{ memberId: PH.User.PredefinedGroups.Public }] };
    else
      processRoles[PH.Process.DefaultRoles.Viewer] = { potentialRoleOwners: [{ memberId: PH.User.PredefinedGroups.AllWorkspaceMembers }] };
  }

  if (processRoles[PH.Process.DefaultRoles.Owner] == null && workspace.workspaceType != PH.Workspace.WorkspaceType.Demo && workspace.workspaceType != PH.Workspace.WorkspaceType.Free) {
    processRoles[PH.Process.DefaultRoles.Owner] = { potentialRoleOwners: [] };
  }
  if (processRoles[PH.Process.DefaultRoles.Manager] == null && workspace.workspaceType != PH.Workspace.WorkspaceType.Demo && workspace.workspaceType != PH.Workspace.WorkspaceType.Free) {
    processRoles[PH.Process.DefaultRoles.Manager] = { potentialRoleOwners: [] };
  }

  // Everybody can be added as a follower
  processRoles[PH.Process.DefaultRoles.Follower] = { potentialRoleOwners: [{ memberId: PH.User.PredefinedGroups.Everybody }], allowMultipleOwners: true };

  if (bpmnProcess != null) {
    // Alle Lanes mit Vorgabewerten belegen
    let lanes = bpmnProcess.getLanes(bpmnProcess.processId(), true);
    lanes.map(lane => {
      if (processRoles[lane.id] == null) {
        processRoles[lane.id] = { potentialRoleOwners: [{ memberId: PH.User.PredefinedGroups.Everybody }] };
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
      if (role != PH.Process.DefaultRoles.Owner && role != PH.Process.DefaultRoles.Manager && role != PH.Process.DefaultRoles.Viewer) {
        if (lanes.find(lane => lane.id == role) == null)
          delete (processRoles[role]);
      }
    }
  }

  return processRoles;
}

export function isPotentialRoleOwner(userId: string, roleId: string, workspace: PH.Workspace.WorkspaceDetails, process: PH.Process.ProcessDetails, ignorePublic: boolean = false): boolean {
  // userId == null -> check if guest is PotentialRoleOwner
  let roles = process.extras.processRoles;

  if (roles == null || roles[roleId] == null || roles[roleId].potentialRoleOwners == null)
    return false;

  for (let member of roles[roleId].potentialRoleOwners) {
    if (userId && member.memberId == userId) {
      // always accept current roleOwners (process might have been changed, we still want to accept existing owners)
      return true;
    }
    if (!ignorePublic && (member.memberId == PH.User.PredefinedGroups.Public
      || member.memberId == PH.User.PredefinedGroups.Everybody))
      return true;
    if (member.memberId == PH.User.PredefinedGroups.AllWorkspaceMembers ||
      (ignorePublic && (member.memberId == PH.User.PredefinedGroups.Public || member.memberId == PH.User.PredefinedGroups.Everybody))) {
      if (PH.Workspace.isWorkspaceMember(workspace))
        return true;
    }
  }

  if (roleId == PH.Process.DefaultRoles.Viewer) {
    if (roles[roleId].potentialRoleOwners.find(potentialRoleOwner => potentialRoleOwner.memberId == PH.User.PredefinedGroups.AllParticipants)
      || roles[roleId].potentialRoleOwners.find(potentialRoleOwner => potentialRoleOwner.memberId == PH.User.PredefinedGroups.Public)) {
      // Bei Sichtbarkeit "AllParticipants" oder "Public" muss geprüft werden, ob User in einer der anderen Rollen eingetragen ist
      // Der Fall Public ist nur bei ignorePublic relevant
      for (let role in roles) {
        if (role != PH.Process.DefaultRoles.Viewer
          // AllParticipants soll allen Teilnehmern, die eine Rolle im Prozess haben, Lesezugriff gewähren. Allerdings 
          // nur den explizit genannten Teilnehmern, nicht der Public-Gruppe, sonst wäre jeder Prozess,
          // bei dem externe Personen teilnehmen dürfen, automatisch Public.
          && isPotentialRoleOwner(userId, role, workspace, process, true)) {
          return true;
        }
      }
    }
  }

  return false;
}

export function getPotentialRoleOwners(workspaceDetails: PH.Workspace.WorkspaceDetails, processDetails: PH.Process.ProcessDetails, roleId: string = null): { [roleId: string]: PH.Process.PotentialRoleOwners } {
  // Diese Funktion soll die User auflisten, die die angegebene Rolle ausfüllen dürfen. Das ist nur für
  // normale Rollen im Prozess sinnvoll, nicht für die vordefinierten Rollen, da zu diesen kein Inhaber ausgewählt werden muss.
  PH.Assert.isFalse(PH.Process.isDefaultRole(roleId));

  let allOwners: { [roleId: string]: PH.Process.PotentialRoleOwners } = {};

  PH.Assert.isTrue(workspaceDetails != null, "WorkspaceDetails dürfen nicht null sein!");
  PH.Assert.isTrue(workspaceDetails.extras.members != null, "Es müssen Workspace Details geliefert werden, die WorkspaceMembers beinhalten!");

  // todo überprüfen ob jeder user einen Namen hat der über die processDetails kommt (außer gruppen)
  if (processDetails.extras.processRoles == null)
    return allOwners;
  
  for (let role in processDetails.extras.processRoles) {
    if ((roleId == null || role == roleId) && processDetails.extras.processRoles[role]) {
      let owners: PH.Process.PotentialRoleOwners = {
        potentialRoleOwner: []
      };
      let addedWsMembers = false;
      for (let potentialOwner of processDetails.extras.processRoles[role].potentialRoleOwners) {
        if ((potentialOwner.memberId == PH.User.PredefinedGroups.AllWorkspaceMembers
          || potentialOwner.memberId == PH.User.PredefinedGroups.Everybody)
          && !addedWsMembers) {
          // Alle WorkspaceMember kommen als potentielle Rolleninhaber in Frage
          for (let member of workspaceDetails.extras.members) {
            owners.potentialRoleOwner.push({
              memberId: member.userDetails.userId,
              displayName: member.userDetails.realName
            });
          }
          addedWsMembers = true; // Merken, damit Member nicht mehrfach hinzugefügt werden, falls beide Gruppen genannt werden
        } else if (PH.Tools.isUserId(potentialOwner.memberId)) {
          owners.potentialRoleOwner.push({
            memberId: potentialOwner.memberId,
            displayName: potentialOwner.displayName
          });
        } else if (PH.Tools.isGroupId(potentialOwner.memberId)) {
          PH.Assert.error("nicht implementiert");
        } else
          PH.Assert.error("ungültiger Aufruf?!");
      }
      allOwners[role] = owners;
    }
  }

  return allOwners;
}

export function isProcessOwner(process: PH.Process.ProcessDetails): boolean {
  if (process == null)
    return false;

  return ((process.userRights & PH.Process.ProcessAccessRights.EditProcess) != 0);
}

export function isProcessManager(process: PH.Process.ProcessDetails): boolean {
  if (process == null)
    return false;

  // owner are managers
  return isProcessOwner(process) || ((process.userRights & PH.Process.ProcessAccessRights.ManageProcess) != 0);
}

export function canViewProcess(process: PH.Process.ProcessDetails): boolean {
  if (process == null)
    return false;

  return ((process.userRights & PH.Process.ProcessAccessRights.ViewProcess) != 0);
}

export function canEditProcess(process: PH.Process.ProcessDetails): boolean {
  return isProcessOwner(process);
}

export function canSimulateProcess(process: PH.Process.ProcessDetails): boolean {
  // Currently everybody is allowed to simulate
  return process != null && !process.isNewProcess;
}

export function canStartProcess(process: PH.Process.ProcessDetails): boolean {
  if (process == null)
    return false;

  // Only users in the start lane may start the process - even administrators don't inherit that right!
  return ((process.userRights & PH.Process.ProcessAccessRights.StartProcess) != 0);
}

export function canViewTodos(process: PH.Process.ProcessDetails): boolean {
  if (process == null)
    return false;

  return canViewAllTodos(process) || ((process.userRights & PH.Process.ProcessAccessRights.ViewTodos) != 0);
}
export function canViewAllTodos(process: PH.Process.ProcessDetails): boolean {
  if (process == null)
    return false;

  return ((process.userRights & PH.Process.ProcessAccessRights.ViewAllTodos) != 0);
}

export function canViewInstances(process: PH.Process.ProcessDetails): boolean {
  if (process == null)
    return false;

  return canViewAllInstances(process) || ((process.userRights & PH.Process.ProcessAccessRights.ViewInstances) != 0);
}
export function canViewAllInstances(process: PH.Process.ProcessDetails): boolean {
  if (process == null)
    return false;

  return ((process.userRights & PH.Process.ProcessAccessRights.ViewAllInstances) != 0);
}

export function canDeleteProcess(process: PH.Process.ProcessDetails): boolean {
  return isProcessOwner(process) && !process.isNewProcess;
}