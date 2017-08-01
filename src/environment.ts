import * as PH from "./";

export interface CoreEnvironment {
  actionHandler: PH.IActionHandler;
  user: PH.User.UserDetails;
}

export interface WorkspaceEnvironment extends CoreEnvironment {
  workspace: PH.Workspace.WorkspaceDetails;
}

export interface ProcessEnvironment extends CoreEnvironment {
  workspace: PH.Workspace.WorkspaceDetails;  
  process: PH.Process.ProcessDetails;
}

export interface InstanceEnvironment extends CoreEnvironment {
  workspace: PH.Workspace.WorkspaceDetails;  
  process: PH.Process.ProcessDetails;
  instance: PH.Instance.InstanceDetails;
}

export interface TodoEnvironment extends CoreEnvironment {
  workspace: PH.Workspace.WorkspaceDetails;  
  process: PH.Process.ProcessDetails;
  instance: PH.Instance.InstanceDetails;
  todo: PH.Todo.TodoDetails;
}