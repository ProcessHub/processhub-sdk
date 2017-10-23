import { FieldContentMap, isFieldValue } from "./datainterfaces";

export function parseAndInsertStringWithFieldContent(inputString: string, fieldContentMap: FieldContentMap): string {
    if (inputString == null)
      return null;
    if (fieldContentMap == null)
      return inputString;
      
    const regex = /([{]{2,}[\s]?field\.(.+?)(\s)*[}]{2,})/g;
    const groupIndexForFieldPlaceholder = 0;
    const groupIndexForFieldName = 2;
  
    let match;
    // tslint:disable-next-line:no-conditional-assignment
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