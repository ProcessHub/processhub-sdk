import * as update from "immutability-helper";
import * as _ from "lodash";
import * as Notification from "../notification";
import * as StateHandler from "../statehandler";
import { ResetStore } from "../statehandler/actions";
import { createId } from "../tools/guid";
import { NewInstanceMessage, RemoveInstanceMessage } from "../user/legacyapi";
import { UserMessages } from "../user/phclient";
import { INSTANCELOADED_MESSAGE, InstanceLoadedMessage } from "./legacyapi";
import { InstanceState } from "./phclient";

export function instanceReducer(instanceState: InstanceState, action: any): InstanceState {

  if (instanceState == null || action && action.type == ResetStore) {
    // init state
    instanceState = new InstanceState();
    instanceState.instanceCache = {};    
  }
  if (action == null || action.type == ResetStore)
    return instanceState;

  switch (action.type) {

    case INSTANCELOADED_MESSAGE:   

      instanceState.currentInstance = StateHandler.mergeInstanceToCache((<InstanceLoadedMessage>action).instance);          

      let instanceChanged = !_.isEqual(instanceState.currentInstance, instanceState.lastDispatchedInstance);
      instanceState.lastDispatchedInstance = _.cloneDeep(instanceState.currentInstance);
      
      // React cannot detect state changes in objects. Updating cacheState triggers rendering
      // -> only render if data has changed
      if (instanceChanged) {
        return update(instanceState, {
          cacheState: { $set: createId() }
        });
      } else
        return instanceState;

    case UserMessages.RemoveInstanceMessage:
      StateHandler.removeInstanceFromCache((<RemoveInstanceMessage>action).instanceId);

      return update(instanceState, {
        cacheState: { $set: createId() }
      });

    case UserMessages.NewInstanceMessage:
      let instanceId = (<NewInstanceMessage>action).instanceId;
      Notification.subscribeUpdateInstance(instanceId);
      return instanceState;

    default:
      return instanceState;
  }
}