declare module "diagram-js/lib/core/ElementFactory" {

  import { IPoint } from "diagram-js";
  import { Base, Shape } from "diagram-js/lib/model";

  /**
   * A factory for diagram-js shapes
   */
  export default class ElementFactory {
    constructor();

    public createRoot(attrs: ElementFactory.ICreationAttrs): {};
    public createLabel(attrs: ElementFactory.ICreationAttrs): {};
    public createShape(attrs: ElementFactory.ICreationAttrs): Shape;
    public createConnection(attrs: ElementFactory.ICreationAttrs): {};

    /**
     * Create a model element with the given type and
     * a number of pre-set attributes.
     *
     * @param  {String} type
     * @param  {Object} attrs
     * @return {djs.model.Base} the newly created model instance
     */
    public create(type: "shape" | "connection" | "label", attrs: ElementFactory.ICreationAttrs): Base;
  }

  namespace ElementFactory {

    export interface ICreationAttrs {
      businessObject?: Object;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      id?: string;
      waypoints?: IPoint[];
    }
  }
}