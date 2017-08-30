import { RoleOwnerMap } from "../process";
import { DecisionTask } from "../todo";
import { FieldContentMap } from "../data";
import * as PH from "../";

export enum State {
  Running = 1,
  Finished = 2,
  Canceled = 3,
}

export interface InstanceDetails {
  instanceId: string;
  processId: string;
  displayName: string;
  urlName?: string;
  fullUrl?: string;
  createdAt?: Date;
  isSimulation?: boolean;
  sendSimulationMails?: boolean;
  state: State;
  extras: {
    instanceState?: any;
    fieldContents?: FieldContentMap;
    roleOwners?: RoleOwnerMap;
  };
}

export interface ResumeInstanceDetails {
  instanceId: string;
  completedTodoId: string;
  // Sollte nächste Activity Exclusive Gateway sein, wird hier die Entscheidung über den SF mitgeteilt
  choosenTask?: DecisionTask;
  fieldContents?: FieldContentMap;
}