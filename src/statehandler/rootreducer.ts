import { combineReducers } from "redux";
import { Reducer } from "redux";
import { instanceReducer } from "../instance/instancereducer";
import { InstanceState } from "../instance/phclient";
import { pathReducer } from "../path/pathreducer";
import { PathState } from "../path/phclient";
import { ProcessState } from "../process/phclient";
import { processReducer } from "../process/processreducer";
import { UserState } from "../user/phclient";
import { userReducer } from "../user/userreducer";
import { WorkspaceState } from "../workspace/phclient";
import { workspaceReducer } from "../workspace/workspacereducer";

export class RootState {
  workspaceState: WorkspaceState;
  processState: ProcessState;
  userState: UserState;
  pathState: PathState;
  instanceState: InstanceState;
}

// Aus irgendwelchen Gründen dürfen die Reducer hier nicht mit User.userReducer angesprochen werden,
// sondern müssen separat importiert werden!
export const rootReducer = combineReducers({
  workspaceState: workspaceReducer,
  userState: userReducer,
  processState: processReducer,
  pathState: pathReducer,
  instanceState: instanceReducer
});

export function initState(): RootState {
  return {
    workspaceState: workspaceReducer(null, null),
    userState: userReducer(null, null),
    pathState: pathReducer(null, null),
    processState: processReducer(null, null),
    instanceState: instanceReducer(null, null)
  };
}

