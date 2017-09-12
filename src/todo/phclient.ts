// Internal objects used by ProcessHub client and server
import * as PH from "../";
import { TodoDetails } from "./todointerfaces";

export const TodoView = {
  Show: "show",
};
export type TodoView = keyof typeof TodoView;

export class TodoState {
  requestPending: boolean;
  currentTodo?: PH.Todo.TodoDetails;

  // Todo Cache
  todo: {
    [todoId: string]: PH.Todo.TodoDetails
  };
}

export function getTodosForProcess(todos: TodoDetails[], processId: string): TodoDetails[] {
  let processTodos: TodoDetails[] = todos.filter(todo => todo.process.processId == processId);
  return processTodos;
}

export function getTodosForWorkspace(todos: TodoDetails[], workspaceId: string): TodoDetails[] {
  let workspaceTodos: TodoDetails[] = todos.filter(todo => todo.process.workspaceId == workspaceId);
  return workspaceTodos;
}