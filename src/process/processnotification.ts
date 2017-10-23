import { InstanceEnvironment, WorkspaceEnvironment } from "../environment";
import { ProcessEnvironment } from "../index";
import { filterInstancesForProcess, filterRemainingInstancesForWorkspace } from "../instance/instancefilters";
import { notifyNewInstanceTodos } from "../instance/instancenotification";


// helper functions to detect if notification symbols should be displayed in dashboard

export function notifyNewInstanceComments(processEnv: ProcessEnvironment): boolean {
  let instances = filterInstancesForProcess(processEnv.user.extras.instances, processEnv.process.processId);  
  let notify = false;

  instances.map(instance => {
    let instanceEnv: InstanceEnvironment = { instance: instance, ...processEnv};
    if (notifyNewInstanceComments(instanceEnv))
      notify = true;
  });  

  return notify;
}

export function notifyNewProcessTodos(processEnv: ProcessEnvironment): boolean {

  let instances = filterInstancesForProcess(processEnv.user.extras.instances, processEnv.process.processId);  
  let notify = false;
  
  instances.map(instance => {
    let instanceEnv: InstanceEnvironment = { instance: instance, ...processEnv};
    if (notifyNewInstanceTodos(instanceEnv))
      notify = true;
  });  

  return notify;  
}

// notification for workspace-instances analog to filterRemainingInstancesForWorkspace
export function notifyNewRemainingInstanceComments(workspaceEnv: WorkspaceEnvironment): boolean {

  let instances = filterRemainingInstancesForWorkspace(workspaceEnv.user.extras.instances, workspaceEnv.workspace);  
  let notify = false;

  instances.map(instance => {
    let instanceEnv: InstanceEnvironment = { instance: instance, process: null, ...workspaceEnv};
    if (notifyNewInstanceComments(instanceEnv))
      notify = true;
  });  

  return notify;
}

// notification for workspace-instances analog to filterRemainingInstancesForWorkspace
export function notifyNewRemainingInstanceTodos(workspaceEnv: WorkspaceEnvironment): boolean {

  let instances = filterRemainingInstancesForWorkspace(workspaceEnv.user.extras.instances, workspaceEnv.workspace);  
  let notify = false;

  instances.map(instance => {
    let instanceEnv: InstanceEnvironment = { instance: instance, process: null, ...workspaceEnv};
    if (notifyNewInstanceTodos(instanceEnv))
      notify = true;
  });  

  return notify;
}