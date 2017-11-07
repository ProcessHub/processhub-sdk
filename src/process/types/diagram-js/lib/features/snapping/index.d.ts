// tslint:disable:variable-name
declare module "diagram-js/lib/features/snapping" {
  import Diagram = require("diagram-js");

  interface ISnappingExport {
    __init__: string[];
    __depends__: Diagram.IPlugin[];
    snapping: Diagram.IType;
  }

  const _default: ISnappingExport;

  export = _default;
}