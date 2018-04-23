import { BaseReply, BaseMessage } from "../legacyapi/apiinterfaces";
import { TodoDetails } from "./todointerfaces";

// API routes
export const TodoRequestRoutes = {
  GetSimulationTodos: "/api/todo/simulationtodos",
  SetPriority: "/api/todo/setpriority",
  DeleteNotificationTodo: "/api/todo/deletenotificationtodo",
  UpdateTodo: "/api/todo/UpdateTodo"
};
export type TodoRequestRoutes = keyof typeof TodoRequestRoutes;

export const TodoMessages = {
  TodoSimulationLoadedMessage: "TodoSimulationLoadedMessage",
};
export type TodoMessages = keyof typeof TodoMessages;

// API request/reply objects
export interface TodoReply extends BaseMessage {
  errorMessage?: string;
}

export interface GetSimulationTodosRequest {
  workspaceId: string;
  instanceId: string;
}
export interface GetSimulationTodosReply extends TodoReply {
  todos?: Array<TodoDetails>;
}

export interface UpdateTodoRequest {
  workspaceId: string;
  todoId: string;
  dueAt: Date;
}
export interface UpdateTodoReply extends BaseReply  {
}

export interface SetTodoPriorityRequest {
  workspaceId: string;
  todoId: string;
  priority: number;
}
export interface SetTodoPriorityReply extends BaseReply  {
}

export interface DeleteNotificationTodoRequest {
  workspaceId: string;
  todoId: string;
}
export interface DeleteNotificationTodoReply extends BaseReply  {
}