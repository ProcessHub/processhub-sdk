// Internal objects used by ProcessHub client and server
import * as PH from "../";

export const TodoView = {
  Show: "show",
};
export type TodoView = keyof typeof TodoView;

export class TodoState {
  requestPending: boolean;
  currentTodo?: PH.Todo.TodoDetails;
}

export enum TodoExtras {
  None = 0,
  ExtrasInstance = 1 << 0,
  ExtrasProcess = 1 << 1,
  ExtrasUser = 1 << 2, // UserDetails des zuständigen Benutzers
  ExtrasPotentialOwners = 1 << 3, // Liste der zulässigen User für diese Aufgabe
  ExtrasCanClaimTodo = 1 << 4, // Darf der angemeldete User diese Aufgabe übernehmen?
}
