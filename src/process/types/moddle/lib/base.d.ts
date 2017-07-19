declare module "moddle/lib/base" {
  export = Base;

  import Moddle = require("moddle/lib/moddle");

  class Base {
    public expressionLanguage: string;
    public typeLanguage: string;
    public $descriptor: Base.ITypeDescriptor;
    public $model: Moddle;
    public $type: string;
    public $children?: Base[];
    public $body?: string;
    public name?: string;

    public $instanceOf(element: {}, type: {}): boolean;
    public get(name: string): Object;
    public set(name: string, value: Object): void;
  }

  namespace Base {
    export interface ITypeDescriptor {
      $pkg: Object;
      allTypes: ITypeDescriptor[];
      idProperty: IPropertyDescriptor;
      name: string;
      ns: INamespaceDescriptor;
      properties: IPropertyDescriptor[];
      propertiesByName: { [name: string]: IPropertyDescriptor };
    }

    export interface IPropertyDescriptor {
      definedBy: ITypeDescriptor;
      inherited: boolean;
      isAttr: boolean;
      name: string;
      ns: INamespaceDescriptor;
      type: string;
      isMany?: boolean;
    }

    export interface INamespaceDescriptor {

    }
  }
}