import * as PH from "./";

export interface IActionHandler { 
  // Load Page "/@workspace/..."
  gotoPage(path: string): void;

  requireWorkspaceExtras(extras: PH.Workspace.WorkspaceExtras, forceReload?: boolean): void;
  requireProcessExtras(extras: PH.Process.ProcessExtras, forceReload?: boolean): void;
  requireInstanceExtras(extras: PH.Instance.InstanceExtras, forceReload?: boolean): void;
  requireTodoExtras(extras: PH.Todo.TodoExtras, forceReload?: boolean): void;
  requireUserExtras(extras: PH.User.UserExtras, forceReload?: boolean): void;

  openInstancePopup(instanceId: string, todoId?: string): void;
}
