import * as PH from "./";
import gql from "graphql-tag";
import { ApiClient, getApiClient } from "./apiclient";
import { NetworkStatus, ApolloExecutionResult } from "apollo-client";
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

export class IActionHandler { 

  public graphQLClient: ApiClient;

  constructor(apiHost: string = "https://app.processhub.com", accessToken?: string) {
    this.graphQLClient = getApiClient(apiHost, accessToken);
  }

  async apiQuery(query: any, variables: any): Promise<ApolloExecutionResult> {
    let result = await this.graphQLClient.query({
      query: query,
      variables: variables
    });                                                          

    return result;
  }

  async apiMutation(mutation: any, variables: any): Promise<ApolloExecutionResult> {
    let result = await this.graphQLClient.mutate({
      mutation: mutation,
      variables: variables
    });                                                          

    return result;
  }  

  async updateViewState(objectId: string, viewState: PH.User.ViewState): Promise<void> {
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
    PH.Assert.error();
  }

  requestExtras(environment: CoreEnvironment, requestedExtras: ExtrasRequest, forceReload?: boolean): void {
    PH.Assert.error();
  }

  openInstancePopup(instanceId: string): void {
    PH.Assert.error();
  }
  closeInstancePopup(): void {
    PH.Assert.error();
  }
}
