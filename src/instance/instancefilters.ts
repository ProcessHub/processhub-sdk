// helper functions to filter and/or sort instances
import * as PH from "../";

// instance where the user owns at least one todo
export function filterUserInstances(instances: PH.Instance.InstanceDetails[], user: PH.User.UserDetails): PH.Instance.InstanceDetails[] {
  if (!user || !instances)
    return [];

  let filteredInstances: PH.Instance.InstanceDetails[] = [];

  instances.map(instance => {
    let instanceAdded = false;
    if (instance.extras.todos && !instance.isSimulation) {
      instance.extras.todos.map(todo => {
        if (!instanceAdded && (todo.userId === user.userId))
          filteredInstances.push(instance);
      });    
    }
  });

  return filteredInstances;
}

export function filterSingleInstance(instances: PH.Instance.InstanceDetails[], instanceId: string): PH.Instance.InstanceDetails {
  if (!instances)
    return null;

  return instances.find(instance => instance.instanceId == instanceId && !instance.isSimulation);
}

// all instance for a process
export function filterInstancesForProcess(instances: PH.Instance.InstanceDetails[], processId: string): PH.Instance.InstanceDetails[] {
  if (!instances)
    return [];

  let filteredInstances: PH.Instance.InstanceDetails[] = instances.filter(instance => instance.processId == processId && !instance.isSimulation);
  return filteredInstances;
}

// all instance for workspace
export function filterInstancesForWorkspace(instances: PH.Instance.InstanceDetails[], workspaceId: string): PH.Instance.InstanceDetails[] {
  if (!instances)
    return [];

    let filteredInstances: PH.Instance.InstanceDetails[] = instances.filter(instance => instance.workspaceId == workspaceId && !instance.isSimulation);
    return filteredInstances;
}

// instances for processes in workspace that user can not see
export function filterRemainingInstancesForWorkspace(instances: PH.Instance.InstanceDetails[], workspace: PH.Workspace.WorkspaceDetails): PH.Instance.InstanceDetails[] {
  if (!instances)
    return [];

  let workspaceInstances = filterInstancesForWorkspace(instances, workspace.workspaceId);

  if (workspace.extras.processes) {
    // getOtherItems lists the todos for processes without read access - filter the others
    let filteredInstances: PH.Instance.InstanceDetails[] = []; 
    workspaceInstances.map(instance => {
      if (workspace.extras.processes.find(process => process.processId == instance.processId) == null) {
        filteredInstances.push(instance);
      }
    });
    workspaceInstances = filteredInstances;
  }

  return workspaceInstances;
}