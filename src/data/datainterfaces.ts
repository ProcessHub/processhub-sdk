import * as PH from "../";

export const FieldType = PH.Tools.strEnum([
  "String",
  "Boolean",
  "RoleOwner",
  "Url"
]);
export type FieldType = keyof typeof FieldType;

export interface Field {
  type: FieldType; 
  displayName?: string;
  config?: any;
  data?: any;
}

export interface FieldMap {
  [field: string]: Field;
}