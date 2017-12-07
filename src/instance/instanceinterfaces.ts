import gql from "graphql-tag";
import { RoleOwnerMap } from "../process";
import { DecisionTask, TodoDetails } from "../todo";
import { FieldContentMap } from "../data";
import { Bpmn } from "modeler/bpmn/bpmn";
import { UserDetails } from "../user/userinterfaces";

export enum State {
  // DON'T CHANGE NUMBERS - used in database
  Running = 1,
  Finished = 2,
  Canceled = 3,
}

export interface InstanceDetails {
  // Changes must also be reflected in gqlTypes and gqlFragments below!  

  instanceId: string;
  workspaceId: string;
  processId: string;
  displayName: string;
  instanceNumber?: string;  // 123.4567.890, created on execution
  fullUrl?: string; // = /i/@workspace/instanceid
  createdAt?: Date;
  completedAt?: Date;
  isSimulation?: boolean;
  sendSimulationMails?: boolean;
  state: State;
  latestCommentAt: Date; // datetime of the latest comment or incoming mail
  processXmlHash?: string;
  extras: {
    // New Extras must be added to cache-handling in instanceactions -> loadInstance!
    instanceState?: any;
    fieldContents?: FieldContentMap;
    roleOwners?: RoleOwnerMap;
    todos?: TodoDetails[];
    auditTrail?: AuditTrailEntry[];
  };
}

export const gqlInstanceTypes = `
  type ExtrasInstance {
    instanceState: Json
    fieldContents: FieldContents
    roleOwners: RoleOwnerMap
  }

  type InstanceDetails {
    instanceId: String!
    workspaceId: String
    processId: String
    displayName: String
    urlName: String
    fullUrl: String
    createdAt: Date
    isSimulation: Boolean
    sendSimulationMails: Boolean
    state: Int
    latestCommentAt: Date
    extras: ExtrasInstance
  }

  scalar RoleOwnerMap
  scalar FieldContents
`;

export const gqlProcessFragments = gql`
fragment InstanceDetailsFields on InstanceDetails {
  instanceId
  workspaceId
  processId
  displayName
  urlName
  fullUrl
  createdAt
  isSimulation  
  sendSimulationMails
  state
  latestCommentAt
}`;

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
  workspaceId: string;
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
  jumpPerformed = 5,
  outgoingMail = 6
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
  // may be set for AuditTrailAction.outgoingMail
  mailReceiverList: string[];
  // must be set for AuditTrailAction.jumpPerformed
  jumpFromTodoDisplayName: string;
  jumpToTodoDisplayName: string;
}
export type Partial<T> = {
  [P in keyof T]?: T[P];
};
export interface AuditTrailEntry { 
  trailId: string;
  workspaceId: string;
  processId?: string;  // may be null for entries on workspace-level
  instanceId?: string;  // may be null for entries on workspace- or process-level
  action: AuditTrailAction;
  user: UserDetails;
  createdAt: Date;  // time of action in UTC
  details: Partial<AuditTrailEntryDetails>;
}