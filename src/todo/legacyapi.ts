import { BaseReply, BaseMessage } from "../legacyapi/apiinterfaces";
import { TodoDetails } from "./todointerfaces";

// API routes
export const TodoRequestRoutes = {
  GetSimulationTodos: "/api/todo/simulationtodos",
  SetPriority: "/api/todo/setpriority",
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
}
export interface GetSimulationTodosReply extends TodoReply {
  todos?: Array<TodoDetails>;
}

export interface SetTodoPriorityRequest {
  workspaceId: string;
  todoId: string;
  priority: number;
}
export interface SetTodoPriorityReply extends BaseReply  {
}