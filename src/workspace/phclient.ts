import { tl } from "../tl";
import { WorkspaceDetails } from "./workspaceinterfaces";

// Internal objects used by ProcessHub client and server

export class WorkspaceState {
  currentWorkspace: WorkspaceDetails;

  // Workspace Cache
  workspaceCache: { 
    [workspaceId: string]: WorkspaceDetails
  };

  cacheState?: string;  // updated in reducers, helps React to detect state changes
  lastDispatchedWorkspace: WorkspaceDetails; // used in reducer to detect changes
}

export function getDefaultMailSignature() {
  return tl("Wir verwenden [ProcessHub](https://www.processhub.com) für die Steuerung unserer Geschäftsprozesse.");  
}

// WorkspaceView
export const WorkspaceView = {
  Processes: "processes",
  Members: "members",
  AddProcess: "addprocess",
  Settings: "settings",
  Todos: "todos"
};
export type WorkspaceView = keyof typeof WorkspaceView;

export function isValidWorkspaceView(urlSegment: string) {
  for (let view in WorkspaceView) {
    if ((WorkspaceView as any)[view]  == urlSegment.toLowerCase())
      return true;
  }

  return false;
}


// WorkspaceMessages
export const WorkspaceMessages = {
  WorkspaceLoadedMessage: "WorkspaceLoadedMessage",
  WorkspaceCreatedMessage: "WorkspaceCreatedMessage",
  WorkspaceUpdatedMessage: "WorkspaceUpdatedMessage",
  WorkspaceDeletedMessage: "WorkspaceDeletedMessage",
};
export type WorkspaceMessages = keyof typeof WorkspaceMessages;
