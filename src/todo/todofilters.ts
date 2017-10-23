// helper functions to filter and/or sort todos
import { TodoDetails, TodoType } from "./todointerfaces";
import { InstanceDetails } from "../instance/instanceinterfaces";
import { UserDetails } from "../user/index";
import { filterInstancesForProcess, filterRemainingInstancesForWorkspace } from "../instance/instancefilters";
import { WorkspaceDetails } from "../workspace/workspaceinterfaces";

// temporary solution during switch from todo.instance -> instances.todos
export function getTodosFromInstances(instances: InstanceDetails[]): TodoDetails[] {
  let todos: TodoDetails[] = [];

  instances.map(instance => {
    if (instance.extras.todos) {
      instance.extras.todos.map(todo => todos.push(todo));
    }
  });

  return todos;
}

// todos the user owns or can claim
export function filterUserTodos(todos: TodoDetails[], user: UserDetails): TodoDetails[] {
  if (!user || !todos)
    return [];

  let filteredTodos: TodoDetails[] = todos.filter(
    todo => (todo.todoType !== TodoType.Simulation) && (todo.userId === user.userId));

  return filteredTodos;
}

// all todos for an instance
export function filterTodosForInstance(instances: InstanceDetails[], instanceId: string): TodoDetails[] {
  if (!instances)
    return [];

    let todos = getTodosFromInstances(instances);
    
  let filteredTodos: TodoDetails[] = todos.filter(todo => todo.instanceId == instanceId);
  return filteredTodos;
}

// all todos for a process
export function filterTodosForProcess(instances: InstanceDetails[], processId: string): TodoDetails[] {
  if (!instances)
    return [];

  let filteredInstances = filterInstancesForProcess(instances, processId);
    
  let filteredTodos = getTodosFromInstances(filteredInstances);
  return filteredTodos;
}

// all todos for workspace
export function filterTodosForWorkspace(instances: InstanceDetails[], workspaceId: string): TodoDetails[] {
  if (!instances)
    return [];
    
  let todos = getTodosFromInstances(instances);
  
  let filteredTodos: TodoDetails[] = todos.filter(todo => todo.workspaceId == workspaceId);
  return filteredTodos;
}

// todos for processes in workspace that user can not see
export function filterRemainingTodosForWorkspace(instances: InstanceDetails[], workspace: WorkspaceDetails): TodoDetails[] {
  if (!instances)
    return [];

  let filteredInstances = filterRemainingInstancesForWorkspace(instances, workspace);

  let workspaceTodos = getTodosFromInstances(filteredInstances);
  return workspaceTodos;
}