import * as PH from "./";

export interface ExtrasRequest {
  workspaceExtras?: PH.Workspace.WorkspaceExtras;
  processExtras?: PH.Process.ProcessExtras;
  instanceExtras?: PH.Instance.InstanceExtras;
  userExtras?: PH.User.UserExtras;
}

export interface IActionHandler { 
  // Load Page "/@workspace/..."
  gotoPage(path: string): void;

  requestExtras(environment: PH.CoreEnvironment, requestedExtras: ExtrasRequest, forceReload?: boolean): void;

  openInstancePopup(instanceId: string): Promise<void>;
  closeInstancePopup(): void;
}
