// tslint:disable:variable-name
declare module "diagram-js-direct-editing" {
  import Diagram = require("diagram-js");

  interface IDiagramJsDirectEditingExport {
    __init__: string[];
    __depends__: Diagram.IPlugin[];
  }

  const _default: IDiagramJsDirectEditingExport;

  export = _default;
}