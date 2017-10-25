import { ProcessAccessRights, ProcessRoles } from "./processrights";
import { InstanceDetails } from "../instance";
import { TodoDetails } from "../todo";
import { BpmnProcess } from "./bpmn/bpmnprocess";
import { strEnum } from "../tools/types";
import gql from "graphql-tag";
import { gqlLibraryTypes } from "./libraryinterfaces";

export interface ProcessAttachment {
  attachmentId: string;
  fileName: string;
  url: string;
}

export interface ProcessDetails {
  // Changes must also be reflected in gqlTypes and gqlFragments below!

  processId: string;
  workspaceId: string;  
  displayName: string;
  urlName?: string; 
  subTitle?: string; // optional subtitle
  fullUrl?: string; // @workspace/p/urlname
  previewUrl?: string;  // full url of preview-svg (including https://)
  description: string;
  longDesc?: string;  // optional long description / process story
  useModeler?: boolean;
  isNewProcess?: boolean;  
  userRights?: ProcessAccessRights; // Access rights of the current user
  attachments?: ProcessAttachment[];
  extras: { 
    // New Extras must be added to cache-handling in processactions -> loadProcess!   
    bpmnXml?: string;
    bpmnProcess?: BpmnProcess; // available if bpmnXml is available
    instances?: InstanceDetails[];
    processRoles?: ProcessRoles;
    svgString?: string; // only used to save preview to server
    settings?: ProcessSettings;
  };
}
export const gqlProcessTypes = `     
  type ExtrasProcess {
    bpmnXml: String
    instances: [InstanceDetails]
    processRoles: ProcessRoles
  }

  type ProcessAttachment {
    attachmentId: String
    fileName: String
    url: String
  }

  type ProcessDetails {
    workspaceId: String
    processId: String
    displayName: String
    urlName: String
    subTitle: String
    fullUrl: String
    previewUrl: String
    description: String
    longDesc: String
    useModeler: Boolean
    userRights: Int
    attachments: [ProcessAttachment]
    extras: ExtrasProcess
  }

  scalar PotentialRoleOwners
  scalar DecisionTask
  scalar ProcessRoles
`;

export const gqlProcessFragments = gql`
  fragment ProcessDetailsFields on ProcessDetails {
    processId
    urlName
    fullUrl
    displayName
    description
  }
`;

export interface ProcessSettings {
  dashboard?: {
    cardTitle?: string;  // title of the cards in the dashboard
    cardDesc?: string;  // additional text on the card
    dashBoardAccess?: ProcessViewAccess;  // who can access todos?
    showComments?: number;  // max. number of comments that are displayed in the dashboard card
  };
  archive?: {
    archiveAccess?: ProcessViewAccess;  // who can access instances?
  };
  jumps?: ProcessJumpSettings;
  restartProcess?: ProcessRestartSetting;
  library?: {  
    rating?: number;  // process rating, used to sort processes in library
    categories?: string[];  // categoryIds in library
    copiedFromId?: string;  // processId of the original process    
  };
}

export enum ProcessViewAccess {
  // DO NOT CHANGE NUMBERS - used in database
  EverybodySeesAll = 10,  // all todos/instances are public  NOT YET IMPLEMENTED
      // Not implemented because Dashboard uses user.extras.todos, which is not available for anonymous guests
  WorkspaceMembersSeeAll = 20,  // team members see all todos/instances
  ParticipantsSeeAll = 30,  // process participants see all todos/instances
  ParticipantsSeeTheirs = 40,  // process participants see their own todos/instances
  OnlyProcessOwners = 50  // only process managers can see todos/instances    
}

export enum ProcessJumpSettings {
  // DO NOT CHANGE NUMBERS - used in database
  JumpsNotAllowed = 10, // Standard
  JumpsOnlyFromProcessManagers = 20,
  JumpsAllowed = 30,
}

export enum ProcessRestartSetting {
  // DO NOT CHANGE NUMBERS - used in database
  RestartNotAllowed = 10, // Standard
  RestartOnlyFromProcessManagers = 20,
  RestartAllowed = 30,
}

export enum ProcessExtras {
  None = 0,
  ExtrasBpmnXml = 1 << 0,
  ExtrasInstances = 1 << 1,
  ExtrasProcessRoles = 1 << 4,
  ExtrasProcessRolesWithMemberNames = 1 << 5, // Ermittelt zusätzlich die Namen der enthaltenen Mitglieder
  ExtrasSettings = 1 << 6
}

export interface TaskToLaneMapEntry {
  taskId: string;
  laneId: string;
}

export interface ModelValidationResult {
  isValid: boolean;
  tooManyOutgoings: string[];
  tooManyIncomings: string[];
}

export const ProcessResult = strEnum([
  "Ok",
  "Error"
]);
export type ProcessResult = keyof typeof ProcessResult;

export type TaskSettingsValueType = "List" | "Text" | "Boolean";

export const TaskSettings = {
  Description: "description",
  Jumps: "jumps",
  UserForm: "processhub-userform",
  SendTaskReceiver: "send-task-receiver",
  SendTaskWithFieldContents: "send-task-with-field-contents",
  SendTaskInstanceLink: "send-task-instance-link",
  SendTaskSubject: "send-task-subject"
};
export type TaskSettings = keyof typeof TaskSettings;

export interface TaskExtensions {
  description: string;
  // jumpMode: JumpModeType;
  // jumpValues: string[];
  customFormSchemaString: string;
  sendTaskReceiver: string[];
  sendTaskWithFieldContents: boolean;
  sendTaskInstanceLink: boolean;
  sendTaskSubject: string;
}

export interface RunningTaskLane {
  bpmnTaskId: string;
  bpmnLaneId: string;
}


