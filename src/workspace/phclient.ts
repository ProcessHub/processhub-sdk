// Internal objects used by ProcessHub client and server
import * as PH from "../";

export class WorkspaceState {
  currentWorkspace: PH.Workspace.WorkspaceDetails;

  // Workspace Cache
  workspace: { 
    [workspaceId: string]: PH.Workspace.WorkspaceDetails
  };
}

// WorkspaceView
export const WorkspaceView = {
  Processes: "processes",
  Members: "members",
  NewProcess: "newprocess",
  AddProcess: "addprocess",
  Settings: "settings",
};
export type WorkspaceView = keyof typeof WorkspaceView;

// WorkspaceMessages
export const WorkspaceMessages = {
  WorkspaceLoadedMessage: "WorkspaceLoadedMessage"
};
export type WorkspaceMessages = keyof typeof WorkspaceMessages;

export enum WorkspaceExtras {
  None = 0,
  ExtrasMembers = 1 << 0,
  ExtrasProcesses = 1 << 1
}

// Extras, die für die angegebene Ansicht benötigt werden
export function requiredWorkspaceViewExtras(page: PH.Path.Page, view: WorkspaceView): WorkspaceExtras {
  switch (page) {
    case PH.Path.Page.ProcessPage:
    case PH.Path.Page.WorkspacePage:
      switch (view) {
        case WorkspaceView.Processes:
          return WorkspaceExtras.ExtrasProcesses;
        case WorkspaceView.Members:
          return WorkspaceExtras.None;
        case PH.Process.ProcessView.Dashboard:
        case PH.Process.ProcessView.Show:
        case PH.Process.ProcessView.Instances:
          return WorkspaceExtras.ExtrasMembers;
        case WorkspaceView.Settings:
        case WorkspaceView.AddProcess:
          return WorkspaceExtras.None;
        default:
          return null;  // -> View ungültig
      }
    default:
      return null;
  }
}