import * as PH from "./";
import gql from "graphql-tag";
import { ApiClient, getApiClient } from "./apiclient";
import { NetworkStatus, ApolloQueryResult } from "apollo-client";
import { WorkspaceExtras } from "./workspace/workspaceinterfaces";
import { ProcessExtras } from "./process/processinterfaces";
import { InstanceExtras } from "./instance/instanceinterfaces";
import { UserExtras } from "./user/userinterfaces";
import { CoreEnvironment } from "./environment";
import { getErrorHandlers } from "./legacyapi/errorhandler";
import { BaseError, API_FAILED, ApiResult, ApiError } from "./legacyapi";
import * as _ from "lodash";
import { FetchResult } from "apollo-link";

export interface ExtrasRequest {
  workspaceExtras?: WorkspaceExtras;
  processExtras?: ProcessExtras;
  instanceExtras?: InstanceExtras;
  userExtras?: UserExtras;
}

export class ActionHandler { 

  public graphQLClient: ApiClient;

  constructor(apiHost: string = "https://app.processhub.com", accessToken?: string) {
    this.graphQLClient = getApiClient(apiHost, accessToken);
  }

  async apiQuery(query: any, variables: any): Promise<ApolloQueryResult<any>> {
    let result;

    try {
      result = await this.graphQLClient.query({
        query: query,
        variables: variables
      });                                                          
    } catch (e) {
      console.error(e);
      const error: BaseError = { result: 500 as ApiResult, type: API_FAILED };
      getErrorHandlers().forEach(h => h.handleError(error, "/graphql"));
    }
    
    return result;
  }

  async apiMutation(mutation: any, variables: any): Promise<FetchResult<{}, Record<string, any>>> {
    let result;

    try {
      result = await this.graphQLClient.mutate({
        mutation: mutation,
        variables: variables
      });                                                          
    } catch (e) {
      console.error(e);
      const error: BaseError = { result: 500 as ApiResult, type: API_FAILED };
      getErrorHandlers().forEach(h => h.handleError(error, "/graphql"));
    }
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

  async updateTodo(todo: PH.Todo.TodoDetails): Promise<void> {
    const mutation = gql`
      mutation updateTodo($todo: TodoUpdateDetails!) {
        updateTodo(todo: $todo)
      }`;

    let todo2 = _.cloneDeep(todo);
    // graphql does not accept invalid fields in mutation
    delete (todo2.user);

    await this.apiMutation(mutation, { todo: todo2 });
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
