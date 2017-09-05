// Internal objects used by ProcessHub client and server
import * as PH from "../";

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

