import { ProcessDetails } from "./processinterfaces";
import { Bpmn } from "./bpmn/index";
import * as BpmnProcess from "./bpmn/bpmnprocess";
// Internal objects used by ProcessHub client and server

export class ProcessState {
  errorMessage: string;

  currentProcess: ProcessDetails;

  // Process Cache
  processCache: {
    [processId: string]: ProcessDetails
  };  

  cacheState?: string;  // updated in reducers, helps React to detect state changes
  lastDispatchedProcess: ProcessDetails; // used in reducer to detect changes
}

export const ProcessView = {
  // will be used for urlSegments, so elements in lower case
  Show: "show",
  Edit: "edit",
  Dashboard: "dashboard",
  NewProcess: "newprocess",  
  Instances: "instances",
  Statistics: "statistics",
};
export type ProcessView = keyof typeof ProcessView;

export function isValidProcessView(urlSegment: string) {
  for (let view in ProcessView) {
    if ((ProcessView as any)[view]  == urlSegment.toLowerCase())
      return true;
  }

  return false;
}

export interface RowDetails {
  rowNumber: number;
  selectedRole: string;
  task: string;
  taskId: string;
  laneId?: string;
  taskType: "bpmn:UserTask" | "bpmn:SendTask" | "bpmn:StartEvent" ;
  jumpsTo: string[];
}