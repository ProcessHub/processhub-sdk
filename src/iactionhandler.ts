import { WorkspaceExtras } from "./workspace/workspaceinterfaces";
import { ProcessExtras } from "./process/processinterfaces";
import { InstanceExtras } from "./instance/instanceinterfaces";
import { UserExtras } from "./user/userinterfaces";
import { CoreEnvironment } from "./environment";

export interface ExtrasRequest {
  workspaceExtras?: WorkspaceExtras;
  processExtras?: ProcessExtras;
  instanceExtras?: InstanceExtras;
  userExtras?: UserExtras;
}

export interface IActionHandler { 
  // Load Page "/@workspace/..."
  gotoPage(path: string): void;

  requestExtras(environment: CoreEnvironment, requestedExtras: ExtrasRequest, forceReload?: boolean): void;

  openInstancePopup(instanceId: string): Promise<void>;
  closeInstancePopup(): void;
}
