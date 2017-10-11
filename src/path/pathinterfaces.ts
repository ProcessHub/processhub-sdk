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

  isMobile?: boolean;  // embedded request from a mobile app
  isEmbedded?: boolean;  // embedded view mode (NOT IMPLEMENTED YET)
  isLibraryListing?: boolean;  // process is displayed from the library

  workspaceUrlName?: string;
  processUrlName?: string;
}

export interface NotificationLinkElements {
  workspaceUrlName?: string;
  instanceId?: string;
}