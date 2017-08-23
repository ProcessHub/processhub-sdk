import * as PH from "../";
import { ProcessAccessRights, ProcessRoles } from "./processrights";
import { InstanceDetails } from "../instance";
import { TodoDetails } from "../todo";

export interface ProcessAttachment {
  attachmentId: string;
  fileName: string;
  url: string;
}

export interface ProcessDetails {
  workspaceId: string;
  processId: string;
  displayName: string;
  urlName?: string;
  fullUrl?: string;
  previewUrl?: string;
  description: string;
  useModeler?: boolean;
  isNewProcess?: boolean;
  userRights?: ProcessAccessRights;  // Rolle des angemeldeten Users im Prozess 
  rating?: number; // Aktuell nur in Bibliothek gesetzt
  attachments?: ProcessAttachment[];
  extras: {
    bpmnXml?: string;
    instances?: InstanceDetails[];
    todos?: TodoDetails[];
    statistics?: ProcessStatistics;
    processRoles?: ProcessRoles;
    svgString?: string; // Wird nur für die Übermittlung an den Server beim Speichern genutzt
  };
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

export interface ProcessStatistics {
  openTasksTotal: number;
  openTasksOnTime: number;
  openTasksWarning: number;
  openTasksAlert: number;
}

export const ProcessResult = PH.Tools.strEnum([
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



