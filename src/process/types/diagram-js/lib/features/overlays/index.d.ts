// tslint:disable:variable-name
declare module "diagram-js/lib/features/overlays" {
  import Diagram = require("diagram-js");

  const __init__: string[];
  const __depends__: Diagram.IPlugin[];
  const overlays: Diagram.IType;

  export = { __init__, __depends__, overlays };
}