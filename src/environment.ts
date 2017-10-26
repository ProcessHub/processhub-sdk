import { PathDetails } from "./path/pathinterfaces";
import { UserDetails } from "./user/userinterfaces";
import { WorkspaceDetails } from "./workspace/workspaceinterfaces";
import { ProcessDetails } from "./process/processinterfaces";
import { InstanceDetails } from "./instance/instanceinterfaces";
import { TodoDetails } from "./todo/todointerfaces";

export interface CoreEnvironment {
  path: PathDetails;
  user: UserDetails;
}

export interface WorkspaceEnvironment extends CoreEnvironment {
  workspace: WorkspaceDetails;
}

export interface ProcessEnvironment extends CoreEnvironment {
  workspace: WorkspaceDetails;  
  process: ProcessDetails;
}

export interface InstanceEnvironment extends CoreEnvironment {
  workspace: WorkspaceDetails;  
  process: ProcessDetails;
  instance: InstanceDetails;
}

export interface TodoEnvironment extends CoreEnvironment {
  workspace: WorkspaceDetails;  
  process: ProcessDetails;
  instance: InstanceDetails;
  todo: TodoDetails;
}

export function isValidCoreEnvironment(coreEnv: CoreEnvironment, requireUser: boolean = true): boolean {
  if (coreEnv == null)
    return false;
    
  if (!requireUser)
    return true;
  else
    return coreEnv.user != null;
}
export function isValidWorkspaceEnvironment(workspaceEnv: WorkspaceEnvironment, requireUser: boolean = true): boolean {
  return isValidCoreEnvironment(workspaceEnv, requireUser) && workspaceEnv.workspace != null;
}
export function isValidProcessEnvironment(processEnv: ProcessEnvironment, requireUser: boolean = true): boolean {
  return isValidWorkspaceEnvironment(processEnv, requireUser) && processEnv.process != null;
}
export function isValidInstanceEnvironment(instanceEnv: InstanceEnvironment, requireUser: boolean = true): boolean {
  return isValidProcessEnvironment(instanceEnv, requireUser) && instanceEnv.instance != null;
}
export function isValidTodoEnvironment(todoEnv: TodoEnvironment, requireUser: boolean = true): boolean {
  return isValidProcessEnvironment(todoEnv, requireUser) && todoEnv.todo != null;
}