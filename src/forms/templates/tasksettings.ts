import * as PH from "../../";
import { FormSchema } from "../formgeneratorclass";

export namespace TaskSettings {
  export interface TaskSettingsTemplate extends FormSchema {
    properties: {
      "description": any
    };
  }

  export const Schema: TaskSettingsTemplate = {
    title: "TaskSettingsFormTemplate",
    type: "object",
    required: [],
    properties: {      
      "description": { type: "string", title: PH.tl("Description"), default: "" },
      // "jumpRadio": { type: "string", title: PH.tl("Jumps..."), enum: [PH.tl("...to all steps allowed except"), PH.tl("...only allowed to"), PH.tl("...not allowed")], enumNames: [Process.TASKSETTINGS_JUMPSETTING_ALLEXCEPT, Process.TASKSETTINGS_JUMPSETTING_ONLYSELECTED, Process.TASKSETTINGS_JUMPSETTING_NOJUMPS] },
      // "jumpToTasks": { type: "string", title: "" }
    }
  };

  export const UiScheme = {
    "jumpRadio": {
      "ui:widget": "radio",
      "ui:options": {
        "inline": true
      }
    }
  };
}