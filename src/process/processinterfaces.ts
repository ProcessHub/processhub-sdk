import { ProcessAccessRights, ProcessRoles } from "./processrights";
import { InstanceDetails } from "../instance";
import { TodoDetails } from "../todo";
import { BpmnProcess } from "./bpmn/bpmnprocess";
import { strEnum } from "../tools/types";
import gql from "graphql-tag";
import { gqlLibraryTypes } from "./libraryinterfaces";
import { FieldDefinition, TaskIdRequiredFieldsNeeded } from "../data";
import { UserDetails } from "../user/userinterfaces";
import { RowDetails } from ".";
import { AuditTrailEntry } from "../audittrail/audittrailinterfaces";

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
  fullUrl?: string; // @workspace/p/urlname
  previewUrl?: string;  // full url of preview-svg (including https://)
  description: string;
  useModeler?: boolean;
  isNewProcess?: boolean;  
  userRights?: ProcessAccessRights; // access rights of the current user
  attachments?: ProcessAttachment[];
  processXmlHash?: string;
  startEventNames?: { [startEventId: string]: string }; // map with starteventid -> start event name
  tags?: string[];
  rowDetails?: RowDetails[];
  hasWarnings?: boolean;
  latestCommentAt?: Date; // datetime of the latest comment
  extras: { 
    // New Extras must be added to cache-handling in processactions -> loadProcess!   
    bpmnXml?: string;
    bpmnProcess?: BpmnProcess; // available if bpmnXml is available
    instances?: InstanceDetails[];
    instancesUsers?: UserDetails[];
    processRoles?: ProcessRoles;
    svgString?: string; // only used to save preview to server
    settings?: ProcessSettings;
    auditTrail?: AuditTrailEntry[];
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
    fullUrl: String
    previewUrl: String
    description: String
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
  };
  library?: {  
    rating?: number;  // process rating, used to sort processes in library
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

export enum ProcessExtras {
  None = 0,
  ExtrasBpmnXml = 1 << 0,
  ExtrasInstances = 1 << 1,
  ExtrasProcessRoles = 1 << 4,
  ExtrasProcessRolesWithMemberNames = 1 << 5, // Ermittelt zusätzlich die Namen der enthaltenen Mitglieder
  ExtrasSettings = 1 << 6,
  ExtrasAuditTrail = 1 << 7,
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
  UserForm: "processhub-userform", // json: FieldDefinition[]
  SendTaskReceiver: "send-task-receiver",
  SendTaskWithFieldContents: "send-task-with-field-contents", // boolean: include field contents in SendTask notification mail?
  SendTaskInstanceLink: "send-task-instance-link", // boolean: include a link to the instance in SendTask notification mail?
  SendTaskSubject: "send-task-subject", // string: mail subject of SendTask notification mail
  AllFieldsEditable: "all-fields-editable", // boolean: all existing fields in task can be edited in current task
  ViewAllFields: "view-all-fields", // boolean: view all existing fields
  SendMailNotification: "send-mail-notification", // boolean: send notification for task
  SetSenderAsRoleOwner: "set-sender-as-role-owner", // boolean: set mail sender as role owner, default: true
  ServiceTaskApiUrl: "service-task-api-url",
  ServiceTaskRequestObjectString: "service-task-request-object",
  ServiceTaskResponseFieldName: "service-task-response-fieldname",
  TimerStartConfiguration: "timer-start-configuration",
  RequiredFieldsNeeded: "required-fields-needed", // boolean: means that the task needed previous required fields (not necessary on negative decisions)
  SaveDecisionInFieldContents: "save-decision-in-fields",
  CustomFieldContentsValue: "custom-field-contents-value",
  RoleOwnersEditable: "roleowners-editable", // boolean: all role owners can be selected
  SubProcessId: "subprocessid", // id of the process a SubProcess references,
  DueAtDateCanBeEdit: "due-at-can-be-edit",
  DueAtDuration: "due-at-duration",
  SequenceFlowExpression: "sequenceflow-expression",
};
export type TaskSettings = keyof typeof TaskSettings;

export interface TaskExtensions {
  description: string;
  // jumpMode: JumpModeType;
  // jumpValues: string[];
  fieldDefinitions: FieldDefinition[];
  sendTaskReceiver: string[];
  sendTaskWithFieldContents: boolean;
  sendTaskInstanceLink: boolean;
  sendTaskSubject: string;
  allFieldsEditable: boolean;
  viewAllFields: boolean;
  sendMailNotification: boolean;
  requiredFieldsNeeded: TaskIdRequiredFieldsNeeded[];
  saveDecisionInFieldContents: boolean;
  customFieldContentsValue: string;
  dueAtDateCanBeEdit: boolean;
  dueAtDuration: string; // standard dueAtDuration in seconds

  serviceTaskApiUrl: string;
  serviceTaskRequestObjectString: string;
  serviceTaskResponseFieldName: string;

  timerStartConfiguration: TimerStartEventConfiguration[];
  roleOwnersEditable: boolean;

  subProcessId: string;

  sequenceFlowExpression: string;
}

export interface TimerStartEventConfiguration {
  rowNumber: number;
  title: string;
  date: Date;
  time: string;
  frequency: Frequency;
  isTimeValid: boolean;
}

export enum Frequency {
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Yearly = 4,
  Once = 5
}

export interface RunningTaskLane {
  bpmnTaskId: string;
  bpmnLaneId: string;
}

export interface StartButtonMap {
  [id: string]: string;
}