import { RoleOwnerMap } from "../process";

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
