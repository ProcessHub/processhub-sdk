import * as PH from "../";

// API routes 
export const TodoRequestRoutes = {
  GetTodosForUser: "/api/todo/todosforuser",
  GetTodosForInstance: "/api/todo/todosforinstance",
  GetTodo: "/api/todo/gettodo",
  UpdateTodo: "/api/todo/updatetodo"
};
export type TodoRequestRoutes = keyof typeof TodoRequestRoutes;

export const TodoMessages = {
  TodoLoadedMessage: "TodoLoadedMessage"
};
export type TodoMessages = keyof typeof TodoMessages;

export interface TodoLoadedMessage extends PH.LegacyApi.BaseMessage {
  type: TodoMessages;
  todo?: PH.Todo.TodoDetails;
}

// API request/reply objects
export interface TodoReply extends PH.LegacyApi.BaseMessage {
  errorMessage?: string;
}

export interface GetTodosForUserRequest extends PH.LegacyApi.BaseRequest {
  userId: string;
}

export interface GetTodoRequest extends PH.LegacyApi.BaseRequest {
  todoId: string;
}

export interface GetTodosForUserReply extends TodoReply {
  todos?: Array<PH.Todo.TodoDetails>;
}

export interface GetTodosForInstanceRequest {
  instanceId: string;
  getSimulationTodos: boolean;
}

export interface GetTodosForInstanceReply extends TodoReply {
  todos?: PH.Todo.TodoDetails[];
}

export interface GetTodoReply extends TodoReply {
  todo?: PH.Todo.TodoDetails;
}

export interface UpdateTodoRequest {
  todo?: PH.Todo.TodoDetails;
}

export interface UpdateTodoReply extends TodoReply {
}