import { InstanceDetails } from "./instance/instanceinterfaces";
import { PathDetails } from "./path/pathinterfaces";
import { ProcessDetails } from "./process/processinterfaces";
import { TodoDetails } from "./todo/todointerfaces";
import { UserDetails } from "./user/userinterfaces";
import { WorkspaceDetails } from "./workspace/workspaceinterfaces";

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