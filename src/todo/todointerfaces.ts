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
  workspaceId: string;
  processId: string;  
  instanceId: string;
  status?: TodoStatus;
  displayName: string;
  description: string;
  bpmnTaskId: string;
  bpmnLaneId: string;  
  createdAt?: Date;
  user?: UserDetails;
  priority?: number;
  isPinned?: boolean;
}
export const gqlTodoTypes = `     
  type TodoDetails {
    todoId: String!
    todoType: Int
    userId: String
    workspaceId: String!
    processId: String  
    instanceId: String
    status: Int
    displayName: String
    description: String
    bpmnTaskId: String
    bpmnLaneId: String  
    createdAt: Date
    priority: Int
    isPinned: Boolean
  }

  input TodoUpdateDetails {
    todoId: String!
    todoType: Int
    userId: String
    workspaceId: String!
    processId: String  
    instanceId: String
    status: Int
    displayName: String
    description: String
    bpmnTaskId: String
    bpmnLaneId: String  
    createdAt: Date
    priority: Int
    isPinned: Boolean
  }
`;

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
