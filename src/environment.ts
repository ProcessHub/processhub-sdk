import * as PH from "../";

export interface CoreEnvironment {
  actionHandler: PH.IActionHandler;
  currentUser: PH.User.UserDetails;
}

export interface WorkspaceEnvironment extends CoreEnvironment {
  currentWorkspace: PH.Workspace.WorkspaceDetails;
}

export interface ProcessEnvironment extends CoreEnvironment {
  currentWorkspace: PH.Workspace.WorkspaceDetails;  
  currentProcess: PH.Process.ProcessDetails;
}

export interface InstanceEnvironment extends CoreEnvironment {
  currentWorkspace: PH.Workspace.WorkspaceDetails;  
  currentProcess: PH.Process.ProcessDetails;
  currentInstance: PH.Instance.InstanceDetails;
}

export interface TodoEnvironment extends CoreEnvironment {
  currentWorkspace: PH.Workspace.WorkspaceDetails;  
  currentProcess: PH.Process.ProcessDetails;
  currentInstance: PH.Instance.InstanceDetails;
  currentTodo: PH.Todo.TodoDetails;
}