import { TodoDetails, TodoType } from "./todointerfaces";
import * as PH from "../";

export function latestActivityAt(todo: PH.Todo.TodoDetails): Date {
  if (todo.instance.latestCommentAt != null && todo.instance.latestCommentAt > todo.createdAt)
    return todo.instance.latestCommentAt;
  else  
    return todo.createdAt;
}