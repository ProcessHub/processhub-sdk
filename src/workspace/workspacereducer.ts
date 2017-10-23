import * as _ from "lodash";
import * as update from "immutability-helper";
import * as WorkspaceActions from "./workspaceactions";
import * as StateHandler from "../statehandler";
import { WorkspaceState, WorkspaceMessages } from "./phclient";
import { WorkspaceLoadedMessage } from "./legacyapi";
import { createId } from "../tools/guid";
import { ResetStore } from "../statehandler/actions";

export function workspaceReducer(workspaceState: WorkspaceState, action: any): WorkspaceState {

  if (workspaceState == null || action && action.type == ResetStore) {
    // init state
    workspaceState = new WorkspaceState();
    workspaceState.workspaceCache = {};
  }
  if (action == null || action.type == ResetStore)
    return workspaceState;

  switch (action.type) {
    case WorkspaceMessages.WorkspaceLoadedMessage:

      workspaceState.currentWorkspace = StateHandler.mergeWorkspaceToCache((<WorkspaceLoadedMessage>action).workspace);

      let workspaceChanged = !_.isEqual(workspaceState.currentWorkspace, workspaceState.lastDispatchedWorkspace);
      workspaceState.lastDispatchedWorkspace = _.cloneDeep(workspaceState.currentWorkspace);
      
      // React cannot detect state changes in objects. Updating cacheState triggers rendering
      // -> only render if data has changed
      if (workspaceChanged) {
        return update(workspaceState, {
          cacheState: { $set: createId() }
        });
      } else
        return workspaceState;
        
    default:
      // state not changed
      return workspaceState;
  }
}
