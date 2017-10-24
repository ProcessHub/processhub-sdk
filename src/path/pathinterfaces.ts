import { strEnum } from "../tools/types";
import { WorkspaceView } from "../workspace/phclient";
import { ProcessView } from "../process/phclient";

export const Page = strEnum([
  "ErrorPage",
  "StartPage",
  "SigninPage",
  "SignupPage",
  "WorkspacePage",
  "ProcessPage"
]);
export type Page = keyof typeof Page;

export type View = WorkspaceView | ProcessView;

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