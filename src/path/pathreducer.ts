import * as update from "immutability-helper";
import * as _ from "lodash";
import * as StateHandler from "../statehandler";
import { PathState } from "./phclient";
import { PATHLOADED_MESSAGE, PathLoadedMessage } from "./legacyapi";

export function pathReducer(pathState: PathState, action: any): PathState {

  if (pathState == null || action && action.type == StateHandler.ResetStore) {
    // init state
    pathState = new PathState();
  }
  if (action == null || action.type == StateHandler.ResetStore)
    return pathState;

  switch (action.type) {

    case PATHLOADED_MESSAGE:
      let loadedAction: PathLoadedMessage = action;
      let loadstate: PathState  = update(pathState, {
        currentPath: { $set: _.cloneDeep(loadedAction.pathDetails) },
        lastApiResult: { $set: loadedAction.error }
      });
      return loadstate;

    default:
      return pathState;
  }
}
