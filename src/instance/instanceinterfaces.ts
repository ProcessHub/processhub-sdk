import { RoleOwnerMap } from "../process";
import { DecisionTask } from "../todo";
import { FieldMap } from "../data";
import * as PH from "../";

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
    dataFields?: FieldMap;
    roleOwners?: RoleOwnerMap;
  };
}

export interface ResumeInstanceDetails {
  instanceId: string;
  completedTodoId: string;
  // Sollte nächste Activity Exclusive Gateway sein, wird hier die Entscheidung über den SF mitgeteilt
  choosenTask?: DecisionTask;
  dataFields?: FieldMap;
}