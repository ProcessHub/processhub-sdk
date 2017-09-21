// Internal objects used by ProcessHub client and server
import * as PH from "../";

export class ProcessState {
  errorMessage: string;

  currentProcess: PH.Process.ProcessDetails;

  // Process Cache
  processCache: {
    [processId: string]: PH.Process.ProcessDetails
  };  

  // updated in reducers, helps React to detect state changes
  cacheState?: string;  
}

export const ProcessView = {
  // will be used for urlSegments, so elements in lower case
  Show: "show",
  Edit: "edit",
  Dashboard: "dashboard",
  NewProcess: "newprocess",  
  Instances: "instances",
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
}