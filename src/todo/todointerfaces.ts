import { UserDetails } from "../user";

export enum TodoStatus {
  TodoOnTime = 0,
  TodoOverdue = 2
}

export enum TodoType {
  Regular = 0,
  Simulation = 1
}

export interface TodoDetails {
  todoId: string;
  todoType?: TodoType;
  userId?: string;
  workspaceId: string;  
  instanceId: string;
  status?: TodoStatus;
  displayName: string;
  description: string;
  bpmnTaskId: string;
  bpmnLaneId: string;  
  createdAt?: Date;
  user?: UserDetails;
  priority?: number;
}

export const DecisionTaskTypes = {
  Normal: "normal",
  Boundary: "boundary"
};
export type DecisionTaskTypes = keyof typeof DecisionTaskTypes;

export interface DecisionTask {
  bpmnTaskId: string;
  name: string;
  type: DecisionTaskTypes;
  isBoundaryEvent: boolean;
  boundaryEventType?: string;
  // routeStack?: string[];
}
