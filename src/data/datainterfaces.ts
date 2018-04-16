import { InstanceEnvironment } from "../environment";
import { BpmnProcess } from "../process";
import { InstanceDetails } from "../instance/instanceinterfaces";
import { SemanticICONS } from "semantic-ui-react";

export interface FieldDefinition {
  rowNumber: number;
  name: string;
  type: FieldType;
  isRequired: boolean;
  config: {};
}

export interface TaskIdRequiredFieldsNeeded {
  taskId: string;
  requiredFieldsNeeded: boolean;
}

export interface FieldValue {
  type: string;
  value:
    Date | // Date
    string | // TextInput, TextArea
    boolean | // Checkbox
    string[] | // FileUpload
    { [key: string]: boolean }; // Checklist
}

export type FieldType = "ProcessHubTextInput"
  | "ProcessHubTextArea"
  | "ProcessHubInstanceTitle"  
  | "ProcessHubCheckbox"
  | "ProcessHubFileUpload"
  | "ProcessHubRoleOwner"
  | "ProcessHubDate"
  | "ProcessHubDropdown"
  | "ProcessHubChecklist"
  | "ProcessHubDecision";

export interface IFieldType {
  getType(): FieldType;
  getName(): string;
  getInput(props: IFormElementProps, instanceEnv: InstanceEnvironment, bpmnProcess: BpmnProcess, onFieldValueChanged: () => void): JSX.Element;
  renderValue(value: {}, instance: InstanceDetails): JSX.Element;
  renderValueForEmail(value: {}, instance: InstanceDetails): JSX.Element;
  getSettingsButton(config: {}, onConfigChanged: (config: {}) => void): JSX.Element;
  isVisible(): boolean;
  isValid(fieldDefinition: FieldDefinition, instanceEnv: InstanceEnvironment): boolean;
}

export interface IFormElementProps {
  value: string | boolean | Date | string[] | {
    [key: string]: boolean;
  };
  label: string;
  required: boolean;
  disabled: boolean;
  config: {};
  key?: string;
}


/**
 * Check if an element implements the FieldValue interface
 * @param element element to check
 * @return {boolean} true, if element implements the FieldValue interface, false otherwise
 */
export function isFieldValue(element: {}): element is FieldValue {
  return element
    && (element as FieldValue).type !== undefined
    && typeof (element as FieldValue).type === "string";
}

export interface FieldContentMap {
  [fieldId: string]: string | boolean | FieldValue;
}

// returns the name of the best fitting Semantic UI icon for the specified file name
export function getFiletypeIcon(filename: string): SemanticICONS {
  if (filename == null || filename.length == 0)
    return "file outline";

  let extension = filename.split(".").last().toLowerCase();

  switch (extension) {
    case "pdf":
      return "file pdf outline";
    case "xls":
    case "xlsx":
      return "file excel outline";
    case "doc":
    case " docx":
      return "file word outline";
    case "ppt":
    case "pptx":
      return "file powerpoint outline";
    case "zip":
    case "tar.gz":
      return "file archive outline";
    case "txt":
      return "file text outline";
    case "jpg":
    case "png":
    case "gif":
    case "svg":
      return "file image outline";
    default:
      return "file outline";
  }
}