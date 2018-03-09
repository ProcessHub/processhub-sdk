import "fetch-everywhere";
import ApolloClient from "apollo-client";
import { NetworkStatus, ApolloQueryResult } from "apollo-client";
import gql from "graphql-tag";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import * as _ from "lodash";
import { loginUser, logoutUser } from "./user/useractions";
import { FetchResult } from "apollo-link";
import { FieldContentMap } from "./data";
import { executeInstance } from "./instance/instanceactions";
import { createId } from "./tools";
import { InstanceDetails } from "./instance";
import { UserDetails, ViewState } from "./user";
import { TodoDetails } from "./todo";

// All clients share the same backend client to optimize caching
// a new client is only created it the host changes (should only happen in tests)
let _graphQLClient: ApolloClient<{}> = null;
let _apiHost: string = null;

export class ApiClient {
  private graphQLClient: ApolloClient<{}>;
  private accessToken: string;

  constructor(apiHost: string = "https://app.processhub.com", accessToken?: string) {
    this.graphQLClient = getGraphQLClient(apiHost, accessToken);
    this.accessToken = accessToken;
  }

  async graphQLQuery(query: any, variables: any): Promise<any> {
    let result;

    try {
      result = await this.graphQLClient.query({
        query: query,
        variables: variables
      });                                                          
    } catch (e) {
      console.error(e);
      // const error: BaseError = { result: 500 as ApiResult, type: API_FAILED };
      // getErrorHandlers().forEach(h => h.handleError(error, "/graphql"));
    }
    
    return result.data;
  }

  async graphQLMutation(mutation: any, variables: any): Promise<FetchResult<{}, Record<string, any>>> {
    let result;

    try {
      result = await this.graphQLClient.mutate({
        mutation: mutation,
        variables: variables
      });                                                          
    } catch (e) {
      console.error(e);
      // const error: BaseError = { result: 500 as ApiResult, type: API_FAILED };
      // getErrorHandlers().forEach(h => h.handleError(error, "/graphql"));
    }
    return result;
  }  

  async signIn(userMail: string, password: string): Promise<UserDetails> {
    let user = (await loginUser(userMail, password)).userDetails;
    if (user)
      this.accessToken = user.extras.accessToken;

    return user;
  }

  async signOut(accessToken?: string): Promise<void> {
    await logoutUser(accessToken ? accessToken : this.accessToken);
  }

  async updateViewState(objectId: string, viewState: ViewState): Promise<void> {
    const mutation = gql`
      mutation updateViewState($objectId: ID!, $viewState: ViewState) {
        updateViewState(objectId: $objectId, viewState: $viewState)
      }`;

    // don't wait for server response
    // tslint:disable-next-line:no-floating-promises
    this.graphQLMutation(mutation, { objectId: objectId, viewState: viewState });
  }

  async updateTodo(todo: TodoDetails): Promise<void> {
    const mutation = gql`
      mutation updateTodo($todo: TodoUpdateDetails!) {
        updateTodo(todo: $todo)
      }`;

    let todo2 = _.cloneDeep(todo);
    // graphql does not accept invalid fields in mutation
    delete (todo2.user);

    await this.graphQLMutation(mutation, { todo: todo2 });
  }

  async startProcess(workspaceId: string, processId: string, instanceTitle?: string, fieldContents?: FieldContentMap): Promise<string> {
    let instance: InstanceDetails = {
      instanceId: createId(),
      displayName: instanceTitle,
      workspaceId: workspaceId,
      processId: processId,
      extras: {
        roleOwners: {},
        fieldContents: fieldContents
      }
    }

    await executeInstance(processId, instance, this.accessToken);

    return instance.instanceId;
  }
}

function getGraphQLClient(apiHost: string = "https://app.processhub.com", accessToken?: string): ApolloClient<{}> {
  if (!_graphQLClient || apiHost != _apiHost) {

    const httpLink = new HttpLink({
      uri: apiHost + "/graphql",
      credentials: "include",
    });

    const authLink = setContext((_, { headers }) => {
      if (accessToken != null) {
        // return the headers to the context so httpLink can read them
        return {
          headers: {
            ...headers,
            "x-accesstoken": accessToken,
          }
        };
      } else {
        return {
          headers: {
            ...headers
          }
        };
      }
    });

    _graphQLClient = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });

    /*
        const networkInterface = createNetworkInterface({
            uri: 
            opts: {   
              credentials: "include",
            }
          });      
        if (accessToken != null) {
          networkInterface.use([{
            applyMiddleware(req, next) {
              if (!req.options.headers) {
                req.options.headers = {} as any;
              }
              (req.options.headers as any)["x-accesstoken"] = accessToken;
              next();
            }
          }]);
        }
        _apiHost = apiHost;
        _apiClient = new ApolloClient({
          link: new HttpLink({ uri: apiHost + "/graphql" }),
    
          dataIdFromObject: (object: any) => object.id,
          networkInterface: networkInterface,
          // http://dev.apollodata.com/react/cache-updates.html#cacheRedirect
          // (TypeScript) https://github.com/apollographql/apollo-client/blob/master/test/proxy.ts
          customResolvers: {
            Query: {
              user: (_, args) => toIdValue(args.userId),
            },
          },
          addTypename: true
        });*/
  }
  return _graphQLClient;
}
