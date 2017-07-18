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