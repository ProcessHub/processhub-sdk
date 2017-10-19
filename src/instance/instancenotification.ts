import * as PH from "../";

// helper functions to detect if notification symbols should be displayed in dashboard

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

// return date only if user should be notified about activity
export function latestNewActivityAt(instanceEnv: PH.InstanceEnvironment): Date {
  if (!notifyNewInstanceComments(instanceEnv) && !notifyNewInstance(instanceEnv))
    return null;

  return latestActivityAt(instanceEnv.instance);
}

export async function instanceHasBeenViewed(instanceEnv: PH.InstanceEnvironment, actionHandler: PH.IActionHandler): Promise<void> {
  if (instanceEnv.user == null)
    return;
    
  if (instanceEnv.user.extras.viewStates == null)
    instanceEnv.user.extras.viewStates = {};  // initialize

  // we cannot use client date, this might differ from server
  // set the date to the newest value of
  // - latestCommentAt
  // - createdAt of all todos for the instance (the todo might be newer than the latest comment!)

  let newDate = latestActivityAt(instanceEnv.instance);

  if (instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId] == null)
    instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId] = {};

  instanceEnv.user.extras.viewStates[instanceEnv.instance.instanceId].lastViewedAt = newDate;
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

// is a) instance new? and b) user a roleOwner?
export function notifyNewInstance(instanceEnv: PH.InstanceEnvironment): boolean {
  // is user RoleOwner?
  if (!instanceEnv.user || !PH.Instance.isRoleOwner(instanceEnv.user.userId, null, instanceEnv.instance))
    return false;

  let lastViewedAt = instanceLastViewedAt(instanceEnv);
  if (lastViewedAt == null)
    return true;
  
  return false;    
}
