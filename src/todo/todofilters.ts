// helper functions to filter and/or sort todos
import { TodoDetails, TodoType } from "./todointerfaces";
import * as PH from "../";

// temporary solution during switch from todo.instance -> instances.todos
export function getTodosFromInstances(instances: PH.Instance.InstanceDetails[]): TodoDetails[] {
  let todos: TodoDetails[] = [];

  instances.map(instance => {
    if (instance.extras.todos) {
      instance.extras.todos.map(todo => todos.push(todo));
    }
  });

  return todos;
}

// todos the user owns or can claim
export function filterUserTodos(todos: PH.Todo.TodoDetails[], user: PH.User.UserDetails): TodoDetails[] {
  if (!user || !todos)
    return [];

  let filteredTodos: TodoDetails[] = todos.filter(
    todo => (todo.todoType !== TodoType.Simulation) && (todo.userId === user.userId));

  return filteredTodos;
}

// all todos for an instance
export function filterTodosForInstance(instances: PH.Instance.InstanceDetails[], instanceId: string): TodoDetails[] {
  if (!instances)
    return [];

    let todos = getTodosFromInstances(instances);
    
  let filteredTodos: TodoDetails[] = todos.filter(todo => todo.instanceId == instanceId);
  return filteredTodos;
}

// all todos for a process
export function filterTodosForProcess(instances: PH.Instance.InstanceDetails[], processId: string): TodoDetails[] {
  if (!instances)
    return [];

  let todos = getTodosFromInstances(instances);
    
  let filteredTodos: TodoDetails[] = todos.filter(todo => todo.processId == processId);
  return filteredTodos;
}

// all todos for workspace
export function filterTodosForWorkspace(instances: PH.Instance.InstanceDetails[], workspaceId: string): TodoDetails[] {
  if (!instances)
    return [];

  let todos = getTodosFromInstances(instances);
  
  let filteredTodos: TodoDetails[] = todos.filter(todo => todo.workspaceId == workspaceId);
  return filteredTodos;
}

// todos for processes in workspace that user can not see
export function filterRemainingTodosForWorkspace(instances: PH.Instance.InstanceDetails[], workspace: PH.Workspace.WorkspaceDetails): TodoDetails[] {
  if (!instances)
    return [];

  let workspaceTodos = filterTodosForWorkspace(instances, workspace.workspaceId);

  if (workspace.extras.processes) {
    // getOtherItems lists the todos for processes without read access - filter the others
    let filteredTodos: PH.Todo.TodoDetails[] = [];
    workspaceTodos.map(todo => {
      if (todo.todoType !== TodoType.Simulation
        && (workspace.extras.processes.find(process => process.processId == todo.processId) == null)) {
        filteredTodos.push(todo);
      }
    });
    workspaceTodos = filteredTodos;
  }

  return workspaceTodos;
}