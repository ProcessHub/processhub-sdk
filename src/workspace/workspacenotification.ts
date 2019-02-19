import * as PH from "../";

// any new notifications for the workspace?
export function notifyNewWorkspaceTodosOrComments(workspaceEnv: PH.WorkspaceEnvironment): boolean {
  if (!workspaceEnv.user || !workspaceEnv.workspace)
    return false;
    
  let instances = PH.Instance.filterInstancesForWorkspace(workspaceEnv.user.extras.instances, workspaceEnv.workspace.workspaceId);  
  let notify = false;
  
  instances.map(instance => {
    let instanceEnv: PH.InstanceEnvironment = { instance: instance, process: null, ...workspaceEnv};
    if (PH.Instance.notifyNewInstanceComments(instanceEnv) || PH.Instance.notifyNewInstanceTodos(instanceEnv) || PH.Instance.notifyInstancePin(instanceEnv))
      notify = true;
  });  

  return notify;  
}