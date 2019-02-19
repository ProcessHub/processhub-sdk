import { combineReducers } from "redux";
import { userReducer } from "../user/userreducer";
import { pathReducer } from "../path/pathreducer";
import { processReducer } from "../process/processreducer";
import { instanceReducer } from "../instance/instancereducer";
import { workspaceReducer } from "../workspace/workspacereducer";
import { WorkspaceState } from "../workspace/phclient";
import { ProcessState } from "../process/phclient";
import { UserState } from "../user/phclient";
import { PathState } from "../path/phclient";
import { InstanceState } from "../instance/phclient";

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

