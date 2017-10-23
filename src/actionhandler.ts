import { ApolloExecutionResult } from "apollo-client";
import gql from "graphql-tag";
import { ApiClient, getApiClient } from "./apiclient";
import { CoreEnvironment } from "./environment";
import { InstanceExtras } from "./instance/instanceinterfaces";
import { API_FAILED, ApiError, ApiResult, BaseError } from "./legacyapi";
import { getErrorHandlers } from "./legacyapi/errorhandler";
import { ProcessExtras } from "./process/processinterfaces";
import { error } from "./tools/assert";
import { UserExtras, ViewState } from "./user/userinterfaces";
import { WorkspaceExtras } from "./workspace/workspaceinterfaces";

export interface ExtrasRequest {
  workspaceExtras?: WorkspaceExtras;
  processExtras?: ProcessExtras;
  instanceExtras?: InstanceExtras;
  userExtras?: UserExtras;
}

export class IActionHandler { 

  public graphQLClient: ApiClient;

  constructor(apiHost: string = "https://app.processhub.com", accessToken?: string) {
    this.graphQLClient = getApiClient(apiHost, accessToken);
  }

  async apiQuery(query: any, variables: any): Promise<ApolloExecutionResult> {
    let result;

    try {
      result = await this.graphQLClient.query({
        query: query,
        variables: variables
      });                                                          
    } catch (e) {
      const error: BaseError = { result: 500 as ApiResult, type: API_FAILED, errorCode: 500 as ApiError };
      getErrorHandlers().forEach(h => h.handleError(error, "/graphql"));
    }
    
    return result;
  }

  async apiMutation(mutation: any, variables: any): Promise<ApolloExecutionResult> {
    let result;

    try {
      result = await this.graphQLClient.mutate({
        mutation: mutation,
        variables: variables
      });                                                          
    } catch (e) {
      const error: BaseError = { result: 500 as ApiResult, type: API_FAILED, errorCode: 500 as ApiError };
      getErrorHandlers().forEach(h => h.handleError(error, "/graphql"));
    }
    return result;
  }  

  async updateViewState(objectId: string, viewState: ViewState): Promise<void> {
    const mutation = gql`
      mutation updateViewState($objectId: ID!, $viewState: ViewState) {
        updateViewState(objectId: $objectId, viewState: $viewState)
      }`;

    // don't wait for server response
    // tslint:disable-next-line:no-floating-promises
    this.apiMutation(mutation, { objectId: objectId, viewState: viewState });
  }

  // Load Page "/@workspace/..."
  gotoPage(path: string): void {
    // TypeScript requires that all functions in classes are defined. We throw an assertion for
    // functions that must be overridden in derived ActionHandlers 
    error();
  }

  requestExtras(environment: CoreEnvironment, requestedExtras: ExtrasRequest, forceReload?: boolean): void {
    error();
  }

  openInstancePopup(instanceId: string): void {
    error();
  }
  closeInstancePopup(): void {
    error();
  }
}
