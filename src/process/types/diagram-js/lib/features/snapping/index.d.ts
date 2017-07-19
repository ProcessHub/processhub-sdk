// tslint:disable:variable-name
declare module "diagram-js/lib/features/snapping" {
  import Diagram = require("diagram-js");

  const __init__: string[];
  const __depends__: Diagram.IPlugin[];
  const snapping: Diagram.IType;

  export = { __init__, __depends__, snapping };
}