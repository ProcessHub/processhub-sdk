import * as _ from "lodash";
import * as update from "immutability-helper";
import * as StateHandler from "../statehandler";
import * as Notification from "../notification";
import { InstanceState } from "./phclient";
import { INSTANCELOADED_MESSAGE, InstanceLoadedMessage } from "./legacyapi";
import { createId } from "../tools/guid";
import { RemoveInstanceMessage, NewInstanceMessage } from "../user/legacyapi";
import { UserMessages } from "../user/phclient";
import { InstanceActionType } from "./instanceactions";
import { ResetStore } from "../statehandler/actions";
import { rootStore } from "../statehandler";
import { notifyNewInstanceComments, notifyNewInstanceTodos, notifyInstancePin } from "./instancenotification";
import { sendNotification } from "../desktopnotification";
import { InstanceDetails } from "./instanceinterfaces";
import { WorkspaceEnvironment, InstanceEnvironment } from "../environment";
import { tl } from "../tl";
import { isRoxtraEdition } from "../settings";

/**
 * Sends a desktop notification if the user should be notified and the instance was not viewed after 15 seconds 
 */
function sendNotificationIfInstanceWasNotViewed(instance: InstanceDetails) {
  setTimeout(() => {
    let workspaceEnv: WorkspaceEnvironment = {
      workspace: rootStore.getState().workspaceState.currentWorkspace,
      path: rootStore.getState().pathState.currentPath,
      user: rootStore.getState().userState.currentUser,
    };
    instance = workspaceEnv.user.extras.instances.find(i => i.instanceId === instance.instanceId);
    let instanceEnv: InstanceEnvironment = { instance, process: null, ...workspaceEnv };
    if (notifyNewInstanceComments(instanceEnv) || notifyNewInstanceTodos(instanceEnv) || notifyInstancePin(instanceEnv)) {
      sendNotification(tl("ProcessHub"), tl("Neue Benachrichtigungen"));
    }
  }, 15000);
}

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
        if (!isRoxtraEdition) {
          sendNotificationIfInstanceWasNotViewed((<InstanceLoadedMessage>action).instance);
        }

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