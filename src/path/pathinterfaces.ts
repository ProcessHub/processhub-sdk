import * as PH from "../";

export const Page = PH.Tools.strEnum([
  "ErrorPage",
  "StartPage",
  "SigninPage",
  "SignupPage",
  "TodosPage",
  "WorkspacePage",
  "ProcessPage",
  "InstancePage",
  "TodoPage",
  "LibraryPage"
]);
export type Page = keyof typeof Page;

export type View = PH.Workspace.WorkspaceView | PH.Process.ProcessView | PH.Instance.InstanceView;

export interface PathDetails {
  page?: Page;
  view?: View;
  workspaceUrlName?: string;
  processUrlName?: string;
  instanceUrlName?: string;
  todoUrlName?: string;
}
