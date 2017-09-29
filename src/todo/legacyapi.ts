import * as PH from "../";
import { BaseReply } from "../legacyapi/apirequests";

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
export interface TodoReply extends PH.LegacyApi.BaseMessage {
  errorMessage?: string;
}

export interface GetSimulationTodosRequest {
}
export interface GetSimulationTodosReply extends TodoReply {
  todos?: Array<PH.Todo.TodoDetails>;
}

export interface SetTodoPriorityRequest {
  todoId: string;
  priority: number;
}
export interface SetTodoPriorityReply extends BaseReply  {
}