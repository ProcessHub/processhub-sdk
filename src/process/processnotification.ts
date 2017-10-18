import * as PH from "../";

// helper functions to detect if notification symbols should be displayed in dashboard

export async function processHasBeenViewed(processEnv: PH.ProcessEnvironment): Promise<void> {
  if (processEnv.user == null)
    return;
    
  if (processEnv.user.extras.viewStates == null)
    processEnv.user.extras.viewStates = {};  // initialize

  let instances = PH.Instance.filterInstancesForProcess(processEnv.user.extras.instances, processEnv.process.processId);  
  let newDate: Date = null;
  instances.map(instance => {
    if (newDate == null || PH.Instance.latestActivityAt(instance) > newDate)
      newDate = PH.Instance.latestActivityAt(instance);
  });

  if (processEnv.user.extras.viewStates[processEnv.process.processId] == null)
    processEnv.user.extras.viewStates[processEnv.process.processId] = {};

  processEnv.user.extras.viewStates[processEnv.process.processId].lastViewedAt = newDate;
}

export async function remainingInstancesHaveBeenViewed(workspaceEnv: PH.WorkspaceEnvironment): Promise<void> {
  if (workspaceEnv.user == null)
    return;
    
  if (workspaceEnv.user.extras.viewStates == null)
    workspaceEnv.user.extras.viewStates = {};  // initialize

  let instances = PH.Instance.filterRemainingInstancesForWorkspace(workspaceEnv.user.extras.instances, workspaceEnv.workspace);  
  let newDate: Date = null;
  instances.map(instance => {
    if (newDate == null || PH.Instance.latestActivityAt(instance) > newDate)
      newDate = PH.Instance.latestActivityAt(instance);
  });

  if (workspaceEnv.user.extras.viewStates[workspaceEnv.workspace.workspaceId] == null)
    workspaceEnv.user.extras.viewStates[workspaceEnv.workspace.workspaceId] = {};

  workspaceEnv.user.extras.viewStates[workspaceEnv.workspace.workspaceId].lastViewedAt = newDate;
}

export function processLastViewedAt(processEnv: PH.ProcessEnvironment): Date {
  if (processEnv.user == null || processEnv.user.extras.viewStates == null)
    return null;

  if (processEnv.user.extras.viewStates[processEnv.process.processId] == null)
    return null;

  return processEnv.user.extras.viewStates[processEnv.process.processId].lastViewedAt;
}

export function remainingInstancesLastViewedAt(workspaceEnv: PH.WorkspaceEnvironment): Date {
  if (workspaceEnv.user == null || workspaceEnv.user.extras.viewStates == null)
    return null;

  if (workspaceEnv.user.extras.viewStates[workspaceEnv.workspace.workspaceId] == null)
    return null;

  return workspaceEnv.user.extras.viewStates[workspaceEnv.workspace.workspaceId].lastViewedAt;
}

export function notifyNewInstanceComments(processEnv: PH.ProcessEnvironment): boolean {
  let newestInstanceActivity: Date = null;

  let instances = PH.Instance.filterInstancesForProcess(processEnv.user.extras.instances, processEnv.process.processId);  
  instances.map(instance => {
    let instanceEnv: PH.InstanceEnvironment = { instance: instance, ...processEnv};
    if (newestInstanceActivity == null || PH.Instance.latestNewActivityAt(instanceEnv) > newestInstanceActivity)
      newestInstanceActivity = PH.Instance.latestNewActivityAt(instanceEnv);
  });  
  if (newestInstanceActivity == null)
    return false;

  if (processLastViewedAt(processEnv) == null)
    return true; 
  else
    return (newestInstanceActivity > processLastViewedAt(processEnv));
}

// notification for workspace-instances analog to filterRemainingInstancesForWorkspace
export function notifyNewRemainingInstanceComments(workspaceEnv: PH.WorkspaceEnvironment): boolean {
  let newestInstanceActivity: Date = null;

  let instances = PH.Instance.filterRemainingInstancesForWorkspace(workspaceEnv.user.extras.instances, workspaceEnv.workspace);  
  instances.map(instance => {
    let instanceEnv: PH.InstanceEnvironment = { instance: instance, process: null, ...workspaceEnv};
    if (newestInstanceActivity == null || PH.Instance.latestNewActivityAt(instanceEnv) > newestInstanceActivity)
      newestInstanceActivity = PH.Instance.latestNewActivityAt(instanceEnv);
  });  
  if (newestInstanceActivity == null)
    return false;

  if (remainingInstancesLastViewedAt(workspaceEnv) == null)
    return true; 
  else
    return (newestInstanceActivity > remainingInstancesLastViewedAt(workspaceEnv));
}

export function notifyNewProcessInstances(processEnv: PH.ProcessEnvironment): boolean {

  let lastView = processLastViewedAt(processEnv);

  let instances = PH.Instance.filterInstancesForProcess(processEnv.user.extras.instances, processEnv.process.processId);  
  for (let instance of instances) {
    let instanceEnv: PH.InstanceEnvironment = { instance: instance, ...processEnv};
    if (PH.Instance.notifyNewInstance(instanceEnv)) {  // otherwise instance is not relevant
      // check if instance or todos have been created since last process view
      let latestAt = instance.createdAt;      
      if (instance.extras.todos) {
        instance.extras.todos.map(todo => { 
          if (latestAt == null || todo.createdAt > latestAt)
            latestAt = todo.createdAt; 
        });
      }

      if (latestAt > lastView)
        return true;
    }   
  }

  return false;
}
