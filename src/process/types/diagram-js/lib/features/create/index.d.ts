// tslint:disable:variable-name
declare module "diagram-js/lib/features/create" {
  import Diagram = require("diagram-js");

  interface ICreateExport {
    __init__: string[];
    __depends__: Diagram.IPlugin[];
  }

  const _default: ICreateExport;

  export = _default;
}