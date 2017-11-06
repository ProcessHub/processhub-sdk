// tslint:disable:variable-name
declare module "diagram-js/lib/features/snapping" {
  import Diagram = require("diagram-js");

  interface snappingExport {
    __init__: string[];
    __depends__: Diagram.IPlugin[];
    snapping: Diagram.IType;
  }

  var _default: snappingExport;

  export = _default;
}