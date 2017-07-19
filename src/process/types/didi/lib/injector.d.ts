declare module "didi/lib/injector" {
  export = Injector;

  import Module = require("didi/lib/module");

  class Injector {
    public constructor(modules: Module[], parent?: Injector);

    /**
     * Return a named service.
     *
     * @param {String} name
     * @param {Boolean} [strict=true] if false, resolve missing services to null
     *
     * @return {Object}
     */
    public get(name: string, strict?: boolean): Object;

    public invoke(fn: Function, context: Object): void;
  }
}