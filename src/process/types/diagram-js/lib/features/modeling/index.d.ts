// tslint:disable:variable-name
declare module "diagram-js/lib/features/modeling" {
  import Diagram = require("diagram-js");

  interface IModelingExport {
    __init__: string[];
    __depends__: Diagram.IPlugin[];
  }

  const _default: IModelingExport;

  export = _default;
}