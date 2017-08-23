import * as PH from "../";

export interface FieldValue {
  type: string;
  value: Date | string | boolean;
}

/**
 * Check if an element implements the FieldValue interface
 * @param element element to check
 * @return {boolean} true, if element implements the FieldValue interface, false otherwise
 */
export function isFieldValue(element: {}): element is FieldValue {
  return element
    && (element as FieldValue).type !== undefined    
    && typeof (element as FieldValue).type === "string"
    && (element as FieldValue).value !== undefined;
}


export interface FieldContentMap {
  [fieldId: string]: string | boolean | FieldValue;
}