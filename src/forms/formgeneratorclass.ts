"use strict";
import * as PH from "../";
import * as Templates from "./templates";

export interface FormSchema {
  title: string;
  type: string;
  required: string[];
  properties: any;
}

interface PropertyStash {
  id: string;
  propertyObject: PropertyObject[];
}

export enum FormTemplate {
  TaskSettings
}

export const FormGeneratorFieldTypes = {
  String: "ProcessHubTextInput",
  Textarea: "ProcessHubTextArea",
  Checkbox: "ProcessHubCheckbox",
  FileUpload: "ProcessHubFileUpload"
};
export type FormGeneratorFieldTypes = keyof typeof FormGeneratorFieldTypes;

export interface FormGeneratorFieldTypesSelect {
  text: string;
  value: FormGeneratorFieldTypes;
}

export interface PropertyObject {
  type: string;
  title: string;
  default?: string;
  customWidgetClass: FormGeneratorFieldTypes;
  required: boolean;
}

export class FormGeneratorClass {

  public static getPossibleFieldTypes(): FormGeneratorFieldTypesSelect[] {
    return [
      { text: "Text", value: FormGeneratorFieldTypes.String as FormGeneratorFieldTypes },
      { text: "Textarea", value: FormGeneratorFieldTypes.Textarea as FormGeneratorFieldTypes },
      { text: "Checkbox", value: FormGeneratorFieldTypes.Checkbox as FormGeneratorFieldTypes },
      { text: "Anhang", value: FormGeneratorFieldTypes.FileUpload as FormGeneratorFieldTypes },
    ];
  }

  // Attributes
  private schemaObject: any;
  private schemaUiObject: any = {};
  private propertiesStash: PropertyStash[];

  constructor(formTitle: string = null) {
    this.propertiesStash = [];

    // Hier werden default Werte gesetzt!
    this.schemaObject = {
      title: formTitle,
      type: "object",
      required: [],
      properties: {}
    };
  }

  public loadTemplate(templateType: FormTemplate): void {
    switch (templateType) {
      case FormTemplate.TaskSettings: {
        let tmpTitle: string = this.schemaObject.title;
        this.schemaObject = Templates.TaskSettings.Schema;
        this.schemaObject.title = tmpTitle;
        this.schemaUiObject = Templates.TaskSettings.UiScheme;
      }
      default:
        return;
    }
  }

  public getSchemaObject(): FormSchema {
    return this.schemaObject;
  }
  public getSchemaString(): string {
    return JSON.stringify(this.getSchemaObject());
  }
  public setSchemaJsonString(jsonStr: string): void {
    if (jsonStr != null) {

      this.schemaObject = JSON.parse(jsonStr);
      let keys = Object.keys(this.schemaObject.properties);
      for (let i = 0; i < keys.length; i++) {
        let propStash: PropertyStash = {
          id: keys[i],
          propertyObject: this.schemaObject.properties[keys[i]]
        };
        this.propertiesStash[i] = propStash;
      }
    }
  }

  public getSchemaUiObject(): FormSchema {
    return this.schemaUiObject;
  }

  public addStringField(rowNumber: number, title: string, defaultValue: any, isRequired: boolean): void {
    let propObj: PropertyObject = { type: "string", title: title, default: defaultValue, customWidgetClass: FormGeneratorFieldTypes.String as FormGeneratorFieldTypes, required: isRequired };
    this.addField(rowNumber, "string", propObj);
  }

  public addTextAreaField(rowNumber: number, title: string, defaultValue: any, isRequired: boolean): void {
    let propObj: PropertyObject = { type: "string", title: title, default: defaultValue, customWidgetClass: FormGeneratorFieldTypes.Textarea as FormGeneratorFieldTypes, required: isRequired };
    this.addField(rowNumber, "string", propObj);
  }

  public addCheckboxField(rowNumber: number, title: string, defaultValue: any, isRequired: boolean): void {
    let propObj: PropertyObject = { type: "string", title: title, customWidgetClass: FormGeneratorFieldTypes.Checkbox as FormGeneratorFieldTypes, required: isRequired };
    this.addField(rowNumber, "string", propObj);
  }

  public addFileUploadField(rowNumber: number, title: string, defaultValue: string, isRequired: boolean): void {
    let propObj: PropertyObject = { type: "string", title: title, customWidgetClass: FormGeneratorFieldTypes.FileUpload as FormGeneratorFieldTypes, required: isRequired };
    this.addField(rowNumber, "string", propObj);
  }

  public removeField(rowNumber: number): void {
    this.propertiesStash.splice(rowNumber, 1);
    this.fillStashInProperties();
  }

  public moveItemDownInObject(rowNumber: number) {
    let old = this.propertiesStash[rowNumber];
    this.propertiesStash[rowNumber] = this.propertiesStash[rowNumber + 1];
    this.propertiesStash[rowNumber + 1] = old;

    this.fillStashInProperties();
  }

  public addDateField(rowNumber: number, type: string, title: string, defaultValue: any): void {
    let propObj: any = { type: "string", title: title, format: "date", default: defaultValue, customWidgetClass: "ProcessHubDate" };
    this.addField(rowNumber, type, propObj);
  }

  private addField(rowNumber: number, type: string, propObj: any): void {
    let id: string;
    if (this.propertiesStash[rowNumber] != null) {
      id = this.propertiesStash[rowNumber].id;
    } else {
      id = type + "_" + PH.Tools.createId();
    }

    let propStash: PropertyStash = {
      id: id,
      propertyObject: propObj
    };
    this.propertiesStash[rowNumber] = propStash;

    this.fillStashInProperties();
  }

  private fillStashInProperties() {
    delete this.schemaObject.properties;
    this.schemaObject["properties"] = {};
    for (let prop of this.propertiesStash) {
      this.schemaObject.properties[prop.id] = prop.propertyObject;
    }
  }

  public getFormDataFromUserInput(prevInput: PH.Instance.FieldContents): any {
    return prevInput;
  }
}
