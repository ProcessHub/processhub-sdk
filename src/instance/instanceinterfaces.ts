import { RoleOwnerMap } from "../process";
import { DecisionTask } from "../todo";
import { FieldContents } from "../instance";

export interface InstanceDetails {
  instanceId: string;
  processId: string;
  displayName: string;
  urlName?: string;
  fullUrl?: string;
  createdAt?: Date;
  isSimulation?: boolean;
  extras: {
    instanceState?: any;
    fieldContents?: FieldContents;
    roleOwners?: RoleOwnerMap;
  };
}

export interface FieldContents {
  [field: string]: string;
}

export interface ResumeInstanceDetails {
  instanceId: string;
  completedTodoId: string;
  // Sollte nächste Activity Exclusive Gateway sein, wird hier die Entscheidung über den SF mitgeteilt
  choosenTask?: DecisionTask;
  fieldContents?: FieldContents;
}