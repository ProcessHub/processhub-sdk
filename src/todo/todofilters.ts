// helper functions to filter and/or sort todos
import { TodoDetails } from "./todointerfaces";
import * as PH from "../";

// all todos for a process
export function filterTodosForProcess(todos: TodoDetails[], processId: string): TodoDetails[] {
  if (!todos)
    return [];

  let filteredTodos: TodoDetails[] = todos.filter(todo => todo.process.processId == processId);  
  return filteredTodos;
}

// users todos for a process
// (call uses user instead of userId so caller does not have to check for existing user in environment)
export function filterUserTodosForProcess(todos: TodoDetails[], user: PH.User.UserDetails, processId: string): TodoDetails[] {
  if (!user || !todos)
    return [];

  let filteredTodos: TodoDetails[] = todos.filter(
    todo => (todo.process.processId == processId 
    && (todo.userId == user.userId || (todo.userId == null && todo.canClaimTodo))));

  return filteredTodos;
}

// all todos for workspace
export function filterTodosForWorkspace(todos: TodoDetails[], workspaceId: string): TodoDetails[] {
  if (!todos)
    return [];

  let filteredTodos: TodoDetails[] = todos.filter(todo => todo.workspaceId == workspaceId);
  return filteredTodos;
}

// users todos for a workspace
export function filterUserTodosForWorkspace(todos: TodoDetails[], user: PH.User.UserDetails, workspaceId: string): TodoDetails[] {
  if (!user || !todos)
    return [];

  let filteredTodos: TodoDetails[] = todos.filter(
    todo => (todo.workspaceId == workspaceId 
    && (todo.userId == user.userId || (todo.userId == null && todo.canClaimTodo))));

  return filteredTodos;
}