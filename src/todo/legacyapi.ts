import * as PH from "../";

// API routes 
export const TodoRequestRoutes = {
  GetSimulationTodos: "/api/todo/simulationtodos",
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
