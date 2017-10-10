// helper functions to filter and/or sort todos
import { TodoDetails } from "./todointerfaces";
import * as PH from "../";

// todos the user owns or can claim
export function filterUserTodos(todos: TodoDetails[], user: PH.User.UserDetails): TodoDetails[] {
  if (!user || !todos)
  return [];

  let filteredTodos: TodoDetails[] = todos.filter(
    todo => (todo.userId == user.userId));

  return filteredTodos;
}

// all todos for an instance
export function filterTodosForInstance(todos: TodoDetails[], instanceId: string): TodoDetails[] {
  if (!todos)
    return [];

  let filteredTodos: TodoDetails[] = todos.filter(todo => todo.instance.instanceId == instanceId);  
  return filteredTodos;
}

// all todos for a process
export function filterTodosForProcess(todos: TodoDetails[], processId: string): TodoDetails[] {
  if (!todos)
    return [];

  let filteredTodos: TodoDetails[] = todos.filter(todo => todo.processId == processId);  
  return filteredTodos;
}

// all todos for workspace
export function filterTodosForWorkspace(todos: TodoDetails[], workspaceId: string): TodoDetails[] {
  if (!todos)
    return [];

  let filteredTodos: TodoDetails[] = todos.filter(todo => todo.workspaceId == workspaceId);  
  return filteredTodos;
}

// todos for processes in workspace that user can not see
export function filterRemainingTodosForWorkspace(todos: TodoDetails[], workspace: PH.Workspace.WorkspaceDetails): TodoDetails[] {
  if (!todos)
    return [];

  let workspaceTodos = filterTodosForWorkspace(todos, workspace.workspaceId);

  if (workspace.extras.processes) {
    // getOtherItems lists the todos for processes without read access - filter the others
    let filteredTodos: PH.Todo.TodoDetails[] = [];
    workspaceTodos.map(todo => {
      if (workspace.extras.processes.find(process => process.processId == todo.instance.processId) == null)
      filteredTodos.push(todo);
    });
    workspaceTodos = filteredTodos;
  }

  return workspaceTodos;
}