import { ProcessDetails, PotentialRoleOwners } from "../process";
import { UserDetails } from "../user";
import { InstanceDetails } from "../instance";

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
  workspaceId?: string;  
  processId?: string;
  status?: TodoStatus;
  fullUrl?: string; // = /i/instanceid/todoid
  displayName: string;
  description: string;
  bpmnTaskId: string;
  bpmnLaneId: string;  
  createdAt?: Date;
  instance?: InstanceDetails;
  user?: UserDetails;
  potentialOwners?: PotentialRoleOwners;
  priority?: number;
  
/*  extras: {
    // New Extras must be added to cache-handling in todoactions -> loadTodo!
    instance?: InstanceDetails;
    user?: UserDetails;
    potentialOwners?: PotentialRoleOwners;
    canClaimTodo?: boolean;
  };*/
}

export enum TodoExtras {
  None = 0,
  ExtrasInstance = 1 << 0,
  ExtrasProcess = 1 << 1,
  ExtrasUser = 1 << 2, // UserDetails des zuständigen Benutzers
  ExtrasPotentialOwners = 1 << 3 // Liste der zulässigen User für diese Aufgabe
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
