import { RoleOwnerMap } from "../process";
import { DecisionTask } from "../todo";
import { FieldContentMap } from "../data";
import * as PH from "../";
import { Bpmn } from "modeler/bpmn/bpmn";

export enum State {
  // DON'T CHANGE NUMBERS - used in database
  Running = 1,
  Finished = 2,
  Canceled = 3,
}

export interface InstanceDetails {
  instanceId: string;
  workspaceId: string;
  processId: string;
  displayName: string;
  fullUrl?: string; // = /i/@workspace/instanceid
  createdAt?: Date;
  isSimulation?: boolean;
  sendSimulationMails?: boolean;
  state: State;
  latestCommentAt: Date; // datetime of the latest comment or incoming mail
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
  ExtrasTodos = 1 << 4,
  ExtrasAuditTrail = 1 << 5,
}

export interface ResumeInstanceDetails {
  instanceId: string;
  completedTodoId: string;
  // Sollte nächste Activity Exclusive Gateway sein, wird hier die Entscheidung über den SF mitgeteilt
  choosenTask?: DecisionTask;
  fieldContents?: FieldContentMap;
}

export interface EngineState {
  name: string;
  state: string;
  engineVersion: string;
  definitions: EngineStateDefinition[];
}

export interface EngineStateDefinition {
  id: string;
  state: string;
  moddleContext: any;
  stopped: boolean;
  processes: EngineStateDefinitionProcess;
}

export interface EngineStateDefinitionProcess {
  [id: string]: EngineStateDefinitionProcessDetails;
}

export interface EngineStateDefinitionProcessDetails {
  id: string;
  type: Bpmn.bpmnType;
  entered: boolean;
  variables: any;
  services: any;
  children: EngineStateDefinitionChild[];
}

export interface EngineStateDefinitionChild {
  id: string;
  type: Bpmn.bpmnType;
  entered: boolean;
  canceled?: boolean;
  waiting?: boolean;
  taken?: boolean;
}

export enum AuditTrailAction {
  instanceStarted = 1,
  completedTodo = 2,
  comment = 3,
  incomingMail = 4,
}
export interface AuditTrailEntryDetails {
  // must be set for AuditTrailAction.completedTodo
  todoDisplayName: string;
  // must be set for AuditTrailAction.comment
  comment: string;  

  // must be set for AuditTrailAction.incomingMail
  mailText: string;
  mailSubject: string;
  // may be set for AuditTrailAction.incomingMail, if there was html content in the email - link to the HTML document. undefined if there was no HTML content.  
  mailHtmlLink: string;
  // may be set for AuditTrailAction.incomingMail, if there were attachments in the mail - links to all attachment files. Empty array if there were no attachments.
  mailAttachments: string[];
}
export type Partial<T> = {
  [P in keyof T]?: T[P];
};
export interface AuditTrailEntry { 
  instanceId: string;
  trailId: string;
  action: AuditTrailAction;
  user: PH.User.UserDetails;  
  createdAt: Date;  // time of action in UTC
  details: Partial<AuditTrailEntryDetails>;
}