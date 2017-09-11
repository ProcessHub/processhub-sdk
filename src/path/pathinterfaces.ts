import * as PH from "../";

export const Page = PH.Tools.strEnum([
  "ErrorPage",
  "StartPage",
  "SigninPage",
  "SignupPage",
  "WorkspacePage",
  "ProcessPage",
  "LibraryPage"
]);
export type Page = keyof typeof Page;

export type View = PH.Workspace.WorkspaceView | PH.Process.ProcessView;

export interface PathDetails {
  page?: Page;
  view?: View;
  workspaceUrlName?: string;
  processUrlName?: string;
}

export interface NotificationLinkElements {
  instanceId?: string;
  todoId?: string;
}