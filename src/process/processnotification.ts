import * as PH from "../";

// helper functions to detect if notification symbols should be displayed in dashboard

export function notifyNewInstanceComments(processEnv: PH.ProcessEnvironment): boolean {
  let instances = PH.Instance.filterInstancesForProcess(processEnv.user.extras.instances, processEnv.process.processId);  
  let notify = false;

  instances.map(instance => {
    let instanceEnv: PH.InstanceEnvironment = { instance: instance, ...processEnv};
    if (PH.Instance.notifyNewInstanceComments(instanceEnv))
      notify = true;
  });  

  return notify;
}

export function notifyNewProcessTodos(processEnv: PH.ProcessEnvironment): boolean {

  let instances = PH.Instance.filterInstancesForProcess(processEnv.user.extras.instances, processEnv.process.processId);  
  let notify = false;
  
  instances.map(instance => {
    let instanceEnv: PH.InstanceEnvironment = { instance: instance, ...processEnv};
    if (PH.Instance.notifyNewInstanceTodos(instanceEnv))
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
    let instanceEnv: PH.InstanceEnvironment = { instance: instance, process: null, ...workspaceEnv};
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
    let instanceEnv: PH.InstanceEnvironment = { instance: instance, process: null, ...workspaceEnv};
    if (PH.Instance.notifyNewInstanceTodos(instanceEnv))
      notify = true;
  });  

  return notify;
}