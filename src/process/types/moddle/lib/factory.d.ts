// tslint:disable:max-classes-per-file
declare module "moddle/lib/factory" {
  export = Factory;
  import Base = require("moddle/lib/base");

  class Factory {
    public constructor(model: Object, properties: Object);
    public createType(descriptor: Object): Factory.ModddleElementConstructor;
  }

  namespace Factory {
    class ModddleElement extends Base {
      public $type: string;
      public $attrs: Object;

      constructor(attrs: Object);
    }

    type ModddleElementConstructor = new (attrs: Object) => ModddleElement;
  }
}
