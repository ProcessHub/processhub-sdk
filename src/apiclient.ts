import "fetch-everywhere";
import { ApolloClient, createNetworkInterface, toIdValue, NetworkStatus } from "apollo-client";

// All clients share the same backend client to optimize caching
// a new client is only created it the host changes (should only happen in tests)
let _apiClient: ApolloClient = null;
let _apiHost: string = null;

export type ApiClient = ApolloClient;

export function getApiClient(apiHost: string = "https://app.processhub.com", accessToken?: string): ApiClient {
  if (!_apiClient || apiHost != _apiHost) {
    const networkInterface = createNetworkInterface({
        uri: apiHost + "/graphql",
        opts: {   
          credentials: "include",
        }
      });      
    if (accessToken != null) {
      networkInterface.use([{
        applyMiddleware(req, next) {
          if (!req.options.headers) {
            req.options.headers = {};
          }
          req.options.headers["x-accesstoken"] = accessToken;
          next();
        }
      }]);
    }
    _apiHost = apiHost;
    _apiClient = new ApolloClient({
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
    });
  } 
  return _apiClient;
}
