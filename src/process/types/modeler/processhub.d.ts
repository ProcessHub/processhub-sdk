// tslint:disable:no-empty-interface
// tslint:disable:interface-name
declare module "modeler/bpmn/processhub" {
  import Base = require("moddle/lib/base");

  namespace Processhub {

    export interface AsyncCapable {
      asyncBefore: boolean;
      asyncAfter: boolean;
    }

    export interface Assignable {
      readonly $type: "processhub:Assignable";
      assignee: string;
    }

    export interface Calling {
      readonly $type: "processhub:Calling";
      calledElementBinding: string;
      calledElementVersion: number;
    }

    export interface ServiceTaskLike {
      readonly $type: "processhub:ServiceTaskLike";
      expression: string;
      javaDelegate: string;
      delegateExpression: string;
    }

    export interface Connector extends Element {
      readonly $type: "processhub:Connector";
      inputOutput: InputOutput;
      connectorId: string;
    }

    export interface InputOutput extends Base {
      readonly $type: "processhub:InputOutput";
      inputOutput: InputOutput;
      connectorId: string;
      inputParameters: InputParameter[];
      outputParameters: OutputParameter[];
    }

    export interface InputOutputParameter extends Base {
      readonly $type: "processhub:InputOutputParameter" | "processhub:InputParameter" | "processhub:OutputParameter";
      name: string;
      value: string;
      definition: InputOutputParameterDefinition;
    }

    export interface InputOutputParameterDefinition {

    }

    export interface List extends InputOutputParameterDefinition {
      readonly $type: "processhub:List";
      items: InputOutputParameterDefinition[];
    }

    export interface Map extends InputOutputParameterDefinition {
      readonly $type: "processhub:Map";
      entries: Entry[];
    }

    export interface Entry {
      readonly $type: "processhub:Entry";
      key: string;
      value: InputOutputParameterDefinition;
    }

    export interface Value extends InputOutputParameterDefinition {
      readonly $type: "processhub:Value";
      value: string;
    }

    export interface Script extends InputOutputParameterDefinition {
      readonly $type: "processhub:Script";
      scriptLanguage: string;
      source: string;
    }

    export interface InputParameter extends InputOutputParameter {
      readonly $type: "processhub:InputParameter";
    }

    export interface OutputParameter extends InputOutputParameter {
      readonly $type: "processhub:OutputParameter";
    }
    
  }
}