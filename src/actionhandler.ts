import gql from "graphql-tag";
import { WorkspaceExtras } from "./workspace/workspaceinterfaces";
import { ProcessExtras } from "./process/processinterfaces";
import { InstanceExtras } from "./instance/instanceinterfaces";
import { UserExtras, UserDetails } from "./user/userinterfaces";
import { CoreEnvironment } from "./environment";
import { BaseError, API_FAILED, ApiResult, ApiError } from "./legacyapi";
import * as _ from "lodash";
import * as Assert from "./tools/assert";
import { ApiClient } from "./apiclient";


export interface ExtrasRequest {
  workspaceExtras?: WorkspaceExtras;
  processExtras?: ProcessExtras;
  instanceExtras?: InstanceExtras;
  userExtras?: UserExtras;
}

export class ActionHandler extends ApiClient { 

  constructor(apiHost: string = "https://app.processhub.com", accessToken?: string) {
    super(apiHost, accessToken);
  }

  // Load Page "/@workspace/..."
  gotoPage(path: string): void {
    // TypeScript requires that all functions in classes are defined. We throw an assertion for
    // functions that must be overridden in derived ActionHandlers 
    Assert.error();
  }

  requestExtras(environment: CoreEnvironment, requestedExtras: ExtrasRequest, forceReload?: boolean): void {
    Assert.error();
  }

  openInstancePopup(workspaceId: string, instanceId: string): void {
    Assert.error();
  }
  openAccountPopup(): void {
    Assert.error();
  }
  closeInstancePopup(): void {
    Assert.error();
  }
}
