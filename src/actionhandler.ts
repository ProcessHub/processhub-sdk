import * as PH from "./";
import gql from "graphql-tag";
import { ApiClient } from "./apiclient";
import { WorkspaceExtras } from "./workspace/workspaceinterfaces";
import { ProcessExtras } from "./process/processinterfaces";
import { InstanceExtras } from "./instance/instanceinterfaces";
import { UserExtras, UserDetails } from "./user/userinterfaces";
import { CoreEnvironment } from "./environment";
import { getErrorHandlers } from "./legacyapi/errorhandler";
import { BaseError, API_FAILED, ApiResult, ApiError } from "./legacyapi";
import * as _ from "lodash";



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
    PH.Assert.error();
  }

  requestExtras(environment: CoreEnvironment, requestedExtras: ExtrasRequest, forceReload?: boolean): void {
    PH.Assert.error();
  }

  openInstancePopup(workspaceId: string, instanceId: string): void {
    PH.Assert.error();
  }
  openAccountPopup(): void {
    PH.Assert.error();
  }
  closeInstancePopup(): void {
    PH.Assert.error();
  }
}
