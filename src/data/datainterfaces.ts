import { InstanceEnvironment } from "../environment";
import { BpmnProcess } from "../process";
import { InstanceDetails } from "../instance/instanceinterfaces";
import { SemanticICONS } from "semantic-ui-react";
import { UserDetails } from "../user";

export interface FieldDefinition {
  name: string;
  type: FieldType;
  isRequired: boolean;
  config: {};
}

export interface FieldDefinitionItem {
  bpmnTaskId: string;
  isStartEvent: boolean;
  fieldDefinition: FieldDefinition;
}

export interface TaskIdRequiredFieldsNeeded {
  taskId: string;
  requiredFieldsNeeded: boolean;
}

export interface IRoxFileFieldValue {
  url: string;
  lockedAt: Date;
  lockedByUserName: string;
  lockedByUserId: string;
}

export interface ISignatureFieldValue {
  svgDataUrl: string;
  dataPoints: {};
}

export interface FieldValue {
  type: FieldType;
  value:
  Date | // Date
  string | // TextInput, TextArea, RoleOwner
  boolean | // Checkbox
  string[] | // FileUpload
  IRoxFileFieldValue | // RoxFile
  ISignatureFieldValue | // Signature
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
  | "ProcessHubDecision"
  | "ProcessHubRoxFile"
  | "ProcessHubSignature"
  | "ProcessHubLabel";

export interface IFieldType {
  getType(): FieldType;
  getName(): string;
  getInput(props: IFormElementProps, instanceEnv: InstanceEnvironment, bpmnProcess: BpmnProcess, onFieldValueChanged: () => void, showInvalidFields: boolean, startEventId?: string): JSX.Element;
  renderValue(value: {}, instance: InstanceDetails): JSX.Element;
  renderValueForEmail(value: {}, instance: InstanceDetails): JSX.Element;
  getSettingsButton(fieldDefinition: FieldDefinition, onConfigChanged: (fieldDefinition: FieldDefinition) => void): JSX.Element;
  isVisible(): boolean;
  isValid(fieldDefinition: FieldDefinition, instanceEnv: InstanceEnvironment): boolean;
  isConfigValid(fieldDefinition: FieldDefinition): { valid: boolean, message?: string };
}

export interface IFormElementProps {
  value: string | boolean | Date | string[] | IRoxFileFieldValue | ISignatureFieldValue | {
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
    case "docx":
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


/* interfaces for statistics */
export enum StatisticsAction {
  // process
  processCreated = 1,
  processEdited = 2,
  processDeleted = 3,

  // instance
  instanceStarted = 10,
  instanceAborted = 11,
  instanceIncomingMail = 12,
  instanceOutgoingMail = 13,
  instanceJumped = 14,

  // todo
  todoCreated = 20,
  todoCompleted = 21,
  todoUpdated = 22,
  todoExecuted = 23,
  todoWithDecision = 24,
  todoDeleted = 25,

  // user
  userComment = 30,
}

export interface StatisticTrailEntry {
  todo?: { todoId?: string, bpmnTaskId: string, bpmnLaneId: string, desicionTaskBpmnTaskId?: string, timeOverDueDate?: number };
  instance?: { instanceId: string; jumpToBpmnTask?: string };
  user?: { instanceId: string; };
  process?: {};
}

export interface StatisticRow {
  statisticsId: string;
  workspaceId: string;
  processId: string;
  details: StatisticTrailEntry;
  action: StatisticsAction;
  userDetails: UserDetails;
  userId: string;
  createdAt: Date;
}

export interface IHeatmapDatapoint {
  bpmnElementId: string;
  value: number;
}