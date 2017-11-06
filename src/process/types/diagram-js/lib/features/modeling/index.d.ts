// tslint:disable:variable-name
declare module "diagram-js/lib/features/modeling" {
  import Diagram = require("diagram-js");

  interface modelingExport {
    __init__: string[];
    __depends__: Diagram.IPlugin[];
  }

  var _default: modelingExport;

  export = _default;
}