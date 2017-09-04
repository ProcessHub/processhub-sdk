import { ProcessDetails, PotentialRoleOwners } from "../process";
import { UserDetails } from "../user";
import { InstanceDetails } from "../instance";

export enum TodoStatus {
  TodoOnTime = 0,
  TodoWarning = 1,
  TodoAlert = 2
}

export enum TodoType {
  Regular = 0,
  Simulation = 1
}

export interface TodoDetails {
  todoId: string;
  userId?: string;
  processId: string;
  instanceId: string;
  status?: TodoStatus;
  urlName?: string;  // = todoId.toLowerCase()
  displayName: string;
  description: string;
  bpmnTaskId: string;
  createdAt?: Date;

  decisionTasks?: DecisionTask[]; // wird definiert, wenn der Task vor einem Exclusive Gateway ist und entschieden werden muss wohin er weiter geht

  fullUrl?: string;

  fixHoursForCreateTime?: number;

  extras: {
    // New Extras must be added to cache-handling in todoactions -> loadTodo!
    instance?: InstanceDetails;
    process?: ProcessDetails;
    user?: UserDetails;
    potentialOwners?: PotentialRoleOwners;
    canClaimTodo?: boolean;
  };

  todoType?: TodoType;
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
