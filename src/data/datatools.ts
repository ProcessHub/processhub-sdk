import { FieldContentMap, isFieldValue, FieldValue, FieldDefinition, FieldType } from "./datainterfaces";

export function parseAndInsertStringWithFieldContent(inputString: string, fieldContentMap: FieldContentMap): string {
  if (inputString == null)
    return null;
  if (fieldContentMap == null)
    return inputString;
    
  const regex = /([{]{2,}[\s]?field\.(.+?)(\s)*[}]{2,})/g;
  const groupIndexForFieldPlaceholder = 0;
  const groupIndexForFieldName = 2;

  let match;
  while ((match = regex.exec(inputString)) !== null) {
    if (match.index === regex.lastIndex)
      regex.lastIndex++;

    let fieldPlaceholder = match[groupIndexForFieldPlaceholder];
    let fieldName = match[groupIndexForFieldName];

    if (fieldName != null) {
      let valueObject = fieldContentMap[fieldName];      
      if (isFieldValue(valueObject)) {
        inputString = inputString.replace(fieldPlaceholder, valueObject.value != null ? valueObject.value.toString() : "");
      } else {
        inputString = inputString.replace(fieldPlaceholder, valueObject != null ? valueObject.toString() : "");

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
    let rowNumber: number = 0;
    for (const id in properties) {
      if (typeof id === "string") {
        const property: ILegacyProperty = properties[id];
        updatedDefinitions.push({
          config: {},
          isRequired: property.required,
          name: property.title,
          rowNumber,
          type: property.customWidgetClass as FieldType,              
        });
        rowNumber++;
      }
    }   
    return updatedDefinitions;     
  } else
    return definitions as FieldDefinition[];
}