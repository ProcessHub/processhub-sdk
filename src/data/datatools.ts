import { FieldContentMap, isFieldValue, FieldDefinition, FieldType, FieldValue } from "./datainterfaces";
import { getFormattedDate, getFormattedDateTime, getFormattedTimeZoneOffset } from "../tools/timing";
import { BpmnProcess, RoleOwnerMap } from "../process";
import { Bpmn } from "../process/bpmn";

export function replaceAll(target: string, search: string, replacement: string) {
  while (target.indexOf(search) >= 0) {
    target = target.replace(search, replacement);
  }
  return target;
}

function fieldValueToString(valueObject: FieldValue): string {
  if (valueObject.type === "ProcessHubDate") {
    return getFormattedDate(new Date(valueObject.value.toString()));
  } else if (valueObject.type === "ProcessHubDateTime") {
    const date: Date = new Date(valueObject.value.toString());
    return getFormattedDateTime(date) + " " + getFormattedTimeZoneOffset(date.getTimezoneOffset());
  } else {
    return valueObject.value != null ? valueObject.value.toString() : "";
  }
}

export function parseAndInsertStringWithFieldContent(inputString: string, fieldContentMap: FieldContentMap, process: BpmnProcess, roleOwners: RoleOwnerMap): string {
  if (inputString == null)
    return null;
  if (fieldContentMap == null)
    return inputString;

  const regex = /([{]{2}[\s]?field\.(.+?)(\s)*[}]{2})/g;
  const groupIndexForPlaceholder = 0;
  const groupIndexForIdentifier = 2;


  let result: string = inputString;

  let match;
  while ((match = regex.exec(inputString)) != null) {

    let fieldPlaceholder = match[groupIndexForPlaceholder];
    let fieldName = match[groupIndexForIdentifier];

    if (fieldName != null) {
      let valueObject = fieldContentMap[fieldName];

      if (isFieldValue(valueObject)) {
        const val: string = fieldValueToString(valueObject);
        result = replaceAll(result, fieldPlaceholder, val);
      } else {
        result = replaceAll(result, fieldPlaceholder, valueObject != null ? valueObject.toString() : "");

      }
    }
  }

  const roleRegex = /([{]{2}[\s]?role\.(.+?)(\s)*[}]{2})/g;
  while ((match = roleRegex.exec(inputString)) != null) {

    const placeHolder: string = match[groupIndexForPlaceholder];
    const roleName: string = match[groupIndexForIdentifier];

    if (roleName != null) {
      const lane: Bpmn.Lane = process.getLanes(false).find(l => l.name === roleName);
      if (lane) {
        const roleOwner = roleOwners[lane.id];
        if (roleOwner && roleOwner.length) {
          result = replaceAll(result, placeHolder, roleOwner[0].displayName);
        }
      }
    }
  }

  const newFieldRegex = /[{]{1}[\s]?field\[['"]?(.+?)['"]?\][\s]?[}]{1}/g;
  while ((match = newFieldRegex.exec(inputString)) != null) {
    const placeHolder: string = match[0];
    const fieldName: string = match[1];

    if (fieldName && fieldName.length) {
      const valueObject = fieldContentMap[fieldName];
      if (isFieldValue(valueObject)) {
        const val: string = fieldValueToString(valueObject);
        result = replaceAll(result, placeHolder, val);
      } else {
        result = replaceAll(result, placeHolder, valueObject != null ? valueObject.toString() : "");
      }
    }
  }

  const newRoleRegex = /[{]{1}[\s]?role\[['"]?(.+?)['"]?\][\s]?[}]{1}/g;
  while ((match = newRoleRegex.exec(inputString)) != null) {

    const placeHolder: string = match[0];
    const roleName: string = match[1];

    if (roleName && roleName.length) {
      const lane: Bpmn.Lane = process.getLanes(false).find(l => l.name === roleName);
      if (lane) {
        const roleOwner = roleOwners[lane.id];
        if (roleOwner && roleOwner.length) {
          result = replaceAll(result, placeHolder, roleOwner[0].displayName);
        }
      }
    }
  }

  return result;
}

// convert legacy FieldDefinitions in older processes to new array-based format
interface ILegacyProperty {
  customWidgetClass: string;
  required: boolean;
  title: string;
}
interface ILegacySchema {
  properties: { [id: string]: ILegacyProperty };
}
export function updateLegacyFieldDefinitions(definitions: any): FieldDefinition[] {
  if (!(definitions instanceof Array)) {
    const properties: { [id: string]: ILegacyProperty } = (definitions as ILegacySchema).properties;
    let updatedDefinitions: FieldDefinition[] = [];
    for (const id in properties) {
      if (typeof id === "string") {
        const property: ILegacyProperty = properties[id];
        updatedDefinitions.push({
          config: {},
          isRequired: property.required,
          name: property.title,
          type: property.customWidgetClass as FieldType,
        });
      }
    }
    return updatedDefinitions;
  } else
    return definitions as FieldDefinition[];
}