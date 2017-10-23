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