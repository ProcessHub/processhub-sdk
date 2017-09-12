// Internal objects used by ProcessHub client and server
import * as PH from "../";

export class ProcessState {
  errorMessage: string;

  currentProcess: PH.Process.ProcessDetails;

  // Process Cache
  process: {
    [processId: string]: PH.Process.ProcessDetails
  };  
}

export const ProcessView = {
  // Enum wird für Url-Pfade genutzt, daher Elemente in Kleinschreibung
  Show: "show",
  Edit: "edit",
  Dashboard: "dashboard",
  NewProcess: "newprocess",  
  Instances: "instances",
};
export type ProcessView = keyof typeof ProcessView;

// Extras, die für die angegebene Ansicht benötigt werden
export function requiredProcessViewExtras(page: PH.Path.Page, view: ProcessView): PH.Process.ProcessExtras {
  switch (page) {
    case PH.Path.Page.ProcessPage:
      switch (view) {
        case ProcessView.Show:
          return PH.Process.ProcessExtras.ExtrasBpmnXml | PH.Process.ProcessExtras.ExtrasProcessRolesWithMemberNames | PH.Workspace.WorkspaceExtras.ExtrasMembers;
        case ProcessView.Edit:
          return PH.Process.ProcessExtras.ExtrasBpmnXml | PH.Process.ProcessExtras.ExtrasProcessRolesWithMemberNames | PH.Workspace.WorkspaceExtras.ExtrasMembers;
        case ProcessView.Dashboard:
          return PH.Process.ProcessExtras.ExtrasBpmnXml | PH.Process.ProcessExtras.ExtrasProcessRolesWithMemberNames;
        case ProcessView.Instances:
          return PH.Process.ProcessExtras.ExtrasBpmnXml | PH.Process.ProcessExtras.ExtrasInstances | PH.Process.ProcessExtras.ExtrasProcessRolesWithMemberNames;
        default:
          return null;  // -> View ungültig
      }
    default:
      return null;
  }
}

export interface RowDetails {
  rowNumber: number;
  selectedRole: string;
  task: string;
  taskId: string;
  laneId?: string;
}