import * as update from "immutability-helper";
import * as _ from "lodash";
import { PathState } from "./phclient";
import { PATHLOADED_MESSAGE, PathLoadedMessage } from "./legacyapi";
import { ResetStore } from "../statehandler/actions";

export function pathReducer(pathState: PathState, action: any): PathState {

  if (pathState == null || action && action.type == ResetStore) {
    // init state
    pathState = new PathState();
  }
  if (action == null)
    return pathState;

  switch (action.type) {

    case PATHLOADED_MESSAGE:
      const isMobile: boolean = pathState.currentPath && pathState.currentPath.isMobile;

      let loadedAction: PathLoadedMessage = action;
      let loadstate: PathState  = update(pathState, {
        currentPath: { $set: _.cloneDeep(loadedAction.pathDetails) },
        lastApiResult: { $set: loadedAction.error }
      });

      loadstate.currentPath.isMobile = isMobile;
      return loadstate;

    default:
      return pathState;
  }
}
