import * as PH from "../";

export interface FieldValue {
  type: string;
  value: Date | string | boolean | string[];
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
export function getFiletypeIcon(filename: string): string {
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
    case" docx":
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
    case "psd": 
    case "gif":     
    case "tif":     
      return "file image outline";        
    default:
      return "file outline";      
  }
}