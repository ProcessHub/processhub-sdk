// Internal objects used by ProcessHub client and server
import * as PH from "../";

export class WorkspaceState {
  currentWorkspace: PH.Workspace.WorkspaceDetails;

  // Workspace Cache
  workspaceCache: { 
    [workspaceId: string]: PH.Workspace.WorkspaceDetails
  };

  // updated in reducers, helps React to detect state changes
  cacheState?: string;
}

export function getDefaultMailSignature() {
  return PH.tl("Wir verwenden [ProcessHub](https://www.processhub.com) für die Steuerung unserer Geschäftsprozesse.");  
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
