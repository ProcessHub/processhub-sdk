import { FieldContentMap, isFieldValue, FieldValue, FieldDefinition, FieldType } from "./datainterfaces";
import { getFormattedDate } from "../tools/timing";
import { InstanceDetails } from "../instance";
import { BpmnProcess, RoleOwnerMap } from "../process";
import { Bpmn } from "../process/bpmn";

export function replaceAll(target: string, search: string, replacement: string) {
  return target.replace(new RegExp(search, "g"), replacement);
}

export function parseAndInsertStringWithFieldContent(inputString: string, fieldContentMap: FieldContentMap, process: BpmnProcess, roleOwners: RoleOwnerMap): string {
  if (inputString == null)
    return null;
  if (fieldContentMap == null)
    return inputString;

  const regex = /([{]{2}[\s]?field\.(.+?)(\s)*[}]{2})/g;
  const groupIndexForPlaceholder = 0;
  const groupIndexForIdentifier = 2;

  let match;
  while ((match = regex.exec(inputString)) !== null) {

    let fieldPlaceholder = match[groupIndexForPlaceholder];
    let fieldName = match[groupIndexForIdentifier];

    if (fieldName != null) {
      let valueObject = fieldContentMap[fieldName];

      if (isFieldValue(valueObject)) {
        if (valueObject.type == "ProcessHubDate") {
          let val = getFormattedDate(new Date(valueObject.value.toString()));
          inputString = replaceAll(inputString, fieldPlaceholder, val);
        } else {
          inputString = replaceAll(inputString, fieldPlaceholder, valueObject.value != null ? valueObject.value.toString() : "");
        }
      } else {
        inputString = replaceAll(inputString, fieldPlaceholder, valueObject != null ? valueObject.toString() : "");

      }
    }
  }

  const roleRegex = /([{]{2}[\s]?role\.(.+?)(\s)*[}]{2})/g;
  while ((match = roleRegex.exec(inputString)) !== null) {

    const placeHolder: string = match[groupIndexForPlaceholder];
    const roleName: string = match[groupIndexForIdentifier];

    if (roleName != null) {
      const lane: Bpmn.Lane = process.getLanes(process.processId(), false).find(l => l.name === roleName);
      if (lane) {
        const roleOwner = roleOwners[lane.id];
        if (roleOwner && roleOwner.length) {
          inputString = replaceAll(inputString, placeHolder, roleOwner[0].displayName);
        }
      }
    }
  }
  return inputString;
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