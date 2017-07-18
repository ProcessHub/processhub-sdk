// Internal objects used by ProcessHub client and server
import * as PH from "../";

export class ProcessState {
  errorMessage: string;

  currentProcess: PH.Process.ProcessDetails;
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

export enum ProcessExtras {
  None = 0,
  ExtrasBpmnXml = 1 << 0,
  ExtrasInstances = 1 << 1,
  ExtrasTodos = 1 << 2,
  ExtrasStatistics = 1 << 3,
  ExtrasProcessRoles = 1 << 4,
  ExtrasProcessRolesWithMemberNames = 1 << 5 // Ermittelt zusätzlich die Namen der enthaltenen Mitglieder
}

// Extras, die für die angegebene Ansicht benötigt werden
export function requiredProcessViewExtras(page: PH.Path.Page, view: ProcessView): ProcessExtras {
  switch (page) {
    case PH.Path.Page.ProcessPage:
      switch (view) {
        case ProcessView.Show:
          return ProcessExtras.ExtrasBpmnXml | ProcessExtras.ExtrasProcessRolesWithMemberNames | PH.Workspace.WorkspaceExtras.ExtrasMembers;
        case ProcessView.Edit:
          return ProcessExtras.ExtrasBpmnXml | ProcessExtras.ExtrasProcessRolesWithMemberNames | PH.Workspace.WorkspaceExtras.ExtrasMembers;
        case ProcessView.Dashboard:
          return ProcessExtras.ExtrasBpmnXml | ProcessExtras.ExtrasTodos | ProcessExtras.ExtrasProcessRolesWithMemberNames;
        case ProcessView.Instances:
          return ProcessExtras.ExtrasBpmnXml | ProcessExtras.ExtrasInstances | ProcessExtras.ExtrasProcessRolesWithMemberNames;
        default:
          return null;  // -> View ungültig
      }
    default:
      return null;
  }
}