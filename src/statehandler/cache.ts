import { InstanceDetails } from "../instance/instanceinterfaces";
import { ProcessDetails } from "../process/processinterfaces";
import { UserDetails } from "../user/userinterfaces";
import { WorkspaceDetails } from "../workspace/workspaceinterfaces";
import { rootStore } from "./rootstore";

export function mergeUserToCache(user: UserDetails): UserDetails {
  if (user == null)
    return null;

  // UserState does not have a userCache but we need to merge into currentUser
  let tmpcache: { [userId: string]: UserDetails } = {
    [user.userId]: rootStore.getState().userState.currentUser
  };
  user = mergeElementToCache(user, tmpcache, "userId");

  // merge workspaces
  if (user.extras.workspaces) {
    let newList: WorkspaceDetails[] = [];
    user.extras.workspaces.map(workspace => {
      newList.push(mergeWorkspaceToCache(workspace));
    });
    user.extras.workspaces = newList;
  }

  // merge instances to cache
  if (user.extras.instances) {
    user.extras.instances.map(instance => {
      mergeInstanceToCache(instance, true);
    });
  }

  rootStore.getState().userState.currentUser = user;

  return user;
}

export function mergeWorkspaceToCache(workspace: WorkspaceDetails): WorkspaceDetails {
  if (workspace == null)
    return null;

  // merge main element
  let result = mergeElementToCache(workspace, rootStore.getState().workspaceState.workspaceCache, "workspaceId");

  // merge processes
  if (workspace.extras.processes) {
    let newList: ProcessDetails[] = [];
    workspace.extras.processes.map(process => {
      newList.push(mergeProcessToCache(process));
    });
    workspace.extras.processes = newList;
  }

  return result;
}

export function mergeProcessToCache(process: ProcessDetails): ProcessDetails {
  if (process == null)
    return null;

  // merge main element
  let result = mergeElementToCache(process, rootStore.getState().processState.processCache, "processId");

  // merge instances
  if (process.extras.instances) {
    let newList: InstanceDetails[] = [];
    process.extras.instances.map(instance => {
      newList.push(mergeInstanceToCache(instance));
    });
    process.extras.instances = newList;
  }

  return result;
}

export function mergeInstanceToCache(instance: InstanceDetails, ignoreUser: boolean = false): InstanceDetails {
  if (instance == null)
    return null;

  // merge main element
  let result = mergeElementToCache(instance, rootStore.getState().instanceState.instanceCache, "instanceId");

  // merge back to user.extras.instances
  if (!ignoreUser && rootStore.getState().userState.currentUser && rootStore.getState().userState.currentUser.extras.instances) { 
    let userInstances = rootStore.getState().userState.currentUser.extras.instances;
    let element = userInstances.find(ui => ui.instanceId == instance.instanceId);
    if (element) {
      userInstances.splice(userInstances.indexOf(element), 1);
    }
    userInstances.push(result);
  }
  return result;
}


export function removeInstanceFromCache(instanceId: string): void {

  let instanceCache = rootStore.getState().instanceState.instanceCache;
  if (instanceCache)
    delete (instanceCache[instanceId]);

  if (rootStore.getState().instanceState.currentInstance && rootStore.getState().instanceState.currentInstance.instanceId == instanceId)
  rootStore.getState().instanceState.currentInstance = null;
  
  // also remove from user.extras.instances
  if (rootStore.getState().userState.currentUser && rootStore.getState().userState.currentUser.extras.instances) { 
    let userInstances = rootStore.getState().userState.currentUser.extras.instances;
    let element = userInstances.find(ui => ui.instanceId == instanceId);
    if (element) {
      userInstances.splice(userInstances.indexOf(element), 1);
    }
  }
}

// stores the new elements to cache and merges included extras
export function mergeElementToCache(newElement: any, cacheElements: {[key: string]: any}, idFieldName: string): any {
  let elementId = (newElement as any)[idFieldName];
  let cacheElement = cacheElements[elementId]; 

  if (cacheElement == null) {
    // newElement not in cache
    cacheElements[elementId] = newElement;
    return newElement;
  } else {
    // merge newElement to cacheElement

    // Step 1: copy all properties except extras to cache
    for (let property in newElement) {
      if (property != "extras")
        cacheElement[property] = newElement[property];
    }

    // Step 2: remove properties from cacheElement that don't exist in newElement
    for (let property in cacheElement) {
      if (property != "extras" && newElement[property] == null)
        delete(cacheElement[property]);
    }
      
    // Step 3: copy extras to cacheElement
    for (let property in newElement.extras) {
      cacheElement.extras[property] = newElement.extras[property];
    }
    newElement.extras = cacheElement.extras;

    return cacheElement;
  }
}
