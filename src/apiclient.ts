import "fetch-everywhere";
import ApolloClient, { createNetworkInterface, toIdValue } from "apollo-client";

// All clients share the same backend client to optimize caching
// -> The first instance defines the host, further host settings will be ignored.
let apiClient: ApolloClient = null;

export class ApiClient {

  constructor(host: string = "https://app.processhub.com", accessToken: string = null) {
    if (!apiClient) {
      const networkInterface = createNetworkInterface({
          uri: host + "/graphql",
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
      apiClient = new ApolloClient({
        dataIdFromObject: (object: any) => object.id,
        networkInterface: createNetworkInterface({
          uri: host + "/graphql",
          opts: {   
            credentials: "include",
          }
        }),
        // http://dev.apollodata.com/react/cache-updates.html#cacheRedirect
        // (TypeScript) https://github.com/apollographql/apollo-client/blob/master/test/proxy.ts
        customResolvers: {
          Query: {
            user: (_, args) => toIdValue(args.id),
          },
        },
        addTypename: true
      });
    } 
  }

  async query(query: any): Promise<any> {
    let result = await apiClient.query({ query: query });
    return result.data;
  }
}
