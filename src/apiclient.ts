import "fetch-everywhere";
import { NetworkStatus } from "apollo-client";
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";

// All clients share the same backend client to optimize caching
// a new client is only created it the host changes (should only happen in tests)
let _apiClient: ApolloClient<{}> = null;
let _apiHost: string = null;

export type ApiClient = ApolloClient<{}>;

export function getApiClient(apiHost: string = "https://app.processhub.com", accessToken?: string): ApiClient {
  if (!_apiClient || apiHost != _apiHost) {


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

    _apiClient = new ApolloClient({
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
  return _apiClient;
}
