import * as PH from "../";
import * as _ from "lodash";

// helper functions to detect if notification symbols should be displayed in dashboard

// latest activity (todo/comment created) - shown in dashboard cards
export function latestActivityAt(instance: PH.Instance.InstanceDetails): Date {
  let latestAt = instance.latestCommentAt;
  if (latestAt == null)
    latestAt = instance.createdAt;

  if (instance.extras.todos) {
    instance.extras.todos.map(todo => { 
      if (latestAt == null || todo.createdAt > latestAt)
        latestAt = todo.createdAt; 
    });
  }

  return latestAt;
}

export async function instanceHasBeenViewed(instanceEnv: PH.InstanceEnvironment, actionHandler: PH.IActionHandler): Promise<void> {
  if (instanceEnv == null || instanceEnv.user == null)
    return;
    
  if (instanceEnv.user.extras.viewStates == null)
    instanceEnv.user.extras.viewStates = {};  // initialize

  let oldViewState = _.cloneDeep(instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId]);

  // we cannot use client date, this might differ from server
  // set the date to the newest value of
  // - latestCommentAt
  // - createdAt of all todos for the instance (the todo might be newer than the latest comment!)

  let newDate = latestActivityAt(instanceEnv.instance);

  if (instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId] == null)
    instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId] = {};

  instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId].lastViewedAt = newDate;

  // actionHandler causes rerender - only call if viewState was changed
  if (!_.isEqual(oldViewState, instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId]))
    await actionHandler.updateViewState(instanceEnv.instance.instanceId, instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId]);
}

export function instanceLastViewedAt(instanceEnv: PH.InstanceEnvironment): Date {
  if (instanceEnv.user == null || instanceEnv.user.extras.viewStates == null)
    return null;

  if (instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId] == null)
    return null;

  return instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId].lastViewedAt;
}

export function hasInstanceComments(instanceEnv: PH.InstanceEnvironment): boolean {
  return (instanceEnv.instance.latestCommentAt != null);
}

// true if there are a) new comments and b) user is a roleOwner - otherwise there should be no notification symbol
export function notifyNewInstanceComments(instanceEnv: PH.InstanceEnvironment): boolean {
  // is user RoleOwner?
  if (!instanceEnv.user || !PH.Instance.isRoleOwner(instanceEnv.user.userId, null, instanceEnv.instance))
    return false;

  if (instanceEnv.instance.latestCommentAt == null)
    return false;

  let lastViewedAt = instanceLastViewedAt(instanceEnv);
  if (lastViewedAt == null)
    return true;  // latestCommentAt != null, so there are new comments

  return (instanceEnv.instance.latestCommentAt > lastViewedAt);
}

// true if a todo for the current user has been created since last viewing the instance
export function notifyNewInstanceTodos(instanceEnv: PH.InstanceEnvironment): boolean {
  if (!instanceEnv.instance.extras.todos)
    return false;

  // detect the date of the latest todo for the user
  let latestAt: Date = null;
  instanceEnv.instance.extras.todos.map(todo => { 
    if (todo.userId == instanceEnv.user.userId && (latestAt == null || todo.createdAt > latestAt))
      latestAt = todo.createdAt; 
  });
  if (latestAt == null)
    return false;  // no todos for user

  let lastViewedAt = instanceLastViewedAt(instanceEnv);
  if (lastViewedAt == null)
    return true;  // latestCommentAt != null, so there are new comments

  return (latestAt > lastViewedAt);
}
