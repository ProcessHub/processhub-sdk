import { ProcessAccessRights, ProcessRoles } from "./processrights";
import { InstanceDetails } from "../instance";
import { TodoDetails } from "../todo";
import { BpmnProcess } from "./bpmn/bpmnprocess";
import { strEnum } from "../tools/types";


export interface ProcessAttachment {
  attachmentId: string;
  fileName: string;
  url: string;
}

export interface ProcessDetails {
  processId: string;
  workspaceId: string;  
  displayName: string;
  urlName?: string; 
  fullUrl?: string; // @workspace/p/urlname
  previewUrl?: string;
  description: string;
  useModeler?: boolean;
  isNewProcess?: boolean;  
  userRights?: ProcessAccessRights; // Access rights of the current user
  rating?: number; // Currently only available in library
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


