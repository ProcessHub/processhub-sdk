// tslint:disable:variable-name
declare module "diagram-js/lib/command" {
  import Diagram = require("diagram-js");

  const __init__: string[];
  const __depends__: Diagram.IPlugin[];

  export = { __init__, __depends__ };
}