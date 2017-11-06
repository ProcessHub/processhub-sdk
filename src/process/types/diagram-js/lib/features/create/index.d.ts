// tslint:disable:variable-name
declare module "diagram-js/lib/features/create" {
  import Diagram = require("diagram-js");

  interface createExport {
    __init__: string[];
    __depends__: Diagram.IPlugin[];
  }

  var _default: createExport;

  export = _default;
}