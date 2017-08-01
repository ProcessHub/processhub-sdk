import { RoleOwnerMap } from "../process";
import { DecisionTask } from "../todo";
import { FieldContents } from "../instance";
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
    fieldContents?: FieldContents;
    roleOwners?: RoleOwnerMap;
  };
}

export const FieldType = PH.Tools.strEnum([
  "String",
  "Boolean",
  "RoleOwner",
  "Url"
]);
export type FieldType = keyof typeof FieldType;

export interface FieldContent {
  type: FieldType; // TODO: sync with formgenerator-types
  data: any;
}

export interface FieldContents {
  [field: string]: FieldContent;
}

export interface ResumeInstanceDetails {
  instanceId: string;
  completedTodoId: string;
  // Sollte nächste Activity Exclusive Gateway sein, wird hier die Entscheidung über den SF mitgeteilt
  choosenTask?: DecisionTask;
  fieldContents?: FieldContents;
}