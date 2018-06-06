import * as PH from "../";
import _ = require("lodash");

// helper functions to detect if notification symbols should be displayed in dashboard

export function notifyNewInstanceComments(processEnv: PH.ProcessEnvironment): boolean {
  let instances = PH.Instance.filterInstancesForProcess(processEnv.user.extras.instances, processEnv.process.processId);
  let notify = false;

  instances.map(instance => {
    if (instance.extras.todos && instance.extras.todos.length > 0) {  // no todos = no dashboard entry
      let instanceEnv: PH.InstanceEnvironment = { instance: instance, ...processEnv };
      if (PH.Instance.notifyNewInstanceComments(instanceEnv))
        notify = true;
    }
  });

  return notify;
}

export async function processHasBeenViewed(processEnv: PH.ProcessEnvironment, actionHandler: PH.ActionHandler): Promise<void> {
  if (!processEnv || !processEnv.process || !processEnv.user) {
    return;
  }

  if (processEnv.user.extras.viewStates == null) {
    processEnv.user.extras.viewStates = {};  // initialize
  }

  let oldViewState = _.cloneDeep(processEnv.user.extras.viewStates[processEnv.process.processId]);

  let newDate = processEnv.process.latestCommentAt;

  if (processEnv.user.extras.viewStates[processEnv.process.processId] == null) {
    processEnv.user.extras.viewStates[processEnv.process.processId] = {};
  }

  processEnv.user.extras.viewStates[processEnv.process.processId].lastViewedAt = newDate;

  // actionHandler causes rerender - only call if viewState was changed
  if (!_.isEqual(oldViewState, processEnv.user.extras.viewStates[processEnv.process.processId])) {
    await actionHandler.updateViewState(processEnv.process.processId, processEnv.user.extras.viewStates[processEnv.process.processId]);
  }
}

export function notifyNewProcessComments(processEnv: PH.ProcessEnvironment): boolean {
  if (!processEnv || !processEnv.process || !processEnv.user) {
    return false;
  }

  if (processEnv.process.latestCommentAt == null) {
    return false;
  }

  let lastViewedAt = processLastViewedAt(processEnv);
  if (lastViewedAt == null) {
    return true;  // latestCommentAt != null, so there are new comments
  }

  return (processEnv.process.latestCommentAt > lastViewedAt);
}

export function processLastViewedAt(processEnv: PH.ProcessEnvironment): Date {
  if (!processEnv || !processEnv.process || !processEnv.user) {
    return null;
  }

  if (processEnv.user.extras.viewStates == null) {
    return null;
  }

  if (processEnv.user.extras.viewStates[processEnv.process.processId] == null) {
    return null;
  }

  return processEnv.user.extras.viewStates[processEnv.process.processId].lastViewedAt;
}

export function notifyNewProcessTodos(processEnv: PH.ProcessEnvironment): boolean {

  let instances = PH.Instance.filterInstancesForProcess(processEnv.user.extras.instances, processEnv.process.processId);
  let notify = false;

  instances.map(instance => {
    let instanceEnv: PH.InstanceEnvironment = { instance: instance, ...processEnv };
    if (PH.Instance.notifyNewInstanceTodos(instanceEnv) || PH.Instance.notifyInstancePin(instanceEnv))
      notify = true;
  });

  return notify;
}

// notification for workspace-instances analog to filterRemainingInstancesForWorkspace
export function notifyNewRemainingInstanceComments(workspaceEnv: PH.WorkspaceEnvironment): boolean {
  let newestInstanceActivity: Date = null;

  let instances = PH.Instance.filterRemainingInstancesForWorkspace(workspaceEnv.user.extras.instances, workspaceEnv.workspace);
  let notify = false;

  instances.map(instance => {
    let instanceEnv: PH.InstanceEnvironment = { instance: instance, process: null, ...workspaceEnv };
    if (PH.Instance.notifyNewInstanceComments(instanceEnv))
      notify = true;
  });

  return notify;
}

// notification for workspace-instances analog to filterRemainingInstancesForWorkspace
export function notifyNewRemainingInstanceTodos(workspaceEnv: PH.WorkspaceEnvironment): boolean {
  let newestInstanceActivity: Date = null;

  let instances = PH.Instance.filterRemainingInstancesForWorkspace(workspaceEnv.user.extras.instances, workspaceEnv.workspace);
  let notify = false;

  instances.map(instance => {
    let instanceEnv: PH.InstanceEnvironment = { instance: instance, process: null, ...workspaceEnv };
    if (PH.Instance.notifyNewInstanceTodos(instanceEnv))
      notify = true;
  });

  return notify;
}

// count the number of instances that are currently notifying new todos and/or new comments
export function countNotifyingInstances(processEnv: PH.ProcessEnvironment): number {
  let count: number = 0;

  let instances = PH.Instance.filterInstancesForProcess(processEnv.user.extras.instances, processEnv.process.processId);

  instances.map(instance => {
    if (instance.extras.todos && instance.extras.todos.length > 0) {  // no todos = no dashboard entry
      let instanceEnv: PH.InstanceEnvironment = { instance: instance, ...processEnv };
      if (PH.Instance.notifyNewInstanceComments(instanceEnv) || PH.Instance.notifyNewInstanceTodos(instanceEnv))
        count++;
    }
  });

  return count;
}