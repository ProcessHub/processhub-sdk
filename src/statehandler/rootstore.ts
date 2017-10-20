import { Store, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from "react-router-redux";
import { RootState, initState, rootReducer } from "./rootreducer";
import { ResetStore } from "./actions";

export async function resetStore(): Promise<void> {
  await rootStore.dispatch({ type: ResetStore });
}

export function configureStore(initialState: any): Store<any> {
  const history: History = null;
  const reduxRouterMiddleware = routerMiddleware(<any>history);

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunk,
      reduxRouterMiddleware)
    );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("./rootreducer", () => {
      const nextReducer = require("./rootreducer").default;
      store.replaceReducer(nextReducer);
    });
  }

  rootStore = store;

  return store;
}

let initialState: RootState = typeof window !== "undefined" ? (<any>window).__INITIAL_STATE__ : undefined;
if (initialState == null) {
  initialState = initState();
}

export let rootStore: Store<RootState> = configureStore(initialState);


