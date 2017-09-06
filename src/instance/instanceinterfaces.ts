import { RoleOwnerMap } from "../process";
import { DecisionTask } from "../todo";
import { FieldContentMap } from "../data";
import * as PH from "../";
import { InstanceAccessRights } from "./instancerights";

export enum State {
  Running = 1,
  Finished = 2,
  Canceled = 3,
}

export interface InstanceDetails {
  instanceId: string;
  processId: string;
  displayName: string;
  urlName?: string;
  fullUrl?: string;
  createdAt?: Date;
  isSimulation?: boolean;
  sendSimulationMails?: boolean;
  state: State;
  userRights?: InstanceAccessRights;
  extras: {
    // New Extras must be added to cache-handling in instanceactions -> loadInstance!
    instanceState?: any;
    fieldContents?: FieldContentMap;
    roleOwners?: RoleOwnerMap;
    todos?: PH.Todo.TodoDetails[];
    auditTrail?: PH.Instance.AuditTrailEntry[];
  };
}

export enum InstanceExtras {
  None = 0,
  ExtrasState = 1 << 0,
  ExtrasRoleOwners = 1 << 1,
  ExtrasRoleOwnersWithNames = 1 << 2, // include roleowner-names
  ExtrasFieldContents = 1 << 3,
  ExtrasTodos = 1 << 4, // NOT IMPLEMENTED YET,
  ExtrasAuditTrail = 1 << 5,
}

export interface ResumeInstanceDetails {
  instanceId: string;
  completedTodoId: string;
  // Sollte nächste Activity Exclusive Gateway sein, wird hier die Entscheidung über den SF mitgeteilt
  choosenTask?: DecisionTask;
  fieldContents?: FieldContentMap;
}